/* ---------- grammar: the genitive and "Which case?" ----------
   Two more topics of the Grammar page, built like the topics of js/grammar2.js (Learn, Choose, Write) from data/grammar4.js:
   - Genitive: the "of" form (το σπίτι του φίλου): the article changes (ο → του, η → της, το → του) and so does the ending of the noun.
   - Which case?: a sentence with one word highlighted; tap its case (nominative, accusative, genitive or vocative).
   They use the helpers of js/grammar2.js (explain, g2Line, g2Item, greekOptions, pill, heading). */
const G4 = GRAMMAR4;
const G4_CASE = Object.fromEntries(G4.caseNames.map(c=>[c.id, c]));
const caseRole = c => pick({en:c.role, fr:c.roleFr});
const caseLabel = c => ({html:`<span lang="el">${esc(c.gr)}</span><br><small class="muted">${esc(tx(c.en))}</small>`});

/* a sentence with the word to look at inside <mark> */
function markPhrase(sentence, phrase){
  const i = sentence.toLowerCase().indexOf(phrase.toLowerCase());
  if(i<0) return esc(sentence);
  return esc(sentence.slice(0,i)) + `<mark>${esc(sentence.slice(i, i+phrase.length))}</mark>` + esc(sentence.slice(i+phrase.length));
}

TOPICS.genitive = {
  intro:"The genitive says \"of\" or \"belonging to\": το σπίτι του φίλου (the friend's house).",
  learn(box){
    explain(box, [esc(tx("The genitive shows who something belongs to: το σπίτι του φίλου (the house of the friend).")),
                  esc(tx("The article changes:")) + ` <b lang="el">ο → του · η → της · το → του</b>`,
                  esc(tx("The noun changes its ending too:")) + ` <b lang="el">-ος → -ου · -ας → -α · -ης → -η · -α → -ας · -η → -ης · -ι → -ιού · -ο → -ου</b>`]);
    heading(box, "Examples");
    const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
    G4.genitive.forEach(e=>g2Line(list, `${esc(e.nom)} → ${esc(e.gen)}`, `${esc(pick(e))} · ${esc(e.rule)}`, [e.nom, e.gen]));
    heading(box, "In sentences");
    const list2 = document.createElement("div"); list2.className = "lines"; box.appendChild(list2);
    G4.genitive.slice(0,20).forEach(e=>g2Line(list2, esc(e.sentence), esc(pick({en:e.sentEn, fr:e.sentFr})), e.sentence));
  },
  questions(mode){
    const next = deck(G4.genitive);
    return ()=>{
      const e = next();
      const ask = mode==="write" || Math.random()<.6;
      if(ask){
        const base = {item:g2Item(`gen:${e.nom}`, e.gen, `${e.en} · genitive`, `${e.fr} (génitif)`),
                      prompt:`${pill("Genitive (of)")}<p class="word s" lang="el">${esc(e.nom)}</p><p class="vinfo">${esc(pick(e))}</p>`,
                      reveal:`<b lang="el">${esc(e.nom)} → ${esc(e.gen)}</b><br>${esc(pick({en:e.sentEn, fr:e.sentFr}))}`, sayAfter:e.sentence};
        if(mode==="write") return {...base, write:{answers:[e.gen]}, hint:`<b lang="el">ο → του · η → της · το → του</b> · ${esc(e.rule)}`};
        return {...base, options:greekOptions(e.gen, e.bad)};
      }
      /* which article of the genitive? */
      const article = e.gen.split(" ")[0], nounGen = e.gen.split(" ").slice(1).join(" ");
      const blanked = e.sentence.replace(e.gen, `<span class="blank">…</span> ${nounGen}`).replace(/^(.*?)(<span)/, (m,a,b)=>esc(a)+b);
      const others = sample(["του","της","τον","την","το"].filter(a=>a!==article && !(article==="του" && a==="του")), 3);
      return {item:g2Item(`genart:${e.nom}`, e.sentence, e.sentEn, e.sentFr),
              prompt:`${pill("Which article?")}<p class="word s" lang="el">${blanked}</p><p class="vinfo">${esc(pick({en:e.sentEn, fr:e.sentFr}))}</p>`,
              options:greekOptions(article, others),
              reveal:`<b lang="el">${esc(e.sentence)}</b><br>${esc(tx(e.g==="m" ? "masculine" : e.g==="f" ? "feminine" : "neuter"))}`, sayAfter:e.sentence};
    };
  }
};

/* the sentences of the game "Which case?", with the word to look at */
function whichCasePool(){
  return {
    nom: G4.nominative.map(n=>({id:"nom", sentence:n.say, phrase:n.phrase})),
    acc: G2.cases.map(c=>({id:"acc", sentence:c.sentence, phrase:c.acc, en:c.sentEn, fr:c.sentFr})),
    gen: G4.genitive.map(e=>({id:"gen", sentence:e.sentence, phrase:e.gen, en:e.sentEn, fr:e.sentFr})),
    voc: G4.vocative.map(v=>({id:"voc", sentence:v.say, phrase:v.phrase, en:v.en, fr:v.fr}))
  };
}
TOPICS.whichcase = {
  intro:"A Greek noun has four cases. Look at the highlighted word and tap its case.",
  modes:["learn","choose"],
  learn(box){
    explain(box, [esc(tx("In Greek the form of the article and of the noun shows what the word does in the sentence. These are the four cases:"))]);
    G4.caseNames.forEach(c=>{
      const card = document.createElement("div"); card.className = "vcard";
      card.innerHTML = `<div class="vhead"><b lang="el">${esc(c.gr)}</b><span>${esc(tx(c.en))} · ${esc(caseRole(c))}</span></div>`;
      const rows = document.createElement("div"); rows.className = "vrows";
      const b = document.createElement("button"); b.type = "button"; b.className = "vrow";
      b.innerHTML = `<span class="pn" lang="el">${esc(tx("Example"))}</span><span class="vf" lang="el">${esc(c.ex)}</span><span class="vl">${esc(translit(c.ex))}</span>`;
      b.onclick = ()=>say(c.ex);
      rows.appendChild(b); card.appendChild(rows); box.appendChild(card);
    });
    heading(box, "Examples");
    const pool = whichCasePool(), list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
    ["nom","acc","gen","voc"].forEach(id=>pool[id].slice(0,3).forEach(s=>g2Line(list, markPhrase(s.sentence, s.phrase), `${esc(G4_CASE[id].gr)} · ${esc(tx(G4_CASE[id].en))}`, s.sentence)));
  },
  questions(){
    const pool = whichCasePool(), decks = Object.fromEntries(Object.entries(pool).map(([id,list])=>[id, deck(list)]));
    return ()=>{
      const id = oneOf(["nom","acc","gen","voc"]), s = decks[id](), c = G4_CASE[id];
      const meaning = s.en ? `<p class="vinfo">${esc(pick({en:s.en, fr:s.fr}))}</p>` : "";
      return {item:g2Item(`case:${s.sentence}`, s.sentence, `${c.en}: ${s.phrase}`, `${c.fr} : ${s.phrase}`),
              prompt:`${pill("Which case?")}<p class="word s" lang="el">${markPhrase(s.sentence, s.phrase)}</p>${meaning}`,
              options:shuffle(G4.caseNames.map(x=>({...caseLabel(x), ok:x.id===id}))), cols:2,
              reveal:`<b lang="el">${esc(s.phrase)}</b> = <b lang="el">${esc(c.gr)}</b> (${esc(tx(c.en))})<br>${esc(caseRole(c))}`, sayAfter:s.sentence};
    };
  }
};
G_TOPICS.push(["genitive","Genitive"], ["whichcase","Which case?"]);
