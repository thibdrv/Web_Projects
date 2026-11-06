#!/usr/bin/env python3
"""Generate one MP3 per word / phrase / letter name with the Greek voice Athina.

Usage (from the greek-app folder):
    python tools/make_audio.py --dry-run     # list what would be made, nothing is sent
    python tools/make_audio.py --limit 1     # make a single file as a test
    python tools/make_audio.py               # make every missing file
    python tools/make_audio.py --force       # redo everything, even existing files

Two engines, same voice:
    --engine edge    (default) no account, no key. Needs:  python -m pip install edge-tts
                     --workers N makes N files at the same time (default 3; use 1 if
                     the service keeps refusing words).
    --engine azure   official Azure Speech service. Needs a key: it is read from the
                     AZURE_SPEECH_KEY and AZURE_SPEECH_REGION environment variables,
                     or typed when the script asks. It is never written to disk.

Where the sounds come from (the three files in data/):
    greek-data.js   letters: every word/phrase and every letter name
    colors.js       every "gr" text
    grammar.js      every "gr" text and every text in a "forms" list
    numbers.js      every "gr" text
    family.js       every "gr" text
    food.js         every "gr" text
    body.js         every "gr" text
    time.js         every "gr" text
    phrases.js      every "gr" text (the "alt" spellings are only for checking answers)
    house.js, city.js, directions.js, nature.js, jobs.js, opposites.js, dialogues.js, stories.js, poems.js, talk.js, holidays.js, clock.js, money.js   every "gr" text
    grammar2.js, grammar3.js     the texts in the fields sg, pl, m, f, n, nom, acc, pos, neg, say, sentence, gr
The sound file is audio/<id>.mp3. The id is the "a" field when an entry has one
(the first words of the app), otherwise a short fingerprint of the Greek text
(sound_id below; js/audio.js computes the very same one).
"""
import argparse
import asyncio
import getpass
import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
AUDIO_DIR = ROOT / "audio"

VOICE = "el-GR-AthinaNeural"
RATE = "-10%"  # a bit slower than normal speech, easier for a learner
OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3"


def load_const(filename, name):
    """Read `const NAME = {...};` from a data file and return it as a Python dict."""
    src = (DATA_DIR / filename).read_text(encoding="utf-8")
    start = src.index("{", src.index(f"const {name}"))
    return json.loads(src[start:src.rindex("}") + 1])


def sound_id(text):
    """Short fingerprint of a Greek text (FNV-1a, 32 bits), ignoring the ";" question mark. Same as sid() in js/audio.js."""
    h = 0x811C9DC5
    for b in text.replace(";", "").strip().encode("utf-8"):
        h = ((h ^ b) * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


# fields whose Greek text gets a recording (the other fields, like "bad" or "blank", are only shown on screen)
VOICED_KEYS = {"gr", "sg", "pl", "m", "f", "n", "nom", "acc", "gen", "pos", "neg", "say", "sentence"}


def walk_texts(node):
    """Every voiced text (see VOICED_KEYS) and every text inside a "forms" entry, in a data file."""
    if isinstance(node, dict):
        for key, value in node.items():
            if key in VOICED_KEYS and isinstance(value, str):
                yield value
            elif key == "forms":
                yield from all_strings(value)
            else:
                yield from walk_texts(value)
    elif isinstance(node, list):
        for item in node:
            yield from walk_texts(item)


def all_strings(node):
    if isinstance(node, str):
        yield node
    elif isinstance(node, dict):
        for v in node.values():
            yield from all_strings(v)
    elif isinstance(node, list):
        for v in node:
            yield from all_strings(v)


def collect_items():
    """Return [(id, spoken text)] for every sound the app can play."""
    items = []
    letters = load_const("greek-data.js", "DATA")
    for level in letters["levels"]:
        for w in level["words"]:
            text = w["gr"].replace(";", "").strip()
            items.append((w.get("a") or sound_id(text), text))
    for a in letters["alpha"]:
        items.append((a.get("a") or sound_id(a["name"]), a["name"]))
    for filename, name in (("colors.js", "COLORS"), ("grammar.js", "GRAMMAR"), ("numbers.js", "NUMBERS"), ("family.js", "FAMILY"), ("food.js", "FOOD"), ("body.js", "BODY"), ("time.js", "TIME"), ("phrases.js", "PHRASES"), ("grammar2.js", "GRAMMAR2"), ("grammar3.js", "GRAMMAR3"),
                           ("house.js", "HOUSE"), ("city.js", "CITY"), ("directions.js", "DIRECTIONS"), ("nature.js", "NATURE"), ("jobs.js", "JOBS"), ("opposites.js", "OPPOSITES"), ("dialogues.js", "DIALOGUES"), ("stories.js", "STORIES"), ("poems.js", "POEMS"), ("talk.js", "TALK"), ("holidays.js", "HOLIDAYS"), ("clock.js", "CLOCK"), ("money.js", "MONEY"), ("sounds.js", "SOUNDS"), ("geo.js", "GEO"), ("greetings.js", "GREETINGS"), ("texts.js", "TEXTS"), ("clothes.js", "CLOTHES"), ("cypriot.js", "CYPRIOT"), ("families.js", "FAMILIES"), ("grammar5.js", "GRAMMAR5"), ("grammar6.js", "GRAMMAR6"), ("examples.js", "EXAMPLES"), ("cooking.js", "COOKING"), ("recipes.js", "RECIPES"), ("wordbank.js", "WORDBANK"), ("scenes.js", "SCENE_WORDS"), ("grammar4.js", "GRAMMAR4"), ("verbs2.js", "VERBS2"), ("readings.js", "READINGS"), ("customs.js", "CUSTOMS"), ("songs.js", "SONGS")):
        for text in walk_texts(load_const(filename, name)):
            text = text.strip()
            items.append((sound_id(text), text))
    return items


def synthesize(text, key, region):
    ssml = (
        f"<speak version='1.0' xml:lang='el-GR'>"
        f"<voice xml:lang='el-GR' name='{VOICE}'>"
        f"<prosody rate='{RATE}'>{escape(text)}</prosody></voice></speak>"
    )
    req = urllib.request.Request(
        f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1",
        data=ssml.encode("utf-8"),
        headers={
            "Ocp-Apim-Subscription-Key": key,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": OUTPUT_FORMAT,
            "User-Agent": "greek-letters-app",
        },
    )
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 5:  # free tier: only ~20 requests a minute
                wait = int(e.headers.get("Retry-After") or 15)
                print(f"   too many requests, waiting {wait}s...")
                time.sleep(wait)
                continue
            if e.code in (401, 403):
                sys.exit("Azure refused the key. Check the key and the region (see LISEZMOI.md).")
            sys.exit(f"Azure error {e.code}: {e.read().decode('utf-8', 'replace')[:300]}")
        except urllib.error.URLError as e:
            if attempt < 5:
                time.sleep(3)
                continue
            sys.exit(f"Cannot reach Azure (is the region right? is there internet?): {e.reason}")


def synthesize_edge(text):
    """Return the MP3 bytes, or None if the service will not make it right now."""
    try:
        import edge_tts
    except ImportError:
        sys.exit("edge-tts is missing. Install it with:  python -m pip install edge-tts")

    async def run(rate):
        out = bytearray()
        async for chunk in edge_tts.Communicate(text, VOICE, rate=rate).stream():
            if chunk["type"] == "audio":
                out += chunk["data"]
        return bytes(out)

    # the service sometimes refuses a word at one speed and accepts it at a nearby one
    for attempt, rate in enumerate([RATE, "-5%", "+0%", "-15%", RATE, "+0%"]):
        try:
            audio = asyncio.run(asyncio.wait_for(run(rate), 25))   # a stuck connection must not freeze the whole run
            if audio:
                return audio
        except Exception:
            pass
        time.sleep(2 + attempt)
    return None


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--engine", choices=["edge", "azure"], default="edge", help="edge (default, no key) or azure")
    ap.add_argument("--workers", type=int, default=3, help="files made at the same time with edge (default 3)")
    ap.add_argument("--dry-run", action="store_true", help="only list what would be made")
    ap.add_argument("--force", action="store_true", help="remake files that already exist")
    ap.add_argument("--limit", type=int, help="make at most N files (use 1 to test)")
    args = ap.parse_args()

    items = collect_items()

    # two different texts must never share a file name
    owner = {}
    for sid, text in items:
        if owner.setdefault(sid, text).replace(";", "") != text.replace(";", ""):
            sys.exit(f"Two texts share the sound name {sid}: '{owner[sid]}' and '{text}'. Change one of them.")

    todo = []
    for sid, text in owner.items():
        path = AUDIO_DIR / f"{sid}.mp3"
        if path.exists() and path.stat().st_size > 0 and not args.force:
            continue
        todo.append((sid, text))
    if args.limit:
        todo = todo[:args.limit]

    print(f"{len(owner)} sounds in the app, {len(todo)} to make "
          f"({sum(len(t) for _, t in todo)} characters).")
    if args.dry_run or not todo:
        for sid, text in todo:
            print(f"  {sid}.mp3  <-  {text}")
        return

    if args.engine == "azure":
        key = os.environ.get("AZURE_SPEECH_KEY") or getpass.getpass("Azure Speech key (hidden while you type): ").strip()
        region = os.environ.get("AZURE_SPEECH_REGION") or input("Azure region (for example westeurope): ").strip()
        region = region.lower().replace(" ", "")
        make = lambda text: synthesize(text, key, region)
        workers = 1  # the free Azure tier only allows about 20 requests a minute
    else:
        make = synthesize_edge
        workers = max(1, args.workers)

    AUDIO_DIR.mkdir(exist_ok=True)
    failed = []
    with ThreadPoolExecutor(max_workers=workers) as pool:
        jobs = {pool.submit(make, text): (sid, text) for sid, text in todo}
        for n, job in enumerate(as_completed(jobs), 1):
            sid, text = jobs[job]
            audio = job.result()
            if not audio:
                failed.append(text)
                print(f"[{n}/{len(todo)}] {sid}.mp3  <-  {text}   FAILED, will be skipped")
                continue
            tmp = AUDIO_DIR / f"{sid}.mp3.part"
            tmp.write_bytes(audio)
            tmp.replace(AUDIO_DIR / f"{sid}.mp3")
            print(f"[{n}/{len(todo)}] {sid}.mp3  <-  {text}", flush=True)
    if failed:
        print(f"\n{len(failed)} sound(s) could not be made: {', '.join(failed)}")
        print("Run the script again in a few minutes: it only retries the missing ones.")
    else:
        print("Done. Open index.html and listen.")


if __name__ == "__main__":
    main()
