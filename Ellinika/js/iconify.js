/* ---------- no emoji: every emoji of the page is replaced by its drawing (data/icons.js) ----------
   The app writes emoji in its texts and data (🐟, 🔊, ★...). Here, each time text is added to the page, every emoji we know is swapped for a small
   inline SVG that is 1em big, so it follows the size of the text around it. Icons that use currentColor take the colour of the text.
   In attributes (placeholder, aria-label, title, alt) and in <title> and <option>, where a drawing cannot go, the emoji is simply removed.
   To add a picture: draw it in the generator (key = the emoji) and rebuild data/icons.js. An emoji without a drawing is listed in window.missingEmoji. */
(function(){
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keys = Object.keys(ICONS).concat(Object.keys(ICON_ALIAS)).sort((a, b) => b.length - a.length);
  const KNOWN = new RegExp("(?:" + keys.map(esc).join("|") + ")\\uFE0F?", "gu");
  const ANY = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{2900}-\u{297F}\u{2190}-\u{21FF}]/u;
  const MONO = new Set(ICON_MONO), cache = {};
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT"]);
  window.missingEmoji = new Set();

  const keyOf = m => { const k = m.replace(/️/g, ""); return ICON_ALIAS[k] || k; };
  function svgHtml(k){
    const inner = ICONS[k]; if(!inner) return "";
    return `<svg class="ic${MONO.has(k) ? " mono" : ""}" data-e="${k}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">${inner}</svg>`;
  }
  function make(k){
    if(!cache[k]){ const t = document.createElement("template"); t.innerHTML = svgHtml(k); cache[k] = t.content.firstChild; }
    return cache[k].cloneNode(true);
  }
  /* the HTML of one emoji, for the code that builds strings */
  window.ic = ch => { const k = keyOf(ch); return ICONS[k] ? svgHtml(k) : ""; };
  window.stripEmoji = s => s.replace(KNOWN, "").replace(/\s{2,}/g, " ").trim();

  function fixText(node){
    const s = node.nodeValue;
    if(!s || !ANY.test(s)) return;
    const p = node.parentNode; if(!p) return;
    if(p.closest && p.closest("svg")){ node.nodeValue = s.replace(KNOWN, ""); return; }        /* a <text> of a drawing: no room for a picture */
    if(p.nodeName==="TITLE" || p.nodeName==="OPTION"){ node.nodeValue = stripEmoji(s); return; }
    KNOWN.lastIndex = 0;
    let last = 0, m, frag = null;
    while((m = KNOWN.exec(s))){
      const el = make(keyOf(m[0])); if(!el) continue;
      if(!frag) frag = document.createDocumentFragment();
      if(m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      frag.appendChild(el); last = m.index + m[0].length;
    }
    if(!frag){ noteMissing(s); return; }
    if(last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    p.replaceChild(frag, node);
  }
  function noteMissing(s){
    for(const ch of s) if(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(ch)) window.missingEmoji.add(ch);
  }
  function fixAttrs(el){
    for(const a of ["placeholder", "aria-label", "title", "alt"]){
      const v = el.getAttribute && el.getAttribute(a);
      if(v && ANY.test(v)){ const t = stripEmoji(v); if(t!==v) el.setAttribute(a, t); }
    }
  }
  function scan(root){
    if(root.nodeType===3){ fixText(root); return; }
    if(root.nodeType!==1 || SKIP.has(root.nodeName) || root.nodeName.toLowerCase()==="svg") return;
    fixAttrs(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.nodeType===1 ? (SKIP.has(n.nodeName) || n.nodeName.toLowerCase()==="svg" ? NodeFilter.FILTER_REJECT : (fixAttrs(n), NodeFilter.FILTER_SKIP)) : (ANY.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
    });
    const list = []; while(w.nextNode()) list.push(w.currentNode);
    list.forEach(fixText);
  }
  window.iconify = scan;

  const mo = new MutationObserver(list => {
    for(const m of list){
      if(m.type==="characterData") fixText(m.target);
      else if(m.type==="attributes") fixAttrs(m.target);
      else m.addedNodes.forEach(scan);
    }
  });
  scan(document.documentElement);
  document.title = stripEmoji(document.title);
  mo.observe(document.documentElement, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:["placeholder", "aria-label", "title", "alt"]});
})();
