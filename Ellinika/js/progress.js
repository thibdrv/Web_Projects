/* ---------- progress: what you have practiced, and when to review it ----------
   Every game that asks about a word calls Progress.record(item, right?). An item is
     {key, gr, en, lat, snd, cat}   (key: a unique name, snd: the sound, cat: the category's name)
   Each item sits in a "box" from 0 to 5. A right answer moves it up one box (only once it is due),
   a wrong answer drops it back. The higher the box, the longer before it comes back for review:
     box 0: now, box 1: 1 day, box 2: 2 days, box 3: 4 days, box 4: 8 days, box 5: 16 days.
   A word you miss comes back sooner: it is due again at once and goes first in the next review ("step"),
   after the next right answer it still comes back 10 minutes later, and a word missed 3 times or more
   (lapses) gets waiting times twice as short until you master it.
   All of it is kept in this browser (localStorage), nothing is sent anywhere. */
const Progress = (() => {
  const KEY = "gl-progress", DAYS_KEY = "gl-days";
  const DAY = 86400000, INTERVALS = [0, 1, 2, 4, 8, 16], RELEARN = 10*60000;
  let items = {}, days = {};
  try{ items = JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ items = {}; }
  try{ days = JSON.parse(localStorage.getItem(DAYS_KEY)) || {}; }catch(e){ days = {}; }
  const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(items)); localStorage.setItem(DAYS_KEY, JSON.stringify(days)); }catch(e){} };
  const dayOf = (t=Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };

  function record(item, ok){
    if(!item || !item.key) return;
    const now = Date.now();
    const r = items[item.key] || (items[item.key] = {key:item.key, box:0, seen:0, right:0, wrong:0, due:0});
    Object.assign(r, {gr:item.gr, en:item.en, lat:item.lat, snd:item.snd, cat:item.cat});
    if(item.fr) r.fr = item.fr;
    r.seen++; r.last = now;
    if(ok){
      r.right++;
      if(r.step){ r.step = 0; r.due = now + RELEARN; }            /* first right answer after a miss: see it again in 10 minutes */
      else if(now >= r.due){ r.box = Math.min(5, r.box+1); r.due = now + INTERVALS[r.box]*DAY*((r.lapses||0) >= 3 && r.box < 4 ? .5 : 1); }
    } else {
      r.wrong++; r.lapses = (r.lapses||0) + 1; r.step = 1; r.box = Math.max(0, r.box-2); r.due = now;
    }
    const d = dayOf(); days[d] = (days[d]||0) + 1;
    const keys = Object.keys(days).sort();
    if(keys.length > 400) keys.slice(0, keys.length-400).forEach(k=>delete days[k]);
    save();
  }
  /* change the category of the saved words (used when a category is cut in two): fn(item) returns the new name or nothing */
  function recat(fn){ let n = 0; list().forEach(r=>{ const c = fn(r); if(c && c!==r.cat){ r.cat = c; n++; } }); if(n) save(); return n; }
  const all = () => items;
  const list = () => Object.values(items);
  const dueList = (now=Date.now()) => list().filter(r=>r.due<=now).sort((a,b)=>(b.step||0)-(a.step||0) || a.due-b.due);
  /* due now, or before midnight tonight */
  const endOfToday = () => { const d = new Date(); d.setHours(23,59,59,999); return d.getTime(); };
  const dueToday = () => { const t = endOfToday(); return list().filter(r=>r.due<=t).length; };
  const missedList = () => list().filter(r=>r.step && r.due<=Date.now());
  /* words you get wrong more than right, or still in the first boxes */
  const weakList = () => list().filter(r=>r.box<=1 && r.wrong>0).sort((a,b)=>(b.wrong-b.right)-(a.wrong-a.right));
  /* the notebook of mistakes: words you missed and do not master yet, the hardest first (more wrong than right, then the latest) */
  const difficultList = () => list().filter(r=>r.box<4 && (r.own || (r.wrong>0 && (r.box<=1 || r.wrong>=r.right))))
    .sort((a,b)=>(!!b.own-!!a.own) || (b.wrong-b.right)-(a.wrong-a.right) || (b.last||0)-(a.last||0));
  /* a word you add yourself ("own"): it is in the notebook from the start, in box 0, and comes back in the reviews like any other */
  function addOwn(item){
    const key = "own:" + item.gr.toLowerCase().replace(/\s+/g," ").trim();
    if(items[key]) return false;
    items[key] = {key, gr:item.gr, en:item.en, fr:item.fr, lat:item.lat, snd:sid(item.gr), cat:"My own words", own:true, rec:!!item.rec, box:0, seen:0, right:0, wrong:0, due:Date.now(), last:Date.now()};
    save();
    return key;
  }
  function remove(key){ if(items[key]){ delete items[key]; save(); } }
  function stats(){
    const l = list(), now = Date.now();
    return {
      total:l.length,
      learning:l.filter(r=>r.box<=1).length,
      familiar:l.filter(r=>r.box>=2 && r.box<=3).length,
      mastered:l.filter(r=>r.box>=4).length,
      due:l.filter(r=>r.due<=now).length,
      dueToday:l.filter(r=>r.due<=endOfToday()).length,
      missed:l.filter(r=>r.step).length,
      today:days[dayOf()] || 0
    };
  }
  /* for each category: how many words you practiced, and how many are mastered */
  function byCat(){
    const out = {};
    list().forEach(r=>{ const c = out[r.cat] || (out[r.cat] = {seen:0, mastered:0}); c.seen++; if(r.box>=4) c.mastered++; });
    return out;
  }
  /* days in a row with at least one answer, counting back from today (or from yesterday if you have not played yet today) */
  function streak(){
    let t = Date.now(), n = 0;
    if(!days[dayOf(t)]) t -= DAY;
    while(days[dayOf(t)]){ n++; t -= DAY; }
    return n;
  }
  /* a copy of the answers given each day, and the longest run of days in a row (for the page Statistics) */
  const dayCounts = () => ({...days});
  function bestStreak(){
    const keys = Object.keys(days).filter(k=>days[k]>0).sort();
    let best = 0, run = 0, prev = null;
    keys.forEach(k=>{
      const t = Date.parse(k + "T12:00:00");
      run = prev!==null && Math.round((t - prev)/DAY)===1 ? run + 1 : 1;
      prev = t; if(run>best) best = run;
    });
    return best;
  }
  const nextDue = () => { const now = Date.now(); const f = list().filter(r=>r.due>now).map(r=>r.due); return f.length ? Math.min(...f) : null; };
  function reset(){ items = {}; days = {}; try{ localStorage.removeItem(KEY); localStorage.removeItem(DAYS_KEY); }catch(e){} }
  return {record, recat, dayCounts, bestStreak, dayOf, all, list, dueList, dueToday, missedList, weakList, difficultList, addOwn, remove, stats, byCat, streak, nextDue, reset, DAY};
})();
