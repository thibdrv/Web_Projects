/* ---------- the Settings page, and the home menu you can arrange ----------
   The page (data-view="settings" in index.html) holds every choice: the buttons themselves are handled by js/theme.js (look, colours, text size,
   Latin letters, voice speed, scenery), js/i18n.js (language) and js/pwa.js (install and offline).
   Here: the list "Home menu", where you pin the categories you use most (they get a row "Pinned" on the home page, under Today)
   and hide the ones you do not need. It is kept in the browser under "gl-menu" ({pin:[...], hide:[...]}, the names of the pages). */
const MENU_KEY = "gl-menu";
function menuPrefs(){
  try{ const m = JSON.parse(localStorage.getItem(MENU_KEY)); if(m && Array.isArray(m.pin) && Array.isArray(m.hide)) return m; }catch(e){}
  return {pin:[], hide:[]};
}
function saveMenuPrefs(m){ try{ localStorage.setItem(MENU_KEY, JSON.stringify(m)); }catch(e){} }
/* the tiles of the home page (not the copies in "Pinned" and "Recently") */
const menuTiles = () => [...document.querySelectorAll(".home .grid:not(.g-recent) .cat[data-go]")];

function applyMenuPrefs(){
  const m = menuPrefs();
  menuTiles().forEach(t=>t.classList.toggle("menu-hide", m.hide.includes(t.dataset.go) || m.pin.includes(t.dataset.go)));   /* a pinned tile lives in "Pinned" */
}
function renderHomePinned(){
  const m = menuPrefs(), box = $("pinnedGrid"); if(!box) return;
  const tiles = m.pin.map(v=>menuTiles().find(t=>t.dataset.go===v)).filter(Boolean);
  $("pinned").hidden = !tiles.length; box.innerHTML = "";
  tiles.forEach(t=>{
    const c = t.cloneNode(true); c.classList.remove("menu-hide"); c.style.animationDelay = "0s";
    c.onclick = ()=>{ location.hash = t.dataset.go; };
    box.appendChild(c);
  });
}
/* "Recently" copies the tiles too: it must not show a hidden one twice, so it is redrawn after the menu is arranged */
const renderHomeRecentBase = renderHomeRecent;
renderHomeRecent = function(){ applyMenuPrefs(); renderHomeRecentBase(); renderHomePinned(); };

const PIN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z"/></svg>';
const EYE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/><path class="slash" d="M4 20L20 4"/></svg>';
function buildMenuEdit(){
  const box = $("menuEdit"); if(!box) return;
  const m = menuPrefs(); box.innerHTML = "";
  menuTiles().forEach(t=>{
    const v = t.dataset.go, pinned = m.pin.includes(v), hidden = m.hide.includes(v);
    const row = document.createElement("div"); row.className = "mrow" + (hidden ? " off" : "");
    row.innerHTML = `<span class="mico" aria-hidden="true">${(t.querySelector(".ico")||{}).innerHTML || ""}</span>
      <span class="mname">${esc((t.querySelector(".txt b")||t).textContent.trim())}</span>
      <button type="button" class="mbtn mpin" aria-pressed="${pinned}" aria-label="${esc(tx("Pin to the top"))}" title="${esc(tx("Pin to the top"))}">${PIN_SVG}</button>
      <button type="button" class="mbtn meye" aria-pressed="${hidden}" aria-label="${esc(tx("Hide from the menu"))}" title="${esc(tx("Hide from the menu"))}">${EYE_SVG}</button>`;
    row.querySelector(".mpin").onclick = ()=>{
      const x = menuPrefs(), i = x.pin.indexOf(v);
      if(i<0){ x.pin.push(v); x.hide = x.hide.filter(h=>h!==v); } else x.pin.splice(i, 1);
      saveMenuPrefs(x); applyMenuPrefs(); renderHomePinned(); buildMenuEdit(); menuSummary();
    };
    row.querySelector(".meye").onclick = ()=>{
      const x = menuPrefs(), i = x.hide.indexOf(v);
      if(i<0){ x.hide.push(v); x.pin = x.pin.filter(p=>p!==v); } else x.hide.splice(i, 1);
      saveMenuPrefs(x); applyMenuPrefs(); renderHomePinned(); buildMenuEdit(); menuSummary();
    };
    box.appendChild(row);
  });
}
/* the list is long: it opens and closes with its title, and the title says what is arranged */
function menuSummary(){
  const m = menuPrefs(), s = $("menuSum");
  s.textContent = !m.pin.length && !m.hide.length ? "" : [m.pin.length ? tx("{n} pinned", {n:m.pin.length}) : "", m.hide.length ? tx("{n} hidden", {n:m.hide.length}) : ""].filter(Boolean).join(" · ");
}
function toggleMenuFold(open){
  const b = $("menuFold"); if(open===undefined) open = b.getAttribute("aria-expanded")!=="true";
  b.setAttribute("aria-expanded", open); $("menuBody").hidden = !open;
}
$("menuFold").onclick = ()=>toggleMenuFold();
function openSettings(){
  toggleMenuFold(false); menuSummary();
  buildMenuEdit();
  if(typeof renderPwa==="function") renderPwa();
}
$("welcomeAgain").onclick = ()=>{ if(typeof showWelcome==="function") showWelcome(true); };
$("menuReset").onclick = ()=>{ saveMenuPrefs({pin:[], hide:[]}); applyMenuPrefs(); renderHomePinned(); buildMenuEdit(); menuSummary(); };
applyMenuPrefs(); renderHomePinned();
