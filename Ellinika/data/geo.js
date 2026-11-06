// Two simplified maps (Cyprus, Greece) for "City & travel" (js/map.js). Edit freely.
//  - "shapes" are outlines as [longitude, latitude] points; "places" have a position ("lon", "la" = latitude),
//    the Greek name "gr" (with its recording), a sentence "say" about it (also recorded), and its English / French names and sentences.
//  - The outlines are drawn by hand and very simple: the places are in the right spots, the coasts are only a rough idea.
const GEO = {
  "maps": [
    {"id": "cyprus", "name": "Cyprus", "gr": "Κύπρος", "lon": [32.1, 34.75], "la": [34.5, 35.8],
      "shapes": [[[32.27, 35.1], [32.33, 35.16], [32.42, 35.04], [32.54, 35.17], [32.66, 35.2], [32.8, 35.33], [32.93, 35.4], [33.06, 35.36], [33.32, 35.34], [33.58, 35.4], [33.85, 35.5], [34.1, 35.58], [34.35, 35.68], [34.58, 35.69], [34.55, 35.58], [34.35, 35.45], [34.1, 35.35], [33.93, 35.22], [33.95, 35.08], [34.08, 34.96], [34.0, 34.93], [33.8, 34.96], [33.63, 34.91], [33.45, 34.8], [33.34, 34.72], [33.04, 34.66], [32.92, 34.57], [32.8, 34.63], [32.63, 34.66], [32.4, 34.73], [32.3, 34.88], [32.32, 34.98]]],
      "places": [
        {"gr": "Λευκωσία", "tr": "lefkosia", "en": "Nicosia", "fr": "Nicosie", "lon": 33.38, "la": 35.17, "kind": "city", "say": "Η Λευκωσία είναι η πρωτεύουσα της Κύπρου.", "sen": "Nicosia is the capital of Cyprus.", "sfr": "Nicosie est la capitale de Chypre."},
        {"gr": "Λεμεσός", "tr": "lemesos", "en": "Limassol", "fr": "Limassol", "lon": 33.04, "la": 34.68, "kind": "city", "say": "Η Λεμεσός είναι μια μεγάλη πόλη δίπλα στη θάλασσα.", "sen": "Limassol is a big city by the sea.", "sfr": "Limassol est une grande ville au bord de la mer."},
        {"gr": "Λάρνακα", "tr": "larnaka", "en": "Larnaca", "fr": "Larnaca", "lon": 33.63, "la": 34.92, "kind": "city", "say": "Η Λάρνακα έχει το κύριο αεροδρόμιο της Κύπρου.", "sen": "Larnaca has the main airport of Cyprus.", "sfr": "Larnaca a le principal aéroport de Chypre."},
        {"gr": "Πάφος", "tr": "pafos", "en": "Paphos", "fr": "Paphos", "lon": 32.42, "la": 34.77, "kind": "city", "say": "Η Πάφος έχει αρχαία ψηφιδωτά.", "sen": "Paphos has ancient mosaics.", "sfr": "Paphos a de mosaïques antiques."},
        {"gr": "Αμμόχωστος", "tr": "ammochostos", "en": "Famagusta", "fr": "Famagouste", "lon": 33.94, "la": 35.12, "kind": "city", "say": "Η Αμμόχωστος είναι μια παλιά πόλη στην ανατολική ακτή.", "sen": "Famagusta is an old city on the east coast.", "sfr": "Famagouste est une vieille ville de la côte est."},
        {"gr": "Κερύνεια", "tr": "kerinia", "en": "Kyrenia", "fr": "Kyrénia", "lon": 33.32, "la": 35.34, "kind": "city", "say": "Η Κερύνεια είναι μια πόλη στη βόρεια ακτή με ένα παλιό λιμάνι.", "sen": "Kyrenia is a town on the north coast with an old harbour.", "sfr": "Kyrénia est une ville de la côte nord avec un vieux port."},
        {"gr": "Αγία Νάπα", "tr": "ayia napa", "en": "Ayia Napa", "fr": "Ayia Napa", "lon": 34.0, "la": 34.99, "kind": "city", "say": "Η Αγία Νάπα είναι διάσημη για τις παραλίες της.", "sen": "Ayia Napa is famous for its beaches.", "sfr": "Ayia Napa est célèbre pour ses plages."},
        {"gr": "Τρόοδος", "tr": "troodos", "en": "Troodos", "fr": "Troodos", "lon": 32.87, "la": 34.93, "kind": "mountain", "say": "Στο Τρόοδος υπάρχουν πολλά βυζαντινά μοναστήρια και εκκλησίες.", "sen": "In the Troodos there are many Byzantine monasteries and churches.", "sfr": "Dans le Troodos, il y a beaucoup de monastères et d'églises byzantins."},
        {"gr": "Κούριο", "tr": "kourio", "en": "Kourion", "fr": "Kourion", "lon": 32.89, "la": 34.66, "kind": "site", "say": "Στο Κούριο υπάρχει ένα αρχαίο θέατρο δίπλα στη θάλασσα.", "sen": "At Kourion there is an ancient theatre by the sea.", "sfr": "À Kourion, il y a un théâtre antique au bord de la mer.", "side": "l"}
      ]
    },
    {"id": "greece", "name": "Greece", "gr": "Ελλάδα", "lon": [19.3, 28.6], "la": [34.75, 41.8],
      "shapes": [[[20.0, 39.7], [20.27, 39.5], [20.4, 39.28], [20.75, 38.95], [20.72, 38.85], [21.0, 38.95], [21.08, 38.53], [21.43, 38.37], [21.83, 38.39], [22.42, 38.43], [22.62, 38.38], [22.95, 38.25], [23.2, 38.15], [23.35, 37.98], [23.5, 38.04], [23.65, 37.94], [23.75, 37.87], [24.02, 37.65], [24.05, 37.72], [24.0, 38.02], [24.05, 38.15], [23.85, 38.33], [23.62, 38.42], [23.05, 38.65], [22.78, 38.77], [22.62, 38.9], [22.95, 39.1], [22.95, 39.35], [23.25, 39.4], [23.15, 39.6], [22.85, 39.7], [22.65, 40.0], [22.6, 40.3], [22.8, 40.55], [22.95, 40.63], [23.2, 40.45], [23.35, 39.97], [23.45, 40.2], [23.75, 40.0], [23.92, 39.95], [23.95, 40.25], [24.33, 40.15], [24.0, 40.4], [23.9, 40.6], [24.4, 40.94], [25.1, 40.97], [25.88, 40.85], [26.05, 40.82], [26.35, 41.72], [25.5, 41.3], [24.5, 41.55], [23.4, 41.4], [22.9, 41.35], [22.35, 41.12], [21.8, 40.9], [21.1, 40.85], [20.98, 40.8], [20.55, 40.4], [20.4, 40.05]],
        [[23.0, 38.02], [22.63, 38.08], [22.08, 38.25], [21.73, 38.25], [21.38, 38.17], [21.15, 37.9], [21.32, 37.65], [21.67, 37.25], [21.7, 36.92], [21.7, 36.82], [21.9, 36.72], [21.95, 36.8], [22.1, 37.02], [22.35, 36.75], [22.4, 36.55], [22.48, 36.38], [22.57, 36.76], [23.05, 36.69], [23.2, 36.43], [22.95, 37.2], [22.8, 37.55], [23.25, 37.38], [23.15, 37.65], [23.4, 37.6], [23.0, 37.95]],
        [[23.55, 35.52], [23.75, 35.55], [24.0, 35.53], [24.5, 35.4], [25.13, 35.35], [25.7, 35.3], [26.1, 35.25], [26.3, 35.3], [26.25, 35.05], [25.75, 35.0], [24.75, 34.92], [24.1, 35.2], [23.7, 35.23], [23.55, 35.35]],
        [[23.25, 39.2], [23.6, 38.95], [24.1, 38.45], [24.6, 38.05], [24.3, 37.95], [23.9, 38.3], [23.4, 38.6], [23.0, 38.95]],
        [[19.78, 39.62], [19.84, 39.8], [19.96, 39.8], [20.02, 39.62], [19.96, 39.44], [19.84, 39.44]],
        [[20.8, 37.8], [20.85, 37.92], [20.95, 37.92], [21.0, 37.8], [20.95, 37.68], [20.85, 37.68]],
        [[20.38, 38.22], [20.46, 38.34], [20.64, 38.34], [20.72, 38.22], [20.64, 38.1], [20.46, 38.1]],
        [[26.0, 39.15], [26.15, 39.32], [26.45, 39.32], [26.6, 39.15], [26.45, 38.98], [26.15, 38.98]],
        [[25.85, 38.4], [25.93, 38.6], [26.07, 38.6], [26.15, 38.4], [26.07, 38.2], [25.93, 38.2]],
        [[25.35, 37.05], [25.43, 37.19], [25.57, 37.19], [25.65, 37.05], [25.57, 36.91], [25.43, 36.91]],
        [[25.32, 37.45], [25.36, 37.51], [25.44, 37.51], [25.48, 37.45], [25.44, 37.39], [25.36, 37.39]],
        [[25.33, 36.4], [25.36, 36.46], [25.43, 36.46], [25.47, 36.4], [25.43, 36.34], [25.36, 36.34]],
        [[27.75, 36.2], [27.88, 36.37], [28.12, 36.37], [28.25, 36.2], [28.12, 36.03], [27.88, 36.03]],
        [[27.03, 36.85], [27.11, 36.92], [27.29, 36.92], [27.37, 36.85], [27.29, 36.78], [27.11, 36.78]],
        [[24.58, 40.65], [24.64, 40.73], [24.76, 40.73], [24.82, 40.65], [24.76, 40.57], [24.64, 40.57]],
        [[25.15, 37.2], [25.18, 37.25], [25.22, 37.25], [25.25, 37.2], [25.22, 37.15], [25.18, 37.15]],
        [[25.08, 36.75], [25.11, 36.81], [25.18, 36.81], [25.22, 36.75], [25.18, 36.69], [25.11, 36.69]],
        [[24.88, 37.45], [24.91, 37.51], [24.98, 37.51], [25.02, 37.45], [24.98, 37.39], [24.91, 37.39]],
        [[23.34, 36.2], [23.37, 36.27], [23.43, 36.27], [23.46, 36.2], [23.43, 36.13], [23.37, 36.13]],
        [[24.42, 36.7], [24.46, 36.76], [24.54, 36.76], [24.58, 36.7], [24.54, 36.64], [24.46, 36.64]]],
      "places": [
        {"gr": "Αθήνα", "tr": "athina", "en": "Athens", "fr": "Athènes", "lon": 23.73, "la": 37.98, "kind": "city", "say": "Η Αθήνα είναι η πρωτεύουσα της Ελλάδας.", "sen": "Athens is the capital of Greece.", "sfr": "Athènes est la capitale de la Grèce."},
        {"gr": "Θεσσαλονίκη", "tr": "thessaloniki", "en": "Thessaloniki", "fr": "Thessalonique", "lon": 22.94, "la": 40.64, "kind": "city", "say": "Η Θεσσαλονίκη είναι η δεύτερη μεγάλη πόλη της Ελλάδας.", "sen": "Thessaloniki is the second big city of Greece.", "sfr": "Thessalonique est la deuxième grande ville de Grèce."},
        {"gr": "Πάτρα", "tr": "patra", "en": "Patras", "fr": "Patras", "lon": 21.73, "la": 38.25, "kind": "city", "say": "Η Πάτρα είναι ένα μεγάλο λιμάνι της Πελοποννήσου.", "sen": "Patras is a big port of the Peloponnese.", "sfr": "Patras est un grand port du Péloponnèse."},
        {"gr": "Ηράκλειο", "tr": "iraklio", "en": "Heraklion", "fr": "Héraklion", "lon": 25.14, "la": 35.34, "kind": "city", "say": "Το Ηράκλειο είναι η μεγαλύτερη πόλη της Κρήτης.", "sen": "Heraklion is the biggest city of Crete.", "sfr": "Héraklion est la plus grande ville de Crète."},
        {"gr": "Ρόδος", "tr": "rodos", "en": "Rhodes", "fr": "Rhodes", "lon": 28.22, "la": 36.44, "kind": "island", "say": "Η Ρόδος είναι ένα νησί με ένα μεσαιωνικό κάστρο.", "sen": "Rhodes is an island with a medieval castle.", "sfr": "Rhodes est une île avec un château médiéval.", "side": "l"},
        {"gr": "Κέρκυρα", "tr": "kerkira", "en": "Corfu", "fr": "Corfou", "lon": 19.92, "la": 39.62, "kind": "island", "say": "Η Κέρκυρα είναι ένα πράσινο νησί στο Ιόνιο.", "sen": "Corfu is a green island in the Ionian Sea.", "sfr": "Corfou est une île verte de la mer Ionienne.", "side": "b"},
        {"gr": "Σαντορίνη", "tr": "sandorini", "en": "Santorini", "fr": "Santorin", "lon": 25.43, "la": 36.39, "kind": "island", "say": "Η Σαντορίνη έχει άσπρα σπίτια και μπλε θόλους.", "sen": "Santorini has white houses and blue domes.", "sfr": "Santorin a des maisons blanches et des dômes bleus.", "side": "b"},
        {"gr": "Μύκονος", "tr": "mikonos", "en": "Mykonos", "fr": "Mykonos", "lon": 25.33, "la": 37.45, "kind": "island", "say": "Η Μύκονος είναι διάσημη για τους ανεμόμυλους της.", "sen": "Mykonos is famous for its windmills.", "sfr": "Mykonos est célèbre pour ses moulins à vent."},
        {"gr": "Ζάκυνθος", "tr": "zakinthos", "en": "Zakynthos", "fr": "Zante", "lon": 20.9, "la": 37.79, "kind": "island", "say": "Η Ζάκυνθος είναι γνωστή για τις όμορφες παραλίες της.", "sen": "Zakynthos is known for its beautiful beaches.", "sfr": "Zante est connue pour ses belles plages.", "side": "b"},
        {"gr": "Δελφοί", "tr": "delfi", "en": "Delphi", "fr": "Delphes", "lon": 22.5, "la": 38.48, "kind": "site", "say": "Οι Δελφοί ήταν το μαντείο της αρχαίας Ελλάδας.", "sen": "Delphi was the oracle of ancient Greece.", "sfr": "Delphes était l'oracle de la Grèce antique."},
        {"gr": "Ολυμπία", "tr": "olimbia", "en": "Olympia", "fr": "Olympie", "lon": 21.63, "la": 37.64, "kind": "site", "say": "Στην Ολυμπία έγιναν οι πρώτοι Ολυμπιακοί Αγώνες.", "sen": "The first Olympic Games took place in Olympia.", "sfr": "Les premiers Jeux olympiques ont eu lieu à Olympie."},
        {"gr": "Μετέωρα", "tr": "meteora", "en": "Meteora", "fr": "Météores", "lon": 21.63, "la": 39.72, "kind": "site", "say": "Τα Μετέωρα έχουν μοναστήρια πάνω σε βράχους.", "sen": "Meteora has monasteries on top of rocks.", "sfr": "Les Météores ont des monastères au sommet de rochers."},
        {"gr": "Όλυμπος", "tr": "olimbos", "en": "Mount Olympus", "fr": "Mont Olympe", "lon": 22.35, "la": 40.09, "kind": "mountain", "say": "Ο Όλυμπος είναι το ψηλότερο βουνό της Ελλάδας.", "sen": "Olympus is the highest mountain of Greece.", "sfr": "L'Olympe est la plus haute montagne de Grèce."}
      ]
    }
  ]
};
