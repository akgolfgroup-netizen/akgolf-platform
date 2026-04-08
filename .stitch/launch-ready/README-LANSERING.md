# 🚀 AK Golf Portal - Lanseringspakke

**Dato:** 2026-04-06  
**Status:** KLAR FOR LANSERING  
**Farger:** Deep Emerald #00594C (oppdater fra grayscale)

---

## 📦 INNHOLD

### 1. LANDING (Website)
- `landing/index.html` - Hovedlandingsside
- `landing/priser.html` - Tjenester og priser
- `landing/om-oss.html` - Om oss
- `landing/faq.html` - Ofte stilte spørsmål
- `landing/kontakt.html` - Kontaktside
- `landing/b2b.html` - Bedriftsgolf
- `landing/junior.html` - Junior Academy
- `landing/trackman.html` - Trackman teknologi

### 2. BOOKING (4-stegs wizard)
- `booking/step-1-tjeneste.html` - Velg tjeneste
- `booking/step-2-tid.html` - Velg dato og tid
- `booking/step-3-detaljer.html` - Dine detaljer
- `booking/step-4-betaling.html` - Betaling
- `booking/bekreftet.html` - Booking bekreftet
- `booking/kansellert.html` - Booking kansellert

### 3. PORTAL (Spiller-dashboard)
- `portal/dashboard.html` - Hoveddashboard
- `portal/kalender.html` - Din kalender
- `portal/treningsplan.html` - Treningsplan
- `portal/statistikk.html` - Statistikk
- `portal/dagbok.html` - Golf-dagbok
- `portal/profil.html` - Din profil

### 4. AUTH (Innlogging)
- `auth/login.html` - Logg inn
- `auth/registrer.html` - Opprett konto
- `auth/glemt-passord.html` - Glemt passord
- `auth/onboarding-1.html` - Onboarding steg 1
- `auth/onboarding-2.html` - Onboarding steg 2

### 5. ADMIN (Management)
- `admin/dashboard.html` - Admin dashboard
- `admin/elever.html` - Elevoversikt
- `admin/bookinger.html` - Bookingoversikt
- `admin/kalender.html` - Admin kalender
- `admin/rapporter.html` - Inntektsrapporter

### 6. ERRORS
- `errors/404.html` - Side ikke funnet
- `errors/500.html` - Serverfeil
- `errors/maintenance.html` - Vedlikehold

---

## 🎨 FARGE-OPPDATERING (VIKTIG!)

### Fra Grayscale → Deep Emerald

**Erstatt i ALLE filer:**
```css
/* GAMMELT (Grayscale) */
--primary: #333333;
--primary-dark: #1A1A1A;

/* NYTT (Deep Emerald) */
--primary: #00594C;
--primary-dark: #004A3F;
--primary-light: #007A69;
```

**HTML fargekoder å erstatte:**
- `#333333` → `#00594C`
- `#1A1A1A` → `#004A3F`
- `#666666` → `#007A69` (brukes som accent)

---

## 🖼️ BILDE-ERSTATNING

### Erstatt placeholder-bilder med lokale:

```html
<!-- FØR (Stitch placeholder) -->
<img src="https://placeholder.com/...">

<!-- ETTER (Lokale bilder) -->
<img src="/images/hero/hero-main.jpg">
<img src="/images/sections/trackman.jpg">
<img src="/images/sections/putting.jpg">
<img src="/images/sections/banecoaching.jpg">
<img src="/images/team/anders-kristiansen.jpg">
```

### Tilgjengelige bilder i `/public/images/`:
- `hero/hero-main.jpg` (2400x1600)
- `hero/forside.jpg` (2400x1600)
- `sections/trackman.jpg`
- `sections/putting.jpg`
- `sections/banecoaching.jpg`
- `sections/instruksjon.jpg`
- `sections/bunker.jpg`
- `team/anders-kristiansen.jpg`

---

## ⚡ HURTIG LANSERING (3 steg)

### Steg 1: Eksporter fra Stitch
1. Gå til https://labs.google.com/stitch
2. Åpne "AK Golf Portal Redesign"
3. For hver skjerm: Klikk "Export" → "HTML"
4. Lagre til riktig mappe over

### Steg 2: Oppdater farger
Kjør dette søk-og-erstatt i alle HTML-filer:
```bash
# Mac/Linux
find . -name "*.html" -exec sed -i '' 's/#333333/#00594C/g' {} \;
find . -name "*.html" -exec sed -i '' 's/#1A1A1A/#004A3F/g' {} \;
```

### Steg 3: Erstatt bilder
Søk etter `placeholder` eller `unsplash` i HTML-filene og erstatt med lokale bilder.

---

## 📱 MOBIL-FIRST

Alle skjermer er responsive og mobile-optimalisert.
Test på:
- iPhone 12/13/14/15 (390px bredde)
- iPad (768px bredde)
- Desktop (1920px bredde)

---

## ✅ LANSERINGSSJEKKLISTE

- [ ] Alle HTML-filer eksportert fra Stitch
- [ ] Farger oppdatert til #00594C
- [ ] Placeholder-bilder erstattet
- [ ] Lenker mellom sider fungerer
- [ ] Mobilvisning testet
- [ ] Stripe integrert på betalingsside
- [ ] Auth0/Login fungerer
- [ ] Analytics (GA4) på plass

---

## 🎯 LANSERINGSREKKEFØLGE

1. **Landingssider** (Umiddelbart live)
2. **Booking wizard** (Kjerne-funksjon)
3. **Auth** (Innlogging)
4. **Portal** (For loggede inn brukere)
5. **Admin** (Kun for ansatte)

---

**KLAR FOR LANSERING! 🚀**
