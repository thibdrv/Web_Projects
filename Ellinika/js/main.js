/* ---------- Greek letters: tabs ---------- */
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("[data-tab]").forEach(x=>x.setAttribute("aria-pressed",x===b));
  letterTab=b.dataset.tab;
  $("practice").hidden=letterTab!=="practice"; $("alphabet").hidden=letterTab!=="alphabet"; $("hand").hidden=letterTab!=="hand";
  if(letterTab==="hand") openHand();
  if(letterTab==="alphabet") renderAlphaDiagram($("alphaChart"));
  updateStats();
});

/* ---------- start ---------- */
applyStaticText();
renderLevels(); next();
showView(location.hash.slice(1));
/* the loading screen goes away once the page has its fonts (or after 1.5 s at most) */
if(window.__splash) __splash(100);
/* the opening animation ("Welcome to Elliniká") stays at least 2 s from the start of the page (0.9 s when the phone asks for less motion);
   not in the self-check, not when it is switched off in the Settings, and a tap or a key skips it (index.html sets window.__skip) */
const INTRO_MS = window.__introMs!=null ? window.__introMs : 2000;   /* set in the head of index.html, together with the loading bar */
window.__ready = true;
Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r=>setTimeout(r,1500))]).then(()=>{
  const left = window.__skip ? 0 : Math.max(0, INTRO_MS - performance.now());
  setTimeout(()=>{ if(window.__splashDone) __splashDone(); }, left);
});
if(window.__skip && window.__splashDone) __splashDone();
