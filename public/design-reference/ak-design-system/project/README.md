# AK Golf Group — Design System

**Versjon 2.0 · 2026**

AK Golf Group is a Norwegian golf company based in Fredrikstad. Their work spans three pillars:

1. **Coaching** — Golf Academy and Junior Academy. Structured, technology-driven coaching.
2. **Software** — *Spillerportalen* (player portal), an operations platform for golf clubs, and a QR-sign concept. Visual language is modeled on SyncActive's dark-mode dashboard.
3. **Utvikling** (Development) — Consulting-led sports planning for Norwegian golf clubs.

> Vi gjør golf tilgjengelig, utviklende og relevant — for alle nivåer, hele livet.

**Not part of AK Golf Group sub-brands:** WANG Toppidrett and Mulligan Indoor have separate brand identities.

---

## Sources used to build this system

All sources were provided via a mounted `brand-package/` folder; this project copied the relevant files into the root. Key inputs:

| Source | What it provided |
|---|---|
| `brand-package/01-brand-guidelines/AK-Golf-Group-Brand-Guidelines-V2.md` | 11-section brand guideline — identity, logo rules, colors, type, merch, print |
| `brand-package/02-logo-pakke/` | 7 SVG logo variants + full PNG ladder (web / social / print) + favicons + OG image |
| `brand-package/03-fargesystem/` | Full color reference incl. Pantone, CMYK, RGB, dark-mode variants |
| `brand-package/04-typografi/` | Type scale and weight usage for Inter |
| `brand-package/05-design-tokens/` | `design-tokens.css`, `design-tokens.json`, `tailwind-theme.js` |
| `brand-package/06-stitch-prompts/` | 6 Stitch prompts describing the Spillerportal dashboard (dark + light), mobile screens, admin mission board, icons |
| `brand-package/07-mockups/ak-golf-spillerportal.jsx` | High-fidelity React mockup of the main dashboard — **this is the visual source of truth for the app UI** |
| `brand-package/08-maler/` | E-mail signature HTML + social media and print specs |

---

## Index

```
.
├── README.md                      ← you are here
├── SKILL.md                       ← cross-compatible Agent Skill entry point
├── colors_and_type.css            ← base + semantic CSS vars + font import
├── design-tokens.css              ← original design tokens (raw, untouched)
├── design-tokens.json             ← same, JSON form
├── tailwind-theme.js              ← Tailwind theme extension
│
├── assets/
│   ├── logos/                     ← 7 SVG variants + 3 PNG fallbacks
│   ├── favicon/                   ← favicon-32, -192, apple-touch-icon
│   ├── social/                    ← OG image, profile images (square + round)
│   └── reference/                 ← semantic-colors.png, font-comparison.png
│
├── preview/                       ← cards rendered in the Design System tab
│
├── ui_kits/
│   └── spillerportal/             ← the player portal dashboard (dark + light)
│       ├── README.md
│       ├── index.html
│       └── *.jsx
│
└── brand-package/                 (read-only mounted folder; not copied whole)
```

---

## CONTENT FUNDAMENTALS

### Language — **always Norwegian bokmål**
Every surface, internal and external, is written in bokmål. English is explicitly called out as a "don't" in the brand guidelines. Examples pulled directly from the source material:

- *"Hei, Magnus"* (greeting in the player dashboard)
- *"Du har 12-dagers treningsstreak"* (streak banner)
- *"Denne uken"*, *"Forrige uke"*, *"I dag"*
- Weekday abbreviations: `Man · Tir · Ons · Tor · Fre · Lør · Søn`
- Period labels: `Uke · Måned · År · Totalt`
- Section labels: `Aktiviteter · Handicap · Putting · Treningsstatus · Søvnscore · Scoreanalyse · TrackMan Data`
- Tasks / admin: `Vårcamp 2026 · Junior treningsplan Q2 · TrackMan kalibrering · Spillerportalen v2 testing`

### Voice & tone
- **Calm, competent, Scandinavian.** Not hype-y. Short sentences. No exclamation marks in UI.
- **Second-person, informal.** *"Du har…"*, *"Din runde"*. Direct, on a first-name basis.
- **Golf fluency is assumed.** Terms like *HCP, GIR, spredning, opp-ned, iron-spill* appear un-glossed.
- **Numerically grounded.** Copy leans on concrete figures (*78 slag · 245 m · 1.72 putts/hull · 15.9 HCP*) rather than adjectives.
- **Quietly motivational.** Single-word verdicts: `Bra` (8,5 søvnscore), `Bra` (runde-vurdering), `Stabil`, `Svak`, `Topp`. Short, nearly-coach-like. Never "amazing", "crush it", etc.

### Casing
- **Sentence case** for headings, section labels, buttons (*"Ny oppgave"*, not *"NY OPPGAVE"*).
- Proper nouns capitalized (*TrackMan, Gamle Fredrikstad GK, WANG*).
- All-caps reserved for tiny system labels — e.g. `HCP`, `REM`, `GIR`.

### Numbers & units
- **Comma decimal**: `8,5`, `15.9` appears for HCP (standard golf notation — both are in use, but scores/KPIs use comma decimals: *"+5%", "+12%"*).
- Thousands: **dot** or **thin space** (`1.376 kcal`).
- Space before units: `270 slag`, `245 m`, `3t 45m` (*`t` = timer, `m` = minutter*).
- Dates: `Onsdag, 9. april` — weekday first, day.month lowercase.

### Glyphs in condensed UI
Stats rows, nav tabs and task badges use **Lucide SVGs** as pre-text glyphs (16px, 2px stroke, round line-cap, brand-colored). Never decorative, never mid-sentence. Canonical pairings — always icon + number/short label, in this order:
- `<flag-triangle-right>` 68 slag · `<timer>` 3t 45m · `<map-pin>` Gamle Fredrikstad GK · `<heart-pulse>` 32 putts · `<thumbs-up>` Bra · `<star>` 12-dagers streak

Unicode symbols remain valid for **affordances only** — not as icons:
- `▾` (dropdown) · `↗` (open/trend) · `⋯` (more menu) · `✕` (dismiss) · `→` (link) · `●` `•` (status dot)

> **Emoji are forbidden** in product UI, marketing copy, dashboards, slide decks and admin tools. The earlier "pragmatic fallback" guidance is withdrawn — if a glyph is needed, it must be a Lucide SVG.

### Forbidden copy moves
- English in product UI or marketing copy.
- Marketing hype ("game-changing", "revolutionary", "insane").
- Uppercase shouting.
- First-person plural marketing voice (*"We're so excited…"*). Write directly, to the golfer.

---

## VISUAL FOUNDATIONS

### Color vibe
**Deep pine green + electric lime on near-black.** The combination is the single strongest brand signal. The primary `#005840` carries the seriousness; the lime `#D1F843` is used sparingly as accent only — CTA, active state, data highlight.

- **Distribution rule:** 60% primary + surface · 30% text + muted · **10% accent maximum**.
- **Dark mode is primary.** The player portal is dark-mode first; light mode is a mirror. Social media specs literally say *"mørk variant (primær — bruk denne mest)"*.
- No pastels, no bluish-purple gradients, no competing accent colors.

### Type
- **Inter for everything digital** (weights 300-800). No substitutes — *"ikke bruk generiske fonter som Arial"*.
- **The logotype itself is a custom serif** (not Inter). Never recreate the logo in Inter.
- Weight ladder: Light (300) for decorative big numerals · Regular (400) body · Medium (500) labels · SemiBold (600) card titles, buttons · Bold (700) section headings · ExtraBold (800) H1 and KPI numbers.
- Tight leading on large numerals (`1.0–1.1`), generous body leading (`1.6`).

### Spacing
- **Strict 8pt grid.** Every margin, padding, gap is a multiple of 8. `--space-xs: 4` is the only sub-multiple and is used sparingly.
- Card inner padding is typically `16–18px`. Card-to-card gaps are `14–16px`. Section gaps are `24–32px`.

### Corners & cards
- Cards: **16px radius**, solid fill, 1px border.
- Pills/buttons: **20px radius**.
- Avatars: circular (`50%`).
- Inner elements inside cards: **10–12px radius**.

### Borders & elevation
- **Cards have a visible 1px border** (`#1a4a3a` dark, `#e0e8e5` light) *as well as* a soft shadow. Borders carry most of the structural weight in dark mode.
- **Shadows are soft and low-contrast.** `0 4px 20px rgba(0,0,0,0.06)` light · `0 4px 20px rgba(0,0,0,0.25)` dark.
- **"Glow" treatment** marks the single active/focal card on a screen: `border: 1.5px solid rgba(209,248,67,0.25)` + `box-shadow: 0 0 24px rgba(209,248,67,0.10)`. Used once per view maximum.

### Backgrounds
- Big flat fills, not gradients. The 8079#102B1E and surface `#ECF0EF` do the heavy lifting.
- **One gradient exception:** the hero/media panel uses a radial-to-linear blend `#D1F84330 → #005840 → #0A1F18` behind a subject photo. Treated as a single, intentional device — not a decorative motif.
- **Glassmorphism** appears only inside that hero panel: `background: rgba(255,255,255,0.12)` + `backdrop-filter: blur(12px)`. Do not spread it elsewhere.
- No repeating patterns, no textures, no hand-drawn illustrations.

### Imagery vibe
- **Warm, natural, Scandinavian golf.** Overcast greens, real courses (*"Gamle Fredrikstad GK"*), human-scale. Premium product photography for merch (matte green bottles, metal markers).
- Never: generic stock golf clipart, motion-blur sports photography, saturated sunsets.

### Data visualization
A central part of the identity. Chart styles defined by the Spillerportal mockup:
- **Paired bar charts** — one muted lime (`#D1F84355`) + one solid lime, ~10px wide, 3px radius top.
- **Signal bars** (TrackMan-style) — 3px wide, 1.5px radius, mixed solid + 60%-alpha + red danger segments.
- **Circular progress rings** — 5–6px stroke, rounded caps, rotated -90°, colored track at ~15% alpha.
- **Half-circle gauges** — for 0-100 ratings.
- **Sleep-style layered rows** — 4 stages, color-coded segments on a time axis.
- **HCP gradient bar** — linear `green → yellow → red` with a white dot marker.
- **Heatmaps** — GitHub-contribution style, 4-stop alpha scale of the accent.

### Motion
- **Short, eased, no bounce.** `150ms ease` for state changes (hover, pill toggle), `250ms ease` for layout transitions, `400–600ms ease` for chart draw-ins (`stroke-dasharray` on rings).
- No spring physics, no parallax, no hero video.
- Reduce-motion respected — easy, since there are no heavy animations anywhere.

### Hover / press / focus
- **Hover (light mode):** card lifts shadow from `sm` to `md`; buttons lighten background 4–6% (not a separate hover color).
- **Hover (dark mode):** card background shifts from `#0D2E23` to `#133A2D` (a literal lighter dark).
- **Press:** no scale transform; the active state is color (pill fills with accent) rather than geometry.
- **Focus:** 2px outline in the accent `#D1F843` at 40% alpha, 2px offset — visible on both themes.

### Transparency & blur
- Rare and reserved. Two approved uses: the hero glass card, and active pill/border glows at `~25%` alpha.
- Never blur behind text that the user has to read for meaning.

### Iconography
See the ICONOGRAPHY section below.

### Layout rules
- 8pt grid. Max content width ~1400px on desktop. Icon sidebar is 48px fixed; top nav is ~58px tall.
- Cards are arranged in a grid with one hero card spanning two rows/columns — there is always a single visual anchor.
- Mobile: iPhone 15 Pro target (390px width). Single-column card stacks, horizontal-scroll rows for groups.

---

## ICONOGRAPHY

### System
**Lucide** is the official and only icon library — *"Ikoner: Lucide-biblioteket (2px stroke, round line-cap)"*. All UI icons must be Lucide SVGs, used at their default 2px stroke with round caps and round joins.

**How to load it.** This project ships an inline helper, `assets/lucide.js`, that defines a curated subset of Lucide paths and exposes:
- `<span data-icon="target" data-size="16"></span>` for static HTML / preview cards
- `<LucideIcon name="target" size={16} color={C.accent} />` inside React UI kits (auto-registered when React is in scope)
- `window.AK.svgFor(name, size, color)` if you need the raw SVG string

For full Lucide coverage in production, pull from the CDN: `<script src="https://unpkg.com/lucide@latest"></script>`. The inline helper covers the icons used across this design system; extend `PATHS` in `assets/lucide.js` when you need more.

**Standard sizes.** `14px` (inline with caption text), `16px` (default in cards and pills), `18–20px` (nav, headers), `24px+` (hero/feature only). Never below 14px.

**Color rules.** Icons take `currentColor` by default. Brand-colored icons:
- `--ak-primary` (#005840) — default UI affordance on light surfaces
- `--ak-accent` (#D1F843) — single focal/active icon per view
- `--ak-muted` (#A5B2AD) — inactive nav items, secondary affordances
- `--ak-danger` (#B84233) — destructive or warning glyphs only

> **No emoji.** Emoji are not allowed in product UI, marketing, dashboards, slide decks, or any customer-facing surface. If a glyph is needed, it must be a Lucide SVG. The earlier version of this system suggested emoji as a "data-dense fallback" — that guidance is withdrawn.

### Canonical icon mapping
The Spillerportal mockup standardises on these Lucide names. Reuse them anywhere the same concept appears so the visual language stays consistent.

| Concept | Lucide |
|---|---|
| Slag / runde / golf | `flag-triangle-right` |
| Tid / varighet | `timer` (running) · `clock` (static time) |
| Sted / bane | `map-pin` |
| Putts / helse / hjerterytme | `heart-pulse` |
| Vurdering positiv | `thumbs-up` |
| Streak / utmerkelse | `star` |
| Søvn | `moon` |
| Energi / søvnkvalitet | `zap` |
| Treningsmengde | `droplets` |
| Score / analyse / KPI-graf | `chart-column` · `chart-bar` |
| Mål / TrackMan | `target` |
| Aktivitet | `activity` |
| Hjem · Helsestatus · Treningsplan | `home` · `heart-pulse` · `clipboard-list` |
| Søk · Kalender · ChatBot AI | `search` · `calendar` · `bot` |
| Tema (lys/mørk) · Varsler · Innstillinger | `sun` / `moon` · `bell` · `settings` |

### Unicode symbols
Used sparingly as affordance glyphs only, not as icons:
- `▾` — dropdown open
- `▸` / `→` — link / next
- `↗` — external / open detail
- `⋯` — more / overflow menu
- `✕` — dismiss
- `●` / `•` — status dot

### Logo files (see `assets/logos/`)
- `ak-golf-logo-primary-on-light.svg` — green "ak" + lime dot (default light)
- `ak-golf-logo-primary-on-dark.svg` — lime "ak" + lime dot on dark
- `ak-golf-logo-white-on-green.svg` — white + lime dot on brand green
- `ak-golf-logo-primary-mono.svg` / `black-mono` / `white-mono` — single-color for print, embroidery, engraving
- PNG fallbacks in `assets/logos/png/` at 512px for each of the three main variants

### Illustrations
None. The brand is strictly typographic + photographic + data-viz. **Do not invent decorative SVG illustrations.** If a visual is needed, use real product photography, the logo in one of its sanctioned treatments, or a data visualization.

---

## Fonts

Inter is self-hosted from `assets/fonts/InterVariable.woff2` (and `-Italic.woff2`) as a variable font covering weights 100–900. No CDN dependency. Files are from the canonical rsms/inter v4.0 release (SIL Open Font License 1.1).

---

*AK Golf Group AS · Fredrikstad, Norge · akgolfgroup.no*
