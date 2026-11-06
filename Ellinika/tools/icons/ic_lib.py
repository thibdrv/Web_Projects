# helpers to draw the icons (32 x 32). Every filled shape gets a thin dark outline.
OUT = ' stroke="#00000038" stroke-width=".8" stroke-linejoin="round"'
RED="#E5484D"; DRED="#B3262B"; ORG="#F5922F"; YEL="#F7C948"; GRN="#4CAF50"; DGRN="#2E7D32"; LIME="#9CCC3A"
BLU="#3E8EDE"; DBLU="#1F5FA8"; LBLU="#9AD2F5"; PUR="#8E5BD0"; PNK="#F28DB0"; BRN="#9A6B3E"; DBRN="#6B4423"
TAN="#E3B97C"; CRM="#FFF1CF"; WHT="#FFFFFF"; GRY="#9AA3AD"; LGRY="#D5DAE0"; DGRY="#4A5360"; BLK="#23262D"; SKN="#F2C9A0"; GLD="#E8B923"

ICONS = {}      # char -> inner svg (viewBox 0 0 32 32)
ALIAS = {}      # char -> char
MONO = set()    # icons that take the colour of the text (currentColor)

def c(x, y, r, f): return '<circle cx="%s" cy="%s" r="%s" fill="%s"%s/>' % (x, y, r, f, OUT)
def e(x, y, rx, ry, f, rot=0):
    t = ' transform="rotate(%s %s %s)"' % (rot, x, y) if rot else ""
    return '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s"%s%s/>' % (x, y, rx, ry, f, OUT, t)
def r(x, y, w, h, f, rx=0): return '<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="%s"%s/>' % (x, y, w, h, rx, f, OUT)
def p(d, f): return '<path d="%s" fill="%s"%s/>' % (d, f, OUT)
def l(d, s, w=2): return '<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round"/>' % (d, s, w)
def dot(x, y, rr=1.3, f=BLK): return '<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (x, y, rr, f)
def g(*a): return "".join(a)
def mono(inner): return '<g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">%s</g>' % inner
def monofill(inner): return '<g fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">%s</g>' % inner
def add(chars, inner, is_mono=False):
    for ch in chars.split():
        ICONS[ch] = inner
        if is_mono: MONO.add(ch)
def alias(chars, target):
    for ch in chars.split(): ALIAS[ch] = target

# a round fruit: body colour, optional leaf colour
def fruit(body, leaf=GRN, cx=16, cy=18, rr=9.5, stem=True):
    s = c(cx, cy, rr, body) + e(cx - 3, cy - 3, 2.6, 1.6, "#FFFFFF66", -30)
    if stem: s += l("M16 9 Q16 6 18 4", DBRN, 1.8) + p("M17 7 Q22 3 25 7 Q21 10 17 7Z", leaf)
    return s
# a face: head colour, ears (list of svg), eyes and nose
def eyes(x1=12, x2=20, y=15, rr=1.5): return dot(x1, y, rr) + dot(x2, y, rr)
def nose(x=16, y=19, f=BLK, rr=1.6): return e(x, y, rr * 1.1, rr, f)
