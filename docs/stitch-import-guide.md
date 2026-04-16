# Stitch Import Guide - AK Golf Design Tokens

## Hv importere til Stitch

### Alternativ 1: JSON Import (Anbefalt)

1. **Last ned filen:**
   ```
   docs/stitch-design-tokens.json
   ```

2. **I Stitch:**
   - Gå til **Design System** → **Tokens**
   - Klikk **Import**
   - Velg **JSON (W3C format)**
   - Last opp `stitch-design-tokens.json`

3. **Verifiser import:**
   - Sjekk at alle farger er korrekte
   - Verifiser typografi-sizes
   - Test spacing-verdier

---

### Alternativ 2: CSS Variables (Manuell)

Kopier denne CSS-filen til Stitch:

```css
:root {
  /* Primary Colors */
  --akgolf-primary: #005840;
  --akgolf-accent: #D1F843;
  --akgolf-surface: #ECF0EF;
  --akgolf-text: #324D45;
  --akgolf-muted: #A5B2AD;
  --akgolf-dark: #0A1F18;
  
  /* Semantic */
  --akgolf-success: #2A7D5A;
  --akgolf-error: #B84233;
  --akgolf-warning: #C48A32;
  --akgolf-info: #007AFF;
  
  /* Data Viz */
  --akgolf-sage: #2A7D5A;
  --akgolf-coral: #E85D4E;
  --akgolf-lime: #D1F843;
  
  /* Typography */
  --font-sans: Inter, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, monospace;
  
  /* Spacing (4px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.08);
  
  /* Motion */
  --ease-premium: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}
```

---

### Alternativ 3: Figma Tokens (hvis Stitch støtter det)

Bruk `tokens.json` formatet som er kompatibelt med:
- Figma Tokens plugin
- Token Studio
- Style Dictionary

Filen er allerede i W3C Design Tokens Format.

---

## Farge-palett (Visuell referanse)

| Farge | HEX | Bruk |
|-------|-----|------|
| Primary | `#005840` | Logo, headings, primary buttons |
| Accent | `#D1F843` | CTA, highlights, badges |
| Surface | `#ECF0EF` | Backgrounds, cards |
| Text | `#324D45` | Body text |
| Muted | `#A5B2AD` | Secondary text, placeholders |
| Dark | `#0A1F18` | Dark mode bg, footer |

### Semantic Colors
- Success: `#2A7D5A` ✓
- Error: `#B84233` ✗
- Warning: `#C48A32` ⚠
- Info: `#007AFF` ℹ

### Data Visualization
- Sage: `#2A7D5A` (primary data)
- Coral: `#E85D4E` (errors, alerts)
- Blue: `#007AFF` (info, links)
- Lime: `#D1F843` (accents, CTAs)

---

## Typografi-skala

| Token | Size | Weight | Bruk |
|-------|------|--------|------|
| hero | 60px | 700 | Hero sections |
| h1 | 36px | 700 | Page titles |
| h2 | 30px | 700 | Section headers |
| h3 | 24px | 600 | Card titles |
| h4 | 20px | 600 | Subsection |
| body | 16px | 400 | Paragraphs |
| bodySmall | 14px | 400 | Captions |
| label | 12px | 600 | Tags, labels |

---

## Spacing-system

Basert på **4px grid**:

```
4px  →  space-1  → xs
8px  →  space-2  → sm
12px →  space-3  → md
16px →  space-4  → base
20px →  space-5  → lg
24px →  space-6  → xl
32px →  space-8  → 2xl
40px →  space-10 → 3xl
48px →  space-12 → 4xl
64px →  space-16 → 5xl
```

---

## Komponent-tokens

### Button Primary
```
Background: #005840
Text: #FFFFFF
Border Radius: 12px
Padding: 12px 24px
Font Weight: 600
Hover: scale(1.02), shadow-md
```

### Button Accent (CTA)
```
Background: #D1F843
Text: #0A1F18
Border Radius: 12px
Padding: 12px 24px
Font Weight: 600
```

### Card
```
Background: #FFFFFF
Border: 1px solid rgba(0, 88, 64, 0.08)
Border Radius: 16px
Shadow: 0 4px 12px rgba(0, 0, 0, 0.06)
Padding: 24px
```

### Input
```
Background: #FFFFFF
Border: 1px solid rgba(0, 88, 64, 0.2)
Border Radius: 12px
Padding: 12px 16px
Focus Border: #005840
```

---

## Etter import

1. **Opprett styles** fra tokens i Stitch
2. **Sett opp komponenter** med riktige tokens
3. **Test dark mode** (bruk `--akgolf-dark` som bg)
4. **Verifiser kontrast** (tekst på surface skal være WCAG AA)

---

## Oppdatering av tokens

Når design-tokens endres:
1. Oppdater `lib/design-tokens.ts` i koden
2. Kjør `npm run tokens:export` (hvis tilgjengelig)
3. Re-importer til Stitch
4. Oppdater komponenter

---

## Spørsmål?

Se full dokumentasjon i:
- `docs/DESIGN_SYSTEM.md`
- `docs/DATA_VISUALIZATION_STRATEGY.md`
- Brand Guide V2.0 (ekstern PDF)
