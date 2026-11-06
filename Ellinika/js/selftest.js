/* ---------- self-check of the page: open index.html?check=1 ----------
   It opens every page and every mode of the app by itself, in French, and tells what is wrong: an error in the code, a text with no French text,
   an emoji with no drawing, a word with no French meaning or no category. The result is shown in a window and in the console.
   (The sounds and the files are checked by tools/check_app.py, which needs Python.) Nothing is changed or saved. */
(function(){
  if(!/[?&]check=1\b/.test(location.search)) return;
  addEventListener("load", () => setTimeout(run, 600));

  function run(){
    const problems = {}, bad = (k, v) => (problems[k] = problems[k] || new Set()).add(v);
    document.documentElement.dataset.calm = "1";                                  /* no transitions: pages change at once */
    const oldLang = LANG, oldHash = location.hash;
    window.addEventListener("error", e => bad("error in the code", `${e.message} (${(e.filename || "").split("/").pop()}:${e.lineno})`));

    /* every English text asked from tx() while the language is French and that has no French text */
    const realTx = tx;
    tx = function(s, vars){ if(LANG==="fr" && s && FR[s]===undefined && !/^letter /.test(s) && !/[éèêàçùôî]/.test(s) && s!=="Elliniká" && /[A-Za-z]{3}/.test(s) && !/^\{?\w+\}?$/.test(s)) bad("English text with no French text", String(s).slice(0, 70)); return realTx(s, vars); };
    try{ setLang("fr"); }catch(e){ bad("error in the code", "setLang: " + e.message); }

    let pages = 0, modes = 0;
    for(const v of Object.keys(VIEW_TITLES)){
      try{ location.hash = v; showView(v); pages++; }catch(e){ bad("page that does not open", `${v}: ${e.message}`); continue; }
      const chips = [...document.querySelectorAll(`main [data-view="${v}"] .chip[data-mode], main [data-view="${v}"] [data-tab], main [data-view="${v}"] [data-hub], main [data-view="${v}"] [data-topic]`)];
      for(const c of chips){
        try{ c.click(); modes++; }catch(e){ bad("mode that does not open", `${v}/${c.dataset.mode || c.dataset.tab || c.dataset.hub || c.dataset.topic}: ${e.message}`); }
      }
    }
    try{ iconify(document.body); }catch(e){}
    window.missingEmoji.forEach(ch => bad("emoji with no drawing", ch));

    /* the dictionary */
    let noFr = 0, noCat = 0;
    DICT.forEach(e => {
      if(e.pos!=="letter" && e.pos!=="number" && !e.fr && e.en.split(" · ").some(x => FR[x]===undefined && /[a-z]{3}/i.test(x) && !/^\d/.test(x))) { noFr++; if(noFr<=12) bad("word with no French meaning", `${e.gr} = ${e.en}`); }
      if(e.pos!=="letter" && e.cats.every(c => ["Greek letters", "Phrases", "Dialogues", "Conversation"].includes(c)) && e.pos!=="phrase") { noCat++; bad("word with no topic", e.gr); }
      if(!CEFR_LEVELS.includes(e.lvl)) bad("word with an unknown level", `${e.gr}: ${e.lvl}`);
    });

    tx = realTx;
    try{ setLang(oldLang); }catch(e){}
    delete document.documentElement.dataset.calm;
    location.hash = oldHash || "home";

    const total = Object.values(problems).reduce((n, s) => n + s.size, 0);
    const lines = [`${pages} pages and ${modes} modes opened · ${DICT.length} words in the dictionary`];
    if(!total) lines.push("Everything is fine.");
    for(const [k, s] of Object.entries(problems)) lines.push(`\n[${s.size}] ${k}\n   ` + [...s].slice(0, 15).join("\n   ") + (s.size > 15 ? `\n   ... and ${s.size - 15} more` : ""));
    const text = lines.join("\n");
    console[total ? "warn" : "log"]("SELF-CHECK\n" + text);
    const box = document.createElement("pre");
    box.style.cssText = "position:fixed;inset:12px;z-index:9999;overflow:auto;margin:0;padding:16px;border-radius:14px;background:#111;color:#eee;font:13px/1.45 monospace;border:2px solid " + (total ? "#E5484D" : "#4CAF50");
    box.textContent = "SELF-CHECK (click to close)\n\n" + text;
    box.onclick = () => box.remove();
    document.body.appendChild(box);
  }
})();
