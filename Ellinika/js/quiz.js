/* ---------- a round of questions (used by most categories) ----------
   runQuiz(box, {id, total, make}) asks `total` questions. make() returns one question:
     prompt    html shown in the card
     say       Greek text: shows a Listen button;  autoplay: true plays it at once
     options   [{html, ok, label, cls}]   multiple choice (cols: 3 puts them in 3 columns)
     type      {answer: "Greek text"}     or: the learner types the answer in Latin letters
     write     {answers: ["Greek text", ...]}   or: the learner writes it with Greek letters
                (a Greek keyboard is shown; accents, capitals and punctuation do not matter)
     build     {answer: "Greek text"}     or: the learner taps the words in the right order
     hint      html shown by the Hint button (write and build)
     reveal    html shown after the answer
     sayAfter  Greek text played after the answer
     item      {key, gr, en, lat, snd, cat}: the word this question is about, kept by Progress for the reviews
   Options: best:false hides the best score; onAnswer(q, ok) is called after each answer;
   renderResult(box, score, total) replaces the final screen. */
function bestScore(id){ try{ return +localStorage.getItem("gl-best-"+id) || 0; }catch(e){ return 0; } }
function saveBest(id,v){ try{ if(v>bestScore(id)) localStorage.setItem("gl-best-"+id,v); }catch(e){} }
/* hands out the items one by one in random order, without repeating until all were used */
function deck(items){
  let left=[];
  return ()=>{ if(!left.length) left=shuffle([...items]); return left.pop(); };
}

/* the Greek keyboard shown under a "write" question: 8 keys per row */
const GREEK_KEYS = [
  ..."αβγδεζηθ", ..."ικλμνξοπ", ..."ρσςτυφχψ", ..."ωάέήίόύώ",
  "ϊ", ";", ",", {key:" ", label:"space", span:3}, {key:"⌫", label:"⌫", span:2}
];
const touchOnly = () => { try{ return matchMedia("(pointer: coarse)").matches; }catch(e){ return false; } };

/* ---------- the result card shared by the games: a ring with the score, stars, a message and a small celebration ---------- */
function scoreCard(score,total,msg,sub=""){
  const pct = total ? score/total : 0, stars = pct>=.9 ? 3 : pct>=.6 ? 2 : pct>=.3 ? 1 : 0, C = 2*Math.PI*52;
  return `<div class="card scorecard">
    ${mascot(pct>=.9 ? "cheer" : pct>=.6 ? "happy" : pct>=.3 ? "think" : "oops", 84)}
    <div class="ring" role="img" aria-label="${score}/${total}"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="52"/>
      <circle class="ring-fg" cx="60" cy="60" r="52" style="--len:${C.toFixed(1)}; --to:${(C*(1-pct)).toFixed(1)}"/></svg>
      <div class="ring-n"><b data-count="${score}">${score}</b><span>/${total}</span></div></div>
    <div class="stars" aria-hidden="true">${[1,2,3].map(i=>`<i class="${i<=stars ? "on" : ""}" style="--d:${i*.18+.5}s">★</i>`).join("")}</div>
    <p class="feedback good">${msg}</p>${sub ? `<p class="answer">${sub}</p>` : ""}</div>`;
}
/* counts the score up, and throws a little confetti on a very good round */
function celebrate(box,score,total){
  const b = box.querySelector("[data-count]"), reduce = (()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } })();
  if(b && !reduce && score>0){
    const t0 = performance.now(); b.textContent = "0";
    const step = t=>{ const k = Math.min(1,(t-t0)/700); b.textContent = Math.round(score*k); if(k<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  const card = box.querySelector(".scorecard");
  if(card && total && score/total>=.9 && !reduce){
    const colors = ["#F2C14E","#E2745B","#5C9DFF","#4CC38A","#E0568F"];
    const wrap = document.createElement("div"); wrap.className = "confetti"; wrap.setAttribute("aria-hidden","true");
    for(let i=0;i<26;i++){
      const c = document.createElement("i");
      c.style.cssText = `left:${Math.round(Math.random()*100)}%; background:${colors[i%colors.length]}; --dx:${Math.round(Math.random()*120-60)}px; --r:${Math.round(Math.random()*540-270)}deg; animation-delay:${(Math.random()*.5).toFixed(2)}s; animation-duration:${(1.4+Math.random()*1.1).toFixed(2)}s`;
      wrap.appendChild(c);
    }
    card.appendChild(wrap);
  }
}

/* what is wrong in a sentence the user wrote (dictation): every word of the right sentence is shown in a color: green = right, orange = the accent is wrong
   (what you wrote is shown after it), red and underlined = missing, red and crossed out = a word that should not be there */
function diffGreek(raw, answer){
  const tok = s => s.replace(/[;;?!.,··:"“”«»()—–]/g, " ").split(/\s+/).filter(Boolean);
  const A = tok(answer), U = tok(raw), key = w => normGreek(w), same = (a,b) => normGreek(a,true)===normGreek(b,true);
  const n = A.length, m = U.length, L = Array.from({length:n+1}, ()=>Array(m+1).fill(0));
  for(let i=n-1; i>=0; i--) for(let j=m-1; j>=0; j--) L[i][j] = key(A[i])===key(U[j]) ? L[i+1][j+1]+1 : Math.max(L[i+1][j], L[i][j+1]);
  const out = []; let i = 0, j = 0;
  while(i<n || j<m){
    if(i<n && j<m && key(A[i])===key(U[j])){
      out.push(same(A[i],U[j]) ? `<span class="d-ok">${esc(A[i])}</span>` : `<span class="d-acc">${esc(A[i])}</span><small class="muted"> (${esc(U[j])})</small>`); i++; j++;
    } else if(j<m && (i>=n || L[i][j+1] >= L[i+1][j])){ out.push(`<s class="d-extra">${esc(U[j])}</s>`); j++; }
    else { out.push(`<span class="d-miss">${esc(A[i])}</span>`); i++; }
  }
  return `<p class="dline" lang="el">${out.join(" ")}</p><p class="dlegend"><span class="d-ok">${esc(tx("right"))}</span> · <span class="d-acc">${esc(tx("accent"))}</span> · <span class="d-miss">${esc(tx("missing"))}</span> · <s class="d-extra">${esc(tx("not needed"))}</s></p>`;
}

/* an unfinished quiz is remembered ("gl-quizstate": its name, how many answers, the score, the time): when you open the same game again within a day,
   you can continue where you stopped (the questions are new, the count and the score are kept) or start over. The reviews, the challenge and the level test are not kept. */
const QS_KEY = "gl-quizstate";
const quizStates = () => { try{ return JSON.parse(localStorage.getItem(QS_KEY)) || {}; }catch(e){ return {}; } };
const quizNoResume = id => /^(review|challenge|level)/.test(id);
function quizSaved(id, total){
  if(quizNoResume(id)) return null;
  const s = quizStates()[id];
  return s && s.total===total && s.n>=1 && s.n<total && Date.now()-s.t < 864e5 ? s : null;
}
function quizSave(id, total, n, score){
  if(quizNoResume(id)) return;
  const all = quizStates(); all[id] = {n, score, total, t:Date.now()};
  const keys = Object.keys(all).sort((a,b)=>all[b].t-all[a].t); keys.slice(30).forEach(k=>delete all[k]);
  try{ localStorage.setItem(QS_KEY, JSON.stringify(all)); }catch(e){}
}
function quizClear(id){ const all = quizStates(); if(all[id]){ delete all[id]; try{ localStorage.setItem(QS_KEY, JSON.stringify(all)); }catch(e){} } }
/* "Report a mistake" under the answer of a question: an e-mail to the author with the page, the game, the question and the answer shown already written */
function reportLink(quizId, q){
  const plain = h => String(h||"").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&amp;/g,"&").replace(/\s+/g," ").trim();
  const a = document.createElement("a"); a.className = "reportlink";
  const body = [`Page: ${typeof viewTitle==="function" ? viewTitle(currentView) : currentView}`, `Game: ${quizId}`, `Question: ${plain(q.prompt).slice(0,300)}`, `Answer shown: ${plain(q.reveal).slice(0,300)}`, `App: ${ABOUT.version} ${ABOUT.date}, ${LANG}`, "", "What is wrong?", ""].join("\n");
  a.href = "#"; a.onclick = e=>{ e.preventDefault(); openMail("Elliniká: a mistake in a question", body); };
  a.title = tx("Tell the author about a mistake in this question");
  a.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg> ${esc(tx("Report a mistake"))}`;
  return a;
}
function quizResumePrompt(box, opts, st){
  box.innerHTML = `<div class="card resume"><div class="resume-owl" aria-hidden="true">${typeof mascot==="function" ? mascot("happy", 64) : ""}</div>
    <h3>${esc(tx("Continue your quiz?"))}</h3>
    <p>${esc(tx("Question {n} of {total} · score {score}", {n:st.n+1, total:st.total, score:st.score}))}</p>
    <div class="btns"><button type="button" class="btn" data-r="go">${esc(tx("Continue"))}</button><button type="button" class="btn ghost" data-r="new">${esc(tx("Start over"))}</button></div></div>`;
  box.querySelector('[data-r="go"]').onclick = ()=>runQuiz(box, opts, {n:st.n, score:st.score});
  box.querySelector('[data-r="new"]').onclick = ()=>{ quizClear(opts.id); runQuiz(box, opts, null); };
}
function runQuiz(box, opts, _resume){
  const {id,total=10,make,best=true,onAnswer,renderResult} = opts;
  if(_resume===undefined){ const st = quizSaved(id, total); if(st){ quizResumePrompt(box, opts, st); return; } }
  let n=_resume ? _resume.n : 0, score=_resume ? _resume.score : 0, run=0, q=null, answered=false, picked=[];
  box.innerHTML=`
    <div class="qhead"><span>${tx("Question")} <b data-q="n">1</b>/${total}</span><span>${tx("Score")} <b data-q="score">0</b></span><span class="combo" data-q="combo" hidden></span>${best?`<span>${tx("Best")} <b>${bestScore(id)}</b></span>`:""}</div>
    <div class="prog" aria-hidden="true"><i data-q="bar"></i></div>
    <div class="card"><div class="qprompt" data-q="prompt"></div><button class="hear" type="button" data-q="hear">🔊 ${tx("Listen")}</button></div>
    <div class="opts" data-q="opts"></div>
    <div class="typebox" data-q="typebox" hidden>
      <input data-q="input" type="text" placeholder="${tx("Write it in Latin letters")}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" aria-label="${tx("Your answer in Latin letters")}">
      <div class="breakdown" data-q="tiles"></div>
    </div>
    <div class="typebox" data-q="writebox" hidden>
      <input data-q="winput" type="text" lang="el" placeholder="${tx("Write it with Greek letters")}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" aria-label="${tx("Your answer in Greek letters")}">
      <div class="gkeys" data-q="gkeys"></div>
    </div>
    <div class="typebox" data-q="buildbox" hidden>
      <div class="bslot" data-q="bslot" aria-label="${tx("Your sentence")}"></div>
      <div class="bbank" data-q="bbank"></div>
    </div>
    <div class="btns"><button class="btn ghost" type="button" data-q="hint" hidden>${tx("Hint")}</button><button class="btn" type="button" data-q="go" hidden>${tx("Next")}</button></div>
    <div class="fbbox" data-q="fbbox"><span class="owl-slot" data-q="owl"></span><div class="fbtext"><p class="feedback" data-q="fb" aria-live="polite"></p>
    <p class="answer" data-q="ans"></p></div></div>`;
  const $q=k=>box.querySelector(`[data-q="${k}"]`);

  /* ----- the Greek keyboard (built once) ----- */
  const gkeys=$q("gkeys"), winput=$q("winput");
  GREEK_KEYS.forEach(k=>{
    const o = typeof k==="string" ? {key:k,label:k,span:1} : k;
    const b=document.createElement("button");
    b.type="button"; b.className="gkey"; b.textContent=o.label==="space" ? tx("space") : o.label; b.style.gridColumn=`span ${o.span}`;
    if(o.key.length===1 && o.key!==" " && o.key!=="⌫" && o.label===o.key) b.lang="el";
    b.setAttribute("aria-label", o.key===" " ? tx("space") : o.key==="⌫" ? tx("delete") : o.key);
    b.addEventListener("mousedown",e=>e.preventDefault());       /* keep the cursor in the box */
    b.onclick=()=>{
      if(answered) return;
      const s=winput.selectionStart ?? winput.value.length, e=winput.selectionEnd ?? s;
      if(o.key==="⌫"){
        if(s!==e) winput.setRangeText("",s,e,"end");
        else if(s>0) winput.setRangeText("",s-1,s,"end");
      } else winput.setRangeText(o.key,s,e,"end");
      winput.dispatchEvent(new Event("input"));
    };
    gkeys.appendChild(b);
  });

  /* ----- build: tap the words in order ----- */
  function renderBuild(){
    const slot=$q("bslot"), bank=$q("bbank"), words=q.build.words;
    slot.innerHTML=""; bank.innerHTML="";
    const chip=(i,from)=>{
      const b=document.createElement("button");
      b.type="button"; b.className="bword"; b.lang="el"; b.textContent=words[i]; b.disabled=answered;
      b.onclick=()=>{ if(answered) return; if(from==="slot") picked=picked.filter(x=>x!==i); else picked.push(i); renderBuild(); };
      return b;
    };
    picked.forEach(i=>slot.appendChild(chip(i,"slot")));
    if(!picked.length){ const p=document.createElement("span"); p.className="bhint"; p.textContent=tx("Tap the words in order"); slot.appendChild(p); }
    q.build.order.filter(i=>!picked.includes(i)).forEach(i=>bank.appendChild(chip(i,"bank")));
  }

  function ask(){
    q=make(); answered=false; n++;
    $q("n").textContent=n; $q("bar").style.width=(100*(n-1)/total)+"%";
    $q("prompt").innerHTML=q.prompt;
    const hear=$q("hear"); hear.hidden=!q.say;
    if(q.say){ hear.onclick=()=>say(q.say); if(q.autoplay) say(q.say); }
    $q("fb").textContent=""; $q("fb").className="feedback"; $q("ans").innerHTML=""; $q("fbbox").className="fbbox"; $q("owl").innerHTML="";
    const card=box.querySelector(".card"); card.classList.remove("qin"); void card.offsetWidth; card.classList.add("qin");
    const opts=$q("opts"), go=$q("go"), inp=$q("input"), hint=$q("hint");
    opts.innerHTML=""; opts.className="opts"+(q.cols?" c"+q.cols:"");
    opts.hidden=true; go.hidden=true;
    ["typebox","writebox","buildbox"].forEach(k=>$q(k).hidden=true);
    hint.hidden=!(q.hint && (q.write||q.build));
    hint.onclick=()=>{ $q("ans").innerHTML=q.hint; };
    if(q.type){
      $q("typebox").hidden=false; $q("tiles").innerHTML="";
      inp.value=""; inp.className=""; inp.disabled=false;
      go.hidden=false; go.textContent=tx("Check");
      try{ inp.focus({preventScroll:true}); }catch(e){}
    } else if(q.write){
      $q("writebox").hidden=false;
      winput.value=""; winput.className=""; winput.disabled=false;
      go.hidden=false; go.textContent=tx("Check");
      if(!touchOnly()){ try{ winput.focus({preventScroll:true}); }catch(e){} }   /* on a phone, do not pop up its keyboard */
    } else if(q.build){
      picked=[]; $q("buildbox").hidden=false;
      const words=q.build.answer.split(" ");
      q.build.words=words;
      let order=words.map((_,i)=>i);
      for(let t=0; t<8; t++){ order=shuffle(order); if(order.some((x,i)=>x!==i)) break; }
      q.build.order=order;
      renderBuild();
      go.hidden=false; go.textContent=tx("Check");
    } else {
      opts.hidden=false;
      q.options.forEach((o,i)=>{
        const b=document.createElement("button");
        b.type="button"; b.className="opt"+(o.cls?" "+o.cls:""); b.innerHTML=o.html;
        if(o.label) b.setAttribute("aria-label",o.label);
        b.onclick=()=>choose(i);
        opts.appendChild(b);
      });
    }
  }
  function finish(ok,note=""){
    answered=true; if(ok){ score++; run++; } else run=0;
    if(onAnswer) onAnswer(q,ok);
    if(q.item) Progress.record(q.item, ok);
    quizSave(id, total, n, score);
    const sc=$q("score"); sc.textContent=score;
    if(ok){ sc.classList.remove("bump"); void sc.offsetWidth; sc.classList.add("bump"); }
    const combo=$q("combo"); combo.hidden=run<2; if(run>=2){ combo.innerHTML='<span class="flame">🔥</span> ×'+run; combo.style.setProperty("--run",run); }
    $q("fbbox").className="fbbox on "+(ok?"good":"bad");
    $q("owl").innerHTML = mascot(ok ? (run>=3 ? "cheer" : "happy") : "oops", 60);
    if(window.animAnswer) animAnswer({ok, run, score:sc, combo, box});
    try{ $q("go").scrollIntoView({block:"nearest", behavior:"smooth"}); }catch(e){}
    const fb=$q("fb");
    fb.textContent = ok ? "Σωστά! "+tx("Correct")+(note?" "+note:"") : tx("Not quite");
    fb.className = "feedback "+(ok?"good":"bad");
    $q("ans").innerHTML=q.reveal||"";
    if(q.item && q.item.gr && typeof favButton==="function") $q("ans").appendChild(favButton(q.item,"inline"));
    if(q.item && q.item.gr && typeof exampleNode==="function"){ const ex = exampleNode(q.item.gr); if(ex) $q("ans").appendChild(ex); }
    if(typeof ABOUT!=="undefined" && ABOUT.mail) $q("ans").appendChild(reportLink(id, q));
    if(q.sayAfter) say(q.sayAfter);
    const go=$q("go"); go.hidden=false; go.textContent = n<total ? tx("Next") : tx("See result");
    $q("hint").hidden=true;
    try{ go.focus({preventScroll:true}); }catch(e){}
  }
  function choose(i){
    if(answered) return;
    [...$q("opts").children].forEach((b,j)=>{
      b.disabled=true;
      if(q.options[j].ok) b.classList.add("ok"); else if(j===i) b.classList.add("no");
    });
    finish(q.options[i].ok);
  }
  function warn(text){ $q("fb").textContent=text; $q("fb").className="feedback bad"; }
  function checkTyped(){
    const inp=$q("input"), v=cleanInput(inp.value);
    if(!v){ warn(tx("Type your answer in Latin letters first")); return; }
    const ok=matcher(q.type.answer).test(v);
    inp.className=ok?"ok":"no"; inp.disabled=true;
    renderBreakdown(q.type.answer,$q("tiles"));
    finish(ok);
  }
  function checkWritten(){
    const raw=winput.value;
    if(!normGreek(raw)){ warn(tx("Write your answer first")); return; }
    if(/[a-z]/i.test(raw)){ warn(tx("Use Greek letters: tap the keys below")); return; }
    const ok=q.write.answers.some(a=>normGreek(a)===normGreek(raw));
    const exact=q.write.answers.some(a=>normGreek(a,true)===normGreek(raw,true));
    winput.className=ok?"ok":"no"; winput.disabled=true;
    finish(ok, ok && !exact ? "— "+tx("but check the accents") : "");
    if(q.write.diff && !exact){
      const best = q.write.answers.find(a=>normGreek(a)===normGreek(raw)) || q.write.answers[0];
      $q("ans").insertAdjacentHTML("beforeend", diffGreek(raw, best));
    }
  }
  function checkBuilt(){
    if(!picked.length){ warn(tx("Tap the words in order first")); return; }
    const ok = normGreek(picked.map(i=>q.build.words[i]).join(" "))===normGreek(q.build.answer);
    answered=true; renderBuild();
    finish(ok);
  }
  function result(){
    quizClear(id);
    if(renderResult){ renderResult(box,score,total); return; }
    const prev=bestScore(id); saveBest(id,score);
    const msg = score>=total*.9 ? "Μπράβο! "+tx("Excellent") : score>=total*.6 ? "Καλά! "+tx("Good job") : tx("Keep going, you will get there");
    box.innerHTML=`
      ${scoreCard(score,total,msg,score>prev ? tx("New best score!") : tx("Best")+": "+Math.max(prev,score)+"/"+total)}
      <div class="btns"><button class="btn" type="button" data-q="again">${tx("Play again")}</button></div>`;
    celebrate(box,score,total);
    const again=$q("again"); again.onclick=()=>runQuiz(box,{id,total,make});
    try{ again.focus({preventScroll:true}); }catch(e){}
  }
  $q("go").onclick=()=>{
    if(!answered){ if(q.type) checkTyped(); else if(q.write) checkWritten(); else if(q.build) checkBuilt(); return; }
    if(n<total){ if(window.animLeave) animLeave(box, ask); else ask(); } else result();
  };
  for(const inputEl of [$q("input"), winput])
    inputEl.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); $q("go").click(); }});
  ask();
}
