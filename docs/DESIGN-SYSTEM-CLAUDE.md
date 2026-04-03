# AK Golf Design System & Wireframing Guide

> **For Claude Chat** — Kopier dette til nye samtaler for konsistent design og utvikling.

---

## 1. BRAND IDENTITY

**Selskap:** AK Golf Group AS
**Produkt:** Premium golfcoaching-plattform
**Stil:** Apple-inspirert, minimalistisk, profesjonell
**Tema:** Light Mode Only (ingen dark mode)

### Brand Personlighet
- **Premium** — Høy kvalitet, ikke budsjett
- **Profesjonell** — Seriøs, ikke leken
- **Minimalistisk** — Rent, ikke rotete
- **Tillitsvekkende** — Ekspertise, ikke amatør

---

## 2. FARGEPALETT (Apple Light 2026)

### Primærfarger
```css
--color-black: #1D1D1F;      /* Tekst, logo, primærknapper */
--color-white: #FFFFFF;       /* Bakgrunn */
```

### Gråskala
```css
--color-grey-100: #F5F5F7;   /* Sekundær bakgrunn, cards */
--color-grey-200: #E8E8ED;   /* Borders, dividers */
--color-grey-300: #D2D2D7;   /* Inactive states */
--color-grey-400: #86868B;   /* Placeholder, muted text */
--color-grey-500: #6E6E73;   /* Sekundær tekst */
--color-grey-600: #48484A;   /* Tertiær tekst */
--color-grey-900: #1D1D1F;   /* Primær tekst */
```

### Semantiske farger
```css
--color-success: #34C759;    /* Suksess, bekreftelse */
--color-error: #FF3B30;      /* Feil, advarsler */
--color-warning: #FF9500;    /* Varsler */
--color-info: #007AFF;       /* Info, lenker */
```

### ALDRI BRUK
- `#B07D4F` (bronse/gull) — Fjernet fra brand
- `--color-gold` — Eksisterer ikke
- `--apple-gold-*` — Eksisterer ikke
- `--color-ink-*` (dark theme) — Kun for legacy-kompatibilitet
- Hardkodede hex-verdier — Bruk alltid CSS-variabler

---

## 3. TYPOGRAFI

### Font
```css
font-family: Inter, system-ui, -apple-system, sans-serif;
```

### Størrelser
| Element | Størrelse | Vekt | Letter-spacing |
|---------|-----------|------|----------------|
| Hero H1 | 56-80px | 700 | -0.03em |
| H1 | 40-48px | 700 | -0.025em |
| H2 | 32px | 600 | -0.02em |
| H3 | 24px | 600 | -0.01em |
| H4 | 18px | 600 | 0 |
| Body | 16px | 400 | 0 |
| Small | 14px | 400 | 0 |
| Caption | 12px | 500 | 0.05em |

### Portal Heading Klasser
```css
.portal-h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; }
.portal-h2 { font-size: 1.5rem; font-weight: 600; }
.portal-h3 { font-size: 1.125rem; font-weight: 600; }
.portal-h4 { font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
```

---

## 4. SPACING (8pt Grid)

```css
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
--space-20: 80px;
--space-24: 96px;
```

### Seksjon-spacing
- **Desktop:** 80-120px mellom seksjoner
- **Mobil:** 48-64px mellom seksjoner
- **Card padding:** 24px
- **Form gap:** 16px mellom felter

---

## 5. BORDER RADIUS

```css
--radius-sm: 8px;      /* Små elementer, badges */
--radius-md: 12px;     /* Inputs, små cards */
--radius-lg: 16px;     /* Cards, modaler */
--radius-xl: 20px;     /* Store cards */
--radius-pill: 980px;  /* Knapper, pills */
--radius-full: 9999px; /* Sirkler */
```

---

## 6. SHADOWS

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.08);
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.02);
--shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.04);
```

---

## 7. ANIMASJONER

### Easing
```css
--ease-apple: cubic-bezier(0.4, 0, 0.2, 1);     /* Standard */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bounce */
--ease-out-expo: cubic-bezier(0, 0.55, 0.45, 1);  /* Smooth out */
```

### Varighet
```css
--duration-fast: 150ms;   /* Hover, small elements */
--duration-normal: 300ms; /* Standard transitions */
--duration-slow: 500ms;   /* Page transitions, modals */
```

### VIKTIG: Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. KOMPONENT-MØNSTRE

### Knapper

**Primær (CTA)**
```html
<button class="bg-[var(--color-grey-900)] text-white px-6 py-3 rounded-full
               font-semibold hover:bg-[var(--color-grey-900)]/90
               transition-colors">
  Book coaching
</button>
```

**Sekundær**
```html
<button class="bg-white border border-[var(--color-grey-200)] text-[var(--color-grey-900)]
               px-6 py-3 rounded-full font-semibold hover:bg-[var(--color-grey-100)]
               transition-colors">
  Les mer
</button>
```

**Ghost**
```html
<button class="text-[var(--color-grey-900)] font-medium hover:text-[var(--color-grey-500)]
               transition-colors">
  Avbryt
</button>
```

### Cards

```html
<div class="bg-white border border-[var(--color-grey-200)] rounded-[20px] p-6
            shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]
            transition-shadow">
  <!-- Innhold -->
</div>
```

### Inputs

```html
<input
  type="text"
  class="w-full px-4 py-3 bg-white border border-[var(--color-grey-200)] rounded-xl
         text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]
         focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20
         focus:border-[var(--color-grey-900)] transition-[border-color,box-shadow]"
  placeholder="Skriv her..."
/>
```

### Modaler

```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title"
     class="fixed inset-0 z-[70] flex items-center justify-center">
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

  <!-- Dialog -->
  <div class="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4
              shadow-[var(--shadow-lg)] overscroll-behavior-contain">
    <h2 id="modal-title">Tittel</h2>
    <!-- Innhold -->
  </div>
</div>
```

---

## 9. LAYOUT-REGLER

### Container
```css
.w-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 1024px) {
  .w-container { padding: 0 48px; }
}
```

### Grid
```css
/* Cards grid */
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
gap: 24px;

/* 2-kolonne */
grid-template-columns: repeat(2, 1fr);
gap: 32px;

/* 3-kolonne */
grid-template-columns: repeat(3, 1fr);
gap: 24px;
```

### Portal Layout
```
┌─────────────────────────────────────────────┐
│ Topbar (h: 64px, sticky)                    │
├────────┬────────────────────────────────────┤
│        │                                    │
│ Side-  │  Main Content                      │
│ bar    │  (max-w: 1400px, mx-auto)          │
│ (256px)│  (p: 32px)                         │
│        │                                    │
└────────┴────────────────────────────────────┘
```

---

## 10. RESPONSIVT DESIGN

### Breakpoints
```css
sm: 640px   /* Mobil landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Stor desktop */
2xl: 1536px /* Ultrawide */
```

### Mobil-først
```css
/* Base = mobil */
.element { padding: 16px; }

/* Tablet og opp */
@media (min-width: 768px) {
  .element { padding: 24px; }
}

/* Desktop og opp */
@media (min-width: 1024px) {
  .element { padding: 32px; }
}
```

---

## 11. TILGJENGELIGHET (A11Y)

### Obligatorisk
- `role="dialog"` + `aria-modal="true"` på modaler
- `aria-labelledby` / `aria-describedby` på modaler
- `aria-label` på icon-buttons
- `aria-hidden="true"` på dekorative ikoner
- `aria-live="assertive"` på feilmeldinger
- `htmlFor` + `id` på label/input par
- `autoComplete` på alle form-felter

### Focus States
```css
/* Alle interaktive elementer MÅ ha synlig focus */
focus-visible:ring-2 focus-visible:ring-[var(--color-grey-900)]/20
focus-visible:ring-offset-2
```

### Skip Link
```html
<a href="#main-content"
   class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
          focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-grey-900)]
          focus:text-white focus:rounded-lg">
  Hopp til hovedinnhold
</a>
```

---

## 12. IKONER

### Bibliotek
Bruk **Lucide React** for alle ikoner.

```tsx
import { Calendar, User, Settings } from "lucide-react";

<Calendar className="w-5 h-5 text-[var(--color-grey-500)]" />
```

### Størrelser
- **16px** — Inline med tekst
- **20px** — Standard UI
- **24px** — Fremhevet
- **32px+** — Hero/illustrasjon

### ALDRI bruk emojier
```tsx
// FEIL
<span>📊 Statistikk</span>

// RIKTIG
<BarChart3 className="w-5 h-5" /> Statistikk
```

---

## 13. WIREFRAME-STRUKTUR

### Filnavn-konvensjon
```
apple-{kategori}-{side}.html

Eksempler:
apple-portal-dashboard.html
apple-admin-bookinger.html
apple-booking-skjema.html
```

### HTML-mal
```html
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AK Golf — [Sidenavn]</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    :root {
      --color-black: #1D1D1F;
      --color-white: #FFFFFF;
      --color-grey-100: #F5F5F7;
      --color-grey-200: #E8E8ED;
      --color-grey-400: #86868B;
      --color-grey-500: #6E6E73;
      --color-grey-900: #1D1D1F;
      --color-success: #34C759;
      --color-error: #FF3B30;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: var(--color-white);
      color: var(--color-grey-900);
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <!-- Wireframe innhold -->

  <script>lucide.createIcons();</script>
</body>
</html>
```

---

## 14. DO'S AND DON'TS

### DO
- Bruk CSS-variabler for alle farger
- Bruk `transition-[property]` i stedet for `transition-all`
- Bruk `rounded-full` (980px) for knapper
- Bruk Lucide-ikoner
- Respekter `prefers-reduced-motion`
- Test med tastatur og skjermleser
- Bruk norsk bokmål for all tekst

### DON'T
- Hardkode farger (`#1D1D1F` → `var(--color-grey-900)`)
- Bruk `transition-all` (performance)
- Bruk emojier
- Glem `aria-*` attributter på interaktive elementer
- Lag nye CSS-variabler uten å legge dem i globals.css
- Bruk gull/bronse aksent-farger
- Glem `autoComplete` på inputs
- Bruk `any` i TypeScript

---

## 15. SIDER I SYSTEMET

### Website (Offentlig)
| Side | Rute | Beskrivelse |
|------|------|-------------|
| Forside | `/` | Hero, metode, testimonials, CTA |
| Academy | `/academy` | Voksen coaching, pakker |
| Junior | `/junior-academy` | Junior Academy |
| Utvikling | `/utvikling` | B2B for klubber |
| Personvern | `/personvern` | Personvernerklæring |
| Booking | `/booking` | Booking-kategorier |

### Portal (Innlogget)
| Side | Rute | Beskrivelse |
|------|------|-------------|
| Dashboard | `/portal` | Oversikt, quick actions |
| Treningsplan | `/portal/treningsplan` | AI-planer |
| Statistikk | `/portal/statistikk` | Strokes Gained |
| Dagbok | `/portal/dagbok` | Treningslogg |
| Kalender | `/portal/kalender` | Timeplan |
| Profil | `/portal/profil` | Profil, mål |
| Apper | `/portal/apper` | Moduler, abonnement |

### Admin (Mission Control)
| Side | Rute | Beskrivelse |
|------|------|-------------|
| Hub | `/portal/admin` | Oversikt |
| Elever | `/portal/admin/elever` | Elevliste |
| Bookinger | `/portal/admin/bookinger` | Booking-håndtering |
| Kalender | `/portal/admin/kalender` | Instruktørkalender |
| Meldinger | `/portal/admin/meldinger` | Unified inbox |
| Analytics | `/portal/admin/analytics` | KPIer |

---

## 16. RASK REFERANSE

### Farger (kopier direkte)
```
Svart:        var(--color-grey-900) / #1D1D1F
Hvit:         var(--color-white) / #FFFFFF
Bakgrunn:     var(--color-grey-100) / #F5F5F7
Border:       var(--color-grey-200) / #E8E8ED
Muted tekst:  var(--color-grey-400) / #86868B
Sekundær:     var(--color-grey-500) / #6E6E73
Success:      var(--color-success) / #34C759
Error:        var(--color-error) / #FF3B30
```

### Tailwind-klasser (kopier direkte)
```
Primær knapp:     bg-[var(--color-grey-900)] text-white rounded-full px-6 py-3 font-semibold
Sekundær knapp:   bg-white border border-[var(--color-grey-200)] rounded-full px-6 py-3
Card:             bg-white border border-[var(--color-grey-200)] rounded-[20px] p-6
Input:            bg-white border border-[var(--color-grey-200)] rounded-xl px-4 py-3
Focus ring:       focus:ring-2 focus:ring-[var(--color-grey-900)]/20
```

---

**Sist oppdatert:** 2026-04-03
