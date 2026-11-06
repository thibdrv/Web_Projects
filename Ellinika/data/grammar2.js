// More grammar: nouns and adjectives, cases, negation and questions. Edit freely.
//  - plural: "bad" = three wrong plurals shown in the Choose game.
//  - adjectives: masculine m, feminine f, neuter n, masculine plural mpl (only used as a wrong answer).
//  - adjNouns: the nouns the adjectives go with ("animate" = a person or an animal).
//  - cases: the subject (nominative) and the object (accusative) of a sentence.
//  - negation: "δεν" for statements. stop: "μη" or "μην" for orders: μην before a vowel or κ π τ ξ ψ, μη before the others.
//  - Every Greek text in a field named sg, pl, m, f, n, nom, acc, pos, neg, say or sentence gets a recording
//    (tools/make_audio.py makes it). The other Greek fields ("bad", "mpl", "blank"...) are only shown on screen.
//  - "en" and "fr" are the meanings shown.
const GRAMMAR2 = {
  "plural": [
    {"sg": "ο φίλος", "pl": "οι φίλοι", "en": "friend", "fr": "ami", "rule": "-ος → -οι", "bad": ["οι φίλες", "τα φίλα", "οι φίλεις"]},
    {"sg": "ο δάσκαλος", "pl": "οι δάσκαλοι", "en": "teacher", "fr": "professeur", "rule": "-ος → -οι", "bad": ["οι δάσκαλες", "τα δάσκαλα", "οι δάσκαλεις"]},
    {"sg": "ο σκύλος", "pl": "οι σκύλοι", "en": "dog", "fr": "chien", "rule": "-ος → -οι", "bad": ["οι σκύλες", "τα σκύλα", "οι σκύλεις"]},
    {"sg": "ο άντρας", "pl": "οι άντρες", "en": "man", "fr": "homme", "rule": "-ας → -ες", "bad": ["οι άντροι", "τα άντρα", "οι άντρεις"]},
    {"sg": "ο πατέρας", "pl": "οι πατέρες", "en": "father", "fr": "père", "rule": "-ας → -ες", "bad": ["οι πατέροι", "τα πατέρα", "οι πατέρεις"]},
    {"sg": "ο μαθητής", "pl": "οι μαθητές", "en": "student", "fr": "élève", "rule": "-ής → -ές", "bad": ["οι μαθητοί", "τα μαθητά", "οι μαθητείς"]},
    {"sg": "η γυναίκα", "pl": "οι γυναίκες", "en": "woman", "fr": "femme", "rule": "-α → -ες", "bad": ["οι γυναίκοι", "τα γυναίκα", "οι γυναίκεις"]},
    {"sg": "η μέρα", "pl": "οι μέρες", "en": "day", "fr": "jour", "rule": "-α → -ες", "bad": ["οι μέροι", "τα μέρα", "οι μέρεις"]},
    {"sg": "η θάλασσα", "pl": "οι θάλασσες", "en": "sea", "fr": "mer", "rule": "-α → -ες", "bad": ["οι θάλασσοι", "τα θάλασσα", "οι θάλασσεις"]},
    {"sg": "η γάτα", "pl": "οι γάτες", "en": "cat", "fr": "chat", "rule": "-α → -ες", "bad": ["οι γάτοι", "τα γάτα", "οι γάτεις"]},
    {"sg": "η τσάντα", "pl": "οι τσάντες", "en": "bag", "fr": "sac", "rule": "-α → -ες", "bad": ["οι τσάντοι", "τα τσάντα", "οι τσάντεις"]},
    {"sg": "η αδερφή", "pl": "οι αδερφές", "en": "sister", "fr": "sœur", "rule": "-ή → -ές", "bad": ["οι αδερφείς", "οι αδερφή", "τα αδερφά"]},
    {"sg": "η πόλη", "pl": "οι πόλεις", "en": "city", "fr": "ville", "rule": "-η → -εις", "bad": ["οι πόλοι", "τα πόλα", "οι πόλη"]},
    {"sg": "το παιδί", "pl": "τα παιδιά", "en": "child", "fr": "enfant", "rule": "-ί → -ιά", "bad": ["οι παιδιά", "τα παιδιέ", "τα παιδιοί"]},
    {"sg": "το σπίτι", "pl": "τα σπίτια", "en": "house", "fr": "maison", "rule": "-ι → -ια", "bad": ["οι σπίτια", "τα σπίτιες", "τα σπίτιοι"]},
    {"sg": "το μάτι", "pl": "τα μάτια", "en": "eye", "fr": "œil", "rule": "-ι → -ια", "bad": ["οι μάτια", "τα μάτιες", "τα μάτιοι"]},
    {"sg": "το βιβλίο", "pl": "τα βιβλία", "en": "book", "fr": "livre", "rule": "-ιο → -ια", "bad": ["οι βιβλία", "τα βιβλίες", "τα βιβλίοι"]},
    {"sg": "το μήλο", "pl": "τα μήλα", "en": "apple", "fr": "pomme", "rule": "-ο → -α", "bad": ["οι μήλα", "τα μήλες", "τα μήλοι"]},
    {"sg": "το αυτοκίνητο", "pl": "τα αυτοκίνητα", "en": "car", "fr": "voiture", "rule": "-ο → -α", "bad": ["οι αυτοκίνητα", "τα αυτοκίνητες", "τα αυτοκίνητοι"]},
    {"sg": "το νερό", "pl": "τα νερά", "en": "water", "fr": "eau", "rule": "-ό → -ά", "bad": ["οι νερά", "τα νερές", "τα νεροί"]}
  ],

  "adjectives": [
    {"m": "μεγάλος", "f": "μεγάλη", "n": "μεγάλο", "mpl": "μεγάλοι", "en": "big", "fr": "grand"},
    {"m": "μικρός", "f": "μικρή", "n": "μικρό", "mpl": "μικροί", "en": "small", "fr": "petit"},
    {"m": "καλός", "f": "καλή", "n": "καλό", "mpl": "καλοί", "en": "good", "fr": "bon"},
    {"m": "κακός", "f": "κακή", "n": "κακό", "mpl": "κακοί", "en": "bad", "fr": "mauvais"},
    {"m": "όμορφος", "f": "όμορφη", "n": "όμορφο", "mpl": "όμορφοι", "en": "beautiful", "fr": "beau"},
    {"m": "ψηλός", "f": "ψηλή", "n": "ψηλό", "mpl": "ψηλοί", "en": "tall", "fr": "grand (de taille)"},
    {"m": "νέος", "f": "νέα", "n": "νέο", "mpl": "νέοι", "en": "young, new", "fr": "jeune, nouveau"},
    {"m": "παλιός", "f": "παλιά", "n": "παλιό", "mpl": "παλιοί", "en": "old", "fr": "vieux"},
    {"m": "καινούργιος", "f": "καινούργια", "n": "καινούργιο", "mpl": "καινούργιοι", "en": "brand new", "fr": "neuf"},
    {"m": "χαρούμενος", "f": "χαρούμενη", "n": "χαρούμενο", "mpl": "χαρούμενοι", "en": "happy", "fr": "content", "people": true},
    {"m": "κουρασμένος", "f": "κουρασμένη", "n": "κουρασμένο", "mpl": "κουρασμένοι", "en": "tired", "fr": "fatigué", "people": true},
    {"m": "φτωχός", "f": "φτωχή", "n": "φτωχό", "mpl": "φτωχοί", "en": "poor", "fr": "pauvre", "people": true}
  ],
  "adjNouns": [
    {"art": "ο", "noun": "άντρας", "g": "m", "en": "man", "fr": "homme", "animate": true},
    {"art": "η", "noun": "γυναίκα", "g": "f", "en": "woman", "fr": "femme", "animate": true},
    {"art": "το", "noun": "παιδί", "g": "n", "en": "child", "fr": "enfant", "animate": true},
    {"art": "ο", "noun": "φίλος", "g": "m", "en": "friend", "fr": "ami", "animate": true},
    {"art": "ο", "noun": "σκύλος", "g": "m", "en": "dog", "fr": "chien", "animate": true},
    {"art": "η", "noun": "γάτα", "g": "f", "en": "cat", "fr": "chat", "animate": true},
    {"art": "η", "noun": "μέρα", "g": "f", "en": "day", "fr": "jour"},
    {"art": "το", "noun": "σπίτι", "g": "n", "en": "house", "fr": "maison"},
    {"art": "η", "noun": "πόλη", "g": "f", "en": "city", "fr": "ville"},
    {"art": "το", "noun": "βιβλίο", "g": "n", "en": "book", "fr": "livre"},
    {"art": "το", "noun": "αυτοκίνητο", "g": "n", "en": "car", "fr": "voiture"},
    {"art": "η", "noun": "τσάντα", "g": "f", "en": "bag", "fr": "sac"}
  ],

  "cases": [
    {"nom": "ο φίλος", "acc": "τον φίλο", "g": "m", "nomNoun": "φίλος", "accNoun": "φίλο", "en": "friend", "fr": "ami", "sentence": "Βλέπω τον φίλο.", "sentEn": "I see the friend.", "sentFr": "Je vois l'ami."},
    {"nom": "ο άντρας", "acc": "τον άντρα", "g": "m", "nomNoun": "άντρας", "accNoun": "άντρα", "en": "man", "fr": "homme", "sentence": "Βλέπω τον άντρα.", "sentEn": "I see the man.", "sentFr": "Je vois l'homme."},
    {"nom": "ο δάσκαλος", "acc": "τον δάσκαλο", "g": "m", "nomNoun": "δάσκαλος", "accNoun": "δάσκαλο", "en": "teacher", "fr": "professeur", "sentence": "Βλέπω τον δάσκαλο.", "sentEn": "I see the teacher.", "sentFr": "Je vois le professeur."},
    {"nom": "ο μαθητής", "acc": "τον μαθητή", "g": "m", "nomNoun": "μαθητής", "accNoun": "μαθητή", "en": "student", "fr": "élève", "sentence": "Βλέπω τον μαθητή.", "sentEn": "I see the student.", "sentFr": "Je vois l'élève."},
    {"nom": "ο σκύλος", "acc": "τον σκύλο", "g": "m", "nomNoun": "σκύλος", "accNoun": "σκύλο", "en": "dog", "fr": "chien", "sentence": "Βλέπω τον σκύλο.", "sentEn": "I see the dog.", "sentFr": "Je vois le chien."},
    {"nom": "η γυναίκα", "acc": "τη γυναίκα", "g": "f", "nomNoun": "γυναίκα", "accNoun": "γυναίκα", "en": "woman", "fr": "femme", "sentence": "Βλέπω τη γυναίκα.", "sentEn": "I see the woman.", "sentFr": "Je vois la femme."},
    {"nom": "η μητέρα", "acc": "τη μητέρα", "g": "f", "nomNoun": "μητέρα", "accNoun": "μητέρα", "en": "mother", "fr": "mère", "sentence": "Βλέπω τη μητέρα.", "sentEn": "I see the mother.", "sentFr": "Je vois la mère."},
    {"nom": "η θάλασσα", "acc": "τη θάλασσα", "g": "f", "nomNoun": "θάλασσα", "accNoun": "θάλασσα", "en": "sea", "fr": "mer", "sentence": "Βλέπω τη θάλασσα.", "sentEn": "I see the sea.", "sentFr": "Je vois la mer."},
    {"nom": "η γάτα", "acc": "τη γάτα", "g": "f", "nomNoun": "γάτα", "accNoun": "γάτα", "en": "cat", "fr": "chat", "sentence": "Βλέπω τη γάτα.", "sentEn": "I see the cat.", "sentFr": "Je vois le chat."},
    {"nom": "η αδερφή", "acc": "την αδερφή", "g": "f", "nomNoun": "αδερφή", "accNoun": "αδερφή", "en": "sister", "fr": "sœur", "sentence": "Βλέπω την αδερφή.", "sentEn": "I see the sister.", "sentFr": "Je vois la sœur."},
    {"nom": "η πόλη", "acc": "την πόλη", "g": "f", "nomNoun": "πόλη", "accNoun": "πόλη", "en": "city", "fr": "ville", "sentence": "Βλέπω την πόλη.", "sentEn": "I see the city.", "sentFr": "Je vois la ville."},
    {"nom": "η τσάντα", "acc": "την τσάντα", "g": "f", "nomNoun": "τσάντα", "accNoun": "τσάντα", "en": "bag", "fr": "sac", "sentence": "Βλέπω την τσάντα.", "sentEn": "I see the bag.", "sentFr": "Je vois le sac."},
    {"nom": "η κόρη", "acc": "την κόρη", "g": "f", "nomNoun": "κόρη", "accNoun": "κόρη", "en": "daughter", "fr": "fille", "sentence": "Βλέπω την κόρη.", "sentEn": "I see the daughter.", "sentFr": "Je vois la fille."},
    {"nom": "το παιδί", "acc": "το παιδί", "g": "n", "nomNoun": "παιδί", "accNoun": "παιδί", "en": "child", "fr": "enfant", "sentence": "Βλέπω το παιδί.", "sentEn": "I see the child.", "sentFr": "Je vois l'enfant."},
    {"nom": "το σπίτι", "acc": "το σπίτι", "g": "n", "nomNoun": "σπίτι", "accNoun": "σπίτι", "en": "house", "fr": "maison", "sentence": "Βλέπω το σπίτι.", "sentEn": "I see the house.", "sentFr": "Je vois la maison."},
    {"nom": "το βιβλίο", "acc": "το βιβλίο", "g": "n", "nomNoun": "βιβλίο", "accNoun": "βιβλίο", "en": "book", "fr": "livre", "sentence": "Βλέπω το βιβλίο.", "sentEn": "I see the book.", "sentFr": "Je vois le livre."}
  ],

  "negation": [
    {"pos": "Μιλάω ελληνικά.", "neg": "Δεν μιλάω ελληνικά.", "enPos": "I speak Greek.", "enNeg": "I don't speak Greek.", "frPos": "Je parle grec.", "frNeg": "Je ne parle pas grec."},
    {"pos": "Έχω αδερφή.", "neg": "Δεν έχω αδερφή.", "enPos": "I have a sister.", "enNeg": "I don't have a sister.", "frPos": "J'ai une sœur.", "frNeg": "Je n'ai pas de sœur."},
    {"pos": "Θέλω καφέ.", "neg": "Δεν θέλω καφέ.", "enPos": "I want coffee.", "enNeg": "I don't want coffee.", "frPos": "Je veux du café.", "frNeg": "Je ne veux pas de café."},
    {"pos": "Καταλαβαίνω.", "neg": "Δεν καταλαβαίνω.", "enPos": "I understand.", "enNeg": "I don't understand.", "frPos": "Je comprends.", "frNeg": "Je ne comprends pas."},
    {"pos": "Πεινάω.", "neg": "Δεν πεινάω.", "enPos": "I am hungry.", "enNeg": "I am not hungry.", "frPos": "J'ai faim.", "frNeg": "Je n'ai pas faim."},
    {"pos": "Μου αρέσει.", "neg": "Δεν μου αρέσει.", "enPos": "I like it.", "enNeg": "I don't like it.", "frPos": "Ça me plaît.", "frNeg": "Ça ne me plaît pas."},
    {"pos": "Είμαι κουρασμένος.", "neg": "Δεν είμαι κουρασμένος.", "enPos": "I am tired.", "enNeg": "I am not tired.", "frPos": "Je suis fatigué.", "frNeg": "Je ne suis pas fatigué."},
    {"pos": "Μένω στην Αθήνα.", "neg": "Δεν μένω στην Αθήνα.", "enPos": "I live in Athens.", "enNeg": "I don't live in Athens.", "frPos": "J'habite à Athènes.", "frNeg": "Je n'habite pas à Athènes."},
    {"pos": "Ξέρω.", "neg": "Δεν ξέρω.", "enPos": "I know.", "enNeg": "I don't know.", "frPos": "Je sais.", "frNeg": "Je ne sais pas."},
    {"pos": "Πηγαίνω στο σπίτι.", "neg": "Δεν πηγαίνω στο σπίτι.", "enPos": "I am going home.", "enNeg": "I am not going home.", "frPos": "Je rentre.", "frNeg": "Je ne rentre pas."}
  ],
  "stop": [
    {"say": "Μην ανησυχείς!", "blank": "___ ανησυχείς!", "answer": "μην", "en": "Don't worry!", "fr": "Ne t'inquiète pas !"},
    {"say": "Μη φεύγεις!", "blank": "___ φεύγεις!", "answer": "μη", "en": "Don't leave!", "fr": "Ne pars pas !"},
    {"say": "Μην κλαις!", "blank": "___ κλαις!", "answer": "μην", "en": "Don't cry!", "fr": "Ne pleure pas !"},
    {"say": "Μη μιλάς!", "blank": "___ μιλάς!", "answer": "μη", "en": "Don't talk!", "fr": "Ne parle pas !"},
    {"say": "Μην ξεχάσεις!", "blank": "___ ξεχάσεις!", "answer": "μην", "en": "Don't forget!", "fr": "N'oublie pas !"},
    {"say": "Μη φοβάσαι!", "blank": "___ φοβάσαι!", "answer": "μη", "en": "Don't be afraid!", "fr": "N'aie pas peur !"}
  ],

  "qwords": [
    {"gr": "τι", "en": "what", "fr": "quoi, que"},
    {"gr": "ποιος", "en": "who", "fr": "qui"},
    {"gr": "πού", "en": "where", "fr": "où"},
    {"gr": "πότε", "en": "when", "fr": "quand"},
    {"gr": "γιατί", "en": "why", "fr": "pourquoi"},
    {"gr": "πώς", "en": "how", "fr": "comment"},
    {"gr": "πόσο", "en": "how much", "fr": "combien"},
    {"gr": "ποιο", "en": "which", "fr": "quel"}
  ],
  "questions": [
    {"say": "Πού μένεις;", "blank": "___ μένεις;", "answer": "πού", "en": "Where do you live?", "fr": "Où habites-tu ?"},
    {"say": "Τι κάνεις;", "blank": "___ κάνεις;", "answer": "τι", "en": "How are you?", "fr": "Comment vas-tu ?"},
    {"say": "Ποιος είναι αυτός;", "blank": "___ είναι αυτός;", "answer": "ποιος", "en": "Who is he?", "fr": "Qui est-ce ?"},
    {"say": "Πότε έρχεσαι;", "blank": "___ έρχεσαι;", "answer": "πότε", "en": "When are you coming?", "fr": "Quand viens-tu ?"},
    {"say": "Γιατί κλαις;", "blank": "___ κλαις;", "answer": "γιατί", "en": "Why are you crying?", "fr": "Pourquoi pleures-tu ?"},
    {"say": "Πώς σε λένε;", "blank": "___ σε λένε;", "answer": "πώς", "en": "What is your name?", "fr": "Comment tu t'appelles ?"},
    {"say": "Πόσο κάνει;", "blank": "___ κάνει;", "answer": "πόσο", "en": "How much is it?", "fr": "Combien ça coûte ?"},
    {"say": "Τι θέλεις;", "blank": "___ θέλεις;", "answer": "τι", "en": "What do you want?", "fr": "Que veux-tu ?"},
    {"say": "Πού πηγαίνεις;", "blank": "___ πηγαίνεις;", "answer": "πού", "en": "Where are you going?", "fr": "Où vas-tu ?"},
    {"say": "Πόσο χρονών είσαι;", "blank": "___ χρονών είσαι;", "answer": "πόσο", "en": "How old are you?", "fr": "Quel âge as-tu ?"},
    {"say": "Ποιο βιβλίο θέλεις;", "blank": "___ βιβλίο θέλεις;", "answer": "ποιο", "en": "Which book do you want?", "fr": "Quel livre veux-tu ?"}
  ]
};
