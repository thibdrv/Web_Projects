/* ---------- phrases ----------
   Short everyday phrases to understand, build word by word, and write with Greek letters.
   Built from data/phrases.js. In "write" modes a Greek keyboard is shown under the box. */
const PHRASE_MODES = [
  {id:"learn",      name:"Learn",       info:"Tap a phrase to hear it."},
  {id:"understand", name:"Understand",  info:"You see a Greek phrase. Tap its meaning."},
  {id:"build",      name:"Build",       info:"Tap the words in the right order to make the phrase."},
  {id:"write",      name:"Write it",    info:"You see a meaning. Write the phrase with Greek letters. Accents, capitals and punctuation do not matter."},
  {id:"dictation",  name:"Dictation",   info:"Listen, then write what you hear with Greek letters."}
];
let phraseMode = "learn", phraseGroup = PHRASES.groups[0].id;
const ALL_PHRASES = PHRASES.groups.flatMap(g=>g.phrases.map(p=>({...p, group:g.id, wordCount:p.gr.split(" ").length})));

const phrasePool = () => ALL_PHRASES.filter(p=>phraseGroup==="all" || p.group===phraseGroup);
/* the meaning in the chosen language first, the other language after it */
const phraseBoth = p => LANG==="fr" ? [p.fr, p.en] : [p.en, p.fr];
const phraseMeaning = p => `<p class="word s">${esc(phraseBoth(p)[0])}</p><p class="vinfo">${esc(phraseBoth(p)[1])}</p>`;
const phraseReveal = p => `<b lang="el">${esc(p.gr)}</b> <span class="lt">(${esc(p.lat)})</span><br>${esc(phraseBoth(p).join(" · "))}`;
/* the phrase this question is about (kept for the reviews) */
const phraseItem = p => ({key:`ph:${sid(p.gr)}`, gr:p.gr, en:p.en, fr:p.fr, lat:p.lat, snd:sid(p.gr), cat:"Phrases"});
const phraseAnswers = p => [p.gr, ...(p.alt||[])];

function phraseQuestions(mode){
  const pool = phrasePool();
  const next = deck(mode==="build" ? pool.filter(p=>p.wordCount>=3) : pool);
  return ()=>{
    const p = next(), base = {item:phraseItem(p), reveal:phraseReveal(p), sayAfter:p.gr};
    if(mode==="understand"){
      const others = sample(pool.filter(x=>x!==p),3);
      return {...base, prompt:`<p class="word s" lang="el">${esc(p.gr)}</p>`, say:p.gr,
              options:shuffle([{html:esc(pick(p)),ok:true}, ...others.filter(x=>pick(x)!==pick(p)).map(x=>({html:esc(pick(x)),ok:false}))])};
    }
    const hint = `${esc(tx("It sounds like:"))} <b>${esc(p.lat)}</b>`;
    if(mode==="build") return {...base, prompt:phraseMeaning(p), build:{answer:p.gr}, hint};
    if(mode==="write") return {...base, prompt:phraseMeaning(p), write:{answers:phraseAnswers(p), diff:true}, hint};
    /* dictation */    return {...base, prompt:`<p class="word s">🔊 ${esc(tx("Listen, then write it"))}</p>`, say:p.gr, autoplay:true, write:{answers:phraseAnswers(p), diff:true}, sayAfter:undefined};
  };
}

function renderPhraseLearn(){
  const box = $("phrLearn"); box.innerHTML = "";
  PHRASES.groups.filter(g=>phraseGroup==="all" || g.id===phraseGroup).forEach(g=>{
    const h = document.createElement("h2"); h.className = "sub"; h.textContent = tx(g.name); box.appendChild(h);
    const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
    g.phrases.forEach(p=>{
      const b = document.createElement("button");
      b.type = "button"; b.className = "line";
      b.innerHTML = `<span class="ltxt"><b lang="el">${esc(p.gr)}</b><span><span class="lt">${esc(p.lat)}</span></span><span>${esc(phraseBoth(p).join(" · "))}</span></span><span aria-hidden="true">🔊</span>`;
      b.onclick = ()=>say(p.gr);
      list.appendChild(b);
    });
  });
}

function startPhrases(){
  /* "Build" needs a few phrases with 3 words or more */
  const canBuild = phrasePool().filter(p=>p.wordCount>=3).length>=4;
  document.querySelectorAll("#phrModes .chip").forEach(b=>{ b.hidden = b.dataset.mode==="build" && !canBuild; });
  if(phraseMode==="build" && !canBuild) phraseMode = "learn";
  const m = PHRASE_MODES.find(x=>x.id===phraseMode), learn = phraseMode==="learn";
  document.querySelectorAll("#phrModes .chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mode===phraseMode));
  document.querySelectorAll("#phrGroups .chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.group===phraseGroup));
  $("phrInfo").textContent = tx(m.info);
  $("phrLearn").hidden = !learn; $("phrGame").hidden = learn;
  stopSound();
  if(learn) renderPhraseLearn();
  else runQuiz($("phrGame"), {id:`phrases-${phraseMode}-${phraseGroup}`, make:phraseQuestions(phraseMode)});
}
function openPhrases(){
  const modes = $("phrModes");
  if(!modes.children.length){
    PHRASE_MODES.forEach(m=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.mode = m.id; b.textContent = tx(m.name);
      b.onclick = ()=>{ phraseMode = m.id; startPhrases(); };
      modes.appendChild(b);
    });
    [...PHRASES.groups.map(g=>[g.id,tx(g.name)]), ["all",tx("Everything")]].forEach(([id,name])=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.group = id; b.textContent = name;
      b.onclick = ()=>{ phraseGroup = id; startPhrases(); };
      $("phrGroups").appendChild(b);
    });
  }
  startPhrases();
}
