import { apiGet } from './fetch.js';
import { recetteCard } from './recettes.js';
import { h, showLoading, showError, showEmpty, showContent } from './ui.js';

const NB_DERNIERES_RECETTES = 6;

// Page d'accueil : présentation + dernières recettes publiées
export function accueil(main) {
    const dernieres = h('div', { className: 'recettes-grid', 'aria-live': 'polite' });

    main.replaceChildren(
        h('section', { className: 'hero' },
            h('h2', { text: "Bienvenue sur Le Carnet Gourmand" }),
            h('p', { text: "Découvrez, partagez et inspirez-vous avec notre communauté de passionnés de cuisine !" }),
            h('div', { className: 'hero-actions' },
                h('a', { href: '#/recettes', className: 'btn btn-primary', text: "Découvrir les recettes" }),
                h('a', { href: '#/partager', className: 'btn btn-secondary', text: "Partager une recette" }))),

        h('section', {},
            h('div', { className: 'section-head' },
                h('h3', { text: "Dernières recettes" }),
                h('a', { href: '#/recettes', className: 'link-more', text: "Voir toutes les recettes →" })),
            dernieres),

        h('a', { href: 'https://www.youtube.com/channel/UCOmtyPKnEgK3p1vRHU7Ie1A', target: '_blank', rel: 'noopener', className: 'accueil-link' },
            h('div', { className: 'accueil-section' },
                h('h3', { text: "🎬 Découvrez nos recettes en vidéo" }),
                h('p', { text: "Retrouvez une sélection de recettes gourmandes et faciles à réaliser directement en vidéo. "
                    + "Pas à pas, vous apprendrez à cuisiner comme un chef en suivant nos tutoriels sur notre chaîne YouTube. "
                    + "Que vous soyez débutant ou passionné de cuisine, il y en a pour tous les goûts !" }))),

        h('a', { href: '#/partager', className: 'accueil-link' },
            h('div', { className: 'accueil-section' },
                h('h3', { text: "👉 Cliquez ici pour partager votre recette" }),
                h('p', { text: "Vous avez une recette originale, familiale ou créative que vous aimeriez partager avec la communauté ? "
                    + "Ne la gardez pas pour vous ! Publiez-la pour que d'autres gourmands puissent la découvrir, la cuisiner et l'apprécier. "
                    + "Ajoutez vos ingrédients, vos astuces et une belle photo pour mettre en valeur votre plat." })))
    );

    chargerDernieres(dernieres);
}

async function chargerDernieres(container) {
    showLoading(container, "Chargement des dernières recettes…");
    try {
        const liste = await apiGet('Recette'); // triée de la plus récente à la plus ancienne
        if (!container.isConnected) {
            return; // l'utilisateur a changé de page entre-temps
        }
        const publiees = liste.filter(recette => recette.est_approuve).slice(0, NB_DERNIERES_RECETTES);
        if (publiees.length === 0) {
            showEmpty(container, "Aucune recette publiée pour le moment.");
        } else {
            showContent(container, ...publiees.map(recetteCard));
        }
    } catch (error) {
        if (container.isConnected) {
            showError(container, error, () => chargerDernieres(container));
        }
    }
}
