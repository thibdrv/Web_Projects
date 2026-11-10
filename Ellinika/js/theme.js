/* ---------- settings button: language and dark / light look ----------
   The page starts dark (see the small script in the <head> of index.html).
   The round ⚙️ button opens the Settings page (js/settings.js): language (English / Français, handled by js/i18n.js), look (Light / Dark / Auto),
   colours, text size, easy-read, Latin letters, voice speed and festive scenery. Every choice is remembered in the browser. */
/* the look: "light", "dark" or "auto" (follows the phone or the computer). themePref is what you chose, the page gets the real look */
/* the text on the colour of a category (--oncat): white, or near black when the colour is light (yellow, green, cyan...), so that it stays readable */
function updateOnCat(){
  try{
    const raw = getComputedStyle(document.body).getPropertyValue("--cat").trim(), m = /^#([0-9a-f]{6})$/i.exec(raw);
    if(!m) return;
    const c = [0,2,4].map(i=>parseInt(m[1].slice(i,i+2),16)/255).map(v=>v<=.03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4));
    const L = .2126*c[0] + .7152*c[1] + .0722*c[2], white = 1.05/(L+.05), dark = (L+.05)/(.0043+.05);
    document.body.style.setProperty("--oncat", white>=4.5 || white>=dark ? "#FFFFFF" : "#0B0B0D");
  }catch(e){}
}
let themePref = "dark";
const systemLook = () => matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
function applyTheme(t){
  if(!["light","dark","auto"].includes(t)) t = "dark";
  themePref = t;
  const real = t==="auto" ? systemLook() : t;
  document.documentElement.dataset.theme = real;
  try{ localStorage.setItem("gl-theme", t); }catch(e){}
  document.querySelectorAll("[data-theme-set]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.themeSet===t));
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = real==="dark" ? "#0B0B0D" : "#F7F2E8";
  updateOnCat();
}
document.querySelectorAll("[data-theme-set]").forEach(b=>b.onclick = () => applyTheme(b.dataset.themeSet));
applyTheme((()=>{ try{ return localStorage.getItem("gl-theme") || (document.documentElement.dataset.theme==="light" ? "light" : "dark"); }catch(e){ return "dark"; } })());
matchMedia("(prefers-color-scheme: light)").addEventListener("change", ()=>{ if(themePref==="auto") applyTheme("auto"); });
/* one colour everywhere instead of one per category: data-accent on <html> (see css/settings.css) */
function applyAccent(a){
  a = ["blue","olive","terra","violet","rose"].includes(a) ? a : "";
  if(a) document.documentElement.dataset.accent = a; else delete document.documentElement.dataset.accent;
  try{ if(a) localStorage.setItem("gl-accent", a); else localStorage.removeItem("gl-accent"); }catch(e){}
  document.querySelectorAll("[data-accent-set]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.accentSet===a));
  updateOnCat();
}
document.querySelectorAll("[data-accent-set]").forEach(b=>b.onclick = ()=>applyAccent(b.dataset.accentSet));
applyAccent((()=>{ try{ return localStorage.getItem("gl-accent") || ""; }catch(e){ return ""; } })());
/* the Latin letters (the pronunciation under the Greek words): always, only when you tap the word, or never (css/settings.css) */
function applyLat(m){
  m = ["always","tap","never"].includes(m) ? m : "always";
  if(m==="always") delete document.documentElement.dataset.lat; else document.documentElement.dataset.lat = m;
  try{ if(m==="always") localStorage.removeItem("gl-lat"); else localStorage.setItem("gl-lat", m); }catch(e){}
  document.querySelectorAll("[data-lat-set]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.latSet===m));
}
document.querySelectorAll("[data-lat-set]").forEach(b=>b.onclick = ()=>applyLat(b.dataset.latSet));
applyLat((()=>{ try{ return localStorage.getItem("gl-lat") || "always"; }catch(e){ return "always"; } })());
/* "tap": a tap on a word shows (or hides again) its Latin letters */
document.addEventListener("click", e=>{
  if(document.documentElement.dataset.lat!=="tap") return;
  let host = e.target;
  for(let i=0; host && host!==document.body && i<6; i++, host = host.parentElement) if(host.querySelector && host.querySelector(".lt, .dlat, .lat")) break;
  if(!host || host===document.body) return;
  const lts = host.querySelectorAll(".lt, .dlat, .lat");
  const hidden = [...lts].some(x=>!x.classList.contains("on"));
  lts.forEach(x=>x.classList.toggle("on", hidden));
}, true);

/* the voice speed: the two buttons of the panel (🐢 Slow) change it */
document.querySelectorAll("[data-speed-set]").forEach(b=>b.onclick = () => setVoiceSlow(b.dataset.speedSet==="slow"));
setVoiceSlow(voiceRate!==1);

/* the text size (A A A), the easy-read look and the festive scenery: kept in gl-size, gl-ease and gl-fest */
function applySize(z){
  z = +z>=0.8 && +z<=1.31 ? Math.round(+z*100)/100 : 1;
  document.documentElement.style.fontSize = z===1 ? "" : (z*100)+"%";
  try{ localStorage.setItem("gl-size", z); }catch(e){}
  document.querySelectorAll("[data-size-set]").forEach(b=>b.setAttribute("aria-pressed", +b.dataset.sizeSet===z));
  if(window.__icoFromText && window.__sizeFromUser) window.__icoFromText(z);
}
function applyEase(on){
  if(on) document.documentElement.dataset.ease = "1"; else delete document.documentElement.dataset.ease;
  try{ localStorage.setItem("gl-ease", on ? "1" : "0"); }catch(e){}
  document.querySelectorAll("[data-ease-set]").forEach(b=>b.setAttribute("aria-pressed", (b.dataset.easeSet==="1")===!!on));
}
function applyFest(mode){
  try{ localStorage.setItem("gl-fest", mode==="off" ? "off" : "auto"); }catch(e){}
  document.querySelectorAll("[data-fest-set]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.festSet===(mode==="off" ? "off" : "auto")));
  try{ renderFest(); }catch(e){}   /* ambient.js loads after this file: the first call may come too early, the page draws it again later */
}
document.querySelectorAll("[data-size-set]").forEach(b=>b.onclick = ()=>{ window.__sizeFromUser = true; applySize(b.dataset.sizeSet); window.__sizeFromUser = false; });
document.querySelectorAll("[data-ease-set]").forEach(b=>b.onclick = ()=>applyEase(b.dataset.easeSet==="1"));
document.querySelectorAll("[data-fest-set]").forEach(b=>b.onclick = ()=>applyFest(b.dataset.festSet));
applySize((()=>{ try{ return localStorage.getItem("gl-size"); }catch(e){ return 1; } })());
applyEase(document.documentElement.dataset.ease==="1");
applyFest((()=>{ try{ return localStorage.getItem("gl-fest"); }catch(e){ return "auto"; } })());

/* the gear opens the Settings page, and closes it again (back to the page you were on) */
let viewBeforeSettings = "home";        /* where the gear takes you back to (router.js keeps it up to date) */
$("setBtn").onclick = () => { location.hash = currentView==="settings" ? viewBeforeSettings : "settings"; };
