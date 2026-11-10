import io
import time
import unittest
from unittest import mock

try:
    import webapp
except ImportError:  # Flask is only needed for the web version
    webapp = None

import engine
from sources.common import Job


@unittest.skipIf(webapp is None, "Flask is not installed")
class WebApp(unittest.TestCase):
    def setUp(self):
        webapp._runs.clear()
        webapp._last_start.clear()
        webapp.COOLDOWN_SECONDS = 0
        self.client = webapp.app.test_client()

    def wait_for(self, run_id):
        for _ in range(100):
            body = self.client.get(f"/api/runs/{run_id}").get_json()
            if body["status"] != "running":
                return body
            time.sleep(0.05)
        self.fail("search did not finish")

    def test_page_and_config(self):
        page = self.client.get("/")
        self.assertEqual(page.status_code, 200)
        self.assertIn("default-src 'self'", page.headers["Content-Security-Policy"])
        config = self.client.get("/api/config").get_json()
        self.assertIn("categories", config["defaults"])
        self.assertEqual(config["defaults"]["job_agent_folder"], "../job_agent")  # replaced per search below

    def test_search_returns_new_rows_and_keeps_old_status(self):
        job = Job(source="Test", title="Data Analyst", company="Acme", location="Limassol",
                  url="https://example.test/1", category="data", experience="junior")

        def fake_search(config, known, log, cancel):
            self.assertEqual(config["job_agent_folder"], "")  # the server's disk is never read
            self.assertIn("https://example.test/old", known)
            log("hello")
            return engine.SearchResult([job], ["https://example.test/1"])

        old = {"Titre": "Old", "Lien": "https://example.test/old", "Statut": "Postulé", "Trouvée le": "2999-01-01"}
        with mock.patch.object(engine, "run_search", fake_search):
            response = self.client.post("/api/search", json={"settings": {}, "rows": [old, "junk"], "checked": []})
            self.assertEqual(response.status_code, 202)
            body = self.wait_for(response.get_json()["id"])
        self.assertEqual(body["status"], "done")
        rows = body["result"]["rows"]
        self.assertEqual([r["Titre"] for r in rows], ["Data Analyst", "Old"])
        self.assertTrue(rows[0]["_new"])
        self.assertFalse(rows[1]["_new"])
        self.assertEqual(rows[1]["Statut"], "Postulé")

    def test_bad_input_is_refused(self):
        self.assertEqual(self.client.post("/api/search", data="nope").status_code, 400)
        self.assertEqual(self.client.post("/api/search", json={"settings": {"max_pages": "x"}}).status_code, 400)
        too_many = {"categories": [{"name": "a", "searches": [str(i) for i in range(8)], "title_words": []},
                                   {"name": "b", "searches": [str(i) for i in range(8)], "title_words": []}]}
        self.assertEqual(self.client.post("/api/search", json={"settings": too_many}).status_code, 400)

    def test_settings_are_clamped(self):
        config = webapp.clean_config({"max_pages": 999, "max_experience_years": -5,
                                      "careerfinders_categories": ["Audit", "../../etc"]})
        self.assertEqual((config["max_pages"], config["max_experience_years"]), (5, 0))
        self.assertEqual(config["careerfinders_categories"], ["Audit"])

    def test_one_search_per_visitor_per_cooldown(self):
        webapp.COOLDOWN_SECONDS = 300
        with mock.patch.object(engine, "run_search", lambda *a, **k: engine.SearchResult([], [])):
            first = self.client.post("/api/search", json={"settings": {}})
            second = self.client.post("/api/search", json={"settings": {}})
        self.assertEqual((first.status_code, second.status_code), (202, 429))

    def test_busy_server_says_so(self):
        webapp.MAX_RUNNING = 0
        try:
            self.assertEqual(self.client.post("/api/search", json={"settings": {}}).status_code, 429)
        finally:
            webapp.MAX_RUNNING = 2

    def test_cancel(self):
        def slow(config, known, log, cancel):
            cancel.wait(5)
            raise engine.Cancelled

        with mock.patch.object(engine, "run_search", slow):
            run_id = self.client.post("/api/search", json={"settings": {}}).get_json()["id"]
            self.client.post(f"/api/runs/{run_id}/cancel")
            self.assertEqual(self.wait_for(run_id)["status"], "cancelled")

    def test_xlsx_download_and_import(self):
        rows = [{"Titre": "=1+1", "Lien": "https://example.test/1", "Statut": "Postulé", "_new": True}]
        response = self.client.post("/api/xlsx", json={"rows": rows})
        self.assertEqual(response.status_code, 200)
        self.assertIn("attachment", response.headers["Content-Disposition"])
        imported = self.client.post("/api/import", data={"file": (io.BytesIO(response.data), "jobs.xlsx")})
        self.assertEqual(imported.get_json()["rows"][0]["Statut"], "Postulé")
        bad = self.client.post("/api/import", data={"file": (io.BytesIO(b"not excel"), "x.xlsx")})
        self.assertEqual(bad.status_code, 400)


if __name__ == "__main__":
    unittest.main()
