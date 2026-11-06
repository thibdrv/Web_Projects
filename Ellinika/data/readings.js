/* Short texts to read, level A2 to B2 (kind "reading" in the Texts page), with questions. Made from readings.txt (tools: gen_readings.py).
   Written by Claude for this app, not reviewed by a native speaker. The same shape as data/recipes.js. */
const READINGS = {
 "texts": [
  {
   "id": "laiki",
   "kind": "reading",
   "level": "A2",
   "title": {
    "gr": "Η λαϊκή αγορά",
    "en": "The street market",
    "fr": "Le marché de quartier"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A morning at the Saturday street market.",
    "fr": "Un matin au marché du samedi."
   },
   "qs": [
    {
     "q": {
      "gr": "Πότε ανοίγει η αγορά;",
      "en": "When does the market open?",
      "fr": "Quand le marché ouvre-t-il ?"
     },
     "ok": "Στις οκτώ.",
     "bad": [
      "Στις δέκα.",
      "Το μεσημέρι.",
      "Το βράδυ."
     ]
    },
    {
     "q": {
      "gr": "Τι αγοράζει η μητέρα;",
      "en": "What does the mother buy?",
      "fr": "Qu'achète la mère ?"
     },
     "ok": "Πατάτες και μήλα.",
     "bad": [
      "Ψάρια και κρέας.",
      "Ψωμί και τυρί.",
      "Παπούτσια και ρούχα."
     ]
    },
    {
     "q": {
      "gr": "Τι δοκιμάζει ο γιος;",
      "en": "What does the son taste?",
      "fr": "Que goûte le fils ?"
     },
     "ok": "Ένα κομμάτι καρπούζι.",
     "bad": [
      "Ένα κομμάτι τυρί.",
      "Ένα πορτοκάλι.",
      "Ένα γλυκό."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Κάθε Σάββατο πάω στη λαϊκή αγορά με τη μητέρα μου.",
     "en": "Every Saturday I go to the street market with my mother.",
     "fr": "Chaque samedi, je vais au marché avec ma mère.",
     "lat": "kathe savvato pao sti laiki agora me ti mitera mou"
    },
    {
     "gr": "Ξυπνάμε νωρίς, γιατί η αγορά ανοίγει στις οκτώ.",
     "en": "We wake up early, because the market opens at eight.",
     "fr": "Nous nous levons tôt, car le marché ouvre à huit heures.",
     "lat": "xipname noris yiati i agora aniyi stis okto"
    },
    {
     "gr": "Οι πωλητές φωνάζουν: «Φρέσκες ντομάτες! Φτηνά πορτοκάλια!»",
     "en": "The sellers shout: “Fresh tomatoes! Cheap oranges!”",
     "fr": "Les vendeurs crient : « Tomates fraîches ! Oranges pas chères ! »",
     "lat": "i polites fonazoun freskes domates ftina portokalia"
    },
    {
     "gr": "Η μητέρα μου αγοράζει δύο κιλά πατάτες και ένα κιλό μήλα.",
     "en": "My mother buys two kilos of potatoes and one kilo of apples.",
     "fr": "Ma mère achète deux kilos de pommes de terre et un kilo de pommes.",
     "lat": "i mitera mou agorazi dio kila patates ke ena kilo mila"
    },
    {
     "gr": "Εγώ διαλέγω τα πιο γλυκά σταφύλια.",
     "en": "I choose the sweetest grapes.",
     "fr": "Moi, je choisis les raisins les plus sucrés.",
     "lat": "ego dialego ta pio glika stafilia"
    },
    {
     "gr": "Ο πωλητής μου δίνει ένα κομμάτι καρπούζι να το δοκιμάσω.",
     "en": "The seller gives me a piece of watermelon to taste.",
     "fr": "Le vendeur me donne un morceau de pastèque à goûter.",
     "lat": "o politis mou dini ena kommati karpouzi na to dokimaso"
    },
    {
     "gr": "«Είναι πολύ νόστιμο!» λέω και χαμογελάω.",
     "en": "“It is very tasty!” I say and smile.",
     "fr": "« C'est délicieux ! » dis-je en souriant.",
     "lat": "ine poli nostimo leo ke chamoyelao"
    },
    {
     "gr": "Στο τέλος πληρώνουμε και γυρίζουμε σπίτι με δύο βαριές τσάντες.",
     "en": "In the end we pay and go home with two heavy bags.",
     "fr": "À la fin, nous payons et nous rentrons avec deux sacs lourds.",
     "lat": "sto telos plironoume ke yirizoume spiti me dio varies tsandes"
    },
    {
     "gr": "Το μεσημέρι μαγειρεύουμε μαζί μια μεγάλη σαλάτα.",
     "en": "At noon we cook a big salad together.",
     "fr": "À midi, nous préparons ensemble une grande salade.",
     "lat": "to mesimeri mayirevoume mazi mia megali salata"
    }
   ]
  },
  {
   "id": "kafeneio",
   "kind": "reading",
   "level": "A2",
   "title": {
    "gr": "Στο καφενείο",
    "en": "At the café",
    "fr": "Au café"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "Two friends meet in a village café.",
    "fr": "Deux amis se retrouvent dans un café de village."
   },
   "qs": [
    {
     "q": {
      "gr": "Πού κάθονται οι φίλοι;",
      "en": "Where do the friends sit?",
      "fr": "Où les amis s'assoient-ils ?"
     },
     "ok": "Έξω, κάτω από ένα δέντρο.",
     "bad": [
      "Μέσα, δίπλα στο παράθυρο.",
      "Στη θάλασσα.",
      "Στο σπίτι."
     ]
    },
    {
     "q": {
      "gr": "Τι παραγγέλνει ο Πέτρος;",
      "en": "What does Petros order?",
      "fr": "Que commande Petros ?"
     },
     "ok": "Έναν φραπέ.",
     "bad": [
      "Έναν ελληνικό καφέ.",
      "Ένα τσάι.",
      "Μια μπίρα."
     ]
    },
    {
     "q": {
      "gr": "Πού θέλει να πάει ο Πέτρος το καλοκαίρι;",
      "en": "Where does Petros want to go in summer?",
      "fr": "Où Petros veut-il aller cet été ?"
     },
     "ok": "Στην Κρήτη.",
     "bad": [
      "Στην Κύπρο.",
      "Στην Αθήνα.",
      "Στη Ρόδο."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Ο Γιάννης και ο Πέτρος συναντιούνται στο καφενείο της πλατείας.",
     "en": "Yannis and Petros meet at the café on the square.",
     "fr": "Yannis et Petros se retrouvent au café de la place.",
     "lat": "o yiannis ke o petros sinandiounde sto kafenio tis platias"
    },
    {
     "gr": "Κάθονται έξω, κάτω από ένα μεγάλο δέντρο.",
     "en": "They sit outside, under a big tree.",
     "fr": "Ils s'assoient dehors, sous un grand arbre.",
     "lat": "kathonde exo kato apo ena megalo dendro"
    },
    {
     "gr": "Ο σερβιτόρος έρχεται και ρωτάει: «Τι θα πάρετε;»",
     "en": "The waiter comes and asks: “What will you have?”",
     "fr": "Le serveur vient et demande : « Que prendrez-vous ? »",
     "lat": "o servitoros erchete ke rotai ti tha parete"
    },
    {
     "gr": "Ο Γιάννης παραγγέλνει έναν ελληνικό καφέ χωρίς ζάχαρη.",
     "en": "Yannis orders a Greek coffee without sugar.",
     "fr": "Yannis commande un café grec sans sucre.",
     "lat": "o yiannis parangelni enan elliniko kafe choris zachari"
    },
    {
     "gr": "Ο Πέτρος προτιμά έναν φραπέ με γάλα και ένα ποτήρι νερό.",
     "en": "Petros prefers a frappé with milk and a glass of water.",
     "fr": "Petros préfère un frappé avec du lait et un verre d'eau.",
     "lat": "o petros protima enan frape me gala ke ena potiri nero"
    },
    {
     "gr": "Μιλούν για τη δουλειά, για τις διακοπές και για το ποδόσφαιρο.",
     "en": "They talk about work, about holidays and about football.",
     "fr": "Ils parlent du travail, des vacances et du football.",
     "lat": "miloun yia ti doulia yia tis diakopes ke yia to podosfero"
    },
    {
     "gr": "Ο Πέτρος λέει ότι θέλει να ταξιδέψει στην Κρήτη το καλοκαίρι.",
     "en": "Petros says that he wants to travel to Crete in the summer.",
     "fr": "Petros dit qu'il veut voyager en Crète cet été.",
     "lat": "o petros lei oti theli na taxidepsi stin kriti to kalokeri"
    },
    {
     "gr": "«Έλα μαζί μου!» του λέει. «Θα περάσουμε πολύ ωραία.»",
     "en": "“Come with me!” he says. “We will have a great time.”",
     "fr": "« Viens avec moi ! » lui dit-il. « Nous passerons un très bon moment. »",
     "lat": "ela mazi mou tou lei tha perasoume poli orea"
    },
    {
     "gr": "Ο Γιάννης γελάει και απαντά ότι θα το σκεφτεί.",
     "en": "Yannis laughs and answers that he will think about it.",
     "fr": "Yannis rit et répond qu'il va y réfléchir.",
     "lat": "o yiannis yelai ke apanda oti tha to skefti"
    },
    {
     "gr": "Μετά από μία ώρα ζητούν τον λογαριασμό και πληρώνουν.",
     "en": "After an hour they ask for the bill and pay.",
     "fr": "Au bout d'une heure, ils demandent l'addition et paient.",
     "lat": "meta apo mia ora zitoun ton logariasmo ke plironoun"
    }
   ]
  },
  {
   "id": "tilefwno",
   "kind": "reading",
   "level": "A2",
   "title": {
    "gr": "Ένα τηλεφώνημα",
    "en": "A phone call",
    "fr": "Un appel téléphonique"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "Maria calls her friend to plan the weekend.",
    "fr": "Maria appelle son amie pour organiser le week-end."
   },
   "qs": [
    {
     "q": {
      "gr": "Πότε θα πάνε στην παραλία;",
      "en": "When will they go to the beach?",
      "fr": "Quand iront-elles à la plage ?"
     },
     "ok": "Το Σάββατο το πρωί.",
     "bad": [
      "Την Κυριακή το βράδυ.",
      "Την Παρασκευή.",
      "Σήμερα το απόγευμα."
     ]
    },
    {
     "q": {
      "gr": "Με τι θα πάνε;",
      "en": "How will they go?",
      "fr": "Comment iront-elles ?"
     },
     "ok": "Με το αυτοκίνητο της Μαρίας.",
     "bad": [
      "Με το λεωφορείο.",
      "Με το τρένο.",
      "Με τα πόδια."
     ]
    },
    {
     "q": {
      "gr": "Τι θα φέρει η Ελένη;",
      "en": "What will Eleni bring?",
      "fr": "Qu'apportera Eleni ?"
     },
     "ok": "Φρούτα και νερό.",
     "bad": [
      "Σάντουιτς.",
      "Παγωτό.",
      "Καφέ."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Η Μαρία παίρνει τηλέφωνο την Ελένη το απόγευμα.",
     "en": "Maria phones Eleni in the afternoon.",
     "fr": "Maria téléphone à Eleni l'après-midi.",
     "lat": "i maria perni tilefono tin eleni to apoyevma"
    },
    {
     "gr": "«Γεια σου, Ελένη! Τι κάνεις; Είσαι ελεύθερη το Σάββατο;»",
     "en": "“Hello, Eleni! How are you? Are you free on Saturday?”",
     "fr": "« Salut Eleni ! Comment vas-tu ? Es-tu libre samedi ? »",
     "lat": "yia sou eleni ti kanis ise eleftheri to savvato"
    },
    {
     "gr": "«Καλά είμαι, ευχαριστώ. Ναι, δεν έχω τίποτα το Σάββατο.»",
     "en": "“I am fine, thank you. Yes, I have nothing on Saturday.”",
     "fr": "« Je vais bien, merci. Oui, je n'ai rien de prévu samedi. »",
     "lat": "kala ime efcharisto ne den echo tipota to savvato"
    },
    {
     "gr": "«Τότε θέλεις να πάμε εκδρομή στην παραλία;»",
     "en": "“Then do you want to go on a trip to the beach?”",
     "fr": "« Alors, tu veux qu'on aille à la plage ? »",
     "lat": "tote thelis na pame ekdromi stin paralia"
    },
    {
     "gr": "«Φυσικά! Τι ώρα θα φύγουμε;»",
     "en": "“Of course! What time will we leave?”",
     "fr": "« Bien sûr ! À quelle heure partirons-nous ? »",
     "lat": "fisika ti ora tha figoume"
    },
    {
     "gr": "«Στις εννέα το πρωί, με το αυτοκίνητό μου.»",
     "en": "“At nine in the morning, in my car.”",
     "fr": "« À neuf heures du matin, dans ma voiture. »",
     "lat": "stis ennea to proi me to aftokinito mou"
    },
    {
     "gr": "«Να φέρω κάτι να φάμε;»",
     "en": "“Shall I bring something to eat?”",
     "fr": "« Je peux apporter quelque chose à manger ? »",
     "lat": "na fero kati na fame"
    },
    {
     "gr": "«Φέρε φρούτα και νερό. Εγώ θα φτιάξω σάντουιτς.»",
     "en": "“Bring fruit and water. I will make sandwiches.”",
     "fr": "« Apporte des fruits et de l'eau. Moi, je ferai des sandwichs. »",
     "lat": "fere frouta ke nero ego tha ftiaxo sandouits"
    },
    {
     "gr": "«Τέλεια! Τα λέμε το Σάββατο. Γεια!»",
     "en": "“Perfect! See you on Saturday. Bye!”",
     "fr": "« Parfait ! À samedi. Salut ! »",
     "lat": "telia ta leme to savvato yia"
    }
   ]
  },
  {
   "id": "mera-athina",
   "kind": "reading",
   "level": "B1",
   "title": {
    "gr": "Μια μέρα στην Αθήνα",
    "en": "A day in Athens",
    "fr": "Une journée à Athènes"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A tourist plans a day in the capital.",
    "fr": "Un touriste organise une journée dans la capitale."
   },
   "qs": [
    {
     "q": {
      "gr": "Γιατί ανεβαίνει νωρίς στην Ακρόπολη;",
      "en": "Why does he go up the Acropolis early?",
      "fr": "Pourquoi monte-t-il tôt à l'Acropole ?"
     },
     "ok": "Για να μην κάνει πολλή ζέστη.",
     "bad": [
      "Γιατί κλείνει νωρίς.",
      "Γιατί δεν έχει εισιτήριο.",
      "Για να δει το ηλιοβασίλεμα."
     ]
    },
    {
     "q": {
      "gr": "Τι τρώει για μεσημεριανό;",
      "en": "What does he eat for lunch?",
      "fr": "Que mange-t-il au déjeuner ?"
     },
     "ok": "Σουβλάκι.",
     "bad": [
      "Μουσακά.",
      "Σαλάτα.",
      "Ψάρι."
     ]
    },
    {
     "q": {
      "gr": "Πώς πηγαίνει στο Σύνταγμα;",
      "en": "How does he go to Syntagma?",
      "fr": "Comment va-t-il à Syntagma ?"
     },
     "ok": "Με το μετρό.",
     "bad": [
      "Με το ταξί.",
      "Με το ποδήλατο.",
      "Με τα πόδια."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Ο Τόμας είναι τουρίστας και περνάει τρεις μέρες στην Αθήνα.",
     "en": "Thomas is a tourist and spends three days in Athens.",
     "fr": "Thomas est touriste et passe trois jours à Athènes.",
     "lat": "o tomas ine touristas ke pernai tris meres stin athina"
    },
    {
     "gr": "Το πρωί ανεβαίνει στην Ακρόπολη πριν κάνει πολλή ζέστη.",
     "en": "In the morning he goes up the Acropolis before it gets very hot.",
     "fr": "Le matin, il monte à l'Acropole avant qu'il ne fasse trop chaud.",
     "lat": "to proi aneveni stin akropoli prin kani polli zesti"
    },
    {
     "gr": "Από ψηλά βλέπει όλη την πόλη και τη θάλασσα στο βάθος.",
     "en": "From above he sees the whole city and the sea in the distance.",
     "fr": "De là-haut, il voit toute la ville et la mer au loin.",
     "lat": "apo psila vlepi oli tin poli ke ti thalassa sto vathos"
    },
    {
     "gr": "Μετά κατεβαίνει στην Πλάκα και περπατά στα στενά σοκάκια.",
     "en": "Then he goes down to Plaka and walks along the narrow alleys.",
     "fr": "Ensuite, il descend à Plaka et se promène dans les ruelles étroites.",
     "lat": "meta kateveni stin plaka ke perpata sta stena sokakia"
    },
    {
     "gr": "Για μεσημεριανό τρώει σουβλάκι σε μια μικρή ταβέρνα.",
     "en": "For lunch he eats souvlaki in a small tavern.",
     "fr": "Pour le déjeuner, il mange un souvlaki dans une petite taverne.",
     "lat": "yia mesimeriano troi souvlaki se mia mikri taverna"
    },
    {
     "gr": "Το απόγευμα επισκέπτεται το Μουσείο της Ακρόπολης, που είναι πολύ μοντέρνο.",
     "en": "In the afternoon he visits the Acropolis Museum, which is very modern.",
     "fr": "L'après-midi, il visite le musée de l'Acropole, qui est très moderne.",
     "lat": "to apoyevma episkeptete to mousio tis akropolis pou ine poli monderno"
    },
    {
     "gr": "Εκεί μαθαίνει πολλά για την αρχαία ιστορία της Ελλάδας.",
     "en": "There he learns a lot about the ancient history of Greece.",
     "fr": "Là, il apprend beaucoup de choses sur l'histoire ancienne de la Grèce.",
     "lat": "eki matheni polla yia tin archea istoria tis elladas"
    },
    {
     "gr": "Το βράδυ παίρνει το μετρό και πηγαίνει στο Σύνταγμα.",
     "en": "In the evening he takes the metro and goes to Syntagma.",
     "fr": "Le soir, il prend le métro et va à Syntagma.",
     "lat": "to vradi perni to metro ke piyeni sto sindagma"
    },
    {
     "gr": "Πριν κοιμηθεί, γράφει μια κάρτα στους φίλους του: «Η Αθήνα είναι υπέροχη!»",
     "en": "Before sleeping he writes a postcard to his friends: “Athens is wonderful!”",
     "fr": "Avant de dormir, il écrit une carte postale à ses amis : « Athènes est magnifique ! »",
     "lat": "prin kimithi grafi mia karta stous filous tou i athina ine iperochi"
    }
   ]
  },
  {
   "id": "giatros",
   "kind": "reading",
   "level": "B1",
   "title": {
    "gr": "Στον γιατρό",
    "en": "At the doctor's",
    "fr": "Chez le médecin"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A patient explains what is wrong.",
    "fr": "Une patiente explique ce qui ne va pas."
   },
   "qs": [
    {
     "q": {
      "gr": "Τι έχει η Άννα;",
      "en": "What is wrong with Anna?",
      "fr": "Qu'a Anna ?"
     },
     "ok": "Ένα απλό κρυολόγημα.",
     "bad": [
      "Μια σοβαρή αρρώστια.",
      "Ένα σπασμένο χέρι.",
      "Μια αλλεργία."
     ]
    },
    {
     "q": {
      "gr": "Τι της συμβουλεύει ο γιατρός;",
      "en": "What does the doctor advise her?",
      "fr": "Que lui conseille le médecin ?"
     },
     "ok": "Να ξεκουραστεί και να πίνει ζεστά ροφήματα.",
     "bad": [
      "Να τρέξει κάθε μέρα.",
      "Να φάει πολύ παγωτό.",
      "Να πάει στο νοσοκομείο."
     ]
    },
    {
     "q": {
      "gr": "Πού αγοράζει τα φάρμακα;",
      "en": "Where does she buy the medicine?",
      "fr": "Où achète-t-elle les médicaments ?"
     },
     "ok": "Στο φαρμακείο.",
     "bad": [
      "Στο σούπερ μάρκετ.",
      "Στο νοσοκομείο.",
      "Στην αγορά."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Η Άννα δεν νιώθει καλά εδώ και τρεις μέρες, γι' αυτό πηγαίνει στον γιατρό.",
     "en": "Anna has not felt well for three days, so she goes to the doctor.",
     "fr": "Anna ne se sent pas bien depuis trois jours, alors elle va chez le médecin.",
     "lat": "i anna den niothi kala edo ke tris meres yi afto piyeni ston yiatro"
    },
    {
     "gr": "«Καλημέρα, κυρία Άννα. Τι σας ενοχλεί;» ρωτάει ο γιατρός.",
     "en": "“Good morning, Mrs Anna. What is bothering you?” the doctor asks.",
     "fr": "« Bonjour, madame Anna. Qu'est-ce qui vous gêne ? » demande le médecin.",
     "lat": "kalimera kiria anna ti sas enochli rotai o yiatros"
    },
    {
     "gr": "«Έχω πονοκέφαλο και πονάει ο λαιμός μου. Βήχω κιόλας.»",
     "en": "“I have a headache and my throat hurts. I am also coughing.”",
     "fr": "« J'ai mal à la tête et mal à la gorge. Je tousse aussi. »",
     "lat": "echo ponokefalo ke ponai o lemos mou vicho kiolas"
    },
    {
     "gr": "Ο γιατρός της μετράει τον πυρετό και ακούει τους πνεύμονές της.",
     "en": "The doctor takes her temperature and listens to her lungs.",
     "fr": "Le médecin prend sa température et écoute ses poumons.",
     "lat": "o yiatros tis metrai ton pireto ke akoui tous pnevmones tis"
    },
    {
     "gr": "«Έχετε ένα απλό κρυολόγημα, τίποτα σοβαρό», λέει.",
     "en": "“You have a simple cold, nothing serious,” he says.",
     "fr": "« Vous avez un simple rhume, rien de grave », dit-il.",
     "lat": "echete ena aplo krioloyima tipota sovaro lei"
    },
    {
     "gr": "«Πρέπει να ξεκουραστείτε και να πίνετε πολλά ζεστά ροφήματα.»",
     "en": "“You must rest and drink plenty of hot drinks.”",
     "fr": "« Vous devez vous reposer et boire beaucoup de boissons chaudes. »",
     "lat": "prepi na xekourastite ke na pinete polla zesta rofimata"
    },
    {
     "gr": "Της γράφει μια συνταγή για ένα σιρόπι και για παυσίπονα.",
     "en": "He writes her a prescription for a syrup and for painkillers.",
     "fr": "Il lui écrit une ordonnance pour un sirop et des antidouleurs.",
     "lat": "tis grafi mia sindayi yia ena siropi ke yia pafsipona"
    },
    {
     "gr": "Η Άννα περνάει από το φαρμακείο και αγοράζει τα φάρμακά της.",
     "en": "Anna goes by the pharmacy and buys her medicine.",
     "fr": "Anna passe à la pharmacie et achète ses médicaments.",
     "lat": "i anna pernai apo to farmakio ke agorazi ta farmaka tis"
    },
    {
     "gr": "Μετά από μία εβδομάδα νιώθει πολύ καλύτερα και γυρίζει στη δουλειά.",
     "en": "After a week she feels much better and goes back to work.",
     "fr": "Au bout d'une semaine, elle se sent beaucoup mieux et retourne au travail.",
     "lat": "meta apo mia evdomada niothi poli kalitera ke yirizi sti doulia"
    }
   ]
  },
  {
   "id": "diamerisma",
   "kind": "reading",
   "level": "B1",
   "title": {
    "gr": "Ψάχνω διαμέρισμα",
    "en": "Looking for a flat",
    "fr": "À la recherche d'un appartement"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A young man looks for a flat to rent.",
    "fr": "Un jeune homme cherche un appartement à louer."
   },
   "qs": [
    {
     "q": {
      "gr": "Πού δουλεύει ο Νίκος;",
      "en": "Where does Nikos work?",
      "fr": "Où travaille Nikos ?"
     },
     "ok": "Στη Λευκωσία.",
     "bad": [
      "Στη Λεμεσό.",
      "Στην Πάφο.",
      "Στη Λάρνακα."
     ]
    },
    {
     "q": {
      "gr": "Γιατί δεν διαλέγει το δεύτερο διαμέρισμα;",
      "en": "Why does he not choose the second flat?",
      "fr": "Pourquoi ne choisit-il pas le deuxième appartement ?"
     },
     "ok": "Είναι στον τέταρτο όροφο χωρίς ασανσέρ.",
     "bad": [
      "Είναι πολύ ακριβό.",
      "Είναι πολύ μακριά.",
      "Δεν έχει κουζίνα."
     ]
    },
    {
     "q": {
      "gr": "Τι ρωτάει για τη γάτα του;",
      "en": "What does he ask about his cat?",
      "fr": "Que demande-t-il à propos de son chat ?"
     },
     "ok": "Αν επιτρέπονται τα ζώα.",
     "bad": [
      "Πόσο κοστίζει.",
      "Πού θα κοιμάται.",
      "Τι τρώει."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Ο Νίκος δουλεύει στη Λευκωσία και ψάχνει διαμέρισμα κοντά στη δουλειά του.",
     "en": "Nikos works in Nicosia and is looking for a flat near his work.",
     "fr": "Nikos travaille à Nicosie et cherche un appartement près de son travail.",
     "lat": "o nikos doulevi sti lefkosia ke psachni diamerisma konda sti doulia tou"
    },
    {
     "gr": "Βλέπει αγγελίες στο διαδίκτυο και τηλεφωνεί σε δύο ιδιοκτήτες.",
     "en": "He looks at adverts on the internet and phones two owners.",
     "fr": "Il regarde des annonces sur internet et téléphone à deux propriétaires.",
     "lat": "vlepi angelies sto diadiktio ke tilefoni se dio idioktites"
    },
    {
     "gr": "Το πρώτο διαμέρισμα έχει ένα υπνοδωμάτιο, μια κουζίνα και ένα μπαλκόνι.",
     "en": "The first flat has one bedroom, a kitchen and a balcony.",
     "fr": "Le premier appartement a une chambre, une cuisine et un balcon.",
     "lat": "to proto diamerisma echi ena ipnodomatio mia kouzina ke ena balkoni"
    },
    {
     "gr": "Το νοίκι είναι 500 ευρώ τον μήνα, με τα κοινόχρηστα.",
     "en": "The rent is 500 euros a month, with the service charges.",
     "fr": "Le loyer est de 500 euros par mois, charges comprises.",
     "lat": "to niki ine  evro ton mina me ta kinochrista"
    },
    {
     "gr": "Το δεύτερο είναι πιο φθηνό, αλλά είναι στον τέταρτο όροφο και δεν έχει ασανσέρ.",
     "en": "The second is cheaper, but it is on the fourth floor and has no lift.",
     "fr": "Le deuxième est moins cher, mais il est au quatrième étage et n'a pas d'ascenseur.",
     "lat": "to deftero ine pio fthino alla ine ston tetarto orofo ke den echi asanser"
    },
    {
     "gr": "Ο Νίκος επισκέπτεται και τα δύο και κάνει πολλές ερωτήσεις.",
     "en": "Nikos visits both and asks many questions.",
     "fr": "Nikos visite les deux et pose beaucoup de questions.",
     "lat": "o nikos episkeptete ke ta dio ke kani polles erotisis"
    },
    {
     "gr": "«Επιτρέπονται τα ζώα;» ρωτάει, γιατί έχει μια γάτα.",
     "en": "“Are pets allowed?” he asks, because he has a cat.",
     "fr": "« Les animaux sont-ils acceptés ? » demande-t-il, car il a un chat.",
     "lat": "epitreponde ta zoa rotai yiati echi mia gata"
    },
    {
     "gr": "Τελικά διαλέγει το πρώτο, γιατί είναι φωτεινό και ήσυχο.",
     "en": "In the end he chooses the first, because it is bright and quiet.",
     "fr": "Finalement, il choisit le premier, car il est lumineux et calme.",
     "lat": "telika dialeyi to proto yiati ine fotino ke isicho"
    },
    {
     "gr": "Υπογράφει το συμβόλαιο και παίρνει τα κλειδιά την ίδια μέρα.",
     "en": "He signs the contract and gets the keys the same day.",
     "fr": "Il signe le contrat et reçoit les clés le même jour.",
     "lat": "ipografi to simvoleo ke perni ta klidia tin idia mera"
    }
   ]
  },
  {
   "id": "synentefxi",
   "kind": "reading",
   "level": "B1",
   "title": {
    "gr": "Η συνέντευξη",
    "en": "The job interview",
    "fr": "L'entretien d'embauche"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A first interview for a job in a travel agency.",
    "fr": "Un premier entretien dans une agence de voyages."
   },
   "qs": [
    {
     "q": {
      "gr": "Τι σπούδασε η Σοφία;",
      "en": "What did Sofia study?",
      "fr": "Qu'a étudié Sofia ?"
     },
     "ok": "Τουρισμό.",
     "bad": [
      "Ιατρική.",
      "Νομική.",
      "Μουσική."
     ]
    },
    {
     "q": {
      "gr": "Ποιες γλώσσες μιλάει;",
      "en": "Which languages does she speak?",
      "fr": "Quelles langues parle-t-elle ?"
     },
     "ok": "Αγγλικά και γαλλικά.",
     "bad": [
      "Γερμανικά και ρωσικά.",
      "Μόνο ελληνικά.",
      "Κινέζικα."
     ]
    },
    {
     "q": {
      "gr": "Τι γίνεται στο τέλος;",
      "en": "What happens at the end?",
      "fr": "Que se passe-t-il à la fin ?"
     },
     "ok": "Παίρνει τη δουλειά.",
     "bad": [
      "Δεν παίρνει τη δουλειά.",
      "Αλλάζει γνώμη.",
      "Πηγαίνει διακοπές."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Η Σοφία έχει σήμερα μια συνέντευξη για δουλειά σε ένα ταξιδιωτικό γραφείο.",
     "en": "Sofia has a job interview today at a travel agency.",
     "fr": "Sofia a aujourd'hui un entretien d'embauche dans une agence de voyages.",
     "lat": "i sofia echi simera mia sinendefxi yia doulia se ena taxidiotiko grafio"
    },
    {
     "gr": "Ντύνεται προσεκτικά και φτάνει δέκα λεπτά νωρίτερα.",
     "en": "She dresses carefully and arrives ten minutes early.",
     "fr": "Elle s'habille avec soin et arrive dix minutes en avance.",
     "lat": "dinete prosektika ke ftani deka lepta noritera"
    },
    {
     "gr": "Η διευθύντρια τη ρωτάει για τις σπουδές και την εμπειρία της.",
     "en": "The manager asks her about her studies and her experience.",
     "fr": "La directrice l'interroge sur ses études et son expérience.",
     "lat": "i diefthindria ti rotai yia tis spoudes ke tin embiria tis"
    },
    {
     "gr": "«Σπούδασα τουρισμό και δούλεψα δύο χρόνια σε ένα ξενοδοχείο», απαντά η Σοφία.",
     "en": "“I studied tourism and worked for two years in a hotel,” Sofia answers.",
     "fr": "« J'ai étudié le tourisme et travaillé deux ans dans un hôtel », répond Sofia.",
     "lat": "spoudasa tourismo ke doulepsa dio chronia se ena xenodochio apanda i sofia"
    },
    {
     "gr": "«Μιλάτε ξένες γλώσσες;» συνεχίζει η διευθύντρια.",
     "en": "“Do you speak foreign languages?” the manager continues.",
     "fr": "« Parlez-vous des langues étrangères ? » poursuit la directrice.",
     "lat": "milate xenes glosses sinechizi i diefthindria"
    },
    {
     "gr": "«Μιλάω αγγλικά και γαλλικά, και μαθαίνω λίγα ιταλικά.»",
     "en": "“I speak English and French, and I am learning a little Italian.”",
     "fr": "« Je parle anglais et français, et j'apprends un peu d'italien. »",
     "lat": "milao anglika ke gallika ke matheno liga italika"
    },
    {
     "gr": "Η διευθύντρια χαμογελάει και της εξηγεί ότι η δουλειά έχει πολλές ώρες.",
     "en": "The manager smiles and explains to her that the job has long hours.",
     "fr": "La directrice sourit et lui explique que le travail comporte beaucoup d'heures.",
     "lat": "i diefthindria chamoyelai ke tis exiyi oti i doulia echi polles ores"
    },
    {
     "gr": "«Δεν με πειράζει. Μου αρέσει να βοηθάω τους ανθρώπους», λέει η Σοφία.",
     "en": "“I do not mind. I like helping people,” says Sofia.",
     "fr": "« Cela ne me dérange pas. J'aime aider les gens », dit Sofia.",
     "lat": "den me pirazi mou aresi na voithao tous anthropous lei i sofia"
    },
    {
     "gr": "Μετά από δύο μέρες την παίρνουν τηλέφωνο: έχει πάρει τη δουλειά!",
     "en": "Two days later they phone her: she has got the job!",
     "fr": "Deux jours plus tard, on lui téléphone : elle a eu le poste !",
     "lat": "meta apo dio meres tin pernoun tilefono echi pari ti doulia"
    }
   ]
  },
  {
   "id": "gamos",
   "kind": "reading",
   "level": "B1",
   "title": {
    "gr": "Μια πρόσκληση σε γάμο",
    "en": "A wedding invitation",
    "fr": "Une invitation à un mariage"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "Katerina is invited to a Cypriot wedding.",
    "fr": "Katerina est invitée à un mariage chypriote."
   },
   "qs": [
    {
     "q": {
      "gr": "Πού θα γίνει ο γάμος;",
      "en": "Where will the wedding take place?",
      "fr": "Où le mariage aura-t-il lieu ?"
     },
     "ok": "Σε ένα χωριό της Κύπρου.",
     "bad": [
      "Στην Αθήνα.",
      "Σε ένα νησί της Ελλάδας.",
      "Σε ένα ξενοδοχείο."
     ]
    },
    {
     "q": {
      "gr": "Τι ώρα είναι η τελετή;",
      "en": "What time is the ceremony?",
      "fr": "À quelle heure est la cérémonie ?"
     },
     "ok": "Στις έξι το απόγευμα.",
     "bad": [
      "Στις δώδεκα το μεσημέρι.",
      "Στις δέκα το βράδυ.",
      "Στις οκτώ το πρωί."
     ]
    },
    {
     "q": {
      "gr": "Τι δίνουν συνήθως οι καλεσμένοι;",
      "en": "What do the guests usually give?",
      "fr": "Que donnent généralement les invités ?"
     },
     "ok": "Χρήματα σε έναν φάκελο.",
     "bad": [
      "Λουλούδια.",
      "Φαγητό.",
      "Βιβλία."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Η Κατερίνα παίρνει μια πρόσκληση για τον γάμο της φίλης της, της Χριστίνας.",
     "en": "Katerina receives an invitation to the wedding of her friend Christina.",
     "fr": "Katerina reçoit une invitation au mariage de son amie Christina.",
     "lat": "i katerina perni mia prosklisi yia ton gamo tis filis tis tis christinas"
    },
    {
     "gr": "Ο γάμος θα γίνει σε ένα μικρό χωριό της Κύπρου, κοντά στα βουνά.",
     "en": "The wedding will take place in a small village of Cyprus, near the mountains.",
     "fr": "Le mariage aura lieu dans un petit village de Chypre, près des montagnes.",
     "lat": "o gamos tha yini se ena mikro chorio tis kiprou konda sta vouna"
    },
    {
     "gr": "Η τελετή θα είναι στην εκκλησία του χωριού στις έξι το απόγευμα.",
     "en": "The ceremony will be in the village church at six in the afternoon.",
     "fr": "La cérémonie aura lieu à l'église du village à dix-huit heures.",
     "lat": "i teleti tha ine stin ekklisia tou choriou stis exi to apoyevma"
    },
    {
     "gr": "Μετά θα ακολουθήσει γλέντι με φαγητό, μουσική και χορό.",
     "en": "Afterwards there will be a party with food, music and dancing.",
     "fr": "Ensuite, il y aura une fête avec de la nourriture, de la musique et de la danse.",
     "lat": "meta tha akolouthisi glendi me fayito mousiki ke choro"
    },
    {
     "gr": "Η Κατερίνα αγοράζει ένα καινούργιο φόρεμα και ένα όμορφο δώρο.",
     "en": "Katerina buys a new dress and a nice present.",
     "fr": "Katerina achète une robe neuve et un joli cadeau.",
     "lat": "i katerina agorazi ena kenouryio forema ke ena omorfo doro"
    },
    {
     "gr": "Στην Κύπρο οι καλεσμένοι δίνουν συνήθως χρήματα σε έναν φάκελο.",
     "en": "In Cyprus the guests usually give money in an envelope.",
     "fr": "À Chypre, les invités donnent généralement de l'argent dans une enveloppe.",
     "lat": "stin kipro i kalesmeni dinoun sinithos chrimata se enan fakelo"
    },
    {
     "gr": "Στο γλέντι όλοι χορεύουν και η νύφη χαίρεται πολύ.",
     "en": "At the party everyone dances and the bride is very happy.",
     "fr": "À la fête, tout le monde danse et la mariée est très heureuse.",
     "lat": "sto glendi oli chorevoun ke i nifi cherete poli"
    },
    {
     "gr": "Η Κατερίνα γυρίζει σπίτι αργά τη νύχτα, κουρασμένη αλλά χαρούμενη.",
     "en": "Katerina goes home late at night, tired but happy.",
     "fr": "Katerina rentre tard dans la nuit, fatiguée mais heureuse.",
     "lat": "i katerina yirizi spiti arga ti nichta kourasmeni alla charoumeni"
    }
   ]
  },
  {
   "id": "eleoxorio",
   "kind": "reading",
   "level": "B1",
   "title": {
    "gr": "Ο τρύγος της ελιάς",
    "en": "The olive harvest",
    "fr": "La récolte des olives"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A family harvests olives in November.",
    "fr": "Une famille récolte les olives en novembre."
   },
   "qs": [
    {
     "q": {
      "gr": "Πότε μαζεύουν τις ελιές;",
      "en": "When do they gather the olives?",
      "fr": "Quand ramassent-ils les olives ?"
     },
     "ok": "Τον Νοέμβριο.",
     "bad": [
      "Τον Ιούλιο.",
      "Τον Απρίλιο.",
      "Τον Μάιο."
     ]
    },
    {
     "q": {
      "gr": "Πώς κάνουν να πέσουν οι ελιές;",
      "en": "How do they make the olives fall?",
      "fr": "Comment font-ils tomber les olives ?"
     },
     "ok": "Χτυπούν τα κλαδιά με ξύλα.",
     "bad": [
      "Τις κόβουν με ψαλίδι.",
      "Τις μαζεύουν από κάτω.",
      "Τις ρίχνουν με τα χέρια."
     ]
    },
    {
     "q": {
      "gr": "Πού γίνεται το λάδι;",
      "en": "Where is the oil made?",
      "fr": "Où fabrique-t-on l'huile ?"
     },
     "ok": "Στο ελαιοτριβείο.",
     "bad": [
      "Στο σπίτι.",
      "Στο σχολείο.",
      "Στην αγορά."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Τον Νοέμβριο η οικογένεια του Στέλιου μαζεύει τις ελιές στο χωράφι του παππού.",
     "en": "In November Stelios's family gathers the olives in grandfather's field.",
     "fr": "En novembre, la famille de Stelios cueille les olives dans le champ de son grand-père.",
     "lat": "ton noemvrio i ikoyenia tou steliou mazevi tis elies sto chorafi tou pappou"
    },
    {
     "gr": "Ξεκινούν πολύ νωρίς, όταν κάνει ακόμα κρύο.",
     "en": "They start very early, when it is still cold.",
     "fr": "Ils commencent très tôt, quand il fait encore froid.",
     "lat": "xekinoun poli noris otan kani akoma krio"
    },
    {
     "gr": "Απλώνουν μεγάλα πανιά κάτω από τα δέντρα και χτυπούν τα κλαδιά με μακριά ξύλα.",
     "en": "They spread big cloths under the trees and hit the branches with long sticks.",
     "fr": "Ils étendent de grandes bâches sous les arbres et frappent les branches avec de longs bâtons.",
     "lat": "aplonoun megala pania kato apo ta dendra ke chtipoun ta kladia me makria xila"
    },
    {
     "gr": "Οι ελιές πέφτουν σαν βροχή πάνω στα πανιά.",
     "en": "The olives fall like rain onto the cloths.",
     "fr": "Les olives tombent comme de la pluie sur les bâches.",
     "lat": "i elies peftoun san vrochi pano sta pania"
    },
    {
     "gr": "Τα παιδιά μαζεύουν τις ελιές και τις βάζουν σε σακιά.",
     "en": "The children collect the olives and put them in sacks.",
     "fr": "Les enfants ramassent les olives et les mettent dans des sacs.",
     "lat": "ta pedia mazevoun tis elies ke tis vazoun se sakia"
    },
    {
     "gr": "Το απόγευμα πηγαίνουν στο ελαιοτριβείο, όπου γίνεται το λάδι.",
     "en": "In the afternoon they go to the olive press, where the oil is made.",
     "fr": "L'après-midi, ils vont au moulin à huile, où l'on fabrique l'huile.",
     "lat": "to apoyevma piyenoun sto eleotrivio opou yinete to ladi"
    },
    {
     "gr": "Το φρέσκο λάδι είναι πράσινο και έχει δυνατή μυρωδιά.",
     "en": "The fresh oil is green and has a strong smell.",
     "fr": "L'huile fraîche est verte et a une odeur forte.",
     "lat": "to fresko ladi ine prasino ke echi dinati mirodia"
    },
    {
     "gr": "Το βράδυ η γιαγιά ψήνει ψωμί και όλοι το τρώνε με λάδι και αλάτι.",
     "en": "In the evening grandmother bakes bread and everyone eats it with oil and salt.",
     "fr": "Le soir, la grand-mère fait cuire du pain et tout le monde le mange avec de l'huile et du sel.",
     "lat": "to vradi i yiayia psini psomi ke oli to trone me ladi ke alati"
    }
   ]
  },
  {
   "id": "apergia",
   "kind": "reading",
   "level": "B2",
   "title": {
    "gr": "Απεργία στα λεωφορεία",
    "en": "A bus strike",
    "fr": "Grève des bus"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A commuter is surprised by a strike.",
    "fr": "Un usager est surpris par une grève."
   },
   "qs": [
    {
     "q": {
      "gr": "Τι καταλαβαίνει ο Αλέξης στη στάση;",
      "en": "What does Alexis understand at the stop?",
      "fr": "Que comprend Alexis à l'arrêt ?"
     },
     "ok": "Ότι υπάρχει απεργία.",
     "bad": [
      "Ότι το λεωφορείο καθυστερεί.",
      "Ότι έχασε το λεωφορείο.",
      "Ότι άλλαξε η στάση."
     ]
    },
    {
     "q": {
      "gr": "Τι ζητούν οι οδηγοί;",
      "en": "What do the drivers ask for?",
      "fr": "Que demandent les conducteurs ?"
     },
     "ok": "Υψηλότερους μισθούς και λιγότερες ώρες.",
     "bad": [
      "Περισσότερα λεωφορεία.",
      "Δωρεάν εισιτήρια.",
      "Νέα αυτοκίνητα."
     ]
    },
    {
     "q": {
      "gr": "Πώς φτάνει τελικά στη δουλειά;",
      "en": "How does he finally get to work?",
      "fr": "Comment arrive-t-il finalement au travail ?"
     },
     "ok": "Με το αυτοκίνητο ενός συναδέλφου.",
     "bad": [
      "Με ταξί.",
      "Με το ποδήλατο.",
      "Με τα πόδια."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Όταν ο Αλέξης φτάνει στη στάση το πρωί, καταλαβαίνει αμέσως ότι κάτι δεν πάει καλά.",
     "en": "When Alexis arrives at the stop in the morning, he understands at once that something is wrong.",
     "fr": "Quand Alexis arrive à l'arrêt le matin, il comprend tout de suite que quelque chose ne va pas.",
     "lat": "otan o alexis ftani sti stasi to proi katalaveni amesos oti kati den pai kala"
    },
    {
     "gr": "Δεν υπάρχει κανένας κόσμος και ένα χαρτί στον τοίχο λέει: «Απεργία σήμερα».",
     "en": "There are no people and a paper on the wall says: “Strike today.”",
     "fr": "Il n'y a personne et un papier sur le mur dit : « Grève aujourd'hui ».",
     "lat": "den iparchi kanenas kosmos ke ena charti ston ticho lei aperyia simera"
    },
    {
     "gr": "Οι οδηγοί διαμαρτύρονται, γιατί ζητούν υψηλότερους μισθούς και λιγότερες ώρες δουλειάς.",
     "en": "The drivers are protesting, because they ask for higher wages and fewer working hours.",
     "fr": "Les conducteurs protestent, car ils demandent de meilleurs salaires et moins d'heures de travail.",
     "lat": "i odiyi diamartironde yiati zitoun ipsiloterous misthous ke ligoteres ores doulias"
    },
    {
     "gr": "Ο Αλέξης δεν μπορεί να φτάσει στο γραφείο, αν δεν βρει άλλον τρόπο.",
     "en": "Alexis cannot get to the office unless he finds another way.",
     "fr": "Alexis ne peut pas arriver au bureau s'il ne trouve pas un autre moyen.",
     "lat": "o alexis den bori na ftasi sto grafio an den vri allon tropo"
    },
    {
     "gr": "Δοκιμάζει να πάρει ταξί, αλλά όλα είναι πιασμένα και η τιμή είναι διπλάσια.",
     "en": "He tries to take a taxi, but they are all taken and the price is double.",
     "fr": "Il essaie de prendre un taxi, mais ils sont tous pris et le prix est double.",
     "lat": "dokimazi na pari taxi alla ola ine piasmena ke i timi ine diplasia"
    },
    {
     "gr": "Τελικά τηλεφωνεί σε έναν συνάδελφο, που περνάει με το αυτοκίνητό του.",
     "en": "In the end he phones a colleague, who passes by in his car.",
     "fr": "Finalement, il téléphone à un collègue, qui passe le prendre en voiture.",
     "lat": "telika tilefoni se enan sinadelfo pou pernai me to aftokinito tou"
    },
    {
     "gr": "Φτάνουν στη δουλειά με μία ώρα καθυστέρηση, αλλά το αφεντικό καταλαβαίνει.",
     "en": "They get to work an hour late, but the boss understands.",
     "fr": "Ils arrivent au travail avec une heure de retard, mais le patron comprend.",
     "lat": "ftanoun sti doulia me mia ora kathisterisi alla to afendiko katalaveni"
    },
    {
     "gr": "Το βράδυ ακούει στις ειδήσεις ότι οι συζητήσεις συνεχίζονται και ότι η απεργία μπορεί να κρατήσει μέρες.",
     "en": "In the evening he hears on the news that the talks continue and that the strike may last for days.",
     "fr": "Le soir, il entend aux informations que les discussions se poursuivent et que la grève pourrait durer des jours.",
     "lat": "to vradi akoui stis idisis oti i sizitisis sinechizonde ke oti i aperyia bori na kratisi meres"
    }
   ]
  },
  {
   "id": "grammata",
   "kind": "reading",
   "level": "B2",
   "title": {
    "gr": "Ένα γράμμα στον φίλο μου",
    "en": "A letter to my friend",
    "fr": "Une lettre à mon ami"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A student abroad writes home.",
    "fr": "Une étudiante à l'étranger écrit chez elle."
   },
   "qs": [
    {
     "q": {
      "gr": "Πόσο καιρό σπουδάζει η Ελένη εκεί;",
      "en": "How long has Eleni been studying there?",
      "fr": "Depuis combien de temps Eleni étudie-t-elle là-bas ?"
     },
     "ok": "Τρεις μήνες.",
     "bad": [
      "Τρία χρόνια.",
      "Μία εβδομάδα.",
      "Έξι μήνες."
     ]
    },
    {
     "q": {
      "gr": "Γιατί ήταν δύσκολα στην αρχή;",
      "en": "Why was it hard at the beginning?",
      "fr": "Pourquoi était-ce difficile au début ?"
     },
     "ok": "Δεν γνώριζε κανέναν.",
     "bad": [
      "Δεν είχε λεφτά.",
      "Έβρεχε συνέχεια.",
      "Δεν είχε σπίτι."
     ]
    },
    {
     "q": {
      "gr": "Πότε σκέφτεται να γυρίσει στο νησί;",
      "en": "When is she thinking of going back to the island?",
      "fr": "Quand pense-t-elle retourner sur l'île ?"
     },
     "ok": "Τον Δεκέμβριο.",
     "bad": [
      "Τον Ιούλιο.",
      "Τον Μάρτιο.",
      "Τον Οκτώβριο."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Αγαπητέ Μιχάλη, σου γράφω από τη Θεσσαλονίκη, όπου σπουδάζω εδώ και τρεις μήνες.",
     "en": "Dear Michalis, I am writing to you from Thessaloniki, where I have been studying for three months.",
     "fr": "Cher Michalis, je t'écris de Thessalonique, où j'étudie depuis trois mois.",
     "lat": "agapite michali sou grafo apo ti thessaloniki opou spoudazo edo ke tris mines"
    },
    {
     "gr": "Στην αρχή ήταν δύσκολα, γιατί δεν γνώριζα κανέναν και μου έλειπε η οικογένειά μου.",
     "en": "At the beginning it was hard, because I did not know anyone and I missed my family.",
     "fr": "Au début, c'était difficile, car je ne connaissais personne et ma famille me manquait.",
     "lat": "stin archi itan diskola yiati den gnoriza kanenan ke mou elipe i ikoyenia mou"
    },
    {
     "gr": "Τώρα όμως έχω καινούργιους φίλους και η ζωή μου είναι πολύ πιο ενδιαφέρουσα.",
     "en": "But now I have new friends and my life is much more interesting.",
     "fr": "Mais maintenant j'ai de nouveaux amis et ma vie est bien plus intéressante.",
     "lat": "tora omos echo kenouryious filous ke i zoi mou ine poli pio endiaferousa"
    },
    {
     "gr": "Τα μαθήματα είναι απαιτητικά, αλλά οι καθηγητές με βοηθούν όσο μπορούν.",
     "en": "The classes are demanding, but the teachers help me as much as they can.",
     "fr": "Les cours sont exigeants, mais les professeurs m'aident autant qu'ils le peuvent.",
     "lat": "ta mathimata ine apetitika alla i kathiyites me voithoun oso boroun"
    },
    {
     "gr": "Τα σαββατοκύριακα περπατάμε δίπλα στη θάλασσα και τρώμε μπουγάτσα.",
     "en": "At weekends we walk by the sea and eat bougatsa.",
     "fr": "Le week-end, nous nous promenons au bord de la mer et mangeons de la bougatsa.",
     "lat": "ta savvatokiriaka perpatame dipla sti thalassa ke trome bougatsa"
    },
    {
     "gr": "Αν μου επιτρέψουν οι εξετάσεις, θα έρθω στο νησί τον Δεκέμβριο για τις γιορτές.",
     "en": "If my exams allow it, I will come to the island in December for the holidays.",
     "fr": "Si mes examens me le permettent, je viendrai sur l'île en décembre pour les fêtes.",
     "lat": "an mou epitrepsoun i exetasis tha ertho sto nisi ton dekemvrio yia tis yiortes"
    },
    {
     "gr": "Θα χαρώ πολύ να σε δω και να μου πεις όλα τα νέα σου.",
     "en": "I will be very glad to see you and to hear all your news.",
     "fr": "Je serai très heureuse de te voir et que tu me racontes toutes tes nouvelles.",
     "lat": "tha charo poli na se do ke na mou pis ola ta nea sou"
    },
    {
     "gr": "Φιλιά σε όλους, και γράψε μου σύντομα. Η φίλη σου, Ελένη.",
     "en": "Kisses to everyone, and write to me soon. Your friend, Eleni.",
     "fr": "Bises à tous, et écris-moi vite. Ton amie, Eleni.",
     "lat": "filia se olous ke grapse mou sindoma i fili sou eleni"
    }
   ]
  },
  {
   "id": "ypologistes",
   "kind": "reading",
   "level": "B2",
   "title": {
    "gr": "Η τεχνολογία στη ζωή μας",
    "en": "Technology in our lives",
    "fr": "La technologie dans nos vies"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A short text on phones and screens.",
    "fr": "Un court texte sur les téléphones et les écrans."
   },
   "qs": [
    {
     "q": {
      "gr": "Τι κάνουμε με το κινητό;",
      "en": "What do we do with the phone?",
      "fr": "Que fait-on avec le téléphone ?"
     },
     "ok": "Μιλάμε, γράφουμε και ψάχνουμε πληροφορίες.",
     "bad": [
      "Μόνο μιλάμε.",
      "Μόνο παίζουμε.",
      "Δεν το χρησιμοποιούμε."
     ]
    },
    {
     "q": {
      "gr": "Τι συμβουλεύουν οι γιατροί;",
      "en": "What do the doctors advise?",
      "fr": "Que conseillent les médecins ?"
     },
     "ok": "Να κλείνουμε τα κινητά πριν από τον ύπνο.",
     "bad": [
      "Να μην κοιμόμαστε.",
      "Να βλέπουμε περισσότερη τηλεόραση.",
      "Να ξυπνάμε νωρίς."
     ]
    },
    {
     "q": {
      "gr": "Ποιο είναι το συμπέρασμα του κειμένου;",
      "en": "What is the conclusion of the text?",
      "fr": "Quelle est la conclusion du texte ?"
     },
     "ok": "Να χρησιμοποιούμε την τεχνολογία με μέτρο.",
     "bad": [
      "Να πετάξουμε τα κινητά.",
      "Να αγοράζουμε νέο κινητό κάθε χρόνο.",
      "Να μην χρησιμοποιούμε το διαδίκτυο."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Σήμερα σχεδόν όλοι έχουμε ένα κινητό τηλέφωνο στην τσέπη μας.",
     "en": "Today almost all of us have a mobile phone in our pocket.",
     "fr": "Aujourd'hui, presque tout le monde a un téléphone portable dans la poche.",
     "lat": "simera schedon oli echoume ena kinito tilefono stin tsepi mas"
    },
    {
     "gr": "Με αυτό μιλάμε, γράφουμε μηνύματα, βλέπουμε φωτογραφίες και ψάχνουμε πληροφορίες.",
     "en": "With it we talk, write messages, look at photos and search for information.",
     "fr": "Avec lui, nous parlons, écrivons des messages, regardons des photos et cherchons des informations.",
     "lat": "me afto milame grafoume minimata vlepoume fotografies ke psachnoume plirofories"
    },
    {
     "gr": "Η τεχνολογία κάνει τη ζωή μας πιο εύκολη, αλλά έχει και μειονεκτήματα.",
     "en": "Technology makes our life easier, but it also has disadvantages.",
     "fr": "La technologie rend notre vie plus facile, mais elle a aussi des inconvénients.",
     "lat": "i technoloyia kani ti zoi mas pio efkoli alla echi ke mionektimata"
    },
    {
     "gr": "Πολλοί άνθρωποι περνούν ώρες μπροστά σε μια οθόνη και δεν κοιμούνται αρκετά.",
     "en": "Many people spend hours in front of a screen and do not sleep enough.",
     "fr": "Beaucoup de gens passent des heures devant un écran et ne dorment pas assez.",
     "lat": "polli anthropi pernoun ores brosta se mia othoni ke den kimounde arketa"
    },
    {
     "gr": "Οι γιατροί συμβουλεύουν να κλείνουμε τα κινητά μία ώρα πριν από τον ύπνο.",
     "en": "Doctors advise us to switch off our phones an hour before sleep.",
     "fr": "Les médecins conseillent d'éteindre son téléphone une heure avant de dormir.",
     "lat": "i yiatri simvoulevoun na klinoume ta kinita mia ora prin apo ton ipno"
    },
    {
     "gr": "Από την άλλη πλευρά, το διαδίκτυο μάς βοηθά να μαθαίνουμε νέα πράγματα.",
     "en": "On the other hand, the internet helps us to learn new things.",
     "fr": "D'un autre côté, internet nous aide à apprendre de nouvelles choses.",
     "lat": "apo tin alli plevra to diadiktio mas voitha na mathenoume nea pragmata"
    },
    {
     "gr": "Μπορούμε να δούμε ένα μάθημα, να μιλήσουμε με έναν φίλο στο εξωτερικό ή να βρούμε μια συνταγή.",
     "en": "We can watch a lesson, talk with a friend abroad or find a recipe.",
     "fr": "Nous pouvons suivre un cours, parler avec un ami à l'étranger ou trouver une recette.",
     "lat": "boroume na doume ena mathima na milisoume me enan filo sto exoteriko i na vroume mia sindayi"
    },
    {
     "gr": "Το σημαντικό είναι να χρησιμοποιούμε την τεχνολογία με μέτρο.",
     "en": "The important thing is to use technology in moderation.",
     "fr": "L'important est d'utiliser la technologie avec modération.",
     "lat": "to simandiko ine na chrisimopioume tin technoloyia me metro"
    }
   ]
  },
  {
   "id": "oikologia",
   "kind": "reading",
   "level": "B2",
   "title": {
    "gr": "Προστατεύουμε το περιβάλλον",
    "en": "We protect the environment",
    "fr": "Nous protégeons l'environnement"
   },
   "author": {
    "en": "Short text written for this app",
    "fr": "Court texte écrit pour cette appli"
   },
   "years": "",
   "about": {
    "en": "Small everyday gestures that help nature.",
    "fr": "Petits gestes quotidiens qui aident la nature."
   },
   "qs": [
    {
     "q": {
      "gr": "Τι μπορούμε να ανακυκλώνουμε;",
      "en": "What can we recycle?",
      "fr": "Que pouvons-nous recycler ?"
     },
     "ok": "Χαρτί, γυαλί και πλαστικό.",
     "bad": [
      "Μόνο φαγητό.",
      "Μόνο ρούχα.",
      "Τίποτα."
     ]
    },
    {
     "q": {
      "gr": "Τι κάνουμε αντί για πλαστικές σακούλες;",
      "en": "What do we do instead of plastic bags?",
      "fr": "Que fait-on à la place des sacs en plastique ?"
     },
     "ok": "Χρησιμοποιούμε τσάντα από ύφασμα.",
     "bad": [
      "Παίρνουμε περισσότερες σακούλες.",
      "Δεν ψωνίζουμε.",
      "Χρησιμοποιούμε χαρτί."
     ]
    },
    {
     "q": {
      "gr": "Γιατί είναι πολύτιμο το νερό στα νησιά;",
      "en": "Why is water precious on the islands?",
      "fr": "Pourquoi l'eau est-elle précieuse sur les îles ?"
     },
     "ok": "Γιατί συχνά λείπει.",
     "bad": [
      "Γιατί είναι ακριβό.",
      "Γιατί είναι βρώμικο.",
      "Γιατί δεν υπάρχει θάλασσα."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Το περιβάλλον μάς χρειάζεται όλους, και μικρές κινήσεις κάνουν μεγάλη διαφορά.",
     "en": "The environment needs all of us, and small actions make a big difference.",
     "fr": "L'environnement a besoin de nous tous, et de petits gestes font une grande différence.",
     "lat": "to perivallon mas chriazete olous ke mikres kinisis kanoun megali diafora"
    },
    {
     "gr": "Πρώτα απ' όλα, μπορούμε να ανακυκλώνουμε το χαρτί, το γυαλί και το πλαστικό.",
     "en": "First of all, we can recycle paper, glass and plastic.",
     "fr": "Tout d'abord, nous pouvons recycler le papier, le verre et le plastique.",
     "lat": "prota ap ola boroume na anakiklonoume to charti to yiali ke to plastiko"
    },
    {
     "gr": "Αντί να παίρνουμε πλαστικές σακούλες, ας χρησιμοποιούμε μια τσάντα από ύφασμα.",
     "en": "Instead of taking plastic bags, let us use a cloth bag.",
     "fr": "Au lieu de prendre des sacs en plastique, utilisons un sac en tissu.",
     "lat": "andi na pernoume plastikes sakoules as chrisimopioume mia tsanda apo ifasma"
    },
    {
     "gr": "Στην πόλη καλό είναι να πηγαίνουμε με το ποδήλατο ή με τα πόδια, όσο γίνεται.",
     "en": "In the city it is good to go by bike or on foot, as much as possible.",
     "fr": "En ville, il est bon d'aller à vélo ou à pied autant que possible.",
     "lat": "stin poli kalo ine na piyenoume me to podilato i me ta podia oso yinete"
    },
    {
     "gr": "Έτσι μειώνουμε τη ρύπανση και κάνουμε και καλό στην υγεία μας.",
     "en": "In this way we reduce pollution and also do good to our health.",
     "fr": "Ainsi, nous réduisons la pollution et nous faisons aussi du bien à notre santé.",
     "lat": "etsi mionoume ti ripansi ke kanoume ke kalo stin iyia mas"
    },
    {
     "gr": "Στο σπίτι κλείνουμε το φως και δεν αφήνουμε τη βρύση να τρέχει χωρίς λόγο.",
     "en": "At home we switch off the light and do not let the tap run for no reason.",
     "fr": "À la maison, nous éteignons la lumière et ne laissons pas le robinet couler sans raison.",
     "lat": "sto spiti klinoume to fos ke den afinoume ti vrisi na trechi choris logo"
    },
    {
     "gr": "Τα καλοκαίρια το νερό είναι πολύτιμο, ειδικά στα νησιά, όπου συχνά λείπει.",
     "en": "In summer water is precious, especially on the islands, where it is often lacking.",
     "fr": "En été, l'eau est précieuse, surtout sur les îles, où elle manque souvent.",
     "lat": "ta kalokeria to nero ine politimo idika sta nisia opou sichna lipi"
    },
    {
     "gr": "Αν όλοι κάνουμε λίγα, μαζί θα κάνουμε πολλά.",
     "en": "If we all do a little, together we will do a lot.",
     "fr": "Si nous faisons tous un peu, ensemble nous ferons beaucoup.",
     "lat": "an oli kanoume liga mazi tha kanoume polla"
    }
   ]
  }
 ],
 "gloss": [
  {
   "gr": "λαϊκή αγορά",
   "lat": "laiki agora",
   "en": "street market",
   "fr": "marché de quartier"
  },
  {
   "gr": "πωλητής",
   "lat": "politis",
   "en": "seller",
   "fr": "vendeur"
  },
  {
   "gr": "διαλέγω",
   "lat": "dialego",
   "en": "I choose",
   "fr": "je choisis"
  },
  {
   "gr": "κομμάτι",
   "lat": "kommati",
   "en": "piece",
   "fr": "morceau"
  },
  {
   "gr": "δοκιμάζω",
   "lat": "dokimazo",
   "en": "I taste, I try",
   "fr": "je goûte, j'essaie"
  },
  {
   "gr": "βαριά",
   "lat": "varia",
   "en": "heavy",
   "fr": "lourdes"
  },
  {
   "gr": "συναντιούνται",
   "lat": "sinandiounde",
   "en": "they meet",
   "fr": "ils se retrouvent"
  },
  {
   "gr": "σερβιτόρος",
   "lat": "servitoros",
   "en": "waiter",
   "fr": "serveur"
  },
  {
   "gr": "παραγγέλνει",
   "lat": "parangelni",
   "en": "he orders",
   "fr": "il commande"
  },
  {
   "gr": "προτιμά",
   "lat": "protima",
   "en": "he prefers",
   "fr": "il préfère"
  },
  {
   "gr": "λογαριασμός",
   "lat": "logariasmos",
   "en": "bill",
   "fr": "addition"
  },
  {
   "gr": "ελεύθερη",
   "lat": "eleftheri",
   "en": "free",
   "fr": "libre"
  },
  {
   "gr": "εκδρομή",
   "lat": "ekdromi",
   "en": "trip",
   "fr": "excursion"
  },
  {
   "gr": "φυσικά",
   "lat": "fisika",
   "en": "of course",
   "fr": "bien sûr"
  },
  {
   "gr": "τέλεια",
   "lat": "telia",
   "en": "perfect",
   "fr": "parfait"
  },
  {
   "gr": "τουρίστας",
   "lat": "touristas",
   "en": "tourist",
   "fr": "touriste"
  },
  {
   "gr": "σοκάκι",
   "lat": "sokaki",
   "en": "alley",
   "fr": "ruelle"
  },
  {
   "gr": "μοντέρνο",
   "lat": "monderno",
   "en": "modern",
   "fr": "moderne"
  },
  {
   "gr": "μουσείο",
   "lat": "mousio",
   "en": "museum",
   "fr": "musée"
  },
  {
   "gr": "κάρτα",
   "lat": "karta",
   "en": "postcard, card",
   "fr": "carte"
  },
  {
   "gr": "ενοχλεί",
   "lat": "enochli",
   "en": "it bothers",
   "fr": "gêne"
  },
  {
   "gr": "πυρετός",
   "lat": "piretos",
   "en": "fever",
   "fr": "fièvre"
  },
  {
   "gr": "συνταγή",
   "lat": "sindayi",
   "en": "prescription",
   "fr": "ordonnance"
  },
  {
   "gr": "παυσίπονο",
   "lat": "pafsipono",
   "en": "painkiller",
   "fr": "antidouleur"
  },
  {
   "gr": "ροφήματα",
   "lat": "rofimata",
   "en": "hot drinks",
   "fr": "boissons chaudes"
  },
  {
   "gr": "αγγελία",
   "lat": "angelia",
   "en": "advert",
   "fr": "annonce"
  },
  {
   "gr": "νοίκι",
   "lat": "niki",
   "en": "rent",
   "fr": "loyer"
  },
  {
   "gr": "κοινόχρηστα",
   "lat": "kinochrista",
   "en": "service charges",
   "fr": "charges"
  },
  {
   "gr": "όροφος",
   "lat": "orofos",
   "en": "floor",
   "fr": "étage"
  },
  {
   "gr": "συμβόλαιο",
   "lat": "simvoleo",
   "en": "contract",
   "fr": "contrat"
  },
  {
   "gr": "φωτεινό",
   "lat": "fotino",
   "en": "bright",
   "fr": "lumineux"
  },
  {
   "gr": "συνέντευξη",
   "lat": "sinendefxi",
   "en": "interview",
   "fr": "entretien"
  },
  {
   "gr": "διευθύντρια",
   "lat": "diefthindria",
   "en": "manager (f)",
   "fr": "directrice"
  },
  {
   "gr": "σπούδασα",
   "lat": "spoudasa",
   "en": "I studied",
   "fr": "j'ai étudié"
  },
  {
   "gr": "εμπειρία",
   "lat": "embiria",
   "en": "experience",
   "fr": "expérience"
  },
  {
   "gr": "ξένες γλώσσες",
   "lat": "xenes glosses",
   "en": "foreign languages",
   "fr": "langues étrangères"
  },
  {
   "gr": "πρόσκληση",
   "lat": "prosklisi",
   "en": "invitation",
   "fr": "invitation"
  },
  {
   "gr": "τελετή",
   "lat": "teleti",
   "en": "ceremony",
   "fr": "cérémonie"
  },
  {
   "gr": "γλέντι",
   "lat": "glendi",
   "en": "party, celebration",
   "fr": "fête"
  },
  {
   "gr": "καλεσμένοι",
   "lat": "kalesmeni",
   "en": "guests",
   "fr": "invités"
  },
  {
   "gr": "νύφη",
   "lat": "nifi",
   "en": "bride",
   "fr": "mariée"
  },
  {
   "gr": "τρύγος",
   "lat": "trigos",
   "en": "harvest",
   "fr": "récolte"
  },
  {
   "gr": "χωράφι",
   "lat": "chorafi",
   "en": "field",
   "fr": "champ"
  },
  {
   "gr": "πανιά",
   "lat": "pania",
   "en": "cloths",
   "fr": "bâches"
  },
  {
   "gr": "ελαιοτριβείο",
   "lat": "eleotrivio",
   "en": "olive press",
   "fr": "moulin à huile"
  },
  {
   "gr": "μυρωδιά",
   "lat": "mirodia",
   "en": "smell",
   "fr": "odeur"
  },
  {
   "gr": "απεργία",
   "lat": "aperyia",
   "en": "strike",
   "fr": "grève"
  },
  {
   "gr": "διαμαρτύρονται",
   "lat": "diamartironde",
   "en": "they protest",
   "fr": "ils protestent"
  },
  {
   "gr": "μισθός",
   "lat": "misthos",
   "en": "salary",
   "fr": "salaire"
  },
  {
   "gr": "συνάδελφος",
   "lat": "sinadelfos",
   "en": "colleague",
   "fr": "collègue"
  },
  {
   "gr": "καθυστέρηση",
   "lat": "kathisterisi",
   "en": "delay",
   "fr": "retard"
  },
  {
   "gr": "διπλάσια",
   "lat": "diplasia",
   "en": "double",
   "fr": "double"
  },
  {
   "gr": "αγαπητέ",
   "lat": "agapite",
   "en": "dear",
   "fr": "cher"
  },
  {
   "gr": "απαιτητικά",
   "lat": "apetitika",
   "en": "demanding",
   "fr": "exigeants"
  },
  {
   "gr": "εξετάσεις",
   "lat": "exetasis",
   "en": "exams",
   "fr": "examens"
  },
  {
   "gr": "γιορτές",
   "lat": "yiortes",
   "en": "holidays",
   "fr": "fêtes"
  },
  {
   "gr": "μου έλειπε",
   "lat": "mou elipe",
   "en": "I missed",
   "fr": "me manquait"
  },
  {
   "gr": "μειονεκτήματα",
   "lat": "mionektimata",
   "en": "disadvantages",
   "fr": "inconvénients"
  },
  {
   "gr": "οθόνη",
   "lat": "othoni",
   "en": "screen",
   "fr": "écran"
  },
  {
   "gr": "εξωτερικό",
   "lat": "exoteriko",
   "en": "abroad",
   "fr": "étranger"
  },
  {
   "gr": "με μέτρο",
   "lat": "me metro",
   "en": "in moderation",
   "fr": "avec modération"
  },
  {
   "gr": "συμβουλεύουν",
   "lat": "simvoulevoun",
   "en": "they advise",
   "fr": "ils conseillent"
  },
  {
   "gr": "ανακυκλώνουμε",
   "lat": "anakiklonoume",
   "en": "we recycle",
   "fr": "nous recyclons"
  },
  {
   "gr": "ρύπανση",
   "lat": "ripansi",
   "en": "pollution",
   "fr": "pollution"
  },
  {
   "gr": "πολύτιμο",
   "lat": "politimo",
   "en": "precious",
   "fr": "précieux"
  },
  {
   "gr": "μειώνουμε",
   "lat": "mionoume",
   "en": "we reduce",
   "fr": "nous réduisons"
  },
  {
   "gr": "χωρίς λόγο",
   "lat": "choris logo",
   "en": "for no reason",
   "fr": "sans raison"
  }
 ]
};
