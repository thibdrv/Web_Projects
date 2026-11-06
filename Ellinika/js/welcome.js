/* ---------- the welcome screen: shown once, to a new visitor ----------
   Three short steps on top of the home page: the language, the daily goal, where to start (the level test, the letters, or "I choose myself"),
   then, when the app can be installed, a last step to put it on the phone or computer. It is not shown when the device already has progress
   or has seen it ("gl-welcome"), nor in the self-check (?check=1). The button "Show the welcome screen" in the Settings opens it again. */
function showWelcome(force){
  if($("welcome")) return;
  let step = 0;
  const steps = ["lang", "goal", "start"];
  if(typeof PWA!=="undefined" && PWA.web && !PWA.standalone() && (PWA.deferred || PWA.ios())) steps.push("install");
  const box = document.createElement("div"); box.id = "welcome"; box.className = "welcome"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "welcomeTitle");
  box.innerHTML = `<div class="wl-panel"><img class="wl-logo" src="icons/icon-192.png" width="72" height="72" alt="" aria-hidden="true"><div class="wl-body" id="wlBody"></div>
    <div class="wl-dots" id="wlDots" aria-hidden="true"></div><div class="wl-nav" id="wlNav"></div></div>`;
  document.body.appendChild(box);
  const body = box.querySelector("#wlBody"), nav = box.querySelector("#wlNav"), dots = box.querySelector("#wlDots");
  const finish = (go)=>{
    try{ localStorage.setItem("gl-welcome", "1"); }catch(e){}
    box.classList.remove("show"); setTimeout(()=>box.remove(), 250);
    document.removeEventListener("keydown", keys);
    if(go) location.hash = go;
  };
  const keys = e=>{ if(e.key==="Escape") finish(); };
  document.addEventListener("keydown", keys);

  function draw(){
    const s = steps[step], last = step===steps.length-1;
    dots.innerHTML = steps.map((_,i)=>`<i class="${i===step ? "on" : ""}"></i>`).join("");
    if(s==="lang"){
      body.innerHTML = `<h2 id="welcomeTitle">${esc(tx("Welcome to Elliniká!"))}</h2><p>${esc(tx("Let us set up your app in a few quick steps."))}</p>
        <p class="wl-q">${esc(tx("Choose your language"))}</p>
        <div class="seg wl-seg" role="group" aria-label="${esc(tx("Language"))}"><button type="button" data-l="en" aria-pressed="${LANG==="en"}">English</button><button type="button" data-l="fr" aria-pressed="${LANG==="fr"}">Français</button></div>`;
      body.querySelectorAll("[data-l]").forEach(b=>b.onclick = ()=>{ if(b.dataset.l!==LANG) setLang(b.dataset.l); draw(); });
    } else if(s==="goal"){
      const cur = typeof dailyGoal==="function" ? dailyGoal() : 10;
      body.innerHTML = `<h2 id="welcomeTitle">${esc(tx("Your daily goal"))}</h2><p>${esc(tx("How many answers do you want to give each day? You can change it later on the home page."))}</p>
        <div class="wl-goals">${[10,20,30].map((n,i)=>`<button type="button" class="wl-goal" data-g="${n}" aria-pressed="${cur===n}"><b>${n}</b><span>${esc(tx(["Relaxed","Regular","Serious"][i]))}</span></button>`).join("")}</div>`;
      body.querySelectorAll("[data-g]").forEach(b=>b.onclick = ()=>{ try{ localStorage.setItem("gl-goal", b.dataset.g); }catch(e){} body.querySelectorAll("[data-g]").forEach(x=>x.setAttribute("aria-pressed", x===b)); });
    } else if(s==="start"){
      body.innerHTML = `<h2 id="welcomeTitle">${esc(tx("Where do you start?"))}</h2>
        <div class="wl-choices">
          <button type="button" class="wl-choice" data-go="letters"><b>${esc(tx("I am a beginner"))}</b><span>${esc(tx("Start with the Greek letters."))}</span></button>
          <button type="button" class="wl-choice" data-go="leveltest"><b>${esc(tx("I know some Greek"))}</b><span>${esc(tx("Take the level test (40 questions) to find where to start."))}</span></button>
          <button type="button" class="wl-choice" data-go="home"><b>${esc(tx("I will choose myself"))}</b><span>${esc(tx("Go to the menu and look around."))}</span></button>
        </div>`;
      body.querySelectorAll("[data-go]").forEach(b=>b.onclick = ()=>finish(b.dataset.go));
    } else {
      body.innerHTML = `<h2 id="welcomeTitle">${esc(tx("Put it on your phone or computer"))}</h2><p>${esc(tx("You can install Elliniká like an app. It then works without internet."))}</p>
        <button type="button" class="btn" id="wlInstall">${esc(tx("Install the app"))}</button>`;
      $("wlInstall").onclick = ()=>{ const b = $("pwaSet"); if(b) b.click(); };
    }
    nav.innerHTML = "";
    const skip = document.createElement("button"); skip.type = "button"; skip.className = "wl-skip"; skip.textContent = tx("Skip"); skip.onclick = ()=>finish(); nav.appendChild(skip);
    if(step>0){ const back = document.createElement("button"); back.type = "button"; back.className = "btn ghost"; back.textContent = tx("Back"); back.onclick = ()=>{ step--; draw(); }; nav.appendChild(back); }
    if(s!=="start"){
      const nx = document.createElement("button"); nx.type = "button"; nx.className = "btn";
      nx.textContent = last ? tx("Start learning") : tx("Next"); nx.onclick = ()=>{ if(last) finish(); else { step++; draw(); } }; nav.appendChild(nx);
    }
    const f = body.querySelector("button"); if(f) try{ f.focus({preventScroll:true}); }catch(e){}
  }
  draw();
  void box.offsetWidth; box.classList.add("show");
}
(function(){
  if(/[?&]check=1\b/.test(location.search)) return;
  let seen = false;
  try{ seen = !!localStorage.getItem("gl-welcome"); }catch(e){ seen = true; }
  if(seen || (typeof Progress!=="undefined" && Progress.list().length)) return;
  const later = ()=>{ if($("splash")) setTimeout(later, 300); else setTimeout(showWelcome, 500); };   /* after the opening animation */
  addEventListener("load", ()=>setTimeout(later, 300));
})();
