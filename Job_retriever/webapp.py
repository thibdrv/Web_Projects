"""Retrieve Job on the web: the same search, in a browser.

The server keeps nothing: the visitor's settings, offers and statuses live in their own browser,
are sent with each search, and come back with the new offers. The Excel file is built on demand.

Run it locally:  pip install -r requirements-web.txt  then  python webapp.py
In production:   gunicorn -w 1 --threads 16 webapp:app   (one worker: running searches are kept in memory)
"""
import io
import os
import threading
import time
import uuid
from datetime import date

from flask import Flask, jsonify, request, send_file
from werkzeug.middleware.proxy_fix import ProxyFix

import engine
import excel_io
import settings as app_settings
from sources.common import canonical_url

MAX_RUNNING = int(os.environ.get("MAX_RUNNING", 2))  # searches at the same time, for everyone
COOLDOWN_SECONDS = int(os.environ.get("COOLDOWN_SECONDS", 300))  # between two searches from one visitor
RUN_TIMEOUT = int(os.environ.get("RUN_TIMEOUT", 20 * 60))  # a search that lasts longer is stopped
KEEP_RUNS_SECONDS = 3600
MAX_ROWS = 5000
MAX_CHECKED = 20000

app = Flask(__name__, static_folder="web", static_url_path="")
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1)  # the real visitor address behind the host's proxy
app.config["MAX_CONTENT_LENGTH"] = 4 * 1024 * 1024


@app.after_request
def security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; "
        "frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
    return response


# ---- what the visitor sends is never trusted ----

def _text(value, limit: int) -> str:
    if not isinstance(value, str):
        raise ValueError("Réglage invalide.")
    return value.strip()[:limit]


def _words(value, *, items: int = 100, limit: int = 60) -> list[str]:
    if not isinstance(value, list):
        raise ValueError("Réglage invalide.")
    return [word for word in (_text(v, limit) for v in value[:items]) if word]


def _number(value, low: int, high: int) -> int:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError("Réglage invalide.")
    return max(low, min(high, int(value)))


def clean_config(data) -> dict:
    """Settings from a visitor, checked and limited so one search can never be huge."""
    if not isinstance(data, dict):
        raise ValueError("Réglages manquants.")
    config = app_settings.defaults()
    config["job_agent_folder"] = ""  # the server's disk is not the visitor's
    for key, low, high in [("max_experience_years", 0, 15), ("max_age_days", 1, 365),
                           ("keep_found_days", 0, 365), ("max_pages", 1, 5)]:
        if key in data:
            config[key] = _number(data[key], low, high)
    for key in ["seniority_words", "excluded_languages", "cities", "exclude_words", "remote_locations"]:
        if key in data:
            config[key] = _words(data[key])
    if "categories" in data:
        categories = data["categories"]
        if not isinstance(categories, list):
            raise ValueError("Réglage invalide.")
        config["categories"] = [
            {"name": _text(cat.get("name"), 40), "searches": _words(cat.get("searches"), items=8),
             "title_words": _words(cat.get("title_words"), items=40)}
            for cat in categories[:10] if isinstance(cat, dict) and _text(cat.get("name"), 40)]
        if sum(len(cat["searches"]) for cat in config["categories"]) > 12:
            raise ValueError("Trop de recherches : 12 au maximum, tous types de poste confondus.")
    if isinstance(data.get("sources"), dict):
        config["sources"] = {name: bool(data["sources"].get(name, True)) for name in app_settings.SITE_NAMES}
    if "careerfinders_categories" in data:
        config["careerfinders_categories"] = [name for name in _words(data["careerfinders_categories"])
                                              if name in app_settings.CAREERFINDERS_CATEGORIES]
    return config


def clean_rows(data, *, keep_new: bool = False) -> list[dict]:
    if data is None:
        return []
    if not isinstance(data, list) or len(data) > MAX_ROWS:
        raise ValueError(f"Trop d'offres : {MAX_ROWS} au maximum.")
    rows = []
    for row in data:
        if isinstance(row, dict):
            clean = {header: str(row.get(header) or "")[:500] for header in excel_io.HEADERS}
            if keep_new:
                clean["_new"] = bool(row.get("_new"))
            rows.append(clean)
    return rows


# ---- searches in progress ----

class Run:
    def __init__(self, owner: str):
        self.id = uuid.uuid4().hex
        self.owner = owner
        self.created = time.time()
        self.lines: list[str] = []
        self.status = "running"  # running / done / error / cancelled
        self.error = ""
        self.result: dict | None = None
        self.cancel = threading.Event()


_runs: dict[str, Run] = {}
_last_start: dict[str, float] = {}
_lock = threading.Lock()


def _forget_old_runs() -> None:
    now = time.time()
    for run_id in [r.id for r in _runs.values() if r.status != "running" and now - r.created > KEEP_RUNS_SECONDS]:
        del _runs[run_id]
    for owner in [o for o, t in _last_start.items() if now - t > COOLDOWN_SECONDS]:
        del _last_start[owner]


def _work(run: Run, config: dict, rows: list[dict], checked: list[str]) -> None:
    timer = threading.Timer(RUN_TIMEOUT, run.cancel.set)
    timer.start()
    try:
        old_rows, expired = excel_io.drop_expired(rows, config["keep_found_days"])
        known = set(checked) | {row["Lien"] for row in old_rows if row.get("Lien")}
        result = engine.run_search(config, known, log=run.lines.append, cancel=run.cancel)
        day = date.today().isoformat()
        new_rows = [dict(excel_io.job_to_row(job, day), _new=True) for job in result.jobs]
        run.result = {
            "rows": new_rows + [dict(row, _new=False) for row in old_rows],
            "new_count": len(new_rows),
            "checked": result.checked,
            "expired": expired,
            "failed": result.failed,
            "rejected": dict(result.rejected),
        }
        run.status = "done"
    except engine.Cancelled:
        run.status = "cancelled"
        run.lines.append("\nRecherche arrêtée.")
    except ValueError as exc:
        run.status, run.error = "error", str(exc)
    except Exception as exc:  # the visitor sees a short message, the details stay in the server log
        app.logger.exception("search failed")
        run.status, run.error = "error", "Erreur inattendue pendant la recherche."
        run.lines.append(f"Erreur : {type(exc).__name__}")
    finally:
        timer.cancel()


# ---- routes ----

@app.get("/")
def index():
    return app.send_static_file("index.html")


@app.get("/healthz")
def healthz():
    return "ok"


@app.get("/api/config")
def config():
    return jsonify(defaults=app_settings.defaults(), sites=app_settings.SITE_NAMES,
                   careerfinders=list(app_settings.CAREERFINDERS_CATEGORIES),
                   cooldown_seconds=COOLDOWN_SECONDS)


@app.post("/api/search")
def start_search():
    body = request.get_json(silent=True)
    try:
        if not isinstance(body, dict):
            raise ValueError("Requête invalide.")
        cfg = clean_config(body.get("settings"))
        rows = clean_rows(body.get("rows"))
        checked = body.get("checked") or []
        if not isinstance(checked, list) or len(checked) > MAX_CHECKED:
            raise ValueError("Liste des offres déjà vues invalide.")
        checked = [canonical_url(link) for link in checked if isinstance(link, str) and len(link) < 500]
    except ValueError as exc:
        return jsonify(error=str(exc)), 400

    owner = request.remote_addr or "?"
    with _lock:
        _forget_old_runs()
        if sum(run.status == "running" for run in _runs.values()) >= MAX_RUNNING:
            return jsonify(error="Le service est occupé par d'autres recherches. Réessaie dans quelques minutes."), 429
        wait = COOLDOWN_SECONDS - (time.time() - _last_start.get(owner, 0))
        if wait > 0:
            return jsonify(error=f"Une recherche par visiteur toutes les {COOLDOWN_SECONDS // 60} minutes : "
                                 f"réessaie dans {int(wait // 60) + 1} min."), 429
        run = Run(owner)
        _runs[run.id] = run
        _last_start[owner] = time.time()
    threading.Thread(target=_work, args=(run, cfg, rows, checked), daemon=True).start()
    return jsonify(id=run.id), 202


def _get_run(run_id: str) -> Run | None:
    return _runs.get(run_id)


@app.get("/api/runs/<run_id>")
def run_status(run_id: str):
    run = _get_run(run_id)
    if run is None:
        return jsonify(error="Recherche introuvable (elle a peut-être expiré)."), 404
    since = max(0, request.args.get("since", 0, type=int))
    lines = run.lines[since:]
    body = {"status": run.status, "lines": lines, "next": since + len(lines), "error": run.error}
    if run.status == "done":
        body["result"] = run.result
    return jsonify(body)


@app.post("/api/runs/<run_id>/cancel")
def run_cancel(run_id: str):
    run = _get_run(run_id)
    if run is None:
        return jsonify(error="Recherche introuvable."), 404
    run.cancel.set()
    with _lock:
        _last_start.pop(run.owner, None)  # a search the visitor stopped does not count against them
    return jsonify(ok=True)


@app.post("/api/xlsx")
def make_xlsx():
    body = request.get_json(silent=True)
    try:
        rows = clean_rows(body.get("rows") if isinstance(body, dict) else None, keep_new=True)
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    buffer = io.BytesIO()
    excel_io.build_workbook(rows).save(buffer)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="jobs.xlsx",
                     mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


@app.post("/api/import")
def import_xlsx():
    upload = request.files.get("file")
    if upload is None:
        return jsonify(error="Aucun fichier."), 400
    try:
        rows = excel_io.read_rows(io.BytesIO(upload.read()))
    except Exception:
        return jsonify(error="Ce fichier n'est pas un jobs.xlsx lisible."), 400
    if len(rows) > MAX_ROWS:
        return jsonify(error=f"Trop d'offres : {MAX_ROWS} au maximum."), 400
    return jsonify(rows=rows)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 8000)), threaded=True)
