import { apiGet, apiPost, apiPut, apiDelete } from './fetch.js';
import { currentUser, isLogged, isAdmin, isOwner, onSessionChange } from './session.js';
import { openAuthModal, handleAuthError, handleActionError, loginPrompt } from './compte.js';
import { navigate } from './router.js';
import {
    h, field, validate, setFormError, setButtonLoading, showLoading, showError, showEmpty, showContent,
    toast, errorMessage, formatDate, youtubeEmbedUrl, starsAverage,
} from './ui.js';

const COMMENTAIRE_MAX = 2000;

// Fiche d'une recette : contenu, favori, note, commentaires
export function detailRecette(main, id) {
    const page = h('article', { id: 'recetteDetail' });
    main.replaceChildren(page);
    // Connexion / déconnexion : visibilité et actions possibles changent → on recharge la fiche
    onSessionChange(() => chargerRecette(page, id), page);
    chargerRecette(page, id);
}

async function chargerRecette(page, id) {
    showLoading(page, "Chargement de la recette…");
    try {
        const recette = await apiGet('Recette', { pk_recette: id });
        if (page.isConnected) {
            afficherRecette(page, recette);
        }
    } catch (error) {
        if (!page.isConnected) {
            return;
        }
        if (error.status === 404) {
            showContent(page,
                h('h2', { text: "Recette introuvable" }),
                h('p', { className: 'empty-state', text: "Cette recette n'existe pas, a été supprimée ou attend encore sa validation." }),
                lienRetour());
        } else {
            showError(page, error, () => chargerRecette(page, id));
        }
    }
}

function lienRetour() {
    return h('a', { href: '#/recettes', className: 'back-link', text: "← Toutes les recettes" });
}

function afficherRecette(page, recette) {
    const moderation = h('div', { className: 'recette-moderation' });
    const actions = h('div', { className: 'recette-fav_note' });
    const commentaires = h('section', { className: 'recette-commentaires', 'aria-labelledby': 'titreCommentaires' });

    const meta = [`Par ${recette.auteur_pseudo ?? "un membre"}`, `publiée le ${formatDate(recette.date_creation)}`];
    if (recette.date_modification && recette.date_modification !== recette.date_creation) {
        meta.push(`modifiée le ${formatDate(recette.date_modification)}`);
    }

    showContent(page,
        lienRetour(),
        h('div', { className: 'recette-actions' },
            h('div', { className: 'card-tags' },
                recette.categories.map(c => h('span', { className: 'card-tag', text: c.nom })),
                !recette.est_approuve && h('span', { className: 'badge badge-pending', text: "En attente de validation" })),
            h('h2', { text: recette.nom }),
            h('p', { className: 'recette-meta', text: meta.join(" · ") }),
            moderation,
            actions),
        recette.image ? h('div', { className: 'recette-image' },
            h('img', { src: recette.image, alt: recette.nom, onError: event => event.target.parentElement.remove() })) : null,
        h('div', { className: 'recette-infos' },
            h('div', { className: 'ingredients' }, h('strong', { text: "Ingrédients" }), recette.ingredients),
            h('div', { className: 'details' }, h('strong', { text: "Préparation" }), recette.details || "Préparation à venir.")),
        video(recette),
        commentaires
    );

    afficherModeration(moderation, recette, page);
    if (recette.est_approuve) {
        afficherFavori(actions, recette);
        afficherNote(actions, recette);
    }
    afficherCommentaires(commentaires, recette);
}

function video(recette) {
    if (!recette.lien || !/^https?:\/\//i.test(recette.lien)) {
        return null;
    }
    const embed = youtubeEmbedUrl(recette.lien);
    return h('div', { className: 'recette-lien' },
        h('h3', { text: "Voir en vidéo" }),
        embed
            ? h('iframe', {
                src: embed,
                title: `Vidéo : ${recette.nom}`,
                loading: 'lazy',
                allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                referrerpolicy: 'strict-origin-when-cross-origin',
                allowfullscreen: true,
            })
            : h('a', { href: recette.lien, target: '_blank', rel: 'noopener noreferrer', className: 'btn btn-secondary', text: "Ouvrir la vidéo ↗" }));
}

// ---------------------------------------------------------------------------
// Validation (admin) et suppression (auteur ou admin)
// ---------------------------------------------------------------------------
function afficherModeration(container, recette, page) {
    const auteur = isOwner(recette.fk_compte);
    const elements = [];

    if (!recette.est_approuve) {
        elements.push(h('p', { className: 'notice', text: auteur && !isAdmin()
            ? "Votre recette est en attente de validation par un administrateur : elle n'est pas encore visible des autres membres."
            : "Cette recette attend une validation avant d'être publiée." }));
    }
    if (isAdmin() && !recette.est_approuve) {
        elements.push(h('button', {
            type: 'button', className: 'btn btn-primary btn-small', text: "✔ Approuver la recette",
            onClick: async event => {
                const bouton = event.currentTarget;
                setButtonLoading(bouton, true, "Validation…");
                try {
                    await apiPut('Recette', { pk_recette: recette.pk_recette, est_approuve: true });
                    toast("Recette publiée.", 'success');
                    chargerRecette(page, recette.pk_recette);
                } catch (error) {
                    setButtonLoading(bouton, false);
                    handleActionError(error);
                }
            },
        }));
    }
    if (auteur || isAdmin()) {
        elements.push(h('button', {
            type: 'button', className: 'btn btn-danger btn-small', text: "Supprimer la recette",
            onClick: async event => {
                if (!confirm(`Supprimer définitivement « ${recette.nom} » ?`)) {
                    return;
                }
                const bouton = event.currentTarget;
                setButtonLoading(bouton, true, "Suppression…");
                try {
                    await apiDelete('Recette', { pk_recette: recette.pk_recette });
                    toast("Recette supprimée.", 'success');
                    navigate('/recettes');
                } catch (error) {
                    setButtonLoading(bouton, false);
                    handleActionError(error);
                }
            },
        }));
    }
    container.replaceChildren(...elements);
}

// ---------------------------------------------------------------------------
// Favori
// ---------------------------------------------------------------------------
function afficherFavori(container, recette) {
    const bouton = h('button', { type: 'button', className: 'btn btn-secondary btn-favori', text: "♡ Ajouter aux favoris" });
    container.append(bouton);

    if (!isLogged()) {
        bouton.addEventListener('click', () => openAuthModal('login'));
        bouton.title = "Connectez-vous pour ajouter cette recette à vos favoris";
        return;
    }

    let estFavori = false;
    const afficher = () => {
        bouton.textContent = estFavori ? "♥ Dans vos favoris" : "♡ Ajouter aux favoris";
        bouton.classList.toggle('favori-actif', estFavori);
        bouton.setAttribute('aria-pressed', String(estFavori));
    };

    const chargerEtat = async () => {
        setButtonLoading(bouton, true, "Favoris…");
        try {
            estFavori = (await apiGet('Favori', { fk_recette: recette.pk_recette })).est_favori;
            setButtonLoading(bouton, false);
            afficher();
            bouton.onclick = basculer;
        } catch (error) {
            setButtonLoading(bouton, false);
            bouton.textContent = "⚠ Favoris indisponibles · réessayer";
            bouton.title = errorMessage(error);
            bouton.onclick = chargerEtat;
        }
    };

    const basculer = async () => {
        setButtonLoading(bouton, true, estFavori ? "Retrait…" : "Ajout…");
        try {
            const resultat = estFavori
                ? await apiDelete('Favori', { fk_recette: recette.pk_recette })
                : await apiPost('Favori', { fk_recette: recette.pk_recette });
            estFavori = resultat.est_favori;
            toast(estFavori ? "Recette ajoutée à vos favoris." : "Recette retirée de vos favoris.", 'success');
        } catch (error) {
            if (error.status === 409) {
                estFavori = true; // déjà en favori (autre onglet)
            } else if (error.status === 404 && estFavori) {
                estFavori = false; // déjà retirée
            } else {
                handleActionError(error);
            }
        } finally {
            setButtonLoading(bouton, false);
            afficher();
        }
    };

    chargerEtat();
}

// ---------------------------------------------------------------------------
// Note : moyenne publique + note de l'utilisateur connecté (POST la 1re fois, PUT ensuite)
// ---------------------------------------------------------------------------
function afficherNote(container, recette) {
    const zone = h('div', { id: 'noteZone', className: 'note-zone', 'aria-live': 'polite' });
    container.append(zone);
    chargerNote(zone, recette);
}

async function chargerNote(zone, recette) {
    showLoading(zone, "Note…");
    let stats;
    try {
        stats = await apiGet('Note', { fk_recette: recette.pk_recette });
    } catch (error) {
        if (zone.isConnected) {
            showError(zone, error, () => chargerNote(zone, recette));
        }
        return;
    }
    if (!zone.isConnected) {
        return;
    }

    const moyenne = h('p', { id: 'noteMoyenne', className: 'note-moyenne' },
        starsAverage(stats.moyenne),
        h('span', { text: stats.nombre_notes > 0
            ? ` ${String(stats.moyenne).replace('.', ',')}/5 (${stats.nombre_notes} avis)`
            : " Pas encore de note" }));

    if (!isLogged()) {
        showContent(zone, moyenne, loginPrompt("Pour noter cette recette,"));
        return;
    }

    const etoiles = [1, 2, 3, 4, 5].map(valeur => h('button', {
        type: 'button',
        className: 'star',
        text: '☆',
        'aria-label': `Noter ${valeur} sur 5`,
        dataset: { value: valeur },
    }));
    const surligner = valeur => etoiles.forEach((etoile, i) => {
        etoile.textContent = i < valeur ? '★' : '☆';
        etoile.classList.toggle('star-on', i < valeur);
        etoile.setAttribute('aria-pressed', String(i + 1 === stats.ma_note));
    });

    const noter = async valeur => {
        etoiles.forEach(etoile => { etoile.disabled = true; });
        try {
            const corps = { fk_recette: recette.pk_recette, note: valeur };
            if (stats.ma_note === null) {
                await apiPost('Note', corps);
            } else {
                await apiPut('Note', corps);
            }
            toast("Merci pour votre note !", 'success');
            chargerNote(zone, recette);
        } catch (error) {
            etoiles.forEach(etoile => { etoile.disabled = false; });
            surligner(stats.ma_note ?? 0);
            handleActionError(error);
        }
    };

    etoiles.forEach((etoile, i) => {
        etoile.addEventListener('mouseenter', () => surligner(i + 1));
        etoile.addEventListener('focus', () => surligner(i + 1));
        etoile.addEventListener('click', () => noter(i + 1));
    });
    const widget = h('div', { id: 'starRating', className: 'star-rating', role: 'group', 'aria-label': "Votre note" }, etoiles);
    widget.addEventListener('mouseleave', () => surligner(stats.ma_note ?? 0));
    widget.addEventListener('focusout', () => surligner(stats.ma_note ?? 0));
    surligner(stats.ma_note ?? 0);

    const retirer = stats.ma_note !== null && h('button', {
        type: 'button', className: 'link-button', text: "Retirer ma note",
        onClick: async () => {
            try {
                await apiDelete('Note', { fk_recette: recette.pk_recette });
                toast("Votre note a été retirée.", 'success');
                chargerNote(zone, recette);
            } catch (error) {
                handleActionError(error);
            }
        },
    });

    showContent(zone, moyenne,
        h('div', { className: 'ma-note' },
            h('span', { text: stats.ma_note === null ? "Votre note :" : `Votre note (${stats.ma_note}/5) :` }),
            widget,
            retirer));
}

// ---------------------------------------------------------------------------
// Commentaires
// ---------------------------------------------------------------------------
function afficherCommentaires(section, recette) {
    const formulaire = h('div', { id: 'commentForm' });
    const liste = h('div', { id: 'commentairesList', 'aria-live': 'polite' });
    section.replaceChildren(h('h3', { id: 'titreCommentaires', text: "Commentaires" }), formulaire, liste);
    chargerCommentaires(recette, formulaire, liste);
}

async function chargerCommentaires(recette, formulaire, liste) {
    const recharger = () => chargerCommentaires(recette, formulaire, liste);
    showLoading(liste, "Chargement des commentaires…");
    let commentaires;
    try {
        commentaires = await apiGet('Commentaire', { fk_recette: recette.pk_recette });
    } catch (error) {
        if (liste.isConnected) {
            formulaire.replaceChildren();
            showError(liste, error, recharger);
        }
        return;
    }
    if (!liste.isConnected) {
        return;
    }

    const moi = currentUser();
    const monCommentaire = moi ? commentaires.find(c => c.fk_compte === moi.pk_compte) : null;
    formulaire.replaceChildren(formulaireCommentaire(recette, monCommentaire, recharger));

    if (commentaires.length === 0) {
        showEmpty(liste, "Aucun commentaire pour l'instant.");
    } else {
        showContent(liste, ...commentaires.map(c => commentaireItem(c, recharger)));
    }
}

function formulaireCommentaire(recette, monCommentaire, recharger) {
    if (!isLogged()) {
        return loginPrompt("Pour laisser un commentaire,");
    }
    if (!recette.est_approuve) {
        return h('p', { className: 'notice', text: "Les commentaires seront ouverts une fois la recette publiée." });
    }
    if (monCommentaire) {
        return h('p', { className: 'notice', text: "Vous avez déjà commenté cette recette : vous pouvez modifier votre commentaire ci-dessous." });
    }

    const form = h('form', { id: 'addCommentForm', novalidate: true },
        field({ id: 'commentContenu', label: "Votre commentaire", multiline: true, required: true, maxlength: COMMENTAIRE_MAX,
            placeholder: "Une astuce, une variante, votre avis…" }),
        h('p', { className: 'form-hint char-count', text: `0 / ${COMMENTAIRE_MAX}` }),
        h('button', { id: 'FormSubmit', type: 'submit', text: "Publier" }));
    const contenu = form.querySelector('#commentContenu');
    const compteur = form.querySelector('.char-count');
    const bouton = form.querySelector('button[type="submit"]');

    contenu.addEventListener('input', () => {
        compteur.textContent = `${contenu.value.length} / ${COMMENTAIRE_MAX}`;
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const texte = contenu.value.trim();
        if (!validate(form, [[contenu, "Le commentaire doit contenir entre 2 et 2000 caractères.", texte.length >= 2 && texte.length <= COMMENTAIRE_MAX]])) {
            return;
        }
        setButtonLoading(bouton, true, "Envoi…");
        try {
            await apiPost('Commentaire', { fk_recette: recette.pk_recette, contenu: texte });
            toast(isAdmin() ? "Commentaire envoyé." : "Merci ! Votre commentaire sera visible après validation.", 'success');
            recharger();
        } catch (error) {
            setButtonLoading(bouton, false);
            if (!handleAuthError(error)) {
                setFormError(form, errorMessage(error));
            }
        }
    });
    return form;
}

function commentaireItem(commentaire, recharger) {
    const enAttente = !commentaire.est_approuve;
    const mien = isOwner(commentaire.fk_compte);
    const contenu = h('p', { className: 'commentaire-contenu', text: commentaire.contenu });
    const actions = h('div', { className: 'commentaire-actions' });
    const item = h('article', { className: 'commentaire' + (enAttente ? ' commentaire-pending' : '') },
        h('header', { className: 'commentaire-meta' },
            h('strong', { text: commentaire.auteur_pseudo ?? "Compte supprimé" }),
            h('time', { datetime: commentaire.date_creation.replace(' ', 'T'), text: formatDate(commentaire.date_creation, true) }),
            enAttente && h('span', { className: 'badge badge-pending', text: "En attente de validation" })),
        contenu,
        actions);

    const cible = { fk_recette: commentaire.fk_recette, fk_compte: commentaire.fk_compte };

    if (mien) {
        actions.append(h('button', { type: 'button', className: 'link-button', text: "Modifier",
            onClick: () => modifierCommentaire(commentaire, contenu, actions, recharger) }));
    }
    if (isAdmin() && enAttente) {
        actions.append(h('button', { type: 'button', className: 'link-button', text: "Approuver",
            onClick: event => action(event.currentTarget, "Validation…", () => apiPut('Commentaire', { ...cible, est_approuve: true }),
                "Commentaire approuvé.", recharger) }));
    }
    if (mien || isAdmin()) {
        actions.append(h('button', { type: 'button', className: 'link-button link-danger', text: "Supprimer",
            onClick: event => {
                if (confirm("Supprimer ce commentaire ?")) {
                    action(event.currentTarget, "Suppression…", () => apiDelete('Commentaire', cible), "Commentaire supprimé.", recharger);
                }
            } }));
    }
    return item;
}

// Exécute une action d'un bouton : état d'attente, notification, rechargement de la liste
async function action(bouton, attente, requete, succes, recharger) {
    setButtonLoading(bouton, true, attente);
    try {
        await requete();
        toast(succes, 'success');
        recharger();
    } catch (error) {
        setButtonLoading(bouton, false);
        handleActionError(error);
    }
}

// Édition en place de son propre commentaire
function modifierCommentaire(commentaire, contenu, actions, recharger) {
    const id = `edit-${commentaire.fk_recette}`;
    const form = h('form', { className: 'commentaire-edit', novalidate: true },
        field({ id, label: "Modifier votre commentaire", multiline: true, required: true, maxlength: COMMENTAIRE_MAX,
            text: commentaire.contenu }),
        h('div', { className: 'form-buttons' },
            h('button', { type: 'submit', className: 'btn btn-primary btn-small', text: "Enregistrer" }),
            h('button', { type: 'button', className: 'btn btn-secondary btn-small', text: "Annuler", onClick: () => {
                form.replaceWith(contenu);
                actions.hidden = false;
            } })));
    const zone = form.querySelector('textarea');
    const bouton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const texte = zone.value.trim();
        if (!validate(form, [[zone, "Le commentaire doit contenir entre 2 et 2000 caractères.", texte.length >= 2 && texte.length <= COMMENTAIRE_MAX]])) {
            return;
        }
        setButtonLoading(bouton, true, "Enregistrement…");
        try {
            await apiPut('Commentaire', { fk_recette: commentaire.fk_recette, contenu: texte });
            toast(isAdmin() ? "Commentaire modifié." : "Commentaire modifié : il sera de nouveau visible après validation.", 'success');
            recharger();
        } catch (error) {
            setButtonLoading(bouton, false);
            if (!handleAuthError(error)) {
                setFormError(form, errorMessage(error));
            }
        }
    });

    contenu.replaceWith(form);
    actions.hidden = true;
    zone.focus();
}
