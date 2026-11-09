/* ---------- the account button: "Sign in with Google", then your name ----------
   It sits next to the settings button (at the top right of the home page, in the top bar of the other pages): index.html has <div class="acct" id="acct"> inside #settings.
   - not signed in: a button "Sign in" with the Google "G". The app works the same without signing in.
   - signed in: your photo (or your initial) and your first name. Tap it: your name and e-mail, the time of the last sync, "Sync now", "Sign out".
   The work itself (sign-in, sync) is in js/gsync.js; this file only draws the button and its small menu, and repaints them when the state changes ("gsync-change"). */
(function(){
  const host = $("acct"); if(!host) return;
  if(!/^https?:$/.test(location.protocol)){ host.hidden = true; return; }        /* Google sign-in does not work from a file */
  const G = `<svg class="ac-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
  let menuOpen = false, working = false, message = "", bad = false;

  const firstName = st => st.first || (st.name || "").split(" ")[0] || st.email || "Google";
  const initial = st => (firstName(st) || "?").trim().charAt(0).toUpperCase();
  /* the round photo, or the initial when there is no photo (or it cannot be loaded) */
  function avatar(st, big){
    const cls = "ac-av" + (big ? " big" : "");
    return st.picture ? `<img class="${cls}" src="${esc(st.picture)}" alt="" referrerpolicy="no-referrer" data-init="${esc(initial(st))}">` : `<span class="${cls} ac-init" aria-hidden="true">${esc(initial(st))}</span>`;
  }

  function render(){
    const st = gsState();
    const label = working ? tx("Syncing…") : st ? firstName(st) : tx("Sign in");
    host.innerHTML = `<button class="ac-btn${st ? " on" : ""}" type="button" id="acctBtn" aria-haspopup="true" aria-expanded="${menuOpen}"
        aria-label="${esc(st ? tx("Account: {name}", {name:st.name || firstName(st)}) : tx("Sign in with Google"))}"${working ? " disabled" : ""}>
        ${st ? avatar(st) : G}<span class="ac-name">${esc(label)}</span></button>
      <div class="ac-menu" id="acctMenu" role="menu"${menuOpen ? "" : " hidden"}></div>`;
    host.querySelectorAll("img.ac-av").forEach(img=>{
      img.onerror = () => { const s = document.createElement("span"); s.className = img.className + " ac-init"; s.textContent = img.dataset.init; img.replaceWith(s); };
    });
    $("acctBtn").onclick = onButton;
    if(menuOpen) fillMenu();
  }

  /* what the small menu says: a failure, the account, or (before the app is set up) a short explanation */
  function fillMenu(){
    const box = $("acctMenu"), st = gsState();
    if(!box) return;
    if(!GSYNC.clientId){
      box.innerHTML = `<p class="ac-note">${esc(tx("Google sign-in is not active yet. Come back soon!"))}</p><p class="ac-note muted">${esc(tx("Signing in is optional: the app works without it."))}</p>`;
      return;
    }
    if(!st){
      box.innerHTML = message ? `<p class="ac-note ${bad ? "bad" : ""}">${esc(message)}</p>` : "";
      box.hidden = !message;
      return;
    }
    const when = gsWhen(st);
    box.innerHTML = `<div class="ac-who">${avatar(st, true)}<div><b>${esc(st.name || firstName(st))}</b>${st.email ? `<span>${esc(st.email)}</span>` : ""}</div></div>
      ${when ? `<p class="ac-note muted">${esc(tx("Last sync: {date}", {date:when}))}</p>` : ""}
      ${gsLive() ? "" : `<p class="ac-note muted">${esc(tx("Automatic saving is paused: tap Sync now."))}</p>`}
      ${st.stale ? `<p class="ac-note muted">${esc(tx("Your Google copy is newer: tap Sync now."))}</p>` : ""}
      ${message ? `<p class="ac-note ${bad ? "bad" : ""}">${esc(message)}</p>` : ""}
      <div class="ac-actions"><button type="button" class="btn" data-ac="sync">${esc(tx("Sync now"))}</button>
      <button type="button" class="btn ghost" data-ac="out">${esc(tx("Sign out"))}</button>
      <a class="ac-link" href="#progress" data-ac="more">${esc(tx("Backup and options"))}</a></div>`;
    box.querySelectorAll("[data-ac]").forEach(el=>{
      const k = el.dataset.ac;
      if(k==="sync") el.onclick = () => run(gsSync, tx("Done: your progress is saved in your Google account."));
      if(k==="out") el.onclick = () => { gsSignOut(); menuOpen = false; message = ""; render(); };
      if(k==="more") el.onclick = () => { menuOpen = false; render(); };
    });
  }

  /* a sign-in or a sync, with the result written in the menu (a page reload when this browser got something new) */
  async function run(fn, done){
    working = true; message = ""; render();
    try{
      const r = await fn();
      if(r && r.changedHere){ message = tx("Your progress was updated from your Google account."); bad = false; working = false; menuOpen = true; render(); setTimeout(()=>location.reload(), 700); return; }
      message = done; bad = false;
    }catch(e){ message = gsWhy(e); bad = true; }
    working = false; menuOpen = true; render();
    if(!bad) setTimeout(()=>{ if(message===done){ message = ""; menuOpen = false; render(); } }, 3500);
  }

  function onButton(){
    const st = gsState();
    if(!GSYNC.clientId){ menuOpen = !menuOpen; render(); return; }
    if(st){ menuOpen = !menuOpen; message = ""; render(); return; }
    run(gsSignIn, tx("Done: your progress is saved in your Google account."));
  }

  document.addEventListener("gsync-change", render);
  window.addEventListener("hashchange", ()=>{ if(menuOpen){ menuOpen = false; } render(); });
  /* composedPath: the button is redrawn during its own click, so e.target may already be out of the page */
  document.addEventListener("click", e=>{ if(menuOpen && !e.composedPath().includes(host)){ menuOpen = false; render(); } });
  document.addEventListener("keydown", e=>{ if(e.key==="Escape" && menuOpen){ menuOpen = false; render(); const b = $("acctBtn"); if(b) b.focus(); } });
  render();
})();
