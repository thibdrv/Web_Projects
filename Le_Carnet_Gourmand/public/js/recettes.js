import { apiGet } from './fetch.js';
import { currentUser, isLogged, onSessionChange } from './session.js';
import { h, showLoading, showError, showEmpty, showContent } from './ui.js';

// Filtres conservés quand on revient sur la liste depuis une fiche recette
const etat = { categorie: '', recherche: '', parPage: 20, page: 1, mesRecettes: false };
let toutes = [];
let derniereRequete = 0;

// Carte d'une recette (liste, accueil) : lien vers sa fiche
export function recetteCard(recette) {
    const visuel = recette.image
        ? h('img', { src: recette.image, alt: '', loading: 'lazy', onError: event => event.target.replaceWith(vignetteVide()) })
        : vignetteVide();

    return h('a', { href: `#/recette/${recette.pk_recette}`, className: 'recette-card' },
        visuel,
        h('div', { className: 'card-body' },
            h('div', { className: 'card-tags' },
                recette.categories.map(categorie => h('span', { className: 'card-tag', text: categorie.nom })),
                !recette.est_approuve && h('span', { className: 'badge badge-pending', text: "En attente de validation" })),
            h('h3', { text: recette.nom }),
            recette.auteur_pseudo && h('p', { className: 'card-author', text: `par ${recette.auteur_pseudo}` })));
}

function vignetteVide() {
    return h('div', { className: 'card-thumb', 'aria-hidden': 'true', text: "🍽️" });
}

// Page « Recettes » : filtres, recherche, pagination
export function recettes(main) {
    const vue = {
        compteur: h('p', { className: 'recettes-count', 'aria-live': 'polite' }),
        categorie: h('select', { id: 'filterCat', className: 'filter', disabled: true },
            h('option', { value: '', text: "Chargement…" })),
        recherche: h('input', { id: 'searchRecette', type: 'search', className: 'filter',
            placeholder: "Nom de la recette…", value: etat.recherche }),
        parPage: h('select', { id: 'perPageSelect', className: 'filter' },
            [10, 20, 50, 0].map(n => h('option', { value: n, text: n === 0 ? "Toutes" : String(n), selected: n === etat.parPage }))),
        mesRecettes: h('input', { id: 'mesRecettes', type: 'checkbox', checked: etat.mesRecettes }),
        liste: h('div', { id: 'recettesList', className: 'recettes-grid', 'aria-live': 'polite' }),
        pagination: h('nav', { className: 'pagination', 'aria-label': "Pages de résultats" }),
    };
    if (!isLogged()) {
        etat.mesRecettes = false;
    }

    main.replaceChildren(
        h('div', { className: 'section-head' }, h('h2', { text: "Recettes" }), vue.compteur),
        h('div', { className: 'recettes-filter' },
            h('div', { className: 'filter-item' }, h('label', { for: 'searchRecette', text: "Rechercher" }), vue.recherche),
            h('div', { className: 'filter-item' }, h('label', { for: 'filterCat', text: "Catégorie" }), vue.categorie),
            h('div', { className: 'filter-item' }, h('label', { for: 'perPageSelect', text: "Par page" }), vue.parPage),
            isLogged() && h('div', { className: 'filter-item filter-check' },
                vue.mesRecettes, h('label', { for: 'mesRecettes', text: "Mes recettes (y compris en attente)" }))),
        vue.liste,
        vue.pagination
    );

    vue.categorie.addEventListener('change', () => {
        etat.categorie = vue.categorie.value;
        etat.page = 1;
        chargerRecettes(vue);
    });
    vue.recherche.addEventListener('input', () => {
        etat.recherche = vue.recherche.value;
        etat.page = 1;
        afficherPage(vue); // filtre local, sans nouvelle requête
    });
    vue.parPage.addEventListener('change', () => {
        etat.parPage = Number(vue.parPage.value);
        etat.page = 1;
        afficherPage(vue);
    });
    vue.mesRecettes.addEventListener('change', () => {
        etat.mesRecettes = vue.mesRecettes.checked;
        etat.page = 1;
        chargerRecettes(vue);
    });

    // Connexion / déconnexion : la liste visible change (recettes en attente, filtre « Mes recettes »)
    onSessionChange(() => recettes(main), vue.liste);

    chargerCategories(vue);
    chargerRecettes(vue);
}

async function chargerCategories(vue) {
    try {
        const categories = await apiGet('Categorie');
        vue.categorie.replaceChildren(
            h('option', { value: '', text: "Toutes" }),
            ...categories.map(c => h('option', { value: c.pk_categorie, text: c.nom, selected: String(c.pk_categorie) === etat.categorie }))
        );
        vue.categorie.disabled = false;
    } catch (error) {
        vue.categorie.replaceChildren(h('option', { value: '', text: "Indisponible" }));
        vue.categorie.title = error.message;
    }
}

async function chargerRecettes(vue) {
    const requete = ++derniereRequete; // seule la dernière requête lancée est affichée
    vue.compteur.textContent = '';
    vue.pagination.replaceChildren();
    showLoading(vue.liste, "Chargement des recettes…");

    try {
        const liste = await apiGet('Recette', {
            fk_categorie: etat.categorie,
            fk_compte: etat.mesRecettes ? currentUser()?.pk_compte : null,
        });
        if (requete !== derniereRequete || !vue.liste.isConnected) {
            return;
        }
        toutes = liste;
        afficherPage(vue);
    } catch (error) {
        if (requete !== derniereRequete || !vue.liste.isConnected) {
            return;
        }
        if (error.status === 404 && etat.categorie) {
            etat.categorie = ''; // catégorie supprimée entre-temps
        }
        showError(vue.liste, error, () => chargerRecettes(vue));
    }
}

// Sans accents ni majuscules, pour une recherche tolérante
function normaliser(texte) {
    return texte.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

function afficherPage(vue) {
    const recherche = normaliser(etat.recherche);
    const resultats = recherche ? toutes.filter(r => normaliser(r.nom).includes(recherche)) : toutes;

    vue.compteur.textContent = `${resultats.length} recette${resultats.length > 1 ? 's' : ''}`;
    if (resultats.length === 0) {
        vue.pagination.replaceChildren();
        showEmpty(vue.liste, recherche || etat.categorie || etat.mesRecettes
            ? "Aucune recette ne correspond à ces critères."
            : "Aucune recette publiée pour le moment.");
        return;
    }

    const parPage = etat.parPage || resultats.length;
    const nbPages = Math.ceil(resultats.length / parPage);
    etat.page = Math.min(Math.max(1, etat.page), nbPages);
    const debut = (etat.page - 1) * parPage;

    showContent(vue.liste, ...resultats.slice(debut, debut + parPage).map(recetteCard));
    afficherPagination(vue, nbPages);
}

function afficherPagination(vue, nbPages) {
    if (nbPages <= 1) {
        vue.pagination.replaceChildren();
        return;
    }
    const allerA = page => () => {
        etat.page = page;
        afficherPage(vue);
        vue.liste.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const boutons = [
        h('button', { type: 'button', text: "‹", 'aria-label': "Page précédente", disabled: etat.page === 1, onClick: allerA(etat.page - 1) }),
    ];
    for (let page = 1; page <= nbPages; page++) {
        boutons.push(h('button', {
            type: 'button',
            text: String(page),
            className: page === etat.page ? 'active' : null,
            'aria-current': page === etat.page ? 'page' : null,
            onClick: allerA(page),
        }));
    }
    boutons.push(h('button', { type: 'button', text: "›", 'aria-label': "Page suivante", disabled: etat.page === nbPages, onClick: allerA(etat.page + 1) }));
    vue.pagination.replaceChildren(...boutons);
}
