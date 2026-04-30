# AK Golf Platform - Design System
## Komplett visuell identitet og UI-komponenter

**Versjon:** 2.0 — Synex Edition  
**Dato:** April 2026  
**Status:** Klar for utvikling

**Referanse:** https://dribbble.com/shots/27131881-Synthex-UI-Analytics-SaaS-Dashboard

---

## 🎨 DESIGNFILOSOFI

### Kjerneverdier
- **Premium men tilgjengelig** - Føles eksklusivt, men ikke utilnærmelig
- **Lys først** - Hvit/grå bakgrunn med sterk kontrast (Synex-inspirert)
- **Klar og tydelig** - Informasjon må være lett å lese på farten
- **Motiverende** - Design som inspirerer til forbedring
- **Data-drevet** - Tall og grafer i sentrum

### Inspirasjon
- **Synex/Synthex:** Rent SaaS-dashboard, hvite kort, subtile shadows
- **Jack L. / RonDesignLab:** Store radius, generøs whitespace, layered shadows
- **AK Golf Brand Guide V2.0:** `#0A1F18`, `#D1F843` (lime), `#005840` (mørk grønn)

---

## 🌈 FARGEPALETT

### Bakgrunn

| Rolle | Hex | RGB | Bruk |
|-------|-----|-----|------|
| **Page bg** | `#ECF0EF` | rgb(236, 240, 239) | Hovedbakgrunn, landing |
| **Portal bg** | `#F5F8F7` | rgb(245, 248, 247) | Dashboard-innhold |
| **Card bg** | `#FFFFFF` | rgb(255, 255, 255) | Kort, panels, modaler |
| **Hover bg** | `#F5F8F7` | rgb(245, 248, 247) | Hover states på hvitt |

### Tekst

| Rolle | Hex | Opacity | Bruk |
|-------|-----|---------|------|
| **Primær tekst** | `#0A1F18` | 100% | Overskrifter, viktig tekst |
| **Sekundær tekst** | `#324D45` | 100% | Brødtekst |
| **Tertiær tekst** | `#5A6E66` | 100% | Labels, hjelpetekst |
| **Muted tekst** | `#7A8C85` | 100% | Inaktiv, metadata |
| **Deaktivert** | `#A5B2AD` | 100% | Placeholder, disabled |

### Grenser & Divider

| Rolle | Hex | Bruk |
|-------|-----|------|
| **Subtle border** | `#D5DFDB` | Kort-grenser, dividers |
| **Hover border** | `#A5B2AD` | Hover på bordered elementer |

### Accentfarger (AK Golf)

| Rolle | Hex | RGB | Bruk |
|-------|-----|-----|------|
| **Lime CTA** | `#D1F843` | rgb(209, 248, 67) | Primær CTA, badges, highlights |
| **Mørk grønn** | `#005840` | rgb(0, 88, 64) | Logo, brand moments |
| **Deep green** | `#0A1F18` | rgb(10, 31, 24) | Tekst, mørke seksjoner, primary buttons |
| **Success green** | `#1A4D36` | rgb(26, 77, 54) | Positive deltas, success states |
| **Light success bg** | `#E8F5EF` | rgb(232, 245, 239) | Success badge backgrounds |
| **Korall advarsel** | `#B84233` | rgb(184, 66, 51) | Varsler, notifications |
| **AI Purple** | `#AF52DE` | rgb(175, 82, 222) | AI-innsikt, premium features |
| **AI Purple bg** | `#FAF5FF` | rgb(250, 245, 255) | AI-kort bakgrunn |

### Statusfarger

| Rolle | Hex | Bruk |
|-------|-----|------|
| **Birdie Blå** | `#3B82F6` | Under par, topp ytelse |
| **Bogey Oransje** | `#F97316` | Over par, advarsel |
| **Dobbel Rød** | `#EF4444` | Farlig, feil |

### Sidebar (mørk — kun portal/MC)

| Rolle | Hex | Bruk |
|-------|-----|------|
| **Sidebar bg** | `#0A1F18` | Mørk sidebar |
| **Sidebar hover** | `rgba(255,255,255,0.10)` | Aktiv/hover item |
| **Sidebar text** | `rgba(255,255,255,0.55)` | Inaktive items |
| **Sidebar active text** | `#FFFFFF` | Aktiv item |

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
| **Hero** | `clamp(44px,7.4vw,104px)` | Landing hero |
| **Display** | 48px / 3rem | Store tall (score, HCP) |
| **H1** | 32px / 2rem | Sidetitler |
| **H2** | `clamp(32px,4.4vw,56px)` | Seksjonstitler |
| **H3** | 20px / 1.25rem | Korttitler |
| **H4** | 18px / 1.125rem | Undertitler |
| **Body** | 16px / 1rem | Standard tekst |
| **Small** | 14px / 0.875rem | Hjelpetekst |
| **Tiny** | 12px / 0.75rem | Labels, tags |
| **Micro** | 10px / 0.625px | Uppercase labels, tracking wide |

### Vekt

| Vekt | Bruk |
|------|------|
| **700 Bold** | Hero, store tall |
| **600 Semibold** | Overskrifter, knapper, viktige tall |
| **500 Medium** | Labels, sub-headings |
| **400 Regular** | Brødtekst |

### Spesielle typografi-mønstre

**Eyebrow:**
```
font-size: 10px
font-weight: 600
uppercase
tracking: 0.22em
color: #5A6E66
```

**KPI tall:**
```
font-size: 44px (eller større)
font-weight: 600
leading: none
tracking: -0.02em
color: #0A1F18
tabular-nums
```

**Micro-label under KPI:**
```
font-size: 10px
font-weight: 600
uppercase
tracking: 0.14em
color: #5A6E66
```

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
| `rounded-sm` | 4px | Tags, badges, progress bars |
| `rounded` | 8px | Knapper, inputs, small cards |
| `rounded-lg` | 12px | Kort, panels |
| `rounded-xl` | 16px | Modaler, large cards |
| `rounded-2xl` | 20px | Dashboard mockups, feature cards |
| `rounded-[28px]` | 28px | Hero containers, CTA banners |
| `rounded-full` | 9999px | Avatars, pills, buttons |

---

## 🎯 UI-KOMPONENTER

### Knapper

#### Primærknapp (Lime)
```
Background: #D1F843
Text: #0A1F18
Border-radius: 9999px (pill)
Padding: 16px 28px (px-7 py-4)
Font: 14px / 600
Shadow: 0 8px 24px -8px rgba(209,248,67,0.6)
Hover: translateY(-1px), brightness-95
```

#### Sekundærknapp (Outline)
```
Background: transparent / white
Border: 1px solid #D5DFDB
Text: #0A1F18
Border-radius: 9999px (pill)
Padding: 16px 28px
Hover: border #A5B2AD
```

#### Mørk knapp
```
Background: #0A1F18
Text: #FFFFFF
Border-radius: 9999px
Padding: 10px 20px
Hover: bg #1A3529
```

#### Destruktivknapp
```
Background: #EF4444
Text: #FFFFFF
Border-radius: 8px
Hover: #DC2626
```

### Kort

#### Stat-kort (hvitt)
```
Background: #FFFFFF
Border-radius: 12px (rounded-xl)
Padding: 16px
Border: 1px solid #D5DFDB
Shadow: 0 1px 0 rgba(10,31,24,0.03)
Hover: border #A5B2AD
```

#### Feature-kort
```
Background: #FFFFFF
Border-radius: 20px (rounded-2xl)
Padding: 28px
Border: 1px solid #D5DFDB
Hover: border #A5B2AD, arrow icon vises
```

#### AI-innsikt-kort
```
Background: gradient-to-r from #FAF5FF to white
Border-radius: 12px
Padding: 16px
Border: 1px solid rgba(175,82,222,0.20)
Icon: purple circle #FAF5FF med #AF52DE ikon
```

### Inputs

#### Tekstinput
```
Background: #FFFFFF (eller #0A1F18 for dark)
Border: 1px solid #D5DFDB
Border-radius: 8px
Padding: 12px 16px
Text: #0A1F18
Placeholder: #A5B2AD
Focus: Border #0A1F18 (eller #D1F843 for dark)
```

### Badges/Tags

| Type | Bakgrunn | Tekst |
|------|----------|-------|
| **Success delta** | `#E8F5EF` | `#1A4D36` |
| **Lime badge** | `#D1F843` | `#0A1F18` |
| **Notification dot** | `#D1F843` | `#0A1F18` |
| **Korall alert** | `#B84233` | `#FFFFFF` |
| **AI** | `#FAF5FF` | `#AF52DE` |

---

## 📊 DATAVISUALISERING

### Grafer & Charts

**Line Chart (Trend over tid)**
- Line: `#0A1F18` eller `#3B82F6` (Birdie Blå)
- Fill: gradient fra line-color til transparent
- Grid: `#D5DFDB`
- Labels: `#7A8C85`

**Bar Chart (Sammenligning)**
- User: `#0A1F18` (mørk)
- Average: `#D5DFDB`
- Highlight: `#D1F843` (lime)

**Mini bar chart (dashboard)**
- Bars: gradient `rgba(10,31,24,0.08)` til `rgba(10,31,24,0.55)`
- Radius: `rounded-t-[2px]`
- Height: fleksibel basert på data

**Pie/Doughnut (Distribusjon)**
- Success: `#1A4D36`
- Warning: `#F97316`
- Danger: `#EF4444`
- Neutral: `#D5DFDB`

### Progress Indicators

**Sirkulær progress**
- Fullført: `#D1F843` eller `#1A4D36`
- Gjennstår: `#D5DFDB`
- Bakgrunn: `#FFFFFF`

**Linear progress**
- Height: 8px
- Border-radius: 4px
- Fill: gradient `#1A4D36` → `#22C55E`

---

## 🎭 STATES & FEEDBACK

### Hover States
- **Kort:** Border `#A5B2AD`, eventuelt translateY(-1px)
- **Knapper:** Brightness 95%, translateY(-1px)
- **Linker:** Color `#0A1F18`, underline

### Loading States
- **Skeleton:** Background `#D5DFDB`, pulse animation
- **Spinner:** `#0A1F18` eller `#D1F843`, 24px
- **Progress:** Linear med grønn gradient

### Success/Error
- **Success:** `#1A4D36` + checkmark icon
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
- Bra med både lys og dark mode

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
| `Sparkles` | AI-innsikt |
| `ArrowUpRight` | Eksterne lenker, hover indicator |
| `ArrowRight` | CTA-piler |

---

## 🌙 FARGEMODUS

### Lys modus (Standard)
Dette design systemet er **lys-first** etter Synex-referansen.

- Background: `#ECF0EF` eller `#F5F8F7`
- Cards: `#FFFFFF`
- Text: `#0A1F18`
- Borders: `#D5DFDB`
- CTA: `#D1F843`

### Mørk modus (portal sidebar, CTA-bannere)
Enkelte seksjoner bruker mørk bakgrunn for kontrast:
- Background: `#0A1F18`
- Cards: `#1A3529`
- Text: `#FFFFFF`
- Accent: `#D1F843`

---

## 🚀 ANIMATIONER

### Varigheter
| Type | Tid |
|------|-----|
| Micro (hover) | 150ms |
| Standard | 200ms |
| Emphasis | 300ms |
| Page transitions | 400ms |
| Number count-up | 1800ms |

### Easing
- **Standard:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Enter:** `cubic-bezier(0, 0, 0.2, 1)`
- **Exit:** `cubic-bezier(0.4, 0, 1, 1)`
- **Count-up ease:** `1 - Math.pow(1 - p, 3)`

### Viktige animasjoner
1. **Kort hover:** border-fargeendring, eventuelt translateY(-1px)
2. **Knapper:** translateY(-1px) på hover
3. **Page load:** Fade in + slide up
4. **Data updates:** Number count-up (handicap, stats)
5. **Scroll indicator:** Animate-bounce på ChevronDown

---

## ✅ PRE-DELIVERY SJEKKLISTE

Før hver release:

- [ ] **Kontrast:** 4.5:1 minimum på all tekst
- [ ] **Touch targets:** 44x44px minimum
- [ ] **Emojis:** Ingen emojis som UI-ikoner (bruk Lucide)
- [ ] **Loading states:** Alle async operasjoner har loading
- [ ] **Error states:** Alle feil har brukervennlig melding
- [ ] **Responsive:** Testet på 375px, 768px, 1024px
- [ ] **Farger:** Ingen raw hex utenfor design tokens
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
        'ak-page': '#ECF0EF',
        'ak-portal': '#F5F8F7',
        'ak-card': '#FFFFFF',
        'ak-hover': '#F5F8F7',
        'ak-text': '#0A1F18',
        'ak-text-secondary': '#324D45',
        'ak-text-tertiary': '#5A6E66',
        'ak-muted': '#7A8C85',
        'ak-disabled': '#A5B2AD',
        'ak-border': '#D5DFDB',
        'ak-border-hover': '#A5B2AD',
        'ak-lime': '#D1F843',
        'ak-green': '#005840',
        'ak-green-deep': '#0A1F18',
        'ak-success': '#1A4D36',
        'ak-success-bg': '#E8F5EF',
        'ak-coral': '#B84233',
        'ak-purple': '#AF52DE',
        'ak-purple-bg': '#FAF5FF',
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
  --ak-page: #ECF0EF;
  --ak-portal: #F5F8F7;
  --ak-card: #FFFFFF;
  --ak-text: #0A1F18;
  --ak-text-secondary: #324D45;
  --ak-border: #D5DFDB;
  --ak-lime: #D1F843;
  --ak-green: #005840;
  --ak-success: #1A4D36;
  --ak-coral: #B84233;
  --ak-purple: #AF52DE;
}
```

---

## 🎯 NØKKELPUNKTER Å HUSKE

1. **Lys modus er standard** — hvit/grå bakgrunn
2. **Lime for CTA** — #D1F843 på alle primærhandlinger
3. **Mørk grønn for brand** — #005840 / #0A1F18
4. **Pill-knapper** — `rounded-full`, ikke `rounded`
5. **Subtle borders** — `#D5DFDB` på kort og inputs
6. **Generøs whitespace** — 40-60% tom flate
7. **Tabular nums** — Alltid på tall og statistikk
8. **Smooth animations** — 150-300ms

---

**Neste steg:** Bruk dette design systemet til å redesigne portal, admin og booking etter `REDESIGN-PROGRESS.md`.
