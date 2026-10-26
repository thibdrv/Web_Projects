import { apiGet, apiPost } from './fetch.js';
import { openModal, closeModal } from './modal.js';
import { setCompte, refreshSession, currentUser } from './session.js';
import { h, field, validate, setFormError, setButtonLoading, toast, toastError, errorMessage } from './ui.js';

// Règles identiques à celles du backend (utils/functions.php)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PSEUDO_REGEX = /^[\p{L}\p{N} ._\-]{3,50}$/u;

function isStrongPassword(password) {
    return password.length >= 12
        && new TextEncoder().encode(password).length <= 72
        && /[A-Z]/.test(password)
        && /[a-z]/.test(password)
        && /[^A-Za-z0-9]/.test(password);
}

// Modale avec deux onglets : « Connexion » et « Inscription »
export function openAuthModal(onglet = 'login') {
    const container = openModal();
    const tabs = h('div', { className: 'modal-tabs', role: 'tablist' });
    const content = h('div');

    const show = (name) => {
        tabs.querySelectorAll('button').forEach(button => {
            const active = button.dataset.tab === name;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        content.replaceChildren(name === 'login' ? loginForm() : signupForm());
        content.querySelector('input')?.focus();
    };

    tabs.append(
        h('button', { type: 'button', role: 'tab', dataset: { tab: 'login' }, text: "Connexion", onClick: () => show('login') }),
        h('button', { type: 'button', role: 'tab', dataset: { tab: 'signup' }, text: "Inscription", onClick: () => show('signup') })
    );
    container.append(h('h2', { id: 'modalTitle', className: 'modal-title', text: "Mon compte" }), tabs, content);
    show(onglet);
}

// Une requête a renvoyé 401 : la session a expiré, on propose de se reconnecter.
// Renvoie true si l'erreur a été traitée ici.
export function handleAuthError(error) {
    if (error?.status !== 401) {
        return false;
    }
    setCompte(null);
    toast("Votre session a expiré : reconnectez-vous.", 'error');
    openAuthModal('login');
    return true;
}

// Erreur d'une action (bouton) : session expirée → reconnexion, sinon notification
export function handleActionError(error) {
    if (!handleAuthError(error)) {
        toastError(error);
    }
}

// Lien vers la connexion, à placer à la place d'une action réservée aux membres
export function loginPrompt(message) {
    return h('p', { className: 'login-prompt' },
        message + " ",
        h('button', { type: 'button', className: 'link-button', text: "Se connecter", onClick: () => openAuthModal('login') }),
        " ou ",
        h('button', { type: 'button', className: 'link-button', text: "créer un compte", onClick: () => openAuthModal('signup') }),
        ".");
}

function loginForm() {
    const form = h('form', { novalidate: true },
        field({ id: 'login-email', label: "Email", type: 'email', required: true, autocomplete: 'email', maxlength: 100 }),
        field({ id: 'login-password', label: "Mot de passe", type: 'password', required: true, autocomplete: 'current-password' }),
        h('button', { type: 'submit', text: "Se connecter" })
    );
    const email = form.querySelector('#login-email');
    const password = form.querySelector('#login-password');
    const submit = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const valid = validate(form, [
            [email, "Saisissez une adresse email valide.", EMAIL_REGEX.test(email.value.trim())],
            [password, "Saisissez votre mot de passe.", password.value !== ''],
        ]);
        if (!valid) {
            return;
        }

        setButtonLoading(submit, true, "Connexion…");
        try {
            const compte = await apiPost('Login', { email: email.value.trim(), mot_de_passe: password.value });
            connecte(compte, `Bienvenue, ${compte.pseudo} !`);
        } catch (error) {
            if (error.status === 409 && await dejaConnecte()) {
                return;
            }
            setFormError(form, errorMessage(error));
            password.select();
        } finally {
            setButtonLoading(submit, false);
        }
    });
    return form;
}

function signupForm() {
    const form = h('form', { novalidate: true },
        field({ id: 'signup-email', label: "Email", type: 'email', required: true, autocomplete: 'email', maxlength: 100 }),
        field({ id: 'signup-pseudo', label: "Pseudo", required: true, autocomplete: 'nickname', maxlength: 50,
            hint: "3 à 50 caractères : lettres, chiffres, espace, . _ -" }),
        field({ id: 'signup-password', label: "Mot de passe", type: 'password', required: true, autocomplete: 'new-password',
            hint: "Au moins 12 caractères, dont une majuscule, une minuscule et un caractère spécial." }),
        field({ id: 'signup-confirm', label: "Confirmation du mot de passe", type: 'password', required: true, autocomplete: 'new-password' }),
        h('button', { type: 'submit', text: "Créer mon compte" })
    );
    const email = form.querySelector('#signup-email');
    const pseudo = form.querySelector('#signup-pseudo');
    const password = form.querySelector('#signup-password');
    const confirm = form.querySelector('#signup-confirm');
    const submit = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const valid = validate(form, [
            [email, "Saisissez une adresse email valide.", EMAIL_REGEX.test(email.value.trim())],
            [pseudo, "3 à 50 caractères : lettres, chiffres, espace, . _ -", PSEUDO_REGEX.test(pseudo.value.trim())],
            [password, "Au moins 12 caractères, dont une majuscule, une minuscule et un caractère spécial.", isStrongPassword(password.value)],
            [confirm, "Les mots de passe ne correspondent pas.", confirm.value === password.value && confirm.value !== ''],
        ]);
        if (!valid) {
            return;
        }

        const identifiants = { email: email.value.trim(), mot_de_passe: password.value };
        setButtonLoading(submit, true, "Création du compte…");
        try {
            await apiPost('Compte', { ...identifiants, pseudo: pseudo.value.trim() });
        } catch (error) {
            setButtonLoading(submit, false);
            if (error.status === 409 && await dejaConnecte()) {
                return;
            }
            setFormError(form, errorMessage(error));
            return;
        }

        // Compte créé : connexion automatique
        try {
            const compte = await apiPost('Login', identifiants);
            connecte(compte, `Compte créé. Bienvenue, ${compte.pseudo} !`);
        } catch (error) {
            closeModal();
            toast("Compte créé. Connectez-vous pour continuer.", 'success');
            openAuthModal('login');
        } finally {
            setButtonLoading(submit, false);
        }
    });
    return form;
}

// Le serveur répond 409 : une session est peut-être déjà ouverte (connexion faite dans un autre onglet).
// Si c'est le cas, on met l'affichage à jour au lieu de laisser l'utilisateur bloqué sur l'erreur.
async function dejaConnecte() {
    try {
        await refreshSession();
    } catch {
        return false;
    }
    if (currentUser() === null) {
        return false; // 409 pour une autre raison (email ou pseudo déjà utilisé...)
    }
    closeModal();
    toast(`Vous êtes déjà connecté (compte ${currentUser().pseudo}).`, 'info');
    return true;
}

function connecte(compte, message) {
    closeModal();
    setCompte(compte);
    toast(message, 'success');
}

export async function logout() {
    try {
        await apiGet('Logout');
        setCompte(null);
        toast("Vous êtes déconnecté.", 'success');
    } catch (error) {
        toastError(error);
    }
}
