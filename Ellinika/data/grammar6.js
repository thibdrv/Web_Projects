// Short written grammar lessons (js/grammar6.js): the future with θα, να + verb, the small pronouns, comparing, numbers that agree, the three families of verbs,
// asking politely, "there is". Made by gen_grammar6.py. Edit freely.
//  - "points" are the explanation, "examples" the tappable sentences ("say" gets a recording), "drill" the missing-word game ("blank" has ___ where "answer" goes).
//  - "tables" (optional) lists conjugated forms: every text of "forms" gets a recording.
//  - Written by Claude from general knowledge of Greek, not reviewed by a native speaker.
const GRAMMAR6 = {
 "lessons": [
  {
   "id": "future",
   "title": {
    "en": "The future with θα",
    "fr": "Le futur avec θα"
   },
   "intro": {
    "en": "Put θα in front of the verb and you speak about tomorrow.",
    "fr": "Mets θα devant le verbe et tu parles de demain."
   },
   "points": [
    {
     "en": "θα + the verb: θα πάω = I will go. Only θα is new: the verb changes as usual (θα πας, θα πάει...).",
     "fr": "θα + le verbe : θα πάω = j'irai. Seul θα est nouveau : le verbe se conjugue comme d'habitude (θα πας, θα πάει...)."
    },
    {
     "en": "After θα the verb has its short form (for one action: θα φάω = I will eat) or its present form (for a habit: θα τρώω = I will be eating, I will eat often).",
     "fr": "Après θα le verbe prend sa forme courte (pour une action : θα φάω = je mangerai) ou sa forme du présent (pour une habitude : θα τρώω = je mangerai souvent)."
    },
    {
     "en": "Negative: δεν θα + verb. Δεν θα φύγω = I will not leave.",
     "fr": "Négation : δεν θα + verbe. Δεν θα φύγω = je ne partirai pas."
    },
    {
     "en": "Words that help: αύριο (tomorrow), σύντομα (soon), του χρόνου (next year), απόψε (tonight).",
     "fr": "Des mots utiles : αύριο (demain), σύντομα (bientôt), του χρόνου (l'an prochain), απόψε (ce soir)."
    }
   ],
   "examples": [
    {
     "say": "Αύριο θα πάω στη θάλασσα.",
     "en": "Tomorrow I will go to the sea.",
     "fr": "Demain j'irai à la mer."
    },
    {
     "say": "Θα φάμε στις οκτώ.",
     "en": "We will eat at eight.",
     "fr": "Nous mangerons à huit heures."
    },
    {
     "say": "Θα σου τηλεφωνήσω το βράδυ.",
     "en": "I will phone you in the evening.",
     "fr": "Je t'appellerai le soir."
    },
    {
     "say": "Θα έρθεις στο πάρτι;",
     "en": "Will you come to the party?",
     "fr": "Viendras-tu à la fête ?"
    },
    {
     "say": "Δεν θα φύγω νωρίς.",
     "en": "I will not leave early.",
     "fr": "Je ne partirai pas tôt."
    }
   ],
   "drill": [
    {
     "say": "Αύριο θα έρθω.",
     "blank": "Αύριο ___ έρθω.",
     "answer": "θα",
     "en": "Tomorrow I will come.",
     "fr": "Demain je viendrai."
    },
    {
     "say": "Απόψε θα μείνω σπίτι.",
     "blank": "Απόψε ___ μείνω σπίτι.",
     "answer": "θα",
     "en": "Tonight I will stay at home.",
     "fr": "Ce soir je resterai à la maison."
    },
    {
     "say": "Δεν θα φύγω νωρίς.",
     "blank": "Δεν ___ φύγω νωρίς.",
     "answer": "θα",
     "en": "I will not leave early.",
     "fr": "Je ne partirai pas tôt."
    },
    {
     "say": "Του χρόνου θα πάμε στην Κύπρο.",
     "blank": "Του χρόνου ___ πάμε στην Κύπρο.",
     "answer": "θα",
     "en": "Next year we will go to Cyprus.",
     "fr": "L'an prochain nous irons à Chypre."
    }
   ],
   "bad": [
    "να",
    "δεν",
    "μην",
    "για",
    "αν",
    "και"
   ]
  },
  {
   "id": "subjunctive",
   "title": {
    "en": "να + verb",
    "fr": "να + verbe"
   },
   "intro": {
    "en": "Greek has no infinitive: after “want”, “can”, “must” it uses να + a verb.",
    "fr": "Le grec n'a pas d'infinitif : après « vouloir », « pouvoir », « devoir » il utilise να + un verbe."
   },
   "points": [
    {
     "en": "Θέλω να φύγω = I want to leave (literally “I want that I leave”). The verb after να is conjugated: θέλεις να φύγεις, θέλει να φύγει...",
     "fr": "Θέλω να φύγω = je veux partir (littéralement « je veux que je parte »). Le verbe après να se conjugue : θέλεις να φύγεις, θέλει να φύγει..."
    },
    {
     "en": "Verbs that take να: θέλω (want), μπορώ (can), πρέπει (must), ξέρω (know how to), αρχίζω (begin), προσπαθώ (try).",
     "fr": "Verbes suivis de να : θέλω (vouloir), μπορώ (pouvoir), πρέπει (devoir), ξέρω (savoir faire), αρχίζω (commencer), προσπαθώ (essayer)."
    },
    {
     "en": "για να = in order to: Πάω στην αγορά για να αγοράσω ψωμί.",
     "fr": "για να = pour (afin de) : Πάω στην αγορά για να αγοράσω ψωμί."
    },
    {
     "en": "Do not mix up θα (future) and να (wish, ability, duty): Θα έρθω = I will come. Θέλω να έρθω = I want to come.",
     "fr": "Ne mélange pas θα (futur) et να (souhait, capacité, devoir) : Θα έρθω = je viendrai. Θέλω να έρθω = je veux venir."
    }
   ],
   "examples": [
    {
     "say": "Θέλω να μάθω ελληνικά.",
     "en": "I want to learn Greek.",
     "fr": "Je veux apprendre le grec."
    },
    {
     "say": "Μπορείς να με βοηθήσεις;",
     "en": "Can you help me?",
     "fr": "Peux-tu m'aider ?"
    },
    {
     "say": "Πρέπει να φύγω τώρα.",
     "en": "I must leave now.",
     "fr": "Je dois partir maintenant."
    },
    {
     "say": "Ξέρεις να κολυμπάς;",
     "en": "Do you know how to swim?",
     "fr": "Sais-tu nager ?"
    },
    {
     "say": "Πάω στην αγορά για να αγοράσω ψωμί.",
     "en": "I go to the market to buy bread.",
     "fr": "Je vais au marché pour acheter du pain."
    }
   ],
   "drill": [
    {
     "say": "Θέλω να μάθω ελληνικά.",
     "blank": "Θέλω ___ μάθω ελληνικά.",
     "answer": "να",
     "en": "I want to learn Greek.",
     "fr": "Je veux apprendre le grec."
    },
    {
     "say": "Πρέπει να φύγω τώρα.",
     "blank": "Πρέπει ___ φύγω τώρα.",
     "answer": "να",
     "en": "I must leave now.",
     "fr": "Je dois partir maintenant."
    },
    {
     "say": "Μπορώ να έρθω αύριο.",
     "blank": "Μπορώ ___ έρθω αύριο.",
     "answer": "να",
     "en": "I can come tomorrow.",
     "fr": "Je peux venir demain."
    },
    {
     "say": "Πάω στο φούρνο για να αγοράσω ψωμί.",
     "blank": "Πάω στο φούρνο για ___ αγοράσω ψωμί.",
     "answer": "να",
     "en": "I go to the bakery to buy bread.",
     "fr": "Je vais à la boulangerie pour acheter du pain."
    }
   ],
   "bad": [
    "θα",
    "δεν",
    "μην",
    "για",
    "αν",
    "και"
   ]
  },
  {
   "id": "pronouns",
   "title": {
    "en": "Me, you, him, her... (small pronouns)",
    "fr": "Me, te, le, la... (petits pronoms)"
   },
   "intro": {
    "en": "The small pronouns go in front of the verb: Τον βλέπω = I see him.",
    "fr": "Les petits pronoms se placent devant le verbe : Τον βλέπω = je le vois."
   },
   "points": [
    {
     "en": "Direct object (I see him): με, σε, τον, την, το, μας, σας, τους, τις, τα.",
     "fr": "Complément direct (je le vois) : με, σε, τον, την, το, μας, σας, τους, τις, τα."
    },
    {
     "en": "Indirect object (I give to him): μου, σου, του, της, του, μας, σας, τους. Μου δίνει ένα βιβλίο = he gives me a book.",
     "fr": "Complément indirect (je lui donne) : μου, σου, του, της, του, μας, σας, τους. Μου δίνει ένα βιβλίο = il me donne un livre."
    },
    {
     "en": "In the negative, δεν comes first: Δεν τον ξέρω = I do not know him.",
     "fr": "À la négation, δεν vient en premier : Δεν τον ξέρω = je ne le connais pas."
    },
    {
     "en": "With an order (imperative) the pronoun goes after: Δώσε μου το βιβλίο! = Give me the book!",
     "fr": "Avec un ordre (impératif) le pronom se place après : Δώσε μου το βιβλίο ! = donne-moi le livre !"
    }
   ],
   "examples": [
    {
     "say": "Τον βλέπω κάθε μέρα.",
     "en": "I see him every day.",
     "fr": "Je le vois tous les jours."
    },
    {
     "say": "Την ξέρω καλά.",
     "en": "I know her well.",
     "fr": "Je la connais bien."
    },
    {
     "say": "Μας καλεί στο σπίτι του.",
     "en": "He invites us to his house.",
     "fr": "Il nous invite chez lui."
    },
    {
     "say": "Σου γράφω αύριο.",
     "en": "I will write to you tomorrow.",
     "fr": "Je t'écris demain."
    },
    {
     "say": "Δεν τον ξέρω.",
     "en": "I do not know him.",
     "fr": "Je ne le connais pas."
    }
   ],
   "drill": [
    {
     "say": "Τον βλέπω κάθε μέρα.",
     "blank": "___ βλέπω κάθε μέρα.",
     "answer": "Τον",
     "en": "I see him every day.",
     "fr": "Je le vois tous les jours."
    },
    {
     "say": "Την ξέρω καλά.",
     "blank": "___ ξέρω καλά.",
     "answer": "Την",
     "en": "I know her well.",
     "fr": "Je la connais bien."
    },
    {
     "say": "Με βλέπεις;",
     "blank": "___ βλέπεις;",
     "answer": "Με",
     "en": "Do you see me?",
     "fr": "Est-ce que tu me vois ?"
    },
    {
     "say": "Μας καλεί στο σπίτι του.",
     "blank": "___ καλεί στο σπίτι του.",
     "answer": "Μας",
     "en": "He invites us to his house.",
     "fr": "Il nous invite chez lui."
    },
    {
     "say": "Τους ακούω από εδώ.",
     "blank": "___ ακούω από εδώ.",
     "answer": "Τους",
     "en": "I hear them from here.",
     "fr": "Je les entends d'ici."
    }
   ],
   "bad": [
    "Σε",
    "Την",
    "Το",
    "Σας",
    "Τις",
    "Τα"
   ]
  },
  {
   "id": "compare",
   "title": {
    "en": "Comparing: more, the most",
    "fr": "Comparer : plus, le plus"
   },
   "intro": {
    "en": "To say “more”, put πιο in front of the adjective: πιο μεγάλος = bigger.",
    "fr": "Pour dire « plus », mets πιο devant l'adjectif : πιο μεγάλος = plus grand."
   },
   "points": [
    {
     "en": "πιο + adjective = more: πιο ζεστός (hotter). Than = από: πιο ζεστός από χθες.",
     "fr": "πιο + adjectif = plus : πιο ζεστός (plus chaud). Que = από : πιο ζεστός από χθες."
    },
    {
     "en": "The most: add the article: ο πιο ψηλός (the tallest), η πιο όμορφη (the most beautiful).",
     "fr": "Le plus : ajoute l'article : ο πιο ψηλός (le plus grand), η πιο όμορφη (la plus belle)."
    },
    {
     "en": "Some words are special: καλός → καλύτερος (better), κακός → χειρότερος (worse), πολύ → περισσότερο (more), λίγο → λιγότερο (less).",
     "fr": "Quelques mots sont spéciaux : καλός → καλύτερος (meilleur), κακός → χειρότερος (pire), πολύ → περισσότερο (plus), λίγο → λιγότερο (moins)."
    },
    {
     "en": "The comparative agrees with the noun like any adjective: καλύτερος (m), καλύτερη (f), καλύτερο (n).",
     "fr": "Le comparatif s'accorde avec le nom comme tout adjectif : καλύτερος (m), καλύτερη (f), καλύτερο (n)."
    }
   ],
   "examples": [
    {
     "say": "Η Αθήνα είναι πιο μεγάλη από τη Θεσσαλονίκη.",
     "en": "Athens is bigger than Thessaloniki.",
     "fr": "Athènes est plus grande que Thessalonique."
    },
    {
     "say": "Σήμερα κάνει πιο κρύο από χθες.",
     "en": "Today it is colder than yesterday.",
     "fr": "Aujourd'hui il fait plus froid qu'hier."
    },
    {
     "say": "Είναι ο καλύτερος φίλος μου.",
     "en": "He is my best friend.",
     "fr": "C'est mon meilleur ami."
    },
    {
     "say": "Αυτό το σπίτι είναι πιο ακριβό.",
     "en": "This house is more expensive.",
     "fr": "Cette maison est plus chère."
    },
    {
     "say": "Η Μαρία τρέχει πιο γρήγορα από μένα.",
     "en": "Maria runs faster than me.",
     "fr": "Maria court plus vite que moi."
    }
   ],
   "drill": [
    {
     "say": "Η θάλασσα είναι πιο ζεστή σήμερα.",
     "blank": "Η θάλασσα είναι ___ ζεστή σήμερα.",
     "answer": "πιο",
     "en": "The sea is warmer today.",
     "fr": "La mer est plus chaude aujourd'hui."
    },
    {
     "say": "Ο Πέτρος είναι πιο ψηλός από τον Νίκο.",
     "blank": "Ο Πέτρος είναι πιο ψηλός ___ τον Νίκο.",
     "answer": "από",
     "en": "Peter is taller than Nick.",
     "fr": "Pierre est plus grand que Nicolas."
    },
    {
     "say": "Είναι ο καλύτερος φίλος μου.",
     "blank": "Είναι ο ___ φίλος μου.",
     "answer": "καλύτερος",
     "en": "He is my best friend.",
     "fr": "C'est mon meilleur ami."
    },
    {
     "say": "Αυτό το φαγητό είναι καλύτερο.",
     "blank": "Αυτό το φαγητό είναι ___.",
     "answer": "καλύτερο",
     "en": "This food is better.",
     "fr": "Ce plat est meilleur."
    }
   ],
   "bad": [
    "πιο",
    "από",
    "και",
    "καλός",
    "χειρότερο",
    "περισσότερο"
   ]
  },
  {
   "id": "numbers",
   "title": {
    "en": "Numbers that agree",
    "fr": "Les nombres qui s'accordent"
   },
   "intro": {
    "en": "Only 1, 3 and 4 change with the gender. 2 and the others do not.",
    "fr": "Seuls 1, 3 et 4 changent avec le genre. 2 et les autres ne changent pas."
   },
   "points": [
    {
     "en": "1: ένας (masculine), μία (feminine), ένα (neuter). Accusative masculine: έναν. Έχω έναν αδερφό και μία αδερφή.",
     "fr": "1 : ένας (masculin), μία (féminin), ένα (neutre). Accusatif masculin : έναν. Έχω έναν αδερφό και μία αδερφή."
    },
    {
     "en": "3: τρεις (masculine and feminine), τρία (neuter). Τρεις φίλοι, τρεις φίλες, τρία παιδιά.",
     "fr": "3 : τρεις (masculin et féminin), τρία (neutre). Τρεις φίλοι, τρεις φίλες, τρία παιδιά."
    },
    {
     "en": "4: τέσσερις (masculine and feminine), τέσσερα (neuter).",
     "fr": "4 : τέσσερις (masculin et féminin), τέσσερα (neutre)."
    },
    {
     "en": "2 is always δύο, and 5, 6, 7... never change: δύο καφέδες, πέντε λεπτά.",
     "fr": "2 est toujours δύο, et 5, 6, 7... ne changent jamais : δύο καφέδες, πέντε λεπτά."
    }
   ],
   "examples": [
    {
     "say": "Έχω έναν αδερφό και μία αδερφή.",
     "en": "I have one brother and one sister.",
     "fr": "J'ai un frère et une sœur."
    },
    {
     "say": "Θέλω τρία αυγά.",
     "en": "I want three eggs.",
     "fr": "Je veux trois œufs."
    },
    {
     "say": "Τρεις φίλοι ήρθαν.",
     "en": "Three friends came.",
     "fr": "Trois amis sont venus."
    },
    {
     "say": "Έχουμε τέσσερα παιδιά.",
     "en": "We have four children.",
     "fr": "Nous avons quatre enfants."
    },
    {
     "say": "Δύο καφέδες, παρακαλώ.",
     "en": "Two coffees, please.",
     "fr": "Deux cafés, s'il vous plaît."
    }
   ],
   "drill": [
    {
     "say": "Έχω μία αδερφή.",
     "blank": "Έχω ___ αδερφή.",
     "answer": "μία",
     "en": "I have one sister.",
     "fr": "J'ai une sœur."
    },
    {
     "say": "Θέλω έναν καφέ.",
     "blank": "Θέλω ___ καφέ.",
     "answer": "έναν",
     "en": "I want one coffee.",
     "fr": "Je veux un café."
    },
    {
     "say": "Βλέπω τρία παιδιά.",
     "blank": "Βλέπω ___ παιδιά.",
     "answer": "τρία",
     "en": "I see three children.",
     "fr": "Je vois trois enfants."
    },
    {
     "say": "Τρεις φίλοι ήρθαν.",
     "blank": "___ φίλοι ήρθαν.",
     "answer": "Τρεις",
     "en": "Three friends came.",
     "fr": "Trois amis sont venus."
    },
    {
     "say": "Έχουμε τέσσερα παιδιά.",
     "blank": "Έχουμε ___ παιδιά.",
     "answer": "τέσσερα",
     "en": "We have four children.",
     "fr": "Nous avons quatre enfants."
    }
   ],
   "bad": [
    "ένας",
    "ένα",
    "τρεις",
    "τέσσερις",
    "δύο",
    "πέντε"
   ]
  },
  {
   "id": "present",
   "title": {
    "en": "The three families of verbs",
    "fr": "Les trois familles de verbes"
   },
   "intro": {
    "en": "In the present, Greek verbs follow three patterns.",
    "fr": "Au présent, les verbes grecs suivent trois modèles."
   },
   "points": [
    {
     "en": "1. Verbs in -ω: γράφω, γράφεις, γράφει, γράφουμε, γράφετε, γράφουν.",
     "fr": "1. Les verbes en -ω : γράφω, γράφεις, γράφει, γράφουμε, γράφετε, γράφουν."
    },
    {
     "en": "2. Verbs in -άω / -ώ: αγαπάω, αγαπάς, αγαπάει, αγαπάμε, αγαπάτε, αγαπάνε.",
     "fr": "2. Les verbes en -άω / -ώ : αγαπάω, αγαπάς, αγαπάει, αγαπάμε, αγαπάτε, αγαπάνε."
    },
    {
     "en": "3. Verbs in -ομαι / -αμαι (the “passive” ones, they often mean “I do it to myself”): κοιμάμαι, κοιμάσαι, κοιμάται, κοιμόμαστε, κοιμάστε, κοιμούνται.",
     "fr": "3. Les verbes en -ομαι / -αμαι (les « passifs », ils veulent souvent dire « je le fais à moi-même ») : κοιμάμαι, κοιμάσαι, κοιμάται, κοιμόμαστε, κοιμάστε, κοιμούνται."
    },
    {
     "en": "The pronoun (εγώ, εσύ...) is usually not said: the ending tells who does it.",
     "fr": "Le pronom (εγώ, εσύ...) ne se dit généralement pas : la terminaison dit qui fait l'action."
    }
   ],
   "examples": [
    {
     "say": "Εγώ γράφω ένα γράμμα.",
     "en": "I write a letter.",
     "fr": "J'écris une lettre."
    },
    {
     "say": "Εσύ αγαπάς τη μουσική.",
     "en": "You love music.",
     "fr": "Tu aimes la musique."
    },
    {
     "say": "Το παιδί κοιμάται.",
     "en": "The child is sleeping.",
     "fr": "L'enfant dort."
    },
    {
     "say": "Εμείς πίνουμε καφέ.",
     "en": "We drink coffee.",
     "fr": "Nous buvons du café."
    },
    {
     "say": "Αυτοί μιλάνε ελληνικά.",
     "en": "They speak Greek.",
     "fr": "Ils parlent grec."
    }
   ],
   "drill": [
    {
     "say": "Εγώ γράφω ένα γράμμα.",
     "blank": "Εγώ ___ ένα γράμμα.",
     "answer": "γράφω",
     "en": "I write a letter.",
     "fr": "J'écris une lettre."
    },
    {
     "say": "Εσύ αγαπάς τη μουσική.",
     "blank": "Εσύ ___ τη μουσική.",
     "answer": "αγαπάς",
     "en": "You love music.",
     "fr": "Tu aimes la musique."
    },
    {
     "say": "Το παιδί κοιμάται.",
     "blank": "Το παιδί ___.",
     "answer": "κοιμάται",
     "en": "The child is sleeping.",
     "fr": "L'enfant dort."
    },
    {
     "say": "Εμείς πίνουμε καφέ.",
     "blank": "Εμείς ___ καφέ.",
     "answer": "πίνουμε",
     "en": "We drink coffee.",
     "fr": "Nous buvons du café."
    }
   ],
   "tables": [
    {
     "title": {
      "en": "Verbs in -ω",
      "fr": "Verbes en -ω"
     },
     "forms": [
      "γράφω",
      "γράφεις",
      "γράφει",
      "γράφουμε",
      "γράφετε",
      "γράφουν"
     ]
    },
    {
     "title": {
      "en": "Verbs in -άω",
      "fr": "Verbes en -άω"
     },
     "forms": [
      "αγαπάω",
      "αγαπάς",
      "αγαπάει",
      "αγαπάμε",
      "αγαπάτε",
      "αγαπάνε"
     ]
    },
    {
     "title": {
      "en": "Verbs in -αμαι",
      "fr": "Verbes en -αμαι"
     },
     "forms": [
      "κοιμάμαι",
      "κοιμάσαι",
      "κοιμάται",
      "κοιμόμαστε",
      "κοιμάστε",
      "κοιμούνται"
     ]
    }
   ],
   "bad": [
    "γράφει",
    "αγαπάω",
    "κοιμάσαι",
    "πίνεις",
    "γράφουν",
    "κοιμούνται"
   ]
  },
  {
   "id": "polite",
   "title": {
    "en": "Asking politely",
    "fr": "Demander poliment"
   },
   "intro": {
    "en": "A few sentences that open every door.",
    "fr": "Quelques phrases qui ouvrent toutes les portes."
   },
   "points": [
    {
     "en": "Θα ήθελα... = I would like... Θα ήθελα έναν καφέ, παρακαλώ.",
     "fr": "Θα ήθελα... = je voudrais... Θα ήθελα έναν καφέ, παρακαλώ."
    },
    {
     "en": "Μπορώ να έχω...; = Can I have...? Μπορώ να έχω τον λογαριασμό;",
     "fr": "Μπορώ να έχω...; = puis-je avoir... ? Μπορώ να έχω τον λογαριασμό ;"
    },
    {
     "en": "Μπορείτε να με βοηθήσετε; = Can you help me? (-τε is the polite “you”.)",
     "fr": "Μπορείτε να με βοηθήσετε ; = pouvez-vous m'aider ? (-τε est le « vous » poli.)"
    },
    {
     "en": "Συγγνώμη, πού είναι...; = Excuse me, where is...? Always add παρακαλώ (please) or ευχαριστώ (thank you).",
     "fr": "Συγγνώμη, πού είναι... ; = excusez-moi, où est... ? Ajoute toujours παρακαλώ (s'il vous plaît) ou ευχαριστώ (merci)."
    }
   ],
   "examples": [
    {
     "say": "Θα ήθελα έναν καφέ, παρακαλώ.",
     "en": "I would like a coffee, please.",
     "fr": "Je voudrais un café, s'il vous plaît."
    },
    {
     "say": "Μπορώ να έχω τον λογαριασμό;",
     "en": "Can I have the bill?",
     "fr": "Puis-je avoir l'addition ?"
    },
    {
     "say": "Μπορείτε να με βοηθήσετε;",
     "en": "Can you help me?",
     "fr": "Pouvez-vous m'aider ?"
    },
    {
     "say": "Συγγνώμη, πού είναι η τουαλέτα;",
     "en": "Excuse me, where is the toilet?",
     "fr": "Excusez-moi, où sont les toilettes ?"
    },
    {
     "say": "Ευχαριστώ πολύ για τη βοήθεια.",
     "en": "Thank you very much for the help.",
     "fr": "Merci beaucoup pour l'aide."
    }
   ],
   "drill": [
    {
     "say": "Θα ήθελα έναν καφέ, παρακαλώ.",
     "blank": "___ ήθελα έναν καφέ, παρακαλώ.",
     "answer": "Θα",
     "en": "I would like a coffee, please.",
     "fr": "Je voudrais un café, s'il vous plaît."
    },
    {
     "say": "Μπορώ να έχω τον λογαριασμό;",
     "blank": "___ να έχω τον λογαριασμό;",
     "answer": "Μπορώ",
     "en": "Can I have the bill?",
     "fr": "Puis-je avoir l'addition ?"
    },
    {
     "say": "Μπορείτε να με βοηθήσετε;",
     "blank": "Μπορείτε ___ με βοηθήσετε;",
     "answer": "να",
     "en": "Can you help me?",
     "fr": "Pouvez-vous m'aider ?"
    },
    {
     "say": "Συγγνώμη, πού είναι η τουαλέτα;",
     "blank": "Συγγνώμη, ___ είναι η τουαλέτα;",
     "answer": "πού",
     "en": "Excuse me, where is the toilet?",
     "fr": "Excusez-moi, où sont les toilettes ?"
    }
   ],
   "bad": [
    "Θα",
    "Μπορώ",
    "να",
    "πού",
    "πότε",
    "τι"
   ]
  },
  {
   "id": "thereis",
   "title": {
    "en": "There is, there are",
    "fr": "Il y a"
   },
   "intro": {
    "en": "Use υπάρχει (one thing) and υπάρχουν (several things).",
    "fr": "Utilise υπάρχει (une chose) et υπάρχουν (plusieurs choses)."
   },
   "points": [
    {
     "en": "Υπάρχει ένα καλό εστιατόριο εδώ; = Is there a good restaurant here? Υπάρχουν δύο δωμάτια. = There are two rooms.",
     "fr": "Υπάρχει ένα καλό εστιατόριο εδώ ; = y a-t-il un bon restaurant ici ? Υπάρχουν δύο δωμάτια. = il y a deux chambres."
    },
    {
     "en": "Negative: Δεν υπάρχει πρόβλημα. = There is no problem.",
     "fr": "Négation : Δεν υπάρχει πρόβλημα. = il n'y a pas de problème."
    },
    {
     "en": "In everyday speech έχει (it has) is also used: Εδώ έχει πολύ κόσμο. = There are a lot of people here.",
     "fr": "Dans la langue de tous les jours on emploie aussi έχει (il a) : Εδώ έχει πολύ κόσμο. = il y a beaucoup de monde ici."
    },
    {
     "en": "For the weather: Έχει ζέστη = it is hot, Έχει συννεφιά = it is cloudy.",
     "fr": "Pour le temps : Έχει ζέστη = il fait chaud, Έχει συννεφιά = il y a des nuages."
    }
   ],
   "examples": [
    {
     "say": "Υπάρχει ένας σταθμός εδώ κοντά;",
     "en": "Is there a station near here?",
     "fr": "Y a-t-il une gare près d'ici ?"
    },
    {
     "say": "Υπάρχουν δύο δωμάτια.",
     "en": "There are two rooms.",
     "fr": "Il y a deux chambres."
    },
    {
     "say": "Δεν υπάρχει πρόβλημα.",
     "en": "There is no problem.",
     "fr": "Il n'y a pas de problème."
    },
    {
     "say": "Εδώ έχει πολύ κόσμο.",
     "en": "There are a lot of people here.",
     "fr": "Il y a beaucoup de monde ici."
    },
    {
     "say": "Σήμερα έχει ζέστη.",
     "en": "Today it is hot.",
     "fr": "Aujourd'hui il fait chaud."
    }
   ],
   "drill": [
    {
     "say": "Υπάρχει ένας σταθμός εδώ κοντά;",
     "blank": "___ ένας σταθμός εδώ κοντά;",
     "answer": "Υπάρχει",
     "en": "Is there a station near here?",
     "fr": "Y a-t-il une gare près d'ici ?"
    },
    {
     "say": "Υπάρχουν δύο δωμάτια.",
     "blank": "___ δύο δωμάτια.",
     "answer": "Υπάρχουν",
     "en": "There are two rooms.",
     "fr": "Il y a deux chambres."
    },
    {
     "say": "Δεν υπάρχει πρόβλημα.",
     "blank": "Δεν ___ πρόβλημα.",
     "answer": "υπάρχει",
     "en": "There is no problem.",
     "fr": "Il n'y a pas de problème."
    },
    {
     "say": "Σήμερα έχει ζέστη.",
     "blank": "Σήμερα ___ ζέστη.",
     "answer": "έχει",
     "en": "Today it is hot.",
     "fr": "Aujourd'hui il fait chaud."
    }
   ],
   "bad": [
    "Υπάρχουν",
    "Έχω",
    "Είναι",
    "Υπάρχει",
    "έχουν",
    "είναι"
   ]
  }
 ]
};
