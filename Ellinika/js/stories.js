/* ---------- stories ----------
   Short texts to read and listen to, built from data/stories.js.
   Read & listen: every sentence has a 🔊 button, "Listen to the story" plays them all, and you can tap any word to see what it means
   (the words are in STORIES.gloss). Questions: 2 questions per story, or 10 mixed ones with "Everything". */
const STORY_MODES = [
  {id:"learn", name:"Read & listen", info:"Tap a word to see what it means. Tap 🔊 to hear a sentence, or the whole story."},
  {id:"quiz",  name:"Questions",     info:"Read the story first. Then answer the questions about it."}
];
let storyMode = "learn", storyGroup = null, storyShowTr = true, storyToken = 0;

const storyList = () => STORIES.stories;
const storyById = id => storyList().find(s=>s.id===id);
const wordKey = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const GLOSS_BY = new Map(STORIES.gloss.map(g=>[wordKey(g.gr), g]));
const storyPool = () => storyGroup==="all" ? storyList() : [storyById(storyGroup)];

function stopStory(){ storyToken++; stopSound(); document.querySelectorAll(".sline.playing").forEach(p=>p.classList.remove("playing")); }

/* plays the sentences one after the other, lighting up the one that is playing */
async function playStory(story, btn){
  stopStory(); const my = storyToken;
  btn.classList.add("on"); btn.textContent = "⏹ " + tx("Stop");
  const rows = [...document.querySelectorAll("#storyRead .sline")];
  for(let i=0; i<story.lines.length; i++){
    if(my!==storyToken) break;
    rows.forEach((r,j)=>r.classList.toggle("playing", j===i));
    rows[i].scrollIntoView({block:"nearest", behavior:"smooth"});
    const r = await playRec(sid(story.lines[i].gr));
    if(r!=="ok" || my!==storyToken) break;
    await new Promise(res=>setTimeout(res, 250));
  }
  if(my===storyToken){ rows.forEach(r=>r.classList.remove("playing")); }
  btn.classList.remove("on"); btn.textContent = "▶ " + tx("Listen to the story");
}

function showGloss(token, wordBtn){
  const g = GLOSS_BY.get(wordKey(token)), box = $("storyGloss");
  document.querySelectorAll("#storyRead .sword.sel").forEach(b=>b.classList.remove("sel"));
  if(wordBtn) wordBtn.classList.add("sel");
  if(!g){ box.innerHTML = `<span class="muted">${esc(tx("No translation for this word."))}</span>`; return; }
  box.innerHTML = `<b lang="el">${esc(g.gr)}</b> <i><span class="lt">${esc(g.lat)}</span></i> <span>— ${esc(pick(g))}</span>`;
  box.appendChild(favButton({gr:g.gr, lat:g.lat, en:g.en, fr:g.fr, snd:sid(g.gr), cat:"Stories"}, "inline"));
  if(typeof ownWordButton==="function") box.appendChild(ownWordButton(g));
  say(g.gr);
}

function renderStoryLearn(){
  const box = $("storyRead"), story = storyById(storyGroup);
  box.innerHTML = "";
  const bar = document.createElement("div"); bar.className = "story-bar";
  const play = document.createElement("button");
  play.type = "button"; play.className = "btn"; play.textContent = "▶ " + tx("Listen to the story");
  play.onclick = ()=>{ if(play.classList.contains("on")){ stopStory(); play.classList.remove("on"); play.textContent = "▶ " + tx("Listen to the story"); } else playStory(story, play); };
  const tog = document.createElement("button");
  tog.type = "button"; tog.className = "chip"; tog.setAttribute("aria-pressed", storyShowTr); tog.textContent = "👁 " + tx("Show the meaning");
  tog.onclick = ()=>{ storyShowTr = !storyShowTr; stopStory(); renderStoryLearn(); };
  bar.append(play, tog); box.appendChild(bar);

  const h = document.createElement("h2"); h.className = "sub"; h.textContent = pick(story.name); box.appendChild(h);
  const text = document.createElement("div"); text.className = "story-text"; box.appendChild(text);
  story.lines.forEach(l=>{
    const p = document.createElement("div"); p.className = "sline";
    const ear = document.createElement("button");
    ear.type = "button"; ear.className = "splay"; ear.textContent = "🔊"; ear.setAttribute("aria-label", tx("Listen"));
    ear.onclick = ()=>{ stopStory(); say(l.gr); };
    const words = document.createElement("span"); words.className = "swords"; words.lang = "el";
    l.gr.split(" ").forEach(tok=>{
      const w = document.createElement("button");
      w.type = "button"; w.className = "sword"; w.textContent = tok;
      w.onclick = ()=>{ stopStory(); showGloss(tok.replace(/[.,;:!?«»"…·]/g,""), w); };
      words.appendChild(w);
    });
    p.append(ear, words);
    if(storyShowTr){ const t = document.createElement("span"); t.className = "strans"; t.textContent = pick(l); p.appendChild(t); }
    text.appendChild(p);
  });
  const gl = document.createElement("div"); gl.id = "storyGloss"; gl.className = "gloss-pop"; gl.setAttribute("aria-live","polite");
  gl.innerHTML = `<span class="muted">${esc(tx("Tap a word."))}</span>`;
  box.appendChild(gl);
  const q = document.createElement("button");
  q.type = "button"; q.className = "btn ghost"; q.textContent = "❓ " + tx("Answer the questions");
  q.onclick = ()=>{ storyMode = "quiz"; startStories(); window.scrollTo(0,0); };
  box.appendChild(q);
}

function storyQuestions(){
  const qs = storyPool().flatMap(s=>s.quiz.map(q=>({s, q})));
  const next = deck(qs);
  return ()=>{
    const {s, q} = next();
    const transcript = s.lines.map(l=>`<span lang="el">${esc(l.gr)}</span><br><span class="vinfo">${esc(pick(l))}</span>`).join("<br>");
    return {prompt:`<p class="vinfo">📖 ${esc(pick(s.name))}</p><p class="word s">${esc(pick(q))}</p>`,
            say:s.lines.map(l=>l.gr),
            options:shuffle([{html:esc(pick(q.ok)), ok:true}, ...q.bad.map(b=>({html:esc(pick(b)), ok:false}))]),
            reveal:transcript};
  };
}
const storyTotal = () => Math.min(10, storyPool().reduce((n,s)=>n+s.quiz.length, 0));

function startStories(){
  stopStory();
  if(storyMode==="learn" && storyGroup==="all") storyGroup = storyList()[0].id;
  const modes = $("storyModes"), groups = $("storyGroups");
  modes.querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===storyMode));
  groups.querySelectorAll(".chip").forEach(b=>{
    b.setAttribute("aria-pressed", b.dataset.group===storyGroup);
    if(b.dataset.group==="all") b.hidden = storyMode!=="quiz";
  });
  $("storyInfo").textContent = tx(STORY_MODES.find(m=>m.id===storyMode).info);
  const learn = storyMode==="learn";
  $("storyRead").hidden = !learn; $("storyGame").hidden = learn;
  if(learn) renderStoryLearn();
  else runQuiz($("storyGame"), {id:`story-${storyGroup}`, total:storyTotal(), make:storyQuestions()});
}

function openStories(){
  const modes = $("storyModes");
  if(!storyGroup) storyGroup = storyList()[0].id;
  if(!modes.children.length){
    STORY_MODES.forEach(m=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.mode = m.id === "learn" ? "learn" : "quiz"; b.textContent = tx(m.name);
      b.onclick = ()=>{ storyMode = m.id; startStories(); };
      modes.appendChild(b);
    });
    [...storyList().map(s=>[s.id, (s.cyprus ? "🏝️ " : "") + pick(s.name)]), ["all", tx("Everything")]].forEach(([id,name])=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.group = id; b.textContent = name;
      b.onclick = ()=>{ storyGroup = id; startStories(); };
      $("storyGroups").appendChild(b);
    });
  }
  startStories();
}
