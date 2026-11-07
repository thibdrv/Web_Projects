"""Remote-job boards with a free public API: Remotive, RemoteOK and Jobicy.

Each board gives its whole list in one request, so it is downloaded once per run
and every search is matched against the job titles locally.
"""
import html

from bs4 import BeautifulSoup

from .common import Job, Settings, clean, fetch, title_matches

_feeds: dict[str, list[Job]] = {}


def remotive(session, keyword: str, settings: Settings) -> list[Job]:
    return _matching("remotive", _load_remotive, session, keyword, settings)


def remoteok(session, keyword: str, settings: Settings) -> list[Job]:
    return _matching("remoteok", _load_remoteok, session, keyword, settings)


def jobicy(session, keyword: str, settings: Settings) -> list[Job]:
    return _matching("jobicy", _load_jobicy, session, keyword, settings)


def _matching(name, loader, session, keyword: str, settings: Settings) -> list[Job]:
    if name not in _feeds:
        _feeds[name] = loader(session)
    allowed = [place.lower() for place in settings.remote_locations]
    return [job for job in _feeds[name]
            if title_matches(job.title, keyword) and _location_ok(job.location, allowed)]


def _location_ok(location: str, allowed: list[str]) -> bool:
    # Many remote jobs are only open to people living in one country (often the USA).
    location = location.lower()
    return not location or not allowed or any(place in location for place in allowed)


def _load_remotive(session) -> list[Job]:
    data = fetch(session, "https://remotive.com/api/remote-jobs", as_json=True)
    return [Job(
        source="Remotive",
        title=clean(item.get("title")),
        company=clean(item.get("company_name")),
        location=clean(item.get("candidate_required_location")),
        url=item.get("url", ""),
        posted=(item.get("publication_date") or "")[:10],
        description=_text(item.get("description")),
    ) for item in data.get("jobs", []) if item.get("url")]


def _load_remoteok(session) -> list[Job]:
    data = fetch(session, "https://remoteok.com/api", as_json=True)
    return [Job(
        source="RemoteOK",
        title=clean(html.unescape(item.get("position") or "")),
        company=clean(html.unescape(item.get("company") or "")),
        location=clean(item.get("location")),
        url=item.get("url", ""),
        posted=(item.get("date") or "")[:10],
        description=_text(item.get("description")),
    ) for item in data if isinstance(item, dict) and item.get("position") and item.get("url")]


def _load_jobicy(session) -> list[Job]:
    data = fetch(session, "https://jobicy.com/api/v2/remote-jobs", {"count": 100}, as_json=True)
    return [Job(
        source="Jobicy",
        title=clean(html.unescape(item.get("jobTitle") or "")),
        company=clean(html.unescape(item.get("companyName") or "")),
        location=clean(item.get("jobGeo")),
        url=item.get("url", ""),
        posted=(item.get("pubDate") or "")[:10],
        description=_text(item.get("jobDescription")),
    ) for item in data.get("jobs", []) if item.get("url")]


def _text(description_html: str | None) -> str:
    return clean(BeautifulSoup(html.unescape(description_html or ""), "html.parser").get_text(" "))
