/* ---------- how to write the letters: the strokes ----------
   Each letter is a list of strokes, in the order and the direction you write them (a number marks where each one starts).
   The drawing is in a box of 100 x 100; lowercase letters sit in the middle (their "tall" and "low" parts go up and down), capitals fill the box.
   strokeDemo(letter, kind) returns an SVG that draws the strokes one after the other (the animation is in css/extras.css).
   These are plain shapes, not a font: they show the movement, not the exact look of a typeface. */
const STROKES = {
  lower:{
    "α":["M64 46 C58 38 38 38 36 56 C35 72 56 76 64 60", "M64 40 V74"],
    "β":["M38 98 V30 C38 8 70 8 68 30 C67 44 52 48 46 50 C62 50 72 58 70 72 C68 88 44 88 38 78"],
    "γ":["M30 40 C32 56 42 66 50 66 C58 66 68 56 70 40", "M50 66 C50 80 46 90 40 96"],
    "δ":["M64 18 C54 8 42 18 50 28 C58 34 70 42 68 60 C66 76 36 78 36 58 C36 44 52 36 66 44"],
    "ε":["M62 42 C50 34 38 44 46 52 C50 54 54 55 52 56 C40 58 36 70 48 74 C56 76 62 72 64 66"],
    "ζ":["M58 12 C44 10 38 22 52 32 C38 36 34 56 44 68 C54 80 64 88 56 96 C50 100 44 94 48 88"],
    "η":["M34 38 V76", "M34 52 C38 38 66 38 66 54 V96"],
    "θ":["M50 14 C28 14 28 76 50 76 C72 76 72 14 50 14", "M38 44 H62"],
    "ι":["M50 38 V68 C50 74 56 76 60 74"],
    "κ":["M36 38 V76", "M64 38 L37 57 L66 76"],
    "λ":["M36 14 L66 76", "M52 46 L34 76"],
    "μ":["M34 38 V98", "M34 60 C34 80 50 82 66 64", "M66 38 V70 C66 76 72 78 78 72"],
    "ν":["M34 38 C34 56 36 76 46 76 C56 76 64 56 68 38"],
    "ξ":["M62 14 C44 8 38 22 52 32 C34 36 30 54 46 62 C60 68 64 82 52 90 C44 96 38 88 46 84"],
    "ο":["M50 38 C28 38 28 76 50 76 C72 76 72 38 50 38"],
    "π":["M28 40 H72", "M40 40 V74", "M60 40 V74"],
    "ρ":["M36 98 V52 C38 36 70 36 70 56 C70 76 44 80 36 62"],
    "σ":["M72 40 H54 C32 38 28 76 50 76 C72 76 72 50 54 42"],
    "ς":["M66 38 C48 36 36 44 36 58 C36 76 62 78 66 70"],
    "τ":["M30 40 H68", "M50 40 V70 C50 74 54 76 60 74"],
    "υ":["M32 38 C32 60 38 76 52 76 C64 76 68 58 68 38"],
    "φ":["M50 14 V96", "M50 38 C26 38 26 76 50 76 C74 76 74 38 50 38"],
    "χ":["M32 38 L68 76", "M68 38 L30 98"],
    "ψ":["M50 14 V96", "M30 38 C30 66 50 74 50 74 C50 74 70 66 70 38"],
    "ω":["M30 40 C28 62 36 76 44 76 C50 76 50 66 50 56 C50 66 50 76 56 76 C64 76 72 62 70 40"]
  },
  upper:{
    "Α":["M50 18 L24 82", "M50 18 L76 82", "M34 62 H66"],
    "Β":["M32 18 V82", "M32 18 H52 C70 18 70 48 52 48 H32", "M32 48 H56 C76 48 76 82 54 82 H32"],
    "Γ":["M34 18 V82", "M34 18 H70"],
    "Δ":["M50 18 L22 82 H78 Z"],
    "Ε":["M34 18 V82", "M34 18 H68", "M34 50 H62", "M34 82 H68"],
    "Ζ":["M28 18 H72 L28 82 H72"],
    "Η":["M30 18 V82", "M70 18 V82", "M30 50 H70"],
    "Θ":["M50 18 C16 18 16 82 50 82 C84 82 84 18 50 18", "M36 50 H64"],
    "Ι":["M50 18 V82"],
    "Κ":["M32 18 V82", "M70 18 L32 54", "M46 44 L72 82"],
    "Λ":["M50 18 L24 82", "M50 18 L76 82"],
    "Μ":["M26 82 V18 L50 62 L74 18 V82"],
    "Ν":["M28 82 V18 L72 82 V18"],
    "Ξ":["M28 18 H72", "M36 50 H64", "M28 82 H72"],
    "Ο":["M50 18 C16 18 16 82 50 82 C84 82 84 18 50 18"],
    "Π":["M30 18 H70", "M36 18 V82", "M64 18 V82"],
    "Ρ":["M34 18 V82", "M34 18 H52 C74 18 74 52 52 52 H34"],
    "Σ":["M72 18 H28 L52 50 L28 82 H72"],
    "Τ":["M28 18 H72", "M50 18 V82"],
    "Υ":["M28 18 L50 50", "M72 18 L50 50 V82"],
    "Φ":["M50 16 V84", "M50 30 C20 30 20 70 50 70 C80 70 80 30 50 30"],
    "Χ":["M28 18 L72 82", "M72 18 L28 82"],
    "Ψ":["M50 16 V84", "M28 24 C28 56 38 64 50 64 C62 64 72 56 72 24"],
    "Ω":["M24 82 H40 C22 70 22 18 50 18 C78 18 78 70 60 82 H76"]
  }
};
/* the strokes of a letter of the alphabet list: a = {l, U}, kind = "lower" or "upper" */
function strokesOf(a, kind){
  const key = kind==="lower" ? [...a.l][0] : [...a.U][0];
  return STROKES[kind][key] || null;
}
function strokeDemo(a, kind){
  const list = strokesOf(a, kind);
  if(!list) return "";
  let at = 0.2;
  const paths = list.map((d,i)=>{
    const start = d.match(/M\s*([\d.]+)\s+([\d.]+)/), len = (d.length > 40 ? 1.3 : 0.8) + (d.includes("C") ? .2 : 0), delay = at;
    at += len + 0.25;
    return `<path class="sk-path" d="${d}" pathLength="1" style="--dl:${delay.toFixed(2)}s; --du:${len.toFixed(2)}s"/>
      <g class="sk-start" style="--dl:${(delay - 0.1).toFixed(2)}s"><circle cx="${start[1]}" cy="${start[2]}" r="6"/><text x="${start[1]}" y="${+start[2] + 3.6}" text-anchor="middle">${i+1}</text></g>`;
  }).join("");
  return `<svg class="strokedemo" viewBox="0 0 100 100" aria-hidden="true">${paths}</svg>`;
}
