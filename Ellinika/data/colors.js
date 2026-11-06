// Colors. Edit freely.
//  - "gr" is the Greek text: every "gr" gets a recording (tools/make_audio.py makes it).
//  - "hex" is the color shown on screen.
//  - "objects": "before" + a color word makes the sentence in "gr".
//  - "mixes": two colors that make a third one (use the "id" of the colors).
const COLORS = {
  "words": [
    {"id": "red", "gr": "κόκκινο", "lat": "kokkino", "en": "red", "hex": "#E53935"},
    {"id": "orange", "gr": "πορτοκαλί", "lat": "portokali", "en": "orange", "hex": "#FB8C00"},
    {"id": "yellow", "gr": "κίτρινο", "lat": "kitrino", "en": "yellow", "hex": "#FDD835"},
    {"id": "green", "gr": "πράσινο", "lat": "prasino", "en": "green", "hex": "#43A047"},
    {"id": "lightblue", "gr": "γαλάζιο", "lat": "galazio", "en": "light blue", "hex": "#4FC3F7"},
    {"id": "blue", "gr": "μπλε", "lat": "ble", "en": "blue", "hex": "#1E5AC8"},
    {"id": "purple", "gr": "μωβ", "lat": "mov", "en": "purple", "hex": "#8E24AA"},
    {"id": "pink", "gr": "ροζ", "lat": "roz", "en": "pink", "hex": "#F48FB1"},
    {"id": "brown", "gr": "καφέ", "lat": "kafe", "en": "brown", "hex": "#795548"},
    {"id": "black", "gr": "μαύρο", "lat": "mavro", "en": "black", "hex": "#111111"},
    {"id": "white", "gr": "άσπρο", "lat": "aspro", "en": "white", "hex": "#FFFFFF"},
    {"id": "grey", "gr": "γκρι", "lat": "gri", "en": "grey", "hex": "#9E9E9E"},
    {"id": "beige", "gr": "μπεζ", "lat": "bez", "en": "beige", "hex": "#D9C7A0"},
    {"id": "gold", "gr": "χρυσό", "lat": "chriso", "en": "gold", "hex": "#D4AF37"},
    {"id": "silver", "gr": "ασημί", "lat": "asimi", "en": "silver", "hex": "#C0C0C0"},
    {"id": "turquoise", "gr": "τιρκουάζ", "lat": "tirkouaz", "en": "turquoise", "hex": "#1ABC9C"},
    {"id": "burgundy", "gr": "μπορντό", "lat": "bordo", "en": "burgundy", "hex": "#800020"},
    {"id": "lilac", "gr": "λιλά", "lat": "lila", "en": "lilac", "hex": "#C8A2C8"}
  ],
  "objects": [
    {"emoji": "🍎", "before": "Το μήλο είναι", "color": "red", "gr": "Το μήλο είναι κόκκινο", "lat": "to milo ine kokkino", "en": "The apple is red"},
    {"emoji": "🍋", "before": "Το λεμόνι είναι", "color": "yellow", "gr": "Το λεμόνι είναι κίτρινο", "lat": "to lemoni ine kitrino", "en": "The lemon is yellow"},
    {"emoji": "🍊", "before": "Το πορτοκάλι είναι", "color": "orange", "gr": "Το πορτοκάλι είναι πορτοκαλί", "lat": "to portokali ine portokali", "en": "The orange is orange"},
    {"emoji": "❄️", "before": "Το χιόνι είναι", "color": "white", "gr": "Το χιόνι είναι άσπρο", "lat": "to chioni ine aspro", "en": "The snow is white"},
    {"emoji": "🌳", "before": "Το δέντρο είναι", "color": "green", "gr": "Το δέντρο είναι πράσινο", "lat": "to dentro ine prasino", "en": "The tree is green"},
    {"emoji": "🍇", "before": "Το σταφύλι είναι", "color": "purple", "gr": "Το σταφύλι είναι μωβ", "lat": "to stafili ine mov", "en": "The grape is purple"},
    {"emoji": "🥕", "before": "Το καρότο είναι", "color": "orange", "gr": "Το καρότο είναι πορτοκαλί", "lat": "to karoto ine portokali", "en": "The carrot is orange"},
    {"emoji": "🌻", "before": "Το ηλιοτρόπιο είναι", "color": "yellow", "gr": "Το ηλιοτρόπιο είναι κίτρινο", "lat": "to iliotropio ine kitrino", "en": "The sunflower is yellow"},
    {"emoji": "🥒", "before": "Το αγγούρι είναι", "color": "green", "gr": "Το αγγούρι είναι πράσινο", "lat": "to angouri ine prasino", "en": "The cucumber is green"},
    {"emoji": "🐷", "before": "Το γουρούνι είναι", "color": "pink", "gr": "Το γουρούνι είναι ροζ", "lat": "to gourouni ine roz", "en": "The pig is pink"},
    {"emoji": "⚫", "before": "Το κάρβουνο είναι", "color": "black", "gr": "Το κάρβουνο είναι μαύρο", "lat": "to karvouno ine mavro", "en": "The charcoal is black"},
    {"emoji": "🌹", "before": "Το τριαντάφυλλο είναι", "color": "red", "gr": "Το τριαντάφυλλο είναι κόκκινο", "lat": "to triantafillo ine kokkino", "en": "The rose is red"},
    {"emoji": "🟫", "before": "Το χώμα είναι", "color": "brown", "gr": "Το χώμα είναι καφέ", "lat": "to choma ine kafe", "en": "The soil is brown"}
  ],
  "mixes": [
    {"a": "red", "b": "yellow", "result": "orange"},
    {"a": "blue", "b": "yellow", "result": "green"},
    {"a": "red", "b": "blue", "result": "purple"},
    {"a": "red", "b": "white", "result": "pink"},
    {"a": "black", "b": "white", "result": "grey"},
    {"a": "blue", "b": "white", "result": "lightblue"}
  ]
};
