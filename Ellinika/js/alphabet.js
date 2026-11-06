/* ---------- alphabet ---------- */
const EXTRA=[];
const EX={"ου":["ούζο"],"αι":["παιδί"],"ει":["είκοσι"],"οι":["οικογένεια"],"μπ":["μπύρα","κουμπί"],"ντ":["ντομάτα","κέντρο"],"γκ":["γκρι","αγκαλιά"],"αυ":["αύριο","αυτί"],"ευ":["Ευρώπη","ευχαριστώ"],"γγ":["φεγγάρι"],"γχ":["συγχαρητήρια"],"τσ":["τσάι"],"τζ":["τζατζίκι"]};
[["γγ","ng","ng as in finger"],["γχ","nch","n + ch"],["τσ","ts","ts as in cats"],["τζ","dz","dz as in adze"]].forEach(x=>EXTRA.push(x));
const TRAPS=new Set(["η","ν","ρ","υ","ω","χ","δ","γ","β"]);
function renderAlphabet(){
$("alphaGrid").innerHTML=""; $("pairGrid").innerHTML="";
DATA.alpha.forEach(a=>{
  const b=document.createElement("button");
  b.className="acard"+(TRAPS.has(a.l)?" warn":""); b.type="button";
  b.innerHTML=`<span class="big" lang="el">${a.U} ${a.l}</span><span class="lat">${a.lat}</span><span class="s">${a.name} (${a.nameLat}) · ${esc(tx(a.sound))}</span>`;
  b.onclick=()=>play(a.a);
  $("alphaGrid").appendChild(b);
});
[["ου","ou","oo as in food"],["αι","e","e as in pet"],["ει","i","ee as in see"],["οι","i","ee as in see"],
 ["μπ","b","b at the start, mb inside"],["ντ","d","d at the start, nd inside"],["γκ","g","g at the start, ng inside"],
 ["αυ","av / af","av, or af before hard sounds"],["ευ","ev / ef","ev, or ef before hard sounds"],...EXTRA].forEach(([g,l,s])=>{
  const d=document.createElement("div");
  const ex=(EX[g]||[]).map(w=>ALLW.find(x=>x.gr===w)).filter(Boolean);
  d.className="acard"; d.style.cursor=ex.length?"pointer":"default";
  d.innerHTML=`<span class="big" lang="el">${g}</span><span class="lat">${l}</span><span class="s">${esc(tx(s))}</span>`+
    (ex.length?`<span class="s" style="color:var(--ink);margin-top:4px">🔊 <span lang="el">${ex.map(w=>w.gr).join(" · ")}</span></span>`:"");
  if(ex.length){
    d.setAttribute("role","button"); d.tabIndex=0;
    const go=()=>{ d.classList.add("playing"); playSeq(ex.map(w=>w.a)).then(()=>d.classList.remove("playing")); };
    d.onclick=go; d.onkeydown=e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); } };
  }
  $("pairGrid").appendChild(d);
});
}
renderAlphabet();
