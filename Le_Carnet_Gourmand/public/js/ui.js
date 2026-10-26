import { ApiError } from './exceptions.js';

// ---------------------------------------------------------------------------
// Création d'éléments sans innerHTML : les données venant de l'API (noms, commentaires...)
// sont toujours insérées comme texte, jamais interprétées comme du HTML (protection XSS).
//   h('a', { className: 'btn', href: '#/recettes', text: 'Voir' })
//   h('div', { className: 'card' }, titre, paragraphe)
// ---------------------------------------------------------------------------
export function h(tag, props = {}, ...children) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (value === undefined || value === null || value === false) {
            continue;
        }
        if (key === 'className') {
            element.className = value;
        } else if (key === 'text') {
            element.textContent = value;
        } else if (key === 'dataset') {
            Object.assign(element.dataset, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (value === true) {
            element.setAttribute(key, '');
        } else {
            element.setAttribute(key, value);
        }
    }
    for (const child of children.flat()) {
        if (child === null || child === undefined || child === false) {
            continue;
        }
        element.append(child instanceof Node ? child : String(child));
    }
    return element;
}

// Message lisible pour n'importe quelle erreur
export function errorMessage(error) {
    if (error instanceof ApiError) {
        return error.message;
    }
    console.error(error);
    return "Une erreur inattendue est survenue.";
}

// ---------------------------------------------------------------------------
// États d'une zone de la page : chargement, erreur, vide
// ---------------------------------------------------------------------------
export function showLoading(container, message = "Chargement…") {
    container.setAttribute('aria-busy', 'true');
    container.replaceChildren(
        h('div', { className: 'loading', role: 'status' },
            h('span', { className: 'spinner', 'aria-hidden': 'true' }),
            h('span', { text: message }))
    );
}

// Affiche l'erreur et, si onRetry est fourni, un bouton « Réessayer »
export function showError(container, error, onRetry = null) {
    container.removeAttribute('aria-busy');
    const network = error instanceof ApiError && error.network;
    container.replaceChildren(
        h('div', { className: 'error-box' + (network ? ' error-network' : ''), role: 'alert' },
            h('p', { text: (network ? "📡 " : "⚠️ ") + errorMessage(error) }),
            onRetry && h('button', { type: 'button', className: 'btn btn-secondary btn-small', onClick: onRetry, text: "Réessayer" }))
    );
}

export function showEmpty(container, message) {
    container.removeAttribute('aria-busy');
    container.replaceChildren(h('p', { className: 'empty-state', text: message }));
}

// Remplace le contenu d'une zone une fois les données reçues (les valeurs vides sont ignorées)
export function showContent(container, ...children) {
    container.removeAttribute('aria-busy');
    container.replaceChildren(...children.flat().filter(child => child !== null && child !== undefined && child !== false && child !== ''));
}

// ---------------------------------------------------------------------------
// Notification temporaire en bas de l'écran (#toast dans index.html)
// type : 'info' | 'success' | 'error'
// ---------------------------------------------------------------------------
let toastTimer = null;
export function toast(message, type = 'info') {
    const element = document.getElementById('toast');
    if (!element) {
        return;
    }
    element.textContent = message;
    element.className = `toast show toast-${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('show'), type === 'error' ? 6000 : 3500);
}

export function toastError(error) {
    toast(errorMessage(error), 'error');
}

// ---------------------------------------------------------------------------
// Boutons et formulaires
// ---------------------------------------------------------------------------

// Désactive le bouton pendant l'envoi et affiche un libellé d'attente
export function setButtonLoading(button, loading, label = "Envoi…") {
    if (loading) {
        button.dataset.label = button.textContent;
        button.textContent = label;
        button.disabled = true;
        button.classList.add('is-loading');
    } else {
        button.textContent = button.dataset.label ?? button.textContent;
        button.disabled = false;
        button.classList.remove('is-loading');
    }
}

// Champ de formulaire avec libellé, zone de saisie et message d'erreur
//   field({ id: 'email', label: 'Email', type: 'email', required: true })
export function field({ id, label, type = 'text', required = false, multiline = false, hint = null, ...attrs }) {
    const input = multiline
        ? h('textarea', { id, name: id, required, ...attrs })
        : h('input', { id, name: id, type, required, ...attrs });
    const error = h('p', { className: 'field-error', id: `${id}-error`, 'aria-live': 'polite' });
    input.setAttribute('aria-describedby', error.id);
    return h('div', { className: 'form-field' },
        h('label', { for: id }, label, required && h('span', { className: 'required', text: ' *' })),
        h('div', { className: 'input-group' }, input),
        hint && h('p', { className: 'form-hint', text: hint }),
        error);
}

export function setFieldError(input, message) {
    const group = input.closest('.input-group');
    const error = document.getElementById(`${input.id}-error`);
    group?.classList.toggle('invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) {
        error.textContent = message ?? '';
        error.classList.toggle('show', Boolean(message));
    }
}

// Message d'erreur général du formulaire (erreur serveur ou réseau)
export function setFormError(form, message) {
    let box = form.querySelector(':scope > .form-error');
    if (!box) {
        box = h('div', { className: 'form-error', role: 'alert' });
        form.prepend(box);
    }
    box.textContent = message ?? '';
    box.hidden = !message;
}

export function clearFormErrors(form) {
    form.querySelectorAll('input, textarea, select').forEach(input => setFieldError(input, null));
    setFormError(form, null);
}

// Vérifie chaque règle [input, message si invalide, condition de validité] ; met le focus sur la première erreur
export function validate(form, rules) {
    clearFormErrors(form);
    let firstInvalid = null;
    for (const [input, message, isValid] of rules) {
        if (!isValid) {
            setFieldError(input, message);
            firstInvalid ??= input;
        }
    }
    firstInvalid?.focus();
    return firstInvalid === null;
}

// ---------------------------------------------------------------------------
// Mise en forme
// ---------------------------------------------------------------------------

// "2025-06-13 13:12:31" → "13 juin 2025"
export function formatDate(value, withTime = false) {
    if (!value) {
        return '';
    }
    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return new Intl.DateTimeFormat('fr-FR', withTime ? { dateStyle: 'long', timeStyle: 'short' } : { dateStyle: 'long' })
        .format(date);
}

// Lien YouTube (watch, youtu.be, shorts, embed) → URL intégrable dans une iframe, sinon null
export function youtubeEmbedUrl(link) {
    let url;
    try {
        url = new URL(link);
    } catch {
        return null;
    }
    const host = url.hostname.replace(/^www\.|^m\./, '');
    let id = null;
    if (host === 'youtu.be') {
        id = url.pathname.slice(1);
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
        id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/)?.[1];
    }
    if (!id || !/^[\w-]{6,20}$/.test(id)) {
        return null;
    }
    const start = parseInt(url.searchParams.get('t') ?? '', 10);
    return `https://www.youtube-nocookie.com/embed/${id}` + (start > 0 ? `?start=${start}` : '');
}

// Étoiles de la note moyenne (remplissage proportionnel : 3,5 → 70 %)
export function starsAverage(moyenne) {
    const percent = Math.max(0, Math.min(100, ((moyenne ?? 0) / 5) * 100));
    return h('span', { className: 'stars-average', 'aria-hidden': 'true' },
        h('span', { className: 'stars-empty', text: '☆☆☆☆☆' }),
        h('span', { className: 'stars-fill', style: `width:${percent}%`, text: '★★★★★' }));
}

// Une zone est encore affichée ? (évite d'écrire dans une page quittée pendant un chargement)
export function isDisplayed(element) {
    return element.isConnected;
}
