const TRAKT_CLIENT_ID = import.meta.env.TRAKT_CLIENT_ID;

export async function getMoviesByYear(year) {
    let movies = [];
    let error = null;

    try {
        console.log('TRAKT_CLIENT_ID exists:', !!TRAKT_CLIENT_ID);

        const response = await fetch(
            `https://api.trakt.tv/users/auferoz/lists/movies-${year}/items/movies?extended=full,images`,
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
            movies = await response.json();
            // console.log('API Response:', JSON.stringify(movies, null, 2));
        }
    } catch (e) {
        error = e.message;
        console.error('Fetch error:', e);
    }

    return { movies, error };
}
