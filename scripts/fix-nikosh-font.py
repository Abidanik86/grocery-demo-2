"""
Repair the Nikosh font so browsers accept it.

The shipped Nikosh.woff2 / .woff have a corrupted Windows (platform 3) `name`
table: nameID 13 and 14 contain a mid-sentence fragment rather than a real
string, e.g. nameID 14 reads "dividual, individuals, entity or entities that
of". Chrome's OTS font sanitiser rejects the whole file on that record
("Failed to write nameRecord / Failed to serialize table"), so the Bangla
face never loads and the site silently falls back to a system font.

The Macintosh (platform 1) records in Nikosh.ttf are intact, so we rebuild a
clean `name` table from them and regenerate the TTF, WOFF and WOFF2 files.
"""

from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._n_a_m_e import table__n_a_m_e

FONT_DIR = Path(__file__).resolve().parent.parent / "public" / "fonts"
SOURCE = FONT_DIR / "Nikosh.ttf"

COPYRIGHT = (
    "Nikosh font developed by The Election Commission of Bangladesh. "
    "Latin glyphs incorporated are from a modified DejaVu Serif. "
    "Bangla glyphs design by Jowad Kazi; core developers Jowad Kazi, "
    "Omi Azad and Mozammel Sarker."
)
LICENSE_URL = "http://creativecommons.org/licenses/by-nc-nd/3.0/"
DESIGNER = "Jowad Kazi, Omi Azad and Mozammel Sarker"

# nameID -> (value, use_intact_mac_licence)
TABLE = {
    0: (COPYRIGHT, False),
    1: ("Nikosh", False),
    2: ("Regular", False),
    3: ("Nikosh-Regular-001.000", False),
    4: ("Nikosh Regular", False),
    5: ("Version 001.000", False),
    6: ("Nikosh-Regular", False),
    8: ("Bangladesh Election Commission Secretariat", False),
    9: (DESIGNER, False),
    11: (LICENSE_URL, False),
    13: (None, True),  # placeholder: replaced with the intact Mac record
    14: (LICENSE_URL, False),
}


def build_name_table(font: TTFont) -> None:
    """Replace the font's name table with clean, well-formed records."""
    old = font["name"]

    # Recover the full licence text from the intact Macintosh record.
    licence = ""
    for record in old.names:
        if record.nameID == 13 and record.platformID == 1:
            licence = str(record)
            break
    if not licence:
        raise SystemExit("Could not recover the licence text from the source font.")

    name = font["name"] = table__n_a_m_e()
    name.names = []

    def add(name_id: int, value: str) -> None:
        # Windows / Unicode BMP / US English.
        name.setName(value, name_id, 3, 1, 0x409)
        # Macintosh / Roman / English.
        name.setName(value, name_id, 1, 0, 0)

    for name_id, (value, use_mac_licence) in TABLE.items():
        add(name_id, licence if use_mac_licence else value)

    # Typographic family/subfamily, consistent with names 1 and 2.
    add(16, "Nikosh")
    add(17, "Regular")


def main() -> None:
    font = TTFont(SOURCE)
    build_name_table(font)

    font.save(SOURCE)
    font.flavor = "woff"
    font.save(FONT_DIR / "Nikosh.woff")
    font.flavor = "woff2"
    font.save(FONT_DIR / "Nikosh.woff2")

    # Verify every output parses and every record round-trips.
    for path in (SOURCE, FONT_DIR / "Nikosh.woff", FONT_DIR / "Nikosh.woff2"):
        check = TTFont(path)
        for record in check["name"].names:
            str(record)
        print(
            f"OK  {path.name}  ({path.stat().st_size:,} bytes, "
            f"{check['maxp'].numGlyphs} glyphs)"
        )


if __name__ == "__main__":
    main()
