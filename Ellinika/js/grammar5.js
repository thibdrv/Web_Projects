/* ---------- grammar: the perfect, irregular verbs, the articles ----------
   Three more topics of the Grammar page, built from data/grammar5.js (made by gen_grammar5.py). They use the helpers of js/grammar2.js
   (explain, g2Line, g2Item, greekOptions, pill, heading, deck) and add themselves to TOPICS and G_TOPICS.
   - Perfect: έχω + a form that never changes (έχω γράψει = I have written): Learn, Choose, Write.
   - Irregular verbs: the past and the future of verbs whose past does not look like the present (πάω → πήγα): Learn, Choose (both ways), Write.
   - Articles: ο / η / το, τον / την / το, του / της... in the singular and the plural, and ένας / μία / ένα: tables, then a game with a noun, a case and a number. */
const G5 = GRAMMAR5;
function grammar5Total(){ return G5.perfect.verbs.length*6 + G5.irregular.items.length*2 + G5.articles.nouns.length*3; }
G_TOPICS.push(["perfect","Perfect"], ["irregular","Irregular verbs"], ["articles","Articles"]);

/* ----- the perfect ----- */
TOPICS.perfect = {
  intro:"The perfect says what you have done: έχω + a short form that never changes. έχω γράψει = I have written.",
  learn(box){
    explain(box, [esc(tx("To say what you have done, use έχω (I have) and a short form that stays the same for every person. Only έχω changes.")),
                  `<b lang="el">έχω γράψει · έχεις γράψει · έχει γράψει · έχουμε γράψει · έχετε γράψει · έχουν γράψει</b>`,
                  esc(tx("The short form is the one you hear after θα for “he, she, it”: θα γράψει → έχω γράψει.")),
                  `<b lang="el">έγραψα</b> = ${esc(tx("I wrote (finished, at a given time)"))} · <b lang="el">έγραφα</b> = ${esc(tx("I was writing, I used to write"))} · <b lang="el">έχω γράψει</b> = ${esc(tx("I have written (it matters now)"))}`]);
    heading(box, "Verbs");
    const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
    G5.perfect.verbs.forEach(v=>g2Line(list, `${esc(v.gr)} → ${esc(v.forms[0])}`, `${esc(pick(v))} · ${esc(v.forms.slice(1).join(" · "))}`, v.forms));
  },
  questions(mode){
    const next = deck(G5.perfect.verbs);
    return ()=>{
      const v = next(), p = Math.floor(Math.random()*6), right = v.forms[p];
      const base = {item:g2Item(`perf:${v.id}:${p}`, right, `${v.en} (perfect, ${G.persons[p].en})`, `${v.fr} (parfait, ${G.persons[p].en})`),
        prompt:`${pill("Perfect")}<p class="word s" lang="el">${esc(v.gr)}</p><p class="vinfo">${esc(pick(v))} · ${esc(personName(p))} (${esc(txm(G.persons[p].en))})</p>`,
        reveal:`<b lang="el">${esc(right)}</b><br>${esc(pick(v))}`, sayAfter:right};
      if(mode==="write") return {...base, write:{answers:[right]}, hint:`${esc(tx("Rule"))}: <b lang="el">έχω ${esc(v.part)}</b> → ${esc(tx("change only έχω"))}`};
      return {...base, options:greekOptions(right, sample(v.forms.filter((f,i)=>i!==p), 3))};
    };
  }
};

/* ----- irregular verbs ----- */
TOPICS.irregular = {
  intro:"Some very common verbs have a past that does not look like the present: πάω → πήγα. Learn them by heart.",
  learn(box){
    explain(box, [esc(tx("The most common verbs are often irregular: their past (and the short form after θα) is built on another stem. You will meet them all the time.")),
                  `<b lang="el">πάω → πήγα → θα πάω · τρώω → έφαγα → θα φάω · λέω → είπα → θα πω</b>`,
                  esc(tx("Each line shows the present, the past (I) and the future (I). Tap a line to hear the three forms."))]);
    const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
    G5.irregular.items.forEach(it=>g2Line(list, `${esc(it.gr)} → ${esc(it.past)} → ${esc(it.future)}`, esc(pick(it)), it.forms));
  },
  questions(mode){
    const items = G5.irregular.items, next = deck(items);
    return ()=>{
      const it = next(), reverse = mode==="choose" && Math.random()<.4;
      const base = {item:g2Item(`irr:${it.gr}`, it.past, `${it.en} (past, I)`, `${it.fr} (passé, je)`),
        reveal:`<b lang="el">${esc(it.gr)} → ${esc(it.past)} → ${esc(it.future)}</b><br>${esc(pick(it))}`, sayAfter:it.forms};
      if(reverse) return {...base, prompt:`${pill("Which verb?")}<p class="word s" lang="el">${esc(it.past)}</p><p class="vinfo">${esc(tx("past (I)"))}</p>`,
        options:greekOptions(it.gr, sample(items.filter(x=>x!==it).map(x=>x.gr), 3))};
      const q = {...base, prompt:`${pill("Past")}<p class="word s" lang="el">${esc(it.gr)}</p><p class="vinfo">${esc(pick(it))} · ${esc(tx("past (I)"))}</p>`};
      if(mode==="write") return {...q, write:{answers:[it.past]}, hint:`${esc(tx("Future"))}: <b lang="el">${esc(it.future)}</b>`};
      return {...q, options:greekOptions(it.past, sample(items.filter(x=>x!==it).map(x=>x.past), 3))};
    };
  }
};

/* ----- the articles ----- */
const CASES5 = [["nom","Nominative"],["acc","Accusative"],["gen","Genitive"]];
const NUMBERS5 = [["sg","singular"],["pl","plural"]];
const articleOf = (g, c, number, kind) => kind==="def" ? G5.articles.definite[g][c][number==="sg" ? 0 : 1] : G5.articles.indefinite[g][c];
TOPICS.articles = {
  intro:"The article changes with the gender, the case and the number: ο φίλος, τον φίλο, του φίλου.",
  learn(box){
    explain(box, [esc(tx("The article tells the gender (ο masculine, η feminine, το neuter) and changes with the case: the subject (nominative), the object (accusative) and “of” (genitive).")),
                  `<b lang="el">σε + τον → στον · σε + την → στην · σε + το → στο</b>`,
                  esc(tx("Tap a form to hear it."))]);
    const cell = (t, sounds) => `<button type="button" class="artcell" data-say="${esc(sounds)}"><b lang="el">${esc(t)}</b></button>`;
    const table = (g, title) => {
      const rows = CASES5.map(([c,name])=>`<tr><th>${esc(tx(name))}</th><td>${cell(articleOf(g,c,"sg","def"), articleOf(g,c,"sg","def"))}</td><td>${cell(articleOf(g,c,"pl","def"), articleOf(g,c,"pl","def"))}</td>
        <td>${cell(articleOf(g,c,"sg","indef"), articleOf(g,c,"sg","indef"))}</td></tr>`).join("");
      return `<div class="panel arttable g-${g}"><h3 class="sub" style="margin-top:0"><span class="gdot g-${g}"></span>${esc(tx(title))}</h3>
        <table><thead><tr><th></th><th>${esc(tx("the (singular)"))}</th><th>${esc(tx("the (plural)"))}</th><th>${esc(tx("a, an"))}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    };
    const wrap = document.createElement("div"); wrap.innerHTML = table("m","masculine") + table("f","feminine") + table("n","neuter"); box.appendChild(wrap);
    wrap.querySelectorAll(".artcell").forEach(b=>b.onclick = ()=>say(b.dataset.say));
    heading(box, "Examples");
    const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
    [["ο φίλος", "the friend (he is here)"], ["βλέπω τον φίλο", "I see the friend"], ["το σπίτι του φίλου", "the friend's house"],
     ["η γυναίκα", "the woman"], ["βλέπω τη γυναίκα", "I see the woman"], ["το παιδί", "the child"], ["τα παιδιά", "the children"], ["το όνομα των παιδιών", "the name of the children"]]
      .forEach(([gr,en])=>g2Line(list, esc(gr), esc(txm(en)), gr));
  },
  questions(mode){
    const nouns = G5.articles.nouns, next = deck(nouns);
    const allArt = [...new Set(["ο","η","το","οι","τα","τον","την","τους","τις","του","της","των"])];
    return ()=>{
      const n = next(), kind = Math.random()<.25 ? "indef" : "def", number = kind==="indef" ? "sg" : oneOf(["sg","pl"]), c = oneOf(CASES5)[0];
      const right = articleOf(n.g, c, number, kind);
      const pool = kind==="def" ? allArt : [...new Set(["ένας","μία","ένα","έναν","ενός","μίας"])];
      const base = {item:g2Item(`art:${n.gr}:${c}:${number}:${kind}`, right, `${n.en} (${CASES5.find(x=>x[0]===c)[1].toLowerCase()}, ${number==="sg" ? "singular" : "plural"})`, `${n.fr} (${c}, ${number})`),
        prompt:`${pill("Which article?")}<p class="word s" lang="el">${esc(n.gr.split(" ").slice(1).join(" "))}</p>
          <p class="vinfo">${esc(pick(n))} · ${esc(tx(GENDER_NAMES[n.g]))} · ${esc(tx(CASES5.find(x=>x[0]===c)[1]))} · ${esc(tx(number==="sg" ? "singular" : "plural"))}${kind==="indef" ? " · " + esc(tx("a, an")) : ""}</p>`,
        reveal:`<b lang="el">${esc(right)} ${esc(n.gr.split(" ").slice(1).join(" "))}</b><br>${esc(tx(CASES5.find(x=>x[0]===c)[1]))} · ${esc(tx(number==="sg" ? "singular" : "plural"))}`, sayAfter:right};
      if(mode==="write") return {...base, write:{answers:[right]}, hint:esc(tx("Think: the gender, the case, the number."))};
      return {...base, options:greekOptions(right, sample(pool.filter(a=>a!==right), 3))};
    };
  }
};
