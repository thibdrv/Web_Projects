// Directions. Edit freely.
//  - "gr" is the Greek word WITH its "the" (ο = masculine, η = feminine, το = neuter), or without it for adverbs and verbs.
//    Every "gr" gets a recording (tools/make_audio.py makes it).
//  - "lat" is the pronunciation in Latin letters, "en" the meaning (the French is in data/fr.js).
//  - "emoji" is optional. Give it only when the picture is clear and not used by another word.
const DIRECTIONS = {
  "groups": [
    {"id": "sides", "name": "Left, right & straight", "words": [
      {"gr": "αριστερά", "lat": "aristera", "en": "left", "emoji": "⬅️"},
      {"gr": "δεξιά", "lat": "dexia", "en": "right", "emoji": "➡️"},
      {"gr": "ευθεία", "lat": "efthia", "en": "straight ahead"},
      {"gr": "στα αριστερά", "lat": "sta aristera", "en": "on the left"},
      {"gr": "στα δεξιά", "lat": "sta dexia", "en": "on the right"},
      {"gr": "πάνω", "lat": "pano", "en": "up", "emoji": "⬆️"},
      {"gr": "κάτω", "lat": "kato", "en": "down", "emoji": "⬇️"},
      {"gr": "μπροστά", "lat": "brosta", "en": "in front"},
      {"gr": "πίσω", "lat": "piso", "en": "behind"},
      {"gr": "γύρω", "lat": "yiro", "en": "around"},
      {"gr": "ψηλά", "lat": "psila", "en": "high up"},
      {"gr": "χαμηλά", "lat": "chamila", "en": "low down"},
      {"gr": "προς", "lat": "pros", "en": "towards"},
      {"gr": "μέχρι", "lat": "mechri", "en": "as far as"},
      {"gr": "πέρα", "lat": "pera", "en": "beyond"},
      {"gr": "παρακάτω", "lat": "parakato", "en": "further down"},
      {"gr": "παραπάνω", "lat": "parapano", "en": "further up"}
    ]},
    {"id": "compass", "name": "The compass", "words": [
      {"gr": "η πυξίδα", "lat": "i pixida", "en": "compass", "emoji": "🧭"},
      {"gr": "ο βορράς", "lat": "o vorras", "en": "north"},
      {"gr": "ο νότος", "lat": "o notos", "en": "south"},
      {"gr": "η ανατολή", "lat": "i anatoli", "en": "east"},
      {"gr": "η δύση", "lat": "i disi", "en": "west"},
      {"gr": "βόρεια", "lat": "voria", "en": "to the north"},
      {"gr": "νότια", "lat": "notia", "en": "to the south"},
      {"gr": "ανατολικά", "lat": "anatolika", "en": "to the east"},
      {"gr": "δυτικά", "lat": "ditika", "en": "to the west"},
      {"gr": "βορειοανατολικά", "lat": "vorioanatolika", "en": "north-east", "emoji": "↗️"},
      {"gr": "βορειοδυτικά", "lat": "vorioditika", "en": "north-west", "emoji": "↖️"},
      {"gr": "νοτιοανατολικά", "lat": "notioanatolika", "en": "south-east", "emoji": "↘️"},
      {"gr": "νοτιοδυτικά", "lat": "notioditika", "en": "south-west", "emoji": "↙️"},
      {"gr": "η κατεύθυνση", "lat": "i katefthinsi", "en": "direction"},
      {"gr": "ο χάρτης", "lat": "o chartis", "en": "map", "emoji": "🗺️"}
    ]},
    {"id": "where", "name": "Where is it?", "words": [
      {"gr": "εδώ", "lat": "edo", "en": "here"},
      {"gr": "εκεί", "lat": "eki", "en": "there"},
      {"gr": "κοντά", "lat": "konda", "en": "near"},
      {"gr": "μακριά", "lat": "makria", "en": "far"},
      {"gr": "δίπλα", "lat": "dipla", "en": "next to"},
      {"gr": "απέναντι", "lat": "apenandi", "en": "opposite"},
      {"gr": "ανάμεσα", "lat": "anamesa", "en": "between"},
      {"gr": "μέσα", "lat": "mesa", "en": "inside"},
      {"gr": "έξω", "lat": "exo", "en": "outside"},
      {"gr": "στη γωνία", "lat": "sti gonia", "en": "at the corner"},
      {"gr": "στη μέση", "lat": "sti mesi", "en": "in the middle"},
      {"gr": "στην αρχή", "lat": "stin archi", "en": "at the start"},
      {"gr": "στο τέλος", "lat": "sto telos", "en": "at the end"},
      {"gr": "παντού", "lat": "pandou", "en": "everywhere"},
      {"gr": "πουθενά", "lat": "pouthena", "en": "nowhere"},
      {"gr": "κάπου", "lat": "kapou", "en": "somewhere"},
      {"gr": "ακριβώς", "lat": "akrivos", "en": "exactly"}
    ]},
    {"id": "moving", "name": "Moving around", "words": [
      {"gr": "πηγαίνω", "lat": "piyeno", "en": "I go"},
      {"gr": "στρίβω", "lat": "strivo", "en": "I turn"},
      {"gr": "συνεχίζω", "lat": "sinechizo", "en": "I continue"},
      {"gr": "προχωράω", "lat": "prochorao", "en": "I go forward"},
      {"gr": "περνάω", "lat": "pernao", "en": "I go past"},
      {"gr": "διασχίζω", "lat": "diaschizo", "en": "I cross"},
      {"gr": "σταματάω", "lat": "stamatao", "en": "I stop"},
      {"gr": "γυρίζω", "lat": "yirizo", "en": "I turn around"},
      {"gr": "φτάνω", "lat": "ftano", "en": "I arrive"},
      {"gr": "ακολουθώ", "lat": "akoloutho", "en": "I follow"},
      {"gr": "ψάχνω", "lat": "psachno", "en": "I look for"},
      {"gr": "βρίσκω", "lat": "vrisko", "en": "I find"},
      {"gr": "χάνομαι", "lat": "chanome", "en": "I get lost"},
      {"gr": "ανεβαίνω", "lat": "aneveno", "en": "I go up"},
      {"gr": "κατεβαίνω", "lat": "kateveno", "en": "I go down"},
      {"gr": "μπαίνω", "lat": "beno", "en": "I go in"},
      {"gr": "βγαίνω", "lat": "vyeno", "en": "I go out"},
      {"gr": "περπατάω", "lat": "perpatao", "en": "I walk", "emoji": "🚶"}
    ]},
    {"id": "roads", "name": "Roads & signs", "words": [
      {"gr": "ο δρόμος", "lat": "o dromos", "en": "street"},
      {"gr": "ο αυτοκινητόδρομος", "lat": "o aftokinitodromos", "en": "motorway", "emoji": "🛣️"},
      {"gr": "η διασταύρωση", "lat": "i diastavrosi", "en": "crossroads"},
      {"gr": "η στροφή", "lat": "i strofi", "en": "bend"},
      {"gr": "η γέφυρα", "lat": "i yefira", "en": "bridge", "emoji": "🌉"},
      {"gr": "το πεζοδρόμιο", "lat": "to pezodromio", "en": "pavement"},
      {"gr": "ο πεζόδρομος", "lat": "o pezodromos", "en": "pedestrian street"},
      {"gr": "η διάβαση", "lat": "i diavasi", "en": "pedestrian crossing"},
      {"gr": "η πινακίδα", "lat": "i pinakida", "en": "road sign"},
      {"gr": "η κυκλοφορία", "lat": "i kikloforia", "en": "traffic"},
      {"gr": "η έξοδος", "lat": "i exodos", "en": "exit"},
      {"gr": "ο προορισμός", "lat": "o proorismos", "en": "destination"}
    ]},
    {"id": "distance", "name": "Distance", "words": [
      {"gr": "η απόσταση", "lat": "i apostasi", "en": "distance"},
      {"gr": "το μέτρο", "lat": "to metro", "en": "metre", "emoji": "📏"},
      {"gr": "το χιλιόμετρο", "lat": "to chiliometro", "en": "kilometre"},
      {"gr": "το τετράγωνο", "lat": "to tetragono", "en": "block"},
      {"gr": "με τα πόδια", "lat": "me ta podia", "en": "on foot"},
      {"gr": "με το αυτοκίνητο", "lat": "me to aftokinito", "en": "by car"},
      {"gr": "με το λεωφορείο", "lat": "me to leoforio", "en": "by bus"}
    ]}
  ]
};
