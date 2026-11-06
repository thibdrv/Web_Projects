// Dialogues. Edit freely.
//  - Each dialogue has two speakers ("roles"). In a line, "s" is 0 or 1: who speaks.
//  - "gr" is what is said (it gets a recording: tools/make_audio.py makes it), "lat" its pronunciation,
//    "en" and "fr" the meaning.
//  - "quiz" has the listening questions: "ok" is the right answer, "bad" the three wrong ones.
const DIALOGUES = {
  "dialogues": [
    {"id": "meet", "name": "Meeting someone",
     "roles": [{"en": "Anna", "fr": "Anna"}, {"en": "Petros", "fr": "Petros"}],
     "lines": [
       {"s": 0, "gr": "Γεια σου! Με λένε Άννα.", "lat": "yia sou me lene anna", "en": "Hi! My name is Anna.", "fr": "Salut ! Je m'appelle Anna."},
       {"s": 1, "gr": "Γεια σου, Άννα. Εγώ είμαι ο Πέτρος.", "lat": "yia sou anna ego ime o petros", "en": "Hi, Anna. I am Petros.", "fr": "Salut, Anna. Moi, je suis Petros."},
       {"s": 0, "gr": "Χάρηκα πολύ. Από πού είσαι;", "lat": "charika poli apo pou ise", "en": "Nice to meet you. Where are you from?", "fr": "Enchantée. D'où viens-tu ?"},
       {"s": 1, "gr": "Είμαι από την Αθήνα. Εσύ;", "lat": "ime apo tin athina esi", "en": "I am from Athens. And you?", "fr": "Je viens d'Athènes. Et toi ?"},
       {"s": 0, "gr": "Εγώ είμαι από τη Γαλλία.", "lat": "ego ime apo ti gallia", "en": "I am from France.", "fr": "Moi, je viens de France."},
       {"s": 1, "gr": "Μιλάς πολύ καλά ελληνικά!", "lat": "milas poli kala ellinika", "en": "You speak Greek very well!", "fr": "Tu parles très bien grec !"},
       {"s": 0, "gr": "Ευχαριστώ! Μαθαίνω ελληνικά.", "lat": "efcharisto matheno ellinika", "en": "Thank you! I am learning Greek.", "fr": "Merci ! J'apprends le grec."},
       {"s": 1, "gr": "Μπράβο!", "lat": "bravo", "en": "Well done!", "fr": "Bravo !"}
     ],
     "quiz": [
       {"en": "Where is Petros from?", "fr": "D'où vient Petros ?", "ok": {"en": "From Athens", "fr": "D'Athènes"}, "bad": [{"en": "From France", "fr": "De France"}, {"en": "From Crete", "fr": "De Crète"}, {"en": "From Italy", "fr": "D'Italie"}]},
       {"en": "What is Anna doing?", "fr": "Que fait Anna ?", "ok": {"en": "She is learning Greek", "fr": "Elle apprend le grec"}, "bad": [{"en": "She is learning French", "fr": "Elle apprend le français"}, {"en": "She is buying a ticket", "fr": "Elle achète un billet"}, {"en": "She is looking for a hotel", "fr": "Elle cherche un hôtel"}]}
     ]},
    {"id": "cafe", "name": "At the café",
     "roles": [{"en": "Waiter", "fr": "Serveur"}, {"en": "Customer", "fr": "Client"}],
     "lines": [
       {"s": 0, "gr": "Καλημέρα! Τι θα πάρετε;", "lat": "kalimera ti tha parete", "en": "Good morning! What will you have?", "fr": "Bonjour ! Qu'est-ce que vous prendrez ?"},
       {"s": 1, "gr": "Έναν ελληνικό καφέ, παρακαλώ.", "lat": "enan elliniko kafe parakalo", "en": "A Greek coffee, please.", "fr": "Un café grec, s'il vous plaît."},
       {"s": 0, "gr": "Με ζάχαρη;", "lat": "me zachari", "en": "With sugar?", "fr": "Avec du sucre ?"},
       {"s": 1, "gr": "Μέτριο, παρακαλώ. Και ένα νερό.", "lat": "metrio parakalo ke ena nero", "en": "Medium, please. And a water.", "fr": "Moyennement sucré, s'il vous plaît. Et une eau."},
       {"s": 0, "gr": "Θέλετε και κάτι να φάτε;", "lat": "thelete ke kati na fate", "en": "Would you like something to eat too?", "fr": "Voulez-vous aussi quelque chose à manger ?"},
       {"s": 1, "gr": "Ναι, ένα τοστ με τυρί.", "lat": "ne ena tost me tiri", "en": "Yes, a cheese toastie.", "fr": "Oui, un toast au fromage."},
       {"s": 0, "gr": "Αμέσως!", "lat": "amesos", "en": "Right away!", "fr": "Tout de suite !"},
       {"s": 1, "gr": "Τον λογαριασμό, παρακαλώ.", "lat": "ton logariasmo parakalo", "en": "The bill, please.", "fr": "L'addition, s'il vous plaît."}
     ],
     "quiz": [
       {"en": "What does the customer drink?", "fr": "Que boit le client ?", "ok": {"en": "A Greek coffee and a water", "fr": "Un café grec et de l'eau"}, "bad": [{"en": "A tea and a juice", "fr": "Un thé et un jus"}, {"en": "A beer", "fr": "Une bière"}, {"en": "Only water", "fr": "Seulement de l'eau"}]},
       {"en": "What does the customer eat?", "fr": "Que mange le client ?", "ok": {"en": "A cheese toastie", "fr": "Un toast au fromage"}, "bad": [{"en": "A salad", "fr": "Une salade"}, {"en": "A pizza", "fr": "Une pizza"}, {"en": "Nothing", "fr": "Rien"}]}
     ]},
    {"id": "restaurant", "name": "At the restaurant",
     "roles": [{"en": "Waiter", "fr": "Serveur"}, {"en": "Customer", "fr": "Client"}],
     "lines": [
       {"s": 1, "gr": "Έχετε τραπέζι για δύο;", "lat": "echete trapezi yia dio", "en": "Do you have a table for two?", "fr": "Avez-vous une table pour deux ?"},
       {"s": 0, "gr": "Ναι, από εδώ, παρακαλώ.", "lat": "ne apo edo parakalo", "en": "Yes, this way, please.", "fr": "Oui, par ici, s'il vous plaît."},
       {"s": 1, "gr": "Τι έχετε σήμερα;", "lat": "ti echete simera", "en": "What do you have today?", "fr": "Qu'avez-vous aujourd'hui ?"},
       {"s": 0, "gr": "Σήμερα έχουμε μουσακά και σουβλάκια.", "lat": "simera echoume mousaka ke souvlakia", "en": "Today we have moussaka and souvlaki.", "fr": "Aujourd'hui nous avons de la moussaka et des souvlakis."},
       {"s": 1, "gr": "Θα πάρω έναν μουσακά.", "lat": "tha paro enan mousaka", "en": "I will have a moussaka.", "fr": "Je prendrai une moussaka."},
       {"s": 1, "gr": "Και μια σαλάτα, παρακαλώ.", "lat": "ke mia salata parakalo", "en": "And a salad, please.", "fr": "Et une salade, s'il vous plaît."},
       {"s": 0, "gr": "Και τι θα πιείτε;", "lat": "ke ti tha piite", "en": "And what will you drink?", "fr": "Et que boirez-vous ?"},
       {"s": 1, "gr": "Ένα κρασί και ένα νερό.", "lat": "ena krasi ke ena nero", "en": "A glass of wine and a water.", "fr": "Un verre de vin et une eau."}
     ],
     "quiz": [
       {"en": "How many people are eating?", "fr": "Combien de personnes mangent ?", "ok": {"en": "Two", "fr": "Deux"}, "bad": [{"en": "One", "fr": "Une"}, {"en": "Three", "fr": "Trois"}, {"en": "Four", "fr": "Quatre"}]},
       {"en": "What does the customer order to eat?", "fr": "Que commande le client à manger ?", "ok": {"en": "A moussaka and a salad", "fr": "Une moussaka et une salade"}, "bad": [{"en": "Souvlaki and chips", "fr": "Des souvlakis et des frites"}, {"en": "A pizza", "fr": "Une pizza"}, {"en": "Only a salad", "fr": "Seulement une salade"}]}
     ]},
    {"id": "way", "name": "Asking the way",
     "roles": [{"en": "You", "fr": "Toi"}, {"en": "Passer-by", "fr": "Passant"}],
     "lines": [
       {"s": 0, "gr": "Συγγνώμη, πού είναι το μουσείο;", "lat": "singnomi pou ine to mousio", "en": "Excuse me, where is the museum?", "fr": "Excusez-moi, où est le musée ?"},
       {"s": 1, "gr": "Πηγαίνετε ευθεία και μετά στρίψτε αριστερά.", "lat": "piyenete efthia ke meta stripste aristera", "en": "Go straight, then turn left.", "fr": "Allez tout droit, puis tournez à gauche."},
       {"s": 0, "gr": "Είναι μακριά;", "lat": "ine makria", "en": "Is it far?", "fr": "C'est loin ?"},
       {"s": 1, "gr": "Όχι, είναι πέντε λεπτά με τα πόδια.", "lat": "ochi ine pende lepta me ta podia", "en": "No, it is five minutes on foot.", "fr": "Non, c'est à cinq minutes à pied."},
       {"s": 0, "gr": "Και το μουσείο είναι δίπλα στην τράπεζα;", "lat": "ke to mousio ine dipla stin trapeza", "en": "And is the museum next to the bank?", "fr": "Et le musée est-il à côté de la banque ?"},
       {"s": 1, "gr": "Ναι, απέναντι από την εκκλησία.", "lat": "ne apenandi apo tin ekklisia", "en": "Yes, opposite the church.", "fr": "Oui, en face de l'église."},
       {"s": 0, "gr": "Ευχαριστώ πολύ!", "lat": "efcharisto poli", "en": "Thank you very much!", "fr": "Merci beaucoup !"},
       {"s": 1, "gr": "Παρακαλώ.", "lat": "parakalo", "en": "You are welcome.", "fr": "Je vous en prie."}
     ],
     "quiz": [
       {"en": "Where is the museum?", "fr": "Où est le musée ?", "ok": {"en": "Straight on, then left", "fr": "Tout droit, puis à gauche"}, "bad": [{"en": "Straight on, then right", "fr": "Tout droit, puis à droite"}, {"en": "Behind the station", "fr": "Derrière la gare"}, {"en": "On the left, in the park", "fr": "À gauche, dans le parc"}]},
       {"en": "How long does it take to get there?", "fr": "Combien de temps faut-il pour y aller ?", "ok": {"en": "Five minutes on foot", "fr": "Cinq minutes à pied"}, "bad": [{"en": "Fifteen minutes by bus", "fr": "Quinze minutes en bus"}, {"en": "One hour by car", "fr": "Une heure en voiture"}, {"en": "Two minutes by taxi", "fr": "Deux minutes en taxi"}]}
     ]},
    {"id": "hotel", "name": "At the hotel",
     "roles": [{"en": "Guest", "fr": "Client"}, {"en": "Receptionist", "fr": "Réceptionniste"}],
     "lines": [
       {"s": 0, "gr": "Καλησπέρα. Έχω μια κράτηση στο όνομα Παπαδόπουλος.", "lat": "kalispera echo mia kratisi sto onoma papadopoulos", "en": "Good evening. I have a reservation in the name of Papadopoulos.", "fr": "Bonsoir. J'ai une réservation au nom de Papadopoulos."},
       {"s": 1, "gr": "Καλώς ήρθατε! Το διαβατήριό σας, παρακαλώ.", "lat": "kalos irthate to diavatirio sas parakalo", "en": "Welcome! Your passport, please.", "fr": "Bienvenue ! Votre passeport, s'il vous plaît."},
       {"s": 0, "gr": "Ορίστε.", "lat": "oriste", "en": "Here you are.", "fr": "Voilà."},
       {"s": 1, "gr": "Το δωμάτιό σας είναι το δώδεκα, στον δεύτερο όροφο.", "lat": "to domatio sas ine to dodeka ston deftero orofo", "en": "Your room is number twelve, on the second floor.", "fr": "Votre chambre est la douze, au deuxième étage."},
       {"s": 0, "gr": "Τι ώρα είναι το πρωινό;", "lat": "ti ora ine to proino", "en": "What time is breakfast?", "fr": "À quelle heure est le petit-déjeuner ?"},
       {"s": 1, "gr": "Από τις επτά μέχρι τις δέκα.", "lat": "apo tis epta mechri tis deka", "en": "From seven until ten.", "fr": "De sept heures à dix heures."},
       {"s": 0, "gr": "Υπάρχει ασανσέρ;", "lat": "iparchi asanser", "en": "Is there an elevator?", "fr": "Y a-t-il un ascenseur ?"},
       {"s": 1, "gr": "Ναι, εκεί, δίπλα στην είσοδο.", "lat": "ne eki dipla stin isodo", "en": "Yes, there, next to the entrance.", "fr": "Oui, là, à côté de l'entrée."}
     ],
     "quiz": [
       {"en": "Which floor is the room on?", "fr": "À quel étage est la chambre ?", "ok": {"en": "The second", "fr": "Au deuxième"}, "bad": [{"en": "The first", "fr": "Au premier"}, {"en": "The third", "fr": "Au troisième"}, {"en": "The ground floor", "fr": "Au rez-de-chaussée"}]},
       {"en": "When is breakfast?", "fr": "Quand est le petit-déjeuner ?", "ok": {"en": "From seven to ten", "fr": "De sept à dix heures"}, "bad": [{"en": "From six to eight", "fr": "De six à huit heures"}, {"en": "From eight to eleven", "fr": "De huit à onze heures"}, {"en": "From ten to noon", "fr": "De dix heures à midi"}]}
     ]},
    {"id": "clothes", "name": "Buying clothes",
     "roles": [{"en": "Shop assistant", "fr": "Vendeur"}, {"en": "Customer", "fr": "Client"}],
     "lines": [
       {"s": 0, "gr": "Μπορώ να σας βοηθήσω;", "lat": "boro na sas voithiso", "en": "Can I help you?", "fr": "Puis-je vous aider ?"},
       {"s": 1, "gr": "Ναι, ψάχνω ένα πουκάμισο.", "lat": "ne psachno ena poukamiso", "en": "Yes, I am looking for a shirt.", "fr": "Oui, je cherche une chemise."},
       {"s": 0, "gr": "Τι μέγεθος φοράτε;", "lat": "ti meyethos forate", "en": "What size do you wear?", "fr": "Quelle taille faites-vous ?"},
       {"s": 1, "gr": "Μέτριο.", "lat": "metrio", "en": "Medium.", "fr": "Moyenne."},
       {"s": 0, "gr": "Τι χρώμα θέλετε;", "lat": "ti chroma thelete", "en": "What color do you want?", "fr": "Quelle couleur voulez-vous ?"},
       {"s": 1, "gr": "Μπλε. Πόσο κάνει;", "lat": "ble poso kani", "en": "Blue. How much is it?", "fr": "Bleue. Combien ça coûte ?"},
       {"s": 0, "gr": "Τριάντα ευρώ.", "lat": "trianda evro", "en": "Thirty euros.", "fr": "Trente euros."},
       {"s": 1, "gr": "Είναι λίγο ακριβό. Έχετε κάτι φθηνότερο;", "lat": "ine ligo akrivo echete kati fthinotero", "en": "It is a bit expensive. Do you have something cheaper?", "fr": "C'est un peu cher. Avez-vous quelque chose de moins cher ?"},
       {"s": 0, "gr": "Ναι, αυτό κάνει είκοσι ευρώ.", "lat": "ne afto kani ikosi evro", "en": "Yes, this one is twenty euros.", "fr": "Oui, celle-ci coûte vingt euros."},
       {"s": 1, "gr": "Μου αρέσει. Θα το πάρω.", "lat": "mou aresi tha to paro", "en": "I like it. I will take it.", "fr": "Elle me plaît. Je la prends."}
     ],
     "quiz": [
       {"en": "What does the customer want to buy?", "fr": "Qu'est-ce que le client veut acheter ?", "ok": {"en": "A shirt", "fr": "Une chemise"}, "bad": [{"en": "A coat", "fr": "Un manteau"}, {"en": "Shoes", "fr": "Des chaussures"}, {"en": "A dress", "fr": "Une robe"}]},
       {"en": "Why does the customer ask for another one?", "fr": "Pourquoi le client en demande-t-il une autre ?", "ok": {"en": "The first one is too expensive", "fr": "La première est trop chère"}, "bad": [{"en": "It is too big", "fr": "Elle est trop grande"}, {"en": "It is the wrong color", "fr": "Ce n'est pas la bonne couleur"}, {"en": "It is too old", "fr": "Elle est trop vieille"}]}
     ]},
    {"id": "market", "name": "At the market",
     "roles": [{"en": "Seller", "fr": "Vendeur"}, {"en": "Customer", "fr": "Client"}],
     "lines": [
       {"s": 1, "gr": "Καλημέρα! Πόσο κάνουν οι ντομάτες;", "lat": "kalimera poso kanoun i domates", "en": "Good morning! How much are the tomatoes?", "fr": "Bonjour ! Combien coûtent les tomates ?"},
       {"s": 0, "gr": "Δύο ευρώ το κιλό.", "lat": "dio evro to kilo", "en": "Two euros a kilo.", "fr": "Deux euros le kilo."},
       {"s": 1, "gr": "Δώστε μου ένα κιλό, παρακαλώ.", "lat": "doste mou ena kilo parakalo", "en": "Give me one kilo, please.", "fr": "Donnez-moi un kilo, s'il vous plaît."},
       {"s": 0, "gr": "Θέλετε τίποτα άλλο;", "lat": "thelete tipota allo", "en": "Do you want anything else?", "fr": "Voulez-vous autre chose ?"},
       {"s": 1, "gr": "Ναι, μισό κιλό μήλα.", "lat": "ne miso kilo mila", "en": "Yes, half a kilo of apples.", "fr": "Oui, un demi-kilo de pommes."},
       {"s": 0, "gr": "Ορίστε. Τρία και πενήντα όλα μαζί.", "lat": "oriste tria ke peninda ola mazi", "en": "Here you are. Three fifty altogether.", "fr": "Voilà. Trois euros cinquante en tout."},
       {"s": 1, "gr": "Ορίστε, πέντε ευρώ.", "lat": "oriste pende evro", "en": "Here, five euros.", "fr": "Tenez, cinq euros."},
       {"s": 0, "gr": "Ορίστε τα ρέστα. Ευχαριστώ!", "lat": "oriste ta resta efcharisto", "en": "Here is your change. Thank you!", "fr": "Voici la monnaie. Merci !"}
     ],
     "quiz": [
       {"en": "How much do the tomatoes cost?", "fr": "Combien coûtent les tomates ?", "ok": {"en": "Two euros a kilo", "fr": "Deux euros le kilo"}, "bad": [{"en": "Three euros a kilo", "fr": "Trois euros le kilo"}, {"en": "One euro a kilo", "fr": "Un euro le kilo"}, {"en": "Five euros a kilo", "fr": "Cinq euros le kilo"}]},
       {"en": "What does the customer buy?", "fr": "Qu'achète le client ?", "ok": {"en": "Tomatoes and apples", "fr": "Des tomates et des pommes"}, "bad": [{"en": "Only tomatoes", "fr": "Seulement des tomates"}, {"en": "Apples and bananas", "fr": "Des pommes et des bananes"}, {"en": "Oranges and lemons", "fr": "Des oranges et des citrons"}]}
     ]},
    {"id": "plans", "name": "Making plans",
     "roles": [{"en": "Maria", "fr": "Maria"}, {"en": "Nikos", "fr": "Nikos"}],
     "lines": [
       {"s": 1, "gr": "Έλα, τι κάνεις;", "lat": "ela ti kanis", "en": "Hello, how are you?", "fr": "Allô, comment vas-tu ?"},
       {"s": 0, "gr": "Καλά, εσύ;", "lat": "kala esi", "en": "Fine, and you?", "fr": "Bien, et toi ?"},
       {"s": 1, "gr": "Κι εγώ καλά. Θέλεις να βγούμε αύριο το βράδυ;", "lat": "ki ego kala thelis na vgoume avrio to vradi", "en": "Fine too. Do you want to go out tomorrow evening?", "fr": "Moi aussi. Veux-tu sortir demain soir ?"},
       {"s": 0, "gr": "Ναι, με χαρά! Τι ώρα;", "lat": "ne me chara ti ora", "en": "Yes, with pleasure! What time?", "fr": "Oui, avec plaisir ! À quelle heure ?"},
       {"s": 1, "gr": "Στις οκτώ;", "lat": "stis okto", "en": "At eight?", "fr": "À huit heures ?"},
       {"s": 0, "gr": "Εντάξει. Πού θα συναντηθούμε;", "lat": "endaxi pou tha sinandithoume", "en": "OK. Where shall we meet?", "fr": "D'accord. Où nous retrouvons-nous ?"},
       {"s": 1, "gr": "Στην πλατεία, μπροστά στην εκκλησία.", "lat": "stin platia brosta stin ekklisia", "en": "In the square, in front of the church.", "fr": "Sur la place, devant l'église."},
       {"s": 0, "gr": "Τέλεια! Τα λέμε αύριο.", "lat": "telia ta leme avrio", "en": "Great! See you tomorrow.", "fr": "Super ! À demain."}
     ],
     "quiz": [
       {"en": "When do they meet?", "fr": "Quand se retrouvent-ils ?", "ok": {"en": "Tomorrow at eight in the evening", "fr": "Demain à huit heures du soir"}, "bad": [{"en": "Today at six", "fr": "Aujourd'hui à six heures"}, {"en": "Tomorrow at noon", "fr": "Demain à midi"}, {"en": "On Sunday at nine", "fr": "Dimanche à neuf heures"}]},
       {"en": "Where do they meet?", "fr": "Où se retrouvent-ils ?", "ok": {"en": "In the square, in front of the church", "fr": "Sur la place, devant l'église"}, "bad": [{"en": "At the café", "fr": "Au café"}, {"en": "At the station", "fr": "À la gare"}, {"en": "At the beach", "fr": "À la plage"}]}
     ]},
    {"id": "doctor", "name": "At the doctor",
     "roles": [{"en": "Doctor", "fr": "Médecin"}, {"en": "Patient", "fr": "Patient"}],
     "lines": [
       {"s": 0, "gr": "Τι σας συμβαίνει;", "lat": "ti sas simveni", "en": "What is the matter?", "fr": "Qu'est-ce qui ne va pas ?"},
       {"s": 1, "gr": "Με πονάει το κεφάλι και έχω πυρετό.", "lat": "me ponai to kefali ke echo pireto", "en": "My head hurts and I have a fever.", "fr": "J'ai mal à la tête et j'ai de la fièvre."},
       {"s": 0, "gr": "Από πότε;", "lat": "apo pote", "en": "Since when?", "fr": "Depuis quand ?"},
       {"s": 1, "gr": "Από χθες το βράδυ.", "lat": "apo chthes to vradi", "en": "Since last night.", "fr": "Depuis hier soir."},
       {"s": 0, "gr": "Πάρτε αυτό το χάπι δύο φορές την ημέρα.", "lat": "parte afto to chapi dio fores tin imera", "en": "Take this pill twice a day.", "fr": "Prenez ce comprimé deux fois par jour."},
       {"s": 1, "gr": "Θα περάσει σύντομα;", "lat": "tha perasi sindoma", "en": "Will it get better soon?", "fr": "Est-ce que ça passera bientôt ?"},
       {"s": 0, "gr": "Ναι, σε δύο μέρες θα είστε καλύτερα.", "lat": "ne se dio meres tha iste kalitera", "en": "Yes, in two days you will be better.", "fr": "Oui, dans deux jours vous irez mieux."},
       {"s": 1, "gr": "Ευχαριστώ, γιατρέ.", "lat": "efcharisto yiatre", "en": "Thank you, doctor.", "fr": "Merci, docteur."},
       {"s": 0, "gr": "Περαστικά!", "lat": "perastika", "en": "Get well soon!", "fr": "Bon rétablissement !"}
     ],
     "quiz": [
       {"en": "What is wrong with the patient?", "fr": "Qu'a le patient ?", "ok": {"en": "A headache and a fever", "fr": "Mal à la tête et de la fièvre"}, "bad": [{"en": "A stomach ache", "fr": "Mal au ventre"}, {"en": "A broken leg", "fr": "Une jambe cassée"}, {"en": "A sore throat", "fr": "Mal à la gorge"}]},
       {"en": "How many times a day must he take the pill?", "fr": "Combien de fois par jour doit-il prendre le comprimé ?", "ok": {"en": "Twice", "fr": "Deux fois"}, "bad": [{"en": "Once", "fr": "Une fois"}, {"en": "Three times", "fr": "Trois fois"}, {"en": "Every hour", "fr": "Toutes les heures"}]}
     ]},
    {"id": "taxi", "name": "In a taxi",
     "roles": [{"en": "Passenger", "fr": "Passager"}, {"en": "Driver", "fr": "Chauffeur"}],
     "lines": [
       {"s": 0, "gr": "Στο αεροδρόμιο, παρακαλώ.", "lat": "sto aerodromio parakalo", "en": "To the airport, please.", "fr": "À l'aéroport, s'il vous plaît."},
       {"s": 1, "gr": "Βεβαίως. Έχετε αποσκευές;", "lat": "veveos echete aposkeves", "en": "Of course. Do you have any luggage?", "fr": "Bien sûr. Avez-vous des bagages ?"},
       {"s": 0, "gr": "Ναι, δύο βαλίτσες.", "lat": "ne dio valitses", "en": "Yes, two suitcases.", "fr": "Oui, deux valises."},
       {"s": 0, "gr": "Πόση ώρα θα κάνουμε;", "lat": "posi ora tha kanoume", "en": "How long will it take?", "fr": "Combien de temps va-t-on mettre ?"},
       {"s": 1, "gr": "Σαράντα λεπτά περίπου.", "lat": "saranda lepta peripou", "en": "About forty minutes.", "fr": "Environ quarante minutes."},
       {"s": 0, "gr": "Πόσο κάνει;", "lat": "poso kani", "en": "How much is it?", "fr": "Combien ça coûte ?"},
       {"s": 1, "gr": "Σαράντα ευρώ.", "lat": "saranda evro", "en": "Forty euros.", "fr": "Quarante euros."},
       {"s": 0, "gr": "Ορίστε. Κρατήστε τα ρέστα.", "lat": "oriste kratiste ta resta", "en": "Here you are. Keep the change.", "fr": "Voilà. Gardez la monnaie."},
       {"s": 1, "gr": "Ευχαριστώ! Καλό ταξίδι!", "lat": "efcharisto kalo taxidi", "en": "Thank you! Have a good trip!", "fr": "Merci ! Bon voyage !"}
     ],
     "quiz": [
       {"en": "Where does the passenger want to go?", "fr": "Où le passager veut-il aller ?", "ok": {"en": "To the airport", "fr": "À l'aéroport"}, "bad": [{"en": "To the port", "fr": "Au port"}, {"en": "To the hotel", "fr": "À l'hôtel"}, {"en": "To the station", "fr": "À la gare"}]},
       {"en": "How long is the trip?", "fr": "Combien de temps dure le trajet ?", "ok": {"en": "About forty minutes", "fr": "Environ quarante minutes"}, "bad": [{"en": "About ten minutes", "fr": "Environ dix minutes"}, {"en": "About two hours", "fr": "Environ deux heures"}, {"en": "About twenty minutes", "fr": "Environ vingt minutes"}]}
     ]}
  ]
};
