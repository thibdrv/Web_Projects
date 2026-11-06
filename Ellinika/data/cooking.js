// Cooking words: ingredients, tools, actions, amounts, tastes. Edit freely.
//  - "gr" is the Greek word WITH its "the" (ο, η, το, οι, τα) for nouns; every "gr" gets a recording (tools/make_audio.py makes it).
//  - "lat" is the pronunciation, "en" the meaning (the French is in data/fr.js). The recipes themselves are in data/recipes.js.
const COOKING = {
  "groups": [
    {"id": "ingredients", "name": "Ingredients", "words": [
      {"gr": "το ελαιόλαδο", "lat": "to eleolado", "en": "olive oil", "emoji": "🫒"},
      {"gr": "το ξίδι", "lat": "to xidi", "en": "vinegar"},
      {"gr": "το κολοκυθάκι", "lat": "to kolokithaki", "en": "courgette"},
      {"gr": "το χαλλούμι", "lat": "to challoumi", "en": "halloumi"},
      {"gr": "το αλεύρι", "lat": "to alevri", "en": "flour"},
      {"gr": "τα ζυμαρικά", "lat": "ta zimarika", "en": "pasta", "emoji": "🍝"},
      {"gr": "ο κιμάς", "lat": "o kimas", "en": "minced meat"},
      {"gr": "οι ελιές", "lat": "i elies", "en": "olives", "emoji": "🫒"},
      {"gr": "η ρίγανη", "lat": "i rigani", "en": "oregano", "emoji": "🌿"},
      {"gr": "ο δυόσμος", "lat": "o diosmos", "en": "mint"},
      {"gr": "ο άνηθος", "lat": "o anithos", "en": "dill"},
      {"gr": "ο μαϊντανός", "lat": "o maindanos", "en": "parsley"},
      {"gr": "η κανέλα", "lat": "i kanela", "en": "cinnamon"},
      {"gr": "τα καρύδια", "lat": "ta karidia", "en": "walnuts"},
      {"gr": "η σάλτσα", "lat": "i saltsa", "en": "sauce"},
      {"gr": "τα όσπρια", "lat": "ta ospria", "en": "pulses (beans, lentils)"},
      {"gr": "η μπεσαμέλ", "lat": "i besamel", "en": "béchamel sauce"}
    ]},
    {"id": "tools", "name": "Kitchen tools", "words": [
      {"gr": "η ξύλινη κουτάλα", "lat": "i xilini koutala", "en": "wooden spoon"},
      {"gr": "το ταψί", "lat": "to tapsi", "en": "baking dish"},
      {"gr": "η σχάρα", "lat": "i schara", "en": "grill"},
      {"gr": "ο τρίφτης", "lat": "o triftis", "en": "grater"},
      {"gr": "το σουρωτήρι", "lat": "to sourotiri", "en": "colander"},
      {"gr": "η ζυγαριά", "lat": "i zigaria", "en": "scales", "emoji": "⚖️"},
      {"gr": "ο πλάστης", "lat": "o plastis", "en": "rolling pin"},
      {"gr": "το μπρίκι", "lat": "to briki", "en": "briki (coffee pot)"},
      {"gr": "το γουδί", "lat": "to goudi", "en": "mortar"},
      {"gr": "ο πάγκος", "lat": "o pangos", "en": "worktop"},
      {"gr": "το σκουπόπανο", "lat": "to skoupopano", "en": "cloth"}
    ]},
    {"id": "actions", "name": "Cooking actions", "words": [
      {"gr": "κόβω", "lat": "kovo", "en": "I cut", "emoji": "✂️"},
      {"gr": "ψιλοκόβω", "lat": "psilokovo", "en": "I chop finely"},
      {"gr": "ξεφλουδίζω", "lat": "xefloudizo", "en": "I peel"},
      {"gr": "πλένω", "lat": "pleno", "en": "I wash"},
      {"gr": "ανακατεύω", "lat": "anakatevo", "en": "I mix, I stir"},
      {"gr": "προσθέτω", "lat": "prostheto", "en": "I add"},
      {"gr": "ρίχνω", "lat": "richno", "en": "I pour, I throw in"},
      {"gr": "τηγανίζω", "lat": "tiganizo", "en": "I fry"},
      {"gr": "βράζω", "lat": "vrazo", "en": "I boil"},
      {"gr": "ψήνω", "lat": "psino", "en": "I bake, I roast"},
      {"gr": "μαγειρεύω", "lat": "mayirevo", "en": "I cook", "emoji": "🧑‍🍳"},
      {"gr": "ζεσταίνω", "lat": "zesteno", "en": "I heat"},
      {"gr": "ζυμώνω", "lat": "zimono", "en": "I knead"},
      {"gr": "τρίβω", "lat": "trivo", "en": "I grate"},
      {"gr": "στύβω", "lat": "stivo", "en": "I squeeze"},
      {"gr": "στραγγίζω", "lat": "strangizo", "en": "I drain"},
      {"gr": "χτυπάω", "lat": "chtipao", "en": "I beat, I whisk"},
      {"gr": "απλώνω", "lat": "aplono", "en": "I spread"},
      {"gr": "δοκιμάζω", "lat": "dokimazo", "en": "I taste, I try"},
      {"gr": "σερβίρω", "lat": "serviro", "en": "I serve"},
      {"gr": "αλατίζω", "lat": "alatizo", "en": "I add salt"}
    ]},
    {"id": "measures", "name": "Amounts", "words": [
      {"gr": "το κουταλάκι", "lat": "to koutalaki", "en": "teaspoon"},
      {"gr": "η κουταλιά", "lat": "i koutalia", "en": "spoonful"},
      {"gr": "η πρέζα", "lat": "i preza", "en": "pinch"},
      {"gr": "το γραμμάριο", "lat": "to grammario", "en": "gram"},
      {"gr": "το λίτρο", "lat": "to litro", "en": "litre"},
      {"gr": "το κομμάτι", "lat": "to kommati", "en": "piece"},
      {"gr": "το μισό", "lat": "to miso", "en": "half"},
      {"gr": "αρκετό", "lat": "arketo", "en": "enough"}
    ]},
    {"id": "taste", "name": "Taste & state", "words": [
      {"gr": "αλμυρός", "lat": "almiros", "en": "salty"},
      {"gr": "ξινός", "lat": "xinos", "en": "sour"},
      {"gr": "καυτερός", "lat": "kafteros", "en": "spicy hot"},
      {"gr": "νόστιμος", "lat": "nostimos", "en": "tasty", "emoji": "😋"},
      {"gr": "φρέσκος", "lat": "freskos", "en": "fresh"},
      {"gr": "ωμός", "lat": "omos", "en": "raw"},
      {"gr": "ψημένος", "lat": "psimenos", "en": "baked, roasted"},
      {"gr": "τραγανός", "lat": "traganos", "en": "crunchy"},
      {"gr": "λιωμένος", "lat": "liomenos", "en": "melted"},
      {"gr": "έτοιμος", "lat": "etimos", "en": "ready"}
    ]}
  ]
};
