#!/usr/bin/env python3
# Ersetzt die vier als base64 eingebetteten Produktplatten durch die heutigen Aufnahmen.
# Die Bilder gehören in die Datei hinein (die Seite trägt alles in einem Wort), also:
# PNG → JPEG 1600×960 → base64, in dasselbe <img>-Element, dessen alt-Text ihn nennt.
import base64, io, os, re, sys
from PIL import Image

QUELLEN = {
    "KEPTA knowledge graph": "03-graph.png",
    "KEPTA activity feed": "09-activity.png",
    "KEPTA privacy shield": "11-privacy.png",
    "the interface": "01-index.png",          # dieser Teller hat keinen KEPTA-Pro-alt
}
ORDNER = os.path.expanduser("~/kepta-app/docs/screenshots")
P = "index.html"
s = open(P, encoding="utf8").read()
protokoll = []

def codiere(datei, ziel_kb):
    img = Image.open(os.path.join(ORDNER, datei)).convert("RGB")
    if img.size != (1600, 960):
        img = img.resize((1600, 960), Image.LANCZOS)
    q = 80
    for _ in range(14):
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
        kb = len(buf.getvalue()) * 4 / 3 / 1024
        if kb <= ziel_kb:
            break
        q -= 5
    return base64.b64encode(buf.getvalue()).decode("ascii"), q, len(buf.getvalue())

# Reihenfolge im Blatt: privacy (637), interface (720), graph (723), activity (726)
REIHENFOLGE = [("KEPTA privacy shield", 200), ("the interface", 250),
               ("KEPTA knowledge graph", 250), ("KEPTA activity feed", 180)]
for alt, ziel_kb in REIHENFOLGE:
    datei = QUELLEN[alt]
    muster = re.compile(r'(<img decoding="async" src="data:image/jpeg;base64,)([A-Za-z0-9+/=]+)(" [^>]*alt="' + re.escape(alt) + r')')
    m = muster.search(s)
    if not m:
        # der Interface-Teller nennt im alt die App, nicht KEPTA — zweiter Versuch über die Bar-Beschriftung
        muster = re.compile(r'(<span>the interface</span></div><img decoding="async" src="data:image/jpeg;base64,)([A-Za-z0-9+/=]+)(")')
        m = muster.search(s)
        alt = "the interface"
    if not m:
        raise SystemExit("BLOCK: Teller nicht gefunden: " + alt)
    neu, q, roh = codiere(datei, ziel_kb)
    s = s[:m.start(2)] + neu + s[m.end(2):]
    protokoll.append("%-24s ← %-16s  JPEG q%d  %d KB Rohdaten, %d KB base64 (vorher %d KB)"
                     % (alt, datei, q, roh // 1024, len(neu) // 1024, len(m.group(2)) // 1024))

open(P, "w", encoding="utf8").write(s)
print("\n".join("  · " + p for p in protokoll))
print("Datei jetzt %d Bytes" % len(s))
