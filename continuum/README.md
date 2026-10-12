# KEPTA — Continuum

English motion-design website. A local review candidate, not a published replacement
for the existing home page. The preview deliberately uses `noindex,nofollow`.

## Preview

From the website repository:

```sh
python3 -m http.server 8199 --bind 127.0.0.1
```

Open <http://127.0.0.1:8199/continuum/>. Serve over HTTP; opening the HTML through
`file://` prevents browsers from loading the ES modules correctly.

No build, package installation, CDN or API key is required. The page uses the
repository's existing fonts in `../assets/fonts/` and favicon in `../favicon.svg`.

## Files

- `index.html`: English content, real setup links, semantic controls, static story.
- `styles.css`: typography, responsive layouts, motion preferences and fallback.
- `app.js`: scroll choreography, sample-memory interaction, command copying.
- `sculpture.js`: native WebGL mesh, lighting and scroll-driven transformations.

The interactive memory examples are explicitly labelled illustrations. They do
not call a live KEPTA database. The setup button copies a command; it does not run
anything on the visitor's computer. Enterprise contact opens the founder's public
LinkedIn profile. The Mac link opens the real GitHub release page.

## Content basis

The accompanying workspace report is `design/KEPTA-WEBSITE-IST-2026-10-07.md`.
The site distinguishes the free, source-available memory core from the desktop
app and Enterprise. It makes no benchmark, customer, certification or unlimited
desktop-app claims. Optional semantic search requires a local embedding model.

## Motion and resilience

Native scrolling drives the sculpture and scene transitions. Pointer movement
adjusts the view on mouse devices. There is no automatic infinite animation,
audio, tracking, external font request or scroll interception. Rendering stops
when the page settles or becomes hidden. Reduced motion provides a static
story. Short viewports also use the static story so sticky scenes never trap
content or keyboard focus outside the visible area. Without JavaScript the content and setup command remain available;
inactive interactive controls are disabled. Without WebGL, or after context
loss, the inline SVG takes over.

## Review artifacts

Screenshots and browser checks are saved outside the website under the workspace
`web-qa/continuum/`. `check.mjs` uses the local headless Chromium CDP endpoint and
creates/closes only its own target. Run it against a local preview server.

Publishing requires Damian's explicit approval. Before publishing, decide the
final URL, replace preview robots metadata, add matching social/canonical metadata,
and integrate into the main entry point. No deployment is part of this change.
