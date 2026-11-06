/* ---------- the page "What's new" ----------
   Built from data/news.js, the newest change first. When the date of the app (ABOUT.date in js/about.js) is newer than the one this device saw last
   ("gl-seen"), a small message tells that the app was updated, with a button to this page. A first-time visitor is not told anything. */
function openNews(){
  const box = $("newsBox"); box.innerHTML = "";
  NEWS.entries.forEach((e,i)=>{
    const card = document.createElement("div"); card.className = "card about news" + (i===0 ? " first" : "");
    card.innerHTML = `<span class="newsdate">${esc(e.date)}${i===0 ? ` <span class="newsnew">${esc(tx("New"))}</span>` : ""}</span>
      <h2 class="sub" style="margin-top:4px">${esc(pick(e.title))}</h2>
      <ul class="plain newslist">${e.items.map(it=>`<li>${esc(pick(it))}</li>`).join("")}</ul>`;
    box.appendChild(card);
  });
  try{ localStorage.setItem("gl-seen", ABOUT.date); }catch(e){}
}
/* after an update: one message, once */
(function(){
  let seen = null;
  try{ seen = localStorage.getItem("gl-seen"); }catch(e){}
  if(/[?&]check=1\b/.test(location.search)) return;
  if(seen===null){ try{ localStorage.setItem("gl-seen", ABOUT.date); }catch(e){} return; }       /* a first visit: nothing to tell */
  if(seen===ABOUT.date) return;
  addEventListener("load", ()=>setTimeout(()=>{
    if(typeof pwaToast==="function") pwaToast(tx("Elliniká was updated."), {label:tx("See what is new"), run:()=>{ const t = $("pwaToast"); if(t) t.remove(); location.hash = "news"; }});
    try{ localStorage.setItem("gl-seen", ABOUT.date); }catch(e){}
  }, 2500));
})();
