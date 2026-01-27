/**
 * Script para pre-generar datos de películas desde Trakt API
 * Ejecutar con: node scripts/fetch-movies.js
 * 
 * Requiere variables de entorno:
 * - TRAKT_CLIENT_ID
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env si existe
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
}

const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID;

if (!TRAKT_CLIENT_ID) {
    console.error('ERROR: TRAKT_CLIENT_ID no está definido en las variables de entorno');
    console.error('Asegúrate de tener un archivo .env con TRAKT_CLIENT_ID=tu_client_id');
    process.exit(1);
}

const traktHeaders = {
    "Content-Type": "application/json",
    "trakt-api-key": TRAKT_CLIENT_ID,
    "trakt-api-version": "2",
};

const CACHE_DIR = path.join(__dirname, '..', 'src', 'data', 'cache');
const MOVIES_CACHE_FILE = path.join(CACHE_DIR, 'movies.json');

// Helper para delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch con retry y manejo de rate limiting
async function fetchWithRetry(url, retries = 5, delayMs = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, { headers: traktHeaders });
            
            if (response.status === 429) {
                const waitTime = delayMs * Math.pow(2, i);
                console.log(`  Rate limited, esperando ${waitTime}ms...`);
                await delay(waitTime);
                continue;
            }
            
            if (!response.ok) {
                console.log(`  Error ${response.status} para ${url}`);
                return null;
            }
            
            return response;
        } catch (e) {
            console.log(`  Error de red (intento ${i + 1}/${retries}): ${e.message}`);
            if (i === retries - 1) return null;
            await delay(delayMs);
        }
    }
    return null;
}

// Obtener cast y crew de una película
async function getMoviePeople(traktId) {
    const response = await fetchWithRetry(
        `https://api.trakt.tv/movies/${traktId}/people`
    );

    if (!response) return { cast: [], crew: { directing: [] } };

    const people = await response.json();
    return people;
}

// Extraer top N actores del cast con sus personajes
function extractActors(people, limit = 8) {
    if (!people?.cast || !Array.isArray(people.cast)) return [];
    return people.cast
        .slice(0, limit)
        .map(item => ({
            name: item.person?.name,
            character: item.character || item.characters?.[0] || null
        }))
        .filter(item => item.name);
}

// Extraer director del crew
function extractDirector(people) {
    if (!people?.crew?.directing || !Array.isArray(people.crew.directing)) return null;
    const director = people.crew.directing.find(item => item.job === 'Director');
    return director?.person?.name || people.crew.directing[0]?.person?.name || null;
}

// Obtener todos los ratings del usuario
async function getUserRatings() {
    console.log('Obteniendo ratings del usuario...');
    const response = await fetchWithRetry(
        `https://api.trakt.tv/users/auferoz/ratings/movies`
    );

    if (!response) return {};

    const ratings = await response.json();
    const ratingsMap = {};
    ratings.forEach(item => {
        ratingsMap[item.movie.ids.trakt] = item.rating;
    });
    console.log(`  ${Object.keys(ratingsMap).length} ratings obtenidos`);
    return ratingsMap;
}

// Función principal
async function fetchAllMovies() {
    const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
    const allMovies = [];
    const moviesByYear = {};

    console.log('='.repeat(50));
    console.log('Iniciando fetch de películas desde Trakt API');
    console.log('='.repeat(50));

    // Obtener ratings primero
    const userRatings = await getUserRatings();
    await delay(500);

    // Obtener películas por año
    for (const year of years) {
        console.log(`\nObteniendo películas del ${year}...`);
        
        const response = await fetchWithRetry(
            `https://api.trakt.tv/users/auferoz/lists/movies-${year}/items/movies?extended=full,images&sort_how=desc`
        );

        if (!response) {
            console.log(`  No se pudo obtener la lista del ${year}`);
            moviesByYear[year] = [];
            continue;
        }

        const movies = await response.json();
        console.log(`  ${movies.length} películas encontradas`);
        moviesByYear[year] = movies;
        
        await delay(300);
    }

    // Obtener people para cada película
    console.log('\n' + '='.repeat(50));
    console.log('Obteniendo información de cast y crew...');
    console.log('='.repeat(50));

    let totalMovies = 0;
    let processedMovies = 0;

    // Contar total
    for (const year of years) {
        totalMovies += moviesByYear[year].length;
    }

    for (const year of years) {
        const movies = moviesByYear[year];
        
        for (let i = 0; i < movies.length; i++) {
            const item = movies[i];
            processedMovies++;
            
            console.log(`[${processedMovies}/${totalMovies}] ${item.movie.title} (${year})`);
            
            // Delay entre requests
            if (i > 0 || year !== years[0]) {
                await delay(600);
            }

            const people = await getMoviePeople(item.movie.ids.trakt);
            const traktId = item.movie.ids.trakt;
            const userRating = userRatings[traktId] || null;

            allMovies.push({
                ...item,
                year_watched: year,
                user_rating: userRating,
                movie: {
                    ...item.movie,
                    user_rating: userRating,
                    actors: extractActors(people, 8),
                    director: extractDirector(people)
                }
            });
        }
    }

    // Guardar en archivo JSON
    console.log('\n' + '='.repeat(50));
    console.log('Guardando datos en caché...');
    console.log('='.repeat(50));

    // Asegurar que el directorio existe
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const cacheData = {
        lastUpdated: new Date().toISOString(),
        totalMovies: allMovies.length,
        movies: allMovies
    };

    fs.writeFileSync(MOVIES_CACHE_FILE, JSON.stringify(cacheData, null, 2));
    
    console.log(`\nCache guardado en: ${MOVIES_CACHE_FILE}`);
    console.log(`Total de películas: ${allMovies.length}`);
    console.log('='.repeat(50));
}

// Ejecutar
fetchAllMovies().catch(console.error);
