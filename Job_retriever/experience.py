"""Reading what a job posting asks for: years of experience and languages."""
import re

JUNIOR_WORDS = ["junior", "jr", "graduate", "entry level", "entry-level", "intern", "internship",
                "trainee", "apprentice"]

_NUMBER_WORDS = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
                 "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10}
_NUMBER = r"(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)"
# "3+ years", "3-5 years", "three years", "5 yrs", and in Greek "3 χρόνια", "3 έτη"
# Groups: 1 and 2 are the number and the end of a range ("3-5"), 3 and 4 the same in Greek.
_YEARS = re.compile(
    rf"\b{_NUMBER}\s*(?:\+|plus)?\s*(?:(?:-|–|to)\s*(\d{{1,2}})\s*\+?\s*)?(?:years?|yrs?)\b"
    r"|(\d{1,2})\s*\+?\s*(?:(?:-|–)\s*(\d{1,2})\s*)?(?:χρόνια|χρόνων|έτη|ετών)",
    re.IGNORECASE)
_ABOUT_EXPERIENCE = re.compile(r"experience|εμπειρ", re.IGNORECASE)
# "our company has 20 years of experience" is about the employer, not about you
_ABOUT_EMPLOYER = re.compile(r"\b(we|we've|our|company|founded|since|history|track record)\b", re.IGNORECASE)


def years_required(text: str) -> int | None:
    """The most experience the text asks for, in years; None when it doesn't say."""
    found = []
    for match in _YEARS.finditer(text):
        around = text[max(0, match.start() - 60):match.end() + 60]
        before = text[max(0, match.start() - 40):match.start()]
        if not _ABOUT_EXPERIENCE.search(around) or _ABOUT_EMPLOYER.search(before):
            continue
        # "3-5 years" asks for up to 5: the top of the range counts
        years = max(int(n) if n.isdigit() else _NUMBER_WORDS[n.lower()] for n in match.groups() if n)
        if years <= 15:  # larger numbers are company ages, not requirements
            found.append(years)
    return max(found) if found else None


# Alphabets: a posting written in one of these is for people who read that language.
_ALPHABETS = {"greek": r"[\u0370-\u03ff\u1f00-\u1fff]", "russian": r"[\u0400-\u04ff]",
              "ukrainian": r"[\u0400-\u04ff]", "bulgarian": r"[\u0400-\u04ff]",
              "arabic": r"[\u0600-\u06ff]", "hebrew": r"[\u0590-\u05ff]"}
# Words right next to a language name that show it is about speaking it ("fluent Greek", "Greek and English")
_ABOUT_LANGUAGE = re.compile(r"language|speak|spoken|fluen|native|proficien|knowledge|written|verbal|command"
                             r"|mother tongue|bilingual|english|french|excellent|level|c1|c2|b2", re.IGNORECASE)
_OPTIONAL = re.compile(r"advantage|a plus|\bplus\b|asset|preferred|preferabl|desirable|beneficial|nice to have"
                       r"|bonus|ideally|considered|optional|not required|not mandatory|not essential"
                       r"|class|course|lesson|tuition", re.IGNORECASE)  # "Greek language classes" is a perk
# "Greek market", "Greek-speaking customers": about the clients, not about you
_ABOUT_OTHERS = re.compile(r"[\s-]*(?:speaking\s+)?(?:market|customer|client|communit|audience|partner|team"
                           r"|government|company|companies|subsidiar)", re.IGNORECASE)
_SENTENCE_END = r"[.!?;•·]"
_LANGUAGES = (r"english|french|greek|russian|german|italian|spanish|arabic|hebrew|turkish|polish|ukrainian"
              r"|bulgarian|romanian")


def _is_optional(after: str) -> bool:
    """True when what follows the language name makes it a plus ("Greek is an advantage").

    "Greek is required, English is a plus" is not optional: the plus belongs to English.
    """
    for match in _OPTIONAL.finditer(after):
        if re.match(rf"\s+(?:{_LANGUAGES})\b", after[match.end():], re.IGNORECASE):
            continue  # "ideally English": the word is about the next language
        other_before = re.search(rf"\b(?:{_LANGUAGES})\b", after[:match.start()], re.IGNORECASE)
        joint = re.match(rf"\s*(?:,|/|&|and|or)\s*(?:{_LANGUAGES})\b", after, re.IGNORECASE)
        if other_before and not joint:
            continue  # another language came first, and it is not "Greek and English are a plus"
        return True
    return False


def requires_language(title: str, text: str, language: str) -> bool:
    """True when the posting asks for the language (and not just as a plus)."""
    language = language.strip().lower()
    alphabet = _ALPHABETS.get(language)
    if alphabet:
        if re.search(alphabet, title):
            return True
        letters = len(re.findall(r"[^\W\d_]", text))
        if letters and len(re.findall(alphabet, text)) / letters > 0.3:
            return True
    if re.search(rf"\b{re.escape(language)}\b", title, re.IGNORECASE):
        return True
    for match in re.finditer(rf"\b{re.escape(language)}\b", text, re.IGNORECASE):
        before = re.split(_SENTENCE_END, text[max(0, match.start() - 40):match.start()])[-1]
        after = re.split(_SENTENCE_END, text[match.end():match.end() + 120])[0]
        if _ABOUT_OTHERS.match(after):
            continue
        if _ABOUT_LANGUAGE.search(before + match.group() + after[:40]) and not _is_optional(after):
            return True
    return False
