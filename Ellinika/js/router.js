/* ---------- menu and navigation ----------
   The address ends with #letters, #colors, #grammar, #numbers, #family, #animals, #food, #body, #time, #house, #clothes, #cooking, #city, #directions, #nature, #jobs, #opposites, #phrases, #dialogues, #stories, #poems, #texts, #cypriot, #families, #about, #settings, #favorites, #difficulties, #talk, #challenge, #progress, #dictionary or #leveltest (nothing = the menu),
   so the browser's Back button works and a refresh stays where you were. */
const VIEW_TITLES = {home:"Elliniká", letters:"Greek letters", colors:"Colors · Χρώματα", grammar:"Grammar · Γραμματική", numbers:"Numbers · Αριθμοί", family:"Family · Οικογένεια", animals:"Animals · Ζώα", food:"Food & drinks · Φαγητό", body:"Human body · Σώμα", time:"Time & dates · Χρόνος", phrases:"Phrases · Φράσεις", dialogues:"Dialogues · Διάλογοι", stories:"Stories · Ιστορίες", poems:"Poems & proverbs · Ποιήματα", texts:"Texts · Κείμενα", cypriot:"Cypriot Greek · Κυπριακά", families:"Word families · Οικογένειες λέξεων", favorites:"My words · Αγαπημένα", difficulties:"My difficulties · Δυσκολίες", about:"About · Σχετικά", settings:"Settings · Ρυθμίσεις", stats:"Statistics · Στατιστικά", news:"What's new · Τι νέα", talk:"Conversation · Συζήτηση", challenge:"1-minute challenge · Πρόκληση", house:"House & clothes · Σπίτι", cooking:"Cooking · Μαγειρική", customs:"Customs & politeness · Έθιμα", wordgames:"Word games · Παιχνίδια λέξεων", clothes:"Clothes · Ρούχα", city:"City & travel · Πόλη", directions:"Directions · Κατευθύνσεις", nature:"Weather & nature · Φύση", jobs:"Jobs & hobbies · Δουλειές", opposites:"Opposites · Αντίθετα", progress:"Review & progress · Πρόοδος", dictionary:"Dictionary · Λεξικό", leveltest:"Level test · Τεστ επιπέδου"};
let currentView = "home", letterTab = "practice";

function updateStats(){
  $("stats").hidden = currentView!=="letters";
  $("stats").style.visibility = letterTab==="practice" ? "visible" : "hidden";
}
/* "Colors · Χρώματα": the English part is translated, the Greek part stays */
function viewTitle(name){
  const [en,gr] = VIEW_TITLES[name].split(" · ");
  return gr ? tx(en)+" · "+gr : tx(en);
}
/* the ⚙️ button lives in the hero of the home page, and in the top bar of every other page */
/* on a computer (from 761 px) the account and settings buttons sit at the right of the top bar (#tbRight); on a phone (up to 760 px) the menu bar is at the very top of the screen and the account button and the settings button sit in it, before Home, Learn, Practice... (css/homenew.css, section 11) */
const PHONE_BAR = window.matchMedia("(max-width:760px)");
function dockSettings(name){
  const phone = PHONE_BAR.matches, s = $("settings"), want = phone ? $("bnav") : $("tbRight");
  if(s.parentElement!==want){ if(phone) want.prepend(s); else want.appendChild(s); }
  s.classList.remove("in-bar");
  s.classList.toggle("open", name==="settings"); $("setBtn").setAttribute("aria-expanded", name==="settings");
  if(name!=="settings") viewBeforeSettings = name;
}
PHONE_BAR.addEventListener("change", () => dockSettings(currentView));      /* the screen is turned or resized across 760 px: the buttons move to the right place */
/* a banner at the top of every learning page: the drawing of its tile on the home page, its name and its line, in the colour of the category (css/pages.css) */
function renderPageHero(name){
  document.querySelectorAll(".pagehero").forEach(h=>h.remove());
  if(typeof NAV_LEARN==="undefined" || !NAV_LEARN.includes(name)) return;
  const tile = document.querySelector(`.home .grid:not(.g-recent) .cat[data-go="${name}"]`), view = document.querySelector(`main [data-view="${name}"]`);
  if(!tile || !view) return;
  const ico = (tile.querySelector(".ico") || {}).innerHTML || "", desc = (tile.querySelector(".txt span") || {}).textContent || "";
  const h = document.createElement("div"); h.className = "pagehero";
  h.innerHTML = `<span class="ph-deco" aria-hidden="true">${ico}</span><span class="ph-badge" aria-hidden="true">${ico}</span>
    <span class="ph-t"><b>${esc((tile.querySelector(".txt b") || tile).textContent.trim())}</b><span>${esc(desc)}</span></span>`;
  view.prepend(h);
}
function showView(name){
  if(!VIEW_TITLES[name]) name="home";
  currentView=name; document.body.dataset.view=name; if(typeof updateOnCat==="function") updateOnCat();
  document.querySelectorAll("main [data-view]").forEach(v=>v.hidden=v.dataset.view!==name);
  $("title").textContent=viewTitle(name);
  $("back").hidden=name==="home";
  document.title = name==="home" ? "Elliniká" : viewTitle(name).split(" · ")[0]+" · Elliniká";
  if(typeof stopChallenge==="function") stopChallenge();
  if(typeof stopStory==="function") stopStory();
  if(typeof stopTalk==="function") stopTalk();
  if(typeof stopPoem==="function") stopPoem();
  if(typeof stopText==="function") stopText();
  updateStats(); stopSound(); window.scrollTo(0,0);
  dockSettings(name);
  renderPageHero(name);
  rememberView(name);
  if(name==="home"){ renderHomeLevel(); renderHomeProgress(); renderHomeToday(); renderHomeRecent(); renderFest(); }
  navUpdate(name);
  if(name==="progress") openProgress();
  if(name==="colors") openColors();
  if(name==="grammar") openGrammar();
  if(name==="numbers") openNumbers();
  if(name==="family") openFamily();
  if(name==="food") openFood();
  if(name==="body") openBody();
  if(name==="time") openTime();
  if(name==="house") openHouse();
  if(name==="clothes") openClothes();
  if(name==="cooking") openCooking();
  if(name==="customs") openCustoms();
  if(name==="wordgames") openWordGames();
  if(name==="city") openCity();
  if(name==="directions") openDirections();
  if(name==="nature") openNature();
  if(name==="jobs") openJobs();
  if(name==="opposites") openOpposites();
  if(name==="letters" && letterTab==="hand") openHand();
  if(name==="dialogues") openDialogues();
  if(name==="stories") openStories();
  if(name==="poems") openPoems();
  if(name==="texts") openTexts();
  if(name==="cypriot") openCypriot();
  if(name==="families") openFamilies();
  if(name==="animals") openAnimals();
  if(name==="settings") openSettings();
  if(name==="news") openNews();
  if(name==="stats") openStats();
  if(name==="favorites") openFavorites();
  if(name==="difficulties") openDifficulties();
  if(name==="about") openAbout();
  if(name==="talk") openTalk();
  if(name==="challenge") openChallenge();
  if(name==="phrases") openPhrases();
  if(name==="dictionary") openDictionary();
  if(name==="leveltest") openLevelTest();
}
/* the pill on the menu shows your last level-test result */
function renderHomeLevel(){
  const last = lastTest();
  $("levelPill").textContent = last ? tx("Your level: {n}", {n:TEST_LEVELS[last.level].cefr}) + " · " + tx(TEST_LEVELS[last.level].name) : tx("Find your level");
}
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{ location.hash=b.dataset.go; });
$("back").onclick=()=>{ location.hash="home"; };
/* the top bar gets its frosted background only once the page is scrolled */
window.addEventListener("scroll",()=>document.body.classList.toggle("scrolled",window.scrollY>6),{passive:true});
window.addEventListener("hashchange",()=>showView(location.hash.slice(1)));
