"""Find job offers on several sites and keep the ones that fit in results/jobs.xlsx.

The settings come from settings.json, edited in the app window (python app.py).
jobs.xlsx holds every offer kept so far, newest first, with its category, details and link,
plus a Statut column for your own notes. Offers already looked at are never added twice.

Run it from the app, or: python retrieve_jobs.py [--open]
"""
import argparse
import csv
import sys
import threading
from collections import Counter
from pathlib import Path

import settings as app_settings
from engine import run_search
from excel_io import build_workbook, drop_expired, job_to_row, read_rows, save_workbook
from sources.common import canonical_url

HERE = Path(__file__).resolve().parent
RESULTS = HERE / "results"
EXCEL_FILE = RESULTS / "jobs.xlsx"
CHECKED_FILE = HERE / ".cache" / "checked_links.txt"  # every offer already looked at, kept or not

_print_lock = threading.Lock()


def _say(text: str) -> None:
    with _print_lock:
        print(text)


def main() -> int:
    parser = argparse.ArgumentParser(description="Find job offers on several job sites.")
    parser.add_argument("--open", action="store_true", help="open jobs.xlsx when done")
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

    config = app_settings.load()
    if _is_open_elsewhere(EXCEL_FILE):
        print(f"Ferme {EXCEL_FILE.name} dans Excel, puis relance la recherche.")
        return 1

    old_rows, expired = drop_expired(_read_excel(), int(config["keep_found_days"]))
    known = _checked_links() | {canonical_url(row["Lien"]) for row in old_rows if row.get("Lien")}
    known |= _job_agent_links(config["job_agent_folder"])
    try:
        result = run_search(config, known, log=_say)
    except ValueError as exc:
        print(exc)
        return 1

    new_rows = [dict(job_to_row(job), _new=True) for job in result.jobs]
    try:
        save_workbook(build_workbook(new_rows + old_rows), EXCEL_FILE)
    except PermissionError:
        print(f"\nRien n'a été enregistré : {EXCEL_FILE.name} a été ouvert pendant la recherche. "
              "Ferme-le et relance.")
        return 1
    CHECKED_FILE.parent.mkdir(exist_ok=True)
    with CHECKED_FILE.open("a", encoding="utf-8") as f:
        f.writelines(f"{url}\n" for url in result.checked)

    print(f"\n{len(result.jobs)} nouvelle(s) offre(s) ajoutée(s) dans {EXCEL_FILE}")
    for category, count in Counter(job.category for job in result.jobs).most_common():
        print(f"  {category} : {count}")
    if expired:
        print(f"{expired} offre(s) trouvée(s) il y a plus de {config['keep_found_days']} jours retirée(s) du fichier")
    if result.failed:
        print(f"{len(result.failed)} recherche(s) en erreur : {', '.join(result.failed)}")
    if args.open and EXCEL_FILE.exists():
        app_settings.open_file(EXCEL_FILE)
    return 0


def _is_open_elsewhere(path: Path) -> bool:
    """True when another program (Excel) keeps the file locked, so saving would fail."""
    try:
        if path.exists():
            path.open("a").close()
        return False
    except PermissionError:
        return True


def _checked_links() -> set[str]:
    if not CHECKED_FILE.exists():
        return set()
    return {line.strip() for line in CHECKED_FILE.read_text(encoding="utf-8").splitlines() if line.strip()}


def _job_agent_links(job_agent_folder: str) -> set[str]:
    """Offers already in Job Application Agent's tracker."""
    tracker = (HERE / job_agent_folder / "applications" / "tracker.csv").resolve() if job_agent_folder else None
    if not tracker or not tracker.exists():
        return set()
    with tracker.open(encoding="utf-8-sig", newline="") as f:
        return {canonical_url(row["url"]) for row in csv.DictReader(f) if row.get("url")}


def _read_excel() -> list[dict]:
    """The offers already in jobs.xlsx, in the order they are now (you may have sorted them)."""
    return read_rows(EXCEL_FILE) if EXCEL_FILE.exists() else []


if __name__ == "__main__":
    sys.exit(main())
