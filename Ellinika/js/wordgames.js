/* ---------- word games: hangman, word search, crossword ----------
   The words come from the dictionary of the app (nouns, adjectives and verbs of one word), filtered by topic.
   Accents never matter here: a letter is compared without its accent (ά = α), as on a crossword grid.
   Hangman: 5 words in a row, 6 mistakes each. Word search: find 6 hidden words (tap the first and the last letter, or slide a finger).
   Crossword: a small grid made on the spot; the clues are the meanings. Every word you find or miss is noted in Progress like in the other games. */
const WG_GAMES = [
  {id:"hangman", name:"Hangman",     info:"Guess the Greek word letter by letter. You can make 6 mistakes."},
  {id:"search",  name:"Word search", info:"Find the hidden words. Tap the first letter and then the last one, or slide your finger."},
  {id:"cross",   name:"Crossword",   info:"Fill the grid with Greek words. The clues are the meanings. You do not need the accents."},
  {id:"sentences", name:"Sentences",  info:"Tap the words in the right order to build the sentence. The sentences come from the whole app."}
];
const WG_TOPICS = [["all","Everything"], ["verb","Verbs"], ["Food & drinks","Food & drinks"], ["Cooking","Cooking"], ["Family","Family"], ["Clothes","Clothes"],
  ["House & clothes","House & clothes"], ["Human body","Human body"], ["City & travel","City & travel"], ["Weather & nature","Weather & nature"], ["Jobs & hobbies","Jobs & hobbies"],
  ["Time & dates","Time & dates"], ["Colors","Colors"], ["Opposites","Opposites"],
  ["Animals","Animals"], ["Plants & farming","Plants & farming"], ["Adjectives","Adjectives"], ["Feelings & mind","Feelings & mind"], ["Countries & nationalities","Countries & nationalities"],
  ["Money & shopping","Money & shopping"], ["Society & religion","Society & religion"], ["Leisure & arts","Leisure & arts"]];
const WG_KEYS = ["ΑΒΓΔΕΖΗΘ", "ΙΚΛΜΝΞΟΠ", "ΡΣΤΥΦΧΨΩ"];
let wgGame = "hangman", wgTopic = "all", wgHard = false, wgPool = null, wgKey = null;
const wgFold = s => fold(s).toUpperCase();

/* the words that can be used, as {gr, full (with "the"), key (capitals, no accent), lat, en, fr, cats, pos, emoji} */
function wgAll(){
  if(wgPool) return wgPool;
  const seen = new Set(); wgPool = [];
  DICT.forEach(e=>{
    if(!["noun","adjective","verb"].includes(e.pos)) return;
    const gr = withoutArticle(e.gr); if(/\s/.test(gr)) return;
    const key = wgFold(gr); if(!/^[Α-Ω]+$/.test(key) || seen.has(key)) return;
    seen.add(key); wgPool.push({gr, full:e.gr, key, lat:e.lat, en:e.en, fr:frOf(e), cats:e.cats, pos:e.pos, emoji:e.emoji});
  });
  return wgPool;
}
const wgIn = (w, topic) => topic==="all" || (topic==="verb" ? w.pos==="verb" : w.cats.includes(topic));
const wgWords = (min, max, topic=wgTopic) => wgAll().filter(w=>w.key.length>=min && w.key.length<=max && wgIn(w, topic));
const wgMeaning = w => pick({en:w.en, fr:w.fr});
const wgItem = w => ({key:"wg:"+sid(w.full), gr:w.full, en:w.en, fr:w.fr, lat:w.lat, snd:sid(w.full), cat:w.cats[0]});

/* the Greek letters as buttons; onKey(letter) is called when one is tapped. Returns {el, mark(letter, "hit"|"miss"), reset()} */
function wgKeyboard(onKey, onDel){
  const el = document.createElement("div"); el.className = "wg-kb"; el.lang = "el";
  const btn = {};
  WG_KEYS.forEach((row,i)=>{
    const r = document.createElement("div"); r.className = "wg-kbrow";
    [...row].forEach(L=>{
      const b = document.createElement("button"); b.type = "button"; b.className = "wg-k"; b.textContent = L; btn[L] = b;
      b.onclick = ()=>onKey(L); r.appendChild(b);
    });
    if(onDel && i===2){ const d = document.createElement("button"); d.type = "button"; d.className = "wg-k wide"; d.textContent = "⌫"; d.setAttribute("aria-label", tx("Delete")); d.onclick = onDel; r.appendChild(d); }
    el.appendChild(r);
  });
  return {el, mark:(L,state)=>{ if(btn[L]){ btn[L].classList.add(state); if(state!=="use") btn[L].disabled = true; } }};
}
document.addEventListener("keydown", e=>{
  if(currentView!=="wordgames" || !wgKey || e.ctrlKey || e.metaKey || e.altKey) return;
  if(e.target && e.target.matches && e.target.matches("input,textarea,select")) return;
  if(e.key==="Backspace" || e.key==="Delete"){ wgKey("DEL"); return; }
  if(e.key.length!==1) return;
  const L = wgFold(e.key); if(/^[Α-Ω]$/.test(L)){ e.preventDefault(); wgKey(L); }
});

function wgFinish(box, score, total, again){
  wgKey = null;
  box.innerHTML = scoreCard(score, total, esc(tx(score===total ? "Perfect!" : score>=total/2 ? "Well done!" : "Keep going!")), esc(tx("{n} of {t} words found.", {n:score, t:total})));
  const b = document.createElement("button"); b.type = "button"; b.className = "btn"; b.textContent = tx("Play again"); b.onclick = again;
  const wrap = document.createElement("div"); wrap.className = "wg-actions"; wrap.appendChild(b); box.appendChild(wrap);
  celebrate(box, score, total);
}

/* the gallows drawn in SVG: it builds itself at the start of each word, one part of the figure appears with each mistake (the figure swings
   on its rope), a lost word shows the whole figure with crossed eyes, a won word cuts the rope and a little hero jumps for joy.
   Returns {el, set(mistakes), end(win)} */
function wgGallows(){
  const wrap = document.createElement("div"); wrap.className = "hm";
  wrap.innerHTML = `<svg class="hm-svg" viewBox="0 0 200 220" role="img">
    <path class="hm-ground" pathLength="1" d="M18 207H118"/>
    <g class="hm-wood">
      <path pathLength="1" d="M52 207V26"/><path pathLength="1" d="M52 26H134"/><path pathLength="1" d="M52 58L84 26"/>
    </g>
    <path class="hm-rope" pathLength="1" d="M134 26V54"/>
    <g class="hm-jolt"><g class="hm-fig">
      <circle class="hm-part" pathLength="1" cx="134" cy="72" r="18"/>
      <path class="hm-part" pathLength="1" d="M134 90V144"/>
      <path class="hm-part" pathLength="1" d="M134 104L110 130"/>
      <path class="hm-part" pathLength="1" d="M134 104L158 130"/>
      <path class="hm-part" pathLength="1" d="M134 144L112 180"/>
      <path class="hm-part" pathLength="1" d="M134 144L156 180"/>
      <g class="hm-face"><g class="hm-eyes"><circle cx="127" cy="68" r="2.4"/><circle cx="141" cy="68" r="2.4"/></g>
        <path class="hm-x" d="M123.5 64.5l7 7m0-7l-7 7M137.5 64.5l7 7m0-7l-7 7"/>
        <path class="hm-mouth" d="M126 78Q134 85 142 78"/></g>
    </g></g>
    <g class="hm-hero">
      <circle cx="170" cy="150" r="11"/><path d="M170 161V184M170 168L154 154M170 168L186 154M170 184L160 207M170 184L180 207"/>
      <path class="hm-smile" d="M165 152Q170 158 175 152"/>
      <path class="hm-spark s1" d="M150 128v10M145 133h10"/><path class="hm-spark s2" d="M192 132v8M188 136h8"/><path class="hm-spark s3" d="M176 120v6M173 123h6"/>
    </g>
  </svg>`;
  const parts = [...wrap.querySelectorAll(".hm-part")], face = wrap.querySelector(".hm-face"), mouth = wrap.querySelector(".hm-mouth"), jolt = wrap.querySelector(".hm-jolt");
  /* the mouth goes from a smile to a worried line to a frown */
  const MOUTH = ["M126 78Q134 85 142 78", "M126 78Q134 85 142 78", "M127 80H141", "M127 80H141", "M126 83Q134 76 142 83", "M126 83Q134 76 142 83"];
  let last = 0;
  return {el:wrap,
    set(n){
      parts.forEach((p,i)=>p.classList.toggle("on", i<n));
      face.classList.toggle("on", n>0); if(n>0) mouth.setAttribute("d", MOUTH[n-1]);
      if(n>last){ jolt.classList.remove("go"); void jolt.getBoundingClientRect(); jolt.classList.add("go"); }
      last = n;
    },
    end(win){ wrap.classList.add(win ? "win" : "lose"); if(!win){ parts.forEach(p=>p.classList.add("on")); face.classList.add("on"); } }};
}

/* ======================= HANGMAN ======================= */
function wgHangman(box){
  const words = wgWords(4, 9), TOTAL = Math.min(5, words.length), MAX = 6;
  if(words.length < 8){ box.innerHTML = `<p class="note">${esc(tx("Not enough words for this topic."))}</p>`; return; }
  const next = deck(words);
  let round = 0, score = 0;
  const play = ()=>{
    if(round>=TOTAL) return wgFinish(box, score, TOTAL, ()=>wgHangman(box));
    const w = next(); round++;
    let lives = MAX, done = false; const got = new Set();
    box.innerHTML = `<div class="wg-top"><span>${esc(tx("Word {n} of {t}", {n:round, t:TOTAL}))}</span><span class="wg-miss"></span></div>
      <div class="wg-stage"><div class="wg-fig"></div>
        <div class="wg-hint">${w.emoji ? `<span class="emoji" aria-hidden="true">${w.emoji}</span>` : ""}<b>${esc(wgMeaning(w))}</b></div></div>
      <div class="wg-slots" lang="el"></div><p class="wg-msg" aria-live="polite"></p>`;
    const slots = box.querySelector(".wg-slots"), miss = box.querySelector(".wg-miss"), msg = box.querySelector(".wg-msg");
    const fig = wgGallows(); box.querySelector(".wg-fig").appendChild(fig.el);
    const kb = wgKeyboard(guess); box.appendChild(kb.el);
    const act = document.createElement("div"); act.className = "wg-actions"; box.appendChild(act);
    const hintBtn = document.createElement("button"); hintBtn.type = "button"; hintBtn.className = "chip"; hintBtn.textContent = "💡 " + tx("Hint (costs a life)");
    act.appendChild(hintBtn);
    const paint = ()=>{
      slots.innerHTML = "";
      [...w.gr].forEach(ch=>{ const s = document.createElement("span"); s.className = "wg-slot"; s.textContent = (done || got.has(wgFold(ch))) ? ch.toUpperCase() : ""; slots.appendChild(s); });
      miss.textContent = tx("Mistakes: {n} of {t}", {n:MAX-lives, t:MAX}); fig.el.querySelector("svg").setAttribute("aria-label", tx("{n} lives left", {n:lives}));
      fig.set(MAX-lives);
      hintBtn.disabled = done || lives<=1;
    };
    function end(win){
      done = true; wgKey = null; paint();
      slots.classList.add(win ? "win" : "lose"); fig.end(win);
      if(win) score++;
      Progress.record(wgItem(w), win);
      msg.innerHTML = `${win ? "✅" : "❌"} <b lang="el">${esc(w.full)}</b> <i><span class="lt">${esc(w.lat)}</span></i> — ${esc(wgMeaning(w))}`;
      say(w.full);
      kb.el.querySelectorAll("button").forEach(b=>b.disabled = true);
      hintBtn.hidden = true;
      const n = document.createElement("button"); n.type = "button"; n.className = "btn"; n.textContent = tx(round>=TOTAL ? "See the result" : "Next word"); n.onclick = play; act.appendChild(n);
      n.focus({preventScroll:true});
    }
    function guess(L){
      if(done || L==="DEL") return;
      const hit = w.key.includes(L);
      kb.mark(L, hit ? "hit" : "miss");
      if(hit) got.add(L); else lives--;
      paint();
      if([...w.key].every(c=>got.has(c))) end(true); else if(lives<=0) end(false);
    }
    hintBtn.onclick = ()=>{ const left = [...new Set(w.key)].filter(c=>!got.has(c)); if(left.length>1 && lives>1){ const L = oneOf(left); lives--; kb.mark(L, "hit"); got.add(L); paint(); } };
    wgKey = guess; paint();
  };
  play();
}

/* ======================= WORD SEARCH ======================= */
const WG_FILL = "ΑΑΑΑΕΕΕΟΟΟΙΙΙΝΝΝΤΤΤΣΣΣΡΡΚΚΛΛΜΜΠΠΥΥΔΔΘΓΧΦΖΒΞΩΗ";
function wgMakeSearch(words, n){
  const dirs = [[0,1],[1,0],[1,1],[-1,1]];   /* right, down, down-right, up-right */
  const grid = Array.from({length:n}, ()=>Array(n).fill("")), placed = [];
  for(const w of words){
    for(let t=0; t<150; t++){
      const [dr,dc] = oneOf(dirs), len = w.key.length;
      const r0 = Math.floor(Math.random()*n), c0 = Math.floor(Math.random()*n), r1 = r0+dr*(len-1), c1 = c0+dc*(len-1);
      if(r1<0 || r1>=n || c1<0 || c1>=n) continue;
      const cells = [...w.key].map((L,i)=>[r0+dr*i, c0+dc*i]);
      if(!cells.every(([r,c],i)=>grid[r][c]==="" || grid[r][c]===w.key[i])) continue;
      cells.forEach(([r,c],i)=>grid[r][c] = w.key[i]);
      placed.push({w, cells}); break;
    }
  }
  for(let r=0; r<n; r++) for(let c=0; c<n; c++) if(grid[r][c]==="") grid[r][c] = oneOf([...WG_FILL]);
  return {grid, placed};
}
function wgSearch(box){
  const n = 8, pool = wgWords(3, n);
  if(pool.length < 12){ box.innerHTML = `<p class="note">${esc(tx("Not enough words for this topic."))}</p>`; return; }
  let made;
  for(let t=0; t<8; t++){ made = wgMakeSearch(sample(pool, 6), n); if(made.placed.length>=5) break; }
  const {grid, placed} = made, found = new Set();
  box.innerHTML = "";
  const top = document.createElement("div"); top.className = "wg-top";
  const count = document.createElement("span"); top.appendChild(count);
  const mode = document.createElement("button"); mode.type = "button"; mode.className = "chip"; top.appendChild(mode);
  box.appendChild(top);
  const board = document.createElement("div"); board.className = "wgs"; board.lang = "el"; board.style.setProperty("--n", n); board.style.setProperty("--w", n*46 + "px"); box.appendChild(board);
  const list = document.createElement("div"); list.className = "wg-words"; box.appendChild(list);
  const msg = document.createElement("p"); msg.className = "wg-msg"; msg.setAttribute("aria-live","polite"); box.appendChild(msg);
  const cell = {};
  grid.forEach((row,r)=>row.forEach((L,c)=>{
    const b = document.createElement("span"); b.className = "wgc"; b.textContent = L; b.dataset.r = r; b.dataset.c = c; cell[r+","+c] = b; board.appendChild(b);
  }));
  const rows = placed.map((p,i)=>{
    const d = document.createElement("div"); d.className = "wg-word"; list.appendChild(d); return d;
  });
  const paintList = ()=>{
    count.textContent = tx("Words found: {n} of {t}", {n:found.size, t:placed.length});
    mode.textContent = tx(wgHard ? "Meanings only" : "Show the Greek words"); mode.setAttribute("aria-pressed", wgHard);
    placed.forEach((p,i)=>{
      const ok = found.has(i);
      rows[i].className = "wg-word" + (ok ? " ok" : "");
      rows[i].innerHTML = `${p.w.emoji ? `<span class="emoji" aria-hidden="true">${p.w.emoji}</span>` : ""}<span>${esc(wgMeaning(p.w))}</span>` +
        (ok || !wgHard ? ` <b lang="el">${esc(ok ? p.w.full : p.w.gr)}</b>` : "");
    });
  };
  mode.onclick = ()=>{ wgHard = !wgHard; paintList(); };
  let start = null, down = null;
  const clearSel = ()=>{ board.querySelectorAll(".wgc.sel").forEach(x=>x.classList.remove("sel")); start = null; };
  function line(a, b){
    const dr = b.r - a.r, dc = b.c - a.c, len = Math.max(Math.abs(dr), Math.abs(dc));
    if(len===0 || !(dr===0 || dc===0 || Math.abs(dr)===Math.abs(dc))) return null;
    return Array.from({length:len+1}, (_,i)=>[a.r + Math.sign(dr)*i, a.c + Math.sign(dc)*i]);
  }
  function check(a, b){
    const cells = line(a, b); clearSel(); if(!cells) return;
    const s = cells.map(([r,c])=>grid[r][c]).join(""), rev = [...s].reverse().join("");
    const i = placed.findIndex((p,k)=>!found.has(k) && (p.w.key===s || p.w.key===rev));
    if(i<0){
      cells.forEach(([r,c])=>{ const x = cell[r+","+c]; x.classList.add("bad"); setTimeout(()=>x.classList.remove("bad"), 450); });
      return;
    }
    found.add(i);
    cells.forEach(([r,c])=>{ const x = cell[r+","+c]; x.classList.add("found"); x.style.setProperty("--h", (i*57)%360); });
    Progress.record(wgItem(placed[i].w), true);
    say(placed[i].w.full); paintList();
    if(found.size===placed.length){
      msg.textContent = "🎉 " + tx("All words found!");
      const b = document.createElement("button"); b.type = "button"; b.className = "btn"; b.textContent = tx("New game"); b.onclick = ()=>wgSearch(box);
      const wrap = document.createElement("div"); wrap.className = "wg-actions"; wrap.appendChild(b); box.appendChild(wrap);
    }
  }
  const at = el => { const c = el && el.closest && el.closest(".wgc"); return c ? {r:+c.dataset.r, c:+c.dataset.c} : null; };
  board.addEventListener("pointerdown", e=>{ down = at(e.target); });
  board.addEventListener("pointerup", e=>{
    const a = down, b = at(document.elementFromPoint(e.clientX, e.clientY)); down = null;
    if(!a || !b) return;
    if(a.r!==b.r || a.c!==b.c){ check(a, b); return; }              /* slid from one letter to another */
    if(start && (start.r!==a.r || start.c!==a.c)){ check(start, a); return; }   /* second tap */
    clearSel(); start = a; cell[a.r+","+a.c].classList.add("sel");   /* first tap (a tap on the same letter cancels) */
  });
  wgKey = null; paintList();
}

/* ======================= CROSSWORD ======================= */
function wgMakeCross(words){
  const MAXD = 12;
  const grid = new Map(), placed = [];
  const get = (r,c)=>grid.get(r+","+c);
  const can = (key, r, c, h, first)=>{
    const dr = h?0:1, dc = h?1:0, len = key.length; let cross = 0;
    if(get(r-dr, c-dc) || get(r+dr*len, c+dc*len)) return -1;
    for(let k=0; k<len; k++){
      const rr = r+dr*k, cc = c+dc*k, cur = get(rr,cc);
      if(cur){ if(cur.ch!==key[k] || (h ? cur.h : cur.v)) return -1; cross++; }
      else if(h ? (get(rr-1,cc) || get(rr+1,cc)) : (get(rr,cc-1) || get(rr,cc+1))) return -1;
    }
    return first || cross>0 ? cross : -1;
  };
  const put = (w, r, c, h)=>{
    for(let k=0; k<w.key.length; k++){
      const rr = r+(h?0:k), cc = c+(h?k:0), cur = get(rr,cc) || {ch:w.key[k], h:false, v:false};
      if(h) cur.h = true; else cur.v = true; grid.set(rr+","+cc, cur);
    }
    placed.push({w, r, c, h});
  };
  const sorted = [...words].sort((a,b)=>b.key.length-a.key.length);
  put(sorted[0], 0, 0, true);
  for(const w of sorted.slice(1)){
    const opts = [];
    placed.forEach(p=>{
      for(let i=0; i<p.w.key.length; i++){
        const pr = p.r+(p.h?0:i), pc = p.c+(p.h?i:0);
        for(let k=0; k<w.key.length; k++) if(w.key[k]===p.w.key[i]){
          const h = !p.h, r = pr-(h?0:k), c = pc-(h?k:0), x = can(w.key, r, c, h, false);
          if(x>0) opts.push({r, c, h, x});
        }
      }
    });
    shuffle(opts);
    for(const o of opts){
      const rs = [...grid.keys()].map(k=>+k.split(",")[0]), cs = [...grid.keys()].map(k=>+k.split(",")[1]);
      const r0 = Math.min(...rs, o.r), r1 = Math.max(...rs, o.r+(o.h?0:w.key.length-1)), c0 = Math.min(...cs, o.c), c1 = Math.max(...cs, o.c+(o.h?w.key.length-1:0));
      if(r1-r0<MAXD && c1-c0<MAXD){ put(w, o.r, o.c, o.h); break; }
    }
  }
  /* move to (0,0) and number the starts */
  const rs = [...grid.keys()].map(k=>+k.split(",")[0]), cs = [...grid.keys()].map(k=>+k.split(",")[1]);
  const r0 = Math.min(...rs), c0 = Math.min(...cs), R = Math.max(...rs)-r0+1, C = Math.max(...cs)-c0+1;
  placed.forEach(p=>{ p.r -= r0; p.c -= c0; });
  const cells = Array.from({length:R}, ()=>Array(C).fill(null));
  grid.forEach((v,k)=>{ const [r,c] = k.split(",").map(Number); cells[r-r0][c-c0] = v.ch; });
  let num = 0; const nums = {};
  for(let r=0; r<R; r++) for(let c=0; c<C; c++){
    const here = placed.filter(p=>p.r===r && p.c===c);
    if(here.length){ nums[r+","+c] = ++num; here.forEach(p=>p.n = num); }
  }
  return {R, C, cells, placed, nums};
}
function wgCross(box){
  const pool = wgWords(3, 8);
  if(pool.length < 14){ box.innerHTML = `<p class="note">${esc(tx("Not enough words for this topic."))}</p>`; return; }
  let best = null;
  for(let t=0; t<25; t++){
    const g = wgMakeCross(sample(pool, 14));
    if(!best || g.placed.length>best.placed.length) best = g;
    if(g.placed.length>=8) break;
  }
  const {R, C, cells, placed, nums} = best, sol = cells;
  const ans = Array.from({length:R}, ()=>Array(C).fill(""));
  const missed = new Set(), helped = new Set();
  let sel = null;    /* {r, c, h}: the chosen cell and the direction of the word */
  box.innerHTML = "";
  const top = document.createElement("div"); top.className = "wg-top"; box.appendChild(top);
  const board = document.createElement("div"); board.className = "wgx"; board.lang = "el"; board.style.setProperty("--cols", C); board.style.setProperty("--w", C*42 + "px"); box.appendChild(board);
  const el = {};
  for(let r=0; r<R; r++) for(let c=0; c<C; c++){
    if(sol[r][c]===null){ const s = document.createElement("span"); s.className = "wgx-blank"; board.appendChild(s); continue; }
    const b = document.createElement("button"); b.type = "button"; b.className = "wgx-cell"; b.dataset.r = r; b.dataset.c = c;
    b.innerHTML = (nums[r+","+c] ? `<small>${nums[r+","+c]}</small>` : "") + `<span></span>`;
    b.onclick = ()=>pickCell(r, c); el[r+","+c] = b; board.appendChild(b);
  }
  const wordAt = (r,c,h) => placed.find(p=>p.h===h && (h ? p.r===r && c>=p.c && c<p.c+p.w.key.length : p.c===c && r>=p.r && r<p.r+p.w.key.length));
  const cellsOf = p => Array.from({length:p.w.key.length}, (_,i)=>[p.r+(p.h?0:i), p.c+(p.h?i:0)]);
  const msg = document.createElement("p"); msg.className = "wg-msg"; msg.setAttribute("aria-live","polite");
  const kb = wgKeyboard(type, ()=>type("DEL"));
  const act = document.createElement("div"); act.className = "wg-actions";
  const mk = (txt, fn)=>{ const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = txt; b.onclick = fn; act.appendChild(b); return b; };
  mk("✔ " + tx("Check"), ()=>check());
  mk("💡 " + tx("Reveal a letter"), ()=>reveal(false));
  mk("👁 " + tx("Reveal the word"), ()=>reveal(true));
  const clues = document.createElement("div"); clues.className = "wg-clues";
  box.append(msg, kb.el, act, clues);
  [[true,"Across"],[false,"Down"]].forEach(([h,name])=>{
    const col = document.createElement("div"); col.innerHTML = `<h3>${esc(tx(name))} ${h ? "→" : "↓"}</h3>`;
    placed.filter(p=>p.h===h).sort((a,b)=>a.n-b.n).forEach(p=>{
      const b = document.createElement("button"); b.type = "button"; b.className = "wg-clue"; b.dataset.n = p.n + (h ? "h" : "v");
      b.innerHTML = `<b>${p.n}</b> ${p.w.emoji ? `<span class="emoji" aria-hidden="true">${p.w.emoji}</span> ` : ""}${esc(wgMeaning(p.w))} <small>(${p.w.key.length})</small>`;
      b.onclick = ()=>{ const [r,c] = cellsOf(p).find(([r,c])=>!ans[r][c]) || cellsOf(p)[0]; sel = {r, c, h}; paint(); };
      col.appendChild(b);
    });
    clues.appendChild(col);
  });
  function pickCell(r, c){
    const hasH = !!wordAt(r,c,true), hasV = !!wordAt(r,c,false);
    let h;
    if(sel && sel.r===r && sel.c===c && hasH && hasV) h = !sel.h;      /* a second tap on a crossing turns the word */
    else if(sel && wordAt(r,c,sel.h)) h = sel.h;
    else h = hasH;
    sel = {r, c, h}; paint();
  }
  function paint(){
    const cur = sel && wordAt(sel.r, sel.c, sel.h), inCur = new Set(cur ? cellsOf(cur).map(x=>x.join(",")) : []);
    for(let r=0; r<R; r++) for(let c=0; c<C; c++){
      const b = el[r+","+c]; if(!b) continue;
      b.lastChild.textContent = ans[r][c];
      b.classList.toggle("on", inCur.has(r+","+c)); b.classList.toggle("sel", !!sel && sel.r===r && sel.c===c);
    }
    clues.querySelectorAll(".wg-clue").forEach(b=>b.classList.toggle("on", !!cur && b.dataset.n===cur.n+(cur.h?"h":"v")));
    const done = placed.filter(p=>cellsOf(p).every(([r,c])=>ans[r][c]===sol[r][c])).length;
    top.textContent = tx("Words found: {n} of {t}", {n:done, t:placed.length});
  }
  function type(L){
    if(!sel) return;
    const cur = wordAt(sel.r, sel.c, sel.h), cs = cellsOf(cur), i = cs.findIndex(([r,c])=>r===sel.r && c===sel.c);
    el[sel.r+","+sel.c].classList.remove("bad");
    if(L==="DEL"){
      if(ans[sel.r][sel.c]) ans[sel.r][sel.c] = "";
      else if(i>0){ const [r,c] = cs[i-1]; sel = {...sel, r, c}; ans[r][c] = ""; }
    } else {
      ans[sel.r][sel.c] = L;
      if(i<cs.length-1){ const [r,c] = cs[i+1]; sel = {...sel, r, c}; }
    }
    paint(); finishIfDone();
  }
  function check(){
    let wrong = 0;
    for(let r=0; r<R; r++) for(let c=0; c<C; c++) if(el[r+","+c] && ans[r][c] && ans[r][c]!==sol[r][c]){ el[r+","+c].classList.add("bad"); wrong++; }
    msg.textContent = wrong ? tx("Some letters are wrong.") : tx("No wrong letter so far.");
  }
  function reveal(whole){
    if(!sel) { msg.textContent = tx("Tap a square first."); return; }
    const cur = wordAt(sel.r, sel.c, sel.h);
    if(whole){ cellsOf(cur).forEach(([r,c])=>{ ans[r][c] = sol[r][c]; }); helped.add(cur); }
    else { ans[sel.r][sel.c] = sol[sel.r][sel.c]; helped.add(cur); }
    paint(); finishIfDone();
  }
  function finishIfDone(){
    if(!placed.every(p=>cellsOf(p).every(([r,c])=>ans[r][c]===sol[r][c]))) return;
    wgKey = null; kb.el.hidden = true; act.hidden = true;
    const ok = placed.filter(p=>!helped.has(p)).length;
    placed.forEach(p=>Progress.record(wgItem(p.w), !helped.has(p)));
    const card = document.createElement("div"); card.innerHTML = scoreCard(ok, placed.length, esc(tx("Crossword complete!")), esc(tx("{n} of {t} words without help.", {n:ok, t:placed.length})));
    box.insertBefore(card, board); celebrate(card, ok, placed.length);
    const list = document.createElement("div"); list.className = "wg-words";
    placed.forEach(p=>{
      const b = document.createElement("button"); b.type = "button"; b.className = "wg-word ok"; b.innerHTML = `<b lang="el">${esc(p.w.full)}</b> <span>${esc(wgMeaning(p.w))}</span> 🔊`;
      b.onclick = ()=>say(p.w.full); list.appendChild(b);
    });
    box.insertBefore(list, msg); msg.textContent = "";
    const n = document.createElement("button"); n.type = "button"; n.className = "btn"; n.textContent = tx("New game"); n.onclick = ()=>wgCross(box);
    const wrap = document.createElement("div"); wrap.className = "wg-actions"; wrap.appendChild(n); box.appendChild(wrap);
    card.scrollIntoView({behavior:"smooth", block:"start"});
  }
  /* start on the first word */
  sel = {r:placed[0].r, c:placed[0].c, h:placed[0].h};
  wgKey = type; paint();
}

/* ======================= the page ======================= */
function startWordGames(){
  stopSound(); wgKey = null;
  $("wgModes").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.game===wgGame));
  $("wgTopics").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.topic===wgTopic));
  $("wgInfo").textContent = tx(WG_GAMES.find(g=>g.id===wgGame).info);
  const box = $("wgBox"); box.innerHTML = "";
  (wgGame==="hangman" ? wgHangman : wgGame==="search" ? wgSearch : wgGame==="sentences" ? wgSentences : wgCross)(box);
  $("wgTopics").hidden = wgGame==="sentences";                            /* the sentences have levels, not topics */
}
function openWordGames(){
  const modes = $("wgModes");
  if(!modes.children.length){
    WG_GAMES.forEach(g=>{
      const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.dataset.game = g.id; b.dataset.mode = "wg-"+g.id; b.textContent = tx(g.name);
      b.onclick = ()=>{ wgGame = g.id; startWordGames(); }; modes.appendChild(b);
    });
    WG_TOPICS.forEach(([id,name])=>{
      if(wgWords(3, 8, id).length < 14) return;
      const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.dataset.topic = id; b.textContent = tx(name);
      b.onclick = ()=>{ wgTopic = id; startWordGames(); }; $("wgTopics").appendChild(b);
    });
  }
  startWordGames();
}

/* ======================= sentences: build a sentence from every line of the app ======================= */
/* all the sentences with their meaning and level: phrases, dialogues, conversations, texts, recipes, customs, genitive examples */
let wgSentencePool = null;
function wgSentenceList(){
  if(wgSentencePool) return wgSentencePool;
  const out = [], seen = new Set();
  const add = (gr, en, fr, lvl) => {
    if(!gr || !en) return;
    const clean = gr.replace(/\s+/g," ").trim(), n = clean.split(" ").length;
    if(n<3 || n>9 || seen.has(clean.toLowerCase())) return;
    seen.add(clean.toLowerCase()); out.push({gr:clean, en, fr:fr || "", lvl:lvl || "A2", n});
  };
  PHRASES.groups.forEach(g=>g.phrases.forEach(p=>add(p.gr, p.en, p.fr, "A1")));
  DIALOGUES.dialogues.forEach(d=>d.lines.forEach(l=>add(l.gr, l.en, l.fr, "A2")));
  TALK.scenarios.forEach(s=>s.turns.forEach(t=>[t.bot, ...(t.good||[])].forEach(l=>add(l.gr, l.en, l.fr, s.level))));
  [TEXTS, RECIPES, (typeof READINGS!=="undefined" ? READINGS : {texts:[]})].forEach(src=>(src.texts||[]).forEach(x=>{
    if(["poem","prayer","song"].includes(x.kind)) return;
    (x.lines||[]).forEach(l=>add(l.gr, l.en, l.fr, x.level));
  }));
  CUSTOMS.cards.forEach(c=>c.phrases.forEach(p=>add(p.gr, p.en, p.fr, "A2")));
  GRAMMAR4.genitive.forEach(e=>add(e.sentence, e.sentEn, e.sentFr, "B1"));
  out.forEach(s=>{ if(!CEFR_LEVELS.includes(s.lvl)) s.lvl = "A2"; });
  return (wgSentencePool = out);
}
let wgSentLevel = "all";
function wgSentences(box){
  const all = wgSentenceList();
  const bar = document.createElement("div"); bar.className = "row"; bar.id = "wgLevelRow"; bar.setAttribute("role","group"); box.appendChild(bar);
  [["all","All levels"], ...CEFR_LEVELS.map(l=>[l,l])].forEach(([id,name])=>{
    const n = id==="all" ? all.length : all.filter(s=>s.lvl===id).length;
    if(!n) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.dataset.mode = "wg-lvl-"+id; b.setAttribute("aria-pressed", id===wgSentLevel);
    b.textContent = `${tx(name)} (${n})`; b.onclick = ()=>{ wgSentLevel = id; startWordGames(); }; bar.appendChild(b);
  });
  const pool = all.filter(s=>wgSentLevel==="all" || s.lvl===wgSentLevel);
  const game = document.createElement("div"); box.appendChild(game);
  if(pool.length < 6){ game.innerHTML = `<p class="note">${esc(tx("Not enough words for this topic."))}</p>`; return; }
  const next = deck(pool);
  runQuiz(game, {id:"wg-sentences", total:Math.min(10, pool.length), make:()=>{
    const s = next();
    return {item:{key:"sb:"+sid(s.gr), gr:s.gr, en:s.en, fr:s.fr, snd:sid(s.gr), cat:"Sentences"},
      prompt:`<p class="vinfo">${esc(tx("Build the sentence"))}</p><p class="word s">${esc(LANG==="fr" && s.fr ? s.fr : s.en)}</p>`,
      build:{answer:s.gr}, hint:`${esc(tx("Starts with"))} <b lang="el">${esc(s.gr.split(" ")[0])}</b>`,
      reveal:`<b lang="el">${esc(s.gr)}</b>`, sayAfter:s.gr};
  }});
}
