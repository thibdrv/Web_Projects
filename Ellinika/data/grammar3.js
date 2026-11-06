// More grammar: prepositions, possessives (my, your...) and the imperative. Edit freely.
//  - "words" are the cards of the Learn page; "items" are the sentences of the games: "say" the whole sentence (it gets a recording),
//    "blank" the same sentence with ___ where the answer goes, "answer" the Greek word that fills it, "en" / "fr" the meaning.
//  - In "imperative" words, "sg" is the form for one person you know, "pl" the form for several people or a polite "you".
const GRAMMAR3 = {
  "prepositions": {
    "words": [
      {"gr": "σε", "en": "in, at, to (στο, στη, στην, στον)", "fr": "dans, à (στο, στη, στην, στον)"},
      {"gr": "από", "en": "from, by", "fr": "de, par"},
      {"gr": "με", "en": "with, by", "fr": "avec, en"},
      {"gr": "για", "en": "for", "fr": "pour"},
      {"gr": "χωρίς", "en": "without", "fr": "sans"},
      {"gr": "μέχρι", "en": "until, as far as", "fr": "jusqu'à"},
      {"gr": "πριν", "en": "before", "fr": "avant"},
      {"gr": "μετά", "en": "after", "fr": "après"}
    ],
    "items": [
      {"say": "Μένω στην Αθήνα.", "blank": "Μένω ___ Αθήνα.", "answer": "στην", "en": "I live in Athens.", "fr": "J'habite à Athènes."},
      {"say": "Πάμε στη θάλασσα.", "blank": "Πάμε ___ θάλασσα.", "answer": "στη", "en": "We are going to the sea.", "fr": "Nous allons à la mer."},
      {"say": "Είμαι στο σπίτι.", "blank": "Είμαι ___ σπίτι.", "answer": "στο", "en": "I am at home.", "fr": "Je suis à la maison."},
      {"say": "Δίνω το βιβλίο στον φίλο μου.", "blank": "Δίνω το βιβλίο ___ φίλο μου.", "answer": "στον", "en": "I give the book to my friend.", "fr": "Je donne le livre à mon ami."},
      {"say": "Η Μαρία είναι στην κουζίνα.", "blank": "Η Μαρία είναι ___ κουζίνα.", "answer": "στην", "en": "Maria is in the kitchen.", "fr": "Maria est dans la cuisine."},
      {"say": "Το βιβλίο είναι στο τραπέζι.", "blank": "Το βιβλίο είναι ___ τραπέζι.", "answer": "στο", "en": "The book is on the table.", "fr": "Le livre est sur la table."},
      {"say": "Είμαι από τη Γαλλία.", "blank": "Είμαι ___ τη Γαλλία.", "answer": "από", "en": "I am from France.", "fr": "Je viens de France."},
      {"say": "Φεύγω από το σπίτι στις οκτώ.", "blank": "Φεύγω ___ το σπίτι στις οκτώ.", "answer": "από", "en": "I leave the house at eight.", "fr": "Je quitte la maison à huit heures."},
      {"say": "Το δώρο είναι από τον Νίκο.", "blank": "Το δώρο είναι ___ τον Νίκο.", "answer": "από", "en": "The gift is from Nikos.", "fr": "Le cadeau vient de Nikos."},
      {"say": "Πηγαίνω στη δουλειά με το λεωφορείο.", "blank": "Πηγαίνω στη δουλειά ___ το λεωφορείο.", "answer": "με", "en": "I go to work by bus.", "fr": "Je vais au travail en bus."},
      {"say": "Πίνω καφέ με γάλα.", "blank": "Πίνω καφέ ___ γάλα.", "answer": "με", "en": "I drink coffee with milk.", "fr": "Je bois du café avec du lait."},
      {"say": "Μιλάω με τη μητέρα μου.", "blank": "Μιλάω ___ τη μητέρα μου.", "answer": "με", "en": "I talk with my mother.", "fr": "Je parle avec ma mère."},
      {"say": "Αυτό το δώρο είναι για σένα.", "blank": "Αυτό το δώρο είναι ___ σένα.", "answer": "για", "en": "This gift is for you.", "fr": "Ce cadeau est pour toi."},
      {"say": "Ευχαριστώ για όλα.", "blank": "Ευχαριστώ ___ όλα.", "answer": "για", "en": "Thank you for everything.", "fr": "Merci pour tout."},
      {"say": "Ένα εισιτήριο για την Αθήνα.", "blank": "Ένα εισιτήριο ___ την Αθήνα.", "answer": "για", "en": "A ticket for Athens.", "fr": "Un billet pour Athènes."},
      {"say": "Θέλω καφέ χωρίς ζάχαρη.", "blank": "Θέλω καφέ ___ ζάχαρη.", "answer": "χωρίς", "en": "I want coffee without sugar.", "fr": "Je veux du café sans sucre."},
      {"say": "Δεν βγαίνω χωρίς ομπρέλα.", "blank": "Δεν βγαίνω ___ ομπρέλα.", "answer": "χωρίς", "en": "I do not go out without an umbrella.", "fr": "Je ne sors pas sans parapluie."},
      {"say": "Δουλεύω μέχρι τις πέντε.", "blank": "Δουλεύω ___ τις πέντε.", "answer": "μέχρι", "en": "I work until five.", "fr": "Je travaille jusqu'à cinq heures."},
      {"say": "Περπατάω μέχρι το σπίτι.", "blank": "Περπατάω ___ το σπίτι.", "answer": "μέχρι", "en": "I walk as far as the house.", "fr": "Je marche jusqu'à la maison."},
      {"say": "Πλένω τα χέρια μου πριν το φαγητό.", "blank": "Πλένω τα χέρια μου ___ το φαγητό.", "answer": "πριν", "en": "I wash my hands before the meal.", "fr": "Je me lave les mains avant le repas."},
      {"say": "Μετά το φαγητό πίνουμε καφέ.", "blank": "___ το φαγητό πίνουμε καφέ.", "answer": "μετά", "en": "After the meal we drink coffee.", "fr": "Après le repas, nous buvons du café."}
    ]
  },
  "possessives": {
    "words": [
      {"gr": "μου", "en": "my", "fr": "mon, ma, mes"},
      {"gr": "σου", "en": "your (one person)", "fr": "ton, ta, tes"},
      {"gr": "του", "en": "his, its", "fr": "son, sa, ses"},
      {"gr": "της", "en": "her", "fr": "son, sa, ses"},
      {"gr": "μας", "en": "our", "fr": "notre, nos"},
      {"gr": "σας", "en": "your (several people, or polite)", "fr": "votre, vos"},
      {"gr": "τους", "en": "their", "fr": "leur, leurs"}
    ],
    "items": [
      {"say": "Το σπίτι μου είναι μικρό.", "blank": "Το σπίτι ___ είναι μικρό.", "answer": "μου", "en": "My house is small.", "fr": "Ma maison est petite."},
      {"say": "Ο φίλος σου είναι εδώ.", "blank": "Ο φίλος ___ είναι εδώ.", "answer": "σου", "en": "Your friend is here.", "fr": "Ton ami est ici."},
      {"say": "Η αδελφή του είναι γιατρός.", "blank": "Η αδελφή ___ είναι γιατρός.", "answer": "του", "en": "His sister is a doctor.", "fr": "Sa sœur est médecin."},
      {"say": "Η μητέρα της μένει στην Αθήνα.", "blank": "Η μητέρα ___ μένει στην Αθήνα.", "answer": "της", "en": "Her mother lives in Athens.", "fr": "Sa mère habite à Athènes."},
      {"say": "Η γάτα μας είναι μαύρη.", "blank": "Η γάτα ___ είναι μαύρη.", "answer": "μας", "en": "Our cat is black.", "fr": "Notre chat est noir."},
      {"say": "Η τσάντα σας είναι εδώ.", "blank": "Η τσάντα ___ είναι εδώ.", "answer": "σας", "en": "Your bag is here.", "fr": "Votre sac est ici."},
      {"say": "Τα παιδιά τους παίζουν έξω.", "blank": "Τα παιδιά ___ παίζουν έξω.", "answer": "τους", "en": "Their children are playing outside.", "fr": "Leurs enfants jouent dehors."},
      {"say": "Ο πατέρας μου δουλεύει στο γραφείο.", "blank": "Ο πατέρας ___ δουλεύει στο γραφείο.", "answer": "μου", "en": "My father works in the office.", "fr": "Mon père travaille au bureau."},
      {"say": "Ο σκύλος σου είναι μεγάλος.", "blank": "Ο σκύλος ___ είναι μεγάλος.", "answer": "σου", "en": "Your dog is big.", "fr": "Ton chien est grand."},
      {"say": "Ο φίλος της είναι από την Κύπρο.", "blank": "Ο φίλος ___ είναι από την Κύπρο.", "answer": "της", "en": "Her friend is from Cyprus.", "fr": "Son ami vient de Chypre."},
      {"say": "Η δουλειά του είναι δύσκολη.", "blank": "Η δουλειά ___ είναι δύσκολη.", "answer": "του", "en": "His job is difficult.", "fr": "Son travail est difficile."},
      {"say": "Η ομάδα μας κερδίζει.", "blank": "Η ομάδα ___ κερδίζει.", "answer": "μας", "en": "Our team is winning.", "fr": "Notre équipe gagne."},
      {"say": "Ο καφές σας είναι έτοιμος.", "blank": "Ο καφές ___ είναι έτοιμος.", "answer": "σας", "en": "Your coffee is ready.", "fr": "Votre café est prêt."},
      {"say": "Η οικογένειά τους είναι μεγάλη.", "blank": "Η οικογένειά ___ είναι μεγάλη.", "answer": "τους", "en": "Their family is big.", "fr": "Leur famille est grande."}
    ]
  },
  "imperative": {
    "words": [
      {"sg": "έλα", "pl": "ελάτε", "en": "come", "fr": "viens, venez"},
      {"sg": "πες", "pl": "πείτε", "en": "say, tell", "fr": "dis, dites"},
      {"sg": "κάτσε", "pl": "καθίστε", "en": "sit", "fr": "assieds-toi, asseyez-vous"},
      {"sg": "περίμενε", "pl": "περιμένετε", "en": "wait", "fr": "attends, attendez"},
      {"sg": "κοίτα", "pl": "κοιτάξτε", "en": "look", "fr": "regarde, regardez"},
      {"sg": "άκου", "pl": "ακούστε", "en": "listen", "fr": "écoute, écoutez"},
      {"sg": "πάρε", "pl": "πάρτε", "en": "take", "fr": "prends, prenez"},
      {"sg": "δώσε", "pl": "δώστε", "en": "give", "fr": "donne, donnez"},
      {"sg": "άνοιξε", "pl": "ανοίξτε", "en": "open", "fr": "ouvre, ouvrez"},
      {"sg": "κλείσε", "pl": "κλείστε", "en": "close", "fr": "ferme, fermez"},
      {"sg": "φάε", "pl": "φάτε", "en": "eat", "fr": "mange, mangez"},
      {"sg": "πιες", "pl": "πιείτε", "en": "drink", "fr": "bois, buvez"},
      {"sg": "μίλα", "pl": "μιλήστε", "en": "speak", "fr": "parle, parlez"},
      {"sg": "γράψε", "pl": "γράψτε", "en": "write", "fr": "écris, écrivez"}
    ],
    "items": [
      {"say": "Έλα εδώ!", "blank": "___ εδώ!", "answer": "έλα", "en": "Come here!", "fr": "Viens ici !"},
      {"say": "Πες μου!", "blank": "___ μου!", "answer": "πες", "en": "Tell me!", "fr": "Dis-moi !"},
      {"say": "Κάτσε εδώ, παρακαλώ.", "blank": "___ εδώ, παρακαλώ.", "answer": "κάτσε", "en": "Sit here, please.", "fr": "Assieds-toi ici, s'il te plaît."},
      {"say": "Περίμενε λίγο!", "blank": "___ λίγο!", "answer": "περίμενε", "en": "Wait a little!", "fr": "Attends un peu !"},
      {"say": "Κοίτα αυτό!", "blank": "___ αυτό!", "answer": "κοίτα", "en": "Look at this!", "fr": "Regarde ça !"},
      {"say": "Άκου τι λέω!", "blank": "___ τι λέω!", "answer": "άκου", "en": "Listen to what I say!", "fr": "Écoute ce que je dis !"},
      {"say": "Πάρε το νερό!", "blank": "___ το νερό!", "answer": "πάρε", "en": "Take the water!", "fr": "Prends l'eau !"},
      {"say": "Δώσε μου το βιβλίο!", "blank": "___ μου το βιβλίο!", "answer": "δώσε", "en": "Give me the book!", "fr": "Donne-moi le livre !"},
      {"say": "Άνοιξε την πόρτα!", "blank": "___ την πόρτα!", "answer": "άνοιξε", "en": "Open the door!", "fr": "Ouvre la porte !"},
      {"say": "Κλείσε το παράθυρο!", "blank": "___ το παράθυρο!", "answer": "κλείσε", "en": "Close the window!", "fr": "Ferme la fenêtre !"},
      {"say": "Μίλα ελληνικά!", "blank": "___ ελληνικά!", "answer": "μίλα", "en": "Speak Greek!", "fr": "Parle grec !"},
      {"say": "Γράψε το όνομά σου!", "blank": "___ το όνομά σου!", "answer": "γράψε", "en": "Write your name!", "fr": "Écris ton nom !"},
      {"say": "Φάε το φαγητό σου!", "blank": "___ το φαγητό σου!", "answer": "φάε", "en": "Eat your food!", "fr": "Mange ton repas !"},
      {"say": "Πιες νερό!", "blank": "___ νερό!", "answer": "πιες", "en": "Drink water!", "fr": "Bois de l'eau !"},
      {"say": "Καθίστε εδώ, κύριε!", "blank": "___ εδώ, κύριε!", "answer": "καθίστε", "en": "Sit here, sir!", "fr": "Asseyez-vous ici, monsieur !"},
      {"say": "Περιμένετε μια στιγμή!", "blank": "___ μια στιγμή!", "answer": "περιμένετε", "en": "Wait a moment!", "fr": "Attendez un instant !"},
      {"say": "Ελάτε, παρακαλώ!", "blank": "___, παρακαλώ!", "answer": "ελάτε", "en": "Come, please!", "fr": "Venez, s'il vous plaît !"},
      {"say": "Ακούστε προσεκτικά!", "blank": "___ προσεκτικά!", "answer": "ακούστε", "en": "Listen carefully!", "fr": "Écoutez attentivement !"}
    ]
  }
};
