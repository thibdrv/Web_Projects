// Questions of the level test that are written by hand. The test is in Greek only (no Latin transliteration).
//  - "gaps": a sentence with ____ and four words: "ok" is right, "bad" the three wrong ones. "lvl" is A1, A2, B1 or B2.
//  - "passages": a short text and questions about it, with their four answers.
//  - "defs": a vocabulary question in Greek (a definition, an opposite, a word that fits).
//  - "en" / "fr" are only shown AFTER the answer, to explain it.
// The other questions of the test are made from the rest of the app (words, pictures, dictations, conversations, grammar).
const LEVELQ = {
  "gaps": [
    {"lvl": "A1", "s": "Εγώ ____ από την Κύπρο.", "ok": "είμαι", "bad": ["είσαι", "είναι", "είμαστε"], "en": "I am from Cyprus.", "fr": "Je viens de Chypre."},
    {"lvl": "A1", "s": "Η Μαρία ____ δύο αδέλφια.", "ok": "έχει", "bad": ["έχω", "έχεις", "έχουμε"], "en": "Maria has two brothers or sisters.", "fr": "Maria a deux frères ou sœurs."},
    {"lvl": "A1", "s": "Το νερό είναι ____.", "ok": "κρύο", "bad": ["κρύος", "κρύα", "κρύοι"], "en": "The water is cold.", "fr": "L'eau est froide."},
    {"lvl": "A1", "s": "Γεια σου! Τι ____;", "ok": "κάνεις", "bad": ["κάνω", "κάνει", "κάνουμε"], "en": "Hi! How are you?", "fr": "Salut ! Comment vas-tu ?"},
    {"lvl": "A1", "s": "____ σε λένε;", "ok": "Πώς", "bad": ["Πού", "Πότε", "Πόσο"], "en": "What is your name?", "fr": "Comment t'appelles-tu ?"},
    {"lvl": "A2", "s": "Χθες ____ στη θάλασσα.", "ok": "πήγα", "bad": ["πηγαίνω", "θα πάω", "πάω"], "en": "Yesterday I went to the sea.", "fr": "Hier, je suis allé à la mer."},
    {"lvl": "A2", "s": "Αύριο ____ στην Αθήνα.", "ok": "θα πάμε", "bad": ["πήγαμε", "πηγαίναμε", "πήγε"], "en": "Tomorrow we will go to Athens.", "fr": "Demain, nous irons à Athènes."},
    {"lvl": "A2", "s": "Ο καφές είναι πολύ ____.", "ok": "ζεστός", "bad": ["ζεστή", "ζεστό", "ζεστοί"], "en": "The coffee is very hot.", "fr": "Le café est très chaud."},
    {"lvl": "A2", "s": "Δεν έχω χρόνο, ____ βιάζομαι.", "ok": "γιατί", "bad": ["αλλά", "ή", "όταν"], "en": "I have no time, because I am in a hurry.", "fr": "Je n'ai pas le temps, parce que je suis pressé."},
    {"lvl": "A2", "s": "Η αδελφή μου ____ στη Λεμεσό.", "ok": "μένει", "bad": ["μένω", "μένεις", "μένουμε"], "en": "My sister lives in Limassol.", "fr": "Ma sœur habite à Limassol."},
    {"lvl": "B1", "s": "Αν ____ χρόνο, θα έρθω στο πάρτι.", "ok": "έχω", "bad": ["είχα", "θα έχω", "έχεις"], "en": "If I have time, I will come to the party.", "fr": "Si j'ai le temps, je viendrai à la fête."},
    {"lvl": "B1", "s": "Το βιβλίο ____ διάβασα χθες ήταν υπέροχο.", "ok": "που", "bad": ["πού", "ποιος", "τι"], "en": "The book that I read yesterday was wonderful.", "fr": "Le livre que j'ai lu hier était merveilleux."},
    {"lvl": "B1", "s": "Εσύ πρέπει να ____ περισσότερο.", "ok": "μελετάς", "bad": ["μελετώ", "μελετάμε", "μελετάνε"], "en": "You must study more.", "fr": "Tu dois étudier davantage."},
    {"lvl": "B1", "s": "Έχασα το τρένο, ____ έφτασα αργά.", "ok": "γι' αυτό", "bad": ["παρόλο που", "ενώ", "αν"], "en": "I missed the train, so I arrived late.", "fr": "J'ai raté le train, donc je suis arrivé en retard."},
    {"lvl": "B2", "s": "____ κουράστηκα, συνέχισα να δουλεύω.", "ok": "Παρόλο που", "bad": ["Επειδή", "Γι' αυτό", "Αν"], "en": "Although I was tired, I kept working.", "fr": "Bien que je sois fatigué, j'ai continué à travailler."},
    {"lvl": "B2", "s": "Αν είχα χρόνο, ____ πολύ.", "ok": "θα ταξίδευα", "bad": ["θα ταξιδέψω", "ταξιδεύω", "ταξίδεψα"], "en": "If I had time, I would travel a lot.", "fr": "Si j'avais le temps, je voyagerais beaucoup."},
    {"lvl": "B2", "s": "Δεν ξέρω ____ θα βρέξει αύριο.", "ok": "αν", "bad": ["ότι", "να", "για"], "en": "I do not know if it will rain tomorrow.", "fr": "Je ne sais pas s'il pleuvra demain."},
    {"lvl": "B2", "s": "Είναι σημαντικό όλοι ____ συμμετέχουν.", "ok": "να", "bad": ["ότι", "που", "αν"], "en": "It is important that everyone takes part.", "fr": "Il est important que tout le monde participe."},
    {"lvl": "B2", "s": "Ο άνθρωπος ____ μίλησα χθες είναι γιατρός.", "ok": "με τον οποίο", "bad": ["που", "ο οποίος", "τον οποίο"], "en": "The man with whom I spoke yesterday is a doctor.", "fr": "L'homme avec qui j'ai parlé hier est médecin."},
    {"lvl": "B2", "s": "Ενώ ____ στο γραφείο, χτύπησε το τηλέφωνο.", "ok": "ήμουν", "bad": ["είμαι", "θα είμαι", "να είμαι"], "en": "While I was in the office, the phone rang.", "fr": "Pendant que j'étais au bureau, le téléphone a sonné."}
  ],
  "passages": [
    {"id": "nikos", "lvl": "A2",
     "text": "Ο Νίκος ξυπνάει στις επτά. Πίνει καφέ και πηγαίνει στη δουλειά με το λεωφορείο. Δουλεύει μέχρι τις πέντε. Το βράδυ βλέπει τηλεόραση.",
     "qs": [
       {"q": "Πώς πηγαίνει ο Νίκος στη δουλειά;", "ok": "Με το λεωφορείο.", "bad": ["Με το αυτοκίνητο.", "Με τα πόδια.", "Με το ποδήλατο."], "en": "Nikos goes to work by bus.", "fr": "Nikos va au travail en bus."},
       {"q": "Τι κάνει ο Νίκος το βράδυ;", "ok": "Βλέπει τηλεόραση.", "bad": ["Πηγαίνει στη δουλειά.", "Πίνει καφέ.", "Κοιμάται."], "en": "In the evening he watches television.", "fr": "Le soir, il regarde la télévision."}]},
    {"id": "eleni", "lvl": "B1",
     "text": "Η Ελένη μένει στη Λεμεσό, αλλά δουλεύει στη Λευκωσία. Κάθε πρωί ξυπνάει νωρίς, γιατί ο δρόμος είναι μακρύς. Το Σαββατοκύριακο προτιμά να μένει σπίτι και να διαβάζει βιβλία. Λέει ότι έτσι ξεκουράζεται περισσότερο από τη δουλειά της.",
     "qs": [
       {"q": "Γιατί ξυπνάει νωρίς η Ελένη;", "ok": "Επειδή ο δρόμος για τη δουλειά είναι μακρύς.", "bad": ["Επειδή αγαπά το πρωινό.", "Επειδή έχει μάθημα.", "Επειδή δεν κοιμάται καλά."], "en": "She wakes up early because the road to work is long.", "fr": "Elle se lève tôt parce que la route du travail est longue."},
       {"q": "Τι κάνει η Ελένη το Σαββατοκύριακο;", "ok": "Μένει σπίτι και διαβάζει.", "bad": ["Ταξιδεύει στη Λεμεσό.", "Δουλεύει περισσότερο.", "Βγαίνει με φίλους."], "en": "At the weekend she stays at home and reads.", "fr": "Le week-end, elle reste chez elle et lit."}]},
    {"id": "haloumi", "lvl": "B1",
     "text": "Το χαλούμι είναι ένα παραδοσιακό τυρί της Κύπρου. Το φτιάχνουν από γάλα προβάτου και κατσικιού. Μπορείς να το φας ψητό ή τηγανητό, και πολλοί το βάζουν σε σαλάτες και σε σάντουιτς.",
     "qs": [
       {"q": "Από τι γάλα φτιάχνουν παραδοσιακά το χαλούμι;", "ok": "Από γάλα προβάτου και κατσικιού.", "bad": ["Μόνο από γάλα αγελάδας.", "Από γάλα σόγιας.", "Από γάλα καμήλας."], "en": "It is traditionally made from sheep's and goat's milk.", "fr": "On le fait traditionnellement avec du lait de brebis et de chèvre."},
       {"q": "Πώς τρώνε το χαλούμι;", "ok": "Ψητό ή τηγανητό.", "bad": ["Μόνο ωμό.", "Μέσα σε σούπα.", "Σαν γλυκό με ζάχαρη."], "en": "They eat it grilled or fried.", "fr": "On le mange grillé ou frit."}]},
    {"id": "tech", "lvl": "B2",
     "text": "Παρόλο που η τεχνολογία κάνει τη ζωή μας πιο εύκολη, πολλοί άνθρωποι νιώθουν ότι δεν έχουν ποτέ ελεύθερο χρόνο. Τα μηνύματα και οι ειδοποιήσεις μάς διακόπτουν συνέχεια. Γι' αυτό, ορισμένοι αποφασίζουν να κλείνουν το κινητό τους για μερικές ώρες κάθε μέρα.",
     "qs": [
       {"q": "Ποιο πρόβλημα περιγράφει το κείμενο;", "ok": "Οι άνθρωποι διακόπτονται συνέχεια από τα κινητά τους.", "bad": ["Η τεχνολογία είναι πολύ ακριβή.", "Δεν υπάρχουν αρκετά κινητά.", "Οι άνθρωποι δεν θέλουν να δουλεύουν."], "en": "People are interrupted all the time by their phones.", "fr": "Les gens sont sans cesse interrompus par leur téléphone."},
       {"q": "Τι κάνουν μερικοί άνθρωποι για να το λύσουν;", "ok": "Κλείνουν το κινητό τους για λίγες ώρες.", "bad": ["Αγοράζουν περισσότερα κινητά.", "Δεν δουλεύουν καθόλου.", "Γράφουν περισσότερα μηνύματα."], "en": "Some people switch their phone off for a few hours.", "fr": "Certains éteignent leur téléphone pendant quelques heures."}]},
    {"id": "dimarchos", "lvl": "B2",
     "text": "Ο δήμαρχος ανακοίνωσε ότι το κέντρο της πόλης θα γίνει πεζόδρομος από τον επόμενο μήνα. Οι έμποροι ανησυχούν ότι θα χάσουν πελάτες, ενώ οι κάτοικοι πιστεύουν ότι ο αέρας θα γίνει καθαρότερος και ότι η περιοχή θα γίνει πιο ευχάριστη. Η απόφαση θα αλλάξει τα μέσα μεταφοράς και τις συνήθειες πολλών ανθρώπων.",
     "qs": [
       {"q": "Γιατί ανησυχούν οι έμποροι;", "ok": "Φοβούνται ότι θα έχουν λιγότερους πελάτες.", "bad": ["Θέλουν περισσότερα αυτοκίνητα στο κέντρο.", "Δεν θέλουν να δουλεύουν.", "Πιστεύουν ότι ο αέρας είναι βρώμικος."], "en": "They are afraid they will have fewer customers.", "fr": "Ils craignent d'avoir moins de clients."},
       {"q": "Τι πιστεύουν οι κάτοικοι;", "ok": "Ότι ο αέρας θα γίνει καθαρότερος.", "bad": ["Ότι οι δρόμοι θα γίνουν πιο επικίνδυνοι.", "Ότι δεν θα αλλάξει τίποτα.", "Ότι θα χάσουν τη δουλειά τους."], "en": "That the air will become cleaner.", "fr": "Que l'air deviendra plus propre."},
       {"q": "Τι θα αλλάξει με την απόφαση;", "ok": "Τα μέσα μεταφοράς και οι συνήθειες των ανθρώπων.", "bad": ["Το όνομα της πόλης.", "Ο δήμαρχος.", "Οι τιμές στα καταστήματα."], "en": "The means of transport and people's habits.", "fr": "Les moyens de transport et les habitudes des gens."}]}
  ],
  "defs": [
    {"lvl": "B1", "q": "Ποια λέξη είναι το αντίθετο του «σπάνια»;", "ok": "συχνά", "bad": ["ποτέ", "σιγά", "ίσως"], "en": "The opposite of \"rarely\" is \"often\".", "fr": "Le contraire de « rarement » est « souvent »."},
    {"lvl": "B1", "q": "Τι σημαίνει «κουρασμένος»;", "ok": "Αυτός που χρειάζεται ξεκούραση.", "bad": ["Αυτός που είναι πολύ πεινασμένος.", "Αυτός που τρέχει γρήγορα.", "Αυτός που έχει πολλά λεφτά."], "en": "\"Tired\" means someone who needs rest.", "fr": "« Fatigué » veut dire quelqu'un qui a besoin de repos."},
    {"lvl": "B1", "q": "Ποια λέξη ταιριάζει: Ο ____ φτιάχνει ψωμί και κουλούρια.", "ok": "φούρναρης", "bad": ["ράφτης", "ψαράς", "κομμωτής"], "en": "The baker makes bread and bread rings.", "fr": "Le boulanger fait du pain et des couronnes de pain."},
    {"lvl": "B2", "q": "Ποια λέξη έχει σχεδόν το ίδιο νόημα με «ξαφνικά»;", "ok": "απρόσμενα", "bad": ["σιγά-σιγά", "συχνά", "αργά"], "en": "\"Unexpectedly\" is close to \"suddenly\".", "fr": "« De façon inattendue » est proche de « soudain »."},
    {"lvl": "B2", "q": "Ποια λέξη είναι το αντίθετο του «ευγενικός»;", "ok": "αγενής", "bad": ["ευγενής", "νέος", "έξυπνος"], "en": "The opposite of \"polite\" is \"rude\".", "fr": "Le contraire de « poli » est « impoli »."},
    {"lvl": "B2", "q": "Τι σημαίνει «αναβάλλω»;", "ok": "Αφήνω κάτι για αργότερα.", "bad": ["Τελειώνω κάτι νωρίς.", "Ξεχνώ κάτι εντελώς.", "Αγοράζω κάτι ακριβό."], "en": "\"To postpone\" means to leave something for later.", "fr": "« Reporter » veut dire laisser quelque chose pour plus tard."},
    {"lvl": "B2", "q": "Ποια λέξη ταιριάζει: Ο ____ γράφει βιβλία.", "ok": "συγγραφέας", "bad": ["ηθοποιός", "δικηγόρος", "οδηγός"], "en": "The writer writes books.", "fr": "L'écrivain écrit des livres."},
    {"lvl": "B2", "q": "Τι σημαίνει «οικονομώ»;", "ok": "Ξοδεύω λιγότερα χρήματα.", "bad": ["Δανείζομαι πολλά λεφτά.", "Αγοράζω ό,τι θέλω.", "Χάνω το πορτοφόλι μου."], "en": "\"To save money\" means to spend less.", "fr": "« Économiser » veut dire dépenser moins d'argent."}
  ]
};
