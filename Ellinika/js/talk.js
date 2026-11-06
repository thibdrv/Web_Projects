/* ---------- conversation: a partner who speaks, and you answer ----------
   Built from data/talk.js. The partner says a line (with the voice); you answer, in one of two ways:
   Choose: three replies, one fits; the other two come with a short reason why they do not fit.
   Write: you see the meaning of a reply and you write it with Greek letters (a Greek keypad is shown).
   Each answer goes to Progress (category "Conversation"). A conversation has 4 to 7 of your turns. */
const TALK_MODES = [
  {id:"choose", name:"Choose", info:"The partner speaks. Tap the reply that fits."},
  {id:"write",  name:"Write",  info:"The partner speaks. Write your reply with Greek letters (the meaning is shown)."}
];
let talkLevel = "all", talkMode = "choose", talkId = null, talkToken = 0, talkShowTr = true, talkRun = null;

const talkList = () => TALK.scenarios;
const talkById = id => talkList().find(s=>s.id===id);
const talkDone = () => { try{ return JSON.parse(localStorage.getItem("gl-talk")) || {}; }catch(e){ return {}; } };
const talkTotal = () => talkList().reduce((n,s)=>n+s.turns.filter(t=>t.good).length, 0);
const sleepMs = ms => new Promise(r=>setTimeout(r, ms));
function stopTalk(){ talkToken++; }

/* ----- bubbles ----- */
function talkBubble(kind, text, lat, meaning, who){
  const chat = $("talkChat");
  const b = document.createElement("div"); b.className = "bubble " + kind;
  b.innerHTML = `${who ? `<span class="bwho">${esc(who)}</span>` : ""}<span class="bgr" lang="el">${esc(text)}</span>
    <span class="blat">${esc(lat)}</span>${meaning ? `<span class="bmean"${talkShowTr ? "" : " hidden"}>${esc(meaning)}</span>` : ""}`;
  if(kind==="bot"){
    const ear = document.createElement("button"); ear.type = "button"; ear.className = "bear"; ear.textContent = "🔊"; ear.setAttribute("aria-label", tx("Listen"));
    ear.onclick = ()=>say(text); b.prepend(ear);
  }
  chat.appendChild(b);
  try{ b.scrollIntoView({block:"nearest", behavior:"smooth"}); }catch(e){}
  return b;
}
const meaningOfLine = l => pick(l);

/* ----- one conversation ----- */
async function talkStart(){
  stopTalk(); const my = talkToken;
  stopSound();
  const s = talkById(talkId);
  talkRun = {s, right:0, total:s.turns.filter(t=>t.good).length, mistakes:0};
  $("talkBox").innerHTML = `
    <div class="card talkintro"><p class="vinfo">${esc(tx("You talk with:"))} <b>${esc(pick(s.role))}</b></p><p>${esc(pick(s.intro))}</p></div>
    <div class="story-bar"><button class="chip" type="button" id="talkTr" aria-pressed="${talkShowTr}">👁 ${esc(tx("Show the meaning"))}</button></div>
    <div class="chat" id="talkChat" aria-live="polite"></div>
    <div id="talkIn" class="talkin"></div>`;
  $("talkTr").onclick = ()=>{
    talkShowTr = !talkShowTr; $("talkTr").setAttribute("aria-pressed", talkShowTr);
    document.querySelectorAll("#talkChat .bmean, #talkIn .bmean").forEach(m=>m.hidden = !talkShowTr);
  };
  for(let i=0; i<s.turns.length; i++){
    if(my!==talkToken) return;
    const t = s.turns[i];
    talkBubble("bot", t.bot.gr, t.bot.lat, meaningOfLine(t.bot), i===0 ? pick(s.role) : "");
    const heard = playRec(sid(t.bot.gr));
    if(!t.good) break;
    await heard; if(my!==talkToken) return;
    await sleepMs(250);
    const ok = await talkAnswer(i, my);
    if(my!==talkToken) return;
    if(ok===null) return;
  }
  if(my===talkToken) talkFinish();
}

/* the user's turn: resolves true if it was right at the first try, false otherwise (null if the page was left) */
function talkAnswer(i, my){
  const s = talkRun.s, t = s.turns[i];
  return new Promise(resolve=>{
    let mistakes = 0;
    const box = $("talkIn"); box.innerHTML = "";
    const target = oneOf(t.good);
    const item = ()=>({key:`talk:${s.id}:${i}`, gr:target.gr, en:target.en, fr:target.fr, lat:target.lat, snd:sid(target.gr), cat:"Conversation"});
    const done = async (good)=>{
      box.innerHTML = "";
      Progress.record(item(), mistakes===0);
      if(mistakes===0) talkRun.right++; else talkRun.mistakes++;
      talkBubble("me", good.gr, good.lat, meaningOfLine(good));
      renderHomeProgress();
      await playRec(sid(good.gr));
      await sleepMs(350);
      resolve(mistakes===0);
    };
    const note = document.createElement("p"); note.className = "feedback"; note.setAttribute("aria-live","polite");

    if(talkMode==="choose"){
      const opts = shuffle([{good:target}, ...sample(t.bad, 2).map(b=>({bad:b}))]);
      const wrap = document.createElement("div"); wrap.className = "opts talkopts"; box.appendChild(wrap);
      opts.forEach(o=>{
        const l = o.good || o.bad, b = document.createElement("button"); b.type = "button"; b.className = "opt talkopt";
        b.innerHTML = `<span class="bgr" lang="el">${esc(o.good ? o.good.gr : o.bad.text)}</span><span class="bmean"${talkShowTr ? "" : " hidden"}>${esc(pick(l))}</span>`;
        b.onclick = ()=>{
          if(my!==talkToken) return;
          if(o.good){ wrap.querySelectorAll(".opt").forEach(x=>x.disabled = true); b.classList.add("ok"); done(o.good); }
          else {
            mistakes++; b.disabled = true; b.classList.add("no");
            note.className = "feedback bad"; note.textContent = tx("Not quite.") + " " + pick(o.bad.why);
          }
        };
        wrap.appendChild(b);
      });
      box.appendChild(note);
    } else {
      const cue = document.createElement("div"); cue.className = "talkcue";
      cue.innerHTML = `<span class="vinfo">${esc(tx("Reply in Greek:"))}</span> <b>${esc(pick(target))}</b>`;
      const inp = document.createElement("input"); inp.type = "text"; inp.lang = "el"; inp.autocomplete = "off"; inp.setAttribute("autocapitalize","off"); inp.spellcheck = false;
      inp.placeholder = tx("Write it with Greek letters"); inp.setAttribute("aria-label", tx("Your answer in Greek letters"));
      const keys = document.createElement("div"); keys.className = "gkeys";
      GREEK_KEYS.forEach(k=>{
        const o = typeof k==="string" ? {key:k, label:k, span:1} : k;
        const kb = document.createElement("button"); kb.type = "button"; kb.className = "gkey"; kb.textContent = o.label==="space" ? tx("space") : o.label; kb.style.gridColumn = `span ${o.span}`;
        if(o.key.length===1 && o.key!==" " && o.key!=="⌫" && o.label===o.key) kb.lang = "el";
        kb.setAttribute("aria-label", o.key===" " ? tx("space") : o.key==="⌫" ? tx("delete") : o.key);
        kb.addEventListener("mousedown", e=>e.preventDefault());
        kb.onclick = ()=>{
          const st = inp.selectionStart ?? inp.value.length, en = inp.selectionEnd ?? st;
          if(o.key==="⌫"){ if(st!==en) inp.setRangeText("", st, en, "end"); else if(st>0) inp.setRangeText("", st-1, st, "end"); }
          else inp.setRangeText(o.key, st, en, "end");
        };
        keys.appendChild(kb);
      });
      const btns = document.createElement("div"); btns.className = "btns";
      const hint = document.createElement("button"); hint.type = "button"; hint.className = "btn ghost"; hint.textContent = tx("Hint");
      const check = document.createElement("button"); check.type = "button"; check.className = "btn"; check.textContent = tx("Check");
      btns.append(hint, check);
      box.append(cue, inp, keys, btns, note);
      if(!touchOnly()){ try{ inp.focus({preventScroll:true}); }catch(e){} }
      const wrongs = [];
      hint.onclick = ()=>{ mistakes = Math.max(mistakes, 1); note.className = "feedback"; note.innerHTML = `${esc(tx("One possible reply:"))} <b lang="el">${esc(target.gr)}</b>`; };
      const go = ()=>{
        if(my!==talkToken) return;
        const raw = inp.value;
        if(!normGreek(raw)){ note.className = "feedback bad"; note.textContent = tx("Write your answer first"); return; }
        if(/[a-z]/i.test(raw)){ note.className = "feedback bad"; note.textContent = tx("Use Greek letters: tap the keys below"); return; }
        const hit = t.good.find(g=>normGreek(g.gr)===normGreek(raw));
        if(hit){ btns.hidden = true; inp.disabled = true; done(hit); return; }
        mistakes++; wrongs.push(raw);
        note.className = "feedback bad"; note.textContent = tx("Not quite. Try again, or tap Hint.");
      };
      check.onclick = go;
      inp.addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); go(); } });
    }
    try{ box.scrollIntoView({block:"nearest", behavior:"smooth"}); }catch(e){}
  });
}

function talkFinish(){
  const r = talkRun, s = r.s, d = talkDone();
  if((d[s.id]||0) < r.right) d[s.id] = r.right;
  try{ localStorage.setItem("gl-talk", JSON.stringify(d)); }catch(e){}
  const msg = r.right===r.total ? "Μπράβο! " + tx("Perfect conversation!") : r.right>=r.total*.6 ? "Καλά! " + tx("Good job") : tx("Keep going, you will get there");
  $("talkIn").innerHTML = `
    <div class="card"><p class="word">${r.right}/${r.total}</p><p class="feedback good">${esc(msg)}</p>
      <p class="answer">${esc(tx("replies right at the first try"))}</p></div>
    <div class="btns"><button class="btn" type="button" id="talkAgain">${esc(tx("Play again"))}</button>
      <button class="btn ghost" type="button" id="talkNext">${esc(tx("Another conversation"))}</button></div>`;
  $("talkAgain").onclick = ()=>talkStart();
  $("talkNext").onclick = ()=>{
    const l = talkList(), i = l.findIndex(x=>x.id===talkId); talkId = l[(i+1)%l.length].id; startTalkView(); window.scrollTo(0,0);
  };
  try{ $("talkIn").scrollIntoView({block:"nearest", behavior:"smooth"}); }catch(e){}
  paintTalkChips();
}

/* ----- the page ----- */
/* the level buttons: only the conversations of the chosen level are shown (the level of a conversation is on its button) */
function paintTalkLevels(){
  document.querySelectorAll("#talkLevels .chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.level===talkLevel));
  $("talkGroups").querySelectorAll(".chip").forEach(b=>{ b.hidden = talkLevel!=="all" && talkById(b.dataset.group).level!==talkLevel; });
}
function paintTalkChips(){
  paintTalkLevels();
  const d = talkDone();
  $("talkModes").querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===talkMode));
  $("talkGroups").querySelectorAll(".chip").forEach(b=>{
    b.setAttribute("aria-pressed", b.dataset.group===talkId);
    const s = talkById(b.dataset.group), n = s.turns.filter(t=>t.good).length;
    b.querySelector(".tdone").textContent = d[s.id]===n ? " ✓" : "";
  });
}
function startTalkView(){
  stopTalk(); stopSound();
  paintTalkChips();
  $("talkInfo").textContent = tx(TALK_MODES.find(m=>m.id===talkMode).info);
  const s = talkById(talkId);
  $("talkBox").innerHTML = `
    <div class="card talkintro"><p class="vinfo">${esc(tx("You talk with:"))} <b>${esc(pick(s.role))}</b></p><p>${esc(pick(s.intro))}</p>
      <p class="muted">${esc(tx(s.turns.filter(t=>t.good).length===1 ? "{n} reply" : "{n} replies", {n:s.turns.filter(t=>t.good).length}))} · <span class="lvlb" data-l="${s.level}">${s.level}</span></p></div>
    <div class="btns"><button class="btn" type="button" id="talkGo">▶ ${esc(tx("Start the conversation"))}</button></div>`;
  $("talkGo").onclick = ()=>talkStart();
}
function openTalk(){
  if(!talkId) talkId = talkList()[0].id;
  const modes = $("talkModes");
  if(!modes.children.length){
    TALK_MODES.forEach(m=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.mode = m.id; b.textContent = tx(m.name);
      b.onclick = ()=>{ talkMode = m.id; startTalkView(); };
      modes.appendChild(b);
    });
    [["all", tx("All levels")], ...CEFR_LEVELS.map(l=>[l, l])].forEach(([id,name])=>{
      const n = id==="all" ? talkList().length : talkList().filter(s=>s.level===id).length;
      if(!n) return;
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.level = id; b.innerHTML = `${esc(name)} <span class="n">${n}</span>`;
      b.onclick = ()=>{
        talkLevel = id;
        if(id!=="all" && talkById(talkId).level!==id) talkId = talkList().find(s=>s.level===id).id;
        startTalkView();
      };
      $("talkLevels").appendChild(b);
    });
    talkList().forEach(s=>{
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.dataset.group = s.id;
      b.innerHTML = `<span class="lvlb" data-l="${s.level}">${s.level}</span> ${esc(pick(s.name))}<span class="tdone"></span>`;
      b.onclick = ()=>{ talkId = s.id; startTalkView(); };
      $("talkGroups").appendChild(b);
    });
  }
  startTalkView();
}
