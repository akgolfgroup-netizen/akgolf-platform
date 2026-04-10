# Design System — AK Golf Platform

Brand Guide V2.0 (2026). Premium golfcoaching-plattform. Light mode.

## Fargepalett (Brand Guide V2.0)

### Kjernefarger
| Token | Hex | CSS-variabel | Bruk |
|-------|-----|-------------|------|
| Primary | `#005840` | `--color-primary` | Hovedfarge, bakgrunner, tekst |
| Accent | `#D1F843` | `--color-accent-cta` | CTA-knapper, uthevinger |
| Surface | `#ECF0EF` | `--color-surface` | Bakgrunner, kort, seksjoner |
| Text | `#324D45` | `--color-text` | Brodtekst, overskrifter |
| Muted | `#A5B2AD` | `--color-muted` | Hjelpetekst, rammer, ikoner |

### Graskala (gronn-tonet)
| Token | Hex |
|-------|-----|
| `--color-grey-100` | `#ECF0EF` |
| `--color-grey-200` | `#D5DFDB` |
| `--color-grey-300` | `#A5B2AD` |
| `--color-grey-400` | `#7A8C85` |
| `--color-grey-500` | `#5A6E66` |
| `--color-grey-600` | `#3D5249` |
| `--color-grey-700` | `#324D45` |
| `--color-grey-800` | `#1A3529` |
| `--color-grey-900` | `#0A1F18` |

### Semantiske farger (Brand Guide V2.0 §04)
| Token | Hex | Bakgrunn | Bruk |
|-------|-----|----------|------|
| `--color-success` | `#2A7D5A` | `#E8F5EF` | Fremgang, godkjent, positiv |
| `--color-error` | `#B84233` | `#FCEAE8` | Svakt omrade, kritisk |
| `--color-warning` | `#C48A32` | `#FDF4E4` | Middels, oppmerksomhet |
| `--color-info` | `#007AFF` | `#EFF6FF` | Informasjon |
| `--color-ai` | `#AF52DE` | `#FAF5FF` | AI-elementer |

### Fargefordeling
60% Primary + Surface | 30% Text + Muted | 10% Accent (CTA)

### Sub-brand aksenter
| Brand | Farge |
|-------|-------|
| Junior | `#3B82F6` (bla) |
| Software | `#8B5CF6` (lilla) |
| Utvikling/GFGK | `#005840` (gronn) |

### Booking-farger
Booking folger Brand Guide V2.0 med Primary #005840 og Accent #D1F843.

---

## Typografi

**Font:** Inter via `next/font/google`

| Stil | Storrelse | Vekt | Spacing |
|------|-----------|------|---------|
| Hero | 60px | 700 | -0.02em |
| H1 | 36px | 700 | -0.025em |
| H2 | 30px | 700 | -0.01em |
| H3 | 24px | 600 | -0.01em |
| H4 | 20px | 600 | 0 |
| Body | 16px | 400 | 0 |
| Body Small | 14px | 400 | 0 |
| Label | 12px | 600 | 0.12em (UPPERCASE) |
| Caption | 12px | 400 | 0 |

---

## Spacing (4px grid)

| Verdi | Rem | Px |
|-------|-----|-----|
| 1 | 0.25rem | 4px |
| 2 | 0.5rem | 8px |
| 3 | 0.75rem | 12px |
| 4 | 1rem | 16px |
| 6 | 1.5rem | 24px |
| 8 | 2rem | 32px |
| 12 | 3rem | 48px |
| 16 | 4rem | 64px |
| 20 | 5rem | 80px |

**Seksjons-spacing:** Mobile 5rem, Tablet 6rem, Desktop 7rem

---

## Grid & Breakpoints

| Breakpoint | Px |
|------------|------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

**Container:** Max 1120px, padding 1rem (mobile) → 2rem (desktop)

---

## Border Radius

| Token | Verdi |
|-------|-------|
| sm | 8px |
| md | 12px |
| lg | 16px (standard card) |
| xl | 24px |
| 2xl | 32px |
| pill | 9999px (knapper) |

---

## Shadows

| Token | Verdi |
|-------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.04)` |
| card | `0 1px 3px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.02)` |
| card-hover | `0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)` |
| lg | `0 12px 40px rgba(0,0,0,0.08)` |

---

## Komponenter

### Knapper (AppleButton)
- **Primary:** Svart bg, hvit tekst, pill-form (radius 9999px)
- **Secondary:** Grey-100 bg, svart tekst
- **Ghost:** Transparent, grey-600 tekst
- Hover: scale(1.02), 300ms ease
- Storrelser: sm (h-8), md (h-10), lg (h-12)

### Kort (AppleCard)
- **Glass:** white/70 + backdrop-blur-xl
- **Solid:** Hvit bg, 1px border grey-200, radius 20px
- **Dark:** grey-900/80 + backdrop-blur
- Hover: translateY(-4px), scale(1.01)

### Badges (AppleBadge)
- Rundt, liten, fargekodet etter status
- Success: gronn bg, hvit tekst
- AI: lilla bg (#FAF5FF), lilla tekst (#6B21A8)

### Tabeller (MCTable)
- Ingen synlige 1px borders
- Alternerende bakgrunn (hvit / grey-100)
- Hover pa rad: grey-100

### Modaler
- Overlay: svart 50% opacity
- Hvit bakgrunn, radius 24px
- Max-width 480px, centered

### Ikoner
- Lucide React (primaer)
- Storrelse: 16px (sm), 20px (md), 24px (lg)
- Farge: inherit fra tekst

---

## Animasjoner

| Type | Verdi |
|------|-------|
| Standard easing | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Hover duration | 300ms |
| Page transition | 500ms fade |
| Stagger delay | 100ms |

Alltid respekter `prefers-reduced-motion`.

---

## Tonalitet i UI

- **Profesjonell og varm** — ikke klinisk
- **Norsk bokmaal** — naturlig sprak, ikke formelt
- **Datadrevet** — vis tall med kontekst og trend
- **Aldri generisk** — ingen "Velkommen tilbake!" uten data

---

## Do / Don't

### Do
- Bruk design tokens for alle farger
- Bruk pill-form pa primaerknapper
- Vis data med sparklines og trend
- Bruk skeleton-loader for lasting
- Respekter spacing-skala (4px grid)

### Don't
- Aldri bruk emojier
- Aldri bruk `#000000` (bruk `#0A1F18`)
- Aldri bruk gronn (#005840) for success-indikatorer
- Aldri bruk generiske gradienter
- Aldri vis trenersertifiseringer
- Aldri vis MVA pa kundesider
- Aldri bruk standard shadcn uten tilpasning
- Aldri bruk dark mode
