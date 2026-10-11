# PRODUCT.md — KEPTA

Entwickelt aus: `AGENTS.md`, `design/DESIGN.md` v3, der ausgelieferten
`github.io/index.html` und `trust.html`, dem Zahlenregister im Kernrepo.
Produktwahrheit nur — visuelle Entscheidungen gehören zu DESIGN.md.

## Was es ist

KEPTA ist ein lokaler, verschlüsselte Memory-Layer für KI-Agenten. Ein Kernpaket
(`kepta-mcp`) liefert die Werkzeuge über MCP; ein Enterprise-Server stellt
Mandanten-Wand, versiegelte Audit-Kette und Menschenschleuse dazu.

## Wer es kauft und wer es benutzt

Käufer: Menschen mit Berufsgeheimnis — Kanzleien, Praxen, Beratung,
Verantwortliche in Unternehmen, die Agenten einführen wollen, ohne den Bestand
einem Dritten zu geben. Benutzer: dieselben, plus ihre Entwickler, in Claude
Desktop, Cursor, Windsurf/VS Code, Gemini CLI/Cline, Zed/Codex/Continue oder
Skripten über HTTP.

## Die Aufgabe, die gelöst wird

Der Assistent fängt jeden Tag bei null an. Was gestern entschieden wurde, muss
heute erneut erklärt werden — und niemand kann sagen, wer was wann gesetzt hat.
KEPTA macht aus diesen Entscheidungen einen nachweisbaren Bestand auf der eigene
Platte.

## Womit es wirbt — nur Belegtes

- Ein Knoten ist ein Gedanke mit Typ, Gewicht und Gültigkeit, nicht ein Textfeld.
- Herkunft ist Teil des Satzes: Mensch, Agent oder Import, aus einer benannten Akte.
- Abfragen auf einen vergangenen Stand sind normales Handwerk.
- Ein ersetzter Knoten bleibt nachweisbar erhalten; er fällt auf einen
  Restgewicht, er verschwindet nicht.
- Abruf ist Rangfolge vor Wortlaut: BM25, Trigramm-Vektoren und Entitäten-Graph
  werden getrennt bewertet und bei k=60 verschmolzen.
- Bestand: SQLCipher 4, AES-256, eine Datei unter `~/.kepta/kepta.db`.
- Jeder Lese- und Schreibzugriff wird eingetragen; jeder Eintrag zeigt auf seinen
  Vorgänger. Ein nachträglicher Eingriff bricht die Kette, und der Bruch wird
  gemeldet.
- Die MCP-Tür wirbt sechs Werkzeuge an: `memory_search` lesend,
  `memory_save`, `memory_update`, `memory_delete`, `memory_forget`,
  `memory_consolidate` schreibend. Was der Katalog nicht wirbt, wird
  abgewiesen statt ignoriert. Schreibwege gehen durch dieselbe Menschenschleuse
  wie der REST-Weg; auf `review` oder `approve` antwortet die Tür mit einer
  Aktennummer und ohne Wirkung.
- Suite auf dem aktuellen Engine-Commit: **977 ausgeführte Fälle in 79 Dateien** (Lauf 11.10.2026 23:26, `npm run test:cov`, 3 übersprungene nicht gezählt, `node scripts/doku-check.mjs` grün), grün in unter
  zwanzig Sekunden auf einem M-Series-Laptop.
- Protokollstand 2026-07-28; MCP über stdio aus npm, HTTP über `POST /api/mcp`.

## Stufen

Nur zwei. **Core**: 0 €, für immer, eigener Rechner, kein Konto, kein Vertrag,
kein Fern. **Enterprise**: Vertrag pro Mandant. Die frühere Mittelstufe „Pro"
gibt es nicht mehr; dieses Wort darf auf keiner Fläche erscheinen.

## Was nicht behauptet wird

Keine SSO- oder MDM-Anbindung. Keine Zertifizate, keine Siegel, keine
Kundennamen, keine Referenzen, keine erfundenen Prozentwerte oder
Vergleichszahlen. Wettbewerber-Zertifikate sind Selbstauskunft; nach außen hält
ein Satz, dass Nachweise gemessen und nachfahrbar sind, nicht dass alles besser
sei.

## Grenzen, die offen sind

Werkzeug-Filter je Key, Lese-Parität für `memory_list`/`memory_graph` und `asOf`
an der MCP-Tür, und das Agentenschild `private` sind nicht fertig. Wer „kann
schon alles" schreibt, verkauft diese Zeilen als erledigt.

## Leistungsgrenze der Fläche

Kein Raymarch, kein `filter: blur()` auf großen Flächen, kein Canvas, der im
Betrieb seine Größe wechselt. Maßstab: 16,7 ms Mittel, p95 unter 16,8 ms, kein
Bild über 26 ms bei zwei Gerätepixeln. Reduced Motion zeigt dieselben Zustände
ohne Übergänge. Kontrast 4,5:1 auch hinter Glas.

## Sprache der Fläche

Englisch (`lang="en"`), formelle Anrede, kurz und konkret. Deutsch nur in der
Absprache mit Damian.
