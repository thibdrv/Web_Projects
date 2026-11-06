/* ---------- level test (A1 → B2), in Greek only ----------
   40 questions in 4 steps of 10: A1, A2, B1, B2. The questions and the answers are in Greek, with Greek letters only (no Latin
   transliteration, no meaning before you answer). A short instruction in Greek comes with its translation in small letters.
   The meaning is shown only AFTER the answer. The test is strict, like the European framework (CEFR):
   you reach a level only if you get at least 7 of 10 right in its step AND in every step before it. */
const TEST_TIERS = 4, TEST_PER_TIER = 10, TEST_PASS = 7;
/* "cefr" is the European level shown to the learner: an estimate of what the app tests */
const TEST_LEVELS = [
  {cefr:"A0", name:"Just starting",      text:"You are at the very beginning, a good place to be. Start with the Greek letters and the first words."},
  {cefr:"A1", name:"Beginner",           text:"You understand very simple words and phrases. Keep going with everyday words, numbers and short conversations."},
  {cefr:"A2", name:"Elementary",         text:"You can handle simple everyday situations and short texts. Now work on the past, the future and longer texts."},
  {cefr:"B1", name:"Intermediate",       text:"You follow the main points of clear texts and conversations. Work on connecting words, tricky verbs and richer vocabulary."},
  {cefr:"B2", name:"Upper intermediate", text:"You handle complex texts and fine points of grammar. You have used up what this app tests. Congratulations!"}
];
const TEST_SKILLS = {
  reading:      {name:"Reading",      go:"stories"},
  vocabulary:   {name:"Vocabulary",   go:"opposites"},
  grammar:      {name:"Grammar",      go:"grammar"},
  listening:    {name:"Listening",    go:"dialogues"},
  writing:      {name:"Writing",      go:"letters"},
  conversation: {name:"Conversation", go:"talk"}
};
/* the instruction of each kind of question: Greek, then its translation in small letters */
const T_INSTR = {
  picture:["Τι είναι αυτό;","What is this?"], hear:["Τι ακούτε;","What do you hear?"], article:["Ποιο άρθρο;","Which article?"],
  number:["Ποιος αριθμός είναι;","Which number is it?"], choose:["Διαλέξτε την απάντηση.","Choose the answer."],
  gap:["Συμπληρώστε τη λέξη.","Fill in the missing word."], read:["Διαβάστε και απαντήστε.","Read and answer."],
  opposite:["Ποιο είναι το αντίθετο;","What is the opposite?"], dictation:["Γράψτε αυτό που ακούτε.","Write what you hear."],
  sentence:["Ποια πρόταση ακούσατε;","Which sentence did you hear?"]
};
const instr = k => `<p class="tw"><span class="pill" lang="el">${esc(T_INSTR[k][0])}</span> <span class="muted">${esc(tx(T_INSTR[k][1]))}</span></p>`;
const greekBig = t => `<p class="word s" lang="el">${esc(t)}</p>`;
const meaningLine = o => esc(pick(o));

/* ----- the material ----- */
const VOC = [...FAMILY.groups, ...FOOD.groups].flatMap(g=>g.words.map(w=>{
  const [art,...rest] = w.gr.split(" ");
  return {...w, art, noun:rest.join(" ")};
}));
const EASY_EN = ["dog","cat","fish","bird","horse","pig","cow","apple","banana","orange","bread","water","milk","coffee","tea","egg","cheese","mom","dad","baby"];
const VOC_EASY = VOC.filter(w=>EASY_EN.includes(w.en) && w.emoji);
const VOC_SING = VOC.filter(w=>["ο","η","το"].includes(w.art));
const LEXICON = DATA.levels.flatMap(L=>L.words).filter(w=>w.pos!=="phrase" && !/[\s']/.test(w.gr));
let testUsed = new Set();
const fresh = list => { const free = list.filter(x=>!testUsed.has(x)); const x = oneOf(free.length ? free : list); testUsed.add(x); return x; };
const wrongGreek = (right, pool, n=3) => sample(pool.filter(x=>x!==right), n);

/* ----- the kinds of questions (each returns a question for runQuiz) ----- */
function qPicture(){
  const w = fresh(VOC_EASY);
  return {prompt:`${instr("picture")}<span class="emoji" aria-hidden="true">${w.emoji}</span>`,
          options:greekOptions(w.gr, wrongGreek(w, VOC_EASY).map(x=>x.gr)),
          reveal:`<b lang="el">${esc(w.gr)}</b><br>${esc(txm(w.en))}`, sayAfter:w.gr};
}
function qHearWord(){
  const pool = LEXICON.filter(w=>w.lvl==="A1" && w.gr.length>=4 && w.gr.length<=8), w = fresh(pool);
  const near = pool.filter(x=>x!==w && Math.abs(x.gr.length-w.gr.length)<=1);
  return {prompt:`${instr("hear")}<p class="word s">🔊</p>`, say:{id:w.a}, autoplay:true,
          options:greekOptions(w.gr, sample(near.length>=3 ? near : pool.filter(x=>x!==w), 3).map(x=>x.gr)),
          reveal:`<b lang="el">${esc(w.gr)}</b><br>${esc(txm(w.en))}`};
}
function qArticle(){
  const w = fresh(VOC_SING);
  return {cols:3, prompt:`${instr("article")}<p class="word" lang="el">${esc(w.noun)}</p>`,
          options:["ο","η","το"].map(a=>({html:`<span lang="el">${a}</span>`, ok:a===w.art})),
          reveal:`<b lang="el">${esc(w.gr)}</b><br>${esc(txm(w.en))}`, sayAfter:w.gr};
}
function qNumber(range){
  const pool = NUM_POOLS[range], n = oneOf(pool);
  return {prompt:`${instr("number")}${greekBig(numGr(n))}`, say:numParts(n), options:numChoices(n, pool, digitOpt),
          reveal:`<b lang="el">${esc(numGr(n))}</b> = ${n}`};
}
/* the partner of a conversation says something; you choose the reply. hidden: you only hear it (no text) */
function qReply(levels, hidden){
  const turns = TALK.scenarios.filter(s=>levels.includes(s.level)).flatMap(s=>s.turns.filter(t=>t.good).map(t=>({s,t})));
  const {t} = fresh(turns), good = oneOf(t.good);
  return {prompt:`${instr("choose")}${hidden ? `<p class="word s">🔊</p>` : greekBig(t.bot.gr)}`, say:t.bot.gr, autoplay:hidden,
          cols:1, options:greekOptions(good.gr, sample(t.bad, 2).map(b=>b.text)),
          reveal:`<span lang="el">${esc(t.bot.gr)}</span><br><span class="vinfo">${meaningLine(t.bot)}</span><br><b lang="el">${esc(good.gr)}</b><br><span class="vinfo">${meaningLine(good)}</span>`,
          sayAfter:good.gr};
}
function qGap(lvl){
  const g = fresh(LEVELQ.gaps.filter(x=>x.lvl===lvl)), full = g.s.replace("____", g.ok);
  return {prompt:`${instr("gap")}${greekBig(g.s)}`, options:greekOptions(g.ok, g.bad),
          reveal:`<b lang="el">${esc(full)}</b><br>${meaningLine(g)}`};
}
/* a verb form: "Χθες: εγώ ____ (γράφω)" */
function qVerb(tense){
  const pool = G.verbs.filter(v=>v.forms[tense] && v.id!=="eimai"), verb = fresh(pool), p = Math.floor(Math.random()*6);
  const right = verb.forms[tense][p], T = G.tenses[tense];
  return {prompt:`${instr("gap")}<p class="tw"><span class="pill" lang="el">${esc(T.time.gr)}</span></p>${greekBig(`${G.persons[p].gr} ____ (${verb.gr})`)}`,
          options:greekOptions(right, wrongForms(verb, tense, p, right)),
          reveal:`<b lang="el">${esc(G.persons[p].gr)} ${esc(right)}</b><br>${esc(tx(verb.en))} · ${esc(tx(T.name))}`, sayAfter:right};
}
function qGram3(topic){
  const it = fresh(G3[topic].items), answers = [...new Set(G3[topic].items.map(i=>i.answer))];
  return {prompt:`${instr("gap")}${greekBig(it.blank)}`, options:greekOptions(it.answer, sample(answers.filter(a=>a!==it.answer), 3)),
          reveal:`<b lang="el">${esc(it.say)}</b><br>${meaningLine(it)}`, sayAfter:it.say};
}
function qOpposite(){
  const pool = OPPOSITES.groups.filter(g=>["size","qualities"].includes(g.id)).flatMap(g=>g.words.filter(w=>w.opp)), w = fresh(pool);
  return {prompt:`${instr("opposite")}${greekBig(w.gr)}`, say:w.gr,
          options:greekOptions(w.opp, sample(pool.filter(x=>x.gr!==w.gr && x.gr!==w.opp), 3).map(x=>x.gr)),
          reveal:`<b lang="el">${esc(w.gr)} ↔ ${esc(w.opp)}</b><br>${esc(txm(w.en))}`, sayAfter:[w.gr, w.opp]};
}
function qPassage(lvl){
  const qs = LEVELQ.passages.filter(p=>p.lvl===lvl).flatMap(p=>p.qs.map((q,i)=>({p,q,key:p.id+i})));
  const {p,q} = fresh(qs);
  return {prompt:`${instr("read")}<p class="passage" lang="el">${esc(p.text)}</p>${greekBig(q.q)}`, cols:1, options:greekOptions(q.ok, q.bad),
          reveal:`<b lang="el">${esc(q.ok)}</b><br>${meaningLine(q)}`};
}
function qDef(lvl){
  const d = fresh(LEVELQ.defs.filter(x=>x.lvl===lvl));
  return {prompt:`${instr("choose")}${greekBig(d.q)}`, cols:d.ok.includes(" ") ? 1 : 2, options:greekOptions(d.ok, d.bad),
          reveal:`<b lang="el">${esc(d.ok)}</b><br>${meaningLine(d)}`};
}
/* you hear a Greek proverb; which one is it? */
function qHearSentence(){
  const lines = POEMS.poems.filter(p=>p.id.startsWith("proverbs")).flatMap(p=>p.lines), l = fresh(lines);
  return {prompt:`${instr("sentence")}<p class="word s">🔊</p>`, say:l.gr, autoplay:true, cols:1,
          options:greekOptions(l.gr, sample(lines.filter(x=>x!==l), 3).map(x=>x.gr)),
          reveal:`<b lang="el">${esc(l.gr)}</b><br>${meaningLine(l)}`};
}
function qDictation(lvl, min, max){
  let pool = LEXICON.filter(w=>w.lvl===lvl && w.gr.length>=min && w.gr.length<=max);
  if(pool.length<3) pool = LEXICON.filter(w=>w.lvl===lvl);
  const w = fresh(pool);
  return {prompt:`${instr("dictation")}<p class="word s">🔊</p>`, say:{id:w.a}, autoplay:true, write:{answers:[w.gr]},
          reveal:`<b lang="el">${esc(w.gr)}</b><br>${esc(txm(w.en))}`, sayAfter:w.gr};
}

const TEST = [
  /* A1 */
  [{skill:"vocabulary", make:qPicture}, {skill:"vocabulary", make:qPicture}, {skill:"listening", make:qHearWord}, {skill:"grammar", make:qArticle},
   {skill:"vocabulary", make:()=>qNumber("0-10")}, {skill:"conversation", make:()=>qReply(["A1"], false)}, {skill:"listening", make:()=>qReply(["A1"], true)},
   {skill:"grammar", make:()=>qGap("A1")}, {skill:"grammar", make:()=>qGap("A1")}, {skill:"writing", make:()=>qDictation("A1", 3, 7)}],
  /* A2 */
  [{skill:"grammar", make:()=>qVerb("present")}, {skill:"grammar", make:()=>qVerb("past")}, {skill:"grammar", make:()=>qGram3("prepositions")},
   {skill:"grammar", make:()=>qGram3("possessives")}, {skill:"vocabulary", make:qOpposite}, {skill:"conversation", make:()=>qReply(["A2"], false)},
   {skill:"listening", make:()=>qReply(["A2"], true)}, {skill:"grammar", make:()=>qGap("A2")}, {skill:"reading", make:()=>qPassage("A2")},
   {skill:"writing", make:()=>qDictation("A2", 5, 9)}],
  /* B1 */
  [{skill:"grammar", make:()=>qVerb("future")}, {skill:"grammar", make:()=>qGram3("imperative")}, {skill:"grammar", make:()=>qGap("B1")}, {skill:"grammar", make:()=>qGap("B1")},
   {skill:"reading", make:()=>qPassage("B1")}, {skill:"reading", make:()=>qPassage("B1")}, {skill:"vocabulary", make:()=>qDef("B1")},
   {skill:"conversation", make:()=>qReply(["B1"], false)}, {skill:"listening", make:()=>qReply(["B1"], true)}, {skill:"writing", make:()=>qDictation("B1", 7, 11)}],
  /* B2 */
  [{skill:"grammar", make:()=>qGap("B2")}, {skill:"grammar", make:()=>qGap("B2")}, {skill:"grammar", make:()=>qGap("B2")},
   {skill:"reading", make:()=>qPassage("B2")}, {skill:"reading", make:()=>qPassage("B2")}, {skill:"reading", make:()=>qPassage("B2")},
   {skill:"vocabulary", make:()=>qDef("B2")}, {skill:"vocabulary", make:()=>qDef("B2")}, {skill:"listening", make:qHearSentence},
   {skill:"writing", make:()=>qDictation("B2", 9, 16)}]
];

/* ----- the level: the highest step passed (7 of 10), every step before it passed too ----- */
function testLevel(answers){
  const right = Array(TEST_TIERS).fill(0);
  answers.forEach(a=>{ if(a.ok) right[a.tier]++; });
  let level = 0;
  for(let k=0; k<TEST_TIERS; k++){ if(right[k]>=TEST_PASS) level = k+1; else break; }
  return level;
}
function testSkills(answers){
  return Object.entries(TEST_SKILLS).map(([id,s])=>{
    const mine = answers.filter(a=>a.skill===id);
    return {id, name:tx(s.name), go:s.go, right:mine.filter(a=>a.ok).length, total:mine.length};
  }).filter(s=>s.total);
}
/* the last result; a result of the old test (without "v") is ignored */
function lastTest(){
  try{ const r = JSON.parse(localStorage.getItem("gl-level-test")); return r && r.v===2 && TEST_LEVELS[r.level] ? r : null; }catch(e){ return null; }
}

let testAnswers = [];
function showTestResult(box, score, total){
  const level = testLevel(testAnswers), L = TEST_LEVELS[level], skills = testSkills(testAnswers);
  try{ localStorage.setItem("gl-level-test", JSON.stringify({v:2, level, score, total, date:new Date().toISOString().slice(0,10)})); }catch(e){}
  const weak = skills.filter(s=>s.right/s.total<0.7).sort((a,b)=>a.right/a.total-b.right/b.total).slice(0,2);
  const steps = CEFR_LEVELS.map((l,k)=>{
    const r = testAnswers.filter(a=>a.tier===k && a.ok).length, pass = r>=TEST_PASS;
    return `<div class="skill"><span><span class="lvlb" data-l="${l}">${l}</span> ${pass ? "✓" : "✗"}</span><span>${r}/${TEST_PER_TIER}</span><i class="sbar"><b style="width:${10*r}%"></b></i></div>`;
  }).join("");
  box.innerHTML = `
    <div class="card"><p class="muted" style="margin:0">${esc(tx("Your level"))}</p><p class="word">${esc(L.cefr)}</p>
      <p class="feedback good">${esc(tx(L.name))}</p><p class="answer">${esc(tx(L.text))}</p>
      <p class="answer">${esc(tx("{n} right",{n:`${score}/${total}`}))}</p></div>
    <div class="panel"><h2 class="sub" style="margin-top:0">${esc(tx("By step"))}</h2>${steps}
      <p class="note" style="text-align:left">${esc(tx("To reach a level you need at least 7 right out of 10 in its step and in every step before it."))}</p></div>
    <div class="panel"><h2 class="sub" style="margin-top:0">${esc(tx("By skill"))}</h2>${skills.map(s=>{
      const pct = Math.round(100*s.right/s.total);
      return `<div class="skill"><span>${esc(s.name)}</span><span>${s.right}/${s.total}</span><i class="sbar"><b style="width:${pct}%"></b></i></div>`;
    }).join("")}</div>
    <h2 class="sub">${esc(tx("What to practice next"))}</h2>
    ${weak.length ? weak.map(s=>`<a class="btn ghost" href="#${s.go}">${esc(s.name)} · ${s.right}/${s.total}</a>`).join("")
                  : `<p class="note">${esc(tx("No weak spot. Try the Dictionary, or play the Mix modes and the hardest grammar levels."))}</p>`}
    <p class="note">${esc(tx("This level is an estimate and only measures what this app teaches. Take the test again in a few weeks to see your progress."))}</p>
    <div class="btns"><button class="btn ghost" type="button" data-q="menu">${esc(tx("Menu"))}</button><button class="btn" type="button" data-q="again">${esc(tx("Take the test again"))}</button></div>`;
  box.querySelector('[data-q="menu"]').onclick = ()=>{ location.hash = "home"; };
  box.querySelector('[data-q="again"]').onclick = startTest;
}

function startTest(){
  testAnswers = []; testUsed = new Set();
  $("testIntro").hidden = true; $("testGame").hidden = false;
  let i = 0;
  const make = ()=>{
    const tier = Math.floor(i/TEST_PER_TIER), g = TEST[tier][i%TEST_PER_TIER];
    i++;
    const q = g.make(); q.tier = tier; q.skill = g.skill;
    return q;
  };
  stopSound();
  runQuiz($("testGame"), {id:"leveltest", total:TEST_TIERS*TEST_PER_TIER, best:false, make,
    onAnswer:(q,ok)=>testAnswers.push({tier:q.tier, skill:q.skill, ok}), renderResult:showTestResult});
}
function openLevelTest(){
  stopSound();
  const last = lastTest();
  $("testGame").hidden = true; $("testGame").innerHTML = "";
  $("testIntro").hidden = false;
  $("testIntro").innerHTML = `
    <div class="panel">
      <p><b>${esc(tx("Find your level."))}</b> ${esc(tx("40 questions in Greek, from A1 to B2: reading, listening, grammar, vocabulary, writing and conversation. About 20 minutes."))}</p>
      <ul class="plain">
        <li>${esc(tx("Everything is in Greek letters, with no help: the meaning only appears after you answer."))}</li>
        <li>${esc(tx("You reach a level only with at least 7 right out of 10 in its step and in every step before it."))}</li>
        <li>${esc(tx("Turn the sound on: some questions are spoken, and you write some words with the Greek keyboard."))}</li>
        <li>${esc(tx("No time limit. Leave any time with the ← button."))}</li>
      </ul>
      ${last ? `<p class="muted">${esc(tx("Last result: level {n}",{n:TEST_LEVELS[last.level].cefr}))} · ${esc(tx(TEST_LEVELS[last.level].name))} (${last.score}/${last.total}, ${esc(last.date)})</p>` : ""}
      <button class="btn" type="button" id="testStart">${esc(tx(last ? "Take the test again" : "Start the test"))}</button>
    </div>`;
  $("testStart").onclick = startTest;
}
