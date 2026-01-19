const TRAKT_CLIENT_ID = import.meta.env.TRAKT_CLIENT_ID;

const traktHeaders = {
    "Content-Type": "application/json",
    "trakt-api-key": TRAKT_CLIENT_ID,
    "trakt-api-version": "2",
};

// Helper para hacer requests con delay y evitar rate limiting
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch con retry y manejo de rate limiting
async function fetchWithRetry(url, options = {}, retries = 3, delayMs = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, { ...options, headers: traktHeaders });
            
            if (response.status === 429) {
                // Rate limited - esperar más tiempo
                const waitTime = delayMs * Math.pow(2, i); // Exponential backoff
                console.log(`Rate limited, waiting ${waitTime}ms before retry...`);
                await delay(waitTime);
                continue;
            }
            
            return response;
        } catch (e) {
            if (i === retries - 1) throw e;
            await delay(delayMs);
        }
    }
    return null;
}

// Obtener cast y crew de una película
async function getMoviePeople(traktId) {
    try {
        const response = await fetchWithRetry(
            `https://api.trakt.tv/movies/${traktId}/people`
        );

        if (!response || !response.ok) return { cast: [], crew: { directing: [] } };

        const people = await response.json();
        return people;
    } catch (e) {
        console.error(`Error fetching people for movie ${traktId}:`, e);
        return { cast: [], crew: { directing: [] } };
    }
}

// Extraer top N actores del cast
function extractActors(people, limit = 5) {
    if (!people?.cast || !Array.isArray(people.cast)) return [];
    return people.cast
        .slice(0, limit)
        .map(item => item.person?.name)
        .filter(Boolean);
}

// Extraer director del crew
function extractDirector(people) {
    if (!people?.crew?.directing || !Array.isArray(people.crew.directing)) return null;
    const director = people.crew.directing.find(item => item.job === 'Director');
    return director?.person?.name || people.crew.directing[0]?.person?.name || null;
}

// Procesar requests secuencialmente con delay
async function fetchPeopleSequentially(items, delayMs = 500) {
    const results = [];
    for (let i = 0; i < items.length; i++) {
        if (i > 0) await delay(delayMs);
        const people = await getMoviePeople(items[i].movie.ids.trakt);
        results.push(people);
    }
    return results;
}

// Obtener todos los ratings del usuario
async function getUserRatings() {
    try {
        const response = await fetch(
            `https://api.trakt.tv/users/auferoz/ratings/movies`,
            { headers: traktHeaders }
        );

        if (!response.ok) return {};

        const ratings = await response.json();
        // Crear un mapa de trakt_id -> rating para búsqueda rápida
        const ratingsMap = {};
        ratings.forEach(item => {
            ratingsMap[item.movie.ids.trakt] = item.rating;
        });
        return ratingsMap;
    } catch (e) {
        console.error('Error fetching user ratings:', e);
        return {};
    }
}

export async function getAllMovies() {
    const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
    let allMovies = [];
    let error = null;

    try {
        const userRatings = await getUserRatings();

        // Obtener listas de películas secuencialmente para evitar rate limiting
        const results = [];
        for (const year of years) {
            await delay(300);
            const response = await fetchWithRetry(
                `https://api.trakt.tv/users/auferoz/lists/movies-${year}/items/movies?extended=full,images&sort_how=desc`
            );
            if (response && response.ok) {
                results.push(await response.json());
            } else {
                results.push([]);
            }
        }

        // Recopilar todas las películas primero
        const allMoviesRaw = [];
        results.forEach((movies, index) => {
            const year = years[index];
            movies.forEach(item => {
                allMoviesRaw.push({ item, year });
            });
        });

        // Obtener people secuencialmente para evitar rate limiting
        const peopleResults = await fetchPeopleSequentially(
            allMoviesRaw.map(({ item }) => ({ movie: item.movie })),
            500
        );

        // Combinar datos
        allMoviesRaw.forEach(({ item, year }, index) => {
            const traktId = item.movie.ids.trakt;
            const userRating = userRatings[traktId] || null;
            const people = peopleResults[index];
            
            allMovies.push({
                ...item,
                year_watched: year,
                user_rating: userRating,
                movie: {
                    ...item.movie,
                    user_rating: userRating,
                    actors: extractActors(people, 5),
                    director: extractDirector(people)
                }
            });
        });

    } catch (e) {
        error = e.message;
        console.error('Fetch error:', e);
    }

    return { movies: allMovies, error };
}

export async function getMoviesByYear(year) {
    let movies = [];
    let error = null;

    try {
        console.log('TRAKT_CLIENT_ID exists:', !!TRAKT_CLIENT_ID);

        // Obtener ratings primero
        const userRatings = await getUserRatings();
        await delay(300);

        // Obtener películas de la lista
        const listResponse = await fetchWithRetry(
            `https://api.trakt.tv/users/auferoz/lists/movies-${year}/items/movies?extended=full,images&sort_how=desc`
        );

        console.log('Response status:', listResponse?.status);

        if (!listResponse || !listResponse.ok) {
            error = `Error ${listResponse?.status || 'unknown'}: ${listResponse?.statusText || 'Request failed'}`;
        } else {
            movies = await listResponse.json();

            // Obtener people secuencialmente para evitar rate limiting
            const peopleResults = await fetchPeopleSequentially(movies, 500);

            // Agregar el rating personal y people a cada película
            movies = movies.map((item, index) => {
                const traktId = item.movie.ids.trakt;
                const userRating = userRatings[traktId] || null;
                const people = peopleResults[index];
                return {
                    ...item,
                    user_rating: userRating,
                    movie: {
                        ...item.movie,
                        user_rating: userRating,
                        actors: extractActors(people, 5),
                        director: extractDirector(people)
                    }
                };
            });
        }
    } catch (e) {
        error = e.message;
        console.error('Fetch error:', e);
    }

    return { movies, error };
}
