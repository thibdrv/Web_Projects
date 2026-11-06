/* ---------- body diagrams ----------
   One big drawing (the whole body) and small drawings under it (face, hand, foot, organs, skeleton).
   Each part is a numbered, tappable shape. A part finds its word in data/body.js by its Greek text.
   To change a drawing, edit BODY_DIAGRAMS below: "parts" lists the tappable shapes (the number is
   the order in the list), "z" says what is drawn on top of what, "under" and "over" are plain decoration. */
const ell = (cx,cy,rx,ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
const box = (x,y,w,h,r=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
const path = d => `<path d="${d}"/>`;
/* a rounded bar from (x1,y1) to (x2,y2): arms, legs, fingers, bones */
const cap = (x1,y1,x2,y2,r) => {
  const L = Math.hypot(x2-x1,y2-y1), nx = -(y2-y1)/L*r, ny = (x2-x1)/L*r, f = n => +n.toFixed(2);
  return path(`M${f(x1+nx)},${f(y1+ny)} L${f(x2+nx)},${f(y2+ny)} A${r},${r} 0 0 0 ${f(x2-nx)},${f(y2-ny)} L${f(x1-nx)},${f(y1-ny)} A${r},${r} 0 0 0 ${f(x1+nx)},${f(y1+ny)}Z`);
};

/* a limb that narrows (and bulges in the middle, like a muscle): from (x1,y1) to (x2,y2), radius r1 at the start and r2 at the end, rounded ends */
const limb = (x1,y1,x2,y2,r1,r2,bulge=0) => {
  const L = Math.hypot(x2-x1,y2-y1), ux = (x2-x1)/L, uy = (y2-y1)/L, nx = -uy, ny = ux, N = 14, f = n => +n.toFixed(1);
  const rad = t => r1 + (r2-r1)*t + bulge*Math.sin(Math.PI*t);
  const th = Math.atan2(ny,nx), left = [], right = [];
  for(let i=0;i<=N;i++){ const t = i/N, cx = x1+ux*L*t, cy = y1+uy*L*t, r = rad(t); left.push([cx+nx*r, cy+ny*r]); right.push([cx-nx*r, cy-ny*r]); }
  const round = (cx,cy,r,a0) => { const o = []; for(let k=1;k<8;k++){ const a = a0 - Math.PI*k/8; o.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]); } return o; };
  const pts = [...left, ...round(x2,y2,rad(1),th), ...right.reverse(), ...round(x1,y1,rad(0),th+Math.PI)];
  return path("M" + pts.map(p=>`${f(p[0])},${f(p[1])}`).join(" L") + "Z");
};
/* the same limb on the other side of the body (the drawings are 260 wide: x becomes 260 - x) */
const limbs = (x1,y1,x2,y2,r1,r2,bulge) => limb(x1,y1,x2,y2,r1,r2,bulge) + limb(260-x1,y1,260-x2,y2,r1,r2,bulge);
const mir260 = d => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (m,x,y) => `${+(260-x).toFixed(1)},${y}`);
const pair = d => path(d) + path(mir260(d));
const dark = (shape,extra="") => shape.replace("/>",` style="fill:var(--ink);stroke:none;${extra}"/>`);

const BODY_DIAGRAMS = [
  {id:"body", name:"Front", viewBox:"0 0 260 490", volume:true, ground:true,
   over: dark(ell(120,46,2.6,2.6)) + dark(ell(140,46,2.6,2.6)) + `<path d="M122,62 Q130,68 138,62" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linecap:round"/>`
       + `<g style="fill:none;stroke:rgba(0,0,0,.2);stroke-width:1.3;stroke-linecap:round"><path d="M104,108 C114,112 122,112 130,110 C138,112 146,112 156,108"/><path d="M130,112 L130,222"/><path d="M104,142 C114,152 124,152 130,148 C136,152 146,152 156,142"/><circle cx="130" cy="204" r="1.6"/><path d="M96,262 C108,266 120,262 130,266 C140,262 152,266 164,262"/><path d="M100,346 C104,340 112,340 116,346 M144,346 C148,340 156,340 160,346"/></g>`,
   parts:[
    {gr:"το κεφάλι",     z:11, dot:[130,30],   zoom:"face",   shapes:[path("M130,8 C153,8 164,25 163,46 C162,70 149,86 130,87 C111,86 98,70 97,46 C96,25 107,8 130,8Z"), ell(98,50,5,9), ell(162,50,5,9)]},
    {gr:"ο λαιμός",      z:1,  dot:[130,96],   shapes:[path("M118,78 C122,81 138,81 142,78 L146,103 L114,103Z")]},
    {gr:"ο ώμος",        z:2,  dot:[84,121],   shapes:[pair("M99,112 C88,108 74,112 68,126 C64,138 68,148 78,148 C90,142 98,132 102,120Z")]},
    {gr:"το στήθος",     z:10, dot:[130,138],  zoom:"inside", shapes:[path("M99,108 C108,103 120,102 130,102 C140,102 152,103 161,108 C168,122 168,148 160,172 L100,172 C92,148 92,122 99,108Z")]},
    {gr:"η κοιλιά",      z:9,  dot:[130,197],  zoom:"inside", shapes:[path("M101,170 L159,170 C160,190 157,208 153,224 L107,224 C103,208 100,190 101,170Z")]},
    {gr:"ο γοφός",       z:8,  dot:[130,236],  shapes:[path("M105,222 L155,222 C166,234 168,248 162,260 C150,268 140,262 130,268 C120,262 110,268 98,260 C92,248 94,234 105,222Z")]},
    {gr:"ο βραχίονας",   z:3,  dot:[62,166],   shapes:[limbs(72,134,56,196,14,11,2)]},
    {gr:"ο αγκώνας",     z:5,  dot:[52,203],   shapes:[ell(52,203,10.5,10.5), ell(208,203,10.5,10.5)]},
    {gr:"ο πήχης",       z:4,  dot:[45,240],   shapes:[limbs(50,210,40,268,11,7.5,1.8)]},
    {gr:"ο καρπός",      z:6,  dot:[39,274],   shapes:[ell(39,274,8,6), ell(221,274,8,6)]},
    {gr:"το χέρι",       z:7,  dot:[36,304],   zoom:"hand",   shapes:[pair("M33,280 C25,284 22,298 24,314 C25,328 31,336 37,334 C44,332 47,322 47,308 C48,296 46,284 40,280Z M46,290 C52,292 55,300 52,308 C49,304 47,298 46,290Z")]},
    {gr:"ο μηρός",       z:3,  dot:[110,300],  shapes:[limbs(114,260,108,338,21,14,3)]},
    {gr:"το γόνατο",     z:5,  dot:[107,348],  shapes:[ell(107,348,14,12), ell(153,348,14,12)]},
    {gr:"η γάμπα",       z:4,  dot:[105,398],  shapes:[limbs(106,360,104,432,13.5,7.5,3.5)]},
    {gr:"ο αστράγαλος",  z:6,  dot:[104,443],  shapes:[ell(104,442,8.5,7), ell(156,442,8.5,7)]},
    {gr:"το πόδι",       z:7,  dot:[96,468],   zoom:"foot",   shapes:[pair("M110,446 L96,448 C88,452 80,462 76,470 C74,476 80,480 90,480 C104,480 118,478 124,470 C126,462 120,452 110,446Z")]}
   ]},

  {id:"back", name:"Back", viewBox:"0 0 260 490", volume:true, ground:true,
   under: `<g style="--pf:#E0B796">${ell(107,348,14,12)}${ell(153,348,14,12)}${ell(104,442,8.5,7)}${ell(156,442,8.5,7)}${pair("M110,446 L96,448 C88,452 80,462 76,470 C74,476 80,480 90,480 C104,480 118,478 124,470 C126,462 120,452 110,446Z")}${limbs(50,210,40,268,11,7.5,1.8)}${ell(39,274,8,6)}${ell(221,274,8,6)}</g>`,
   over: `<g style="fill:none;stroke:rgba(0,0,0,.2);stroke-width:1.3;stroke-linecap:round"><path d="M130,226 L130,266"/><path d="M104,262 C112,270 122,270 128,264 M156,262 C148,270 138,270 132,264"/><path d="M100,346 C104,352 112,352 116,346 M144,346 C148,352 156,352 160,346"/></g>`,
   parts:[
    {gr:"τα μαλλιά",           z:11, dot:[130,24],   fill:"#7A5538", shapes:[path("M130,8 C153,8 164,25 163,46 C162,70 149,86 130,87 C111,86 98,70 97,46 C96,25 107,8 130,8Z"), ell(98,50,5,9), ell(162,50,5,9)]},
    {gr:"ο σβέρκος",           z:1,  dot:[130,98],   shapes:[path("M118,78 C122,81 138,81 142,78 L146,103 L114,103Z")]},
    {gr:"ο ώμος",              z:2,  dot:[84,121],   shapes:[pair("M99,112 C88,108 74,112 68,126 C64,138 68,148 78,148 C90,142 98,132 102,120Z")]},
    {gr:"η πλάτη",             z:10, dot:[130,160],  shapes:[path("M99,108 C108,103 120,102 130,102 C140,102 152,103 161,108 C168,122 168,148 160,172 L100,172 C92,148 92,122 99,108Z")]},
    {gr:"η ωμοπλάτη",          z:11, dot:[104,134],  fill:"#D4A583", shapes:[path("M100,118 L124,122 L118,150 Q108,156 100,142Z"), path("M160,118 L136,122 L142,150 Q152,156 160,142Z")]},
    {gr:"η σπονδυλική στήλη",  z:12, dot:[130,190],  fill:"#C99A78", shapes:Array.from({length:10},(_,i)=>box(126.5,112+i*12.5,7,9.5,2.5))},
    {gr:"η μέση",              z:9,  dot:[106,198],  shapes:[path("M101,170 L159,170 C160,190 157,208 153,224 L107,224 C103,208 100,190 101,170Z")]},
    {gr:"ο πισινός",           z:8,  dot:[110,244],  shapes:[path("M105,222 L155,222 C166,234 168,250 162,264 C150,272 140,266 130,270 C120,266 110,272 98,264 C92,250 94,234 105,222Z")]},
    {gr:"ο βραχίονας",         z:3,  dot:[62,166],   shapes:[limbs(72,134,56,196,14,11,2)]},
    {gr:"ο αγκώνας",           z:5,  dot:[52,203],   shapes:[ell(52,203,10.5,10.5), ell(208,203,10.5,10.5)]},
    {gr:"ο πήχης",             z:4,  dot:[45,240],   shapes:[limbs(50,210,40,268,11,7.5,1.8)]},
    {gr:"το χέρι",             z:7,  dot:[36,304],   shapes:[pair("M33,280 C25,284 22,298 24,314 C25,328 31,336 37,334 C44,332 47,322 47,308 C48,296 46,284 40,280Z M46,290 C52,292 55,300 52,308 C49,304 47,298 46,290Z")]},
    {gr:"ο μηρός",             z:3,  dot:[110,300],  shapes:[limbs(114,260,108,338,21,14,3)]},
    {gr:"η γάμπα",             z:4,  dot:[105,392],  shapes:[limbs(106,360,104,428,13.5,7.5,3.5)]},
    {gr:"ο αχίλλειος τένοντας", z:6, dot:[105,430],  fill:"#C99A78", shapes:[limbs(104,414,104,446,3.6,3.6,0)]},
    {gr:"η φτέρνα",            z:7,  dot:[104,466],  shapes:[ell(100,466,11,10), ell(160,466,11,10)]}
   ]},

  {id:"face", name:"Face", viewBox:"0 0 260 290", volume:true,
   under: box(110,240,40,50,8),
   over: dark(ell(100,154,4.5,4.5)) + dark(ell(160,154,4.5,4.5)),
   parts:[
    {gr:"τα μαλλιά",     z:3, dot:[130,62],   fill:"#7A5538", shapes:[path("M54,160 C42,60 92,34 130,34 C168,34 218,60 206,160 C196,112 170,92 130,92 C90,92 64,112 54,160Z")]},
    {gr:"το μέτωπο",     z:4, dot:[130,112],  soft:true, shapes:[ell(130,112,44,14)]},
    {gr:"το φρύδι",      z:5, dot:[90,125],  fill:"#5B4030", shapes:[cap(84,136,116,131,4), cap(144,131,176,136,4)]},
    {gr:"το μάτι",       z:5, dot:[130,153],  zoom:"eye",  fill:"#FFFFFF", shapes:[ell(100,154,17,9), ell(160,154,17,9)]},
    {gr:"το αυτί",       z:1, dot:[46,160],  zoom:"ear",   shapes:[ell(54,160,13,26), ell(206,160,13,26)]},
    {gr:"η μύτη",        z:5, dot:[130,188],  shapes:[path("M130,160 C124,178 112,192 118,200 C124,206 136,206 142,200 C148,192 136,178 130,160Z")]},
    {gr:"το μάγουλο",    z:4, dot:[84,198],   soft:true, fill:"#F2A99A", shapes:[ell(84,196,20,16), ell(176,196,20,16)]},
    {gr:"το στόμα",      z:5, dot:[100,236],  zoom:"mouth",  fill:"#C9524F", shapes:[ell(130,232,30,14)]},
    {gr:"το δόντι",      z:6, dot:[130,213],  fill:"#FFFFFF", shapes:[box(112,222,36,8,3)]},
    {gr:"η γλώσσα",      z:6, dot:[158,246],  fill:"#E58A8A", shapes:[ell(130,239,14,6)]},
    {gr:"το πηγούνι",    z:4, dot:[130,254],  soft:true, shapes:[ell(130,250,24,10)]},
    {gr:"το πρόσωπο",    z:2, dot:[186,226],  shapes:[path("M56,150 C56,92 90,58 130,58 C170,58 204,92 204,150 C204,206 172,262 130,264 C88,262 56,206 56,150Z")]}
   ]},

  {id:"hand", name:"Hand", viewBox:"0 0 260 290", volume:true,
   parts:[
    {gr:"η παλάμη",            z:2, dot:[132,206], shapes:[path("M84,162 C82,150 92,146 102,148 L166,148 C178,148 186,158 184,176 C182,200 176,228 166,244 L100,244 C90,228 84,196 84,162Z")]},
    {gr:"ο αντίχειρας",        z:3, dot:[71,181],  shapes:[limb(94,204,50,162,13.5,9.5,1.2)]},
    {gr:"ο δείκτης",           z:3, dot:[96,118],  shapes:[limb(100,156,95,82,10.5,8.2,.8)]},
    {gr:"ο μέσος",             z:3, dot:[122,108], shapes:[limb(122,156,122,68,11,8.6,.8)]},
    {gr:"ο παράμεσος",         z:3, dot:[149,118], shapes:[limb(146,156,149,78,10.2,8,.8)]},
    {gr:"το μικρό δάχτυλο",    z:3, dot:[172,138], shapes:[limb(168,166,175,104,9,6.8,.6)]},
    {gr:"το νύχι",             z:4, dot:[122,62],  fill:"#FBE3D6", shapes:[ell(95,76,5.5,7), ell(122,62,5.5,7), ell(149,72,5.5,7), ell(175,98,5,6.5), ell(52,153,5.5,6.5)]},
    {gr:"ο καρπός",            z:1, dot:[132,258], shapes:[path("M100,238 L166,238 C168,252 166,266 162,274 L104,274 C100,266 98,252 100,238Z")]}
   ]},

  {id:"foot", name:"Foot", viewBox:"0 0 260 300", volume:true,
   parts:[
    {gr:"το δάχτυλο του ποδιού", z:3, dot:[124,92], shapes:[ell(96,104,18,22), ell(124,90,13,17), ell(148,94,12,15), ell(167,103,11,13), ell(181,117,10,12)]},
    {gr:"το νύχι",               z:4, dot:[96,92],  fill:"#FBE3D6", shapes:[ell(96,91,9,8)]},
    {gr:"το πέλμα",              z:1, dot:[130,170], shapes:[path("M84,130 C84,100 176,100 176,130 C178,180 162,225 160,248 C158,266 102,266 100,248 C98,225 82,180 84,130Z")]},
    {gr:"η φτέρνα",              z:2, dot:[130,244], shapes:[ell(130,244,30,20)]},
    {gr:"ο αστράγαλος",          z:1, dot:[130,278], shapes:[box(104,262,52,28,8)]}
   ]},

  {id:"inside", name:"Organs", viewBox:"0 0 260 310",
   under: `<g style="fill-opacity:.35">${ell(130,48,34,42)}${box(118,86,24,26,6)}${box(76,108,108,190,34)}</g>`,
   over: `<path d="M110,258 q8,-10 16,0 t16,0 t16,0 M110,272 q8,-10 16,0 t16,0 t16,0" style="fill:none;stroke:#B98A3E;stroke-width:3;stroke-linecap:round"/>`,
   parts:[
    {gr:"ο εγκέφαλος",   z:5, dot:[130,40],  fill:"#F2A7B8", shapes:[ell(130,40,26,22)]},
    {gr:"οι πνεύμονες",  z:4, dot:[94,148],  fill:"#EFA7B0", shapes:[ell(102,156,22,38), ell(158,156,22,38)]},
    {gr:"η καρδιά",      z:5, dot:[138,172], fill:"#D64545", shapes:[path("M136,192 C114,174 118,152 130,152 C134,152 136,156 136,158 C136,156 138,152 142,152 C154,152 158,174 136,192Z")]},
    {gr:"το συκώτι",     z:3, dot:[98,214],  fill:"#A85A3A", shapes:[ell(106,214,36,15)]},
    {gr:"το στομάχι",    z:3, dot:[160,214], fill:"#E8A27A", shapes:[ell(158,214,22,16)]},
    {gr:"τα νεφρά",      z:1, dot:[174,238], fill:"#8E3B3B", shapes:[ell(88,236,8,14), ell(172,236,8,14)]},
    {gr:"το έντερο",     z:2, dot:[130,288], fill:"#F0C27A", shapes:[box(100,242,60,48,20)]}
   ]},

  {id:"skeleton", name:"Skeleton", viewBox:"0 0 260 450", volume:true,
   under: `<g style="--pf:#EDE6D6">${cap(98,112,62,196,5)}${cap(162,112,198,196,5)}${cap(62,200,48,262,4)}${cap(198,200,212,262,4)}${cap(106,396,104,438,5)}${cap(154,396,156,438,5)}</g>`,
   over: dark(ell(118,50,6.5,6.5)) + dark(ell(142,50,6.5,6.5)) + dark(path("M130,58 L126,68 L134,68Z")),
   parts:[
    {gr:"το κρανίο",             z:3, dot:[130,34],  fill:"#EDE6D6", shapes:[ell(130,48,32,36), box(114,78,32,16,6)]},
    {gr:"η σπονδυλική στήλη",    z:4, dot:[130,236], fill:"#EDE6D6", shapes:Array.from({length:12},(_,i)=>box(123,100+i*12.5,14,10,3))},
    {gr:"τα πλευρά",             z:3, dot:[100,150], fill:"#EDE6D6", shapes:[box(126,116,8,50,3), ...Array.from({length:6},(_,i)=>{
        const y=116+i*14, k=Math.max(0,i-2)*7;
        return cap(121,y,90+k,y+12,4)+cap(139,y,170-k,y+12,4);
      })]},
    {gr:"η λεκάνη",              z:2, dot:[130,264], fill:"#EDE6D6", shapes:[path("M96,236 C76,240 70,268 86,288 L110,272 L130,286 L150,272 L174,288 C190,268 184,240 164,236 L146,246 L114,246Z")]},
    {gr:"το κόκκαλο",            z:2, dot:[108,338], fill:"#EDE6D6", shapes:[cap(112,288,106,382,8), cap(148,288,154,382,8), ell(106,388,11,9), ell(154,388,11,9)]}
   ]}
];
/* the words of the drawings, found by their Greek text */
/* a part of any drawing (body, clothes, house...) finds its word here by its Greek text; SCENE_WORDS (data/scenes.js) holds the words that no list has */
/* the sound of a word of a drawing (the letters of the alphabet have their own sound names) */
const sayWord = w => say(w.snd ? {id:w.snd} : w.gr);
const BODY_WORDS = Object.fromEntries([BODY, CLOTHES, HOUSE, FAMILY, CITY, DIRECTIONS, NATURE, JOBS, FOOD, TIME, COOKING].flatMap(D=>D.groups.flatMap(g=>g.words)).concat(WORDBANK.words, SCENE_WORDS.words, COLORS.words, NUMBERS.words.map(w=>({...w, en:String(w.n)})), GRAMMAR4.conj.flatMap(c=>c.forms.map(f=>({gr:f.gr, lat:translit(f.gr), en:f.en, fr:f.fr}))), DATA.alpha.map(a=>({gr:a.name, lat:a.nameLat, en:`letter ${a.U} ${a.l}`, snd:a.a}))).reverse().map(w=>[w.gr,w]));

/* the inside of an <svg>: decoration, then the parts (lowest z first), then the numbered dots */
/* the drawings that are tables of words (grammar, numbers, letters) stay flat: no light, no grain on top of the text */
const FLAT_DRAWING = /^(conj-|articles|cases|tobe|tenses|questions|preps|alphachart|count|tens)/;
function bodySvg(d, interactive, fx = interactive){
  const order = d.parts.map((p,i)=>[p,i]).sort((a,b)=>a[0].z-b[0].z);
  const part = ([p,i]) => `<g class="part${p.soft?" soft":""}${d.rich?" rich":""}" ${interactive?`data-i="${i}" tabindex="0" role="button" aria-label="${esc(txm(BODY_WORDS[p.gr].en))}"`:""} ${p.fill?`style="--pf:${p.fill}"`:""}>${p.shapes.join("")}</g>`;
  /* the numbers are a bit bigger on a wide drawing, so they stay easy to touch on a phone */
  const R = Math.min(15, Math.max(9, (+String(d.viewBox).split(/\s+/)[2] || 300) * 0.034)).toFixed(1);
  const dot = (p,i) => `<g class="dot" data-i="${i}"><circle class="hit" cx="${p.dot[0]}" cy="${p.dot[1]}" r="${(R*1.75).toFixed(1)}"/><circle cx="${p.dot[0]}" cy="${p.dot[1]}" r="${R}"/><text x="${p.dot[0]}" y="${p.dot[1]}" dy=".35em" style="font-size:${(R*1.15).toFixed(1)}px">${i+1}</text></g>`;
  /* realism (only on the big drawing): a soft light from the top left, darker edges, a little grain; the plain shapes of the body get a roundness
     (a gradient across each shape: light in the middle, darker at the sides) and a figure that stands has its shadow on the ground */
  const [vx,vy,vw,vh] = String(d.viewBox).split(/\s+/).map(Number), vid = "bdx-" + d.id, flat = FLAT_DRAWING.test(d.id);
  const defs = !fx || flat ? "" : `<defs>
    <linearGradient id="${vid}-vol" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1608" stop-opacity=".30"/><stop offset=".3" stop-color="#2a1608" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".10"/><stop offset="1" stop-color="#2a1608" stop-opacity=".34"/></linearGradient>
    <linearGradient id="${vid}-lit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1a0d05" stop-opacity=".16"/></linearGradient>
    <radialGradient id="${vid}-vig" cx=".5" cy=".5" r=".72"><stop offset=".62" stop-color="#1a0d05" stop-opacity="0"/><stop offset="1" stop-color="#1a0d05" stop-opacity=".2"/></radialGradient>
    <filter id="${vid}-blur" x="-30%" y="-300%" width="160%" height="700%"><feGaussianBlur stdDeviation="${(vw/55).toFixed(1)}"/></filter>
    <filter id="${vid}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.9 0 0 0 1.12"/></filter></defs>`;
  const ground = fx && d.ground ? `<ellipse class="bd-ground" cx="${vx+vw/2}" cy="${vy+vh-6}" rx="${(vw*.3).toFixed(0)}" ry="${(vh*.012+3).toFixed(1)}" filter="url(#${vid}-blur)"/>` : "";
  const volume = s => s.replace(/<(path|ellipse|rect)\b([^>]*?)\/>/g, m => /style=/.test(m) ? m : m + m.replace(/\/>$/, ` class="vol" style="fill:url(#${vid}-vol);stroke:none;pointer-events:none"/>`));
  const withVolume = fx && d.volume && !flat ? d.parts.map(p=>({...p, shapes:p.shapes.map(volume)})) : null;
  const order2 = withVolume ? withVolume.map((p,i)=>[p,i]).sort((a,b)=>a[0].z-b[0].z) : order;
  const light = fx && !flat ? `<g class="bd-fx" pointer-events="none"><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="url(#${vid}-lit)"/><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="url(#${vid}-vig)"/><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" filter="url(#${vid}-grain)" opacity=".07"/></g>` : "";
  return defs + ground + `<g class="under">${d.under||""}</g>${order2.map(part).join("")}<g class="over">${d.over||""}</g>` + light
       + (interactive ? `<g class="dots">${d.parts.map(dot).join("")}</g>` : "");
}

/* a guard for slow phones: when a drawing opens, the speed of the screen is watched for about a second. If it is too slow (under about 20 pictures a second),
   the drawing goes "lite": no grain, no light on every shape, no animation. The choice is kept for the visit (sessionStorage "gl-lite"). It does nothing when the page is not in front. */
function perfGuard(box){
  let lite = false; try{ lite = sessionStorage.getItem("gl-lite")==="1"; }catch(e){}
  box.classList.toggle("bd-lite", lite);
  if(lite || document.visibilityState!=="visible" || !document.hasFocus()) return;
  const dts = []; let last = performance.now(), t0 = last, n = 0;
  const step = t => {
    dts.push(t - last); last = t; n++;
    if(!box.isConnected) return;
    if(t - t0 < 1300 && n < 90) return requestAnimationFrame(step);
    const a = dts.slice(4).sort((x,y)=>x-y), med = a.length ? a[Math.floor(a.length/2)] : 0;
    if(a.length>=6 && med > 50){ box.classList.add("bd-lite"); try{ sessionStorage.setItem("gl-lite", "1"); }catch(e){} }
  };
  requestAnimationFrame(step);
}
let bodyDiagramId = "body";
const renderBodyDiagram = box => renderDiagramSet(box, BODY_DIAGRAMS, ()=>bodyDiagramId, id=>{ bodyDiagramId = id; });
/* list: the drawings; getId / setId: which one is shown (kept by the caller) */
function renderDiagramSet(box, list, getId, setId){
  const d = list.find(x=>x.id===getId()) || list[0];
  let sel = -1;
  box.innerHTML = `
    <div class="bd-wrap">
      <div class="bd-picker"><div class="bd-thumbs" role="group" aria-label="${esc(tx("Choose a drawing"))}">${list.map(x=>`<button type="button" class="bd-thumb" data-d="${x.id}" aria-pressed="${x.id===d.id}"><svg class="bd-mini" viewBox="${x.viewBox}" aria-hidden="true">${bodySvg(x,false)}</svg><span>${esc(tx(x.name))}</span></button>`).join("")}</div></div>
      <div class="bd-main">
        <div class="bd-card" id="bdCard"><span class="muted">${esc(tx("Tap a number on the drawing, or a word in the list."))}</span></div>
        <div class="bd-stage"><svg class="bd-svg" data-scene="${d.id}" viewBox="${d.viewBox}" role="group" aria-label="${esc(tx(d.name))}">${bodySvg(d,true)}</svg>
          <div class="bd-tools"><button type="button" class="bd-t2" data-act2="labels" aria-pressed="false" aria-label="${esc(tx("Show the words on the drawing"))}" title="${esc(tx("Show the words on the drawing"))}">Aa</button><button type="button" class="bd-t2" data-act2="test" aria-pressed="false" aria-label="${esc(tx("Test me: find the part"))}" title="${esc(tx("Test me: find the part"))}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></button><button type="button" data-z="in" aria-label="${esc(tx("Zoom in"))}">+</button><button type="button" data-z="out" aria-label="${esc(tx("Zoom out"))}">−</button><button type="button" data-z="reset" hidden aria-label="${esc(tx("Show the whole drawing"))}">⤢</button></div>
          ${list.length>1 ? `<button type="button" class="bd-nav prev" aria-label="${esc(tx("Previous drawing"))}">‹</button><button type="button" class="bd-nav next" aria-label="${esc(tx("Next drawing"))}">›</button>` : ""}</div>
      </div>
      <ol class="bd-legend">${d.parts.map((p,i)=>{
        const w = BODY_WORDS[p.gr];
        return `<li><button type="button" class="dentry" data-i="${i}"><span class="bd-n">${i+1}</span><span class="dtxt"><span class="dgr" lang="el">${esc(w.gr)}</span><span class="dlat"><span class="lt">${esc(w.lat)}</span></span><span class="den">${esc(txm(w.en))}</span></span><span class="dplay" aria-hidden="true">🔊</span></button></li>`;
      }).join("")}</ol>
    </div>`;
  const pressed = box.querySelector(".bd-thumb[aria-pressed='true']");
  if(pressed) try{ pressed.parentElement.scrollLeft = pressed.offsetLeft - (pressed.parentElement.clientWidth - pressed.offsetWidth)/2; }catch(e){}

  const card = box.querySelector("#bdCard");
  function select(i){
    sel = i;
    const p = d.parts[i], w = BODY_WORDS[p.gr];
    box.querySelectorAll("[data-i]").forEach(el=>el.classList.toggle("on", +el.dataset.i===i));
    const target = p.zoom && list.find(x=>x.id===p.zoom);
    card.innerHTML = `<span class="bd-n">${i+1}</span><span class="bd-t"><b lang="el">${esc(w.gr)}</b><span class="dlat"><span class="lt">${esc(w.lat)}</span></span><span>${esc(txm(w.en))}</span></span>
      <button type="button" class="hear" data-act="play">🔊</button>${target ? `<button type="button" class="hear" data-act="zoom">🔍 ${esc(tx(target.name))}</button>` : ""}`;
    card.querySelector('[data-act="play"]').onclick = ()=>sayWord(w);
    if(target) card.querySelector('[data-act="zoom"]').onclick = ()=>show(target.id);
    sayWord(w);
  }
  function show(id){
    window.__bdDir = 0; setId(id); renderDiagramSet(box, list, getId, setId);
    try{ box.scrollIntoView({behavior:"smooth", block:"start"}); }catch(e){}
  }
  /* words on the drawing: the Greek word next to each number (it is kept for the next drawings) */
  const mainSvg = box.querySelector(".bd-svg"), labelBtn = box.querySelector('[data-act2="labels"]'), testBtn = box.querySelector('[data-act2="test"]');
  function setLabels(on){
    try{ localStorage.setItem("gl-bdlabels", on ? "1" : "0"); }catch(e){}
    labelBtn.setAttribute("aria-pressed", on);
    const old = mainSvg.querySelector(".lbls"); if(old) old.remove();
    if(!on) return;
    const [vx,vy,vw] = mainSvg.getAttribute("viewBox").split(/\s+/).map(Number), R = Math.min(15, Math.max(9, vw * 0.034)), mid = vx + vw/2;
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); g.setAttribute("class", "lbls"); g.setAttribute("pointer-events", "none");
    d.parts.forEach(p=>{
      const w = BODY_WORDS[p.gr], left = p.dot[0] < mid, t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", p.dot[0] + (left ? -R*1.25 : R*1.25)); t.setAttribute("y", p.dot[1]); t.setAttribute("dy", ".35em");
      t.setAttribute("text-anchor", left ? "end" : "start"); t.setAttribute("style", `font-size:${(R*1.2).toFixed(1)}px`); t.setAttribute("lang", "el"); t.textContent = w.gr.replace(/^(ο|η|το|τα|οι)\s/, "");
      g.appendChild(t);
    });
    mainSvg.insertBefore(g, mainSvg.querySelector(".dots"));
  }
  labelBtn.onclick = ()=>setLabels(labelBtn.getAttribute("aria-pressed")!=="true");
  let wantLabels = false; try{ wantLabels = localStorage.getItem("gl-bdlabels")==="1"; }catch(e){}
  if(wantLabels) setLabels(true);

  /* "Test me": the word is said and written, tap its part on the drawing (10 questions; two tries each) */
  let test = null;
  const flash = (i, cls) => { box.querySelectorAll(`.bd-svg [data-i="${i}"]`).forEach(el=>{ el.classList.add(cls); setTimeout(()=>el.classList.remove(cls), 900); }); };
  const playCard = w => `<button type="button" class="hear" data-act="play" aria-label="${esc(tx("Listen"))}">🔊</button>`;
  function endTest(){
    test = null; box.classList.remove("bd-testing"); testBtn.setAttribute("aria-pressed", false);
    card.innerHTML = `<span class="muted">${esc(tx("Tap a number on the drawing, or a word in the list."))}</span>`; sel = -1;
  }
  function askNext(){
    if(!test) return;
    if(test.n >= test.queue.length){
      card.innerHTML = `<span class="bd-t"><b>${esc(tx("Round finished!"))}</b><span>${esc(tx("Score"))}: ${test.score} / ${test.queue.length}</span></span><button type="button" class="hear" data-act="again">${esc(tx("Play again"))}</button><button type="button" class="hear" data-act="done">${esc(tx("Done"))}</button>`;
      card.querySelector('[data-act="again"]').onclick = startTest; card.querySelector('[data-act="done"]').onclick = endTest;
      try{ if(typeof celebrate==="function" && test.score===test.queue.length) celebrate(card, test.score, test.queue.length); }catch(e){}
      test.over = true; return;
    }
    const i = test.queue[test.n], w = BODY_WORDS[d.parts[i].gr]; test.cur = i; test.tries = 0;
    card.innerHTML = `<span class="bd-n">${test.n+1}</span><span class="bd-t"><span>${esc(tx("Find it on the drawing"))} · ${test.n+1} / ${test.queue.length}</span><b lang="el">${esc(w.gr)}</b></span>${playCard(w)}<button type="button" class="hear" data-act="stop" aria-label="${esc(tx("Stop"))}">✕</button>`;
    card.querySelector('[data-act="play"]').onclick = ()=>sayWord(w); card.querySelector('[data-act="stop"]').onclick = endTest;
    sayWord(w);
  }
  function startTest(){
    test = {queue:shuffle(d.parts.map((_,i)=>i)).slice(0, Math.min(10, d.parts.length)), n:0, score:0, tries:0, cur:-1, over:false};
    box.classList.add("bd-testing"); testBtn.setAttribute("aria-pressed", true);
    box.querySelectorAll(".on").forEach(el=>el.classList.remove("on"));
    askNext();
  }
  function answerTest(i){
    if(!test || test.over || test.busy) return;
    const w = BODY_WORDS[d.parts[test.cur].gr], item = {key:`dg:${d.id}:${sid(w.gr)}`, gr:w.gr, en:w.en, lat:w.lat, snd:w.snd || sid(w.gr), cat:"Drawings"};
    if(i===test.cur){ flash(i, "ok"); Progress.record(item, true); test.score++; test.n++; test.busy = true; setTimeout(()=>{ test && (test.busy = false); askNext(); }, 800); }
    else { flash(i, "bad"); test.tries++;
      if(test.tries>=2){ flash(test.cur, "ok"); Progress.record(item, false); test.n++; test.busy = true; setTimeout(()=>{ test && (test.busy = false); askNext(); }, 1500); } }
  }
  testBtn.onclick = ()=>{ if(test) endTest(); else startTest(); };
  const act = i => { if(test) answerTest(i); else select(i); };
  box.querySelectorAll(".bd-svg").forEach(svg=>{
    svg.addEventListener("click",e=>{ const g=e.target.closest("[data-i]"); if(g) act(+g.dataset.i); });
    svg.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ const g=e.target.closest("[data-i]"); if(g){ e.preventDefault(); act(+g.dataset.i); } } });
  });
  box.querySelectorAll(".bd-legend [data-i]").forEach(b=>b.onclick=()=>{ if(!test) select(+b.dataset.i); });
  box.querySelectorAll(".bd-thumb").forEach(b=>b.onclick=()=>show(b.dataset.d));
  /* the arrows and the swipe change the drawing without scrolling the page */
  const idx = list.findIndex(x=>x.id===d.id);
  const go = k => { window.__bdDir = k; setId(list[(idx+k+list.length)%list.length].id); renderDiagramSet(box, list, getId, setId); };
  const prev = box.querySelector(".bd-nav.prev"), next = box.querySelector(".bd-nav.next");
  if(prev){ prev.onclick = ()=>go(-1); next.onclick = ()=>go(1); }
  enableDiagramZoom(box.querySelector(".bd-svg"), box.querySelector(".bd-stage"), list.length>1 ? go : null);
  perfGuard(box);
}

/* zoom and move on a drawing: two fingers (or the + and − buttons, the wheel with Ctrl, a double tap) zoom; one finger moves it once it is zoomed;
   a swipe to the side (not zoomed) shows the next or the previous drawing. The zoom changes the viewBox, so the lines stay sharp, and the numbers keep their size. */
function enableDiagramZoom(svg, stage, onSwipe){
  const [bx,by,bw,bh] = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  let z = 1, vx = bx, vy = by, moved = false, start = null, pinch = null;
  const pts = new Map(), reset = stage.querySelector('[data-z="reset"]');
  const apply = ()=>{
    const w = bw/z, h = bh/z;
    vx = Math.min(bx+bw-w, Math.max(bx, vx)); vy = Math.min(by+bh-h, Math.max(by, vy));
    svg.setAttribute("viewBox", `${vx.toFixed(2)} ${vy.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
    svg.style.setProperty("--zk", (1/z).toFixed(3));
    svg.style.touchAction = z>1 ? "none" : "pan-y";
    reset.hidden = z<=1;
  };
  const toSvg = (cx,cy)=>{ const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; const q = pt.matrixTransform(svg.getScreenCTM().inverse()); return [q.x, q.y]; };
  const zoomAt = (nz, cx, cy)=>{
    const [sx,sy] = toSvg(cx,cy); z = Math.min(5, Math.max(1, nz)); apply();
    const m = svg.getScreenCTM(), px = m.a*sx + m.c*sy + m.e, py = m.b*sx + m.d*sy + m.f;
    vx += (px-cx)/m.a; vy += (py-cy)/m.d; apply();
  };
  const centre = ()=>{ const r = svg.getBoundingClientRect(); return [r.left+r.width/2, r.top+r.height/2]; };
  stage.querySelector('[data-z="in"]').onclick = ()=>zoomAt(z*1.6, ...centre());
  stage.querySelector('[data-z="out"]').onclick = ()=>zoomAt(z/1.6, ...centre());
  reset.onclick = ()=>{ z = 1; vx = bx; vy = by; apply(); };
  svg.addEventListener("dblclick", e=>{ e.preventDefault(); if(z>1){ z = 1; vx = bx; vy = by; apply(); } else zoomAt(2.4, e.clientX, e.clientY); });
  svg.addEventListener("wheel", e=>{ if(!(e.ctrlKey || z>1)) return; e.preventDefault(); zoomAt(z*(e.deltaY<0 ? 1.2 : 1/1.2), e.clientX, e.clientY); }, {passive:false});
  svg.addEventListener("click", e=>{ if(moved){ e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  svg.addEventListener("pointerdown", e=>{
    pts.set(e.pointerId, [e.clientX, e.clientY]); moved = false;
    if(pts.size===1) start = {x:e.clientX, y:e.clientY};
    if(pts.size===2){ const [a,b] = [...pts.values()]; pinch = {d:Math.hypot(a[0]-b[0], a[1]-b[1]) || 1, z}; }
  });
  svg.addEventListener("pointermove", e=>{
    const prev = pts.get(e.pointerId); if(!prev) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if(pts.size===2 && pinch){ const [a,b] = [...pts.values()]; moved = true; zoomAt(pinch.z * Math.hypot(a[0]-b[0], a[1]-b[1]) / pinch.d, (a[0]+b[0])/2, (a[1]+b[1])/2); }
    else if(pts.size===1 && start){
      const far = Math.abs(e.clientX-start.x) + Math.abs(e.clientY-start.y) > 8;
      if(far) moved = true;
      if(z>1 && moved){ const m = svg.getScreenCTM(); vx -= (e.clientX-prev[0])/m.a; vy -= (e.clientY-prev[1])/m.d; apply(); }
    }
  });
  const end = e=>{
    if(pts.size===1 && z===1 && start && onSwipe){
      const dx = e.clientX-start.x, dy = e.clientY-start.y;
      if(Math.abs(dx)>60 && Math.abs(dy)<45){ moved = true; onSwipe(dx<0 ? 1 : -1); }
    }
    pts.delete(e.pointerId); if(pts.size<2) pinch = null; if(!pts.size) start = null;
  };
  svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
  svg.style.touchAction = "pan-y";
}
