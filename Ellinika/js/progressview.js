/* ---------- the "Review & progress" page ----------
   The board shows your streak, what is due for review, how many words you know and your progress
   in each category. "Start review" asks the words that are due (10 at a time) with the usual quiz. */
const REVIEW_SIZE = 10;

/* how many words a category has in total (to show your progress in it) */
const PROGRESS_CATS = [
  ["Greek letters",   () => DATA.levels.reduce((n,L)=>n+L.words.length, 0)],
  ["Phrases",         () => PHRASES.groups.reduce((n,g)=>n+g.phrases.length, 0)],
  ["Grammar",         () => G.verbs.reduce((n,v)=>n+Object.values(v.forms).reduce((m,f)=>m+f.length,0), 0) + (typeof grammar2Total==="function" ? grammar2Total() : 0) + (typeof grammar3Total==="function" ? grammar3Total() : 0) + (typeof grammar5Total==="function" ? grammar5Total() : 0) + (typeof grammar6Total==="function" ? grammar6Total() : 0)],
  ["Colors",          () => COLORS.words.length + COLORS.objects.length],
  ["Numbers",         () => new Set(Object.values(NUM_POOLS).flat()).size],
  ["Family",          () => FAMILY_PAGE.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Animals",         () => ANIMALS_PAGE.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Food & drinks",   () => FOOD.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Human body",      () => BODY.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Time & dates",    () => TIME.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["House & clothes", () => HOUSE.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Clothes",         () => CLOTHES.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Cooking",         () => COOKING.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["City & travel",   () => CITY.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Directions",      () => DIRECTIONS.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Weather & nature",() => NATURE.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Jobs & hobbies",  () => JOBS.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Opposites",       () => OPPOSITES.groups.reduce((n,g)=>n+g.words.length, 0)],
  ["Conversation",    () => talkTotal()],
  ["Dialogues",       () => DIALOGUES.dialogues.reduce((n,d)=>n+d.lines.length, 0)],
  ["Word families",   () => fwTotal()],
  ["Cypriot Greek",   () => CYPRIOT.words.length + CYPRIOT.phrases.length + CYPRIOT.places.length + CYPRIOT.foods.length]
];

const meaningOf = it => (LANG==="fr" && it.fr) ? it.fr : txm(it.en);
const soundOf = it => Array.isArray(it.snd) ? it.snd.map(id=>({id})) : {id:it.snd};

/* three wrong answers: other practiced words, from the same category first */
function wrongOnes(it, textOf){
  const reg = Progress.list().filter(x=>x.key!==it.key);
  const order = [...shuffle(reg.filter(x=>x.cat===it.cat)), ...shuffle(reg.filter(x=>x.cat!==it.cat))];
  const seen = new Set([textOf(it)]), out = [];
  for(const x of order){
    const k = textOf(x);
    if(!seen.has(k)){ seen.add(k); out.push(x); if(out.length===3) break; }
  }
  return out;
}
const greekOf = it => it.gr;

function reviewQuestions(list){
  let i = 0;
  return ()=>{
    const it = list[i++], kind = oneOf(["g2e","e2g","listen"]);
    const reveal = `<b lang="el">${esc(it.gr)}</b> <span class="lt">(${esc(it.lat||"")})</span><br>${esc(meaningOf(it))}`;
    const base = {item:it, reveal, sayAfter:soundOf(it)};
    if(kind==="e2g")
      return {...base, prompt:`<p class="word s">${esc(meaningOf(it))}</p>`,
              options:shuffle([{html:`<span lang="el">${esc(it.gr)}</span>`,ok:true}, ...wrongOnes(it,greekOf).map(x=>({html:`<span lang="el">${esc(x.gr)}</span>`,ok:false}))])};
    const options = shuffle([{html:esc(meaningOf(it)),ok:true}, ...wrongOnes(it,meaningOf).map(x=>({html:esc(meaningOf(x)),ok:false}))]);
    if(kind==="listen")
      return {...base, prompt:`<p class="word s">🔊 ${esc(tx("What does it mean?"))}</p>`, say:soundOf(it), autoplay:true, options, sayAfter:undefined};
    return {...base, prompt:`<p class="word s" lang="el">${esc(it.gr)}</p>`, say:soundOf(it), options};
  };
}

function whenText(t){
  const hours = (t-Date.now())/3600000;
  if(hours <= 1) return tx("in less than an hour");
  if(hours < 24) return tx(Math.round(hours)===1 ? "in {n} hour" : "in {n} hours", {n:Math.round(hours)});
  if(hours < 36) return tx("tomorrow");
  return tx(Math.round(hours/24)===1 ? "in {n} day" : "in {n} days", {n:Math.round(hours/24)});
}

function startReview(list, again){
  $("progBoard").hidden = true; $("progGame").hidden = false;
  const missed = [];
  runQuiz($("progGame"), {id:"review", total:list.length, best:false, make:reviewQuestions(list),
    onAnswer:(q,ok)=>{ if(!ok && q.item && !missed.includes(q.item)) missed.push(q.item); },
    renderResult:(box,score,total)=>{
      const msg = score===total ? tx("Perfect! Everything is in the right box.") : score>=total*.6 ? tx("Good job. The words you missed will come back soon.") : tx("Keep going: the words you missed will come back soon.");
      box.innerHTML = `
        ${scoreCard(score,total,esc(msg))}
        <div class="btns">${missed.length && !again ? `<button class="btn" type="button" id="progAgain">${esc(tx(missed.length===1 ? "Try the missed word again" : "Try the {n} missed words again", {n:missed.length}))}</button>` : ""}
        <button class="btn${missed.length && !again ? " ghost" : ""}" type="button" id="progBack">${esc(tx("Back to my progress"))}</button></div>`;
      celebrate(box,score,total);
      if($("progAgain")) $("progAgain").onclick = ()=>{ $("progGame").innerHTML = ""; startReview(missed, true); window.scrollTo(0,0); };
      $("progBack").onclick = ()=>{ openProgress(); window.scrollTo(0,0); };
    }});
}

function renderBoard(){
  const st = Progress.stats(), streak = Progress.streak(), due = Progress.dueList(), weak = Progress.weakList();
  const last = lastTest();
  const cats = Progress.byCat();
  let review;
  if(st.total < 4){
    review = `<p>${esc(tx("Practice a few words in the other categories first. Then come back here: the words you practiced are reviewed at the right time, and the ones you miss come back more often."))}</p>`;
  } else if(due.length){
    const later = st.dueToday - due.length, missed = Progress.missedList().length;
    review = `<p><b>${esc(tx(due.length===1 ? "{n} word to review" : "{n} words to review", {n:due.length}))}</b>
        ${later>0 ? `<span class="muted"> · ${esc(tx("{n} more later today", {n:later}))}</span>` : ""}</p>
      ${missed ? `<p class="muted">${esc(tx(missed===1 ? "{n} missed word comes first." : "{n} missed words come first.", {n:missed}))}</p>` : ""}
      <button class="btn" type="button" id="progStart">${esc(tx(Math.min(REVIEW_SIZE, due.length)===1 ? "Start review ({n} question)" : "Start review ({n} questions)", {n:Math.min(REVIEW_SIZE, due.length)}))}</button>`;
  } else {
    const next = Progress.nextDue();
    const later = st.dueToday - due.length;
    review = `<p><b>🎉 ${esc(tx("Nothing to review right now."))}</b></p>
      ${later>0 ? `<p class="muted">${esc(tx("{n} more later today", {n:later}))}</p>` : ""}
      ${next ? `<p class="muted">${esc(tx("Next words to review: {when}.", {when:whenText(next)}))}</p>` : ""}
      ${weak.length ? `<button class="btn ghost" type="button" id="progWeak">${esc(tx("Practice my weak words"))}</button>` : ""}`;
  }
  const hard = Progress.difficultList();
  const difficulties = `<div class="panel"><h2 class="sub" style="margin-top:0">💪 ${esc(tx("My difficulties"))}</h2>` + (hard.length
    ? `<p style="margin-top:0">${esc(tx(hard.length===1 ? "{n} word you often miss." : "{n} words you often miss.", {n:hard.length}))}
        <span class="muted">${hard.slice(0,3).map(r=>`<span lang="el">${esc(r.gr)}</span>`).join(" · ")}</span></p>
        <a class="btn ghost" href="#difficulties">${esc(tx("Open my difficulties"))}</a>`
    : `<p class="muted" style="margin-top:0">${esc(tx("The words you miss often will appear here, so you can practice them again."))}</p>`) + `</div>`;
  const rows = PROGRESS_CATS.map(([name,total])=>{
    const c = cats[name] || {seen:0, mastered:0}, tot = total();
    const seenPct = tot ? Math.min(100, Math.round(100*c.seen/tot)) : 0, masPct = tot ? Math.min(100, Math.round(100*c.mastered/tot)) : 0;
    return `<div class="catrow"><span>${esc(tx(name))}</span><span class="muted">${c.seen} / ${tot}</span>
      <i class="sbar"><b class="b2" style="width:${seenPct}%"></b><b style="width:${masPct}%"></b></i></div>`;
  }).join("");
  const lst = levelStats(), curLvl = currentLevel(), cs = lst[curLvl];
  const levelRows = CEFR_LEVELS.map(l=>{
    const s = lst[l], seenPct = s.total ? Math.min(100, Math.round(100*s.seen/s.total)) : 0, masPct = s.total ? Math.min(100, Math.round(100*s.mastered/s.total)) : 0;
    return `<div class="catrow${l===curLvl ? " cur" : ""}"><span><span class="lvlb" data-l="${l}">${l}</span> ${esc(tx(LEVEL_NAMES[l]))}</span><span class="muted">${s.mastered} / ${s.total}</span>
      <i class="sbar"><b class="b2" style="width:${seenPct}%"></b><b style="width:${masPct}%"></b></i></div>`;
  }).join("");
  const path = `<div class="panel path"><h2 class="sub" style="margin-top:0">${esc(tx("Your path"))}</h2>
      <p style="margin-top:0">${tx("You are working on {l}: {m} of {t} words mastered.", {l:`<span class="lvlb" data-l="${curLvl}">${curLvl}</span>`, m:cs.mastered, t:cs.total})}</p>
      <div class="btns"><button class="btn" type="button" id="pathPractice">${esc(tx("Practice {l} words", {l:curLvl}))}</button>
      ${due.length ? `<button class="btn ghost" type="button" id="pathReview">🔁 ${esc(tx(due.length===1 ? "{n} word to review" : "{n} words to review", {n:due.length}))}</button>` : ""}
      <a class="btn ghost" href="#leveltest">📊 ${esc(tx("Level test"))}</a></div></div>
    <div class="panel"><h2 class="sub" style="margin-top:0">${esc(tx("By level"))}</h2>${levelRows}
      <p class="note" style="text-align:left">${esc(tx("The light bar is the words you practiced, the dark bar the ones you master."))}</p></div>`;
  $("progBoard").innerHTML = `
    <div class="panel streak"><span class="flame" aria-hidden="true">🔥</span>
      <div><b>${esc(streak ? tx(streak===1 ? "{n} day in a row" : "{n} days in a row", {n:streak}) : tx("Start your streak today"))}</b>
      <span class="muted">${esc(tx(st.today===1 ? "Today: {n} answer" : "Today: {n} answers", {n:st.today}))}</span></div></div>
    ${path}
    <div class="panel"><h2 class="sub" style="margin-top:0">🏅 ${esc(tx("Statistics & badges"))}</h2><p style="margin-top:0" class="muted">${esc(tx("Your days, your progress and your medals."))}</p><a class="btn ghost" href="#stats">${esc(tx("Open the statistics"))}</a></div>
    <div class="panel">${review}</div>
    ${difficulties}
    <div class="tiles3">
      <div class="tile3"><b>${st.learning}</b><span>${esc(tx("Learning"))}</span></div>
      <div class="tile3"><b>${st.familiar}</b><span>${esc(tx("Familiar"))}</span></div>
      <div class="tile3"><b>${st.mastered}</b><span>${esc(tx("Mastered"))}</span></div>
    </div>
    <div class="panel"><h2 class="sub" style="margin-top:0">${esc(tx("By category"))}</h2>${rows}
      <p class="note" style="text-align:left">${esc(tx("The light bar is the words you practiced, the dark bar the ones you master."))}</p></div>
    <div class="panel">${last && TEST_LEVELS[last.level]
      ? `<p><b>${esc(tx("Level test"))}</b> · ${esc(tx("level {n}", {n:TEST_LEVELS[last.level].cefr}))} · ${esc(tx(TEST_LEVELS[last.level].name))} <span class="muted">(${last.score}/${last.total}, ${esc(last.date)})</span></p>`
      : `<p>${esc(tx("You have not taken the level test yet."))}</p>`}
      <a class="btn ghost" href="#leveltest">${esc(tx(last ? "Take the level test again" : "Take the level test"))}</a></div>
    <div class="panel"><h2 class="sub" style="margin-top:0">${esc(tx("Backup"))}</h2>
      <p class="muted" style="margin-top:0">${esc(tx("Your progress stays in this browser only. Save it in a file to keep it safe, or to continue on another device."))}</p>
      <div class="panel gs-panel" id="progGoogle" hidden></div>
      <div class="btns"><button class="btn ghost" type="button" id="progSave">💾 ${esc(tx("Save my progress"))}</button>
      <button class="btn ghost" type="button" id="progRestore">📂 ${esc(tx("Restore a backup"))}</button></div>
      <p class="muted" style="margin-bottom:6px">${esc(tx("To continue on another device without a file: make a code here, paste it there."))}</p>
      <div class="btns"><button class="btn ghost" type="button" id="progCodeMake">${esc(tx("Make a transfer code"))}</button>
      <button class="btn ghost" type="button" id="progCodeEnter">${esc(tx("Enter a transfer code"))}</button></div>
      <div class="codepanel" id="progCodeBox" hidden></div>
      <input type="file" id="progFile" accept=".json,application/json" hidden>
      <p class="feedback" id="progBackupMsg" aria-live="polite"></p></div>
    <button class="btn ghost danger" type="button" id="progReset">${esc(tx("Erase my progress"))}</button>`;
  const start = $("progStart"), weakBtn = $("progWeak");
  $("pathPractice").onclick = ()=>{ practiceLevel(curLvl); location.hash = "letters"; };
  if($("pathReview")) $("pathReview").onclick = ()=>startReview(due.slice(0,REVIEW_SIZE));
  if(start) start.onclick = ()=>startReview(due.slice(0,REVIEW_SIZE));
  if(weakBtn) weakBtn.onclick = ()=>startReview(weak.slice(0,REVIEW_SIZE));
  if(typeof gsRender==="function") gsRender($("progGoogle"));
  const msg = t => { const m = $("progBackupMsg"); m.textContent = t; m.className = "feedback " + (t ? "good" : ""); };
  $("progSave").onclick = ()=>{ const day = saveBackup(); msg(tx("Saved. Keep the file somewhere safe.") ); };
  $("progRestore").onclick = ()=>$("progFile").click();
  $("progCodeMake").onclick = ()=>transferPanel($("progCodeBox"), "make");
  $("progCodeEnter").onclick = ()=>transferPanel($("progCodeBox"), "enter");
  $("progFile").onchange = e=>{
    const f = e.target.files[0]; e.target.value = ""; if(!f) return;
    restoreBackup(f, (ok, m)=>{ if(!ok && m){ $("progBackupMsg").textContent = m; $("progBackupMsg").className = "feedback bad"; } });
  };
  $("progReset").onclick = ()=>{
    if(confirm(tx("Erase all your progress? Your streak, your review schedule and your scores for words will be lost."))){ Progress.reset(); renderBoard(); }
  };
}
function openProgress(){
  $("progGame").hidden = true; $("progGame").innerHTML = ""; $("progBoard").hidden = false;
  renderBoard();
}

/* the line on the home page */
function renderHomeProgress(){
  const st = Progress.stats(), streak = Progress.streak();
  const bits = [];
  if(streak) bits.push("🔥 " + tx(streak===1 ? "{n} day in a row" : "{n} days in a row", {n:streak}));
  if(st.total >= 4) bits.push(st.due ? tx(st.due===1 ? "{n} word to review" : "{n} words to review", {n:st.due}) : tx("Nothing to review right now."));
  if(st.total >= 4 && st.dueToday > st.due) bits.push(tx("{n} more later today", {n:st.dueToday - st.due}));
  $("progHint").textContent = bits.length ? bits.join(" · ") : tx("Review the words you practiced, and follow your progress.");
}
