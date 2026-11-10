import re
import unittest
from pathlib import Path

from messages import MESSAGES

WEB = Path(__file__).resolve().parent.parent / "web"


def js_keys(language: str) -> list[str]:
    """The keys of one language block of web/i18n.js (one key per line, four spaces in)."""
    text = (WEB / "i18n.js").read_text(encoding="utf-8")
    start = text.index(f"  {language}: {{")
    end = text.index("\n  },", start)
    return re.findall(r"^    (\w+):", text[start:end], re.MULTILINE)


def placeholders(text: str) -> set[str]:
    return set(re.findall(r"\{(\w+)\}", text))


class Translations(unittest.TestCase):
    def test_page_texts_exist_in_both_languages(self):
        french, english = js_keys("fr"), js_keys("en")
        self.assertGreater(len(french), 50)
        self.assertEqual(french, english)
        self.assertEqual(len(french), len(set(french)), "a key is written twice")

    def test_page_placeholders_match(self):
        text = (WEB / "i18n.js").read_text(encoding="utf-8")
        pairs = re.findall(r'^    (\w+): "(.*)",$', text, re.MULTILINE)
        half = len(pairs) // 2
        for (key, fr), (key_en, en) in zip(pairs[:half], pairs[half:]):
            self.assertEqual(key, key_en)
            self.assertEqual(placeholders(fr), placeholders(en), key)

    def test_every_key_used_by_the_page_exists(self):
        keys = set(js_keys("fr"))
        used = set(re.findall(r'data-i18n(?:-placeholder|-aria)?="(\w+)"', (WEB / "index.html").read_text(encoding="utf-8")))
        used |= set(re.findall(r'\bt\("(\w+)"', (WEB / "app.js").read_text(encoding="utf-8")))
        used |= {f"th_{k}" for k in re.findall(r'"(\w+)"', re.search(r"HEADER_KEYS = \[(.*?)\]",
                 (WEB / "app.js").read_text(encoding="utf-8")).group(1))}
        used |= {f"f_{k}_{part}" for k in re.findall(r'^  \["(\w+)"', (WEB / "app.js").read_text(encoding="utf-8"),
                 re.MULTILINE) for part in ("label", "hint")}
        self.assertEqual(sorted(used - keys), [])

    def test_server_messages_exist_in_both_languages(self):
        self.assertEqual(set(MESSAGES["fr"]), set(MESSAGES["en"]))
        for key in MESSAGES["fr"]:
            self.assertEqual(placeholders(MESSAGES["fr"][key]), placeholders(MESSAGES["en"][key]), key)


if __name__ == "__main__":
    unittest.main()
