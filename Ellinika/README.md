# Elliniká · Ελληνικά

**Learn Greek faster than you can say moussaka!** · **Apprends le grec plus vite que tu ne dis « moussaka » !**

A free, personal Greek-learning web app (modern Greek and a little Cypriot), for beginners to upper-intermediate (A1 → B2).
It runs in any browser, on a phone or a computer, can be installed like an app, and works offline once visited.
The interface is in **English** or **French**.

Une appli web gratuite et personnelle pour apprendre le grec moderne (et un peu de chypriote), du niveau débutant au niveau B2.
Elle fonctionne dans n'importe quel navigateur, sur téléphone ou ordinateur, s'installe comme une appli et marche hors ligne après une première visite.
L'interface est en **anglais** ou en **français**.

> **Status / État** · Still in development. The Greek and the French were written with the help of an AI (Claude) and have **not yet been checked by a native speaker**. If you speak Greek, the app has a review sheet (`relecture-grec.html`, opened from the *About* page) where you can confirm or correct each line. Your help is very welcome.
> En cours de développement. Le grec et le français ont été écrits avec l'aide d'une IA (Claude) et **ne sont pas encore relus par un locuteur natif**. Si tu parles grec, la feuille de relecture (`relecture-grec.html`, depuis la page *À propos*) permet de confirmer ou corriger chaque ligne. Toute aide est la bienvenue.

## What is inside / Ce qu'il y a dedans

- **Letters and reading**: the alphabet with stroke animation, writing practice, transliteration.
- **Vocabulary by theme**: colors, numbers, family, animals, food, body, time, house, clothes, cooking, city, directions, nature, jobs, opposites. Many have **numbered drawings** you can tap to hear each word.
- **Dictionary** of more than 4,000 words (Greek, Latin letters, English, French), with the level of each word.
- **Grammar**: verbs, cases, articles, negation, questions, mini lessons.
- **Listening and speaking**: phrases, dialogues, 28 situations with a conversation partner, sentence dictation.
- **Reading**: short stories, poems, songs, recipes, texts with questions, customs and the Cypriot dialect.
- **Games and tests**: flashcards, quizzes, hangman, word search, crossword, a 1-minute challenge, and a level test (A1 → B2).
- **Progress**: daily goal, streak, badges, review of the words you miss, and a code to move your progress to another device.
- **Sounds**: more than 11,000 recordings in a synthetic Greek voice.

## Run it / Le lancer

No build step, no server code: it is plain HTML, CSS and JavaScript.

```bash
python -m http.server 8000
```

then open <http://localhost:8000/>. (Opening `index.html` directly also works, but the offline mode and the installable app need `http://localhost` or `https://`.)

Pour l'essayer : lance la commande ci-dessus dans ce dossier et ouvre <http://localhost:8000/>. Le mode hors ligne et l'installation demandent `http://localhost` ou `https://`.

### Put it online (GitHub Pages) / Mettre en ligne

1. Run `python tools/make_pwa.py` (it rebuilds `sw.js` and `audio-list.json`; do it after every change).
2. Push the folder to a **public** GitHub repository, then *Settings → Pages → Deploy from a branch → `main` / `(root)`*.
3. The app is then served at `https://<your-name>.github.io/<repository>/`. All paths are relative, so any repository name works.

## Folders / Dossiers

| Path | What / Quoi |
|---|---|
| `index.html` | the single page of the app / l'unique page |
| `js/`, `css/` | code and styles / code et styles |
| `data/` | words, sentences, lessons, stories, translations (`fr.js`) / mots, phrases, leçons, histoires, traductions |
| `audio/` | the sounds (one `.mp3` per word or sentence) / les sons |
| `icons/` | app icons / icônes |
| `tools/` | Python helpers: voices (`make_audio.py`), offline files (`make_pwa.py`), self-check (`check_app.py`) |
| `sw.js`, `manifest.webmanifest`, `audio-list.json` | offline mode and install (generated, do not edit) / mode hors ligne et installation (générés) |
| `LISEZMOI.md` | detailed notes for the author, in French / notes détaillées pour l'auteur |

Open `index.html?check=1` to run the built-in self-check (it opens every page and mode and reports problems).

## Licences

| What | Licence |
|---|---|
| Source code (`index.html`, `js/`, `css/`, `tools/`, …) | **MIT**: see [`LICENSE`](LICENSE) |
| Texts, data and drawings (`data/`, `icons/`, the SVG drawings in `js/`) | **CC BY-SA 4.0**: credit "Thibaud Derville, Elliniká" and share changes under the same licence |
| Sounds (`audio/`) | **All rights reserved**: made with a synthetic voice, kept only so that the app can speak. Please do not copy or re-use them. |

Some content comes from Wikipedia (CC BY-SA 4.0) and Greek Wikisource (public domain or CC BY-SA). The fonts Commissioner and GFS Didot are under the SIL Open Font Licence and are loaded from Google Fonts. Details in [`LICENCES.md`](LICENCES.md).

## Privacy / Vie privée

There is no account, no advertising and no tracking. Your progress stays **in your browser** (you can export it or move it with a code). The only outside requests are the fonts from Google Fonts and, if you tap them, links to Wikipedia or YouTube.
Pas de compte, pas de publicité, pas de suivi. Ta progression reste **dans ton navigateur**. Les seules requêtes extérieures sont les polices de Google Fonts et, si tu les touches, les liens vers Wikipédia ou YouTube.

**Optional / Facultatif:** you can sign in with Google to keep a copy of your progress in a hidden folder of your own Google Drive and continue on another device (only that folder: the app cannot read your other files; nothing is loaded from Google before you tap the button). / Tu peux te connecter avec Google pour garder une copie de ta progression dans un dossier caché de ton propre Google Drive (uniquement ce dossier ; rien n'est chargé depuis Google avant que tu touches le bouton).

## Contact

Found a mistake or a bug? Use the **Report a mistake** links in the app (under each quiz answer and at the foot of the home page), or open an *Issue* in this repository.
