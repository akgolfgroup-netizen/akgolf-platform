# Design System — AK Golf Platform (Brand Guide V2.0)

> **ÉN SANN KILDE** etter rebrand 2026-04-25.
> Heritage Grid (M3) er DEPRECATED og merket `--legacy-*`. All ny kode bruker Brand Guide V2.0.

**Designfasit:** `public/design-reference/` — tre HTML-mockups godkjent av Anders:
- `playerhq-reference.html` — spillerportal-dashboard
- `coachhq-reference.html` — coach-dashboard
- `student-360-reference.html` — spillerprofil 360° (kommer i Sprint 1 Blokk C1)

---

## TYPOGRAFI

| Bruk | Font | CSS-variabel |
|---|---|---|
| Headlines (hero, store overskrifter) | **Inter Tight** | `--font-inter-tight` |
| Body, UI, knapper, brødtekst | **Inter** | `--font-inter` |
| Tall, KPI, monospace, kode | **JetBrains Mono** | `--font-jetbrains-mono` |

Alle via `next/font/google` i `app/layout.tsx`.

**LEGACY (skal migreres bort i Sprint 2):**
- DM Sans (`--font-dm-sans`) — Heritage-rest
- Material Symbols Outlined — Heritage-rest, byttes til Lucide

---

## FARGER (Brand Guide V2.0)

### Primary
- `--color-primary: #005840` — skogsgrønn, primær brand-farge for tekst, knapper, fokus
- `--color-primary-hover: #00472f` — hover-state
- `--color-primary-soft: #E8F0EC` — bakgrunn for primary chips/badges
- `--color-primary-deep: #003B2A` — dypeste variant for tekst på lyse bg

### Accent (CTA og energy)
- `--color-accent: #D1F843` — high-energy lime, brukt sparsomt for CTA, achievements, fokus-handlinger
- `--color-accent-soft: #ECFCC0` — bakgrunn for accent-bokser
- `--color-accent-deep: #A6C734` — hover-variant

### Surface (varm cream-bakgrunn)
- `--color-surface: #F4F6F4` — hovedbakgrunn (varm off-white)
- `--color-card: #FFFFFF` — kort, paneler, dialoger
- `--color-surface-soft: #EDF1EE` — sekundær bakgrunn, divider-fill

### Sidebar (mørk kontrast)
- `--color-sidebar: #0F1F18` — admin sidebar, dark contrast cards
- `--color-sidebar-hover: #172B22` — hover-state i sidebar
- `--color-sidebar-divider: #1F3329` — interne dividers
- `--color-sidebar-muted: #A4B1AA` — sekundærtekst i sidebar

### Status
- `--color-success: #2A7D5A` (soft: `#E0EFE7`) — bekreftelser, ferdige sesjoner, oppnådde mål
- `--color-warning: #C48A32` (soft: `#F6ECD9`) — oppfølging trengs, advarsler
- `--color-danger: #B84233` (soft: `#F4DAD5`) — feil, avbrutt, kritisk

### Tekst
- `--color-ink: #0A1F18` — primærtekst (warm dark, aldri ren svart)
- `--color-ink-muted: #5C6B62` — sekundærtekst, labels
- `--color-ink-subtle: #8A958E` — tertiærtekst, captions, meta

### Borders
- `--color-line: #E4EAE6` — primær border
- `--color-line-soft: #EDF1EE` — subtil border, dividers

---

## RADIUS

| Token | Verdi | Bruk |
|---|---|---|
| `rounded-md` | 6px | Små knapper, badges |
| `rounded-lg` | 8px | Standard knapper, inputs |
| `rounded-xl` | 12px | Standard kort, dialoger |
| `rounded-2xl` | 16px | Featured kort, hero-paneler |
| `rounded-3xl` | 24px | Store hero-flater |
| `rounded-full` | 9999px | Pills, avatars, prikker |

---

## SHADOWS

| Token | Verdi | Bruk |
|---|---|---|
| `shadow-card` | `0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)` | Standard kort-skygge |
| `shadow-card-hover` | `0 1px 2px rgba(15,31,24,0.06), 0 14px 32px rgba(15,31,24,0.08)` | Kort hover (lift) |
| `shadow-rim` | `inset 0 0 0 1px rgba(15,31,24,0.06)` | Subtil indre kant |
| `shadow-accent-glow` | `0 0 0 1px rgba(209,248,67,0.5), 0 8px 24px rgba(209,248,67,0.18)` | Accent-glow på CTA |

---

## IKONER

**Bruk:** `lucide-react` (allerede i `package.json`).

```tsx
import { Calendar, Users, Bell } from "lucide-react";

<Calendar className="w-5 h-5 text-primary" />
```

**Standardstørrelser:**
- 14px (`w-3.5 h-3.5`) — inline med tekst
- 16px (`w-4 h-4`) — knapper, inputs
- 18px (`w-4.5 h-4.5`) — sidebar-ikoner
- 20px (`w-5 h-5`) — header-ikoner
- 24px (`w-6 h-6`) — store fremtredende ikoner

**ALDRI:**
- Material Symbols (legacy — migreres i Sprint 2)
- Emojier som ikoner
- Custom SVG-ikoner uten begrunnelse

---

## ESTETIKK-PRINSIPPER (fra Anders' inspirasjoner)

| Inspirasjon | Anvendelse |
|---|---|
| **Do.app** | Stor fet heading med italic primary-fragment, varm off-white bg, sparsam fargebruk |
| **Flux** | Hvite kort som flyter på surface med subtle dual-shadow, tett data |
| **Celoxis** | Tre-panel-layout, profesjonell tetthet, mono-labels for KPI |
| **Job Match** | Dramatic typography (72-80px Inter Tight), bold med italic-aksent |
| **Cosmo** | Ett dark-contrast-kort per seksjon for sterk kontrast |

---

## KOMPONENTER

Se `.claude/rules/component-library.md` for full liste. Sentrale primitiver:

- `CoachHQSidebar` — admin tre-panel-sidebar (56px ikonrad + 200px navnliste)
- `Hero360`, `IdentityCard`, `GolfCard`, `CoachingCard`, `TrainingCard`, `MentalForecastCard`, `TestsCard`, `EconomyCard`, `SignalsCard` — Spillerprofil 360°
- `AdminStatCard`, `AdminLineChart`, `AdminBarChart`, `AdminProgressRing` — eksisterende admin-primitiver (skal migreres til Brand Guide V2.0)

---

## NÅR DU SKRIVER NY KOMPONENT

1. **Finn referanse** i `public/design-reference/*.html`
2. **Kopier Tailwind-tokens 1:1** fra mockupen
3. **Bruk kun tokens fra denne filen** — aldri hardkodede farger eller `--legacy-*`
4. **Inter / Inter Tight / JetBrains Mono** + **lucide-react** — alltid

---

## FORBUDTE TOKENS (skal migreres i Sprint 2)

Heritage-rester som er DEPRECATED:
- `#154212` (Heritage primary) → bruk `#005840`
- `#d2f000` (Heritage accent) → bruk `#D1F843`
- `#fdf9f0` (Heritage surface) → bruk `#F4F6F4`
- `#1c1c16` (Heritage on-surface) → bruk `#0A1F18`
- DM Sans → bruk Inter / Inter Tight
- Material Symbols → bruk lucide-react
- `--hg-*` (Heritage Grid) → fjernet
- `--color-portal-*` → fjernet
- `bg-emerald-950` (Heritage MC sidebar) → bruk `bg-sidebar` (#0F1F18)

Eksisterende kode med disse tokenene fortsetter å fungere via `--legacy-*`-aliaser i `app/globals.css`. Mass-migrering planlagt i Sprint 2.

---

## AUTHORITATIVE FILES

- `app/globals.css` — alle tokens i `@theme inline`
- `app/layout.tsx` — Inter + Inter Tight + JetBrains Mono via `next/font/google`
- `public/design-reference/` — visuell sannhet (3 HTML-mockups)
- `.claude/rules/component-library.md` — komponent-katalog
