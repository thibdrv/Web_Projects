/* ---------- statistics and badges ----------
   The page "Statistics & badges" (#stats): what you did, day after day (a bar chart of the last 7 days, a calendar of the last 12 weeks), how well you know each category,
   and the badges (medals) you earned. Everything is worked out from what Progress already keeps in the browser ("gl-progress", "gl-days"), plus a few small notes
   kept under "gl-meta" (night owl, early bird, perfect quizzes, pages visited) and the date of each badge under "gl-badges". Nothing is sent anywhere.
   When a new badge is earned, a small message tells it (once). The first time (no "gl-badges" yet) the badges you already deserve are given silently. */

/* ----- the small notes ----- */
function metaGet(){ try{ const m = JSON.parse(localStorage.getItem("gl-meta")); if(m && typeof m==="object") return m; }catch(e){} return {}; }
function metaSave(m){ try{ localStorage.setItem("gl-meta", JSON.stringify(m)); }catch(e){} }
function noteActivity(){
  const m = metaGet(), h = new Date().getHours();
  let changed = false;
  if((h>=22 || h<4) && !m.night){ m.night = 1; changed = true; }
  if(h>=4 && h<7 && !m.early){ m.early = 1; changed = true; }
  if(changed) metaSave(m);
  scheduleBadgeCheck();
}
/* what Progress hears: every answer */
const recordBase = Progress.record;
Progress.record = function(item, ok){ recordBase.call(Progress, item, ok); noteActivity(); };
/* a perfect quiz (all right, at least 8 questions): celebrate() is called at the end of the quizzes */
const celebrateBase = celebrate;
celebrate = function(box, score, total){ if(score===total && total>=8){ const m = metaGet(); m.perfects = (m.perfects||0) + 1; metaSave(m); scheduleBadgeCheck(); } return celebrateBase.apply(this, arguments); };
/* the pages you opened */
const rememberViewBase = rememberView;
rememberView = function(name){ rememberViewBase(name); if(name && name!=="home"){ const m = metaGet(), v = m.visited || []; if(!v.includes(name)){ v.push(name); m.visited = v; metaSave(m); scheduleBadgeCheck(); } } };

/* ----- numbers worked out from Progress ----- */
function dayKey(t){ return typeof Progress.dayOf==="function" ? Progress.dayOf(t) : (d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`)(new Date(t)); }
function statsNumbers(){
  const days = Progress.dayCounts(), items = Progress.list(), st = Progress.stats();
  const total = Object.values(days).reduce((a,b)=>a+b, 0);
  const now = Date.now(), DAY = 86400000;
  let week = 0; for(let i=0;i<7;i++) week += days[dayKey(now - i*DAY)] || 0;
  let right = 0, wrong = 0; items.forEach(r=>{ right += r.right||0; wrong += r.wrong||0; });
  const cats = {};
  items.forEach(r=>{ const c = cats[r.cat||"?"] || (cats[r.cat||"?"] = {seen:0, right:0, wrong:0, mastered:0}); c.seen++; c.right += r.right||0; c.wrong += r.wrong||0; if(r.box>=4) c.mastered++; });
  return {days, total, week, today:st.today, streak:Progress.streak(), best:Progress.bestStreak(), daysStudied:Object.keys(days).filter(k=>days[k]>0).length,
          practised:st.total, mastered:st.mastered, accuracy:(right+wrong) ? Math.round(100*right/(right+wrong)) : null, cats, maxDay:Math.max(0, ...Object.values(days))};
}

/* ----- the badges ----- */
/* tier: 1 bronze, 2 silver, 3 gold. need(n) returns [value, target]: the badge is earned when value >= target */
const BADGES = [
  {id:"a10",   icon:"🌱", tier:1, name:{en:"First steps", fr:"Premiers pas"}, desc:{en:"Give 10 answers.", fr:"Donne 10 réponses."}, need:n=>[n.total, 10]},
  {id:"a100",  icon:"🎯", tier:1, name:{en:"On target", fr:"Dans le mille"}, desc:{en:"Give 100 answers.", fr:"Donne 100 réponses."}, need:n=>[n.total, 100]},
  {id:"a500",  icon:"💪", tier:2, name:{en:"Hard worker", fr:"Travailleur"}, desc:{en:"Give 500 answers.", fr:"Donne 500 réponses."}, need:n=>[n.total, 500]},
  {id:"a2000", icon:"🏆", tier:3, name:{en:"Marathon", fr:"Marathon"}, desc:{en:"Give 2 000 answers.", fr:"Donne 2 000 réponses."}, need:n=>[n.total, 2000]},
  {id:"s3",    icon:"🔥", tier:1, name:{en:"On fire", fr:"En feu"}, desc:{en:"Study 3 days in a row.", fr:"Étudie 3 jours de suite."}, need:n=>[n.best, 3]},
  {id:"s7",    icon:"🔥", tier:2, name:{en:"A whole week", fr:"Une semaine entière"}, desc:{en:"Study 7 days in a row.", fr:"Étudie 7 jours de suite."}, need:n=>[n.best, 7]},
  {id:"s30",   icon:"🔥", tier:3, name:{en:"A whole month", fr:"Un mois entier"}, desc:{en:"Study 30 days in a row.", fr:"Étudie 30 jours de suite."}, need:n=>[n.best, 30]},
  {id:"m10",   icon:"⭐", tier:1, name:{en:"First words", fr:"Premiers mots"}, desc:{en:"Master 10 words.", fr:"Maîtrise 10 mots."}, need:n=>[n.mastered, 10]},
  {id:"m50",   icon:"⭐", tier:2, name:{en:"Growing vocabulary", fr:"Vocabulaire qui grandit"}, desc:{en:"Master 50 words.", fr:"Maîtrise 50 mots."}, need:n=>[n.mastered, 50]},
  {id:"m200",  icon:"📚", tier:3, name:{en:"Walking dictionary", fr:"Dictionnaire ambulant"}, desc:{en:"Master 200 words.", fr:"Maîtrise 200 mots."}, need:n=>[n.mastered, 200]},
  {id:"goal",  icon:"✅", tier:1, name:{en:"Goal reached", fr:"Objectif atteint"}, desc:{en:"Give 10 answers in one day.", fr:"Donne 10 réponses en une journée."}, need:n=>[n.maxDay, 10]},
  {id:"power", icon:"⚡", tier:2, name:{en:"Power day", fr:"Journée record"}, desc:{en:"Give 50 answers in one day.", fr:"Donne 50 réponses en une journée."}, need:n=>[n.maxDay, 50]},
  {id:"perf",  icon:"🎉", tier:1, name:{en:"Perfect score", fr:"Sans faute"}, desc:{en:"Finish a quiz with every answer right.", fr:"Termine un quiz sans aucune erreur."}, need:n=>[n.meta.perfects||0, 1]},
  {id:"perf10",icon:"👑", tier:3, name:{en:"Ten perfect quizzes", fr:"Dix quiz parfaits"}, desc:{en:"Finish 10 quizzes with every answer right.", fr:"Termine 10 quiz sans aucune erreur."}, need:n=>[n.meta.perfects||0, 10]},
  {id:"night", icon:"🦉", tier:1, name:{en:"Night owl", fr:"Oiseau de nuit"}, desc:{en:"Practice after 10 pm.", fr:"Travaille après 22 h."}, need:n=>[n.meta.night||0, 1]},
  {id:"early", icon:"☀️", tier:1, name:{en:"Early bird", fr:"Lève-tôt"}, desc:{en:"Practice between 4 and 7 am.", fr:"Travaille entre 4 h et 7 h."}, need:n=>[n.meta.early||0, 1]},
  {id:"x10",   icon:"🧭", tier:1, name:{en:"Explorer", fr:"Explorateur"}, desc:{en:"Open 10 different pages.", fr:"Ouvre 10 pages différentes."}, need:n=>[(n.meta.visited||[]).length, 10]},
  {id:"x25",   icon:"🧭", tier:2, name:{en:"Globetrotter", fr:"Globe-trotter"}, desc:{en:"Open 25 different pages.", fr:"Ouvre 25 pages différentes."}, need:n=>[(n.meta.visited||[]).length, 25]},
  {id:"test",  icon:"📊", tier:1, name:{en:"Level found", fr:"Niveau trouvé"}, desc:{en:"Take the level test.", fr:"Fais le test de niveau."}, need:n=>[typeof lastTest==="function" && lastTest() ? 1 : 0, 1]},
  {id:"cy",    icon:"🇨🇾", tier:2, name:{en:"Friend of Cyprus", fr:"Ami de Chypre"}, desc:{en:"Practice 20 words of Cypriot Greek.", fr:"Travaille 20 mots du grec de Chypre."}, need:n=>[(n.cats["Cypriot Greek"]||{}).seen||0, 20]},
  {id:"fam",   icon:"🌳", tier:2, name:{en:"Family tree", fr:"Arbre généalogique"}, desc:{en:"Practice 30 words of the word families.", fr:"Travaille 30 mots des familles de mots."}, need:n=>[(n.cats["Word families"]||{}).seen||0, 30]},
  {id:"gram",  icon:"🧩", tier:2, name:{en:"Grammar fan", fr:"Fan de grammaire"}, desc:{en:"Practice 100 grammar forms.", fr:"Travaille 100 formes de grammaire."}, need:n=>[(n.cats["Grammar"]||{}).seen||0, 100]}
];
const TIER_NAMES = {1:"Bronze", 2:"Silver", 3:"Gold"};
function badgeStore(){ try{ const b = JSON.parse(localStorage.getItem("gl-badges")); if(b && typeof b==="object") return b; }catch(e){} return null; }
function badgeSave(b){ try{ localStorage.setItem("gl-badges", JSON.stringify(b)); }catch(e){} }
/* the badges that are now deserved and not yet given: they are given, and the new ones are told (unless it is the very first check) */
function checkBadges(){
  const store = badgeStore(), first = store===null, got = store || {}, n = {...statsNumbers(), meta:metaGet()}, fresh = [];
  const today = new Date().toLocaleDateString(LANG==="fr" ? "fr-FR" : "en-GB");
  BADGES.forEach(b=>{ const [v,t] = b.need(n); if(v>=t && !got[b.id]){ got[b.id] = today; fresh.push(b); } });
  if(fresh.length || first) badgeSave(got);
  if(fresh.length && !first && typeof pwaToast==="function"){
    const b = fresh[fresh.length-1];
    pwaToast(tx("New badge: {name}", {name:pick(b.name)}) + (fresh.length>1 ? " " + tx("(and {n} more)", {n:fresh.length-1}) : ""), {label:tx("See"), run:()=>{ const t = $("pwaToast"); if(t) t.remove(); location.hash = "stats"; }}, {owl:true});
    if(typeof owlSay==="function") owlSay(tx("Bravo!"), "cheer");
  }
  return fresh;
}
let badgeTimer = 0;
function scheduleBadgeCheck(){ clearTimeout(badgeTimer); badgeTimer = setTimeout(checkBadges, 700); }

/* ----- the page ----- */
function pct(a,b){ return b ? Math.round(100*a/b) : 0; }
function openStats(){
  const box = $("statsBox"), n = {...statsNumbers(), meta:metaGet()}, got = badgeStore() || {}, goal = typeof dailyGoal==="function" ? dailyGoal() : 10;
  const tile = (v, label) => `<div class="tile3"><b data-count="${/^\d+%?$/.test(String(v)) ? v : ""}">${v}</b><span>${esc(tx(label))}</span></div>`;
  if(!n.total){
    box.innerHTML = emptyState({icon:"📈", title:tx("Nothing to show yet."), text:tx("Answer a few questions in any game, and your days, your progress and your badges will appear here."),
      actions:[{label:tx("Start with the letters"), href:"#letters"}, {label:tx("Browse the categories"), href:"#home", ghost:true}]});
    return;
  }
  /* the last 7 days */
  const now = Date.now(), DAY = 86400000, week = [];
  for(let i=6;i>=0;i--){ const t = now - i*DAY; week.push({t, n:n.days[dayKey(t)] || 0}); }
  const top = Math.max(goal, ...week.map(d=>d.n), 1);
  const bars = week.map((d,i)=>`<div class="sbarcol${i===6 ? " istoday" : ""}" title="${esc(new Date(d.t).toLocaleDateString(LANG==="fr" ? "fr-FR" : "en-GB"))}: ${d.n}">
      <span class="sbval">${d.n || ""}</span><i style="height:${Math.max(d.n ? 6 : 2, Math.round(100*d.n/top))}%" class="${d.n>=goal ? "hit" : ""}"></i>
      <span class="sbday">${esc(new Date(d.t).toLocaleDateString(LANG==="fr" ? "fr-FR" : "en-GB", {weekday:"short"}).replace(".",""))}</span></div>`).join("");
  /* the last 12 weeks: columns of weeks (Monday on top), the colour tells how much */
  const mondayOffset = (new Date().getDay() + 6) % 7, startT = now - (mondayOffset + 11*7)*DAY, cells = [];
  const max = Math.max(1, ...Object.values(n.days));
  for(let w=0; w<12; w++){ for(let d=0; d<7; d++){
    const t = startT + (w*7 + d)*DAY, future = t > now, c = future ? 0 : (n.days[dayKey(t)] || 0), lvl = !c ? 0 : c < max*.25 ? 1 : c < max*.5 ? 2 : c < max*.75 ? 3 : 4;
    cells.push(`<i class="hm l${lvl}${future ? " fut" : ""}" title="${esc(new Date(t).toLocaleDateString(LANG==="fr" ? "fr-FR" : "en-GB"))}: ${c}"></i>`);
  } }
  /* the categories */
  const catRows = Object.entries(n.cats).filter(([c])=>c!=="?").sort((a,b)=>b[1].seen-a[1].seen).slice(0,8).map(([c,v])=>{
    const acc = pct(v.right, v.right+v.wrong);
    return `<div class="catrow"><span>${esc(tx(c))}</span><span class="muted">${v.seen} · ${acc}%</span><i class="sbar"><b class="b2" style="width:${acc}%"></b><b style="width:${pct(v.mastered, v.seen)}%"></b></i></div>`;
  }).join("");
  const weak = Object.entries(n.cats).filter(([c,v])=>c!=="?" && v.right+v.wrong>=10).sort((a,b)=>pct(a[1].right,a[1].right+a[1].wrong)-pct(b[1].right,b[1].right+b[1].wrong)).slice(0,3);
  /* the badges */
  const earned = BADGES.filter(b=>got[b.id]).length;
  const badges = BADGES.map(b=>{
    const done = !!got[b.id], [v,t] = b.need(n), p = Math.min(100, pct(v,t));
    return `<div class="badge tier${b.tier}${done ? " on" : ""}" role="img" aria-label="${esc(pick(b.name))}: ${esc(done ? tx("earned") : tx("not yet"))}">
      <span class="medal" aria-hidden="true"><span class="micon">${b.icon}</span></span>
      <b>${esc(pick(b.name))}</b><span class="bdesc">${esc(pick(b.desc))}</span>
      ${done ? `<span class="bdate">${esc(got[b.id])}</span>` : `<i class="bprog"><b style="width:${p}%"></b></i><span class="bdate">${Math.min(v,t)} / ${t}</span>`}</div>`;
  }).join("");
  box.innerHTML = `
    <div class="tiles3">${tile(n.today, "Today")}${tile(n.week, "Last 7 days")}${tile(n.total, "Answers in all")}</div>
    <div class="tiles3">${tile(n.streak, "Days in a row")}${tile(n.best, "Best streak")}${tile(n.daysStudied, "Days studied")}</div>
    <div class="tiles3">${tile(n.practised, "Words practiced")}${tile(n.mastered, "Mastered")}${tile(n.accuracy===null ? "–" : n.accuracy+"%", "Right answers")}</div>
    <div class="panel"><h2 class="sub" style="margin-top:0">${esc(tx("Last 7 days"))}</h2>
      <div class="sbars" role="img" aria-label="${esc(tx("Answers per day, last 7 days"))}"><div class="sgoal" style="bottom:${Math.round(100*goal/top)}%"><span>${esc(tx("goal"))} ${goal}</span></div>${bars}</div></div>
    <div class="panel"><h2 class="sub" style="margin-top:0">${esc(tx("Last 12 weeks"))}</h2>
      <div class="heat" role="img" aria-label="${esc(tx("Calendar of the days you studied"))}">${cells.join("")}</div>
      <p class="note" style="text-align:left">${esc(tx("The darker the square, the more answers that day."))}</p></div>
    <div class="panel"><h2 class="sub" style="margin-top:0">${esc(tx("By category"))}</h2>${catRows || `<p class="muted">–</p>`}
      <p class="note" style="text-align:left">${esc(tx("Words practiced · right answers. The light bar is the right answers, the dark bar the words you master."))}</p>
      ${weak.length ? `<p style="margin-bottom:0"><b>${esc(tx("To work on"))}:</b> ${weak.map(([c,v])=>`${esc(tx(c))} (${pct(v.right, v.right+v.wrong)}%)`).join(" · ")}</p>` : ""}</div>
    <div class="panel"><h2 class="sub" style="margin-top:0">${esc(tx("Badges"))} <span class="muted">${earned} / ${BADGES.length}</span></h2><div class="badges">${badges}</div></div>
    <div class="btns"><a class="btn ghost" href="#progress">${esc(tx("Back to my progress"))}</a></div>`;
  animateStats(box);
}
/* the page comes alive: the numbers count up, the bars grow, the calendar lights up square by square, the badges rise one after the other (nothing moves with reduced motion) */
function animateStats(box){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.calm==="1" || !box.animate) return;
  box.querySelectorAll("[data-count]").forEach(b=>{
    const raw = b.dataset.count; if(!raw) return;
    const target = parseInt(raw, 10), pct = raw.endsWith("%"), t0 = performance.now(), dur = 800;
    const step = t => {
      const k = Math.min(1, (t - t0)/dur), v = Math.round(target * (1 - Math.pow(1 - k, 3)));
      b.textContent = v + (pct ? "%" : "");
      if(k<1 && b.isConnected) requestAnimationFrame(step); else b.textContent = raw;
    };
    b.textContent = "0" + (pct ? "%" : ""); requestAnimationFrame(step);
  });
  box.querySelectorAll(".sbarcol i").forEach((el,i)=>el.animate([{transform:"scaleY(0)"},{transform:"scaleY(1)"}], {duration:650, delay:120 + i*70, easing:"cubic-bezier(.2,.9,.3,1)", fill:"backwards"}));
  box.querySelectorAll(".sbarcol i").forEach(el=>{ el.style.transformOrigin = "50% 100%"; });
  box.querySelectorAll(".hm").forEach((el,i)=>el.animate([{opacity:0, transform:"scale(.4)"},{opacity:1, transform:"scale(1)"}], {duration:380, delay:300 + (i%12)*26 + Math.floor(i/12)*8, easing:"ease-out", fill:"backwards"}));
  box.querySelectorAll(".catrow .sbar b").forEach((el,i)=>el.animate([{transform:"scaleX(0)"},{transform:"scaleX(1)"}], {duration:700, delay:200 + i*30, easing:"ease-out", fill:"backwards"}));
  box.querySelectorAll(".catrow .sbar b").forEach(el=>{ el.style.transformOrigin = "0 50%"; });
  box.querySelectorAll(".badge").forEach((el,i)=>el.animate([{opacity:0, transform:"translateY(14px) scale(.92)"},{opacity:el.classList.contains("on") ? 1 : .62, transform:"none"}], {duration:420, delay:350 + i*40, easing:"cubic-bezier(.2,.9,.3,1)", fill:"backwards"}));
}

/* the first check: the badges you already deserve are given quietly */
addEventListener("load", ()=>setTimeout(checkBadges, 1500));
