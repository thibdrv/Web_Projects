"""Reading and writing the offers as an Excel file (jobs.xlsx), for the command line and the web app."""
import os
import shutil
from datetime import date
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill

from sources.common import Job

COLUMNS = [("Trouvée le", 12), ("Catégorie", 24), ("Titre", 55), ("Entreprise", 30), ("Ville", 22),
           ("Publiée", 14), ("Expérience", 14), ("Site", 13), ("Lien", 60), ("Statut", 18)]
HEADERS = [header for header, _ in COLUMNS]
NEW_OFFER_FILL = PatternFill("solid", start_color="FFFF00")  # yellow


def job_to_row(job: Job, day: str | None = None) -> dict:
    return {"Trouvée le": day or date.today().isoformat(), "Catégorie": job.category, "Titre": job.title,
            "Entreprise": job.company, "Ville": job.location, "Publiée": job.posted,
            "Expérience": job.experience, "Site": job.source, "Lien": job.url, "Statut": ""}


def drop_expired(rows: list[dict], keep_days: int) -> tuple[list[dict], int]:
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


def read_rows(source) -> list[dict]:
    """The offers in an Excel file (a path or an open file), in the order they are now."""
    workbook = load_workbook(source, read_only=True, data_only=True)
    try:
        rows = workbook.active.iter_rows(values_only=True)
        headers = [str(h) if h is not None else "" for h in next(rows, [])]
        if "Lien" not in headers:  # not one of our files
            return []
        return [{h: ("" if v is None else str(v)) for h, v in zip(headers, row) if h in HEADERS}
                for row in rows if any(v is not None for v in row)]
    finally:
        workbook.close()


def build_workbook(rows: list[dict]) -> Workbook:
    """One sheet with a filter on every column; rows with "_new" set are highlighted in yellow."""
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Offres"
    sheet.append(HEADERS)
    for cell, (_, width) in zip(sheet[1], COLUMNS):
        cell.font = Font(bold=True)
        sheet.column_dimensions[cell.column_letter].width = width
    link_column = HEADERS.index("Lien") + 1
    for row in rows:
        sheet.append([row.get(header, "") for header in HEADERS])
        for cell in sheet[sheet.max_row]:
            if isinstance(cell.value, str) and cell.value.startswith("="):
                cell.data_type = "s"  # a title like "=HYPERLINK(...)" stays text, never a formula
        if str(row.get("Lien", "")).startswith(("http://", "https://")):
            link = sheet.cell(row=sheet.max_row, column=link_column)
            link.hyperlink = row["Lien"]
            link.style = "Hyperlink"
        if row.get("_new"):
            for cell in sheet[sheet.max_row]:
                cell.fill = NEW_OFFER_FILL
    sheet.freeze_panes = "A2"
    sheet.auto_filter.ref = sheet.dimensions
    return workbook


def save_workbook(workbook: Workbook, path: Path) -> None:
    """Saves without ever leaving a half-written file: the old one is kept as .bak until the new one is whole."""
    path.parent.mkdir(exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    try:
        workbook.save(temporary)
        if path.exists():
            shutil.copy2(path, path.with_suffix(".bak.xlsx"))  # jobs.bak.xlsx: opens in Excel as it is
        os.replace(temporary, path)  # PermissionError when Excel has the file open
    finally:
        temporary.unlink(missing_ok=True)
