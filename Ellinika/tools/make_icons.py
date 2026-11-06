"""Make the app icons (icons/*.png) with plain Python: a white Omega on the navy square of the browser-tab icon.
   python -X utf8 tools/make_icons.py
   icon-192.png, icon-512.png: rounded corners ("any"); maskable-512.png: full square, smaller Omega (the phone cuts its own shape);
   apple-touch-icon.png: 180 px, full square. No library needed."""
import math, pathlib, struct, zlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "icons"
NAVY = (0x1E, 0x43, 0x6A)

def in_omega(x, y):
    """x, y in 0..1 (the Omega is drawn in the middle)."""
    cx, cy, R, r = .5, .44, .27, .17
    d = math.hypot(x - cx, y - cy)
    if R >= d >= r and y <= .54: return True                      # the ring, open at the bottom
    for s in (1, -1):                                              # the two legs and feet (mirror)
        u = (x - .5) * s                                           # distance from the middle, on the right side
        if .70 <= y <= .765 and .17 <= u <= .41: return True       # foot
        if .54 <= y <= .70:
            t = (y - .54) / .16                                    # leg: from the ring end to the foot
            lo = .14 - .02 * t
            hi = .25 + .08 * t
            if lo <= u <= hi: return True
    return False

def render(size, rounded, zoom, ss=2):
    rows = []
    rad = size * .22
    for py in range(size):
        row = bytearray()
        for px in range(size):
            acc = cov = 0
            for sy in range(ss):
                for sx in range(ss):
                    X, Y = px + (sx + .5) / ss, py + (sy + .5) / ss
                    inside = True
                    if rounded:                                    # rounded corners
                        qx, qy = min(X, size - X), min(Y, size - Y)
                        if qx < rad and qy < rad and math.hypot(rad - qx, rad - qy) > rad: inside = False
                    if not inside: continue
                    cov += 1
                    u, v = (X / size - .5) / zoom + .5, (Y / size - .5) / zoom + .5
                    if in_omega(u, v): acc += 1
            a = 255 * cov // (ss * ss)
            w = acc / cov if cov else 0
            c = tuple(round(NAVY[i] + (255 - NAVY[i]) * w) for i in range(3))
            row += bytes((*c, a))
        rows.append(b"\x00" + bytes(row))
    return rows

def png(path, size, rows):
    def chunk(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    data = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)) \
        + chunk(b"IDAT", zlib.compress(b"".join(rows), 9)) + chunk(b"IEND", b"")
    path.write_bytes(data)

if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for name, size, rounded, zoom in (("icon-192.png", 192, True, 1.0), ("icon-512.png", 512, True, 1.0), ("maskable-512.png", 512, False, .78), ("apple-touch-icon.png", 180, False, .95)):
        png(OUT / name, size, render(size, rounded, zoom)); print("made", name)
