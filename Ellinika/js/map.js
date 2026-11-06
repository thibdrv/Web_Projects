/* ---------- maps of Cyprus and Greece (a mode and two games of "City & travel") ----------
   Built from data/geo.js. "Map": tap a place to hear its name; a card shows it with a sentence about it.
   Games: "Where is it?" (a small map with one place lit: what is it called?) and "Hear the place" (listen, tap its name).
   mapSvg(map, opts) draws a map: opts.labels shows the names, opts.pick marks one place, opts.active the tapped one. */
const GEO_MAPS = Object.fromEntries(GEO.maps.map(m=>[m.id, m]));
let geoMap = "cyprus", geoPick = null;

/* longitude / latitude -> x / y of the picture (the map is about 300 high; one degree of longitude is shorter than one of latitude) */
function geoProject(map){
  const [lo0, lo1] = map.lon, [la0, la1] = map.la, k = 300 / (la1 - la0), kx = k * Math.cos(((la0 + la1) / 2) * Math.PI / 180);
  return {w:Math.round((lo1 - lo0) * kx), h:300, x:lo=>(lo - lo0) * kx, y:la=>(la1 - la) * k};
}
function mapSvg(map, {labels=false, pick=null, active=null, size=0}={}){
  const P = geoProject(map), f = Math.max(1, P.w / 320);   /* bigger dots and names on the wide map (Cyprus) */
  const shapes = map.shapes.map(s=>`<path class="geo-land" d="M${s.map(([lo,la])=>`${P.x(lo).toFixed(1)} ${P.y(la).toFixed(1)}`).join("L")}Z"/>`).join("");
  const dots = map.places.map((p,i)=>{
    const x = P.x(p.lon).toFixed(1), y = P.y(p.la).toFixed(1), lit = pick===p, on = active===p;
    const side = p.side || (P.x(p.lon) < P.w * .72 ? "r" : "l");
    const pos = {r:[9*f, 3.5*f, "start"], l:[-9*f, 3.5*f, "end"], b:[0, 17*f, "middle"], t:[0, -10*f, "middle"]}[side];
    const label = labels ? `<text class="geo-label" x="${(+x + pos[0]).toFixed(1)}" y="${(+y + pos[1]).toFixed(1)}" text-anchor="${pos[2]}" lang="el" style="font-size:${(10.5*f).toFixed(1)}px">${esc(p.gr)}</text>` : "";
    return `<g class="geo-place${on ? " on" : ""}${lit ? " lit" : ""}" data-i="${i}" ${labels ? `tabindex="0" role="button" aria-label="${esc(p.gr)}"` : ""}>
      <circle class="geo-hit" cx="${x}" cy="${y}" r="${(labels ? 13 : 8)*f}"/>${lit ? `<circle class="geo-pulse" cx="${x}" cy="${y}" r="${7*f}"/>` : ""}<circle class="geo-dot ${p.kind}" cx="${x}" cy="${y}" r="${((lit ? 6.5 : labels ? 4.8 : 3) * f).toFixed(1)}"/>${label}</g>`;
  }).join("");
  const style = size ? ` style="width:${size}px"` : "";
  return `<svg class="geomap" viewBox="0 0 ${P.w} ${P.h}"${style} role="img" aria-label="${esc(tx(map.name))}"><rect class="geo-sea" width="${P.w}" height="${P.h}" rx="14"/>${shapes}${dots}</svg>`;
}

/* ----- the Map mode ----- */
function renderMap(box){
  const map = GEO_MAPS[geoMap];
  box.innerHTML = `<div class="row" id="geoTabs" role="group" aria-label="${esc(tx("Map"))}">${GEO.maps.map(m=>`<button type="button" class="chip" data-map="${m.id}" aria-pressed="${m.id===geoMap}">${esc(tx(m.name))} · <span lang="el">${esc(m.gr)}</span></button>`).join("")}</div>
    <div class="geo-wrap">${mapSvg(map, {labels:true, active:geoPick && map.places.includes(geoPick) ? geoPick : null})}</div>
    <div id="geoCard" class="geo-card"></div>
    <p class="note">${esc(tx("A simplified map: the places are in the right spots, the coasts are only a rough idea."))}</p>`;
  box.querySelectorAll("[data-map]").forEach(b=>b.onclick = ()=>{ geoMap = b.dataset.map; geoPick = null; renderMap(box); });
  const card = box.querySelector("#geoCard");
  const show = p => {
    geoPick = p;
    const name = LANG==="fr" ? p.fr : p.en, sentence = LANG==="fr" ? p.sfr : p.sen;
    card.innerHTML = `<div class="geo-head"><span class="geo-ico" aria-hidden="true">${p.kind==="mountain" ? "⛰️" : p.kind==="island" ? "🏝️" : p.kind==="site" ? "🏛️" : "📍"}</span>
      <div><b lang="el">${esc(p.gr)}</b><i>${esc(p.tr)}</i><span>${esc(name)}</span></div>
      <button type="button" class="hear sm" id="geoSay1" aria-label="${esc(tx("Listen"))}">🔊</button></div>
      <p class="geo-sentence" lang="el">${esc(p.say)}</p>
      <button type="button" class="hear" id="geoSay2">🔊 ${esc(tx("Listen to the sentence"))}</button>
      <p class="muted">${esc(sentence)}</p>`;
    $("geoSay1").onclick = ()=>say(p.gr); $("geoSay2").onclick = ()=>say(p.say);
    box.querySelectorAll(".geo-place").forEach(g=>g.classList.toggle("on", map.places[+g.dataset.i]===p));
    say(p.gr);
    if(window.Progress) Progress.record(geoItem(p), true);
  };
  box.querySelectorAll(".geo-place").forEach(g=>{
    const p = map.places[+g.dataset.i];
    g.onclick = ()=>show(p);
    g.onkeydown = e=>{ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); show(p); } };
  });
  if(geoPick && map.places.includes(geoPick)) { const keep = geoPick; geoPick = null; card.innerHTML = ""; show(keep); stopSound(); }
  else card.innerHTML = `<p class="muted">${esc(tx("Tap a place on the map."))}</p>`;
}
const geoItem = p => ({key:"geo:"+p.gr, gr:p.gr, en:p.en, fr:p.fr, lat:p.tr, snd:sid(p.gr), cat:"City & travel"});

/* ----- the games ----- */
const allPlaces = () => GEO.maps.flatMap(m=>m.places.map(p=>({p, map:m})));
function geoQuestions(kind){
  const next = deck(allPlaces());
  return ()=>{
    const {p, map} = next();
    const others = map.places.filter(x=>x!==p), wrong = sample(others, 3);
    const nameOf = x => LANG==="fr" ? x.fr : x.en;
    const mini = mapSvg(map, {pick:p, size:Math.min(340, map.id==="cyprus" ? 340 : 230)});
    const reveal = `<b lang="el">${esc(p.gr)}</b> (${esc(p.tr)}) · ${esc(nameOf(p))}<br><span lang="el">${esc(p.say)}</span><br><span class="muted">${esc(LANG==="fr" ? p.sfr : p.sen)}</span>`;
    const item = geoItem(p);
    if(kind==="where")
      return {item, prompt:`${pill("Where is it?")}${mini}<p class="vinfo muted">${esc(tx(map.name))}</p>`,
              options:shuffle([{html:`<span lang="el">${esc(p.gr)}</span>`, ok:true}, ...wrong.map(x=>({html:`<span lang="el">${esc(x.gr)}</span>`, ok:false}))]),
              reveal, sayAfter:[p.gr, p.say]};
    return {item, prompt:`<p class="word s">🔊 ${esc(tx("Which place is it?"))}</p><p class="vinfo muted">${esc(tx(map.name))}</p>`, say:p.gr, autoplay:true,
            options:shuffle([{html:esc(nameOf(p)), ok:true}, ...wrong.map(x=>({html:esc(nameOf(x)), ok:false}))]),
            reveal:reveal + `<br>${mini}`, sayAfter:p.say};
  };
}
const CITY_GAMES = [
  {id:"where", name:"Where is it?", info:"A place is lit on the map. Tap its Greek name.", make:()=>geoQuestions("where"), noGroups:true},
  {id:"placehear", name:"Hear the place", info:"Listen to a place name, then tap what it is.", make:()=>geoQuestions("hear"), noGroups:true}
];
