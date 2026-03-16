# AK Golf Group — Design System

Kanonisk referanse for designsystemet. Alle komponenter, tokens og mønstre skal følge dette dokumentet.

---

## 1. Farger

### Ink-skala (kald blågrå)

| Token | HEX | Bruk |
|-------|---------|------|
| `ink-05` | `#FAFBFC` | Surface (snow) |
| `ink-10` | `#F0F2F5` | Surface (cloud), border light |
| `ink-20` | `#E2E6EB` | Border default, dividers |
| `ink-30` | `#C8CDD4` | Border hover, scrollbar, trust-items |
| `ink-40` | `#9BA5B2` | Placeholder, sekundærtekst (mørk bg) |
| `ink-50` | `#6B7B8D` | Brødtekst / body text |
| `ink-60` | `#4F5D6B` | Feature-listepunkter |
| `ink-70` | `#3A4A5A` | Labels, sekundærknapper |
| `ink-80` | `#222F3D` | Body text (sterk) |
| `ink-90` | `#02060D` | Headings, mørk overflate |
| `ink-100` | `#0A1929` | Deep ink / mørke seksjoner |

### Brand

| Token | HEX | Bruk |
|-------|---------|------|
| `navy` | `#0F2950` | Academy accent |
| `navy-dark` | `#0A1929` | Deep ink alias |
| `gold` | `#B8975C` | Primær CTA, aksenter |
| `gold-light` | `#D4C4A8` | Dekorativ |
| `gold-dark` | `#8B7243` | Focus outlines |
| `gold-muted` | `#E8D4B0` | Selection highlight |
| `gold-text` | `#6B5530` | Eyebrow-label (WCAG AA) |

### Sub-brand aksenter

| Divisjon | Token | HEX |
|----------|-------|---------|
| Academy | `academy` | `#0F2950` |
| Junior | `junior` | `#3B82F6` |
| Software | `software` | `#8B5CF6` |
| Utvikling | `utvikling` | `#22C55E` |

Bruk via `ACCENT_COLORS` fra `lib/design-tokens.ts` — aldri dupliser fargekartet.

### Semantiske farger

| Token | HEX | Bruk |
|-------|---------|------|
| `success` | `#22C55E` | Suksessmeldinger |
| `error` | `#EF4444` | Feilmeldinger (`text-error`, aldri `text-red-600`) |
| `warning` | `#F59E0B` | Advarsler |
| `info` | `#3B82F6` | Informasjon |

---

## 2. Typografi

**Font:** Inter (variabel, 300–700) via `next/font/local`.

### Heading-klasser

| Klasse | Størrelse | Vekt | Line-height | Bruk |
|--------|----------|------|-------------|------|
| `w-heading-xl` | `clamp(2.5rem, 5.5vw, 4.5rem)` | 700 | 1.1 | Hero h1 |
| `w-heading-lg` | `clamp(2rem, 4vw, 3rem)` | 700 | 1.2 | Seksjonsoverskrifter h2 |
| `w-heading-md` | `clamp(1.5rem, 3vw, 2rem)` | 700 | 1.2 | Underseksjoner h3 |
| `w-heading-sm` | `1.125rem` | 600 | 1.3 | Korttitler, labels |

### Tekst-klasser

| Klasse | Beskrivelse |
|--------|-------------|
| `w-eyebrow` | Eyebrow-label: mono, 11px, uppercase, gold-text, med gullstrek |
| `w-meta` | Meta-label: mono, 10px, uppercase, tracking 0.12em (footer-headings, dag-labels) |
| `w-body` | 14px, linjehøyde 1.7, ink-50 |
| `w-body-lg` | 16px, linjehøyde 1.7, ink-50 |

---

## 3. Spacing

### Seksjon-spacing

| Klasse | Verdi (desktop) | Verdi (mobil) |
|--------|----------------|---------------|
| `w-section` | `7rem` | `5rem` |
| `w-section-lg` | `10rem` | `7rem` |

### Section header margin-bottom

**Standard: `mb-12`** — bruk konsekvent på alle seksjonsoverskrifter. Aldri `mb-16`.

### Container

| Klasse | Max-width | Padding |
|--------|-----------|---------|
| `w-container` | `1120px` (2xl: `1280px`) | `1.5rem` / `2rem` / `3rem` |

---

## 4. Shadows

| Token | Bruk |
|-------|------|
| `--shadow-sm` | Subtile kort-skygger |
| `--shadow-md` | Standard hover-effekt |
| `--shadow-lg` | Fremhevet innhold |
| `--shadow-gold` | Gull-aksentert hover (glass cards) |

---

## 5. Border Radius

| Token | Verdi | Bruk |
|-------|-------|------|
| `--radius-sm` | `0.5rem` | Inputs, små elementer |
| `--radius-md` | `0.75rem` | — |
| `--radius-lg` | `1rem` | Kort, seksjoner |
| `--radius-xl` | `1.5rem` | Pricing cards, CTA-bokser |
| `--radius-full` | `9999px` | Knapper, badges, pills |

---

## 6. Animasjon

### Easing curves

| Token (CSS) | Verdi | Bruk |
|-------------|-------|------|
| `--ease-premium` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard for transitions |
| `--ease-out-expo` | `cubic-bezier(0, 0.55, 0.45, 1)` | Exit-animasjoner |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bounce/overshoots |

### Easing (JS/Framer Motion)

| Konstant | Verdi | Bruk |
|----------|-------|------|
| `EASE_ENTRANCE` | `[0.16, 1, 0.3, 1]` | Page entrance, hero-animasjoner |
| `EASE_STANDARD` | `[0.25, 0.46, 0.45, 0.94]` | Generelle stagger-animasjoner |

Import fra `lib/design-tokens.ts`.

### Varighet

| Token | Verdi |
|-------|-------|
| `--duration-fast` | `200ms` |
| `--duration-normal` | `300ms` |
| `--duration-slow` | `500ms` |

---

## 7. Z-index skala

| Token | Verdi | Bruk |
|-------|-------|------|
| `--z-base` | `0` | Default |
| `--z-dropdown` | `10` | Dropdowns |
| `--z-sticky` | `20` | Sticky elementer |
| `--z-nav` | `50` | Navigasjon |
| `--z-overlay` | `60` | Mobile overlay |
| `--z-modal` | `70` | Modaler |
| `--z-loader` | `100` | Loading-skjerm |

---

## 8. Komponenter

### Knapper (`w-btn`)

| Variant | Klasse | Bakgrunn | Bruk |
|---------|--------|----------|------|
| Primary | `w-btn-primary` | Gull | Hoved-CTA |
| Gold | `w-btn-gold` | Gull (600 weight) | Skjema-submit, uthevet |
| Secondary | `w-btn-secondary` | Transparent | Sekundær handling |
| Ghost | `w-btn-ghost` | Transparent + border | Alternativ handling |

> **NB:** `w-btn-primary` og `w-btn-gold` er visuelt nesten identiske. Bruk `w-btn-primary` som standard CTA, `w-btn-gold` kun i skjema-submit-kontekst.

### Kort

| Klasse | Bruk |
|--------|------|
| `w-card` | Standard hvitt kort (lys bg) |
| `w-card-dark` | Mørkt kort (ink-90 bg) |
| `w-card-glass` | Glassmorphism (mørke seksjoner) |
| `w-glass-card-gold` | Glassmorphism med gull-akent (lyse seksjoner) |
| `w-service-card` | Divisjonskort med hover |

### Skjema

| Klasse | Element |
|--------|---------|
| `w-label` | Labels |
| `w-input` | Text inputs, textareas |
| `w-select` | Select dropdowns |

---

## 9. Sidemønstre

### Undersidestruktur (Academy, Junior, Utvikling)

Alle undersider skal følge dette mønsteret:

```
<WebsiteNav />
<main>
  <PageTransition>
    <SubPageHero accent="..." />
    <section className="w-section bg-surface-warm">      {/* Filosofi/intro */}
    <section className="w-section-lg">                    {/* Hovedinnhold */}
    <section className="w-section-lg bg-surface-cream">   {/* Metode/program */}
    <section className="w-section-lg">                    {/* Pricing/detaljer */}
    <section className="bg-ink-100 w-section w-section-dark">  {/* Testimonials */}
    <section className="w-section-lg">                    {/* FAQ (2-kolonne) */}
    <CTASection />                                        {/* CTA (mørk) */}
    <section id="apply" className="w-section-lg bg-surface-cream">  {/* Skjema */}
    <RelatedPages exclude="..." />
  </PageTransition>
</main>
<BackToTop />
<WebsiteFooter />
```

### Bakgrunnsalternering

Sider alternerer mellom lyse og mørke bakgrunner:
- Lyse: `bg-surface-warm` (`#FAFBFC`), `bg-surface-cream` (`#F8F9FA`), ingen bg (hvit)
- Mørke: `bg-ink-100` (alltid med `w-section-dark` for gradient-overgang)

### Seksjon header-mønster

```tsx
<RevealOnScroll>
  <div className="text-center mb-12">         {/* Alltid mb-12 */}
    <SectionLabel>Eyebrow</SectionLabel>
    <h2 className="w-heading-lg mt-4">...</h2>
  </div>
</RevealOnScroll>
```

---

## 10. Aksent-fargesystem

Import fra `lib/design-tokens.ts`:

```tsx
import { ACCENT_COLORS, ACCENT_TEXT_COLORS, type Accent } from "@/lib/design-tokens";
```

Aldri dupliser accent-maps i enkelkomponenter.

---

## 11. Tilgjengelighet

- Skip-link: `w-skip-link` (fokussynlig)
- `prefers-reduced-motion`: Alle animasjoner deaktivert
- Scroll offset: `[id] { scroll-margin-top: 72px }` (sticky nav)
- Selection: Gull-muted bakgrunn
- Focus: `outline: 2px solid gold, offset 2px`
