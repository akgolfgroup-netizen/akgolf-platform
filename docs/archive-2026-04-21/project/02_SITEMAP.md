# Sitemap — AK Golf Platform

## Oversikt

71 side-ruter + 135 API-ruter. Tre hovedgrupper: Markedsside, Spillerportal, Mission Control.

---

## 1. Markedsside (Public)

| Rute | Formaal | Core/Sekundaer |
|------|---------|----------------|
| `/` | Forsiden — hero, metode, priser, CTA | Core |
| `/academy` | Academy — coaching for voksne | Core |
| `/junior-academy` | Junior Academy — barn/ungdom | Core |
| `/utvikling` | B2B klubbutvikling | Sekundaer |
| `/personvern` | GDPR personvernerklaring | Sekundaer |
| `/landing/about` | Om AK Golf Academy | Sekundaer |
| `/landing/pricing` | Priser og pakker | Core |
| `/landing/contact` | Kontaktskjema | Sekundaer |
| `/maintenance` | Vedlikeholdsside | Utility |

**Navigasjon:** WebsiteNav (Coaching, Junior, Utvikling, Logg inn, Book coaching)

---

## 2. Booking-flyt (Public, delvis protected)

| Rute | Formaal | Core/Sekundaer |
|------|---------|----------------|
| `/booking` | Redirect til select-service | Core |
| `/booking/select-service` | Velg tjenestetype | Core |
| `/booking/date-time` | Velg dato og tid | Core |
| `/booking/review-confirm` | Oppsummering og betaling | Core |
| `/booking/[id]/pay` | Stripe betalingsside | Core |
| `/booking/[id]/confirmation` | Bekreftelse | Core |
| `/booking/confirmed` | Booking bekreftet | Core |
| `/booking/new` | Alternativ booking-wizard | Sekundaer |
| `/booking/veileder` | Velg coach | Sekundaer |
| `/booking/kategori/[category]` | Kategori-filtrert | Sekundaer |

**Felles layout:** BookingNavSidebar + BookingProgress

---

## 3. Auth (Public)

| Rute | Formaal |
|------|---------|
| `/auth/login` | Innlogging (passord/magic link) |
| `/auth/register` | Registrering |
| `/auth/forgot-password` | Glemt passord |
| `/auth/set-password` | Sett nytt passord |
| `/auth/callback` | OAuth callback |
| `/portal/login` | Portal-spesifikk login |

---

## 4. Spillerportal (Protected — STUDENT+)

Layout: PremiumSidebar + MobileHeader

### Dashboard
| Rute | Formaal | Core/Sekundaer |
|------|---------|----------------|
| `/portal` | Dashboard — stats, neste booking, AI-insight | Core |
| `/portal/onboarding` | Onboarding for nye brukere | Core |
| `/portal/profil` | Profil, mal, preferanser | Core |

### Booking
| Rute | Formaal | Core/Sekundaer |
|------|---------|----------------|
| `/portal/bookinger` | Mine bookinger | Core |
| `/portal/bookinger/ny` | Ny booking | Core |
| `/portal/bookinger/[id]/endre` | Endre booking | Sekundaer |

### Trening
| Rute | Formaal | Core/Sekundaer |
|------|---------|----------------|
| `/portal/treningsplan` | Min treningsplan | Core |
| `/portal/treningsplan/[sessionId]` | Sesjon-detaljer | Sekundaer |
| `/portal/trening/ovelser` | Ovelsesbank | Core |
| `/portal/trening/tester` | Tester og malinger | Sekundaer |
| `/portal/dagbok` | Treningsdagbok | Core |

### Statistikk & Analyse
| Rute | Formaal | Core/Sekundaer |
|------|---------|----------------|
| `/portal/statistikk` | Golfstatistikk | Core |
| `/portal/statistikk/ny-runde` | Logg ny runde | Core |
| `/portal/analyse` | TrackMan-analyse | Sekundaer |
| `/portal/sammenligning` | Sammenlign med peers | Sekundaer |

### Runder
| Rute | Formaal | Core/Sekundaer |
|------|---------|----------------|
| `/portal/runde/ny` | Start ny runde | Core |
| `/portal/runde/[id]` | Runde-detaljer | Sekundaer |
| `/portal/runde/[id]/oppsummering` | Rundesammendrag | Sekundaer |

### Diverse
| Rute | Formaal | Core/Sekundaer |
|------|---------|----------------|
| `/portal/kalender` | Kalender | Sekundaer |
| `/portal/coaching-historikk` | Coaching-historikk | Sekundaer |
| `/portal/turneringsplan` | Turneringsplanlegging | Sekundaer |
| `/portal/ai-coach` | AI-coach | Sekundaer |
| `/portal/trackman` | TrackMan-data | Sekundaer |

**Sidebar-navigasjon:** Oversikt, Mine Bookinger, Treningsplan, Dagbok, Statistikk, Kalender, Profil, Historikk

---

## 5. Mission Control — Admin (Protected — ADMIN/INSTRUCTOR/INVITED)

Layout: MCLayout (sidebar + topbar)

### Hub
| Rute | Formaal | Tilgang |
|------|---------|---------|
| `/portal/admin` | Hub — dagens sessjoner, KPIer, alerts | Alle MC |
| `/portal/admin/focus` | Fokus-modus | Alle MC |
| `/portal/admin/mission-board` | Mission board | Alle MC |

### Kalender & Booking
| Rute | Formaal | Tilgang |
|------|---------|---------|
| `/portal/admin/kalender` | Kalender/schedule | Alle MC |
| `/portal/admin/bookinger` | Alle bookinger | Staff |
| `/portal/admin/bookinger/ny` | Manuell booking | Staff |
| `/portal/admin/godkjenninger` | Godkjenn aktiviteter | Staff |
| `/portal/admin/tilgjengelighet` | Tilgjengelighetstider | Staff |

### Elever & Coaching
| Rute | Formaal | Tilgang |
|------|---------|---------|
| `/portal/admin/spillere` | Elevliste | Staff |
| `/portal/admin/spillere/[id]` | Elev-detaljer | Staff |
| `/portal/admin/okter` | Coaching-notater | Staff |

### Kommunikasjon
| Rute | Formaal | Tilgang |
|------|---------|---------|
| `/portal/admin/meldinger` | Unified inbox | Staff |
| `/portal/admin/ai-assistent` | AI-assistent | Staff |
| `/portal/admin/e-postmaler` | E-postmaler | Admin |

### Analyse & Okonomi
| Rute | Formaal | Tilgang |
|------|---------|---------|
| `/portal/admin/analytics` | KPI-dashboard | Admin |
| `/portal/admin/rapporter` | Rapporter | Admin |
| `/portal/admin/okonomi` | Okonomi/revenue | Admin |

### Diverse
| Rute | Formaal | Tilgang |
|------|---------|---------|
| `/portal/admin/fasiliteter` | Fasiliteter | Alle MC |
| `/portal/admin/agenter` | AI-agenter | Admin |
| `/portal/admin/turneringer` | Turneringer | Staff |
| `/portal/admin/notifications` | Push-notifikasjoner | Staff |

**MC Sidebar-navigasjon:** Hub, Focus, Kalender, Bookinger, Godkjenninger, Elever, Okter, Meldinger, AI-assistent, Agenter, Rapporter, Okonomi

---

## 6. Sider med delt layout

Disse sidene er like nok til a bruke samme komponent-monstre:

| Gruppe | Sider | Delt layout |
|--------|-------|-------------|
| Booking-steg | select-service, date-time, review-confirm | BookingNavSidebar + steg-innhold |
| Portal lister | bookinger, dagbok, coaching-historikk | Liste med filter + kort |
| Portal detalj | treningsplan/[id], runde/[id], elever/[id] | Detalj-header + tabs/seksjoner |
| Admin lister | bookinger, elever, meldinger, turneringer | MCTable + filter + sok |
| Admin detalj | elever/[id], okter | Profil-header + historikk |
| Markedsside | academy, junior-academy, utvikling | Hero + innhold + CTA |
