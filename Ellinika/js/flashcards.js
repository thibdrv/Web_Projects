/* ---------- flashcards: the mode "Flashcards" of every word list (Family, Animals, Food, Body...) ----------
   runFlashcards(box, {words, cat, keyPrefix}) shows one card at a time: the Greek word on the front, its pronunciation and meaning on the back.
   Tap the card (or Space) to turn it, then say if you knew the word:
     "I knew it" (→, key 2, or slide the card to the right)   "Again" (←, key 1, or slide to the left): the word comes back a few cards later.
   Every answer goes to Progress like in the quizzes (so it counts for the daily goal and the reviews).
   A round ends when every word has been known once; the summary tells how many you knew at the first try. */
function runFlashcards(box, {words, cat, keyPrefix}){
  const total = words.length;
  let queue = shuffle([...words]), turned = false, known = 0, missed = new Set(), done = 0;
  const itemOf = w => ({key:`v:${keyPrefix}:${sid(w.gr)}`, gr:w.gr, en:w.en, lat:w.lat, snd:sid(w.gr), cat});
  const picture = w => w.svg && typeof garmentSvg==="function" ? `<span class="gm-big" aria-hidden="true">${garmentSvg(w.svg, w.color, 120)}</span>` : w.emoji ? `<span class="emoji" aria-hidden="true">${w.emoji}</span>` : "";

  box.innerHTML = `
    <div class="fc-head"><span><b data-f="n">1</b> / ${total}</span><span class="fc-known"><b data-f="known">0</b> ${esc(tx("known"))}</span></div>
    <div class="prog" aria-hidden="true"><i data-f="bar"></i></div>
    <div class="fc-stage" data-f="stage">
      <button type="button" class="fc-card" data-f="card" aria-live="polite"></button>
    </div>
    <p class="fc-hint muted" data-f="hint"></p>
    <div class="fc-actions" data-f="actions" hidden>
      <button type="button" class="btn fc-again" data-f="again"><span aria-hidden="true">✗</span> ${esc(tx("Again"))}</button>
      <button type="button" class="btn fc-know" data-f="know"><span aria-hidden="true">✓</span> ${esc(tx("I knew it"))}</button>
    </div>`;
  const $f = k => box.querySelector(`[data-f="${k}"]`);
  const card = $f("card"), stage = $f("stage");

  function paint(){
    const w = queue[0];
    turned = false; card.classList.remove("turned", "go-right", "go-left"); card.style.transform = ""; card.style.opacity = "";
    const art = w.art ? GENDERS[w.art] : null;
    card.setAttribute("aria-label", tx("Flashcard: tap to turn it"));
    card.innerHTML = `
      <span class="fc-face fc-front">${picture(w)}<span class="fc-gr" lang="el">${esc(w.gr)}</span></span>
      <span class="fc-face fc-back"><span class="fc-gr small" lang="el">${esc(w.gr)}</span><span class="lt fc-lat">${esc(w.lat)}</span>
        <span class="fc-en">${esc(txm(w.en))}</span>${art ? `<span class="fc-art ${art[0]}">${esc(tx(art[1]))}</span>` : ""}</span>`;
    $f("n").textContent = Math.min(done + 1, total); $f("known").textContent = known;
    $f("bar").style.width = (100 * known / total) + "%";
    $f("actions").hidden = true;
    $f("hint").textContent = tx("Tap the card to see the meaning.");
  }
  function turn(){
    if(!queue.length) return;
    turned = !turned; card.classList.toggle("turned", turned);
    if(turned){ say(queue[0].gr); $f("actions").hidden = false; $f("hint").textContent = tx("Did you know it? Slide the card, or use the buttons."); }
    else { $f("actions").hidden = true; $f("hint").textContent = tx("Tap the card to see the meaning."); }
  }
  function answer(ok){
    if(!queue.length || !turned) return;
    const w = queue.shift();
    Progress.record(itemOf(w), ok);
    if(ok){ known++; done++; }
    else { missed.add(w.gr); queue.splice(Math.min(queue.length, 3), 0, w); }       /* it comes back after a few other cards */
    const dir = ok ? "go-right" : "go-left";
    card.classList.add(dir);
    setTimeout(()=>{ queue.length ? paint() : finish(); }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220);
  }
  function finish(){
    const firstTry = total - missed.size;
    box.innerHTML = `<div class="card fc-done"><p class="word" aria-hidden="true">🎉</p>
      <h3>${esc(tx("Round finished!"))}</h3>
      <p>${esc(tx(firstTry===1 ? "You knew {n} word at the first try, out of {t}." : "You knew {n} words at the first try, out of {t}.", {n:firstTry, t:total}))}</p>
      <div class="btns"><button type="button" class="btn" data-f="again2">${esc(tx("Play again"))}</button></div></div>`;
    box.querySelector('[data-f="again2"]').onclick = ()=>runFlashcards(box, {words, cat, keyPrefix});
    try{ if(typeof celebrate==="function") celebrate(box, firstTry, total); }catch(e){}
  }

  card.onclick = ()=>{ if(!dragged) turn(); };
  $f("again").onclick = ()=>answer(false);
  $f("know").onclick = ()=>answer(true);

  /* slide the card: to the right = I knew it, to the left = again (only once the card is turned) */
  let x0 = null, dx = 0, dragged = false;
  card.addEventListener("pointerdown", e=>{ x0 = e.clientX; dx = 0; dragged = false; try{ card.setPointerCapture(e.pointerId); }catch(err){} });
  card.addEventListener("pointermove", e=>{
    if(x0===null) return;
    dx = e.clientX - x0;
    if(Math.abs(dx) > 8) dragged = true;
    if(dragged && turned){ card.style.transition = "none"; card.style.transform = `translateX(${dx}px) rotate(${dx/18}deg)`; card.style.opacity = String(Math.max(.4, 1 - Math.abs(dx)/360)); stage.dataset.lean = dx>40 ? "right" : dx<-40 ? "left" : ""; }
  });
  const release = ()=>{
    if(x0===null) return;
    const d = dx; x0 = null; stage.dataset.lean = ""; card.style.transition = "";
    if(dragged && turned && Math.abs(d) > 80){ card.style.transform = ""; card.style.opacity = ""; answer(d > 0); }
    else { card.style.transform = ""; card.style.opacity = ""; }
    setTimeout(()=>{ dragged = false; }, 0);
  };
  card.addEventListener("pointerup", release); card.addEventListener("pointercancel", release);

  /* keys: Space or Enter turn the card, 1 / ← = again, 2 / → = I knew it (only while this page is open) */
  const keys = e=>{
    if(!box.isConnected || !box.contains(card)){ document.removeEventListener("keydown", keys); return; }
    if(box.closest("[hidden]") || e.ctrlKey || e.metaKey || e.altKey) return;
    if(e.target.matches && e.target.matches("input,textarea,select")) return;
    if(e.key===" " || e.key==="Enter"){ if(e.target===card) return; e.preventDefault(); turn(); }
    else if(e.key==="ArrowLeft" || e.key==="1"){ e.preventDefault(); answer(false); }
    else if(e.key==="ArrowRight" || e.key==="2"){ e.preventDefault(); answer(true); }
  };
  document.addEventListener("keydown", keys);
  paint();
  if(matchMedia("(max-width:700px)").matches) setTimeout(()=>{ try{ stage.scrollIntoView({block:"center", behavior:"smooth"}); }catch(e){} }, 60);   /* on a phone the card is brought into view */
}
