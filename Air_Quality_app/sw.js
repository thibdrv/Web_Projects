/*
 * Service worker: keeps the app shell available offline.
 *
 * - The shell (HTML, CSS, JS, fonts, icons) is pre-cached on install.
 * - Strategy "network first, cache as a fallback": while online you always get
 *   the latest files (no stale version after an update); offline, or when the
 *   network takes more than a few seconds, the cached copy is used.
 * - When a new version replaces an old one, open pages are reloaded once so
 *   nobody keeps running outdated files.
 * - Air quality data (a cross-origin API) is NOT handled here: the page keeps
 *   its own copy of the last data in localStorage and labels it "offline copy".
 *
 * Bump VERSION whenever a shell file is added, removed or renamed.
 */
const VERSION = "v19";
const CACHE = "air-quality-" + VERSION;
const SLOW_NETWORK_MS = 4000;
const SHELL = [
  "./",
  "index.html",
  "style.css",
  "aqi.js",
  "map.js",
  "i18n.js",
  "main.js",
  "favicon.svg",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "fonts/inter-latin.woff2",
  "fonts/inter-latin-ext.woff2",
  "fonts/inter-greek.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // "reload" bypasses the HTTP cache so the copies are really fresh.
      .then((cache) =>
        Promise.all(SHELL.map((url) => cache.add(new Request(url, { cache: "reload" }))))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const old = keys.filter((k) => k.startsWith("air-quality-") && k !== CACHE);
      await Promise.all(old.map((k) => caches.delete(k)));
      await self.clients.claim();
      // Updating from an older version: refresh the open pages once.
      if (old.length) {
        const pages = await self.clients.matchAll({ type: "window" });
        pages.forEach((page) => page.navigate(page.url).catch(() => {}));
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Page loads (also with ?city=... query strings) share one cached index.
  const isPage = request.mode === "navigate";

  event.respondWith(
    (async () => {
      const cached = isPage
        ? await caches.match("index.html")
        : await caches.match(request, { ignoreSearch: true });

      try {
        const network = fetch(request);
        // With a cached copy at hand, don't wait forever on a bad connection.
        const response = cached
          ? await Promise.race([
              network,
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("slow")), SLOW_NETWORK_MS)
              ),
            ])
          : await network;
        if (response && response.ok) {
          const copy = response.clone();
          caches
            .open(CACHE)
            .then((cache) => cache.put(isPage ? "index.html" : request, copy));
        }
        return response;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    })()
  );
});
