import { ApiError } from './exceptions.js';

// Toute la communication avec le backend passe par api.php (voir API_CONTRACT.md) :
//  - GET / DELETE : paramètres dans l'URL
//  - POST / PUT   : objet JSON dans le corps (Content-Type: application/json)
//  - réponse      : {"success": true, "data": ...} ou {"success": false, "error": "..."}

const API_URL = 'api.php';
const TIMEOUT_MS = 15000;

// Message par défaut si le serveur ne renvoie pas de message lisible
const MESSAGES_HTTP = {
    400: "La requête est invalide.",
    401: "Vous devez être connecté.",
    403: "Vous n'avez pas le droit d'effectuer cette action.",
    404: "Élément introuvable.",
    405: "Action non disponible.",
    409: "Cette action entre en conflit avec les données existantes.",
    415: "Format de requête refusé par le serveur.",
    500: "Erreur interne du serveur. Réessayez plus tard.",
    503: "Le service est momentanément indisponible. Réessayez plus tard.",
};

// Appel générique : renvoie le champ "data" de la réponse, ou lève une ApiError
export async function apiRequest(route, { method = 'GET', params = {}, body = null } = {}) {
    const url = new URL(API_URL, window.location.href);
    url.searchParams.set('route', route);
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, value);
        }
    }

    const options = {
        method,
        credentials: 'same-origin', // envoie le cookie de session
        headers: { 'Accept': 'application/json' },
    };
    if (body !== null) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    // Au-delà de TIMEOUT_MS, la requête est abandonnée
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    options.signal = controller.signal;

    let response;
    let text;
    try {
        response = await fetch(url, options);
        text = await response.text();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new ApiError("Le serveur met trop de temps à répondre. Réessayez.", 0, true);
        }
        throw new ApiError("Impossible de contacter le serveur. Vérifiez votre connexion internet.", 0, true);
    } finally {
        clearTimeout(timer);
    }

    let payload = null;
    try {
        payload = JSON.parse(text);
    } catch {
        // réponse vide ou qui n'est pas du JSON (erreur PHP, page HTML...) : traitée ci-dessous
    }

    if (!response.ok || payload === null || payload.success !== true) {
        const message = payload?.error
            || MESSAGES_HTTP[response.status]
            || `Réponse inattendue du serveur (HTTP ${response.status}).`;
        throw new ApiError(message, response.status);
    }
    return payload.data;
}

export const apiGet = (route, params = {}) => apiRequest(route, { params });
export const apiPost = (route, body = {}) => apiRequest(route, { method: 'POST', body });
export const apiPut = (route, body = {}) => apiRequest(route, { method: 'PUT', body });
export const apiDelete = (route, params = {}) => apiRequest(route, { method: 'DELETE', params });
