# Master Wireframe Plan — AK Golf Platform

> **Versjon:** 2.0.0
> **Dato:** 2026-04-18 (oppdatert)
> **Kontekst:** Wireframe-leveranse komplett. Alle 58 skjermer har HTML + 5 UX-opsjoner + 5 fargevarianter + compare.html.
> **Status:** Wireframing 100% ferdig. Neste steg: godkjenningsrunde (Fase C) → designfase (Fase D).

---

## 1. Oversikt

**Endelig leveranse: 58 wireframes** (22 strategiske + 36 bonus)

**Fordeling:**
- **Markedsside:** 6 wireframes (alle P0)
- **Portal:** 29 wireframes (8 strategiske + 21 bonus)
- **Mission Control:** 23 wireframes (8 strategiske + 15 bonus)

**Per wireframe:**
- `index.html` med 5 UX-opsjoner + Summary
- `base.css` + `styles.css` (B&W framework)
- `styles-opt1.css` til `styles-opt5.css` (Clean + Polished fargevarianter)
- `compare.html` (side-by-side sammenligning)

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

### 3A. Markedsside (6 skjermer — alle komplett)

| ID | Skjerm | Mappe | Rute |
|----|--------|-------|------|
| M1 | Forside | `1704-markedsside-forside` | `/` |
| M2 | Pricing | `1704-markedsside-pricing` | `/priser` |
| M3 | Academy | `1704-markedsside-academy` | `/academy` |
| M4 | Junior Academy | `1704-markedsside-junior` | `/junior-academy` |
| M5 | Utvikling | `1704-markedsside-utvikling` | `/utvikling` |
| M6 | Booking (offentlig) | `1704-markedsside-booking` | `/booking` |

### 3B. Portal — strategiske (8 skjermer)

| ID | Skjerm | Mappe | Rute |
|----|--------|-------|------|
| P1 | Dashboard | `1704-portal-dashboard-v2` | `/portal` |
| P2 | Treningsplanlegger 2.0 | `1704-portal-planlegger-v2` | `/portal/treningsplan/ny` |
| P3 | Kalender | `1704-portal-kalender` | `/portal/kalender` |
| P4 | Runde-tracking (live) | `1704-portal-runde-live` | `/portal/runde/[id]` |
| P5 | Runde-oppsummering | `1704-portal-runde-oppsummering` | `/portal/runde/[id]/oppsummering` |
| P6 | Statistikk | `1704-portal-statistikk` | `/portal/statistikk` |
| P7 | Mental game | `1704-portal-mental` | `/portal/mental` |
| P8 | Onboarding | `1704-portal-onboarding` | `/portal/onboarding` |

### 3C. Mission Control — strategiske (8 skjermer)

| ID | Skjerm | Mappe | Rute |
|----|--------|-------|------|
| A1 | Dashboard | `1704-mc-dashboard` | `/portal/admin` |
| A2 | Kalender | `1704-mc-kalender` | `/portal/admin/kalender` |
| A3 | Bookinger | `1704-mc-bookinger` | `/portal/admin/bookinger` |
| A4 | Elever | `1704-mc-elever` | `/portal/admin/elever` |
| A5 | Elev-detalj | `1704-mc-elev-detalj` | `/portal/admin/elever/[id]` |
| A6 | Rapporter | `1704-mc-rapporter` | `/portal/admin/rapporter` |
| A7 | Fasiliteter | `1704-mc-fasiliteter` | `/portal/admin/fasiliteter` |
| A8 | Tilgjengelighet | `1704-mc-tilgjengelighet` | `/portal/admin/tilgjengelighet` |

### 3D. Bonus-wireframes (utover opprinnelig plan — 36 skjermer)

**Portal bonus (21 skjermer):**

| ID | Skjerm | Mappe | Rute |
|----|--------|-------|------|
| PB01 | AI-coach | `1704-portal-ai-coach` | `/portal/ai-coach` |
| PB02 | Analyse | `1704-portal-analyse` | `/portal/analyse` |
| PB03 | Apper | `1704-portal-apper` | `/portal/apper` |
| PB04 | Abonnement | `1704-portal-abonnement` | `/portal/abonnement` |
| PB05 | Bag | `1704-portal-bag` | `/portal/bag` |
| PB06 | Benchmark | `1704-portal-benchmark` | `/portal/benchmark` |
| PB07 | Bookinger | `1704-portal-bookinger` | `/portal/bookinger` |
| PB08 | Coaching-historikk | `1704-portal-coaching-historikk` | `/portal/coaching-historikk` |
| PB09 | Dagbok | `1704-portal-dagbok` | `/portal/dagbok` |
| PB10 | Meldinger | `1704-portal-meldinger` | `/portal/meldinger` |
| PB11 | Øvelser | `1704-portal-ovelser` | `/portal/ovelser` |
| PB12 | Profil | `1704-portal-profil` | `/portal/profil` |
| PB13 | Sammenligning | `1704-portal-sammenligning` | `/portal/sammenligning` |
| PB14 | Sosialt | `1704-portal-sosialt` | `/portal/sosialt` |
| PB15 | Spill | `1704-portal-spill` | `/portal/spill` |
| PB16 | Strategi | `1704-portal-strategi` | `/portal/strategi` |
| PB17 | Tester DECADE | `1704-portal-tester-decade` | `/portal/tester-decade` |
| PB18 | TrackMan | `1704-portal-trackman` | `/portal/trackman` |
| PB19 | TrackMan-tester | `1704-portal-trackman-tester` | `/portal/trackman-tester` |
| PB20 | Turneringer | `1704-portal-turneringer` | `/portal/turneringer` |
| PB21 | Turneringsplan | `1704-portal-turneringsplan` | `/portal/turneringsplan` |

**Mission Control bonus (15 skjermer):**

| ID | Skjerm | Mappe | Rute |
|----|--------|-------|------|
| AB01 | Agenter | `1704-mc-agenter` | `/portal/admin/agenter` |
| AB02 | AI-assistent | `1704-mc-ai-assistent` | `/portal/admin/ai-assistent` |
| AB03 | Analytics | `1704-mc-analytics` | `/portal/admin/analytics` |
| AB04 | Denne uken | `1704-mc-denne-uken` | `/portal/admin/denne-uken` |
| AB05 | E-postmaler | `1704-mc-epostmaler` | `/portal/admin/epostmaler` |
| AB06 | Focus | `1704-mc-focus` | `/portal/admin/focus` |
| AB07 | Godkjenninger | `1704-mc-godkjenninger` | `/portal/admin/godkjenninger` |
| AB08 | Kapasitet | `1704-mc-kapasitet` | `/portal/admin/kapasitet` |
| AB09 | Meldinger | `1704-mc-meldinger` | `/portal/admin/meldinger` |
| AB10 | Mission board | `1704-mc-mission-board` | `/portal/admin/mission-board` |
| AB11 | Notifikasjoner | `1704-mc-notifications` | `/portal/admin/notifications` |
| AB12 | Økonomi | `1704-mc-okonomi` | `/portal/admin/okonomi` |
| AB13 | Økter | `1704-mc-okter` | `/portal/admin/okter` |
| AB14 | Treningsplan | `1704-mc-treningsplan` | `/portal/admin/treningsplan` |
| AB15 | Turneringer | `1704-mc-turneringer` | `/portal/admin/turneringer` |

---

## 4. Leveranse-status (arkivert)

Opprinnelig plan hadde 3 batcher à 22 wireframes. Faktisk leveranse ble utvidet til 58 wireframes (alle produsert 17.–18. april). Alle batcher er ferdig.

| Batch | Plan | Levert |
|-------|------|--------|
| 1 (P0) | 9 wireframes | Ferdig |
| 2 (P1) | 6 wireframes | Ferdig |
| 3 (P2) | 7 wireframes | Ferdig |
| Bonus | 0 | 36 ekstra wireframes levert |

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

## 8. Eksekverings-historikk

| Milestone | Dato | Status |
|-----------|------|--------|
| Plan laget | 2026-04-17 | Ferdig |
| Alle 58 wireframes levert | 2026-04-17/18 | Ferdig |
| Compare.html for P2, A1 | 2026-04-17 | Ferdig |
| Compare.html for 56 øvrige | 2026-04-18 | Ferdig (generert via `scripts/generate-compare.mjs`) |
| MASTER_WIREFRAME_PLAN.md oppdatert | 2026-04-18 | Ferdig |
| Fase C — Godkjenningsrunde | 2026-04-18+ | **Pågår** |
| Fase D — Designfase | Etter Fase C | Ventende |

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

## 11. Nye skjermer — scope (godkjent 2026-04-18)

Anders har godkjent **alle 22 nye skjermer** for produksjon (N01-N22).

### P0 — Kritisk (5 skjermer, N01-N05) — pågår nå

| ID | Skjerm | Rute |
|----|--------|------|
| N01 | Utvikling-progresjon | `/portal/utvikling-progress` |
| N02 | Konkurranseforberedelse | `/portal/konkurranse-prep` |
| N03 | Onboarding magic-link | `/onboarding/[token]` |
| N04 | Coaching-meldinger | `/portal/coaching-feedback` |
| N05 | Foreldre-dashboard | `/portal/forelder` |

### P1 — Viktig (7 skjermer, N06-N12)

| ID | Skjerm | Rute |
|----|--------|------|
| N06 | Treningstimer per område | `/portal/trening-volum` |
| N07 | Sesongplan | `/portal/sesongplan` |
| N08 | Leaderboards | `/portal/rangering` |
| N09 | Ferdig-turnering-resultater | `/portal/turneringer/resultater` |
| N10 | Email-campaign-manager | `/portal/admin/kampanjer` |
| N11 | Exercise-bank-builder | `/portal/ovelser/min-bank` |
| N12 | Admin task-board | `/portal/admin/oppgaver` |

### P2 — Nyttig (6 skjermer, N13-N18)

| ID | Skjerm | Rute |
|----|--------|------|
| N13 | Skadehistorikk/helse | `/portal/helse` |
| N14 | Utstyrsinventar | `/portal/bag/administrer` |
| N15 | Promo/offer-manager | `/portal/admin/tilbud` |
| N16 | Mental trends | `/portal/mental/trender` |
| N17 | Skill-degradation-alert | `/portal/admin/varsler-nedgang` |
| N18 | Golfbox-turnering-integrasjon | `/portal/turneringer/[id]/pameldte` |

### Coverage-driven (4 skjermer, N19-N22)

| ID | Skjerm | Rute | Data |
|----|--------|------|------|
| N19 | Periodisering | `/portal/admin/periodisering` | TrainingPhase, PeriodizationPeriod |
| N20 | Module Add-ons | `/portal/abonnement/moduler` | AppModule, AppBundle |
| N21 | Content Studio | `/portal/admin/innhold` | ContentItem |
| N22 | Mental Performance Profile | `/portal/mental/profil` | MentalProfile + AI |

**Total: 22 nye wireframes** som skal produseres i Fase C3.

---

## 12. Neste skritt

### Fase C — Godkjenningsrunde (fullført)
Gå gjennom alle 58 wireframes gruppe for gruppe. Anders velger én vinner-opsjon (1-5) per skjerm + eventuell kommentar. Tracking i `wireframe/WINNERS.md`.

**Gruppestruktur:**
1. **Markedsside (6):** M1–M6
2. **Portal kjerne (9):** P1–P3, P8, PB09 (dagbok), PB11 (ovelser), PB12 (profil), PB07 (bookinger), PB01 (ai-coach)
3. **Portal utvidet (10):** PB18, PB19, PB17, PB14, PB10, PB03, PB04, PB05, PB02, PB16
4. **Portal spill/stats (8):** P4–P7, PB13, PB06, PB15, PB08, PB20, PB21
5. **Mission Control kjerne (8):** A1–A5, AB04 (denne-uken), AB10 (mission-board), AB07 (godkjenninger)
6. **Mission Control utvidet (17):** A6–A8 + AB01–AB03, AB05, AB06, AB08, AB09, AB11–AB15

Per skjerm: åpne `compare.html`, sammenlign 5 opsjoner i Wireframe/Clean/Polished-modus, velg vinner.

### Fase D — Designfase (etter godkjenning)
Per godkjent skjerm produseres `DESIGN-SPEC.md` med: fargevalg (map til brand-tokens), bildekurering, typografi, Lucide-ikoner, Framer Motion-presets, komponent-mapping til eksisterende bibliotek, responsivitet.

Sentralt register: `docs/BILDEKATALOG.md` (nytt — lister alle bilder per skjerm + bruksrettigheter).

---

## 13. Åpne spørsmål

- Booking-flow (offentlig `/booking`) — wizard eller single-page? **Avklares i Fase C ved å velge vinner-opsjon for M6.**
- Elev-detalj — tabs vs single-scroll? **Avklares i Fase C ved å velge vinner-opsjon for A5.**
- Skal alle 36 bonus-wireframes tas videre til designfase, eller skal noen parkeres? **Åpent — vurder under Fase C.**
