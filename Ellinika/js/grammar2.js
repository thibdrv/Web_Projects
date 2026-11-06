/* ---------- grammar: plural, adjectives, cases, negation, questions ----------
   Each topic has a Learn page, a Choose game and a Write game (with the Greek keyboard).
   The data is in data/grammar2.js. The Verbs topic is in js/grammar.js. */
const G2 = GRAMMAR2;
const G2_MODES = [
  {id:"learn",  name:"Learn",  info:"Read and tap to hear."},
  {id:"choose", name:"Choose", info:"Tap the right answer."},
  {id:"write",  name:"Write",  info:"Write the answer with Greek letters. Accents and capitals do not matter."}
];
let g2Mode = "learn";
const GENDER_NAMES = {m:"masculine", f:"feminine", n:"neuter"};
const GENDER_ARTICLES = {m:"ο", f:"η", n:"το"};

/* how many things this grammar can ask about (for the progress page) */
function grammar2Total(){
  return G2.plural.length + G2.adjectives.length*3 + G2.cases.length + G2.cases.filter(c=>c.g!=="n").length
       + G2.negation.length + G2.stop.length + G2.questions.length;
}
/* the thing a question is about, kept for the reviews: a Greek text and its meaning in both languages */
const g2Item = (key, gr, en, fr, lat) => ({key:"g2:"+key, gr, en, fr, lat:lat||translit(gr), snd:sid(gr), cat:"Grammar"});
const lowerFirst = s => s.charAt(0).toLowerCase() + s.slice(1);
const greekOptions = (right, wrong) => shuffle([{html:`<span lang="el">${esc(right)}</span>`,ok:true}, ...wrong.map(w=>({html:`<span lang="el">${esc(w)}</span>`,ok:false}))]);
const pill = text => `<p class="tw"><span class="pill">${esc(tx(text))}</span></p>`;

/* a small block of explanation at the top of a Learn page */
function explain(box, paragraphs){
  const div = document.createElement("div"); div.className = "panel";
  div.innerHTML = paragraphs.map(p=>`<p>${p}</p>`).join("");
  box.appendChild(div);
}
/* a tappable line: Greek text(s), small text under it; tapping plays the sounds */
function g2Line(box, html, sub, sounds){
  const b = document.createElement("button");
  b.type = "button"; b.className = "line";
  b.innerHTML = `<span class="ltxt"><b lang="el">${html}</b><span>${sub}</span></span><span aria-hidden="true">🔊</span>`;
  b.onclick = ()=>say(sounds);
  box.appendChild(b);
}
const heading = (box, text) => { const h = document.createElement("h2"); h.className = "sub"; h.textContent = tx(text); box.appendChild(h); };

/* ======================= the topics ======================= */
const TOPICS = {

  /* ----- plural of nouns ----- */
  plural:{
    intro:"In the plural, a Greek noun changes its ending and its article: ο φίλος → οι φίλοι.",
    learn(box){
      explain(box, [esc(tx("The article for the plural is οι for masculine and feminine nouns, τα for neuter nouns. The ending depends on the word.")),
                    `<b lang="el">-ος → -οι · -ας → -ες · -ής → -ές · -α/-η → -ες · -η → -εις · -ί → -ιά · -ι → -ια · -ο → -α</b>`]);
      const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
      G2.plural.forEach(e=>g2Line(list, `${esc(e.sg)} → ${esc(e.pl)}`, `${esc(pick(e))} · ${esc(e.rule)}`, [e.sg, e.pl]));
    },
    questions(mode){
      const next = deck(G2.plural);
      return ()=>{
        const e = next();
        const base = {item:g2Item(`pl:${e.sg}`, e.pl, `${e.en} (plural)`, `${e.fr} (pluriel)`), reveal:`<b lang="el">${esc(e.sg)} → ${esc(e.pl)}</b><br>${esc(e.rule)}`,
                      sayAfter:e.pl,
                      prompt:`${pill("Plural")}<p class="word s" lang="el">${esc(e.sg)}</p><p class="vinfo">${esc(pick(e))}</p>`};
        if(mode==="write") return {...base, write:{answers:[e.pl]}, hint:`${esc(tx("Rule"))}: <b lang="el">${esc(e.rule)}</b>`};
        return {...base, options:greekOptions(e.pl, e.bad)};
      };
    }
  },

  /* ----- adjectives agree with their noun ----- */
  adjectives:{
    intro:"An adjective agrees with its noun: masculine, feminine or neuter, like the article.",
    learn(box){
      explain(box, [esc(tx("Most adjectives have three forms. Use the one that matches the noun: ο μεγάλος άντρας (the big man), η μεγάλη γυναίκα (the big woman), το μεγάλο παιδί (the big child)."))]);
      G2.adjectives.forEach(a=>{
        const card = document.createElement("div"); card.className = "vcard";
        card.innerHTML = `<div class="vhead"><b lang="el">${esc(a.m)}</b><span>${esc(pick(a))}</span></div>`;
        const rows = document.createElement("div"); rows.className = "vrows";
        ["m","f","n"].forEach(g=>{
          const b = document.createElement("button"); b.type = "button"; b.className = "vrow";
          b.innerHTML = `<span class="pn" lang="el">${GENDER_ARTICLES[g]} <span class="muted">(${esc(tx(GENDER_NAMES[g]))})</span></span><span class="vf" lang="el">${esc(a[g])}</span><span class="vl">${esc(translit(a[g]))}</span>`;
          b.onclick = ()=>say(a[g]);
          rows.appendChild(b);
        });
        card.appendChild(rows); box.appendChild(card);
      });
    },
    questions(mode){
      const next = deck(G2.adjectives);
      return ()=>{
        const a = next();
        const nouns = G2.adjNouns.filter(n=>!a.people || n.animate), n = oneOf(nouns), form = a[n.g];
        const base = {item:g2Item(`adj:${a.m}:${n.g}`, form, `${a.en} · ${GENDER_NAMES[n.g]}`, `${a.fr} (${n.g==="m"?"masculin":n.g==="f"?"féminin":"neutre"})`),
                      reveal:`<b lang="el">${esc(n.art)} ${esc(form)} ${esc(n.noun)}</b><br>${esc(pick(a))} · ${esc(pick(n))}`,
                      sayAfter:form,
                      prompt:`${pill("Adjective")}<p class="word s" lang="el">${esc(n.art)} <span class="blank">…</span> ${esc(n.noun)}</p><p class="vinfo"><b lang="el">${esc(a.m)}</b> · ${esc(pick(a))} <span class="muted">(${esc(pick(n))})</span></p>`};
        if(mode==="write") return {...base, write:{answers:[form]}, hint:`${esc(tx("The noun is"))} ${esc(tx(GENDER_NAMES[n.g]))}: <b lang="el">${esc(n.art)}</b>`};
        return {...base, options:greekOptions(form, [a.m,a.f,a.n,a.mpl].filter(x=>x!==form))};
      };
    }
  },

  /* ----- cases: the subject and the object of a sentence ----- */
  cases:{
    intro:"The subject of a sentence is in the nominative, the object in the accusative: the article changes.",
    learn(box){
      explain(box, [esc(tx("The subject does the action (the nominative): ο φίλος βλέπει. The object receives it (the accusative): βλέπω τον φίλο.")),
                    esc(tx("The article changes:")) + ` <b lang="el">ο → τον · η → τη(ν) · το → το</b>`,
                    esc(tx("Feminine: την before a vowel and before κ π τ ξ ψ (και μπ ντ γκ τσ τζ), otherwise τη. The neuter does not change."))]);
      heading(box, "Examples");
      const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
      G2.cases.forEach(c=>g2Line(list, `${esc(c.nom)} → ${esc(c.acc)}`, `${esc(pick(c))} · ${esc(pick({en:c.sentEn, fr:c.sentFr}))}`, [c.nom, c.acc]));
    },
    questions(mode){
      const pool = mode==="write" ? G2.cases.filter(c=>c.g!=="n") : G2.cases;
      const next = deck(pool);
      return ()=>{
        const c = next(), accArt = c.acc.split(" ")[0], nomArt = c.nom.split(" ")[0];
        const askForm = mode==="write" || (c.g!=="n" && Math.random()<0.5);
        if(askForm){
          const wrong = [`${accArt} ${c.nomNoun}`, `${nomArt} ${c.accNoun}`, `${c.g==="m" ? "η" : "ο"} ${c.accNoun}`];
          const base = {item:g2Item(`acc:${c.nom}`, c.acc, `${c.en} · accusative`, `${c.fr} (accusatif)`),
                        prompt:`${pill("Accusative (the object)")}<p class="word s" lang="el">${esc(c.nom)}</p><p class="vinfo">${esc(pick(c))}</p>`,
                        reveal:`<b lang="el">${esc(c.nom)} → ${esc(c.acc)}</b><br>${esc(pick({en:c.sentEn, fr:c.sentFr}))}`, sayAfter:c.acc};
          if(mode==="write") return {...base, write:{answers:[c.acc]}, hint:`<b lang="el">ο → τον · η → τη(ν) · το → το</b>`};
          return {...base, options:greekOptions(c.acc, wrong)};
        }
        /* which article goes in the sentence? only the right one is possible */
        const others = c.g==="m" ? ["ο","η","την"] : c.g==="f" ? ["ο","τον","το"] : ["ο","τον","η"];
        return {item:g2Item(`art:${c.nom}`, c.sentence, c.sentEn, c.sentFr),
                prompt:`${pill("Which article?")}<p class="word s" lang="el">Βλέπω <span class="blank">…</span> ${esc(c.accNoun)}.</p><p class="vinfo">${esc(pick({en:c.sentEn, fr:c.sentFr}))}</p>`,
                options:greekOptions(accArt, others),
                reveal:`<b lang="el">${esc(c.sentence)}</b><br>${esc(tx(c.g==="m" ? "masculine" : c.g==="f" ? "feminine" : "neuter"))}`, sayAfter:c.sentence};
      };
    }
  },

  /* ----- negation: δεν for statements, μη(ν) for orders ----- */
  negation:{
    intro:"Put δεν before the verb to say no. For an order (\"don't!\") use μη or μην.",
    learn(box){
      explain(box, [esc(tx("To make a statement negative, put δεν just before the verb: μιλάω → δεν μιλάω.")),
                    esc(tx("For an order (don't!) use μη or μην before the verb: μην ανησυχείς! (don't worry!)")),
                    esc(tx("μην goes before a vowel and before κ π τ ξ ψ, μη before the other letters."))]);
      heading(box, "With δεν");
      const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
      G2.negation.forEach(n=>g2Line(list, `${esc(n.pos)} → ${esc(n.neg)}`, `${esc(pick({en:n.enPos, fr:n.frPos}))} → ${esc(pick({en:n.enNeg, fr:n.frNeg}))}`, [n.pos, n.neg]));
      heading(box, "With μη or μην");
      const list2 = document.createElement("div"); list2.className = "lines"; box.appendChild(list2);
      G2.stop.forEach(s=>g2Line(list2, esc(s.say), esc(pick(s)), s.say));
    },
    questions(mode){
      const nextNeg = deck(G2.negation), nextStop = deck(G2.stop);
      return ()=>{
        if(Math.random()<0.5){
          const n = nextNeg(), tokens = n.pos.replace(/[.!?]$/,"").split(" ");
          const base = {item:g2Item(`neg:${n.pos}`, n.neg, n.enNeg, n.frNeg),
                        prompt:`${pill("Make it negative")}<p class="word s" lang="el">${esc(n.pos)}</p><p class="vinfo">${esc(pick({en:n.enPos, fr:n.frPos}))}</p>`,
                        reveal:`<b lang="el">${esc(n.neg)}</b><br>${esc(pick({en:n.enNeg, fr:n.frNeg}))}`, sayAfter:n.neg};
          if(mode==="write") return {...base, write:{answers:[n.neg]}, hint:esc(tx("Put δεν just before the verb."))};
          const wrong = [`Όχι ${lowerFirst(n.pos)}`, `${tokens[0]} δεν${tokens.length>1 ? " "+tokens.slice(1).join(" ") : ""}.`, `Μην ${lowerFirst(n.pos)}`];
          return {...base, options:greekOptions(n.neg, wrong)};
        }
        const s = nextStop();
        const base = {item:g2Item(`stop:${s.say}`, s.say, s.en, s.fr),
                      prompt:`${pill("μη or μην?")}<p class="word s" lang="el">${esc(s.blank)}</p><p class="vinfo">${esc(pick(s))}</p>`,
                      reveal:`<b lang="el">${esc(s.say)}</b><br>${esc(tx("μην goes before a vowel and before κ π τ ξ ψ, μη before the other letters."))}`, sayAfter:s.say};
        if(mode==="write") return {...base, write:{answers:[s.answer]}, hint:esc(tx("μην goes before a vowel and before κ π τ ξ ψ, μη before the other letters."))};
        return {...base, options:greekOptions(s.answer, ["μη","μην","δεν","όχι"].filter(x=>x!==s.answer).slice(0,3))};
      };
    }
  },

  /* ----- questions ----- */
  questions:{
    intro:"A Greek question keeps the word order of a statement: the voice goes up, and ; ends the sentence.",
    learn(box){
      explain(box, [esc(tx("There is no special word order for a question: Έχεις αδερφή; (Do you have a sister?). The voice goes up and the question mark is ; in Greek.")),
                    esc(tx("To ask for information, start with a question word."))]);
      heading(box, "Question words");
      const words = document.createElement("div"); words.className = "alpha"; box.appendChild(words);
      G2.qwords.forEach(w=>{
        const b = document.createElement("button"); b.type = "button"; b.className = "acard";
        b.innerHTML = `<span class="big num" lang="el">${esc(w.gr)}</span><span class="lat">${esc(translit(w.gr))}</span><span class="s">${esc(pick(w))}</span>`;
        b.onclick = ()=>say(w.gr);
        words.appendChild(b);
      });
      heading(box, "Examples");
      const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
      G2.questions.forEach(q=>g2Line(list, esc(q.say), esc(pick(q)), q.say));
    },
    questions(mode){
      const next = deck(G2.questions);
      return ()=>{
        const q = next();
        const base = {item:g2Item(`q:${q.say}`, q.say, q.en, q.fr),
                      prompt:`${pill("Question word")}<p class="word s" lang="el">${esc(q.blank)}</p><p class="vinfo">${esc(pick(q))}</p>`,
                      reveal:`<b lang="el">${esc(q.say)}</b><br>${esc(pick(q))}`, sayAfter:q.say};
        if(mode==="write") return {...base, write:{answers:[q.answer]}, hint:esc(tx("Think about what the sentence asks: where, when, why, who, how…"))};
        const wrong = sample(G2.qwords.map(w=>w.gr).filter(w=>w!==q.answer), 3);
        return {...base, options:greekOptions(q.answer, wrong)};
      };
    }
  }
};

/* ======================= the screen ======================= */
function renderTopic(topic){
  const T = TOPICS[topic];
  const modes = G2_MODES.filter(m=>!T.modes || T.modes.includes(m.id));
  if(!modes.some(m=>m.id===g2Mode)) g2Mode = "learn";
  chipRow("gModes", modes.map(m=>[m.id,tx(m.name)]), g2Mode, id=>{ g2Mode=id; renderGrammar(); });
  $("gInfo").textContent = tx(T.intro);
  const learn = g2Mode==="learn";
  $("gLearn").hidden = !learn; $("gGame").hidden = learn;
  stopSound();
  if(learn){ const box = $("gLearn"); box.innerHTML = ""; T.learn(box); }
  else runQuiz($("gGame"), {id:`g2-${topic}-${g2Mode}`, make:T.questions(g2Mode)});
}
