# Konkurrentanalyse & Tour-Level Caddy Konsept
## Hvordan bygge verdens beste digitale caddy

**Dato:** 13. april 2026  
**Forfatter:** AK Golf Group  

---

## DEL 1: KONKURRENTANALYSE

### 1.1 Arccos Golf (Markedsleder)

**Hva de samler av data:**
```
Shot-level data (automatis via sensorer):
├── Club brukt
├── Startposisjon (GPS)
├── Landingsposisjon (GPS)
├── Avstand slått
├── Retning (fairway/rough/left/right)
├── Scrambling (missed green → made par/bogey)
└── Putt-lengder (fra hvor, resultat)

Runde-data:
├── Score per hull
├── Fairways hit
├── GIR
├── Putts totalt
├── Putts per GIR
├── Scramble %
├── Sand save %
└── Penalties

Strokes Gained (beregnet):
├── SG: Total
├── SG: Off the Tee
├── SG: Approach
├── SG: Around Green
└── SG: Putting

Advanced Analytics:
├── "Arccos Caddie" - AI-basert klubbvalg
├── A.I.R. (Adjusted Individual Ranking)
├── Club distances (gjennomsnitt per klubb)
├── "What-if" analyser
└── Trend-rapporter

Eksternt:
├── Vær (integrert)
├── Wind (retning/styrke)
└── Elevation (per hull)
```

**Hva de mangler:**
- ❌ Mental data (press, fokus, rutiner)
- ❌ DECADE-strategi (ikke spillerspesifikk spredning)
- ❌ Pre-shot rutine tracking
- ❌ Hinderspesifikk analyse (hva gjør spiller når vann er venstre?)
- ❌ Trening vs Spill-sammenligning
- ❌ Konkurranse-spesifikk analyse

---

### 1.2 Game Golf

**Hva de samler:**
```
Shot-tracking (manuell eller automatisk):
├── Club selection
├── Start/Landing GPS
├── Score
└── Putt-lengder

Statistikk:
├── Scoring average
├── Fairways/GIR/Putts
├── Scrambling
└── SG-beregninger (basert på Shotlink-data)

Sosialt:
├── Sammenligning med venner
├── Turneringer/ligaer
└── Challenges
```

**Mangler:**
- ❌ Ingen DECADE-integrasjon
- ❌ Ingen mental tracking
- ❌ Ingen strategi-coaching
- ❌ Grunnleggende statistikk bare

---

### 1.3 UpGame (Norsk app)

**Hva de samler (basert på integrasjon):**
```
Runde-data:
├── Score per hull
├── Putts
├── Fairways/GIR
├── Scrambling
└── Sand saves

Spillerprofil:
├── Handicap
├── Klubbtilhørighet
└── Runde-historikk

Analyse:
├── Score-trender
├── Hull-spesifikk statistikk
└── Sammenligning med feltet
```

**Mangler:**
- ❌ Shot-level data
- ❌ DECADE
- ❌ Mental tracking
- ❌ Trening

---

### 1.4 DECADE App (Scott Fawcett)

**Hva de samler (basert på dokumentasjon):**
```
Spillerdata:
├── Handicap
├── Spredningsprofil (estimert)
├── Shot-pattern (draw/fade)
└── "Stock distances"

Bane-data:
├── Google Earth/Drone-bilder
├── Hull-lengder
├── Hazard-posisjoner
├── Green-størrelser
└── Course rating

Strategi:
├── DECADE 5% Buffer-regel
├── "Never Bogey" hull-identifisering
├── Expected score per hull
├── Optimal aimpoints
└── Risk/reward analyser

Mental:
├── "8-second rule"
├── Pre-shot rutine
├── Commitment-score
└── Mental scorecard (Pass/Fail per slag)
```

**Styrker:**
- ✅ Beste strategi-algoritme (DECADE)
- ✅ Shotgun Principle (sprednings-basert)
- ✅ Matematiske mål (ikke pin-jakt)
- ✅ Bogey Avoidance fokus

**Mangler:**
- ❌ Faktisk spiller-spredning (bruker estimater)
- ❌ Shot-level tracking
- ❌ Trening
- ❌ Mental data (kun Pass/Fail)
- ❌ Konkurranse vs Casual-analyse

---

### 1.5 TrackMan Performance Studio

**Hva de samler (profesjonelt verktøy):**
```
Tekniske data (per slag):
├── Club speed
├── Ball speed
├── Smash factor
├── Launch angle
├── Spin rate
├── Carry distance
├── Total distance
├── Lateral landing
├── Apex height
├── Angle of attack
├── Club path
├── Face angle
└── Face to path

Spredningsanalyse:
├── Gjennomsnitt per klubb
├── Standardavvik (lateral)
├── Standardavvik (carry)
├── Consistency score
└── Dispersion ellipses

Bane-simulering:
├── "Plays like" avstander
├── Elevation justering
├── Wind justering
└── Expected score
```

**Styrker:**
- ✅ Beste tekniske data
- ✅ Nøyaktig spredningsanalyse
- ✅ Profesjonell presisjon

**Mangler:**
- ❌ Ingen DECADE-strategi
- ❌ Ingen mental tracking
- ❌ Krever TrackMan-hardware
- ❌ Dyrt ($$$)

---

### 1.6 Sammenligningstabell

| Feature | Arccos | Game Golf | UpGame | DECADE App | TrackMan |
|---------|--------|-----------|--------|------------|----------|
| **Shot-level tracking** | ✅ Auto | ✅ Manual | ❌ | ❌ | ✅ Hardware |
| **Strokes Gained** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **DECADE strategi** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Spredningsanalyse** | ⚠️ Basic | ❌ | ❌ | ⚠️ Estimert | ✅ Nøyaktig |
| **Mental tracking** | ❌ | ❌ | ❌ | ⚠️ Basic | ❌ |
| **Trening vs Spill** | ❌ | ❌ | ❌ | ❌ | ⚠️ Limited |
| **AI Coaching** | ✅ Basic | ❌ | ❌ | ⚠️ Regler | ❌ |
| **Konkurranse-modus** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Pre-shot rutine** | ❌ | ❌ | ❌ | ✅ | ❌ |

**Vår mulighet:** Kombiner det beste fra alle + mental tracking + trening-spill-konkurranse-analyse!

---

## DEL 2: HVA EN PROFF CADDY GJØR

### 2.1 Tour Caddy Rolle (Rory McIlroy / Scottie Scheffler)

```
FØR RUNDE:
├── Bane-analyse
│   ├── Hull-for-hull gjennomgang
│   ├── "Plays like" avstander (elevation, vind)
│   ├── Hazard-strategi
│   ├── Green-reading (hastighet/break)
│   └── Pin-posisjoner og mål-soner
│
├── Spiller-spesifikk plan
│   ├── Hvilke klubber å bruke hvor
│   ├── Shot-shape per hull
│   ├── Aggressiv/konservativ strategi
│   └── "Mental prep" for utfordrende hull
│
└── Logistikk
    ├── Starttid
    ├── Oppvarmingsplan
    ├── Ernæring
    └── Vær-forberedelser

UNDER RUNDE (Per hull):
├── Pre-shot (Tee)
│   ├── "Plays like 185, men det er 175 på scorekortet"
│   ├── "Driver er safe hvis du sikter på venstre fairway"
│   ├── "3-tre gir bedre vinkel, men lengre innspill"
│   └── "Vinden er i mot, legg på 10 meter"
│
├── Pre-shot (Approach)
│   ├── "105 meter, men spiller 112 i dag"
│   ├── "Flagget er bakken, sikte midt green"
│   ├── "Bunker høyre er døden, sikte venstre halvdel"
│   └── "Dette er 'never bogey' hull - par er bra"
│
├── Post-shot
│   ├── "Bra slag! Bare 4 meter igjen"
│   ├── "OK, vi har 15m chip, la oss sikte på 2m radius"
│   └── "Ikke tenk på det, neste hull er birdie-mulighet"
│
├── Putting
│   ├── "Grønn er rask nedover, 2 fot utenfor høyre"
│   ├── "Break er dobbelt det du ser"
│   └── "Denne er for par, ikke prøv å hole den"
│
└── Mental støtte
    ├── "Pust med meg, rolig nå"
    ├── "Du har slått denne putten 1000 ganger"
    ├── "Ikke se på leaderboardet"
    └── "Du er god nok til å vinne dette"

MELLOM RUNDER:
├── Statistikk-gjennomgang
│   ├── "Du traff bare 7 av 14 fairways i dag"
│   ├── "Approach var sterk, men putting sviktet"
│   └── "Vi må justere på hull 12-15 i morgen"
│
├── Strategi-justering
│   ├── "Vinden endrer seg, mer draw i morgen"
│   ├── "Pins er mer aggressive på lørdag"
│   └── "Vi må være mer konservative på 16-17"
│
└── Mental reset
    ├── "Glem i dag, fokus på i morgen"
    ├── "Du er bare 3 slag bak, alt kan skje"
    └── "Sov godt, jeg har planen klar"
```

### 2.2 Hva gjør en caddy UNIK?

```
1. KJENNER SPILLEREN INTIMT
   ├── Vet nøyaktig spredning på hver klubb
   ├── Vet når spilleren blir nervøs
   ├── Vet hvilke ord som motiverer
   └── Vet når å snakke vs. være stille

2. KONTINUERLIG TILPASNING
   ├── Justerer basert på dagsform
   ├── Endrer strategi etter miss
   ├── Tilpasser seg vær/vind
   └── Bytter game-plan underveis

3. EKSTERN PERSPEKTIV
   ├── Ser det spilleren ikke ser
   ├── Tar følelses-beslutninger
   ├── Gir objektivt råd
   └── Skjønner "the big picture"

4. MENTAL STØTTE
   ├── Beroliger under press
   ├── Bygger selvtillit
   ├── "Reframer" dårlige slag
   └── Holder fokus på prosess
```

---

## DEL 3: DECADE-KONSEPTET DYP ANALYSE

### 3.1 Kjerne-filosofi

**Shotgun Principle:**
```
Vanlig tankegang: "Jeg skal treffe flagget"
DECADE: "Jeg har en 74-fots bred spredning. 
         Hvis jeg sikter på flagget, 
         kan jeg havne 37 fot til høyre eller venstre.
         Hvis det er bunker til høyre,
         må jeg sikte 37 fot VENSTRE for flagget
         for å være sikker på å unngå bunker."

Matematikk:
• Spillerens spredning: 74 fot (95% konfidens)
• Safe sone: Midt av green
• Buffer: 5-8% av avstand (f.eks. 8 fot fra kant på 100m slag)
• Resultat: Sikter på "fat part", aksepterer "accidental birdies"
```

**5% Buffer Rule:**
```
Hvis spilleren slår 100m (ca. 110 yards):
• 5% = 5.5 yards (ca. 5 meter)
• Spilleren må sikte minst 5m fra green-kant
• Hvis flagget er 3m fra kant: IKKE SIKTE PÅ FLAGG
• Hvis flagget er 8m fra kant: SIKTE PÅ FLAGG

HCP-basert justering:
• Scratch (0): 5% buffer
• Single digit (1-9): 6% buffer
• Double digit (10+): 7%+ buffer
```

**Bogey Avoidance:**
```
Faktisk data (PGA Tour):
• 70-80% av scoring-forbedring kommer fra å unngå bogeys
• Kun 1 av 16 forbedrede slag kommer fra flere birdies

Konsekvens:
• "Never Bogey" hull: Par 5s, korte Par 4s (9-jern eller mindre)
• Strategi: Konservativ på disse hullene
• Mål: Sikker par, aksepter at birdie er "accidental"
```

### 3.2 DECADE Hull-Klassifisering

```
"NEVER BOGEY" HULL:
├── Par 5s (ALLTID)
├── Par 4s < 350 yards (dvs. 9-jern eller mindre til green)
└── Strategi: Par er absolutt prioritet

"NORMAL" HULL:
├── Standard Par 4s
└── Strategi: Balansert risk/reward

"DEFENSIVE" HULL:
├── Vanskelige Par 4s (langt, trangt)
├── Par 3s med vanskelige greens
└── Strategi: Aksepter høyere expected score
```

### 3.3 DECADE Beslutnings-algoritme

```
FOR HVERT SLAG:

1. ANALYSER FORHOLD
   ├── Avstand til mål
   ├── Vind (1% justering per mph)
   ├── Lie (flat/uphill/downhill/sidehill)
   ├── Hindere (vann, bunker, OB)
   └── Spillerens "stock shot"

2. IDENTIFISER HULL-TYPE
   ├── "Never Bogey"? → Konservativ
   ├── Normal? → Balansert
   └── Defensiv? → Aksepter høyere score

3. BEREGN BUFFER-SONE
   ├── Avstand × HCP-faktor (5-7%)
   ├── Minimum avstand fra hazard
   └── Siktepunkt = "fat part" av safe sone

4. VELG KLUBB
   ├── Kan jeg nå med «stock shot»?
   ├── Hvis ikke: Kortere klubb + aksepter lengre innspill
   └── Aldri: Prøv å «force» en form

5. EKSEKVER
   ├── Verbaliser planen
   ├── 8-sekunders regel (ikke tvil!)
   ├── Commit 100%
   └── Aksepter resultatet (varians)
```

---

## DEL 4: TOUR-LEVEL CADDY KONSEPT

### 4.1 Visjon: "AI Caddy på nivå med Harry Diamond (Rory) eller Ted Scott (Scottie)"

```
FORUTSETNING: Spilleren har spilt 5+ runder med appen

ETTER ANALYSE (Backend):
├── Spredningsprofil kartlagt (per klubb)
├── Mentale mønstre identifisert (press-respons)
├── Sterke/svake situasjoner kartlagt
├── DECADE-strategi tilpasset spilleren
└── "Caddie Personality" lært

UNDER RUNDE (i sanntid):
├── GPS-posisjon → Hull-identifisering
├── Avstand til mål → "Plays like" beregning
├── Vind/elevation → Automatisk justering
├── Spredningsprofil → Buffer-beregning
├── Hull-type → Strategi-anbefaling
├── Hindere → Aimpoint-forslag
└── Mental state → Motivasjons-tilpasning
```

### 4.2 Data som må samles (Backend Arkitektur)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPILLER-PROFIL (Statisk)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  demographics:                                                   │
│  ├── age, gender, handedness                                    │
│  ├── height, weight, fitness                                    │
│  └── yearsPlaying, previousCoaching                             │
│                                                                  │
│  equipment:                                                      │
│  ├── clubs (loft, shaft, specs)                                 │
│  ├── ball type                                                  │
│  └── putter style                                               │
│                                                                  │
│  preferences:                                                    │
│  ├── learningStyle (visual/auditory/kinesthetic)                │
│  ├── pressureResponse (thrives/neutral/struggles)               │
│  └── goalOrientation (process/outcome)                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SPREDNINGSPROFIL (Dynamisk)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  dispersionProfile:                                              │
│  {                                                               │
│    driver: {                                                     │
│      avgCarry: 240m,                                            │
│      carryStdDev: 12m,                                          │
│      lateralStdDev: 18m,                                        │
│      shotCount: 150,                                            │
│      pattern: "draw",                                           │
│      confidence: "high"                                         │
│    },                                                            │
│    "7iron": {                                                    │
│      avgCarry: 145m,                                            │
│      carryStdDev: 6m,                                           │
│      lateralStdDev: 8m,                                         │
│      pattern: "straight",                                       │
│      confidence: "high"                                         │
│    },                                                            │
│    ... (alle klubber)                                           │
│  }                                                               │
│                                                                  │
│  // Beregnet automatisk fra TrackMan eller estimert fra runder  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RUNDE-DATA (Per runde)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  roundMetadata:                                                  │
│  {                                                               │
│    date, course, roundType (CASUAL/COMPETITION/TOURNAMENT),     │
│    weather: { temp, windSpeed, windDir, conditions },            │
│    teeTime, groupSize, isCompetition, fieldSize                 │
│  }                                                               │
│                                                                  │
│  shots: [                                                        │
│    {                                                             │
│      holeNumber, par, shotNumber,                               │
│      fromLie, toLie,                                            │
│      fromDistance, toDistance,                                  │
│      club, intendedTarget, actualLanding,                       │
│      strokesGained,                                             │
│      mentalState: {                                             │
│        feltPressure, confidence, focus,                         │
│        routineCompleted, preShotThoughts                        │
│      },                                                          │
│      decisionQuality: {                                         │
│        followedCaddieAdvice,                                    │
│        targetType (PIN/CENTER/SAFE),                            │
│        wasOptimalDecision                                       │
│      }                                                           │
│    }                                                             │
│  ]                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                MENTAL PROFIL (Lært over tid)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  mentalProfile:                                                  │
│  {                                                               │
│    pressureResponseCurve: {                                      │
│      // Hvordan ytelse endres med press                         │
│      low: { avgScore: 82, consistency: "high" },                │
│      medium: { avgScore: 85, consistency: "medium" },           │
│      high: { avgScore: 89, consistency: "low" }                 │
│    },                                                            │
│                                                                  │
│    triggerSituations: [                                          │
│      { situation: "waterLeft", missDirection: "right", freq: 0.7 },
│      { situation: "lastHoleBad", nextHolePerformance: -1.2 },   │
│      { situation: "leading", mentalState: "tense" }             │
│    ],                                                            │
│                                                                  │
│    optimalRoutine: {                                             │
│      duration: 35,  // sekunder                                 │
│      steps: ["visualize", "practiceSwing", "commit", "execute"] │
│    },                                                            │
│                                                                  │
│    motivationTriggers: {                                         │
│      competition: true,                                          │
│      achievement: false,                                         │
│      social: false,                                              │
│      data: true                                                  │
│    }                                                             │
│  }                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DECADE-PROFIL (Spesifikk)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  decadeProfile:                                                  │
│  {                                                               │
│    // Spiller-spesifikk DECADE-tilpasning                       │
│    bufferPercentage: 6.5,  // (f.eks. 6.5% for HCP 12)          │
│                                                                  │
│    shotPatterns: {                                               │
│      driver: "draw",                                            │
│      stockDistance: 240,                                        │
│      dispersion95: 74  // fot                                   │
│    },                                                            │
│                                                                  │
│    neverBogeyThreshold: 135,  // meter (9-jern)                 │
│                                                                  │
│    optimalTargets: {                                             │
│      // Hulls by course with player-specific aimpoints          │
│      "miklagard_7": {                                           │
│        aimPoint: "leftCenter",                                  │
│        club: "5iron",                                           │
│        reasoning: "Your draw suits left side, 78% safe"         │
│      }                                                           │
│    },                                                            │
│                                                                  │
│    strategyAdherence: 0.65,  // 65% følger strategi             │
│    adherenceCorrelation: -0.8  // Høy adherence = lavere score  │
│  }                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 "AI Caddy" Interface (Under runde)

```
╔══════════════════════════════════════════════════════════════════╗
║  🏌️ AI CADDY: Mikael (Kategori F, HCP 16)                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  📍 HULL 7 - PAR 4, 380m                                          ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │                                                           │ ║
║  │  TEE-SLAG:                                                │ ║
║  │                                                           │ ║
║  │  • Avstand: 380m til green                                │ ║
║  │  • «Plays like»: 375m (lett nedoverbakke)                 │ ║
║  │  • Fairway: 22m bred                                      │ ║
║  │  • Vind: 2 m/s mot                                        │ ║
║  │                                                           │ ║
║  │  DIN SPREDNING (Driver):                                  │ ║
║  │  ┌─────────────────────────────────────────┐               │ ║
║  │  │  95% av slag lander innenfor 22m bredde│               │ ║
║  │  │  [====FAIRWAY====]                      │               │ ║
║  │  │       [YOU]                             │               │ ║
║  │  │  Treff-sannsynlighet: 78%               │               │ ║
║  │  └─────────────────────────────────────────┘               │ ║
║  │                                                           │ ║
║  │  ⚠️ OBSERVASJON:                                          │ ║
║  │  Du har i 3 av 5 runder truffet venstre rough her.        │ ║
║  │  Din draw-tendens er sterkere enn du tror.                │ ║
║  │                                                           │ ║
║  │  🎯 ANBEFALING:                                           │ ║
║  │  • Klubb: DRIVER (ja, selv om du er usikker)              │ ║
║  │  • Sikte: HØYRE side av fairway                           │ ║
║  │  • Hvis draw fungerer: Midt fairway ✅                    │ ║
║  │  • Hvis draw er for sterk: Venstre fairway (safe)         │ ║
║  │                                                           │ ║
║  │  «Sikte på høyre kant. Din naturlige draw bringer         │ ║
║  │   ballen tilbake til midt.»                               │ ║
║  │                                                           │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  [✓ Fulgte råd]  [✗ Ignorerte råd]  [? Spør caddy]             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝


╔══════════════════════════════════════════════════════════════════╗
║  📍 HULL 7 - ANDRE SLAG (etter tee-shot i fairway)              ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  • Avstand til flagg: 125m                                      ║
║  • «Plays like»: 128m (oppover, vind mot)                       ║
║  • Green: 25m dyp, flagg bakken (5m fra kant)                   ║
║  • Bunker: Høyre side, 8m fra green-kant                        ║
║                                                                  ║
║  DIN 8-JERN:                                                     ║
║  • Carry: 125m (perfekt match!)                                 ║
║  • Spredning: ±6m lateral                                       ║
║                                                                  ║
║  🚨 DECADE-ANALYSE:                                              ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │                                                           │ ║
║  │  Buffer-sone (6.5% av 128m = 8.3m fra kant):              │ ║
║  │  [GREEN]                                                  │ ║
║  │  [xxxxxSAFE ZONExxxxx]                                    │ ║
║  │       [FLAGG]                                             │ ║
║  │            [BUNKER]                                       │ ║
║  │                                                           │ ║
║  │  ⚠️ FLAGGET ER I BUFFER-SONEN (5m fra kant < 8.3m)       │ ║
║  │                                                           │ ║
║  │  ❌ IKKE SIKTE PÅ FLAGG!                                  │ ║
║  │  ✅ SIKTE: Midt-venstre green (15m fra flagg)             │ ║
║  │                                                           │ ║
║  │  Fordel: 85% sjanse for green (vs 60% hvis flagg-sikte)   │ ║
║  │  Expected score: 4.1 (vs 4.6 med flagg-sikte)             │ ║
║  │                                                           │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  🎯 CADDY-RÅD:                                                   ║
║  «Dette er et 'never bogey' hull for deg. Du har 9-jern eller  ║
║   mindre inn, så PAR er målet. Sikte på venstre halvdel av     ║
║   green, la variance jobbe for deg. Du får birdie 20% av       ║
║   gangene likevel.»                                            ║
║                                                                  ║
║  [Følg råd: Sikte venstre]  [Aggressivt: Sikte flagg]           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### 4.4 Backend Arkitektur for Tour-Level Caddy

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATAMODELLER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. PLAYER_PROFILE                                               │
│     - Basis info, preferanser, utstyr                           │
│     - Lært over tid (motivasjon, triggers)                      │
│                                                                  │
│  2. DISPERSION_PROFILE                                           │
│     - Per klubb: avg, stdDev, pattern, confidence               │
│     - Oppdateres etter hver TrackMan-økt/runde                  │
│     - Hovedkilde: TrackMan > Estimert fra runder > Standard     │
│                                                                  │
│  3. COURSE_STRATEGY                                              │
│     - Per bane, per hull:                                       │
│       * Hull-layout (GPS-koordinater)                           │
│       * Hindere (posisjon, type)                                │
│       * Green (størrelse, form, hastighet)                      │
│       * «Expected score» for spilleren                          │
│       * Optimal aimpoint (spiller-spesifikk)                    │
│                                                                  │
│  4. MENTAL_PROFILE                                               │
│     - Pressure-response curves                                  │
│     - Trigger-situasjoner (hva skaper miss?)                    │
│     - Optimal routine (hva fungerer best?)                      │
│     - Lært fra mental scorecard                                 │
│                                                                  │
│  5. ROUND_DATA                                                   │
│     - Komplett shot-level data                                  │
│     - Mental state per slag                                     │
│     - DECADE-compliance scoring                                 │
│                                                                  │
│  6. CADDIE_SESSION                                               │
│     - Per runde: hva rådet ble gitt                             │
│     - Hva spilleren gjorde                                      │
│     - Resultat (follow vs ignore)                               │
│     - Læring (hva fungerte?)                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AI-CADDY ENGINE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input:                                                          │
│  ├── Spiller-posisjon (GPS)                                     │
│  ├── Hull-database (layout)                                     │
│  ├── Spiller-profil (spredning, mental)                         │
│  └── Forhold (vind, vær, tid på døgnet)                         │
│                                                                  │
│  Prosess:                                                        │
│  1. Hull-identifisering → Hent layout                           │
│  2. Avstandsberegning → «Plays like»                            │
│  3. Sprednings-analyse → 95% konfidens-ellipse                  │
│  4. Hazard-vurdering → Treff-sannsynlighet per mål              │
│  5. DECADE-buffer → Optimal aimpoint                            │
│  6. Hull-klassifisering → «Never Bogey»?                        │
│  7. Klubb-valg → Hva passer spredning?                          │
│  8. Mental-tilpasning → Hva trenger spilleren å høre?           │
│                                                                  │
│  Output:                                                         │
│  ├── «Plays like» avstand                                       │
│  ├── Anbefalt klubb                                             │
│  ├── Siktepunkt (med visuell hjelp)                             │
│  ├── Strategi-rationale                                         │
│  ├── Mental coaching (hvis relevant)                            │
│  └── Expected score for denne beslutningen                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## DEL 5: KONKLUJSON

### Hva gjør oss bedre enn konkurrentene?

| Feature | Vår Løsning | Konkurrenter |
|---------|-------------|--------------|
| **Shot-level tracking** | ✅ Ja (manuell/automatisk) | Arccos: ✅, Andre: ⚠️ |
| **Spredningsanalyse** | ✅ **Faktisk data** (TrackMan) | DECADE: Estimert |
| **DECADE-strategi** | ✅ **Full integrasjon** | DECADE App: ✅, Andre: ❌ |
| **Mental tracking** | ✅ **Obligatorisk** | Alle: ❌ |
| **Trening vs Spill** | ✅ **Full analyse** | Alle: ❌ |
| **Tour-Level Caddy** | ✅ **Personlig AI** | Alle: ❌ |
| **Pre-shot rutine** | ✅ **Tracking + coaching** | DECADE: Basic |
| **Konkurranse-modus** | ✅ **Spesifikk analyse** | Alle: ❌ |

### Unike salgsargumenter:

1. **"Din faktiske spredning, ikke et gjennomsnitt"**
   - TrackMan-data gir nøyaktig spredning per klubb
   - Caddy-råd basert på DINE tall, ikke "typisk HCP 16"

2. **"Caddyen som kjenner deg"**
   - Lærer når du blir nervøs
   - Tilpasser råd basert på mental state
   - Husker hva som fungerte sist

3. **"DECADE + Mental = Vinnende kombinasjon"**
   - Strategi (ikke sikte på flagg)
   - Mental styrke (ikke bli redd)
   = Lavere score

4. **"Fra trening til turnering"**
   - Analyserer gapet mellom trening og konkurranse
   - Gir spesifikke øvelser for å lukke gapet
   - Mental forberedelse før turneringer

---

**Neste steg?**
1. Dypere analyse av én komponent?
2. Backend-arkitektur detaljer?
3. UI/UX skisser?
4. Noe annet?
