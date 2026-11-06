// Word families: a root word and the words built on it (work: δουλεύω, η δουλειά, ο δουλευτής...). Made from families.txt (tools: gen_families.py). Edit freely.
//  - Written by Claude from general knowledge of Greek (no book): some links are about the meaning, not only the spelling (so the families are a help to remember, not a lesson in word history).
//  - Every "gr" gets a recording (tools/make_audio.py makes it). Not reviewed by a native speaker yet.
const FAMILIES = {
 "families": [
  {
   "id": "f001",
   "root": {
    "gr": "δουλεύω",
    "lat": "doulevo",
    "en": "I work",
    "fr": "je travaille"
   },
   "members": [
    {
     "gr": "η δουλειά",
     "lat": "i doulia",
     "en": "work, job",
     "fr": "travail, métier"
    },
    {
     "gr": "ο δουλευτής",
     "lat": "o douleftis",
     "en": "the worker",
     "fr": "le travailleur"
    },
    {
     "gr": "δουλευταράς",
     "lat": "douleftaras",
     "en": "hard worker (informal)",
     "fr": "gros travailleur (familier)"
    },
    {
     "gr": "δουλεύουμε",
     "lat": "doulevoume",
     "en": "we work",
     "fr": "nous travaillons"
    }
   ]
  },
  {
   "id": "f002",
   "root": {
    "gr": "εργάζομαι",
    "lat": "ergazome",
    "en": "I work (formal)",
    "fr": "je travaille (soutenu)"
   },
   "members": [
    {
     "gr": "η εργασία",
     "lat": "i ergasia",
     "en": "work, job",
     "fr": "travail, emploi"
    },
    {
     "gr": "ο εργάτης",
     "lat": "o ergatis",
     "en": "the labourer, the worker",
     "fr": "l'ouvrier"
    },
    {
     "gr": "η εργάτρια",
     "lat": "i ergatria",
     "en": "the (woman) worker",
     "fr": "l'ouvrière"
    },
    {
     "gr": "το εργοστάσιο",
     "lat": "to ergostasio",
     "en": "the factory",
     "fr": "l'usine"
    },
    {
     "gr": "ο εργοδότης",
     "lat": "o ergodotis",
     "en": "the employer",
     "fr": "l'employeur"
    },
    {
     "gr": "το έργο",
     "lat": "to ergo",
     "en": "work, play, film",
     "fr": "œuvre, pièce, film"
    },
    {
     "gr": "άνεργος",
     "lat": "anergos",
     "en": "unemployed",
     "fr": "au chômage"
    }
   ]
  },
  {
   "id": "f003",
   "root": {
    "gr": "γράφω",
    "lat": "grafo",
    "en": "I write",
    "fr": "j'écris"
   },
   "members": [
    {
     "gr": "το γράμμα",
     "lat": "to gramma",
     "en": "letter (of the alphabet or in the post)",
     "fr": "lettre"
    },
    {
     "gr": "η γραφή",
     "lat": "i grafi",
     "en": "handwriting, writing",
     "fr": "écriture"
    },
    {
     "gr": "το γραφείο",
     "lat": "to grafio",
     "en": "desk, office",
     "fr": "bureau"
    },
    {
     "gr": "ο συγγραφέας",
     "lat": "o singrafeas",
     "en": "the author",
     "fr": "l'auteur"
    },
    {
     "gr": "γραπτός",
     "lat": "graptos",
     "en": "written",
     "fr": "écrit"
    },
    {
     "gr": "το γράψιμο",
     "lat": "to grapsimo",
     "en": "the writing (act of writing)",
     "fr": "le fait d'écrire"
    }
   ]
  },
  {
   "id": "f004",
   "root": {
    "gr": "μαθαίνω",
    "lat": "matheno",
    "en": "I learn",
    "fr": "j'apprends"
   },
   "members": [
    {
     "gr": "ο μαθητής",
     "lat": "o mathitis",
     "en": "the (male) pupil",
     "fr": "l'élève"
    },
    {
     "gr": "η μαθήτρια",
     "lat": "i mathitria",
     "en": "the (female) pupil",
     "fr": "l'élève (fille)"
    },
    {
     "gr": "το μάθημα",
     "lat": "to mathima",
     "en": "the lesson",
     "fr": "la leçon, le cours"
    },
    {
     "gr": "η μάθηση",
     "lat": "i mathisi",
     "en": "learning",
     "fr": "l'apprentissage"
    },
    {
     "gr": "τα μαθηματικά",
     "lat": "ta mathimatika",
     "en": "mathematics",
     "fr": "les mathématiques"
    }
   ]
  },
  {
   "id": "f005",
   "root": {
    "gr": "διδάσκω",
    "lat": "didasko",
    "en": "I teach",
    "fr": "j'enseigne"
   },
   "members": [
    {
     "gr": "ο δάσκαλος",
     "lat": "o daskalos",
     "en": "the (male) teacher",
     "fr": "l'instituteur, le maître"
    },
    {
     "gr": "η δασκάλα",
     "lat": "i daskala",
     "en": "the (female) teacher",
     "fr": "l'institutrice"
    },
    {
     "gr": "η διδασκαλία",
     "lat": "i didaskalia",
     "en": "teaching",
     "fr": "l'enseignement"
    },
    {
     "gr": "ο διδάκτορας",
     "lat": "o didaktoras",
     "en": "doctor (of a university)",
     "fr": "docteur (universitaire)"
    }
   ]
  },
  {
   "id": "f006",
   "root": {
    "gr": "ταξιδεύω",
    "lat": "taxidevo",
    "en": "I travel",
    "fr": "je voyage"
   },
   "members": [
    {
     "gr": "το ταξίδι",
     "lat": "to taxidi",
     "en": "the trip",
     "fr": "le voyage"
    },
    {
     "gr": "ο ταξιδιώτης",
     "lat": "o taxidiotis",
     "en": "the traveller",
     "fr": "le voyageur"
    },
    {
     "gr": "ταξιδιάρης",
     "lat": "taxidiaris",
     "en": "fond of travelling",
     "fr": "qui aime voyager"
    },
    {
     "gr": "το ταξιδιωτικό γραφείο",
     "lat": "to taxidiotiko grafio",
     "en": "the travel agency",
     "fr": "l'agence de voyages"
    }
   ]
  },
  {
   "id": "f007",
   "root": {
    "gr": "αγοράζω",
    "lat": "agorazo",
    "en": "I buy",
    "fr": "j'achète"
   },
   "members": [
    {
     "gr": "η αγορά",
     "lat": "i agora",
     "en": "market, purchase",
     "fr": "marché, achat"
    },
    {
     "gr": "ο αγοραστής",
     "lat": "o agorastis",
     "en": "the buyer",
     "fr": "l'acheteur"
    },
    {
     "gr": "η αγοραπωλησία",
     "lat": "i agorapolisia",
     "en": "buying and selling",
     "fr": "achat et vente"
    }
   ]
  },
  {
   "id": "f008",
   "root": {
    "gr": "πουλάω",
    "lat": "poulao",
    "en": "I sell",
    "fr": "je vends"
   },
   "members": [
    {
     "gr": "ο πωλητής",
     "lat": "o politis",
     "en": "the (male) seller",
     "fr": "le vendeur"
    },
    {
     "gr": "η πωλήτρια",
     "lat": "i politria",
     "en": "the (female) seller",
     "fr": "la vendeuse"
    },
    {
     "gr": "η πώληση",
     "lat": "i polisi",
     "en": "the sale",
     "fr": "la vente"
    },
    {
     "gr": "πωλείται",
     "lat": "polite",
     "en": "for sale",
     "fr": "à vendre"
    }
   ]
  },
  {
   "id": "f009",
   "root": {
    "gr": "φίλος",
    "lat": "filos",
    "en": "friend (man)",
    "fr": "ami"
   },
   "members": [
    {
     "gr": "η φίλη",
     "lat": "i fili",
     "en": "friend (woman)",
     "fr": "amie"
    },
    {
     "gr": "η φιλία",
     "lat": "i filia",
     "en": "friendship",
     "fr": "l'amitié"
    },
    {
     "gr": "φιλικός",
     "lat": "filikos",
     "en": "friendly",
     "fr": "amical"
    },
    {
     "gr": "το φιλί",
     "lat": "to fili",
     "en": "the kiss",
     "fr": "le baiser"
    },
    {
     "gr": "φιλώ",
     "lat": "filo",
     "en": "I kiss",
     "fr": "j'embrasse"
    },
    {
     "gr": "η φιλοξενία",
     "lat": "i filoxenia",
     "en": "hospitality",
     "fr": "l'hospitalité"
    },
    {
     "gr": "φιλόξενος",
     "lat": "filoxenos",
     "en": "hospitable",
     "fr": "hospitalier"
    }
   ]
  },
  {
   "id": "f010",
   "root": {
    "gr": "ξένος",
    "lat": "xenos",
    "en": "foreigner, stranger, foreign",
    "fr": "étranger"
   },
   "members": [
    {
     "gr": "η ξένη γλώσσα",
     "lat": "i xeni glossa",
     "en": "foreign language",
     "fr": "langue étrangère"
    },
    {
     "gr": "το ξενοδοχείο",
     "lat": "to xenodochio",
     "en": "the hotel",
     "fr": "l'hôtel"
    },
    {
     "gr": "ο ξενώνας",
     "lat": "o xenonas",
     "en": "the guest house",
     "fr": "la maison d'hôtes"
    },
    {
     "gr": "ο ξεναγός",
     "lat": "o xenagos",
     "en": "the tourist guide",
     "fr": "le guide touristique"
    },
    {
     "gr": "η ξενιτιά",
     "lat": "i xenitia",
     "en": "life abroad",
     "fr": "la vie à l'étranger"
    }
   ]
  },
  {
   "id": "f011",
   "root": {
    "gr": "θάλασσα",
    "lat": "thalassa",
    "en": "sea",
    "fr": "mer"
   },
   "members": [
    {
     "gr": "θαλασσινός",
     "lat": "thalassinos",
     "en": "of the sea",
     "fr": "de la mer"
    },
    {
     "gr": "τα θαλασσινά",
     "lat": "ta thalassina",
     "en": "seafood",
     "fr": "les fruits de mer"
    },
    {
     "gr": "θαλάσσιος",
     "lat": "thalassios",
     "en": "marine",
     "fr": "marin"
    },
    {
     "gr": "ο θαλασσοπόρος",
     "lat": "o thalassoporos",
     "en": "the seafarer",
     "fr": "le navigateur"
    }
   ]
  },
  {
   "id": "f012",
   "root": {
    "gr": "νερό",
    "lat": "nero",
    "en": "water",
    "fr": "eau"
   },
   "members": [
    {
     "gr": "το νεράκι",
     "lat": "to neraki",
     "en": "a little water",
     "fr": "un peu d'eau"
    },
    {
     "gr": "ο νεροχύτης",
     "lat": "o nerochitis",
     "en": "the sink",
     "fr": "l'évier"
    },
    {
     "gr": "νερουλός",
     "lat": "neroulos",
     "en": "watery",
     "fr": "aqueux"
    },
    {
     "gr": "η νεροποντή",
     "lat": "i neropondi",
     "en": "the downpour",
     "fr": "l'averse"
    }
   ]
  },
  {
   "id": "f013",
   "root": {
    "gr": "ήλιος",
    "lat": "ilios",
    "en": "sun",
    "fr": "soleil"
   },
   "members": [
    {
     "gr": "ηλιόλουστος",
     "lat": "ilioloustos",
     "en": "sunny",
     "fr": "ensoleillé"
    },
    {
     "gr": "το ηλιοβασίλεμα",
     "lat": "to iliovasilema",
     "en": "the sunset",
     "fr": "le coucher de soleil"
    },
    {
     "gr": "ηλιακός",
     "lat": "iliakos",
     "en": "solar",
     "fr": "solaire"
    }
   ]
  },
  {
   "id": "f014",
   "root": {
    "gr": "βροχή",
    "lat": "vrochi",
    "en": "rain",
    "fr": "pluie"
   },
   "members": [
    {
     "gr": "βρέχει",
     "lat": "vrechi",
     "en": "it rains",
     "fr": "il pleut"
    },
    {
     "gr": "βροχερός",
     "lat": "vrocheros",
     "en": "rainy",
     "fr": "pluvieux"
    },
    {
     "gr": "η βροχόπτωση",
     "lat": "i vrochoptosi",
     "en": "the rainfall",
     "fr": "les précipitations"
    }
   ]
  },
  {
   "id": "f015",
   "root": {
    "gr": "χιόνι",
    "lat": "chioni",
    "en": "snow",
    "fr": "neige"
   },
   "members": [
    {
     "gr": "χιονίζει",
     "lat": "chionizi",
     "en": "it snows",
     "fr": "il neige"
    },
    {
     "gr": "χιονισμένος",
     "lat": "chionismenos",
     "en": "snowy",
     "fr": "enneigé"
    },
    {
     "gr": "ο χιονάνθρωπος",
     "lat": "o chionanthropos",
     "en": "the snowman",
     "fr": "le bonhomme de neige"
    },
    {
     "gr": "η χιονόπτωση",
     "lat": "i chionoptosi",
     "en": "the snowfall",
     "fr": "la chute de neige"
    }
   ]
  },
  {
   "id": "f016",
   "root": {
    "gr": "φως",
    "lat": "fos",
    "en": "light",
    "fr": "lumière"
   },
   "members": [
    {
     "gr": "φωτεινός",
     "lat": "fotinos",
     "en": "bright",
     "fr": "lumineux"
    },
    {
     "gr": "η φωτιά",
     "lat": "i fotia",
     "en": "the fire",
     "fr": "le feu"
    },
    {
     "gr": "η φωτογραφία",
     "lat": "i fotografia",
     "en": "the photo",
     "fr": "la photo"
    },
    {
     "gr": "ο φωτογράφος",
     "lat": "o fotografos",
     "en": "the photographer",
     "fr": "le photographe"
    },
    {
     "gr": "φωτίζω",
     "lat": "fotizo",
     "en": "I light up",
     "fr": "j'éclaire"
    }
   ]
  },
  {
   "id": "f017",
   "root": {
    "gr": "μουσική",
    "lat": "mousiki",
    "en": "music",
    "fr": "musique"
   },
   "members": [
    {
     "gr": "ο μουσικός",
     "lat": "o mousikos",
     "en": "the musician",
     "fr": "le musicien"
    },
    {
     "gr": "μουσικός",
     "lat": "mousikos",
     "en": "musical",
     "fr": "musical"
    },
    {
     "gr": "το μουσείο",
     "lat": "to mousio",
     "en": "the museum",
     "fr": "le musée"
    },
    {
     "gr": "το μουσικό όργανο",
     "lat": "to mousiko organo",
     "en": "the musical instrument",
     "fr": "l'instrument de musique"
    }
   ]
  },
  {
   "id": "f018",
   "root": {
    "gr": "τραγούδι",
    "lat": "tragoudi",
    "en": "song",
    "fr": "chanson"
   },
   "members": [
    {
     "gr": "τραγουδώ",
     "lat": "tragoudo",
     "en": "I sing",
     "fr": "je chante"
    },
    {
     "gr": "ο τραγουδιστής",
     "lat": "o tragoudistis",
     "en": "the (male) singer",
     "fr": "le chanteur"
    },
    {
     "gr": "η τραγουδίστρια",
     "lat": "i tragoudistria",
     "en": "the (female) singer",
     "fr": "la chanteuse"
    }
   ]
  },
  {
   "id": "f019",
   "root": {
    "gr": "χορός",
    "lat": "choros",
    "en": "dance",
    "fr": "danse"
   },
   "members": [
    {
     "gr": "χορεύω",
     "lat": "chorevo",
     "en": "I dance",
     "fr": "je danse"
    },
    {
     "gr": "ο χορευτής",
     "lat": "o choreftis",
     "en": "the (male) dancer",
     "fr": "le danseur"
    },
    {
     "gr": "η χορεύτρια",
     "lat": "i choreftria",
     "en": "the (female) dancer",
     "fr": "la danseuse"
    }
   ]
  },
  {
   "id": "f020",
   "root": {
    "gr": "παιχνίδι",
    "lat": "pechnidi",
    "en": "game, toy",
    "fr": "jeu, jouet"
   },
   "members": [
    {
     "gr": "παίζω",
     "lat": "pezo",
     "en": "I play",
     "fr": "je joue"
    },
    {
     "gr": "ο παίκτης",
     "lat": "o pektis",
     "en": "the player",
     "fr": "le joueur"
    },
    {
     "gr": "παιχνιδιάρης",
     "lat": "pechnidiaris",
     "en": "playful",
     "fr": "joueur"
    }
   ]
  },
  {
   "id": "f021",
   "root": {
    "gr": "παιδί",
    "lat": "pedi",
    "en": "child",
    "fr": "enfant"
   },
   "members": [
    {
     "gr": "το παιδάκι",
     "lat": "to pedaki",
     "en": "the little child",
     "fr": "le petit enfant"
    },
    {
     "gr": "παιδικός",
     "lat": "pedikos",
     "en": "children's, childish",
     "fr": "d'enfant"
    },
    {
     "gr": "η παιδική χαρά",
     "lat": "i pediki chara",
     "en": "the playground",
     "fr": "l'aire de jeux"
    },
    {
     "gr": "η παιδική ηλικία",
     "lat": "i pediki ilikia",
     "en": "childhood",
     "fr": "l'enfance"
    }
   ]
  },
  {
   "id": "f022",
   "root": {
    "gr": "ψάρι",
    "lat": "psari",
    "en": "fish",
    "fr": "poisson"
   },
   "members": [
    {
     "gr": "ο ψαράς",
     "lat": "o psaras",
     "en": "the fisherman",
     "fr": "le pêcheur"
    },
    {
     "gr": "ψαρεύω",
     "lat": "psarevo",
     "en": "I fish",
     "fr": "je pêche"
    },
    {
     "gr": "το ψαράδικο",
     "lat": "to psaradiko",
     "en": "the fish shop, the fishing boat",
     "fr": "la poissonnerie, le bateau de pêche"
    },
    {
     "gr": "η ψαρόσουπα",
     "lat": "i psarosoupa",
     "en": "fish soup",
     "fr": "soupe de poisson"
    }
   ]
  },
  {
   "id": "f023",
   "root": {
    "gr": "ελιά",
    "lat": "elia",
    "en": "olive, olive tree",
    "fr": "olive, olivier"
   },
   "members": [
    {
     "gr": "το ελαιόλαδο",
     "lat": "to eleolado",
     "en": "olive oil",
     "fr": "l'huile d'olive"
    },
    {
     "gr": "ο ελαιώνας",
     "lat": "o eleonas",
     "en": "the olive grove",
     "fr": "l'oliveraie"
    },
    {
     "gr": "το λάδι",
     "lat": "to ladi",
     "en": "oil",
     "fr": "huile"
    }
   ]
  },
  {
   "id": "f024",
   "root": {
    "gr": "ζάχαρη",
    "lat": "zachari",
    "en": "sugar",
    "fr": "sucre"
   },
   "members": [
    {
     "gr": "ο ζαχαροπλάστης",
     "lat": "o zacharoplastis",
     "en": "the pastry cook",
     "fr": "le pâtissier"
    },
    {
     "gr": "το ζαχαροπλαστείο",
     "lat": "to zacharoplastio",
     "en": "the pastry shop",
     "fr": "la pâtisserie"
    },
    {
     "gr": "ζαχαρένιος",
     "lat": "zacharenios",
     "en": "sweet as sugar",
     "fr": "sucré comme du sucre"
    }
   ]
  },
  {
   "id": "f025",
   "root": {
    "gr": "καφές",
    "lat": "kafes",
    "en": "coffee",
    "fr": "café"
   },
   "members": [
    {
     "gr": "το καφενείο",
     "lat": "to kafenio",
     "en": "the café",
     "fr": "le café"
    },
    {
     "gr": "ο καφετζής",
     "lat": "o kafetzis",
     "en": "the café owner",
     "fr": "le patron de café"
    },
    {
     "gr": "η καφετιέρα",
     "lat": "i kafetiera",
     "en": "the coffee maker",
     "fr": "la cafetière"
    },
    {
     "gr": "καφέ",
     "lat": "kafe",
     "en": "brown",
     "fr": "marron"
    },
    {
     "gr": "η καφετέρια",
     "lat": "i kafeteria",
     "en": "the cafeteria",
     "fr": "la cafétéria"
    }
   ]
  },
  {
   "id": "f026",
   "root": {
    "gr": "βιβλίο",
    "lat": "vivlio",
    "en": "book",
    "fr": "livre"
   },
   "members": [
    {
     "gr": "η βιβλιοθήκη",
     "lat": "i vivliothiki",
     "en": "library, bookcase",
     "fr": "bibliothèque"
    },
    {
     "gr": "το βιβλιοπωλείο",
     "lat": "to vivliopolio",
     "en": "the bookshop",
     "fr": "la librairie"
    },
    {
     "gr": "ο βιβλιοπώλης",
     "lat": "o vivliopolis",
     "en": "the bookseller",
     "fr": "le libraire"
    },
    {
     "gr": "η βιβλιογραφία",
     "lat": "i vivliografia",
     "en": "bibliography",
     "fr": "bibliographie"
    },
    {
     "gr": "το βιβλιάριο",
     "lat": "to vivliario",
     "en": "the booklet",
     "fr": "le livret"
    }
   ]
  },
  {
   "id": "f027",
   "root": {
    "gr": "κίνηση",
    "lat": "kinisi",
    "en": "movement, traffic",
    "fr": "mouvement, circulation"
   },
   "members": [
    {
     "gr": "κινούμαι",
     "lat": "kinoume",
     "en": "I move",
     "fr": "je bouge"
    },
    {
     "gr": "το κινητό",
     "lat": "to kinito",
     "en": "the mobile phone",
     "fr": "le téléphone portable"
    },
    {
     "gr": "ο κινηματογράφος",
     "lat": "o kinimatografos",
     "en": "the cinema",
     "fr": "le cinéma"
    },
    {
     "gr": "το αυτοκίνητο",
     "lat": "to aftokinito",
     "en": "the car",
     "fr": "la voiture"
    },
    {
     "gr": "ο κινητήρας",
     "lat": "o kinitiras",
     "en": "the engine",
     "fr": "le moteur"
    }
   ]
  },
  {
   "id": "f028",
   "root": {
    "gr": "τηλέφωνο",
    "lat": "tilefono",
    "en": "telephone",
    "fr": "téléphone"
   },
   "members": [
    {
     "gr": "τηλεφωνώ",
     "lat": "tilefono",
     "en": "I phone",
     "fr": "je téléphone"
    },
    {
     "gr": "ο τηλεφωνητής",
     "lat": "o tilefonitis",
     "en": "the operator",
     "fr": "le standardiste"
    },
    {
     "gr": "τηλεφωνικός",
     "lat": "tilefonikos",
     "en": "of the telephone",
     "fr": "téléphonique"
    },
    {
     "gr": "το τηλεφώνημα",
     "lat": "to tilefonima",
     "en": "the phone call",
     "fr": "l'appel téléphonique"
    }
   ]
  },
  {
   "id": "f029",
   "root": {
    "gr": "τηλεόραση",
    "lat": "tileorasi",
    "en": "television",
    "fr": "télévision"
   },
   "members": [
    {
     "gr": "το τηλεχειριστήριο",
     "lat": "to tilechiristirio",
     "en": "the remote control",
     "fr": "la télécommande"
    },
    {
     "gr": "το τηλεσκόπιο",
     "lat": "to tileskopio",
     "en": "the telescope",
     "fr": "le télescope"
    },
    {
     "gr": "η τηλεργασία",
     "lat": "i tilergasia",
     "en": "working from home",
     "fr": "le télétravail"
    },
    {
     "gr": "τηλεοπτικός",
     "lat": "tileoptikos",
     "en": "of television",
     "fr": "télévisuel"
    }
   ]
  },
  {
   "id": "f030",
   "root": {
    "gr": "γιατρός",
    "lat": "yiatros",
    "en": "doctor",
    "fr": "médecin"
   },
   "members": [
    {
     "gr": "γιατρεύω",
     "lat": "yiatrevo",
     "en": "I cure",
     "fr": "je soigne"
    },
    {
     "gr": "το γιατρικό",
     "lat": "to yiatriko",
     "en": "the remedy",
     "fr": "le remède"
    },
    {
     "gr": "η ιατρική",
     "lat": "i iatriki",
     "en": "medicine (the science)",
     "fr": "la médecine"
    },
    {
     "gr": "το ιατρείο",
     "lat": "to iatrio",
     "en": "the doctor's office",
     "fr": "le cabinet médical"
    },
    {
     "gr": "ιατρικός",
     "lat": "iatrikos",
     "en": "medical",
     "fr": "médical"
    }
   ]
  },
  {
   "id": "f031",
   "root": {
    "gr": "φάρμακο",
    "lat": "farmako",
    "en": "medicine, drug",
    "fr": "médicament"
   },
   "members": [
    {
     "gr": "το φαρμακείο",
     "lat": "to farmakio",
     "en": "the pharmacy",
     "fr": "la pharmacie"
    },
    {
     "gr": "ο φαρμακοποιός",
     "lat": "o farmakopios",
     "en": "the pharmacist",
     "fr": "le pharmacien"
    },
    {
     "gr": "φαρμακευτικός",
     "lat": "farmakeftikos",
     "en": "pharmaceutical",
     "fr": "pharmaceutique"
    }
   ]
  },
  {
   "id": "f032",
   "root": {
    "gr": "νοσοκομείο",
    "lat": "nosokomio",
    "en": "hospital",
    "fr": "hôpital"
   },
   "members": [
    {
     "gr": "ο νοσοκόμος",
     "lat": "o nosokomos",
     "en": "the (male) nurse",
     "fr": "l'infirmier"
    },
    {
     "gr": "η νοσοκόμα",
     "lat": "i nosokoma",
     "en": "the (female) nurse",
     "fr": "l'infirmière"
    },
    {
     "gr": "νοσηλεύω",
     "lat": "nosilevo",
     "en": "I nurse, I treat",
     "fr": "je soigne (à l'hôpital)"
    },
    {
     "gr": "η νόσος",
     "lat": "i nosos",
     "en": "the illness",
     "fr": "la maladie"
    }
   ]
  },
  {
   "id": "f033",
   "root": {
    "gr": "υγεία",
    "lat": "iyia",
    "en": "health",
    "fr": "santé"
   },
   "members": [
    {
     "gr": "υγιής",
     "lat": "iyiis",
     "en": "healthy",
     "fr": "en bonne santé"
    },
    {
     "gr": "υγιεινός",
     "lat": "iyiinos",
     "en": "healthy (food)",
     "fr": "sain"
    },
    {
     "gr": "η υγιεινή",
     "lat": "i iyiini",
     "en": "hygiene",
     "fr": "l'hygiène"
    },
    {
     "gr": "υγειονομικός",
     "lat": "iyionomikos",
     "en": "of health",
     "fr": "sanitaire"
    }
   ]
  },
  {
   "id": "f034",
   "root": {
    "gr": "οδηγώ",
    "lat": "odigo",
    "en": "I drive",
    "fr": "je conduis"
   },
   "members": [
    {
     "gr": "ο οδηγός",
     "lat": "o odigos",
     "en": "the driver, the guide",
     "fr": "le conducteur, le guide"
    },
    {
     "gr": "η οδήγηση",
     "lat": "i odiyisi",
     "en": "driving",
     "fr": "la conduite"
    },
    {
     "gr": "η οδηγία",
     "lat": "i odiyia",
     "en": "the instruction",
     "fr": "la consigne"
    },
    {
     "gr": "η οδός",
     "lat": "i odos",
     "en": "the street, the road",
     "fr": "la rue"
    }
   ]
  },
  {
   "id": "f035",
   "root": {
    "gr": "δρόμος",
    "lat": "dromos",
    "en": "road, way",
    "fr": "route, chemin"
   },
   "members": [
    {
     "gr": "τρέχω",
     "lat": "trecho",
     "en": "I run",
     "fr": "je cours"
    },
    {
     "gr": "ο δρομέας",
     "lat": "o dromeas",
     "en": "the runner",
     "fr": "le coureur"
    },
    {
     "gr": "το δρομολόγιο",
     "lat": "to dromoloyio",
     "en": "the route, the timetable",
     "fr": "l'itinéraire, l'horaire"
    },
    {
     "gr": "ο αυτοκινητόδρομος",
     "lat": "o aftokinitodromos",
     "en": "the motorway",
     "fr": "l'autoroute"
    },
    {
     "gr": "ο πεζόδρομος",
     "lat": "o pezodromos",
     "en": "the pedestrian street",
     "fr": "la rue piétonne"
    },
    {
     "gr": "ο ποδηλατόδρομος",
     "lat": "o podilatodromos",
     "en": "the cycle path",
     "fr": "la piste cyclable"
    }
   ]
  },
  {
   "id": "f036",
   "root": {
    "gr": "πεζός",
    "lat": "pezos",
    "en": "pedestrian",
    "fr": "piéton"
   },
   "members": [
    {
     "gr": "το πεζοδρόμιο",
     "lat": "to pezodromio",
     "en": "the pavement",
     "fr": "le trottoir"
    },
    {
     "gr": "η πεζοπορία",
     "lat": "i pezoporia",
     "en": "hiking",
     "fr": "la randonnée"
    },
    {
     "gr": "ο πεζοπόρος",
     "lat": "o pezoporos",
     "en": "the hiker",
     "fr": "le randonneur"
    },
    {
     "gr": "περπατώ",
     "lat": "perpato",
     "en": "I walk",
     "fr": "je marche"
    },
    {
     "gr": "ο περίπατος",
     "lat": "o peripatos",
     "en": "the walk",
     "fr": "la promenade"
    }
   ]
  },
  {
   "id": "f037",
   "root": {
    "gr": "ύπνος",
    "lat": "ipnos",
    "en": "sleep",
    "fr": "sommeil"
   },
   "members": [
    {
     "gr": "κοιμάμαι",
     "lat": "kimame",
     "en": "I sleep",
     "fr": "je dors"
    },
    {
     "gr": "το υπνοδωμάτιο",
     "lat": "to ipnodomatio",
     "en": "the bedroom",
     "fr": "la chambre"
    },
    {
     "gr": "ο υπνόσακος",
     "lat": "o ipnosakos",
     "en": "the sleeping bag",
     "fr": "le sac de couchage"
    },
    {
     "gr": "υπνηλία",
     "lat": "ipnilia",
     "en": "sleepiness",
     "fr": "somnolence"
    }
   ]
  },
  {
   "id": "f038",
   "root": {
    "gr": "ξυπνώ",
    "lat": "xipno",
    "en": "I wake up",
    "fr": "je me réveille"
   },
   "members": [
    {
     "gr": "το ξυπνητήρι",
     "lat": "to xipnitiri",
     "en": "the alarm clock",
     "fr": "le réveil"
    },
    {
     "gr": "ξύπνιος",
     "lat": "xipnios",
     "en": "awake",
     "fr": "éveillé"
    },
    {
     "gr": "η αφύπνιση",
     "lat": "i afipnisi",
     "en": "the awakening",
     "fr": "le réveil, l'éveil"
    }
   ]
  },
  {
   "id": "f039",
   "root": {
    "gr": "ζωή",
    "lat": "zoi",
    "en": "life",
    "fr": "vie"
   },
   "members": [
    {
     "gr": "ζω",
     "lat": "zo",
     "en": "I live",
     "fr": "je vis"
    },
    {
     "gr": "ζωντανός",
     "lat": "zondanos",
     "en": "alive",
     "fr": "vivant"
    },
    {
     "gr": "το ζώο",
     "lat": "to zoo",
     "en": "the animal",
     "fr": "l'animal"
    },
    {
     "gr": "ο ζωολογικός κήπος",
     "lat": "o zooloyikos kipos",
     "en": "the zoo",
     "fr": "le zoo"
    }
   ]
  },
  {
   "id": "f040",
   "root": {
    "gr": "μιλώ",
    "lat": "milo",
    "en": "I speak",
    "fr": "je parle"
   },
   "members": [
    {
     "gr": "η ομιλία",
     "lat": "i omilia",
     "en": "the speech",
     "fr": "le discours"
    },
    {
     "gr": "ο ομιλητής",
     "lat": "o omilitis",
     "en": "the speaker",
     "fr": "l'orateur"
    },
    {
     "gr": "η συνομιλία",
     "lat": "i sinomilia",
     "en": "the conversation",
     "fr": "la conversation"
    },
    {
     "gr": "η μιλιά",
     "lat": "i milia",
     "en": "speech, voice",
     "fr": "la parole"
    }
   ]
  },
  {
   "id": "f041",
   "root": {
    "gr": "λέω",
    "lat": "leo",
    "en": "I say",
    "fr": "je dis"
   },
   "members": [
    {
     "gr": "η λέξη",
     "lat": "i lexi",
     "en": "the word",
     "fr": "le mot"
    },
    {
     "gr": "το λεξικό",
     "lat": "to lexiko",
     "en": "the dictionary",
     "fr": "le dictionnaire"
    },
    {
     "gr": "ο λόγος",
     "lat": "o logos",
     "en": "word, speech, reason",
     "fr": "mot, discours, raison"
    },
    {
     "gr": "ο διάλογος",
     "lat": "o dialogos",
     "en": "the dialogue",
     "fr": "le dialogue"
    },
    {
     "gr": "η λογοτεχνία",
     "lat": "i logotechnia",
     "en": "literature",
     "fr": "la littérature"
    },
    {
     "gr": "λογικός",
     "lat": "loyikos",
     "en": "logical, reasonable",
     "fr": "logique, raisonnable"
    }
   ]
  },
  {
   "id": "f042",
   "root": {
    "gr": "αγαπώ",
    "lat": "agapo",
    "en": "I love",
    "fr": "j'aime"
   },
   "members": [
    {
     "gr": "η αγάπη",
     "lat": "i agapi",
     "en": "love",
     "fr": "l'amour"
    },
    {
     "gr": "αγαπημένος",
     "lat": "agapimenos",
     "en": "favourite, beloved",
     "fr": "préféré, bien-aimé"
    },
    {
     "gr": "αγαπητός",
     "lat": "agapitos",
     "en": "dear",
     "fr": "cher"
    }
   ]
  },
  {
   "id": "f043",
   "root": {
    "gr": "χαρά",
    "lat": "chara",
    "en": "joy",
    "fr": "joie"
   },
   "members": [
    {
     "gr": "χαίρομαι",
     "lat": "cherome",
     "en": "I am glad",
     "fr": "je suis content"
    },
    {
     "gr": "χαρούμενος",
     "lat": "charoumenos",
     "en": "happy",
     "fr": "joyeux"
    },
    {
     "gr": "χαρωπός",
     "lat": "charopos",
     "en": "cheerful",
     "fr": "gai"
    }
   ]
  },
  {
   "id": "f044",
   "root": {
    "gr": "χάρη",
    "lat": "chari",
    "en": "favour, grace, thanks",
    "fr": "faveur, grâce, merci"
   },
   "members": [
    {
     "gr": "ευχαριστώ",
     "lat": "efcharisto",
     "en": "thank you",
     "fr": "merci"
    },
    {
     "gr": "η ευχαρίστηση",
     "lat": "i efcharistisi",
     "en": "the pleasure",
     "fr": "le plaisir"
    },
    {
     "gr": "ευχάριστος",
     "lat": "efcharistos",
     "en": "pleasant",
     "fr": "agréable"
    },
    {
     "gr": "χαρίζω",
     "lat": "charizo",
     "en": "I give as a gift",
     "fr": "j'offre"
    },
    {
     "gr": "το χάρισμα",
     "lat": "to charisma",
     "en": "the gift, the talent",
     "fr": "le don, le talent"
    }
   ]
  },
  {
   "id": "f045",
   "root": {
    "gr": "φόβος",
    "lat": "fovos",
    "en": "fear",
    "fr": "peur"
   },
   "members": [
    {
     "gr": "φοβάμαι",
     "lat": "fovame",
     "en": "I am afraid",
     "fr": "j'ai peur"
    },
    {
     "gr": "φοβερός",
     "lat": "foveros",
     "en": "terrible, great",
     "fr": "terrible, formidable"
    },
    {
     "gr": "φοβισμένος",
     "lat": "fovismenos",
     "en": "scared",
     "fr": "effrayé"
    },
    {
     "gr": "φοβητσιάρης",
     "lat": "fovitsiaris",
     "en": "fearful",
     "fr": "peureux"
    }
   ]
  },
  {
   "id": "f046",
   "root": {
    "gr": "θυμάμαι",
    "lat": "thimame",
    "en": "I remember",
    "fr": "je me souviens"
   },
   "members": [
    {
     "gr": "η ανάμνηση",
     "lat": "i anamnisi",
     "en": "the memory",
     "fr": "le souvenir"
    },
    {
     "gr": "το αναμνηστικό",
     "lat": "to anamnistiko",
     "en": "the souvenir",
     "fr": "le souvenir (objet)"
    },
    {
     "gr": "η μνήμη",
     "lat": "i mnimi",
     "en": "the memory (ability)",
     "fr": "la mémoire"
    },
    {
     "gr": "το μνημείο",
     "lat": "to mnimio",
     "en": "the monument",
     "fr": "le monument"
    }
   ]
  },
  {
   "id": "f047",
   "root": {
    "gr": "νέος",
    "lat": "neos",
    "en": "young, new",
    "fr": "jeune, nouveau"
   },
   "members": [
    {
     "gr": "νεαρός",
     "lat": "nearos",
     "en": "young",
     "fr": "jeune"
    },
    {
     "gr": "η νεολαία",
     "lat": "i neolea",
     "en": "the youth",
     "fr": "la jeunesse"
    },
    {
     "gr": "τα νέα",
     "lat": "ta nea",
     "en": "the news",
     "fr": "les nouvelles"
    },
    {
     "gr": "νεογέννητος",
     "lat": "neoyennitos",
     "en": "newborn",
     "fr": "nouveau-né"
    }
   ]
  },
  {
   "id": "f048",
   "root": {
    "gr": "γέρος",
    "lat": "yeros",
    "en": "old man",
    "fr": "vieil homme"
   },
   "members": [
    {
     "gr": "γερνώ",
     "lat": "yerno",
     "en": "I get old",
     "fr": "je vieillis"
    },
    {
     "gr": "η γριά",
     "lat": "i gria",
     "en": "old woman",
     "fr": "vieille femme"
    },
    {
     "gr": "τα γηρατειά",
     "lat": "ta yiratia",
     "en": "old age",
     "fr": "la vieillesse"
    },
    {
     "gr": "γεροντικός",
     "lat": "yerondikos",
     "en": "of an old person",
     "fr": "de personne âgée"
    }
   ]
  },
  {
   "id": "f049",
   "root": {
    "gr": "μεγάλος",
    "lat": "megalos",
    "en": "big, great",
    "fr": "grand"
   },
   "members": [
    {
     "gr": "μεγαλώνω",
     "lat": "megalono",
     "en": "I grow, I grow up",
     "fr": "je grandis"
    },
    {
     "gr": "μεγαλύτερος",
     "lat": "megaliteros",
     "en": "bigger, older",
     "fr": "plus grand, plus âgé"
    },
    {
     "gr": "το μεγαλείο",
     "lat": "to megalio",
     "en": "the grandeur",
     "fr": "la grandeur"
    },
    {
     "gr": "μεγαλοπρεπής",
     "lat": "megaloprepis",
     "en": "majestic",
     "fr": "majestueux"
    }
   ]
  },
  {
   "id": "f050",
   "root": {
    "gr": "μικρός",
    "lat": "mikros",
    "en": "small",
    "fr": "petit"
   },
   "members": [
    {
     "gr": "μικραίνω",
     "lat": "mikreno",
     "en": "I become smaller",
     "fr": "je rapetisse"
    },
    {
     "gr": "μικροσκοπικός",
     "lat": "mikroskopikos",
     "en": "tiny",
     "fr": "minuscule"
    },
    {
     "gr": "το μικρόφωνο",
     "lat": "to mikrofono",
     "en": "the microphone",
     "fr": "le microphone"
    },
    {
     "gr": "το μικροσκόπιο",
     "lat": "to mikroskopio",
     "en": "the microscope",
     "fr": "le microscope"
    }
   ]
  },
  {
   "id": "f051",
   "root": {
    "gr": "καλός",
    "lat": "kalos",
    "en": "good",
    "fr": "bon"
   },
   "members": [
    {
     "gr": "η καλοσύνη",
     "lat": "i kalosini",
     "en": "kindness",
     "fr": "la gentillesse"
    },
    {
     "gr": "καλύτερος",
     "lat": "kaliteros",
     "en": "better",
     "fr": "meilleur"
    },
    {
     "gr": "καλωσορίζω",
     "lat": "kalosorizo",
     "en": "I welcome",
     "fr": "j'accueille"
    },
    {
     "gr": "καλώς",
     "lat": "kalos",
     "en": "well",
     "fr": "bien"
    }
   ]
  },
  {
   "id": "f052",
   "root": {
    "gr": "κακός",
    "lat": "kakos",
    "en": "bad",
    "fr": "mauvais"
   },
   "members": [
    {
     "gr": "η κακία",
     "lat": "i kakia",
     "en": "spite",
     "fr": "la méchanceté"
    },
    {
     "gr": "κακομοίρης",
     "lat": "kakomiris",
     "en": "poor fellow, unlucky",
     "fr": "pauvre malheureux"
    },
    {
     "gr": "κακώς",
     "lat": "kakos",
     "en": "badly",
     "fr": "mal"
    },
    {
     "gr": "ο κακοποιός",
     "lat": "o kakopios",
     "en": "the criminal",
     "fr": "le malfaiteur"
    }
   ]
  },
  {
   "id": "f053",
   "root": {
    "gr": "καιρός",
    "lat": "keros",
    "en": "weather, time",
    "fr": "temps (météo), époque"
   },
   "members": [
    {
     "gr": "καιρικός",
     "lat": "kerikos",
     "en": "of the weather",
     "fr": "météorologique"
    },
    {
     "gr": "η ευκαιρία",
     "lat": "i efkeria",
     "en": "the opportunity",
     "fr": "l'occasion"
    },
    {
     "gr": "το καλοκαίρι",
     "lat": "to kalokeri",
     "en": "the summer",
     "fr": "l'été"
    },
    {
     "gr": "η κακοκαιρία",
     "lat": "i kakokeria",
     "en": "bad weather",
     "fr": "le mauvais temps"
    }
   ]
  },
  {
   "id": "f054",
   "root": {
    "gr": "ώρα",
    "lat": "ora",
    "en": "hour, time",
    "fr": "heure"
   },
   "members": [
    {
     "gr": "ωραίος",
     "lat": "oreos",
     "en": "beautiful, nice",
     "fr": "beau, agréable"
    },
    {
     "gr": "το ωράριο",
     "lat": "to orario",
     "en": "the timetable (hours of work)",
     "fr": "les horaires de travail"
    },
    {
     "gr": "ωριαίος",
     "lat": "orieos",
     "en": "hourly",
     "fr": "horaire"
    },
    {
     "gr": "ο ωροσκόπος",
     "lat": "o oroskopos",
     "en": "the horoscope",
     "fr": "l'horoscope"
    }
   ]
  },
  {
   "id": "f055",
   "root": {
    "gr": "μέρα",
    "lat": "mera",
    "en": "day",
    "fr": "jour"
   },
   "members": [
    {
     "gr": "η ημέρα",
     "lat": "i imera",
     "en": "the day (formal)",
     "fr": "le jour (soutenu)"
    },
    {
     "gr": "η ημερομηνία",
     "lat": "i imerominia",
     "en": "the date",
     "fr": "la date"
    },
    {
     "gr": "το ημερολόγιο",
     "lat": "to imeroloyio",
     "en": "the calendar, the diary",
     "fr": "le calendrier, le journal"
    },
    {
     "gr": "η εφημερίδα",
     "lat": "i efimerida",
     "en": "the newspaper",
     "fr": "le journal"
    },
    {
     "gr": "καθημερινός",
     "lat": "kathimerinos",
     "en": "everyday",
     "fr": "quotidien"
    },
    {
     "gr": "ημερήσιος",
     "lat": "imerisios",
     "en": "daily",
     "fr": "journalier"
    }
   ]
  },
  {
   "id": "f056",
   "root": {
    "gr": "νύχτα",
    "lat": "nichta",
    "en": "night",
    "fr": "nuit"
   },
   "members": [
    {
     "gr": "νυχτερινός",
     "lat": "nichterinos",
     "en": "of the night",
     "fr": "nocturne"
    },
    {
     "gr": "η νυχτερίδα",
     "lat": "i nichterida",
     "en": "the bat",
     "fr": "la chauve-souris"
    },
    {
     "gr": "νυχτώνει",
     "lat": "nichtoni",
     "en": "it gets dark",
     "fr": "la nuit tombe"
    },
    {
     "gr": "το νυχτικό",
     "lat": "to nichtiko",
     "en": "the nightgown",
     "fr": "la chemise de nuit"
    }
   ]
  },
  {
   "id": "f057",
   "root": {
    "gr": "χρόνος",
    "lat": "chronos",
    "en": "time, year",
    "fr": "temps, année"
   },
   "members": [
    {
     "gr": "η χρονιά",
     "lat": "i chronia",
     "en": "the year",
     "fr": "l'année"
    },
    {
     "gr": "η χρονολογία",
     "lat": "i chronoloyia",
     "en": "the date (year)",
     "fr": "la date (année)"
    },
    {
     "gr": "το χρονόμετρο",
     "lat": "to chronometro",
     "en": "the stopwatch",
     "fr": "le chronomètre"
    },
    {
     "gr": "χρόνια πολλά",
     "lat": "chronia polla",
     "en": "many happy returns",
     "fr": "joyeux anniversaire"
    }
   ]
  },
  {
   "id": "f058",
   "root": {
    "gr": "μετρώ",
    "lat": "metro",
    "en": "I count, I measure",
    "fr": "je compte, je mesure"
   },
   "members": [
    {
     "gr": "το μέτρο",
     "lat": "to metro",
     "en": "the metre, the measure",
     "fr": "le mètre, la mesure"
    },
    {
     "gr": "ο μετρητής",
     "lat": "o metritis",
     "en": "the meter",
     "fr": "le compteur"
    },
    {
     "gr": "μέτριος",
     "lat": "metrios",
     "en": "average",
     "fr": "moyen"
    },
    {
     "gr": "το μέτρημα",
     "lat": "to metrima",
     "en": "the counting",
     "fr": "le comptage"
    }
   ]
  },
  {
   "id": "f059",
   "root": {
    "gr": "πόλη",
    "lat": "poli",
    "en": "city",
    "fr": "ville"
   },
   "members": [
    {
     "gr": "ο πολίτης",
     "lat": "o politis",
     "en": "the citizen",
     "fr": "le citoyen"
    },
    {
     "gr": "η πολιτική",
     "lat": "i politiki",
     "en": "politics",
     "fr": "la politique"
    },
    {
     "gr": "ο πολιτικός",
     "lat": "o politikos",
     "en": "the politician",
     "fr": "l'homme politique"
    },
    {
     "gr": "ο πολιτισμός",
     "lat": "o politismos",
     "en": "culture, civilisation",
     "fr": "culture, civilisation"
    },
    {
     "gr": "η πολιτεία",
     "lat": "i politia",
     "en": "the state",
     "fr": "l'État"
    }
   ]
  },
  {
   "id": "f060",
   "root": {
    "gr": "κατοικώ",
    "lat": "katiko",
    "en": "I live (in a place)",
    "fr": "j'habite"
   },
   "members": [
    {
     "gr": "ο κάτοικος",
     "lat": "o katikos",
     "en": "the inhabitant",
     "fr": "l'habitant"
    },
    {
     "gr": "η κατοικία",
     "lat": "i katikia",
     "en": "the residence",
     "fr": "la résidence"
    },
    {
     "gr": "η οικονομία",
     "lat": "i ikonomia",
     "en": "the economy",
     "fr": "l'économie"
    },
    {
     "gr": "ο οικοδόμος",
     "lat": "o ikodomos",
     "en": "the builder",
     "fr": "le maçon"
    },
    {
     "gr": "η οικολογία",
     "lat": "i ikoloyia",
     "en": "ecology",
     "fr": "l'écologie"
    },
    {
     "gr": "η οικογένεια",
     "lat": "i ikoyenia",
     "en": "the family",
     "fr": "la famille"
    }
   ]
  },
  {
   "id": "f061",
   "root": {
    "gr": "αγώνας",
    "lat": "agonas",
    "en": "match, struggle",
    "fr": "match, lutte"
   },
   "members": [
    {
     "gr": "αγωνίζομαι",
     "lat": "agonizome",
     "en": "I fight, I compete",
     "fr": "je me bats, je concours"
    },
    {
     "gr": "ο αγωνιστής",
     "lat": "o agonistis",
     "en": "the fighter",
     "fr": "le combattant"
    },
    {
     "gr": "αγωνιστικός",
     "lat": "agonistikos",
     "en": "of competition",
     "fr": "de compétition"
    }
   ]
  },
  {
   "id": "f062",
   "root": {
    "gr": "άθλημα",
    "lat": "athlima",
    "en": "sport",
    "fr": "sport (discipline)"
   },
   "members": [
    {
     "gr": "ο αθλητής",
     "lat": "o athlitis",
     "en": "the athlete",
     "fr": "l'athlète"
    },
    {
     "gr": "ο αθλητισμός",
     "lat": "o athlitismos",
     "en": "sport (in general)",
     "fr": "le sport"
    },
    {
     "gr": "αθλητικός",
     "lat": "athlitikos",
     "en": "sporty",
     "fr": "sportif"
    }
   ]
  },
  {
   "id": "f063",
   "root": {
    "gr": "φωνή",
    "lat": "foni",
    "en": "voice",
    "fr": "voix"
   },
   "members": [
    {
     "gr": "φωνάζω",
     "lat": "fonazo",
     "en": "I shout, I call",
     "fr": "je crie, j'appelle"
    },
    {
     "gr": "το φωνήεν",
     "lat": "to fonien",
     "en": "the vowel",
     "fr": "la voyelle"
    },
    {
     "gr": "το σύμφωνο",
     "lat": "to simfono",
     "en": "the consonant",
     "fr": "la consonne"
    },
    {
     "gr": "η φωνητική",
     "lat": "i fonitiki",
     "en": "phonetics",
     "fr": "la phonétique"
    }
   ]
  },
  {
   "id": "f064",
   "root": {
    "gr": "δήμος",
    "lat": "dimos",
    "en": "municipality, people",
    "fr": "commune, peuple"
   },
   "members": [
    {
     "gr": "ο δήμαρχος",
     "lat": "o dimarchos",
     "en": "the mayor",
     "fr": "le maire"
    },
    {
     "gr": "η δημοκρατία",
     "lat": "i dimokratia",
     "en": "democracy, republic",
     "fr": "démocratie, république"
    },
    {
     "gr": "δημόσιος",
     "lat": "dimosios",
     "en": "public",
     "fr": "public"
    },
    {
     "gr": "δημοφιλής",
     "lat": "dimofilis",
     "en": "popular",
     "fr": "populaire"
    },
    {
     "gr": "το δημοτικό",
     "lat": "to dimotiko",
     "en": "primary school",
     "fr": "l'école primaire"
    }
   ]
  },
  {
   "id": "f065",
   "root": {
    "gr": "θέατρο",
    "lat": "theatro",
    "en": "theatre",
    "fr": "théâtre"
   },
   "members": [
    {
     "gr": "η θέα",
     "lat": "i thea",
     "en": "the view",
     "fr": "la vue"
    },
    {
     "gr": "ο θεατής",
     "lat": "o theatis",
     "en": "the spectator",
     "fr": "le spectateur"
    },
    {
     "gr": "το θέαμα",
     "lat": "to theama",
     "en": "the spectacle",
     "fr": "le spectacle"
    },
    {
     "gr": "θεατρικός",
     "lat": "theatrikos",
     "en": "theatrical",
     "fr": "théâtral"
    }
   ]
  },
  {
   "id": "f066",
   "root": {
    "gr": "γη",
    "lat": "yi",
    "en": "earth",
    "fr": "terre"
   },
   "members": [
    {
     "gr": "γήινος",
     "lat": "yiinos",
     "en": "of the earth",
     "fr": "terrestre"
    },
    {
     "gr": "η γεωγραφία",
     "lat": "i yeografia",
     "en": "geography",
     "fr": "la géographie"
    },
    {
     "gr": "ο γεωργός",
     "lat": "o yeorgos",
     "en": "the farmer",
     "fr": "l'agriculteur"
    },
    {
     "gr": "η γεωργία",
     "lat": "i yeoryia",
     "en": "agriculture",
     "fr": "l'agriculture"
    },
    {
     "gr": "η γεωμετρία",
     "lat": "i yeometria",
     "en": "geometry",
     "fr": "la géométrie"
    }
   ]
  },
  {
   "id": "f067",
   "root": {
    "gr": "αστέρι",
    "lat": "asteri",
    "en": "star",
    "fr": "étoile"
   },
   "members": [
    {
     "gr": "το άστρο",
     "lat": "to astro",
     "en": "the star (literary)",
     "fr": "l'astre"
    },
    {
     "gr": "ο αστρονόμος",
     "lat": "o astronomos",
     "en": "the astronomer",
     "fr": "l'astronome"
    },
    {
     "gr": "η αστρονομία",
     "lat": "i astronomia",
     "en": "astronomy",
     "fr": "l'astronomie"
    },
    {
     "gr": "ο αστροναύτης",
     "lat": "o astronaftis",
     "en": "the astronaut",
     "fr": "l'astronaute"
    }
   ]
  },
  {
   "id": "f068",
   "root": {
    "gr": "ζέστη",
    "lat": "zesti",
    "en": "heat",
    "fr": "chaleur"
   },
   "members": [
    {
     "gr": "ζεστός",
     "lat": "zestos",
     "en": "hot, warm",
     "fr": "chaud"
    },
    {
     "gr": "ζεσταίνω",
     "lat": "zesteno",
     "en": "I warm up",
     "fr": "je chauffe"
    },
    {
     "gr": "η ζεστασιά",
     "lat": "i zestasia",
     "en": "warmth",
     "fr": "la chaleur (humaine)"
    }
   ]
  },
  {
   "id": "f069",
   "root": {
    "gr": "πάγος",
    "lat": "pagos",
    "en": "ice",
    "fr": "glace"
   },
   "members": [
    {
     "gr": "παγωμένος",
     "lat": "pagomenos",
     "en": "frozen",
     "fr": "gelé"
    },
    {
     "gr": "το παγωτό",
     "lat": "to pagoto",
     "en": "the ice cream",
     "fr": "la glace"
    },
    {
     "gr": "παγώνω",
     "lat": "pagono",
     "en": "I freeze",
     "fr": "je gèle"
    },
    {
     "gr": "το παγάκι",
     "lat": "to pagaki",
     "en": "the ice cube",
     "fr": "le glaçon"
    },
    {
     "gr": "ο παγετώνας",
     "lat": "o payetonas",
     "en": "the glacier",
     "fr": "le glacier"
    }
   ]
  },
  {
   "id": "f070",
   "root": {
    "gr": "καθαρός",
    "lat": "katharos",
    "en": "clean, clear",
    "fr": "propre, clair"
   },
   "members": [
    {
     "gr": "καθαρίζω",
     "lat": "katharizo",
     "en": "I clean",
     "fr": "je nettoie"
    },
    {
     "gr": "η καθαριότητα",
     "lat": "i kathariotita",
     "en": "cleanliness",
     "fr": "la propreté"
    },
    {
     "gr": "ο καθαρισμός",
     "lat": "o katharismos",
     "en": "the cleaning",
     "fr": "le nettoyage"
    },
    {
     "gr": "η καθαρίστρια",
     "lat": "i katharistria",
     "en": "the (woman) cleaner",
     "fr": "la femme de ménage"
    },
    {
     "gr": "το καθαριστήριο",
     "lat": "to katharistirio",
     "en": "the dry cleaner's",
     "fr": "le pressing"
    }
   ]
  },
  {
   "id": "f071",
   "root": {
    "gr": "ανοίγω",
    "lat": "anigo",
    "en": "I open",
    "fr": "j'ouvre"
   },
   "members": [
    {
     "gr": "το άνοιγμα",
     "lat": "to anigma",
     "en": "the opening",
     "fr": "l'ouverture"
    },
    {
     "gr": "ανοιχτός",
     "lat": "anichtos",
     "en": "open",
     "fr": "ouvert"
    },
    {
     "gr": "το ανοιχτήρι",
     "lat": "to anichtiri",
     "en": "the opener",
     "fr": "l'ouvre-boîte"
    },
    {
     "gr": "η άνοιξη",
     "lat": "i anixi",
     "en": "spring",
     "fr": "le printemps"
    }
   ]
  },
  {
   "id": "f072",
   "root": {
    "gr": "κλείνω",
    "lat": "klino",
    "en": "I close",
    "fr": "je ferme"
   },
   "members": [
    {
     "gr": "κλειστός",
     "lat": "klistos",
     "en": "closed",
     "fr": "fermé"
    },
    {
     "gr": "το κλειδί",
     "lat": "to klidi",
     "en": "the key",
     "fr": "la clé"
    },
    {
     "gr": "η κλειδαριά",
     "lat": "i klidaria",
     "en": "the lock",
     "fr": "la serrure"
    },
    {
     "gr": "κλειδώνω",
     "lat": "klidono",
     "en": "I lock",
     "fr": "je ferme à clé"
    }
   ]
  },
  {
   "id": "f073",
   "root": {
    "gr": "δίνω",
    "lat": "dino",
    "en": "I give",
    "fr": "je donne"
   },
   "members": [
    {
     "gr": "το δώρο",
     "lat": "to doro",
     "en": "the gift",
     "fr": "le cadeau"
    },
    {
     "gr": "δωρεάν",
     "lat": "dorean",
     "en": "free of charge",
     "fr": "gratuit"
    },
    {
     "gr": "η δωρεά",
     "lat": "i dorea",
     "en": "the donation",
     "fr": "le don"
    },
    {
     "gr": "η δόση",
     "lat": "i dosi",
     "en": "the instalment, the dose",
     "fr": "le versement, la dose"
    },
    {
     "gr": "ο δότης",
     "lat": "o dotis",
     "en": "the donor",
     "fr": "le donneur"
    }
   ]
  },
  {
   "id": "f074",
   "root": {
    "gr": "ρωτώ",
    "lat": "roto",
    "en": "I ask",
    "fr": "je demande"
   },
   "members": [
    {
     "gr": "η ερώτηση",
     "lat": "i erotisi",
     "en": "the question",
     "fr": "la question"
    },
    {
     "gr": "το ερωτηματικό",
     "lat": "to erotimatiko",
     "en": "the question mark",
     "fr": "le point d'interrogation"
    },
    {
     "gr": "το ερωτηματολόγιο",
     "lat": "to erotimatoloyio",
     "en": "the questionnaire",
     "fr": "le questionnaire"
    }
   ]
  },
  {
   "id": "f075",
   "root": {
    "gr": "μπαίνω",
    "lat": "beno",
    "en": "I go in",
    "fr": "j'entre"
   },
   "members": [
    {
     "gr": "η είσοδος",
     "lat": "i isodos",
     "en": "the entrance",
     "fr": "l'entrée"
    },
    {
     "gr": "το εισιτήριο",
     "lat": "to isitirio",
     "en": "the ticket",
     "fr": "le billet"
    },
    {
     "gr": "η εισαγωγή",
     "lat": "i isagoyi",
     "en": "the introduction, the import",
     "fr": "l'introduction, l'importation"
    }
   ]
  },
  {
   "id": "f076",
   "root": {
    "gr": "βγαίνω",
    "lat": "vyeno",
    "en": "I go out",
    "fr": "je sors"
   },
   "members": [
    {
     "gr": "η έξοδος",
     "lat": "i exodos",
     "en": "the exit",
     "fr": "la sortie"
    },
    {
     "gr": "η εξαγωγή",
     "lat": "i exagoyi",
     "en": "the export",
     "fr": "l'exportation"
    },
    {
     "gr": "βγάζω",
     "lat": "vgazo",
     "en": "I take out",
     "fr": "je sors (quelque chose)"
    }
   ]
  },
  {
   "id": "f077",
   "root": {
    "gr": "ανεβαίνω",
    "lat": "aneveno",
    "en": "I go up",
    "fr": "je monte"
   },
   "members": [
    {
     "gr": "η ανάβαση",
     "lat": "i anavasi",
     "en": "the climb",
     "fr": "la montée"
    },
    {
     "gr": "η άνοδος",
     "lat": "i anodos",
     "en": "the rise",
     "fr": "la hausse"
    },
    {
     "gr": "η ανηφόρα",
     "lat": "i anifora",
     "en": "the uphill road",
     "fr": "la montée (route)"
    },
    {
     "gr": "ανεβάζω",
     "lat": "anevazo",
     "en": "I raise",
     "fr": "je monte (quelque chose)"
    }
   ]
  },
  {
   "id": "f078",
   "root": {
    "gr": "κατεβαίνω",
    "lat": "kateveno",
    "en": "I go down",
    "fr": "je descends"
   },
   "members": [
    {
     "gr": "η κατάβαση",
     "lat": "i katavasi",
     "en": "the descent",
     "fr": "la descente"
    },
    {
     "gr": "η κάθοδος",
     "lat": "i kathodos",
     "en": "the going down",
     "fr": "la descente"
    },
    {
     "gr": "η κατηφόρα",
     "lat": "i katifora",
     "en": "the downhill road",
     "fr": "la descente (route)"
    },
    {
     "gr": "κατεβάζω",
     "lat": "katevazo",
     "en": "I lower",
     "fr": "je baisse"
    }
   ]
  },
  {
   "id": "f079",
   "root": {
    "gr": "αρχή",
    "lat": "archi",
    "en": "beginning",
    "fr": "début"
   },
   "members": [
    {
     "gr": "αρχίζω",
     "lat": "archizo",
     "en": "I begin",
     "fr": "je commence"
    },
    {
     "gr": "αρχικός",
     "lat": "archikos",
     "en": "initial",
     "fr": "initial"
    },
    {
     "gr": "ο αρχηγός",
     "lat": "o archigos",
     "en": "the leader",
     "fr": "le chef"
    },
    {
     "gr": "αρχαίος",
     "lat": "archeos",
     "en": "ancient",
     "fr": "ancien, antique"
    },
    {
     "gr": "ο αρχιτέκτονας",
     "lat": "o architektonas",
     "en": "the architect",
     "fr": "l'architecte"
    }
   ]
  },
  {
   "id": "f080",
   "root": {
    "gr": "τέλος",
    "lat": "telos",
    "en": "end",
    "fr": "fin"
   },
   "members": [
    {
     "gr": "τελειώνω",
     "lat": "teliono",
     "en": "I finish",
     "fr": "je termine"
    },
    {
     "gr": "τελικός",
     "lat": "telikos",
     "en": "final",
     "fr": "final"
    },
    {
     "gr": "τέλειος",
     "lat": "telios",
     "en": "perfect",
     "fr": "parfait"
    },
    {
     "gr": "τελευταίος",
     "lat": "telefteos",
     "en": "last",
     "fr": "dernier"
    },
    {
     "gr": "τελείως",
     "lat": "telios",
     "en": "completely",
     "fr": "complètement"
    }
   ]
  },
  {
   "id": "f081",
   "root": {
    "gr": "μαγειρεύω",
    "lat": "mayirevo",
    "en": "I cook",
    "fr": "je cuisine"
   },
   "members": [
    {
     "gr": "ο μάγειρας",
     "lat": "o mayiras",
     "en": "the cook",
     "fr": "le cuisinier"
    },
    {
     "gr": "η μαγείρισσα",
     "lat": "i mayirissa",
     "en": "the (woman) cook",
     "fr": "la cuisinière"
    },
    {
     "gr": "η μαγειρική",
     "lat": "i mayiriki",
     "en": "cooking",
     "fr": "la cuisine (l'art)"
    },
    {
     "gr": "το μαγειρείο",
     "lat": "to mayirio",
     "en": "the canteen",
     "fr": "la gargote"
    }
   ]
  },
  {
   "id": "f082",
   "root": {
    "gr": "ψήνω",
    "lat": "psino",
    "en": "I bake, I grill",
    "fr": "je fais cuire (au four, au gril)"
   },
   "members": [
    {
     "gr": "το ψητό",
     "lat": "to psito",
     "en": "the roast",
     "fr": "le rôti"
    },
    {
     "gr": "ψημένος",
     "lat": "psimenos",
     "en": "cooked, baked",
     "fr": "cuit"
    },
    {
     "gr": "η ψησταριά",
     "lat": "i psistaria",
     "en": "the grill restaurant",
     "fr": "la grillade (restaurant)"
    },
    {
     "gr": "το ψητοπωλείο",
     "lat": "to psitopolio",
     "en": "the grill shop",
     "fr": "le rôtisseur"
    }
   ]
  },
  {
   "id": "f083",
   "root": {
    "gr": "βράζω",
    "lat": "vrazo",
    "en": "I boil",
    "fr": "je fais bouillir"
   },
   "members": [
    {
     "gr": "βραστός",
     "lat": "vrastos",
     "en": "boiled",
     "fr": "bouilli"
    },
    {
     "gr": "το βραστό",
     "lat": "to vrasto",
     "en": "boiled meat",
     "fr": "le bouilli"
    },
    {
     "gr": "ο βρασμός",
     "lat": "o vrasmos",
     "en": "the boiling",
     "fr": "l'ébullition"
    },
    {
     "gr": "ο βραστήρας",
     "lat": "o vrastiras",
     "en": "the kettle",
     "fr": "la bouilloire"
    }
   ]
  },
  {
   "id": "f084",
   "root": {
    "gr": "τηγανίζω",
    "lat": "tiganizo",
    "en": "I fry",
    "fr": "je fais frire"
   },
   "members": [
    {
     "gr": "το τηγάνι",
     "lat": "to tigani",
     "en": "the frying pan",
     "fr": "la poêle"
    },
    {
     "gr": "τηγανητός",
     "lat": "tiganitos",
     "en": "fried",
     "fr": "frit"
    },
    {
     "gr": "τα τηγανητά",
     "lat": "ta tiganita",
     "en": "fried food",
     "fr": "les fritures"
    },
    {
     "gr": "η τηγανιά",
     "lat": "i tigania",
     "en": "a panful",
     "fr": "une poêlée"
    }
   ]
  },
  {
   "id": "f085",
   "root": {
    "gr": "λεμόνι",
    "lat": "lemoni",
    "en": "lemon",
    "fr": "citron"
   },
   "members": [
    {
     "gr": "η λεμονιά",
     "lat": "i lemonia",
     "en": "the lemon tree",
     "fr": "le citronnier"
    },
    {
     "gr": "η λεμονάδα",
     "lat": "i lemonada",
     "en": "the lemonade",
     "fr": "la citronnade"
    },
    {
     "gr": "το λεμονόχυμο",
     "lat": "to lemonochimo",
     "en": "lemon juice",
     "fr": "le jus de citron"
    }
   ]
  },
  {
   "id": "f086",
   "root": {
    "gr": "πορτοκάλι",
    "lat": "portokali",
    "en": "orange",
    "fr": "orange"
   },
   "members": [
    {
     "gr": "η πορτοκαλιά",
     "lat": "i portokalia",
     "en": "the orange tree",
     "fr": "l'oranger"
    },
    {
     "gr": "η πορτοκαλάδα",
     "lat": "i portokalada",
     "en": "orange juice",
     "fr": "le jus d'orange"
    },
    {
     "gr": "πορτοκαλί",
     "lat": "portokali",
     "en": "orange (colour)",
     "fr": "orange (couleur)"
    }
   ]
  },
  {
   "id": "f087",
   "root": {
    "gr": "μέλι",
    "lat": "meli",
    "en": "honey",
    "fr": "miel"
   },
   "members": [
    {
     "gr": "η μέλισσα",
     "lat": "i melissa",
     "en": "the bee",
     "fr": "l'abeille"
    },
    {
     "gr": "ο μελισσοκόμος",
     "lat": "o melissokomos",
     "en": "the beekeeper",
     "fr": "l'apiculteur"
    },
    {
     "gr": "το μελομακάρονο",
     "lat": "to melomakarono",
     "en": "honey biscuit",
     "fr": "biscuit au miel"
    },
    {
     "gr": "μελένιος",
     "lat": "melenios",
     "en": "sweet as honey",
     "fr": "doux comme le miel"
    }
   ]
  },
  {
   "id": "f088",
   "root": {
    "gr": "πίτα",
    "lat": "pita",
    "en": "pie, pita",
    "fr": "tourte, pita"
   },
   "members": [
    {
     "gr": "η τυρόπιτα",
     "lat": "i tiropita",
     "en": "cheese pie",
     "fr": "tourte au fromage"
    },
    {
     "gr": "η σπανακόπιτα",
     "lat": "i spanakopita",
     "en": "spinach pie",
     "fr": "tourte aux épinards"
    },
    {
     "gr": "η μηλόπιτα",
     "lat": "i milopita",
     "en": "apple pie",
     "fr": "tarte aux pommes"
    },
    {
     "gr": "η κοτόπιτα",
     "lat": "i kotopita",
     "en": "chicken pie",
     "fr": "tourte au poulet"
    }
   ]
  },
  {
   "id": "f089",
   "root": {
    "gr": "αμπέλι",
    "lat": "ambeli",
    "en": "vineyard",
    "fr": "vigne"
   },
   "members": [
    {
     "gr": "ο αμπελώνας",
     "lat": "o ambelonas",
     "en": "the vineyard (large)",
     "fr": "le vignoble"
    },
    {
     "gr": "ο αμπελουργός",
     "lat": "o ambelourgos",
     "en": "the winegrower",
     "fr": "le viticulteur"
    },
    {
     "gr": "η αμπελουργία",
     "lat": "i ambelouryia",
     "en": "wine growing",
     "fr": "la viticulture"
    }
   ]
  },
  {
   "id": "f090",
   "root": {
    "gr": "πόδι",
    "lat": "podi",
    "en": "foot, leg",
    "fr": "pied, jambe"
   },
   "members": [
    {
     "gr": "το ποδήλατο",
     "lat": "to podilato",
     "en": "the bicycle",
     "fr": "le vélo"
    },
    {
     "gr": "ο ποδηλάτης",
     "lat": "o podilatis",
     "en": "the cyclist",
     "fr": "le cycliste"
    },
    {
     "gr": "το ποδόσφαιρο",
     "lat": "to podosfero",
     "en": "football",
     "fr": "le football"
    },
    {
     "gr": "ο ποδοσφαιριστής",
     "lat": "o podosferistis",
     "en": "the football player",
     "fr": "le footballeur"
    },
    {
     "gr": "η ποδηλασία",
     "lat": "i podilasia",
     "en": "cycling",
     "fr": "le cyclisme"
    }
   ]
  },
  {
   "id": "f091",
   "root": {
    "gr": "χέρι",
    "lat": "cheri",
    "en": "hand",
    "fr": "main"
   },
   "members": [
    {
     "gr": "το χειροκρότημα",
     "lat": "to chirokrotima",
     "en": "the applause",
     "fr": "les applaudissements"
    },
    {
     "gr": "χειροποίητος",
     "lat": "chiropiitos",
     "en": "handmade",
     "fr": "fait à la main"
    },
    {
     "gr": "ο χειρουργός",
     "lat": "o chirourgos",
     "en": "the surgeon",
     "fr": "le chirurgien"
    },
    {
     "gr": "το χειρόφρενο",
     "lat": "to chirofreno",
     "en": "the handbrake",
     "fr": "le frein à main"
    },
    {
     "gr": "η χειροτεχνία",
     "lat": "i chirotechnia",
     "en": "handicraft",
     "fr": "l'artisanat"
    }
   ]
  },
  {
   "id": "f092",
   "root": {
    "gr": "δόντι",
    "lat": "dondi",
    "en": "tooth",
    "fr": "dent"
   },
   "members": [
    {
     "gr": "ο οδοντίατρος",
     "lat": "o odondiatros",
     "en": "the dentist",
     "fr": "le dentiste"
    },
    {
     "gr": "η οδοντόβουρτσα",
     "lat": "i odondovourtsa",
     "en": "the toothbrush",
     "fr": "la brosse à dents"
    },
    {
     "gr": "η οδοντόκρεμα",
     "lat": "i odondokrema",
     "en": "the toothpaste",
     "fr": "le dentifrice"
    },
    {
     "gr": "το οδοντιατρείο",
     "lat": "to odondiatrio",
     "en": "the dentist's office",
     "fr": "le cabinet dentaire"
    }
   ]
  },
  {
   "id": "f093",
   "root": {
    "gr": "καρδιά",
    "lat": "kardia",
    "en": "heart",
    "fr": "cœur"
   },
   "members": [
    {
     "gr": "καρδιακός",
     "lat": "kardiakos",
     "en": "of the heart",
     "fr": "cardiaque"
    },
    {
     "gr": "ο καρδιολόγος",
     "lat": "o kardiologos",
     "en": "the cardiologist",
     "fr": "le cardiologue"
    },
    {
     "gr": "το καρδιοχτύπι",
     "lat": "to kardiochtipi",
     "en": "the heartbeat (pounding)",
     "fr": "le battement de cœur"
    }
   ]
  },
  {
   "id": "f094",
   "root": {
    "gr": "ακούω",
    "lat": "akouo",
    "en": "I hear, I listen",
    "fr": "j'entends, j'écoute"
   },
   "members": [
    {
     "gr": "η ακοή",
     "lat": "i akoi",
     "en": "hearing",
     "fr": "l'ouïe"
    },
    {
     "gr": "τα ακουστικά",
     "lat": "ta akoustika",
     "en": "headphones",
     "fr": "le casque, les écouteurs"
    },
    {
     "gr": "ο ακροατής",
     "lat": "o akroatis",
     "en": "the listener",
     "fr": "l'auditeur"
    },
    {
     "gr": "η ακρόαση",
     "lat": "i akroasi",
     "en": "the hearing, the audition",
     "fr": "l'audition"
    }
   ]
  },
  {
   "id": "f095",
   "root": {
    "gr": "βλέπω",
    "lat": "vlepo",
    "en": "I see",
    "fr": "je vois"
   },
   "members": [
    {
     "gr": "το βλέμμα",
     "lat": "to vlemma",
     "en": "the look",
     "fr": "le regard"
    },
    {
     "gr": "η όραση",
     "lat": "i orasi",
     "en": "sight",
     "fr": "la vue (sens)"
    },
    {
     "gr": "ορατός",
     "lat": "oratos",
     "en": "visible",
     "fr": "visible"
    },
    {
     "gr": "αόρατος",
     "lat": "aoratos",
     "en": "invisible",
     "fr": "invisible"
    }
   ]
  },
  {
   "id": "f096",
   "root": {
    "gr": "πλένω",
    "lat": "pleno",
    "en": "I wash",
    "fr": "je lave"
   },
   "members": [
    {
     "gr": "το πλύσιμο",
     "lat": "to plisimo",
     "en": "the washing",
     "fr": "le lavage"
    },
    {
     "gr": "το πλυντήριο",
     "lat": "to plindirio",
     "en": "the washing machine",
     "fr": "le lave-linge"
    },
    {
     "gr": "το πλυσταριό",
     "lat": "to plistario",
     "en": "the laundry",
     "fr": "la laverie"
    },
    {
     "gr": "η πλύση",
     "lat": "i plisi",
     "en": "the wash",
     "fr": "le lavage (rinçage)"
    }
   ]
  },
  {
   "id": "f097",
   "root": {
    "gr": "ήχος",
    "lat": "ichos",
    "en": "sound",
    "fr": "son"
   },
   "members": [
    {
     "gr": "η ηχώ",
     "lat": "i icho",
     "en": "the echo",
     "fr": "l'écho"
    },
    {
     "gr": "το ηχείο",
     "lat": "to ichio",
     "en": "the speaker",
     "fr": "l'enceinte"
    },
    {
     "gr": "ηχητικός",
     "lat": "ichitikos",
     "en": "of sound",
     "fr": "sonore"
    },
    {
     "gr": "η ηχογράφηση",
     "lat": "i ichografisi",
     "en": "the recording",
     "fr": "l'enregistrement"
    }
   ]
  },
  {
   "id": "f098",
   "root": {
    "gr": "κήπος",
    "lat": "kipos",
    "en": "garden",
    "fr": "jardin"
   },
   "members": [
    {
     "gr": "ο κηπουρός",
     "lat": "o kipouros",
     "en": "the gardener",
     "fr": "le jardinier"
    },
    {
     "gr": "η κηπουρική",
     "lat": "i kipouriki",
     "en": "gardening",
     "fr": "le jardinage"
    }
   ]
  },
  {
   "id": "f099",
   "root": {
    "gr": "ανθός",
    "lat": "anthos",
    "en": "blossom",
    "fr": "fleur (d'arbre)"
   },
   "members": [
    {
     "gr": "ανθίζω",
     "lat": "anthizo",
     "en": "I bloom",
     "fr": "je fleuris"
    },
    {
     "gr": "ανθισμένος",
     "lat": "anthismenos",
     "en": "in bloom",
     "fr": "en fleur"
    },
    {
     "gr": "το ανθοπωλείο",
     "lat": "to anthopolio",
     "en": "the flower shop",
     "fr": "le fleuriste (boutique)"
    },
    {
     "gr": "ο ανθοπώλης",
     "lat": "o anthopolis",
     "en": "the florist",
     "fr": "le fleuriste"
    },
    {
     "gr": "η ανθοδέσμη",
     "lat": "i anthodesmi",
     "en": "the bouquet",
     "fr": "le bouquet"
    }
   ]
  }
 ]
};
