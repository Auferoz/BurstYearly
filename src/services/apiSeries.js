const TRAKT_CLIENT_ID = import.meta.env.TRAKT_CLIENT_ID;
const TRAKT_ACCESS_TOKEN = import.meta.env.TRAKT_ACCESS_TOKEN;

export async function getSeriesSeasonsByYear(seriesList, year) {
    let series = [];
    let error = null;

    try {
        const filteredList = seriesList.filter(item => item.yearViewed === year);

        const promises = filteredList.map(async (item, index) => {
            const response = await fetch(
                `https://api.trakt.tv/shows/${item.idTrakt}/seasons/${item.numberSeason}/info?extended=full,images`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "trakt-api-key": TRAKT_CLIENT_ID,
                        "trakt-api-version": "2",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const seasonData = await response.json();

            // También obtenemos info del show para tener el título y poster
            const showResponse = await fetch(
                `https://api.trakt.tv/shows/${item.idTrakt}?extended=full,images`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "trakt-api-key": TRAKT_CLIENT_ID,
                        "trakt-api-version": "2",
                    },
                }
            );

            const showData = await showResponse.json();

            return {
                rank: index + 1,
                season: seasonData,
                show: showData,
                yearViewed: item.yearViewed,
                numberSeason: item.numberSeason,
                platformViewed: item.platformViewed,
                statusViewed: item.statusViewed,
            };
        });

        series = await Promise.all(promises);
    } catch (e) {
        error = e.message;
        console.error('Fetch error:', e);
    }

    return { series, error };
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
