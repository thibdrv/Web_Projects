/* ---------- one example sentence per common word ----------
   data/examples.js (made by gen_examples.py) holds a short sentence for about 260 everyday words. It is shown under the answer of a quiz question
   (when the word has one) and, in the dictionary, behind a small "Example" button. The sentence is voiced and can be tapped like every other line. */
const EX_BY_KEY = new Map();
EXAMPLES.items.forEach(x=>x.keys.forEach(k=>{ if(!EX_BY_KEY.has(k)) EX_BY_KEY.set(k, x); }));

/* the example of a word ("το σπίτι", "γράφω"...), or null */
function exampleFor(gr){
  if(!gr) return null;
  return EX_BY_KEY.get(String(gr).replace(/^(ο|η|το|τα|οι)\s+/i, "").trim().toLowerCase()) || null;
}

/* the line to put in a page: a tappable sentence with its meaning, under a small label */
function exampleNode(gr){
  const x = exampleFor(gr); if(!x) return null;
  const box = document.createElement("div"); box.className = "exbox";
  const label = document.createElement("span"); label.className = "exlabel"; label.textContent = tx("Example");
  box.appendChild(label);
  g2Line(box, esc(x.say), esc(pick(x)), x.say);
  return box;
}
