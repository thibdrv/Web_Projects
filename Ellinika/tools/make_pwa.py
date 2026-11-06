"""Make sw.js (the service worker) and audio-list.json for the installable (PWA) version of the app.
   Run it again BEFORE you put the app online each time you changed something:
       python -X utf8 tools/make_pwa.py
   - sw.js: the list of the app files (page, styles, scripts, data, icons) and a version made from their content.
     When one file changes, the version changes, the phones and computers that installed the app notice it and update by themselves.
   - audio-list.json: the names of all the sound files, for the button "Download everything for offline use".
   The sounds (audio/) are not in the list of the app files: they are kept one by one the first time they are played (or all at once with the button). """
import hashlib, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP_DIRS = {"audio", "original", "tools", "__pycache__", ".git", ".claude"}
SKIP_FILES = {"sw.js", "audio-list.json", "LISEZMOI.md", "relecture-grec.html"}
EXT = {".html", ".css", ".js", ".json", ".webmanifest", ".png", ".svg", ".ico"}

def shell_files():
    out = []
    for p in sorted(ROOT.rglob("*")):
        if not p.is_file(): continue
        rel = p.relative_to(ROOT)
        if rel.parts[0] in SKIP_DIRS or p.name in SKIP_FILES or p.suffix.lower() not in EXT or p.name.endswith((".bak", ".tmp")): continue
        out.append(rel.as_posix())
    return out

TEMPLATE = r'''/* Service worker of Elliniká: made by tools/make_pwa.py, do not edit by hand.
   - the app files are kept at the first visit (so the app opens without internet), and replaced as soon as a newer version is online
   - the sounds are kept when they are played (or all at once from the About page) and are never fetched twice
   - the fonts of Google Fonts are kept too */
const VERSION = "__VERSION__";
const SHELL = "shell-" + VERSION, AUDIO = "audio-v1", FONTS = "fonts-v1";
const FILES = __FILES__;

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
'''

def main():
    files = shell_files()
    h = hashlib.sha1()
    for f in files:
        h.update(f.encode()); h.update((ROOT / f).read_bytes())
    version = h.hexdigest()[:10]
    sw = TEMPLATE.replace("__VERSION__", version).replace("__FILES__", json.dumps(["./"] + files, indent=1))
    (ROOT / "sw.js").write_text(sw, encoding="utf-8")
    mp3 = sorted((ROOT / "audio").glob("*.mp3"))
    total = sum(p.stat().st_size for p in mp3)
    (ROOT / "audio-list.json").write_text(json.dumps({"files": [p.name for p in mp3], "bytes": total}), encoding="utf-8")
    print(f"sw.js: version {version}, {len(files)} app files ({sum((ROOT / f).stat().st_size for f in files) // 1024} KB)")
    print(f"audio-list.json: {len(mp3)} sounds ({total // 1048576} MB)")

if __name__ == "__main__":
    main()
