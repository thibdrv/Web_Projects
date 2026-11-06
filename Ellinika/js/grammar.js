/* ---------- grammar ----------
   The page has a row of topics. "Verbs" is the one below (tenses, levels, conjugation tables).
   The other topics (plural, adjectives, cases, negation, questions) are in js/grammar2.js. */
const G = GRAMMAR;
/* more verbs, with their forms made by rule (data/verbs2.js): they join the Verbs topic as more levels */
if(typeof VERBS2!=="undefined"){ G.verbs.push(...VERBS2.verbs); G.levels.push(...VERBS2.levels); }
const GV = Object.fromEntries(G.verbs.map(v=>[v.id,v]));
const G_TOPICS = [["verbs","Verbs"],["plural","Plural"],["adjectives","Adjectives"],["cases","Cases"],["negation","Negation"],["questions","Questions"],["prepositions","Prepositions"],["possessives","Possessives"],["imperative","Imperative"]];
const G_TENSES = [["present","Present"],["past","Past"],["future","Future"],["mix","Mix"]];
const G_MODES = [
  {id:"learn",  name:"Learn",  info:"Tap a form to hear it."},
  {id:"choose", name:"Choose", info:"Pick the right form of the verb."},
  {id:"type",   name:"Type",   info:"Write the right form in Latin letters."},
  {id:"write",  name:"Write it", info:"Write the right form with Greek letters."}
];
let gTopic = "verbs", gTense = "present", gLevel = "all", gMode = "learn";

/* the tenses a level teaches (the usual three unless the level says otherwise) */
const levelTenses = L => L.tenses || ["present","past","future"];
const levelsFor = group => G.levels.filter(L=>levelTenses(L).some(t=>G.groups[group].includes(t)));
/* tenses of this level that belong to the chosen tense button */
const tensesOf = (L,group) => levelTenses(L).filter(t=>G.groups[group].includes(t));
/* every (verb, tense) the learner can be asked about with the current choices */
function poolFor(group,level){
  const out=[];
  levelsFor(group).filter(L=>level==="all"||L.id===level).forEach(L=>{
    tensesOf(L,group).forEach(t=>{
      L.verbs.map(id=>GV[id]).filter(v=>v.forms[t]).forEach(verb=>out.push({verb,tense:t}));
    });
  });
  return out;
}
/* romanization that follows the letters, like the tiles in the Letters section */
function translit(gr){
  const toks=tokenize(gr);
  return toks.map((t,i)=>t.g===" " ? " " : tileLatin(t,toks[i+1])).join("");
}
const personName = p => G.persons[p].show || G.persons[p].gr;

/* ----- Learn: conjugation tables ----- */
function renderGrammarLearn(){
  const box=$("gLearn"); box.innerHTML="";
  levelsFor(gTense).filter(L=>gLevel==="all"||L.id===gLevel).forEach(L=>{
    const h=document.createElement("h2"); h.className="sub"; h.textContent=`${tx("Level {n}",{n:L.id})} · ${tx(L.name)}`; box.appendChild(h);
    L.verbs.map(id=>GV[id]).forEach(v=>{
      const tenses=tensesOf(L,gTense).filter(t=>v.forms[t]);
      if(!tenses.length) return;
      const card=document.createElement("div"); card.className="vcard";
      card.innerHTML=`<div class="vhead"><b lang="el">${esc(v.gr)}</b><span>${esc(translit(v.gr))} · ${esc(tx(v.en))}</span></div>`;
      tenses.forEach(t=>{
        const T=G.tenses[t];
        const name=document.createElement("p"); name.className="tname";
        name.innerHTML=`${esc(tx(T.name))} <span class="pill"><span lang="el">${esc(T.time.gr)}</span> · ${esc(tx(T.time.en))}</span>`;
        card.appendChild(name);
        const rows=document.createElement("div"); rows.className="vrows";
        v.forms[t].forEach((f,p)=>{
          const b=document.createElement("button"); b.type="button"; b.className="vrow";
          b.innerHTML=`<span class="pn" lang="el">${esc(personName(p))}</span><span class="vf" lang="el">${esc(f)}</span><span class="vl">${esc(translit(f))}</span>`;
          b.onclick=()=>say(f);
          rows.appendChild(b);
        });
        card.appendChild(rows);
      });
      box.appendChild(card);
    });
  });
}

/* ----- Choose / Type: questions ----- */
/* 3 wrong forms: other persons of the same tense, the same person in other tenses, then other verbs */
function wrongForms(verb,tense,p,right){
  const f=verb.forms;
  const near=[...f[tense].filter((_,i)=>i!==p), ...Object.keys(f).filter(t=>t!==tense).map(t=>f[t][p])];
  const out=sample([...new Set(near)].filter(x=>x!==right),3);
  for(let guard=0; out.length<3 && guard<50; guard++){
    const x=oneOf(G.verbs).forms[tense]?.[p];
    if(x && x!==right && !out.includes(x)) out.push(x);
  }
  return out;
}
/* one question about one form: verb, tense, person (0 to 5), kind = "choose" or "type" */
function formQuestion(verb,tense,p,kind){
  const T=G.tenses[tense], right=verb.forms[tense][p];
  const q={
    item:{key:`gv:${verb.id}:${tense}:${p}`, gr:right, en:`${verb.en} · ${G.persons[p].en} · ${T.name}`, lat:translit(right), snd:sid(right), cat:"Grammar"},
    prompt:`<p class="tw"><span class="pill">${esc(tx(T.name))}</span> <span lang="el">${esc(T.time.gr)}</span> <span class="muted">· ${esc(tx(T.time.en))}</span></p>
            <p class="word s" lang="el">${esc(personName(p))} <span class="blank">…</span></p>
            <p class="vinfo"><b lang="el">${esc(verb.gr)}</b> · ${esc(tx(verb.en))} <span class="muted">(${esc(tx(G.persons[p].en))})</span></p>`,
    reveal:`<b lang="el">${esc(G.persons[p].gr)} ${esc(right)}</b> (${esc(translit(right))})<br>${esc(tx(verb.en))} · ${esc(tx(T.name))}`,
    sayAfter:right
  };
  if(kind==="type") q.type={answer:right};
  else if(kind==="write"){
    q.write={answers:[right]};
    /* the hint: the first letters of the form, and its present form for the other tenses */
    const first=right.replace(/^θα /,"");
    q.hint=`${esc(tx("Starts with"))} <b lang="el">${esc(first.slice(0,2))}…</b> · ${esc(tx("Ends with"))} <b lang="el">…${esc(first.slice(-2))}</b>`;
  }
  else q.options=shuffle([{html:`<span lang="el">${esc(right)}</span>`,ok:true},
    ...wrongForms(verb,tense,p,right).map(f=>({html:`<span lang="el">${esc(f)}</span>`,ok:false}))]);
  return q;
}
function grammarQuestions(kind){
  const nextItem=deck(poolFor(gTense,gLevel));
  return ()=>{
    const {verb,tense}=nextItem();
    return formQuestion(verb,tense,Math.floor(Math.random()*6),kind);
  };
}

/* ----- the buttons and the screen ----- */
function chipRow(boxId,items,current,onPick){
  const box=$(boxId); box.innerHTML="";
  items.forEach(([id,name])=>{
    const b=document.createElement("button");
    b.className="chip"; b.type="button"; b.dataset.mode=id; b.textContent=name; b.setAttribute("aria-pressed",id===current);
    b.onclick=()=>onPick(id);
    box.appendChild(b);
  });
}
function renderGrammar(){
  chipRow("gTopics",G_TOPICS.map(([id,name])=>[id,tx(name)]),gTopic,id=>{ gTopic=id; renderGrammar(); });
  const verbs = gTopic==="verbs";
  $("gTenses").hidden = !verbs; $("gLevels").hidden = !verbs;
  if(!verbs){ renderTopic(gTopic); return; }

  if(gLevel!=="all" && !levelsFor(gTense).some(L=>L.id===gLevel)) gLevel="all";
  chipRow("gTenses",G_TENSES.map(([id,name])=>[id,tx(name)]),gTense,id=>{ gTense=id; renderGrammar(); });
  chipRow("gLevels",[["all",tx("All levels")],...levelsFor(gTense).map(L=>[L.id,`${L.id}. ${tx(L.name)}`])],gLevel,id=>{ gLevel=id; renderGrammar(); });
  chipRow("gModes",G_MODES.map(m=>[m.id,tx(m.name)]),gMode,id=>{ gMode=id; renderGrammar(); });

  const used=[...new Set(poolFor(gTense,gLevel).map(e=>e.tense))];
  const notes=gTense==="mix" ? tx("Present, past and future mixed together.") : used.map(t=>tx(G.tenses[t].note)).join(" ");
  $("gInfo").textContent=tx(G_MODES.find(m=>m.id===gMode).info)+" "+notes;

  const learn=gMode==="learn";
  $("gLearn").hidden=!learn; $("gGame").hidden=learn;
  stopSound();
  if(learn) renderGrammarLearn();
  else runQuiz($("gGame"),{id:`grammar-${gMode}-${gTense}-${gLevel}`, make:grammarQuestions(gMode)});
}
function openGrammar(){ renderGrammar(); }
