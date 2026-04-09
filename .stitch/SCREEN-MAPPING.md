# AK Golf Platform — Screen Mapping fra Stitch Heritage

**Prosjekt:** AK Golf Portal Redesign (ID: 8751140560515259594)  
**Dato:** 9. april 2026  
**Status:** Kartlegging fullført

---

## OVERSIKT: TILGJENGELIGE SCREENS

AK Golf Portal Redesign prosjektet inneholder **200+ screens** fordelt på ulike kategorier.  
Nedenfor er en systematisk kartlegging av hvilke screens som skal brukes til hvilke sider i plattformen.

---

## 1. LANDING PAGE (MARKETING)

### Målside: `/` (Landing)

**Anbefalte Screens fra Stitch:**

| Screen ID | Label/Posisjon | Bruk til |
|-----------|----------------|----------|
| `0e5825b11bc54b9f8fcf61748d3c367c` | Academy Player Dashboard (Bento) | **Hovedreferanse** - Bento layout, hero-seksjon |
| `2023dc0cc6194f898c0037974bf42c89` | x:3936, y:7308 | Hero med tjeneste-kort |
| `51c42aa118ac4616b79fd099d3a69b8e` | x:2258, y:13971 | Landing med CTA-seksjoner |
| `bb0f63f3eb5b4627a963c76d9e4b1c86` | x:913, y:13948 | Features/services grid |
| `f15b1507206c4dbcb17af759fd76b4a4` | x:3639, y:13963 | Testimonials/seksjoner |

**Tilpasninger:**
- Bruk bento-grid layout fra `0e5825b11bc54b9f8fcf61748d3c367c`
- Erstatt WANG-branding med AK Golf branding (Deep Emerald #00594C)
- Bevar asymmetriske hero-layouts
- Tilpass tjeneste-kort til AK Golf sine tjenester

---

## 2. BOOKING FLOW

### 2.1 Tjeneste-valg: `/booking`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `2bd9de43b8d74906bf8c4d71196b5894` | x:1024, y:55723 | **Hovedreferanse** - Tjeneste-valg grid |
| `44483c913a1540de821db97747fb5b53` | x:1024, y:67349 | Kort med pris og varighet |
| `16ad641110044401a41e50dee4af1c46` | x:1024, y:68842 | Tjeneste-kort layout |
| `93045bf4740a400cb96b3fb2e8091424` | x:1024, y:57098 | Booking flow step 1 |

**Tilpasninger:**
- Grid av tjeneste-kort med bilder
- Hvert kort: bilde, navn, beskrivelse, pris (tabular nums), varighet
- Deep Emerald CTA-knapp på hvert kort
- Warm Stone bakgrunn

---

### 2.2 Instruktør-valg: `/booking/instructor`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `3543eaae9af145df99ba7d89345e1086` | x:3712, y:20054 | **Hovedreferanse** - Instruktør-profiler |
| `b4cb1693e3f94e999ffdf7e954fc2a60` | x:2368, y:20054 | Profil-kort grid |
| `7ff90a85d2864b5f958541ce0530d080` | x:5056, y:20054 | Instruktør-visning |

**Tilpasninger:**
- Profil-kort med bilde, navn, bio, spesialisering
- Rating/stjerner
- "Velg" knapp per instruktør
- Filter/søk øverst

---

### 2.3 Dato & Tid: `/booking/datetime`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `8e4a4716e8bb41288dc8523dbaf85eb8` | x:1024, y:49815 | **Hovedreferanse** - Kalender + tidsvelger |
| `d255b24f1b814f9a89e5b79f0bf66a18` | x:1024, y:51534 | Kalender-layout |
| `5bc65549d32d44428e6ff46e9ee7a4a8` | x:1032, y:48211 | Tidspunkt-visning |

**Tilpasninger:**
- Kalender (ukevisning)
- Tids-slots med ledig/opptatt indikator
- Deep Emerald for ledige tider
- Gray for opptatt
- Hover-effekter på valgbare tider

---

### 2.4 Review & Confirm: `/booking/review-confirm`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `1cc1a8409fec41c6a2ea2227b6ad0089` | x:1024, y:119068 | **Hovedreferanse** - Oppsummering + skjema |
| `2267cb11b42442569f385618b6ef7b86` | x:1024, y:113734 | Booking review layout |
| `5e6c1a6cfbb2428cb26a65ff469f62ba` | x:1024, y:108209 | Bekreftelses-side |

**Tilpasninger:**
- Oppsummering: tjeneste, instruktør, tid, pris
- Bruker-info skjema: navn, email, telefon, handicap
- Betalings-valg (Stripe)
- Vilkår checkbox
- "Bekreft booking" CTA

---

### 2.5 Success: `/booking/success`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `b91dc76e27ae44c4b986bb174fc6f20d` | x:1024, y:61099 | **Hovedreferanse** - Suksess-melding |
| `cf965130900b4578a8efb2a96ab83cdb` | x:1024, y:89980 | Booking bekreftelse |

**Tilpasninger:**
- Suksess-ikon + melding
- Booking-detaljer
- "Legg til i kalender" knapp
- "Se mine bookinger" lenke

---

### 2.6 Cancel: `/booking/cancel`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `5482b6cc39c444ffa2379c6dd3bc7edb` | x:0, y:87767 | **Hovedreferanse** - Avbrudds-side |

**Tilpasninger:**
- Avbrudds-melding
- "Tilbake til booking" CTA
- Kontakt-informasjon

---

## 3. PLAYER PORTAL

### 3.1 Dashboard: `/portal`

**Anbefalte Screens:**

| Screen ID | Label/Posisjon | Bruk til |
|-----------|----------------|----------|
| `0e5825b11bc54b9f8fcf61748d3c367c` | Academy Player Dashboard (Bento) | **Hovedreferanse** - Bento dashboard |
| `464852b1641f49f39ff0c92a1ada06db` | x:-401, y:20070 | Dashboard med stats |
| `3c87e6e924294e06b5328b6f925a7d09` | x:3663, y:43669 | Player dashboard v2 |
| `9aa01170b8794d86ab23572de4a85213` | x:-3969, y:7591 | Dashboard layout |
| `a8523281618a45a9af5e79790fdce8e8` | x:-3982, y:6063 | Dashboard med KPI |
| `afd457e9efc8424b89f9e60e11b047c6` | x:-1287, y:6110 | Player overview |

**Tilpasninger:**
- Bento grid med varierte kort-størrelser
- KPI-kort: handicap, runder spilt, gjennomsnittsscore
- Siste runder liste
- Kommende bookinger
- Mål-progress
- AI-anbefalinger (purple accent)

---

### 3.2 Stats: `/portal/stats`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `2c91be8ed84843eda634a4a4008a0cbc` | x:5984, y:41119 | **Hovedreferanse** - Statistikk-side |
| `5bc65549d32d44428e6ff46e9ee7a4a8` | x:1032, y:48211 | Stats med grafer |
| `eed96d62cfa44378afadc70a1eda05a1` | x:1024, y:35855 | Detaljert statistikk |

**Tilpasninger:**
- Grafer: handicap-utvikling, score-trender
- Sammenligninger (vs forrige måned/år)
- Stat-kort med sparklines
- Filter per tidsperiode

---

### 3.3 Rounds: `/portal/rounds`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `1e9b5c91b9e94a3eb885e46756e45a63` | x:0, y:103379 | **Hovedreferanse** - Runder-liste |
| `234f603c97ea44549736e3c4bdd67c4c` | x:0, y:26369 | Runder med detaljer |
| `9cf7e77c921d4733aceae2ca64824827` | x:0, y:30750 | Round history |

**Tilpasninger:**
- Liste over spilte runder
- Hver rad: dato, bane, score, handicap justering
- Klikk for detaljer
- Søk/filter

---

### 3.4 Goals: `/portal/goals`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `7d0093c9da7f4634938a03a97a014494` | x:1024, y:127489 | **Hovedreferanse** - Mål-tracking |
| `f9f839ed89df40fe962efb04fb6f9756` | x:1024, y:101249 | Goals dashboard |

**Tilpasninger:**
- Mål-kort med progress bars
- AI-anbefalinger (purple cards)
- Fullførte vs aktive mål
- Nytt mål-knapp

---

### 3.5 Academy: `/portal/academy`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `1514b65d6a314893a63703a51d3a5d33` | x:1024, y:70375 | **Hovedreferanse** - Academy dashboard |
| `2f6a383ed1b24b2f903b31f25eecf915` | x:1024, y:85779 | Kurs-oversikt |
| `bd2a1f1795414093aae1eadc0967ae10` | x:1024, y:77228 | Academy progress |

**Tilpasninger:**
- Kurs-kort med progress
- Sertifiseringer
- Video-bibliotek
- Oppgave-liste

---

### 3.6 Settings: `/portal/settings`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `432106d84f1147e7922be023d50247a8` | x:1024, y:157945 | **Hovedreferanse** - Innstillinger |
| `1cc1a8409fec41c6a2ea2227b6ad0089` | x:1024, y:119068 | Profil-innstillinger |

**Tilpasninger:**
- Profil-redigering
- Varsel-innstillinger
- Betalings-metoder
- Passord/endre

---

## 4. ADMIN PORTAL

### 4.1 Dashboard: `/admin`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `3b89fbc64a05428d9e4c0f518d33afe5` | x:-13870, y:1853 | **Hovedreferanse** - Admin dashboard |
| `ae70cc1791d749f4b71b63b26d401df0` | x:-12638, y:576 | Admin overview |
| `711019453aff4c89a8a2ceff3813d0bf` | x:-12543, y:1505 | Dashboard layout |

**Tilpasninger:**
- KPI-rad: inntekter, bookings, nye spillere, belegg
- Dagens schedule (timeline)
- Recent activity liste
- Quick actions knapper

---

### 4.2 Bookings: `/admin/bookings`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `4c171b3ba21d4325b5181aa6b9f0de5a` | x:2919, y:64714 | **Hovedreferanse** - Booking-oversikt |
| `c4333e9bd51b4849bca6947422e469be` | x:1508, y:73628 | Booking management |
| `d2f4f36901da452688269c5c1a30729c` | x:161, y:73598 | Kalender-visning |

**Tilpasninger:**
- Kalender/liste toggle
- Filter: dato, instruktør, status
- Handlinger: rediger, kanseller, flytt
- Ny booking-knapp

---

### 4.3 Players: `/admin/players`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `4c669c9bc99d4763a91de561e621c3e1` | x:-1376, y:82620 | **Hovedreferanse** - Spiller-oversikt |
| `6a5f8b15671a4e289c0ed1feae3b4017` | x:-2835, y:82600 | Player management |
| `b74e979c63d04940ba877ce28c6750da` | x:-1365, y:83750 | Spiller-tabell |

**Tilpasninger:**
- Tabell med søk og filter
- Kolonner: navn, email, handicap, siste booking
- Klikk for spiller-profil
- Eksport-funksjon

---

### 4.4 Instructors: `/admin/instructors`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `ead70e08a91c4ccfa34290e85fccdf6b` | x:3975, y:8969 | **Hovedreferanse** - Instruktør-management |
| `eb4924b776ce423cbfb4302b140a7861` | x:5503, y:7448 | Instruktør-profiler |
| `806d21b4be3c4325a1bd3171816f494b` | x:5591, y:8992 | Tilgjengelighet |

**Tilpasninger:**
- Instruktør-liste med bilder
- Profil-redigering
- Tilgjengelighets-kalender
- Tjeneste-tildeling

---

### 4.5 Services: `/admin/services`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `633a5f555ae54fadabea33348856ac8b` | x:10129, y:9008 | **Hovedreferanse** - Tjeneste-management |

**Tilpasninger:**
- Tjeneste-liste
- Pris-redigering
- Varighet, beskrivelse
- Aktiv/pause toggle

---

### 4.6 Analytics: `/admin/analytics`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `3c19a7be4566424b88192a2dae9a497a` | x:1024, y:169121 | **Hovedreferanse** - Analytics dashboard |
| `7070030efae64b2b94892d78d6744254` | x:1024, y:170773 | Inntekts-analyse |
| `551286164af040018e21e727fff87d47` | x:1024, y:176571 | Trend-analyse |

**Tilpasninger:**
- Inntekts-grafer
- Booking-trender
- Spiller-vekst
- Eksporter rapporter

---

## 5. AUTH & SYSTEM

### 5.1 Login: `/login`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `3f3e1ec219ce411283a63cd13e25621d` | x:2368, y:24808 | **Hovedreferanse** - Login form |
| `7a755ae49a3744d7beba1fc2813db7f4` | x:2368, y:22874 | Auth layout |
| `99eb613fe92b4f2d8c11d380d8342601` | x:1024, y:22874 | Login side |

**Tilpasninger:**
- Clean, minimal form
- Email + passord
- "Glemt passord" lenke
- Deep Emerald CTA

---

### 5.2 Register: `/register`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `adbeddd62bc740d4aa22b1e3a7e68d38` | x:1024, y:24808 | **Hovedreferanse** - Registrering |
| `95f097cd9db64c8db1fa5c7f0c593cd6` | x:3712, y:24808 | Step-by-step register |

**Tilpasninger:**
- Multi-step form
- Progress indicator
- Validering per steg

---

### 5.3 Forgot Password: `/forgot-password`

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `7e258d6521f74edf88084aacf31ef1d8` | x:1344, y:27299 | **Hovedreferanse** - Glemt passord |
| `f58f4bca1f524fc8903d1e60638929f1` | x:2688, y:27299 | Password reset |

**Tilpasninger:**
- Email input
- Send reset-lenke CTA
- Tilbake til login

---

### 5.4 Error Pages

**Anbefalte Screens:**

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `5a176cfad49b428495edd8554d3542f9` | x:0, y:31942 | **Hovedreferanse** - 404/error |
| `776655e4e65c4d30b92cadcd2a5f7856` | x:0, y:30595 | Error layout |

**Tilpasninger:**
- Hjelpsom feilmelding
- Navigasjon tilbake
- Kontakt support

---

## 6. MOBILE-SCREEN (390px bredde)

Følgende screens er allerede i mobile format (390px) og kan brukes som referanse for responsive design:

| Screen ID | Posisjon | Bruk til |
|-----------|----------|----------|
| `1049051574ac4e46bd542c58cf3e7be1` | x:0, y:33222 | Mobile layout referanse |
| `210ce986508540b5ab8cefc6e309da31` | x:1024, y:139455 | Mobile player portal |
| `370125fb0f25480697055e6ef1d3be3a` | x:1024, y:147988 | Mobile stats |
| `4192141a9bc1448caaae514dda45dad6` | x:1024, y:149276 | Mobile booking |
| `513814fd40f9410db6acb38a7cdc59c3` | x:1024, y:181109 | Mobile settings |
| `550e8e52e2c34f98b64208cd0512b4a9` | x:1024, y:141016 | Mobile dashboard |
| `856e1431ac224a6690e79c98f6481b33` | x:0, y:146195 | Mobile navigation |
| `90fe88d5f1cd4fd180848cbfdd16c053` | x:1024, y:142639 | Mobile cards |
| `a75fb3e7ff384af582ac33b3d8e21262` | x:1024, y:150698 | Mobile forms |
| `baf7f66d9fb2476b8bca100fc60a3ce2` | x:0, y:144055 | Mobile menu |
| `e08e88fb4a5e4c249c821354816de7c8` | x:1024, y:174064 | Mobile profile |

---

## 7. KOMPONENT-BIBLIOTEK REFERANSER

Følgende screens inneholder gode komponent-mønstre:

### Buttons
- `0e5825b11bc54b9f8fcf61748d3c367c` - Primary/Secondary/Ghost buttons

### Cards
- `0e5825b11bc54b9f8fcf61748d3c367c` - Bento cards (varied sizes)
- `464852b1641f49f39ff0c92a1ada06db` - Stat cards

### Forms/Inputs
- `3f3e1ec219ce411283a63cd13e25621d` - Login form
- `adbeddd62bc740d4aa22b1e3a7e68d38` - Registration form

### Navigation
- `0e5825b11bc54b9f8fcf61748d3c367c` - Top navigation
- `856e1431ac224a6690e79c98f6481b33` - Mobile navigation

### Tables/Lists
- `4c669c9bc99d4763a91de561e621c3e1` - Data tables
- `1e9b5c91b9e94a3eb885e46756e45a63` - List views

---

## 8. IMPLEMENTASJONS-REKKEFØLGE

Basert på screen-mapping, anbefales følgende rekkefølge:

### Fase 1: Design System (bruk eksisterende screens som referanse)
1. Analyser `0e5825b11bc54b9f8fcf61748d3c367c` for komponent-mønstre
2. Trekk ut farger, typografi, spacing
3. Bygg komponent-bibliotek

### Fase 2: Landing Page
1. Bruk `0e5825b11bc54b9f8fcf61748d3c367c` som hovedreferanse
2. Tilpass med AK Golf branding

### Fase 3: Booking Flow
1. `/booking` → `2bd9de43b8d74906bf8c4d71196b5894`
2. `/booking/instructor` → `3543eaae9af145df99ba7d89345e1086`
3. `/booking/datetime` → `8e4a4716e8bb41288dc8523dbaf85eb8`
4. `/booking/review-confirm` → `1cc1a8409fec41c6a2ea2227b6ad0089`
5. `/booking/success` → `b91dc76e27ae44c4b986bb174fc6f20d`

### Fase 4: Player Portal
1. `/portal` → `0e5825b11bc54b9f8fcf61748d3c367c`
2. `/portal/stats` → `2c91be8ed84843eda634a4a4008a0cbc`
3. `/portal/rounds` → `1e9b5c91b9e94a3eb885e46756e45a63`
4. `/portal/goals` → `7d0093c9da7f4634938a03a97a014494`
5. `/portal/academy` → `1514b65d6a314893a63703a51d3a5d33`

### Fase 5: Admin Portal
1. `/admin` → `3b89fbc64a05428d9e4c0f518d33afe5`
2. `/admin/bookings` → `4c171b3ba21d4325b5181aa6b9f0de5a`
3. `/admin/players` → `4c669c9bc99d4763a91de561e621c3e1`
4. `/admin/instructors` → `ead70e08a91c4ccfa34290e85fccdf6b`
5. `/admin/analytics` → `3c19a7be4566424b88192a2dae9a497a`

### Fase 6: Auth
1. `/login` → `3f3e1ec219ce411283a63cd13e25621d`
2. `/register` → `adbeddd62bc740d4aa22b1e3a7e68d38`
3. `/forgot-password` → `7e258d6521f74edf88084aacf31ef1d8`

---

## 9. VIKTIGE TILPASNINGER

### Fra WANG-branding til AK Golf-branding:

| WANG (opprinnelig) | AK Golf (nytt) |
|-------------------|----------------|
| Navy (#17446f) | Deep Emerald (#00594C) |
| Green (#2e857d) | Emerald Light (#E6F3F1) |
| Warm Cream (#fafaf5) | Warm Stone (#EBE7E0) |
| Rosa/Mint/Orange accents | Kun Deep Emerald + Purple (AI) |
| Montserrat + Quattrocento Sans | Inter (300-700) |

### Behold fra WANG-design:
- Bento grid layouts
- Asymmetriske komposisjoner
- Tonal layering (ikke borders)
- Glassmorphism effekter
- Generøs whitespace
- Editorial hierarki

### Endre fra WANG-design:
- Fjern sekundære accent-farger (rosa, mint, orange)
- Erstatt med Deep Emerald som eneste primær accent
- Forenkle til "Sort. Hvit. En grønn."
- Tilpass innhold til golf coaching (ikke akademi)

---

**Mapping fullført:** 9. april 2026  
**Neste steg:** Start med Fase 1 - Design System implementasjon
