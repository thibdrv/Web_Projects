/* ---------- language: English or French ----------
   tx("some English text")  gives the French text when the language is French (and the English text otherwise).
   The French texts are in data/fr.js: one line per English text. A text with no line there stays in English.
   tx("Question {n}", {n:3}) fills the {n}.
   Elements of index.html marked data-t (text), data-t-ph (placeholder), data-t-aria (aria-label) or
   data-t-title (title) are translated by applyStaticText(). */
const FR = (typeof FR_STRINGS !== "undefined") ? FR_STRINGS : {};
let LANG = (()=>{
  try{ const s = localStorage.getItem("gl-lang"); if(s==="en" || s==="fr") return s; }catch(e){}
  const first = ((navigator.languages && navigator.languages[0]) || navigator.language || "en").toLowerCase();   /* the first language of the phone or browser */
  return first.startsWith("fr") ? "fr" : "en";
})();

function tx(s, vars){
  let r = (LANG==="fr" && FR[s]) || s;
  if(vars) r = r.replace(/\{(\w+)\}/g, (m,k)=> vars[k]!==undefined ? vars[k] : m);
  return r;
}
/* a meaning made of several parts: "to write · I · Past" */
const txm = s => String(s).split(" · ").map(x=>tx(x)).join(" · ");
/* an object with an English "en" and a French "fr" */
const pick = o => (LANG==="fr" && o.fr) ? o.fr : o.en;
/* the French text whatever the language is (used by the dictionary search) */
const trFR = s => FR[s] || s;

/* the English text of an element, where each emoji that js/iconify.js turned into a drawing is written back (data-e), so that it matches its line of data/fr.js */
function elKey(el){
  let s = "";
  el.childNodes.forEach(n => { s += n.nodeType===3 ? n.nodeValue : (n.nodeType===1 && n.dataset && n.dataset.e) ? n.dataset.e : n.textContent; });
  return s.trim().replace(/[ \t\r\n]+/g," ");                                  /* keeps non-breaking spaces */
}
function applyStaticText(){
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-t]").forEach(el=>{
    if(el.dataset.k===undefined) el.dataset.k = elKey(el);
    el.textContent = tx(el.dataset.k);
  });
  [["t-ph","placeholder"],["t-aria","aria-label"],["t-title","title"]].forEach(([data,attr])=>{
    document.querySelectorAll(`[data-${data}]`).forEach(el=>el.setAttribute(attr, tx(el.getAttribute(`data-${data}`))));
  });
  document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.lang===LANG));
}

/* the rows of buttons that are built only once: they are emptied so they are built again in the new language */
const BUILT_ONCE = ["colorModes","numModes","numRanges","famModes","famGroups","aniModes","aniGroups","foodModes","foodGroups","bodyModes","bodyGroups",
                    "timeModes","timeGroups","houseModes","houseGroups","cityModes","cityGroups","dirModes","dirGroups","natureModes","natureGroups","jobsModes","jobsGroups","oppModes","oppGroups","dlgModes","dlgGroups","storyModes","storyGroups","talkModes","talkGroups","poemModes","poemGroups","phrModes","phrGroups","dictModes","gTopics","cyModes","fwModes"];
function setLang(l){
  LANG = l;
  try{ localStorage.setItem("gl-lang", l); }catch(e){}
  BUILT_ONCE.forEach(id=>{ const el = document.getElementById(id); if(el) el.innerHTML = ""; });
  applyStaticText();
  if(typeof renderAlphabet==="function") renderAlphabet();
  if(typeof renderLevels==="function") renderLevels();
  if(typeof next==="function" && typeof queue!=="undefined"){ queue=[]; next(); }
  if(typeof showView==="function") showView(currentView);
}
document.querySelectorAll("[data-lang]").forEach(b=>b.onclick = ()=>{ if(b.dataset.lang!==LANG) setLang(b.dataset.lang); });
