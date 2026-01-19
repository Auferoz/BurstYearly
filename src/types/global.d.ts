// Global type declarations for custom window properties

interface ModalData {
    title?: string;
    poster?: string;
    year?: number | string;
    rating?: number | string | null;
    runtime?: number | string | null;
    genres?: string[];
    overview?: string;
    trailer?: string;
    platform?: string;
    type?: string;
    episodes?: number;
    actors?: string[];
    director?: string | null;
    country?: string | null;
}

interface Window {
    openModalViewed: (data: ModalData) => void;
}
