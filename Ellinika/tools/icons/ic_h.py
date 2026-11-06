from ic_lib import *
add("📏", g('<g transform="rotate(-35 16 16)"><rect x="1" y="9" width="30" height="14" rx="2" fill="#F5C518" stroke="#00000038" stroke-width=".8"/>%s</g>' % "".join('<path d="M%s 9 V%s" stroke="#7A5A10" stroke-width="1.2"/>' % (x, 14 if i % 2 else 16) for i, x in enumerate(range(4, 31, 3)))))
