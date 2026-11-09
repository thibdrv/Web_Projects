/* Service worker of Elliniká: made by tools/make_pwa.py, do not edit by hand.
   - the app files are kept at the first visit (so the app opens without internet), and replaced as soon as a newer version is online
   - the sounds are kept when they are played (or all at once from the About page) and are never fetched twice
   - the fonts of Google Fonts are kept too */
const VERSION = "8032c0f252";
const SHELL = "shell-" + VERSION, AUDIO = "audio-v1", FONTS = "fonts-v1";
const FILES = [
 "./",
 "css/ambient.css",
 "css/anim.css",
 "css/diagrams.css",
 "css/extras.css",
 "css/footer.css",
 "css/home.css",
 "css/homenew.css",
 "css/homeux.css",
 "css/icons.css",
 "css/mascot.css",
 "css/motion.css",
 "css/pages.css",
 "css/realscene.css",
 "css/settings.css",
 "css/style.css",
 "css/submenu.css",
 "css/theme.css",
 "data/body.js",
 "data/city.js",
 "data/clock.js",
 "data/clothes.js",
 "data/colors.js",
 "data/cooking.js",
 "data/customs.js",
 "data/cypriot.js",
 "data/dialogues.js",
 "data/directions.js",
 "data/examples.js",
 "data/families.js",
 "data/family.js",
 "data/food.js",
 "data/fr.js",
 "data/geo.js",
 "data/grammar.js",
 "data/grammar2.js",
 "data/grammar3.js",
 "data/grammar4.js",
 "data/grammar5.js",
 "data/grammar6.js",
 "data/greek-data.js",
 "data/greetings.js",
 "data/holidays.js",
 "data/house.js",
 "data/icons.js",
 "data/jobs.js",
 "data/levelq.js",
 "data/money.js",
 "data/nature.js",
 "data/news.js",
 "data/numbers.js",
 "data/opposites.js",
 "data/phrases.js",
 "data/poems.js",
 "data/readings.js",
 "data/recipes.js",
 "data/scenes.js",
 "data/songs.js",
 "data/sounds.js",
 "data/stories.js",
 "data/talk.js",
 "data/texts.js",
 "data/time.js",
 "data/topics.js",
 "data/verbs2.js",
 "data/wordbank.js",
 "icons/apple-touch-icon.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/maskable-512.png",
 "index.html",
 "js/about.js",
 "js/account.js",
 "js/alphabet.js",
 "js/ambient.js",
 "js/anim.js",
 "js/audio.js",
 "js/backup.js",
 "js/bodydiagram.js",
 "js/calendar.js",
 "js/challenge.js",
 "js/clock.js",
 "js/colors.js",
 "js/customs.js",
 "js/cypriot.js",
 "js/dialogues.js",
 "js/dictionary.js",
 "js/difficulties.js",
 "js/examples.js",
 "js/families.js",
 "js/favorites.js",
 "js/flashcards.js",
 "js/garments.js",
 "js/grammar.js",
 "js/grammar2.js",
 "js/grammar3.js",
 "js/grammar4.js",
 "js/grammar5.js",
 "js/grammar6.js",
 "js/gsync.js",
 "js/handwriting.js",
 "js/helpers.js",
 "js/homefx.js",
 "js/homeui.js",
 "js/i18n.js",
 "js/iconify.js",
 "js/levels.js",
 "js/leveltest.js",
 "js/main.js",
 "js/map.js",
 "js/mascot.js",
 "js/news.js",
 "js/numbers.js",
 "js/owl.js",
 "js/phrases.js",
 "js/poems.js",
 "js/practice.js",
 "js/progress.js",
 "js/progressview.js",
 "js/pwa.js",
 "js/quicksearch.js",
 "js/quiz.js",
 "js/router.js",
 "js/scenes-grammar.js",
 "js/scenes.js",
 "js/selftest.js",
 "js/settings.js",
 "js/sounds.js",
 "js/stats.js",
 "js/stories.js",
 "js/strokes.js",
 "js/talk.js",
 "js/texts.js",
 "js/theme.js",
 "js/today.js",
 "js/transliteration.js",
 "js/vocab.js",
 "js/welcome.js",
 "js/wordgames.js",
 "manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    await Promise.all(FILES.map(f => c.add(new Request(f, {cache: "reload"})).catch(() => {})));   /* one missing file must not stop the install */
    self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("shell-") && k !== SHELL) await caches.delete(k);
    await self.clients.claim();
  })());
});

/* a sound asked with a Range (Safari does it): answer from the whole file kept in the cache */
async function rangeFrom(res, range){
  const buf = await res.arrayBuffer(), m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const start = m[1] ? +m[1] : 0, end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {status: 206, statusText: "Partial Content",
    headers: {"Content-Type": res.headers.get("Content-Type") || "audio/mpeg", "Content-Range": `bytes ${start}-${end}/${buf.byteLength}`, "Content-Length": String(end - start + 1)}});
}
async function audio(req){
  const c = await caches.open(AUDIO), key = req.url;
  let hit = await c.match(key);
  const range = req.headers.get("range");
  if(hit) return range ? rangeFrom(hit, range) : hit;
  const res = await fetch(new Request(key));                  /* the whole file (not the range), to keep it */
  if(res.ok && res.status === 200){ c.put(key, res.clone()).catch(() => {}); return range ? rangeFrom(res, range) : res; }
  return res;
}
async function fonts(req){
  const c = await caches.open(FONTS), hit = await c.match(req);
  const net = fetch(req).then(r => { if(r.ok || r.type === "opaque") c.put(req, r.clone()).catch(() => {}); return r; }).catch(() => hit);
  return hit || net;
}
/* the app files: the online version first (checked every time), the kept one when there is no internet or it is too slow */
async function app(req){
  const c = await caches.open(SHELL);
  const kept = () => c.match(req, {ignoreSearch: true}).then(r => r || (req.mode === "navigate" ? c.match("index.html") : undefined));
  try{
    const res = await Promise.race([
      fetch(req, {cache: "no-cache"}),
      new Promise((_, no) => setTimeout(() => no(new Error("slow")), 6000))
    ]);
    if(res && res.ok && res.type === "basic" && res.status === 200){ c.put(req, res.clone()).catch(() => {}); return res; }
    return (await kept()) || res;
  }catch(err){
    const r = await kept();
    if(r) return r;
    throw err;
  }
}
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin === location.origin){
    if(url.pathname.endsWith(".mp3")) e.respondWith(audio(req));
    else if(url.pathname.endsWith("/sw.js") || url.pathname.endsWith("audio-list.json")) return;
    else e.respondWith(app(req));
  } else if(url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com"){
    e.respondWith(fonts(req));
  }
});
