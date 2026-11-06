/* ---------- dialogues ----------
   Short conversations to listen to, read and answer. Built from data/dialogues.js.
   Modes: Listen & read (tap a line, or play the whole dialogue), Reply, Fill the gap, Questions
   (listen, then answer) and Say it (read a line out loud: the browser listens and compares). */
const DLG_MODES = [
  {id:"learn", name:"Listen & read", info:"Tap a line to hear it, or play the whole dialogue."},
  {id:"reply", name:"Reply",         info:"You hear a sentence. Tap the best reply."},
  {id:"gap",   name:"Fill the gap",  info:"One word is missing. Tap it."},
  {id:"quiz",  name:"Questions",     info:"Listen to the dialogue, then answer a question about it."},
  {id:"dict",  name:"Dictation",     info:"Listen to a line, then write what you hear with Greek letters. Accents, capitals and punctuation do not matter."},
  {id:"speak", name:"Say it",        info:"Read the line out loud. The browser listens and tells you how close you are."}
];
let dlgMode = "learn", dlgGroup = "all", dlgShowMeaning = true, dlgToken = 0;
const DLG = DIALOGUES.dialogues;
const dlgPool = () => DLG.filter(d=>dlgGroup==="all" || d.id===dlgGroup);
const dlgRole = (d, s) => tx(pick(d.roles[s]));
const dlgLine = (d, l, i) => ({key:`d:${d.id}:${i}`, gr:l.gr, en:l.en, fr:l.fr, lat:l.lat, snd:sid(l.gr), cat:"Dialogues"});
const dlgMeaning = l => `<p class="vinfo">${esc(pick(l))}</p>`;
const dlgReveal = l => `<b lang="el">${esc(l.gr)}</b> <span class="lt">(${esc(l.lat)})</span><br>${esc(pick(l))}`;
/* the words of a line without their punctuation: "σου;" -> "σου" */
const dlgCore = w => w.replace(/[;;?!.,·:]/g, "");
const dlgUnique = (list, key) => { const seen = new Set(); return list.filter(x=>{ const k = key(x); if(seen.has(k)) return false; seen.add(k); return true; }); };
const dlgAllLines = () => DLG.flatMap(d=>d.lines.map((l,i)=>({d, l, i})));

/* ---------- Dictation: you hear a line, you write it ---------- */
function dictQuestions(){
  const lines = dlgPool().flatMap(d=>d.lines.map((l,i)=>({d, l, i}))).filter(x=>{ const n = x.l.gr.split(" ").length; return n>=3 && n<=12; });
  const next = deck(lines);
  return ()=>{
    const {d, l, i} = next();
    return {item:dlgLine(d, l, i), reveal:dlgReveal(l), prompt:`<p class="word s">🔊 ${esc(tx("Listen, then write it"))}</p>`, say:l.gr, autoplay:true,
            write:{answers:[l.gr], diff:true}, hint:`${esc(tx("It sounds like:"))} <b>${esc(l.lat)}</b>`};
  };
}

/* ---------- Reply: the line you hear, and the line that answers it ---------- */
function replyQuestions(){
  const pairs = dlgPool().flatMap(d=>d.lines.slice(0,-1).map((l,i)=>({d, l, r:d.lines[i+1], i:i+1})));
  const everything = dlgAllLines().map(x=>x.l);
  const next = deck(pairs);
  return ()=>{
    const p = next();
    /* wrong answers: first lines of the same speaker in this dialogue, then lines of other dialogues */
    const same = shuffle(p.d.lines.filter(x=>x.s===p.r.s && x.gr!==p.r.gr && x.gr!==p.l.gr));
    const rest = shuffle(everything.filter(x=>x.gr!==p.r.gr && x.gr!==p.l.gr && !same.includes(x)));
    const wrong = dlgUnique([...same.slice(0,2), ...rest], x=>x.gr).slice(0,3);
    const opt = (l,ok) => ({html:`<span lang="el">${esc(l.gr)}</span>`, ok});
    return {item:dlgLine(p.d, p.r, p.i), reveal:dlgReveal(p.r), sayAfter:p.r.gr,
            prompt:`<p class="word s" lang="el">${esc(p.l.gr)}</p>${dlgMeaning(p.l)}`, say:p.l.gr, autoplay:true,
            options:shuffle([opt(p.r,true), ...wrong.map(l=>opt(l,false))])};
  };
}

/* ---------- Fill the gap: one word of a line is hidden ---------- */
function gapQuestions(){
  const lines = dlgPool().flatMap(d=>d.lines.map((l,i)=>({d, l, i}))).filter(x=>x.l.gr.split(" ").some(w=>dlgCore(w).length>=4));
  const next = deck(lines);
  const wordsOf = ls => dlgUnique(ls.flatMap(l=>l.gr.split(" ").map(dlgCore)).filter(w=>w.length>=4), w=>normGreek(w));
  const everywhere = wordsOf(dlgAllLines().map(x=>x.l));
  return ()=>{
    const x = next(), tokens = x.l.gr.split(" ");
    const spots = tokens.map((w,i)=>i).filter(i=>dlgCore(tokens[i]).length>=4);
    const at = oneOf(spots), right = dlgCore(tokens[at]);
    const shown = tokens.map((w,i)=>i===at ? w.replace(right, "＿＿＿") : w).join(" ");
    const near = shuffle(wordsOf(x.d.lines).filter(w=>normGreek(w)!==normGreek(right)));
    const far = shuffle(everywhere.filter(w=>normGreek(w)!==normGreek(right) && !near.includes(w)));
    const wrong = dlgUnique([...near.slice(0,2), ...far], w=>normGreek(w)).slice(0,3);
    const opt = (w,ok) => ({html:`<span lang="el">${esc(w)}</span>`, ok});
    return {item:dlgLine(x.d, x.l, x.i), reveal:dlgReveal(x.l), sayAfter:x.l.gr,
            prompt:`<p class="word s" lang="el">${esc(shown)}</p>${dlgMeaning(x.l)}`, say:x.l.gr,
            options:shuffle([opt(right,true), ...wrong.map(w=>opt(w,false))])};
  };
}

/* ---------- Questions: listen to the whole dialogue, then answer ---------- */
function quizQuestions(){
  const qs = dlgPool().flatMap(d=>d.quiz.map(q=>({d, q})));
  const next = deck(qs);
  return ()=>{
    const {d, q} = next();
    const transcript = d.lines.map(l=>`<span lang="el">${esc(l.gr)}</span><br><span class="vinfo">${esc(pick(l))}</span>`).join("<br>");
    return {prompt:`<p class="vinfo">🎧 ${esc(tx(d.name))}</p><p class="word s">${esc(pick(q))}</p>`,
            say:d.lines.map(l=>l.gr), autoplay:true,
            options:shuffle([{html:esc(pick(q.ok)), ok:true}, ...q.bad.map(b=>({html:esc(pick(b)), ok:false}))]),
            reveal:transcript};
  };
}
const dlgTotal = () => Math.min(10, dlgMode==="quiz" ? dlgPool().reduce((n,d)=>n+d.quiz.length, 0)
                                  : dlgMode==="dict" ? dlgAllLines().length : dlgMode==="reply" ? dlgPool().reduce((n,d)=>n+d.lines.length-1, 0)
                                  : dlgPool().reduce((n,d)=>n+d.lines.length, 0));

/* ---------- Listen & read ---------- */
function renderDlgLearn(){
  const box = $("dlgLearn"); box.innerHTML = "";
  const bar = document.createElement("div"); bar.className = "row";
  const tog = document.createElement("button");
  tog.type = "button"; tog.className = "chip"; tog.setAttribute("aria-pressed", dlgShowMeaning); tog.textContent = "👁 " + tx("Show the meaning");
  tog.onclick = ()=>{ dlgShowMeaning = !dlgShowMeaning; renderDlgLearn(); };
  bar.appendChild(tog); box.appendChild(bar);
  dlgPool().forEach(d=>{
    const head = document.createElement("div"); head.className = "dlghead";
    const h = document.createElement("h2"); h.className = "sub"; h.textContent = tx(d.name);
    const play = document.createElement("button"); play.type = "button"; play.className = "btn ghost sm"; play.textContent = "▶ " + tx("Play the dialogue");
    head.append(h, play); box.appendChild(head);
    const chat = document.createElement("div"); chat.className = "chat"; box.appendChild(chat);
    const bubbles = d.lines.map(l=>{
      const b = document.createElement("button");
      b.type = "button"; b.className = "bubble s"+l.s;
      b.innerHTML = `<span class="btxt"><span class="who">${esc(dlgRole(d, l.s))}</span><b lang="el">${esc(l.gr)}</b><span class="bsub"><span class="lt">${esc(l.lat)}</span></span>`
        + (dlgShowMeaning ? `<span class="bsub">${esc(pick(l))}</span>` : "") + `</span><span aria-hidden="true">🔊</span>`;
      b.onclick = ()=>{ dlgToken++; say(l.gr); };
      chat.appendChild(b);
      return b;
    });
    /* plays the lines one after the other, lighting up the one that is being said */
    play.onclick = async ()=>{
      const mine = ++dlgToken;
      stopSound();
      document.querySelectorAll(".bubble.playing").forEach(x=>x.classList.remove("playing"));
      for(let i=0; i<d.lines.length; i++){
        if(mine!==dlgToken) return;
        bubbles[i].classList.add("playing");
        bubbles[i].scrollIntoView({block:"nearest", behavior:"smooth"});
        const r = await playRec(sid(d.lines[i].gr));
        bubbles[i].classList.remove("playing");
        if(r!=="ok" || mine!==dlgToken) return;
        await new Promise(res=>setTimeout(res, 350));
      }
    };
  });
}

/* ---------- Say it: you read the line, the browser listens ---------- */
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
/* how alike two texts are: 1 = the same, 0 = nothing in common (edit distance on texts without accents) */
function dlgSimilarity(a, b){
  a = normGreek(a); b = normGreek(b);
  if(!a || !b) return 0;
  let prev = Array.from({length:b.length+1}, (_,j)=>j);
  for(let i=1; i<=a.length; i++){
    const row = [i];
    for(let j=1; j<=b.length; j++) row[j] = Math.min(prev[j]+1, row[j-1]+1, prev[j-1]+(a[i-1]===b[j-1] ? 0 : 1));
    prev = row;
  }
  return 1 - prev[b.length]/Math.max(a.length, b.length);
}
function renderDlgSpeak(){
  const box = $("dlgSpeak"); box.innerHTML = "";
  if(!SpeechRec){
    box.innerHTML = `<div class="card"><p class="word s">🎤</p><p class="answer">${esc(tx("Your browser cannot listen to you. Try Chrome, on a computer or on Android."))}</p></div>`;
    return;
  }
  const next = deck(dlgPool().flatMap(d=>d.lines.map((l,i)=>({d, l, i}))));
  let cur = null, rec = null;
  box.innerHTML = `
    <div class="card"><div class="qprompt" data-s="line"></div></div>
    <div class="btns"><button class="btn ghost" type="button" data-s="hear">🔊 ${esc(tx("Listen"))}</button><button class="btn" type="button" data-s="mic">🎤 ${esc(tx("Speak"))}</button></div>
    <p class="feedback" data-s="fb" aria-live="polite"></p>
    <p class="answer" data-s="heard"></p>
    <div class="btns"><button class="btn ghost" type="button" data-s="next">${esc(tx("Next"))}</button></div>`;
  const $s = k => box.querySelector(`[data-s="${k}"]`);
  const stopListening = () => { if(rec){ try{ rec.abort(); }catch(e){} rec = null; } $s("mic").textContent = "🎤 " + tx("Speak"); };
  function show(){
    stopListening(); stopSound();
    cur = next();
    $s("line").innerHTML = `<p class="word s" lang="el">${esc(cur.l.gr)}</p><p class="vinfo"><span class="lt">${esc(cur.l.lat)}</span></p><p class="vinfo">${esc(pick(cur.l))}</p>`;
    $s("fb").textContent = ""; $s("fb").className = "feedback"; $s("heard").textContent = "";
  }
  function verdict(heardList){
    const score = Math.max(0, ...heardList.map(h=>dlgSimilarity(h, cur.l.gr)));
    const ok = score>=0.8, close = score>=0.55;
    Progress.record(dlgLine(cur.d, cur.l, cur.i), ok);
    $s("fb").textContent = ok ? "Μπράβο! " + tx("Great!") : close ? tx("Close! Try once more.") : tx("Not quite");
    $s("fb").className = "feedback " + (ok ? "good" : "bad");
    $s("heard").textContent = tx("I heard:") + " " + heardList[0];
  }
  $s("hear").onclick = ()=>say(cur.l.gr);
  $s("next").onclick = show;
  $s("mic").onclick = ()=>{
    if(rec){ stopListening(); return; }
    stopSound();
    rec = new SpeechRec();
    rec.lang = "el-GR"; rec.interimResults = false; rec.maxAlternatives = 3; rec.continuous = false;
    rec.onresult = e => verdict([...e.results[0]].map(a=>a.transcript));
    rec.onerror = e => {
      const blocked = e.error==="not-allowed" || e.error==="service-not-allowed";
      $s("fb").textContent = blocked ? tx("The microphone is blocked. Allow it in your browser, then try again.")
        : e.error==="no-speech" ? tx("I heard nothing. Try again.")
        : e.error==="network" ? tx("The speech service needs an internet connection.")
        : tx("The speech recognition did not work. Try again.");
      $s("fb").className = "feedback bad";
    };
    rec.onend = ()=>{ rec = null; $s("mic").textContent = "🎤 " + tx("Speak"); };
    $s("fb").textContent = tx("Listening… say the sentence."); $s("fb").className = "feedback"; $s("heard").textContent = "";
    $s("mic").textContent = "⏹ " + tx("Stop");
    try{ rec.start(); }catch(e){ stopListening(); }
  };
  show();
}

function startDialogues(){
  const m = DLG_MODES.find(x=>x.id===dlgMode);
  document.querySelectorAll("#dlgModes .chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===dlgMode));
  document.querySelectorAll("#dlgGroups .chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.group===dlgGroup));
  $("dlgInfo").textContent = tx(m.info);
  const learn = dlgMode==="learn", speak = dlgMode==="speak";
  $("dlgLearn").hidden = !learn; $("dlgSpeak").hidden = !speak; $("dlgGame").hidden = learn || speak;
  stopSound(); dlgToken++;
  if(learn) renderDlgLearn();
  else if(speak) renderDlgSpeak();
  else runQuiz($("dlgGame"), {id:`dialogues-${dlgMode}-${dlgGroup}`, total:dlgTotal(),
                              make:(dlgMode==="reply" ? replyQuestions : dlgMode==="gap" ? gapQuestions : dlgMode==="dict" ? dictQuestions : quizQuestions)()});
}
function openDialogues(){
  const modes = $("dlgModes");
  if(!modes.children.length){
    DLG_MODES.forEach(m=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.mode = m.id; b.textContent = tx(m.name);
      b.onclick = ()=>{ dlgMode = m.id; startDialogues(); };
      modes.appendChild(b);
    });
    [["all","Everything"], ...DLG.map(d=>[d.id,d.name])].forEach(([id,name])=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.group = id; b.textContent = tx(name);
      b.onclick = ()=>{ dlgGroup = id; startDialogues(); };
      $("dlgGroups").appendChild(b);
    });
  }
  startDialogues();
}
