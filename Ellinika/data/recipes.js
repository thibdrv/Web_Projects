// Simple recipes to read: salad, coffee, tzatziki, moussaka... Edit freely.
//  - Same shape as the texts of data/texts.js (js/texts.js adds them to TEXTS.texts, under the kind "Recipes"). "gloss" lists extra words you can tap.
//  - The recipes were written for this app in simple everyday Greek (we do this, we do that); they come from no book. Check the amounts before you cook!
const RECIPES = {
 "texts": [
  {
   "id": "horiatiki",
   "kind": "recipe",
   "level": "A1",
   "title": {
    "gr": "Χωριάτικη σαλάτα",
    "en": "Greek village salad",
    "fr": "Salade grecque (salade de village)"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "The classic Greek salad: no lettuce, only vegetables, feta and olive oil.",
    "fr": "La salade grecque classique : pas de laitue, seulement des légumes, de la feta et de l'huile d'olive."
   },
   "qs": [
    {
     "q": {
      "gr": "Ποιο τυρί βάζουμε στη σαλάτα;",
      "en": "Which cheese do we put in the salad?",
      "fr": "Quel fromage met-on dans la salade ?"
     },
     "ok": "Φέτα.",
     "bad": [
      "Χαλλούμι.",
      "Κασέρι.",
      "Μοτσαρέλα."
     ]
    },
    {
     "q": {
      "gr": "Πώς σερβίρουμε τη σαλάτα;",
      "en": "How do we serve the salad?",
      "fr": "Comment sert-on la salade ?"
     },
     "ok": "Αμέσως, με φρέσκο ψωμί.",
     "bad": [
      "Την επόμενη μέρα.",
      "Ζεστή, με ρύζι.",
      "Με πολλή ζάχαρη."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Για μια χωριάτικη σαλάτα χρειαζόμαστε ντομάτες, αγγούρι, κρεμμύδι και πιπεριά.",
     "en": "For a village salad we need tomatoes, a cucumber, an onion and a pepper.",
     "fr": "Pour une salade grecque il nous faut des tomates, un concombre, un oignon et un poivron.",
     "lat": "yia mia choriatiki salata chriazomaste domates angouri kremmidi ke piperia"
    },
    {
     "gr": "Πλένουμε τα λαχανικά.",
     "en": "We wash the vegetables.",
     "fr": "On lave les légumes.",
     "lat": "plenoume ta lachanika"
    },
    {
     "gr": "Κόβουμε τις ντομάτες και το αγγούρι σε μεγάλα κομμάτια.",
     "en": "We cut the tomatoes and the cucumber into big pieces.",
     "fr": "On coupe les tomates et le concombre en gros morceaux.",
     "lat": "kovoume tis domates ke to angouri se megala kommatia"
    },
    {
     "gr": "Κόβουμε το κρεμμύδι και την πιπεριά σε λεπτές φέτες.",
     "en": "We cut the onion and the pepper into thin slices.",
     "fr": "On coupe l'oignon et le poivron en fines tranches.",
     "lat": "kovoume to kremmidi ke tin piperia se leptes fetes"
    },
    {
     "gr": "Βάζουμε όλα τα λαχανικά σε ένα μεγάλο μπολ.",
     "en": "We put all the vegetables in a big bowl.",
     "fr": "On met tous les légumes dans un grand saladier.",
     "lat": "vazoume ola ta lachanika se ena megalo bol",
     "end": true
    },
    {
     "gr": "Προσθέτουμε ελιές και ένα μεγάλο κομμάτι φέτα από πάνω.",
     "en": "We add olives and a big piece of feta on top.",
     "fr": "On ajoute des olives et un gros morceau de feta par-dessus.",
     "lat": "prosthetoume elies ke ena megalo kommati feta apo pano"
    },
    {
     "gr": "Ρίχνουμε λίγο αλάτι, ρίγανη και αρκετό ελαιόλαδο.",
     "en": "We add a little salt, oregano and plenty of olive oil.",
     "fr": "On ajoute un peu de sel, de l'origan et beaucoup d'huile d'olive.",
     "lat": "richnoume ligo alati rigani ke arketo eleolado",
     "end": true
    },
    {
     "gr": "Δεν ανακατεύουμε πολύ. Σερβίρουμε αμέσως με φρέσκο ψωμί.",
     "en": "We do not mix much. We serve at once with fresh bread.",
     "fr": "On ne mélange pas trop. On sert tout de suite avec du pain frais.",
     "lat": "den anakatevoume poli serviroume amesos me fresko psomi"
    }
   ]
  },
  {
   "id": "coffee",
   "kind": "recipe",
   "level": "A1",
   "title": {
    "gr": "Ο ελληνικός καφές",
    "en": "Greek coffee",
    "fr": "Le café grec"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "Greek coffee is made in a small pot, the briki, and served in a small cup. You can ask for it σκέτος (no sugar), μέτριος (medium) or γλυκός (sweet).",
    "fr": "Le café grec se fait dans une petite cafetière, le briki, et se sert dans une petite tasse. On peut le demander σκέτος (sans sucre), μέτριος (moyen) ou γλυκός (sucré)."
   },
   "qs": [
    {
     "q": {
      "gr": "Τι βάζουμε για έναν γλυκό καφέ;",
      "en": "What do we put for a sweet coffee?",
      "fr": "Que met-on pour un café sucré ?"
     },
     "ok": "Δύο κουταλάκια ζάχαρη.",
     "bad": [
      "Καθόλου ζάχαρη.",
      "Ένα ποτήρι γάλα.",
      "Μία κουταλιά αλάτι."
     ]
    },
    {
     "q": {
      "gr": "Πότε βγάζουμε το μπρίκι από τη φωτιά;",
      "en": "When do we take the briki off the heat?",
      "fr": "Quand retire-t-on le briki du feu ?"
     },
     "ok": "Όταν ο καφές ανεβαίνει.",
     "bad": [
      "Όταν το νερό κρυώσει.",
      "Μετά από μία ώρα.",
      "Πριν βάλουμε τον καφέ."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Χρειαζόμαστε ένα μπρίκι, κρύο νερό, καφέ και ζάχαρη.",
     "en": "We need a briki, cold water, coffee and sugar.",
     "fr": "Il nous faut un briki, de l'eau froide, du café et du sucre.",
     "lat": "chriazomaste ena briki krio nero kafe ke zachari"
    },
    {
     "gr": "Μετράμε νερό με ένα φλιτζάνι και το ρίχνουμε στο μπρίκι.",
     "en": "We measure the water with a cup and pour it into the briki.",
     "fr": "On mesure l'eau avec une tasse et on la verse dans le briki.",
     "lat": "metrame nero me ena flitzani ke to richnoume sto briki"
    },
    {
     "gr": "Προσθέτουμε μία κουταλιά καφέ για κάθε φλιτζάνι.",
     "en": "We add one spoonful of coffee for each cup.",
     "fr": "On ajoute une cuillerée de café pour chaque tasse.",
     "lat": "prosthetoume mia koutalia kafe yia kathe flitzani",
     "end": true
    },
    {
     "gr": "Για έναν σκέτο καφέ δεν βάζουμε ζάχαρη. Για έναν μέτριο βάζουμε ένα κουταλάκι. Για έναν γλυκό βάζουμε δύο.",
     "en": "For a plain coffee we put no sugar. For a medium one we put one teaspoon. For a sweet one we put two.",
     "fr": "Pour un café nature on ne met pas de sucre. Pour un demi-sucré on met une petite cuillère. Pour un sucré on en met deux.",
     "lat": "yia enan sketo kafe den vazoume zachari yia enan metrio vazoume ena koutalaki yia enan gliko vazoume dio"
    },
    {
     "gr": "Ανακατεύουμε και βάζουμε το μπρίκι σε χαμηλή φωτιά.",
     "en": "We stir and put the briki on a low heat.",
     "fr": "On remue et on met le briki sur feu doux.",
     "lat": "anakatevoume ke vazoume to briki se chamili fotia"
    },
    {
     "gr": "Περιμένουμε. Όταν ο καφές ανεβαίνει, βγάζουμε το μπρίκι από τη φωτιά.",
     "en": "We wait. When the coffee rises, we take the briki off the heat.",
     "fr": "On attend. Quand le café monte, on retire le briki du feu.",
     "lat": "perimenoume otan o kafes aneveni vgazoume to briki apo ti fotia",
     "end": true
    },
    {
     "gr": "Τον σερβίρουμε αμέσως σε ένα μικρό φλιτζάνι, με ένα ποτήρι κρύο νερό.",
     "en": "We serve it at once in a small cup, with a glass of cold water.",
     "fr": "On le sert tout de suite dans une petite tasse, avec un verre d'eau froide.",
     "lat": "ton serviroume amesos se ena mikro flitzani me ena potiri krio nero"
    },
    {
     "gr": "Δεν τον ανακατεύουμε και δεν πίνουμε τον πάτο!",
     "en": "We do not stir it and we do not drink the bottom!",
     "fr": "On ne le remue pas et on ne boit pas le fond !",
     "lat": "den ton anakatevoume ke den pinoume ton pato"
    }
   ]
  },
  {
   "id": "yiaourti",
   "kind": "recipe",
   "level": "A1",
   "title": {
    "gr": "Γιαούρτι με μέλι",
    "en": "Yoghurt with honey",
    "fr": "Yaourt au miel"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "The simplest Greek dessert, ready in two minutes.",
    "fr": "Le dessert grec le plus simple, prêt en deux minutes."
   },
   "qs": [
    {
     "q": {
      "gr": "Τι ρίχνουμε πάνω από το γιαούρτι;",
      "en": "What do we pour over the yoghurt?",
      "fr": "Que verse-t-on sur le yaourt ?"
     },
     "ok": "Μέλι.",
     "bad": [
      "Λάδι.",
      "Αλάτι.",
      "Ξίδι."
     ]
    },
    {
     "q": {
      "gr": "Πώς είναι το γλυκό;",
      "en": "How is the dessert?",
      "fr": "Comment est le dessert ?"
     },
     "ok": "Γλυκό, δροσερό και νόστιμο.",
     "bad": [
      "Αλμυρό και ζεστό.",
      "Πικρό και σκληρό.",
      "Ωμό και ξινό."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Χρειαζόμαστε γιαούρτι, μέλι και καρύδια.",
     "en": "We need yoghurt, honey and walnuts.",
     "fr": "Il nous faut du yaourt, du miel et des noix.",
     "lat": "chriazomaste yiaourti meli ke karidia"
    },
    {
     "gr": "Βάζουμε το γιαούρτι σε ένα μπολ.",
     "en": "We put the yoghurt in a bowl.",
     "fr": "On met le yaourt dans un bol.",
     "lat": "vazoume to yiaourti se ena bol"
    },
    {
     "gr": "Σπάζουμε τα καρύδια σε μικρά κομμάτια.",
     "en": "We break the walnuts into small pieces.",
     "fr": "On casse les noix en petits morceaux.",
     "lat": "spazoume ta karidia se mikra kommatia"
    },
    {
     "gr": "Ρίχνουμε το μέλι πάνω από το γιαούρτι.",
     "en": "We pour the honey over the yoghurt.",
     "fr": "On verse le miel sur le yaourt.",
     "lat": "richnoume to meli pano apo to yiaourti"
    },
    {
     "gr": "Προσθέτουμε τα καρύδια και λίγη κανέλα.",
     "en": "We add the walnuts and a little cinnamon.",
     "fr": "On ajoute les noix et un peu de cannelle.",
     "lat": "prosthetoume ta karidia ke liyi kanela"
    },
    {
     "gr": "Είναι γλυκό, δροσερό και πολύ νόστιμο!",
     "en": "It is sweet, cool and very tasty!",
     "fr": "C'est sucré, frais et très bon !",
     "lat": "ine gliko drosero ke poli nostimo"
    }
   ]
  },
  {
   "id": "halloumi",
   "kind": "recipe",
   "level": "A1",
   "title": {
    "gr": "Χαλλούμι στη σχάρα",
    "en": "Grilled halloumi",
    "fr": "Halloumi grillé"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "Halloumi is the famous cheese of Cyprus. It does not melt, so it is perfect on the grill.",
    "fr": "Le halloumi est le célèbre fromage de Chypre. Il ne fond pas, il est donc parfait au gril."
   },
   "qs": [
    {
     "q": {
      "gr": "Από πού είναι το χαλλούμι;",
      "en": "Where is halloumi from?",
      "fr": "D'où vient le halloumi ?"
     },
     "ok": "Από την Κύπρο.",
     "bad": [
      "Από την Κρήτη.",
      "Από τη Ρόδο.",
      "Από την Αθήνα."
     ]
    },
    {
     "q": {
      "gr": "Πόσα λεπτά ψήνουμε κάθε πλευρά;",
      "en": "How many minutes do we grill each side?",
      "fr": "Combien de minutes fait-on cuire chaque côté ?"
     },
     "ok": "Δύο λεπτά.",
     "bad": [
      "Δέκα λεπτά.",
      "Ένα λεπτό.",
      "Μισή ώρα."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Το χαλλούμι είναι το διάσημο τυρί της Κύπρου.",
     "en": "Halloumi is the famous cheese of Cyprus.",
     "fr": "Le halloumi est le célèbre fromage de Chypre.",
     "lat": "to challoumi ine to diasimo tiri tis kiprou"
    },
    {
     "gr": "Κόβουμε το χαλλούμι σε χοντρές φέτες.",
     "en": "We cut the halloumi into thick slices.",
     "fr": "On coupe le halloumi en tranches épaisses.",
     "lat": "kovoume to challoumi se chondres fetes"
    },
    {
     "gr": "Ζεσταίνουμε τη σχάρα ή ένα τηγάνι.",
     "en": "We heat the grill or a frying pan.",
     "fr": "On chauffe le gril ou une poêle.",
     "lat": "zestenoume ti schara i ena tigani",
     "end": true
    },
    {
     "gr": "Ψήνουμε κάθε φέτα δύο λεπτά από κάθε πλευρά.",
     "en": "We grill each slice for two minutes on each side.",
     "fr": "On fait cuire chaque tranche deux minutes de chaque côté.",
     "lat": "psinoume kathe feta dio lepta apo kathe plevra"
    },
    {
     "gr": "Το χαλλούμι γίνεται χρυσό και λίγο τραγανό.",
     "en": "The halloumi becomes golden and a little crunchy.",
     "fr": "Le halloumi devient doré et un peu croustillant.",
     "lat": "to challoumi yinete chriso ke ligo tragano"
    },
    {
     "gr": "Το σερβίρουμε με ντομάτα, αγγούρι και λίγο λεμόνι.",
     "en": "We serve it with tomato, cucumber and a little lemon.",
     "fr": "On le sert avec de la tomate, du concombre et un peu de citron.",
     "lat": "to serviroume me domata angouri ke ligo lemoni",
     "end": true
    },
    {
     "gr": "Στην Κύπρο το τρώνε και με καρπούζι το καλοκαίρι!",
     "en": "In Cyprus they also eat it with watermelon in summer!",
     "fr": "À Chypre on le mange aussi avec de la pastèque en été !",
     "lat": "stin kipro to trone ke me karpouzi to kalokeri"
    }
   ]
  },
  {
   "id": "tzatziki",
   "kind": "recipe",
   "level": "A2",
   "title": {
    "gr": "Τζατζίκι",
    "en": "Tzatziki",
    "fr": "Tzatziki"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A cold sauce of yoghurt, cucumber and garlic, eaten with bread, meat and fried food.",
    "fr": "Une sauce froide au yaourt, concombre et ail, qu'on mange avec du pain, de la viande et des fritures."
   },
   "qs": [
    {
     "q": {
      "gr": "Τι κάνουμε με το αγγούρι πριν το βάλουμε στο γιαούρτι;",
      "en": "What do we do with the cucumber before putting it in the yoghurt?",
      "fr": "Que fait-on du concombre avant de le mettre dans le yaourt ?"
     },
     "ok": "Το τρίβουμε και το στραγγίζουμε.",
     "bad": [
      "Το τηγανίζουμε.",
      "Το βράζουμε.",
      "Το ψήνουμε στον φούρνο."
     ]
    },
    {
     "q": {
      "gr": "Πόση ώρα μένει στο ψυγείο;",
      "en": "How long does it stay in the fridge?",
      "fr": "Combien de temps reste-t-il au frigo ?"
     },
     "ok": "Μία ώρα.",
     "bad": [
      "Πέντε λεπτά.",
      "Δύο μέρες.",
      "Όλο τον χρόνο."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Για το τζατζίκι χρειαζόμαστε γιαούρτι, ένα αγγούρι και δύο ή τρία σκόρδα.",
     "en": "For tzatziki we need yoghurt, a cucumber and two or three cloves of garlic.",
     "fr": "Pour le tzatziki il nous faut du yaourt, un concombre et deux ou trois gousses d'ail.",
     "lat": "yia to tzatziki chriazomaste yiaourti ena angouri ke dio i tria skorda"
    },
    {
     "gr": "Ξεφλουδίζουμε το αγγούρι και το τρίβουμε.",
     "en": "We peel the cucumber and grate it.",
     "fr": "On épluche le concombre et on le râpe.",
     "lat": "xefloudizoume to angouri ke to trivoume"
    },
    {
     "gr": "Στραγγίζουμε καλά το αγγούρι, γιατί έχει πολύ νερό.",
     "en": "We drain the cucumber well, because it has a lot of water.",
     "fr": "On égoutte bien le concombre, car il contient beaucoup d'eau.",
     "lat": "strangizoume kala to angouri yiati echi poli nero"
    },
    {
     "gr": "Ψιλοκόβουμε το σκόρδο.",
     "en": "We chop the garlic finely.",
     "fr": "On hache finement l'ail.",
     "lat": "psilokovoume to skordo",
     "end": true
    },
    {
     "gr": "Βάζουμε το γιαούρτι σε ένα μπολ και προσθέτουμε το αγγούρι και το σκόρδο.",
     "en": "We put the yoghurt in a bowl and add the cucumber and the garlic.",
     "fr": "On met le yaourt dans un saladier et on ajoute le concombre et l'ail.",
     "lat": "vazoume to yiaourti se ena bol ke prosthetoume to angouri ke to skordo"
    },
    {
     "gr": "Ρίχνουμε ελαιόλαδο, λίγο ξίδι και αλάτι.",
     "en": "We add olive oil, a little vinegar and salt.",
     "fr": "On ajoute de l'huile d'olive, un peu de vinaigre et du sel.",
     "lat": "richnoume eleolado ligo xidi ke alati"
    },
    {
     "gr": "Ανακατεύουμε και προσθέτουμε λίγο άνηθο.",
     "en": "We mix and add a little dill.",
     "fr": "On mélange et on ajoute un peu d'aneth.",
     "lat": "anakatevoume ke prosthetoume ligo anitho",
     "end": true
    },
    {
     "gr": "Το βάζουμε στο ψυγείο για μία ώρα. Μετά το δοκιμάζουμε και το σερβίρουμε κρύο.",
     "en": "We put it in the fridge for an hour. Then we taste it and serve it cold.",
     "fr": "On le met au frigo pendant une heure. Ensuite on le goûte et on le sert froid.",
     "lat": "to vazoume sto psiyio yia mia ora meta to dokimazoume ke to serviroume krio"
    }
   ]
  },
  {
   "id": "patates",
   "kind": "recipe",
   "level": "A2",
   "title": {
    "gr": "Πατάτες λεμονάτες",
    "en": "Lemon potatoes",
    "fr": "Pommes de terre au citron"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "Potatoes baked in the oven with lemon, olive oil and oregano: a favorite next to grilled meat.",
    "fr": "Des pommes de terre cuites au four avec du citron, de l'huile d'olive et de l'origan : un grand favori avec les grillades."
   },
   "qs": [
    {
     "q": {
      "gr": "Πόσα λεμόνια χρειαζόμαστε;",
      "en": "How many lemons do we need?",
      "fr": "De combien de citrons a-t-on besoin ?"
     },
     "ok": "Δύο.",
     "bad": [
      "Ένα.",
      "Πέντε.",
      "Κανένα."
     ]
    },
    {
     "q": {
      "gr": "Πότε είναι έτοιμες οι πατάτες;",
      "en": "When are the potatoes ready?",
      "fr": "Quand les pommes de terre sont-elles prêtes ?"
     },
     "ok": "Όταν είναι μαλακές και χρυσές.",
     "bad": [
      "Όταν είναι ωμές.",
      "Όταν είναι κρύες.",
      "Όταν δεν έχουν χρώμα."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Για τις πατάτες λεμονάτες χρειαζόμαστε ένα κιλό πατάτες, δύο λεμόνια, ελαιόλαδο, ρίγανη και αλάτι.",
     "en": "For lemon potatoes we need a kilo of potatoes, two lemons, olive oil, oregano and salt.",
     "fr": "Pour les pommes de terre au citron il nous faut un kilo de pommes de terre, deux citrons, de l'huile d'olive, de l'origan et du sel.",
     "lat": "yia tis patates lemonates chriazomaste ena kilo patates dio lemonia eleolado rigani ke alati"
    },
    {
     "gr": "Ζεσταίνουμε τον φούρνο.",
     "en": "We heat the oven.",
     "fr": "On chauffe le four.",
     "lat": "zestenoume ton fourno"
    },
    {
     "gr": "Ξεφλουδίζουμε τις πατάτες και τις κόβουμε σε μεγάλα κομμάτια.",
     "en": "We peel the potatoes and cut them into big pieces.",
     "fr": "On épluche les pommes de terre et on les coupe en gros morceaux.",
     "lat": "xefloudizoume tis patates ke tis kovoume se megala kommatia"
    },
    {
     "gr": "Τις βάζουμε στο ταψί.",
     "en": "We put them in the baking dish.",
     "fr": "On les met dans le plat à four.",
     "lat": "tis vazoume sto tapsi",
     "end": true
    },
    {
     "gr": "Στύβουμε τα λεμόνια πάνω από τις πατάτες.",
     "en": "We squeeze the lemons over the potatoes.",
     "fr": "On presse les citrons sur les pommes de terre.",
     "lat": "stivoume ta lemonia pano apo tis patates"
    },
    {
     "gr": "Προσθέτουμε το ελαιόλαδο, τη ρίγανη, το αλάτι και ένα ποτήρι νερό.",
     "en": "We add the olive oil, the oregano, the salt and a glass of water.",
     "fr": "On ajoute l'huile d'olive, l'origan, le sel et un verre d'eau.",
     "lat": "prosthetoume to eleolado ti rigani to alati ke ena potiri nero"
    },
    {
     "gr": "Ανακατεύουμε καλά με τα χέρια.",
     "en": "We mix well with our hands.",
     "fr": "On mélange bien avec les mains.",
     "lat": "anakatevoume kala me ta cheria",
     "end": true
    },
    {
     "gr": "Ψήνουμε για μία ώρα και τις γυρίζουμε μία φορά.",
     "en": "We bake for an hour and turn them once.",
     "fr": "On fait cuire une heure et on les retourne une fois.",
     "lat": "psinoume yia mia ora ke tis yirizoume mia fora"
    },
    {
     "gr": "Οι πατάτες είναι έτοιμες όταν είναι μαλακές και χρυσές.",
     "en": "The potatoes are ready when they are soft and golden.",
     "fr": "Les pommes de terre sont prêtes quand elles sont tendres et dorées.",
     "lat": "i patates ine etimes otan ine malakes ke chrises"
    }
   ]
  },
  {
   "id": "strapatsada",
   "kind": "recipe",
   "level": "A2",
   "title": {
    "gr": "Στραπατσάδα",
    "en": "Strapatsada (eggs with tomato)",
    "fr": "Strapatsada (œufs à la tomate)"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "Eggs scrambled with fresh tomato: a quick everyday dish, with feta on top.",
    "fr": "Des œufs brouillés à la tomate fraîche : un plat rapide de tous les jours, avec de la feta par-dessus."
   },
   "qs": [
    {
     "q": {
      "gr": "Πόσο μαγειρεύουμε τις ντομάτες;",
      "en": "How long do we cook the tomatoes?",
      "fr": "Combien de temps fait-on cuire les tomates ?"
     },
     "ok": "Δέκα λεπτά.",
     "bad": [
      "Μία ώρα.",
      "Δύο λεπτά.",
      "Μισή ώρα."
     ]
    },
    {
     "q": {
      "gr": "Τι βάζουμε στο τέλος από πάνω;",
      "en": "What do we put on top at the end?",
      "fr": "Que met-on dessus à la fin ?"
     },
     "ok": "Φέτα.",
     "bad": [
      "Ζάχαρη.",
      "Μέλι.",
      "Λεμόνι."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Για τη στραπατσάδα χρειαζόμαστε τρία αυγά, δύο ώριμες ντομάτες, ελαιόλαδο, αλάτι και φέτα.",
     "en": "For strapatsada we need three eggs, two ripe tomatoes, olive oil, salt and feta.",
     "fr": "Pour la strapatsada il nous faut trois œufs, deux tomates mûres, de l'huile d'olive, du sel et de la feta.",
     "lat": "yia ti strapatsada chriazomaste tria avga dio orimes domates eleolado alati ke feta"
    },
    {
     "gr": "Κόβουμε τις ντομάτες σε μικρά κομμάτια.",
     "en": "We cut the tomatoes into small pieces.",
     "fr": "On coupe les tomates en petits morceaux.",
     "lat": "kovoume tis domates se mikra kommatia"
    },
    {
     "gr": "Ζεσταίνουμε το ελαιόλαδο στο τηγάνι.",
     "en": "We heat the olive oil in the frying pan.",
     "fr": "On chauffe l'huile d'olive dans la poêle.",
     "lat": "zestenoume to eleolado sto tigani"
    },
    {
     "gr": "Προσθέτουμε τις ντομάτες και τις μαγειρεύουμε για δέκα λεπτά.",
     "en": "We add the tomatoes and cook them for ten minutes.",
     "fr": "On ajoute les tomates et on les fait cuire dix minutes.",
     "lat": "prosthetoume tis domates ke tis mayirevoume yia deka lepta",
     "end": true
    },
    {
     "gr": "Χτυπάμε τα αυγά σε ένα μπολ με λίγο αλάτι.",
     "en": "We beat the eggs in a bowl with a little salt.",
     "fr": "On bat les œufs dans un saladier avec un peu de sel.",
     "lat": "chtipame ta avga se ena bol me ligo alati"
    },
    {
     "gr": "Ρίχνουμε τα αυγά στο τηγάνι και ανακατεύουμε αργά.",
     "en": "We pour the eggs into the pan and stir slowly.",
     "fr": "On verse les œufs dans la poêle et on remue doucement.",
     "lat": "richnoume ta avga sto tigani ke anakatevoume arga"
    },
    {
     "gr": "Όταν τα αυγά είναι έτοιμα, τρίβουμε φέτα από πάνω.",
     "en": "When the eggs are ready, we grate feta on top.",
     "fr": "Quand les œufs sont prêts, on râpe de la feta dessus.",
     "lat": "otan ta avga ine etima trivoume feta apo pano",
     "end": true
    },
    {
     "gr": "Τη σερβίρουμε ζεστή με ψωμί.",
     "en": "We serve it hot with bread.",
     "fr": "On la sert chaude avec du pain.",
     "lat": "ti serviroume zesti me psomi"
    }
   ]
  },
  {
   "id": "mousakas",
   "kind": "recipe",
   "level": "B1",
   "title": {
    "gr": "Ο μουσακάς",
    "en": "Moussaka",
    "fr": "La moussaka"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "The best-known Greek baked dish, with aubergines, minced meat and béchamel. This is a simplified version.",
    "fr": "Le plat au four grec le plus connu, avec des aubergines, de la viande hachée et de la béchamel. C'est une version simplifiée."
   },
   "qs": [
    {
     "q": {
      "gr": "Ποια λαχανικά βάζουμε στον μουσακά;",
      "en": "Which vegetables do we put in moussaka?",
      "fr": "Quels légumes met-on dans la moussaka ?"
     },
     "ok": "Μελιτζάνες και πατάτες.",
     "bad": [
      "Καρότα και κολοκυθάκια.",
      "Μόνο ντομάτες.",
      "Σπανάκι και μαρούλι."
     ]
    },
    {
     "q": {
      "gr": "Τι ρίχνουμε στο τέλος πάνω από τον κιμά;",
      "en": "What do we pour over the minced meat at the end?",
      "fr": "Que verse-t-on à la fin sur la viande hachée ?"
     },
     "ok": "Μπεσαμέλ.",
     "bad": [
      "Ξίδι.",
      "Μέλι.",
      "Γάλα με ζάχαρη."
     ]
    },
    {
     "q": {
      "gr": "Πόση ώρα ψήνεται ο μουσακάς;",
      "en": "How long does the moussaka bake?",
      "fr": "Combien de temps cuit la moussaka ?"
     },
     "ok": "Σαράντα πέντε λεπτά.",
     "bad": [
      "Πέντε λεπτά.",
      "Δέκα λεπτά.",
      "Τρεις ώρες."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Για τον μουσακά χρειαζόμαστε μελιτζάνες, πατάτες, κιμά, κρεμμύδι, ντομάτα και μπεσαμέλ.",
     "en": "For moussaka we need aubergines, potatoes, minced meat, onion, tomato and béchamel.",
     "fr": "Pour la moussaka il nous faut des aubergines, des pommes de terre, de la viande hachée, un oignon, une tomate et de la béchamel.",
     "lat": "yia ton mousaka chriazomaste melitzanes patates kima kremmidi domata ke besamel"
    },
    {
     "gr": "Κόβουμε τις μελιτζάνες και τις πατάτες σε φέτες και τις τηγανίζουμε ή τις ψήνουμε.",
     "en": "We cut the aubergines and the potatoes into slices and fry or bake them.",
     "fr": "On coupe les aubergines et les pommes de terre en tranches et on les fait frire ou cuire au four.",
     "lat": "kovoume tis melitzanes ke tis patates se fetes ke tis tiganizoume i tis psinoume",
     "end": true
    },
    {
     "gr": "Ψιλοκόβουμε το κρεμμύδι και το μαγειρεύουμε στο τηγάνι.",
     "en": "We chop the onion finely and cook it in the frying pan.",
     "fr": "On hache finement l'oignon et on le fait cuire à la poêle.",
     "lat": "psilokovoume to kremmidi ke to mayirevoume sto tigani"
    },
    {
     "gr": "Προσθέτουμε τον κιμά, λίγη ντομάτα, αλάτι, πιπέρι και κανέλα.",
     "en": "We add the minced meat, a little tomato, salt, pepper and cinnamon.",
     "fr": "On ajoute la viande hachée, un peu de tomate, du sel, du poivre et de la cannelle.",
     "lat": "prosthetoume ton kima liyi domata alati piperi ke kanela"
    },
    {
     "gr": "Μαγειρεύουμε τον κιμά για είκοσι λεπτά.",
     "en": "We cook the minced meat for twenty minutes.",
     "fr": "On fait cuire la viande hachée vingt minutes.",
     "lat": "mayirevoume ton kima yia ikosi lepta",
     "end": true
    },
    {
     "gr": "Στο ταψί βάζουμε πρώτα τις πατάτες και μετά τις μελιτζάνες.",
     "en": "In the baking dish we first put the potatoes and then the aubergines.",
     "fr": "Dans le plat on met d'abord les pommes de terre, puis les aubergines.",
     "lat": "sto tapsi vazoume prota tis patates ke meta tis melitzanes"
    },
    {
     "gr": "Από πάνω ρίχνουμε τον κιμά και τον απλώνουμε καλά.",
     "en": "On top we pour the minced meat and spread it well.",
     "fr": "Par-dessus on verse la viande hachée et on l'étale bien.",
     "lat": "apo pano richnoume ton kima ke ton aplonoume kala"
    },
    {
     "gr": "Μετά ρίχνουμε τη μπεσαμέλ και την απλώνουμε σε όλο το ταψί.",
     "en": "Then we pour the béchamel and spread it over the whole dish.",
     "fr": "Ensuite on verse la béchamel et on l'étale sur tout le plat.",
     "lat": "meta richnoume ti besamel ke tin aplonoume se olo to tapsi",
     "end": true
    },
    {
     "gr": "Ψήνουμε τον μουσακά στον φούρνο για σαράντα πέντε λεπτά, μέχρι να γίνει χρυσός.",
     "en": "We bake the moussaka in the oven for forty-five minutes, until it is golden.",
     "fr": "On fait cuire la moussaka au four quarante-cinq minutes, jusqu'à ce qu'elle soit dorée.",
     "lat": "psinoume ton mousaka ston fourno yia saranda pende lepta mechri na yini chrisos"
    },
    {
     "gr": "Τον αφήνουμε να κρυώσει λίγο πριν τον σερβίρουμε.",
     "en": "We let it cool a little before serving.",
     "fr": "On le laisse refroidir un peu avant de le servir.",
     "lat": "ton afinoume na kriosi ligo prin ton serviroume"
    }
   ]
  },
  {
   "id": "afelia",
   "kind": "recipe",
   "level": "A2",
   "title": {
    "gr": "Αφέλια",
    "en": "Afelia (pork with coriander)",
    "fr": "Afelia (porc à la coriandre)"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A classic dish of Cyprus: pork cooked in red wine with coriander seeds.",
    "fr": "Un plat classique de Chypre : du porc cuit au vin rouge avec des graines de coriandre."
   },
   "qs": [
    {
     "q": {
      "gr": "Τι κρέας έχουν τα αφέλια;",
      "en": "What meat is in afelia?",
      "fr": "Quelle viande y a-t-il dans les afélia ?"
     },
     "ok": "Χοιρινό.",
     "bad": [
      "Ψάρι.",
      "Κοτόπουλο.",
      "Αρνί."
     ]
    },
    {
     "q": {
      "gr": "Τι βάζουμε μαζί με το κρασί;",
      "en": "What do we put in with the wine?",
      "fr": "Que met-on avec le vin ?"
     },
     "ok": "Κόλιανδρο.",
     "bad": [
      "Ζάχαρη.",
      "Γάλα.",
      "Μέλι."
     ]
    },
    {
     "q": {
      "gr": "Με τι τρώγονται τα αφέλια;",
      "en": "What is afelia eaten with?",
      "fr": "Avec quoi mange-t-on les afélia ?"
     },
     "ok": "Με πατάτες ή πλιγούρι.",
     "bad": [
      "Με παγωτό.",
      "Με σοκολάτα.",
      "Με τυρόπιτα."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Τα αφέλια είναι ένα παραδοσιακό φαγητό της Κύπρου.",
     "en": "Afelia is a traditional dish of Cyprus.",
     "fr": "Les afélia sont un plat traditionnel de Chypre.",
     "lat": "ta afelia ine ena paradosiako fayito tis kiprou"
    },
    {
     "gr": "Χρειαζόμαστε χοιρινό κρέας, κόκκινο κρασί και σπόρους κόλιανδρου.",
     "en": "We need pork, red wine and coriander seeds.",
     "fr": "Il nous faut du porc, du vin rouge et des graines de coriandre.",
     "lat": "chriazomaste chirino kreas kokkino krasi ke sporous koliandrou"
    },
    {
     "gr": "Κόβουμε το κρέας σε μικρά κομμάτια.",
     "en": "We cut the meat into small pieces.",
     "fr": "On coupe la viande en petits morceaux.",
     "lat": "kovoume to kreas se mikra kommatia"
    },
    {
     "gr": "Βάζουμε το κρέας στο κρασί με τον κόλιανδρο για μερικές ώρες.",
     "en": "We put the meat in the wine with the coriander for a few hours.",
     "fr": "On met la viande dans le vin avec la coriandre pendant quelques heures.",
     "lat": "vazoume to kreas sto krasi me ton koliandro yia merikes ores"
    },
    {
     "gr": "Μετά ζεσταίνουμε λίγο λάδι στο τηγάνι.",
     "en": "Then we heat a little oil in the pan.",
     "fr": "Ensuite on chauffe un peu d'huile dans la poêle.",
     "lat": "meta zestenoume ligo ladi sto tigani"
    },
    {
     "gr": "Τηγανίζουμε το κρέας μέχρι να γίνει χρυσό.",
     "en": "We fry the meat until it turns golden.",
     "fr": "On fait revenir la viande jusqu'à ce qu'elle soit dorée.",
     "lat": "tiganizoume to kreas mechri na yini chriso"
    },
    {
     "gr": "Ρίχνουμε το κρασί και το αφήνουμε να βράσει σιγά σιγά.",
     "en": "We pour in the wine and let it simmer slowly.",
     "fr": "On verse le vin et on le laisse mijoter doucement.",
     "lat": "richnoume to krasi ke to afinoume na vrasi siga siga"
    },
    {
     "gr": "Τα αφέλια τρώγονται με πατάτες ή με πλιγούρι.",
     "en": "Afelia is eaten with potatoes or with bulgur.",
     "fr": "Les afélia se mangent avec des pommes de terre ou du boulgour.",
     "lat": "ta afelia trogonde me patates i me pligouri"
    }
   ]
  },
  {
   "id": "makaronia",
   "kind": "recipe",
   "level": "A2",
   "title": {
    "gr": "Μακαρόνια του φούρνου",
    "en": "Baked pasta, Cypriot style",
    "fr": "Pâtes au four à la chypriote"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "A pasta dish baked in the oven, with a meat sauce and cheese on top.",
    "fr": "Un plat de pâtes cuit au four, avec une sauce à la viande et du fromage dessus."
   },
   "qs": [
    {
     "q": {
      "gr": "Ποιο τυρί βάζουμε από πάνω;",
      "en": "Which cheese do we put on top?",
      "fr": "Quel fromage met-on dessus ?"
     },
     "ok": "Χαλλούμι.",
     "bad": [
      "Φέτα.",
      "Μοτσαρέλα.",
      "Παρμεζάνα."
     ]
    },
    {
     "q": {
      "gr": "Τι μυρωδικά βάζουμε στον κιμά;",
      "en": "What do we add to the minced meat?",
      "fr": "Qu'ajoute-t-on à la viande hachée ?"
     },
     "ok": "Κανέλα και μέντα.",
     "bad": [
      "Βανίλια και μέλι.",
      "Σοκολάτα.",
      "Πάπρικα και ζάχαρη."
     ]
    },
    {
     "q": {
      "gr": "Πόση ώρα ψήνεται το φαγητό;",
      "en": "How long does it bake?",
      "fr": "Combien de temps cuit le plat ?"
     },
     "ok": "Μισή ώρα.",
     "bad": [
      "Πέντε λεπτά.",
      "Δύο μέρες.",
      "Ένα λεπτό."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Τα μακαρόνια του φούρνου είναι ένα φαγητό για όλη την οικογένεια.",
     "en": "Baked pasta is a dish for the whole family.",
     "fr": "Les pâtes au four sont un plat pour toute la famille.",
     "lat": "ta makaronia tou fournou ine ena fayito yia oli tin ikoyenia"
    },
    {
     "gr": "Βράζουμε τα μακαρόνια σε αλατισμένο νερό.",
     "en": "We boil the pasta in salted water.",
     "fr": "On fait cuire les pâtes dans de l'eau salée.",
     "lat": "vrazoume ta makaronia se alatismeno nero"
    },
    {
     "gr": "Σε ένα τηγάνι ψήνουμε τον κιμά με κρεμμύδι και ντομάτα.",
     "en": "In a pan we cook the minced meat with onion and tomato.",
     "fr": "Dans une poêle, on fait cuire la viande hachée avec de l'oignon et de la tomate.",
     "lat": "se ena tigani psinoume ton kima me kremmidi ke domata"
    },
    {
     "gr": "Προσθέτουμε λίγη κανέλα και μέντα.",
     "en": "We add a little cinnamon and mint.",
     "fr": "On ajoute un peu de cannelle et de menthe.",
     "lat": "prosthetoume liyi kanela ke menda"
    },
    {
     "gr": "Βάζουμε τα μακαρόνια και τον κιμά σε ένα ταψί.",
     "en": "We put the pasta and the meat in a baking dish.",
     "fr": "On met les pâtes et la viande dans un plat à four.",
     "lat": "vazoume ta makaronia ke ton kima se ena tapsi"
    },
    {
     "gr": "Από πάνω ρίχνουμε πολύ χαλλούμι.",
     "en": "On top we put a lot of halloumi.",
     "fr": "Dessus, on met beaucoup de halloumi.",
     "lat": "apo pano richnoume poli challoumi"
    },
    {
     "gr": "Ψήνουμε το φαγητό στον φούρνο για μισή ώρα.",
     "en": "We bake the dish in the oven for half an hour.",
     "fr": "On fait cuire le plat au four pendant une demi-heure.",
     "lat": "psinoume to fayito ston fourno yia misi ora"
    },
    {
     "gr": "Το σερβίρουμε ζεστό, με μια φρέσκια σαλάτα.",
     "en": "We serve it hot, with a fresh salad.",
     "fr": "On le sert chaud, avec une salade fraîche.",
     "lat": "to serviroume zesto me mia freskia salata"
    }
   ]
  },
  {
   "id": "loukoumades",
   "kind": "recipe",
   "level": "A2",
   "title": {
    "gr": "Λουκουμάδες",
    "en": "Loukoumades (honey puffs)",
    "fr": "Loukoumades (beignets au miel)"
   },
   "author": {
    "en": "Simple recipe written for this app",
    "fr": "Recette simple écrite pour cette appli"
   },
   "years": "",
   "about": {
    "en": "Small fried balls of dough with syrup: a sweet from Cyprus and Greece.",
    "fr": "De petites boules de pâte frites avec du sirop : une douceur de Chypre et de Grèce."
   },
   "qs": [
    {
     "q": {
      "gr": "Από τι φτιάχνονται οι λουκουμάδες;",
      "en": "What are loukoumades made of?",
      "fr": "De quoi sont faits les loukoumades ?"
     },
     "ok": "Από ζυμάρι.",
     "bad": [
      "Από ψάρι.",
      "Από ρύζι.",
      "Από τυρί."
     ]
    },
    {
     "q": {
      "gr": "Πόση ώρα περιμένουμε τη ζύμη;",
      "en": "How long do we wait for the dough?",
      "fr": "Combien de temps attend-on la pâte ?"
     },
     "ok": "Μία ώρα.",
     "bad": [
      "Ένα λεπτό.",
      "Τρεις μέρες.",
      "Δέκα δευτερόλεπτα."
     ]
    },
    {
     "q": {
      "gr": "Τι βάζουμε από πάνω;",
      "en": "What do we put on top?",
      "fr": "Que met-on dessus ?"
     },
     "ok": "Σιρόπι ή μέλι.",
     "bad": [
      "Αλάτι.",
      "Ντομάτα.",
      "Ξύδι."
     ]
    }
   ],
   "lines": [
    {
     "gr": "Οι λουκουμάδες είναι μικρές τηγανητές μπάλες από ζυμάρι.",
     "en": "Loukoumades are small fried balls of dough.",
     "fr": "Les loukoumades sont de petites boules de pâte frites.",
     "lat": "i loukoumades ine mikres tiganites bales apo zimari"
    },
    {
     "gr": "Για τη ζύμη χρειαζόμαστε αλεύρι, νερό, ζάχαρη και μαγιά.",
     "en": "For the dough we need flour, water, sugar and yeast.",
     "fr": "Pour la pâte, il nous faut de la farine, de l'eau, du sucre et de la levure.",
     "lat": "yia ti zimi chriazomaste alevri nero zachari ke mayia"
    },
    {
     "gr": "Ανακατεύουμε όλα τα υλικά και περιμένουμε μία ώρα.",
     "en": "We mix all the ingredients and wait for one hour.",
     "fr": "On mélange tous les ingrédients et on attend une heure.",
     "lat": "anakatevoume ola ta ilika ke perimenoume mia ora"
    },
    {
     "gr": "Η ζύμη γίνεται μεγάλη και ελαφριά.",
     "en": "The dough gets big and light.",
     "fr": "La pâte devient grosse et légère.",
     "lat": "i zimi yinete megali ke elafria"
    },
    {
     "gr": "Ζεσταίνουμε πολύ λάδι σε μια κατσαρόλα.",
     "en": "We heat a lot of oil in a pot.",
     "fr": "On chauffe beaucoup d'huile dans une casserole.",
     "lat": "zestenoume poli ladi se mia katsarola"
    },
    {
     "gr": "Με ένα κουτάλι ρίχνουμε μικρά κομμάτια ζύμη στο λάδι.",
     "en": "With a spoon we drop small pieces of dough into the oil.",
     "fr": "Avec une cuillère, on fait tomber de petits morceaux de pâte dans l'huile.",
     "lat": "me ena koutali richnoume mikra kommatia zimi sto ladi"
    },
    {
     "gr": "Όταν γίνουν χρυσοί, τους βγάζουμε.",
     "en": "When they turn golden, we take them out.",
     "fr": "Quand ils sont dorés, on les sort.",
     "lat": "otan yinoun chrisi tous vgazoume"
    },
    {
     "gr": "Από πάνω βάζουμε σιρόπι ή μέλι και κανέλα.",
     "en": "On top we put syrup or honey and cinnamon.",
     "fr": "Dessus, on met du sirop ou du miel et de la cannelle.",
     "lat": "apo pano vazoume siropi i meli ke kanela"
    }
   ]
  }
 ],
 "gloss": [
  {
   "gr": "λαχανικά",
   "lat": "lachanika",
   "en": "vegetables",
   "fr": "légumes"
  },
  {
   "gr": "κομμάτια",
   "lat": "kommatia",
   "en": "pieces",
   "fr": "morceaux"
  },
  {
   "gr": "λεπτές",
   "lat": "leptes",
   "en": "thin (fem. plural)",
   "fr": "fines"
  },
  {
   "gr": "φέτες",
   "lat": "fetes",
   "en": "slices",
   "fr": "tranches"
  },
  {
   "gr": "προσθέτουμε",
   "lat": "prosthetoume",
   "en": "we add",
   "fr": "on ajoute"
  },
  {
   "gr": "ανακατεύουμε",
   "lat": "anakatevoume",
   "en": "we mix, we stir",
   "fr": "on mélange"
  },
  {
   "gr": "φρέσκο",
   "lat": "fresko",
   "en": "fresh (neuter)",
   "fr": "frais"
  },
  {
   "gr": "μετράμε",
   "lat": "metrame",
   "en": "we measure",
   "fr": "on mesure"
  },
  {
   "gr": "σκέτο",
   "lat": "sketo",
   "en": "plain, without sugar",
   "fr": "nature, sans sucre"
  },
  {
   "gr": "μέτριο",
   "lat": "metrio",
   "en": "medium (coffee)",
   "fr": "moyen (café)"
  },
  {
   "gr": "χαμηλή",
   "lat": "chamili",
   "en": "low (fem.)",
   "fr": "basse"
  },
  {
   "gr": "σπάζουμε",
   "lat": "spazoume",
   "en": "we break",
   "fr": "on casse"
  },
  {
   "gr": "μικρά",
   "lat": "mikra",
   "en": "small (plural)",
   "fr": "petits"
  },
  {
   "gr": "δροσερό",
   "lat": "drosero",
   "en": "cool, refreshing",
   "fr": "frais, rafraîchissant"
  },
  {
   "gr": "νόστιμο",
   "lat": "nostimo",
   "en": "tasty",
   "fr": "bon, délicieux"
  },
  {
   "gr": "διάσημο",
   "lat": "diasimo",
   "en": "famous",
   "fr": "célèbre"
  },
  {
   "gr": "κύπρου",
   "lat": "kiprou",
   "en": "of Cyprus",
   "fr": "de Chypre"
  },
  {
   "gr": "χοντρές",
   "lat": "chondres",
   "en": "thick (fem. plural)",
   "fr": "épaisses"
  },
  {
   "gr": "ψήνουμε",
   "lat": "psinoume",
   "en": "we bake, we grill",
   "fr": "on fait cuire"
  },
  {
   "gr": "λεπτά",
   "lat": "lepta",
   "en": "minutes",
   "fr": "minutes"
  },
  {
   "gr": "τραγανό",
   "lat": "tragano",
   "en": "crunchy",
   "fr": "croustillant"
  },
  {
   "gr": "σκόρδα",
   "lat": "skorda",
   "en": "cloves of garlic",
   "fr": "gousses d'ail"
  },
  {
   "gr": "ξεφλουδίζουμε",
   "lat": "xefloudizoume",
   "en": "we peel",
   "fr": "on épluche"
  },
  {
   "gr": "τρίβουμε",
   "lat": "trivoume",
   "en": "we grate",
   "fr": "on râpe"
  },
  {
   "gr": "στραγγίζουμε",
   "lat": "strangizoume",
   "en": "we drain",
   "fr": "on égoutte"
  },
  {
   "gr": "ψιλοκόβουμε",
   "lat": "psilokovoume",
   "en": "we chop finely",
   "fr": "on hache finement"
  },
  {
   "gr": "άνηθο",
   "lat": "anitho",
   "en": "dill",
   "fr": "aneth"
  },
  {
   "gr": "λεμονάτες",
   "lat": "lemonates",
   "en": "with lemon (fem. plural)",
   "fr": "au citron"
  },
  {
   "gr": "φούρνο",
   "lat": "fourno",
   "en": "oven",
   "fr": "four"
  },
  {
   "gr": "στύβουμε",
   "lat": "stivoume",
   "en": "we squeeze",
   "fr": "on presse"
  },
  {
   "gr": "χέρια",
   "lat": "cheria",
   "en": "hands",
   "fr": "mains"
  },
  {
   "gr": "γυρίζουμε",
   "lat": "yirizoume",
   "en": "we turn",
   "fr": "on retourne"
  },
  {
   "gr": "έτοιμες",
   "lat": "etimes",
   "en": "ready (fem. plural)",
   "fr": "prêtes"
  },
  {
   "gr": "μαλακές",
   "lat": "malakes",
   "en": "soft (fem. plural)",
   "fr": "tendres"
  },
  {
   "gr": "χρυσές",
   "lat": "chrises",
   "en": "golden (fem. plural)",
   "fr": "dorées"
  },
  {
   "gr": "στραπατσάδα",
   "lat": "strapatsada",
   "en": "strapatsada (eggs with tomato)",
   "fr": "strapatsada (œufs à la tomate)"
  },
  {
   "gr": "ώριμες",
   "lat": "orimes",
   "en": "ripe (fem. plural)",
   "fr": "mûres"
  },
  {
   "gr": "χτυπάμε",
   "lat": "chtipame",
   "en": "we beat, we whisk",
   "fr": "on bat"
  },
  {
   "gr": "έτοιμα",
   "lat": "etima",
   "en": "ready (neuter plural)",
   "fr": "prêts"
  },
  {
   "gr": "μουσακά",
   "lat": "mousaka",
   "en": "moussaka",
   "fr": "moussaka"
  },
  {
   "gr": "μελιτζάνες",
   "lat": "melitzanes",
   "en": "aubergines",
   "fr": "aubergines"
  },
  {
   "gr": "κιμά",
   "lat": "kima",
   "en": "minced meat",
   "fr": "viande hachée"
  },
  {
   "gr": "τηγανίζουμε",
   "lat": "tiganizoume",
   "en": "we fry",
   "fr": "on fait frire"
  },
  {
   "gr": "απλώνουμε",
   "lat": "aplonoume",
   "en": "we spread",
   "fr": "on étale"
  },
  {
   "gr": "όλο",
   "lat": "olo",
   "en": "whole, all",
   "fr": "tout"
  },
  {
   "gr": "αφήνουμε",
   "lat": "afinoume",
   "en": "we let, we leave",
   "fr": "on laisse"
  },
  {
   "gr": "κρυώσει",
   "lat": "kriosi",
   "en": "to cool down",
   "fr": "refroidir"
  },
  {
   "gr": "σπόρους",
   "lat": "sporous",
   "en": "seeds (accusative)",
   "fr": "graines"
  },
  {
   "gr": "κόλιανδρου",
   "lat": "koliandrou",
   "en": "of coriander",
   "fr": "de coriandre"
  },
  {
   "gr": "ζεσταίνουμε",
   "lat": "zestenoume",
   "en": "we heat",
   "fr": "on chauffe"
  },
  {
   "gr": "βράσει",
   "lat": "vrasi",
   "en": "to boil, to simmer",
   "fr": "bouillir, mijoter"
  },
  {
   "gr": "ταψί",
   "lat": "tapsi",
   "en": "baking dish",
   "fr": "plat à four"
  },
  {
   "gr": "αλατισμένο",
   "lat": "alatismeno",
   "en": "salted",
   "fr": "salé"
  },
  {
   "gr": "μυρωδικά",
   "lat": "mirodika",
   "en": "herbs, spices",
   "fr": "aromates"
  },
  {
   "gr": "λουκουμάδες",
   "lat": "loukoumades",
   "en": "loukoumades",
   "fr": "loukoumades"
  },
  {
   "gr": "ζυμάρι",
   "lat": "zimari",
   "en": "dough",
   "fr": "pâte"
  },
  {
   "gr": "μαγιά",
   "lat": "mayia",
   "en": "yeast",
   "fr": "levure"
  },
  {
   "gr": "σιρόπι",
   "lat": "siropi",
   "en": "syrup",
   "fr": "sirop"
  },
  {
   "gr": "κατσαρόλα",
   "lat": "katsarola",
   "en": "pot, saucepan",
   "fr": "casserole"
  }
 ]
};
