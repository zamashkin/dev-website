# Agent guidance for dev-website

## Project overview

This directory contains Aleksandr Zamashkin's personal frontend engineering
portfolio. It is a static, single-page website using HTML, CSS, and vanilla
JavaScript. There is no package manifest, build step, application framework, or
backend. Technologies listed in the page's Stack section describe Aleksandr's
experience, not this project's dependencies.

## File map

- `index.html`: Page content, metadata, analytics, and the Home, Experience,
  Stack, and Contacts sections. Loads the stylesheet and browser script directly.
- `styles.css`: Theme variables, layouts, animations, and responsive overrides.
- `script.js`: Experience-link scrolling, responsive SVG timeline layout, and
  email copying with success/failure feedback and a clipboard fallback.
- `tests/copy-email.test.cjs`: Node.js built-in tests that execute `script.js`
  in a VM with a mocked DOM to verify email-copy behavior.
- `design/adaptive-mocks/`: Four retained mobile and tablet PNG design references.
  See `design/README.md` for their scope and which hero reference takes precedence.
- `my-face-ascii-optimized.webm` and `my-face-poster-optimized.webp`: Hero portrait
  animation and its poster image.
- `Aleksandr_Zamashkin_Frontend.pdf`: Linked CV.
- `favicon.svg` and `link-preview.png`: Browser icon and social preview image.

## Local development

Run commands from the project root. No dependency installation is required.

```sh
# Serve the site locally if Python 3 is available.
python3 -m http.server 8000 --bind 127.0.0.1

# Run the existing tests with a Node.js version supporting node:test.
node --test tests/copy-email.test.cjs

# Check browser JavaScript syntax.
node --check script.js
```

Open `http://127.0.0.1:8000` for a browser preview. Tabler icon fonts are loaded
from jsDelivr, and Google Analytics is loaded externally; these require network
access. There is no configured lint or build command.

## Editing conventions

- Keep changes focused and preserve the plain HTML/CSS/JavaScript architecture
  unless the task calls for a migration or new tooling.
- Match nearby formatting. JavaScript uses two-space indentation, semicolons,
  and mostly single-quoted strings; CSS uses compact rules and custom properties.
- Reuse the theme variables in `:root` and the existing dark terminal-inspired
  visual language, monospace text, cyan accents, and git-style timeline.
- Keep section IDs, links, and JavaScript selectors aligned with the markup.
- Preserve semantic links and buttons, accessible labels, decorative icon
  attributes, clipboard status announcements, and existing reduced-motion styles.
- Preserve portrait playback attributes and the poster fallback when editing
  the hero. Keep local asset references valid.
- Update personal details, contact destinations, CV assets, and analytics
  configuration only when relevant to the requested change.
- Inspect the working tree before editing and preserve unrelated user changes.
  Do not add generated screenshots, temporary files, or `.DS_Store` to changes.

## Responsive layout and behavior

CSS switches layouts at 1099px, 640px, and 375px. JavaScript switches the timeline
at widths below 1100px and at 640px or less. Keep these thresholds consistent.
The timeline uses absolutely positioned cards and SVG connectors whose geometry
is calculated from card heights. Review both CSS and `layoutTimeline` when
changing card dimensions, spacing, or the number of jobs. Preserve resize
handling through `requestAnimationFrame` and `ResizeObserver`.

Email copying first tries `navigator.clipboard.writeText`, then falls back to a
temporary textarea and `document.execCommand('copy')`. Keep confirmed-success
feedback, failure/retry behavior, concurrent-click protection, textarea cleanup,
focus restoration, and the single label-reset timer intact.

## Verification

- For JavaScript changes, run the syntax check and existing tests. Extend tests
  when changing meaningful clipboard behavior.
- For content or layout changes, preview desktop, tablet (768px), and mobile
  (390px) widths. Check nearby breakpoint widths when changing responsive rules.
- In the browser, check timeline alignment, card overlap, horizontal overflow,
  hero media, section navigation, CV/contact links, and keyboard interaction as
  relevant to the change.
- The Node tests cover clipboard logic, not real-browser layout or clipboard
  permissions. Report which checks ran and any checks that could not be run.
