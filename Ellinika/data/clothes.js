// Clothes for men, women and babies, each with a drawing. Edit freely.
//  - "gr" is the Greek word WITH its "the" (ο, η, το, οι, τα); every "gr" gets a recording (tools/make_audio.py makes it).
//  - "svg" is the name of the drawing (js/garments.js) and "color" its main color; "lat" is the pronunciation, "en" the meaning (the French is in data/fr.js).
const CLOTHES = {
  "groups": [
    {"id": "men", "name": "For men", "words": [
      {"gr": "το πουκάμισο", "lat": "to poukamiso", "en": "shirt", "svg": "shirt", "color": "#4A8BD0"},
      {"gr": "το μπλουζάκι", "lat": "to blouzaki", "en": "T-shirt", "svg": "tshirt", "color": "#E2745B"},
      {"gr": "το παντελόνι", "lat": "to pandeloni", "en": "trousers", "svg": "trousers", "color": "#6B7A8F"},
      {"gr": "το τζιν", "lat": "to tzin", "en": "jeans", "svg": "jeans", "color": "#3B6FB5"},
      {"gr": "το σορτς", "lat": "to sorts", "en": "shorts", "svg": "shorts", "color": "#D2A24C"},
      {"gr": "το κοστούμι", "lat": "to kostoumi", "en": "suit", "svg": "suit", "color": "#3A3F55"},
      {"gr": "το σακάκι", "lat": "to sakaki", "en": "jacket", "svg": "blazer", "color": "#7A6A58"},
      {"gr": "η γραβάτα", "lat": "i gravata", "en": "tie", "svg": "tie", "color": "#C0392B"},
      {"gr": "το παλτό", "lat": "to palto", "en": "coat", "svg": "coat", "color": "#4D4D58"},
      {"gr": "το πουλόβερ", "lat": "to poulover", "en": "sweater", "svg": "sweater", "color": "#5E9444"},
      {"gr": "το μπουφάν", "lat": "to boufan", "en": "padded jacket", "svg": "puffer", "color": "#2E86CC"},
      {"gr": "η ζώνη", "lat": "i zoni", "en": "belt", "svg": "belt", "color": "#8A5A33"},
      {"gr": "οι κάλτσες", "lat": "i kaltses", "en": "socks", "svg": "socks", "color": "#8B7CD6"},
      {"gr": "το καπέλο", "lat": "to kapelo", "en": "hat", "svg": "hat", "color": "#A67C52"},
      {"gr": "τα παπούτσια", "lat": "ta papoutsia", "en": "shoes", "svg": "shoes", "color": "#5A4636"}
    ]},
    {"id": "women", "name": "For women", "words": [
      {"gr": "το φόρεμα", "lat": "to forema", "en": "dress", "svg": "dress", "color": "#C4546B"},
      {"gr": "η φούστα", "lat": "i fousta", "en": "skirt", "svg": "skirt", "color": "#8F5D94"},
      {"gr": "η μπλούζα", "lat": "i blouza", "en": "blouse", "svg": "blouse", "color": "#E58AA8"},
      {"gr": "το καλσόν", "lat": "to kalson", "en": "tights", "svg": "tights", "color": "#3A3A44"},
      {"gr": "το μαγιό", "lat": "to mayio", "en": "swimsuit", "svg": "swimsuit", "color": "#2FA39A"},
      {"gr": "η ζακέτα", "lat": "i zaketa", "en": "cardigan", "svg": "cardigan", "color": "#D9A93A"},
      {"gr": "τα ψηλοτάκουνα", "lat": "ta psilotakouna", "en": "high heels", "svg": "heels", "color": "#B02A66"},
      {"gr": "τα σανδάλια", "lat": "ta sandalia", "en": "sandals", "svg": "sandals", "color": "#C98A3B"},
      {"gr": "οι μπότες", "lat": "i botes", "en": "boots", "svg": "boots", "color": "#6B4A35"},
      {"gr": "η τσάντα", "lat": "i tsanda", "en": "handbag", "svg": "handbag", "color": "#7A3E3E"},
      {"gr": "το κασκόλ", "lat": "to kaskol", "en": "scarf", "svg": "scarf", "color": "#E58A2B"},
      {"gr": "το κολιέ", "lat": "to kolie", "en": "necklace", "svg": "necklace", "color": "#F2C14E"},
      {"gr": "τα σκουλαρίκια", "lat": "ta skoularikia", "en": "earrings", "svg": "earrings", "color": "#F2C14E"}
    ]},
    {"id": "baby", "name": "For babies", "words": [
      {"gr": "το φορμάκι", "lat": "to formaki", "en": "baby romper", "svg": "romper", "color": "#7FB8E6"},
      {"gr": "το κορμάκι", "lat": "to kormaki", "en": "baby bodysuit", "svg": "bodysuit", "color": "#F2C6A0"},
      {"gr": "η πάνα", "lat": "i pana", "en": "nappy", "svg": "nappy", "color": "#BFD9F2"},
      {"gr": "η σαλιάρα", "lat": "i saliara", "en": "bib", "svg": "bib", "color": "#F2B8C6"},
      {"gr": "το σκουφάκι", "lat": "to skoufaki", "en": "baby hat", "svg": "babyhat", "color": "#F2D26A"},
      {"gr": "τα παπουτσάκια", "lat": "ta papoutsakia", "en": "baby shoes", "svg": "babyshoes", "color": "#F2B8C6"},
      {"gr": "τα γαντάκια", "lat": "ta gandakia", "en": "baby mittens", "svg": "mittens", "color": "#9ED8B8"},
      {"gr": "τα καλτσάκια", "lat": "ta kaltsakia", "en": "baby socks", "svg": "babysocks", "color": "#BFA6E8"},
      {"gr": "η πιτζάμα", "lat": "i pitzama", "en": "pyjamas", "svg": "pyjamas", "color": "#7FB8E6"},
      {"gr": "η κουβερτούλα", "lat": "i kouvertoula", "en": "baby blanket", "svg": "blanket", "color": "#9ED8B8"},
      {"gr": "η πιπίλα", "lat": "i pipila", "en": "pacifier", "svg": "pacifier", "color": "#F28B82"}
    ]}
  ]
};
