/* ---------- Word families ----------
   Built from data/families.js: a root word and the words made from it (δουλεύω → η δουλειά, ο δουλευτής...).
   Learn: the families as cards (tap a word to hear it), with a search box.
   Games: "Which family?" (you see a word, tap the root it comes from) and "Odd one out" (three words come from the same root, one does not).
   The words you answer are kept by Progress like all the others (category "Word families"), so they come back in the reviews. */
const FW_MODES = [
  {id:"learn", name:"Learn", info:"Words that grow from the same root. Tap a word to hear it."},
  {id:"which", name:"Which family?", info:"You see a word. Tap the root word it comes from."},
  {id:"odd",   name:"Odd one out", info:"Three words come from the same root. Tap the one that does not."}
];
let fwMode = "learn", fwFilter = "";
const fwAll = f => [f.root, ...f.members];
const fwMeaning = w => pick(w);
const fwItem = (w, f) => ({key:"fam:"+w.gr, gr:w.gr, en:w.en, fr:w.fr, lat:w.lat, snd:sid(w.gr), cat:"Word families"});
const fwTotal = () => FAMILIES.families.reduce((n,f)=>n+f.members.length+1, 0);

function fwWordButton(w, root){
  const b = document.createElement("button"); b.type = "button"; b.className = "fwword" + (root ? " root" : "");
  b.innerHTML = `<b lang="el">${esc(w.gr)}</b><span class="muted"><span class="lt">${esc(w.lat)}</span></span><span>${esc(fwMeaning(w))}</span>`;
  b.onclick = ()=>say(w.gr);
  return b;
}
function renderFwLearn(){
  const box = $("fwRead"); box.innerHTML = "";
  const search = document.createElement("input");
  search.type = "search"; search.className = "fwsearch"; search.value = fwFilter; search.setAttribute("autocomplete","off");
  search.placeholder = tx("Search a word"); search.setAttribute("aria-label", tx("Search a word"));
  box.appendChild(search);
  const note = document.createElement("div"); note.className = "panel";
  note.innerHTML = `<p style="margin:0">${esc(tx("Learning words by family is faster: when you know the root, you can guess the others. Some links are about the meaning more than the spelling. Written for this app, not reviewed by a native speaker yet."))}</p>`;
  box.appendChild(note);
  const list = document.createElement("div"); list.className = "fwlist"; box.appendChild(list);
  const fold = s => (s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const draw = ()=>{
    list.innerHTML = "";
    const q = fold(fwFilter.trim());
    const shown = FAMILIES.families.filter(f=>!q || fwAll(f).some(w=>fold(w.gr).includes(q) || fold(w.lat).includes(q) || fold(w.en).includes(q) || fold(w.fr).includes(q)));
    shown.forEach(f=>{
      const card = document.createElement("div"); card.className = "panel fwcard";
      const head = document.createElement("div"); head.className = "fwhead"; head.appendChild(fwWordButton(f.root, true));
      const kids = document.createElement("div"); kids.className = "fwkids";
      f.members.forEach(m=>kids.appendChild(fwWordButton(m)));
      card.append(head, kids); list.appendChild(card);
    });
    if(!shown.length){ const d = document.createElement("div"); d.innerHTML = emptyState({icon:"🔍", title:tx("No family found."), text:tx("Try fewer letters, or search in English or French.")}); list.appendChild(d.firstElementChild); }
  };
  search.oninput = ()=>{ fwFilter = search.value; draw(); };
  draw();
}

/* a word -> the root it comes from (4 roots to choose from) */
function fwWhichQuestions(){
  const pool = FAMILIES.families.flatMap(f=>f.members.map(w=>({w, f})));   /* the root itself is not asked: it is one of the answers */
  const next = deck(pool);
  const rootHtml = r => `<span lang="el">${esc(r.gr)}</span> <small class="muted">${esc(fwMeaning(r))}</small>`;
  return ()=>{
    const {w, f} = next(), others = sample(FAMILIES.families.filter(x=>x!==f), 3);
    return {item:fwItem(w, f), prompt:`<p class="vinfo">${esc(tx("Which root does this word come from?"))}</p><p class="word s" lang="el">${esc(w.gr)}</p><p class="vinfo muted">${esc(fwMeaning(w))}</p>`, say:w.gr,
      options:shuffle([{html:rootHtml(f.root), ok:true}, ...others.map(o=>({html:rootHtml(o.root), ok:false}))]), cols:1,
      reveal:`<b lang="el">${esc(w.gr)}</b> <span class="lt">(${esc(w.lat)})</span> · ${esc(fwMeaning(w))}<br>${tx("Family of")} <b lang="el">${esc(f.root.gr)}</b> · ${esc(fwMeaning(f.root))}`,
      sayAfter:[w.gr, f.root.gr]};
  };
}
/* three words of one family and one stranger */
function fwOddQuestions(){
  const next = deck(FAMILIES.families);
  return ()=>{
    const f = next(), other = oneOf(FAMILIES.families.filter(x=>x!==f));
    const three = sample(fwAll(f), 3), odd = oneOf(fwAll(other));
    const html = w => `<span lang="el">${esc(w.gr)}</span> <small class="muted">${esc(fwMeaning(w))}</small>`;
    return {item:fwItem(odd, other), prompt:`<p class="vinfo">${esc(tx("Which word is NOT from the same family as the others?"))}</p>`,
      options:shuffle([{html:html(odd), ok:true}, ...three.map(w=>({html:html(w), ok:false}))]), cols:1,
      reveal:`${tx("The family of")} <b lang="el">${esc(f.root.gr)}</b> (${esc(fwMeaning(f.root))}): ${three.map(w=>`<span lang="el">${esc(w.gr)}</span>`).join(", ")}.<br><b lang="el">${esc(odd.gr)}</b> ${esc(tx("comes from"))} <b lang="el">${esc(other.root.gr)}</b>.`,
      sayAfter:[odd.gr]};
  };
}
function startFw(){
  stopSound();
  $("fwModes").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===fwMode));
  $("fwInfo").textContent = tx(FW_MODES.find(m=>m.id===fwMode).info);
  const learn = fwMode==="learn";
  $("fwRead").hidden = !learn; $("fwGame").hidden = learn;
  if(learn) renderFwLearn();
  else runQuiz($("fwGame"), {id:`families-${fwMode}`, total:10, make:(fwMode==="which" ? fwWhichQuestions : fwOddQuestions)()});
}
function openFamilies(){
  const modes = $("fwModes");
  if(!modes.children.length) FW_MODES.forEach(m=>{
    const b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.dataset.mode = m.id; b.textContent = tx(m.name);
    b.onclick = ()=>{ fwMode = m.id; startFw(); };
    modes.appendChild(b);
  });
  startFw();
}
