#!/usr/bin/env python3
# Bringt die große Fassung vom 29.09. auf den heutigen Stand — nur Aussagen, keine Gestaltung.
# Jede Ersetzung muss genau einmal treffen, sonst bricht das Skript laut.
import json, re, sys

P = "index.html"
s = open(P, encoding="utf8").read()
vorher = len(s)
protokoll = []

LIVE = open("/tmp/live.html", encoding="utf8").read()
def live_text(frage):
    """holt den heutigen Antworttext aus der ausgelieferten Seite"""
    m = re.search(r"<h3>" + re.escape(frage) + r"</h3>\s*<p>(.*?)</p>", LIVE, re.S)
    if not m:
        raise SystemExit("keine Vorlage in der Live-Seite für: " + frage)
    return re.sub(r"\s+", " ", m.group(1)).strip()

def tausche(old, new, ort):
    global s
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"BLOCK: „{ort}“ — Ankertext {n}× gefunden, erwartet 1×: {old[:70]}")
    s = s.replace(old, new)
    protokoll.append(ort)

def region(start, ende, neuer_text, ort):
    """ersetzt alles zwischen zwei eindeutigen Ankern (inklusive) """
    global s
    i, j = s.find(start), s.find(ende)
    if i < 0 or j < 0 or j < i or s.count(start) != 1 or s.count(ende) != 1:
        raise SystemExit(f"BLOCK: Region „{ort}“ nicht eindeutig (start {i}, end {j})")
    s = s[:i] + neuer_text + s[j + len(ende):]
    protokoll.append(ort)

# ---------- Kopf: Lizenz, Vorschaubild, Publikum
tausche("Open core, AGPL-3.0.", "Open core, BUSL-1.1.", "og:description Lizenz")
tausche('<meta property="og:image" content="https://damiantodorovic.github.io/og-image.png">',
        '<meta property="og:image" content="https://damiantodorovic.github.io/og-image.jpg">',
        "og:image Datei")
tausche('<meta property="og:image:alt" content="KEPTA - local, encrypted memory for your AI, with the three tiers Core, Pro and Enterprise">',
        '<meta property="og:image:alt" content="KEPTA - Your AI forgets. KEPTA keeps the record. One encrypted memory on your own machine, no cloud, no account; along the bottom: SQLCipher 4 AES-256, 8 MCP tools, 474 tests, free forever under BUSL-1.1">',
        "og:image:alt Stufen")
tausche("  Audience  Developers and power users (Pro), practices and organizations (Enterprise).",
        "  Audience  Developers who run the engine themselves, and practices or organizations that need it governed.",
        "Kommentar Publikum")

# ---------- JSON-LD: SoftwareApplication und FAQPage
m = re.search(r'<script type="application/ld\+json">\s*(\{[\s\S]*?\})\s*</script>', s)
if not m:
    raise SystemExit("BLOCK: erstes JSON-LD-Objekt nicht gefunden")
app = json.loads(m.group(1))
if app.get("@type") != "SoftwareApplication":
    raise SystemExit("BLOCK: erstes JSON-LD-Objekt ist keine SoftwareApplication")
app["license"] = "https://spdx.org/licenses/BUSL-1.1.html"
app["downloadUrl"] = "https://github.com/DamianTodorovic/kepta/releases/latest"
if "operatingSystem" in app:
    app["operatingSystem"] = "macOS (desktop app), Windows and Linux (engine)"
neu_app = '<script type="application/ld+json">\n' + json.dumps(app, indent=2, ensure_ascii=False) + "\n</script>"
s = s[:m.start()] + neu_app + s[m.end():]
protokoll.append("JSON-LD SoftwareApplication (Lizenz, Download, Betriebssystem)")

block = re.compile(r'<script type="application/ld\+json">\s*([\s\S]*?)\s*</script>')
stellen = [(mm.start(1), mm.end(1), mm.group(1)) for mm in block.finditer(s)]
def objekt_typ(text): 
    try: return json.loads(text).get("@type", "")
    except Exception: return ""
wo = [(i, e, t) for (i, e, t) in stellen if objekt_typ(t) == "FAQPage"]
if len(wo) != 1:
    raise SystemExit("BLOCK: FAQPage-JSON-LD nicht eindeutig (" + str(len(wo)) + ")")
i, e, text = wo[0]
faq = json.loads(text)
STREICHEN = {"Is there a trial?", "What happens without a license key?", "How does the 14-day refund work?"}
F = faq["mainEntity"]
F[:] = [q for q in F if q["name"] not in STREICHEN]
def frage(name, text):
    return {"@type": "Question", "name": name,
            "acceptedAnswer": {"@type": "Answer", "text": text}}
F.append(frage("Is it really free?", live_text("Is it really free?")))
F.append(frage("Where do the benchmark numbers come from?", live_text("Where do the benchmark numbers come from?")))
F.append(frage("What is KEPTA Enterprise?",
               "The same engine as an organization infrastructure: tenant memory behind one wall, a tamper-evident "
               "audit chain with one-click verification, human review for agent writes, point-in-time recovery, "
               "scope per key and per-tenant keys. Self-hosted, firewall or air-gapped. Licensed by agreement."))
neu_faq = json.dumps(faq, indent=2, ensure_ascii=False)
s = s[:i] + neu_faq + s[e:]
protokoll.append("JSON-LD FAQPage (Trial, Lizenzschlüssel, Erstattung hinaus; drei heutige Fragen herein)")

# ---------- Downloadwege: das Pro-Release-Repo gibt es nicht mehr
n = s.count("DamianTodorovic/kepta-pro-releases")
if n == 0:
    raise SystemExit("BLOCK: kein Pro-Release-Repo mehr gefunden — war das schon erledigt?")
s = s.replace("DamianTodorovic/kepta-pro-releases", "DamianTodorovic/kepta")
protokoll.append(f"Download-Repo {n}× auf kepta umgestellt")

# ---------- Hero und Kennzahlenleiste
tausche('<p class="hero-meta blur-in d4">macOS and Windows &nbsp;&#183;&nbsp; One free Pro day with every download &nbsp;&#183;&nbsp; Core is AGPL-3.0, free forever</p>',
        '<p class="hero-meta blur-in d4">macOS &#8212; Apple silicon and Intel &nbsp;&#183;&nbsp; No account, no card, no key &nbsp;&#183;&nbsp; The engine is BUSL-1.1, free forever</p>',
        "Hero-Zeile (Betriebssystem, Probetag, Lizenz)")
tausche("<div><b>AGPL-3.0</b><span>Open core</span></div>",
        "<div><b>BUSL-1.1</b><span>Open core</span></div>", "Kennzahlenleiste Lizenz")

# ---------- Produktsätze ohne die Pro-Stufe
tausche("KEPTA Pro is the desktop app on the same engine", "KEPTA is the desktop app on the same engine",
        "Produktsatz")
tausche("Screenshots show KEPTA Pro on a demo corpus", "Screenshots show the app on a demo corpus",
        "Bildhinweis")
tausche('<span class="num">Plate I</span>The shield inside KEPTA Pro.',
        '<span class="num">Plate I</span>The shield inside the app.', "Plattentitel Schild")
for alt in ["KEPTA Pro knowledge graph", "KEPTA Pro activity feed", "KEPTA Pro privacy shield"]:
    tausche('alt="' + alt, 'alt="' + alt.replace("KEPTA Pro", "KEPTA"), "Bildtext: " + alt)

# ---------- Preissektion: zwei Stufen, mit den offenen Linien
PREISE = """<h2 class="rv" style="margin-top:22px">Free on your own machine, or under contract.</h2>
        </div>
        <p class="lead rv d1">Everything that makes the memory smart lives in the free engine. There is no tier inside it, and nothing that locks you out later.</p>
      </div>

      <div class="terms rv d2" style="margin-top:56px">
        <div class="term feature">
          <h3>Core<span class="badge">Start here</span></h3>
          <p class="who">Everyone — download and use</p>
          <p class="amt">&euro;0<em>forever — no account, no contract, no remote</em></p>
          <p class="body">The whole desktop app: knowledge graph, chat with your memory, Today, privacy shield, dossiers. For agents and scripts the same engine ships headless — the MCP server, the HTTP API, the Python client. Source available under BUSL-1.1.</p>
          <p class="buyline"><a href="https://github.com/DamianTodorovic/kepta/releases/latest">Download for macOS (Apple silicon and Intel)</a></p>
        </div>

        <div class="term">
          <h3>Enterprise</h3>
          <p class="who">Organizations</p>
          <p class="amt">By agreement<em>Shaped to your size</em></p>
          <p class="body">The same engine as an organization infrastructure: tenant memory behind one wall, a tamper-evident audit chain with one-click verification, human review for agent writes, point-in-time recovery, scope per key and per-tenant encryption keys. Self-hosted, firewall or air-gapped.</p>
          <p class="buyline"><a href="mailto:damian2212todi@gmail.com">damian2212todi@gmail.com</a><br><a href="https://www.linkedin.com/in/damian-todorovic-244235434">Talk to Damian on LinkedIn</a></p>
        </div>
      </div>

      <p class="fine rv d3" style="margin-top:30px">Four lines on the enterprise side are still open: a tool filter per key, read parity for <code>memory_list</code> and <code>memory_graph</code> at the MCP door, the <code>asOf</code> parameter there, and the <code>private</code> shield. If one of them is load-bearing for you, ask before you sign."""
region('<h2 class="rv" style="margin-top:22px">One engine. Three ways to run it.</h2>',
       'Core is never crippled to sell Pro: what we sell is how you use it.</p>', PREISE, "Preissektion zwei Stufen")
tausche(".terms{display:grid; grid-template-columns:repeat(3,minmax(0,1fr));",
        ".terms{display:grid; grid-template-columns:repeat(2,minmax(0,1fr));", "Preisgitter zwei Spalten")

# ---------- FAQ-Sichttexte: die drei toten Fragen durch heutige ersetzen
for nr, titel in [("03", "Is there a trial?"), ("05", "What happens without a license key?"), ("06", "How does the 14-day refund work?")]:
    i = s.find('<span class="n" aria-hidden="true">' + nr + "</span><h3>" + titel + "</h3>")
    if i < 0:
        raise SystemExit(f"BLOCK: FAQ-Frage {nr} ({titel}) nicht gefunden")
    anfang = s.rfind("<article", 0, i)
    ende = s.find("</article>", i) + len("</article>")
    neue_frage = {"03": ("Is it really free?", "Is it really free?"),
                  "05": ("Where do the benchmark numbers come from?", "Where do the benchmark numbers come from?"),
                  "06": ("What is KEPTA Enterprise?", None)}[nr]
    text = live_text(neue_frage[1]) if neue_frage[1] else (
        "The same engine as an organization infrastructure: tenant memory behind one wall, a tamper-evident audit "
        "chain with one-click verification, human review for agent writes, point-in-time recovery, scope per key and "
        "per-tenant keys. Self-hosted, firewall or air-gapped. Licensed by agreement.")
    s = s[:anfang] + ('<article class="qa"><div class="q"><span class="n" aria-hidden="true">' + nr +
                      "</span><h3>" + neue_frage[0] + "</h3></div><p>" + text + "</p></article>") + s[ende:]
    protokoll.append("FAQ sichtbar " + nr + " → " + neue_frage[0])

# ---------- Kernabschnitt: Lizenz und Zahl
tausche("The memory engine is AGPL-3.0 and free forever.",
        "The memory engine is BUSL-1.1 and free forever (converts to AGPL-3.0 four years after each release).",
        "Kernsatz Lizenz")
tausche("1,500+ automated tests in the desktop app, 439 in this open core.",
        "1,500+ automated tests in the desktop app, 474 in this open core.", "Kernsatz Testzahl")

# ---------- Rechtliches: kein Verkauf, also keine Kauf-Apparatur
RECHT = """<p class="lead rv d1">KEPTA is operated by Damian Todorovic, Germany. Nothing here is sold through a checkout: the engine is free, the enterprise side is a contract.</p>
      </div>

      <div class="legal-grid rv d2" style="margin-top:56px">
        <article>
          <h3>Imprint</h3>
          <p>KEPTA is operated by Damian Todorovic, Germany. Contact: <a href="mailto:damian2212todi@gmail.com">damian2212todi@gmail.com</a>. Not affiliated with Anthropic, Google or Cursor.</p>
          <h4>License</h4>
          <p>The engine is source-available under BUSL-1.1: every line public, production use inside your own organization always allowed, offering it as a hosted service is reserved. Each version converts to AGPL-3.0-or-later four years after its release. The Python client is MIT, standard library only.</p>
        </article>

        <article>
          <h3>Privacy</h3>
          <p>KEPTA runs locally. Your memory stays in one encrypted file on your machine — no telemetry, no cloud, no account, nothing to opt out of.</p>
          <h4>This website</h4>
          <p>This page is a static file served by GitHub Pages. It sets no cookies, runs no analytics, and loads no third-party scripts: its fonts and images are embedded in the page itself.</p>
        </article>

        <article>
          <h3>Security</h3>
          <p>The database is SQLCipher 4 with AES-256 and an HMAC-SHA512 over every page. Every read and write is entered in an append-only journal whose entries point at their predecessor, so an edit after the fact breaks the chain and the break is reported rather than hidden.</p>
          <h4>What is not claimed</h4>
          <p>No certificates, no seals, no customer references. Where a number is shown, it was measured on the commit named beside it and can be run again.</p>
        </article>
      </div>"""
region('<p class="lead rv d1">KEPTA is operated by Damian Todorovic, Germany. Payments are handled by Paddle',
       '<h4>Operator</h4>\n          <p>Damian Todorovic, Germany. Contact: <a href="mailto:damian2212todi@gmail.com">damian2212todi@gmail.com</a></p>\n        </article>\n      </div>',
       RECHT, "Rechtsblöcke ohne Kauf-Apparatur")

# ---------- Fußzeile
tausche('<a href="https://github.com/DamianTodorovic/kepta">Source (AGPL-3.0)</a>',
        '<a href="https://github.com/DamianTodorovic/kepta">Source (BUSL-1.1)</a>', "Fußzeile Lizenz")
for tot in ["Refund Policy", "Terms of Service"]:
    i = s.find('<a href="#legal">' + tot + "</a>")
    if i >= 0:
        s = s[:i] + '<a href="#legal">' + {"Refund Policy": "Security", "Terms of Service": "Imprint"}[tot] + "</a>" + s[i + len('<a href="#legal">' + tot + "</a>"):]
        protokoll.append("Fußzeile: " + tot + " → " + {"Refund Policy": "Security", "Terms of Service": "Imprint"}[tot])

open(P, "w", encoding="utf8").write(s)
print("erledigt, %d Griffe, %d → %d Bytes" % (len(protokoll), vorher, len(s)))
for p_ in protokoll:
    print("  ·", p_)
