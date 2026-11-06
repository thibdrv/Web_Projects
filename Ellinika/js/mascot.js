/* ---------- the owl ----------
   A small owl (the bird of Athena) who reacts to your answers: mascot(mood, size) returns its drawing.
   Moods: "sleep" (the owl on the home page at night), "happy" (right answer), "oops" (wrong answer), "think" (so-so score), "cheer" (a series of right answers or a great score, with a cap).
   The look of every mood is in css/mascot.css; the colors are taken from the theme. */
function mascot(mood = "happy", size = 64){
  const brows = mood==="oops" ? `<path class="o-brow" d="M26 33 L40 38 M74 33 L60 38"/>` : "";
  const cheeks = mood==="happy" || mood==="cheer" ? `<circle class="o-cheek" cx="27" cy="55" r="5"/><circle class="o-cheek" cx="73" cy="55" r="5"/>` : "";
  const extra = mood==="oops" ? `<path class="o-drop" d="M80 24 q5 7 0 11 q-5 -4 0 -11z"/>`
    : mood==="think" ? `<g class="o-bubble"><circle cx="82" cy="20" r="3"/><circle cx="88" cy="11" r="4.5"/></g><text class="o-q" x="80" y="9" font-size="12" font-weight="800">?</text>`
    : mood==="cheer" ? `<path class="o-spark" d="M12 22 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z"/><path class="o-spark s2" d="M88 30 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6z"/>` : "";
  const zzz = mood==="sleep" ? `<text class="o-z" x="74" y="22" font-size="13" font-weight="800">z</text><text class="o-z z2" x="82" y="12" font-size="10" font-weight="800">z</text><text class="o-z z3" x="88" y="4" font-size="8" font-weight="800">z</text>` : "";
  const cap = mood==="cheer" ? `<g class="o-cap"><path d="M28 24 L50 14 L72 24 L50 34Z"/><rect x="40" y="31" width="20" height="8" rx="2"/><path class="o-tassel" d="M72 24 V36"/></g>` : "";
  return `<svg class="owl ${mood}" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-hidden="true">
    <g class="o-feet"><path d="M38 92 l-4 6 M38 92 l0 7 M38 92 l4 6 M62 92 l-4 6 M62 92 l0 7 M62 92 l4 6"/></g>
    <g class="o-wing o-wl"><ellipse cx="20" cy="62" rx="9" ry="21"/></g>
    <g class="o-wing o-wr"><ellipse cx="80" cy="62" rx="9" ry="21"/></g>
    <path class="o-ear" d="M24 32 L30 10 L44 26Z M76 32 L70 10 L56 26Z"/>
    <ellipse class="o-body" cx="50" cy="58" rx="31" ry="35"/>
    <ellipse class="o-belly" cx="50" cy="71" rx="19" ry="20"/>
    <g class="o-feather"><path d="M43 66 q3 3 6 0 M51 66 q3 3 6 0 M43 76 q3 3 6 0 M51 76 q3 3 6 0 M47 85 q3 3 6 0"/></g>
    <g class="o-eyes"><circle class="o-eye" cx="37" cy="44" r="13"/><circle class="o-eye" cx="63" cy="44" r="13"/>
      <circle class="o-pupil" cx="${mood==="think" ? 34 : 38}" cy="${mood==="think" ? 41 : 45}" r="${mood==="oops" ? 4 : 5.6}"/><circle class="o-pupil" cx="${mood==="think" ? 60 : 62}" cy="${mood==="think" ? 41 : 45}" r="${mood==="oops" ? 4 : 5.6}"/>
      <circle class="o-glint" cx="36" cy="43" r="1.8"/><circle class="o-glint" cx="60" cy="43" r="1.8"/>
      <rect class="o-lid" x="24" y="31" width="52" height="26" rx="13"/></g>
    ${brows}${cheeks}
    <path class="o-beak" d="M45 52 L55 52 L50 62Z"/>
    ${cap}${extra}${zzz}</svg>`;
}
