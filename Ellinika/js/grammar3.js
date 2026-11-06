/* ---------- grammar: prepositions, possessives, imperative ----------
   Three more topics of the Grammar page, built from data/grammar3.js. They all work the same way:
   a sentence with a missing word (___): choose it, or write it with Greek letters.
   They use the helpers of js/grammar2.js (explain, g2Line, g2Item, greekOptions, pill, heading). */
const G3 = GRAMMAR3;
function grammar3Total(){ return Object.values(G3).reduce((n,t)=>n+t.items.length, 0); }

/* the cards of the words of a topic: a big Greek word and its meaning */
function wordCards(box, list, show){
  const grid = document.createElement("div"); grid.className = "alpha"; box.appendChild(grid);
  list.forEach(w=>{
    const b = document.createElement("button"); b.type = "button"; b.className = "acard";
    b.innerHTML = `<span class="big num" lang="el">${show(w)}</span><span class="s">${esc(pick(w))}</span>`;
    b.onclick = ()=>say(w.sounds);
    grid.appendChild(b);
  });
}

/* a topic with a text, the cards of its words, the example sentences and the missing-word game */
function gapTopic(key, cfg){
  const data = G3[key];
  return {
    intro: cfg.intro,
    learn(box){
      explain(box, cfg.explain.map(t=>t.startsWith("<") ? t : esc(tx(t))));
      heading(box, cfg.wordsTitle);
      wordCards(box, data.words.map(w=>({...w, sounds:cfg.sounds(w)})), cfg.show);
      heading(box, "Examples");
      const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
      data.items.forEach(it=>g2Line(list, esc(it.say), esc(pick(it)), it.say));
    },
    questions(mode){
      const next = deck(data.items), answers = [...new Set(data.items.map(i=>i.answer))];
      return ()=>{
        const q = next();
        const base = {item:g2Item(`${key}:${q.say}`, q.say, q.en, q.fr),
                      prompt:`${pill(cfg.pill)}<p class="word s" lang="el">${esc(q.blank)}</p><p class="vinfo">${esc(pick(q))}</p>`,
                      reveal:`<b lang="el">${esc(q.say)}</b><br>${esc(pick(q))}`, sayAfter:q.say};
        if(mode==="write") return {...base, write:{answers:[q.answer]}, hint:esc(tx(cfg.hint))};
        return {...base, options:greekOptions(q.answer, sample(answers.filter(a=>a!==q.answer), 3))};
      };
    }
  };
}

TOPICS.prepositions = gapTopic("prepositions", {
  intro:"A preposition goes before a noun: in, from, with, for... Σε joins the article: σε + το = στο.",
  explain:["Prepositions are small words that go before a noun: από την Κύπρο (from Cyprus), με τον φίλο μου (with my friend).",
           `<b lang="el">σε + τον → στον · σε + την → στην · σε + το → στο · σε + τη → στη</b>`,
           "σε (in, at, to) joins the article that follows it. Tap a card to hear the word."],
  wordsTitle:"Prepositions", show:w=>esc(w.gr), sounds:w=>w.gr,
  pill:"Which word is missing?", hint:"Think about the meaning of the sentence: where, from where, with whom, for whom, without what, until when."
});
TOPICS.possessives = gapTopic("possessives", {
  intro:"To say my, your, his... put μου, σου, του... after the noun: το σπίτι μου.",
  explain:["In Greek the small word comes after the noun, with the article in front: το σπίτι μου (my house), ο φίλος σου (your friend).",
           `<b lang="el">μου · σου · του · της · μας · σας · τους</b>`,
           "του is for a man (his) and της for a woman (her). σας is for several people, or for one person you speak to politely."],
  wordsTitle:"My, your, his…", show:w=>esc(w.gr), sounds:w=>w.gr,
  pill:"Which word is missing?", hint:"Who does it belong to? me → μου, you → σου, him → του, her → της, us → μας, you (several) → σας, them → τους."
});
TOPICS.imperative = gapTopic("imperative", {
  intro:"To give an order, use the imperative: έλα! (come!) for one person you know, ελάτε! for several people or politely.",
  explain:["The imperative is the form of an order: Κοίτα! (Look!), Άκου! (Listen!). Add -τε for several people or to be polite: κοιτάξτε, ακούστε.",
           "Some very common verbs are irregular: έλα / ελάτε (come), πες / πείτε (say), φάε / φάτε (eat), πιες / πιείτε (drink).",
           "For a negative order use μη(ν): Μην φεύγεις! (Don't leave!) (see the topic Negation)."],
  wordsTitle:"Orders", show:w=>`${esc(w.sg)} · ${esc(w.pl)}`, sounds:w=>[w.sg, w.pl],
  pill:"Which order?", hint:"The verb for one person you know ends in -ε or -α; for several people or politely it ends in -τε."
});
