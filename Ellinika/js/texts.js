/* ---------- texts to read: fables, myths, famous poems, a prayer ----------
   Built from data/texts.js. Same ideas as the poems page:
   Read & listen: every line has a 🔊 button, "Listen to the text" plays them all, and you can tap any word to see what it means.
   Fill the gap: a word of a line is hidden, tap the right one.
   Under each text there are links: videos and documents to open on the internet (TEXTS.texts[].links).
   A tapped word is looked up in this order: TEXTS.gloss, the words of the poems, the words of the stories, then the dictionary of the app
   (the word itself, or a form of a verb, like ετοιμάζεις or έφτιαξε). */
const TEXT_MODES = [
  {id:"learn", name:"Read & listen", info:"Tap a word to see what it means. Tap 🔊 to hear a line, or the whole text."},
  {id:"gap",   name:"Fill the gap",  info:"One word is missing. Tap it."},
  {id:"quiz",  name:"Questions",     info:"Read the text, then answer the questions about it."},
  {id:"dict",  name:"Dictation",     info:"Listen to a line of the text, then write what you hear with Greek letters. Accents, capitals and punctuation do not matter."}
];
const TEXT_KINDS = [["all","All"], ["fable","Fables"], ["myth","Myths & legends"], ["culture","Culture"], ["poem","Poems"], ["prayer","Prayer"], ["recipe","Recipes"], ["song","Songs"], ["reading","Readings"]];
/* the recipes of data/recipes.js are texts of the kind "recipe" */
TEXTS.texts.push(...RECIPES.texts, ...SONGS.texts, ...READINGS.texts); TEXTS.gloss.push(...RECIPES.gloss, ...SONGS.gloss, ...READINGS.gloss);
let textMode = "learn", textKind = "fable", textGroup = null, textShowTr = true, textToken = 0;

const textList = () => TEXTS.texts;
const textById = id => textList().find(t=>t.id===id);
const textsOfKind = k => textList().filter(t=>k==="all" || t.kind===k || (k==="myth" && t.kind==="legend"));
const TEXT_GLOSS_BY = new Map(TEXTS.gloss.map(g=>[wordKey(g.gr), g]));
const textClean = t => t.replace(/[.,;:!?«»"“”…·—\-()]/g, "");
const textPool = () => textGroup==="all" ? textsOfKind(textKind) : [textById(textGroup)];

function stopText(){ textToken++; stopSound(); document.querySelectorAll("#textRead .verse.playing").forEach(p=>p.classList.remove("playing")); }

/* ----- the meaning of a tapped word ----- */
let TEXT_FORMS = null;   /* folded form of a verb -> {verb, form} */
function textFormMap(){
  if(TEXT_FORMS) return TEXT_FORMS;
  TEXT_FORMS = new Map();
  DICT.filter(e=>e.forms).forEach(e=>Object.values(e.forms).flat().forEach(f=>{ const k = fold(f.replace(/^θα /,"")); if(!TEXT_FORMS.has(k)) TEXT_FORMS.set(k, e); }));
  return TEXT_FORMS;
}
function textLookup(token){
  const key = wordKey(token), g = TEXT_GLOSS_BY.get(key) || POEM_GLOSS_BY.get(key) || GLOSS_BY.get(key);
  if(g) return {gr:g.gr, lat:g.lat, en:g.en, fr:g.fr};
  const f = fold(token);
  const e = DICT.find(x=>x.type!=="letter" && fold(withoutArticle(x.gr))===f) || textFormMap().get(f);
  if(e) return {gr:token.toLowerCase(), lat:translit(token.toLowerCase()), en:e.en, fr:frOf(e), via:e.gr===token.toLowerCase() || fold(withoutArticle(e.gr))===f ? "" : e.gr};
  return null;
}
function showTextGloss(token, wordBtn){
  const g = textLookup(token), box = $("textGloss");
  document.querySelectorAll("#textRead .sword.sel").forEach(b=>b.classList.remove("sel"));
  if(wordBtn) wordBtn.classList.add("sel");
  if(!g){ box.innerHTML = `<span class="muted">${esc(tx("No translation for this word."))}</span>`; return; }
  box.innerHTML = `<b lang="el">${esc(g.gr)}</b> <i><span class="lt">${esc(g.lat)}</span></i> <span>— ${esc(pick(g))}${g.via ? ` <span class="muted">(${esc(tx("form of"))} <span lang="el">${esc(g.via)}</span>)</span>` : ""}</span>`;
  box.appendChild(ownWordButton(g));
  say(g.gr);
}

/* ----- the links under a text: videos and documents on the internet ----- */
function linksBlock(links, title){
  if(!links || !links.length) return null;
  const box = document.createElement("div"); box.className = "linksbox";
  box.innerHTML = `<h2 class="sub">${esc(tx(title || "To watch and read"))}</h2><p class="note">${esc(tx("These links open on the internet. I checked that each video or page exists; I did not watch every video to the end."))}</p>`;
  links.forEach(l=>{
    const a = document.createElement("a"); a.className = "linkrow " + l.k; a.href = l.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.innerHTML = `<span class="lk-ico" aria-hidden="true">${l.k==="video" ? "▶️" : "📄"}</span>
      <span class="lk-t"><b>${esc(l.title)}</b><span>${esc(l.by)}</span>${l.note ? `<span class="lk-n">${esc(pick(l.note))}</span>` : ""}</span><span class="lk-go" aria-hidden="true">↗</span>`;
    box.appendChild(a);
  });
  return box;
}

async function playText(text, btn){
  stopText(); const my = textToken;
  btn.classList.add("on"); btn.textContent = "⏹ " + tx("Stop");
  const rows = [...document.querySelectorAll("#textRead .verse")];
  for(let i=0; i<text.lines.length; i++){
    if(my!==textToken) break;
    rows.forEach((r,j)=>r.classList.toggle("playing", j===i));
    rows[i].scrollIntoView({block:"nearest", behavior:"smooth"});
    const r = await playRec(sid(text.lines[i].gr));
    if(r!=="ok" || my!==textToken) break;
    await new Promise(res=>setTimeout(res, text.lines[i].end ? 600 : 250));
  }
  if(my===textToken) rows.forEach(r=>r.classList.remove("playing"));
  btn.classList.remove("on"); btn.textContent = "▶ " + tx("Listen to the text");
}

function renderTextLearn(){
  const box = $("textRead"), text = textById(textGroup);
  box.innerHTML = "";
  const head = document.createElement("div"); head.className = "poem-head";
  const by = [pick(text.author), text.years].filter(Boolean).join(" · ");
  head.innerHTML = `<span class="poem-tag"><span class="lvlb" data-l="${text.level}">${text.level}</span> ${esc(tx(KIND_NAME[text.kind]))}</span>
    <h2 class="poem-title" lang="el">${esc(text.title.gr)}</h2>
    <p class="poem-sub">${esc(pick(text.title))}</p>
    <p class="poem-by">${esc(by)}</p>
    <p class="poem-about">${esc(pick(text.about))}</p>`;
  box.appendChild(head);

  const bar = document.createElement("div"); bar.className = "story-bar";
  const play = document.createElement("button");
  play.type = "button"; play.className = "btn"; play.textContent = "▶ " + tx("Listen to the text");
  play.onclick = ()=>{ if(play.classList.contains("on")){ stopText(); play.classList.remove("on"); play.textContent = "▶ " + tx("Listen to the text"); } else playText(text, play); };
  const tog = document.createElement("button");
  tog.type = "button"; tog.className = "chip"; tog.setAttribute("aria-pressed", textShowTr); tog.textContent = "👁 " + tx("Show the meaning");
  tog.onclick = ()=>{ textShowTr = !textShowTr; stopText(); renderTextLearn(); };
  bar.append(play, tog); box.appendChild(bar);

  const body = document.createElement("div"); body.className = "poem-text"; box.appendChild(body);
  text.lines.forEach(l=>{
    const p = document.createElement("div"); p.className = "verse" + (l.end ? " end" : "");
    const ear = document.createElement("button");
    ear.type = "button"; ear.className = "splay"; ear.textContent = "🔊"; ear.setAttribute("aria-label", tx("Listen"));
    ear.onclick = ()=>{ stopText(); say(l.gr); };
    const words = document.createElement("span"); words.className = "swords"; words.lang = "el";
    l.gr.split(" ").forEach(tok=>{
      const w = document.createElement("button");
      w.type = "button"; w.className = "sword"; w.textContent = tok;
      w.onclick = ()=>{ stopText(); showTextGloss(textClean(tok), w); };
      words.appendChild(w);
    });
    p.append(ear, words);
    if(textShowTr){ const t = document.createElement("span"); t.className = "strans"; t.textContent = pick(l); p.appendChild(t); }
    body.appendChild(p);
  });
  const gl = document.createElement("div"); gl.id = "textGloss"; gl.className = "gloss-pop"; gl.setAttribute("aria-live","polite");
  gl.innerHTML = `<span class="muted">${esc(tx("Tap a word."))}</span>`;
  box.appendChild(gl);
  const links = linksBlock(text.links); if(links) box.appendChild(links);
  const src = document.createElement("p"); src.className = "note";
  src.textContent = tx(text.kind==="poem" || text.kind==="prayer" ? "Text: Greek Wikisource (public domain), with the modern one-accent spelling." : text.kind==="recipe" ? "Written for this app in simple Greek. Check the amounts before you cook!" : text.kind==="reading" ? "A short text written for this app in simple Greek, with questions. Not checked by a native speaker yet." : text.kind==="song" ? "Traditional or public-domain words, copied from Greek Wikisource and Wikipedia (CC BY-SA 4.0), with the modern one-accent spelling. The translations are mine." : "Retold for this app in simple Greek: the story is traditional, the words are not from a book.");
  box.appendChild(src);
}
const KIND_NAME = {fable:"Fable", myth:"Myth", legend:"Legend", culture:"Culture", poem:"Poem", prayer:"Prayer", recipe:"Recipe", song:"Song", reading:"Reading"};

/* ----- the gap game ----- */
function textGapQuestions(){
  const pool = textPool();
  const lines = pool.flatMap(p=>p.lines.map(l=>({p, l})));
  const words = [...new Set(pool.flatMap(p=>p.lines.flatMap(l=>l.gr.split(" ").map(t=>textClean(t).toLowerCase()))))].filter(w=>w.length>=3);
  const next = deck(lines);
  return ()=>{
    let pick1, toks, idx;
    for(let tries=0; tries<20; tries++){
      pick1 = next(); toks = pick1.l.gr.split(" ");
      const ok = toks.map((t,i)=>[t,i]).filter(([t])=>textClean(t).length>=4);
      if(ok.length){ idx = oneOf(ok)[1]; break; }
    }
    if(idx===undefined) idx = 0;
    const answer = textClean(toks[idx]).toLowerCase();
    const shown = toks.map((t,i)=>i===idx ? t.replace(/[\p{L}'’]+/u, "_____") : t).join(" ");   /* the punctuation around the hidden word stays */
    const wrong = sample(words.filter(w=>w!==answer), 3);
    return {prompt:`<p class="vinfo">${esc(pick(pick1.p.title))}</p><p class="word s" lang="el">${esc(shown)}</p><p class="vinfo">${esc(pick(pick1.l))}</p>`,
            say:pick1.l.gr,
            options:shuffle([{html:`<span lang="el">${esc(answer)}</span>`, ok:true}, ...wrong.map(w=>({html:`<span lang="el">${esc(w)}</span>`, ok:false}))]),
            reveal:`<b lang="el">${esc(pick1.l.gr)}</b><br>${esc(pick(pick1.l))}`, sayAfter:pick1.l.gr};
  };
}
const textTotal = () => Math.min(8, textPool().reduce((n,p)=>n+p.lines.length, 0));

/* ----- the dictation: a line of the text is read, you write it ----- */
function textDictQuestions(){
  const lines = textPool().flatMap(p=>p.lines.map((l,i)=>({p, l, i}))).filter(x=>{ const n = x.l.gr.split(" ").length; return n>=3 && n<=12; });
  const next = deck(lines);
  return ()=>{
    const {p, l, i} = next();
    return {item:{key:`td:${p.id}:${i}`, gr:l.gr, en:l.en, fr:l.fr, lat:l.lat, snd:sid(l.gr), cat:"Texts"},
            prompt:`<p class="word s">🔊 ${esc(tx("Listen, then write it"))}</p><p class="vinfo muted">${esc(pick(p.title))}</p>`, say:l.gr, autoplay:true,
            write:{answers:[l.gr], diff:true}, hint:`${esc(tx("It sounds like:"))} <b>${esc(l.lat)}</b>`,
            reveal:`<b lang="el">${esc(l.gr)}</b><br>${esc(pick(l))}`};
  };
}

/* ----- the questions about a text ----- */
function textQuizQuestions(){
  const pool = textPool().filter(t=>t.qs);
  const items = pool.flatMap(t=>t.qs.map(q=>({t, q})));
  const next = deck(items);
  return ()=>{
    const {t, q} = next();
    return {prompt:`<p class="vinfo">${esc(pick(t.title))}</p><p class="word s" lang="el">${esc(q.q.gr)}</p><p class="vinfo muted">${esc(pick(q.q))}</p>`, say:q.q.gr, cols:1,
            options:greekOptions(q.ok, q.bad), reveal:`<b lang="el">${esc(q.ok)}</b>`, sayAfter:q.ok};
  };
}
const textQuizTotal = () => Math.min(8, textPool().filter(t=>t.qs).reduce((n,t)=>n+t.qs.length, 0));

/* ----- the page ----- */
function paintTextChips(){
  $("textModes").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===textMode));
  $("textKinds").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.kind===textKind));
  const shown = textsOfKind(textKind);
  $("textGroups").querySelectorAll(".chip").forEach(b=>{
    const t = textById(b.dataset.group);
    const inKind = b.dataset.group==="all" ? textMode!=="learn" : shown.some(x=>x.id===b.dataset.group) && (textMode!=="quiz" || t.qs);
    b.hidden = !inKind; b.setAttribute("aria-pressed", b.dataset.group===textGroup);
  });
}
function startTexts(){
  stopText();
  const shown = textsOfKind(textKind);
  if(textGroup!=="all" && !shown.some(t=>t.id===textGroup)) textGroup = shown[0].id;
  if(textMode==="learn" && textGroup==="all") textGroup = shown[0].id;
  paintTextChips();
  $("textInfo").textContent = tx(TEXT_MODES.find(m=>m.id===textMode).info);
  const learn = textMode==="learn", quiz = textMode==="quiz";
  if(quiz && textGroup!=="all" && !textById(textGroup).qs){ const f = shown.find(t=>t.qs); if(f) textGroup = f.id; }
  $("textRead").hidden = learn ? false : !(quiz && textGroup!=="all"); $("textGame").hidden = learn; $("textTraditions").hidden = !learn;
  if(learn || (quiz && textGroup!=="all")) renderTextLearn();
  if(quiz) runQuiz($("textGame"), {id:`text-q-${textGroup}`, total:textQuizTotal(), make:textQuizQuestions()});
  else if(!learn) runQuiz($("textGame"), {id:`text-${textMode}-${textKind}-${textGroup}`, total:textTotal(), make:(textMode==="dict" ? textDictQuestions : textGapQuestions)()});
}
function openTexts(){
  const modes = $("textModes");
  if(!textGroup) textGroup = textList().find(t=>t.kind==="fable").id;
  if(!modes.children.length){
    TEXT_MODES.forEach(m=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.mode = m.id; b.textContent = tx(m.name);
      b.onclick = ()=>{ textMode = m.id; startTexts(); };
      modes.appendChild(b);
    });
    TEXT_KINDS.forEach(([id,name])=>{
      const n = textsOfKind(id).length; if(!n) return;
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.kind = id; b.innerHTML = `${esc(tx(name))} <span class="n">${n}</span>`;
      b.onclick = ()=>{ textKind = id; startTexts(); };
      $("textKinds").appendChild(b);
    });
    [...textList().map(t=>[t.id, `<span class="lvlb" data-l="${t.level}">${t.level}</span> ${esc(pick(t.title))}`]), ["all", esc(tx("Everything"))]].forEach(([id,html])=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.group = id; b.innerHTML = html;
      b.onclick = ()=>{ textGroup = id; startTexts(); };
      $("textGroups").appendChild(b);
    });
  }
  startTexts();
  renderTextTraditions();
}
/* the traditions list at the bottom of the page "Texts" (a block shown under the texts) */
function renderTextTraditions(){
  const holder = document.getElementById("textTraditions"); if(!holder) return;
  holder.innerHTML = "";
  const b = linksBlock(TEXTS.traditions, "Traditions of Cyprus: dances"); if(b) holder.appendChild(b);
}
