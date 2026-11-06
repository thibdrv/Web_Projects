/* ---------- write the letters by hand (tab "Write by hand" of Greek letters) ----------
   You see the name of a letter, you draw it with your finger or the mouse, and the app tells you whether it looks like that letter.
   How it recognizes a drawing (no internet, no library):
     1. the ink of the canvas is cut out, resized to a 40 x 40 grid and thinned to a one-pixel line (a "skeleton");
     2. the same is done for the letter drawn by a few fonts (the "models");
     3. the distance between your skeleton and each model is measured (the average distance from each point to the nearest point
        of the other drawing, both ways); the closest letter wins.
   You pass if the asked letter is among the 3 closest ones and the drawing is not too far from it. It is not perfect:
   a button lets you count the answer as right when you are sure. */
const HW_N = 40, HW_PAD = 4;
const HW_FONTS = ['Arial, "Helvetica Neue", sans-serif', '"Times New Roman", Georgia, serif', '"Comic Sans MS", "Segoe Print", "Trebuchet MS", sans-serif'];
const HW_MAX_DIST = 2.9;          /* a drawing farther than this (in grid squares) from the asked letter does not pass */
let hwCase = "lower", hwGuide = true, hwLetter = null, hwDrawn = false, hwChecked = false, hwStreakOK = 0;
let hwModels = null, hwCtx = null, hwCanvas = null;

/* ----- from a canvas to a thin line (list of points) ----- */
function hwThin(g){
  /* Zhang-Suen thinning on a HW_N x HW_N grid of 0 / 1 */
  const N = HW_N, at = (x,y) => (x<0||y<0||x>=N||y>=N) ? 0 : g[y*N+x];
  let changed = true;
  while(changed){
    changed = false;
    for(let step=0; step<2; step++){
      const kill = [];
      for(let y=0; y<N; y++) for(let x=0; x<N; x++){
        if(!g[y*N+x]) continue;
        const p = [at(x,y-1),at(x+1,y-1),at(x+1,y),at(x+1,y+1),at(x,y+1),at(x-1,y+1),at(x-1,y),at(x-1,y-1)];
        const B = p.reduce((a,b)=>a+b,0);
        if(B<2 || B>6) continue;
        let A = 0; for(let i=0;i<8;i++) if(!p[i] && p[(i+1)%8]) A++;
        if(A!==1) continue;
        if(step===0){ if(p[0]*p[2]*p[4] || p[2]*p[4]*p[6]) continue; }
        else        { if(p[0]*p[2]*p[6] || p[0]*p[4]*p[6]) continue; }
        kill.push(y*N+x);
      }
      if(kill.length){ changed = true; kill.forEach(i=>g[i]=0); }
    }
  }
  const pts = [];
  for(let y=0; y<N; y++) for(let x=0; x<N; x++) if(g[y*N+x]) pts.push([x,y]);
  return pts;
}
/* the ink (any non transparent pixel) of a canvas -> points of its skeleton, or null if there is almost nothing */
function hwSkeleton(canvas){
  const w = canvas.width, h = canvas.height, d = canvas.getContext("2d").getImageData(0,0,w,h).data;
  let x0=w, y0=h, x1=-1, y1=-1;
  for(let y=0; y<h; y++) for(let x=0; x<w; x++) if(d[(y*w+x)*4+3]>40){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
  if(x1<0) return null;
  const bw = x1-x0+1, bh = y1-y0+1, s = (HW_N-2*HW_PAD)/Math.max(bw,bh);
  const off = document.createElement("canvas"); off.width = off.height = HW_N;
  const o = off.getContext("2d"); o.imageSmoothingEnabled = true;
  o.drawImage(canvas, x0, y0, bw, bh, (HW_N-bw*s)/2, (HW_N-bh*s)/2, bw*s, bh*s);
  const px = o.getImageData(0,0,HW_N,HW_N).data, g = new Uint8Array(HW_N*HW_N);
  for(let i=0; i<g.length; i++) g[i] = px[i*4+3]>110 ? 1 : 0;
  return hwThin(g);
}
/* the average distance from the points of a to the nearest point of b, and the other way round (plus a small cost for a different length) */
function hwDistance(a, b){
  if(!a.length || !b.length) return 99;
  const one = (p,q) => p.reduce((sum,[x,y])=>{ let m = 1e9; for(const [u,v] of q){ const dd = (x-u)*(x-u)+(y-v)*(y-v); if(dd<m) m = dd; } return sum+Math.sqrt(m); }, 0)/p.length;
  /* a scribble has far more ink than a letter: the more the two lengths differ, the farther the drawings */
  return (one(a,b)+one(b,a))/2 + 1.2*Math.abs(Math.log(a.length/b.length));
}

/* ----- the models: every letter, in 3 fonts ----- */
function hwBuildModels(){
  const c = document.createElement("canvas"); c.width = c.height = 220;
  const x = c.getContext("2d"), out = {lower:{}, upper:{}};
  DATA.alpha.forEach(a=>{
    [["lower",a.l],["upper",a.U]].forEach(([kind,ch])=>{
      out[kind][a.l] = HW_FONTS.map(f=>{
        x.clearRect(0,0,220,220); x.font = `140px ${f}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "#000";
        x.fillText(ch, 110, 118);
        return hwSkeleton(c);
      }).filter(Boolean);
    });
  });
  return out;
}
/* the letters sorted from the closest to the farthest, for a skeleton and a case */
function hwRank(pts, kind){
  if(!hwModels) hwModels = hwBuildModels();
  return DATA.alpha.map(a=>({l:a.l, d:Math.min(...hwModels[kind][a.l].map(m=>hwDistance(pts,m)))})).sort((p,q)=>p.d-q.d);
}

/* ----- drawing ----- */
function hwClear(){
  hwCtx.clearRect(0,0,hwCanvas.width,hwCanvas.height); hwDrawn = false;
}
function hwSetup(canvas){
  hwCanvas = canvas; hwCtx = canvas.getContext("2d");
  hwCtx.lineWidth = 13; hwCtx.lineCap = "round"; hwCtx.lineJoin = "round";
  let last = null, id = null;
  const pos = e => { const r = canvas.getBoundingClientRect(); return [(e.clientX-r.left)*canvas.width/r.width, (e.clientY-r.top)*canvas.height/r.height]; };
  const style = () => { hwCtx.strokeStyle = hwCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#000"; };
  canvas.addEventListener("pointerdown", e=>{
    if(hwChecked) return;
    e.preventDefault(); id = e.pointerId; try{ canvas.setPointerCapture(id); }catch(_){}
    style(); last = pos(e); hwDrawn = true;
    hwCtx.beginPath(); hwCtx.arc(last[0], last[1], hwCtx.lineWidth/2, 0, 7); hwCtx.fill();
  });
  canvas.addEventListener("pointermove", e=>{
    if(last===null || e.pointerId!==id) return;
    e.preventDefault(); const p = pos(e);
    hwCtx.beginPath(); hwCtx.moveTo(last[0], last[1]); hwCtx.lineTo(p[0], p[1]); hwCtx.stroke(); last = p;
  });
  const up = e=>{ if(e.pointerId===id){ last = null; id = null; } };
  canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
}

/* ----- the screen ----- */
function hwPick(){
  const prev = hwLetter && hwLetter.l;
  let a; do { a = oneOf(DATA.alpha); } while(a.l===prev && DATA.alpha.length>1);
  const kind = hwCase==="mix" ? oneOf(["lower","upper"]) : hwCase;
  hwLetter = {...a, kind, glyph: kind==="lower" ? a.l : a.U};
}
function hwRender(){
  const box = $("handBox"); if(!hwLetter) hwPick();
  const L = hwLetter;
  box.innerHTML = `
    <div class="row" id="hwOpts" role="group" aria-label="${esc(tx("Which letters"))}">
      <button class="chip" type="button" data-hwcase="lower" aria-pressed="${hwCase==="lower"}">α ${esc(tx("lowercase"))}</button>
      <button class="chip" type="button" data-hwcase="upper" aria-pressed="${hwCase==="upper"}">Α ${esc(tx("capital"))}</button>
      <button class="chip" type="button" data-hwcase="mix" aria-pressed="${hwCase==="mix"}">${esc(tx("Both"))}</button>
      <button class="chip" type="button" id="hwGuideBtn" aria-pressed="${hwGuide}">👁 ${esc(tx("Show a model"))}</button>
    </div>
    <p class="levelinfo">${esc(tx("Write the letter with your finger or the mouse. Draw it big. The model is only a help: turn it off to write from memory."))}</p>
    <div class="card hwcard">
      <p class="vinfo">${esc(tx(L.kind==="lower" ? "Write the small letter" : "Write the capital letter"))}</p>
      <p class="word s"><span lang="el">${esc(L.name)}</span></p>
      <p class="vinfo">${esc(L.nameLat)} · ${esc(tx(L.sound))}</p>
      <div class="btns"><button class="hear" type="button" id="hwHear">🔊 ${esc(tx("Listen"))}</button>
      ${strokesOf(L, L.kind) ? `<button class="hear" type="button" id="hwWatch">▶ ${esc(tx("Show how to write it"))}</button>` : ""}</div>
    </div>
    <div class="hwpad"><div class="hwdemo" id="hwDemo" hidden></div><div class="hwghost" id="hwGhost" lang="el" ${hwGuide ? "" : "hidden"}>${esc(L.glyph)}</div><canvas id="hwCanvas" width="360" height="360" aria-label="${esc(tx("Drawing area"))}"></canvas></div>
    <div class="btns"><button class="btn ghost" type="button" id="hwClear">${esc(tx("Clear"))}</button><button class="btn" type="button" id="hwCheck">${esc(tx("Check"))}</button></div>
    <p class="feedback" id="hwFb" aria-live="polite"></p>
    <div class="answer" id="hwAns"></div>`;
  hwChecked = false; hwDrawn = false;
  hwSetup($("hwCanvas"));
  box.querySelectorAll("[data-hwcase]").forEach(b=>b.onclick = ()=>{ hwCase = b.dataset.hwcase; hwPick(); hwRender(); });
  $("hwGuideBtn").onclick = ()=>{ hwGuide = !hwGuide; hwRender(); };
  $("hwHear").onclick = ()=>play(L.a);
  if($("hwWatch")) $("hwWatch").onclick = ()=>{ const d = $("hwDemo"); d.hidden = false; d.innerHTML = ""; void d.offsetWidth; d.innerHTML = strokeDemo(L, L.kind); $("hwWatch").textContent = "↻ " + tx("Show it again"); };
  $("hwClear").onclick = ()=>{ if(hwChecked) hwRender(); else hwClear(); };
  $("hwCheck").onclick = hwCheck;
  play(L.a);
}
function hwResult(ok, text, note){
  hwChecked = true;
  const fb = $("hwFb"); fb.textContent = text; fb.className = "feedback " + (ok ? "good" : "bad");
  $("hwAns").innerHTML = note || "";
  Progress.record({key:"hand:"+hwLetter.kind+":"+hwLetter.l, gr:hwLetter.glyph, en:"letter "+hwLetter.U+" "+hwLetter.l, fr:"lettre "+hwLetter.U+" "+hwLetter.l,
                   lat:hwLetter.nameLat, snd:hwLetter.a, cat:"Greek letters"}, ok);
  const go = $("hwCheck"); go.textContent = tx("Next"); go.onclick = ()=>{ hwPick(); hwRender(); };
  $("hwClear").textContent = tx("Try again");
}
function hwCheck(){
  if(hwChecked) return;
  if(!hwDrawn){ const fb = $("hwFb"); fb.textContent = tx("Draw the letter first"); fb.className = "feedback bad"; return; }
  const pts = hwSkeleton(hwCanvas), L = hwLetter;
  if(!pts || pts.length<4){ const fb = $("hwFb"); fb.textContent = tx("That is too small: draw the letter bigger."); fb.className = "feedback bad"; return; }
  const rank = hwRank(pts, L.kind), pos = rank.findIndex(r=>r.l===L.l), best = rank[0], mine = rank[pos];
  const glyph = a => `<span lang="el" class="hwbig">${esc(L.kind==="lower" ? a.l : a.U)}</span>`;
  const model = `<p>${esc(tx("Model"))}: ${glyph(L)}</p>`;
  if(pos<3 && mine.d<=HW_MAX_DIST){
    hwStreakOK++;
    hwResult(true, "Σωστά! " + tx(pos===0 ? "That looks like the right letter" : "Close enough: that is the right letter"), model);
  } else {
    const other = DATA.alpha.find(a=>a.l===best.l);
    const text = best.d<=HW_MAX_DIST && best.l!==L.l ? tx("It looks more like {letter}.", {letter:(L.kind==="lower" ? other.l : other.U)+" ("+other.nameLat+")"}) : tx("I could not recognize it. Draw it bigger and slower.");
    hwResult(false, text, model + `<button class="btn ghost" type="button" id="hwForce">✔ ${esc(tx("I wrote it correctly"))}</button>`);
    $("hwForce").onclick = ()=>{
      Progress.record({key:"hand:"+L.kind+":"+L.l, gr:L.glyph, en:"letter "+L.U+" "+L.l, fr:"lettre "+L.U+" "+L.l, lat:L.nameLat, snd:L.a, cat:"Greek letters"}, true);
      $("hwFb").textContent = "Σωστά! " + tx("Correct"); $("hwFb").className = "feedback good"; $("hwForce").remove();
    };
  }
  renderHomeProgress();
}
function openHand(){
  if(!hwLetter) hwPick();
  hwRender();
}
