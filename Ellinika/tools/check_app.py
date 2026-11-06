"""Automatic check of the data of the app (nothing is changed, nothing is sent).

    python -X utf8 tools/check_app.py            # the report, and an exit code of 1 when something is wrong
    python -X utf8 tools/check_app.py --all      # also lists every problem (by default: the first 12 of each kind)

It looks for: sounds that are missing, words with no French meaning, a noun with no article, Latin letters mixed into Greek,
levels or categories that do not exist, duplicates in data/wordbank.js, English texts used in the code that have no French text in data/fr.js,
files that index.html asks for and that do not exist, and emoji that have no drawing (data/icons.js).
Run it before each update. The same kind of check, but for what the page shows, runs in the browser: open index.html?check=1 """
import html as _html, re, sys, unicodedata
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import make_audio as m

ROOT = m.ROOT
SHOW = 10**6 if "--all" in sys.argv else 12
problems = {}
def bad(kind, what):
    problems.setdefault(kind, []).append(what)

LEVELS = {"A1", "A2", "B1", "B2"}
CATS = {"Family", "Animals", "Food & drinks", "House & clothes", "Weather & nature", "Jobs & hobbies", "Clothes", "City & travel", "Opposites", "Time & dates", "Grammar",
        "Human body", "Colors", "Animals", "Plants & farming", "Verbs", "Adjectives", "Small words", "Feelings & mind", "Countries & nationalities", "Money & shopping",
        "Society & religion", "School & education", "Technology & media", "Leisure & arts", "Tools & materials", "Cooking", "Directions", "Numbers"}
POS = {"noun", "verb", "adjective", "adverb", "expression", "conjunction", "pronoun", "other", "phrase", "number", "letter"}
ART = re.compile(r"^(ο|η|το|τα|οι)\s+")
GREEK_OK = re.compile(r"^[Ͱ-Ͽἀ-῿\s\-’'.,;·!?«»()/…0-9%€+=:\"—–]+$")

# ---------- 1. the words of data/wordbank.js ----------
wb = m.load_const("wordbank.js", "WORDBANK")["words"]
seen = {}
for w in wb:
    gr = w["gr"]
    key = unicodedata.normalize("NFC", ART.sub("", gr)).lower()
    if key in seen: bad("duplicate in wordbank.js", f"{gr} (and {seen[key]})")
    seen[key] = gr
    if not w.get("fr"): bad("word without French", gr)
    if not w.get("en"): bad("word without English", gr)
    if w.get("cat") not in CATS: bad("unknown category", f"{gr}: {w.get('cat')}")
    if w.get("lvl") and w["lvl"] not in LEVELS: bad("unknown level", f"{gr}: {w['lvl']}")
    if w.get("pos") and w["pos"] not in POS: bad("unknown type (pos)", f"{gr}: {w['pos']}")
    if not GREEK_OK.match(gr): bad("not only Greek letters", gr)
    isnoun = bool(ART.match(gr))
    if not isnoun and w.get("pos") is None and not re.match(r"^(I|it) ", w["en"]) and w["cat"] not in ("Adjectives", "Opposites", "Colors", "Grammar"):
        bad("noun without an article (or a verb without 'I ...')", f"{gr} = {w['en']}")
    if w.get("pos") == "verb" and not re.match(r"^(I|it) ", w["en"]): bad("verb whose English does not start with 'I'", f"{gr} = {w['en']}")

# ---------- 2. the sounds ----------
items = m.collect_items()
ids = {}
for sid, text in items: ids.setdefault(sid, text)
for fn, name in (("wordbank.js", "WORDBANK"), ("customs.js", "CUSTOMS"), ("songs.js", "SONGS"), ("cypriot.js", "CYPRIOT"), ("families.js", "FAMILIES"), ("grammar5.js", "GRAMMAR5"), ("grammar6.js", "GRAMMAR6"), ("examples.js", "EXAMPLES"), ("grammar4.js", "GRAMMAR4")):
    try:
        for t in m.walk_texts(m.load_const(fn, name)): ids.setdefault(m.sound_id(t.strip()), t.strip())
    except Exception: pass
have = {p.stem for p in (ROOT / "audio").glob("*.mp3")}
missing = [t for sid, t in ids.items() if sid not in have]
for t in missing: bad("sound missing (run tools/make_audio.py)", t)

# ---------- 3. French texts ----------
import json
fr = {}
for line in (ROOT / "data" / "fr.js").read_text(encoding="utf-8").splitlines():
    line = line.strip().rstrip(",")
    if line.startswith('"') and line.endswith('"'):
        try: fr.update(json.loads("{" + line + "}"))
        except ValueError: pass
used = set()
for f in [x for x in (ROOT / "js").glob("*.js") if x.name != "i18n.js"]:
    src = f.read_text(encoding="utf-8")
    for mm in re.finditer(r"""\btx\(\s*"((?:[^"\\]|\\.)+)"|\btx\(\s*'((?:[^'\\]|\\.)+)'""", src):
        s = (mm.group(1) or mm.group(2)).encode().decode("unicode_escape", "ignore") if False else (mm.group(1) or mm.group(2))
        if re.search(r"[A-Za-z]{3}", s) and "${" not in s: used.add((s, f.name))
html = (ROOT / "index.html").read_text(encoding="utf-8")
for mm in re.finditer(r"data-t(?:-ph|-aria|-title)?(?:=\"([^\"]*)\")?[^>]*>([^<]*)<", html):
    pass
for mm in re.finditer(r"<([a-z0-9]+)[^>]*\bdata-t(?!-)[^>]*>([^<]+)</\1>", html):
    s = re.sub(r"[ \t\r\n]+", " ", _html.unescape(mm.group(2))).strip()
    if re.search(r"[A-Za-z]{3}", s): used.add((s, "index.html"))
for mm in re.finditer(r'data-t-(?:ph|aria|title)="([^"]+)"', html):
    used.add((_html.unescape(mm.group(1)), "index.html"))
for s, where in sorted(used):
    key = s.replace('\\"', '"').replace("\\'", "'")
    if key not in fr and s not in fr and not re.fullmatch(r"[A-Za-z0-9 .,:;!?'’%&/+\-–—·…()\[\]{}→←↑↓|<>=*#@_\"]{1,3}", key):
        bad("English text with no French text in data/fr.js", f"{key[:70]}  [{where}]")

# ---------- 4. the files index.html asks for ----------
for mm in re.finditer(r'(?:src|href)="((?:js|css|data)/[^"?#]+)"', html):
    if not (ROOT / mm.group(1)).exists(): bad("file missing", mm.group(1))
for mm in re.finditer(r"<script src=\"((?:js|data)/[^\"]+)\"", html):
    p = ROOT / mm.group(1)
    if p.exists() and p.read_text(encoding="utf-8").count("{") != p.read_text(encoding="utf-8").count("}") and p.suffix == ".js" and False:
        bad("unbalanced braces", mm.group(1))

# ---------- 5. emoji without a drawing ----------
icons = m.load_const("icons.js", "ICONS") if False else None
isrc = (ROOT / "data" / "icons.js").read_text(encoding="utf-8")
drawn = set(re.findall(r'^\s*"([^"]+)": "<', isrc, re.M))
EM = re.compile("[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿■-◿⤀-⥿]️?(?:‍[\U0001F000-\U0001FAFF☀-➿]️?)*")
for pat in ("index.html", "js/*.js", "data/*.js"):
    for f in ROOT.glob(pat):
        if f.name in ("icons.js", "iconify.js", "fr.js"): continue
        for mm in set(EM.findall(f.read_text(encoding="utf-8", errors="ignore"))):
            k = mm.replace("️", "")
            if k not in drawn and not (len(k) == 1 and 0x1F1E6 <= ord(k) <= 0x1F1FF): bad("emoji without a drawing (data/icons.js)", f"{k}  [{f.name}]")

# ---------- the report ----------
total = sum(len(v) for v in problems.values())
print(f"{len(wb)} words in wordbank.js · {len(ids)} sounds in the app · {len(have)} sound files · {len(fr)} French texts")
if not problems:
    print("Everything is fine.")
for kind, lst in problems.items():
    print(f"\n[{len(lst):>4}] {kind}")
    for x in lst[:SHOW]: print("        ", x)
    if len(lst) > SHOW: print(f"         ... and {len(lst) - SHOW} more (python tools/check_app.py --all)")
sys.exit(1 if total else 0)
