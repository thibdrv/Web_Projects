// Navigation par ancre (#/recettes, #/recette/12...) : le bouton « retour » du navigateur
// fonctionne et chaque page a une adresse partageable.

let routes = [];
let notFoundView = null;

// routes : [{ path: /^\/recette\/(\d+)$/, view: (main, ...params) => {...} }]
export function startRouter(routeList, notFound) {
    routes = routeList;
    notFoundView = notFound;
    window.addEventListener('hashchange', render);
    render();
}

export function currentPath() {
    return window.location.hash.replace(/^#/, '') || '/';
}

export function navigate(path) {
    if (currentPath() === path) {
        render(); // même adresse : on réaffiche simplement la page
    } else {
        window.location.hash = path;
    }
}

// Met en évidence le lien de la page courante dans la barre de navigation
export function updateActiveLinks() {
    const path = currentPath();
    document.querySelectorAll('#navbar a[href^="#/"]').forEach(link => {
        const target = link.getAttribute('href').slice(1);
        // une fiche recette (#/recette/12) fait partie de la rubrique « Recettes »
        const active = target === '/'
            ? path === '/'
            : path.startsWith(target) || (target === '/recettes' && path.startsWith('/recette/'));
        link.classList.toggle('active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function render() {
    const main = document.getElementById('main');
    const path = currentPath();
    window.scrollTo({ top: 0 });
    updateActiveLinks();

    for (const route of routes) {
        const match = path.match(route.path);
        if (match) {
            route.view(main, ...match.slice(1));
            main.focus({ preventScroll: true }); // les lecteurs d'écran annoncent la nouvelle page
            return;
        }
    }
    notFoundView(main);
}
