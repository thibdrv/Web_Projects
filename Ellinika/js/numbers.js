/* ---------- numbers ---------- */
const NW = Object.fromEntries(NUMBERS.words.map(w=>[w.n,w]));
const NUM_MODES = [
  {id:"learn",  name:"Learn",        info:"Tap a number to hear it. Gender: 1, 3 and 4 also have other forms (ένας / μία, τρεις, τέσσερις); here we use the ones for counting."},
  {id:"d2w",    name:"Digit → Word", info:"You see a number. Tap its Greek word."},
  {id:"w2d",    name:"Word → Digit", info:"You see a Greek number. Tap the matching digits."},
  {id:"listen", name:"Listen",       info:"Listen, then tap the number you heard."},
  {id:"write",  name:"Write it",     info:"You see a number. Write its Greek word in Latin letters."},
  {id:"add",    name:"Add up",       info:"Read the sum in Greek and tap the answer."},
  {id:"price",  name:"Prices",       info:"You see a price in euros. Tap what you would say in Greek."},
  {id:"pricehear", name:"Hear the price", info:"Listen to the price, then tap the price tag you heard."},
  {id:"draw",   name:"Drawings",     info:"Counting cards from 0 to 11, and the tens as bars. Tap a card or a word to hear it."}
];
const NUM_RANGES = [["0-10","0–10"],["11-20","11–20"],["tens","Tens"],["21-99","21–99"],["hundreds","Hundreds"],["big","10 000+"],["all","Everything"]];
let numMode = "learn", numRange = "0-10";

/* big numbers are written with spaces: 10 000, 1 000 000 */
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, n>=10000 ? " " : "");
const span = (a,b,step=1) => { const out=[]; for(let i=a;i<=b;i+=step) out.push(i); return out; };
const NUM_POOLS = {"0-10":span(0,10), "11-20":span(11,20), tens:span(10,100,10), "21-99":span(21,99), hundreds:span(100,1000,100)};
NUM_POOLS.big = NUMBERS.words.filter(w=>w.n>=10000).map(w=>w.n);
NUM_POOLS.all = [...new Set([...span(0,20), ...NUM_POOLS["21-99"], ...NUM_POOLS.hundreds])];

/* the Greek texts of a number: one word, or tens + ones for 21 to 99 (35 = τριάντα πέντε) */
function numParts(n){
  if(NW[n]) return [NW[n].gr];
  return [NW[Math.floor(n/10)*10].gr, NW[n%10].gr];
}
const numGr  = n => numParts(n).join(" ");
const numLat = n => NW[n] ? NW[n].lat : NW[Math.floor(n/10)*10].lat+" "+NW[n%10].lat;

const digitOpt = (n,ok) => ({html:`<span class="digit">${fmt(n)}</span>`, ok});
const numWordOpt = (n,ok) => ({html:`<span lang="el">${esc(numGr(n))}</span>`, ok});
/* the right answer plus 3 wrong ones taken from the numbers closest to it, in random order */
function numChoices(n,pool,toOpt){
  const near=pool.filter(x=>x!==n).map(x=>[Math.abs(x-n)+Math.random(),x]).sort((a,b)=>a[0]-b[0]).slice(0,8).map(p=>p[1]);
  return shuffle([toOpt(n,true), ...sample(near,3).map(x=>toOpt(x,false))]);
}
/* the number this question is about (kept for the reviews) */
const numItem = n => ({key:`n:${n}`, gr:numGr(n), en:fmt(n), lat:numLat(n), snd:numParts(n).map(sid), cat:"Numbers"});
const numReveal = n => `<b>${fmt(n)}</b> = <b lang="el">${esc(numGr(n))}</b> (${esc(numLat(n))})`;

/* a sum whose size depends on the chosen numbers */
function makeSum(r){
  if(r==="0-10"){ const a=oneOf(span(0,10)), b=oneOf(span(0,10-a)); return {a,b,pool:NUM_POOLS[r]}; }
  if(r==="11-20"){ const a=oneOf(span(1,10)), b=oneOf(span(11-a,10)); return {a,b,pool:NUM_POOLS[r]}; }
  if(r==="tens"){ const a=oneOf(span(10,90,10)), b=oneOf(span(10,100-a,10)); return {a,b,pool:NUM_POOLS[r]}; }
  if(r==="21-99"){ return {a:oneOf(span(20,90,10)), b:oneOf(span(1,9)), pool:NUM_POOLS[r]}; }
  if(r==="hundreds"){ const a=oneOf(span(100,900,100)), b=oneOf(span(100,1000-a,100)); return {a,b,pool:NUM_POOLS[r]}; }
  return makeSum(oneOf(["0-10","11-20","tens","21-99","hundreds"]));
}

/* ----- prices: 3,50 € = τρία ευρώ και πενήντα λεπτά; played as the number words one after the other ----- */
const priceWords = (e,c) => [...(e ? [...numParts(e), "ευρώ"] : []), ...(e && c ? ["και"] : []), ...(c ? [...numParts(c), c===1 ? "λεπτό" : "λεπτά"] : [])];
const priceGr = (e,c) => priceWords(e,c).join(" ");
const priceTag = (e,c) => `${e},${String(c).padStart(2,"0")} €`;
function randomPrice(){
  const e = Math.random()<.08 ? 0 : oneOf(Math.random()<.6 ? span(1,20) : span(21,99));
  const c = e===0 ? oneOf([10,20,25,30,40,50,60,70,75,80,90]) : oneOf([0,0,0,10,20,25,30,40,50,50,60,70,75,80,90,95,99,5,15]);
  return {e,c};
}
/* 3 other prices that look like it: the euros changed, the cents changed, or both */
function priceWrong(p){
  const out = [], seen = new Set([priceTag(p.e,p.c)]);
  for(let guard=0; out.length<3 && guard<80; guard++){
    let e = p.e, c = p.c, r = Math.random();
    if(r<.4) e = Math.max(p.e ? 1 : 0, Math.min(99, p.e + oneOf([-3,-2,-1,1,2,3,10,-10])));
    else if(r<.75) c = oneOf([0,10,20,25,30,40,50,60,70,75,80,90,95,99]);
    else { e = Math.max(1, Math.min(99, p.e + oneOf([-1,1,2]))); c = oneOf([0,10,25,50,75,90]); }
    if(!e && !c) continue;
    const k = priceTag(e,c); if(seen.has(k)) continue;
    seen.add(k); out.push({e,c});
  }
  return out;
}
function priceQuestions(mode){
  return ()=>{
    const p = randomPrice(), wrong = priceWrong(p), words = priceWords(p.e,p.c);
    const reveal = `<b>${priceTag(p.e,p.c)}</b> = <b lang="el">${esc(priceGr(p.e,p.c))}</b>`;
    const tagOpt = (x,ok) => ({html:`<span class="digit">${priceTag(x.e,x.c)}</span>`, ok});
    const grOpt = (x,ok) => ({html:`<span lang="el">${esc(priceGr(x.e,x.c))}</span>`, ok});
    if(mode==="price") return {prompt:`<p class="vinfo" lang="el">Πόσο κάνει;</p><div class="pricetag"><b>${priceTag(p.e,p.c)}</b></div>`,
      options:shuffle([grOpt(p,true), ...wrong.map(x=>grOpt(x,false))]), cols:1, reveal, sayAfter:words};
    return {prompt:`<p class="word s">🔊 ${esc(tx("How much is it?"))}</p>`, say:words, autoplay:true,
      options:shuffle([tagOpt(p,true), ...wrong.map(x=>tagOpt(x,false))]), reveal};
  };
}

function numberQuestions(mode,range){
  if(mode==="price" || mode==="pricehear") return priceQuestions(mode);
  if(mode==="add") return ()=>{
    const {a,b,pool}=makeSum(range), sum=a+b;
    return {
      item:numItem(sum),
      prompt:`<p class="word s" lang="el">${esc(NW[a].gr)} + ${esc(NW[b].gr)}</p><p class="vinfo">= ?</p>`,
      options:numChoices(sum,pool,digitOpt),
      reveal:`<b lang="el">${esc(NW[a].gr)} + ${esc(NW[b].gr)} = ${esc(numGr(sum))}</b><br>${a} + ${b} = ${sum}`,
      sayAfter:numParts(sum)
    };
  };
  const pool=NUM_POOLS[range], nextNum=deck(pool);
  return ()=>{
    const n=nextNum();
    const item=numItem(n);
    if(mode==="d2w")    return {item, prompt:`<p class="word">${fmt(n)}</p>`, options:numChoices(n,pool,numWordOpt), reveal:numReveal(n), sayAfter:numParts(n)};
    if(mode==="w2d")    return {item, prompt:`<p class="word s" lang="el">${esc(numGr(n))}</p>`, say:numParts(n), options:numChoices(n,pool,digitOpt), reveal:numReveal(n), sayAfter:numParts(n)};
    if(mode==="write")  return {item, prompt:`<p class="word">${fmt(n)}</p>`, type:{answer:numGr(n)}, reveal:numReveal(n), sayAfter:numParts(n)};
    /* listen */        return {item, prompt:`<p class="word s">🔊 ${esc(tx("Which number is it?"))}</p>`, say:numParts(n), autoplay:true, options:numChoices(n,pool,digitOpt), reveal:numReveal(n)};
  };
}

function numCard(n,onclick){
  const b=document.createElement("button");
  b.className="acard"; b.type="button";
  b.innerHTML=`<span class="lat">${fmt(n)}</span><span class="big num" lang="el">${esc(numGr(n))}</span><span class="s">${esc(numLat(n))}</span>`;
  b.onclick=onclick;
  return b;
}
function renderNumberLearn(){
  const box=$("numLearn"); box.innerHTML="";
  const section=(title,nums,note)=>{
    const h=document.createElement("h2"); h.className="sub"; h.textContent=tx(title); box.appendChild(h);
    if(note){ const p=document.createElement("p"); p.className="note"; p.style.textAlign="left"; p.style.marginBottom="8px"; p.textContent=tx(note); box.appendChild(p); }
    const grid=document.createElement("div"); grid.className="alpha"; box.appendChild(grid);
    nums.forEach(n=>grid.appendChild(numCard(n,()=>say(numParts(n)))));
  };
  section("0 to 10", span(0,10));
  section("11 to 20", span(11,20));
  section("The tens", span(30,100,10).filter(n=>n<100));
  section("21 to 99", NUMBERS.examples, "Put the tens first, then the ones: 35 = τριάντα πέντε (30 + 5).");
  section("Hundreds and thousand", [100,...span(200,900,100),1000]);
  section("Big numbers", NUM_POOLS.big);
}

function startNumbers(){
  const m=NUM_MODES.find(x=>x.id===numMode), learn=numMode==="learn", draw=numMode==="draw";
  document.querySelectorAll("#numModes .chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mode===numMode));
  document.querySelectorAll("#numRanges .chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.range===numRange));
  if(numMode==="add" && numRange==="big") numRange="all";   /* no sums with big numbers */
  document.querySelectorAll("#numRanges .chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.range===numRange));
  const bigChip=document.querySelector('#numRanges [data-range="big"]'); if(bigChip) bigChip.hidden = numMode==="add";
  const price = numMode==="price" || numMode==="pricehear";
  $("numRanges").hidden=learn || price || draw;
  $("numInfo").textContent=tx(m.info);
  $("numLearn").hidden=!learn; $("numGame").hidden=learn || draw; $("numDiagram").hidden=!draw;
  stopSound();
  if(learn) renderNumberLearn();
  else if(draw) renderNumberDiagram($("numDiagram"));
  else runQuiz($("numGame"),{id:`numbers-${numMode}-${numRange}`, make:numberQuestions(numMode,numRange)});
}
function openNumbers(){
  const modes=$("numModes");
  if(!modes.children.length){
    NUM_MODES.forEach(m=>{
      const b=document.createElement("button");
      b.className="chip"; b.type="button"; b.dataset.mode=m.id; b.textContent=tx(m.name);
      b.onclick=()=>{ numMode=m.id; startNumbers(); };
      modes.appendChild(b);
    });
    NUM_RANGES.forEach(([id,name])=>{
      const b=document.createElement("button");
      b.className="chip"; b.type="button"; b.dataset.range=id; b.textContent=tx(name);
      b.onclick=()=>{ numRange=id; startNumbers(); };
      $("numRanges").appendChild(b);
    });
  }
  startNumbers();
}
