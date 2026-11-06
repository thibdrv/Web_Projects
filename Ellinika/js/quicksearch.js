/* ---------- quick search (Ctrl+K, the key /, or the magnifier in the top bar) ----------
   One window over any page: type a word of the app (Greek, Latin letters, English or French) or the name of a page.
   Up / Down choose, Enter opens a page or plays a word, Esc closes. Words come from DICT, pages from the tiles of the home page. */
(function(){
  const box = $("qs"), input = $("qsInput"), list = $("qsList");
  let items = [], active = 0, before = null, timer = null, hideTimer = null;
  const HIST_KEY = "gl-qs-hist", qf = {scope:"all", level:"", cat:""};            /* qf: the filters under the box */
  const history = () => { try{ const h = JSON.parse(localStorage.getItem(HIST_KEY)); return Array.isArray(h) ? h.filter(x=>typeof x==="string") : []; }catch(e){ return []; } };
  const remember = q => { q = q.trim(); if(q.length<2) return; try{ localStorage.setItem(HIST_KEY, JSON.stringify([q, ...history().filter(x=>x.toLowerCase()!==q.toLowerCase())].slice(0,6))); }catch(e){} };
  const SPEAKER = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';

  const pages = () => [...document.querySelectorAll('.home .grid:not(.g-recent) .cat[data-go]')].map(t=>({
    type:"page", view:t.dataset.go, icon:(t.querySelector(".ico")||{}).innerHTML || "•",
    title:(t.querySelector(".txt b")||t).textContent.trim(), desc:(t.querySelector(".txt span")||{}).textContent || ""
  }));
  const pageItem = v => pages().find(p=>p.view===v) || {type:"page", view:v, icon:"•", title:(VIEW_TITLES[v]||v).split(" · ")[0], desc:""};

  function build(){
    const raw = input.value.trim(), q = fold(raw), out = [];
    if(!q){
      history().forEach(h=>out.push({type:"hist", q:h}));
      recentViews().slice(0,5).forEach(v=>out.push(pageItem(v)));
      out.label = out.length ? tx("Recent searches and pages") : "";
      return out;
    }
    if(qf.scope!=="words" && !qf.level && !qf.cat) pages().filter(p=>fold(p.title+" "+p.desc).includes(q)).slice(0,4).forEach(p=>out.push(p));
    if(qf.scope==="pages") return out;
    const found = DICT.map(e=>[e, matchScore(e,q)]).filter(([e,s])=>s>0 && (!qf.level || e.lvl===qf.level) && (!qf.cat || e.cats.includes(qf.cat))).sort((a,b)=>b[1]-a[1] || a[0].sortKey.localeCompare(b[0].sortKey,"el"));
    found.slice(0,8).forEach(([e])=>out.push({type:"word", e}));
    if(found.length>8) out.push({type:"dict", raw, n:found.length});
    return out;
  }

  function row(it, i){
    const r = document.createElement("div"); r.className = "qs-row"; r.id = "qs-" + i; r.setAttribute("role","option"); r.dataset.i = i;
    if(it.type==="page"){
      r.innerHTML = `<span class="qs-ico" aria-hidden="true">${it.icon}</span><span class="qs-t"><b>${esc(it.title)}</b><span>${esc(it.desc)}</span></span><span class="qs-tag">${esc(tx("Page"))}</span>`;
    }else if(it.type==="hist"){
      r.innerHTML = `<span class="qs-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg></span><span class="qs-t"><b>${esc(it.q)}</b></span>`;
    }else if(it.type==="word"){
      const e = it.e;
      r.innerHTML = `<span class="qs-ico" aria-hidden="true">${e.emoji ? esc(e.emoji) : "Αβ"}</span><span class="qs-t"><b lang="el">${esc(e.gr)}</b> <i><span class="lt">${esc(e.lat)}</span></i><span>${esc(dictMeaning(e))}</span></span>`;
      r.insertAdjacentHTML("beforeend", `<span class="lvlb" data-l="${e.lvl}">${e.lvl}</span>`);
      const pb = document.createElement("button"); pb.type = "button"; pb.className = "qs-play"; pb.innerHTML = SPEAKER;
      pb.setAttribute("aria-label", tx("Listen")); pb.title = tx("Listen"); pb.onclick = ev=>{ ev.stopPropagation(); play(e.snd); };
      r.appendChild(pb);
      r.appendChild(favButton({gr:e.gr, lat:e.lat, en:e.en, fr:e.fr, snd:e.snd, cat:e.cats[0], emoji:e.emoji}, "round"));
    }else{
      r.className += " qs-more";
      r.innerHTML = `<span class="qs-t"><b>${esc(tx(it.n===1 ? "Open in the dictionary ({n} result) →" : "Open in the dictionary ({n} results) →", {n:it.n}))}</b></span>`;
    }
    r.addEventListener("mousemove", ()=>{ if(active!==i) setActive(i, false); });
    r.addEventListener("click", ev=>{ if(ev.target.closest(".favstar, .qs-play")) return; choose(i); });
    return r;
  }

  function render(){
    items = build();
    list.innerHTML = "";
    if(items.label){
      const h = document.createElement("p"); h.className = "qs-h"; h.textContent = items.label;
      if(history().length){ const c = document.createElement("button"); c.type = "button"; c.className = "qs-clear"; c.textContent = tx("Clear"); c.onclick = ()=>{ try{ localStorage.removeItem(HIST_KEY); }catch(e){} render(); input.focus(); }; h.appendChild(c); }
      list.appendChild(h);
    }
    if(!items.length){
      const p = document.createElement("p"); p.className = "qs-none";
      p.textContent = input.value.trim() ? tx("No word found. Try fewer letters, another spelling, or the English or French word.") : tx("Type a Greek, English or French word, or the name of a page.");
      list.appendChild(p);
    }
    items.forEach((it,i)=>list.appendChild(row(it,i)));
    active = 0; setActive(0, true);
  }

  function setActive(i, scroll){
    active = i;
    list.querySelectorAll(".qs-row").forEach(r=>r.classList.toggle("on", +r.dataset.i===i));
    const r = $("qs-" + i);
    input.setAttribute("aria-activedescendant", r ? r.id : "");
    if(r && scroll) r.scrollIntoView({block:"nearest"});
  }

  function choose(i){
    const it = items[i]; if(!it) return;
    if(it.type==="word"){ remember(input.value); play(it.e.snd); return; }                  /* a word is heard, the window stays open */
    if(it.type==="hist"){ input.value = it.q; render(); input.focus(); return; }               /* an old search is searched again */
    remember(input.value);
    close(true);
    if(it.type==="page") location.hash = it.view;
    else openDictionarySearch(it.raw);
  }

  function open(){
    clearTimeout(hideTimer);
    if(box.classList.contains("show")){ input.focus(); input.select(); return; }
    if(typeof moreOpen==="function" && moreOpen()) closeMore();
    before = document.activeElement;
    box.hidden = false; void box.offsetWidth; box.classList.add("show");
    input.value = ""; fillCats(); paintFilters(); render(); input.focus();
  }
  function close(skipFocus){
    if(box.hidden || !box.classList.contains("show")) return;
    box.classList.remove("show");
    clearTimeout(hideTimer); hideTimer = setTimeout(()=>{ box.hidden = true; }, 260);              /* the fade lasts .25 s */
    if(!skipFocus && before && before.focus){ try{ before.focus(); }catch(err){} }
    before = null;
  }
  window.openQuickSearch = open; window.closeQuickSearch = close;
  window.quickSearchOpen = () => !box.hidden && box.classList.contains("show");

  input.addEventListener("input", ()=>{ clearTimeout(timer); timer = setTimeout(render, 90); });
  /* the filters under the box: where to search, the level, the category */
  function fillCats(){
    const sel = $("qsCat"), count = {};
    DICT.forEach(e=>e.cats.forEach(c=>{ count[c] = (count[c]||0) + 1; }));
    sel.innerHTML = `<option value="">${esc(tx("All categories"))}</option>` + Object.keys(count).sort((a,b)=>tx(a).localeCompare(tx(b), LANG)).map(c=>`<option value="${esc(c)}">${esc(tx(c))} (${count[c]})</option>`).join("");
    sel.value = qf.cat;
  }
  function paintFilters(){
    $("qsScope").querySelectorAll("[data-scope]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.scope===qf.scope));
    $("qsLevel").querySelectorAll("[data-level]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.level===qf.level));
  }
  $("qsScope").addEventListener("click", e=>{ const b = e.target.closest("[data-scope]"); if(!b) return; qf.scope = b.dataset.scope; paintFilters(); render(); input.focus(); });
  $("qsLevel").addEventListener("click", e=>{ const b = e.target.closest("[data-level]"); if(!b) return; qf.level = qf.level===b.dataset.level ? "" : b.dataset.level; paintFilters(); render(); input.focus(); });
  $("qsCat").addEventListener("change", ()=>{ qf.cat = $("qsCat").value; render(); input.focus(); });
  input.addEventListener("keydown", e=>{
    e.stopPropagation();                                              /* the other shortcuts of the app must not react while typing here */
    if(e.key==="Escape"){ e.preventDefault(); close(); }
    else if(e.key==="ArrowDown"){ e.preventDefault(); if(items.length) setActive((active+1)%items.length, true); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); if(items.length) setActive((active-1+items.length)%items.length, true); }
    else if(e.key==="Enter"){ e.preventDefault(); clearTimeout(timer); choose(active); }
    else if(e.key==="Tab"){ e.preventDefault(); }
    else if((e.ctrlKey || e.metaKey) && (e.key==="k" || e.key==="K")){ e.preventDefault(); close(); }
  });
  box.addEventListener("click", e=>{ if(e.target.closest("[data-close]")) close(); });
  $("qsOpen").onclick = open;
  /* Ctrl+K (or Cmd+K) opens it, even when you are typing in a box */
  document.addEventListener("keydown", e=>{
    if((e.ctrlKey || e.metaKey) && !e.altKey && (e.key==="k" || e.key==="K")){ e.preventDefault(); box.classList.contains("show") ? close() : open(); }
  });
  window.addEventListener("hashchange", ()=>close(true));
})();
