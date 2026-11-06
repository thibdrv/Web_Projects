/* ---------- the 1-minute challenge ----------
   60 seconds, as many right answers as you can, with words taken from every vocabulary category.
   The questions are of four kinds (Greek -> meaning, meaning -> Greek, picture -> Greek, listen -> meaning).
   Each answer is also given to Progress, so it counts for your streak, your daily goal and your reviews.
   The best score is kept under "gl-best-challenge". */
const CH_SECONDS = 60;
const CH_SOURCES = [[FAMILY_PAGE,"fam","Family"],[ANIMALS_PAGE,"fam","Animals"],[FOOD,"food","Food & drinks"],[BODY,"body","Human body"],[TIME,"time","Time & dates"],
                    [HOUSE,"house","House & clothes"],[CITY,"city","City & travel"],[DIRECTIONS,"dir","Directions"],[NATURE,"nature","Weather & nature"],[JOBS,"jobs","Jobs & hobbies"]];
let chPool = null, chTimer = null, chWait = null;

function chWords(){
  if(!chPool) chPool = CH_SOURCES.flatMap(([D,prefix,cat])=>D.groups.flatMap(g=>g.words.map(w=>({...w, group:prefix+g.id, prefix, cat}))));
  return chPool;
}
function stopChallenge(){ clearInterval(chTimer); clearTimeout(chWait); chTimer = chWait = null; }

function chQuestion(next, pool){
  const w = next(), kind = w.emoji && Math.random()<.3 ? "pic" : oneOf(["g2e","e2g","listen"]);
  const same = pool.filter(x=>x!==w && x.group===w.group), others = same.length>=8 ? same : pool.filter(x=>x!==w);
  const greekOpt = (x,ok) => ({html:`<span lang="el">${esc(x.gr)}</span>`, ok, txt:x.gr});
  const meanOpt = (x,ok) => ({html:esc(txm(x.en)), ok, txt:txm(x.en)});
  const wrong = (opt) => { const seen = new Set([opt(w,true).txt]), out = []; for(const x of shuffle([...others])){ const o = opt(x,false); if(!seen.has(o.txt)){ seen.add(o.txt); out.push(o); if(out.length===3) break; } } return out; };
  const item = {key:`v:${w.prefix}:${sid(w.gr)}`, gr:w.gr, en:w.en, lat:w.lat, snd:sid(w.gr), cat:w.cat};
  const base = {w, item, kind};
  if(kind==="pic")    return {...base, prompt:`<span class="emoji">${w.emoji}</span>`, options:shuffle([greekOpt(w,true), ...wrong(greekOpt)])};
  if(kind==="e2g")    return {...base, prompt:`<p class="word s">${esc(txm(w.en))}</p>`, options:shuffle([greekOpt(w,true), ...wrong(greekOpt)])};
  if(kind==="listen") return {...base, prompt:`<p class="word s">🔊</p>`, say:w.gr, options:shuffle([meanOpt(w,true), ...wrong(meanOpt)])};
  return {...base, prompt:`<p class="word s" lang="el">${esc(w.gr)}</p>`, say:w.gr, options:shuffle([meanOpt(w,true), ...wrong(meanOpt)])};
}

function chStart(){
  stopChallenge();
  const box = $("chBox"), pool = chWords(), next = deck(pool);
  let score = 0, right = 0, asked = 0, combo = 0, left = CH_SECONDS, q = null, locked = false;
  const missed = [];
  box.innerHTML = `
    <div class="qhead"><span>⏱ <b id="chLeft">${CH_SECONDS}</b>s</span><span>${esc(tx("Score"))} <b id="chScore">0</b></span><span id="chCombo" class="chcombo"></span></div>
    <div class="prog" aria-hidden="true"><i id="chBar" style="width:100%"></i></div>
    <div class="card"><div class="qprompt" id="chPrompt"></div></div>
    <div class="opts" id="chOpts"></div>`;
  const show = ()=>{
    q = chQuestion(next, pool); locked = false; asked++;
    $("chPrompt").innerHTML = q.prompt;
    if(q.say) say(q.say);
    const opts = $("chOpts"); opts.innerHTML = "";
    q.options.forEach((o,i)=>{
      const b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.innerHTML = o.html; b.onclick = ()=>answer(i);
      opts.appendChild(b);
    });
  };
  const answer = i=>{
    if(locked) return; locked = true;
    const ok = q.options[i].ok;
    [...$("chOpts").children].forEach((b,j)=>{ b.disabled = true; if(q.options[j].ok) b.classList.add("ok"); else if(j===i) b.classList.add("no"); });
    Progress.record(q.item, ok);
    if(ok){ score++; right++; combo++; } else { combo = 0; missed.push(q.w); }
    $("chScore").textContent = score;
    $("chCombo").textContent = combo>=3 ? "🔥 ×" + combo : "";
    if(!ok) say(q.w.gr);
    chWait = setTimeout(show, ok ? 350 : 1100);
  };
  const end = ()=>{
    stopChallenge(); stopSound();
    const prev = bestScore("challenge"); saveBest("challenge", score);
    const acc = asked>1 || locked ? Math.round(100*right/Math.max(1, right+missed.length)) : 0;
    const rows = [...new Map(missed.map(w=>[w.gr,w])).values()].slice(0,8).map(w=>
      `<button class="dentry chmiss" type="button" data-say="${esc(w.gr)}"><span class="emoji sm">${w.emoji||"🔊"}</span><b lang="el">${esc(w.gr)}</b><span class="muted">${esc(txm(w.en))}</span></button>`).join("");
    box.innerHTML = `
      <div class="card"><p class="word">⚡ ${score}</p>
        <p class="feedback good">${esc(score>prev && score>0 ? tx("New best score!") : tx("Best")+": "+Math.max(prev,score))}</p>
        <p class="answer">${esc(tx("{n} right out of {m} ({p}%)", {n:right, m:right+missed.length, p:acc}))}</p></div>
      ${rows ? `<h2 class="sub">${esc(tx("To remember"))}</h2><div class="chlist">${rows}</div>` : ""}
      <div class="btns"><button class="btn" type="button" id="chAgain">${esc(tx("Play again"))}</button>
        <button class="btn ghost" type="button" id="chHome">${esc(tx("Back to the menu"))}</button></div>`;
    box.querySelectorAll("[data-say]").forEach(b=>b.onclick = ()=>say(b.dataset.say));
    $("chAgain").onclick = chStart; $("chHome").onclick = ()=>{ location.hash = "home"; };
    renderHomeProgress();
  };
  show();
  const t0 = Date.now();
  chTimer = setInterval(()=>{
    left = Math.max(0, CH_SECONDS - (Date.now()-t0)/1000);
    $("chLeft").textContent = Math.ceil(left);
    $("chBar").style.width = (100*left/CH_SECONDS)+"%";
    $("chBar").parentElement.classList.toggle("low", left<=10);
    if(left<=0) end();
  }, 100);
}

function openChallenge(){
  stopChallenge();
  const best = bestScore("challenge");
  $("chBox").innerHTML = `
    <div class="card chintro"><p class="word">⚡</p>
      <p class="feedback good">${esc(tx("60 seconds. How many words do you know?"))}</p>
      <p class="answer">${esc(tx("Words from every category. Each right answer is a point. Go fast!"))}</p>
      <p class="answer">${esc(tx("Best")+": "+best)}</p></div>
    <div class="btns"><button class="btn" type="button" id="chGo">${esc(tx("Start"))}</button></div>`;
  $("chGo").onclick = chStart;
}
