const $ = id => document.getElementById(id);
const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };

/* ---------- storage (per-viewer progress) ---------- */
let mastered = {};
try{ mastered = JSON.parse(localStorage.getItem("gl-mastered") || "{}") || {}; }catch(e){ mastered = {}; }
function save(){ try{ localStorage.setItem("gl-mastered", JSON.stringify(mastered)); }catch(e){} }
/* an empty page (no starred words, no difficulties, no result): a big drawing, a title, a line, a few steps and buttons (css/pages.css) */
function emptyState({icon, title, text="", tips=[], actions=[]}){
  return `<div class="empty"><div class="empty-badge" aria-hidden="true"><span>${icon}</span></div>
    <h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ""}
    ${tips.length ? `<ol class="empty-tips">${tips.map(t=>`<li><span>${esc(t)}</span></li>`).join("")}</ol>` : ""}
    ${actions.length ? `<div class="btns">${actions.map(a=>`<a class="btn${a.ghost ? " ghost" : ""}" href="${a.href}">${esc(a.label)}</a>`).join("")}</div>` : ""}</div>`;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sample = (a, n) => shuffle([...a]).slice(0, n);
const oneOf = a => a[Math.floor(Math.random() * a.length)];
