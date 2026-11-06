#!/usr/bin/env python3
"""A live gauge of the voice files still to make. Leave it running in a terminal: it refreshes every few seconds.

    python tools/audio_gauge.py

It counts the sounds the app needs (the same list as tools/make_audio.py) and how many mp3 files already exist."""
import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import make_audio as m

def status():
    need = {i for i, _ in m.collect_items()}
    have = {p.stem for p in m.AUDIO_DIR.glob("*.mp3")}
    return len(need), len(need & have)

total, done = status()
start_done, t0 = done, time.time()
while True:
    total, done = status()
    left = total - done
    width = 40
    fill = int(width * done / total) if total else width
    rate = (done - start_done) / max((time.time() - t0) / 60, 0.01)
    eta = f"~{int(left / rate)} min" if rate > 0.5 and left else ("fini" if not left else "calcul…")
    line = f"[{'█' * fill}{'░' * (width - fill)}] {100 * done / total:5.1f} %  {done}/{total}  reste {left}  ({rate:.0f}/min, {eta})"
    print("\r" + line + "   ", end="", flush=True)
    if not left:
        print("\nTous les sons sont prêts.")
        break
    time.sleep(5)
