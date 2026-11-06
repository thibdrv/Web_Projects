/* ---------- colors ---------- */
const CW = COLORS.words;
const CBY = Object.fromEntries(CW.map(c=>[c.id,c]));
const COLOR_MODES = [
  {id:"learn",   name:"Learn",         info:"Tap a color to hear its name."},
  {id:"w2c",     name:"Word → Color",  info:"You see a Greek color word. Tap the matching color."},
  {id:"c2w",     name:"Color → Word",  info:"You see a color. Tap its Greek name."},
  {id:"listen",  name:"Listen",        info:"Listen, then tap the color you heard."},
  {id:"objects", name:"Sentences",     info:"Finish the sentence with the right color."},
  {id:"mix",     name:"Mix paint",     info:"Which color do you get when you mix these two?"},
  {id:"draw",    name:"Drawings",      info:"A paint palette and a box of crayons. Tap a color to hear its name."}
];
let colorMode = "learn";

/* the word this question is about (kept for the reviews) */
const colorItem = c => ({key:`c:${c.id}`, gr:c.gr, en:c.en, lat:c.lat, snd:sid(c.gr), cat:"Colors"});
const objectItem = o => ({key:`co:${sid(o.gr)}`, gr:o.gr, en:o.en, lat:o.lat, snd:sid(o.gr), cat:"Colors"});

const swatch = (c,cls="") => `<span class="sw ${cls}" style="background:${c.hex}"></span>`;
const swatchOpt = (c,ok) => ({html:swatch(c), ok, label:tx(c.en), cls:"swatch"});
const wordOpt = (c,ok) => ({html:`<span lang="el">${esc(c.gr)}</span>`, ok});
const colorReveal = c => `<b lang="el">${esc(c.gr)}</b> <span class="lt">(${esc(c.lat)})</span> ${esc(tx("means “{x}”",{x:tx(c.en)}))}`;
/* the right answer plus 3 other colors, in random order */
function colorOptions(right, toOpt, skip=[]){
  const others = CW.filter(c=>c.id!==right.id && !skip.includes(c.id));
  return shuffle([toOpt(right,true), ...sample(others,3).map(c=>toOpt(c,false))]);
}

function colorQuestions(mode){
  if(mode==="objects"){
    const nextObj=deck(COLORS.objects);
    return ()=>{
      const o=nextObj(), right=CBY[o.color];
      return {
        item:objectItem(o),
        prompt:`<span class="emoji" aria-hidden="true">${o.emoji}</span><p class="word s" lang="el">${esc(o.before)} …</p>`,
        options:colorOptions(right,wordOpt),
        reveal:`<b lang="el">${esc(o.gr)}</b><br><span class="lt">${esc(o.lat)}</span> — “${esc(tx(o.en))}”`,
        sayAfter:o.gr
      };
    };
  }
  if(mode==="mix"){
    const nextMix=deck(COLORS.mixes);
    return ()=>{
      const m=nextMix(), a=CBY[m.a], b=CBY[m.b], r=CBY[m.result];
      return {
        item:colorItem(r),
        prompt:`<div class="mixrow">${swatch(a)}<span>+</span>${swatch(b)}<span>=</span><span>?</span></div>
                <p class="word s" lang="el">${esc(a.gr)} + ${esc(b.gr)}</p>`,
        options:colorOptions(r,swatchOpt,[a.id,b.id]),
        reveal:`<b lang="el">${esc(a.gr)} + ${esc(b.gr)} = ${esc(r.gr)}</b><br>${esc(tx(a.en))} + ${esc(tx(b.en))} = ${esc(tx(r.en))}`,
        sayAfter:r.gr
      };
    };
  }
  const nextColor=deck(CW);
  return ()=>{
    const c=nextColor(), item=colorItem(c);
    if(mode==="w2c")  return {item, prompt:`<p class="word" lang="el">${esc(c.gr)}</p>`, say:c.gr, options:colorOptions(c,swatchOpt), reveal:colorReveal(c), sayAfter:c.gr};
    if(mode==="c2w")  return {item, prompt:swatch(c,"round"), options:colorOptions(c,wordOpt), reveal:colorReveal(c), sayAfter:c.gr};
    /* listen */      return {item, prompt:`<p class="word s">🔊 ${esc(tx("Which color is it?"))}</p>`, say:c.gr, autoplay:true, options:colorOptions(c,swatchOpt), reveal:colorReveal(c)};
  };
}

function renderColorLearn(){
  const box=$("colorsLearn");
  box.innerHTML=`<div class="alpha" data-k="colors"></div>
    <h2 class="sub">${esc(tx("Sentences"))}</h2><div class="lines" data-k="lines"></div>`;
  CW.forEach(c=>{
    const b=document.createElement("button");
    b.className="acard"; b.type="button";
    b.innerHTML=`${swatch(c,"dot")}<span class="big" lang="el">${esc(c.gr)}</span><span class="lat"><span class="lt">${esc(c.lat)}</span></span><span class="s">${esc(tx(c.en))}</span>`;
    b.onclick=()=>say(c.gr);
    box.querySelector('[data-k="colors"]').appendChild(b);
  });
  COLORS.objects.forEach(o=>{
    const b=document.createElement("button");
    b.className="line"; b.type="button";
    b.innerHTML=`<span class="emoji sm" aria-hidden="true">${o.emoji}</span>
      <span class="ltxt"><b lang="el">${esc(o.gr)}</b><span><span class="lt">${esc(o.lat)}</span> — ${esc(tx(o.en))}</span></span><span aria-hidden="true">🔊</span>`;
    b.onclick=()=>say(o.gr);
    box.querySelector('[data-k="lines"]').appendChild(b);
  });
}

function startColors(){
  const m=COLOR_MODES.find(x=>x.id===colorMode);
  document.querySelectorAll("#colorModes .chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mode===colorMode));
  $("colorInfo").textContent=tx(m.info);
  const learn=colorMode==="learn", draw=colorMode==="draw";
  $("colorsLearn").hidden=!learn; $("colorsGame").hidden=learn || draw; $("colorsDiagram").hidden=!draw;
  stopSound();
  if(learn) renderColorLearn();
  else if(draw) renderColorDiagram($("colorsDiagram"));
  else runQuiz($("colorsGame"),{id:"colors-"+colorMode, make:colorQuestions(colorMode)});
}
function openColors(){
  const row=$("colorModes");
  if(!row.children.length) COLOR_MODES.forEach(m=>{
    const b=document.createElement("button");
    b.className="chip"; b.type="button"; b.dataset.mode=m.id; b.textContent=tx(m.name);
    b.onclick=()=>{ colorMode=m.id; startColors(); };
    row.appendChild(b);
  });
  startColors();
}
