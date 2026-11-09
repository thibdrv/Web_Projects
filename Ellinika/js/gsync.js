/* ---------- save the progress in your Google account ----------
   An option, off until you tap "Sign in with Google" (page "Review & progress", panel "Backup"). Nothing is sent to Google before that, and the Google
   script is only loaded at that moment.
   What it does: the learning data of this browser (the keys listed in gsKeyOk: progress, days, badges, favourites...) is put in ONE small file in the hidden
   "app data" folder of your Google Drive. Only this app can open that folder, and the app asks for nothing else (scope drive.appdata): it cannot see your other files.
   On another device, sign in with the same account and tap "Sync now": the two copies are merged (see gsMerge), not replaced.
   There is no server of ours: the browser talks to Google directly (Google Identity Services, "token" mode). The access token lives in memory only (about an hour).
   The panel and the sign-in only work when GSYNC.clientId is filled (see LISEZMOI.md: "Se connecter avec Google") and when the app is opened from a web address (not from a file). The account button of every page is in js/account.js.
   Known limits: a word removed from the favourites on one device can come back after a sync (copies are merged, not compared event by event);
   the counters of a word that was practiced on two devices keep the larger value. */
const GSYNC = {
  clientId: "",                                      /* "123456789-abcdef.apps.googleusercontent.com" (made in Google Cloud Console, see LISEZMOI.md). It is not a secret. */
  scope: "openid profile email https://www.googleapis.com/auth/drive.appdata",   /* who you are (name, photo) + the hidden app folder of your Drive */
  fileName: "ellinika-progress.json"
};
const GS_STATE = "elk-google";                      /* who is signed in, and when: not named "gl-" so that backups and transfer codes never carry it */
const GS_KEYS = ["gl-progress", "gl-days", "gl-meta", "gl-badges", "gl-fav", "gl-mastered", "gl-level-test", "gl-talk"];
const gsKeyOk = k => GS_KEYS.includes(k) || k.startsWith("gl-best-");
const gsAvailable = () => !!GSYNC.clientId && /^https?:$/.test(location.protocol);

const gsState = () => { try{ return JSON.parse(localStorage.getItem(GS_STATE)) || null; }catch(e){ return null; } };
const gsSetState = s => {
  try{ if(s) localStorage.setItem(GS_STATE, JSON.stringify(s)); else localStorage.removeItem(GS_STATE); }catch(e){}
  document.dispatchEvent(new Event("gsync-change"));          /* the account button (js/account.js) and the panel repaint themselves */
};
let gsTok = null, gsLib = null;                     /* gsTok: {value, exp}; gsLib: the loading of the Google script */

/* ----- what is synced: the data of this browser, and how two copies are merged ----- */
function gsSnapshot(){
  const data = {};
  try{ for(let i=0; i<localStorage.length; i++){ const k = localStorage.key(i); if(k && gsKeyOk(k)) data[k] = localStorage.getItem(k); } }catch(e){}
  return data;
}
const gsParse = s => { try{ return JSON.parse(s); }catch(e){ return s; } };
const gsSort = v => Array.isArray(v) ? v.map(gsSort) : v && typeof v==="object" ? Object.fromEntries(Object.keys(v).sort().map(k=>[k, gsSort(v[k])])) : v;
const gsCanon = s => JSON.stringify(gsSort(gsParse(s)));          /* the same content gives the same text, whatever the order of the keys */
const gsHash = data => { const keys = Object.keys(data).sort(); return fnv32(keys.map(k=>k + "=" + gsCanon(data[k])).join("\n")); };

/* two values of the same key: numbers keep the larger, booleans are OR-ed, lists are joined, objects are merged key by key; anything else keeps the local one */
function gsDeep(a, b){
  if(a===undefined || a===null) return b;
  if(b===undefined || b===null) return a;
  if(typeof a==="number" && typeof b==="number") return Math.max(a, b);
  if(typeof a==="boolean" && typeof b==="boolean") return a || b;
  if(Array.isArray(a) && Array.isArray(b)){ const seen = new Set(a.map(x=>JSON.stringify(x))); return a.concat(b.filter(x=>!seen.has(JSON.stringify(x)))); }
  if(a && b && typeof a==="object" && typeof b==="object" && !Array.isArray(a) && !Array.isArray(b)){
    const out = {}; new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k=>{ out[k] = gsDeep(a[k], b[k]); }); return out;
  }
  return a;
}
function gsMerge(key, a, b){
  if(key==="gl-level-test") return b && (!a || String(b.date||"") > String(a.date||"")) ? b : a;     /* the latest test */
  if(key==="gl-progress"){                                                                           /* a word: the copy practiced last, with the larger counters */
    const out = {};
    new Set([...Object.keys(a||{}), ...Object.keys(b||{})]).forEach(k=>{
      const x = (a||{})[k], y = (b||{})[k];
      if(!x || !y){ out[k] = x || y; return; }
      const r = {...((y.last||0) > (x.last||0) ? y : x)};
      ["seen", "right", "wrong", "lapses"].forEach(f=>{ const m = Math.max(x[f]||0, y[f]||0); if(m || f in r) r[f] = m; });
      out[k] = r;
    });
    return out;
  }
  return gsDeep(a, b);
}
function gsMergeAll(local, remote){
  const out = {};
  new Set([...Object.keys(local), ...Object.keys(remote)]).forEach(k=>{
    if(!gsKeyOk(k)) return;
    if(!(k in local)) out[k] = remote[k];
    else if(!(k in remote) || typeof remote[k]!=="string") out[k] = local[k];
    else out[k] = JSON.stringify(gsMerge(k, gsParse(local[k]), gsParse(remote[k])));
  });
  return out;
}

/* ----- Google: the script, the sign-in, the Drive calls ----- */
function gsLoadLib(){
  if(window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
  if(gsLib) return gsLib;
  gsLib = new Promise((ok, no)=>{
    const s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.async = true;
    s.onload = ()=>ok(); s.onerror = ()=>{ gsLib = null; s.remove(); no(new Error("offline")); };
    document.head.appendChild(s);
  });
  return gsLib;
}
/* a token from Google: the sign-in window opens (it must be called by a tap) */
function gsAsk(){
  return gsLoadLib().then(()=>new Promise((ok, no)=>{
    const st = gsState();
    const client = google.accounts.oauth2.initTokenClient({
      client_id: GSYNC.clientId, scope: GSYNC.scope, hint: (st && st.email) || undefined,
      callback: r=>{
        if(r.error) return no(new Error(r.error));
        if(!/drive\.appdata/.test(r.scope || "")) return no(new Error("scope"));
        gsTok = {value:r.access_token, exp:Date.now() + ((+r.expires_in || 3600) - 60) * 1000};
        ok(gsTok.value);
      },
      error_callback: e=>no(new Error((e && e.type) || "popup"))
    });
    client.requestAccessToken();
  }));
}
const gsTokenNow = () => gsTok && gsTok.exp > Date.now() ? Promise.resolve(gsTok.value) : gsAsk();
async function gsFetch(url, opts = {}){
  const t = await gsTokenNow();
  const r = await fetch(url, {...opts, headers:{Authorization:"Bearer " + t, ...(opts.headers || {})}});
  if(r.status===401){ gsTok = null; throw new Error("auth"); }
  if(!r.ok) throw new Error("http" + r.status);
  return r;
}
const GS_API = "https://www.googleapis.com/drive/v3/", GS_UP = "https://www.googleapis.com/upload/drive/v3/";
async function gsFindFile(){
  const q = encodeURIComponent(`name='${GSYNC.fileName}' and trashed=false`);
  const r = await gsFetch(`${GS_API}files?spaces=appDataFolder&q=${q}&pageSize=1&fields=files(id,modifiedTime)`);
  return ((await r.json()).files || [])[0] || null;
}
async function gsReadFile(id){ return (await gsFetch(`${GS_API}files/${id}?alt=media`)).json(); }
async function gsWriteFile(id, data){
  const body = JSON.stringify({app:"greek-trainer", version:1, date:new Date().toISOString(), data});
  if(id) return (await gsFetch(`${GS_UP}files/${id}?uploadType=media&fields=id,modifiedTime`, {method:"PATCH", headers:{"Content-Type":"application/json"}, body})).json();
  const bd = "ellinika" + Math.random().toString(36).slice(2), meta = JSON.stringify({name:GSYNC.fileName, parents:["appDataFolder"], mimeType:"application/json"});
  const multi = `--${bd}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${bd}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${bd}--`;
  return (await gsFetch(`${GS_UP}files?uploadType=multipart&fields=id,modifiedTime`, {method:"POST", headers:{"Content-Type":"multipart/related; boundary=" + bd}, body:multi})).json();
}
/* who is signed in: name, first name, e-mail and the small photo of the Google account */
async function gsWho(){
  const u = await (await gsFetch("https://www.googleapis.com/oauth2/v3/userinfo")).json();
  return {email:u.email || "", name:u.name || u.email || "", first:u.given_name || (u.name || "").split(" ")[0] || "", picture:u.picture || ""};
}

/* the whole sync: read the Google copy, merge, write what changed. Returns {changedHere}: true when this browser got something new (the page must then reload) */
async function gsSync(){
  const local = gsSnapshot(), file = await gsFindFile(), remote = file ? (await gsReadFile(file.id)).data || {} : null;
  const merged = remote ? gsMergeAll(local, remote) : local;
  const differs = (x, y) => Object.keys({...x, ...y}).filter(gsKeyOk).some(k=>(k in x ? gsCanon(x[k]) : null) !== (k in y ? gsCanon(y[k]) : null));
  const changedHere = !!remote && differs(local, merged);
  let time = file && file.modifiedTime;
  if(!remote || differs(remote, merged)){ const w = await gsWriteFile(file && file.id, merged); time = w.modifiedTime; }
  if(changedHere){ try{ Object.keys(merged).forEach(k=>{ if(gsKeyOk(k) && typeof merged[k]==="string") localStorage.setItem(k, merged[k]); }); }catch(e){} }
  const st = gsState() || {};
  gsSetState({...st, last:Date.now(), remoteTime:time, hash:gsHash(merged), stale:false, flash:changedHere ? "updated" : ""});
  return {changedHere};
}

/* every minute, while you are signed in and the token is still alive: if this browser has new progress and the Google copy was not changed by another device, save it quietly.
   (If another device changed it, the panel says so: merging into a page that is open needs a reload, so it waits for a tap on "Sync now".) */
setInterval(async ()=>{
  const st = gsState();
  if(!gsAvailable() || !st || !gsTok || gsTok.exp < Date.now() || document.visibilityState!=="visible") return;
  const snap = gsSnapshot(); if(gsHash(snap)===st.hash) return;
  try{
    const file = await gsFindFile();
    if(file && st.remoteTime && file.modifiedTime!==st.remoteTime){ gsSetState({...st, stale:true}); return; }
    const w = await gsWriteFile(file && file.id, snap);
    gsSetState({...st, last:Date.now(), remoteTime:w.modifiedTime, hash:gsHash(snap), stale:false});
  }catch(e){}
}, 60000);

/* ----- the actions (used by the account button of js/account.js and by the panel below) ----- */
/* sign in, then a first sync. Returns {changedHere} like gsSync. Must be called by a tap. */
async function gsSignIn(){
  await gsAsk();
  const who = await gsWho();
  gsSetState({email:who.email, name:who.name, first:who.first, picture:who.picture, last:0});
  return gsSync();
}
function gsSignOut(){
  const t = gsTok && gsTok.value; gsTok = null; gsSetState(null);
  try{ if(t && window.google && google.accounts) google.accounts.oauth2.revoke(t, ()=>{}); }catch(e){}
}
async function gsDelete(){
  const f = await gsFindFile(); if(f) await gsFetch(`${GS_API}files/${f.id}`, {method:"DELETE"});
  const s = gsState(); if(s) gsSetState({...s, remoteTime:"", hash:"", last:0});
}
/* a sentence for a failure, in the language of the app */
function gsWhy(e){
  const c = (e && e.message) || "";
  if(c==="offline") return tx("Could not reach Google. Check your connection and try again.");
  if(c==="access_denied" || c==="popup_closed" || c==="popup" || c==="popup_closed_by_user") return tx("The Google window was closed or blocked. Try again.");
  if(c==="scope") return tx("Please allow this app to store its data in your Google Drive, then try again.");
  return tx("Google did not accept the request ({code}). Try again later.", {code:c || "?"});
}
const gsWhen = st => st && st.last ? new Date(st.last).toLocaleString(LANG==="fr" ? "fr-FR" : "en-GB", {dateStyle:"medium", timeStyle:"short"}) : "";

/* ----- the panel of the page "Review & progress" (Backup) ----- */
function gsRender(host){
  if(!host) return;
  if(!gsAvailable()){ host.hidden = true; host.innerHTML = ""; return; }
  host.hidden = false;
  const st = gsState(), when = gsWhen(st);
  const msg = (t, kind) => { const m = host.querySelector(".gs-msg"); if(m){ m.textContent = t || ""; m.className = "feedback gs-msg " + (t ? (kind || "good") : ""); } };
  const busy = on => host.querySelectorAll("button").forEach(b=>{ b.disabled = on; });
  const flash = st && st.flash==="updated";
  if(flash) gsSetState({...st, flash:""});
  host.innerHTML = `<h3 class="sub" style="margin-top:0">${esc(tx("Save with Google"))}</h3>
    <p class="muted" style="margin-top:0">${esc(tx("Sign in with your Google account to keep your progress safe and to continue on another phone or computer. It is kept in a hidden folder of your own Google Drive that only this app can open: no other file of your Drive is read."))} ${esc(tx("Signing in is optional: the app works without it."))}</p>
    ${st ? `<p><b>${esc(tx("Signed in as {name}", {name:st.name || st.email || "Google"}))}</b>${st.email && st.name ? ` <span class="muted">(${esc(st.email)})</span>` : ""}${when ? `<br><span class="muted">${esc(tx("Last sync: {date}", {date:when}))}</span>` : ""}${st.stale ? `<br><span class="muted">${esc(tx("Your Google copy is newer: tap Sync now."))}</span>` : ""}</p>
      <div class="btns"><button class="btn" type="button" data-gs="sync">${esc(tx("Sync now"))}</button>
      <button class="btn ghost" type="button" data-gs="out">${esc(tx("Sign out"))}</button>
      <button class="btn ghost" type="button" data-gs="del">${esc(tx("Delete my copy in Google"))}</button></div>`
    : `<div class="btns"><button class="btn" type="button" data-gs="in">${esc(tx("Sign in with Google"))}</button></div>`}
    <p class="feedback gs-msg" aria-live="polite"></p>`;
  if(flash) msg(tx("Your progress was updated from your Google account."));
  const run = async (fn, doneText) => {
    busy(true); msg(tx("Syncing…"), "");
    try{
      const r = await fn();
      if(r && r.changedHere){ msg(tx("Your progress was updated from your Google account.")); setTimeout(()=>location.reload(), 600); return; }
      gsRender(host); msg(doneText);
    }catch(e){ busy(false); msg(gsWhy(e), "bad"); }
  };
  const btn = k => host.querySelector(`[data-gs="${k}"]`);
  const saved = tx("Done: your progress is saved in your Google account.");
  if(btn("in")) btn("in").onclick = ()=>run(gsSignIn, saved);
  if(btn("sync")) btn("sync").onclick = ()=>run(gsSync, saved);
  if(btn("out")) btn("out").onclick = ()=>{ gsSignOut(); gsRender(host); msg(tx("Signed out. Your progress stays on this device.")); };
  if(btn("del")) btn("del").onclick = ()=>{
    if(!confirm(tx("Delete the copy of your progress stored in your Google Drive? Your progress on this device stays."))) return;
    run(gsDelete, tx("The copy in your Google Drive was deleted."));
  };
}
