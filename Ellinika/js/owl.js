/* ---------- the owl of the home page reacts ----------
   It waves and says hello after the welcome screen, cheers when you earn a badge or reach the goal of the day, and falls asleep when you do nothing for a minute
   (a tap wakes it). owlSay(text, mood) shows a small speech bubble above it (only where the owl is visible: the home page). The other pages have their own small owls in the quizzes. */
(function(){
  const buddy = $("buddy"); if(!buddy) return;
  let bubble = null, hideTimer = 0, idleTimer = 0, asleep = false, before = null;
  const visible = () => getComputedStyle(buddy).display !== "none" && buddy.getClientRects().length > 0;   /* (a fixed element has no offsetParent) */
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  function place(){
    if(!bubble) return;
    const r = buddy.getBoundingClientRect();
    bubble.style.right = Math.max(8, innerWidth - r.right) + "px"; bubble.style.bottom = (innerHeight - r.top + 6) + "px";
  }
  window.owlSay = function(text, mood){
    if(!visible()) return;
    wake(true);
    if(!bubble){ bubble = document.createElement("div"); bubble.className = "owlsay"; bubble.setAttribute("role", "status"); document.body.appendChild(bubble); }
    bubble.textContent = text; place(); void bubble.offsetWidth; bubble.classList.add("show");
    if(mood && typeof mascot==="function"){ buddy.innerHTML = mascot(mood, 60); buddy.dataset.mood = mood; }
    buddy.classList.remove("poke"); void buddy.offsetWidth; buddy.classList.add("poke");
    clearTimeout(hideTimer); hideTimer = setTimeout(()=>{ if(bubble) bubble.classList.remove("show"); }, 3600);
  };
  window.owlWave = function(text){
    if(!visible()) return;
    owlSay(text || tx("Hello! Welcome."), "cheer");
    if(!calm()){ buddy.classList.add("wave"); setTimeout(()=>buddy.classList.remove("wave"), 2600); }
  };

  /* asleep after a minute of nothing */
  function sleep(){
    if(asleep || !visible() || typeof mascot!=="function" || buddy.dataset.mood==="sleep") return;
    asleep = true; before = {html: buddy.innerHTML, mood: buddy.dataset.mood};
    buddy.innerHTML = mascot("sleep", 60); buddy.dataset.mood = "sleep";
  }
  function wake(quiet){
    clearTimeout(idleTimer);
    if(asleep){
      asleep = false;
      if(before){ buddy.innerHTML = before.html; buddy.dataset.mood = before.mood || ""; before = null; }
      if(!quiet && visible() && !calm()){ buddy.classList.remove("poke"); void buddy.offsetWidth; buddy.classList.add("poke"); }
    }
    idleTimer = setTimeout(sleep, 60000);
  }
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach(ev=>addEventListener(ev, ()=>wake(), {passive:true}));
  wake(true);
  addEventListener("scroll", place, {passive:true}); addEventListener("resize", place);

  /* hello: once, when the welcome screen is over (or on the first visit of a device that already has progress, nothing) */
  const done = () => { try{ return localStorage.getItem("gl-owlhello")==="1"; }catch(e){ return true; } };
  const mark = () => { try{ localStorage.setItem("gl-owlhello", "1"); }catch(e){} };
  if(!done() && Progress.list().length) mark();                          /* a device that already has progress is not greeted as new */
  const watch = setInterval(()=>{
    if(done()){ clearInterval(watch); return; }
    if(document.getElementById("welcome")) return;                      /* the welcome screen is still there */
    let seen = false; try{ seen = localStorage.getItem("gl-welcome")==="1"; }catch(e){}
    if(seen && visible()){ clearInterval(watch); mark(); setTimeout(()=>owlWave(), 700); }
  }, 1500);

  /* the daily goal, reached for the first time today: the owl cheers */
  const recordBase = Progress.record;
  Progress.record = function(item, ok){
    const before = Progress.stats().today;
    recordBase.call(Progress, item, ok);
    const goal = typeof dailyGoal==="function" ? dailyGoal() : 10, now = Progress.stats().today;
    if(before < goal && now >= goal){ try{ localStorage.setItem("gl-goalday", new Date().toDateString()); }catch(e){} setTimeout(()=>{ if(typeof pwaToast==="function") pwaToast(tx("Goal reached! Bravo!"), null, {owl:true}); owlSay(tx("Goal reached! Bravo!"), "cheer"); }, 900); }
  };
})();
