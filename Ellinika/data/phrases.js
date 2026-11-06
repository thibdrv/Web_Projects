// Simple phrases. Edit freely.
//  - "gr" is the Greek phrase: it gets a recording (tools/make_audio.py makes it).
//  - "en" and "fr" are the meanings shown. "lat" is the pronunciation (a hint).
//  - "alt" (optional) lists other correct ways to write it. Accents, capital letters and
//    punctuation do not matter when you write: Με λένε Μαρία. = με λενε μαρια
const PHRASES = {
  "groups": [
    {"id": "about", "name": "About you", "phrases": [
      {"gr": "Με λένε Μαρία.", "lat": "me lene maria", "en": "My name is Maria.", "fr": "Je m'appelle Maria.", "alt": ["Ονομάζομαι Μαρία."]},
      {"gr": "Πώς σε λένε;", "lat": "pos se lene", "en": "What is your name?", "fr": "Comment tu t'appelles ?", "alt": ["Ποιο είναι το όνομά σου;"]},
      {"gr": "Ποιος είσαι;", "lat": "pios ise", "en": "Who are you?", "fr": "Qui es-tu ?", "alt": ["Ποια είσαι;"]},
      {"gr": "Είμαι ο Νίκος.", "lat": "ime o nikos", "en": "I am Nikos.", "fr": "Je suis Nikos."},
      {"gr": "Χάρηκα πολύ.", "lat": "charika poli", "en": "Nice to meet you.", "fr": "Enchanté."},
      {"gr": "Από πού είσαι;", "lat": "apo pou ise", "en": "Where are you from?", "fr": "D'où viens-tu ?"},
      {"gr": "Είμαι από τη Γαλλία.", "lat": "ime apo ti gallia", "en": "I am from France.", "fr": "Je viens de France.", "alt": ["Είμαι από την Γαλλία."]},
      {"gr": "Πού μένεις;", "lat": "pou meneis", "en": "Where do you live?", "fr": "Où habites-tu ?"},
      {"gr": "Μένω στο Παρίσι.", "lat": "meno sto parisi", "en": "I live in Paris.", "fr": "J'habite à Paris."},
      {"gr": "Πόσο χρονών είσαι;", "lat": "poso chronon ise", "en": "How old are you?", "fr": "Quel âge as-tu ?"},
      {"gr": "Είμαι είκοσι πέντε χρονών.", "lat": "ime ikosi pente chronon", "en": "I am twenty-five years old.", "fr": "J'ai vingt-cinq ans."},
      {"gr": "Μιλάω λίγα ελληνικά.", "lat": "milao liga ellinika", "en": "I speak a little Greek.", "fr": "Je parle un peu grec.", "alt": ["Μιλώ λίγα ελληνικά."]},
      {"gr": "Μιλάς αγγλικά;", "lat": "milas anglika", "en": "Do you speak English?", "fr": "Parles-tu anglais ?"},
      {"gr": "Δεν καταλαβαίνω.", "lat": "den katalaveno", "en": "I don't understand.", "fr": "Je ne comprends pas."},
      {"gr": "Έχω μία αδερφή.", "lat": "echo mia aderfi", "en": "I have a sister.", "fr": "J'ai une sœur."},
      {"gr": "Έχω ένα σκύλο.", "lat": "echo ena skilo", "en": "I have a dog.", "fr": "J'ai un chien.", "alt": ["Έχω έναν σκύλο."]}
    ]},
    {"id": "greetings", "name": "Greetings", "phrases": [
      {"gr": "Γεια σου!", "lat": "yia sou", "en": "Hello! (informal)", "fr": "Salut !", "alt": ["Γεια!"]},
      {"gr": "Καλημέρα!", "lat": "kalimera", "en": "Good morning!", "fr": "Bonjour ! (le matin)"},
      {"gr": "Καλησπέρα!", "lat": "kalispera", "en": "Good evening!", "fr": "Bonsoir !"},
      {"gr": "Καληνύχτα!", "lat": "kalinichta", "en": "Good night!", "fr": "Bonne nuit !"},
      {"gr": "Τι κάνεις;", "lat": "ti kaneis", "en": "How are you?", "fr": "Comment vas-tu ?"},
      {"gr": "Είμαι καλά, ευχαριστώ.", "lat": "ime kala efcharisto", "en": "I am fine, thank you.", "fr": "Je vais bien, merci."},
      {"gr": "Κι εσύ;", "lat": "ki esi", "en": "And you?", "fr": "Et toi ?", "alt": ["Και εσύ;"]},
      {"gr": "Ευχαριστώ πολύ.", "lat": "efcharisto poli", "en": "Thank you very much.", "fr": "Merci beaucoup."},
      {"gr": "Παρακαλώ.", "lat": "parakalo", "en": "You're welcome.", "fr": "De rien."},
      {"gr": "Συγγνώμη.", "lat": "signomi", "en": "Sorry. Excuse me.", "fr": "Pardon."},
      {"gr": "Αντίο!", "lat": "antio", "en": "Goodbye!", "fr": "Au revoir !"},
      {"gr": "Τα λέμε αύριο.", "lat": "ta leme avrio", "en": "See you tomorrow.", "fr": "À demain."},
      {"gr": "Καλή όρεξη!", "lat": "kali orexi", "en": "Enjoy your meal!", "fr": "Bon appétit !"},
      {"gr": "Χρόνια πολλά!", "lat": "chronia polla", "en": "Happy birthday!", "fr": "Joyeux anniversaire !"},
      {"gr": "Καλό ταξίδι!", "lat": "kalo taxidi", "en": "Have a good trip!", "fr": "Bon voyage !"}
    ]},
    {"id": "questions", "name": "Questions", "phrases": [
      {"gr": "Τι είναι αυτό;", "lat": "ti ine afto", "en": "What is this?", "fr": "Qu'est-ce que c'est ?"},
      {"gr": "Πού είναι η τουαλέτα;", "lat": "pou ine i toualeta", "en": "Where is the toilet?", "fr": "Où sont les toilettes ?"},
      {"gr": "Τι ώρα είναι;", "lat": "ti ora ine", "en": "What time is it?", "fr": "Quelle heure est-il ?"},
      {"gr": "Πόσο κάνει;", "lat": "poso kani", "en": "How much is it?", "fr": "Combien ça coûte ?"},
      {"gr": "Πού πηγαίνεις;", "lat": "pou pigaineis", "en": "Where are you going?", "fr": "Où vas-tu ?", "alt": ["Πού πας;"]},
      {"gr": "Τι θέλεις;", "lat": "ti theleis", "en": "What do you want?", "fr": "Que veux-tu ?"},
      {"gr": "Γιατί;", "lat": "giati", "en": "Why?", "fr": "Pourquoi ?"},
      {"gr": "Πότε;", "lat": "pote", "en": "When?", "fr": "Quand ?"},
      {"gr": "Ποιος είναι αυτός;", "lat": "pios ine aftos", "en": "Who is he?", "fr": "Qui est-ce ?"},
      {"gr": "Μπορείς να με βοηθήσεις;", "lat": "boris na me voithisis", "en": "Can you help me?", "fr": "Peux-tu m'aider ?"},
      {"gr": "Πού είναι το σπίτι σου;", "lat": "pou ine to spiti sou", "en": "Where is your house?", "fr": "Où est ta maison ?"},
      {"gr": "Τι κάνεις σήμερα;", "lat": "ti kaneis simera", "en": "What are you doing today?", "fr": "Que fais-tu aujourd'hui ?"}
    ]},
    {"id": "food", "name": "Food & shopping", "phrases": [
      {"gr": "Θέλω ένα νερό, παρακαλώ.", "lat": "thelo ena nero parakalo", "en": "I want a water, please.", "fr": "Je voudrais de l'eau, s'il vous plaît."},
      {"gr": "Θα ήθελα έναν καφέ.", "lat": "tha ithela enan kafe", "en": "I would like a coffee.", "fr": "Je voudrais un café.", "alt": ["Θα ήθελα ένα καφέ."]},
      {"gr": "Τον λογαριασμό, παρακαλώ.", "lat": "ton logariasmo parakalo", "en": "The bill, please.", "fr": "L'addition, s'il vous plaît."},
      {"gr": "Πεινάω.", "lat": "pinao", "en": "I am hungry.", "fr": "J'ai faim.", "alt": ["Πεινώ."]},
      {"gr": "Διψάω.", "lat": "dipsao", "en": "I am thirsty.", "fr": "J'ai soif.", "alt": ["Διψώ."]},
      {"gr": "Μου αρέσει το φαγητό.", "lat": "mou aresi to fagito", "en": "I like the food.", "fr": "J'aime la nourriture."},
      {"gr": "Δεν μου αρέσει.", "lat": "den mou aresi", "en": "I don't like it.", "fr": "Je n'aime pas ça."},
      {"gr": "Έχετε ένα τραπέζι για δύο;", "lat": "echete ena trapezi gia dio", "en": "Do you have a table for two?", "fr": "Avez-vous une table pour deux ?"},
      {"gr": "Είναι πολύ ακριβό.", "lat": "ine poli akrivo", "en": "It is very expensive.", "fr": "C'est très cher."},
      {"gr": "Θέλω να αγοράσω ψωμί.", "lat": "thelo na agoraso psomi", "en": "I want to buy bread.", "fr": "Je veux acheter du pain."},
      {"gr": "Ναι, ευχαριστώ.", "lat": "ne efcharisto", "en": "Yes, please.", "fr": "Oui, merci."},
      {"gr": "Όχι, ευχαριστώ.", "lat": "ochi efcharisto", "en": "No, thank you.", "fr": "Non, merci."}
    ]},
    {"id": "around", "name": "Going around", "phrases": [
      {"gr": "Πού είναι η στάση;", "lat": "pou ine i stasi", "en": "Where is the bus stop?", "fr": "Où est l'arrêt de bus ?"},
      {"gr": "Πηγαίνω στο σπίτι.", "lat": "pigaino sto spiti", "en": "I am going home.", "fr": "Je rentre à la maison.", "alt": ["Πάω στο σπίτι."]},
      {"gr": "Στρίψε αριστερά.", "lat": "stripse aristera", "en": "Turn left.", "fr": "Tourne à gauche."},
      {"gr": "Στρίψε δεξιά.", "lat": "stripse dexia", "en": "Turn right.", "fr": "Tourne à droite."},
      {"gr": "Πήγαινε ευθεία.", "lat": "pigaine efthia", "en": "Go straight ahead.", "fr": "Va tout droit."},
      {"gr": "Είναι κοντά;", "lat": "ine konta", "en": "Is it near?", "fr": "C'est près ?"},
      {"gr": "Είναι μακριά.", "lat": "ine makria", "en": "It is far.", "fr": "C'est loin."}
    ]},
    {"id": "feelings", "name": "Feelings & weather", "phrases": [
      {"gr": "Είμαι κουρασμένος.", "lat": "ime kourasmenos", "en": "I am tired.", "fr": "Je suis fatigué.", "alt": ["Είμαι κουρασμένη."]},
      {"gr": "Είμαι χαρούμενος.", "lat": "ime charoumenos", "en": "I am happy.", "fr": "Je suis content.", "alt": ["Είμαι χαρούμενη."]},
      {"gr": "Αγαπώ την Ελλάδα.", "lat": "agapo tin ellada", "en": "I love Greece.", "fr": "J'aime la Grèce.", "alt": ["Αγαπάω την Ελλάδα."]},
      {"gr": "Μου αρέσει η μουσική.", "lat": "mou aresi i mousiki", "en": "I like music.", "fr": "J'aime la musique."},
      {"gr": "Σήμερα έχει ζέστη.", "lat": "simera echei zesti", "en": "It is hot today.", "fr": "Il fait chaud aujourd'hui."},
      {"gr": "Βρέχει.", "lat": "vrechei", "en": "It is raining.", "fr": "Il pleut."},
      {"gr": "Κάνει κρύο.", "lat": "kani krio", "en": "It is cold.", "fr": "Il fait froid."},
      {"gr": "Πάμε για καφέ;", "lat": "pame gia kafe", "en": "Shall we go for coffee?", "fr": "On va prendre un café ?"},
      {"gr": "Δεν ξέρω.", "lat": "den xero", "en": "I don't know.", "fr": "Je ne sais pas."},
      {"gr": "Πιο αργά, παρακαλώ.", "lat": "pio arga parakalo", "en": "Slower, please.", "fr": "Plus lentement, s'il vous plaît."}
    ]}
  ]
};
