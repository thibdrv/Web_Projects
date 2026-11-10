/* ---------- the menu, made easier to use ----------
   - the search bar of the home page: type a word, see the first results at once, tap one to hear it
   - "Recently": the 3 last pages you opened (kept by rememberView() in js/today.js)
   - the bar at the bottom of the screen on a phone: Home, Learn, Practice, Dictionary, More
   - "More": a sheet with every page of the app, built from the tiles of the home page, so it always stays in sync with them */

/* ----- search ----- */
const HS_MAX = 5;
let hsTimer = null;
/* the last searches ("gl-searches", 6 at most, newest first), shown as small buttons when you touch the empty search bar; with none yet, a few words to try */
const HS_TRY = ["καφές", "νερό", "ευχαριστώ", "θάλασσα", "καλημέρα"];
function hsRecents(){ try{ const r = JSON.parse(localStorage.getItem("gl-searches")); return Array.isArray(r) ? r.filter(x=>typeof x==="string").slice(0,6) : []; }catch(e){ return []; } }
function hsRemember(text){
  const s = (text||"").trim(); if(s.length<2) return;
  try{ localStorage.setItem("gl-searches", JSON.stringify([s, ...hsRecents().filter(x=>fold(x)!==fold(s))].slice(0,6))); }catch(e){}
}
function hsStart(){
  const input = $("hsInput"), box = $("hsResults"), recents = hsRecents(), list = recents.length ? recents : HS_TRY;
  box.hidden = false; box.innerHTML = "";
  const head = document.createElement("div"); head.className = "hs-head";
  head.innerHTML = `<span>${esc(tx(recents.length ? "Recent searches" : "Try"))}</span>`;
  if(recents.length){
    const clear = document.createElement("button"); clear.type = "button"; clear.className = "hs-clear"; clear.textContent = tx("Clear");
    clear.onclick = ()=>{ try{ localStorage.removeItem("gl-searches"); }catch(e){} hsStart(); };
    head.appendChild(clear);
  }
  box.appendChild(head);
  const chips = document.createElement("div"); chips.className = "hs-chips";
  list.forEach(w=>{
    const c = document.createElement("button"); c.type = "button"; c.className = "hs-chip"; c.textContent = w; c.lang = /[Α-ωά-ώ]/.test(w) ? "el" : "";
    c.onclick = ()=>{ input.value = w; input.focus(); renderHomeSearch(); };
    chips.appendChild(c);
  });
  box.appendChild(chips);
}
function renderHomeSearch(){
  const input = $("hsInput"), box = $("hsResults"), raw = input.value.trim(), q = fold(raw);
  if(!q){ if(document.activeElement===input) hsStart(); else { box.hidden = true; box.innerHTML = ""; } return; }
  const found = DICT.map(e=>[e, matchScore(e,q)]).filter(([,s])=>s>0).sort((a,b)=>b[1]-a[1] || a[0].sortKey.localeCompare(b[0].sortKey,"el"));
  box.hidden = false; box.innerHTML = "";
  if(!found.length){ box.innerHTML = `<p class="hs-none">${esc(tx("No word found. Try fewer letters, another spelling, or the English or French word."))}</p>`; return; }
  found.slice(0,HS_MAX).forEach(([e])=>{
    const row = document.createElement("div"); row.className = "hs-row";
    const b = document.createElement("button"); b.type = "button"; b.className = "hs-word";
    b.innerHTML = `${e.emoji ? `<span class="emoji sm" aria-hidden="true">${e.emoji}</span>` : ""}<span class="hs-t"><b lang="el">${esc(e.gr)}</b> <i><span class="lt">${esc(e.lat)}</span></i><span>${esc(dictMeaning(e))}</span>${e.cats && e.cats[0] ? `<em class="hs-cat">${esc(tx(e.cats[0]))}</em>` : ""}</span><span aria-hidden="true">🔊</span>`;
    b.onclick = ()=>{ hsRemember(raw); play(e.snd); };
    row.appendChild(b);
    row.appendChild(favButton({gr:e.gr, lat:e.lat, en:e.en, fr:e.fr, snd:e.snd, cat:e.cats[0], emoji:e.emoji}, "round"));
    box.appendChild(row);
  });
  const all = document.createElement("button"); all.type = "button"; all.className = "hs-all";
  all.textContent = tx(found.length===1 ? "Open in the dictionary ({n} result) →" : "Open in the dictionary ({n} results) →", {n:found.length});
  all.onclick = ()=>{ hsRemember(raw); openDictionarySearch(raw); };
  box.appendChild(all);
}
/* the dictionary, in its "Search" mode, with this text already typed */
function openDictionarySearch(text){
  dictMode = "search"; dictShown = DICT_PAGE;
  $("dictQuery").value = text;
  if(location.hash==="#dictionary") showView("dictionary"); else location.hash = "dictionary";
}
$("hsInput").addEventListener("input", ()=>{ clearTimeout(hsTimer); hsTimer = setTimeout(renderHomeSearch, 120); });
$("hsInput").addEventListener("focus", ()=>{ if(!$("hsInput").value.trim()) hsStart(); });
/* the list closes when you touch something else (a tap on it, or on the bar, keeps it open) */
document.addEventListener("pointerdown", e=>{
  if(e.target.closest && e.target.closest("#hSearch")) return;
  if(!$("hsInput").value.trim()){ $("hsResults").hidden = true; }
});
$("hsInput").addEventListener("keydown", e=>{
  if(e.key==="Enter"){ e.preventDefault(); const t = $("hsInput").value.trim(); if(t){ hsRemember(t); openDictionarySearch(t); } }
  else if(e.key==="Escape"){ $("hsInput").value = ""; renderHomeSearch(); }
});

/* ----- recently opened ----- */
const homeTile = v => document.querySelector(`.home .grid:not(.g-recent) .cat[data-go="${v}"]`);
function renderHomeRecent(){
  const box = $("recentGrid"), names = recentViews().filter(homeTile);
  $("recent").hidden = !names.length;
  box.innerHTML = "";
  names.forEach(v=>{
    const tile = homeTile(v).cloneNode(true);
    tile.style.animationDelay = "0s";
    tile.onclick = ()=>{ location.hash = v; };
    box.appendChild(tile);
  });
}

/* ----- the bar at the bottom ----- */
const NAV_LEARN = ["letters","phrases","dialogues","stories","poems","texts","cypriot","families","customs","grammar","colors","numbers","family","animals","food","body","time","house","clothes","cooking","city","directions","nature","jobs","opposites"];
const NAV_PRACTICE = ["progress","stats","challenge","wordgames","difficulties","favorites","talk","leveltest"];
function navOf(view){ return view==="home" ? (typeof homeSection==="function" ? homeSection() : "home") : view==="dictionary" ? "dictionary" : NAV_LEARN.includes(view) ? "learn" : NAV_PRACTICE.includes(view) ? "practice" : ""; }
function navUpdate(view){
  const on = moreOpen() ? "more" : navOf(view);
  document.querySelectorAll("#bnav [data-nav]").forEach(b=>{
    const active = b.dataset.nav===on;
    b.classList.toggle("on", active); if(active) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
  });
}
/* the Learn and Practice buttons scroll the menu to their blocks (going to the menu first when you are on another page) */
function goSection(id){
  /* a smooth scroll; if the browser did not move at all (some do not animate), jump there */
  const scroll = () => {
    let el = $(id); if(!el) return;
    /* on a wide screen Learn, Vocabulary and Tools are tabs (js/homefx.js): their titles are hidden, so go to the tab bar, on the right tab */
    if(!el.offsetParent && $("dashTabs") && $("dashTabs").offsetParent){ if(id==="secLearn" && window.homeTab) homeTab("learn"); el = $("dashTabs"); }
    const y0 = window.scrollY;
    el.scrollIntoView({behavior:"smooth", block:"start"});
    setTimeout(()=>{ if(Math.abs(window.scrollY - y0) < 2) el.scrollIntoView({block:"start"}); }, 600);
  };
  if(currentView==="home"){ scroll(); return; }
  location.hash = "home"; setTimeout(scroll, 80);
}
/* the sheet slides and fades out before it is hidden; "closing" marks that short moment, and the sheet counts as closed from its start */
const moreOpen = () => !$("moreSheet").hidden && !$("moreSheet").classList.contains("closing");
let moreTimer = 0;
function closeMore(){
  const sheet = $("moreSheet");
  if(!moreOpen()) return;
  sheet.classList.add("closing"); document.body.classList.remove("sheet-open");
  document.querySelector('#bnav [data-nav="more"]').setAttribute("aria-expanded","false");
  navUpdate(currentView);
  clearTimeout(moreTimer);
  moreTimer = setTimeout(()=>{ sheet.hidden = true; sheet.classList.remove("closing"); sheet.querySelector(".sheet-panel").style.transform = ""; }, 430);
}
function openMore(){
  const sheet = $("moreSheet");
  clearTimeout(moreTimer); sheet.classList.remove("closing"); sheet.querySelector(".sheet-panel").style.transform = "";
  buildMoreList();
  sheet.hidden = false; document.body.classList.add("sheet-open");
  /* on a phone the list opens as a circle that grows from the menu button (and closes back into it): where is the button, and how far is the farthest corner */
  if(matchMedia("(max-width:760px)").matches){
    const btn = document.querySelector('#bnav [data-nav="more"]'), panel = sheet.querySelector(".sheet-panel"), pr = panel.getBoundingClientRect(), br = btn.getBoundingClientRect();
    const ox = br.left + br.width/2 - pr.left, oy = br.top + br.height/2 - pr.top;
    const rr = Math.max(Math.hypot(ox, oy), Math.hypot(pr.width - ox, oy), Math.hypot(ox, pr.height - oy), Math.hypot(pr.width - ox, pr.height - oy));
    panel.style.setProperty("--ox", ox + "px"); panel.style.setProperty("--oy", oy + "px"); panel.style.setProperty("--rr", Math.ceil(rr) + 4 + "px");
  }
  document.querySelector('#bnav [data-nav="more"]').setAttribute("aria-expanded","true");
  navUpdate(currentView);
  try{ sheet.querySelector(".sheet-x").focus({preventScroll:true}); }catch(e){}
}
/* drag the top of the sheet down to close it: it follows the finger, then goes back or leaves */
(function(){
  const head = document.querySelector("#moreSheet .sheet-head"), panel = document.querySelector("#moreSheet .sheet-panel");
  let y0 = 0, dy = 0, t0 = 0, drag = false;
  head.addEventListener("pointerdown", e=>{
    if(e.target.closest("button") || matchMedia("(max-width:760px)").matches) return;      /* (on a phone the list hangs from the top: no dragging) */
    drag = true; y0 = e.clientY; dy = 0; t0 = Date.now(); panel.style.transition = "none";
    try{ head.setPointerCapture(e.pointerId); }catch(err){}
  });
  head.addEventListener("pointermove", e=>{
    if(!drag) return;
    dy = Math.max(0, e.clientY - y0); panel.style.transform = `translateY(${dy}px)`;
  });
  const end = () => {
    if(!drag) return; drag = false; panel.style.transition = "";
    const fast = dy / Math.max(Date.now() - t0, 1) > 0.5;
    if(dy > 110 || (fast && dy > 30)) closeMore();
    else { panel.style.transition = "transform .25s cubic-bezier(.22,1,.36,1)"; panel.style.transform = ""; setTimeout(()=>{ panel.style.transition = ""; }, 260); }
  };
  head.addEventListener("pointerup", end); head.addEventListener("pointercancel", end);
})();
/* every block of the home page (title + tiles) is copied into the sheet; built again each time so the language is right */
function buildMoreList(){
  const list = $("moreList"); list.innerHTML = ""; let n = 0;
  document.querySelectorAll(".home > .sect[id]").forEach(h=>{
    const grids = [];
    for(let n = h.nextElementSibling; n && !n.classList.contains("sect"); n = n.nextElementSibling) if(n.classList.contains("grid")) grids.push(n);
    if(!grids.length) return;
    const title = document.createElement("h3"); title.className = "sheet-sect"; title.textContent = h.textContent; list.appendChild(title);
    const g = document.createElement("div"); g.className = "sheet-grid"; list.appendChild(g);
    title.style.setProperty("--i", Math.min(n, 24)); n++;
    grids.forEach(src=>src.querySelectorAll(".cat").forEach(t=>{
      const c = t.cloneNode(true); c.classList.remove("menu-hide"); c.style.setProperty("--i", Math.min(n++, 24));
      const name = t.dataset.go;
      c.onclick = ()=>{ closeMore(); location.hash = name; };
      if(name===currentView) c.classList.add("here");
      g.appendChild(c);
    }));
  });
  const about = document.createElement("button"); about.type = "button"; about.className = "sheet-about"; about.textContent = tx("About this app");
  about.onclick = ()=>{ closeMore(); location.hash = "about"; };
  const sets = document.createElement("button"); sets.type = "button"; sets.className = "sheet-about"; sets.textContent = tx("Settings");
  sets.onclick = ()=>{ closeMore(); location.hash = "settings"; };
  list.appendChild(sets);
  list.appendChild(about);
}
document.querySelectorAll("#bnav [data-nav]").forEach(b=>b.onclick = ()=>{
  const k = b.dataset.nav;
  if(moreOpen() && k!=="more") closeMore();
  if(k==="home"){
    if(currentView!=="home") location.hash = "home";
    else { window.scrollTo({top:0, behavior:"smooth"}); setTimeout(()=>{ if(window.scrollY>2) window.scrollTo(0,0); }, 600); }
  }
  else if(k==="learn") goSection("secLearn");
  else if(k==="practice") goSection("secPractice");
  else if(k==="dictionary"){ if(currentView!=="dictionary") location.hash = "dictionary"; }
  else if(k==="more") moreOpen() ? closeMore() : openMore();
});
/* the top bar of a computer: Menu (hides or shows the side menu; from 761 to 899 px, where there is no side menu, it opens the list of categories), Search (the quick search), the name (home) */
if($("tbMenu")){
  $("tbMenu").onclick = ()=>{ if(matchMedia("(min-width:900px)").matches) toggleRail(); else if(moreOpen()) closeMore(); else openMore(); };
  $("tbSearch").onclick = ()=>{ if(moreOpen()) closeMore(); const q = $("qsOpen"); if(q) q.click(); };
  $("tbBrand").onclick = ()=>{ if(moreOpen()) closeMore(); if(currentView!=="home") location.hash = "home"; else { window.scrollTo({top:0, behavior:"smooth"}); setTimeout(()=>{ if(window.scrollY>2) window.scrollTo(0,0); }, 600); } };
}
/* on a phone the magnifier of the bar opens the quick search (the one of the other pages) */
if($("bnSearch")) $("bnSearch").onclick = ()=>{ if(moreOpen()) closeMore(); const q = $("qsOpen"); if(q) q.click(); };
/* the keyboard of a phone needs the room: the bar steps aside while a text box has the focus */
const isTextBox = el => el && el.matches && el.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),textarea,select');
document.addEventListener("focusin", e=>{ if(isTextBox(e.target)) document.body.classList.add("typing"); });
document.addEventListener("focusout", ()=>setTimeout(()=>{ if(!isTextBox(document.activeElement)) document.body.classList.remove("typing"); }, 50));
$("moreSheet").addEventListener("click", e=>{ if(e.target.closest("[data-close]")) closeMore(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape" && moreOpen()) closeMore(); });
window.addEventListener("hashchange", ()=>{ if(moreOpen()) closeMore(); });

/* ----- long rows of buttons: one line you slide with the finger (a phone) -----
   A row with 6 buttons or more (7 for the tiles of the games) becomes a single line. The chosen button is brought to the middle,
   and a soft fade on the edge shows there is more. The title of the row (its aria-label) is written above it. */
(function(){
  const phone = matchMedia("(max-width:760px)");
  const edges = row => { row.classList.toggle("can-left", row.scrollLeft>4); row.classList.toggle("can-right", row.scrollLeft + row.clientWidth < row.scrollWidth - 4); };
  function fitRow(row){
    const modes = row.matches('[id$="Modes"], #gModes, [role="group"]:not([id])');
    const long = phone.matches && row.children.length >= (modes ? 7 : 6);
    row.classList.toggle("hscroll", long);
    let label = row.previousElementSibling && row.previousElementSibling.classList.contains("rowlabel") ? row.previousElementSibling : null;
    if(long && row.getAttribute("aria-label")){
      if(!label){ label = document.createElement("div"); label.className = "rowlabel"; row.before(label); }
      label.textContent = row.getAttribute("aria-label"); label.hidden = row.hidden;
    } else if(label) label.remove();
    if(!long) return;
    if(!row._hs){ row._hs = true; row.addEventListener("scroll", ()=>edges(row), {passive:true}); }
    const on = row.querySelector('[aria-pressed="true"]');
    if(on && row._on !== on){
      row._on = on;
      row.scrollLeft = on.offsetLeft - (row.clientWidth - on.offsetWidth)/2;
    }
    edges(row);
  }
  let pending = false;
  const fitRows = () => { pending = false; document.querySelectorAll('main .row[role="group"]').forEach(fitRow); };
  const later = () => { if(!pending){ pending = true; requestAnimationFrame(fitRows); } };
  new MutationObserver(later).observe(document.querySelector("main"), {childList:true, subtree:true, attributes:true, attributeFilter:["aria-pressed","hidden"]});
  phone.addEventListener("change", later); window.addEventListener("resize", later);
  later();
})();

/* ----- keyboard shortcuts (a computer): 1-9 pick an answer, Enter checks or goes on, R plays the sound again, / searches, H goes home, Esc goes back, ? shows the list ----- */
(function(){
  const help = $("kbHelp"), open = () => { help.hidden = false; }, close = () => { help.hidden = true; };
  $("kbOpen").onclick = open; help.addEventListener("click", e=>{ if(e.target===help) close(); });
  const visible = el => el && !el.hidden && el.offsetParent !== null;
  document.addEventListener("keydown", e=>{
    if(e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target, typing = t && t.matches && t.matches("input:not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable]");
    if(typing){ if(e.key==="Escape") t.blur(); return; }
    const k = e.key;
    if(!help.hidden){ if(k==="Escape" || k==="?" ){ e.preventDefault(); close(); } return; }
    if(k==="?"){ e.preventDefault(); open(); return; }
    if(typeof moreOpen==="function" && moreOpen()) return;                  /* the sheet "More" has its own keys */
    if(currentView==="wordgames") return;                                   /* the word games read the Greek letters from the keyboard */
    const view = document.querySelector("main [data-view]:not([hidden])");
    if(typeof quickSearchOpen==="function" && quickSearchOpen()) return;
    if(k==="/"){ e.preventDefault(); openQuickSearch(); return; }
    if(k==="Escape"){ if(visible($("back"))){ e.preventDefault(); $("back").click(); } return; }
    if(k==="m" || k==="M"){ if(matchMedia("(min-width:900px)").matches){ e.preventDefault(); toggleRail(); } return; }
    if(k==="h" || k==="H"){ if(currentView!=="home") location.hash = "home"; return; }
    if(!view) return;
    if(k==="ArrowLeft" || k==="ArrowRight"){                                /* the arrows of a drawing */
      const nav = [...view.querySelectorAll(k==="ArrowLeft" ? ".bd-nav.prev" : ".bd-nav.next")].find(visible);
      if(nav){ e.preventDefault(); nav.click(); }
      return;
    }
    if(k==="+" || k==="=" || k==="-" || k==="_" || k==="−"){               /* zoom on a drawing */
      const z = [...view.querySelectorAll(k==="+" || k==="=" ? '[data-z="in"]' : '[data-z="out"]')].find(visible);
      if(z){ e.preventDefault(); z.click(); }
      return;
    }
    if(k==="s" || k==="S"){                                                /* the star: add the word to "my words" */
      const star = [...view.querySelectorAll(".favstar")].find(visible);
      if(star){ e.preventDefault(); star.click(); }
      return;
    }
    if(k==="t" || k==="T"){                                                /* light or dark */
      e.preventDefault(); applyTheme(document.documentElement.dataset.theme==="dark" ? "light" : "dark");
      return;
    }
    if(/^[1-9]$/.test(k)){
      const opts = [...view.querySelectorAll(".opts .opt")].filter(b=>visible(b) && !b.disabled);
      const b = opts[+k-1]; if(b){ e.preventDefault(); b.click(); }
      return;
    }
    if(k==="Enter"){
      const go = [...view.querySelectorAll('[data-q="go"]')].find(visible);
      if(go && (document.activeElement===document.body || document.activeElement===go)){ e.preventDefault(); go.click(); }
      return;
    }
    if(k==="r" || k==="R"){
      const hear = [...view.querySelectorAll('[data-q="hear"], .hear')].find(visible);
      if(hear){ e.preventDefault(); hear.click(); }
    }
  });
})();

/* ----- a wide screen: the side menu can be hidden (button at its top, or the key M) and shown again; the choice is remembered ----- */
function toggleRail(force){
  const off = typeof force==="boolean" ? force : !document.body.classList.contains("rail-off");
  document.body.classList.toggle("rail-off", off);
  $("railToggle").setAttribute("aria-expanded", String(!off));
  try{ localStorage.setItem("rail-off", off ? "1" : "0"); }catch(err){}
}
(function(){
  let off = false; try{ off = localStorage.getItem("rail-off")==="1"; }catch(err){}
  toggleRail(off);
  $("railToggle").onclick = ()=>toggleRail();
})();
