const TRAKT_CLIENT_ID = import.meta.env.TRAKT_CLIENT_ID;

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
