/* ---------- Cypriot Greek (Κυπριακά) ----------
   Built from data/cypriot.js: the Cypriot word next to the Standard Greek one, with the meaning. Tap a card to hear both
   (the voice reads Standard Greek pronunciation: the Cypriot accent is different).
   Games: "Cypriot or standard?" (which of the two is the Cypriot form) and "Find the Cypriot word" (you see the Standard word, pick the Cypriot one). */
const CY_MODES = [
  {id:"learn", name:"Learn", info:"Tap a card to hear the Cypriot word, then the Standard Greek one."},
  {id:"phrases", name:"Phrases", info:"Whole phrases of the Cypriot dialect, with the Standard Greek next to them. Tap one to hear both."},
  {id:"rules", name:"How it differs", info:"The main differences between Cypriot and Standard Greek, with examples. Tap an example to hear it."},
  {id:"places", name:"Places", info:"Towns, mountains and villages of Cyprus, with their Greek names. Tap a card to hear it."},
  {id:"food", name:"Food & drink", info:"Dishes, sweets and drinks of Cyprus, with their Greek names. Tap a card to hear it."},
  {id:"quiz", name:"Cyprus quiz", info:"You see the Greek name of a place or a dish. Tap what it is."},
  {id:"pick",  name:"Cypriot or standard?", info:"Two words mean the same. Tap the Cypriot one."},
  {id:"find",  name:"Find the Cypriot word", info:"You see a Standard Greek word. Tap its Cypriot form."},
  {id:"understand", name:"What does it mean?", info:"You see a Cypriot phrase. Tap its meaning."}
];
let cyMode = "learn";
const cyMeaning = w => pick(w);
function renderCyLearn(){
  const box = $("cyRead"); box.innerHTML = "";
  const note = document.createElement("div"); note.className = "panel";
  note.innerHTML = `<p>${esc(tx("The Cypriot dialect (κυπριακά) is the Greek spoken in Cyprus. Many words and endings are different, and the pronunciation too. Here are some documented examples."))}</p>
    <p class="muted">${esc(tx("The written forms come from Wikipedia. The voice here reads them with a Standard Greek accent, not the Cypriot one. Check with a Cypriot speaker."))}</p>`;
  box.appendChild(note);
  const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
  CYPRIOT.words.forEach(w=>{
    const b = document.createElement("button"); b.type = "button"; b.className = "line cyline";
    b.innerHTML = `<span class="ltxt"><b lang="el">${esc(w.gr)}</b><span>🇨🇾 <span class="lt">${esc(w.lat)}</span></span><span lang="el" class="cystd">= ${esc(w.say)}</span><span>${esc(cyMeaning(w))}</span></span><span aria-hidden="true">🔊</span>`;
    b.onclick = ()=>say([w.gr, w.say]);
    list.appendChild(b);
  });
}
function renderCyPhrases(){
  const box = $("cyRead"); box.innerHTML = "";
  const note = document.createElement("div"); note.className = "panel";
  note.innerHTML = `<p>${esc(tx("The phrases are copied from Wikipedia (the Cypriot form as written there). The voice reads them with a Standard Greek accent, not the Cypriot one. Check with a Cypriot speaker."))}</p>`;
  box.appendChild(note);
  const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
  CYPRIOT.phrases.forEach(w=>{
    const b = document.createElement("button"); b.type = "button"; b.className = "line cyline";
    b.innerHTML = `<span class="ltxt"><b lang="el">${esc(w.gr)}</b><span>🇨🇾 <span class="lt">${esc(w.lat)}</span></span><span lang="el" class="cystd">= ${esc(w.say)}</span><span>${esc(cyMeaning(w))}</span></span><span aria-hidden="true">🔊</span>`;
    b.onclick = ()=>say([w.gr, w.say]);
    list.appendChild(b);
  });
}
function cyLines(list, text){
  const box = $("cyRead"); box.innerHTML = "";
  const note = document.createElement("div"); note.className = "panel";
  note.innerHTML = `<p>${esc(tx(text))}</p>`; box.appendChild(note);
  const out = document.createElement("div"); out.className = "lines"; box.appendChild(out);
  return out;
}
function renderCyRules(){
  const list = cyLines(CYPRIOT.rules, "These differences are described on the Wikipedia pages about the Cypriot dialect. Spellings vary a lot from one writer to another: check with a Cypriot speaker.");
  CYPRIOT.rules.forEach(r=>{
    const card = document.createElement("div"); card.className = "panel cyrule";
    card.innerHTML = `<h3 class="sub" style="margin-top:0">${esc(pick(r.title))}</h3><p>${esc(pick(r.text))}</p>`;
    const ex = document.createElement("div"); ex.className = "lines";
    r.ex.forEach(w=>{
      const b = document.createElement("button"); b.type = "button"; b.className = "line cyline";
      b.innerHTML = `<span class="ltxt"><b lang="el">${esc(w.gr)}</b><span lang="el" class="cystd">= ${esc(w.say)}</span><span>${esc(cyMeaning(w))}</span></span><span aria-hidden="true">🔊</span>`;
      b.onclick = ()=>say([w.gr, w.say]);
      ex.appendChild(b);
    });
    card.appendChild(ex); list.appendChild(card);
  });
}
const CY_KIND = {island:"Island", town:"Town", village:"Village", mountain:"Mountains", area:"Area"};
function renderCyPlaces(){
  const list = cyLines(CYPRIOT.places, "The Greek names of places in Cyprus. Famagusta, Kyrenia and Morphou are in the north of the island, which is under Turkish control since 1974.");
  CYPRIOT.places.forEach(w=>{
    const b = document.createElement("button"); b.type = "button"; b.className = "line cyline";
    b.innerHTML = `<span class="ltxt"><b lang="el">${esc(w.gr)}</b><span><span class="lt">${esc(w.lat)}</span></span><span>${esc(LANG==="fr" ? w.fr : w.en)} · ${esc(tx(CY_KIND[w.kind]))}</span><span class="muted">${esc(pick(w.note))}</span></span><span aria-hidden="true">🔊</span>`;
    b.onclick = ()=>say(w.gr);
    list.appendChild(b);
  });
}
function renderCyFood(){
  const list = cyLines(CYPRIOT.foods, "The Greek names of dishes, sweets and drinks of Cyprus. Many are also eaten in Greece and Turkey, with small differences.");
  CYPRIOT.foods.forEach(w=>{
    const b = document.createElement("button"); b.type = "button"; b.className = "line cyline";
    b.innerHTML = `<span class="ltxt"><b lang="el">${esc(w.gr)}</b><span><span class="lt">${esc(w.lat)}</span></span><span>${esc(LANG==="fr" ? w.fr : w.en)}</span><span class="muted">${esc(pick(w.note))}</span></span><span aria-hidden="true">🔊</span>`;
    b.onclick = ()=>say(w.gr);
    list.appendChild(b);
  });
}
/* the quiz mixes places and foods: the Greek name -> the English or French name of a place, or the short description of a dish (its name alone would say nothing) */
function cyQuizQuestions(){
  const pool = [...CYPRIOT.places.map(w=>({...w, grp:"place"})), ...CYPRIOT.foods.map(w=>({...w, grp:"food"}))];
  const next = deck(pool), name = w => LANG==="fr" ? w.fr : w.en, label = w => w.grp==="food" ? pick(w.note) : name(w);
  return ()=>{
    const w = next(), others = sample(pool.filter(x=>x!==w && x.grp===w.grp && label(x)!==label(w)), 3);
    const item = {key:"cyq:"+w.gr, gr:w.gr, en:w.en, fr:w.fr, lat:w.lat, snd:sid(w.gr), cat:"Cypriot Greek"};
    return {item, prompt:`<p class="vinfo">${esc(tx(w.grp==="place" ? "A place in Cyprus" : "A dish or a drink of Cyprus"))}</p><p class="word s" lang="el">${esc(w.gr)}</p>`, say:w.gr,
      options:shuffle([{html:esc(label(w)), ok:true}, ...others.map(o=>({html:esc(label(o)), ok:false}))]), cols:w.grp==="food" ? 1 : 2,
      reveal:`<b lang="el">${esc(w.gr)}</b> <span class="lt">(${esc(w.lat)})</span><br>${esc(name(w))} · ${esc(pick(w.note))}`, sayAfter:w.gr};
  };
}
function cyPhraseQuestions(){
  const next = deck(CYPRIOT.phrases);
  return ()=>{
    const w = next(), others = sample(CYPRIOT.phrases.filter(x=>x!==w), 3);
    const item = {key:"cyp:"+w.gr, gr:w.gr, en:w.en, fr:w.fr, lat:w.lat, snd:sid(w.gr), cat:"Cypriot Greek"};
    return {item, prompt:`<p class="vinfo">${esc(tx("Cypriot Greek"))}</p><p class="word s" lang="el">${esc(w.gr)}</p>`, say:w.gr,
      options:shuffle([{html:esc(cyMeaning(w)), ok:true}, ...others.map(o=>({html:esc(cyMeaning(o)), ok:false}))]), cols:1,
      reveal:`<b lang="el">${esc(w.gr)}</b> (Κυπριακά) = <b lang="el">${esc(w.say)}</b><br>${esc(cyMeaning(w))}`, sayAfter:[w.gr, w.say]};
  };
}
function cyQuestions(kind){
  const next = deck(CYPRIOT.words);
  return ()=>{
    const w = next(), others = sample(CYPRIOT.words.filter(x=>x!==w), 3);
    const item = {key:"cy:"+w.gr, gr:w.gr, en:w.en, fr:w.fr, lat:w.lat, snd:sid(w.gr), cat:"Cypriot Greek"};
    const reveal = `<b lang="el">${esc(w.gr)}</b> (Κυπριακά) = <b lang="el">${esc(w.say)}</b><br>${esc(cyMeaning(w))}`;
    const g = x => ({html:`<span lang="el">${esc(x)}</span>`});
    if(kind==="pick") return {item, prompt:`<p class="vinfo">${esc(tx("Which one is Cypriot?"))}</p><p class="vinfo muted">${esc(cyMeaning(w))}</p>`,
      options:shuffle([{...g(w.gr), ok:true}, {...g(w.say), ok:false}]), cols:2, reveal, sayAfter:[w.gr, w.say]};
    return {item, prompt:`<p class="vinfo">${esc(tx("Standard Greek"))}</p><p class="word s" lang="el">${esc(w.say)}</p><p class="vinfo muted">${esc(cyMeaning(w))}</p>`, say:w.say,
      options:shuffle([{...g(w.gr), ok:true}, ...others.map(o=>({...g(o.gr), ok:false}))]), reveal, sayAfter:[w.gr]};
  };
}
function startCypriot(){
  stopSound();
  $("cyModes").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===cyMode));
  $("cyInfo").textContent = tx(CY_MODES.find(m=>m.id===cyMode).info);
  const learn = ["learn","phrases","rules","places","food"].includes(cyMode);
  $("cyRead").hidden = !learn; $("cyGame").hidden = learn;
  if(cyMode==="learn") renderCyLearn();
  else if(cyMode==="phrases") renderCyPhrases();
  else if(cyMode==="rules") renderCyRules();
  else if(cyMode==="places") renderCyPlaces();
  else if(cyMode==="food") renderCyFood();
  else if(cyMode==="quiz") runQuiz($("cyGame"), {id:"cypriot-quiz", total:10, make:cyQuizQuestions()});
  else runQuiz($("cyGame"), {id:`cypriot-${cyMode}`, total:Math.min(10, cyMode==="understand" ? CYPRIOT.phrases.length : CYPRIOT.words.length), make:(cyMode==="understand" ? cyPhraseQuestions : cyQuestions)(cyMode)});
}
function openCypriot(){
  const modes = $("cyModes");
  if(!modes.children.length) CY_MODES.forEach(m=>{
    const b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.dataset.mode = m.id; b.textContent = tx(m.name);
    b.onclick = ()=>{ cyMode = m.id; startCypriot(); };
    modes.appendChild(b);
  });
  startCypriot();
}
