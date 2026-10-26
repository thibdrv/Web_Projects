// Erreur d'un appel à l'API : réponse {"success": false, "error": "..."} ou problème réseau
export class ApiError extends Error {
    constructor(message, status = 0, network = false) {
        super(message);
        this.name = "ApiError";
        this.status = status;   // code HTTP (0 = aucune réponse du serveur)
        this.network = network; // true si le serveur n'a pas pu être joint
    }
}
