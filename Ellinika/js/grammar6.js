/* ---------- grammar: short written lessons ----------
   The topic "Mini lessons" of the Grammar page, built from data/grammar6.js (made by gen_grammar6.py): 8 lessons that open and close (the first one is open),
   each with an explanation, sentences to tap and hear, sometimes a table of forms, and a drill. Choose / Write: a sentence with a missing word, taken from all the lessons.
   It uses the helpers of js/grammar2.js (explain, g2Line, g2Item, greekOptions, pill, deck). */
const G6 = GRAMMAR6;
function grammar6Total(){ return G6.lessons.reduce((n,l)=>n + l.drill.length, 0); }
G_TOPICS.splice(1, 0, ["lessons", "Mini lessons"]);
const fold6 = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

TOPICS.lessons = {
  intro:"Short lessons to read, with sentences to hear. Then practice with the missing-word game.",
  learn(box){
    G6.lessons.forEach((L,i)=>{
      const d = document.createElement("details"); d.className = "panel lesson"; d.open = i===0;
      d.innerHTML = `<summary><b>${i+1}. ${esc(pick(L.title))}</b><span class="lsum">${esc(pick(L.intro))}</span></summary>
        <ul class="plain lpoints">${L.points.map(p=>`<li>${esc(pick(p))}</li>`).join("")}</ul>`;
      if(L.tables) L.tables.forEach(t=>{
        const row = document.createElement("div"); row.className = "ltable";
        row.innerHTML = `<b>${esc(pick(t.title))}</b>`;
        t.forms.forEach(f=>{ const b = document.createElement("button"); b.type = "button"; b.className = "artcell"; b.lang = "el"; b.textContent = f; b.onclick = ()=>say(f); row.appendChild(b); });
        d.appendChild(row);
      });
      const lines = document.createElement("div"); lines.className = "lines";
      L.examples.forEach(x=>g2Line(lines, esc(x.say), esc(pick(x)), x.say));
      d.appendChild(lines);
      box.appendChild(d);
    });
  },
  questions(mode){
    const pool = G6.lessons.flatMap(L=>L.drill.map(q=>({...q, lesson:L})));
    const next = deck(pool);
    return ()=>{
      const q = next(), L = q.lesson;
      const base = {item:g2Item(`les:${q.say}`, q.say, q.en, q.fr),
        prompt:`${pill(pick(L.title))}<p class="word s" lang="el">${esc(q.blank)}</p><p class="vinfo">${esc(pick(q))}</p>`,
        reveal:`<b lang="el">${esc(q.say)}</b><br>${esc(pick(q))}`, sayAfter:q.say};
      if(mode==="write") return {...base, write:{answers:[q.answer]}, hint:esc(pick(L.points[0]))};
      /* the wrong words: the lesson's own list, then the answers of the other drills; none that looks like the right one (capitals and accents do not count) */
      const others = [...L.bad, ...L.drill.map(d=>d.answer)].filter((a,i,arr)=>fold6(a)!==fold6(q.answer) && arr.findIndex(b=>fold6(b)===fold6(a))===i);
      return {...base, options:greekOptions(q.answer, sample(others, 3))};
    };
  }
};
