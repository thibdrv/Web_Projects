import io
import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path

from openpyxl import load_workbook

import excel_io


def row(**fields):
    base = {header: "" for header in excel_io.HEADERS}
    base.update(fields)
    return base


class ExcelIo(unittest.TestCase):
    def test_round_trip_keeps_status_and_order(self):
        rows = [row(Titre="B", Lien="https://x.test/b", Statut="Postulé"), row(Titre="A", Lien="https://x.test/a")]
        buffer = io.BytesIO()
        excel_io.build_workbook(rows).save(buffer)
        back = excel_io.read_rows(io.BytesIO(buffer.getvalue()))
        self.assertEqual([r["Titre"] for r in back], ["B", "A"])
        self.assertEqual(back[0]["Statut"], "Postulé")

    def test_new_rows_are_yellow(self):
        buffer = io.BytesIO()
        excel_io.build_workbook([row(Titre="new", _new=True), row(Titre="old")]).save(buffer)
        sheet = load_workbook(io.BytesIO(buffer.getvalue())).active
        self.assertEqual(sheet["A2"].fill.start_color.rgb[-6:], "FFFF00")
        self.assertNotEqual(sheet["A3"].fill.start_color.rgb[-6:], "FFFF00")

    def test_a_title_is_never_a_formula(self):
        buffer = io.BytesIO()
        excel_io.build_workbook([row(Titre='=HYPERLINK("http://evil.test","click")')]).save(buffer)
        cell = load_workbook(io.BytesIO(buffer.getvalue())).active["C2"]
        self.assertEqual(cell.data_type, "s")

    def test_only_web_links_become_hyperlinks(self):
        buffer = io.BytesIO()
        excel_io.build_workbook([row(Lien="javascript:alert(1)"), row(Lien="https://ok.test/")]).save(buffer)
        sheet = load_workbook(io.BytesIO(buffer.getvalue())).active
        self.assertIsNone(sheet["I2"].hyperlink)
        self.assertIsNotNone(sheet["I3"].hyperlink)

    def test_a_file_without_links_column_is_ignored(self):
        from openpyxl import Workbook
        workbook = Workbook()
        workbook.active.append(["a", "b"])
        buffer = io.BytesIO()
        workbook.save(buffer)
        self.assertEqual(excel_io.read_rows(io.BytesIO(buffer.getvalue())), [])

    def test_expiry_keeps_rows_with_a_status(self):
        old = (date.today() - timedelta(days=40)).isoformat()
        rows = [row(**{"Trouvée le": old}), row(**{"Trouvée le": old, "Statut": "Postulé"}),
                row(**{"Trouvée le": date.today().isoformat()})]
        kept, dropped = excel_io.drop_expired(rows, 31)
        self.assertEqual((len(kept), dropped), (2, 1))
        self.assertEqual(excel_io.drop_expired(rows, 0), (rows, 0))

    def test_save_keeps_a_backup_and_leaves_no_temporary_file(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "results" / "jobs.xlsx"
            excel_io.save_workbook(excel_io.build_workbook([row(Titre="one", Lien="https://x.test/1")]), path)
            excel_io.save_workbook(excel_io.build_workbook([row(Titre="two", Lien="https://x.test/2")]), path)
            self.assertEqual(excel_io.read_rows(path)[0]["Titre"], "two")
            self.assertEqual(excel_io.read_rows(path.with_name("jobs.bak.xlsx"))[0]["Titre"], "one")
            self.assertEqual(sorted(p.name for p in path.parent.iterdir()), ["jobs.bak.xlsx", "jobs.xlsx"])


if __name__ == "__main__":
    unittest.main()
