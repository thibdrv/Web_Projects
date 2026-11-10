"""The search itself, with no file and no window.

The command line (retrieve_jobs.py), the desktop window (app.py) and the web app (webapp.py) all use it:
they give it the settings and the links already seen, and it returns the new offers worth keeping.
"""
import re
import threading
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from datetime import date
from typing import Callable

import settings as app_settings
from experience import JUNIOR_WORDS, requires_language, years_required
from sources import BROWSE_SOURCES, REMOTE_SOURCES, SOURCES
from sources.common import Job, Settings, canonical_url, has_word, new_session, page_text


class Cancelled(Exception):
    """The search was stopped before the end."""


@dataclass
class SearchResult:
    jobs: list[Job]  # the new offers that fit, in the order they were found
    checked: list[str]  # every offer read this time (kept or not): not to be read again
    failed: list[str] = field(default_factory=list)  # "site / search" that gave an error
    rejected: Counter = field(default_factory=Counter)  # "expérience" / "langue" -> how many


def run_search(config: dict, known_links: set[str], log: Callable[[str], None] = print,
               cancel: threading.Event | None = None) -> SearchResult:
    """Looks for offers. known_links are the offers already seen (they are skipped).

    Raises ValueError when there is nothing to search and Cancelled when `cancel` is set."""
    cancel = cancel or threading.Event()
    lock = threading.Lock()

    def say(text: str) -> None:  # several sites talk at once: one line at a time
        with lock:
            log(text)

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
        raise ValueError("Rien à chercher : ajoute au moins un type de poste avec une recherche, "
                         "et coche au moins un site.")

    seen = {canonical_url(link) for link in known_links}
    candidates: list[Job] = []
    failed: list[str] = []

    say(f"1. Recherche des offres sur {len(enabled)} sites en même temps\n")
    with ThreadPoolExecutor(max_workers=len(enabled)) as pool:
        futures = {pool.submit(_search_site, name, searches, settings, say, cancel): name for name in enabled}
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
                    if not job.url.startswith(("http://", "https://")):
                        continue
                    job.category = category_of(job.title, categories)
                    if name in BROWSE_SOURCES:
                        job.category = job.category or job.search  # else the site's own category, e.g. "Forex"
                    else:
                        job.search = search
                    if (job.url in seen or not job.category
                            or any(has_whole_word(job.title, word) for word in excluded)
                            or too_old(job.posted, settings.max_age_days)
                            or (name not in REMOTE_SOURCES and not in_area(job.location, config["cities"]))):
                        continue
                    seen.add(job.url)
                    candidates.append(job)
                    kept += 1
            say(f"  => {name} terminé : {found_count} offres lues, {kept} nouvelles qui correspondent")
    if cancel.is_set():
        raise Cancelled

    max_years = int(config["max_experience_years"])
    languages = [lang for lang in config["excluded_languages"] if lang.strip()]
    say(f"\n2. Lecture des offres : expérience demandée ({max_years} ans maximum)"
        + (f" et langues exigées ({', '.join(languages)})" if languages else "")
        + f", pour {len(candidates)} offre(s)\n")
    by_site: dict[str, list[Job]] = {}
    for job in candidates:
        by_site.setdefault(job.source, []).append(job)
    progress = _Progress(len(candidates), say)
    with ThreadPoolExecutor(max_workers=max(1, len(by_site))) as pool:
        results = [result for site_results in pool.map(
            lambda jobs: _read_offers(jobs, max_years, languages, progress, cancel), by_site.values())
            for result in site_results]
    if cancel.is_set():
        raise Cancelled
    kept_jobs = [job for job, reason in results if not reason]
    kept_jobs.sort(key=candidates.index)  # back in the order they were found
    rejected = Counter(reason for _, reason in results if reason)
    checked = [job.url for job, _ in results if job.experience != "page non lue"]  # failed pages: retried next time
    say(f"  {len(kept_jobs)} gardées, {rejected['expérience']} écartées pour l'expérience, "
        f"{rejected['langue']} pour la langue")
    return SearchResult(kept_jobs, checked, failed, rejected)


def _search_site(name: str, searches: list[str], settings: Settings, say, cancel: threading.Event
                 ) -> list[tuple[str, list[Job] | Exception]]:
    """Every search on one site, one after the other, with its own connection (sites run side by side)."""
    session = new_session()
    results = []
    for search in (["toutes ses offres"] if name in BROWSE_SOURCES else searches):
        if cancel.is_set():
            break
        try:
            found = (BROWSE_SOURCES[name](session, settings) if name in BROWSE_SOURCES
                     else SOURCES[name](session, search, settings))
            say(f"  {name} / {search} : {len(found)} offres")
        except Exception as exc:
            found = exc
            say(f"  {name} / {search} : erreur, ignoré ({exc})")
        results.append((search, found))
    return results


class _Progress:
    """Counts the offers read across all sites and says so every 10."""

    def __init__(self, total: int, say):
        self.total = total
        self.done = 0
        self._say = say
        self._lock = threading.Lock()

    def step(self) -> None:
        with self._lock:
            self.done += 1
            report = self.done % 10 == 0 or self.done == self.total
            done = self.done
        if report:
            self._say(f"  {done}/{self.total} lues")


def _read_offers(jobs: list[Job], max_years: int, languages: list[str], progress: _Progress,
                 cancel: threading.Event) -> list[tuple[Job, str]]:
    """Reads one site's offers, one after the other."""
    session = new_session()
    results = []
    for job in jobs:
        if cancel.is_set():
            break
        results.append((job, _rejection(session, job, max_years, languages)))
        progress.step()
    return results


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
    if any(has_whole_word(job.title, word) for word in JUNIOR_WORDS):
        job.experience = "junior"
        return ""
    years = years_required(job.description)
    job.experience = "non précisé" if years is None else f"{years}+ ans"
    return "expérience" if years is not None and years > max_years else ""


def category_of(title: str, categories: dict[str, list[str]]) -> str:
    """The first category with a word in the title, or "" when none fits."""
    return next((name for name, words in categories.items()
                 if any(has_word(title, word) for word in words)), "")


def has_whole_word(text: str, word: str) -> bool:
    return re.search(rf"\b{re.escape(word)}\b", text, re.IGNORECASE) is not None


def in_area(location: str, cities: list[str]) -> bool:
    """True for offers in one of the cities, or that only say "Cyprus" (the city could be one of them)."""
    if not cities or any(has_word(location, city) for city in cities):
        return True
    rest = re.sub(r"(?i)\b(republic of|cyprus|remote|hybrid)\b", "", location)
    return not re.sub(r"[\W_]+", "", rest)


def too_old(posted: str, max_age_days: int) -> bool:
    age = age_in_days(posted)
    return bool(max_age_days and age is not None and age > max_age_days)


def age_in_days(posted: str) -> int | None:
    """Days since posting, from "2026-10-20" or "2 weeks ago"; None when unknown."""
    posted = posted.lower()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", posted):
        try:
            return (date.today() - date.fromisoformat(posted)).days
        except ValueError:
            return None
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
