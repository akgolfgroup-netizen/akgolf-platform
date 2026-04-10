# AK Golf Branding i Booking-systemet

> **Oppdatert:** 2026-04-01
> **Brand Guide:** Apple Light 2026 (Monokrom)

---

## 1. Overordnet Brand-Strategi

### Brand Guide 2026 — Apple Light
| Element | Verdi | Bruk i Booking |
|---------|-------|----------------|
| **Svart** | `#1D1D1F` | Primær-knapper, tekst, logo |
| **Hvit** | `#FFFFFF` | Bakgrunn |
| **Grey-100** | `#F5F5F7` | Sekundær bakgrunn |
| **Grey-200** | `#E8E8ED` | Borders, dividers |
| **Grey-500** | `#6E6E73` | Sekundær tekst |
| **Font** | Inter | All tekst i booking-flyten |

### Tone of Voice
- **Profesjonell men varm** — ikke for formelt
- **Kort og konsist** — respekterer kundens tid
- **Aktiverende** — "Bekreft booking" ikke "Send"

---

## 2. Design Prinsipper

### Apple-inspirert Monokrom
- **Ingen aksent-farger** — kun svart/hvit/grå
- **Pill-knapper** — `border-radius: 980px`
- **Subtile skygger** — `shadow-sm` til `shadow-md`
- **Glassmorfisme** — `backdrop-blur` på header

### Komponenter
```
components/portal/apple/
├── apple-button.tsx      # Pill-knapper, svart/hvit
├── apple-card.tsx        # Hvit bg, subtil border
├── apple-badge.tsx       # Status-badges
└── bento-grid.tsx        # 12-kolonne grid
```

---

## 3. Booking-flyt Design

### Steg 1: Tjeneste-valg
- **Kort-design:** Hvit bakgrunn, 1px border `#E8E8ED`
- **Valgt tilstand:** Svart border, subtil skygge
- **Ikoner:** Lucide icons, svart
- **Pris:** Sekundær tekst (`#6E6E73`)

### Steg 2: Instruktør-valg
- **Profilkort:** Sirkulært bilde, navn, tittel
- **Bio:** Maks 2 linjer, sekundær tekst
- **Valgt tilstand:** Svart border

### Steg 3: Dato/Tid-valg
- **Kalender:** Ren design, svart på valgt dato
- **Ledige tider:** Pill-knapper
- **Opptatt:** Grå, disabled

### Steg 4: Kundeopplysninger
- **Input-felter:** Hvit bakgrunn, grå border
- **Focus-state:** Svart border
- **Labels:** Svart tekst
- **Hjelpetekst:** Sekundær grå

### Steg 5: Bekreftelse
- **Suksess-ikon:** Checkmark i sirkel
- **Booking-detaljer:** Rent oppsett
- **CTA:** "Gå til mine bookinger"

---

## 4. Farge-Variabler

```css
/* Brand Guide 2026 — Apple Light */
--color-black: #1D1D1F;
--color-white: #FFFFFF;
--color-grey-50: #FBFBFD;
--color-grey-100: #F5F5F7;
--color-grey-200: #E8E8ED;
--color-grey-300: #D2D2D7;
--color-grey-400: #86868B;
--color-grey-500: #6E6E73;
--color-grey-900: #1D1D1F;

/* Semantisk */
--color-success: #34C759;
--color-error: #FF3B30;
--color-warning: #FF9500;
--color-info: #007AFF;
```

### Stripe Theme
```javascript
const STRIPE_THEME = {
  colorPrimary: '#1D1D1F',     // Svart
  colorBackground: '#FFFFFF',
  colorText: '#1D1D1F',
  colorDanger: '#FF3B30',
}
```

---

## 5. Implementert Status

### Fullført ✅
- [x] Monokrom design system
- [x] Apple-komponenter (AppleCard, AppleButton, etc.)
- [x] Stripe theme med brand-farger
- [x] Progress bar
- [x] Service-ikoner
- [x] Instruktør-profilkort
- [x] Kalender-design
- [x] Bekreftelse-side

---

## 6. Testing & QA

### Visuell QA
- [x] Farger matcher Brand Guide 2026
- [x] Kontrast tilfredsstiller WCAG AA
- [x] Mobil: Touch targets > 44px
- [x] Desktop: Hover-states fungerer

### Funksjonell QA
- [x] Alle steg fungerer
- [x] Stripe betaling fungerer
- [x] Responsiv design fungerer
