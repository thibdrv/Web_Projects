/* ---------- the "Today" card on the home page ----------
   - the word of the day: the same word all day long, chosen from the words that have a picture
   - the daily goal: how many answers you gave today (Progress.stats().today), out of 10, 20 or 30 (tap the number to change it)
   - buttons: continue where you stopped, the 1-minute challenge, and the review when words are due
   The last category you opened is kept in localStorage ("gl-last"), the goal in "gl-goal". */
const GOALS = [10, 20, 30];
const TODAY_POOLS = () => [FAMILY, FOOD, BODY, TIME, HOUSE, CITY, DIRECTIONS, NATURE, JOBS];
let todayPool = null;

function dailyGoal(){ try{ const g = +localStorage.getItem("gl-goal"); return GOALS.includes(g) ? g : GOALS[0]; }catch(e){ return GOALS[0]; } }
function lastView(){ try{ const v = localStorage.getItem("gl-last"); return v && VIEW_TITLES[v] ? v : null; }catch(e){ return null; } }
/* the 3 last pages you opened, newest first ("gl-recent"), shown under the Today card */
function recentViews(){ try{ const r = JSON.parse(localStorage.getItem("gl-recent")); return Array.isArray(r) ? r.filter(v=>VIEW_TITLES[v]) : []; }catch(e){ return []; } }
function rememberView(name){
  if(!["home","about"].includes(name)){
    try{ localStorage.setItem("gl-recent", JSON.stringify([name, ...recentViews().filter(v=>v!==name)].slice(0,3))); }catch(e){}
  }
  if(["home","about","progress","dictionary","leveltest"].includes(name)) return;
  try{ localStorage.setItem("gl-last", name); }catch(e){}
}

/* the word of the day: a number made from today's date picks one word of the list */
function wordOfTheDay(){
  if(!todayPool) todayPool = TODAY_POOLS().flatMap(D=>D.groups.flatMap(g=>g.words.filter(w=>w.emoji)));
  const h = parseInt(sid(new Date().toDateString()), 16);
  return todayPool[h % todayPool.length];
}

function renderHomeToday(){
  const box = $("today"); if(!box) return;
  const w = wordOfTheDay(), st = Progress.stats(), streak = Progress.streak(), goal = dailyGoal();
  const pct = Math.min(100, Math.round(100 * st.today / goal)), done = st.today >= goal;
  const last = lastView(), due = st.dueToday;
  const goTo = last ? last : "letters";
  const contLabel = last ? tx("Continue: {name}", {name: tx(VIEW_TITLES[last].split(" · ")[0])}) : tx("Start with the letters");
  const goalText = esc(tx("{n} / {goal} answers today", {n:st.today, goal}));
  box.innerHTML = `
    <div class="tword">
      <span class="tw-pic" aria-hidden="true">${w.emoji}</span>
      <div class="tw-txt"><small>${esc(tx("Word of the day"))}</small>
        <b lang="el">${esc(w.gr)}</b><i><span class="lt">${esc(w.lat)}</span></i><span>${esc(txm(w.en))}</span></div>
      <button class="tw-hear" type="button" id="todayHear" aria-label="${esc(tx("Listen"))}">🔊</button>
    </div>
    <div class="tgoal${done ? " done" : ""}">
      <div class="tg-ring" role="progressbar" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.min(st.today, goal)}" aria-label="${esc(tx("Daily goal"))}">
        <svg viewBox="0 0 80 80" aria-hidden="true"><circle class="tg-track" cx="40" cy="40" r="34"/><circle class="tg-fill" cx="40" cy="40" r="34" pathLength="100" style="stroke-dasharray:0 100" data-pct="${pct}"/></svg>
        <span class="tg-num">${Math.min(st.today, 999)}</span>
      </div>
      <div class="tg-info">
        <div class="tg-head"><b>${esc(tx("Daily goal"))}</b>
          <button class="tg-set" type="button" id="todayGoal" title="${esc(tx("Change the goal"))}" aria-label="${esc(tx("Change the goal"))}">${goal} ✎</button></div>
        <p>${done ? "🎉 " + esc(tx("Goal reached!")) + " " : ""}${goalText}</p>
        ${streak ? `<p class="tg-streak">🔥 ${esc(tx(streak===1 ? "{n} day in a row" : "{n} days in a row", {n:streak}))}</p>` : ""}
      </div>
    </div>
    <div class="tbtns">
      <button class="tbtn main" type="button" data-to="${goTo}">${esc(contLabel)}</button>
      <button class="tbtn" type="button" data-to="challenge">⚡ ${esc(tx("1-minute challenge"))}</button>
      ${due ? `<button class="tbtn" type="button" data-to="progress">🔁 ${esc(tx(due===1 ? "{n} word to review today" : "{n} words to review today", {n:due}))}</button>` : ""}
    </div>`;
  /* the gold ring fills up after the card has appeared */
  const fill = box.querySelector(".tg-fill");
  setTimeout(()=>{ fill.style.strokeDasharray = fill.dataset.pct + " 100"; }, 60);
  $("todayHear").onclick = ()=>say(w.gr);
  $("todayHear").after(favButton({gr:w.gr, lat:w.lat, en:w.en, snd:sid(w.gr), emoji:w.emoji, cat:"Word of the day"}, "round"));
  $("todayGoal").onclick = ()=>{
    const next = GOALS[(GOALS.indexOf(goal)+1) % GOALS.length];
    try{ localStorage.setItem("gl-goal", next); }catch(e){}
    renderHomeToday();
  };
  box.querySelectorAll("[data-to]").forEach(b=>b.onclick = ()=>{ location.hash = b.dataset.to; });
}
