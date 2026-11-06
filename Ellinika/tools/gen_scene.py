"""Make the realistic landscape of the home page (the <svg class="scene"> of index.html). python -X utf8 gen_scene.py
Colours come from CSS variables (css/realscene.css), so the same drawing is a moonlit night in the dark look and a bright Aegean day in the light look."""
import random, re, pathlib, math
ROOT = pathlib.Path(__file__).resolve().parent.parent
rnd = random.Random(7)
f = lambda v: ("%.1f" % v).rstrip("0").rstrip(".")
out = []
add = out.append

# ---------------- the gradients ----------------
defs = '''<defs>
      <pattern id="waves" width="64" height="16" patternUnits="userSpaceOnUse"><path class="wave" d="M0 9 q16 -9 32 0 t32 0"/></pattern>
      <linearGradient id="gSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--r-sea-a)"/><stop offset=".45" style="stop-color:var(--r-sea-b)"/><stop offset="1" style="stop-color:var(--r-sea-c)"/></linearGradient>
      <linearGradient id="gFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--r-far-a)"/><stop offset="1" style="stop-color:var(--r-far-b)"/></linearGradient>
      <linearGradient id="gFar2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--r-far2-a)"/><stop offset="1" style="stop-color:var(--r-far2-b)"/></linearGradient>
      <linearGradient id="gHill3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--r-h3-a)"/><stop offset="1" style="stop-color:var(--r-h3-b)"/></linearGradient>
      <linearGradient id="gHill2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--r-h2-a)"/><stop offset=".6" style="stop-color:var(--r-h2-b)"/><stop offset="1" style="stop-color:var(--r-h2-c)"/></linearGradient>
      <linearGradient id="gHill1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--r-h1-a)"/><stop offset=".55" style="stop-color:var(--r-h1-b)"/><stop offset="1" style="stop-color:var(--r-h1-c)"/></linearGradient>
      <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--r-wall-a)"/><stop offset="1" style="stop-color:var(--r-wall-b)"/></linearGradient>
      <linearGradient id="gSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--r-side-a)"/><stop offset="1" style="stop-color:var(--r-side-b)"/></linearGradient>
      <linearGradient id="gRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--r-roof-a)"/><stop offset="1" style="stop-color:var(--r-roof-b)"/></linearGradient>
      <linearGradient id="gMill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--r-side-a)"/><stop offset=".35" style="stop-color:var(--r-wall-a)"/><stop offset="1" style="stop-color:var(--r-side-b)"/></linearGradient>
      <radialGradient id="gDome" cx=".35" cy=".3" r=".8"><stop offset="0" style="stop-color:var(--r-dome-a)"/><stop offset="1" style="stop-color:var(--r-dome-b)"/></radialGradient>
      <radialGradient id="gCyp" cx=".35" cy=".4" r=".75"><stop offset="0" style="stop-color:var(--r-cyp-a)"/><stop offset="1" style="stop-color:var(--r-cyp-b)"/></radialGradient>
      <radialGradient id="gHaze" cx=".5" cy=".5" r=".5"><stop offset="0" style="stop-color:var(--r-haze);stop-opacity:.9"/><stop offset="1" style="stop-color:var(--r-haze);stop-opacity:0"/></radialGradient>
      <radialGradient id="gSunGlow"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".95"/><stop offset=".35" stop-color="#FFC857" stop-opacity=".45"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
      <radialGradient id="gMoonGlow"><stop offset="0" stop-color="#EAF0FF" stop-opacity=".7"/><stop offset=".4" stop-color="#9DB4E8" stop-opacity=".28"/><stop offset="1" stop-color="#9DB4E8" stop-opacity="0"/></radialGradient>
      <radialGradient id="gSunDisc" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFFBE3"/><stop offset=".7" stop-color="#FFD35E"/><stop offset="1" stop-color="#F6B53B"/></radialGradient>
      <radialGradient id="gMoonDisc" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#E9EEF8"/><stop offset="1" stop-color="#C6D1E6"/></radialGradient>
      <linearGradient id="gGlint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <radialGradient id="gPuff" cx=".45" cy=".38" r=".62"><stop offset="0" style="stop-color:var(--r-cl-hi)"/><stop offset=".5" style="stop-color:var(--r-cl-mid)"/><stop offset=".82" style="stop-color:var(--r-cl-lo)" stop-opacity=".55"/><stop offset="1" style="stop-color:var(--r-cl-lo)" stop-opacity="0"/></radialGradient>
      <linearGradient id="gCloudBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--r-cl-mid)" stop-opacity=".9"/><stop offset="1" style="stop-color:var(--r-cl-lo)" stop-opacity="0"/></linearGradient>
      <linearGradient id="gCirrus" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--r-cl-hi)" stop-opacity="0"/><stop offset=".5" style="stop-color:var(--r-cl-hi)" stop-opacity=".75"/><stop offset="1" style="stop-color:var(--r-cl-hi)" stop-opacity="0"/></linearGradient>
      <linearGradient id="gSky" gradientUnits="userSpaceOnUse" x1="0" y1="-90" x2="0" y2="214"><stop offset="0" style="stop-color:var(--r-sky-0)"/><stop offset=".45" style="stop-color:var(--r-sky-1)"/><stop offset=".8" style="stop-color:var(--r-sky-2)"/><stop offset="1" style="stop-color:var(--r-sky-3)"/></linearGradient>
      <linearGradient id="gMilky" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfd9ff" stop-opacity="0"/><stop offset=".5" stop-color="#dfe6ff" stop-opacity=".55"/><stop offset="1" stop-color="#cfd9ff" stop-opacity="0"/></linearGradient>
      <radialGradient id="gVig" cx=".5" cy=".55" r=".75"><stop offset=".55" style="stop-color:var(--r-vig);stop-opacity:0"/><stop offset="1" style="stop-color:var(--r-vig);stop-opacity:1"/></radialGradient>
      <radialGradient id="gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd58a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient>
      <filter id="blur14" x="-20%" y="-150%" width="140%" height="400%"><feGaussianBlur stdDeviation="13"/></filter>
      <filter id="grainL" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.9 0 0 0 -.78"/></filter>
      <filter id="grainD" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.9 0 0 0 1.12"/></filter>
      <filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
      <filter id="soft2" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="1.1"/></filter>
    </defs>'''
add(defs)
add('<rect class="sky" x="-300" y="-500" width="1800" height="714" fill="url(#gSky)"/>')       # it goes far above the picture: the sky fills the top of the page
add('<g class="milky"><ellipse cx="470" cy="78" rx="520" ry="30" transform="rotate(-16 470 78)" fill="url(#gMilky)" filter="url(#blur14)"/><ellipse cx="520" cy="86" rx="360" ry="9" transform="rotate(-16 520 86)" fill="url(#gMilky)" opacity=".5" filter="url(#blur14)"/></g>')

# ---------------- stars (night, dark look) ----------------
stars = []
for i in range(46):
    x, y = rnd.uniform(0, 1200), rnd.uniform(4, 130)
    if 900 < x < 1030 and 30 < y < 135: continue                      # the moon is there
    r = rnd.choice([.6, .8, 1, 1.2, 1.5])
    stars.append(f'<circle class="star" cx="{f(x)}" cy="{f(y)}" r="{r}" style="--d:{rnd.uniform(0, 6):.1f}s;--t:{rnd.uniform(2.4, 5.6):.1f}s"/>')
# more stars, of different brightness and a little colour (a separate random generator: the rest of the picture keeps its places)
rs = random.Random(21)
for i in range(190):
    x, y = rs.uniform(-100, 1300), rs.uniform(-85, 170)                       # a few above the picture too: the sky goes on up to the top of the page
    if rs.random() < .45: y = rs.uniform(-85, 90)                              # more of them high in the sky
    if 890 < x < 1040 and 25 < y < 140: continue
    r = rs.choice([.45, .55, .7, .7, .9, 1.1])
    tint = rs.choice(["", "", "warm", "cool"])
    stars.append(f'<circle class="star {tint}" cx="{f(x)}" cy="{f(y)}" r="{r}" style="--d:{rs.uniform(0, 7):.1f}s;--t:{rs.uniform(2.6, 6.4):.1f}s"/>')
add('<g class="stars">' + "".join(stars) + '</g>')
add('<g class="shooters"><path class="shoot" d="M0 0 L-70 22" style="--x:640px;--y:20px"/><path class="shoot two" d="M0 0 L-60 18" style="--x:300px;--y:46px"/></g>')

# ---------------- clouds: soft cumulus (lit on top, shaded and flat below) and thin cirrus streaks, drawn with gradients (no blur), so they move cheaply ----------------
def cumulus(ty, dur, delay, s=1.0, n=7):
    base = [(14, 24, 12), (30, 17, 16), (52, 12, 20), (73, 16, 17), (90, 24, 12), (42, 22, 15), (64, 23, 14)][:n]
    g = f'<ellipse class="cl-base" cx="{f(52*s)}" cy="{f(30*s)}" rx="{f(54*s)}" ry="{f(8*s)}" fill="url(#gCloudBase)"/>'
    g += "".join(f'<circle class="cl-puff" cx="{f(x*s)}" cy="{f(y*s)}" r="{f(r*s)}" fill="url(#gPuff)"/>' for x, y, r in base)
    return f'<g transform="translate(0 {ty})"><g class="cloud" style="--dur:{dur}s;--delay:{delay}s">{g}</g></g>'
def cirrus(ty, dur, delay, w=200):
    g = "".join(f'<ellipse class="cl-cirrus" cx="{w/2}" cy="{4 + i*6}" rx="{w/2 - i*18}" ry="{2.2 - i*.5}" fill="url(#gCirrus)"/>' for i in range(3))
    return f'<g transform="translate(0 {ty})"><g class="cloud cirrus" style="--dur:{dur}s;--delay:{delay}s">{g}</g></g>'
add('<g class="clouds">' + cirrus(20, 260, -90) + cirrus(58, 320, -210, 260) + cumulus(34, 140, -40, 1.25) + cumulus(82, 190, -120, .85, 6) + cumulus(12, 230, -170, 1.0, 5) + cumulus(96, 170, -15, .7, 5) + '</g>')

# ---------------- the sun and the moon: two bodies, at night the sun sinks and the moon rises ----------------
add('''<g class="sunbody tap" data-tap="sun">
      <g class="sun-d">
        <circle class="sun-glow" cx="965" cy="82" r="120"/>
        <circle class="sun-rays" cx="965" cy="82" r="46"/>
        <circle class="sun-halo" cx="965" cy="82" r="62"/>
        <circle class="sun" cx="965" cy="82" r="30"/>
      </g>
      <g class="moon-n">
        <circle class="moon-glow" cx="965" cy="82" r="110"/>
        <circle class="moon" cx="965" cy="82" r="27"/>
        <circle class="crater" cx="955" cy="75" r="6"/><circle class="crater" cx="975" cy="91" r="4.5"/><circle class="crater" cx="971" cy="69" r="3"/><circle class="crater" cx="958" cy="93" r="2.6"/>
      </g>
    </g>
    <g class="flock"><path class="bird" d="M150 66 q6 -8 12 0 q6 -8 12 0 M190 52 q5 -7 10 0 q5 -7 10 0"/></g>
    <g class="flock two"><path class="bird" d="M730 70 q6 -8 12 0 q6 -8 12 0 M766 58 q5 -7 10 0 q5 -7 10 0"/></g>''')

# ---------------- the far islands in the haze ----------------
add('<ellipse class="haze" cx="560" cy="208" rx="640" ry="46" fill="url(#gHaze)"/>')
add('<path class="far2" d="M310 208 C340 192 372 184 410 188 C440 176 470 172 500 184 C530 178 560 186 590 208Z" fill="url(#gFar2)"/>')
add('<path class="far" d="M0 206 C30 192 70 178 112 176 C150 160 196 154 236 170 C270 164 300 180 330 206Z" fill="url(#gFar)"/>')
add('<path class="far" d="M470 208 C520 196 570 188 630 190 C690 186 730 196 760 208Z" fill="url(#gFar)" opacity=".8"/>')

rl = random.Random(33)
lights = "".join(f'<circle class="farlight" cx="{f(x)}" cy="{f(y)}" r=".9" style="--d:{rl.uniform(0, 5):.1f}s"/>' for x, y in [(rl.uniform(30, 300), rl.uniform(186, 203)) for _ in range(12)] + [(rl.uniform(490, 740), rl.uniform(194, 205)) for _ in range(10)] + [(rl.uniform(330, 560), rl.uniform(190, 205)) for _ in range(6)])
add(f'<g class="farlights">{lights}</g>')
# ---------------- the far hill, left ----------------
add('<g class="par3"><path class="hill3" d="M0 196 C90 160 190 176 290 164 C400 150 470 188 560 180 C650 172 700 150 780 160 L780 262 L0 262Z" fill="url(#gHill3)"/>')
scrub = "".join(f'<path d="M{f(x)} {f(y)} q2 -5 5 -1" class="scrub"/>' for x, y in [(rnd.uniform(20, 760), rnd.uniform(172, 200)) for _ in range(30)])
add(f'<g class="scrubs">{scrub}</g></g>')

# ---------------- the sea ----------------
add('<rect class="sea" x="0" y="206" width="1200" height="56" fill="url(#gSea)"/>')
add('<rect x="0" y="206" width="1200" height="2.4" class="horizon"/>')
# the light on the water (sun or moon): glints
glints = []
for i in range(16):
    gx = 520 + rnd.uniform(-60, 60) * (0.4 + i / 24); gy = 209 + i * 3.2
    gw = rnd.uniform(8, 30) * (0.6 + i / 20)
    glints.append(f'<rect class="glint" x="{f(gx-gw/2)}" y="{f(gy)}" width="{f(gw)}" height="1.1" rx=".55" style="--d:{rnd.uniform(0,3):.1f}s"/>')
add('<g class="glints">' + "".join(glints) + '</g>')
add('<g class="wave-drift"><rect x="-64" y="206" width="1328" height="56" fill="url(#waves)"/></g>')
add('<g class="wave-drift two"><rect x="-64" y="217" width="1328" height="45" fill="url(#waves)" opacity=".55"/></g>')

# ---------------- the boat (with its reflection) ----------------
add('''<g transform="translate(560 190)"><g class="boat tap" data-tap="boat">
      <path class="hull" d="M-24 13 H24 L17 25 H-17Z"/><path class="hull-line" d="M-23 15.5 H23"/>
      <path class="mast" d="M0 -30 V13"/>
      <path class="sail sail-a" d="M0 -27 V11 H-19Z"/><path class="sail sail-b" d="M2.6 -20 V11 H21Z"/>
      <path class="flag" d="M0 -30 l9 2.5 l-9 2.5z"/>
    </g></g>
    <g class="reflect" transform="translate(560 218)" opacity=".28"><path d="M-17 0 H17 L11 -2 H-11Z M-3 4 H3 M-8 8 H8" class="hull"/></g>''')

# ---------------- the near hill, left: olive tree, windmill, cypresses, dry stone walls ----------------
add('<g class="par2"><path class="hill2" d="M0 262 V170 C70 160 150 172 230 196 C290 214 330 238 360 262Z" fill="url(#gHill2)"/>')
tufts = []
for _ in range(46):
    x = rnd.uniform(6, 330); ytop = 168 + (x/330)*60
    y = rnd.uniform(ytop + 4, 258 if x < 120 else ytop + 30)
    if y > 262 - (x - 300) * 1.6 and x > 300: continue
    tufts.append(f'<path d="M{f(x)} {f(y)} l-1.5 -4 M{f(x)} {f(y)} l1 -5 M{f(x)} {f(y)} l3 -3.5" class="tuft"/>')
add('<g class="tufts">' + "".join(tufts) + '</g>')
add('<path class="wallstone" d="M8 222 C60 214 120 220 176 238 M20 244 C70 236 110 240 150 252"/>')
# the olive tree: a twisted trunk and a canopy of many small leaf clusters
add('<g class="olivetree"><path class="trunk-a" d="M100 206 C90 186 108 172 94 150"/><path class="trunk-b" d="M96 196 C104 182 98 170 108 152"/><path class="trunk-c" d="M93 178 C84 168 80 160 76 150"/>')
canopy = []
for cx, cy, rx, ry, k in [(80, 140, 36, 17, 0), (116, 132, 32, 16, 1), (96, 120, 30, 14, 2), (66, 154, 24, 12, 0), (126, 148, 22, 11, 1), (100, 142, 30, 13, 2)]:
    canopy.append(f'<ellipse class="olive olive-{k}" cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/>')
for _ in range(70):
    cx, cy = rnd.uniform(52, 142), rnd.uniform(112, 160)
    if ((cx - 96) / 52) ** 2 + ((cy - 138) / 28) ** 2 > 1: continue
    canopy.append(f'<ellipse class="leaf leaf-{rnd.randint(0, 2)}" cx="{f(cx)}" cy="{f(cy)}" rx="{f(rnd.uniform(3, 6))}" ry="{f(rnd.uniform(1.4, 2.4))}" transform="rotate({rnd.randint(-40, 40)} {f(cx)} {f(cy)})"/>')
add("".join(canopy) + '</g>')
# the windmill: a whitewashed round tower, thatched cone, a door, blades
add('''<g class="windmill"><path class="mill-body" d="M234 200 L243 140 H261 L270 200Z" fill="url(#gMill)"/><path class="mill-base" d="M231 200 H273 V204 H231Z"/>
      <path class="mill-roof" d="M239 141 C244 124 248 119 252 114 C256 119 260 124 265 141Z"/><path class="mill-roof-line" d="M243 134 H261 M246 128 H258"/>
      <path class="mill-door" d="M247 200 V187 a5 5 0 0 1 10 0 V200Z"/><rect class="mill-win" x="249.5" y="160" width="5" height="7" rx="2.5"/><rect class="mill-win" x="249.5" y="174" width="5" height="6" rx="2.5"/></g>
    <g class="mill tap" data-tap="mill"><path class="sails" d="M252 133 L220 101 M252 133 L284 101 M252 133 L220 165 M252 133 L284 165"/><circle class="mill-hub" cx="252" cy="133" r="3.2"/></g>''')
add('<ellipse class="cyp" cx="326" cy="214" rx="8" ry="32" fill="url(#gCyp)"/><ellipse class="cyp" cx="346" cy="226" rx="7" ry="26" fill="url(#gCyp)"/><ellipse class="cyp" cx="312" cy="226" rx="5.5" ry="21" fill="url(#gCyp)"/>')
add('</g>')

# ---------------- the village hill, right ----------------
add('<g class="par1"><path class="hill1" d="M640 262 C700 232 760 200 830 170 C900 140 980 120 1060 126 C1120 130 1170 120 1200 112 L1200 262Z" fill="url(#gHill1)"/>')
rocks = "".join(f'<path d="M{f(x)} {f(y)} l{f(rnd.uniform(6,16))} {f(rnd.uniform(-2,2))}" class="strata"/>' for x, y in [(rnd.uniform(660, 1190), rnd.uniform(150, 255)) for _ in range(40)])
add(f'<g class="stratas">{rocks}</g>')

houses = [(742, 200, 34, 26), (782, 184, 38, 28), (826, 166, 34, 30), (922, 146, 36, 30), (964, 132, 42, 34), (1012, 124, 36, 30), (1054, 120, 44, 34),
          (1104, 116, 38, 30), (1146, 104, 44, 34), (800, 212, 40, 30), (872, 190, 46, 34), (1000, 160, 40, 32), (1060, 156, 46, 34)]
extra = [(700, 224, 30, 24), (760, 232, 36, 26), (846, 202, 30, 26), (900, 168, 30, 26), (936, 182, 34, 28), (988, 196, 36, 28), (1038, 192, 34, 28), (1086, 190, 40, 28),
         (1130, 150, 36, 28), (1170, 138, 30, 26), (940, 222, 38, 26), (1000, 226, 34, 24), (1050, 222, 40, 26), (1100, 222, 44, 26), (1150, 190, 40, 28), (870, 236, 34, 22)]
# houses behind first (high ones), then the ones in front
allh = sorted([(h, False) for h in houses] + [(h, True) for h in extra], key=lambda a: a[0][1])
church = (868, 140, 48, 36)
glows = []
def house(x, y, w, h, dim=False):
    s = []
    d = 7                                                                     # depth of the right side
    s.append(f'<path class="hside" d="M{x+w} {y} L{x+w+d} {y-3} V{y+h-3} L{x+w} {y+h}Z" fill="url(#gSide)"/>')
    s.append(f'<rect class="hfront" x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#gWall)"/>')
    s.append(f'<path class="hroof" d="M{x-1} {y} H{x+w} L{x+w+d} {y-3} H{x+d-1}Z"/>')
    s.append(f'<rect class="hcorn" x="{x-1}" y="{y}" width="{w+1}" height="2"/>')
    s.append(f'<rect class="hshadow" x="{x}" y="{y+2}" width="{w}" height="3"/>')
    # a window with blue shutters, a door with an arch
    wx = x + 5 + rnd.randint(0, 3); wy = y + 6 + rnd.randint(0, 2)
    glows.append(f'<circle cx="{f(wx + 2.8)}" cy="{f(wy + 4)}" r="{5 if not dim else 4}"/>')
    s.append(f'<rect class="hshut" x="{wx-1.6}" y="{wy}" width="2" height="7.4"/><rect class="hshut" x="{wx+5.2}" y="{wy}" width="2" height="7.4"/><rect class="hwin" x="{wx+.4}" y="{wy+.4}" width="4.8" height="6.6" rx="1"/>')
    dx = x + w - 13 - rnd.randint(0, 3)
    s.append(f'<path class="hdoor" d="M{dx} {y+h} V{y+h-9} a3.6 3.6 0 0 1 7.2 0 V{y+h}Z"/>')
    if rnd.random() < .45: s.append(f'<path class="hwin2" d="M{x+w-9} {y+6} h5 v6 h-5z"/>')
    if rnd.random() < .38:                                                   # bougainvillea
        bx = x + rnd.choice([2, w - 6]); by = y + h - 12
        s.append("".join(f'<circle class="boug b{k % 2}" cx="{f(bx + rnd.uniform(-3, 6))}" cy="{f(by + rnd.uniform(-3, 9))}" r="{f(rnd.uniform(1.6, 3.2))}"/>' for k in range(7)))
    return '<g class="house%s">' % (" dim" if dim else "") + "".join(s) + '</g>'
for (x, y, w, h), is_extra in allh:
    if church[0] - 8 < x + w and x < church[0] + church[2] + 12 and church[1] - 4 < y + h and y < church[1] + church[3] + 4: continue
    add(house(x, y, w, h, is_extra))
add('<g class="winglow" fill="url(#gGlow)">' + "".join(glows) + '</g>')
# the church: whitewashed, a blue dome with a cross, a bell tower
cx, cy, cw, ch = church
add(f'''<g class="church"><path class="hside" d="M{cx+cw} {cy} L{cx+cw+8} {cy-3} V{cy+ch-3} L{cx+cw} {cy+ch}Z" fill="url(#gSide)"/><rect class="hfront" x="{cx}" y="{cy}" width="{cw}" height="{ch}" fill="url(#gWall)"/>
      <rect class="tower" x="{cx+cw-14}" y="{cy-26}" width="12" height="28" fill="url(#gWall)"/><path class="hside" d="M{cx+cw-2} {cy-26} l5 -2 v28 l-5 2z" fill="url(#gSide)"/><path class="arch" d="M{cx+cw-11} {cy-16} v-6 a3 3 0 0 1 6 0 v6z"/>
      <path class="dome" d="M{cx} {cy} a24 24 0 0 1 48 0Z" fill="url(#gDome)"/><path class="dome-hi" d="M{cx+8} {cy-6} a18 18 0 0 1 12 -9"/>
      <path class="cross" d="M892 116 V102 M886 108 H898"/><path class="hdoor" d="M{cx+20} {cy+ch} V{cy+ch-12} a4 4 0 0 1 8 0 V{cy+ch}Z"/>
      <rect class="hshut" x="{cx+6}" y="{cy+9}" width="2" height="9"/><rect class="hwin" x="{cx+8}" y="{cy+9.4}" width="5" height="8.2" rx="1"/><rect class="hshut" x="{cx+13}" y="{cy+9}" width="2" height="9"/></g>''')
# little white steps between the houses
steps = "M800 246 l10 -6 h8 l10 -6 M860 232 l8 -6 h8 l8 -6 M936 214 l8 -5 h8 l8 -5 M1020 190 l8 -5 h8 l8 -5 M1090 176 l8 -5 h8 l8 -5"
add(f'<path class="steps" d="{steps}"/>')
# trees of the village: cypresses and a pine
add('<ellipse class="cyp" cx="1170" cy="132" rx="5" ry="22" fill="url(#gCyp)"/><ellipse class="cyp" cx="722" cy="226" rx="5" ry="20" fill="url(#gCyp)"/><ellipse class="cyp" cx="1190" cy="150" rx="4.5" ry="17" fill="url(#gCyp)"/>')
add('<g class="eye tap" data-tap="eye"><path class="thread" d="M345 0 V40"/><circle class="eye-o" cx="345" cy="54" r="14"/><circle class="eye-w" cx="345" cy="54" r="9.5"/><circle class="eye-b" cx="345" cy="54" r="6"/><circle class="eye-k" cx="345" cy="54" r="3"/><ellipse class="eye-hl" cx="341" cy="50" rx="3" ry="1.6"/></g>')
add('</g>')                                                                     # par1
# a light haze in front of the village, for depth
add('<rect class="mist" x="600" y="212" width="600" height="50" fill="url(#gHaze)" opacity=".5"/>')

add('<rect class="vig" x="-300" y="-110" width="1800" height="372" fill="url(#gVig)"/>')
add('<rect class="grain grain-l" x="-300" y="-110" width="1800" height="372" filter="url(#grainL)"/><rect class="grain grain-d" x="-300" y="-110" width="1800" height="372" filter="url(#grainD)"/>')
new_inner = "\n    ".join(out)
html = (ROOT / "index.html").read_text(encoding="utf-8")
a = html.index('<svg class="scene"')
open_end = html.index(">", a) + 1
fest_start = html.index('<g class="fest fest-easter">', a)
svg_end = html.index("</svg>", fest_start)
fest = html[fest_start:svg_end]
html = html[:open_end] + "\n    " + new_inner + "\n  " + fest + html[svg_end:]
(ROOT / "index.html").write_text(html, encoding="utf-8")
print("scene written:", len(new_inner) // 1024, "KB")
