# Komplett funksjonalitetskart - AK Golf Platform

**Basert på eksisterende kodebase (78 page.tsx filer)**

---

## 🎮 SPILLER PORTAL (24 skjermer)

### Core Navigation
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 1 | **Dashboard** | `/portal` | Hovedoversikt, KPI, AI-insikt |
| 2 | **Onboarding** | `/portal/onboarding` | Ny bruker, første gangs oppsett |
| 3 | **Profil** | `/portal/profil` | Innstillinger, preferanser, konto |

### Trening & Coaching
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 4 | **Treningsplan** | `/portal/treningsplan` | Personlig ukeplan |
| 5 | **Treningsøkt Detalj** | `/portal/treningsplan/[sessionId]` | Spesifikk økt |
| 6 | **Dagbok** | `/portal/dagbok` | Loggføring, refleksjon |
| 7 | **Dagbok Detalj** | `/portal/dagbok/[sessionId]` | Spesifikk logg |
| 8 | **Coaching Historikk** | `/portal/coaching-historikk` | Tidligere sessions |
| 9 | **AI Coach** | `/portal/ai-coach` | AI-drevet coaching |

### Analyse & Data
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 10 | **Statistikk** | `/portal/statistikk` | Hovedstatistikk |
| 11 | **Ny Runde** | `/portal/statistikk/ny-runde` | Registrere ny runde |
| 12 | **Analyse** | `/portal/analyse` | Swing analyse |
| 13 | **Trackman** | `/portal/trackman` | Trackman data |
| 14 | **Benchmark** | `/portal/benchmark` | Sammenligne mot andre |
| 15 | **Sammenligning** | `/portal/sammenligning` | Sammenligne egne data |
| 16 | **Tester** | `/portal/tester` | Ferdighetstester |
| 17 | **Trening Tester** | `/portal/trening/tester` | Testoversikt |
| 18 | **Trening Test Detalj** | `/portal/trening/tester/[id]` | Spesifikk test |
| 19 | **Øvelser** | `/portal/trening/ovelser` | Øvelsesbibliotek |

### Spill & Turneringer
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 20 | **Spill** | `/portal/spill` | Aktivt spill/spillmodus |
| 21 | **Runde Ny** | `/portal/runde/ny` | Starte ny runde |
| 22 | **Runde Aktiv** | `/portal/runde/[id]` | Pågående runde |
| 23 | **Runde Oppsummering** | `/portal/runde/[id]/oppsummering` | Runde resultat |
| 24 | **Turneringer** | `/portal/turneringer` | Kommende turneringer |
| 25 | **Turneringsplan** | `/portal/turneringsplan` | Planlegge turneringer |

### Booking & Kalender
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 26 | **Kalender** | `/portal/kalender` | Personlig kalender |
| 27 | **Bookinger** | `/portal/bookinger` | Mine bookinger |
| 28 | **Booking Ny** | `/portal/bookinger/ny` | Ny booking (intern) |
| 29 | **Booking Endre** | `/portal/bookinger/[id]/endre` | Endre booking |

### Sosialt & Annet
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 30 | **Sosialt** | `/portal/sosialt` | Venner, feed |
| 31 | **Bag** | `/portal/bag` | Golfbag, køller |
| 32 | **Apper** | `/portal/apper` | Integrasjoner, apps |
| 33 | **Demo** | `/portal/demo` | Demo/forklaring |

**Spiller Portal totalt: 33 skjermer**

---

## 🎯 MISSION CONTROL / ADMIN (18 skjermer)

### Dashboard & Oversikt
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 1 | **Admin Dashboard** | `/portal/admin` | Hovedoversikt, inntekter |
| 2 | **Denne Uken** | `/portal/admin/denne-uken` | Ukeoppsummering |
| 3 | **Focus** | `/portal/admin/focus` | Fokus-modus |

### Elever & Kunder
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 4 | **Elever** | `/portal/admin/elever` | Elevliste, oversikt |
| 5 | **Elev Detalj** | `/portal/admin/elever/[id]` | Spesifikk elev |

### Booking & Kalender
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 6 | **Kalender** | `/portal/admin/kalender` | Admin kalender |
| 7 | **Bookinger** | `/portal/admin/bookinger` | Alle bookinger |
| 8 | **Ny Booking** | `/portal/admin/bookinger/ny` | Opprette booking |
| 9 | **Tilgjengelighet** | `/portal/admin/tilgjengelighet` | Sette ledig tid |
| 10 | **Kapasitet** | `/portal/admin/kapasitet` | Kapasitetsoversikt |

### Kommunikasjon
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 11 | **Meldinger** | `/portal/admin/meldinger` | Innboks, chat |
| 12 | **E-postmaler** | `/portal/admin/e-postmaler` | Maler for epost |

### Økter & Tjenester
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 13 | **Økter** | `/portal/admin/okter` | Økt-oversikt |
| 14 | **Fasiliteter** | `/portal/admin/fasiliteter` | Anlegg, baner |
| 15 | **Fasiliteter Instillinger** | `/portal/admin/fasiliteter/innstillinger` | Konfigurasjon |
| 16 | **Ny Aktivitet** | `/portal/admin/fasiliteter/ny-aktivitet` | Legge til aktivitet |

### Rapportering & AI
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 17 | **Analytics** | `/portal/admin/analytics` | Data og grafer |
| 18 | **Rapporter** | `/portal/admin/rapporter` | Rapporter generering |
| 19 | **AI Assistent** | `/portal/admin/ai-assistent` | AI-verktøy |
| 20 | **Agenter** | `/portal/admin/agenter` | AI agenter |

### Administrasjon
| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 21 | **Økonomi** | `/portal/admin/okonomi` | Inntekter, priser |
| 22 | **Godkjenninger** | `/portal/admin/godkjenninger` | Pending approvals |
| 23 | **Turneringer** | `/portal/admin/turneringer` | Admin turneringer |

**Admin totalt: 23 skjermer**

---

## 📅 BOOKING SYSTEM (Eksternt - 9 skjermer)

| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 1 | **Booking Forside** | `/booking` | Hovedbooking side |
| 2 | **Veileder** | `/booking/veileder` | Hva skal jeg booke? |
| 3 | **Kategori** | `/booking/kategori` | Velge type |
| 4 | **Kategori Detalj** | `/booking/kategori/[category]` | Spesifikk kategori |
| 5 | **Booking Proposals** | `/booking/proposals` | Forslag A-D |
| 6 | **Proposal A** | `/booking/proposals/a` | Pakke A |
| 7 | **Proposal B** | `/booking/proposals/b` | Pakke B |
| 8 | **Proposal C** | `/booking/proposals/c` | Pakke C |
| 9 | **Proposal D** | `/booking/proposals/d` | Pakke D |
| 10 | **Ny Booking** | `/booking/new` | Ny booking flyt |
| 11 | **Booking Detalj** | `/booking/[id]` | Se booking |
| 12 | **Betaling** | `/booking/[id]/pay` | Betale |
| 13 | **Bekreftelse** | `/booking/[id]/confirmation` | Kvittering |

**Booking totalt: 13 skjermer**

---

## 🌐 WEBSITE / MARKETING (6 skjermer)

| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 1 | **Forside** | `/` | Hovedlanding |
| 2 | **Academy** | `/academy` | Academy info |
| 3 | **Academy Booking** | `/academy/booking` | Booking fra academy |
| 4 | **Junior Academy** | `/junior-academy` | Junior program |
| 5 | **Utvikling B2B** | `/utvikling` | Bedriftsutvikling |
| 6 | **Personvern** | `/personvern` | Privacy policy |
| 7 | **Portal Preview** | `/portal-preview` | Preview/demo |
| 8 | **Maintenance** | `/maintenance` | Vedlikehold |

**Website totalt: 8 skjermer**

---

## 🔐 AUTH (4 skjermer)

| # | Side | Route | Beskrivelse |
|---|------|-------|-------------|
| 1 | **Login** | `/auth/login` | Innlogging |
| 2 | **Callback** | `/auth/callback` | Auth callback |
| 3 | **Set Password** | `/auth/set-password` | Nytt passord |
| 4 | **Portal Login** | `/portal/login` | Portal innlogging |

---

## 📊 TOTAL OVERSIKT

| System | Antall skjermer | Prioritet |
|--------|-----------------|-----------|
| Spiller Portal | 33 | 🔥 Høy |
| Mission Control / Admin | 23 | 🔥 Høy |
| Booking System | 13 | 🔥 Høy |
| Website / Marketing | 8 | ⭐ Medium |
| Auth | 4 | ⭐ Medium |
| **TOTALT** | **81 skjermer** | |

---

## 🎯 ANBEFALT REKKEFØLGE (Din prioritering)

### FASE 1: Booking System (13 skjermer)
1. Booking Forside
2. Kategori-valg
3. Kategori-detalj
4. Booking proposals (A, B, C, D)
5. Ny booking flyt
6. Betaling
7. Bekreftelse

### FASE 2: Spiller Portal - Core (10 skjermer)
1. Dashboard
2. Profil
3. Treningsplan (+ detalj)
4. Dagbok (+ detalj)
5. Kalender
6. Bookinger
7. Statistikk

### FASE 3: Spiller Portal - Spill & Analyse (12 skjermer)
1. Spill
2. Runde (ny, aktiv, oppsummering)
3. Analyse
4. Trackman
5. Benchmark
6. Sammenligning
7. Tester + øvelser
8. Turneringer + plan

### FASE 4: Mission Control - Core (12 skjermer)
1. Admin Dashboard
2. Denne uken
3. Elever (+ detalj)
4. Kalender
5. Bookinger (+ ny)
6. Tilgjengelighet
7. Meldinger

### FASE 5: Mission Control - Avansert (11 skjermer)
1. Økter
2. Fasiliteter (+ innstillinger, ny aktivitet)
3. Analytics
4. Rapporter
5. AI Assistent + Agenter
6. Økonomi
7. Godkjenninger

### FASE 6: Spiller Portal - Sosialt & Annet (11 skjermer)
1. AI Coach
2. Coaching Historikk
3. Sosialt
4. Bag
5. Apper
6. Onboarding
7. Demo

### FASE 7: Website (8 skjermer)
1. Forside
2. Academy (+ booking)
3. Junior Academy
4. Utvikling B2B
5. Personvern

**Total: 81 skjermer**

---

## 🎨 Design Tokens (Placeholder)

Samme som før - grayscale placeholders inntil brand research er ferdig.

---

**Sist oppdatert:** April 6, 2026  
**Neste:** Fase 1 - Booking System (13 skjermer)
