# 📋 Wireframing Master Plan

> **Komplett plan for alle skjermer i AK Golf Platform**  
> **Status:** Pågående  
> **Sist oppdatert:** 2026-04-06

---

## 🎯 Overordnet Strategi

### Hva skal fremvises?
1. **Verdiproposisjon** — Hvorfor AK Golf?
2. **Tillit** — Profesjonalitet, resultater, sosial bevis
3. **Enkelhet** — Booking, oppfølging, progresjon
4. **Personalisering** — AI, mål, individuell progresjon

### Design-prinsipper per flate
| Flate | Tone | Fokus |
|-------|------|-------|
| **Website** | Inspirerende, overbevisende | Konvertering til booking |
| **Portal** | Motiverende, personlig | Progresjon, engasjement |
| **Admin** | Effektiv, oversiktlig | Produktivitet, kontroll |

---

## 🗺️ Brukerreiser å dekke

### Reise 1: Ny besøkende → Booket time
```
Forside → Academy → Booking-kategori → Velg dato/tid → Bekreftelse
```

### Reise 2: Spiller daglig bruk
```
Dashboard → (Treningsplan/Dagbok/Kalender) → Profil
```

### Reise 3: Coach daglig arbeid
```
Admin Hub → Kalender → Elev → Booking-detajer → Notater
```

### Reise 4: Spiller progresjon
```
Dashboard → Statistikk → Dagbok → Treningsplan
```

---

## 📱 Faser og Prioritering

### FASE 1: Kjerne-opplevelse (Høyest prioritet)
**Mål:** Dekke de viktigste brukerreisene

#### Website (6 sider)
| # | Side | Route | Status | Prioritet |
|---|------|-------|--------|-----------|
| 1.1 | **Forside** | `/` | ⬜ | P0 - Førsteinntrykk |
| 1.2 | **Academy** | `/academy` | ⬜ | P0 - Hovedprodukt |
| 1.3 | **Booking Kategori** | `/booking/kategori` | ⬜ | P0 - Konvertering |
| 1.4 | **Booking Tidspunkt** | `/booking/tid` | ⬜ | P1 - Konvertering |
| 1.5 | **Booking Bekreftelse** | `/booking/bekreftet` | ⬜ | P1 - Konvertering |
| 1.6 | **Personvern** | `/personvern` | ⬜ | P2 - Legal |

#### Portal - Spiller (7 sider)
| # | Side | Route | Status | Prioritet |
|---|------|-------|--------|-----------|
| 1.7 | **Dashboard** | `/portal` | 🔄 | P0 - Hovednavigasjon |
| 1.8 | **Treningsplan** | `/portal/treningsplan` | ⬜ | P0 - Core feature |
| 1.9 | **Dagbok** | `/portal/dagbok` | ⬜ | P0 - Core feature |
| 1.10 | **Statistikk** | `/portal/statistikk` | ⬜ | P1 - Progresjon |
| 1.11 | **Kalender** | `/portal/kalender` | ⬜ | P1 - Timeplan |
| 1.12 | **Profil** | `/portal/profil` | ⬜ | P2 - Innstillinger |
| 1.13 | **Apper/Marketplace** | `/portal/apper` | ⬜ | P2 - Ekstra |

#### Admin - Coach (6 sider)
| # | Side | Route | Status | Prioritet |
|---|------|-------|--------|-----------|
| 1.14 | **Admin Dashboard** | `/portal/admin` | ⬜ | P0 - Oversikt |
| 1.15 | **Admin Kalender** | `/portal/admin/kalender` | ⬜ | P0 - Daglig arbeid |
| 1.16 | **Admin Bookinger** | `/portal/admin/bookinger` | ⬜ | P0 - Håndtering |
| 1.17 | **Admin Elever** | `/portal/admin/elever` | ⬜ | P1 - Elevbase |
| 1.18 | **Admin Analytics** | `/portal/admin/analytics` | ⬜ | P2 - Innsikt |
| 1.19 | **Admin Meldinger** | `/portal/admin/meldinger` | ⬜ | P2 | Kommunikasjon |

**Fase 1 totalt:** 19 sider

---

### FASE 2: Forbedret opplevelse (Medium prioritet)
**Mål:** Øke engasjement og konvertering

#### Website utvidelse
| # | Side | Route | Status | Prioritet |
|---|------|-------|--------|-----------|
| 2.1 | **Junior Academy** | `/junior-academy` | ⬜ | P1 |
| 2.2 | **Utvikling (B2B)** | `/utvikling` | ⬜ | P2 |
| 2.3 | **Om oss** | `/om` | ⬜ | P2 |
| 2.4 | **FAQ** | `/faq` | ⬜ | P2 |
| 2.5 | **Kontakt** | `/kontakt` | ⬜ | P2 |

#### Portal utvidelse
| # | Side | Route | Status | Prioritet |
|---|------|-------|--------|-----------|
| 2.6 | **Analyze Swing** | `/portal/analyse` | ⬜ | P1 |
| 2.7 | **Coaching History** | `/portal/historie` | ⬜ | P2 |
| 2.8 | **Målsetting** | `/portal/maal` | ⬜ | P2 |
| 2.9 | **Sammenligning** | `/portal/sammenlign` | ⬜ | P3 |

**Fase 2 totalt:** 9 sider

---

### FASE 3: Avanserte funksjoner (Lavere prioritet)
**Mål:** Power-user features, automatisering

| # | Side | Route | Status | Prioritet |
|---|------|-------|--------|-----------|
| 3.1 | **Admin Innstillinger** | `/portal/admin/innstillinger` | ⬜ | P2 |
| 3.2 | **Admin Tilgjengelighet** | `/portal/admin/tilgjengelighet` | ⬜ | P2 |
| 3.3 | **Admin Priser** | `/portal/admin/priser` | ⬜ | P3 |
| 3.4 | **Admin Team** | `/portal/admin/team` | ⬜ | P3 |
| 3.5 | **Video-bibliotek** | `/portal/videoer` | ⬜ | P3 |
| 3.6 | **Samfunnet/Forum** | `/portal/samfunnet` | ⬜ | P3 |

**Fase 3 totalt:** 6 sider

---

## 🎨 Hva skal fremheves per side-type

### Website-sider
| Side | Hovedbudskap | Nøkkel-elementer |
|------|--------------|------------------|
| **Forside** | Transformasjon, profesjonalitet | Hero med resultater, metode, testimonials, CTA |
| **Academy** | Programdetaljer, pakker | Prising, nivåer, hva er inkludert, "no lock-in" |
| **Booking** | Enkelhet, fleksibilitet | Kategori-valg, kalender, tidspunkter, bekreftelse |

### Portal-sider
| Side | Hovedbudskap | Nøkkel-elementer |
|------|--------------|------------------|
| **Dashboard** | Din progresjon, hva nå? | KPI-cards, AI-insikt, kommende, streak, quick actions |
| **Treningsplan** | Personlig plan, struktur | Uke-visning, økt-kort, AI-badge, fullføring |
| **Dagbok** | Loggføring, refleksjon | Tidslinje, quick-log, notater, bilder |
| **Statistikk** | Data-drevet innsikt | Strokes gained, trends, sammenligning, mål |
| **Kalender** | Oversikt, planlegging | Uke/måned-visning, bookinger, fargerikoding |

### Admin-sider
| Side | Hovedbudskap | Nøkkel-elementer |
|------|--------------|------------------|
| **Dashboard** | Dagens status, prioriteringer | Inntekter, kommende, varsler, quick actions |
| **Kalender** | Timeplan, tilgjengelighet | Dag/uke-visning, drag-drop, blokking |
| **Bookinger** | Administrere, følge opp | Liste, filtre, status, detaljer |
| **Elever** | Oversikt, progresjon | Tabell, søk, filter, progresjon-indikatorer |

---

## 📐 Komponent-bibliotek å wireframe

### Layout-komponenter
- [ ] **Portal Layout** — Sidebar + header + main
- [ ] **Admin Layout** — Komprimert for effektivitet
- [ ] **Website Layout** — Marketing-focused

### Delte komponenter (cross-cutting)
- [ ] **Button** — Primary, secondary, ghost, danger
- [ ] **Card** — Standard, stat, AI, streak
- [ ] **Input** — Text, select, date, textarea
- [ ] **Modal** — Standard, confirmation, form
- [ ] **Toast** — Success, error, warning, info
- [ ] **Avatar** — Med status-indikator
- [ ] **Badge** — Status, kategori, nivå

### Spesifikke komponenter

#### Dashboard
- [ ] **KPI Card** — Tall + trend + sparkline
- [ ] **AI Insight Card** — Anbefaling, analyse
- [ ] **Streak Card** — Flame + dager + progress
- [ ] **Upcoming Card** — Neste aktivitet
- [ ] **Quick Actions** — Hurtig-knapper
- [ ] **Progress Ring** — Sirkulær progresjon
- [ ] **Week Mini-view** — 7-dagers oversikt

#### Treningsplan
- [ ] **Week View** — Uke-grid med dager
- [ ] **Day Card** — Økt-info, status
- [ ] **Exercise Card** — Innenfor økt
- [ ] **AI Badge** — AI-generert indikator

#### Statistikk
- [ ] **Strokes Gained Chart** — Kategori-sammenligning
- [ ] **Trend Line** — Handicap/score over tid
- [ ] **Donut Chart** — Distribusjon
- [ ] **Bar Chart** — Sammenligning
- [ ] **Score Card** — Runde-oppsummering

#### Kalender
- [ ] **Week View** — Time-grid
- [ ] **Day View** — Detaljert timeplan
- [ ] **Month View** — Oversikt
- [ ] **Event Chip** — Booking/økt i kalender
- [ ] **Availability Block** — Ledig/optatt

#### Admin
- [ ] **Revenue Card** — Inntekter, sammenligning
- [ ] **Student Table** — Elev-liste med progresjon
- [ ] **Booking List** — Sorterbar, filtrerbar
- [ ] **Booking Detail** — Full info + notater
- [ ] **Communication Log** — Meldings-historikk

---

## 🔄 Iterasjons-plan

### Runde 1: Low-fidelity (Grunnstruktur)
**Fokus:** Informasjonsarkitektur, layout
- [ ] Wireframes uten farger (gråtoner)
- [ ] Plassering av elementer
- [ ] Flyt mellom sider

### Runde 2: High-fidelity (Visuelt)
**Fokus:** Design system, detaljer
- [ ] Farger, typografi, skygger
- [ ] Interaksjoner, hover-states
- [ ] Responsive varianter

### Runde 3: Interaktiv (Prototype)
**Fokus:** Opplevelse, validering
- [ ] Klikkbare prototyper
- [ ] Brukertesting
- [ ] Justeringer

---

## 📊 Fremdrifts-oversikt

### Sammendrag
| Fase | Totalt | Påbegynt | Ferdig | % |
|------|--------|----------|--------|---|
| Fase 1 | 19 | 1 | 0 | 5% |
| Fase 2 | 9 | 0 | 0 | 0% |
| Fase 3 | 6 | 0 | 0 | 0% |
| **Totalt** | **34** | **1** | **0** | **3%** |

### Status per side
- ⬜ Ikke påbegynt
- 🔄 I workbench
- 👀 I review
- ✅ Godkjent
- 💻 Implementert

---

## 📝 Notater og beslutninger

### Viktige avklaringer som trengs
1. **Skal vi ha dark mode?** → Nei, kun light mode
2. **Skal vi ha mobil-app?** → Ja, PWA først, native senere
3. **Språk?** → Norsk bokmål først, engelsk senere
4. **Tilgjengelighet?** → WCAG 2.1 AA minimum

### Design-beslutninger
- Se `DECISIONS.md` for detaljer

---

## 🚀 Neste steg

1. **Fullføre Academy Dashboard** (pågående i workbench)
2. **Godkjenne Academy Dashboard** (flytte til approved)
3. **Starte wireframing av:**
   - Forside (website)
   - Admin Dashboard
   - Treningsplan

---

**Ansvarlig:** Design-team / AK Golf  
**Godkjenner:** Produkteier  
**Sist oppdatert:** 2026-04-06
