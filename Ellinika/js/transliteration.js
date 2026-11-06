/* ---------- transliteration rules ---------- */
const PAIRS = {
  "ου":["ou","u","oo"], "αι":["ai","e"], "ει":["ei","i"], "οι":["oi","i"], "υι":["yi","i","ui"],
  "μπ":["b","mb","mp"], "ντ":["d","nd","nt"], "γκ":["g","ng","gk"], "γγ":["ng","gg","g"], "γχ":["nch","nh","nkh","gch","gh","ch"],
  "αυ":["av","af","au"], "ευ":["ev","ef","eu"], "τσ":["ts"], "τζ":["tz","dz","j"], "γι":["yi","gi","y","g","j"]
};
const ONE = {
  "α":["a"],"β":["v","b"],"γ":["g","gh","y","j"],"δ":["d","dh","th"],"ε":["e"],"ζ":["z"],"η":["i","h","ee"],"θ":["th"],
  "ι":["i","y","j"],"κ":["k","c"],"λ":["l"],"μ":["m"],"ν":["n"],"ξ":["x","ks"],"ο":["o"],"π":["p"],"ρ":["r"],
  "σ":["s"],"ς":["s"],"τ":["t"],"υ":["i","y","u"],"φ":["f","ph"],"χ":["ch","h","kh","x"],"ψ":["ps"],"ω":["o","w"]
};
function prep(s){
  // lowercase, mark diaeresis (it breaks a pair), strip accents
  return s.toLowerCase().normalize("NFD").replace(/([αεηιοωυ])(\u0301?)\u0308/g,"|$1").replace(/[\u0300-\u036f]/g,"").replace(/[^α-ωςϊϋ |]/g,"").replace(/\s+/g," ").trim();
}
function tokenize(gr){
  const s = prep(gr), out = [];
  for(let i=0;i<s.length;){
    if(s[i]==="|"){ i++; continue; }
    if(s[i]===" "){ out.push({g:" ",opts:[""]}); i++; continue; }
    const two = s.slice(i,i+2);
    if(PAIRS[two] && !(s[i+2]==="|" && false)){ out.push({g:two,opts:PAIRS[two],pair:true}); i+=2; continue; }
    out.push({g:s[i],opts:ONE[s[i]]||[s[i]]}); i++;
  }
  /* a doubled consonant (ββ, κκ, λλ, νν...) sounds like a single one: the second letter is optional */
  out.forEach((t,i)=>{
    if(i && t.g.length===1 && "βδζθκλμνξπρστφχψ".includes(t.g) && out[i-1].g===t.g) t.opts=[...t.opts,""];
  });
  return out;
}
function matcher(gr){
  const re = tokenize(gr).map(t => "(?:"+t.opts.join("|")+")").join("");
  return new RegExp("^"+re+"$");
}
function cleanInput(s){ return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z]/g,""); }
function tileLatin(tok, next){
  if(tok.g==="γ" && next && /^(ε|ι|η|υ|αι|ει|οι)/.test(next.g)) return "y";
  if(tok.g==="η"||tok.g==="υ") return "i";
  return tok.opts[0];
}
function renderBreakdown(gr, box=$("breakdown")){
  const toks = tokenize(gr); box.innerHTML="";
  toks.forEach((t,i)=>{
    const d=document.createElement("div");
    if(t.g===" "){ d.className="tile space"; box.appendChild(d); return; }
    d.className="tile"+(t.pair?" pair":"");
    d.innerHTML=`<span class="g" lang="el">${t.g}</span><span class="l">${tileLatin(t,toks[i+1])}</span>`;
    box.appendChild(d);
  });
}

/* a Greek answer made comparable: no capitals, no accents, ς = σ, no punctuation, single spaces.
   keepAccents=true keeps the accents, to tell "you forgot them" from "you got it exactly right". */
function normGreek(s, keepAccents=false){
  let t = s.toLowerCase().replace(/ς/g,"σ");   // final sigma = sigma
  t = keepAccents ? t.normalize("NFC") : t.normalize("NFD").replace(/[̀-ͯ]/g,"");
  // ; and the Greek question mark U+037E, the Greek raised dot U+0387 and the middle dot U+00B7, and usual punctuation
  return t.replace(/[;;?!.,··:"“”«»'’()\-–—]/g,"").replace(/\s+/g," ").trim();
}
