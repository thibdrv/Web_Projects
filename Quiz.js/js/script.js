/* ============================================================
   Données : textes de l'interface et questions, en EN et FR
   ============================================================ */
const textes = {
  en: {
    titrePage: "Quiz",
    bonnesReponses: "Correct answers",
    progression: "Quiz progress",
    question: "Question",
    valider: "Submit",
    bravo: "Well done!",
    mauvaise: "Wrong answer",
    bonneReponse: "Correct!",
    etaitReponse: "The correct answer was:",
    rapport: "Your result",
    tempsQuiz: "Time",
    rejouer: "Play again",
    messages: {
      parfait: "Perfect score, outstanding!",
      excellent: "Excellent work, almost perfect!",
      bien: "Well done, the Moon is within reach!",
      moyen: "A good start, but you can do better.",
      zero: "Time to review the basics, try again!"
    }
  },
  fr: {
    titrePage: "Quiz",
    bonnesReponses: "Bonnes réponses",
    progression: "Progression du quiz",
    question: "Question",
    valider: "Valider",
    bravo: "Bravo !",
    mauvaise: "Mauvaise réponse",
    bonneReponse: "Bonne réponse !",
    etaitReponse: "La bonne réponse était :",
    rapport: "Ton résultat",
    tempsQuiz: "Temps",
    rejouer: "Rejouer",
    messages: {
      parfait: "Sans faute, remarquable !",
      excellent: "Excellent travail, presque parfait !",
      bien: "Bien joué, la Lune est à portée !",
      moyen: "Un bon début, mais tu peux mieux faire.",
      zero: "Il est temps de réviser les bases, réessaie !"
    }
  }
};

// `reponse` = index de la bonne réponse (identique dans les deux langues)
const questions = [
  {
    reponse: 2,
    fr: {
      question: "En quelle année l’ère de la conquête spatiale a-t-elle commencé ?",
      choix: [1913, 1932, 1957, 1964]
    },
    en: {
      question: "In what year did the space age begin?",
      choix: [1913, 1932, 1957, 1964]
    }
  },
  {
    reponse: 2,
    fr: {
      question: "Jusqu’en 2023, combien de missions réussies ont permis à l’Homme de fouler le sol lunaire ?",
      choix: [1, 3, 6, 8]
    },
    en: {
      question: "Up to 2023, how many successful missions have allowed humans to walk on the Moon?",
      choix: [1, 3, 6, 8]
    }
  },
  {
    reponse: 1,
    fr: {
      question: "Quel est le nom du premier Homme à effectuer un voyage réussi dans l’espace ?",
      choix: ["SoukSakone", "Youri Gagarine", "Buzz Aldrin", "Thomas Pesquet"]
    },
    en: {
      question: "What is the name of the first human to make a successful journey into space?",
      choix: ["SoukSakone", "Yuri Gagarin", "Buzz Aldrin", "Thomas Pesquet"]
    }
  },
  {
    reponse: 2,
    fr: {
      question: "Quel est le nom de la station spatiale de coopération internationale placée en orbite terrestre pour la recherche scientifique depuis 1998 ?",
      choix: ["CSS", "NSA", "ISS", "IRS"]
    },
    en: {
      question: "What is the name of the international cooperation space station in Earth orbit for scientific research since 1998?",
      choix: ["CSS", "NSA", "ISS", "IRS"]
    }
  },
  {
    reponse: 2,
    fr: {
      question: "Quel était le nom de la première mission spatiale qui a posé des humains sur la Lune ?",
      choix: ["Apollo 7", "Apollo 8", "Apollo 11", "Apollo 13"]
    },
    en: {
      question: "What was the name of the first space mission to land humans on the Moon?",
      choix: ["Apollo 7", "Apollo 8", "Apollo 11", "Apollo 13"]
    }
  },
  {
    reponse: 0,
    fr: {
      question: "Quelle planète est surnommée la planète rouge ?",
      choix: ["Mars", "Vénus", "Jupiter", "Mercure"]
    },
    en: {
      question: "Which planet is known as the Red Planet?",
      choix: ["Mars", "Venus", "Jupiter", "Mercury"]
    }
  },
  {
    reponse: 3,
    fr: {
      question: "Qui fut la première femme à voyager dans l’espace, en 1963 ?",
      choix: ["Sally Ride", "Mae Jemison", "Peggy Whitson", "Valentina Terechkova"]
    },
    en: {
      question: "Who was the first woman to travel into space, in 1963?",
      choix: ["Sally Ride", "Mae Jemison", "Peggy Whitson", "Valentina Tereshkova"]
    }
  },
  {
    reponse: 0,
    fr: {
      question: "Comment s’appelait le premier satellite artificiel, lancé en 1957 ?",
      choix: ["Spoutnik 1", "Explorer 1", "Vostok 1", "Telstar 1"]
    },
    en: {
      question: "What was the name of the first artificial satellite, launched in 1957?",
      choix: ["Sputnik 1", "Explorer 1", "Vostok 1", "Telstar 1"]
    }
  },
  {
    reponse: 1,
    fr: {
      question: "Quelle est la plus grande planète du système solaire ?",
      choix: ["Saturne", "Jupiter", "Neptune", "Uranus"]
    },
    en: {
      question: "What is the largest planet in our solar system?",
      choix: ["Saturn", "Jupiter", "Neptune", "Uranus"]
    }
  },
  {
    reponse: 3,
    fr: {
      question: "Quel télescope spatial, lancé en décembre 2021, observe l’univers en infrarouge ?",
      choix: ["Hubble", "Kepler", "Spitzer", "James Webb"]
    },
    en: {
      question: "Which space telescope, launched in December 2021, observes the universe in infrared?",
      choix: ["Hubble", "Kepler", "Spitzer", "James Webb"]
    }
  }
];

/* ============================================================
   État
   ============================================================ */
const DELAI_BONNE_REPONSE = 1600;    // ms avant la question suivante
const DELAI_MAUVAISE_REPONSE = 3000; // plus long : le temps de lire la bonne réponse
const CLE_LANGUE = "quiz-langue";
const LANGUE_PAR_DEFAUT = "en";
const total = questions.length;
const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Renvoie une copie mélangée du tableau (algorithme de Fisher-Yates) ; l'original n'est pas modifié
function melange(tableau) {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

let langue = lireLangue();
let vue = "quiz";           // "quiz" ou "resultat"
let partie = melange(questions); // les questions dans un ordre aléatoire, refait à chaque partie
let indexQuestion = 0;      // question en cours dans `partie`
let choixUtilisateur = null; // index du radio sélectionné (null = rien)
let score = 0;
let verrouille = false;     // true entre la validation et la question suivante
let estJuste = null;        // résultat de la dernière validation

// Durée de la partie, affichée sur l'écran final
let debutPartie = Date.now();
let dureePartie = 0;

/* ============================================================
   Éléments du DOM
   ============================================================ */
const carte = document.getElementById("carte");
const blocQuiz = document.getElementById("quiz");
const blocResultat = document.getElementById("resultat");
const elQuestion = document.getElementById("question");
const elNumero = document.getElementById("numero");
const elChoixGroupe = document.getElementById("choix-groupe");
const elChoix = document.getElementById("choix");
const elFeedback = document.getElementById("feedback");
const elProgression = document.getElementById("progression");
const elBarre = document.getElementById("barre");
const elCompteur = document.getElementById("compteur");
const elNbBonnes = document.getElementById("nb-bonnes");
const elAstronaute = document.getElementById("astronaute");
const elAnneau = document.getElementById("anneau-valeur");
const btnValider = document.getElementById("valider");
const btnRejouer = document.getElementById("rejouer");
const btnsLangue = document.querySelectorAll(".lang");

document.getElementById("nb-total").textContent = `/ ${total}`;
elProgression.setAttribute("aria-valuemax", total);

/* ============================================================
   Langue
   ============================================================ */
function lireLangue() {
  try {
    const enregistree = localStorage.getItem(CLE_LANGUE);
    if (enregistree && textes[enregistree]) return enregistree;
  } catch (e) { /* stockage indisponible : langue par défaut */ }
  return LANGUE_PAR_DEFAUT;
}

function t(cle) {
  return textes[langue][cle];
}

function questionActuelle() {
  return partie[indexQuestion][langue];
}

// Met à jour tous les textes de la page, sans toucher à l'état du quiz
function appliqueLangue() {
  document.documentElement.lang = langue;
  document.title = t("titrePage");

  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });
  btnsLangue.forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === langue));
  });

  if (vue === "quiz") majTextesQuestion();
  else majTextesResultat();

  ajuste();
}

function choisitLangue(nouvelle) {
  if (nouvelle === langue || !textes[nouvelle]) return;
  langue = nouvelle;
  try { localStorage.setItem(CLE_LANGUE, langue); } catch (e) { /* ignoré */ }
  appliqueLangue();
}

btnsLangue.forEach(btn => {
  btn.addEventListener("click", () => choisitLangue(btn.dataset.lang));
});

/* ============================================================
   Taille : tout doit tenir dans l'écran, sans barre de défilement
   ============================================================ */
// Part de la taille de base définie en CSS, puis la réduit tant que la carte déborde.
function ajuste() {
  // Onglet masqué ou pas encore mis en page : on ne mesure rien (le prochain « resize » refera le calcul)
  if (!window.innerWidth || !window.innerHeight) return;

  const racine = document.documentElement;
  racine.style.removeProperty("--base");
  let base = parseFloat(getComputedStyle(racine).fontSize);

  const tient = () => {
    const corps = getComputedStyle(document.body);
    const dispo = window.innerHeight - parseFloat(corps.paddingTop) - parseFloat(corps.paddingBottom);
    // offsetHeight ignore les transformations (animations d'entrée en cours)
    // +1 : sur mobile la carte vaut exactement la hauteur de l'écran (min-height: 100dvh)
    return carte.offsetHeight <= dispo + 1;
  };

  while (!tient() && base > 8) {
    base -= 0.5;
    racine.style.setProperty("--base", `${base}px`);
  }
}

// ajuste() repart toujours de la taille de base : on peut donc le rappeler à tout moment
let rafAjuste = null;
function planifieAjuste() {
  cancelAnimationFrame(rafAjuste);
  rafAjuste = requestAnimationFrame(ajuste);
}
window.addEventListener("resize", planifieAjuste);
window.addEventListener("orientationchange", planifieAjuste);
window.addEventListener("load", planifieAjuste); // images chargées : dimensions définitives

/* ============================================================
   Quiz
   ============================================================ */
function majProgression(valeur) {
  elBarre.style.width = `${(valeur / total) * 100}%`;
  elProgression.setAttribute("aria-valuenow", valeur);
}

// Relance une animation CSS sur un élément déjà dans le DOM
function rejoueAnimation(el, classe) {
  el.classList.remove(classe);
  void el.offsetWidth; // force le recalcul pour que l'animation reparte
  el.classList.add(classe);
}

// Message sous le bouton : type = "ok", "ko" ou null pour vider (la couleur et l'icône sont gérées par le CSS)
function ecritFeedback(type, texte = "") {
  elFeedback.textContent = texte;
  if (type) elFeedback.dataset.etat = type;
  else delete elFeedback.dataset.etat;
}

// Remplit (ou retraduit) tous les textes liés à la question en cours
function majTextesQuestion() {
  const q = questionActuelle();
  elQuestion.textContent = q.question;
  elNumero.textContent = `${t("question")} ${indexQuestion + 1} / ${total}`;

  elChoix.querySelectorAll("label").forEach((label, i) => {
    label.textContent = q.choix[i];
  });

  if (!verrouille) {
    btnValider.textContent = t("valider");
    ecritFeedback(null);
  } else if (estJuste) {
    btnValider.textContent = t("bravo");
    ecritFeedback("ok", t("bonneReponse"));
  } else {
    btnValider.textContent = t("mauvaise");
    ecritFeedback("ko", `${t("etaitReponse")} ${q.choix[partie[indexQuestion].reponse]}`);
  }
}

function afficheQuestion() {
  const q = questionActuelle();
  majProgression(indexQuestion);

  choixUtilisateur = null;
  verrouille = false;
  estJuste = null;
  btnValider.disabled = true;
  btnValider.classList.remove("juste", "faux");

  elChoix.innerHTML = ""; // liste vide à chaque nouvelle question
  q.choix.forEach((_, index) => {
    const li = document.createElement("li");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "choix";
    input.value = index;
    input.id = `choix-${index}`;

    input.addEventListener("change", () => {
      if (verrouille) return; // choix figé une fois validé
      choixUtilisateur = index;
      btnValider.disabled = false;
    });

    const label = document.createElement("label");
    label.setAttribute("for", `choix-${index}`);
    label.dataset.lettre = String.fromCharCode(65 + index); // A, B, C, D (affiché par le CSS)

    li.appendChild(input);
    li.appendChild(label);
    elChoix.appendChild(li);
  });

  majTextesQuestion();
  rejoueAnimation(elQuestion, "entree");
  rejoueAnimation(elChoixGroupe, "entree");
  ajuste();
}

btnValider.addEventListener("click", () => {
  if (verrouille || choixUtilisateur === null) return;
  verrouille = true;
  btnValider.disabled = true;
  elChoix.querySelectorAll("input").forEach(input => { input.disabled = true; });

  const bonne = partie[indexQuestion].reponse;
  estJuste = choixUtilisateur === bonne;

  // Révèle la bonne réponse (et l'erreur éventuelle) directement sur la liste
  elChoix.querySelectorAll("label").forEach((label, i) => {
    if (i === bonne) label.classList.add("correct");
    else if (i === choixUtilisateur) label.classList.add("incorrect");
    else label.classList.add("estompe");
  });
  majProgression(indexQuestion + 1);

  if (estJuste) {
    score++;
    elNbBonnes.textContent = score;
    rejoueAnimation(elCompteur, "bump");
    btnValider.classList.add("juste");
  } else {
    btnValider.classList.add("faux");
  }
  majTextesQuestion();
  ajuste();

  setTimeout(() => {
    indexQuestion++;
    if (indexQuestion < total) {
      afficheQuestion();
    } else {
      afficheScore();
    }
  }, estJuste ? DELAI_BONNE_REPONSE : DELAI_MAUVAISE_REPONSE);
});

/* ============================================================
   Écran final
   ============================================================ */
// Fait défiler un nombre de 0 à `cible`
function animeNombre(el, cible, duree = 900) {
  if (reduit || cible === 0) { el.textContent = cible; return; }
  const debut = performance.now();
  function pas(maintenant) {
    const progres = Math.min((maintenant - debut) / duree, 1);
    el.textContent = Math.round(cible * (1 - Math.pow(1 - progres, 3)));
    if (progres < 1) requestAnimationFrame(pas);
  }
  requestAnimationFrame(pas);
}

function formatDuree(ms) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// Message et durée (retraduits au changement de langue)
function majTextesResultat() {
  const ratio = score / total;
  const m = t("messages");
  let message;
  if (ratio === 1) message = m.parfait;
  else if (ratio >= 0.8) message = m.excellent;
  else if (ratio >= 0.6) message = m.bien;
  else if (ratio > 0) message = m.moyen;
  else message = m.zero;
  document.getElementById("message").textContent = message;
  document.getElementById("temps").textContent = `${t("tempsQuiz")} : ${formatDuree(dureePartie)}`;
}

function afficheScore() {
  vue = "resultat";
  dureePartie = Date.now() - debutPartie;
  majProgression(total);
  blocQuiz.hidden = true;

  const elScore = document.getElementById("score-grand");
  elScore.innerHTML = `<span id="score-valeur">0</span><small>/ ${total}</small>`;
  animeNombre(document.getElementById("score-valeur"), score);

  majTextesResultat();
  blocResultat.hidden = false;
  ajuste();

  // L'anneau se remplit selon le pourcentage de bonnes réponses (0 = vide, 100 = plein)
  elAnneau.style.strokeDashoffset = 100;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    elAnneau.style.strokeDashoffset = 100 - (score / total) * 100;
  }));

  // L'astronaute fait un tour complet sur lui-même pour fêter la fin du quiz
  if (!reduit) rejoueAnimation(elAstronaute, "celebre");
}

btnRejouer.addEventListener("click", () => {
  vue = "quiz";
  partie = melange(questions); // nouvel ordre pour la nouvelle partie
  indexQuestion = 0;
  score = 0;
  debutPartie = Date.now();
  elNbBonnes.textContent = 0;
  elAstronaute.classList.remove("celebre");
  blocResultat.hidden = true;
  blocQuiz.hidden = false;
  afficheQuestion();
});

/* ============================================================
   Démarrage
   ============================================================ */
appliqueLangue(); // textes statiques + sélecteur de langue
afficheQuestion();
