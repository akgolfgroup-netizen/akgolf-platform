# AK Golf Branding i Booking-systemet

> Plan for integrasjon av AK Golf visuell identitet i booking-flyten

---

## 1. Overordnet Brand-Strategi

### Primære Brand-Elementer
| Element | Verdi | Bruk i Booking |
|---------|-------|----------------|
| **Gull** | `#B8975C` | Knapper, highlights, aksenter |
| **Navy** | `#0F2950` | Headere, viktig tekst, kontrast |
| **Deep Ink** | `#0A1929` | Bakgrunn (hvis mørk modus) |
| **Font** | Inter | All tekst i booking-flyten |

### Tone of Voice
- **Profesjonell men varm** — ikke for formelt
- **Kort og konsist** — respekterer kundens tid
- **Aktiverende** — "Bekreft booking" ikke "Send"

---

## 2. Stedvis Branding-Integrasjon

### Steg 1: Tjeneste-valg
```
Current: Generiske kort
Target:  Tjenestekort med:
         - Navy header (#0F2950)
         - Gull pris-tag (#B8975C)
         - Ikon fra Lucide (ikke custom)
         - Subtile hover-animasjoner
```

**Endringer nødvendig:**
- [ ] Oppdatere `ServiceSelector.tsx`
- [ ] Legge til tjeneste-ikoner (golf, simulator, gruppe)
- [ ] Gull aksent på valgt tjeneste

### Steg 2: Instruktør-valg
```
Current: Tekst-liste
Target:  Profilkort med:
         - Sirkulært profilbilde
         - Navn + tittel
         - Kort bio (2 linjer)
         - Gull border på hover
```

**Endringer nødvendig:**
- [ ] Hente profilbilder fra instruktører
- [ ] Oppdatere `InstructorSelector.tsx`
- [ ] Legge til bio-felt i database

### Steg 3: Dato/Tid-valg
```
Current: Standard kalender
Target:  Elegant kalender med:
         - Gull på valgt dato
         - Navy på dagens dato
         - Smooth transitions
         - "Ledige tider" header i Navy
```

**Endringer nødvendig:**
- [ ] Oppdatere `DateTimePicker.tsx`
- [ ] Custom kalender-komponent
- [ ] Tids-slot design med gull hover

### Steg 4: Kundeopplysninger
```
Current: Grå standard-skjema
Target:  Rent skjema med:
         - Navy labels
         - Gull focus-states
         - Hjelpetekst i secondary gray
         - Progress indicator øverst
```

**Endringer nødvendig:**
- [ ] Oppdatere `CustomerForm.tsx`
- [ ] Custom input-felter med brand-farger
- [ ] Progress-bar med gull fill

### Steg 5: Betaling
```
Current: Stripe default + Vipps (fjernet)
Target:  Stripe themed med:
         - Gull primary color
         - Navy tekst
         - AK Golf logo over betalingsfelt
         - "Sikker betaling" badge
```

**Allerede implementert:** ✅
- Stripe theme med brand-farger
- Sikker betaling-badge

### Bekreftelse
```
Current: Standard success
Target:  Premium success med:
         - Animasjon (checkmark)
         - Gull konfetti (subtil)
         - E-post preview
         - CTA: "Gå til min side"
```

**Endringer nødvendig:**
- [ ] Oppdatere `Confirmation.tsx`
- [ ] Lottie/smil animasjon
- [ ] E-post preview-komponent

---

## 3. Komponent-Struktur

```
app/booking/
├── page.tsx                    # Hovedwizard (allerede brandet)
├── layout.tsx                  # Brand-spesifikk layout
├── components/
│   ├── ServiceSelector.tsx     # + Brand styling
│   ├── InstructorSelector.tsx  # + Profilkort
│   ├── DateTimePicker.tsx      # + Custom kalender
│   ├── CustomerForm.tsx        # + Brand inputs
│   ├── PaymentStep.tsx         # ✅ Allerede brandet
│   ├── Confirmation.tsx        # + Premium success
│   └── ProgressBar.tsx         # NY: Gull progress
└── branding/
    ├── BookingHeader.tsx       # NY: Logo + tittel
    ├── BrandDivider.tsx        # NY: Gull divider
    └── ServiceIcon.tsx         # NY: Tjeneste-ikoner
```

---

## 4. Tekniske Detaljer

### Farge-Variabler (Tailwind)
```javascript
// tailwind.config.ts eller globals.css
const brandColors = {
  gold: '#B8975C',
  navy: '#0F2950',
  'deep-ink': '#0A1929',
  'ink-90': '#1a2d3d',
  'ink-50': '#64748B',
  'ink-20': '#EBE5DA',
}
```

### Stripe Theme (Allerede implementert)
```javascript
const STRIPE_THEME = {
  colorPrimary: '#B8975C',    // Gull
  colorBackground: '#FFFFFF',
  colorText: '#0F2950',       // Navy
  colorDanger: '#EF4444',
}
```

---

## 5. MVP vs Full Branding

### MVP (Rask implementering)
- [x] Stripe theme med brand-farger ✅
- [x] Gull knapper ✅
- [x] Navy tekst ✅
- [ ] Progress bar med gull
- [ ] Service-ikoner

### Full Branding (Komplett opplevelse)
- [ ] Custom kalender-komponent
- [ ] Instruktør-profilkort
- [ ] Lottie-animasjoner
- [ ] Micro-interactions
- [ ] E-post templates i brand

---

## 6. Implementerings-Prioritering

| # | Oppgave | Estimat | Impact |
|---|---------|---------|--------|
| 1 | Progress bar med gull | 1t | Medium |
| 2 | Service-ikoner | 2t | Medium |
| 3 | Instruktør profilkort | 3t | Høy |
| 4 | Kalender redesign | 4t | Høy |
| 5 | Bekreftelse-animasjon | 2t | Medium |

---

## 7. Testing & QA

### Visuell QA
- [ ] Farger matcher Brand Guide
- [ ] Kontrast tilfredsstiller WCAG AA
- [ ] Mobil: Touch targets > 44px
- [ ] Desktop: Hover-states fungerer

### Funksjonell QA
- [ ] Alle steg fungerer som før
- [ ] Stripe betaling ikke påvirket
- [ ] Responsiv design fungerer
