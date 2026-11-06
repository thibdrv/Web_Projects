/* ---------- save and restore your progress ----------
   Everything the app remembers (progress, scores, level test, language, look, goal...) sits in this browser under names that start
   with "gl-". "Save" puts all of it in one small file (greek-trainer-backup-DATE.json); "Restore" reads such a file back, on this
   device or another one. Nothing is sent anywhere. */
const BACKUP_APP = "greek-trainer";

function backupData(){
  const data = {};
  try{
    for(let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      if(k && k.startsWith("gl-")) data[k] = localStorage.getItem(k);
    }
  }catch(e){}
  return {app:BACKUP_APP, version:1, date:new Date().toISOString(), data};
}

function saveBackup(){
  const d = backupData(), day = d.date.slice(0,10);
  const blob = new Blob([JSON.stringify(d)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `greek-trainer-backup-${day}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
  return day;
}

/* puts a backup (from a file or from a code) back in this browser, after asking; calls done(true) when restored, done(false, message) if not */
function applyBackup(d, done){
  if(!d || d.app!==BACKUP_APP || !d.data || typeof d.data!=="object"){ done(false, tx("This file is not a backup of this app.")); return; }
  let words = 0;
  try{ words = Object.keys(JSON.parse(d.data["gl-progress"] || "{}")).length; }catch(e){}
  const when = String(d.date || "").slice(0,10);
  if(!confirm(tx("Restore this backup ({words} words, saved on {date})? It replaces the progress on this device.", {words, date:when}))){ done(false, ""); return; }
  try{
    Object.keys(d.data).filter(k=>k.startsWith("gl-") && typeof d.data[k]==="string").forEach(k=>localStorage.setItem(k, d.data[k]));
  }catch(e){ done(false, tx("This file could not be read.")); return; }
  done(true);
  location.reload();
}

/* reads a backup file */
function restoreBackup(file, done){
  const rd = new FileReader();
  rd.onerror = ()=>done(false, tx("This file could not be read."));
  rd.onload = ()=>{
    let d;
    try{ d = JSON.parse(rd.result); }catch(e){ d = null; }
    applyBackup(d, done);
  };
  rd.readAsText(file);
}

/* ---------- transfer code ----------
   The same backup as one piece of text, to send to yourself (message, e-mail, notes) and paste on the other device. No file, no account, no server.
   Form: GLT1.<check>.<text>  (compressed with deflate, then base64) or GLT0.<check>.<text> (not compressed, for a browser that cannot compress).
   <check> is a short fingerprint of the backup: a code that was cut or changed on the way is refused. A code holds all the progress, so it is as private as the file.
   (A QR code cannot hold it: a few hundred words of progress are already more than the 3 KB of the largest QR.) */
const fnv32 = s => { let h = 0x811c9dc5; for(let i=0; i<s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); };
function bytesToB64(bytes){
  let s = ""; for(let i=0; i<bytes.length; i+=0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i+0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64ToBytes(b64){
  const s = atob(b64.replace(/-/g, "+").replace(/_/g, "/")), out = new Uint8Array(s.length);
  for(let i=0; i<s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}
const streamBytes = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());

async function makeTransferCode(){
  const json = JSON.stringify(backupData()), raw = new TextEncoder().encode(json);
  let tag = "GLT0", body = raw;
  if(typeof CompressionStream==="function"){
    try{ body = await streamBytes(raw, new CompressionStream("deflate-raw")); tag = "GLT1"; }catch(e){ body = raw; tag = "GLT0"; }
  }
  return `${tag}.${fnv32(json)}.${bytesToB64(body)}`;
}

/* the backup inside a code, or {error} */
async function readTransferCode(text){
  const bad = {error:tx("This code is not valid. Copy it again, completely.")};
  const parts = String(text||"").replace(/\s+/g, "").split(".");
  if(parts.length!==3 || !/^GLT[01]$/.test(parts[0]) || !/^[0-9a-f]{8}$/.test(parts[1]) || !/^[A-Za-z0-9_-]+$/.test(parts[2])) return bad;
  try{
    let bytes = b64ToBytes(parts[2]);
    if(parts[0]==="GLT1"){
      if(typeof DecompressionStream!=="function") return {error:tx("This browser cannot read this code. Use the backup file instead.")};
      bytes = await streamBytes(bytes, new DecompressionStream("deflate-raw"));
    }
    const json = new TextDecoder().decode(bytes);
    if(fnv32(json)!==parts[1]) return bad;
    return {data:JSON.parse(json)};
  }catch(e){ return bad; }
}

/* the small panel of the progress page: "make" shows the code to copy, "enter" takes a code and restores it */
function transferPanel(host, mode){
  host.hidden = false; host.innerHTML = "";
  const note = document.createElement("p"); note.className = "muted"; note.style.marginTop = "0";
  const area = document.createElement("textarea"); area.className = "codearea"; area.rows = 4; area.spellcheck = false; area.setAttribute("autocomplete", "off");
  const row = document.createElement("div"); row.className = "btns";
  const msg = document.createElement("p"); msg.className = "feedback"; msg.setAttribute("aria-live", "polite");
  const say2 = (t, good) => { msg.textContent = t; msg.className = "feedback " + (t ? (good ? "good" : "bad") : ""); };
  const btn = (label, fn, ghost) => { const b = document.createElement("button"); b.type = "button"; b.className = "btn" + (ghost ? " ghost" : ""); b.textContent = tx(label); b.onclick = fn; row.appendChild(b); return b; };
  const close = () => { host.hidden = true; host.innerHTML = ""; };
  host.append(note, area, row, msg);
  if(mode==="make"){
    note.textContent = tx("Copy this code, send it to yourself (message, e-mail, notes), then paste it on the other device. It holds all your progress: do not give it to other people.");
    area.readOnly = true; area.value = "...";
    makeTransferCode().then(code=>{
      area.value = code; say2(tx("{n} characters", {n:code.length}), true);
    }).catch(()=>{ area.value = ""; say2(tx("The code could not be made. Use the backup file instead.")); });
    btn("Copy", async ()=>{
      try{ await navigator.clipboard.writeText(area.value); }catch(e){ area.select(); try{ document.execCommand("copy"); }catch(e2){} }
      say2(tx("Copied."), true);
    });
    if(navigator.share) btn("Share", ()=>{ navigator.share({title:"Elliniká", text:area.value}).catch(()=>{}); }, true);
    btn("Close", close, true);
  } else {
    note.textContent = tx("Paste the code made on the other device. It replaces the progress on this device.");
    area.placeholder = tx("Paste the code here");
    btn("Restore from this code", async ()=>{
      if(!area.value.trim()){ say2(tx("Paste the code here")); return; }
      const r = await readTransferCode(area.value);
      if(r.error){ say2(r.error); return; }
      applyBackup(r.data, (ok, m)=>{ if(!ok && m) say2(m); });
    });
    btn("Close", close, true);
    setTimeout(()=>{ try{ area.focus(); }catch(e){} }, 50);
  }
}
