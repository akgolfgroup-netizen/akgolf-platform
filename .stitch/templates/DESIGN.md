# Design-dokumentasjon: [Screen-navn]

> **Status:** [Utforskning / Review / Godkjent]  
> **Dato:** [YYYY-MM-DD]  
> **Designer:** [Navn]  
> **Versjon:** [v1.0]

---

## 📸 Referanse

![Screenshot](./screenshot.png)

**Stitch URL:** [Lenke til Stitch-prosjekt]  
**Screen ID:** [ID fra Stitch]

---

## 🎨 Fargepalett

| Token | Hex | CSS Variable | Bruk |
|-------|-----|--------------|------|
| Background | `#F5F5F7` | `--color-grey-100` | Hovedbakgrunn |
| Surface | `#FFFFFF` | `--color-white` | Cards |
| Border | `#E8E8ED` | `--color-grey-200` | Kanter |
| Text Primary | `#1D1D1F` | `--color-grey-900` | Hovedtekst |
| Text Secondary | `#6E6E73` | `--color-grey-500` | Sekundær tekst |
| Text Muted | `#86868B` | `--color-grey-400` | Placeholder |
| Success | `#34C759` | `--color-success` | Positive trender |
| Error | `#FF3B30` | `--color-error` | Feil, negative trender |
| Warning | `#FF9500` | `--color-warning` | Varsler |
| Brand Green | `#2D6A4F` | `--color-brand` | CTA, aksenter |
| AI Lavender | `#AF52DE` | `--color-ai` | AI-elementer |

---

## ✍️ Typografi

| Element | Størrelse | Vekt | Line-height | Letter-spacing |
|---------|-----------|------|-------------|----------------|
| Hero Title | 56px | 700 | 1.1 | -0.03em |
| H1 | 40px | 700 | 1.2 | -0.025em |
| H2 | 32px | 600 | 1.3 | -0.02em |
| H3 | 24px | 600 | 1.4 | -0.01em |
| Body Large | 18px | 400 | 1.6 | 0 |
| Body | 16px | 400 | 1.5 | 0 |
| Small | 14px | 400 | 1.5 | 0 |
| Caption | 12px | 500 | 1.4 | 0.05em |
| Stat Large | 64px | 800 | 1 | -0.02em |
| Stat Medium | 40px | 700 | 1.1 | -0.02em |
| Stat Small | 24px | 600 | 1.2 | -0.01em |

**Font:** Inter (sans-serif)  
**Numbers:** `font-variant-numeric: tabular-nums`

---

## 📐 Spacing

### Grid
- **Base:** 8px
- **Card gap:** 24px
- **Section gap:** 32px
- **Container max-width:** 1400px
- **Container padding:** 32px (desktop), 16px (mobile)

### Card Padding
- **Standard:** 24px
- **Large:** 32px
- **Small:** 16px

---

## 🔲 Border Radius

| Token | Verdi | Bruk |
|-------|-------|------|
| sm | 8px | Små elementer, badges |
| md | 12px | Inputs, små cards |
| lg | 16px | Cards, modaler |
| xl | 20px | Store cards |
| pill | 980px | Knapper |
| full | 9999px | Sirkler |

---

## 💫 Skygger

```css
--shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.02);
--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04);
--shadow-lg: 0 12px 40px rgba(0,0,0,0.08);
```

---

## 🎯 Komponenter

### 1. [Komponent-navn]

**Beskrivelse:** [Hva gjør denne komponenten]

**Varianter:**
- Default
- Hover
- Active
- Disabled
- Loading

**Props:**
| Prop | Type | Default | Beskrivelse |
|------|------|---------|-------------|
| | | | |

---

## 🎬 Animasjoner

| Element | Type | Varighet | Easing |
|---------|------|----------|--------|
| Card hover | Scale + shadow | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Button hover | Opacity | 150ms | ease |
| Page load | Fade + slide | 500ms | `cubic-bezier(0, 0.55, 0.45, 1)` |
| Modal | Scale + fade | 300ms | spring |

---

## 📱 Responsiv oppførsel

### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Endringer per breakpoint
| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Grid | 4 kolonner | 2 kolonner | 1 kolonne |
| Card padding | 24px | 20px | 16px |
| Font size | 100% | 95% | 90% |

---

## ♿ Tilgjengelighet

- [ ] Fokus-stater på alle interaktive elementer
- [ ] Aria-labels på ikon-knapper
- [ ] Role og aria-modal på modaler
- [ ] Prefers-reduced-motion støtte
- [ ] WCAG 2.1 AA kontrast

---

## 📝 Notater

[Eventuelle ekstra notater, kontekst, eller design-beslutninger]

---

**Sist oppdatert:** [YYYY-MM-DD]
