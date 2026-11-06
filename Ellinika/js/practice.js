/* ---------- practice ---------- */
const ALLW = DATA.levels.flatMap(L=>L.words);
const MIX = {id:"mix", name:"🔀 Mix all", words:ALLW};
const FOCUS_PAIRS = ["μπ","ντ","γκ","γγ","τσ","τζ","ου","αι","ει","οι","αυ","ευ"];
let focusPair = "μπ";
const FOCUS = {id:"focus", name:"🎯 One pair", get words(){ return ALLW.filter(w => tokenize(w.gr).some(t => t.g===focusPair)); }};
const CATS = [...DATA.levels, FOCUS, MIX];
/* the level filter (CEFR): "all", or A1, A2, B1, B2. Every word has a "lvl" in data/greek-data.js */
let cefr = "all";
const lvlWords = L => cefr==="all" ? L.words : L.words.filter(w=>w.lvl===cefr);
function lvlData(){ return CATS[lvl]; }
function renderFocus(){
  const row=$("focusRow"); row.hidden = lvlData().id!=="focus"; if(row.hidden) return;
  row.innerHTML="";
  FOCUS_PAIRS.forEach(p=>{
    const b=document.createElement("button"); b.className="chip"; b.type="button"; b.lang="el";
    b.setAttribute("aria-pressed", p===focusPair);
    const n=ALLW.filter(w=>(cefr==="all"||w.lvl===cefr) && tokenize(w.gr).some(t=>t.g===p)).length;
    b.textContent=`${p} (${n})`;
    b.onclick=()=>{ focusPair=p; queue=[]; renderLevels(); next(); };
    row.appendChild(b);
  });
}
let lvl = 0, queue = [], cur = null, score = 0, streak = 0, answered = false, usedHint = false;
function renderLevels(){
  const box=$("levels"); box.innerHTML="";
  CATS.forEach((L,i)=>{
    const b=document.createElement("button");
    b.className="chip"; b.type="button"; b.setAttribute("aria-pressed", i===lvl);
    const ws = lvlWords(L), all = L.letters && ws.length && ws.every(w=>mastered[w.gr]);
    b.disabled = !ws.length;
    b.innerHTML = `${tx(L.name)} <span style="opacity:.6;font-weight:400">${ws.length}</span>${all?'<span class="done">✓</span>':''}`;
    b.onclick=()=>{ lvl=i; queue=[]; renderLevels(); next(); };
    box.appendChild(b);
  });
  const L=lvlData();
  $("levelinfo").innerHTML = L.id==="mix" ? esc(tx("20 random words from every category")) : L.id==="focus" ? tx("Words with {x}, from every category",{x:`<span lang="el">${focusPair}</span>`}) : tx("Focus: {x}",{x:`<span lang="el">${L.letters}</span>`});
  renderFocus(); renderCefr();
  const ws = lvlWords(L), n = ws.filter(w=>mastered[w.gr]).length;
  $("progbar").style.width = (ws.length ? 100*n/ws.length : 0)+"%";
}
/* the row of levels: All, A1, A2, B1, B2, with the number of words of each */
/* used by the progress page: practice the words of one level (all categories mixed) */
function practiceLevel(l){
  cefr = l; queue = []; lvl = CATS.findIndex(L=>L.id==="mix");
  document.querySelector('[data-tab="practice"]').click();
  renderLevels(); next();
}
function renderCefr(){
  const row=$("cefrRow"); row.innerHTML="";
  [["all",tx("All levels")],...CEFR_LEVELS.map(l=>[l,l])].forEach(([id,name])=>{
    const n = id==="all" ? ALLW.length : ALLW.filter(w=>w.lvl===id).length;
    const b=document.createElement("button"); b.className="chip"; b.type="button"; b.dataset.cefr=id;
    b.setAttribute("aria-pressed", id===cefr);
    b.innerHTML = `${esc(name)}<span class="n">${n}</span>`;
    b.onclick=()=>{
      cefr=id; queue=[];
      if(!lvlWords(lvlData()).length){ lvl = CATS.findIndex(L=>lvlWords(L).length>0); }
      renderLevels(); next();
    };
    row.appendChild(b);
  });
}
function next(){
  const L=lvlData();
  if(!queue.length){
    const ws = lvlWords(L), fresh=ws.filter(w=>!mastered[w.gr]), known=ws.filter(w=>mastered[w.gr]);
    queue = L.id==="mix" ? shuffle([...ws]).slice(0,20) : shuffle(fresh).concat(shuffle(known).slice(0,3));
    if(!queue.length) queue=shuffle([...ws]);
  }
  cur=queue.shift(); answered=false; usedHint=false;
  $("word").textContent=cur.gr;
  const inp=$("input"); inp.value=""; inp.className=""; inp.disabled=false;
  $("feedback").textContent=""; $("feedback").className="feedback";
  $("answer").innerHTML=""; $("breakdown").innerHTML="";
  $("check").textContent=tx("Check"); $("hint").disabled=false;
  try{ inp.focus({preventScroll:true}); }catch(e){}
}
function check(){
  if(answered){ next(); return; }
  const v=cleanInput($("input").value);
  if(!v){ $("feedback").textContent=tx("Type the word in Latin letters first"); $("feedback").className="feedback bad"; return; }
  const ok=matcher(cur.gr).test(v);
  answered=true;
  Progress.record({key:`l:${cur.gr}`, gr:cur.gr, en:cur.en, lat:cur.lat, snd:cur.a, cat:"Greek letters"}, ok);
  $("input").className= ok?"ok":"no"; $("input").disabled=true;
  if(ok){
    score++; streak++;
    if(!usedHint){ mastered[cur.gr]=true; save(); }
    $("feedback").textContent = streak>=3 ? `Μπράβο! ${tx("{n} in a row",{n:streak})}` : "Σωστά! "+tx("Correct");
    $("feedback").className="feedback good";
  } else {
    streak=0; delete mastered[cur.gr]; save();
    queue.splice(Math.min(2,queue.length),0,cur); // see it again soon
    $("feedback").textContent=tx("Not quite");
    $("feedback").className="feedback bad";
  }
  $("score").textContent=score; $("streak").textContent=streak;
  $("answer").innerHTML=`<b>${cur.lat}</b> ${esc(tx("means “{x}”",{x:txm(cur.en)}))}`;
  renderBreakdown(cur.gr);
  $("answer").appendChild(favButton({gr:cur.gr, lat:cur.lat, en:cur.en, snd:cur.a, cat:"Greek letters"}, "inline"));
  $("check").textContent=tx("Next"); $("hint").disabled=true;
  play(cur.a);
  renderLevels();
}
$("check").onclick=check;
$("input").addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); check(); }});
$("hint").onclick=()=>{ usedHint=true; renderBreakdown(cur.gr); $("feedback").textContent=tx("Use the letters to write it (no point for mastering this time)"); $("feedback").className="feedback"; };
$("hear").onclick=()=>cur&&play(cur.a);
