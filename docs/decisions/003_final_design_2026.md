# Beslutning 003 — Endelig designvalg for AK Golf Platform

**Dato låst:** 2026-04-27
**Signert:** Anders Kristiansen (CEO, AK Golf Group)
**Status:** AUTORITATIV — overstyrer alle tidligere designdokumenter

Denne filen er den eneste sannhetskilden for designvalg på tvers av AK Golf Platform. Alle eksisterende og fremtidige tokens, regler og komponenter MÅ være tro mot disse 17 reglene. Avvik må eksplisitt godkjennes av Anders og dokumenteres som ny beslutning (004, 005, …).

---

## Oppsummering

Brand Guide V2.0 låses som basis, men med 17 spesifiserte avvik/forbedringer som adopteres fra Claude Design-bundlene (primært `public/design-reference/claude-design/`). Plattformen er **PWA** og **mobile-responsive på alle flater**, inkludert CoachHQ.

---

## De 17 låste reglene

### Farger

**1. Sidebar = `#243029`**
Subtil grønntonet mørk farge. Erstatter tidligere `#0F1F18` som var for hard.
Brukes i: spillerportal-sidebar, CoachHQ-sidebar, mørke kontrastkort.

**2. Surface (hovedbakgrunn) = `#ECF0EF`**
Cream/grågrønn, varmere enn rent hvitt. Match alle Claude Design-mockups.
Erstatter tidligere `#F4F6F4` som var for blass.

**3. Body-tekst (default) = `#324D45`**
Dempet brun-grønn (`--ak-g-700` fra `claude-design/project/tokens.css`).
Brukes til vanlig brødtekst. `#0A1F18` (svart-grønn) reserveres for headlines og store KPI-tall.

### Typografi

**4. Inter (alene) — drop Inter Tight**
Bruk **Inter** (vekt 400/500/600/700/800) for ALL tekst — headlines, body, knapper.
Hemmeligheten bak "sykt fet" headlines i Bento V1: vekt 700-800 med letter-spacing `-0.03em` og `-0.04em`. Inter Tight var planlagt, men ingen av de 41 mockupene bruker den.

**5. Fjern DM Sans**
Slett DM Sans-import fra `app/layout.tsx`. Legacy fra Heritage M3.

**6. JetBrains Mono for tall + meta-labels**
KPI-tall, mono-labels (CAPS + 0.14em letter-spacing), tabular-nums, kode.

### Ikoner

**7. lucide-react — eneste ikon-bibliotek**
Fjern Material Symbols-CDN-link fra `app/layout.tsx`.
Standardstørrelser: 14px (inline), 16px (knapper), 18px (sidebar), 20px (header), 24px (prominent).

### Token-system

**8. Adopter density-system**
Fra `claude-design/project/tokens.css`:
```css
--ak-density: 1;       /* default */
--ak-pad: calc(20px * var(--ak-density));
--ak-pad-sm: calc(12px * var(--ak-density));
--ak-gap: calc(20px * var(--ak-density));
```
Klasser: `.d-compact` (0.75), `.d-comfortable` (1), `.d-spacious` (1.2).
Tillater Coach å se mer info per skjerm enn Spiller.

**9. Adopter motion easing**
```css
--ak-ease: cubic-bezier(0.4, 0, 0.2, 1);
--ak-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```
Konsistent animasjons-feel på tvers.

### Brand

**10. Logo-bruk: alltid SVG, aldri tekst-wordmark ved siden**
Bruk faktisk SVG-logo fra `public/images/branding/`:
- `ak-golf-logo-primary-on-light.svg` (default på lys bg)
- `ak-golf-logo-white-on-dark.svg` (mørk sidebar)
- `ak-golf-logo-white-on-green.svg` (på primary-grønn)
- `ak-golf-logo-black-mono.svg` (print/mono)

Aldri vis "AK Golf Academy" som tekst-wordmark ved siden av logoen. Logoen står alene.

**11. Logo clear-space + minimum-størrelse**
- Clear-space: minst 0,5 × logo-høyde luft rundt på alle sider
- Min-høyde: 24px digital, 16px på mobil
- Aldri klem mot tekst, andre logoer eller skarp kant

### Interaksjon og tilstander

**12. Focus-ring (keyboard tilgjengelighet)**
```css
:focus-visible {
  outline: 2px solid var(--ak-accent); /* #D1F843 */
  outline-offset: 2px;
}
```
Lime-fokus er signaturgrep, synlig mot alle bakgrunner, oppfyller WCAG.

**13. Animasjons-varigheter**
```css
--ak-dur-fast: 150ms;   /* hover, button press */
--ak-dur: 250ms;        /* card open, dropdown */
--ak-dur-slow: 400ms;   /* page transition, modal */
```

**14. Avatar-fallback**
Ingen bilde → vis initialer:
- Tekst: hvit, Inter 600, størrelse skalert til container
- Bakgrunn: `#005840` (primary-grønn) — samme i alle størrelser
- Form: samme radius som container (rund eller rounded)

**15. Empty state-mønster**
```
[lucide-icon, 24-32px, --ak-g-300]
"Tittel som forklarer hva som mangler"
"Setning som beskriver verdi/handling"
[Primary-knapp som starter handling]
```
Aldri "Ingen data" eller blank skjerm.

### Plattform-strategi

**16. PWA (Progressive Web App)**
- Brukeren installerer via "Legg til på hjemskjerm" i Safari/Chrome
- App-ikon på hjemskjerm, åpner i standalone-modus (ingen browser-bar)
- Push-varslinger (Android + iOS 16.4+), offline-modus, splash screen
- Ingen App Store / Play Store
- Ingen Apple-cut (30%) på betalinger

Tekniske krav:
- `public/manifest.json` med navn, ikoner, theme_color `#005840`
- App-ikoner: 192px, 512px, maskable + Apple touch-icon
- Service worker for cache + offline-fallback
- Lighthouse PWA-skår ≥ 90

**17. Alle sider mobile-responsive — inkludert CoachHQ**
Ingen desktop-only-flater. Alle 134 ruter må fungere på mobil.

Responsive-mønstre:
- Sidebar → bunn-tab-nav (5 hoved-ikoner) under 768px
- Hero komprimert (mindre font, kortere lede)
- Tabeller → stable som kort
- Tre-kolonne layout → én-kolonne under 768px
- Touch-targets minst 44×44px

Breakpoints:
- Mobil: < 768px
- Tablet: 768–1024px
- Desktop: ≥ 1024px (primært-design 1440px)

### Bonus: Dark mode

**Dark mode er kontekstuell, ikke global.**
Brukes kun der dataen krever fokus:
- TrackMan-skjermen
- Mission Control / CoachHQ-sidebar
- V2 Night Ops dashboard (alternativ for elite-spillere)

Ingen global toggle.

---

## Hva blir AVVIKLET

Heritage Grid M3 (deprecated 2026-04-25) er nå ikke bare deprecated — det er fullstendig avviklet:

- `#154212`, `#d2f000`, `#fdf9f0`, `#1c1c16` (Heritage-palette)
- DM Sans
- Material Symbols Outlined
- `--legacy-*` aliaser
- `--hg-*` tokens
- `--color-portal-*`-namespace
- `bg-emerald-950` for sidebars

Alt eksisterende som bruker disse, må migreres bort fra dem (Fase C.5 i planen).

---

## Implementering

Planen for hvordan reglene rulles ut steg-for-steg ligger i `~/.claude/plans/vi-skal-ha-lage-ancient-raven.md`. Hovedpunkter:

| Fase | Hva |
|---|---|
| B | Anders ferdigstiller mockups i Claude Design (mobile-versjoner + manglende CoachHQ-skjermer) |
| C.1 | Token-alignment i `app/globals.css` — én commit, ingen visuell endring |
| C.2 | Sprint 1-8: implementer modul-for-modul fra Claude Design-mockups |
| C.4 | ARKIV-isolasjon (kan kjøres når som helst) |
| C.4b | PWA-implementering (manifest, service worker, ikoner) |
| C.4c | Mobil-respons per modul |
| C.5 | Slett `--legacy-*`, fjern Heritage-rester |

---

## Autoritative filer som må oppdateres

Når Fase C.1 starter:

| Fil | Endring |
|---|---|
| `app/globals.css` | Adopter density + motion easing + grå-skala fra `claude-design/tokens.css`. Bytt sidebar-farge til `#243029`, surface til `#ECF0EF`. |
| `app/layout.tsx` | Fjern DM Sans-import. Fjern Material Symbols-CDN. Behold Inter + JetBrains Mono. |
| `lib/design-tokens.ts` | Oppdater farger til match. |
| `.claude/rules/design-system.md` | Erstatt med pekere til denne filen. |
| `.claude/rules/gotchas.md` | Fjern Heritage-seksjonen helt. |

---

## Endringslogg

- 2026-04-27 — Initial signering av Anders. 17 regler låst.

Endringer etter denne dato MÅ dokumenteres som ny beslutningsfil (004, 005, …) og refereres herfra.
