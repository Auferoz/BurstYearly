/**
 * API de películas - Lee datos desde caché JSON pre-generado
 * 
 * Para actualizar los datos, ejecutar: npm run fetch-data
 */

// Importar datos cacheados
import moviesCache from '../data/cache/movies.json';

/**
 * Obtiene todas las películas desde el caché
 */
export async function getAllMovies() {
    try {
        const movies = moviesCache.movies || [];
        return { movies, error: null };
    } catch (e) {
        console.error('Error leyendo caché de películas:', e);
        return { movies: [], error: e.message };
    }
}

/**
 * Obtiene películas de un año específico desde el caché
 */
export async function getMoviesByYear(year) {
    try {
        const allMovies = moviesCache.movies || [];
        const movies = allMovies.filter(movie => movie.year_watched === year);
        return { movies, error: null };
    } catch (e) {
        console.error('Error leyendo caché de películas:', e);
        return { movies: [], error: e.message };
    }
}

/**
 * Obtiene información del caché
 */
export function getCacheInfo() {
    return {
        lastUpdated: moviesCache.lastUpdated,
        totalMovies: moviesCache.totalMovies
    };
}
