const TRAKT_CLIENT_ID = import.meta.env.TRAKT_CLIENT_ID;
const TRAKT_ACCESS_TOKEN = import.meta.env.TRAKT_ACCESS_TOKEN;

const traktHeaders = {
    "Content-Type": "application/json",
    "trakt-api-key": TRAKT_CLIENT_ID,
    "trakt-api-version": "2",
};

// Obtener cast y crew de una serie
async function getShowPeople(traktId) {
    try {
        const response = await fetch(
            `https://api.trakt.tv/shows/${traktId}/people`,
            { headers: traktHeaders }
        );

        if (!response.ok) return { cast: [], crew: { directing: [] } };

        const people = await response.json();
        return people;
    } catch (e) {
        console.error(`Error fetching people for show ${traktId}:`, e);
        return { cast: [], crew: { directing: [] } };
    }
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

// Extraer creador/director del crew (para series suele ser "created by" o "executive producer")
function extractDirector(people) {
    if (!people?.crew) return null;
    
    // Buscar en directing primero
    if (people.crew.directing && Array.isArray(people.crew.directing)) {
        const director = people.crew.directing.find(item => item.job === 'Director');
        if (director?.person?.name) return director.person.name;
    }
    
    // Buscar "created by" en production
    if (people.crew['created by'] && Array.isArray(people.crew['created by'])) {
        if (people.crew['created by'][0]?.person?.name) {
            return people.crew['created by'][0].person.name;
        }
    }
    
    // Buscar en production
    if (people.crew.production && Array.isArray(people.crew.production)) {
        const creator = people.crew.production.find(item => 
            item.job === 'Executive Producer' || item.job === 'Creator'
        );
        if (creator?.person?.name) return creator.person.name;
    }
    
    return null;
}

// Helper para hacer requests con delay y evitar rate limiting
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch con retry y manejo de rate limiting
async function fetchWithRetry(url, retries = 3, delayMs = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, { headers: traktHeaders });
            
            if (response.status === 429) {
                const waitTime = delayMs * Math.pow(2, i);
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

// Obtener cast y crew de una serie con retry
async function getShowPeopleWithRetry(traktId) {
    try {
        const response = await fetchWithRetry(
            `https://api.trakt.tv/shows/${traktId}/people`
        );

        if (!response || !response.ok) return { cast: [], crew: { directing: [] } };

        const people = await response.json();
        return people;
    } catch (e) {
        console.error(`Error fetching people for show ${traktId}:`, e);
        return { cast: [], crew: { directing: [] } };
    }
}

export async function getSeriesSeasonsByYear(seriesList, year) {
    let series = [];
    let error = null;

    try {
        const filteredList = seriesList.filter(item => item.yearViewed === year);

        // Procesar series secuencialmente con delay para evitar rate limiting
        for (let index = 0; index < filteredList.length; index++) {
            const item = filteredList[index];
            
            // Delay entre series (excepto la primera)
            if (index > 0) {
                await delay(500);
            }

            const response = await fetchWithRetry(
                `https://api.trakt.tv/shows/${item.idTrakt}/seasons/${item.numberSeason}/info?extended=full,images`
            );

            if (!response || !response.ok) {
                console.error(`Error fetching season for ${item.idTrakt}`);
                continue; // Saltar esta serie en lugar de fallar todo
            }

            const seasonData = await response.json();

            await delay(300);

            // Obtener info del show
            const showResponse = await fetchWithRetry(
                `https://api.trakt.tv/shows/${item.idTrakt}?extended=full,images`
            );

            if (!showResponse || !showResponse.ok) {
                console.error(`Error fetching show info for ${item.idTrakt}`);
                continue;
            }

            const showData = await showResponse.json();
            
            await delay(300);

            // Obtener people
            const people = await getShowPeopleWithRetry(item.idTrakt);

            series.push({
                rank: index + 1,
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
            });
        }
    } catch (e) {
        error = e.message;
        console.error('Fetch error:', e);
    }

    return { series: series.reverse(), error };
}

export async function getSeries() {
    let series = [];
    let error = null;

    try {
        console.log('TRAKT_CLIENT_ID exists:', !!TRAKT_CLIENT_ID);

        const response = await fetch(
            `https://api.trakt.tv/users/auferoz/lists/tv-shows-animes/items/shows?extended=full,images`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-key": TRAKT_CLIENT_ID,
                    "trakt-api-version": "2",
                },
            }
        );

        console.log('Response status:', response.status);

        if (!response.ok) {
            error = `Error ${response.status}: ${response.statusText}`;
        } else {
            series = await response.json();
        }
    } catch (e) {
        error = e.message;
        console.error('Fetch error:', e);
    }

    return { series, error };
}
