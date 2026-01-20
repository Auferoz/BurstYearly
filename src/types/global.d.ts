// Global type declarations for custom window properties

interface ActorData {
    name: string;
    character?: string;
}

interface ModalData {
    title?: string;
    poster?: string;
    logo?: string | null;
    banner?: string | null;
    releaseDate?: string; // Format: "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS.000Z"
    rating?: number | string | null;
    runtime?: number | string | null;
    totalRuntime?: number | null; // Total runtime for series (runtime * episodes)
    genres?: string[];
    overview?: string;
    trailer?: string;
    platform?: string;
    episodes?: number;
    actors?: ActorData[];
    director?: string | null;
    country?: string | null;
}

interface Window {
    openModalViewed: (data: ModalData) => void;
}
