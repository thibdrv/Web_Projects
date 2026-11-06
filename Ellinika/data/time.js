// Time and dates. Edit freely.
//  - "gr" is the Greek word. Nouns come WITH their "the" (ο, η, το): ο μήνας. Other words
//    (hier, toujours, jamais...) have no "the": χθες, πάντα, ποτέ.
//    Every "gr" gets a recording (tools/make_audio.py makes it).
//  - "emoji" is optional. Give it only when the picture is clear and not used by another word.
//  - Days and months are written in small letters, as is usual in Greek.
const TIME = {
  "groups": [
    {"id": "days", "name": "Days", "words": [
      {"gr": "η δευτέρα", "lat": "i deftera", "en": "Monday"},
      {"gr": "η τρίτη", "lat": "i triti", "en": "Tuesday"},
      {"gr": "η τετάρτη", "lat": "i tetarti", "en": "Wednesday"},
      {"gr": "η πέμπτη", "lat": "i pempti", "en": "Thursday"},
      {"gr": "η παρασκευή", "lat": "i paraskevi", "en": "Friday"},
      {"gr": "το σάββατο", "lat": "to savato", "en": "Saturday"},
      {"gr": "η κυριακή", "lat": "i kiriaki", "en": "Sunday"},
      {"gr": "η μέρα", "lat": "i mera", "en": "day"},
      {"gr": "η εβδομάδα", "lat": "i evdomada", "en": "week"},
      {"gr": "το σαββατοκύριακο", "lat": "to savatokiriako", "en": "weekend"}
    ]},
    {"id": "months", "name": "Months", "words": [
      {"gr": "ο ιανουάριος", "lat": "o ianouarios", "en": "January"},
      {"gr": "ο φεβρουάριος", "lat": "o fevrouarios", "en": "February"},
      {"gr": "ο μάρτιος", "lat": "o martios", "en": "March"},
      {"gr": "ο απρίλιος", "lat": "o aprilios", "en": "April"},
      {"gr": "ο μάιος", "lat": "o maios", "en": "May"},
      {"gr": "ο ιούνιος", "lat": "o iounios", "en": "June"},
      {"gr": "ο ιούλιος", "lat": "o ioulios", "en": "July"},
      {"gr": "ο αύγουστος", "lat": "o avgoustos", "en": "August"},
      {"gr": "ο σεπτέμβριος", "lat": "o septemvrios", "en": "September"},
      {"gr": "ο οκτώβριος", "lat": "o oktovrios", "en": "October"},
      {"gr": "ο νοέμβριος", "lat": "o noemvrios", "en": "November"},
      {"gr": "ο δεκέμβριος", "lat": "o dekemvrios", "en": "December"},
      {"gr": "ο μήνας", "lat": "o minas", "en": "month"},
      {"gr": "ο χρόνος", "lat": "o chronos", "en": "year"},
      {"gr": "το ημερολόγιο", "lat": "to imerologio", "en": "calendar"}
    ]},
    {"id": "seasons", "name": "Seasons", "words": [
      {"gr": "η άνοιξη", "lat": "i anoixi", "en": "spring", "emoji": "🌸"},
      {"gr": "το καλοκαίρι", "lat": "to kalokairi", "en": "summer", "emoji": "☀️"},
      {"gr": "το φθινόπωρο", "lat": "to fthinoporo", "en": "autumn", "emoji": "🍂"},
      {"gr": "ο χειμώνας", "lat": "o chimonas", "en": "winter", "emoji": "❄️"}
    ]},
    {"id": "now", "name": "Yesterday, today, tomorrow", "words": [
      {"gr": "προχθές", "lat": "prochthes", "en": "the day before yesterday"},
      {"gr": "χθες", "lat": "chthes", "en": "yesterday"},
      {"gr": "σήμερα", "lat": "simera", "en": "today"},
      {"gr": "αύριο", "lat": "avrio", "en": "tomorrow"},
      {"gr": "μεθαύριο", "lat": "methavrio", "en": "the day after tomorrow"},
      {"gr": "τώρα", "lat": "tora", "en": "now"}
    ]},
    {"id": "daytime", "name": "Time of day", "words": [
      {"gr": "το πρωί", "lat": "to proi", "en": "morning", "emoji": "🌅"},
      {"gr": "το μεσημέρι", "lat": "to mesimeri", "en": "noon, midday"},
      {"gr": "το απόγευμα", "lat": "to apoyevma", "en": "afternoon", "emoji": "🌇"},
      {"gr": "το βράδυ", "lat": "to vradi", "en": "evening", "emoji": "🌆"},
      {"gr": "η νύχτα", "lat": "i nichta", "en": "night", "emoji": "🌙"},
      {"gr": "η ώρα", "lat": "i ora", "en": "hour, time", "emoji": "🕐"},
      {"gr": "το λεπτό", "lat": "to lepto", "en": "minute"},
      {"gr": "η ημερομηνία", "lat": "i imerominia", "en": "date"}
    ]},
    {"id": "around", "name": "Before & after", "words": [
      {"gr": "πριν", "lat": "prin", "en": "before"},
      {"gr": "μετά", "lat": "meta", "en": "after, then"},
      {"gr": "αργότερα", "lat": "argotera", "en": "later"},
      {"gr": "νωρίς", "lat": "noris", "en": "early"},
      {"gr": "αργά", "lat": "arga", "en": "late"}
    ]},
    {"id": "often", "name": "How often", "words": [
      {"gr": "πάντα", "lat": "panta", "en": "always"},
      {"gr": "σχεδόν πάντα", "lat": "schedon panta", "en": "almost always"},
      {"gr": "συνήθως", "lat": "sinithos", "en": "usually"},
      {"gr": "συχνά", "lat": "sichna", "en": "often"},
      {"gr": "μερικές φορές", "lat": "merikes fores", "en": "sometimes"},
      {"gr": "σπάνια", "lat": "spania", "en": "rarely"},
      {"gr": "ποτέ", "lat": "pote", "en": "never"},
      {"gr": "κάθε μέρα", "lat": "kathe mera", "en": "every day"},
      {"gr": "κάθε εβδομάδα", "lat": "kathe evdomada", "en": "every week"},
      {"gr": "μία φορά", "lat": "mia fora", "en": "once"},
      {"gr": "δύο φορές", "lat": "dio fores", "en": "twice"},
      {"gr": "λίγο", "lat": "ligo", "en": "a little"},
      {"gr": "πολύ", "lat": "poli", "en": "a lot, very"},
      {"gr": "αρκετά", "lat": "arketa", "en": "quite, enough"},
      {"gr": "καθόλου", "lat": "katholou", "en": "not at all"},
      {"gr": "ακόμα", "lat": "akoma", "en": "still, yet"},
      {"gr": "ήδη", "lat": "idi", "en": "already"},
      {"gr": "πάλι", "lat": "pali", "en": "again"},
      {"gr": "μόνο", "lat": "mono", "en": "only"}
    ]}
  ]
};
