/* ---------- poems ----------
   Famous poems (and poems about Cyprus), built from data/poems.js. Same ideas as the stories:
   Read & listen: every verse has a 🔊 button, "Listen to the poem" plays them all, and you can tap any word to see what it means
   (the words are in POEMS.gloss; the words of the stories can be tapped too).
   Fill the gap: a word of a verse is hidden, tap the right one. */
const POEM_MODES = [
  {id:"learn", name:"Read & listen", info:"Tap a word to see what it means. Tap 🔊 to hear a verse, or the whole poem."},
  {id:"gap",   name:"Fill the gap",  info:"One word is missing. Tap it."}
];
let poemMode = "learn", poemGroup = null, poemShowTr = true, poemToken = 0;

const poemList = () => POEMS.poems;
const poemById = id => poemList().find(p=>p.id===id);
const POEM_GLOSS_BY = new Map(POEMS.gloss.map(g=>[wordKey(g.gr), g]));
const poemPool = () => poemGroup==="all" ? poemList() : [poemById(poemGroup)];
const cleanWord = t => t.replace(/[.,;:!?«»"…·]/g, "");

function stopPoem(){ poemToken++; stopSound(); document.querySelectorAll(".verse.playing").forEach(p=>p.classList.remove("playing")); }

async function playPoem(poem, btn){
  stopPoem(); const my = poemToken;
  btn.classList.add("on"); btn.textContent = "⏹ " + tx("Stop");
  const rows = [...document.querySelectorAll("#poemRead .verse")];
  for(let i=0; i<poem.lines.length; i++){
    if(my!==poemToken) break;
    rows.forEach((r,j)=>r.classList.toggle("playing", j===i));
    rows[i].scrollIntoView({block:"nearest", behavior:"smooth"});
    const r = await playRec(sid(poem.lines[i].gr));
    if(r!=="ok" || my!==poemToken) break;
    await new Promise(res=>setTimeout(res, poem.lines[i].end ? 600 : 250));
  }
  if(my===poemToken) rows.forEach(r=>r.classList.remove("playing"));
  btn.classList.remove("on"); btn.textContent = "▶ " + tx("Listen to the poem");
}

function showPoemGloss(token, wordBtn){
  const g = POEM_GLOSS_BY.get(wordKey(token)) || GLOSS_BY.get(wordKey(token)), box = $("poemGloss");
  document.querySelectorAll("#poemRead .sword.sel").forEach(b=>b.classList.remove("sel"));
  if(wordBtn) wordBtn.classList.add("sel");
  if(!g){ box.innerHTML = `<span class="muted">${esc(tx("No translation for this word."))}</span>`; return; }
  box.innerHTML = `<b lang="el">${esc(g.gr)}</b> <i><span class="lt">${esc(g.lat)}</span></i> <span>— ${esc(pick(g))}</span>`;
  box.appendChild(favButton({gr:g.gr, lat:g.lat, en:g.en, fr:g.fr, snd:sid(g.gr), cat:"Poems & proverbs"}, "inline"));
  if(typeof ownWordButton==="function") box.appendChild(ownWordButton(g));
  say(g.gr);
}

function renderPoemLearn(){
  const box = $("poemRead"), poem = poemById(poemGroup);
  box.innerHTML = "";
  const head = document.createElement("div"); head.className = "poem-head";
  head.innerHTML = `${poem.cyprus ? `<span class="poem-tag">🏝️ ${esc(tx("About Cyprus"))}</span>` : ""}
    <h2 class="poem-title" lang="el">${esc(poem.title.gr)}</h2>
    <p class="poem-sub">${esc(pick(poem.title))}</p>
    <p class="poem-by">${esc([pick(poem.author), poem.years].filter(Boolean).join(" · "))}</p>
    <p class="poem-about">${esc(pick(poem.about))}</p>`;
  box.appendChild(head);

  const bar = document.createElement("div"); bar.className = "story-bar";
  const play = document.createElement("button");
  play.type = "button"; play.className = "btn"; play.textContent = "▶ " + tx("Listen to the poem");
  play.onclick = ()=>{ if(play.classList.contains("on")){ stopPoem(); play.classList.remove("on"); play.textContent = "▶ " + tx("Listen to the poem"); } else playPoem(poem, play); };
  const tog = document.createElement("button");
  tog.type = "button"; tog.className = "chip"; tog.setAttribute("aria-pressed", poemShowTr); tog.textContent = "👁 " + tx("Show the meaning");
  tog.onclick = ()=>{ poemShowTr = !poemShowTr; stopPoem(); renderPoemLearn(); };
  bar.append(play, tog); box.appendChild(bar);

  const text = document.createElement("div"); text.className = "poem-text"; box.appendChild(text);
  poem.lines.forEach(l=>{
    const p = document.createElement("div"); p.className = "verse" + (l.end ? " end" : "");
    const ear = document.createElement("button");
    ear.type = "button"; ear.className = "splay"; ear.textContent = "🔊"; ear.setAttribute("aria-label", tx("Listen"));
    ear.onclick = ()=>{ stopPoem(); say(l.gr); };
    const words = document.createElement("span"); words.className = "swords"; words.lang = "el";
    l.gr.split(" ").forEach(tok=>{
      const w = document.createElement("button");
      w.type = "button"; w.className = "sword"; w.textContent = tok;
      w.onclick = ()=>{ stopPoem(); showPoemGloss(cleanWord(tok), w); };
      words.appendChild(w);
    });
    p.append(ear, words);
    if(poemShowTr){ const t = document.createElement("span"); t.className = "strans"; t.textContent = pick(l); p.appendChild(t); }
    text.appendChild(p);
  });
  const gl = document.createElement("div"); gl.id = "poemGloss"; gl.className = "gloss-pop"; gl.setAttribute("aria-live","polite");
  gl.innerHTML = `<span class="muted">${esc(tx("Tap a word."))}</span>`;
  box.appendChild(gl);
  const links = typeof linksBlock==="function" && typeof TEXTS!=="undefined" ? linksBlock(TEXTS.poemLinks[poem.id]) : null;
  if(links) box.appendChild(links);
  const src = document.createElement("p"); src.className = "note"; src.textContent = tx(poem.id.startsWith("proverbs") ? "Texts: Greek Wikiquote." : "Texts: Greek Wikisource (public-domain poems).");
  box.appendChild(src);
}

/* a verse with one word hidden; the other answers are words of the same poems */
function poemGapQuestions(){
  const pool = poemPool();
  const lines = pool.flatMap(p=>p.lines.map(l=>({p, l})));
  const words = [...new Set(pool.flatMap(p=>p.lines.flatMap(l=>l.gr.split(" ").map(t=>cleanWord(t).toLowerCase()))))].filter(w=>w.length>=3);
  const next = deck(lines);
  return ()=>{
    let pick1, toks, idx;
    for(let tries=0; tries<20; tries++){
      pick1 = next(); toks = pick1.l.gr.split(" ");
      const ok = toks.map((t,i)=>[t,i]).filter(([t])=>cleanWord(t).length>=4);
      if(ok.length){ idx = oneOf(ok)[1]; break; }
    }
    if(idx===undefined) idx = 0;
    const answer = cleanWord(toks[idx]).toLowerCase();
    const shown = toks.map((t,i)=>i===idx ? "_____" : t).join(" ");
    const wrong = sample(words.filter(w=>w!==answer), 3);
    return {prompt:`<p class="vinfo">${esc(pick(pick1.p.title))}</p><p class="word s" lang="el">${esc(shown)}</p><p class="vinfo">${esc(pick(pick1.l))}</p>`,
            say:pick1.l.gr,
            options:shuffle([{html:`<span lang="el">${esc(answer)}</span>`, ok:true}, ...wrong.map(w=>({html:`<span lang="el">${esc(w)}</span>`, ok:false}))]),
            reveal:`<b lang="el">${esc(pick1.l.gr)}</b><br>${esc(pick(pick1.l))}`, sayAfter:pick1.l.gr};
  };
}
const poemTotal = () => Math.min(8, poemPool().reduce((n,p)=>n+p.lines.length, 0));

function startPoems(){
  stopPoem();
  if(poemMode==="learn" && poemGroup==="all") poemGroup = poemList()[0].id;
  $("poemModes").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===poemMode));
  $("poemGroups").querySelectorAll(".chip").forEach(b=>{
    b.setAttribute("aria-pressed", b.dataset.group===poemGroup);
    if(b.dataset.group==="all") b.hidden = poemMode!=="gap";
  });
  $("poemInfo").textContent = tx(POEM_MODES.find(m=>m.id===poemMode).info);
  const learn = poemMode==="learn";
  $("poemRead").hidden = !learn; $("poemGame").hidden = learn;
  if(learn) renderPoemLearn();
  else runQuiz($("poemGame"), {id:`poem-${poemGroup}`, total:poemTotal(), make:poemGapQuestions()});
}

function openPoems(){
  const modes = $("poemModes");
  if(!poemGroup) poemGroup = poemList()[0].id;
  if(!modes.children.length){
    POEM_MODES.forEach(m=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.mode = m.id; b.textContent = tx(m.name);
      b.onclick = ()=>{ poemMode = m.id; startPoems(); };
      modes.appendChild(b);
    });
    [...poemList().map(p=>[p.id, (p.cyprus ? "🏝️ " : p.id.startsWith("proverbs") ? "💬 " : "") + pick(p.title)]), ["all", tx("Everything")]].forEach(([id,name])=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.group = id; b.textContent = name;
      b.onclick = ()=>{ poemGroup = id; startPoems(); };
      $("poemGroups").appendChild(b);
    });
  }
  startPoems();
}
