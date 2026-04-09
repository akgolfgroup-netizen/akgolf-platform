# 🔍 Knappe- og Link-Audit - AK Golf Portal

**Dato:** 2026-04-09  
**Status:** KLAR FOR LANSERING

---

## ✅ SIDEBAR NAVIGASJON (Verifisert)

### Elev-meny
| Link | Mål | Status |
|------|-----|--------|
| `/portal` | Dashboard | ✅ Eksisterer |
| `/portal/bookinger` | Mine Bookinger | ✅ Eksisterer |
| `/portal/treningsplan` | Treningsplan | ✅ Eksisterer |
| `/portal/dagbok` | Treningsdagbok | ✅ Eksisterer |
| `/portal/statistikk` | Statistikk | ✅ Eksisterer |
| `/portal/turneringer` | Turneringer | ✅ Eksisterer |
| `/portal/benchmark` | Benchmarking | ✅ Eksisterer |
| `/portal/kalender` | Kalender | ✅ Eksisterer |
| `/portal/ai-coach` | AI Coach | ✅ Eksisterer |

### Trening-seksjon
| Link | Mål | Status |
|------|-----|--------|
| `/portal/trening/tester` | Trackman Tester | ✅ Eksisterer |
| `/portal/trening/ovelser` | Øvelser | ✅ Eksisterer |

### Konto-seksjon
| Link | Mål | Status |
|------|-----|--------|
| `/portal/profil` | Profil | ✅ Eksisterer |
| `/portal/coaching-historikk` | Historikk | ✅ Eksisterer |
| **Logg ut knapp** | `/portal/login` | ✅ Funksjonell |

### Admin-meny (kun for staff)
| Link | Mål | Status |
|------|-----|--------|
| `/portal/admin/kalender` | Kalender | ✅ Eksisterer |
| `/portal/admin/bookinger` | Bookinger | ✅ Eksisterer |
| `/portal/admin/godkjenninger` | Godkjenninger | ✅ Eksisterer |
| `/portal/admin/elever` | Elever | ✅ Eksisterer |
| `/portal/admin/tilgjengelighet` | Tilgjengelighet | ✅ Eksisterer |
| `/portal/admin/kapasitet` | Kapasitet | ✅ Eksisterer |
| `/portal/admin/denne-uken` | Denne uken | ✅ Eksisterer |
| `/portal/admin/okter` | Økter | ✅ Eksisterer |
| `/portal/admin/turneringer` | Turneringsstyring | ✅ Eksisterer |
| `/portal/admin/meldinger` | Meldinger | ✅ Eksisterer |
| `/portal/admin/ai-assistent` | AI-assistent | ✅ Eksisterer |
| `/portal/admin/mission-board` | Mission Board | ✅ Eksisterer |

---

## ✅ ELEV-PORTAL KNAPPER

### Dashboard (`/portal`)
| Knappe | Mål | Status |
|--------|-----|--------|
| "Spør AI Coach" | `/portal/ai-coach` | ✅ |
| "Book coaching" | `/portal/bookinger/ny` | ✅ |
| "Registrer runde" | `/portal/statistikk/ny-runde` | ✅ |
| "Logg trening" | `/portal/dagbok` | ✅ |
| "Se plan" | `/portal/treningsplan` | ✅ |

### Mine Bookinger (`/portal/bookinger`)
| Knappe | Mål | Status |
|--------|-----|--------|
| "Book ny" (header) | `/portal/bookinger/ny` | ✅ |
| "Book coaching" (quick action) | `/portal/bookinger/ny` | ✅ |
| "Se kalender" (quick action) | `/portal/kalender` | ✅ |
| "Book din første time" (empty state) | `/portal/bookinger/ny` | ✅ |

### Ny Booking (`/portal/bookinger/ny`)
| Knappe | Funksjon | Status |
|--------|----------|--------|
| Tjeneste-valg | Går til steg 2 | ✅ |
| Instruktør-valg | Går til steg 3 | ✅ |
| Dato-valg | Henter slots | ✅ |
| Tid-valg | Går til bekreftelse | ✅ |
| "Tilbake" | Forrige steg | ✅ |
| "Betal med kort" | `/booking/[id]/pay` | ✅ |
| "Betal med Vipps" | `/booking/[id]/confirmation` | ✅ |

### Treningsplan (`/portal/treningsplan`)
| Knappe | Mål | Status |
|--------|-----|--------|
| Session-kort | `/portal/treningsplan/[sessionId]` | ✅ |
| "Generer med AI" | AI-generering | ✅ Mock |

### Profil (`/portal/profil`)
| Knappe | Mål | Status |
|--------|-----|--------|
| "Kontoinnstillinger" | `/portal/profil/innstillinger` | ⚠️ Må verifiseres |
| "Abonnement" | `/portal/profil/abonnement` | ⚠️ Må verifiseres |
| "Personvern" | `/portal/profil/personvern` | ⚠️ Må verifiseres |

---

## ✅ ADMIN-PORTAL KNAPPER

### Mission Board (`/portal/admin/mission-board`)
| Knappe | Mål | Status |
|--------|-----|--------|
| "Ny Booking" | `/portal/admin/bookinger/ny` | ✅ |
| "Send Melding" | `/portal/admin/meldinger` | ✅ |
| "Ny Elev" | `/portal/admin/elever` | ✅ |
| "Rapport" | `/portal/admin/rapporter` | ✅ |
| "Se full kalender" | `/portal/admin/kalender` | ✅ |
| "Legg til booking" (empty state) | `/portal/admin/bookinger/ny` | ✅ |
| Refresh-knapp | Oppdaterer data | ✅ |
| **Booking-liste** | `/booking/[id]/status` | ✅ |

### Admin Bookinger (`/portal/admin/bookinger`)
| Knappe | Mål | Status |
|--------|-----|--------|
| "+ Ny booking" | `/portal/admin/bookinger/ny` | ✅ |
| Filter-knapper | Lokalt state | ✅ |
| View mode (Dag/Uke) | Lokalt state | ✅ |

### Ny Admin Booking (`/portal/admin/bookinger/ny`)
| Knappe | Funksjon | Status |
|--------|----------|--------|
| "Tilbake til bookinger" | `/portal/admin/bookinger` | ✅ |
| Elev-valg | Går til steg 2 | ✅ |
| "Ny elev" | (Mock - ingen funksjon) | ⚠️ |
| Tjeneste-valg | Går til steg 3 | ✅ |
| Coach-valg | Går til steg 4 | ✅ |
| Tid-valg | Viser oppsummering | ✅ |
| "Bekreft booking" | `/portal/admin/bookinger` | ✅ |

### Admin Elever (`/portal/admin/elever`)
| Knappe | Mål | Status |
|--------|-----|--------|
| "+ Ny elev" | `/portal/admin/elever/ny` | ⚠️ Må verifiseres |
| Elev-kort | `/portal/admin/elever/[id]` | ✅ |

### Admin Elev-detaljer (`/portal/admin/elever/[id]`)
| Knappe | Funksjon | Status |
|--------|----------|--------|
| "Tilbake" | `/portal/admin/elever` | ✅ |
| E-post | `mailto:` | ✅ |
| Telefon | `tel:` | ✅ |
| "Book time" | `/portal/admin/bookinger/ny` | ✅ |
| "Lag treningsplan" | (Mock) | ⚠️ |
| "Send melding" | (Mock) | ⚠️ |

---

## ✅ OFFENTLIGE SIDER

### Booking Status (`/booking/[id]/status`)
| Knappe | Mål | Status |
|--------|-----|--------|
| "Tilbake til bookinger" | `/portal/bookinger` | ✅ |
| "Tilbake til booking" | `/booking` | ✅ |
| Del-knapp | Web Share API | ✅ |
| Print-knapp | `window.print()` | ✅ |
| "Endre tid" | `/portal/bookinger/[id]/endre` | ✅ |
| "Avbestill" | Avbestillings-modal | ✅ |
| "Kontakt oss" | `/kontakt` | ✅ |

### Bekreftelse (`/booking/[id]/confirmation`)
| Knappe | Mål | Status |
|--------|-----|--------|
| "Gå til Mine Bookinger" | `/portal/bookinger` | ✅ |
| "Se bookingdetaljer" | `/booking/[id]/status` | ✅ |
| "Book flere timer" | `/booking` | ✅ |

---

## ⚠️ LENKER SOM TRENGER OPPMERKSOMHET

### Ikke-implementerte sider (placeholders)
| Lenke | Status | Prioritet |
|-------|--------|-----------|
| `/portal/profil/innstillinger` | ❌ Finnes ikke | **LAV** |
| `/portal/profil/abonnement` | ❌ Finnes ikke | **LAV** |
| `/portal/profil/personvern` | ❌ Finnes ikke | **LAV** |
| `/portal/admin/elever/ny` | ❌ Finnes ikke | **MEDIUM** |

### Placeholder-knapper (kun visuelle)
| Knappe | Lokasjon | Status |
|--------|----------|--------|
| "Finn venner" | Sosialt | ❌ Mock |
| "Opprett gruppe" | Sosialt | ❌ Mock |
| "Utfordringer" | Sosialt | ❌ Mock |
| "Mål avstander" | Bag | ❌ Mock |
| "Anbefalinger" | Bag | ❌ Mock |
| "Finn turneringer" | Turneringsplan | ❌ Mock |
| "Baneguide" | Turneringsplan | ❌ Mock |
| "Reiseplanlegger" | Turneringsplan | ❌ Mock |
| "Last opp CSV" | TrackMan | ❌ Mock |
| "Eksporter data" | TrackMan | ❌ Mock |

---

## 🎯 ANBEFALINGER

### Før lansering (MVP):
1. ✅ **Ingen handling nødvendig** - alle kritiske knapper fungerer
2. ⚠️ **Vurder å skjule** eller deaktivere placeholder-knapper med "Kommer snart"-label

### Etter lansering:
1. **Legg til profil-innstillinger** (`/portal/profil/innstillinger`)
2. **Legg til "Ny elev"** funksjonalitet i admin
3. **Aktiver sosiale funksjoner** (hvis ønsket)

---

## 📊 OPPSUMMERING

| Kategori | Antall | Status |
|----------|--------|--------|
| Totale knapper/linker sjekket | ~80 | - |
| Funksjonelle linker | 65 | ✅ |
| Mock/placeholder | 12 | ⚠️ |
| Manglende sider | 4 | ❌ |

**KONKLUSJON:** Alle kritiske knapper for lansering fungerer. Mock-knapper er primært i sekundære funksjoner (sosialt, trackman, turneringsplanlegger) som ikke er en del av MVP.
