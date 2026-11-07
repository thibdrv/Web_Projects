"""Find job offers on several sites and keep the ones that fit in results/jobs.xlsx.

The settings come from settings.json, edited in the app window (python app.py).
jobs.xlsx holds every offer kept so far, newest first, with its category, details and link,
plus a Statut column for your own notes. Offers already looked at are never added twice.

Run it from the app, or: python retrieve_jobs.py [--open]
"""
import argparse
import csv
import re
import sys
import threading
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill

import settings as app_settings
from experience import JUNIOR_WORDS, requires_language, years_required
from sources import BROWSE_SOURCES, REMOTE_SOURCES, SOURCES
from sources.common import Job, Settings, canonical_url, has_word, new_session, page_text

HERE = Path(__file__).resolve().parent
RESULTS = HERE / "results"
EXCEL_FILE = RESULTS / "jobs.xlsx"
CHECKED_FILE = HERE / ".cache" / "checked_links.txt"  # every offer already looked at, kept or not
COLUMNS = [("Trouvée le", 12), ("Catégorie", 24), ("Titre", 55), ("Entreprise", 30), ("Ville", 22),
           ("Publiée", 14), ("Expérience", 14), ("Site", 13), ("Lien", 60), ("Statut", 18)]
NEW_OFFER_FILL = PatternFill("solid", start_color="FFFF00")  # yellow


def main() -> int:
    parser = argparse.ArgumentParser(description="Find job offers on several job sites.")
    parser.add_argument("--open", action="store_true", help="open jobs.xlsx when done")
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

    config = app_settings.load()
    settings = Settings(
        max_pages=max(1, int(config["max_pages"])),
        max_age_days=int(config["max_age_days"]),
        remote_locations=config["remote_locations"],
        careerfinders_categories=[(name, app_settings.CAREERFINDERS_CATEGORIES[name])
                                  for name in config["careerfinders_categories"]
                                  if name in app_settings.CAREERFINDERS_CATEGORIES],
    )
    categories = {cat["name"]: cat["title_words"] for cat in config["categories"] if cat["name"].strip()}
    searches = list(dict.fromkeys(s for cat in config["categories"] for s in cat["searches"] if s.strip()))
    excluded = config["seniority_words"] + config["exclude_words"]
    enabled = [name for name, on in config["sources"].items() if on and (name in SOURCES or name in BROWSE_SOURCES)]
    if not searches or not enabled:
        print("Rien à chercher : ajoute au moins un type de poste avec une recherche, et coche au moins un site.")
        return 1
    if _is_open_elsewhere(EXCEL_FILE):
        print(f"Ferme {EXCEL_FILE.name} dans Excel, puis relance la recherche.")
        return 1

    old_rows, expired = _drop_expired(_read_excel(), int(config["keep_found_days"]))
    seen = _checked_links() | {canonical_url(row["Lien"]) for row in old_rows if row.get("Lien")}
    seen |= _job_agent_links(config["job_agent_folder"])
    candidates: list[Job] = []
    failed: list[str] = []

    print(f"1. Recherche des offres sur {len(enabled)} sites en même temps\n")
    with ThreadPoolExecutor(max_workers=len(enabled)) as pool:
        futures = {pool.submit(_search_site, name, searches, settings): name for name in enabled}
        for future in as_completed(futures):
            name = futures[future]
            found_count = kept = 0
            for search, found in future.result():
                if isinstance(found, Exception):  # one broken site or search must not stop the others
                    failed.append(f"{name} / {search}")
                    continue
                found_count += len(found)
                for job in found:
                    job.url = canonical_url(job.url)
                    job.category = _category(job.title, categories)
                    if name in BROWSE_SOURCES:
                        job.category = job.category or job.search  # else the site's own category, e.g. "Forex"
                    else:
                        job.search = search
                    if (job.url in seen or not job.category
                            or any(_has_whole_word(job.title, word) for word in excluded)
                            or _too_old(job.posted, settings.max_age_days)
                            or (name not in REMOTE_SOURCES and not _in_area(job.location, config["cities"]))):
                        continue
                    seen.add(job.url)
                    candidates.append(job)
                    kept += 1
            _say(f"  => {name} terminé : {found_count} offres lues, {kept} nouvelles qui correspondent")

    max_years = int(config["max_experience_years"])
    languages = [lang for lang in config["excluded_languages"] if lang.strip()]
    print(f"\n2. Lecture des offres : expérience demandée ({max_years} ans maximum)"
          + (f" et langues exigées ({', '.join(languages)})" if languages else "")
          + f", pour {len(candidates)} offre(s)\n")
    by_site: dict[str, list[Job]] = {}
    for job in candidates:
        by_site.setdefault(job.source, []).append(job)
    progress = _Progress(len(candidates))
    with ThreadPoolExecutor(max_workers=max(1, len(by_site))) as pool:
        results = [result for site_results in pool.map(
            lambda jobs: _read_offers(jobs, max_years, languages, progress), by_site.values())
            for result in site_results]
    kept_jobs = [job for job, reason in results if not reason]
    kept_jobs.sort(key=candidates.index)  # back in the order they were found
    rejected = Counter(reason for _, reason in results if reason)
    checked = [job.url for job, _ in results if job.experience != "page non lue"]  # failed pages: retried next time
    print(f"  {len(kept_jobs)} gardées, {rejected['expérience']} écartées pour l'expérience, "
          f"{rejected['langue']} pour la langue")

    try:
        _write_excel(kept_jobs, old_rows)
    except PermissionError:
        print(f"\nRien n'a été enregistré : {EXCEL_FILE.name} a été ouvert pendant la recherche. "
              "Ferme-le et relance.")
        return 1
    CHECKED_FILE.parent.mkdir(exist_ok=True)
    with CHECKED_FILE.open("a", encoding="utf-8") as f:
        f.writelines(f"{url}\n" for url in checked)

    print(f"\n{len(kept_jobs)} nouvelle(s) offre(s) ajoutée(s) dans {EXCEL_FILE}")
    for category, count in Counter(job.category for job in kept_jobs).most_common():
        print(f"  {category} : {count}")
    if expired:
        print(f"{expired} offre(s) trouvée(s) il y a plus de {config['keep_found_days']} jours retirée(s) du fichier")
    if failed:
        print(f"{len(failed)} recherche(s) en erreur : {', '.join(failed)}")
    if args.open and EXCEL_FILE.exists():
        app_settings.open_file(EXCEL_FILE)
    return 0


_print_lock = threading.Lock()


def _say(text: str) -> None:
    """print() that several sites can use at once without mixing their lines."""
    with _print_lock:
        print(text)


def _search_site(name: str, searches: list[str], settings: Settings) -> list[tuple[str, list[Job] | Exception]]:
    """Every search on one site, one after the other, with its own connection (sites run side by side)."""
    session = new_session()
    results = []
    for search in (["toutes ses offres"] if name in BROWSE_SOURCES else searches):
        try:
            found = (BROWSE_SOURCES[name](session, settings) if name in BROWSE_SOURCES
                     else SOURCES[name](session, search, settings))
            _say(f"  {name} / {search} : {len(found)} offres")
        except Exception as exc:
            found = exc
            _say(f"  {name} / {search} : erreur, ignoré ({exc})")
        results.append((search, found))
    return results


class _Progress:
    """Counts the offers read across all sites and says so every 10."""

    def __init__(self, total: int):
        self.total = total
        self.done = 0

    def step(self) -> None:
        with _print_lock:
            self.done += 1
            if self.done % 10 == 0 or self.done == self.total:
                print(f"  {self.done}/{self.total} lues")


def _read_offers(jobs: list[Job], max_years: int, languages: list[str], progress: _Progress) -> list[tuple[Job, str]]:
    """Reads one site's offers, one after the other."""
    session = new_session()
    results = []
    for job in jobs:
        results.append((job, _rejection(session, job, max_years, languages)))
        progress.step()
    return results


def _drop_expired(rows: list[dict], keep_days: int) -> tuple[list[dict], int]:
    """Removes offers found more than keep_days ago, except those you wrote a Statut for."""
    if not keep_days:
        return rows, 0
    kept = []
    for row in rows:
        try:
            age = (date.today() - date.fromisoformat(row.get("Trouvée le", "")[:10])).days
        except ValueError:
            age = 0  # unreadable date: keep it
        if age <= keep_days or row.get("Statut", "").strip():
            kept.append(row)
    return kept, len(rows) - len(kept)


def _rejection(session, job: Job, max_years: int, languages: list[str]) -> str:
    """Reads the posting: "langue" or "expérience" when it asks too much, "" when it is kept."""
    if not job.description:
        try:
            job.description = page_text(session, job.url)
        except Exception:
            job.experience = "page non lue"
            return ""  # kept so you can judge it yourself
    if any(requires_language(job.title, job.description, language) for language in languages):
        return "langue"
    if any(_has_whole_word(job.title, word) for word in JUNIOR_WORDS):
        job.experience = "junior"
        return ""
    years = years_required(job.description)
    job.experience = "non précisé" if years is None else f"{years}+ ans"
    return "expérience" if years is not None and years > max_years else ""


def _category(title: str, categories: dict[str, list[str]]) -> str:
    """The first category with a word in the title, or "" when none fits."""
    return next((name for name, words in categories.items()
                 if any(has_word(title, word) for word in words)), "")


def _has_whole_word(text: str, word: str) -> bool:
    return re.search(rf"\b{re.escape(word)}\b", text, re.IGNORECASE) is not None


def _in_area(location: str, cities: list[str]) -> bool:
    """True for offers in one of the cities, or that only say "Cyprus" (the city could be one of them)."""
    if not cities or any(has_word(location, city) for city in cities):
        return True
    rest = re.sub(r"(?i)\b(republic of|cyprus|remote|hybrid)\b", "", location)
    return not re.sub(r"[\W_]+", "", rest)


def _too_old(posted: str, max_age_days: int) -> bool:
    age = _age_in_days(posted)
    return bool(max_age_days and age is not None and age > max_age_days)


def _age_in_days(posted: str) -> int | None:
    """Days since posting, from "2026-10-20" or "2 weeks ago"; None when unknown."""
    posted = posted.lower()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", posted):
        return (date.today() - date.fromisoformat(posted)).days
    if "today" in posted or "hour" in posted or "minute" in posted:
        return 0
    if "yesterday" in posted:
        return 1
    match = re.search(r"(\d+)\s*(day|week|month|year)", posted)
    if match:
        return int(match.group(1)) * {"day": 1, "week": 7, "month": 30, "year": 365}[match.group(2)]
    if re.search(r"\b(a|one)\s+month", posted):
        return 30
    return None


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
    if not EXCEL_FILE.exists():
        return []
    sheet = load_workbook(EXCEL_FILE).active
    rows = sheet.iter_rows(values_only=True)
    headers = [str(h) if h is not None else "" for h in next(rows, [])]
    if "Lien" not in headers:  # a file from an older version of the app: it gets replaced
        return []
    return [{h: ("" if v is None else str(v)) for h, v in zip(headers, row)}
            for row in rows if any(v is not None for v in row)]


def _write_excel(new_jobs: list[Job], old_rows: list[dict]) -> None:
    today = date.today().isoformat()
    new_rows = [{"Trouvée le": today, "Catégorie": job.category, "Titre": job.title, "Entreprise": job.company,
                 "Ville": job.location, "Publiée": job.posted, "Expérience": job.experience,
                 "Site": job.source, "Lien": job.url, "Statut": ""} for job in new_jobs]

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Offres"
    sheet.append([header for header, _ in COLUMNS])
    for cell, (_, width) in zip(sheet[1], COLUMNS):
        cell.font = Font(bold=True)
        sheet.column_dimensions[cell.column_letter].width = width
    link_column = [header for header, _ in COLUMNS].index("Lien") + 1
    for number, row in enumerate(new_rows + old_rows):
        sheet.append([row.get(header, "") for header, _ in COLUMNS])
        if row.get("Lien"):
            link = sheet.cell(row=sheet.max_row, column=link_column)
            link.hyperlink = row["Lien"]
            link.style = "Hyperlink"
        if number < len(new_rows):  # this run's offers stand out; older ones lose the highlight
            for cell in sheet[sheet.max_row]:
                cell.fill = NEW_OFFER_FILL
    sheet.freeze_panes = "A2"
    sheet.auto_filter.ref = sheet.dimensions
    RESULTS.mkdir(exist_ok=True)
    workbook.save(EXCEL_FILE)


if __name__ == "__main__":
    sys.exit(main())
