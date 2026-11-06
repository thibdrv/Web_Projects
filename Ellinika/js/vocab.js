/* ---------- word lists with pictures (Family, Animals, Food...) ----------
   initVocab(prefix, data) builds a whole category from a word list like data/family.js:
   its buttons and games live in the page elements <prefix>Modes, <prefix>Groups, <prefix>Info,
   <prefix>Learn and <prefix>Game. It returns the function that opens the category.
   A new word-list category (food, house...) only needs a data file, a page section and one line here.
   extra.diagram = {info, render(box)} adds a first mode, "Diagram", drawn by render() into <prefix>Diagram.
   (extra.diagram.name changes the name of the button; extra.diagram.last puts it after the games, and the category still opens on Learn.)
   extra.calendar = {info, render(box)} adds a first mode, "Calendar", drawn by render() into <prefix>Calendar (see js/calendar.js).
   extra.games = [{id, name, info, make(), noGroups}] adds quiz modes of their own (make() returns the function that makes the questions, like runQuiz wants); noGroups hides the group buttons.
   extra.opposites = true adds the mode "Opposites" for word lists whose words have an "opp" (the Greek of their opposite). */
const GENDERS = {"ο":["g-m","masculine"], "η":["g-f","feminine"], "το":["g-n","neuter"], "τα":["g-n","neuter plural"], "οι":["g-p","plural"]};
const SINGULAR_ARTICLES = ["ο","η","το"];

function initVocab(prefix, data, extra={}){
  const el = id => $(prefix+id);
  const kp = extra.keyPrefix || prefix;     /* the name used in the keys of Progress and in the best scores (so that a page cut in two keeps its progress) */
  const all = data.groups.flatMap(g=>g.words.map(w=>{
    /* a noun starts with its "the" (ο, η, το, τα, οι); words like χθες or πάντα have none */
    const first = w.gr.split(" ")[0], art = GENDERS[first] ? first : null;
    return {...w, group:g.id, art, noun: art ? w.gr.slice(first.length+1) : w.gr};
  }));
  const MODES = [
    ...(extra.calendar ? [{id:"calendar", name:"Calendar", info:extra.calendar.info}] : []),
    ...(extra.diagram && !extra.diagram.last ? [{id:"diagram", name:extra.diagram.name || "Diagram", info:extra.diagram.info}] : []),
    {id:"learn",   name:"Learn",         info:"Tap a card to hear the word. A colored edge shows if a noun is ο, η or το."},
    {id:"cards",   name:"Flashcards",    info:"Tap a card to turn it, then say if you knew the word. The words you did not know come back."},
    {id:"g2e",     name:"Greek → English", info:"You see a Greek word. Tap its meaning."},
    {id:"e2g",     name:"English → Greek", info:"You see a meaning. Tap the Greek word."},
    {id:"pic",     name:"Picture",       info:"You see a picture. Tap the Greek word."},
    {id:"listen",  name:"Listen",        info:"Listen, then tap what it means."},
    {id:"write",   name:"Write it",      info:"Write the Greek word in Latin letters (without ο, η or το)."},
    {id:"dict",    name:"Dictation",     info:"Listen, then write the word with Greek letters."},
    {id:"article", name:"ο / η / το",    info:"Every Greek noun is masculine (ο), feminine (η) or neuter (το). Tap the right one."},
    ...(extra.opposites ? [{id:"opp", name:"Opposites", info:"You see a word. Tap its opposite."}] : []),
    ...(extra.diagram && extra.diagram.last ? [{id:"diagram", name:extra.diagram.name || "Diagram", info:extra.diagram.info}] : []),
    ...(extra.games || []).map(g=>({id:g.id, name:g.name, info:g.info}))
  ];
  const customGame = id => (extra.games || []).find(g=>g.id===id);
  const GROUPS = [...data.groups.map(g=>[g.id,g.name]), ...(data.groups.length>1 ? [["all","Everything"]] : [])];   /* one group only (Animals): no "Everything" button, it would be the same */
  const firstMode = extra.calendar ? "calendar" : extra.diagram && !extra.diagram.last ? "diagram" : "learn";
  let mode = firstMode, group = data.groups[0].id;

  const poolOf = () => all.filter(w=>group==="all" || w.group===group);
  /* the right word plus 3 other words of the same pool, in random order */
  function choices(right, pool, toOpt){
    return shuffle([toOpt(right,true), ...sample(pool.filter(w=>w!==right),3).map(w=>toOpt(w,false))]);
  }
  const greekOpt   = (w,ok) => ({html:`<span lang="el">${esc(w.gr)}</span>`, ok});
  const meaningOpt = (w,ok) => ({html:esc(txm(w.en)), ok});
  const hasPic = w => w.emoji || w.svg;
  const picture = w => w.svg ? `<span class="gm-big" aria-hidden="true">${garmentSvg(w.svg, w.color, 150)}</span>` : w.emoji ? `<span class="emoji" aria-hidden="true">${w.emoji}</span>` : "";
  const reveal = w => `<b lang="el">${esc(w.gr)}</b> <span class="lt">(${esc(w.lat)})</span><br>${esc(txm(w.en))}${w.art ? " · "+tx(GENDERS[w.art][1]) : ""}`;

  function questions(){
    const pool = poolOf();
    /* a group with fewer than 4 pictures borrows the pictures of the other groups */
    const picsHere = pool.filter(hasPic), withPic = picsHere.length>=4 ? picsHere : all.filter(hasPic);
    const nouns = pool.filter(w=>SINGULAR_ARTICLES.includes(w.art));   /* the ο / η / το game skips plurals */
    const next = deck(mode==="pic" ? withPic : mode==="article" ? nouns : pool);
    const byGr = new Map(all.map(w=>[w.gr, w]));
    return ()=>{
      const w = next();
      const base = {reveal:reveal(w), sayAfter:w.gr,
        item:{key:`v:${kp}:${sid(w.gr)}`, gr:w.gr, en:w.en, lat:w.lat, snd:sid(w.gr), cat:extra.cat || prefix}};
      if(mode==="opp"){
        const opp = byGr.get(w.opp), others = pool.filter(x=>x!==w && x!==opp && x.opp);
        return {...base, prompt:`<p class="word" lang="el">${esc(w.gr)}</p><p class="vinfo">${esc(txm(w.en))}</p>`, say:w.gr,
                options:shuffle([greekOpt(opp,true), ...sample(others,3).map(x=>greekOpt(x,false))]),
                reveal:`<b lang="el">${esc(w.gr)}</b> ↔ <b lang="el">${esc(opp.gr)}</b> <span class="lt">(${esc(opp.lat)})</span><br>${esc(txm(w.en))} ↔ ${esc(txm(opp.en))}`, sayAfter:[w.gr, opp.gr]};
      }
      if(mode==="g2e")    return {...base, prompt:`<p class="word s" lang="el">${esc(w.gr)}</p>`, say:w.gr, options:choices(w,pool,meaningOpt)};
      if(mode==="e2g")    return {...base, prompt:`${picture(w)}<p class="word s">${esc(txm(w.en))}</p>`, options:choices(w,pool,greekOpt)};
      if(mode==="pic")    return {...base, prompt:picture(w), options:choices(w,withPic,greekOpt)};
      if(mode==="listen") return {...base, prompt:`<p class="word s">🔊 ${esc(tx("What does it mean?"))}</p>`, say:w.gr, autoplay:true, options:choices(w,pool,meaningOpt), sayAfter:undefined};
      if(mode==="dict")   return {...base, prompt:`${picture(w)}<p class="word s">🔊 ${esc(tx("Write what you hear"))}</p>`, say:w.gr, autoplay:true, write:{answers:[w.gr, w.noun]},
                                  hint:`${esc(txm(w.en))}${w.art ? " · "+esc(tx(GENDERS[w.art][1])) : ""}`, sayAfter:w.gr};
      if(mode==="write")  return {...base, prompt:`${picture(w)}<p class="word s">${esc(txm(w.en))}</p>`, type:{answer:w.noun}};
      /* article */       return {...base, cols:3, prompt:`<p class="word" lang="el">${esc(w.noun)}</p><p class="vinfo">${esc(txm(w.en))}</p>`,
                              options:["ο","η","το"].map(a=>({html:`<span lang="el">${a}</span>`, ok:a===w.art}))};
    };
  }

  function renderLearn(){
    const box = el("Learn"); box.innerHTML = "";
    const legend = document.createElement("p");
    legend.className = "legend";
    const used = new Set(poolOf().map(w=>w.art));   /* only the articles of the words shown */
    legend.innerHTML = Object.entries(GENDERS).filter(([a])=>used.has(a)).map(([a,[cls,name]])=>`<span class="gdot ${cls}"></span><span lang="el">${a}</span> ${esc(tx(name))}`).join(" · ");
    if(legend.innerHTML) box.appendChild(legend);
    data.groups.filter(g=>group==="all" || g.id===group).forEach(g=>{
      const h = document.createElement("h2"); h.className = "sub"; h.textContent = tx(g.name); box.appendChild(h);
      const grid = document.createElement("div"); grid.className = "alpha"; box.appendChild(grid);
      all.filter(w=>w.group===g.id).forEach(w=>{
        const b = document.createElement("button");
        b.type = "button"; b.className = "acard"+(w.art ? " "+GENDERS[w.art][0] : "");
        b.innerHTML = `${w.svg ? `<span class="gm-sm" aria-hidden="true">${garmentSvg(w.svg, w.color, 64)}</span>` : w.emoji ? `<span class="emoji sm" aria-hidden="true">${w.emoji}</span>` : ""}<span class="big num" lang="el">${esc(w.gr)}</span><span class="lat"><span class="lt">${esc(w.lat)}</span></span><span class="s">${esc(txm(w.en))}</span>`;
        b.onclick = ()=>say(w.gr);
        const wrap = document.createElement("div"); wrap.className = "acardwrap";
        wrap.append(b, favButton({gr:w.gr, lat:w.lat, en:w.en, snd:sid(w.gr), cat:extra.cat || prefix, emoji:w.emoji}, "on-card"));
        grid.appendChild(wrap);
      });
    });
  }

  /* some modes make no sense for some groups: no pictures for the days, no ο / η / το for adverbs */
  function available(id){
    const pool = poolOf(), picsHere = pool.filter(hasPic).length, picsAll = all.filter(hasPic).length;
    if(id==="pic") return picsHere>=4 || (picsHere>=1 && picsAll>=10);
    if(id==="article") return pool.filter(w=>SINGULAR_ARTICLES.includes(w.art)).length>=3;
    if(id==="opp") return pool.filter(w=>w.opp).length>=5;
    return true;
  }
  function start(){
    el("Modes").querySelectorAll(".chip").forEach(b=>{ b.hidden = !available(b.dataset.mode); });
    if(!available(mode)) mode = firstMode;
    const m = MODES.find(x=>x.id===mode), learn = mode==="learn", diagram = mode==="diagram", calendar = mode==="calendar";
    el("Modes").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===mode));
    el("Groups").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.group===group));
    el("Info").textContent = tx(m.info);
    el("Learn").hidden = !learn; el("Game").hidden = learn || diagram || calendar;
    const custom = customGame(mode);
    el("Groups").hidden = diagram || calendar || !!(custom && custom.noGroups) || GROUPS.length<2;
    if(extra.diagram) el("Diagram").hidden = !diagram;
    if(extra.calendar) el("Calendar").hidden = !calendar;
    stopSound();
    if(diagram) extra.diagram.render(el("Diagram"));
    else if(calendar) extra.calendar.render(el("Calendar"));
    else if(learn) renderLearn();
    else if(mode==="cards") runFlashcards(el("Game"), {words:poolOf(), cat:extra.cat || prefix, keyPrefix:kp});
    else if(custom) runQuiz(el("Game"), {id:`${prefix}-${mode}`, make:custom.make()});
    else runQuiz(el("Game"), {id:`${kp}-${mode}-${group}`, make:questions()});
  }
  return function open(){
    const modes = el("Modes");
    if(!modes.children.length){
      MODES.forEach(m=>{
        const b = document.createElement("button");
        b.className = "chip"; b.type = "button"; b.dataset.mode = m.id; b.textContent = tx(m.name);
        b.onclick = ()=>{ mode = m.id; start(); };
        modes.appendChild(b);
      });
      GROUPS.forEach(([id,name])=>{
        const b = document.createElement("button");
        b.className = "chip"; b.type = "button"; b.dataset.group = id; b.textContent = tx(name);
        const n = id==="all" ? all.length : all.filter(w=>w.group===id).length;
        b.insertAdjacentHTML("beforeend", `<span class="n">${n}</span>`);
        b.onclick = ()=>{ group = id; start(); };
        el("Groups").appendChild(b);
      });
    }
    start();
  };
}

/* data/family.js has the groups family, inlaws and animals: the page "Family" shows the first two, the page "Animals" the last one */
const FAMILY_PAGE = {groups: FAMILY.groups.filter(g=>g.id!=="animals")};
const ANIMALS_PAGE = {groups: FAMILY.groups.filter(g=>g.id==="animals")};
/* "Family & animals" is now two categories: the words you already practiced move to the right one */
try{
  const animalWords = new Set(ANIMALS_PAGE.groups.flatMap(g=>g.words.map(w=>w.gr)));
  Progress.recat(r=>r.cat==="Family & animals" ? (animalWords.has(r.gr) ? "Animals" : "Family") : null);
}catch(e){}
const openAnimals = initVocab("ani", ANIMALS_PAGE, {cat:"Animals", keyPrefix:"fam"});
const openFamily = initVocab("fam", FAMILY_PAGE, {cat:"Family", diagram:{name:"Family tree",
  info:"A family tree: grandparents, parents, uncle and aunt, cousins, brothers and sisters. Tap a number or a word to hear it.", render:renderFamilyDiagram}});
const openFood = initVocab("food", FOOD, {cat:"Food & drinks", diagram:{name:"Market & table",
  info:"A market stall with fruit and vegetables, and a Greek taverna table. Tap a number or a word to hear it.", render:renderFoodDiagram}});
const openBody = initVocab("body", BODY, {cat:"Human body", diagram:{
  info:"Tap a number on the drawing, or a word in the list, to hear it. Tap a small drawing underneath to zoom in.",
  render:renderBodyDiagram
}});
const openTime = initVocab("time", TIME, {cat:"Time & dates", games:TIME_GAMES, diagram:{name:"Drawings", last:true,
  info:"The day, the four seasons and the week, in pictures. Tap a number or a word to hear it.", render:renderTimeDiagram}, calendar:{
  info:"The public holidays of Cyprus, day by day. Tap a day with a dot to see why it is a holiday.",
  render:renderHolidayCalendar
}});
const openHouse = initVocab("house", HOUSE, {cat:"House & clothes", diagram:{name:"Rooms",
  info:"A house cut open, and a kitchen table. Tap a number on the drawing, or a word in the list, to hear it.", render:renderHouseDiagram}});
const openClothes = initVocab("clothes", CLOTHES, {cat:"Clothes", diagram:{name:"Outfits",
  info:"Dressed people, with every garment numbered. Tap a number on the drawing, or a word in the list, to hear it.", render:renderClothesDiagram}});
const openCooking = initVocab("cooking", COOKING, {cat:"Cooking", diagram:{name:"Cutlery & table", last:true,
  info:"A laid table: plate, fork, knife, spoon, teaspoon, glass, cup and napkin. Tap a number on the drawing, or a word in the list, to hear it.", render:renderCookingDiagram}});
/* the button under the cooking words opens the recipes (the kind "Recipes" of the page Texts) */
$("cookingRecipes").onclick = ()=>{ textKind = "recipe"; textMode = "learn"; textGroup = textList().find(t=>t.kind==="recipe").id; location.hash = "texts"; };
const openCity = initVocab("city", CITY, {cat:"City & travel", games:CITY_GAMES, diagram:{name:"Map & drawings", last:true,
  info:"Cyprus and Greece on a map, and drawings of a street, a car and a plane. Tap a place or a number to hear its name.", render:renderCityHub}});
const openDirections = initVocab("dir", DIRECTIONS, {cat:"Directions", diagram:{name:"Drawings",
  info:"A crossroads seen from above with a compass, and nine places for a ball. Tap a number or a word to hear it.", render:renderDirectionsDiagram}});
const openNature =initVocab("nature", NATURE, {cat:"Weather & nature", diagram:{name:"Landscapes",
  info:"A landscape with mountains, a river and a forest, and a beach. Tap a number or a word to hear it.", render:renderNatureDiagram}});
const openJobs = initVocab("jobs", JOBS, {cat:"Jobs & hobbies", diagram:{name:"At work",
  info:"Twelve people at work, each with their tool. Tap a number or a word to hear the job.", render:renderJobsDiagram}});
const openOpposites = initVocab("opp", OPPOSITES, {cat:"Opposites", opposites:true});
