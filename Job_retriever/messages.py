"""The texts the server shows to the visitor (search journal, errors), in French and English."""

MESSAGES = {
    "fr": {
        "all_offers": "toutes ses offres",
        "searching": "1. Recherche des offres sur {count} sites en même temps\n",
        "site_offers": "  {site} / {search} : {count} offres",
        "site_error": "  {site} / {search} : erreur, ignoré ({error})",
        "site_done": "  => {site} terminé : {read} offres lues, {kept} nouvelles qui correspondent",
        "reading": "\n2. Lecture des offres : expérience demandée ({years} ans maximum){languages}, pour {count} offre(s)\n",
        "reading_languages": " et langues exigées ({languages})",
        "progress": "  {done}/{total} lues",
        "summary": "  {kept} gardées, {experience} écartées pour l'expérience, {language} pour la langue",
        "nothing_to_search": "Rien à chercher : ajoute au moins un type de poste avec une recherche, et coche au moins un site.",
        "bad_setting": "Réglage invalide.",
        "missing_settings": "Réglages manquants.",
        "too_many_searches": "Trop de recherches : 12 au maximum, tous types de poste confondus.",
        "too_many_rows": "Trop d'offres : {max} au maximum.",
        "bad_request": "Requête invalide.",
        "bad_checked": "Liste des offres déjà vues invalide.",
        "busy": "Le service est occupé par d'autres recherches. Réessaie dans quelques minutes.",
        "cooldown": "Une recherche par visiteur toutes les {every} minutes : réessaie dans {wait} min.",
        "run_not_found": "Recherche introuvable (elle a peut-être expiré).",
        "stopped": "\nRecherche arrêtée.",
        "unexpected": "Erreur inattendue pendant la recherche.",
        "error_log": "Erreur : {name}",
        "no_file": "Aucun fichier.",
        "bad_import": "Ce fichier n'est pas un jobs.xlsx lisible.",
    },
    "en": {
        "all_offers": "all its offers",
        "searching": "1. Searching {count} sites at the same time\n",
        "site_offers": "  {site} / {search}: {count} offers",
        "site_error": "  {site} / {search}: error, skipped ({error})",
        "site_done": "  => {site} done: {read} offers read, {kept} new matching",
        "reading": "\n2. Reading the offers: experience asked ({years} years maximum){languages}, for {count} offer(s)\n",
        "reading_languages": " and required languages ({languages})",
        "progress": "  {done}/{total} read",
        "summary": "  {kept} kept, {experience} dropped for experience, {language} for language",
        "nothing_to_search": "Nothing to search: add at least one job type with a search, and tick at least one site.",
        "bad_setting": "Invalid setting.",
        "missing_settings": "Settings missing.",
        "too_many_searches": "Too many searches: 12 at most, across all job types.",
        "too_many_rows": "Too many offers: {max} at most.",
        "bad_request": "Invalid request.",
        "bad_checked": "Invalid list of offers already seen.",
        "busy": "The service is busy with other searches. Try again in a few minutes.",
        "cooldown": "One search per visitor every {every} minutes: try again in {wait} min.",
        "run_not_found": "Search not found (it may have expired).",
        "stopped": "\nSearch stopped.",
        "unexpected": "Unexpected error during the search.",
        "error_log": "Error: {name}",
        "no_file": "No file.",
        "bad_import": "This file is not a readable jobs.xlsx.",
    },
}
DEFAULT_LANGUAGE = "fr"


class UserError(ValueError):
    """Something the visitor can fix: `key` names the message, `params` fill it in."""

    def __init__(self, key: str, **params):
        super().__init__(key)
        self.key = key
        self.params = params


def clean_lang(value) -> str:
    return value if value in MESSAGES else DEFAULT_LANGUAGE


def tr(lang: str, key: str, **params) -> str:
    return MESSAGES[clean_lang(lang)][key].format(**params)
