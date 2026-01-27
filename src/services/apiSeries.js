/**
 * API de series - Lee datos desde caché JSON pre-generado
 * 
 * Para actualizar los datos, ejecutar: npm run fetch-data
 */

// Importar datos cacheados
import seriesCache from '../data/cache/series.json';

/**
 * Obtiene temporadas de series filtradas por año desde el caché
 * @param {Array} seriesList - Lista de series/temporadas (del archivo seriesSeasons.js)
 * @param {number} year - Año a filtrar
 */
export async function getSeriesSeasonsByYear(seriesList, year) {
    try {
        const allSeries = seriesCache.seriesSeasons || [];
        
        // Filtrar por año y agregar rank
        const filteredSeries = allSeries
            .filter(item => item.yearViewed === year)
            .map((item, index) => ({
                ...item,
                rank: index + 1
            }));
        
        // Invertir para que el más reciente esté primero (como en el original)
        return { series: filteredSeries.reverse(), error: null };
    } catch (e) {
        console.error('Error leyendo caché de series:', e);
        return { series: [], error: e.message };
    }
}

/**
 * Obtiene la lista general de series (para ListAll)
 */
export async function getSeries() {
    try {
        const series = seriesCache.seriesListAll || [];
        return { series, error: null };
    } catch (e) {
        console.error('Error leyendo caché de series:', e);
        return { series: [], error: e.message };
    }
}

/**
 * Obtiene información del caché
 */
export function getCacheInfo() {
    return {
        lastUpdated: seriesCache.lastUpdated,
        totalSeasons: seriesCache.totalSeasons,
        totalSeriesListAll: seriesCache.seriesListAll?.length || 0
    };
}
