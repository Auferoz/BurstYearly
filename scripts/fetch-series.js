/**
 * Script para pre-generar datos de series desde Trakt API
 * Ejecutar con: node scripts/fetch-series.js
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
const SERIES_CACHE_FILE = path.join(CACHE_DIR, 'series.json');

// Importar la lista de series desde el archivo de datos
import { pathToFileURL } from 'url';
const seriesSeasonsPath = pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'seriesSeasons.js')).href;

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

// Obtener cast y crew de una serie
async function getShowPeople(traktId) {
    const response = await fetchWithRetry(
        `https://api.trakt.tv/shows/${traktId}/people`
    );

    if (!response) return { cast: [], crew: {} };

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

// Extraer creador/director del crew
function extractDirector(people) {
    if (!people?.crew) return null;
    
    if (people.crew.directing && Array.isArray(people.crew.directing)) {
        const director = people.crew.directing.find(item => item.job === 'Director');
        if (director?.person?.name) return director.person.name;
    }
    
    if (people.crew['created by'] && Array.isArray(people.crew['created by'])) {
        if (people.crew['created by'][0]?.person?.name) {
            return people.crew['created by'][0].person.name;
        }
    }
    
    if (people.crew.production && Array.isArray(people.crew.production)) {
        const creator = people.crew.production.find(item => 
            item.job === 'Executive Producer' || item.job === 'Creator'
        );
        if (creator?.person?.name) return creator.person.name;
    }
    
    return null;
}

// Función principal
async function fetchAllSeries() {
    console.log('='.repeat(50));
    console.log('Iniciando fetch de series desde Trakt API');
    console.log('='.repeat(50));

    // Importar dinámicamente la lista de series
    const { ListSeriesSeasons } = await import(seriesSeasonsPath);
    
    console.log(`\nTotal de entradas en la lista: ${ListSeriesSeasons.length}`);

    const allSeries = [];
    const seriesListAll = [];
    
    // Cache de shows para no repetir llamadas
    const showCache = {};
    const peopleCache = {};

    // Obtener lista general de series (para ListAll)
    console.log('\nObteniendo lista general de series...');
    const listAllResponse = await fetchWithRetry(
        `https://api.trakt.tv/users/auferoz/lists/tv-shows-animes/items/shows?extended=full,images`
    );
    
    if (listAllResponse) {
        const listAllData = await listAllResponse.json();
        seriesListAll.push(...listAllData);
        console.log(`  ${listAllData.length} series en la lista general`);
    }
    await delay(500);

    // Procesar cada entrada de series/temporadas
    console.log('\n' + '='.repeat(50));
    console.log('Obteniendo información detallada de temporadas...');
    console.log('='.repeat(50));

    for (let i = 0; i < ListSeriesSeasons.length; i++) {
        const item = ListSeriesSeasons[i];
        console.log(`\n[${i + 1}/${ListSeriesSeasons.length}] ${item.idTrakt} - Temporada ${item.numberSeason}`);

        // Delay entre requests
        if (i > 0) {
            await delay(600);
        }

        // Obtener info de la temporada
        const seasonResponse = await fetchWithRetry(
            `https://api.trakt.tv/shows/${item.idTrakt}/seasons/${item.numberSeason}/info?extended=full,images`
        );

        if (!seasonResponse) {
            console.log(`  Error obteniendo temporada, saltando...`);
            continue;
        }

        const seasonData = await seasonResponse.json();
        await delay(300);

        // Obtener info del show (usar cache si ya lo tenemos)
        let showData = showCache[item.idTrakt];
        if (!showData) {
            const showResponse = await fetchWithRetry(
                `https://api.trakt.tv/shows/${item.idTrakt}?extended=full,images`
            );

            if (!showResponse) {
                console.log(`  Error obteniendo show info, saltando...`);
                continue;
            }

            showData = await showResponse.json();
            showCache[item.idTrakt] = showData;
            await delay(300);
        } else {
            console.log(`  (show info desde cache)`);
        }

        // Obtener people (usar cache si ya lo tenemos)
        let people = peopleCache[item.idTrakt];
        if (!people) {
            people = await getShowPeople(item.idTrakt);
            peopleCache[item.idTrakt] = people;
        } else {
            console.log(`  (people desde cache)`);
        }

        allSeries.push({
            season: seasonData,
            show: {
                ...showData,
                actors: extractActors(people, 8),
                director: extractDirector(people)
            },
            yearViewed: item.yearViewed,
            numberSeason: item.numberSeason,
            platformViewed: item.platformViewed,
            statusViewed: item.statusViewed,
            idTrakt: item.idTrakt
        });
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
        totalSeasons: allSeries.length,
        seriesSeasons: allSeries,
        seriesListAll: seriesListAll
    };

    fs.writeFileSync(SERIES_CACHE_FILE, JSON.stringify(cacheData, null, 2));
    
    console.log(`\nCache guardado en: ${SERIES_CACHE_FILE}`);
    console.log(`Total de temporadas: ${allSeries.length}`);
    console.log(`Series en lista general: ${seriesListAll.length}`);
    console.log('='.repeat(50));
}

// Ejecutar
fetchAllSeries().catch(console.error);
