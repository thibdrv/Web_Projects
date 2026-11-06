/* ---------- my words: the ⭐ ----------
   A star next to a word keeps it in "My words" (menu > Tools). The page shows the list, lets you hear and remove the words,
   and plays a quiz made only of them. Everything is kept in this browser under "gl-fav" (it is part of the backup).
   An item is {gr, lat, en, fr, snd, cat, emoji}: any word of the app can be starred, see favButton(). */
const Fav = (() => {
  const KEY = "gl-fav";
  let items = {};
  try{ items = JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ items = {}; }
  const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(items)); }catch(e){} };
  const keyOf = gr => String(gr).replace(/^(ο|η|το|τα|οι)\s+/, "").toLowerCase();
  function toggle(item){
    const k = keyOf(item.gr);
    if(items[k]) delete items[k];
    else items[k] = {gr:item.gr, lat:item.lat||"", en:item.en||"", fr:item.fr||"", snd:item.snd||sid(item.gr), cat:item.cat||"", emoji:item.emoji||"", added:Date.now()};
    save();
    return !!items[k];
  }
  return {
    keyOf, toggle,
    has: gr => !!items[keyOf(gr)],
    list: () => Object.values(items).sort((a,b)=>b.added-a.added),
    count: () => Object.keys(items).length
  };
})();

/* the star button of a word; "cls" adds a look (on-card: in the corner of a card, inline: next to a text) */
function favButton(item, cls=""){
  const b = document.createElement("button");
  b.type = "button"; b.className = "favstar " + cls;
  const paint = () => {
    const on = Fav.has(item.gr);
    b.textContent = on ? "★" : "☆";
    b.setAttribute("aria-pressed", on);
    const label = tx(on ? "Remove from my words" : "Add to my words");
    b.setAttribute("aria-label", label); b.title = label;
  };
  b.onclick = e => { e.stopPropagation(); e.preventDefault(); Fav.toggle(item); paint(); };
  paint();
  return b;
}

/* ---------- the page ---------- */
const favMeaning = f => (LANG==="fr" && f.fr) ? f.fr : txm(f.en);

/* questions about the starred words; the wrong answers are other starred words, then words of the dictionary */
function favQuestions(list){
  const next = deck(list), pool = DICT.filter(e=>e.type!=="letter");
  const wrongOnes = (f, textOf) => {
    const seen = new Set([textOf(f)]), out = [];
    for(const x of shuffle([...list.filter(y=>y!==f), ...sample(pool, 30)])){
      const t = textOf(x); if(!t || seen.has(t)) continue;
      seen.add(t); out.push(x); if(out.length===3) break;
    }
    return out;
  };
  const greekOf = x => x.gr;
  return ()=>{
    const f = next(), kind = oneOf(["g2e","e2g","listen"]);
    const item = {key:"fav:"+Fav.keyOf(f.gr), gr:f.gr, en:f.en, fr:f.fr, lat:f.lat, snd:f.snd, cat:f.cat || "My words"};
    const reveal = `<b lang="el">${esc(f.gr)}</b> <span class="lt">(${esc(f.lat)})</span><br>${esc(favMeaning(f))}`;
    const base = {item, reveal, sayAfter:f.gr};
    const meanOpts = () => shuffle([{html:esc(favMeaning(f)), ok:true}, ...wrongOnes(f, x=>favMeaning(x)).map(x=>({html:esc(favMeaning(x)), ok:false}))]);
    const greekOpts = () => shuffle([{html:`<span lang="el">${esc(f.gr)}</span>`, ok:true}, ...wrongOnes(f, greekOf).map(x=>({html:`<span lang="el">${esc(x.gr)}</span>`, ok:false}))]);
    if(kind==="e2g")    return {...base, prompt:`${f.emoji ? `<span class="emoji">${f.emoji}</span>` : ""}<p class="word s">${esc(favMeaning(f))}</p>`, options:greekOpts()};
    if(kind==="listen") return {...base, prompt:`<p class="word s">🔊 ${esc(tx("What does it mean?"))}</p>`, say:f.gr, autoplay:true, options:meanOpts(), sayAfter:undefined};
    return {...base, prompt:`<p class="word s" lang="el">${esc(f.gr)}</p>`, say:f.gr, options:meanOpts()};
  };
}

function renderFavorites(){
  const box = $("favBox"), list = Fav.list();
  if(!list.length){
    box.innerHTML = emptyState({icon:"⭐", title:tx("No starred words yet."),
      text:tx("Tap the ☆ next to a word, in the dictionary, in a word list or after a game, to keep it here."),
      tips:[tx("Open a word list, a game or the dictionary."), tx("Tap the ☆ next to a word you want to keep."), tx("Come back here to hear and practice your words.")],
      actions:[{label:tx("Open the dictionary"), href:"#dictionary"}, {label:tx("Browse the categories"), href:"#home", ghost:true}]});
    return;
  }
  box.innerHTML = `
    <p class="levelinfo">${esc(tx(list.length===1 ? "{n} starred word." : "{n} starred words.", {n:list.length}))}</p>
    <div class="btns"><button class="btn" type="button" id="favPlay">🎯 ${esc(tx("Practice my words"))}</button></div>
    <div id="favList"></div>`;
  const out = $("favList");
  list.forEach(f=>{
    const wrap = document.createElement("div"); wrap.className = "dword";
    const b = document.createElement("button"); b.type = "button"; b.className = "dentry";
    b.innerHTML = `${f.emoji ? `<span class="emoji sm" aria-hidden="true">${f.emoji}</span>` : ""}<span class="dtxt"><span class="dgr" lang="el">${esc(f.gr)}</span>
      <span class="dlat"><span class="lt">${esc(f.lat)}</span></span><span class="den">${esc(favMeaning(f))}</span>${f.cat ? `<span class="dmeta">${esc(tx(f.cat))}</span>` : ""}</span><span class="dplay" aria-hidden="true">🔊</span>`;
    b.onclick = ()=>say(f.gr);
    wrap.appendChild(b);
    const star = favButton(f, "on-card"); const old = star.onclick;
    star.onclick = e=>{ old(e); wrap.remove(); if(!Fav.count()) renderFavorites(); else $("favBox").querySelector(".levelinfo").textContent = tx(Fav.count()===1 ? "{n} starred word." : "{n} starred words.", {n:Fav.count()}); };
    wrap.appendChild(star);
    out.appendChild(wrap);
  });
  $("favPlay").onclick = ()=>{
    const all = Fav.list();
    box.innerHTML = `<div id="favGame" class="game"></div>`;
    runQuiz($("favGame"), {id:"favorites", total:Math.min(10, Math.max(5, all.length)), best:false, make:favQuestions(all),
      renderResult:(g,score,total)=>{
        g.innerHTML = `${scoreCard(score,total,esc(score>=total*.8 ? tx("Excellent") : tx("Keep going, you will get there")))}
          <div class="btns"><button class="btn" type="button" id="favBack">${esc(tx("Back to my words"))}</button></div>`;
        celebrate(g,score,total);
        $("favBack").onclick = ()=>{ renderFavorites(); window.scrollTo(0,0); };
      }});
  };
}
function openFavorites(){ renderFavorites(); }
