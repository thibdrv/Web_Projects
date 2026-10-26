import { apiGet, apiPost } from './fetch.js';
import { isLogged, onSessionChange } from './session.js';
import { openAuthModal, handleAuthError, loginPrompt } from './compte.js';
import { navigate } from './router.js';
import {
    h, field, validate, setFormError, setButtonLoading, showLoading, showError, showContent, toast, errorMessage,
} from './ui.js';

// Mêmes limites que le backend (RecettePostController)
const NOM_MAX = 100;
const TEXTE_MAX = 15000;
const IMAGE_REGEX = /^public\/image\/[^/\\"<>]+\.(webp|png|jpe?g|gif)$/i;

function isHttpUrl(valeur) {
    try {
        return ['http:', 'https:'].includes(new URL(valeur).protocol);
    } catch {
        return false;
    }
}

// Page « Partager une recette »
export function partager(main) {
    const page = h('section', { className: 'form-container' });
    main.replaceChildren(page);

    const afficher = () => {
        if (isLogged()) {
            afficherFormulaire(page);
        } else {
            afficherInvitation(page);
        }
    };

    // Connexion : on remplace l'invitation par le formulaire.
    // Déconnexion pendant la saisie : on garde le formulaire pour ne pas perdre le texte.
    onSessionChange(() => {
        if (isLogged() && !page.querySelector('#formRecette')) {
            afficherFormulaire(page);
        } else if (!isLogged() && !page.querySelector('#formRecette')) {
            afficherInvitation(page);
        }
    }, page);
    afficher();
}

function afficherInvitation(page) {
    page.replaceChildren(
        h('h2', { text: "Partager une recette" }),
        h('p', { className: 'lead', text: "Vous devez être connecté pour proposer une recette à la communauté." }),
        h('div', { className: 'hero-actions' },
            h('button', { type: 'button', className: 'btn btn-primary', text: "Se connecter", onClick: () => openAuthModal('login') }),
            h('button', { type: 'button', className: 'btn btn-secondary', text: "Créer un compte", onClick: () => openAuthModal('signup') }))
    );
}

function afficherFormulaire(page) {
    const categories = h('div', { id: 'categoriesList', className: 'checkbox-list', role: 'group', 'aria-describedby': 'categories-error' });
    const form = h('form', { id: 'formRecette', novalidate: true },
        field({ id: 'nom', label: "Nom de la recette", required: true, maxlength: NOM_MAX, placeholder: "Ex. : Tarte aux pommes de Mamie" }),

        h('fieldset', { className: 'form-field' },
            h('legend', {}, "Catégories", h('span', { className: 'required', text: ' *' })),
            categories,
            h('p', { className: 'field-error', id: 'categories-error', 'aria-live': 'polite' })),

        field({ id: 'ingredients', label: "Ingrédients", multiline: true, required: true, rows: 6, maxlength: TEXTE_MAX,
            placeholder: "Un ingrédient par ligne\n200 g de farine\n3 œufs…" }),
        field({ id: 'details', label: "Préparation", multiline: true, required: true, rows: 8, maxlength: TEXTE_MAX,
            placeholder: "Les étapes, les temps de cuisson, vos astuces…" }),
        field({ id: 'image', label: "Image (facultatif)", type: 'url', maxlength: 255,
            placeholder: "https://… ou public/image/ma-recette.webp", hint: "Adresse d'une photo en ligne (http/https) ou fichier du dossier public/image/." }),
        field({ id: 'lien', label: "Vidéo (facultatif)", type: 'url', maxlength: 255,
            placeholder: "https://www.youtube.com/watch?v=…" }),

        h('button', { type: 'submit', text: "Envoyer la recette" }),
        h('p', { className: 'form-note', text: "Votre recette sera visible par tous après validation par un administrateur." })
    );
    // Le type "url" refuserait le chemin relatif public/image/... : la validation est faite par validerFormulaire()
    form.querySelector('#image').type = 'text';

    showContent(page,
        h('h2', { text: "Partager une recette" }),
        h('p', { className: 'lead', text: "Les champs marqués d'une * sont obligatoires." }),
        form);

    chargerCategories(categories);
    form.addEventListener('submit', event => {
        event.preventDefault();
        envoyer(form, categories);
    });
}

async function chargerCategories(container) {
    showLoading(container, "Chargement des catégories…");
    try {
        const liste = await apiGet('Categorie');
        if (!container.isConnected) {
            return;
        }
        showContent(container, liste.map(categorie =>
            h('label', { className: 'checkbox' },
                h('input', { type: 'checkbox', name: 'categories', value: categorie.pk_categorie }),
                h('span', { text: categorie.nom }))));
    } catch (error) {
        if (container.isConnected) {
            showError(container, error, () => chargerCategories(container));
        }
    }
}

function validerFormulaire(form, categoriesCochees) {
    const valeur = id => form.querySelector('#' + id).value.trim();
    const nom = valeur('nom');
    const ingredients = valeur('ingredients');
    const details = valeur('details');
    const image = valeur('image');
    const lien = valeur('lien');

    const champsValides = validate(form, [
        [form.querySelector('#nom'), `Le nom doit contenir entre 3 et ${NOM_MAX} caractères.`, nom.length >= 3 && nom.length <= NOM_MAX],
        [form.querySelector('#ingredients'), "Indiquez les ingrédients (3 caractères minimum).", ingredients.length >= 3 && ingredients.length <= TEXTE_MAX],
        [form.querySelector('#details'), "Décrivez la préparation (5 caractères minimum).", details.length >= 5 && details.length <= TEXTE_MAX],
        [form.querySelector('#image'), "Indiquez une adresse http(s) ou un fichier public/image/nom.webp (png, jpg, gif).",
            image === '' || isHttpUrl(image) || IMAGE_REGEX.test(image)],
        [form.querySelector('#lien'), "Indiquez une adresse commençant par http:// ou https://.", lien === '' || isHttpUrl(lien)],
    ]);

    const erreurCategories = form.querySelector('#categories-error');
    const categoriesValides = categoriesCochees.length > 0;
    erreurCategories.textContent = categoriesValides ? '' : "Choisissez au moins une catégorie.";
    erreurCategories.classList.toggle('show', !categoriesValides);
    if (!categoriesValides && champsValides) {
        form.querySelector('input[name="categories"]')?.focus();
    }

    if (!champsValides || !categoriesValides) {
        return null;
    }
    return {
        nom,
        ingredients,
        details,
        categories: categoriesCochees,
        ...(image !== '' && { image }),
        ...(lien !== '' && { lien }),
    };
}

async function envoyer(form, categories) {
    const cochees = [...categories.querySelectorAll('input[name="categories"]:checked')].map(input => Number(input.value));
    const recette = validerFormulaire(form, cochees);
    if (recette === null) {
        return;
    }

    const bouton = form.querySelector('button[type="submit"]');
    setButtonLoading(bouton, true, "Envoi de la recette…");
    try {
        const creee = await apiPost('Recette', recette);
        toast("Recette envoyée ! Elle sera publiée après validation.", 'success');
        navigate(`/recette/${creee.pk_recette}`);
    } catch (error) {
        setButtonLoading(bouton, false);
        if (handleAuthError(error)) {
            setFormError(form, "Votre session a expiré : reconnectez-vous puis renvoyez le formulaire (votre saisie est conservée).");
            return;
        }
        setFormError(form, errorMessage(error));
        form.querySelector('.form-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
