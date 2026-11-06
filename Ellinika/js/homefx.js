/* ---------- life on the home page ----------
   - the menu (rail / bottom bar) follows the page: on the home page its lit button is the section you are reading
   - tiles and titles that pop in as they come on the screen (css/homenew.css, .fx-ready .fx .in); not when the phone asks for less motion
   - the icon size on a computer: the buttons - and + of the side menu, and the slider of the Settings. Kept in "gl-icos" (0.7 to 1.7), used by css/homenew.css as --icos
   - the opening animation switch of the Settings ("gl-intro": "0" = off). The animation itself is #splash of index.html, finished by js/main.js */
(function(){
  const root = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- opening animation: on / off ---- */
  function showIntro(on){
    document.querySelectorAll("[data-intro-set]").forEach(b=>b.setAttribute("aria-pressed", (b.dataset.introSet==="1")===on));
  }
  document.querySelectorAll("[data-intro-set]").forEach(b=>b.onclick = ()=>{
    const on = b.dataset.introSet==="1";
    if(on) delete root.dataset.intro; else root.dataset.intro = "0";
    try{ localStorage.setItem("gl-intro", on ? "1" : "0"); }catch(e){}
    showIntro(on);
  });
  showIntro(root.dataset.intro!=="0");

  /* ---- icon size on a computer ---- */
  const ICO_MIN = 0.7, ICO_MAX = 1.7;
  const range = $("icoRange"), out = $("icoOut"), val = $("icoVal");
  function icoNow(){ const v = parseFloat(root.style.getPropertyValue("--icos")); return v>=ICO_MIN && v<=ICO_MAX ? v : 1; }
  function setIcos(v, save){
    v = Math.round(Math.min(ICO_MAX, Math.max(ICO_MIN, v))*10)/10;
    if(v===1) root.style.removeProperty("--icos"); else root.style.setProperty("--icos", v);
    if(save){ try{ localStorage.setItem("gl-icos", v); }catch(e){} }
    const pct = Math.round(v*100) + "%";
    if(range) range.value = Math.round(v*100);
    if(out) out.textContent = pct;
    if(val) val.textContent = pct;
  }
  setIcos(icoNow(), false);
  if($("icoMinus")) $("icoMinus").onclick = ()=>setIcos(icoNow() - 0.1, true);
  if($("icoPlus")) $("icoPlus").onclick = ()=>setIcos(icoNow() + 0.1, true);
  if(val) val.onclick = ()=>setIcos(1, true);
  if(range) range.oninput = ()=>setIcos(range.value/100, true);

  /* ---- the menu follows the page ----
     The menu (a rail on a computer, the bar at the bottom of a phone) is the only navigation: on the home page its lit button is the section you are in
     (Today = Home, Practice now = Practice, Learn / Vocabulary / Tools = Learn). A tap on Learn or Practice scrolls there (goSection, js/homeui.js). */
  const SPY = [["secToday","home"], ["secPractice","practice"], ["dashTabs","learn"], ["secLearn","learn"], ["secVocab","learn"], ["secTools","learn"]];
  window.homeSection = function(){
    let cur = "home";
    if(scrollY < 120) return cur;
    SPY.forEach(([id, nav])=>{ const el = document.getElementById(id); if(el && el.offsetParent && el.getBoundingClientRect().top < (id==="dashTabs" ? 380 : 170)) cur = nav; });   /* the tabs count as soon as they are well on the screen */
    return cur;
  };
  let ticking = false, last = "";
  function spyMenu(){
    ticking = false;
    if(typeof currentView!=="undefined" && currentView!=="home") return;
    const now = homeSection();
    if(now !== last){ last = now; if(typeof navUpdate==="function") navUpdate("home"); }
  }
  addEventListener("scroll", ()=>{ if(!ticking){ ticking = true; setTimeout(spyMenu, 90); } }, {passive:true});
  addEventListener("hashchange", ()=>setTimeout(()=>{ last = ""; spyMenu(); }, 150));

  /* ---- tabs of the home page on a wide screen (css/homenew.css, section 7) ----
     Learn, Vocabulary and Tools are three tabs: one group of tiles at a time, so the page no longer runs on for ever. On a phone the same three groups stay one under the other
     (the tab bar is hidden there). The tab is kept in "gl-tab". */
  const home = document.querySelector(".home"), tabBar = $("dashTabs");
  const tabBtns = tabBar ? [...tabBar.querySelectorAll("[data-dtab]")] : [];
  function movePill(){
    const on = tabBtns.find(b=>b.getAttribute("aria-selected")==="true"); if(!on || !on.offsetWidth) return;
    tabBar.style.setProperty("--x", on.offsetLeft + "px"); tabBar.style.setProperty("--w", on.offsetWidth + "px");
  }
  window.homeTab = function(name, save){
    if(!tabBtns.some(b=>b.dataset.dtab===name)) name = "learn";
    ["learn","vocab","tools"].forEach(t=>home.classList.toggle("tab-" + t, t===name));
    tabBtns.forEach(b=>{ const on = b.dataset.dtab===name; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
    movePill();
    if(save){ try{ localStorage.setItem("gl-tab", name); }catch(e){} }
  };
  if(home && tabBar){
    let saved = "learn"; try{ saved = localStorage.getItem("gl-tab") || "learn"; }catch(e){}
    homeTab(saved, false);
    tabBtns.forEach((b, i)=>{
      b.onclick = ()=>homeTab(b.dataset.dtab, true);
      b.onkeydown = e=>{
        const d = e.key==="ArrowRight" ? 1 : e.key==="ArrowLeft" ? -1 : 0; if(!d) return;
        const n = tabBtns[(i + d + tabBtns.length) % tabBtns.length]; n.click(); n.focus(); e.preventDefault();
      };
    });
    addEventListener("resize", movePill);
    addEventListener("hashchange", ()=>setTimeout(movePill, 60));   /* the bar has no size while another page is shown */
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);
    setTimeout(movePill, 400);
  }

  /* ---- the arrow at the foot of the first screen: scroll to the rest of the page ---- */
  if($("heroScroll")) $("heroScroll").onclick = ()=>{
    const to = $("secToday"); if(!to) return;
    const y0 = scrollY;
    to.scrollIntoView({behavior:"smooth", block:"start"});
    setTimeout(()=>{ if(Math.abs(scrollY - y0) < 2) to.scrollIntoView({block:"start"}); }, 600);
  };

  /* ---- tiles that pop in ---- */
  if(!calm && "IntersectionObserver" in window){
    root.classList.add("fx-ready");
    const io = new IntersectionObserver(entries=>entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target; io.unobserve(el);
      el.classList.add("in");
      setTimeout(()=>el.classList.remove("fx", "in"), 1300);   /* afterwards the tile behaves as before (hover, press) */
    }), {rootMargin:"0px 0px -4% 0px", threshold:0.04});
    document.querySelectorAll(".home .grid:not(.g-recent) .cat, .home .today, .home .sect").forEach(el=>{
      el.classList.add("fx");
      const i = [...el.parentNode.children].filter(x=>x.classList.contains("cat")).indexOf(el);
      el.style.setProperty("--d", (i<0 ? 0 : (i%6)*55) + "ms");
      io.observe(el);
    });
  }
})();
