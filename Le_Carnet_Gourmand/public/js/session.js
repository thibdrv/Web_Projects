import { apiGet } from './fetch.js';

// État de connexion partagé par toute l'application (réponse de GET Session)
let compteConnecte = null;
const listeners = new Set();

// Relit la session côté serveur (au chargement de la page, au retour sur l'onglet,
// ou quand le serveur indique un état de connexion différent de celui affiché).
// En cas d'erreur réseau, l'état affiché est conservé.
export async function refreshSession() {
    const session = await apiGet('Session');
    setCompte(session.est_connecte ? session.compte : null);
}

export function currentUser() {
    return compteConnecte;
}

export function isLogged() {
    return compteConnecte !== null;
}

export function isAdmin() {
    return compteConnecte?.fk_role === 2;
}

export function isOwner(fkCompte) {
    return compteConnecte !== null && compteConnecte.pk_compte === fkCompte;
}

// Après connexion (compte) ou déconnexion / session expirée (null)
export function setCompte(compte) {
    const changed = (compte?.pk_compte ?? null) !== (compteConnecte?.pk_compte ?? null);
    compteConnecte = compte;
    if (changed) {
        // copie : un abonnement ajouté pendant la notification n'est pas appelé tout de suite
        [...listeners].forEach(listener => listener(compteConnecte));
    }
}

// Abonnement aux changements de connexion. Avec un élément `owner`, l'abonnement
// s'arrête tout seul quand cet élément n'est plus affiché (changement de page).
export function onSessionChange(listener, owner = null) {
    const wrapped = compte => {
        if (owner && !owner.isConnected) {
            listeners.delete(wrapped);
            return;
        }
        listener(compte);
    };
    listeners.add(wrapped);
    return () => listeners.delete(wrapped);
}
