/**
 * Base de datos local de temporadas de series vistas
 *
 * Campos:
 * - idTrakt: Slug de la serie en Trakt
 * - numberSeason: Número de temporada
 * - yearViewed: Año en que se vio
 * - platformViewed: Plataforma donde se vio
 * - statusViewed: "ongoing" (en progreso) o "completed" (completada)
 */

export const ListSeriesSeasons = [
    {
        idTrakt: "ghosts-2021",
        numberSeason: 1,
        yearViewed: 2025,
        platformViewed: "Netflix",
        statusViewed: "completed"
    },
    {
        idTrakt: "ghosts-2021",
        numberSeason: 2,
        yearViewed: 2025,
        platformViewed: "Netflix",
        statusViewed: "completed"
    },
    {
        idTrakt: "ghosts-2021",
        numberSeason: 3,
        yearViewed: 2025,
        platformViewed: "Netflix",
        statusViewed: "completed"
    },
    {
        idTrakt: "east-new-york",
        numberSeason: 1,
        yearViewed: 2026,
        platformViewed: "HBO Max",
        statusViewed: "completed"
    },
    {
        idTrakt: "wandavision",
        numberSeason: 1,
        yearViewed: 2026,
        platformViewed: "Disney+",
        statusViewed: "completed"
    },
    {
        idTrakt: "the-falcon-and-the-winter-soldier",
        numberSeason: 1,
        yearViewed: 2026,
        platformViewed: "Disney+",
        statusViewed: "completed"
    },
    {
        idTrakt: "loki-2021",
        numberSeason: 1,
        yearViewed: 2026,
        platformViewed: "Disney+",
        statusViewed: "completed"
    },
    {
        idTrakt: "spy-x-family",
        numberSeason: 3,
        yearViewed: 2026,
        platformViewed: "Crunchyroll",
        statusViewed: "ongoing"
    },
    {
        idTrakt: "what-if-2021",
        numberSeason: 1,
        yearViewed: 2026,
        platformViewed: "Disney+",
        statusViewed: "completed"
    },
    {
        idTrakt: "hawkeye-2021",
        numberSeason: 1,
        yearViewed: 2026,
        platformViewed: "Disney+",
        statusViewed: "completed"
    },
    {
        idTrakt: "moon-knight",
        numberSeason: 1,
        yearViewed: 2026,
        platformViewed: "Disney+",
        statusViewed: "completed"
    },
    {
        idTrakt: "ms-marvel",
        numberSeason: 1,
        yearViewed: 2026,
        platformViewed: "Disney+",
        statusViewed: "ongoing"
    },
];

// Helper para obtener todos los años únicos
export const getAvailableYears = () => {
    const years = [...new Set(ListSeriesSeasons.map(s => s.yearViewed))];
    return years.sort((a, b) => a - b); // Ordenar descendente
};
