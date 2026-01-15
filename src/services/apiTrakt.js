const TRAKT_CLIENT_ID = import.meta.env.TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = import.meta.env.TRAKT_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:4321/";

// Paso 1: Genera la URL para autorizar la aplicación
// El usuario debe visitar esta URL, autorizar y copiar el code que recibe
export function getAuthorizationUrl() {
    const url = `https://trakt.tv/oauth/authorize?response_type=code&client_id=${TRAKT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    console.log('Authorization URL:', url);
    return url;
}

// Paso 2: Intercambiar el code por access_token
export async function exchangeCodeForToken(code) {
    const response = await fetch("https://api.trakt.tv/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code: code,
            client_id: TRAKT_CLIENT_ID,
            client_secret: TRAKT_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    const data = await response.json();
    console.log('Token response:', data);
    return data;
}

// Paso 3: Renovar access_token usando refresh_token
export async function refreshAccessToken(refreshToken) {
    const response = await fetch("https://api.trakt.tv/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh_token: refreshToken,
            client_id: TRAKT_CLIENT_ID,
            client_secret: TRAKT_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "refresh_token",
        }),
    });

    const data = await response.json();
    console.log('Refresh token response:', data);
    return data;
}
