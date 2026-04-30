# MVP Roadmap
## World Class Golf Platform

**Mål:** Lanse verdens beste golf-analyseplattform på 3 måneder

---

## Prioriteringsmatrise

```
                    HIGH IMPACT
                         ▲
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    │  [MVP 2]           │  [MVP 1]           │
    │  - Shot-by-shot    │  - 100m Test       │
    │  - Course map      │  - Tour Score      │
    │  - Training plans  │  - Leaderboard     │
    │                    │  - Basic SG calc   │
    │                    │                    │
LOW EFFORT ──────────────┼──────────────────── HIGH EFFORT
    │                    │                    │
    │  [Nice to have]    │  [Post-MVP]        │
    │  - Social share    │  - AI coach        │
    │  - Video upload    │  - Full DECADE     │
    │  - Advanced stats  │  - All 23 tests    │
    │                    │                    │
    └────────────────────┼────────────────────┘
                         ▼
                    LOW IMPACT
```

---

## MVP 1: Foundation (Uke 1-4)

### Mål: "Spiller kan ta 100m-testen og se sin Tour Score"

#### Uke 1: Database & Backend
```
□ Database-migrasjon
  ├── Shot-modell
  ├── TestSession-modell
  └── CategoryRequirement (Fyll A-K)

□ API-endepunkter
  ├── POST /api/tests/{id}/start
  ├── POST /api/tests/sessions/{id}/complete
  └── GET /api/tests/leaderboard

□ DataGolf-integrasjon
  ├── Cache approach-skill data
  └── Tour benchmark service
```

#### Uke 2: Test UI
```
□ Test-runner komponent
  ├── Start test view
  ├── Input shots (10 stk)
  └── Complete test flow

□ Resultat-visning
  ├── Tour Score display
  ├── Rory Score display
  └── Improvement graph

□ Leaderboard
  ├── Academy leaderboard
  └── Category filter
```

#### Uke 3: TrackMan-kobling
```
□ Import TrackMan CSV til test
  ├── Parse TrackMan-format
  ├── Match shots til test-protokoll
  └── Auto-calculate scores

□ Bildedeling til test
  ├── Upload screenshot
  ├── OCR av TrackMan-resultat
  └── Auto-utfylling
```

#### Uke 4: Testing & Polish
```
□ Beta-testing med 5 spillere
□ Fiks bugs
□ Performance-optimalisering
□ Lanser MVP 1! 🎉
```

### MVP 1 Suksesskriterier:
- [ ] Spiller kan registrere 100m-test på under 2 minutter
- [ ] Tour Score vises innen 1 sekund
- [ ] Leaderboard oppdateres i sanntid
- [ ] 50+ tester registrert i første uke

---

## MVP 2: Core Experience (Uke 5-8)

### Mål: "Komplett runde-registrering med SG og bane-kart"

#### Uke 5-6: Shot-by-Shot
```
□ Utvid HoleResult med Shot[]
□ SG-beregningsmotor
  ├── Baseline lookup
  ├── SG per slag
  └── Kategori (OTT/APP/ARG/PUTT)

□ UI: Shot-by-shot input
  ├── Hull-for-hull visning
  ├── Registrer hvert slag
  └── Real-time SG display

□ Quick-entry modus
  ├── Score + putts
  ├── GIR/Fairway
  └── Auto-estimer SG
```

#### Uke 7: Bane-kart MVP
```
□ CourseMap modell
□ Import banedata (10 populære baner)
  ├── Oslo GK
  ├── Miklagard
  ├── Losby
  ├── Byneset
  ├── Nordstrand
  ├── Gjøvik
  ├── Borre
  ├── Kjekstad
  ├── Holtsmark
  └── Mørk

□ Kart-visning
  ├── Google Maps overlay
  ├── Hull-posisjoner
  └── Avstandsmåling

□ GPS-posisjonering
  ├── Spiller-posisjon
  └── Avstand til green
```

#### Uke 8: Runde-oppsummering
```
□ SG-oppsummering
  ├── Total SG
  ├── Per kategori
  └── Per avstand

□ Sammenligning
  ├── Med Tour
  ├── Med egen historikk
  └── Med kategori-snitt

□ Deling
  ├── Generer bilde
  └── Del til Instagram/Facebook
```

### MVP 2 Suksesskriterier:
- [ ] Full runde registrert på under 20 minutter
- [ ] SG beregnes automatisk for alle slag
- [ ] 10+ baner tilgjengelig med kart
- [ ] 20+ aktive brukere per dag

---

## MVP 3: Training Intelligence (Uke 9-12)

### Mål: "Personlig treningsplan basert på data"

#### Uke 9-10: Training Engine
```
□ Analysis engine
  ├── Analyser siste runder
  ├── Identifiser gap
  └── Prioriter områder

□ Prescription generator
  ├── Lag ukesplan
  ├── Alloker tid
  └── Velg øvelser

□ Adaptive logic
  ├── Justér basert på resultater
  └── Detect stagnation
```

#### Uke 11: Training UI
```
□ Ukeoversikt
  ├── Kalender-visning
  ├── Økt-detaljer
  └── Check off completion

□ Økt-tracker
  ├── Timer for økten
  ├── Registrer resultater
  └── Mid-session tests

□ Progress dashboard
  ├── SG-trend
  ├── Test-historikk
  └── Category-progress
```

#### Uke 12: Integration
```
□ Koble til treningsplan-V2
□ Kalender-sync
□ Push-notifications
□ Lanser MVP 3! 🚀
```

### MVP 3 Suksesskriterier:
- [ ] 80% følger treningsplanen
- [ ] Gj.sn. HCP-reduksjon: 2 slag på 4 uker
- [ ] 70% positive tilbakemeldinger

---

## MVP 4: Scale & Polish (Uke 13-16)

### Mål: "Klar for mass adoption"

```
□ Flere tester (15 totalt)
□ Norsk banedatabase (50+ baner)
□ Trener-dashboard
□ Stripe betaling
□ Onboarding flow
□ Help center
□ Performance-optimalisering
□ Markedsføringsklar! 📢
```

---

## Utviklings-prioritering per uke

| Uke | Fokus | Kritisk milestone |
|-----|-------|-------------------|
| 1 | Database & API | Kan lagre test-resultat |
| 2 | Test UI | Spiller kan ta test |
| 3 | TrackMan | Auto-import fungerer |
| 4 | Polish | MVP 1 lansert |
| 5 | Shot-modell | Kan registrere slag |
| 6 | SG Engine | SG beregnes riktig |
| 7 | Kart | 10 baner klare |
| 8 | Oppsummering | MVP 2 lansert |
| 9 | Analysis | Kan analysere data |
| 10 | Prescription | Kan generere plan |
| 11 | Training UI | Kan følge plan |
| 12 | Polish | MVP 3 lansert |
| 13-16 | Scale | Klar for vekst |

---

## Team-oppgavefordeling

### Backend-utvikler (50%)
- Database-migrasjoner
- API-endepunkter
- SG-beregninger
- DataGolf-integrasjon

### Frontend-utvikler (50%)
- Test UI
- Runde-registrering
- Kart-integrasjon
- Dashboards

### Designer (20%)
- UI/UX design
- Grafikk for deling
- App-icon
- Landing page

### Trener/Content (20%)
- Test-protokoller
- Øvelses-bibliotek
- Kravprofiler (A-K)
- Video-innhold

---

## Risikoanalyse

| Risiko | Sannsynlighet | Impact | Mitigation |
|--------|--------------|--------|------------|
| DataGolf API endres | Lav | Høy | Cache aggressivt, ha fallback |
| TrackMan-format endres | Medium | Medium | Støtt flere formater |
| Brukere skjønner ikke SG | Medium | Høy | God onboarding, enkle forklaringer |
| For tidskrevende å registrere | Medium | Høy | Quick-entry modus, kun viktigste data |
| Konkurrenter kopierer | Høy | Lav | First-mover advantage, bygg community |

---

## Neste steg (i dag!)

1. **Opprett branch:** `feature/world-class-golf`
2. **Database:** Kjør migrasjon for Shot, TestSession
3. **API:** Implementer POST /api/tests/100m/start
4. **UI:** Lag TestRunner-komponent
5. **Deploy:** Push til staging for testing

---

**La oss bygge verdens beste golfplattform! 🏆**
