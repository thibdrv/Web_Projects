from ic_lib import *
import math

def bld(x, w, top, col, roof=None, win=True, door=True):
    s = r(x, top, w, 30 - top, col, 1)
    if roof: s += roof
    if win:
        for yy in range(int(top) + 4, 22, 5):
            for xx in range(int(x) + 3, int(x + w) - 3, 5): s += r(xx, yy, 2.4, 2.8, "#FFF1A8", 0.4)
    if door: s += r(x + w / 2 - 2, 25, 4, 5, DBRN, 1)
    return s

# ---------- buildings ----------
add("🏠", g(p("M2 16 L16 4 L30 16Z", RED), r(6, 16, 20, 14, CRM, 1), r(13, 21, 6, 9, DBRN, 1), r(8, 18, 4, 4, LBLU, .6), r(20, 18, 4, 4, LBLU, .6), r(22, 6, 3.4, 7, DGRY, .6)))
add("🏢", g(r(5, 3, 22, 27, "#8FA6C0", 1), "".join(r(8 + i * 6, 6 + j * 5.4, 3.4, 3.4, "#FFF1A8", .5) for i in range(3) for j in range(4)), r(13, 25, 6, 5, DGRY, 1)))
add("🏙", g(r(2, 14, 8, 16, "#7C8FA8", 0), r(10, 6, 9, 24, "#9AA9BF", 0), r(19, 11, 8, 19, "#6F8099", 0), r(26, 17, 5, 13, "#8696AE", 0), "".join(r(x, y, 1.8, 2, "#FFF1A8", 0) for x, y in [(4, 18), (7, 18), (4, 23), (12, 10), (16, 10), (12, 16), (16, 16), (12, 22), (21, 15), (24, 15), (21, 21), (28, 21)]), l("M14 6 V2", GRY, 1.4)))
add("🏘", g(bld(1, 13, 18, "#F0E0C0", p("M0 19 L7.5 11 L15 19Z", RED), False), bld(16, 15, 15, "#E8D8B0", p("M15 16 L23.5 7 L32 16Z", "#C9573A"), False), r(5, 22, 3.4, 8, DBRN, .6), r(21, 21, 4, 9, DBRN, .6), r(20, 18, 3, 3, LBLU, .5), r(5, 19, 3, 2.6, LBLU, .4)))
add("⛪", g(r(11, 12, 10, 18, "#EDE4D3", 0.6), p("M10 12 L16 6 L22 12Z", "#C9573A"), r(15.2, 0, 1.6, 6, DGRY, 0), r(13.6, 1.8, 4.8, 1.6, DGRY, 0), r(14, 18, 4, 12, DBRN, 2), c(16, 14.5, 1.6, LBLU), r(3, 20, 8, 10, "#E0D5C0", 0.6), r(21, 20, 8, 10, "#E0D5C0", 0.6)))
add("🕌", g(p("M8 14 Q8 5 16 4 Q24 5 24 14Z", "#E8EEF4"), r(7, 14, 18, 16, "#F5F0E6", 0.6), p("M15.2 0 V4 M13.5 1.6 Q16 -0.5 18.5 1.6", "none"), l("M16 0 V4", GOLD if False else GLD, 1.6), r(1, 8, 5, 22, "#E8E0D0", 0.6), r(26, 8, 5, 22, "#E8E0D0", 0.6), p("M1 8 L3.5 3 L6 8Z", "#5FA8D0"), p("M26 8 L28.5 3 L31 8Z", "#5FA8D0"), r(13, 20, 6, 10, "#5FA8D0", 3)))
add("🏛", g(p("M2 12 L16 3 L30 12Z", "#E8E0D0"), "".join(r(5 + i * 5.6, 13, 3.4, 14, "#F5F0E6", .6) for i in range(5)), r(2, 27, 28, 3.4, "#D8D0BE", 0.6), r(3, 12, 26, 2, "#D8D0BE", 0.5)))
add("🕌X", ""); del ICONS["🕌X"]
add("🎭", g(p("M3 6 H18 V14 Q18 22 10.5 24 Q3 22 3 14Z", YEL), p("M14 12 H29 V20 Q29 28 21.5 30 Q14 28 14 20Z", "#B7A5E8"), l("M6 11 L9 12 M12 12 L15 11", BLK, 1.6), l("M7 17 Q10.5 20 14 17", BLK, 1.6), l("M17.5 19 L20 19 M23 19 L25.5 19", BLK, 1.6), l("M18 25 Q21.5 22.5 25 25", BLK, 1.6)))
add("🎬", g(r(3, 12, 26, 17, DGRY, 2), p("M3 12 L5 4 L29 8 L28 12Z", BLK), l("M8 4.5 L10 11.5 M14 5.5 L16 12 M20 6.5 L22 12.5 M26 7.5 L27.5 12", WHT, 2.2), p("M13 17 L21 20.5 L13 24Z", WHT)))
add("🛒", g(l("M2 4 H7 L10 20 H25 L28 8 H9", DGRY, 2.4), r(10, 9, 17, 9, "#8FD0A6", 1), c(12, 26, 2.6, DGRY), c(23, 26, 2.6, DGRY)))
add("🏥", g(r(4, 7, 24, 23, WHT, 1.4), r(13, 12, 6, 10, RED, 0.8), r(11, 14, 10, 6, RED, 0.8), r(13, 24, 6, 6, LBLU, 1), r(13, 1, 6, 6, RED, 1), l("M16 2 V6 M14 4 H18", WHT, 1.4), r(6, 9, 4, 3, LBLU, 0.5), r(22, 9, 4, 3, LBLU, 0.5)))
add("🏦", g(p("M2 12 L16 3 L30 12Z", "#C9B88A"), "".join(r(5 + i * 5.6, 13, 3.4, 13, "#E8E0C8", .6) for i in range(5)), r(2, 26, 28, 4, "#B7A878", 0.6), c(16, 9, 2.4, GLD), '<text x="16" y="10.3" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="3.6" fill="#7A5A10">€</text>'))
add("📮", g(p("M6 12 Q6 3 16 3 Q26 3 26 12 V29 H6Z", "#E5484D"), r(9, 11, 14, 2.6, BLK, 1), r(9, 17, 14, 6, "#B3262B", 1), p("M12 20 H20", "none"), l("M12 20 H20", WHT, 1.4)))
add("🏫", g(r(2, 12, 28, 18, "#E8B26A", 1), p("M1 12 L16 3 L31 12Z", "#C9573A"), r(13, 20, 6, 10, DBRN, 1), c(16, 9.5, 2.4, WHT), l("M16 8.4 V10.2 H17.4", DGRY, .8), "".join(r(x, 15, 3.6, 4, LBLU, .5) for x in (5, 9.5, 20, 24.5)), l("M16 12 V6", DGRY, 0), r(15.4, 0, 1.2, 4, DGRY, 0), p("M16.6 0.4 H22 L20 2.2 L22 4 H16.6Z", BLU)))
add("🏨", g(r(4, 4, 24, 26, "#F0C27A", 1), "".join(r(7 + i * 5.4, 8 + j * 5.6, 3, 3.2, "#7C5A2A", 0.4) for i in range(4) for j in range(3)), r(12, 24, 8, 6, DBRN, 1), r(10, 1, 12, 4, RED, 1), '<text x="16" y="4.3" text-anchor="middle" font-family="Arial" font-weight="700" font-size="3.4" fill="#FFFFFF">HOTEL</text>'))
add("🌉", g(r(0, 17, 32, 3.4, "#8A94A3", 0), r(6, 7, 3, 23, "#C94A2B", 0.5), r(23, 7, 3, 23, "#C94A2B", 0.5), l("M0 20 Q7.5 7 7.5 7 Q15 20 16 20 Q17 20 24.5 7 Q24.5 7 32 20", "#E8856A", 1.8), "".join(l("M%s 9 V17" % x, "#E8856A", 1) for x in (3, 5, 11, 13, 19, 21, 27, 29)), p("M0 26 Q8 23 16 26 T32 26 V32 H0Z", BLU)))
add("🏰", g(r(5, 12, 22, 18, "#C9C2B4", 1), "".join(r(5 + i * 6, 8, 4, 5, "#C9C2B4", 0.5) for i in range(4)), r(2, 6, 7, 24, "#B7AF9F", 1), r(23, 6, 7, 24, "#B7AF9F", 1), p("M1 6 L5.5 0 L10 6Z", RED), p("M22 6 L26.5 0 L31 6Z", RED), p("M12 30 V21 Q16 15 20 21 V30Z", DBRN), r(14, 11, 4, 4, LBLU, 0.4)))
add("⛽", g(r(5, 5, 14, 24, RED, 2), r(7, 8, 10, 7, LBLU, 1), r(3, 29, 18, 2.6, DGRY, 1), l("M19 11 H23 Q26 11 26 14 V23 Q26 26 29 25 V13 L25 8", DGRY, 2.2), r(24, 7, 3, 3, DGRY, 0.6)))
add("🅿 🅿️", g(r(3, 3, 26, 26, BLU, 5), '<text x="16" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="22" fill="#FFFFFF">P</text>'))
add("🚦", g(r(10, 2, 12, 26, "#3A4350", 4), c(16, 8, 3.2, RED), c(16, 15, 3.2, "#6B5A1A"), c(16, 22, 3.2, "#1F5F2A"), r(14.5, 28, 3, 3, GRY, 0.4)))
add("🛣", g(p("M12 2 H20 L30 30 H2Z", "#4A5360"), l("M16 5 V9 M16 13 V18 M16 22 V28", WHT, 1.8), l("M12 2 L2 30 M20 2 L30 30", "#C9C2B4", 1.2)))
# ---------- vehicles ----------
add("🚌", g(r(2, 7, 28, 18, "#F5B72E", 3), r(4, 10, 6, 6, LBLU, 1), r(11, 10, 6, 6, LBLU, 1), r(18, 10, 6, 6, LBLU, 1), r(25, 10, 4, 10, LBLU, 1), l("M2 20 H30", "#C98A00", 1.2), c(9, 26, 3.4, BLK), c(23, 26, 3.4, BLK), c(9, 26, 1.3, GRY), c(23, 26, 1.3, GRY)))
add("🚓", g(p("M2 20 L4 14 Q5 11 8 11 H21 Q23 11 25 14 L28 15 Q31 16 31 19 V24 H2Z", WHT), p("M3 21 H30 V24 H3Z", DBLU), p("M8 14 H15 V19 H6Z", LBLU), p("M17 14 H21 L23 19 H17Z", LBLU), r(12, 6, 8, 4, RED, 1.4), r(16, 6, 4, 4, BLU, 1.4), c(8, 25, 3.4, BLK), c(24, 25, 3.4, BLK), c(8, 25, 1.3, GRY), c(24, 25, 1.3, GRY)))
add("🚕", g(p("M2 20 L4 14 Q5 11 8 11 H21 Q23 11 25 14 L28 15 Q31 16 31 19 V24 H2Z", "#F5C518"), p("M8 14 H15 V19 H6Z", LBLU), p("M17 14 H21 L23 19 H17Z", LBLU), r(12, 6, 8, 4, WHT, 1.4), '<text x="16" y="9.3" text-anchor="middle" font-family="Arial" font-weight="700" font-size="3.6" fill="#23262D">TAXI</text>', c(8, 25, 3.4, BLK), c(24, 25, 3.4, BLK), c(8, 25, 1.3, GRY), c(24, 25, 1.3, GRY)))
add("🚆", g(p("M5 6 Q5 3 8 3 H24 Q27 3 27 6 V24 H5Z", "#3E8EDE"), r(8, 7, 16, 8, LBLU, 2), r(8, 18, 4, 3, YEL, 1), r(20, 18, 4, 3, YEL, 1), r(5, 21, 22, 3, DBLU, 0), l("M9 28 L6 31 M23 28 L26 31", GRY, 2), l("M5 27 H27", GRY, 1.6), c(16, 11, 0, WHT)))
add("🚇", g(p("M5 6 Q5 3 8 3 H24 Q27 3 27 6 V25 H5Z", "#8E5BD0"), r(8, 7, 16, 9, LBLU, 2), r(8, 19, 4, 3, YEL, 1), r(20, 19, 4, 3, YEL, 1), '<text x="16" y="24.3" text-anchor="middle" font-family="Arial" font-weight="700" font-size="4" fill="#FFFFFF">M</text>', l("M9 29 L6 31 M23 29 L26 31", GRY, 2)))
add("🚋", g(l("M16 0 V5 M9 3 H23", DGRY, 1.6), r(3, 5, 26, 19, "#E5484D", 3), r(5, 8, 5, 6, LBLU, 1), r(11.5, 8, 5, 6, LBLU, 1), r(18, 8, 5, 6, LBLU, 1), r(24.5, 8, 3, 6, LBLU, 1), r(3, 17, 26, 2, WHT, 0), c(9, 26, 2.8, BLK), c(23, 26, 2.8, BLK), l("M1 30 H31", GRY, 1.6)))
add("✈", g(p("M16 2 Q18 2 18 6 V12 L30 19 V22 L18 18 V25 L22 28 V30 L16 28.5 L10 30 V28 L14 25 V18 L2 22 V19 L14 12 V6 Q14 2 16 2Z", "#9AA9BF"), p("M16 2 Q18 2 18 6 V25 L16 28.5Z", "#B6C3D4")))
add("🚢 ⛴", g(p("M2 20 H30 L26 28 H6Z", "#E5484D"), r(6, 14, 20, 6, WHT, 1), r(9, 8, 14, 6, WHT, 1), r(14, 3, 5, 5, "#E5484D", 1), "".join(c(x, 17, 1.3, BLU) for x in (9, 13, 17, 21, 24)), p("M0 27 Q4 25 8 27 T16 27 T24 27 T32 27 V32 H0Z", BLU)))
add("⛵", g(l("M16 3 V24", DBRN, 1.6), p("M16 4 L28 20 H16Z", WHT), p("M15 8 L5 20 H15Z", "#E8EEF4"), p("M4 24 H28 L24 29 H8Z", "#E5484D"), p("M0 29 Q4 27 8 29 T16 29 T24 29 T32 29 V32 H0Z", BLU)))
add("🛶", g(p("M1 17 Q16 24 31 17 Q28 24 16 26 Q4 24 1 17Z", "#C77A34"), l("M6 6 L24 24", DBRN, 1.8), p("M22 22 L28 28 L25 29 L20 24Z", DBRN), p("M0 28 Q4 26 8 28 T16 28 T24 28 T32 28 V32 H0Z", BLU)))
add("🚲", g('<circle cx="7" cy="22" r="5.6" fill="none" stroke="%s" stroke-width="2"/><circle cx="25" cy="22" r="5.6" fill="none" stroke="%s" stroke-width="2"/>' % (DGRY, DGRY), l("M7 22 L13 11 H20 L25 22 M13 11 L16 22 H7 M20 11 L18 7 H22 M13 11 L12 8 H9", RED, 2.2), c(16, 22, 1.4, DGRY)))
add("🏍", g('<circle cx="7" cy="23" r="5" fill="none" stroke="%s" stroke-width="2.4"/><circle cx="25" cy="23" r="5" fill="none" stroke="%s" stroke-width="2.4"/>' % (DGRY, DGRY), p("M7 23 L11 14 L22 12 L25 23 L19 23 L16 18 L12 23Z", RED), l("M20 12 L23 7 H28", DGRY, 2.2), r(9, 11.4, 8, 3, BLK, 1.4), c(16, 20, 1, GRY)))
add("🛵", g('<circle cx="7" cy="24" r="4" fill="none" stroke="%s" stroke-width="2.4"/><circle cx="25" cy="24" r="4" fill="none" stroke="%s" stroke-width="2.4"/>' % (DGRY, DGRY), p("M3 22 Q3 14 11 14 H15 L19 22 H25 L23 12 H20 L22 8 H27 L29 20 Q29 22 27 22 H19 Q16 24 11 22Z", "#3E8EDE"), r(8, 11, 8, 3, BLK, 1.4)))
add("🚚", g(r(2, 6, 18, 17, "#F5B72E", 2), p("M20 11 H26 L30 16 V23 H20Z", "#E89A1E"), r(22, 13, 5, 4, LBLU, 1), c(8, 25, 3.4, BLK), c(25, 25, 3.4, BLK), c(8, 25, 1.3, GRY), c(25, 25, 1.3, GRY), l("M4 11 H17 M4 16 H17", "#C98A00", 1.4)))
add("🚁", g(l("M3 5 H29 M16 5 V9", DGRY, 2), p("M5 17 Q5 10 15 10 H20 Q26 10 26 17 Q26 22 20 22 H10 Q5 22 5 17Z", RED), p("M15 11 H20 Q24 11 24 16 H15Z", LBLU), l("M26 16 H30 M29 12 V20", RED, 2.4), l("M9 26 H22 M12 22 V26 M18 22 V26", DGRY, 1.8)))
add("🧳 💼", g(r(3, 9, 26, 20, BRN, 3), r(11, 4, 10, 5, "none", 0), l("M11 9 V5 Q11 4 12 4 H20 Q21 4 21 5 V9", DBRN, 2), r(3, 17, 26, 2.4, DBRN, 0), r(14, 15, 4, 6, GLD, 1), r(6, 29, 3, 2, DGRY, 0.5), r(23, 29, 3, 2, DGRY, 0.5)))
add("🎫", g(p("M2 9 H30 V14 Q27 16 27 18 Q27 20 30 22 V27 H2 V22 Q5 20 5 18 Q5 16 2 14Z", YEL), l("M10 9 V27", "#B8860B", 1.4), l("M14 14 H25 M14 18 H25 M14 22 H21", "#B8860B", 1.6)))
add("🛂", g(r(5, 3, 22, 26, "#1F5FA8", 2), c(16, 13, 5.5, GLD), l("M10.5 13 H21.5 M16 7.5 V18.5 M12 9.5 Q16 13 12 16.5 M20 9.5 Q16 13 20 16.5", "#1F5FA8", 1), '<text x="16" y="25" text-anchor="middle" font-family="Arial" font-weight="700" font-size="3.6" fill="#E8B923">PASSPORT</text>'))
add("📷 📸", g(r(2, 8, 28, 20, DGRY, 4), r(10, 4, 8, 4.6, DGRY, 1.4), c(16, 18, 7.6, "#9AA9BF"), c(16, 18, 5, BLK), c(16, 18, 2.4, "#3E8EDE"), dot(14.6, 16.5, 1, WHT), r(23, 11, 4, 2.6, YEL, 1), r(4, 11, 4, 2.6, RED, 1)))
add("💶", g(r(2, 7, 28, 18, "#8FD0A6", 2), c(16, 16, 6.4, "#CFF0DC"), '<text x="16" y="20" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="10" fill="#1F6F46">€</text>', dot(6, 11, 1.2, "#1F6F46"), dot(26, 21, 1.2, "#1F6F46")))
add("💰", g(p("M10 8 Q16 2 22 8 L20 11 H12Z", "#B88A4E"), p("M12 11 H20 Q29 16 28 25 Q27 30 16 30 Q5 30 4 25 Q3 16 12 11Z", "#C99A5A"), '<text x="16" y="25" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="13" fill="#FFF3C2">€</text>', r(11, 8, 10, 3, "#8A6232", 1.4)))
add("💳", g(r(2, 6, 28, 20, "#3E8EDE", 3), r(2, 11, 28, 5, DGRY, 0), r(6, 19, 9, 3, WHT, 1), r(6, 22.5, 14, 1.6, "#9AD2F5", 0.8), c(24, 21, 3, "#F5B72E"), c(21, 21, 3, "#E5484D")))
add("🪙", g(c(16, 16, 12.5, "#F0C040"), c(16, 16, 9, "#F7D468"), '<text x="16" y="20.6" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="12" fill="#B8860B">€</text>'))
add("📈", g(l("M3 3 V29 H30", DGRY, 2), l("M6 22 L13 14 L18 19 L28 7", GRN, 3), p("M22 6 H29 V13Z", GRN)))
add("🧭", g(c(16, 16, 13, WHT), '<circle cx="16" cy="16" r="13" fill="none" stroke="%s" stroke-width="2.4"/>' % DGRY, p("M16 5 L20 16 H12Z", RED), p("M16 27 L12 16 H20Z", GRY), c(16, 16, 1.8, DGRY), '<text x="16" y="4.8" text-anchor="middle" font-family="Arial" font-weight="700" font-size="3.4" fill="#4A5360">N</text>'))
add("⛺", g(p("M2 28 L16 5 L30 28Z", "#E5484D"), p("M16 5 L30 28 H21 Z", "#B3262B"), p("M12 28 L16 17 L20 28Z", "#4A2812"), l("M16 5 V2", DGRY, 1.6), l("M2 28 H30", DBRN, 2)))
add("🏟", g(e(16, 22, 15, 6, "#B7AF9F"), p("M1 22 V10 Q16 2 31 10 V22 Q16 28 1 22Z", "#D8D0BE"), e(16, 14, 11, 4, "#4CAF50"), l("M5 13 H27 M16 10 V18", WHT, 0.8), "".join(l("M%s 10 V22" % x, "#B7AF9F", 1.2) for x in (4, 9, 23, 28))))
add("🏭", g(r(2, 14, 28, 16, "#8A94A3", 1), p("M2 14 L8 8 V14 L14 8 V14 L20 8 V14Z", "#6F7885"), r(21, 3, 5, 11, "#B7AF9F", 1), c(23.5, 1.5, 2.4, "#C9D3DE"), c(27, 0, 1.8, "#DDE5EC"), "".join(r(5 + i * 6, 19, 3.6, 4, "#FFF1A8", .4) for i in range(4)), r(12, 25, 8, 5, DGRY, 0.6)))
add("🔬", g(l("M13 4 L19 8", DGRY, 4), r(10, 3, 5, 12, GRY, 1.4), r(14, 8, 3.6, 11, DGRY, 1), c(19, 20, 6, "none"), '<path d="M10 28 Q10 18 20 17" fill="none" stroke="%s" stroke-width="2.4"/>' % DGRY, r(5, 28, 22, 3, DGRY, 1.2), r(16, 17, 6, 3, GRY, 1)))
# ---------- direction arrows ----------
def arrow(rot, col=BLU):
    return '<g transform="rotate(%s 16 16)">' % rot + p("M16 3 L27 15 H20 V29 H12 V15 H5Z", col) + "</g>"
add("⬆", arrow(0)); add("➡ ➡️ ↗", arrow(90) if False else arrow(90)); add("⬇", arrow(180)); add("⬅", arrow(270))
ICONS["↗"] = arrow(45); ICONS["↘"] = arrow(135); ICONS["↙"] = arrow(225); ICONS["↖"] = arrow(315)
ICONS["➡"] = arrow(90)
