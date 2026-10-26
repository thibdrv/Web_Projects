// Point d'entrée du frontend : barre de navigation, routes et chargement de la session
import { startRouter, updateActiveLinks } from './router.js';
import { refreshSession, onSessionChange, currentUser, isAdmin } from './session.js';
import { openAuthModal, logout } from './compte.js';
import { accueil } from './accueil.js';
import { recettes } from './recettes.js';
import { detailRecette } from './recetteDetail.js';
import { partager } from './formulaireRecette.js';
import { h, showLoading, toastError } from './ui.js';

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');

function renderNavbar() {
    const compte = currentUser();
    const liens = [
        h('a', { href: '#/', text: "Accueil" }),
        h('a', { href: '#/recettes', text: "Recettes" }),
        h('a', { href: '#/partager', className: 'nav-cta', text: "Partager une recette" }),
    ];
    const bienvenue = `Bonjour, ${compte?.pseudo}${isAdmin() ? " (admin)" : ""}`;
    const zoneCompte = compte
        ? [
            h('span', { className: 'user-info', title: bienvenue, text: bienvenue }),
            h('button', { type: 'button', className: 'nav-link', text: "Se déconnecter", onClick: logout }),
        ]
        : [
            h('button', { type: 'button', className: 'nav-link', text: "Se connecter", onClick: () => openAuthModal('login') }),
            h('button', { type: 'button', className: 'nav-link', text: "S'inscrire", onClick: () => openAuthModal('signup') }),
        ];
    navbar.replaceChildren(...liens, ...zoneCompte);
    updateActiveLinks();
}

function toggleMenu(open) {
    navbar.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? "Fermer le menu" : "Ouvrir le menu");
}

function pageIntrouvable(main) {
    main.replaceChildren(
        h('section', { className: 'empty-state page-message' },
            h('h2', { text: "Page introuvable" }),
            h('p', { text: "Cette adresse ne correspond à aucune page du site." }),
            h('a', { href: '#/', className: 'btn btn-primary', text: "Retour à l'accueil" }))
    );
}

// --- Éléments fixes de la page ---
navToggle.addEventListener('click', () => toggleMenu(!navbar.classList.contains('open')));
navbar.addEventListener('click', event => {
    if (event.target.closest('a, button')) {
        toggleMenu(false); // referme le menu mobile après un choix
    }
});
document.getElementById('backToTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Connexion ou déconnexion faite dans un autre onglet : on se resynchronise au retour sur celui-ci
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        refreshSession().catch(() => {}); // hors ligne : on garde l'état affiché
    }
});

// --- Démarrage ---
renderNavbar();
onSessionChange(renderNavbar);

showLoading(document.getElementById('main'), "Chargement du site…");
try {
    await refreshSession();
} catch (error) {
    toastError(error); // le site reste utilisable en visiteur
}

startRouter([
    { path: /^\/$/, view: accueil },
    { path: /^\/recettes$/, view: recettes },
    { path: /^\/recette\/(\d+)$/, view: (main, id) => detailRecette(main, Number(id)) },
    { path: /^\/partager$/, view: partager },
], pageIntrouvable);
