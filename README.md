# chest.so Site

Static marketing site for Chest — the open source terminal ecosystem.

## Local Preview

```bash
./serve.sh
# Open http://localhost:8080
```

Or any static file server:

```bash
npx serve .
python3 -m http.server 8080
```

## Formatting

```bash
make format
```

Runs [Prettier](https://prettier.io) on JS/CSS/HTML/JSON and
[shfmt](https://github.com/mvdan/sh) on shell scripts.

## Architecture

- **No build step** — pure HTML/CSS/JS served as-is.
- `index.html` — single-page site with i18n (`data-i18n` attributes).
- `i18n.js` — translation dictionary (en, zh, fa, ar, th, ru).
- `main.js` — i18n engine, typewriter effect, canvas noise, community section.
- `style.css` — all styles, CSS custom properties for theming.
- User sub-pages live in root-level directories (e.g. `thomasc/`), each with
  a `projects.json` and a boilerplate `index.html` shell.
- `users.css` / `users.js` — shared styles and logic for user sub-pages.
- `users.json` — registry for the community section on the main page.

## Color Palette

Uses [CharmTones](https://github.com/charmbracelet/x/blob/main/exp/charmtone/charmtone.go)
from [Charm](https://charm.land). Key variables in `style.css`:

| Variable | CharmTone | Hex | Role |
|----------|-----------|-----|------|
| `--bg` | Pitch Black | `#000000` | Page background |
| `--bg-card` | Damson | `#007AB8` | Card backgrounds |
| `--link-green` | Guac | `#12C78F` | Links, buttons |
| `--accent-green` | Julep | `#00FFB2` | "New" badge |
| `--card-accent` | Tang | `#FF985A` | Card icons, flair, link hover |
| `--card-title` | Mustard | `#F5EF34` | Card titles |
| `--card-title-hover` | Blush | `#FF84FF` | Card title hover |
| `--card-text` | Soda | `#FBFBFB` | Card body text |
| `--accent` | Cherry | `#FF388B` | Logo `.so`, typewriter cursor |
| `.section-alt` | Grape | `#7134DD` | "Build with Chest" section |
| `.section-motto` | Spinach | `#1C3634` | Motto section, hero overlay |

## Attribution

- Site design inspired by [Charm](https://charm.land).
- Color palette uses [CharmTones](https://github.com/charmbracelet/x/blob/main/exp/charmtone/charmtone.go) from [Charm](https://charm.land).
- Hero and OG banner images: open treasure chest with golden light, public domain stock imagery (no attribution required).
