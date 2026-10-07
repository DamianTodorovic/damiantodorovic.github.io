---
version: 1
slug: "vault-html"
primary_target: "vault.html"
related_targets: []
---

# vault.html — surface brief

Mode: persuade. Seed key: 4a7bca46 (scope surface, mode persuade, dealt indices 7, 5, 4 — 7 leads).
Visual world: inherited, not invented. `design/DESIGN.md` v3 "Der Tresor aus poliertem Glas"
governs every token; `design/MOTION.md` governs the motion. Run is unattended — the owner said
twice "nicht fragen, bauen" — so the dealt lead structure is taken instead of opening the
lock-one round. Alternates stay named below so the choice remains reversible.

## THESIS

The page is the vault's front: one glass sheet with a living memory graph behind it, and the
product's own search field on top. The visitor does not read about a memory layer; they watch a
memory being set, retrieved, corrected, and proven — and they can drive it from the masthead.
Persuasion by demonstration. Confidentiality is the matter: you see that it holds something,
never what.

## OWN-WORLD

Not a mood. The material is DESIGN.md's: Tiefsee `#0a0c12` and Porzellan `#eef0f5`, exactly one
accent, Stahlblau `#3e63dd`, reserved for action, active state and focus. Type-edge hairlines in
blue/violet/green, never badge walls. Radius is hierarchy: panel 20, card 14, field 10, chip 7,
badge 5 — nothing shares a radius. Depth is one glass sheet per layer; a lens (the search result,
the chain strip) is thick glass with one large shadow and is never stacked on another.
Display type is capped at 28px on purpose: the graph carries the size, not the headline.
SF Pro system stack per DESIGN.md; the page therefore ships no font files and makes no external
request.

## STORY

Seven beats, one per scroll band of the pinned stage, each with exactly one main event, all of
them computed from scroll progress — a pure function of position, so any single frame is
determined and nothing moves without a cause:

1. Forgetting — labels dissolve, edges retract. The pain the product names.
2. The record stays — one node settles, edges draw out from it.
3. Retrieval — the graph arrives, one node lifts, its edges brighten, the rest recedes.
4. Provenance and time — the lifted node shows source, act file, valid-since.
5. Superseded — the old version falls to residual weight and stays visible, marked SUPERSEDED.
6. The chain — entries append and point to their predecessor; a reach-back prints the break.
7. One client, one door — the graph settles thin; the clients and the six advertised tools stand.

Between beats the surface changes by hard edge, not by crossfade, and the rhythm is
Tiefsee → glass → Tiefsee. Only then the record, measured: one index strip with a single dominant
number, the two tiers, the limits that are still open, the footer with the real mark.

## FIRST VIEWPORT

Full-bleed dark base with ambient light from the upper left. One content panel (radius 20) holds
the SVG memory graph behind polished glass — nine demo nodes, hairline edges, no caption on the
nodes larger than 13px. On the glass, top-left: the wordmark and the masthead search field
(radius 10), which is the one lensing-glow location. Under it, the sentence in the shipped voice
at 28px: "Your AI forgets. KEPTA keeps the record." Then 13px: one encrypted memory on your own
machine, shared by every assistant, no cloud, no account. Two actions: "Download the app" (steel
blue) and "Read the source" (quiet). No metric, no eyebrow, no badge.

## FORM

Grid: 1180px content column, stage full-bleed with the panel inset 24px. Masthead sticky and
short. Prose measure 65–75ch at a 15.5px reading step (one step added to DESIGN.md's UI scale for
long text; UI stays at 11/13, cards at 14.5, display capped at 22–28). Meta lines built by
hierarchy and spacing, never `A · B · C`. Motion on compositor properties only — transform and
opacity, plus stroke-dashoffset for edge draw; no blur filter over large areas, no canvas that
changes size mid-run, `will-change` never on a scaled or text-bearing surface. Reduced motion
renders every beat's end state as static content — the same facts, no transitions, nothing
removed.

## FINISH

Light and dark both maintained and both tested. Keyboard focus visible everywhere, real hover and
disabled states, "No matches" explains and offers the next step. Contrast ≥4.5:1 for body text
behind glass in both themes. Proven numbers only: 474 tests in 36 files, green in under twenty
seconds on an M-series laptop; SQLCipher 4 / AES-256 at `~/.kepta/kepta.db`; BM25 + trigram
vectors + entity graph fused at k=60; six advertised MCP tools; protocol 2026-07-28; two tiers,
Core 0 € and Enterprise by contract. The word for the old middle tier does not appear. No
certificates, no customers, no invented percentages. Demo nodes are labelled as demo.
Verification before any report: frame-time probe, reduced-motion run with the media-query guard,
widths 1440/1024/820/390 read as screenshots by hand.

## Alternates (dealt, not taken)

- Structure 5 — **The chain as spine**: the whole page is one sealed ledger, each section an
  entry pointing at its predecessor, the tamper break as the closing argument. Strongest on
  proof, weakest on reach; the reader cannot see the memory itself.
- Structure 4 — **One field, one answer**: the page opens as a giant search and every scroll band
  is a different query the record answers. Strongest on the product's core act, weakest on the
  confidentiality story — the vault disappears behind the query.

## Catalog challengers from the roll

Sneaker archive wall, brick build-instruction book, HyperCard shoebox stack, drum-machine step
row. All four lose on product clarity for a surface whose buyer is under a duty of
confidentiality: none of them can show a record being kept. Kept from them, as named raises —
from the archive wall the discipline of total commitment to one material, from the step row the
discipline of a fixed grid where every column position means something. Both are already
DESIGN.md's own law (one glass sheet per layer; radius as hierarchy), so the assignment holds.

## GEBAUT — was von der Vorgabe abweicht, und warum

- **Ein Leseschritt mehr.** DESIGN.md skaliert 11 / 13 / 14,5 / 22–28. Für Fließtext auf
  einer Verkaufsfläche ist 13 zu eng (65–75ch sind bei 13px über 90 Zeichen in dieser Breite),
  die Fläche hat deshalb 15,5px als Lesestufe. UI, Meta und Karten bleiben auf den Stufen der Marke.
- **Der Index-Streifen bleibt bei 28px.** DESIGN.md verlangt eine dominante Zahl *und* deckelt
  Display bei 28. Die Dominanz kommt aus Gewicht, Isolation und der zurückgesetzten Einheit,
  nicht aus Größe. Kein 64px-Klotz.
- **Schlag 7 hat eine eigene Bewegung.** Die Messung fand tote Zeit auf den letzten 15 % des
  Erzählwegs: das Feld zog sich nicht zusammen. Jetzt sammelt sich die Ebene zum Hub hin
  (6 % Maßstab, 20 % Licht) und übergibt damit an die Tür unterhalb.
- **Telefon: das Feld ist unbenannt, bis etwas gehoben wird.** Neun betitelte Knoten passen bei
  390 px nicht ohne Überlagerung. Beschriftet wird, was im Fokus steht oder das beste Suchergebnis;
  der Rest ist Glas. Die Sonde prüft Textplatten, die aufeinanderliegen, bei jeder Breite.
- **Reduced Motion ist eine andere Setzung, nicht eine eingefrorene.** Ohne Pinning stapelt sich
  die Fläche: Graphenband, Wort, Nachweis, dann alle sieben Zustände im Fluss. Kein Inhalt fehlt.
- **Vom Detector gemeldet und gehalten:** `dark-glow` (der Lensing-Glow am Suchfeld ist der
  ausdrücklich erlaubte zweite mutige Ort), `tiny-text` (11px ist die Meta-Stufe der Marke),
  `aphoristic-cadence` (die Stimme der ausgelieferten Seite). `cramped-padding` ist ein Fehlurteil:
  gemessener Abstand vom Rand zum ersten Kind beträgt 63 px.
