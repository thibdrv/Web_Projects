/* ---------- reading the clock (two games of Time & dates) ----------
   "Read the clock": you see a clock face, tap what you would say in Greek (data/clock.js).
   "Hear the time": you hear the time in Greek, tap the clock that shows it.
   clockSvg(h, m) draws a clock face: the hour hand sits between two numbers as the minutes go by. */
function clockSvg(h, m, size = 150){
  const hourA = ((h % 12) + m/60) * 30, minA = m * 6;
  const ticks = Array.from({length:12}, (_,i)=>{
    const a = i*30*Math.PI/180, big = i%3===0, r1 = big ? 38 : 42, r2 = 46;
    return `<line x1="${50+r1*Math.sin(a)}" y1="${50-r1*Math.cos(a)}" x2="${50+r2*Math.sin(a)}" y2="${50-r2*Math.cos(a)}" stroke-width="${big ? 3 : 1.6}"/>`;
  }).join("");
  const nums = [12,3,6,9].map((n,i)=>{ const a = i*90*Math.PI/180; return `<text x="${50+30*Math.sin(a)}" y="${50-30*Math.cos(a)+4}" text-anchor="middle">${n}</text>`; }).join("");
  const hand = (deg, len, w) => `<line x1="50" y1="50" x2="${50+len*Math.sin(deg*Math.PI/180)}" y2="${50-len*Math.cos(deg*Math.PI/180)}" stroke-width="${w}" stroke-linecap="round"/>`;
  return `<svg class="clockface" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${h}:${String(m).padStart(2,"0")}">
    <circle cx="50" cy="50" r="48" class="cf-face"/><g class="cf-ticks">${ticks}</g><g class="cf-nums">${nums}</g>
    <g class="cf-hour">${hand(hourA, 24, 4.2)}</g><g class="cf-min">${hand(minA, 36, 2.6)}</g><circle cx="50" cy="50" r="3" class="cf-dot"/></svg>`;
}
const clockText = t => `${t.h}:${String(t.m).padStart(2,"0")}`;
const clockPhrase = t => `<span lang="el">${esc(t.gr)}</span>`;
const timeAt = (h, m) => CLOCK.times.find(t=>t.h===h && t.m===m);

/* 3 other times to mix with the right one: the same hour, the hands swapped, the next hour... all different */
function clockWrong(t){
  const cand = [
    timeAt(t.h, (t.m + 30) % 60), timeAt(t.h, (t.m + 15) % 60), timeAt(t.h, (t.m + 45) % 60),
    timeAt(t.h % 12 + 1, t.m), timeAt((t.h + 10) % 12 + 1, t.m),
    /* the hands swapped: 2:25 looks like 5:10 */
    t.m ? timeAt(t.m / 5 || 12, (t.h % 12) * 5) : null,
    ...sample(CLOCK.times, 6)
  ].filter(x => x && x.gr !== t.gr);
  const out = [], seen = new Set([t.gr]);
  for(const c of shuffle(cand.slice(0, 6)).concat(cand.slice(6))){
    if(seen.has(c.gr)) continue;
    seen.add(c.gr); out.push(c); if(out.length===3) break;
  }
  return out;
}
function clockQuestions(kind){
  const next = deck(CLOCK.times);
  return ()=>{
    const t = next(), wrong = clockWrong(t);
    const reveal = `<b lang="el">${esc(t.gr)}</b><br>${clockSvg(t.h, t.m, 70)}<br><span class="muted">${clockText(t)}</span>`;
    if(kind==="clock"){
      return {prompt:`<p class="vinfo" lang="el">Τι ώρα είναι;</p><p class="vinfo muted">${esc(tx("What time is it?"))}</p>${clockSvg(t.h, t.m, 150)}`,
              options:shuffle([{html:clockPhrase(t), ok:true}, ...wrong.map(w=>({html:clockPhrase(w), ok:false}))]),
              cols:1, reveal, sayAfter:t.gr};
    }
    /* hear the time: tap the clock */
    return {prompt:`<p class="word s">🔊 ${esc(tx("Which clock is it?"))}</p>`, say:t.gr, autoplay:true,
            options:shuffle([{html:clockSvg(t.h, t.m, 92), ok:true, label:clockText(t)}, ...wrong.map(w=>({html:clockSvg(w.h, w.m, 92), ok:false, label:clockText(w)}))]),
            reveal, sayAfter:undefined};
  };
}
const TIME_GAMES = [
  {id:"clock", name:"Read the clock", info:"You see a clock. Tap what you would say in Greek.", make:()=>clockQuestions("clock"), noGroups:true},
  {id:"clockhear", name:"Hear the time", info:"Listen to the time, then tap the clock that shows it.", make:()=>clockQuestions("hear"), noGroups:true}
];
