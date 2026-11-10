import unittest

from experience import requires_language, years_required


class YearsRequired(unittest.TestCase):
    def test_plain_numbers(self):
        self.assertEqual(years_required("5+ years experience required"), 5)
        self.assertEqual(years_required("One year of experience"), 1)
        self.assertEqual(years_required("experience of minimum 5 years"), 5)
        self.assertEqual(years_required("Must have at least 4 years' experience"), 4)

    def test_range_counts_its_top(self):
        self.assertEqual(years_required("Experience: 3 to 5 years"), 5)
        self.assertEqual(years_required("Experience 2-4 years"), 4)

    def test_greek(self):
        self.assertEqual(years_required("εμπειρία τουλάχιστον 4 χρόνια"), 4)

    def test_company_age_is_not_a_requirement(self):
        self.assertIsNone(years_required("We have 20 years of experience in the market"))

    def test_nothing_said(self):
        self.assertIsNone(years_required("Join our friendly team"))


class RequiresLanguage(unittest.TestCase):
    def wants_greek(self, text, title="Analyst"):
        return requires_language(title, text, "greek")

    def test_required(self):
        self.assertTrue(self.wants_greek("Fluent in Greek and English"))
        self.assertTrue(self.wants_greek("Excellent Greek and English required"))
        self.assertTrue(self.wants_greek("Knowledge of Greek is required, English is a plus"))
        self.assertTrue(self.wants_greek("Fluent in Greek, ideally English too"))

    def test_only_a_plus(self):
        self.assertFalse(self.wants_greek("Greek is an advantage"))
        self.assertFalse(self.wants_greek("Fluent English. Greek is not required"))
        self.assertFalse(self.wants_greek("Greek and English are a plus"))

    def test_about_something_else(self):
        self.assertFalse(self.wants_greek("You will serve the Greek market"))
        self.assertFalse(self.wants_greek("We offer Greek language classes"))

    def test_written_in_greek(self):
        self.assertTrue(self.wants_greek("Ζητείται υπάλληλος για την εταιρεία μας στη Λευκωσία"))
        self.assertTrue(self.wants_greek("Join us", title="Ανάλυση δεδομένων"))


if __name__ == "__main__":
    unittest.main()
