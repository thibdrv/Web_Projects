/* ---------- calendar of the public holidays of Cyprus (mode "Calendar" of Time & dates) ----------
   Built from data/holidays.js. A holiday has a fixed date ("m-d") or a date that depends on Orthodox Easter ("e<n>": n days after it).
   The page shows: the next holiday, a month grid (Monday first) with a dot on the holidays, the holidays of the month with a
   short explanation in Greek (with the voice and the meaning), and the list of the whole year. */
const HOL = HOLIDAYS;
let calYear = new Date().getFullYear(), calMonth = new Date().getMonth(), calShowTr = true, calPick = null;

/* Orthodox Easter Sunday of a year, as a date of today's (Gregorian) calendar: Meeus' formula for the Julian Easter + 13 days (right from 1900 to 2099) */
function orthodoxEaster(y){
  const a = y%4, b = y%7, c = y%19, d = (19*c+15)%30, e = (2*a+4*b-d+34)%7;
  const m = Math.floor((d+e+114)/31), day = (d+e+114)%31 + 1;
  const dt = new Date(Date.UTC(y, m-1, day)); dt.setUTCDate(dt.getUTCDate()+13);
  return {m:dt.getUTCMonth(), d:dt.getUTCDate()};
}
/* the holidays of a year, in date order: [{h, m (0-11), d}] */
function holidaysOf(y){
  const e = orthodoxEaster(y), base = Date.UTC(y, e.m, e.d);
  const list = HOL.holidays.map(h=>{
    if(h.rule.startsWith("e")){
      const dt = new Date(base + parseInt(h.rule.slice(1),10)*86400000);
      return {h, m:dt.getUTCMonth(), d:dt.getUTCDate()};
    }
    const [m,d] = h.rule.split("-").map(Number);
    return {h, m:m-1, d};
  });
  return list.sort((a,b)=>a.m-b.m || a.d-b.d);
}
/* "Κυριακή 12 Απριλίου 2026" */
function greekDate(y, m, d){
  const wd = (new Date(y,m,d).getDay()+6)%7;
  return `${HOL.days[wd].gr} ${d} ${HOL.months[m].of} ${y}`;
}
const dayName = wd => HOL.days[wd];

function nextHoliday(){
  const now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  for(let y = now.getFullYear(); y <= now.getFullYear()+1; y++){
    for(const x of holidaysOf(y)){
      const days = Math.round((new Date(y,x.m,x.d).getTime() - t0)/86400000);
      if(days>=0) return {...x, y, days};
    }
  }
  return null;
}
const greekIn = n => n===0 ? "σήμερα" : n===1 ? "αύριο" : `σε ${n} ημέρες`;

function renderHolidayCalendar(box){
  const hols = holidaysOf(calYear), today = new Date();
  const inMonth = hols.filter(x=>x.m===calMonth);
  const nx = nextHoliday();
  const monthName = HOL.months[calMonth];
  const first = (new Date(calYear, calMonth, 1).getDay()+6)%7, count = new Date(calYear, calMonth+1, 0).getDate();
  const isToday = d => today.getFullYear()===calYear && today.getMonth()===calMonth && today.getDate()===d;
  const byDay = new Map(inMonth.map(x=>[x.d, x]));

  let cells = HOL.days.map((w,i)=>`<span class="cal-wd${i>=5 ? " we" : ""}" lang="el" title="${esc(tx(w.en))}">${esc(w.short)}</span>`).join("");
  for(let i=0; i<first; i++) cells += `<span class="cal-day blank"></span>`;
  for(let d=1; d<=count; d++){
    const x = byDay.get(d), col = (first+d-1)%7;
    cells += x
      ? `<button type="button" class="cal-day hol${calPick===x.h.id ? " on" : ""}${isToday(d) ? " today" : ""}" data-id="${x.h.id}" aria-label="${esc(x.h.gr)}"><b>${d}</b><i aria-hidden="true">${x.h.emoji}</i></button>`
      : `<span class="cal-day${isToday(d) ? " today" : ""}${col>=5 ? " we" : ""}">${d}</span>`;
  }
  const card = x => {
    const date = greekDate(calYear, x.m, x.d);
    return `<div class="holcard${calPick===x.h.id ? " on" : ""}" data-id="${x.h.id}">
      <div class="hol-head"><span class="hol-emoji" aria-hidden="true">${x.h.emoji}</span>
        <div class="hol-title"><b lang="el">${esc(x.h.gr)}</b><span class="hol-date" lang="el">${esc(date)}</span></div>
        <button type="button" class="hear sm" data-say="${esc(x.h.gr)}" aria-label="${esc(tx("Listen"))}">🔊</button></div>
      <p class="hol-why" lang="el">${esc(x.h.why.gr)}</p>
      <button type="button" class="hear" data-say="${esc(x.h.why.gr)}">🔊 ${esc(tx("Listen to the explanation"))}</button>
      <p class="hol-tr"${calShowTr ? "" : " hidden"}><b>${esc(pick(x.h))}</b><br>${esc(pick(x.h.why))}</p></div>`;
  };
  const rows = hols.map(x=>`<button type="button" class="holrow" data-m="${x.m}" data-id="${x.h.id}"><span class="hol-emoji" aria-hidden="true">${x.h.emoji}</span>
    <span class="holrow-t"><b lang="el">${esc(x.h.gr)}</b><span lang="el">${x.d} ${esc(HOL.months[x.m].of)}</span></span><span class="muted">${esc(tx(HOL.days[(new Date(calYear,x.m,x.d).getDay()+6)%7].en))}</span></button>`).join("");

  box.innerHTML = `
    <div class="cal">
      ${nx ? `<div class="cal-next"><span class="hol-emoji" aria-hidden="true">${nx.h.emoji}</span>
        <div><span class="cal-kicker">${esc(tx("Next holiday"))}</span><b lang="el">${esc(nx.h.gr)}</b>
        <span lang="el">${esc(greekDate(nx.y, nx.m, nx.d))} · ${esc(greekIn(nx.days))}</span>
        <span class="muted">${esc(tx(nx.days===0 ? "today" : nx.days===1 ? "tomorrow" : "in {n} days", {n:nx.days}))}</span></div></div>` : ""}
      <div class="cal-nav">
        <button type="button" class="chip" data-nav="-1" aria-label="${esc(tx("Previous month"))}">‹</button>
        <div class="cal-title"><b lang="el">${esc(monthName.gr)} ${calYear}</b><span class="muted">${esc(tx(monthName.en))}</span></div>
        <button type="button" class="chip" data-nav="1" aria-label="${esc(tx("Next month"))}">›</button>
      </div>
      <div class="cal-bar"><button type="button" class="chip" id="calToday">${esc(tx("Today"))}</button>
        <button type="button" class="chip" id="calTr" aria-pressed="${calShowTr}">👁 ${esc(tx("Show the meaning"))}</button></div>
      <div class="cal-grid" role="group" aria-label="${esc(monthName.gr)} ${calYear}">${cells}</div>
      <div class="holcards">${inMonth.length ? inMonth.map(card).join("") : `<p class="note">${esc(tx("No public holiday this month."))}</p>`}</div>
      <h2 class="sub">${esc(tx("All the public holidays of {y}", {y:calYear}))}</h2>
      <div class="holrows">${rows}</div>
      <p class="note">${esc(tx("The list follows Wikipedia. The days of Easter change every year; check the official calendar for the exact days."))}</p>
    </div>`;

  const redraw = () => renderHolidayCalendar(box);
  box.querySelectorAll("[data-nav]").forEach(b=>b.onclick = ()=>{
    calMonth += +b.dataset.nav; calPick = null;
    if(calMonth<0){ calMonth = 11; calYear--; } else if(calMonth>11){ calMonth = 0; calYear++; }
    redraw();
  });
  $("calToday").onclick = ()=>{ calYear = today.getFullYear(); calMonth = today.getMonth(); calPick = null; redraw(); };
  $("calTr").onclick = ()=>{ calShowTr = !calShowTr; redraw(); };
  box.querySelectorAll("[data-say]").forEach(b=>b.onclick = e=>{ e.stopPropagation(); say(b.dataset.say); });
  box.querySelectorAll(".cal-day.hol").forEach(b=>b.onclick = ()=>{
    calPick = b.dataset.id; redraw();
    const c = box.querySelector(`.holcard[data-id="${calPick}"]`); if(c) try{ c.scrollIntoView({block:"nearest", behavior:"smooth"}); }catch(e){}
    const h = HOL.holidays.find(x=>x.id===calPick); if(h) say(h.gr);
  });
  box.querySelectorAll(".holrow").forEach(b=>b.onclick = ()=>{
    calMonth = +b.dataset.m; calPick = b.dataset.id; redraw();
    const c = box.querySelector(`.holcard[data-id="${calPick}"]`); if(c) try{ c.scrollIntoView({block:"center", behavior:"smooth"}); }catch(e){}
  });
}
