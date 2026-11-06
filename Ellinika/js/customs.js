/* ---------- customs and politeness ----------
   Short cards from data/customs.js: a title, a few lines about a habit, and phrases to hear (tap a phrase). */
function openCustoms(){
  const box = $("customsBox"); box.innerHTML = "";
  CUSTOMS.cards.forEach(c=>{
    const card = document.createElement("section"); card.className = "card custom";
    card.innerHTML = `<h2 class="sub"><span class="custom-ico" aria-hidden="true">${esc(c.icon)}</span> ${esc(pick(c.title))}</h2><p>${esc(pick(c.text))}</p>`;
    const list = document.createElement("div"); list.className = "lines"; card.appendChild(list);
    c.phrases.forEach(p=>{
      const b = document.createElement("button"); b.type = "button"; b.className = "line";
      b.innerHTML = `<span class="ltxt"><b lang="el">${esc(p.gr)}</b><span><span class="lt">${esc(p.lat)}</span></span><span>${esc(pick(p))}</span></span><span aria-hidden="true">🔊</span>`;
      b.onclick = ()=>say(p.gr);
      list.appendChild(b);
    });
    box.appendChild(card);
  });
}
