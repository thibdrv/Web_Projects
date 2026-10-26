// Fenêtre modale unique (#myModal dans index.html), utilisée pour la connexion et l'inscription

const overlay = document.getElementById('myModal');
const container = document.getElementById('modalFormContainer');
let previousFocus = null;

// Ouvre la modale vide et renvoie la zone où insérer le contenu
export function openModal() {
    previousFocus = document.activeElement;
    container.replaceChildren();
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    return container;
}

export function closeModal() {
    if (!overlay.classList.contains('open')) {
        return;
    }
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    container.replaceChildren();
    previousFocus?.focus?.();
}

export function isModalOpen() {
    return overlay.classList.contains('open');
}

// Fermeture : bouton ×, clic à côté de la fenêtre, touche Échap
document.getElementById('closeLogin')?.addEventListener('click', closeModal);
overlay.addEventListener('click', event => {
    if (event.target === overlay) {
        closeModal();
    }
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeModal();
    }
});
