"""Job sites for Cyprus: ergodotisi.com, cyprusjobs.com, kariera.com.cy, cypruswork.com, fxcareer.eu,
careerfinders.com.cy and emeraldzebra.cy.

Their search is loose (a search for "data analyst" also returns finance jobs),
so the job-type title words in the settings do the real sorting.
"""
import html
import re
from datetime import datetime
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from .common import Job, Settings, clean, fetch


def ergodotisi(session, keyword: str, settings: Settings) -> list[Job]:
    jobs: list[Job] = []
    for page in range(1, settings.max_pages + 1):
        html = fetch(session, "https://ergodotisi.com/en-CY/jobs", {"q": keyword, "page": page})
        cards = BeautifulSoup(html, "html.parser").select("article.jobs-card")
        for card in cards:
            link = card.select_one("a[href*='/jobs/']")
            if not link:
                continue
            jobs.append(Job(
                source="Ergodotisi",
                title=clean(_text(card, ".jobs-card__title")),
                company=clean(_text(card, ".jobs-card__company")),
                location=card.get("data-analytics-location-value", ""),
                url=urljoin("https://ergodotisi.com", link["href"]),
            ))
        if not cards or not _has_page(html, page + 1):
            break
    return jobs


def cyprusjobs(session, keyword: str, settings: Settings) -> list[Job]:
    jobs: list[Job] = []
    for page in range(1, settings.max_pages + 1):
        html = fetch(session, "https://www.cyprusjobs.com/en/listing", {"keywords": keyword, "page": page})
        cards = BeautifulSoup(html, "html.parser").select("div.v2-job-card-row")
        for card in cards:
            link = card.select_one("a.v2-job-card-row__link")
            meta_box = card.select_one(".v2-job-card-row__meta")
            if not link or not meta_box:
                continue
            # company · location · "2 weeks ago"
            meta = [clean(span.get_text()) for span in meta_box.find_all("span", recursive=False)
                    if "v2-job-card-row__sep" not in (span.get("class") or [])]
            meta += [""] * 3
            jobs.append(Job(
                source="CyprusJobs",
                title=clean(_text(card, ".v2-job-card-row__title")),
                company=meta[0],
                location=meta[1],
                url=urljoin("https://www.cyprusjobs.com", link["href"]),
                posted=meta[2],
            ))
        if not cards or not _has_page(html, page + 1):
            break
    return jobs


def kariera(session, keyword: str, settings: Settings) -> list[Job]:
    # Kariera's search has no next page: it shows only the 5 newest matches.
    html = fetch(session, "https://kariera.com.cy/jobs/", {"s": keyword})
    jobs: list[Job] = []
    for card in BeautifulSoup(html, "html.parser").select("article.noo_job"):
        link = card.select_one("h2 a, h3 a, .loop-item-title a")
        if not link:
            continue
        jobs.append(Job(
            source="Kariera",
            title=clean(link.get_text()),
            company=clean(_text(card, ".job-company")),
            location=clean(_text(card, ".job-location")),
            url=urljoin("https://kariera.com.cy", link["href"]),
            posted=clean(_text(card, ".job-date-ago")),
        ))
    return jobs


def cypruswork(session, keyword: str, settings: Settings) -> list[Job]:
    jobs: list[Job] = []
    for page in range(1, settings.max_pages + 1):
        url = "https://www.cypruswork.com/jobs/" if page == 1 else f"https://www.cypruswork.com/jobs/page/{page}/"
        html = fetch(session, url, {"filter-title": keyword})
        cards = BeautifulSoup(html, "html.parser").select("article.job_listing")
        for card in cards:
            link = card.select_one("h2.job-title a")
            if not link:
                continue
            jobs.append(Job(
                source="CyprusWork",
                title=clean(link.get_text()),
                company=clean(_text(card, ".employer-title")),
                location=clean(_text(card, ".job-location")),
                url=urljoin("https://www.cypruswork.com", link["href"]),
                posted=_iso_date(clean(_text(card, ".job-deadline")), "%B %d, %Y"),  # e.g. "October 15, 2026"
            ))
        if not cards or f"/jobs/page/{page + 1}/" not in html:
            break
    return jobs


def fxcareer(session, keyword: str, settings: Settings) -> list[Job]:
    jobs: list[Job] = []
    for page in range(1, settings.max_pages + 1):
        html = fetch(session, "https://www.fxcareer.eu/forex-and-fintech-jobs/",
                     {"job_title": keyword, "paged": page})
        cards = BeautifulSoup(html, "html.parser").select("ul.jobs-listing > li")
        for card in cards:
            link = card.select_one(".job-title a")
            if not link:
                continue
            notes = card.select_one(".job-notes")
            posted = next((clean(div.get_text()) for div in notes.find_all("div")
                           if not div.find("div") and "Posted" in div.get_text()), "") if notes else ""
            jobs.append(Job(
                source="FxCareer",
                title=clean(link.get_text()),
                company=clean(_text(card, ".job-emp")).removeprefix("Employer:").strip(),
                location=clean(_text(card, ".location")),
                url=urljoin("https://www.fxcareer.eu", link["href"]),
                posted=posted.removeprefix("Posted").strip(),  # "15 minutes ago"
            ))
        if not cards or not _has_page(html, page + 1):
            break
    return jobs


def careerfinders(session, settings: Settings) -> list[Job]:
    """CareerFinders lists its offers by category, not by search: each chosen category is read in full."""
    jobs: list[Job] = []
    for name, code in settings.careerfinders_categories:
        for page in range(1, 11):
            html = fetch(session, "https://portal.careerfinders.com.cy/job-listing", {"category": code, "p": page})
            links = BeautifulSoup(html, "html.parser").select("div.jobresults a[href*='/job-details/']")
            for link in links:
                card = link.find_parent("div", class_="jobresults").parent
                # "Location: Limassol", "Date Posted: 02/11/2026"...
                fields = {label.get_text(strip=True).rstrip(":"): clean(label.next_sibling or "")
                          for label in card.find_all("b") if label.get_text(strip=True).endswith(":")}
                jobs.append(Job(
                    source="CareerFinders",
                    title=clean(link.get_text()),
                    company="CareerFinders (pour un client)",
                    location=fields.get("Location", ""),
                    url=urljoin("https://portal.careerfinders.com.cy", link["href"]),
                    posted=_iso_date(fields.get("Date Posted", ""), "%d/%m/%Y"),
                    search=name,
                ))
            if not links or f"p={page + 1}" not in html:
                break
    return jobs


def emeraldzebra(session, settings: Settings) -> list[Job]:
    """EmeraldZebra (fintech, tech, finance and iGaming recruiter): its whole list comes from its WordPress API."""
    api = "https://emeraldzebra.cy/wp-json/wp/v2"
    names = {}  # term id -> name, for locations and industries
    for taxonomy in ("job-location", "job-industry"):
        names.update({term["id"]: html.unescape(term["name"])
                      for term in fetch(session, f"{api}/{taxonomy}", {"per_page": 100}, as_json=True)})
    jobs: list[Job] = []
    for page in range(1, 11):
        items = fetch(session, f"{api}/jobs", {"per_page": 100, "page": page}, as_json=True)
        for item in items:
            # "Accounting Specialist, Larnaca, Cyprus-4449542" -> "Accounting Specialist"
            title = re.sub(r"-\d+$", "", html.unescape(item["title"]["rendered"]))
            title = re.sub(r"(,\s*[^,]+)?,\s*Cyprus$", "", title)
            places = [names.get(i, "") for i in item.get("job-location", [])]
            industries = [names.get(i, "") for i in item.get("job-industry", [])]
            jobs.append(Job(
                source="EmeraldZebra",
                title=clean(title),
                company="EmeraldZebra (pour un client)",
                location=", ".join(p.removeprefix("Jobs in ") for p in places if p and p != "Cyprus") or "Cyprus",
                url=item["link"],
                posted=item.get("date", "")[:10],
                search=(industries[0] if industries and industries[0] else "EmeraldZebra"),
                description=clean(BeautifulSoup(item["content"]["rendered"], "html.parser").get_text(" ")),
            ))
        if len(items) < 100:
            break
    return jobs


def _iso_date(text: str, pattern: str) -> str:
    try:
        return datetime.strptime(text, pattern).date().isoformat()
    except ValueError:
        return text


def _has_page(html: str, page: int) -> bool:
    return f"page={page}" in html


def _text(card, selector: str) -> str:
    node = card.select_one(selector)
    return node.get_text() if node else ""
