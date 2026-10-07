#!/usr/bin/env python3
# Wandelt die frischen App-Aufnahmen in die WebP-Platten der Webseite.
# Qualität 82, Methode 6; die Maße werden ausgegeben, damit width/height im
# Markup nicht raten müssen.
from PIL import Image
import os

quelle = os.path.expanduser("~/kepta-app/docs/screenshots")
ziel = "assets/img"
namen = ["07-today", "01-index", "03-graph", "04-editor"]
os.makedirs(ziel, exist_ok=True)
for n in namen:
    p = os.path.join(quelle, n + ".png")
    img = Image.open(p).convert("RGB")
    w, h = img.size
    if w != 1600:
        img = img.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
        w, h = img.size
    out = os.path.join(ziel, n + ".webp")
    vorher = os.path.getsize(out) if os.path.exists(out) else 0
    img.save(out, "WEBP", quality=82, method=6)
    print(f"{n}.webp  {w}x{h}  {os.path.getsize(out)//1024} KB  (vorher {vorher//1024} KB)  Quelle {os.path.getmtime(p):.0f}")
