/* ---------- the installable app (PWA) ----------
   When the app is opened from a web address (https), the browser can install it like a normal app (icon, own window, works without internet).
   - sw.js (made by tools/make_pwa.py) keeps the app files and the sounds, and updates them when a newer version is online
   - this file registers it, shows the "Install the app" and "Download everything" buttons on the About page,
     and tells you when a new version has been installed ("Reload")
   Nothing happens when the app is opened from the file (file://): the browsers do not allow it there. */
const PWA = {
  web: location.protocol === "http:" || location.protocol === "https:",
  deferred: null, dismissed: false, busy: false, stop: false,
  standalone: () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true,
  ios: () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
  audioUrl: name => new URL("audio/" + name, location.href).href
};

if(PWA.web && "serviceWorker" in navigator){
  let hadController = !!navigator.serviceWorker.controller;
  addEventListener("load", ()=>{ navigator.serviceWorker.register("sw.js").catch(()=>{}); });
  navigator.serviceWorker.addEventListener("controllerchange", ()=>{ if(hadController) showUpdateToast(); hadController = true; });
}
addEventListener("beforeinstallprompt", e=>{ e.preventDefault(); PWA.deferred = e; renderPwa(); });
addEventListener("appinstalled", ()=>{ PWA.deferred = null; PWA.dismissed = false; renderPwa(); });

/* a small message at the bottom of the screen, with a button if you give one */
function pwaToast(text, action, opt={}){
  const old = $("pwaToast"); if(old) old.remove();
  const t = document.createElement("div"); t.id = "pwaToast"; t.className = "pwatoast"; t.setAttribute("role", "status");
  t.innerHTML = `${opt.owl && typeof mascot==="function" ? `<span class="toastowl" aria-hidden="true">${mascot("cheer", 40)}</span>` : ""}<span>${esc(text)}</span>${action ? `<button type="button" class="btn">${esc(action.label)}</button>` : ""}<button type="button" class="pwaclose" aria-label="${esc(tx("Close"))}">×</button>`;
  if(action) t.querySelector(".btn").onclick = action.run;
  t.querySelector(".pwaclose").onclick = ()=>t.remove();
  document.body.appendChild(t);
}
function showUpdateToast(){ pwaToast(tx("A new version of the app is ready."), {label: tx("Reload"), run: ()=>location.reload()}); }

/* the "Install the app" button of the settings (the gear on the home page).
   It is always there: it installs the app when the browser allows it, and otherwise tells how to do it (or that the app must be online first). */
function pwaButton(){
  const b = $("pwaSet"); if(!b) return;
  const done = PWA.standalone();
  const f = $("footInstall"); if(f){ f.hidden = done; f.onclick = ()=>b.click(); }
  b.querySelector(".pwa-yes").hidden = done; b.querySelector(".pwa-done").hidden = !done;
  b.setAttribute("aria-disabled", done ? "true" : "false");
  if(b._set) return; b._set = true;
  b.onclick = async ()=>{
    if(PWA.standalone()) return;
    if(!PWA.web){ pwaToast(tx("To install the app on a phone or a computer, open it from its web address (https). From the file on this computer it already works as it is.")); return; }
    if(PWA.deferred){
      const d = PWA.deferred; PWA.deferred = null;
      try{ d.prompt(); await d.userChoice; }catch(e){}
      renderPwa();
    } else if(PWA.ios()) pwaToast(tx("On iPhone and iPad: tap the Share button, then “Add to Home Screen”."));
    else pwaToast(tx("Look for the install icon in the address bar, or in the menu of the browser (“Install app” or “Add to Home screen”)."));
  };
}
pwaButton();

async function pwaAudioList(){
  try{ const r = await fetch("audio-list.json", {cache: "no-cache"}); return r.ok ? await r.json() : null; }catch(e){ return null; }
}
async function pwaCount(){
  try{ const c = await caches.open("audio-v1"); return (await c.keys()).length; }catch(e){ return 0; }
}

async function renderPwa(){
  pwaButton();
  const card = $("pwaCard"); if(!card) return;
  const text = $("pwaText"), ios = $("pwaIos"), off = $("pwaOffSection");
  ios.hidden = true; off.hidden = !PWA.web || !("caches" in window);
  if(!PWA.web){
    text.textContent = tx("To install the app on a phone or a computer, open it from its web address (https). From the file on this computer it already works as it is.");
    return;
  }
  if(PWA.standalone()) text.textContent = tx("The app is installed on this device. It opens in its own window and updates itself when a new version is online.");
  else if(PWA.deferred){
    text.textContent = tx("Put Elliniká on your home screen or desktop: it opens like a normal app, full screen, and works without internet.");
  } else if(PWA.ios()){
    text.textContent = tx("Put Elliniká on your home screen: it opens like a normal app, full screen, and works without internet.");
    ios.hidden = false; ios.textContent = tx("On iPhone and iPad: tap the Share button, then “Add to Home Screen”.");
  } else {
    text.textContent = tx("Put Elliniká on your home screen or desktop. Look for the install icon in the address bar, or in the menu of the browser (“Install app” or “Add to Home screen”).");
  }
  if(off.hidden || PWA.busy) return;
  const btn = $("pwaOffline"), status = $("pwaStatus"), list = await pwaAudioList();
  if(!list){ btn.hidden = true; status.textContent = ""; return; }
  const have = await pwaCount(), mb = Math.round(list.bytes / 1048576);
  btn.hidden = false; btn.disabled = false;
  $("pwaOffText").textContent = tx("The app files are kept after the first visit. To have all the sounds too (about {mb} MB, best on Wi-Fi), download them now.", {mb});
  if(have >= list.files.length){ btn.textContent = tx("Check again"); status.textContent = tx("All the sounds are saved on this device."); status.className = "feedback good"; }
  else { btn.textContent = tx("Download everything for offline use"); status.textContent = tx("{n} of {total} sounds saved.", {n:have, total:list.files.length}); status.className = "feedback"; }
  btn.onclick = ()=>pwaDownload(list);
}

async function pwaDownload(list){
  if(PWA.busy){ PWA.stop = true; return; }                 /* the same button stops the download */
  PWA.busy = true; PWA.stop = false;
  const btn = $("pwaOffline"), status = $("pwaStatus"), bar = $("pwaBar"), fill = bar.firstElementChild;
  btn.textContent = tx("Stop"); bar.hidden = false; status.className = "feedback";
  try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}
  let failed = 0, done = 0;
  try{
    const c = await caches.open("audio-v1");
    const have = new Set((await c.keys()).map(r=>r.url));
    const todo = list.files.filter(n=>!have.has(PWA.audioUrl(n))), total = list.files.length;
    done = total - todo.length;
    const show = ()=>{ fill.style.width = (100 * done / total) + "%"; status.textContent = tx("{n} of {total} sounds saved.", {n:done, total}); };
    show();
    let i = 0;
    const worker = async ()=>{
      while(!PWA.stop && i < todo.length){
        const n = todo[i++], url = PWA.audioUrl(n);
        try{ const r = await fetch(url); if(r.ok){ await c.put(url, r); done++; } else failed++; }catch(e){ failed++; }
        if(done % 10 === 0) show();
      }
    };
    await Promise.all(Array.from({length:6}, worker));
    show();
  }catch(e){ failed++; }
  PWA.busy = false; bar.hidden = true;
  await renderPwa();
  if(failed){ const s = $("pwaStatus"); s.textContent += " " + tx("Some files could not be downloaded: try again."); s.className = "feedback bad"; }
}
