/* ---------- grammar: accents and spelling ----------
   Two more topics of the Grammar page, made from the words of the app (DATA of "Greek letters"):
   - Accents: you hear a word, tap it written with the accent in the right place (the wrong ones put it on another syllable).
   - Spelling: in Greek several letters sound the same (ι η υ ει οι = "i", ο ω = "o", ε αι = "e"). You hear a word and tap the right spelling,
     or write it with the Greek keyboard. The wrong spellings are made by changing one of these letters, and are never real words of the app.
   They use the helpers of js/grammar2.js (explain, g2Line, g2Item, greekOptions, pill, heading). */
const SND = SOUNDS;
const SND_MARKS = /[̀-ͯ]/g;
const strip = s => s.normalize("NFD").replace(SND_MARKS, "").normalize("NFC");
const GR_VOWELS = "αεηιουω";
const DIPHTHONGS = ["αι","ει","οι","υι","ου","αυ","ευ","ηυ"];

/* the letters of a word: [{b: base letter, m: its marks (accent, diaeresis)}] */
const letters = w => {
  const out = [];
  for(const c of w.normalize("NFD")){
    if(/[̀-ͯ]/.test(c)){ if(out.length) out[out.length-1].m += c; }
    else out.push({b:c, m:""});
  }
  return out;
};
const build = L => L.map(x=>x.b + x.m).join("").normalize("NFC");

/* the vowel groups of a word, as [first index, last index]: a diphthong is one group (its accent sits on its second letter) */
function nuclei(L){
  const out = [];
  for(let i=0; i<L.length; i++){
    if(!GR_VOWELS.includes(L[i].b)) continue;
    const next = L[i+1];
    if(next && !L[i].m && !/̈/.test(next.m) && DIPHTHONGS.includes(L[i].b + next.b)){ out.push([i,i+1]); i++; }
    else out.push([i,i]);
  }
  return out;
}
const ACUTE = "́";
const accentAt = (L, group) => L.map((x,i)=>({b:x.b, m: i===group[1] ? ACUTE : ""}));

/* the words the games use: one word, one accent, 2 to 4 syllables, no ï / ϋ, no "ια / ιο..." (these letters make one syllable) */
const SND_WORDS = (() => {
  const seen = new Set(), out = [];
  DATA.levels.forEach(lv=>lv.words.forEach(w=>{
    if(w.pos==="phrase" || /[\s·\-']/.test(w.gr) || /[̈]/.test(w.gr.normalize("NFD"))) return;
    if(w.gr !== w.gr.toLowerCase()) return;
    const key = strip(w.gr); if(seen.has(key)) return; seen.add(key);
    if(/ι[αεοωυηά-ώ]/.test(w.gr)) return;
    const L = letters(w.gr), G = nuclei(L);
    if(G.length<2 || G.length>4) return;
    const marked = G.filter(g=>L.slice(g[0], g[1]+1).some(x=>x.m.includes(ACUTE)));
    if(marked.length!==1 || G.indexOf(marked[0]) < G.length-3) return;
    const base = L.map(x=>({b:x.b, m:""}));
    if(build(accentAt(base, marked[0])) !== w.gr.normalize("NFC")) return;
    out.push({...w, L:base, G, at:G.indexOf(marked[0])});
  }));
  return out;
})();
const SND_KNOWN = new Set(DATA.levels.flatMap(lv=>lv.words.map(w=>strip(w.gr))));

/* ===== Accents ===== */
function accentQuestion(w){
  /* an accent can only sit on one of the last three syllables */
  const variants = w.G.map((g,i)=>({i, text:build(accentAt(w.L, g))})).slice(-3);
  const right = variants.find(v=>v.i===w.at), wrong = shuffle(variants.filter(v=>v.i!==w.at)).slice(0,3);
  const meaning = LANG==="fr" ? trFR(w.en) : w.en;
  return {
    item:g2Item(`acc:${w.gr}`, w.gr, w.en, trFR(w.en), w.lat),
    prompt:`${pill("Where is the stress?")}<p class="vinfo">${esc(txm(w.en))}</p>`, say:w.gr, autoplay:true,
    options:shuffle([{html:`<span lang="el">${esc(right.text)}</span>`, ok:true}, ...wrong.map(v=>({html:`<span lang="el">${esc(v.text)}</span>`, ok:false}))]),
    reveal:`<b lang="el">${esc(w.gr)}</b> <span class="lt">(${esc(w.lat)})</span><br>${esc(meaning)}`, sayAfter:w.gr
  };
}
TOPICS.accents = {
  modes:["learn","choose"],
  intro:"In Greek, the accent mark (΄) shows which syllable you say louder. Listen, then tap the word with the accent in the right place.",
  learn(box){
    explain(box, [esc(tx("Every Greek word of two syllables or more has one accent mark (΄) on a vowel. It shows the syllable you say louder: καφές (ka-FES), κάτω (KA-to).")),
                  esc(tx("The accent changes the word, so it is worth learning with the word. Tap each word to hear the difference.")),
                  esc(tx("Words of one syllable have no accent mark, except a few: πού (where?) and που (that, who); ή (or) and η (the).")),
                  esc(tx("A diphthong (two vowels that make one sound: ει, οι, αι, ου...) takes the mark on its second letter: είναι, κοιτάζω."))]);
    heading(box, "Same letters, a different accent");
    const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
    SND.pairs.forEach(p=>{
      [p.a, p.b].forEach(x=>g2Line(list, esc(x.gr), esc(pick(x)), x.gr));
    });
  },
  questions(mode){
    const next = deck(SND_WORDS);
    return ()=>accentQuestion(next());
  }
};

/* ===== Spelling: letters that sound the same ===== */
const SPELL_CLASSES = [["ι","η","υ","ει","οι"], ["ο","ω"], ["ε","αι"]];
const classOf = g => SPELL_CLASSES.find(c=>c.includes(g));
/* the groups of a word that can be spelled in several ways: [first, last, the letters of the group] */
function spellGroups(L){
  const out = [];
  for(let i=0; i<L.length; i++){
    const two = i+1<L.length && !L[i].m && !/̈/.test(L[i+1].m) ? L[i].b + L[i+1].b : "";
    if(DIPHTHONGS.includes(two)){
      if(classOf(two)) out.push([i, i+1, two]);
      i++; continue;
    }
    if(classOf(L[i].b) && !(L[i].b==="υ" && i>0 && "αεοη".includes(L[i-1].b))) out.push([i, i, L[i].b]);
  }
  return out;
}
const SPELL_WORDS = (() => {
  const seen = new Set(), out = [];
  DATA.levels.forEach(lv=>lv.words.forEach(w=>{
    if(w.pos==="phrase" || /[\s·\-']/.test(w.gr) || w.gr !== w.gr.toLowerCase() || /̈/.test(w.gr.normalize("NFD"))) return;
    const key = strip(w.gr); if(seen.has(key)) return; seen.add(key);
    const L = letters(w.gr); if(L.length<4) return;
    const groups = spellGroups(L);
    if(groups.length) out.push({...w, L, groups});
  }));
  return out;
})();
/* the word with one group spelled another way (the accent stays on the last letter of the group) */
function respell(L, g, replacement){
  const marks = L.slice(g[0], g[1]+1).map(x=>x.m).join("");
  const repl = [...replacement].map((c,i,a)=>({b:c, m: i===a.length-1 ? marks : ""}));
  return build([...L.slice(0, g[0]), ...repl, ...L.slice(g[1]+1)]);
}
function spellVariants(w){
  const all = [];
  w.groups.forEach(g=>classOf(g[2]).filter(x=>x!==g[2]).forEach(r=>all.push(respell(w.L, g, r))));
  return shuffle(all).filter((v,i,a)=>a.indexOf(v)===i && !SND_KNOWN.has(strip(v)) && v!==w.gr.normalize("NFC")).slice(0,3);
}
function spellQuestion(w, mode){
  const wrong = spellVariants(w);
  const meaning = LANG==="fr" ? trFR(w.en) : w.en;
  const base = {
    item:g2Item(`spell:${w.gr}`, w.gr, w.en, trFR(w.en), w.lat),
    say:w.gr, autoplay:true, reveal:`<b lang="el">${esc(w.gr)}</b> <span class="lt">(${esc(w.lat)})</span><br>${esc(meaning)}`, sayAfter:w.gr
  };
  if(mode==="write") return {...base, prompt:`${pill("Write what you hear")}<p class="vinfo">${esc(txm(w.en))}</p>`, write:{answers:[w.gr]}, hint:esc(tx("Think of the letters that sound the same: ι η υ ει οι, ο ω, ε αι."))};
  return {...base, prompt:`${pill("Which spelling is right?")}<p class="vinfo">${esc(txm(w.en))}</p>`, options:greekOptions(w.gr, wrong)};
}
TOPICS.spelling = {
  intro:"Several Greek letters sound the same. Listen, then pick or write the right spelling.",
  learn(box){
    explain(box, [esc(tx("Greek kept its old spelling, but several letters now sound the same:")),
                  `<b lang="el">ι · η · υ · ει · οι</b> = «i» &nbsp; <b lang="el">ο · ω</b> = «o» &nbsp; <b lang="el">ε · αι</b> = «e»`,
                  esc(tx("There is no short rule: you learn the spelling with the word, by seeing it and writing it. Tap the words to hear them; the letters that sound the same are in bold."))]);
    [["ι","The sound «i»: ι"],["η","The sound «i»: η"],["υ","The sound «i»: υ"],["ει","The sound «i»: ει"],["οι","The sound «i»: οι"],["ο","The sound «o»: ο"],["ω","The sound «o»: ω"],["ε","The sound «e»: ε"],["αι","The sound «e»: αι"]].forEach(([g,title])=>{
      const ex = SPELL_WORDS.filter(w=>w.groups.some(x=>x[2]===g) && w.lvl && ["A1"].includes(w.lvl)).slice(0,4);
      if(!ex.length) return;
      heading(box, title);
      const list = document.createElement("div"); list.className = "lines"; box.appendChild(list);
      ex.forEach(w=>{
        const html = [...w.L.map((x,i)=>x.b+x.m)].join("");
        const parts = []; let at = 0;
        const grp = w.groups.find(x=>x[2]===g);
        const before = build(w.L.slice(0, grp[0])), mid = build(w.L.slice(grp[0], grp[1]+1)), after = build(w.L.slice(grp[1]+1));
        g2Line(list, `${esc(before)}<u>${esc(mid)}</u>${esc(after)}`, esc(pick(w)), w.gr);
      });
    });
  },
  questions(mode){
    const next = deck(SPELL_WORDS);
    return ()=>{
      let w, guard = 0;
      do { w = next(); } while(spellVariants(w).length<2 && ++guard<30);
      return spellQuestion(w, mode);
    };
  }
};
G_TOPICS.push(["accents","Accents"], ["spelling","Spelling"]);
