# Beslutning 003 — Endelig designvalg for AK Golf Platform

**Dato låst:** 2026-04-27
**Signert:** Anders Kristiansen (CEO, AK Golf Group)
**Status:** AUTORITATIV — overstyrer alle tidligere designdokumenter

> **OPPDATERT 2026-04-27 (sen kveld):** Anders har eksportert et komplett designsystem-bundle fra Claude Design (`public/design-reference/ak-design-system/`) som er rikere og mer presis enn de 17 reglene tidligere på dagen. Anders valgte alternativ A: adopter dette nye systemet som autoritativ. Denne filen er omskrevet for å reflektere det.

---

## Kilden er ak-design-system-bundlen

Den autoritative spesifikasjonen ligger nå i `public/design-reference/ak-design-system/`. Denne mappen inneholder:

- `project/README.md` — komplett brand-spec (220 linjer)
- `project/SKILL.md` — gjenbrukbar Agent Skill
- `project/design-tokens.css` — alle tokens
- `project/design-tokens.json` — samme som JSON
- `project/tailwind-theme.js` — Tailwind-konfig
- `project/colors_and_type.css` — drop-in CSS-vars + semantiske helpers
- `project/preview/` — 19 HTML-sider som viser alle aspekter av systemet
- `project/ui_kits/spillerportal/` — ferdig React UI-kit for spillerportal-dashboard (dark + light)
- `project/assets/logos/` — 7 SVG-varianter + PNG-fallbacks
- `project/assets/favicon/` — favicon-32, -192, apple-touch-icon
- `project/assets/social/` — OG-bilde, profilbilder

**Når du er i tvil — les README.md i bundlen direkte.**

---

## Kjernen — 12 ufravikelige regler

### 1. Norsk bokmål — ALLTID
Hver flate, internt og eksternt. Engelsk er eksplisitt forbudt i produkt-UI og markedsføringskopi.

### 2. Dark mode er PRIMÆR — light er speilbilde
Spillerportalen er dark-mode-first. Lys-modus er sekundær variant. Sosiale medier-spec sier eksplisitt *"mørk variant (primær — bruk denne mest)"*.

### 3. 60/30/10-distribusjon
- 60% primary (`#005840`) + surface
- 30% tekst + muted
- **10% accent (`#D1F843`) maksimum** — kun CTA, aktiv-tilstand, datafremheving

### 4. Inter for alt digitalt (300-800)
Vekt-stigen:
- **Light (300)** — store dekorative tall
- **Regular (400)** — body
- **Medium (500)** — labels
- **SemiBold (600)** — kort-titler, knapper
- **Bold (700)** — seksjonsoverskrifter
- **ExtraBold (800)** — H1 og KPI-tall

Tight leading på store tall (1.0-1.1), generøs body-leading (1.6).

### 5. AK-logoen er custom serif — ALDRI gjenskap i Inter
Bruk SVG-filer fra `assets/logos/`. Aldri tekst-wordmark "AK Golf Academy" ved siden av logoen.

### 6. Lucide eneste ikon-bibliotek (2px stroke, round caps)
Ingen emoji. Ingen Material Symbols. Ingen custom-illustrasjoner.

> Tidligere guideline om "emoji som data-dense fallback" er **trukket tilbake** — README sier eksplisitt "No emoji" i dagens versjon.

### 7. 8pt grid strikt
Alle marger, padding, gaps er multipler av 8. `--space-xs: 4px` er eneste sub-multiplum.

### 8. Cards: 16px radius + 1px border + soft shadow
- Pills/knapper: 20px radius
- Avatarer: sirkel (50%)
- Indre elementer i kort: 10-12px radius
- Border: `#1a4a3a` dark, `#e0e8e5` light
- Shadow: `0 4px 20px rgba(0,0,0,0.06)` light, `0 4px 20px rgba(0,0,0,0.25)` dark

### 9. Glow-treatment — ÉN per view maksimum
Markerer det aktive/fokale kortet på en skjerm:
```css
border: 1.5px solid rgba(209,248,67,0.25);
box-shadow: 0 0 24px rgba(209,248,67,0.10);
```

### 10. Bakgrunner = flate fills, ikke gradients
Ett unntak: hero-paneler tillater radial-til-linær blend `#D1F84330 → #005840 → #0A1F18` bak motiv-foto. Glassmorphism kun i hero-panel.

### 11. PWA + alle skjermer responsive
- Desktop: 1440px design-target, **1400px max content-bredde**
- Sidebar: **48px fast** ikon-rail
- Top nav: **58px**
- Mobil: iPhone 15 Pro 390px target. Single-column card stacks, horisontal-scroll rader for grupper.
- Touch-targets minst 44×44px

### 12. Norsk bokmål-tone
- Rolig, kompetent, skandinavisk — ikke hype
- Korte setninger, ingen utropstegn i UI
- Du-form, uformell ("Du har…", "Din runde")
- Golf-flytenhet antas (HCP, GIR, spredning, opp-ned brukes uten forklaring)
- Numerisk forankret (78 slag · 245 m · 1.72 putts/hull)
- Stillsomt motiverende (aldri "amazing", "crush it")

---

## Tokens (autoritative — fra `design-tokens.css`)

### Kjernefarger
```css
--akgolf-primary: #005840
--akgolf-accent: #D1F843
--akgolf-surface: #ECF0EF
--akgolf-text: #324D45
--akgolf-muted: #A5B2AD
```

### Dark mode
```css
--akgolf-dark-bg: #0A1F18
--akgolf-card-dark: #0D2E23
--akgolf-card-light: #FFFFFF
--akgolf-primary-light: #B8D4CC
```

### Hover dark
`#0D2E23 → #133A2D` (kort-bakgrunn skifter til lysere mørk)

### Semantiske
```css
--akgolf-success: #2A7D5A
--akgolf-success-bg: #E8F5EF (light) / #1A3D2E (dark)
--akgolf-warning: #C48A32
--akgolf-warning-bg: #FDF4E4 (light) / #3D2E14 (dark)
--akgolf-danger: #B84233
--akgolf-danger-bg: #FCEAE8 (light) / #3D1A14 (dark)
```

### Spacing (8pt grid)
```css
--akgolf-space-xs: 4px
--akgolf-space-sm: 8px
--akgolf-space-md: 16px
--akgolf-space-lg: 24px
--akgolf-space-xl: 32px
--akgolf-space-2xl: 48px
--akgolf-space-3xl: 64px
```

### Radius
```css
--akgolf-radius-sm: 8px
--akgolf-radius-md: 12px
--akgolf-radius-card: 16px
--akgolf-radius-pill: 20px
--akgolf-radius-circle: 50%
```

### Shadows
```css
--akgolf-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06)
--akgolf-shadow-md: 0 4px 20px rgba(0, 0, 0, 0.06)
```

---

## Interaksjon

### Hover
- **Light mode:** kort løfter skygge fra sm → md; knapper lyser bakgrunnen 4-6%
- **Dark mode:** kort-bg skifter `#0D2E23 → #133A2D`

### Press
Ingen scale-transform. Aktiv-tilstand er farge (pill fylles med accent), ikke geometri.

### Focus
```css
:focus-visible {
  outline: 2px solid rgba(209,248,67,0.4);
  outline-offset: 2px;
}
```

### Motion
- **150ms ease** — state changes (hover, pill toggle)
- **250ms ease** — layout transitions
- **400-600ms ease** — chart draw-ins (`stroke-dasharray` på ringer)
- Ingen spring physics, ingen parallax, ingen hero-video

---

## Data visualization (kjerne av identiteten)

- **Paret bar charts** — én muted lime (`#D1F84355`) + én solid lime, ~10px bred, 3px topp-radius
- **Signal-bars** (TrackMan-stil) — 3px bred, 1.5px radius, miks solid + 60%-alpha + rød-danger-segmenter
- **Sirkulære progress-ringer** — 5-6px stroke, runde caps, rotert -90°, farget track ~15% alpha
- **Halv-sirkel gauges** — for 0-100 ratings
- **Sleep-style layered rows** — 4 stages, fargekodede segmenter på tids-akse
- **HCP gradient bar** — lineær `green → yellow → red` med hvit dot-marker
- **Heatmaps** — GitHub-bidragstil, 4-stops alfa-skala av accent

---

## Logo-bruk

| Variant | Bruk |
|---|---|
| `ak-golf-logo-primary-on-light.svg` | Default på lys bg (grønn "ak" + lime prikk) |
| `ak-golf-logo-primary-on-dark.svg` | På mørk bg (lime "ak" + lime prikk) |
| `ak-golf-logo-white-on-green.svg` | På primary-grønn |
| `ak-golf-logo-primary-mono.svg` | Single-color for print |
| `ak-golf-logo-black-mono.svg` | Sort på print |
| `ak-golf-logo-white-mono.svg` | Hvit for graveringer/mørke trykk |

PNG-fallbacks i `assets/logos/png/` ved 512px for de tre hovedvariantene.

**Logo står alene** — aldri tekst-wordmark ved siden av.

---

## Imagery

- **Varm, naturlig, skandinavisk golf** — overskyede greener, ekte baner ("Gamle Fredrikstad GK"), menneskeskala
- Premium produktfotografi for merch (matte grønne flasker, metallmarkører)
- ALDRI: generisk stock golf-clipart, motion-blur sportsfoto, mettede solnedganger

---

## Hva blir AVVIKLET

Heritage Grid M3 (deprecated 2026-04-25) er fullstendig avviklet:

- `#154212`, `#d2f000`, `#fdf9f0`, `#1c1c16` (Heritage-palette)
- DM Sans
- Material Symbols Outlined
- `--legacy-*` aliaser
- `--hg-*` tokens
- `--color-portal-*`-namespace
- `bg-emerald-950` for sidebars

Alle eksisterende komponenter må migreres bort fra disse (Fase C.5 i planen).

---

## Implementering

Planen for hvordan reglene rulles ut steg-for-steg ligger i `~/.claude/plans/vi-skal-ha-lage-ancient-raven.md`. Kjernen:

| Fase | Hva |
|---|---|
| B | Anders fortsetter å lage mockups i Claude Design (følger ak-design-system-bundlen) |
| C.1 | Token-alignment i `app/globals.css` — kopier `design-tokens.css` 1:1 |
| C.2 | Sprint 1-8: implementer modul-for-modul fra mockups |
| C.4 | ARKIV-isolasjon |
| C.4b | PWA-implementering |
| C.4c | Mobil-respons per modul |
| C.5 | Slett `--legacy-*`, fjern Heritage-rester |

---

## Autoritative filer som må oppdateres ved Fase C.1

| Fil | Endring |
|---|---|
| `app/globals.css` | Importér eller kopier inn `design-tokens.css` fra ak-design-system. Bytt ut alle gamle tokens. |
| `app/layout.tsx` | Fjern DM Sans + Material Symbols. Inter (300-800) + JetBrains Mono. |
| `lib/design-tokens.ts` | Generer fra `design-tokens.json`. |
| `tailwind.config.ts` (hvis brukes) | Importér `tailwind-theme.js`. |
| `.claude/rules/design-system.md` | Erstatt med en peker til denne filen + til `public/design-reference/ak-design-system/project/README.md` |
| `.claude/rules/gotchas.md` | Fjern Heritage-seksjonen helt. |

---

## Endringslogg

- 2026-04-27 (formiddag) — Initial signering, 17 manuelle regler.
- **2026-04-27 (kveld) — REVIDERT.** Anders eksporterte komplett designsystem-bundle (`ak-design-system`) fra Claude Design som er mer presis. Adoptert som autoritativ.

Endringer etter denne dato MÅ dokumenteres som ny beslutningsfil (004, 005, …) og refereres herfra.
