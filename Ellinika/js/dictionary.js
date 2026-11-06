/* ---------- dictionary ----------
   Gathers every word of the app (letters, colors, grammar, numbers, family, food, house, city, nature, jobs, opposites, dialogues...) into one list,
   built from the data files, so a new word added there shows up here by itself.
   Two modes: Browse (A to Ω, with filters) and Search (type in Greek, English or Latin letters). */
const POS_INFO = {
  noun:["noun","noun"], verb:["verb","verb"], adjective:["adjective","adjective"], number:["number","number"],
  phrase:["phrase","phrase"], letter:["letter","letter"],
  adverb:["adverb","other"], pronoun:["pronoun","other"], conjunction:["conjunction","other"], expression:["expression","other"], other:["other","other"]
};
const DICT_TYPES = [["noun","Nouns"],["verb","Verbs"],["adjective","Adjectives"],["number","Numbers"],["phrase","Phrases"],["letter","Letters"],["other","Other"]];
const NUMBER_NAMES = {0:"zero",1:"one",2:"two",3:"three",4:"four",5:"five",6:"six",7:"seven",8:"eight",9:"nine",10:"ten",11:"eleven",12:"twelve",
  13:"thirteen",14:"fourteen",15:"fifteen",16:"sixteen",17:"seventeen",18:"eighteen",19:"nineteen",20:"twenty",30:"thirty",40:"forty",50:"fifty",
  60:"sixty",70:"seventy",80:"eighty",90:"ninety",100:"one hundred",200:"two hundred",300:"three hundred",400:"four hundred",500:"five hundred",
  600:"six hundred",700:"seven hundred",800:"eight hundred",900:"nine hundred",1000:"one thousand",
  10000:"ten thousand",100000:"one hundred thousand",1000000:"one million",1000000000:"one billion"};

/* lowercase, no accents, final ς = σ: "Καφές" and "καφες" are the same for a search */
const fold = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ς/g,"σ");
const withoutArticle = gr => gr.replace(/^(ο|η|το|τα|οι)\s+/,"");

/* the French meaning of an entry (its own "fr", or the translation of each part of its English text) */
const frOf = e => e.fr || String(e.en).split(" · ").map(trFR).join(" · ");
const dictMeaning = e => LANG==="fr" ? frOf(e) : e.en;

const DICT = [];
(function buildDictionary(){
  const byKey = new Map();
  /* the same word can come from several categories: keep one entry and list all its categories */
  function add(e){
    const key = withoutArticle(e.gr).toLowerCase();
    const old = byKey.get(key);
    if(old){
      if(e.lvl && cefrRank(e.lvl)<cefrRank(old.lvl)) old.lvl = e.lvl;   /* several categories: keep the easiest level */
      e.cats.forEach(c=>{ if(!old.cats.includes(c)) old.cats.push(c); });
      ["emoji","hex","forms","extra"].forEach(f=>{ if(!old[f] && e[f]) old[f]=e[f]; });
      return;
    }
    e.snd = e.snd || sid(e.gr);
    e.lvl = e.lvl || CAT_LEVEL[e.cats[0]] || "A2";
    byKey.set(key,e); DICT.push(e);
  }
  COLORS.words.forEach(c=>add({gr:c.gr, lat:c.lat, en:c.en, pos:"adjective", cats:["Colors"], lvl:"A1", hex:c.hex}));
  COLORS.objects.forEach(o=>add({gr:o.gr, lat:o.lat, en:o.en, pos:"phrase", cats:["Colors"], lvl:"A1", emoji:o.emoji}));
  GRAMMAR.verbs.forEach(v=>add({gr:v.gr, lat:translit(v.gr), en:v.en, pos:"verb", cats:["Grammar"], forms:v.forms}));
  GRAMMAR.persons.forEach(p=>add({gr:p.gr, lat:p.lat, en:p.en, pos:"pronoun", cats:["Grammar"]}));
  Object.values(GRAMMAR.tenses).forEach(t=>add({gr:t.time.gr, lat:t.time.lat, en:t.time.en, pos:"adverb", cats:["Grammar"]}));
  NUMBERS.words.forEach(w=>add({gr:w.gr, lat:w.lat, en:`${w.n} · ${NUMBER_NAMES[w.n]}`, pos:"number", cats:["Numbers"]}));
  FAMILY.groups.forEach(g=>{ const cat = g.id==="animals" ? "Animals" : "Family"; g.words.forEach(w=>add({gr:w.gr, lat:w.lat, en:w.en, pos:/^(ο|η|το|τα|οι)\s/.test(w.gr) ? "noun" : "adjective", cats:[cat], lvl:levelOfGroup(cat,g.id), emoji:w.emoji})); });
  FOOD.groups.forEach(g=>g.words.forEach(w=>add({gr:w.gr, lat:w.lat, en:w.en, pos:"noun", cats:["Food & drinks"], lvl:levelOfGroup("Food & drinks",g.id), emoji:w.emoji})));
  TIME.groups.forEach(g=>g.words.forEach(w=>add({gr:w.gr, lat:w.lat, en:w.en, pos:/^(ο|η|το|τα|οι)\s/.test(w.gr) ? "noun" : "adverb", cats:["Time & dates"], lvl:levelOfGroup("Time & dates",g.id), emoji:w.emoji})));
  /* new word lists: a noun starts with its "the"; "I turn" is a verb; the adjectives of Opposites end in -ος, -ύς, -ής... */
  const listPos = (w,g) => /^(ο|η|το|τα|οι)\s/.test(w.gr) ? "noun" : /^(it is|there is|what is) /.test(w.en) ? "phrase" : /^I /.test(w.en) ? "verb" : ["size","qualities","senses"].includes(g.id) || /(ος|ύς|ής|ές|ύ)$/.test(w.gr) ? "adjective" : "adverb";
  [[BODY,"Human body"],[HOUSE,"House & clothes"],[CLOTHES,"Clothes"],[COOKING,"Cooking"],[CITY,"City & travel"],[DIRECTIONS,"Directions"],[NATURE,"Weather & nature"],[JOBS,"Jobs & hobbies"],[OPPOSITES,"Opposites"]].forEach(([D,cat])=>
    D.groups.forEach(g=>g.words.forEach(w=>add({gr:w.gr, lat:w.lat, en:w.en, pos:listPos(w,g), cats:[cat], lvl:levelOfGroup(cat,g.id), emoji:w.emoji}))));
  /* more words (data/wordbank.js): the category of a word that already existed is just added to it */
  WORDBANK.words.forEach(w=>add({gr:w.gr, lat:w.lat, en:w.en, fr:w.fr, pos:w.pos || (/^(ο|η|το|τα|οι)\s/.test(w.gr) ? "noun" : /^(I|it) /.test(w.en) ? "verb" : "adjective"), cats:[w.cat], emoji:w.emoji, lvl:w.lvl}));
  SCENE_WORDS.words.forEach(w=>add({gr:w.gr, lat:w.lat, en:w.en, fr:w.fr, pos:w.cat!=="Grammar" ? "noun" : /\s/.test(w.gr) ? "phrase" : "other", cats:[w.cat]}));
  DIALOGUES.dialogues.forEach(d=>d.lines.forEach(l=>add({gr:l.gr, lat:l.lat, en:l.en, fr:l.fr, pos:"phrase", cats:["Dialogues"], lvl:"A2"})));
  HOLIDAYS.holidays.forEach(h=>add({gr:h.gr, lat:h.lat, en:h.en, fr:h.fr, pos:"noun", cats:["Time & dates"], lvl:"B1", emoji:h.emoji}));
  TALK.scenarios.forEach(s=>s.turns.forEach(t=>[t.bot, ...(t.good||[])].forEach(l=>add({gr:l.gr, lat:l.lat, en:l.en, fr:l.fr, pos:"phrase", cats:["Conversation"], lvl:s.level}))));
  PHRASES.groups.forEach(g=>g.phrases.forEach(p=>add({gr:p.gr, lat:p.lat, en:p.en, fr:p.fr, pos:"phrase", cats:["Phrases"], lvl:"A1"})));
  DATA.alpha.forEach(a=>add({gr:a.name, lat:a.nameLat, en:`letter ${a.U} ${a.l}`, fr:`lettre ${a.U} ${a.l}`, extra:a.sound, pos:"letter", cats:["Greek letters"], lvl:"A1", snd:a.a}));
  DATA.levels.forEach(L=>L.words.forEach(w=>add({gr:w.gr, lat:w.lat, en:w.en, pos:w.pos || (L.id==="phrases" ? "phrase" : "other"), cats:["Greek letters"], lvl:w.lvl, snd:w.a})));

  /* every word gets a topic: the nouns of the first list from data/topics.js, and every verb, adjective and small word from its type */
  DICT.forEach(e=>{
    const add2 = c => { if(!e.cats.includes(c)) e.cats.push(c); };
    const t = TOPIC_OF[withoutArticle(e.gr).toLowerCase()]; if(t) add2(t);
    if(e.pos==="phrase") add2("Phrases");
    else if(e.pos==="verb") add2("Verbs");
    else if(e.pos==="adjective") add2("Adjectives");
    else if(["adverb","conjunction","expression","pronoun"].includes(e.pos)) add2("Small words");
  });
  DICT.forEach(e=>{
    e.type = POS_INFO[e.pos][1];
    FALLBACK_TEXT[e.snd] = e.gr.replace(/;/g,"").trim();          /* no recording yet: the voice of the device reads it */
    const plain = withoutArticle(e.gr);
    /* a search in English or in French finds the word, whatever the language of the screen */
    e.k = {gr:fold(plain), lat:fold(e.lat), en:fold(e.en+" "+frOf(e)+" "+(e.extra||"")+" "+(e.extra ? trFR(e.extra) : ""))};
    e.sortKey = e.k.gr;
  });
  DICT.sort((a,b)=>a.sortKey.localeCompare(b.sortKey,"el"));
})();

/* how well an entry matches a (folded) search: 0 = no match, higher = better.
   A verb also matches through its conjugated forms: "grapso" finds γράφω (θα γράψω). */
const looseMatchers = new Map();
const looseMatch = (gr,q) => {
  if(!looseMatchers.has(gr)) looseMatchers.set(gr, matcher(withoutArticle(gr)));
  return looseMatchers.get(gr).test(cleanInput(q));
};
function formIndex(e){
  if(!e.fi) e.fi = Object.entries(e.forms).flatMap(([t,forms])=>forms.map((f,p)=>({f,t,p,kg:fold(f),kl:fold(translit(f))})));
  return e.fi;
}
function matchScore(e,q){
  e.hit = null;
  if(!q) return 1;
  let best = 0;
  const flat = q.replace(/\s+/g,"");
  const sounds = q.length>=3 && /^[a-z ]+$/.test(q);
  for(const f of [e.k.gr, e.k.lat, e.k.en]){
    let s = 0;
    if(f===q) s=100;
    else if(f.split(/[\s,()·/-]+/).includes(q)) s=90;
    else if(f.startsWith(q)) s=80;
    else if(f.split(/[\s,()·/-]+/).some(w=>w.startsWith(q))) s=60;
    else if(f.includes(q) || (flat!==q && f.replace(/\s+/g,"").includes(flat))) s=40;
    if(s) s += 1 - Math.min(f.length,100)/100;   /* shorter text first: "7 · seven" before "700 · seven hundred" */
    if(s>best) best=s;
  }
  /* someone typing the word the way it sounds: "ochto" finds οχτώ, like in the exercises */
  if(best<90 && sounds){
    try{ if(looseMatch(e.gr,q)) best = 90; }catch(err){}
  }
  if(best<50 && e.forms && q.length>=3){
    for(const x of formIndex(e)){
      let s = 0;
      if(x.kg===q || x.kl===q || (flat!==q && x.kl.replace(/\s+/g,"")===flat)) s=70;
      else if(x.kg.includes(q) || x.kl.includes(q) || (flat!==q && x.kl.replace(/\s+/g,"").includes(flat))) s=45;
      else if(sounds){ try{ if(looseMatch(x.f,q)) s=70; }catch(err){} }
      if(s>best){ best=s; e.hit=x; }
    }
  }
  return best;
}

let dictMode = "browse", dictType = "all", dictFrom = "all", dictLevel = "all", dictShown = 120;
const DICT_PAGE = 120;

function dictEntryNode(e){
  const wrap = document.createElement("div"); wrap.className = "dword";
  const b = document.createElement("button"); b.type = "button"; b.className = "dentry";
  const mark = e.emoji ? `<span class="emoji sm" aria-hidden="true">${e.emoji}</span>` : e.hex ? `<span class="sw dot" style="background:${e.hex}"></span>` : "";
  b.innerHTML = `${mark}<span class="dtxt"><span class="dgr" lang="el">${esc(e.gr)}</span>
    <span class="dlat"><span class="lt">${esc(e.lat)}</span></span><span class="den">${esc(dictMeaning(e))}${e.extra ? " · "+esc(tx(e.extra)) : ""}</span>
    <span class="dmeta"><span class="lvlb" data-l="${e.lvl}">${e.lvl}</span> ${esc(tx(POS_INFO[e.pos][0]))} · ${esc(e.cats.map(c=>tx(c)).join(" · "))}</span>${e.hit ? `<span class="dhit">→ <span lang="el">${esc(e.hit.f)}</span> (${esc(translit(e.hit.f))}) · ${esc(tx(GRAMMAR.tenses[e.hit.t].name))}, ${esc(tx(GRAMMAR.persons[e.hit.p].en))}</span>` : ""}</span><span class="dplay" aria-hidden="true">🔊</span>`;
  b.onclick = ()=>play(e.snd);
  wrap.appendChild(b);
  wrap.appendChild(favButton({gr:e.gr, lat:e.lat, en:e.en, fr:e.fr, snd:e.snd, cat:e.cats[0], emoji:e.emoji}, "on-card"));
  if(typeof exampleFor==="function" && exampleFor(e.gr)){
    const d = document.createElement("details"); d.className = "dforms dexample";
    d.innerHTML = `<summary>${esc(tx("Example"))}</summary>`;
    d.addEventListener("toggle", ()=>{
      if(!d.open || d.dataset.ready) return;
      d.dataset.ready = "1";
      const x = exampleFor(e.gr), row = document.createElement("div"); row.className = "exbox";
      g2Line(row, esc(x.say), esc(pick(x)), x.say);
      d.appendChild(row);
    });
    wrap.appendChild(d);
  }
  if(e.forms){
    const d = document.createElement("details"); d.className = "dforms";
    d.innerHTML = `<summary>${esc(tx("Conjugation"))}</summary>`;
    d.addEventListener("toggle", ()=>{
      if(!d.open || d.dataset.ready) return;
      d.dataset.ready = "1";
      Object.entries(e.forms).forEach(([t,forms])=>{
        const h = document.createElement("p"); h.className = "tname";
        h.innerHTML = `${esc(tx(GRAMMAR.tenses[t].name))} <span class="pill"><span lang="el">${esc(GRAMMAR.tenses[t].time.gr)}</span> · ${esc(tx(GRAMMAR.tenses[t].time.en))}</span>`;
        d.appendChild(h);
        const rows = document.createElement("div"); rows.className = "vrows";
        forms.forEach((f,p)=>{
          const r = document.createElement("button"); r.type = "button"; r.className = "vrow";
          r.innerHTML = `<span class="pn" lang="el">${esc(personName(p))}</span><span class="vf" lang="el">${esc(f)}</span><span class="vl">${esc(translit(f))}</span>`;
          r.onclick = ()=>say(f);
          rows.appendChild(r);
        });
        d.appendChild(rows);
      });
    });
    wrap.appendChild(d);
  }
  return wrap;
}

/* the list is drawn a moment after you ask for it (a letter typed, a filter): while it is built, grey shimmering lines show where the words will be */
let dictTimer = 0;
const DICT_SKELETON = Array.from({length:7}, ()=>`<div class="dsk" aria-hidden="true"><i class="a"></i><i class="b"></i><i class="c"></i></div>`).join("");
function renderDictionary(){
  clearTimeout(dictTimer);
  const box = $("dictList"); if(box){ box.innerHTML = DICT_SKELETON; box.setAttribute("aria-busy", "true"); }
  dictTimer = setTimeout(()=>{ renderDictionaryNow(); if(box) box.removeAttribute("aria-busy"); }, 70);
}
function renderDictionaryNow(){
  const searching = dictMode==="search";
  const q = searching ? fold($("dictQuery").value.trim()) : "";
  const scored = DICT.map(e=>[e,matchScore(e,q)]).filter(([,s])=>s>0);

  /* the menus show how many words each choice would give */
  const fromOf = e => Fav.has(e.gr) ? [...e.cats, "My words"] : e.cats;
  const lvOk = e => dictLevel==="all" || e.lvl===dictLevel;
  const countType = t => scored.filter(([e])=>(t==="all"||e.type===t) && (dictFrom==="all"||fromOf(e).includes(dictFrom)) && lvOk(e)).length;
  const countFrom = c => scored.filter(([e])=>(dictType==="all"||e.type===dictType) && (c==="all"||fromOf(e).includes(c)) && lvOk(e)).length;
  const countLevel = l => scored.filter(([e])=>(dictType==="all"||e.type===dictType) && (dictFrom==="all"||fromOf(e).includes(dictFrom)) && (l==="all"||e.lvl===l)).length;
  const fill = (id,items,current,count)=>{
    const sel=$(id); sel.innerHTML="";
    items.forEach(([v,name])=>{
      const o=document.createElement("option"); o.value=v; o.textContent=`${tx(name)} (${count(v)})`; o.selected=v===current; sel.appendChild(o);
    });
  };
  fill("dictType",[["all","All types"],...DICT_TYPES],dictType,countType);
  fill("dictFrom",[["all","All categories"],.../* the order: my words and the sources, then the kinds of words, then the topics */
    ["My words","Greek letters","Phrases","Dialogues","Conversation","Verbs","Adjectives","Small words","Numbers","Colors","Grammar","Opposites","Family","Animals","Human body","Feelings & mind","Food & drinks","Cooking","House & clothes","Clothes","Tools & materials","City & travel","Directions","Countries & nationalities","Money & shopping","Society & religion","Weather & nature","Plants & farming","Time & dates","Jobs & hobbies","School & education","Technology & media","Leisure & arts"].map(c=>[c,c])],dictFrom,countFrom);

  fill("dictLevel",[["all","All levels"],...CEFR_LEVELS.map(l=>[l,l])],dictLevel,countLevel);
  let rows = scored.filter(([e])=>(dictType==="all"||e.type===dictType) && (dictFrom==="all"||fromOf(e).includes(dictFrom)) && lvOk(e));
  if(searching && q) rows.sort((a,b)=>b[1]-a[1] || a[0].sortKey.localeCompare(b[0].sortKey,"el"));
  const list = rows.map(r=>r[0]);

  $("dictInfo").textContent = !searching ? tx("{n} words, A to Ω. Tap a word to hear it.",{n:list.length})
    : !q ? tx("Type a word in Greek, English, French or Latin letters (kafes, coffee, café, καφές). {n} words in the dictionary.",{n:list.length})
    : tx(list.length===1 ? "{n} result for “{q}”." : "{n} results for “{q}”.",{n:list.length,q:$("dictQuery").value.trim()});

  const box = $("dictList"); box.innerHTML = "";
  if(!list.length){
    box.innerHTML = emptyState({icon:"🔍", title:tx("No word found."), text:tx("Try fewer letters, another spelling, or the English or French word.")});
    return;
  }
  let lastHead = "";
  list.slice(0,dictShown).forEach(e=>{
    if(!searching || !q){
      const head = e.sortKey.charAt(0).toUpperCase();
      if(head!==lastHead){ const h=document.createElement("h2"); h.className="sub dhead"; h.textContent=head; box.appendChild(h); lastHead=head; }
    }
    box.appendChild(dictEntryNode(e));
  });
  if(list.length>dictShown){
    const more = document.createElement("button"); more.type="button"; more.className="btn ghost";
    more.textContent = tx("Show {n} more ({m} left)",{n:Math.min(DICT_PAGE,list.length-dictShown),m:list.length-dictShown});
    more.onclick = ()=>{ dictShown += DICT_PAGE; renderDictionaryNow(); };
    box.appendChild(more);
  }
}

function openDictionary(){
  const modes = $("dictModes");
  if(!modes.children.length){
    [["browse","Browse"],["search","Search"]].forEach(([id,name])=>{
      const b = document.createElement("button");
      b.className="chip"; b.type="button"; b.dataset.mode=id; b.textContent=tx(name);
      b.onclick = ()=>{ dictMode=id; dictShown=DICT_PAGE; openDictionary(); if(id==="search") try{ $("dictQuery").focus(); }catch(e){} };
      modes.appendChild(b);
    });
    $("dictQuery").addEventListener("input",()=>{ dictShown=DICT_PAGE; renderDictionary(); });
    $("dictType").onchange = e=>{ dictType=e.target.value; dictShown=DICT_PAGE; renderDictionary(); };
    $("dictFrom").onchange = e=>{ dictFrom=e.target.value; dictShown=DICT_PAGE; renderDictionary(); };
    $("dictLevel").onchange = e=>{ dictLevel=e.target.value; dictShown=DICT_PAGE; renderDictionary(); };
  }
  modes.querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mode===dictMode));
  $("dictQuery").hidden = dictMode!=="search";
  renderDictionary();
}
