/* ---------- more animation (the styles are in css/anim.css) ----------
   Every effect is skipped when the device asks for "reduced motion".
   1  page change: the page that leaves fades, the new one grows from the tile you touched (View Transitions, where the browser has them)
   2  the children of a page come in one after the other (class .vin, 1 s)
   3  a coloured pill glides under the choice you make in the settings (.seg)
   4-7  right answer: sparks and "+1"; the streak flame grows; the question leaves to the left before the next one comes
   8  while a sound plays, the button you touched sends waves (class .speaking, from the events of js/audio.js)
   9  drawings: the parts light up one after the other; the part you touch bounces; the next drawing slides in from the side
   12 the owl on the home page: sleeps at night, follows your finger, says a wish when you tap it
   13 the sky of the home page: snow, leaves, petals by season; fireworks on a national day and at New Year (?fx=snow|leaf|petal|fireworks|off to try)
   14 a trophy when the daily goal is reached (once a day)
   15 a star bursts when you add a word to "my words"
   17 on a computer, a ring spreads from the mouse click */
(function(){
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  const calm = () => mq.matches || document.documentElement.dataset.calm==="1";    /* data-calm="1" on <html> does the same by hand (used to test) */
  const rnd = (a, b) => a + Math.random()*(b - a);
  const pickOne = a => a[Math.floor(Math.random()*a.length)];
  const COLORS = ["#F2C14E", "#4CAF7A", "#6FA8FF", "#F28B82", "#C79BFF"];

  /* ----- a layer above everything for sparks, rings and floating texts ----- */
  const layer = document.createElement("div");
  layer.className = "fx-layer"; layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  function burst(x, y, o = {}){
    if(calm()) return;
    const n = o.n || 12, chars = o.chars;
    for(let i=0; i<n; i++){
      const p = document.createElement("i");
      p.className = "fx-p" + (chars ? "" : " dot");
      p.style.left = x + "px"; p.style.top = y + "px"; p.style.setProperty("--c", pickOne(o.colors || COLORS));
      if(chars) p.textContent = pickOne(chars);
      layer.appendChild(p);
      const a = rnd(0, Math.PI*2), d = rnd(28, o.far || 70);
      const a1 = p.animate([
        {transform:"translate(-50%,-50%) scale(1)", opacity:1},
        {transform:`translate(calc(-50% + ${Math.cos(a)*d}px), calc(-50% + ${Math.sin(a)*d - 14}px)) scale(${rnd(.3,.7)}) rotate(${rnd(-120,120)}deg)`, opacity:0}
      ], {duration:rnd(550, 900), easing:"cubic-bezier(.2,.7,.3,1)", fill:"forwards"});
      a1.onfinish = () => p.remove();
    }
  }
  function floatText(el, text, cls){
    if(calm() || !el) return;
    const r = el.getBoundingClientRect(), t = document.createElement("span");
    t.className = "fx-text " + (cls || ""); t.textContent = text;
    t.style.left = (r.left + r.width/2) + "px"; t.style.top = (r.top + r.height/2) + "px";
    layer.appendChild(t);
    const a = t.animate([
      {transform:"translate(-50%,-50%) scale(.6)", opacity:0},
      {transform:"translate(-50%,-90%) scale(1.15)", opacity:1, offset:.25},
      {transform:"translate(-50%,-230%) scale(1)", opacity:0}
    ], {duration:1000, easing:"ease-out", fill:"forwards"});
    a.onfinish = () => t.remove();
  }
  window.fxBurst = burst; window.fxFloat = floatText;

  /* ----- 1, 2: changing page ----- */
  let tap = {x:innerWidth/2, y:innerHeight*.3, t:0};
  document.addEventListener("pointerdown", e => { tap = {x:e.clientX, y:e.clientY, t:performance.now()}; }, true);
  const rawShow = showView;
  let ready = false;                                              /* the first page is shown at once; the transitions start once the page is loaded and painted */
  addEventListener("load", () => requestAnimationFrame(() => { ready = true; }));
  showView = function(name){
    const target = VIEW_TITLES[name] ? name : "home";
    const run = () => { rawShow(name); afterShow(target); };
    if(!ready || calm() || !document.startViewTransition || target===currentView || document.hidden){ run(); return; }
    const html = document.documentElement, c = performance.now() - tap.t < 900 ? tap : {x:innerWidth/2, y:innerHeight*.3};
    html.dataset.vt = target==="home" ? "back" : "fwd";
    html.style.setProperty("--vx", c.x + "px"); html.style.setProperty("--vy", c.y + "px");
    try{
      let ran = false; const once = () => { if(!ran){ ran = true; run(); } };
      const t = document.startViewTransition(once);
      setTimeout(once, 500);                                       /* if the browser never calls us back, change the page anyway */
      t.ready.catch(()=>{}); t.updateCallbackDone.catch(()=>{});
      t.finished.catch(()=>{}).then(()=>{ delete html.dataset.vt; });
    }catch(err){ run(); }
  };
  function afterShow(name){
    if(name!=="home"){
      const v = document.querySelector(`main [data-view="${name}"]`);
      if(v && !calm()){ v.classList.add("vin"); setTimeout(()=>v.classList.remove("vin"), 1100); }
    }
    buddyUpdate(); skyUpdate();
  }

  /* ----- 3: a pill under the chosen button of a segmented choice ----- */
  function placePill(seg, instant){
    const pill = seg._pill, b = seg.querySelector('button[aria-pressed="true"]');
    if(!b || !b.offsetWidth){ pill.style.opacity = 0; return; }
    const first = !seg._placed;
    if(instant || first) pill.style.transition = "none";
    pill.style.opacity = 1; pill.style.width = b.offsetWidth + "px"; pill.style.height = b.offsetHeight + "px";
    pill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
    if(instant || first){ void pill.offsetWidth; pill.style.transition = ""; seg._placed = true; }
  }
  document.querySelectorAll(".seg").forEach(seg => {
    const pill = document.createElement("span"); pill.className = "seg-pill"; pill.setAttribute("aria-hidden", "true");
    seg.insertBefore(pill, seg.firstChild); seg.classList.add("has-pill"); seg._pill = pill;
    new MutationObserver(()=>placePill(seg)).observe(seg, {subtree:true, attributes:true, attributeFilter:["aria-pressed"]});
    if(window.ResizeObserver) new ResizeObserver(()=>placePill(seg, true)).observe(seg);
    placePill(seg, true);
  });

  /* ----- 4, 5, 6: after an answer (called by js/quiz.js) ----- */
  function goalCheck(){
    try{
      const day = new Date().toDateString();
      if(Progress.stats().today >= dailyGoal() && localStorage.getItem("gl-trophy") !== day){
        localStorage.setItem("gl-trophy", day);
        setTimeout(showTrophy, 900);
      }
    }catch(err){}
  }
  window.animAnswer = function(o){
    if(!calm()){
      const el = o.box.querySelector(".opt.ok, input.ok") || o.box.querySelector('[data-q="fbbox"]');
      if(o.ok && el){
        const r = el.getBoundingClientRect();
        burst(r.left + r.width/2, r.top + Math.min(r.height/2, 40), {n:o.run>=3 ? 20 : 12});
        floatText(o.score, "+1", "good");
        if(o.run>=2) floatText(o.combo, "🔥", "flame");
      }
    }
    goalCheck();
  };
  /* 7: the question slides out to the left, then the next one comes */
  window.animLeave = function(box, done){
    const els = [...box.querySelectorAll(".card, .opts:not([hidden]), .typebox:not([hidden]), .fbbox")];
    if(calm() || !els.length){ done(); return; }
    if(box._leaving) return;
    box._leaving = true;
    const anims = els.map(el => el.animate([{opacity:1, transform:"none"}, {opacity:0, transform:"translateX(-26px) scale(.98)"}], {duration:170, easing:"ease-in", fill:"forwards"}));
    let over = false;
    const fin = () => { if(over) return; over = true; box._leaving = false; try{ done(); }finally{ anims.forEach(a=>a.cancel()); } };
    anims[0].onfinish = fin; setTimeout(fin, 260);
  };

  /* ----- 8: waves around the button while a sound plays ----- */
  let lastTouch = {el:null, t:0}, speaking = null, speakTimer = null;
  document.addEventListener("pointerdown", e => {
    const el = e.target.closest("button, .line, a");
    if(el && !el.classList.contains("opt")) lastTouch = {el, t:performance.now()};
  }, true);
  document.addEventListener("keydown", e => { if(e.key==="Enter" || e.key===" " || e.key==="r" || e.key==="R"){ const el = document.activeElement; if(el && el.matches && el.matches("button, .line, a") && !el.classList.contains("opt")) lastTouch = {el, t:performance.now()}; } }, true);
  document.addEventListener("gl-sound-start", () => {
    clearTimeout(speakTimer);
    if(speaking){ speaking.classList.remove("speaking"); speaking = null; }
    let el = performance.now() - lastTouch.t < 1500 ? lastTouch.el : null;
    if(!el || !el.isConnected) el = [...document.querySelectorAll('main [data-view]:not([hidden]) .hear, main [data-view]:not([hidden]) [data-q="hear"]')].find(b=>b.offsetParent);
    if(el){ el.classList.add("speaking"); speaking = el; }
  });
  document.addEventListener("gl-sound-end", () => {
    clearTimeout(speakTimer);
    speakTimer = setTimeout(()=>{ if(speaking){ speaking.classList.remove("speaking"); speaking = null; } }, 220);   /* a short pause between the words of a sequence keeps the waves */
  });

  /* ----- 9, 11: the drawings ----- */
  const reveal = svg => {
    if(calm() || svg._shown) return;
    svg._shown = true;
    const dir = window.__bdDir || 0; window.__bdDir = 0;
    const stage = svg.closest(".bd-stage");
    if(stage && dir) stage.animate([{opacity:0, transform:`translateX(${dir>0 ? 46 : -46}px)`}, {opacity:1, transform:"none"}], {duration:380, easing:"cubic-bezier(.2,.8,.2,1)"});
    svg.querySelectorAll(":scope > .part").forEach((p, k) => p.animate([{opacity:0}, {opacity:1}], {duration:360, delay:Math.min(k*45, 700), easing:"ease-out", fill:"backwards"}));
    svg.querySelectorAll(".dot").forEach((d, k) => { d.style.transformBox = "fill-box"; d.style.transformOrigin = "center"; d.animate([{scale:"0", opacity:0}, {scale:"1.25", opacity:1, offset:.7}, {scale:"1", opacity:1}], {duration:420, delay:350 + Math.min(k*50, 600), easing:"ease-out", fill:"backwards"}); });
  };
  new MutationObserver(list => {
    for(const m of list) for(const n of m.addedNodes){
      if(n.nodeType!==1) continue;
      if(n.matches && n.matches(".bd-svg")) reveal(n);
      else if(n.querySelectorAll) n.querySelectorAll(".bd-svg").forEach(reveal);
    }
  }).observe(document.querySelector("main"), {childList:true, subtree:true});
  /* the part you touch bounces, and its card slides in */
  document.addEventListener("click", e => {
    if(calm()) return;
    const g = e.target.closest(".bd-svg [data-i], .bd-legend [data-i]");
    if(!g) return;
    const wrap = g.closest(".bd-wrap"); if(!wrap) return;
    const i = g.dataset.i, part = wrap.querySelector(`.bd-svg .part[data-i="${i}"]`), dot = wrap.querySelector(`.bd-svg .dot[data-i="${i}"]`), card = wrap.querySelector("#bdCard");
    if(part){ part.style.transformBox = "fill-box"; part.style.transformOrigin = "center"; part.animate([{scale:"1"}, {scale:"1.09"}, {scale:".97"}, {scale:"1"}], {duration:520, easing:"ease-out"}); }
    if(dot){ dot.style.transformBox = "fill-box"; dot.style.transformOrigin = "center"; dot.animate([{scale:"1"}, {scale:"1.6"}, {scale:"1"}], {duration:420, easing:"cubic-bezier(.2,1.4,.4,1)"}); }
    if(card) card.animate([{opacity:0, transform:"translateY(8px)"}, {opacity:1, transform:"none"}], {duration:300, easing:"ease-out"});
  });

  /* ----- 15: the star of "my words" ----- */
  document.addEventListener("click", e => {
    const b = e.target.closest(".favstar"); if(!b || calm()) return;
    setTimeout(() => {
      b.animate([{scale:"1"}, {scale:"1.5", rotate:"-18deg"}, {scale:"1"}], {duration:450, easing:"cubic-bezier(.2,1.4,.4,1)"});
      if(b.getAttribute("aria-pressed")==="true"){ const r = b.getBoundingClientRect(); burst(r.left + r.width/2, r.top + r.height/2, {n:10, chars:["★","✦","✧"], colors:["#F2C14E","#FFD76A","#FFF0B3"], far:46}); }
    }, 0);
  }, true);

  /* ----- 17: a ring where the mouse clicks ----- */
  document.addEventListener("pointerdown", e => {
    if(e.pointerType!=="mouse" || calm()) return;
    if(!e.target.closest("button, a, .line, .cat, .opt, [role=button], .chip")) return;
    const r = document.createElement("i"); r.className = "fx-ripple";
    r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
    layer.appendChild(r); setTimeout(()=>r.remove(), 650);
  }, true);

  /* ----- 14: the trophy ----- */
  function showTrophy(){
    document.querySelectorAll(".trophy").forEach(t=>t.remove());
    const t = document.createElement("div"); t.className = "trophy"; t.setAttribute("role", "status");
    t.innerHTML = `<div class="tr-card"><svg class="tr-cup" viewBox="0 0 100 100" width="96" height="96" aria-hidden="true">
        <defs><linearGradient id="trg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#E0A421"/></linearGradient></defs>
        <path class="tr-h" d="M26 24 H12 C12 44 20 52 34 54 M74 24 H88 C88 44 80 52 66 54" fill="none" stroke="#E0A421" stroke-width="6" stroke-linecap="round"/>
        <path d="M26 14 H74 V40 C74 58 62 66 50 66 C38 66 26 58 26 40Z" fill="url(#trg)" stroke="#B9801A" stroke-width="2.4"/>
        <rect x="44" y="66" width="12" height="14" fill="#E0A421"/><rect x="30" y="80" width="40" height="10" rx="3" fill="#B9801A"/>
        <path class="tr-star" d="M50 24 l4.4 9 l9.8 1.4 l-7.1 6.9 l1.7 9.7 l-8.8 -4.6 l-8.8 4.6 l1.7 -9.7 l-7.1 -6.9 l9.8 -1.4z" fill="#FFF6D0"/></svg>
      <b lang="el">Μπράβο!</b><span>${esc(tx("Goal reached!"))}</span></div>`;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("show"), 30);
    if(!calm()) for(let k=0; k<4; k++) setTimeout(()=>burst(innerWidth*rnd(.3,.7), innerHeight*rnd(.25,.45), {n:22, far:130}), k*260);
    const close = () => { t.classList.remove("show"); setTimeout(()=>t.remove(), 400); };
    t.onclick = close; setTimeout(close, 4200);
  }
  window.showTrophy = showTrophy;

  /* ----- 12: the owl of the home page ----- */
  const buddy = $("buddy");
  let eyeFrame = 0;
  function buddyUpdate(){
    if(!buddy) return;
    const night = document.documentElement.dataset.tod==="night" || document.documentElement.dataset.tod==="dusk" && new Date().getHours()>=19;
    let done = false; try{ done = Progress.stats().today >= dailyGoal(); }catch(err){}
    const mood = night ? "sleep" : done ? "cheer" : "happy";
    if(buddy.dataset.mood===mood && buddy.firstChild) return;
    buddy.dataset.mood = mood; buddy.innerHTML = mascot(mood, 60);
  }
  if(buddy){
    buddy.setAttribute("aria-label", tx("Say hello to the owl"));
    buddy.onclick = () => {
      const night = buddy.dataset.mood==="sleep";
      showWish(night ? {gr:"Καληνύχτα!", en:"Good night!", fr:"Bonne nuit !"} : {gr:"Καλημέρα!", en:"Good morning!", fr:"Bonjour !"});
      buddy.innerHTML = mascot(night ? "sleep" : "cheer", 60); buddy.dataset.mood = night ? "sleep" : "tap";
      buddy.classList.remove("poke"); void buddy.offsetWidth; buddy.classList.add("poke");
    };
    document.addEventListener("pointermove", e => {
      if(e.pointerType!=="mouse" || eyeFrame || buddy.dataset.mood==="sleep" || !buddy.offsetParent) return;
      eyeFrame = requestAnimationFrame(() => {
        eyeFrame = 0;
        const r = buddy.getBoundingClientRect(), dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d/160)*3;
        buddy.querySelectorAll(".o-pupil, .o-glint").forEach(p => { p.style.transform = `translate(${(dx/d*k).toFixed(2)}px, ${(dy/d*k).toFixed(2)}px)`; });
      });
    });
  }
  setInterval(buddyUpdate, 5*60*1000);

  /* ----- 13: the sky of the home page ----- */
  const sky = document.createElement("div");
  sky.className = "skyfx"; sky.setAttribute("aria-hidden", "true");
  document.body.insertBefore(sky, document.querySelector(".deco") ? document.querySelector(".deco").nextSibling : document.body.firstChild);
  let fwTimer = null, skyKind = "";
  function fireworks(){
    if(document.hidden || currentView!=="home" || calm()) return;
    const x = innerWidth*rnd(.15, .85), y = innerHeight*rnd(.1, .38), col = pickOne(COLORS), n = 18;
    for(let i=0; i<n; i++){
      const p = document.createElement("i"); p.className = "fx-fw"; p.style.left = x + "px"; p.style.top = y + "px"; p.style.setProperty("--c", i%5===0 ? "#fff" : col);
      sky.appendChild(p);
      const a = i/n*Math.PI*2, d = rnd(50, 90);
      p.animate([{transform:"translate(-50%,-50%) scale(1)", opacity:1}, {transform:`translate(calc(-50% + ${Math.cos(a)*d}px), calc(-50% + ${Math.sin(a)*d + 26}px)) scale(.3)`, opacity:0}], {duration:1300, easing:"cubic-bezier(.1,.7,.3,1)", fill:"forwards"}).onfinish = () => p.remove();
    }
  }
  function skyUpdate(){
    const q = new URLSearchParams(location.search).get("fx"), d = new Date(), m = d.getMonth() + 1;
    let kind = null, fw = false;
    if(q){ if(q==="fireworks") fw = true; else if(q!=="off") kind = q; }
    else if(!festOff()){
      kind = m===12 || m<=2 ? "snow" : m>=10 && m<=11 ? "leaf" : m>=3 && m<=5 ? "petal" : null;
      fw = !!festCurrent && (festCurrent.id==="gr" || festCurrent.id==="cy" || festCurrent.holiday==="newyear") || (m===12 && d.getDate()===31);
    }
    const key = (kind || "") + (fw ? "+fw" : "");
    if(key!==skyKind){
      skyKind = key; sky.innerHTML = ""; clearInterval(fwTimer);
      if(kind && !calm()){
        const chars = {snow:["❄", "•", "❅"], leaf:["🍂", "🍁"], petal:["🌸", "✿"]}[kind] || ["•"], n = kind==="snow" ? 22 : 9;
        for(let i=0; i<n; i++){
          const s = document.createElement("i"); s.className = "sf " + kind; s.textContent = pickOne(chars);
          s.style.cssText = `--x:${rnd(0,100).toFixed(1)}%;--s:${rnd(.7,1.5).toFixed(2)}rem;--d:${rnd(9,18).toFixed(1)}s;--w:${(-rnd(0,18)).toFixed(1)}s;--dx:${rnd(-80,80).toFixed(0)}px;--r:${rnd(-200,200).toFixed(0)}deg`;
          sky.appendChild(s);
        }
      }
      if(fw && !calm()){ fwTimer = setInterval(fireworks, 2300); setTimeout(fireworks, 600); }
    }
  }
  document.addEventListener("visibilitychange", () => { if(!document.hidden) skyUpdate(); });

  /* the owl and the sky are first set by the first showView() of js/main.js (js/ambient.js, which they need, loads after this file) */
})();
