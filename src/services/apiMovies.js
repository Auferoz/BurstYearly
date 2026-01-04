const TRAKT_CLIENT_ID = import.meta.env.TRAKT_CLIENT_ID;

const traktHeaders = {
    "Content-Type": "application/json",
    "trakt-api-key": TRAKT_CLIENT_ID,
    "trakt-api-version": "2",
};

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

export async function getMoviesByYear(year) {
    let movies = [];
    let error = null;

    try {
        console.log('TRAKT_CLIENT_ID exists:', !!TRAKT_CLIENT_ID);

        // Obtener películas de la lista y ratings en paralelo
        const [listResponse, userRatings] = await Promise.all([
            fetch(
                `https://api.trakt.tv/users/auferoz/lists/movies-${year}/items/movies?extended=full,images`,
                { headers: traktHeaders }
            ),
            getUserRatings()
        ]);

        console.log('Response status:', listResponse.status);

        if (!listResponse.ok) {
            error = `Error ${listResponse.status}: ${listResponse.statusText}`;
        } else {
            movies = await listResponse.json();

            // Agregar el rating personal a cada película
            movies = movies.map(item => {
                const traktId = item.movie.ids.trakt;
                const userRating = userRatings[traktId] || null;
                return {
                    ...item,
                    user_rating: userRating, // Tu rating personal (1-10) o null si no has calificado
                    movie: {
                        ...item.movie,
                        user_rating: userRating // También lo agregamos dentro de movie por conveniencia
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
