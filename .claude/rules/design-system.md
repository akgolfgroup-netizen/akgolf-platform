# Design System — AK Golf Platform

> ⚠️ **ÉN SANN KILDE:** Dette er den ENESTE gjeldende design-system-filen i hele prosjektet.  
> Alle andre design-system-dokumenter (`docs/design-system.md`, `docs/project/04_DESIGN_SYSTEM.md`, `docs/DESIGN.md`, etc.) er arkivert/utdaterte.  
> Hvis du er i tvil, les DENNE filen.

**"Sort. Hvit. Én grønn."** — Brand Guide V2.0

## ABSOLUTTE REGLER

1. **ALDRI bruk raw hex-verdier i TSX/JSX-filer.** Bruk Tailwind-tokens (`bg-primary`, `text-accent-cta`) eller CSS-variabler (`var(--color-primary)`).
2. **ALDRI bruk vilkårlige Tailwind-verdier** som `bg-[#005840]`, `text-[#D1F843]`, `border-[#ECF0EF]`. Disse finnes allerede som tokens.
3. **ALDRI bruk generiske Tailwind-farger** som `bg-green-500`, `text-gray-400`, `bg-blue-600`. Bruk KUN prosjektets egne tokens.
4. For inline styles og Framer Motion: importer fra `@/lib/design-tokens` — aldri hardkod hex.
5. Font: Inter via `next/font/google` (variabel `--font-inter`). Ingen andre fonter.
6. Ikoner: Lucide React. Ingen andre ikonbibliotek.
7. Aldri emojier. Aldri dark mode. Aldri trenersertifiseringer. Aldri MVA på kundesider.
8. Norsk bokmål for all brukervendt tekst.

## FARGER — Tailwind-tokens

### Kjerne
| Token                | CSS-variabel             | Hex       | Bruk                         |
|----------------------|--------------------------|-----------|------------------------------|
| `bg-primary`         | `--color-primary`        | `#005840` | Logo, nav, CTA-bakgrunn      |
| `bg-primary-alt`     | `--color-primary-alt`    | `#00594C` | Hover-variant av primary      |
| `bg-primary-soft`    | `--color-primary-soft`   | `#E6F3F1` | Lett primary-tint bakgrunn    |
| `bg-accent-cta`      | `--color-accent-cta`     | `#D1F843` | CTA-knapper, uthevinger       |
| `text-accent-cta-text`| `--color-accent-cta-text`| `#0A1F18` | Tekst PÅ accent-cta-bakgrunn |
| `bg-surface`         | `--color-surface`        | `#ECF0EF` | Seksjonsbakgrunner            |
| `bg-background-beige`| `--color-background-beige`| `#fdf9f0`| Varm alternativ bakgrunn      |
| `text-text`          | `--color-text`           | `#324D45` | Brødtekst                     |
| `text-muted`         | `--color-muted`          | `#A5B2AD` | Sekundærtekst, placeholders   |
| `bg-black`           | `--color-black`          | `#0A1F18` | Mørkeste grønn / dark bg      |
| `bg-white`           | `--color-white`          | `#FFFFFF` | Hvit bakgrunn                 |

### Grå-skala (grønn-tonet)
| Token          | Hex       |
|----------------|-----------|
| `grey-50`      | `#F5F8F7` |
| `grey-100`     | `#ECF0EF` |
| `grey-200`     | `#D5DFDB` |
| `grey-300`     | `#A5B2AD` |
| `grey-400`     | `#7A8C85` |
| `grey-500`     | `#5A6E66` |
| `grey-600`     | `#3D5249` |
| `grey-700`     | `#324D45` |
| `grey-800`     | `#1A3529` |
| `grey-900`     | `#0A1F18` |

### Semantiske
| Token             | Hex       | Bruk           |
|-------------------|-----------|----------------|
| `bg-success`      | `#2A7D5A` | Suksess        |
| `bg-success-light`| `#E8F5EF` | Suksess-bg     |
| `text-success-text`| `#1A4D36`| Suksess-tekst  |
| `bg-error`        | `#B84233` | Feil           |
| `bg-error-light`  | `#FCEAE8` | Feil-bg        |
| `text-error-text` | `#7A2C22` | Feil-tekst     |
| `bg-warning`      | `#C48A32` | Advarsel       |
| `bg-warning-light`| `#FDF4E4` | Advarsel-bg    |
| `text-warning-text`| `#7A5520`| Advarsel-tekst |
| `bg-info`         | `#007AFF` | Info           |
| `bg-info-light`   | `#EFF6FF` | Info-bg        |
| `text-info-text`  | `#1E40AF` | Info-tekst     |

### AI
| Token          | Hex       | Bruk                  |
|----------------|-----------|------------------------|
| `bg-ai`        | `#AF52DE` | AI-features bakgrunn   |
| `bg-ai-light`  | `#FAF5FF` | AI-features lett bg    |
| `text-ai-text` | `#6B21A8` | AI-features tekst      |

### Ekstern
| Token       | Hex       |
|-------------|-----------|
| `bg-vipps`  | `#FF5B24` |

## TYPOGRAFI

Font: Inter (variable, 300–700) via `next/font/google`.

### Presets (bruk disse, ikke ad-hoc størrelser)
| Preset      | Størrelse | Vekt | Letter-spacing | Line-height |
|-------------|-----------|------|----------------|-------------|
| Hero        | 60px      | 700  | -0.02em        | 1.1         |
| H1          | 36px      | 700  | -0.025em       | 1.2         |
| H2          | 30px      | 700  | -0.01em        | 1.25        |
| H3          | 24px      | 600  | -0.01em        | 1.3         |
| H4          | 20px      | 600  | 0              | 1.4         |
| Body        | 16px      | 400  | 0              | 1.7         |
| Body Small  | 14px      | 400  | 0              | 1.6         |
| Label       | 12px      | 600  | 0.12em         | 1.5         |
| Caption     | 12px      | 400  | 0              | 1.5         |

Label bruker `uppercase`.

### Typografisk skala (Brand Guide V2.0 §05)
| Nivå    | Størrelse | Bruk                    |
|---------|-----------|-------------------------|
| H1      | 48px      | Hero, hovedoverskrifter |
| H2      | 32px      | Seksjonsoverskrifter    |
| H3      | 24px      | Kortoverskrifter        |
| Body    | 16px      | Brødtekst               |
| Small   | 14px      | Hjelpetekst             |
| Caption | 12px      | Fotnoter, metadata      |

## SUB-BRANDS (Brand Guide V2.0 §06)

AK Golf Group AS har tre sub-brands: Golf Academy, Software, Utvikling.
WANG Toppidrett og Mulligan Indoor har EGNE merkevarer — aldri bland disse med AK Golf Group sub-brands.

## SPRÅK

Alt innhold skrives på norsk bokmål — internt og eksternt, i alle kanaler. Aldri engelsk.

## SPACING

4px grid. Bruk Tailwind spacing utilities (`p-4`, `gap-6`, `mt-8`).

Seksjonsspacing: `py-20` (mobil) → `py-24` (tablet) → `py-28` (desktop).
Container max-width: `max-w-[1120px]` med `px-4` (mobil) → `px-6` (tablet) → `px-8` (desktop).

## GRID

8pt grid-system (Brand Guide V2.0 §07). Alle elementer — marginer, padding, spacing — er multipler av 8px (0.5rem).

## BORDER-RADIUS (Brand Guide V2.0 §07)

| Bruk             | Token/verdi                  |
|------------------|------------------------------|
| Små elementer    | `rounded-lg` (8px)           |
| Kort             | `rounded-xl` (16px) — `--radius-card` |
| Knapper          | `rounded-[20px]` (20px pills)|
| Pills/badges     | `rounded-full`               |

## SHADOWS

Bruk Tailwind-tokens, ikke inline `box-shadow`:
- `shadow-sm` — subtile elementer
- `shadow-card` — kort (default)
- `shadow-card-hover` — kort hover
- `shadow-md` — dropdown, popover
- `shadow-lg` — modal, overlay

## MOTION

Framer Motion 12. Importer presets fra `@/lib/design-tokens`:

```tsx
import { motion as motionTokens, EASE_ENTRANCE } from '@/lib/design-tokens'
```

Standard easing: `[0.4, 0, 0.2, 1]` (premium).
Entrance: `EASE_ENTRANCE` = `[0.16, 1, 0.3, 1]`.
Spring/bounce: `[0.34, 1.56, 0.64, 1]`.

Durations: `200ms` (fast), `300ms` (normal), `500ms` (slow).

## KNAPPER (Brand Guide V2.0 §07)

| Type      | Styling                                                              | Eksempel       |
|-----------|----------------------------------------------------------------------|----------------|
| Primary   | `bg-primary text-white rounded-[20px]` → hover: `bg-primary-alt`    | Kom i gang      |
| CTA/Accent| `bg-accent-cta text-accent-cta-text rounded-[20px]`                  | Bestill time    |
| Secondary | `border border-grey-200 text-text rounded-[20px]` → hover: `bg-grey-50` | Les mer     |
| Ghost     | `text-text rounded-[20px]` → hover: `bg-grey-50`                    |                |
| Danger    | `bg-error text-white rounded-[20px]`                                 |                |

## MISSION CONTROL (Admin) TOKENS

| Token                | Hex       | Bruk                  |
|----------------------|-----------|-----------------------|
| `--mc-color-coaching`| `#005840` | Coaching-divisjon      |
| `--mc-color-junior`  | `#007AFF` | Junior-divisjon        |
| `--mc-color-ai`      | `#AF52DE` | AI-features            |
| `--mc-sidebar-width` | `220px`   | Sidebar bredde         |
| `--mc-topbar-height` | `56px`    | Topbar høyde           |

MC bruker egne `--mc-*` spacing-tokens: xs=4, sm=8, md=12, lg=16, xl=20, 2xl=24.

## SHADCN/UI

shadcn-komponenter bruker `--radius`, `--primary`, `--accent` etc. mappet via globals.css. Ikke overskriv disse direkte — de arver fra brand-tokens.

## Z-INDEX

| Lag       | Verdi |
|-----------|-------|
| base      | 0     |
| dropdown  | 10    |
| sticky    | 20    |
| nav       | 50    |
| overlay   | 60    |
| modal     | 70    |
| popover   | 80    |
| tooltip   | 90    |
| loader    | 100   |

## INLINE STYLES OG FRAMER MOTION

Når du trenger farger i JS/TS (ikke Tailwind), importer ALLTID fra design-tokens:

```tsx
import { colors, shadows, motion } from '@/lib/design-tokens'

// Riktig:
style={{ color: colors.primary.main }}
style={{ boxShadow: shadows.card }}

// FEIL:
style={{ color: '#005840' }}
style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
```

## VANLIGE FEIL Å UNNGÅ

- ❌ `bg-[#005840]` → ✅ `bg-primary`
- ❌ `text-[#D1F843]` → ✅ `text-accent-cta`
- ❌ `bg-green-500` → ✅ `bg-primary` eller `bg-success`
- ❌ `text-gray-600` → ✅ `text-grey-600` (prosjektets grønn-tonede skala)
- ❌ `border-gray-200` → ✅ `border-grey-200`
- ❌ `rounded-2xl` tilfeldig → ✅ `rounded-xl` for kort, `rounded-lg` for elementer
- ❌ Inline hex i style={{ }} → ✅ Import fra `@/lib/design-tokens`
