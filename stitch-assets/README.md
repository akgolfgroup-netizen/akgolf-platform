# AK Golf Portal - Stitch Design Assets

Dette arkivet inneholder alle UI-designs, screenshots og HTML-kode eksportert fra **Stitch AI** for AK Golf Portal prosjektet.

## 📁 Struktur

```
stitch-assets/
├── mission-board/      # Mission Control (Admin) skjermer
├── spillerportal/      # Spillerportal skjermer
├── shared/             # Delte skjermer (Login, Booking, etc.)
└── README.md          # Denne filen
```

---

## 🎯 MISSION BOARD (Admin Portal)

**Tema:** Mørk profesjonell (#0A0D0A + Neon Lime #D2F000)

| # | Skjerm | Screenshot | HTML |
|---|--------|------------|------|
| 01 | **Admin Dashboard** | ![01](mission-board/01-admin-dashboard.png) | [HTML](mission-board/01-admin-dashboard.html) |
| 02 | **Admin Dashboard v5.0** | ![02](mission-board/02-admin-dashboard-v5.png) | [HTML](mission-board/02-admin-dashboard-v5.html) |
| 03 | **Analytics Dashboard** | ![03](mission-board/03-admin-analytics.png) | [HTML](mission-board/03-admin-analytics.html) |
| 04 | **Booking Management** | ![04](mission-board/04-admin-booking-management.png) | [HTML](mission-board/04-admin-booking-management.html) |
| 05 | **Waitlist Management** | ![05](mission-board/05-admin-waitlist.png) | [HTML](mission-board/05-admin-waitlist.html) |
| 06 | **Elevoversikt** | ![06](mission-board/06-elevoversikt.png) | [HTML](mission-board/06-elevoversikt.html) |
| 07 | **Studentprofil (Admin)** | ![07](mission-board/07-studentprofil-admin.png) | [HTML](mission-board/07-studentprofil-admin.html) |
| 08 | **Admin Kalender** | ![08](mission-board/08-admin-calendar.png) | [HTML](mission-board/08-admin-calendar.html) |
| 09 | **Rabattkoder** | ![09](mission-board/09-rabattkoder.png) | [HTML](mission-board/09-rabattkoder.html) |
| 10 | **Inntektsrapport** | ![10](mission-board/10-inntektsrapport.png) | [HTML](mission-board/10-inntektsrapport.html) |
| 11 | **Admin Innstillinger** | ![11](mission-board/11-admin-settings.png) | [HTML](mission-board/11-admin-settings.html) |

**Nøkkelfunksjoner:**
- Real-time statistikk og analytics
- Brukeradministrasjon med rolle-tildeling
- Booking kalender med drag-and-drop
- Inntektsrapportering
- Rabattkode-administrasjon
- Ventelistehåndtering

---

## 👤 SPILLERPORTAL (Player Portal)

**Tema:** Varm off-white (#FDF9F0 + AK Green #2D6A4F)

| # | Skjerm | Screenshot | HTML |
|---|--------|------------|------|
| 01 | **Player Dashboard (Bento)** | ![01](spillerportal/01-player-dashboard-bento.png) | [HTML](spillerportal/01-player-dashboard-bento.html) |
| 02 | **Mobil Dashboard** | ![02](spillerportal/02-mobil-dashboard.png) | [HTML](spillerportal/02-mobil-dashboard.html) |
| 03 | **Din Kalender** | ![03](spillerportal/03-din-kalender.png) | [HTML](spillerportal/03-din-kalender.html) |
| 04 | **Kalender Mobil** | ![04](spillerportal/04-kalender-mobil.png) | [HTML](spillerportal/04-kalender-mobil.html) |
| 05 | **Training Plan** | ![05](spillerportal/05-training-plan.png) | [HTML](spillerportal/05-training-plan.html) |
| 06 | **Statistikk** | ![06](spillerportal/06-statistics.png) | [HTML](spillerportal/06-statistics.html) |
| 07 | **Din Profil** | ![07](spillerportal/07-din-profil.png) | [HTML](spillerportal/07-din-profil.html) |
| 08 | **Økt-detaljer** | ![08](spillerportal/08-okt-detaljer.png) | [HTML](spillerportal/08-okt-detaljer.html) |
| 09 | **Notater fra timen (Mobil)** | ![09](spillerportal/09-notater-mobil.png) | [HTML](spillerportal/09-notater-mobil.html) |

**Nøkkelfunksjoner:**
- Personlig dashboard med bento-grid layout
- Treningsplan med kalenderintegrasjon
- Statistikk og performance tracking
- Booking av økter
- Coach-notater og tilbakemeldinger
- Profiladministrasjon

---

## 🔗 DELTE SKJERMER

**Brukes av begge portaler:**

| # | Skjerm | Screenshot | HTML |
|---|--------|------------|------|
| 01 | **Login** | ![01](shared/01-login.png) | [HTML](shared/01-login.html) |
| 02 | **Booking Step 1** | ![02](shared/02-booking-step1.png) | [HTML](shared/02-booking-step1.html) |
| 03 | **Booking Step 2** | ![03](shared/03-booking-step2.png) | [HTML](shared/03-booking-step2.html) |
| 04 | **Booking Checkout** | ![04](shared/04-booking-checkout.png) | [HTML](shared/04-booking-checkout.html) |
| 05 | **Booking Success** | ![05](shared/05-booking-success.png) | [HTML](shared/05-booking-success.html) |

---

## 🎨 Design System

### Fargepalett

**Mission Control (Admin):**
- Background: `#0A0D0A` (Sort)
- Primary: `#D2F000` (Neon Lime)
- Secondary: `#2D6A4F` (AK Green)
- Text: `#FFFFFF` / `#E5E5E5`

**Spillerportal:**
- Background: `#FDF9F0` (Warm Off-White)
- Primary: `#2D6A4F` (AK Green)
- Secondary: `#D2F000` (Neon Lime - accent)
- Text: `#1D1D1F` / `#6B6B6B`

### Typografi
- **Font:** Manrope (Variable)
- **Headings:** Bold, tracking -0.03em
- **Body:** Regular, 16px base

### Komponenter
- **Cards:** 20px border-radius, tonal layering (ingen 1px borders)
- **Buttons:** Pill-form (980px radius), black bg, white text
- **Inputs:** Subtle shadows, focus states

---

## 🚀 Bruk i Next.js

### 1. Kopier HTML-kode
```bash
# Kopier ønsket HTML-fil til prosjektet
cp stitch-assets/mission-board/01-admin-dashboard.html app/admin/dashboard/
```

### 2. Konverter til React/Next.js
HTML-filene kan konverteres til React-komponenter. Hver HTML-fil inneholder:
- Komplett HTML-struktur
- Inline CSS (Tailwind-aktig)
- Responsivt design
- Interaktive elementer

### 3. Bruk Screenshots som Referanse
PNG-filene kan brukes som:
- Visuell referanse under utvikling
- Dokumentasjon
- Testing av visuell regresjon

---

## 📊 Oppsummering

| Kategori | Antall Skjermer | Størrelse |
|----------|-----------------|-----------|
| Mission Board | 11 | 304K |
| Spillerportal | 9 | 224K |
| Delte | 5 | 92K |
| **Totalt** | **25** | **620K** |

---

## 🔗 Stitch Prosjekt Info

- **Prosjekt ID:** `8751140560515259594`
- **Prosjektnavn:** AK Golf Portal Redesign
- **Antall skjermer i Stitch:** 50+
- **Sist oppdatert:** 2026-04-09

---

## 📝 Lisens

Designene er generert av Stitch AI for AK Golf Academy.
Alle rettigheter tilhører AK Golf Academy.
