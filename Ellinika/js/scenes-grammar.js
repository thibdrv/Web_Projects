/* ---------- more drawings for the page Grammar → Drawings: five verbs and the prepositions ----------
   The verb drawings are made from data/grammar4.js ("conj"): seven cells (εγώ, εσύ, αυτός, αυτή, εμείς, εσείς, αυτοί) with the form in a speech bubble.
   The tappable part of a cell is the whole phrase (εγώ έχω): it has its own sound. Same engine and helpers as js/scenes.js. */
(function(){
  const {p,e,r,l,g} = SC;
  const defs = SC.skinDef + [["#E3F1FB","#BCDCF2"],["#FFF1C2","#F6D56E"],["#E7F6E1","#C6E5B8"],["#FBE5EE","#F2BFD3"],["#EEE6F8","#D5C6EE"],["#FFE8D6","#F8C9A6"],["#DDF1EE","#B0DCD3"],["#F4F0E4","#E4DCC4"]].map(([a,b],i)=>g("t"+(i+1),a,b)).join("");
  const txt = (x,y,s,t,c)=>`<text x="${x}" y="${y}" text-anchor="middle" style="fill:${c||"#2A2E36"};stroke:none;font:800 ${s}px 'Commissioner',sans-serif">${t}</text>`;
  const person = (cx,by,s,c,dress,hair)=> (dress ? p(`M${cx-14*s},${by} L${cx-8*s},${by-30*s} L${cx+8*s},${by-30*s} L${cx+14*s},${by}Z`,c,{w:1.2}) : r(cx-7*s,by-26*s,14*s,26*s,3*s,"#3A4256",{w:1.1})) + p(`M${cx-11*s},${by-52*s} C${cx-11*s},${by-56*s} ${cx+11*s},${by-56*s} ${cx+11*s},${by-52*s} L${cx+9*s},${by-28*s} L${cx-9*s},${by-28*s}Z`,c,{w:1.2}) + e(cx,by-64*s,8.5*s,9.5*s,"url(#sk)",{w:1.2}) + p(`M${cx-8.5*s},${by-66*s} C${cx-8.5*s},${by-76*s} ${cx+8.5*s},${by-76*s} ${cx+8.5*s},${by-66*s} C${cx+4*s},${by-70*s} ${cx-4*s},${by-70*s} ${cx-8.5*s},${by-66*s}Z`,hair||"#4A3426",{w:1}) + e(cx-3*s,by-64*s,1*s,1.2*s,"#2A1F1B",{w:0}) + e(cx+3*s,by-64*s,1*s,1.2*s,"#2A1F1B",{w:0});
  const xy = i => ({x:6+(i%4)*106, y:6+Math.floor(i/4)*148});

  /* ----- a verb in seven cells ----- */
  const PEOPLE = [
    (x,y)=>person(x+50,y+120,1,"#3E7BD1"), (x,y)=>person(x+50,y+120,1,"#F2A22E"), (x,y)=>person(x+50,y+120,1,"#4CAF50"), (x,y)=>person(x+50,y+120,1,"#E8579A",true,"#7A3E26"),
    (x,y)=>person(x+32,y+120,.85,"#8A55C8")+person(x+68,y+120,.85,"#E8579A",true,"#7A3E26"), (x,y)=>person(x+32,y+120,.85,"#F2A22E")+person(x+68,y+120,.85,"#3E9BD0"),
    (x,y)=>person(x+22,y+120,.72,"#4CAF50")+person(x+50,y+120,.72,"#E8579A",true,"#7A3E26")+person(x+78,y+120,.72,"#3E7BD1")
  ];
  const PRON = ["εγώ","εσύ","αυτός","αυτή","εμείς","εσείς","αυτοί"];
  const conj = c => {
    const cell = (i,form)=>{ const {x,y} = xy(i);
      return r(x,y,100,142,12,`url(#t${i+1})`,{w:1.8,s:"#7A8BA0"}) + r(x+8,y+8,84,28,10,"#FFFFFF",{w:1.4,s:"#9AA3AD"}) + p(`M${x+38},${y+36} L${x+44},${y+44} L${x+50},${y+36}Z`,"#FFFFFF",{w:1.2,s:"#9AA3AD"}) + r(x+38,y+34,12,3,0,"#FFFFFF",{w:0}) +
        txt(x+50,y+28,form.length>9?8.5:form.length>7?10:form.length>6?12:14,form) + PEOPLE[i](x,y) + txt(x+50,y+136,13,PRON[i]); };
    const parts = c.forms.map((f,i)=>{ const {x,y} = xy(i); return {gr:f.gr, z:1, dot:[x+88,y+22], shapes:[cell(i,f.form)]}; });
    const {x,y} = xy(7);
    const under = defs + r(0,0,436,302,0,"#FBF8EE",{w:0}) + r(x,y,100,142,12,"url(#t8)",{w:1.8,s:"#7A8BA0"}) + txt(x+50,y+60,c.head.length>7?18:22,c.head) + txt(x+50,y+84,13,c.headEn,"#5A5F6B");
    return {id:"conj-"+c.id, name:c.name, viewBox:"0 0 436 302", rich:true, under, parts};
  };

  /* ----- the prepositions: seven little pictures ----- */
  const cellBg = (i,id)=>{ const {x,y} = xy(i); return r(x,y,100,142,12,`url(#t${id})`,{w:1.8,s:"#7A8BA0"}); };
  const house = (x,y,s=1)=> r(x+14,y+58,62*s,46*s,2,"#F2E4CE",{w:1.6,s:"#8A6A3E"}) + p(`M${x+8},${y+58} L${x+14+31*s},${y+32} L${x+82*s},${y+58}Z`,"#B9552E",{w:1.6}) + p(`M${x+50},${y+104} L${x+50},${y+82} C${x+50},${y+72} ${x+66},${y+72} ${x+66},${y+82} L${x+66},${y+104}Z`,"#6B4A2E",{w:1.4});
  const arrow = (x1,y1,x2,y2,col)=> { const a = Math.atan2(y2-y1,x2-x1), h = 9; return l(`M${x1},${y1} L${x2},${y2}`,{s:col||"#E8433F",w:3.4}) + p(`M${x2},${y2} L${(x2-h*Math.cos(a-.5)).toFixed(1)},${(y2-h*Math.sin(a-.5)).toFixed(1)} L${(x2-h*Math.cos(a+.5)).toFixed(1)},${(y2-h*Math.sin(a+.5)).toFixed(1)}Z`,col||"#E8433F",{w:1,s:col||"#E8433F"}); };
  const PREPS = [
    ["σε",1,(x,y)=>house(x,y)+person(x+30,y+108,.5,"#3E7BD1")+arrow(x+6,y+92,x+46,y+92)],
    ["από",2,(x,y)=>house(x,y)+person(x+84,y+108,.5,"#F2A22E")+arrow(x+56,y+96,x+90,y+96,"#3E7BD1")],
    ["με",3,(x,y)=>person(x+34,y+112,.9,"#8A55C8")+person(x+68,y+112,.9,"#E8579A",true,"#7A3E26")+l(`M${x+44},${y+84} L${x+58},${y+84}`,{s:"#F2C14E",w:4})],
    ["για",4,(x,y)=>person(x+28,y+112,.85,"#4CAF50")+r(x+56,y+80,28,24,2,"#8A55C8",{w:1.6,s:"#3E2A7A"})+r(x+66,y+80,8,24,0,"#F2C14E",{w:1})+r(x+56,y+86,28,6,0,"#F2C14E",{w:1})+p(`M${x+70},${y+80} C${x+62},${y+68} ${x+58},${y+74} ${x+66},${y+80} M${x+70},${y+80} C${x+78},${y+68} ${x+82},${y+74} ${x+74},${y+80}`,"none",{w:2,s:"#F2C14E"})+arrow(x+36,y+90,x+54,y+92,"#3E7BD1")],
    ["χωρίς",5,(x,y)=>p(`M${x+24},${y+70} L${x+60},${y+70} C${x+60},${y+96} ${x+50},${y+106} ${x+42},${y+106} C${x+34},${y+106} ${x+24},${y+96} ${x+24},${y+70}Z`,"#FFFFFF",{w:1.8,s:"#4A4F58"})+e(x+42,y+71,18,4,"#7A4A2E",{w:1.2})+p(`M${x+60},${y+78} C${x+72},${y+78} ${x+72},${y+94} ${x+60},${y+94}`,"none",{w:3,s:"#C9CED6"})+r(x+68,y+90,14,14,2,"#FFFFFF",{w:1.4,s:"#8A929C"})+l(`M${x+64},${y+86} L${x+86},${y+108} M${x+86},${y+86} L${x+64},${y+108}`,{s:"#E8433F",w:4})],
    ["προς",6,(x,y)=>person(x+22,y+112,.8,"#F2A22E")+arrow(x+36,y+88,x+68,y+88)+l(`M${x+82},${y+112} L${x+82},${y+66}`,{s:"#6B4A2E",w:2.6})+p(`M${x+82},${y+66} L${x+98},${y+72} L${x+82},${y+80}Z`,"#E8433F",{w:1.4,s:"#7A1E1A"})],
    ["μέχρι",7,(x,y)=>r(x+4,y+96,92,16,0,"#5A5E68",{w:0})+l(`M${x+6},${y+104} L${x+94},${y+104}`,{s:"#F5F5F2",w:2,dash:"8 6"})+[0,1,2,3].map(i=>r(x+78,y+92+i*6,6,6,0,i%2?"#FFFFFF":"#17181B",{w:0})+r(x+84,y+92+i*6,6,6,0,i%2?"#17181B":"#FFFFFF",{w:0})).join("")+person(x+22,y+98,.62,"#3E9BD0")+arrow(x+34,y+76,x+74,y+76)]
  ];
  const prepParts = PREPS.map(([gr,id,draw],i)=>{ const {x,y} = xy(i); return {gr, z:1, dot:[x+88,y+14], shapes:[cellBg(i,id)+draw(x,y)+txt(x+50,y+134,22,gr)]}; });
  const {x:ox,y:oy} = xy(7);
  const preps = {id:"preps", name:"Prepositions", viewBox:"0 0 436 302", rich:true,
    under:defs + r(0,0,436,302,0,"#FBF8EE",{w:0}) + r(ox,oy,100,142,12,"url(#t8)",{w:1.8,s:"#7A8BA0"}) + txt(ox+50,oy+54,17,"σε · από") + txt(ox+50,oy+78,17,"με · για") + txt(ox+50,oy+108,12,"prepositions","#5A5F6B"), parts:prepParts};

  GRAMMAR_DIAGRAMS.push(...G4.conj.map(c=>SC.scope(conj(c),"cj"+c.id)), SC.scope(preps,"preps"));
})();
TOPICS.drawings.intro = "Pictures for the grammar: the articles, the cases, the verbs (to be, to have, to want, to go, to do, to eat), past / present / future, the question words and the prepositions.";
