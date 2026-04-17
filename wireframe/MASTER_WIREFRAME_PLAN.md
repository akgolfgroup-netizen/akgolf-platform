# Master Wireframe Plan — AK Golf Platform

> **Versjon:** 1.0.0
> **Dato:** 2026-04-17
> **Kontekst:** Omfattende wireframe-plan for alle skjermer, inkl. flere views-per-skjerm for admin board.
> **Status:** Batch 1 pågår (pausert 19:00 av API-usage-grense, reset 20:00 Oslo).

---

## 1. Oversikt

Totalt antall potensielle skjermer i MASTER_FEATURE_SPEC: **49**
Totalt antall planlagte wireframes (strategiske): **22 skjermer + 14 admin views = 36 wireframes**

**Fordeling:**
- **Markedsside:** 6 skjermer (5 ruter + pricing)
- **Portal:** 8 strategiske skjermer (fra 27 totalt — droppe 19 som er stabile i prod)
- **Mission Control:** 8 skjermer + 14 ekstra views (flere views per admin-skjerm)

---

## 2. Admin-board — views-per-skjerm-prinsipp (viktig nyansering)

Mission Control får ekstra dimensjon: **flere views per skjerm**. Dette er fordi admin-arbeidsstasjon trenger fleksibilitet — én "dashboard" er ikke nok. Du trenger f.eks. for kalender: uke, måned, dag, liste.

### Views-matrise

| Skjerm | Views | Antall |
|--------|-------|--------|
| MC Dashboard | Oversikt-mode + Fokus-mode + KPI-drilldown | 3 |
| MC Kalender | Uke / Måned / Dag / Liste (agenda) | 4 |
| MC Bookinger | Liste + Kalender + Kanban (pending/confirmed/done) | 3 |
| MC Elever | Grid-kort + Tabell + Segmenter-dashboard | 3 |
| MC Inntekt/Rapporter | Dashboard + Periode-sammenligning | 2 |
| MC Fasiliteter | Dag-schedule + Ukeoversikt | 2 |
| MC Tilgjengelighet | Ukes-grid + Unntaks-liste | 2 |

**Totalt views for admin:** 3 + 4 + 3 + 3 + 2 + 2 + 2 = **19 views fordelt på 8 admin-skjermer**

Dette betyr ikke 19 separate wireframes — hver "view" er én UX-opsjon innenfor den skjermens 5-opsjoner-struktur. Eller vi lager separate wireframes per view hvis skjermen er kompleks nok.

**Beslutning:** For enkelhet, bruk 5-opsjoner-struktur per skjerm, men la "Safe"-opsjonen alltid være **primær-view** og de 4 andre utforske **alternative views + UX-vinkler**.

Eksempel: MC Kalender
- Opt 1 (Safe): Gantt timeline — ukesvisning (primær view)
- Opt 2: Måneds-grid
- Opt 3: Dag-fokus med swim-lanes
- Opt 4: Agenda-liste (tekstbasert)
- Opt 5: Drag-drop kanban

Hvert alternativ presenterer én view-variant — brukeren får all 5 views på ett sted, og kan velge hvilken som skal være default i implementasjonen.

---

## 3. Komplett wireframe-liste

### 3A. Markedsside (6 skjermer)

| ID | Skjerm | Rute | Prioritet | Status | Batch |
|----|--------|------|-----------|--------|-------|
| M1 | Forside | `/` | P0 | ✅ **Komplett** (Mercury Flow valgt) | 1 |
| M2 | Pricing | `/priser` (eller seksjon) | P0 | ⚠ Fase 1 + 2/5 farger | 1 |
| M3 | Academy | `/academy` | P0 | ⚠ Fase 1 + 0/5 farger | 1 |
| M4 | Junior Academy | `/junior-academy` | P0 | ⚠ Fase 1 + 2/5 farger | 1 |
| M5 | Utvikling | `/utvikling` | P0 | ⚠ Fase 1 + 0/5 farger | 1 |
| M6 | Booking (offentlig) | `/booking` | P1 | Ikke startet | 2 |

**Fullfør batch 1** etter API-reset (20:00): completer fargevariantene for M2–M5.

### 3B. Portal (8 strategiske skjermer)

| ID | Skjerm | Rute | Prioritet | Status | Batch |
|----|--------|------|-----------|--------|-------|
| P1 | Dashboard | `/portal` | P1 | ⚠ Fase 1 + 1/5 farger | 1 |
| P2 | Treningsplanlegger 2.0 | `/portal/treningsplan/ny` | P0 | ✅ **Komplett** | 1 |
| P3 | Kalender | `/portal/kalender` | P0 | ⚠ Fase 1 + 2/5 farger | 1 |
| P4 | Runde-tracking (live) | `/portal/runde/[id]` | P2 | Ikke startet | 3 |
| P5 | Runde-oppsummering | `/portal/runde/[id]/oppsummering` | P2 | Ikke startet | 3 |
| P6 | Statistikk | `/portal/statistikk` | P2 | Ikke startet | 3 |
| P7 | Mental game | `/portal/mental` | P2 | Ikke startet | 3 |
| P8 | Onboarding | `/portal/onboarding` | P1 | Ikke startet | 2 |

**Droppet fra listen (stabile i prod):** Dagbok, Øvelsesbank, TrackMan-tester, Bookinger, AI-coach, TrackMan, Benchmark, Sammenligning, Coaching-historikk, Turneringer, Turneringsplan, Spill, Bag, Strategi, Analyse, Tester DECADE, Profil, Meldinger, Sosialt, Apper, Abonnement.

### 3C. Mission Control (8 skjermer med views)

| ID | Skjerm | Rute | Views | Prioritet | Status | Batch |
|----|--------|------|-------|-----------|--------|-------|
| A1 | Dashboard | `/portal/admin` | Oversikt / Fokus / KPI-drilldown | P0 | ⚠ Fase 1 delvis (html 540, ingen styles) | 1 |
| A2 | Kalender | `/portal/admin/kalender` | Uke / Måned / Dag / Liste | P0 | ⚠ Fase 1 + 0/5 farger | 1 |
| A3 | Bookinger | `/portal/admin/bookinger` | Liste / Kalender / Kanban | P1 | Ikke startet | 2 |
| A4 | Elever | `/portal/admin/elever` | Grid / Tabell / Segmenter | P1 | Ikke startet | 2 |
| A5 | Elev-detalj | `/portal/admin/elever/[id]` | Profile tabs | P1 | Ikke startet | 2 |
| A6 | Rapporter | `/portal/admin/rapporter` | Dashboard / Periode-sammenlign | P2 | Ikke startet | 3 |
| A7 | Fasiliteter | `/portal/admin/fasiliteter` | Dag / Uke | P2 | Ikke startet | 3 |
| A8 | Tilgjengelighet | `/portal/admin/tilgjengelighet` | Ukes-grid / Unntak | P2 | Ikke startet | 3 |

---

## 4. Batch-strategi

**Totalt 3 batches = 22 wireframes:**

### Batch 1 (P0 — strategisk, pågår)
**9 wireframes:** Alle markedsside (M1–M5) + portal (P1–P3) + admin (A1–A2) = 10 – M1 (allerede komplett) = **9 nye**
**Status:** 2 komplett, 7 trenger fullføring etter API-reset.

### Batch 2 (P1 — neste runde)
**6 wireframes:** M6 (booking), P8 (onboarding), A3–A5 (bookinger, elever, elev-detalj) = 5 wireframes + 1 (booking) = **6**

### Batch 3 (P2 — nyttige men ikke kritiske)
**7 wireframes:** P4–P7 (runde-tracking, oppsummering, statistikk, mental) + A6–A8 (rapporter, fasiliteter, tilgjengelighet) = **7**

---

## 5. Admin-skjerm views-spesifikasjon (detaljert)

### A1 — Mission Control Dashboard (3 views i 5 opsjoner)

**Filosofi:** Admin trenger både helikopter-view og dypdykk. Vi gir begge.

| Opt | Navn | View-type |
|-----|------|-----------|
| 1 | XPO Style (SAFE) | Oversikt-mode (alt) |
| 2 | Linear Admin | Fokus-mode (dagens oppgaver) |
| 3 | Classic KPI | KPI-drilldown (tall-tung) |
| 4 | Command Bar | Action-mode (CMD+K) |
| 5 | Focus Today | Tidsfokus (kun i dag) |

### A2 — Mission Control Kalender (4 views i 5 opsjoner)

| Opt | Navn | View-type |
|-----|------|-----------|
| 1 | Gantt Timeline (SAFE) | Ukesvisning |
| 2 | Instructor Grid | Resource-view |
| 3 | Capacity Heatmap | Kapasitet-fokus |
| 4 | Drag & Drop | Kanban-stil |
| 5 | Day Lanes | Dag-fokus |

### A3 — Mission Control Bookinger (3 views)

| Opt | Navn | View-type |
|-----|------|-----------|
| 1 | Smart List (SAFE) | Liste med filters |
| 2 | Calendar Embed | Kalender i liste |
| 3 | Kanban Board | Pending/Confirmed/Completed |
| 4 | Table Power | Tabell med sorterbare kolonner |
| 5 | Timeline Flow | Kronologisk timeline |

### A4 — Mission Control Elever (3 views)

| Opt | Navn | View-type |
|-----|------|-----------|
| 1 | Grid Cards (SAFE) | Elev-kort grid |
| 2 | Data Table | Tabell for bulk-håndtering |
| 3 | Segment Dashboard | Grupper etter HCP/aktivitet |
| 4 | Map View | Geografisk (klubbtilhørighet) |
| 5 | Pipeline | Tracker status (aktiv/inaktiv/ventende) |

### A5 — Mission Control Elev-detalj (profil-views)

| Opt | Navn | View-type |
|-----|------|-----------|
| 1 | Tabs (SAFE) | Oversikt / Trening / Bookinger / Meldinger |
| 2 | Single Scroll | Alt på én lang side |
| 3 | Split Pane | Info venstre, content høyre |
| 4 | Timeline History | Kronologisk feed |
| 5 | Command Palette | Action-first |

### A6 — Mission Control Rapporter (2 views)

| Opt | Navn | View-type |
|-----|------|-----------|
| 1 | Dashboard (SAFE) | KPI + chart-grid |
| 2 | Periode-sammenlign | Denne vs forrige |
| 3 | Export-first | CSV / PDF-fokus |
| 4 | Drill-down | Hierarkisk |
| 5 | Scheduled Reports | Automasjon-fokus |

### A7 — Mission Control Fasiliteter (2 views)

| Opt | Navn | View-type |
|-----|------|-----------|
| 1 | Dag-schedule (SAFE) | Timetable per fasilitet |
| 2 | Uke-oversikt | Alle fasiliteter uke |
| 3 | Kapasitet-heatmap | Utnyttelse |
| 4 | Equipment-status | Utstyr per fasilitet |
| 5 | Booking-pipeline | Kommende bookinger per fasilitet |

### A8 — Mission Control Tilgjengelighet (2 views)

| Opt | Navn | View-type |
|-----|------|-----------|
| 1 | Ukes-grid (SAFE) | Maler per uke |
| 2 | Unntak-liste | Blokkeringer |
| 3 | Instruktør-sammenlign | Alle coaches side-by-side |
| 4 | Google Calendar-sync | Konfig-view |
| 5 | Smart auto-fyll | AI-forslag |

---

## 6. Teknisk leveranse per wireframe

Hver wireframe produserer:
1. `wireframe/1704-<slug>/index.html` — 5 UX-opsjoner + Summary-fane
2. `wireframe/1704-<slug>/styles.css` — B&W wireframe-innhold (~150–250 linjer)
3. `wireframe/1704-<slug>/base.css` — framework (fra skill)
4. `wireframe/1704-<slug>/styles-opt1..5.css` — Clean + Polished fargevarianter (~150–200 linjer hver)
5. `wireframe/1704-<slug>/compare.html` — side-by-side sammenligning (5 iframes)

---

## 7. Kritisk huskeliste (gjelder alle wireframes)

**Navngivning:**
- ✅ Portalen (ikke AK Portal)
- ✅ Personlig coaching (ikke AK Coaching)
- ✅ Treningspyramiden (Norges Golfforbund) (ikke AK-formelen)
- ✅ AK Golf sin coaching-filosofi (AK's metodiske rammeverk)
- ❌ Aldri "AI-drevet plattform" som hovedbudskap

**Design-tokens:**
- Primary `#005840`, accent lime `#D1F843`, primary-soft `#E6F3F1`
- Surface `#ECF0EF`, grey-50 `#F5F8F7`, black `#0A1F18`, white
- Text `#324D45`, muted `#A5B2AD`
- AI lilla `#AF52DE` (sparsomt)

**Tema per flate:**
- Markedsside: Editorial hybrid (Mercury-stil) — cream base + 2-3 dark-seksjoner
- Portal: Clean Apple-minimalisme (light)
- Mission Control: XPO TMS-stil (dark topbar + lys body + høyre drawer)

---

## 8. Eksekverings-schedule

| Fase | Tid | Avhengighet |
|------|-----|-------------|
| **Batch 1 fullfør** | 2026-04-17 kl 20:15 | API-reset kl 20:00 |
| **Batch 2 start** | 2026-04-17 kl 21:00 | Batch 1 verifisert |
| **Batch 3 start** | 2026-04-18 (ny sesjon) | Batch 2 ferdig |
| **Alt komplett** | 2026-04-18 | — |

**Estimat:**
- Batch 1 fullføring: ~30 min (7 gjenstående wireframes × sub-agenter)
- Batch 2: ~40 min (6 wireframes + compare.html per)
- Batch 3: ~45 min (7 wireframes)
- **Totalt gjenstående arbeid:** ~2 timer

---

## 9. Pipeline-orkestrering

### For hver batch:
1. Spawn parallelle orkestrator-agenter (en per wireframe) via Agent tool
2. Hver orkestrator gjør Fase 1 (HTML/CSS) + Fase 2 (5 Visual Designers)
3. Orkestrator returnerer når alle 5 Visual Designers er ferdig
4. Etter batch: lag compare.html per skjerm + oppdater INDEX.html

### Retry-strategi:
- Hvis agent feiler av API-grense → vent til reset, re-lans
- Hvis agent feiler av context → del opp i to agenter (Fase 1 og Fase 2 separat)
- Hvis én Visual Designer feiler → re-lans kun den ene (ikke hele batchen)

---

## 10. Verifisering per skjerm

Sjekkliste per wireframe (etter fullføring):

- [ ] index.html eksisterer og åpner i browser
- [ ] 5 UX-opsjoner + Summary-fane
- [ ] Sub-tabs (Wireframe / Clean / Polished) fungerer
- [ ] Alle 5 `styles-optN.css` har > 100 linjer
- [ ] Ingen "AK-formelen" / "AK Portal" / "AK Coaching" i teksten
- [ ] Treningspyramiden krediterer Norges Golfforbund
- [ ] AI nevnes som "AI-veiledning" (ikke "AI-drevet")
- [ ] `compare.html` eksisterer og viser alle 5 opsjoner

---

## 11. INDEX.html oppdateringer

Når batcher fullføres, oppdater INDEX.html med:
- Status-tag (Komplett / Pågår / Ikke startet)
- "Sammenlign"-lenke per skjerm (compare.html)
- Gruppering: Markedsside / Portal / MC / MC Views
- Progress bar per batch

---

## 12. Neste skritt (IMMEDIATE)

Etter API-reset kl 20:00:
1. Re-lans orkestratorer for 7 gjenstående Batch 1-skjermer
2. Lag compare.html for alle 7 (automatisert)
3. Oppdater INDEX.html med full status
4. Rapporter til Anders

Deretter:
- Start Batch 2 (6 wireframes + 6 compare.html)
- Start Batch 3 (7 wireframes + 7 compare.html)

---

## 13. Åpne spørsmål

- Skal alle admin-views ha egne wireframes, eller rom-for-rom i samme (5-opsjoner-per-skjerm)? **Beslutning:** 5-opsjoner-per-skjerm med views som alternative UX-tilnærminger.
- Booking-flow (offentlig `/booking`) — wizard eller single-page? **Avklaring trengs.**
- Elev-detalj — tabs vs single-scroll? **Vi utforsker begge i 5-opsjoner.**
