/* ---------- my difficulties: the notebook of mistakes ----------
   Lists the words you miss most (Progress.difficultList()), the hardest first, with how often you got them wrong and right.
   You can also add your own words (a Greek word + its meaning): they sit at the top of the list, are read by the voice of your
   device (there is no recording for them, see OWN_TEXT in js/audio.js), and can be deleted with the 🗑 button.
   You can filter by category, hear a word, star it, and practice them with a quiz (10 questions).
   A word leaves the list when you master it. Nothing is stored here: it is all in "gl-progress" (own words have own:true). */
const DIF_SHOWN = 20;
let difCat = "", difAll = false, difAddOpen = false, difMsg = null;

/* the voice of the device reads the words you added */
const registerOwnSounds = () => Progress.list().filter(r=>r.own && !r.rec).forEach(r=>{ OWN_TEXT[sid(r.gr)] = r.gr; });
registerOwnSounds();

/* Greek text -> Latin letters, with the same rules as the rest of the app (ου = ou, αι = e, μπ = b at the start of a word...) */
const LAT_ONE = Object.fromEntries([..."αβγδεζηθικλμνξοπρστυφχψω"].map((c,i)=>[c, ["a","v","g","d","e","z","i","th","i","k","l","m","n","x","o","p","r","s","t","i","f","ch","ps","o"][i]]));
const LAT_VOICED = "αεηιουωβγδζλμνρ";
function latinWord(w){
  let s = w.toLowerCase().normalize("NFD")
    .replace(/([αεηιουω])́?̈/g, "|$1")   // a diaeresis separates two vowels
    .replace(/([αεο])́([ιυ])/g, "$1|$2");     // an accent on the first vowel too (μάιος)
  s = s.replace(/[̀-ͯ]/g, "").replace(/ς/g, "σ").replace(/[^α-ωσ|]/g, "");
  let out = "";
  for(let i=0; i<s.length;){
    const c = s[i], two = s.slice(i,i+2), nxt = s[i+2] || "";
    if(c==="|"){ i++; continue; }
    const pair = {"ου":"ou", "αι":"e", "ει":"i", "οι":"i", "υι":"i", "μπ":i ? "mb" : "b", "ντ":i ? "nd" : "d", "γκ":i ? "ng" : "g", "γγ":"ng", "γχ":"nch", "τσ":"ts", "τζ":"tz"}[two];
    if(pair){ out += pair; i += 2; continue; }
    if(two==="αυ" || two==="ευ" || two==="ηυ"){ out += {α:"a", ε:"e", η:"i"}[c] + (!nxt || LAT_VOICED.includes(nxt) ? "v" : "f"); i += 2; continue; }
    if(c==="γ" && ("ειηυ".includes(s[i+1]||"?") || ["αι","ει","οι"].includes(s.slice(i+1,i+3)))){ out += "y"; i++; continue; }
    out += LAT_ONE[c] || c; i++;
  }
  return out;
}
const latinOf = text => text.split(/\s+/).filter(Boolean).map(latinWord).join(" ");
const hasGreek = text => /[Ͱ-Ͽἀ-῿]/.test(text);

/* the "➕" button of the glossaries (stories, poems, texts): puts the word you tapped into "My difficulties" (it already has a recording) */
function ownWordButton(g){
  const b = document.createElement("button"); b.type = "button"; b.className = "ownadd";
  const paint = done => { b.textContent = done ? "✓ " + tx("In my difficulties") : "➕ " + tx("Add to my difficulties"); b.disabled = done; };
  paint(false);
  b.onclick = ()=>{ Progress.addOwn({gr:g.gr, lat:g.lat, en:g.en, fr:g.fr || g.en, rec:true}); paint(true); };
  const key = "own:" + g.gr.toLowerCase().replace(/\s+/g," ").trim();
  if(Progress.all()[key]) paint(true);
  return b;
}
/* the star needs {gr, lat, en, fr, snd (a text or nothing), cat} */
const difFavItem = r => ({gr:r.gr, lat:r.lat, en:r.en, fr:r.fr, cat:r.cat});

/* the quiz: like the one of "My words", but every answer is recorded on the word itself; the wrong answers are other words of the list, then of the dictionary */
function difQuestions(list){
  const next = deck(list), pool = DICT.filter(e=>e.type!=="letter");
  const wrongOnes = (f, textOf) => {
    const seen = new Set([textOf(f)]), out = [];
    for(const x of shuffle([...list.filter(y=>y!==f), ...sample(pool, 30)])){
      const t = textOf(x); if(!t || seen.has(t)) continue;
      seen.add(t); out.push(x); if(out.length===3) break;
    }
    return out;
  };
  return ()=>{
    const f = next(), kind = oneOf(["g2e","e2g","listen"]);
    const reveal = `<b lang="el">${esc(f.gr)}</b> <span class="lt">(${esc(f.lat||"")})</span><br>${esc(meaningOf(f))}`;
    const base = {item:f, reveal, sayAfter:soundOf(f)};
    const meanOpts = () => shuffle([{html:esc(meaningOf(f)), ok:true}, ...wrongOnes(f, meaningOf).map(x=>({html:esc(meaningOf(x)), ok:false}))]);
    const greekOpts = () => shuffle([{html:`<span lang="el">${esc(f.gr)}</span>`, ok:true}, ...wrongOnes(f, greekOf).map(x=>({html:`<span lang="el">${esc(x.gr)}</span>`, ok:false}))]);
    if(kind==="e2g")    return {...base, prompt:`<p class="word s">${esc(meaningOf(f))}</p>`, options:greekOpts()};
    if(kind==="listen") return {...base, prompt:`<p class="word s">🔊 ${esc(tx("What does it mean?"))}</p>`, say:soundOf(f), autoplay:true, options:meanOpts(), sayAfter:undefined};
    return {...base, prompt:`<p class="word s" lang="el">${esc(f.gr)}</p>`, say:soundOf(f), options:meanOpts()};
  };
}

function addWordForm(){
  return `<details class="difadd" id="difAdd"${difAddOpen ? " open" : ""}>
    <summary>➕ ${esc(tx("Add my own word"))}</summary>
    <form id="difForm" autocomplete="off">
      <label>${esc(tx("The word in Greek"))}<input id="difGr" type="text" lang="el" placeholder="καλημέρα" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="60" required></label>
      <label>${esc(tx("What it means"))}<input id="difEn" type="text" placeholder="${esc(tx("good morning"))}" maxlength="80" required></label>
      <label>${esc(tx("How to say it (optional, filled in for you)"))}<input id="difLat" type="text" placeholder="kalimera" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="80"></label>
      <div class="btns"><button class="btn" type="submit">${esc(tx("Add to my difficulties"))}</button></div>
      <p class="feedback${difMsg && difMsg.bad ? " bad" : difMsg ? " good" : ""}" id="difFormMsg" aria-live="polite">${difMsg ? esc(difMsg.text) : ""}</p>
    </form></details>`;
}
function wireAddForm(){
  const form = $("difForm"), gr = $("difGr"), lat = $("difLat"); let latEdited = false;
  $("difAdd").ontoggle = e => { difAddOpen = e.target.open; };
  lat.oninput = ()=>{ latEdited = true; };
  gr.oninput = ()=>{ if(!latEdited) lat.value = latinOf(gr.value); };
  form.onsubmit = e=>{
    e.preventDefault();
    const g = gr.value.trim().replace(/\s+/g," "), m = $("difEn").value.trim();
    const fail = text => { difMsg = {text, bad:true}; $("difFormMsg").textContent = text; $("difFormMsg").className = "feedback bad"; };
    if(!hasGreek(g)) return fail(tx("Write the word in Greek letters."));
    if(!m) return fail(tx("Write what it means."));
    const key = Progress.addOwn({gr:g, en:m, fr:m, lat:lat.value.trim() || latinOf(g)});
    if(!key) return fail(tx("This word is already in your list."));
    registerOwnSounds();
    difMsg = {text:tx("Added. It is at the top of your list."), bad:false}; difAddOpen = true; difCat = ""; difAll = false;
    renderDifficulties();
    $("difGr").focus();
  };
}

function renderDifficulties(){
  const box = $("difBox"), all = Progress.difficultList();
  if(!all.length){
    box.innerHTML = emptyState({icon:"💪", title:tx("No difficult words right now."),
      text:tx("The words you miss often will appear here, so you can practice them again.")}) + `
      ${addWordForm()}
      <div class="btns"><a class="btn" href="#progress">${esc(tx("Back to my progress"))}</a></div>`;
    wireAddForm();
    return;
  }
  /* categories that have difficult words, the biggest first */
  const counts = {};
  all.forEach(r=>{ counts[r.cat] = (counts[r.cat]||0) + 1; });
  if(difCat && !counts[difCat]) difCat = "";
  const cats = Object.keys(counts).sort((a,b)=>counts[b]-counts[a]);
  const shown = difCat ? all.filter(r=>r.cat===difCat) : all;
  const visible = difAll ? shown : shown.slice(0, DIF_SHOWN);

  box.innerHTML = `
    <p class="levelinfo">${esc(tx(shown.length===1 ? "{n} word you often miss." : "{n} words you often miss.", {n:shown.length}))}</p>
    ${addWordForm()}
    ${cats.length>1 ? `<div class="row" id="difCats" role="group" aria-label="${esc(tx("Category"))}">
      <button type="button" class="chip" aria-pressed="${difCat===""}" data-c="">${esc(tx("All"))} (${all.length})</button>
      ${cats.map(c=>`<button type="button" class="chip" aria-pressed="${difCat===c}" data-c="${esc(c)}">${esc(tx(c))} (${counts[c]})</button>`).join("")}</div>` : ""}
    <div class="btns"><button class="btn" type="button" id="difPlay">🎯 ${esc(tx("Practice these words"))}</button></div>
    <div id="difList"></div>
    ${shown.length>visible.length ? `<div class="btns"><button class="btn ghost" type="button" id="difMore">${esc(tx("Show all {n} words", {n:shown.length}))}</button></div>` : ""}
    <p class="note" style="text-align:left">${esc(tx("A word leaves this list when you master it. The hardest words come first."))}</p>
    <div class="btns"><a class="btn ghost" href="#progress">${esc(tx("Back to my progress"))}</a></div>`;
  wireAddForm();

  const out = $("difList");
  visible.forEach(r=>{
    const wrap = document.createElement("div"); wrap.className = "dword";
    const b = document.createElement("button"); b.type = "button"; b.className = "dentry";
    b.innerHTML = `<span class="dtxt"><span class="dgr" lang="el">${esc(r.gr)}</span>
      <span class="dlat"><span class="lt">${esc(r.lat||"")}</span></span><span class="den">${esc(meaningOf(r))}</span>
      <span class="dmeta">${r.own ? `<span class="down">${esc(tx("My word"))}</span> ` : ""}<span class="dstat bad" title="${esc(tx("Wrong"))}">✗ ${r.wrong}</span> <span class="dstat good" title="${esc(tx("Right"))}">✓ ${r.right}</span> · ${esc(tx(r.cat))}</span></span><span class="dplay" aria-hidden="true">🔊</span>`;
    b.onclick = ()=>say(soundOf(r));
    wrap.appendChild(b);
    if(r.own){
      const del = document.createElement("button"); del.type = "button"; del.className = "favstar on-card difdel";
      const label = tx("Delete this word"); del.textContent = "🗑"; del.title = label; del.setAttribute("aria-label", label);
      del.onclick = e=>{ e.stopPropagation(); if(confirm(tx("Delete “{w}” from your list?", {w:r.gr}))){ Progress.remove(r.key); difMsg = null; renderDifficulties(); } };
      wrap.appendChild(del);
    } else wrap.appendChild(favButton(difFavItem(r), "on-card"));
    out.appendChild(wrap);
  });

  box.querySelectorAll("#difCats .chip").forEach(c=>c.onclick = ()=>{ difCat = c.dataset.c; difAll = false; renderDifficulties(); });
  if($("difMore")) $("difMore").onclick = ()=>{ difAll = true; renderDifficulties(); };
  $("difPlay").onclick = ()=>{
    const list = shown.slice(0, REVIEW_SIZE);
    box.innerHTML = `<div id="difGame" class="game"></div>`;
    runQuiz($("difGame"), {id:"difficulties", total:list.length, best:false, make:difQuestions(list),
      renderResult:(g,score,total)=>{
        const msg = score===total ? tx("Perfect! These words are getting easier.") : score>=total*.6 ? tx("Good job. The words you missed will come back soon.") : tx("Keep going: the words you missed will come back soon.");
        g.innerHTML = `${scoreCard(score,total,esc(msg))}
          <div class="btns"><button class="btn" type="button" id="difBack">${esc(tx("Back to my difficulties"))}</button></div>`;
        celebrate(g,score,total);
        $("difBack").onclick = ()=>{ renderDifficulties(); window.scrollTo(0,0); };
      }});
  };
}
function openDifficulties(){ difCat = ""; difAll = false; difMsg = null; renderDifficulties(); }
