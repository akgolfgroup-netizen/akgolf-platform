# AK Golf Platform - Design System
## Komplett visuell identitet og UI-komponenter

**Versjon:** 1.0  
**Dato:** April 2026  
**Status:** Klar for utvikling

---

## 🎨 DESIGNFILOSOFI

### Kjerneverdier
- **Premium men tilgjengelig** - Føles eksklusivt, men ikke utilnærmelig
- **Mørk først** - Optimalisert for tidlig morgen og sen kveld (når golfere spiller)
- **Klar og tydelig** - Informasjon må være lett å lese på farten (ute på banen)
- **Motiverende** - Design som inspirerer til forbedring

### Inspirasjon
- Rolex: Tidkvalitet og presisjon
- Strava: Sportsdata og fellesskap
- Duolingo: Spillifisering og engasjement
- Dark mode OS: Systemnivå integrasjon

---

## 🌈 FARGEPALETT

### Primærfarger

| Rolle | Hex | RGB | Bruk |
|-------|-----|-----|------|
| **Mørk bakgrunn** | `#0F172A` | rgb(15, 23, 42) | Hovedbakgrunn (dark) |
| **Kort bakgrunn** | `#1E293B` | rgb(30, 41, 59) | Kort, panels |
| **Løftet kort** | `#334155` | rgb(51, 65, 85) | Hover states |

### Accentfarger (Golf-tema)

| Rolle | Hex | RGB | Bruk |
|-------|-----|-----|------|
| **Fairway Grønn** | `#16A34A` | rgb(22, 163, 74) | Suksess, GIR, positive data |
| **Gressgrønn** | `#22C55E` | rgb(34, 197, 94) | Sekundær grønn, highlights |
| **Gull Premium** | `#D4AF37` | rgb(212, 175, 55) | Elite-tier, premium features |
| **Bronse** | `#CD7F32` | rgb(205, 127, 50) | Pro-tier, varsel |

### Statusfarger

| Rolle | Hex | RGB | Bruk |
|-------|-----|-----|------|
| **Birdie Blå** | `#3B82F6` | rgb(59, 130, 246) | Under par, topp ytelse |
| **Par Hvit** | `#F8FAFC` | rgb(248, 250, 252) | Normal, standard |
| **Bogey Oransje** | `#F97316` | rgb(249, 115, 22) | Over par, advarsel |
| **Dobbel Rød** | `#EF4444` | rgb(239, 68, 68) | Farlig, feil |

### Tekstfarger (Dark Mode)

| Rolle | Hex | Opacity | Bruk |
|-------|-----|---------|------|
| **Primær tekst** | `#FFFFFF` | 100% | Overskrifter, viktig tekst |
| **Sekundær tekst** | `#FFFFFF` | 70% | Brødtekst |
| **Tertiær tekst** | `#FFFFFF` | 50% | Hjelpetekst, labels |
| **Deaktivert** | `#FFFFFF` | 30% | Inaktive elementer |

---

## 🔤 TYPOGRAFI

### Fonter

**Primær font:** `Inter` (Google Fonts)
- Modern, lesbar, god på skjerm
- Bra tall (viktig for statistikk)

**Backup:** `system-ui, -apple-system, sans-serif`

### Import
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### Størrelsesskala

| Token | Størrelse | Bruk |
|-------|-----------|------|
| **Display** | 48px / 3rem | Store tall (score, HCP) |
| **H1** | 32px / 2rem | Sidetitler |
| **H2** | 24px / 1.5rem | Seksjonstitler |
| **H3** | 20px / 1.25rem | Korttitler |
| **H4** | 18px / 1.125rem | Undertitler |
| **Body** | 16px / 1rem | Standard tekst |
| **Small** | 14px / 0.875rem | Hjelpetekst |
| **Tiny** | 12px / 0.75rem | Labels, tags |

### Vekt

| Vekt | Bruk |
|------|------|
| **700 Bold** | Overskrifter, viktige tall |
| **600 Semibold** | Knapper, aktive states |
| **500 Medium** | Labels, sub-headings |
| **400 Regular** | Brødtekst |

---

## 📐 LAYOUT & SPACING

### Grid
- **Mobil:** 4 kolonner, 16px gutter
- **Tablet:** 8 kolonner, 24px gutter
- **Desktop:** 12 kolonner, 32px gutter

### Spacing Scale

| Token | Verdi | Bruk |
|-------|-------|------|
| `space-1` | 4px | Tett spacing |
| `space-2` | 8px | Ikon + tekst |
| `space-3` | 12px | Kort padding |
| `space-4` | 16px | Standard gap |
| `space-6` | 24px | Seksjoner |
| `space-8` | 32px | Store seksjoner |
| `space-12` | 48px | Page margins |

### Border Radius

| Token | Verdi | Bruk |
|-------|-------|------|
| `rounded-sm` | 4px | Tags, badges |
| `rounded` | 8px | Knapper, inputs |
| `rounded-lg` | 12px | Kort, panels |
| `rounded-xl` | 16px | Modaler |
| `rounded-full` | 9999px | Avatars, pills |

---

## 🎯 UI-KOMPONENTER

### Knapper

#### Primærknapp (Gull)
```
Background: #D4AF37
Text: #0F172A (mørk)
Border-radius: 8px
Padding: 12px 24px
Font: 600 Semibold
Hover: Brightness 110%
```

#### Sekundærknapp (Outline)
```
Background: transparent
Border: 1px solid #334155
Text: #FFFFFF
Border-radius: 8px
Padding: 12px 24px
Hover: Background #334155
```

#### Destruktivknapp
```
Background: #EF4444
Text: #FFFFFF
Border-radius: 8px
Hover: #DC2626
```

### Kort

#### Stat-kort
```
Background: #1E293B
Border-radius: 12px
Padding: 16px
Border: 1px solid #334155 (subtle)
```

#### Treningskort
```
Background: #1E293B
Border-radius: 12px
Padding: 20px
Left border: 4px solid #16A34A (grønn for fullført)
```

### Inputs

#### Tekstinput
```
Background: #0F172A
Border: 1px solid #334155
Border-radius: 8px
Padding: 12px 16px
Text: #FFFFFF
Placeholder: #FFFFFF/50
Focus: Border #D4AF37 (gull)
```

### Badges/Tags

| Type | Bakgrunn | Tekst |
|------|----------|-------|
| **Pro** | `#D4AF37` | `#0F172A` |
| **Elite** | `#CD7F32` | `#FFFFFF` |
| **Gratis** | `#334155` | `#FFFFFF` |
| **GIR** | `#16A34A` | `#FFFFFF` |
| **Bogey** | `#F97316` | `#FFFFFF` |

---

## 📊 DATAVISUALISERING

### Grafer & Charts

**Line Chart (Trend over tid)**
- Line: `#3B82F6` (Birdie Blå)
- Fill: `#3B82F6` med 20% opacity
- Grid: `#334155`
- Labels: `#FFFFFF/70`

**Bar Chart (Sammenligning)**
- User: `#16A34A` (Fairway Grønn)
- Average: `#334155`
- Tour: `#D4AF37` (Gull)

**Pie/Doughnut (Distribusjon)**
- Success: `#16A34A`
- Warning: `#F97316`
- Danger: `#EF4444`
- Neutral: `#334155`

### Progress Indicators

**Sirkulær progress**
- Fullført: `#16A34A`
- Gjennstår: `#334155`
- Bakgrunn: `#1E293B`

**Linear progress**
- Height: 8px
- Border-radius: 4px
- Fill: gradient `#16A34A` → `#22C55E`

---

## 🎭 STATES & FEEDBACK

### Hover States
- **Knapper:** Brightness +10%, scale 1.02
- **Kort:** Background `#334155`, translateY -2px
- **Linker:** Color `#D4AF37`, underline

### Loading States
- **Skeleton:** Background `#334155`, pulse animation
- **Spinner:** Gull farge, 24px
- **Progress:** Linear med gull gradient

### Success/Error
- **Success:** `#16A34A` + checkmark icon
- **Error:** `#EF4444` + alert icon
- **Warning:** `#F97316` + warning icon

---

## 📱 RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Tilpasning |
|------------|-------|------------|
| **Mobile** | < 640px | Single column, full-width cards |
| **Tablet** | 640-1024px | 2 columns, compact navigation |
| **Desktop** | > 1024px | Full layout, sidebar visible |

---

## 🖼️ IKONOGRAFI

### Ikon-bibliotek
**Lucide React** (standard)
- Konsistent, moderne
- Bra med dark mode

### Viktige ikoner
| Ikon | Bruk |
|------|------|
| `Target` | Siktepunkt, strategi |
| `Flag` | Hull, flaggposisjon |
| `TrendingUp` | Forbedring, stats |
| `Brain` | Mental game |
| `Dumbbell` | Trening |
| `Trophy` | Konkurranse |
| `Users` | Sosialt, academy |
| `Settings` | Innstillinger |
| `CreditCard` | Betaling, Pro/Elite |

---

## 🌙 DARK MODE (Standard)

Dette design systemet er **dark-first**. Lys modus er sekundær og skal kun tilbys hvis brukeren eksplisitt ber om det.

### Hvorfor dark-first for golf?
1. Golfere spiller ofte tidlig morgen (05:00-07:00) eller sen kveld
2. Ute på banen er det ofte sterkt sollys - mørk UI reduserer gjenskinn
3. Ser mer premium og profesjonell ut
4. Bedre for batteri på OLED-skjermer

### Lys modus (hvis nødvendig)
Invertér fargene:
- Background: `#FFFFFF`
- Cards: `#F8FAFC`
- Text: `#0F172A`

---

## 🚀 ANIMATIONER

### Varigheter
| Type | Tid |
|------|-----|
| Micro (hover) | 150ms |
| Standard | 200ms |
| Emphasis | 300ms |
| Page transitions | 400ms |

### Easing
- **Standard:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Enter:** `cubic-bezier(0, 0, 0.2, 1)`
- **Exit:** `cubic-bezier(0.4, 0, 1, 1)`

### Viktige animasjoner
1. **Kort hover:** translateY(-2px) + shadow
2. **Knapper:** Scale 1.02 på hover
3. **Page load:** Fade in + slide up
4. **Data updates:** Number count-up
5. **Success:** Checkmark draw + confetti (subtle)

---

## ✅ PRE-DELIVERY SJEKKLISTE

Før hver release:

- [ ] **Kontrast:** 4.5:1 minimum på all tekst
- [ ] **Touch targets:** 44x44px minimum
- [ ] **Emojis:** Ingen emojis som UI-ikoner (bruk Lucide)
- [ ] **Loading states:** Alle async operasjoner har loading
- [ ] **Error states:** Alle feil har brukervennlig melding
- [ ] **Responsive:** Testet på 375px, 768px, 1024px
- [ ] **Dark mode:** Alt ser bra ut i mørk modus
- [ ] **Performance:** Ingen layout shift

---

## 📦 IMPLEMENTASJON

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'ak-dark': '#0F172A',
        'ak-card': '#1E293B',
        'ak-card-hover': '#334155',
        'ak-green': '#16A34A',
        'ak-green-light': '#22C55E',
        'ak-gold': '#D4AF37',
        'ak-bronze': '#CD7F32',
        'ak-blue': '#3B82F6',
        'ak-orange': '#F97316',
        'ak-red': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### CSS Variables
```css
:root {
  --ak-bg: #0F172A;
  --ak-card: #1E293B;
  --ak-card-hover: #334155;
  --ak-green: #16A34A;
  --ak-gold: #D4AF37;
  --ak-text: #FFFFFF;
  --ak-text-secondary: rgba(255, 255, 255, 0.7);
}
```

---

## 🎯 NØKKELPUNKTER Å HUSKE

1. **Dark mode er standard** - ikke lys modus
2. **Gull for premium** - Pro/Elite tier
3. **Grønn for suksess** - GIR, forbedring
4. **Inter font** - Modern og lesbar
5. **16px+ på mobil** - Aldri mindre
6. **44px touch targets** - Tilgjengelighet
7. **Subtle shadows** - Dyp i dark mode
8. **Smooth animations** - 150-300ms

---

**Neste steg:** Bruk dette design systemet sammen med `SPILL_UI_DESIGN.md` for å bygge komplette skjermbilder.
