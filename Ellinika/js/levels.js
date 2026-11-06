/* ---------- levels A1, A2, B1, B2 (CEFR) ----------
   The words of "Greek letters" each have a level in data/greek-data.js ("lvl").
   The other categories have one level per category, or per group of words (the lists below): it is an estimate,
   and it is only used by the dictionary (the level filter and the small A1 / A2 badges).
   A1 = first words, A2 = everyday life, B1 = independent speaker, B2 = fluent speaker. */
const CEFR_LEVELS = ["A1","A2","B1","B2"];
const CAT_LEVEL = {
  "Colors":"A1", "Numbers":"A1", "Family":"A1", "Food & drinks":"A1", "Human body":"A1", "Time & dates":"A1",
  "House & clothes":"A1", "Clothes":"A1", "Cooking":"A2", "City & travel":"A1", "Directions":"A1", "Weather & nature":"A2", "Jobs & hobbies":"A2", "Opposites":"A1",
  "Grammar":"A1", "Phrases":"A1", "Dialogues":"A2", "Greek letters":"A2",
  "Verbs":"A2", "Adjectives":"A2", "Small words":"A2", "Animals":"A2", "Plants & farming":"B1", "Feelings & mind":"B1", "Tools & materials":"B1", "Countries & nationalities":"A2",
  "Money & shopping":"B1", "Society & religion":"B1", "School & education":"B1", "Technology & media":"B1", "Leisure & arts":"A2"
};
/* "Category:group" overrides */
const GROUP_LEVEL = {
  "Family:inlaws":"A2", "Animals:animals":"A1",
  "Human body:face":"A2", "Human body:hand":"A2", "Human body:inside":"B1", "Human body:senses":"A2", "Human body:health":"A2",
  "Time & dates:around":"A2", "Time & dates:often":"A2",
  "Clothes:baby":"A2", "Cooking:ingredients":"A1", "Cooking:tools":"A2", "Cooking:actions":"A2", "Cooking:measures":"A2", "Cooking:taste":"A2", "House & clothes:kitchen":"A2", "House & clothes:accessories":"A2",
  "City & travel:travel":"A2", "City & travel:shopping":"A2",
  "Directions:compass":"A2", "Directions:moving":"A2", "Directions:roads":"A2", "Directions:distance":"A2",
  "Weather & nature:weather":"A1", "Weather & nature:talk":"A1", "Weather & nature:wild":"B1",
  "Jobs & hobbies:work":"B1", "Jobs & hobbies:hobbies":"A1", "Jobs & hobbies:sports":"A1",
  "Opposites:senses":"A2", "Opposites:places":"A2", "Opposites:actions":"A2"
};
const levelOfGroup = (cat, groupId) => GROUP_LEVEL[cat+":"+groupId] || CAT_LEVEL[cat] || "A2";
const LEVEL_NAMES = {A1:"Beginner", A2:"Elementary", B1:"Intermediate", B2:"Upper intermediate"};
const cefrRank = l => { const i = CEFR_LEVELS.indexOf(l); return i<0 ? 99 : i; };

/* for each level: how many words the dictionary has, how many you practiced, how many you master (box 4 or 5) */
function levelStats(){
  const lvOf = new Map(DICT.map(e=>[withoutArticle(e.gr).toLowerCase(), e.lvl]));
  const out = Object.fromEntries(CEFR_LEVELS.map(l=>[l,{total:0, seen:0, mastered:0}]));
  DICT.forEach(e=>{ if(out[e.lvl]) out[e.lvl].total++; });
  Progress.list().forEach(r=>{
    const l = lvOf.get(withoutArticle(String(r.gr||"")).toLowerCase());
    if(l && out[l]){ out[l].seen++; if(r.box>=4) out[l].mastered++; }
  });
  return out;
}
/* the level you are working on: the first one where you master less than 30% of its words */
function currentLevel(){
  const st = levelStats();
  for(const l of CEFR_LEVELS) if(st[l].total && st[l].mastered/st[l].total < 0.3) return l;
  return CEFR_LEVELS[CEFR_LEVELS.length-1];
}
