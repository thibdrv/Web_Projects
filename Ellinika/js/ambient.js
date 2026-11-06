/* ---------- life in the landscape: the hour of the day, the scroll, and a surprise when you tap ----------
   - html[data-tod] = dawn (5-8h), day (8-17h), dusk (17-20h) or night: it tints the sky and, in the light look, moves the sun (css/ambient.css)
   - --sy (how far you scrolled) makes the hills slide a little
   - a tap on the boat, the evil eye, the windmill or the sun says a Greek wish, with its voice */

/* ----- the hour ----- */
function timeOfDay(h = new Date().getHours()){ return h>=5 && h<8 ? "dawn" : h>=8 && h<17 ? "day" : h>=17 && h<20 ? "dusk" : "night"; }
function setTimeOfDay(){ document.documentElement.dataset.tod = timeOfDay(); }
setTimeOfDay();
setInterval(setTimeOfDay, 10*60*1000);

/* ----- the feasts -----
   festival() says which feast is near today: "easter" (Palm Sunday to Easter Tuesday), "xmas" (15 December to 6 January: Christmas, New Year, Epiphany),
   "gr" or "cy" (the Greek or Cypriot flag, on 25 March and 28 October, or 1 April and 1 October). ?fest=easter|xmas|gr|cy|off in the address shows one for a try;
   the setting "Festive scenery" (gl-fest = off) turns them off. */
function festivalNow(d = new Date()){
  const y = d.getFullYear(), m = d.getMonth()+1, day = d.getDate(), today = Date.UTC(y, m-1, day);
  const e = orthodoxEaster(y), easter = Date.UTC(y, e.m, e.d), diff = Math.round((today - easter) / 86400000);
  if(diff>=-7 && diff<=2){ const h = diff===0 ? "easter" : diff===1 ? "eastermonday" : diff===-2 ? "goodfriday" : diff===-1 ? "holysaturday" : null; return {id:"easter", greet:"easter", holiday:h}; }
  if((m===12 && day>=15) || (m===1 && day<=6)){
    const greet = m===12 && day<=26 ? "xmas" : m===1 && day>=5 ? "epiphany" : "newyear";
    return {id:"xmas", greet, holiday: m===12 && day===25 ? "christmas" : m===12 && day===26 ? "boxing" : m===1 && day===1 ? "newyear" : m===1 && day===6 ? "epiphany" : null};
  }
  const flag = {"3-25":["gr","march25"], "10-28":["gr","ochi"], "4-1":["cy","april1"], "10-1":["cy","cyprusindep"]}[`${m}-${day}`];
  if(flag) return {id:flag[0], greet:"national", holiday:flag[1]};
  return null;
}
function festOff(){ try{ return localStorage.getItem("gl-fest")==="off"; }catch(e){ return false; } }
let festCurrent = null;
function setFestival(){
  const q = new URLSearchParams(location.search).get("fest");
  let f = festivalNow();
  if(q){ f = q==="off" ? null : {easter:{id:"easter", greet:"easter"}, xmas:{id:"xmas", greet:"xmas"}, gr:{id:"gr", greet:"national"}, cy:{id:"cy", greet:"national"}}[q] || f; }
  else if(festOff()) f = null;
  festCurrent = f;
  if(f) document.documentElement.dataset.fest = f.id; else delete document.documentElement.dataset.fest;
}
const greetingOf = id => GREETINGS.list.find(g=>g.id===id);
const FEST_NAMES = {easter:{ico:"🕯️", en:"Orthodox Easter", fr:"Pâques orthodoxe"}, xmas:{ico:"🎄", en:"Christmas time", fr:"Le temps des fêtes"}, gr:{ico:"🇬🇷", en:"A Greek national day", fr:"Une fête nationale grecque"}, cy:{ico:"🇨🇾", en:"A Cypriot national day", fr:"Une fête nationale chypriote"}};
function renderFest(){
  setFestival();
  const b = $("festBanner"); if(!b) return;
  if(!festCurrent){ b.hidden = true; return; }
  const g = greetingOf(festCurrent.greet), n = FEST_NAMES[festCurrent.id];
  const h = festCurrent.holiday && HOL.holidays.find(x=>x.id===festCurrent.holiday);
  const what = h ? (LANG==="fr" ? (h.fr || h.en) : h.en) : (LANG==="fr" ? n.fr : n.en);
  b.hidden = false;
  b.innerHTML = `<span class="fb-ico" aria-hidden="true">${n.ico}</span><span class="fb-t"><b lang="el">${esc(g.gr)}</b><span>${esc(what)} · ${esc(LANG==="fr" ? g.fr : g.en)}</span></span><span aria-hidden="true">🔊</span>`;
  b.onclick = ()=>say(g.gr);
}
setFestival();

/* ----- the hills slide a little when you scroll (only near the top, where the picture is) ----- */
(() => {
  const deco = document.querySelector(".deco"); let busy = false;
  window.addEventListener("scroll", ()=>{
    if(busy) return; busy = true;
    requestAnimationFrame(()=>{ busy = false; deco.style.setProperty("--sy", Math.min(window.scrollY, 220)); });
  }, {passive:true});
})();

/* ----- a surprise when you tap the picture -----
   The picture sits behind the page, so a tap does not reach it: we look where the tap fell and compare it with the
   position of each thing. Only taps on the empty background count (not on buttons, cards or the search bar). */
const WISHES = {
  boat: {gr:"Καλό ταξίδι!", en:"Have a good trip!", fr:"Bon voyage !", fx:"hop"},
  eye:  {gr:"Καλή επιτυχία!", en:"Good luck!", fr:"Bonne réussite !", fx:"hard"},
  mill: {gr:"Καλημέρα!", en:"Good morning!", fr:"Bonjour !", fx:"fast"},
  sun:  null   /* the sun says good morning by day, and the moon good night */
};
let tipTimer = null;
function showWish(w){
  document.querySelectorAll(".ambtip").forEach(t=>t.remove());
  const tip = document.createElement("div"); tip.className = "ambtip"; tip.setAttribute("role", "status");
  tip.innerHTML = `<b lang="el">${esc(w.gr)}</b><span>${esc(LANG==="fr" ? w.fr : w.en)}</span>`;
  document.body.appendChild(tip);
  say(w.gr);
  clearTimeout(tipTimer);
  tipTimer = setTimeout(()=>{ tip.classList.add("out"); setTimeout(()=>tip.remove(), 320); }, 2600);
}
function replay(el, cls, ms){ el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); setTimeout(()=>el.classList.remove(cls), ms); }
function tapScene(x, y){
  const hit = el => { const r = el.getBoundingClientRect(); return r.width && x>=r.left-10 && x<=r.right+10 && y>=r.top-10 && y<=r.bottom+10; };
  for(const el of document.querySelectorAll(".scene .tap")){
    /* the sun and the moon are two drawings, one of them hidden below the horizon: only the one you can see counts */
    const body = el.dataset.tap==="sun" ? [...el.children].filter(c=>+getComputedStyle(c).opacity>.5)[0] || el : el;
    if(!hit(body)) continue;
    const kind = el.dataset.tap;
    const night = !document.documentElement.matches('[data-theme="light"]');
    let w = kind==="sun" ? (night ? {gr:"Καληνύχτα!", en:"Good night!", fr:"Bonne nuit !"} : {gr:"Καλημέρα!", en:"Good morning!", fr:"Bonjour !"}) : WISHES[kind];
    if(festCurrent && kind==="sun") w = greetingOf(festCurrent.greet);   /* on a feast, the sun wishes the feast */
    if(kind==="boat") replay(el, "hop", 1000);
    else if(kind==="eye") replay(el, "hard", 1400);
    else if(kind==="mill"){ replay(el, "fast", 2500); }
    else if(kind==="sun") replay(el, "flash", 1600);
    showWish(w);
    return true;
  }
  return false;
}
document.addEventListener("click", e=>{
  if(currentView!=="home") return;
  if(e.target.closest("button, a, input, label, select, .today, .grid, .hsearch, .sheet, .bnav, .home-foot, .settings")) return;
  tapScene(e.clientX, e.clientY);
});
