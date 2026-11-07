"""Every job site the app can read, by the name used in settings.json."""
from . import cyprus_sites, remote_boards

SOURCES = {
    "ergodotisi": cyprus_sites.ergodotisi,
    "cyprusjobs": cyprus_sites.cyprusjobs,
    "cypruswork": cyprus_sites.cypruswork,
    "fxcareer": cyprus_sites.fxcareer,
    "kariera": cyprus_sites.kariera,
    "remoteok": remote_boards.remoteok,
    "jobicy": remote_boards.jobicy,
    "remotive": remote_boards.remotive,
}

# Sites read in full (by category, not by search): called once per run, each offer's search is its category there.
BROWSE_SOURCES = {
    "careerfinders": cyprus_sites.careerfinders,
    "emeraldzebra": cyprus_sites.emeraldzebra,
}

# Remote-work boards: their offers are not tied to a city, so the city filter skips them.
REMOTE_SOURCES = {"remotive", "remoteok", "jobicy"}
