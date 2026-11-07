"""The search settings, stored in settings.json and edited in the app window.

Standard library only: app.py imports it before the app's own packages are installed.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

SETTINGS_FILE = Path(__file__).resolve().parent / "settings.json"

# Every site the app can read, with the name shown in the window.
SITE_NAMES = {
    "ergodotisi": "Ergodotisi.com",
    "cyprusjobs": "CyprusJobs.com",
    "cypruswork": "CyprusWork.com",
    "fxcareer": "FxCareer.eu",
    "kariera": "Kariera.com.cy",
    "careerfinders": "CareerFinders.com.cy (par catégories, à choisir ci-dessous)",
    "emeraldzebra": "EmeraldZebra.cy (fintech, tech, finance, iGaming : toutes ses offres)",
    "remoteok": "RemoteOK (télétravail)",
    "jobicy": "Jobicy (télétravail)",
    "remotive": "Remotive (télétravail)",
}

# CareerFinders lists its offers by category: name shown on the site -> code in its links.
CAREERFINDERS_CATEGORIES = {
    "Accounting - Non-Qualified": "ACCA-NON", "Accounting - Part-Qualified": "ACCA/PQ",
    "Accounting - Qualified": "ACCA", "Administration/Secretarial": "ADMIN", "Audit": "AUDIT",
    "Banking/Finance": "Bank", "Compliance": "COMP", "Corporate/Fiduciary Services": "COR",
    "Customer Services": "CUSTOM", "Data Analysis": "DA", "Engineering & Construction": "ENGI",
    "FinTech": "FINTECH", "Forex": "FX", "Graphic Design": "GRAPH", "Health & Safety": "H&S",
    "Human Resources": "HR", "Information Technology (IT)": "IT", "Insurance": "INS", "Legal": "LEGAL",
    "Logistics/Purchasing": "LOGI", "Marketing/PR": "PR", "Oil & Gas": "OIL", "Online Gaming": "OG ",
    "Operations": "OPER", "Payment Service Providers (PSPs)": "PSPs", "Pharmaceutical": "PHARM",
    "Real Estate": "RE", "Recent Graduates": "REGRAD", "Risk": "Risk",
    "Sales/Business Development": "SALES", "Shipping": "SHIP", "Tax": "TAX", "Telecommunications": "TELECO",
}

DEFAULTS = {
    # Job types, in order: when a title fits several, the first one wins.
    #   searches:    what is typed in each site's search box
    #   title_words: a job goes in the type when its title contains one of these words
    "categories": [
        {
            "name": "data",
            "searches": ["data analyst", "business intelligence", "reporting analyst", "business analyst"],
            "title_words": ["data", "analytics", "business intelligence", "bi analyst", "bi developer",
                            "power bi", "reporting analyst", "business analyst", "insights analyst"],
        },
        {
            "name": "dev",
            "searches": ["web developer", "frontend developer", "full stack developer", "junior developer"],
            "title_words": ["web developer", "web designer", "webmaster", "website", "developer", "frontend",
                            "front-end", "front end", "full stack", "fullstack", "full-stack", "javascript",
                            "react", "php", "wordpress", "software engineer"],
        },
        {
            "name": "french / sales / support",
            "searches": ["french", "retention", "sales", "customer support", "customer service"],
            "title_words": ["french", "francophone", "retention", "sales", "support", "customer",
                            "client success", "client relationship", "account manager"],
        },
    ],
    "max_experience_years": 3,
    "excluded_languages": ["greek"],
    "seniority_words": ["senior", "sr", "principal", "director", "head of", "chief", "vp", "expert",
                        "architect", "team lead", "tech lead", "technical lead", "lead developer",
                        "lead engineer", "lead analyst"],
    "cities": ["nicosia", "lefkosia", "larnaca", "larnaka", "pyla", "dali", "idalion", "limassol", "lemesos"],
    "max_age_days": 31,
    "keep_found_days": 31,  # offers found longer ago leave jobs.xlsx (unless you wrote a Statut); 0 = never
    "careerfinders_categories": [
        "Customer Services", "Data Analysis", "FinTech", "Forex", "Online Gaming", "Information Technology (IT)",
        "Shipping", "Payment Service Providers (PSPs)", "Recent Graduates", "Sales/Business Development",
    ],
    "exclude_words": ["german", "italian", "spanish", "portuguese", "dutch", "russian", "polish", "lithuanian",
                      "czech", "hungarian", "romanian", "bulgarian", "turkish", "arabic", "hebrew", "korean",
                      "japanese", "chinese", "mandarin", "swedish", "norwegian", "danish", "finnish"],
    "remote_locations": ["anywhere", "worldwide", "europe", "emea", "eu", "cyprus", "remote"],
    "max_pages": 3,
    "job_agent_folder": "../job_agent",
    "sources": {name: True for name in SITE_NAMES},
}


def load() -> dict:
    """The saved settings, with defaults filled in for anything missing."""
    settings = json.loads(json.dumps(DEFAULTS))  # deep copy
    if SETTINGS_FILE.exists():
        saved = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
        settings.update({key: value for key, value in saved.items() if key in DEFAULTS})
        settings["sources"] = {name: bool(saved.get("sources", {}).get(name, True)) for name in SITE_NAMES}
    return settings


def save(settings: dict) -> None:
    SETTINGS_FILE.write_text(json.dumps(settings, indent=2, ensure_ascii=False), encoding="utf-8")


def open_file(path: Path) -> None:
    """Opens a file in its usual app (Excel, LibreOffice, Numbers...) on Windows, Mac or Linux."""
    if os.name == "nt":
        os.startfile(path)
    else:
        subprocess.Popen(["open" if sys.platform == "darwin" else "xdg-open", str(path)])
