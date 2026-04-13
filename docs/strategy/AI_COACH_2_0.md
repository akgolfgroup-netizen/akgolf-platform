# 🤖 AI COACH 2.0
## Verdens Beste Digitale Golfcoach

**Visjon:** En coach som kjenner deg bedre enn du kjenner deg selv, tilgjengelig 24/7, som gir presis veiledning basert på data - ikke gjetting.

---

# 📊 DEL 1: DATA COACHEN TRENGER (100% Korrekt Veiledning)

## 1.1 Spillerprofil (Statisk)

```typescript
interface PlayerProfile {
  // Demografi
  name: string;
  age: number;
  gender: 'M' | 'F';
  
  // Fysisk
  height: number;           // cm
  weight: number;           // kg
  dominantHand: 'right' | 'left';
  physicalLimitations?: string[];  // Skader, mobilitetsbegrensninger
  fitnessLevel: 1-10;       // Generell form
  
  // Golf-historie
  yearsPlaying: number;
  previousCoaching: boolean;
  lessonsPerMonth: number;
  
  // Mental profil
  competitiveExperience: 'none' | 'club' | 'regional' | 'national';
  pressureResponse: 'thrives' | 'neutral' | 'struggles';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  goalOrientation: 'process' | 'outcome';  // Fokus på prosess vs resultat
}
```

## 1.2 Nåværende Nivå (Dynamisk)

```typescript
interface CurrentLevel {
  // Kategori-system (A-K)
  category: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';
  handicap: number;
  handicapTrend: 'improving' | 'stable' | 'worsening';
  
  // Strokes Gained (siste 10 runder)
  sg: {
    total: number;
    offTheTee: number;
    approach: number;
    aroundGreen: number;
    putting: number;
    // Per avstand
    approach100: number;    // 75-100m
    approach125: number;    // 100-125m
    approach150: number;    // 125-150m
    approach175: number;    // 150-175m
    approach200: number;    // 175-200m
    approach200plus: number;// 200m+
  };
  
  // Tour Score (sammenligning)
  tourScore: {
    total: number;          // 0-100%
    byCategory: Record<SGCategory, number>;
    byDistance: Record<DistanceBucket, number>;
  };
  
  // Test-resultater
  tests: {
    testId: string;
    lastScore: number;
    tourScore: number;
    trend: 'up' | 'down' | 'stable';
    personalBest: number;
    testsCompleted: number;
  }[];
  
  // Spredningsprofil (fra TrackMan)
  dispersion: {
    club: string;
    avgCarry: number;
    dispersion95: { lateral: number; carry: number };
    shotCount: number;
    lastUpdated: Date;
  }[];
}
```

## 1.3 Treningshistorikk (Siste 90 dager)

```typescript
interface TrainingHistory {
  // Tid brukt
  hoursPerWeek: number;           // Gj.sn. siste 4 uker
  hoursByCategory: Record<SGCategory, number>;
  hoursByPyramid: Record<PyramidLevel, number>;
  
  // Økter
  sessions: {
    date: Date;
    duration: number;
    type: 'range' | 'short_game' | 'putting' | 'course' | 'simulator' | 'fitness';
    focus: SGCategory;
    drillsCompleted: string[];
    testResults?: TestResult[];
    perceivedQuality: 1-10;     // Spillerens egen vurdering
    notes: string;
  }[];
  
  // Fremgang
  improvement: {
    category: SGCategory;
    sgChange90days: number;     // +0.4, -0.1, etc.
    testImprovement: number;    // % forbedring
    trainingEfficiency: number; // SG-forbedring per time
  }[];
}
```

## 1.4 Baneresultater (Siste 20 runder)

```typescript
interface RoundHistory {
  rounds: {
    date: Date;
    course: string;
    score: number;
    scoreToPar: number;
    
    // Nøkkel-stats
    fairwaysHit: number;
    fairwaysTotal: number;
    gir: number;
    girTotal: number;
    putts: number;
    
    // SG-basert
    sg: SGBreakdown;
    
    // Spesifikke mønstre
    par3Scoring: number;
    par4Scoring: number;
    par5Scoring: number;
    scrambleConversion: number;
    threePuttAvoidance: number;
    
    // DECADE
    strategyAdherence: number;  // % av hull fulgte strategi
    vsExpectedScore: number;    // Faktisk - Forventet
  }[];
  
  // Mønstre
  patterns: {
    bestPerformance: { condition: string; score: number };
    worstPerformance: { condition: string; score: number };
    scoringTrend: 'early' | 'late' | 'consistent';  // Når scorer spilleren best?
    commonMistakes: string[];  // Analysert fra shot-data
  };
}
```

## 1.5 Tilgjengelighet (Ukentlig)

```typescript
interface Availability {
  // Tid
  hoursPerWeek: number;
  preferredSessionLength: number;  // 30, 60, 90, 120 min
  
  // Dager
  availableDays: {
    monday: { available: boolean; preferredTime: 'morning' | 'afternoon' | 'evening' };
    tuesday: { ... };
    // ...
  };
  
  // Fasiliteter
  facilities: {
    hasRange: boolean;
    hasPuttingGreen: boolean;
    hasShortGameArea: boolean;
    hasSimulator: boolean;
    hasTrackMan: boolean;
    hasFitness: boolean;
  };
  
  // Begrensninger
  constraints: {
    travelTime: number;           // Min til nærmeste range
    budget: 'low' | 'medium' | 'high';
    weatherDependent: boolean;
  };
}
```

## 1.6 Mål & Motivasjon

```typescript
interface Goals {
  // Kortsiktig (3 måneder)
  shortTerm: {
    targetHandicap: number;
    specificTests: Array<{ testId: string; targetScore: number }>;
    tournamentGoals?: string[];
  };
  
  // Langsiktig (12 måneder)
  longTerm: {
    targetCategory: string;
    targetHandicap: number;
    dreamGoal: string;  // "Kvalifisere til NM", "Spille under 80", etc.
  };
  
  // Motivasjon
  motivation: {
    primaryDriver: 'competition' | 'social' | 'improvement' | 'fitness' | 'fun';
    painPoints: string[];       // Hva frustrerer spilleren?
    wins: string[];             // Hva motiverer/mestrer spilleren?
  };
}
```

---

# 🧠 DEL 2: AI COACH ALGORITMEN

## 2.1 The Coaching Decision Tree

```
START: Ny spiller registrerer seg
    │
    ▼
┌─────────────────────────────┐
│ 1. ASSESS: Hvor er spilleren?│
│    - Kategori A-K            │
│    - Styrker vs svakheter    │
│    - Tour Score per område   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 2. GAP ANALYSIS:             │
│    - Hva skal til neste nivå?│
│    - Hva er størst gap?      │
│    - Hva gir raskest resultat?│
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 3. TIME ALLOCATION:          │
│    Hvor mye tid har spilleren?
│    - 2t/uke → Fokus på 1 område
│    - 5t/uke → 2 primær + 1 vedlikehold
│    - 10t/uke → Komplett program
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 4. GENERATE PLAN:            │
│    - Øvelser fra banken      │
│    - Test-innbygging         │
│    - DECADE-strategi         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 5. ADAPT: Løpende justering  │
│    - Resultater fra tester   │
│    - Runde-data              │
│    - Tilbakemeldinger        │
└─────────────────────────────┘
```

## 2.2 Time Allocation Algorithm

```typescript
function calculateTimeAllocation(
  player: PlayerData,
  availableHours: number
): TimeAllocation {
  
  // STEG 1: Identifiser gap
  const gaps = [
    { category: 'approach', gap: player.targetSG.approach - player.currentSG.approach },
    { category: 'offTheTee', gap: player.targetSG.offTheTee - player.currentSG.offTheTee },
    { category: 'aroundGreen', gap: player.targetSG.aroundGreen - player.currentSG.aroundGreen },
    { category: 'putting', gap: player.targetSG.putting - player.currentSG.putting },
  ].sort((a, b) => b.gap - a.gap);  // Størst gap først
  
  // STEG 2: Trenbarhets-faktor (hva gir raskest resultat?)
  const trainability = {
    approach: 0.8,      // Høy - teknikk + repetisjon
    aroundGreen: 0.7,   // Medium-høy - touch + erfaring
    putting: 0.5,       // Medium - teknikk + mental
    offTheTee: 0.4,    // Lav - fysisk + teknikk tar tid
  };
  
  // STEG 3: Frekvens (hvor ofte brukes dette i runden?)
  const frequency = {
    approach: 0.40,     // 40% av slag
    offTheTee: 0.25,    // 25% (13-14 slag)
    aroundGreen: 0.20,  // 20%
    putting: 0.15,      // 15%
  };
  
  // STEG 4: Beregn prioritetspoeng
  const priorities = gaps.map(g => ({
    category: g.category,
    score: g.gap * trainability[g.category] * frequency[g.category],
  })).sort((a, b) => b.score - a.score);
  
  // STEG 5: Alloker tid basert på tilgjengelige timer
  if (availableHours <= 2) {
    // MINIMAL: Kun største gap
    return {
      primary: priorities[0].category,
      time: { [priorities[0].category]: 70, other: 30 },
      frequency: '2x per uke',
      sessionLength: 60,
    };
  } else if (availableHours <= 5) {
    // MODERATE: Primær + sekundær + vedlikehold
    return {
      primary: priorities[0].category,
      secondary: priorities[1].category,
      time: {
        [priorities[0].category]: 50,
        [priorities[1].category]: 30,
        maintenance: 20,  // Styrke + putting
      },
      frequency: '3-4x per uke',
      sessionLength: 75,
    };
  } else {
    // COMPREHENSIVE: Full dekning
    return {
      primary: priorities[0].category,
      secondary: priorities[1].category,
      tertiary: priorities[2].category,
      time: {
        [priorities[0].category]: 40,
        [priorities[1].category]: 25,
        [priorities[2].category]: 20,
        maintenance: 15,
      },
      frequency: '4-5x per uke',
      sessionLength: 90,
    };
  }
}
```

## 2.3 The "If-Then" Coaching Rules

### Hvis spilleren er nybegynner (K-J):
```
IF category IN ['K', 'J', 'I'] THEN:
  - Fokus: Kontakt + retning (ikke avstand)
  - 70% teknikk (TEK-pyramidenivå)
  - 30% putting (bygger selvtillit)
  - Ingen bane før grunnleggende teknikk sitter
  - Maks 60 min økter (konsentrasjon)
  - L1-L2 faser (isolasjon + blokk)
```

### Hvis spilleren slår driver dårlig:
```
IF sg.offTheTee < -0.8 AND dispersion.driver.lateral > 25m THEN:
  - Test: "Kan spilleren treffe fairway med 3-tre?"
  - IF ja: Strategi = 3-tre på trange hull
  - IF nei: Teknisk trening + fitness
  - Øvelse: "Fairway Finder" - 20 slag med fokus på kontakt
```

### Hvis spilleren har god approach men dårlig scrambling:
```
IF sg.approach > -0.5 AND sg.aroundGreen < -0.5 THEN:
  - Ikke mer approach-trening!
  - Fokus: Chip + pitch fra dårlige ligger
  - DECADE: "Legg opp til wedge-inn, aksepter at du ikke alltid treffer green"
  - Øvelse: "Scramble Master" - 10 situasjoner, mål: 40% conversion
```

---

# 🎯 DEL 3: INTEGRASJON MED DECADE

## 3.1 "Hvordan Spille Golf" - Komplett Guide

Basert på tester + spredning + trening:

### Pre-Round (Dagen før):
```
AI COACH sier:

"Mikael, i morgen spiller du Oslo GK. Basert på dine data:

DIN SPREDNINGS-PROFIL:
• Driver: 195m carry, 22m lateral spredning (95%)
• 7-jern: 135m carry, 12m lateral spredning
• Pitching wedge: 95m carry, 8m lateral spredning

DIN STRATEGI FOR OSLO GK:

Hull 3 (Par 4, 380m) - UTDFORDRENDE FOR DEG
├─ Fairway: 22m bred
├─ Din driver-spredning: 22m
├─ Treff-sannsynlighet med driver: 50%
├─ ANBEFALING: Bruk 3-tre (205m, 16m spredning)
├─ Treff-sannsynlighet med 3-tre: 78%
└─ Eksperted score: 4.2 vs 4.8 med driver

Hull 7 (Par 3, 165m)
├─ Din 6-jern: 140m (25m kort)
├─ ANBEFALING: 5-jern + chip
├─ Ikke prøv å nå green i ett slag!
└─ Eksperted: 4.1 (par er godt)

DIN PRE-SHOT RUTINE (Kategori F):
1. SE - Velg sikkert mål (ikke flagg, sikte innenfor)
2. FØL - Gjennomfør svingen du har øvd på
3. SLÅ - Stol på repetisjonen

HUSK: Du trener på approach denne uken. 
På hull 12-15 (approach-hull), FOKUSER på rutinen."
```

### Under Runden (Real-time coaching):
```
Hull 7 | Par 3 | 165m
━━━━━━━━━━━━━━━━━━━━━━

DECADE-ANALYSE:
• Avstand: 165m til pin
• Din 6-jern carry: 140m (25m kort!)
• Din 5-jern carry: 155m (10m kort)
• Green depth: 25m (front til back)

⚠️  ANBEFALING: 5-jern til FRONT av green

Hvorfor?
• 6-jern = 100% sjanse for kort (bunker)
• 5-jern = 60% sjanse for green, 40% kort
• "Short is better than in the hazard"

AI AIMPOINT: Sikt på FRONT-venstre del av green

[Stol på analysen] [Ignorer (loggføres)]
```

### Post-Round (Evaluering):
```
Runde-oppsummering: Oslo GK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Resultat: 87 (+15)
DECADE Score: +2.3 (Spilte 2.3 slag dårligere enn forventet)

HVA GIKK BRA:
✅ Strategy adherence: 75% (fulgte coach på 12 av 18 hull)
✅ Hull 3, 12, 15: Perfekt klubbvalg, scoret -1 vs par

HVA GIKK GALT:
❌ Hull 7: Ignorerte coach, brukte 6-jern → i bunker → dobbel
❌ Hull 9: Hero-shot fra rough → i vann → triple

LEARNING:
• Når du følger strategien: -0.5 slag/hull
• Når du ignorerer: +1.2 slag/hull

NESTE GANG:
• Stol på 5-jern på lange par 3
• Fra rough: alltid wedge ut, aldri "hero shot"
```

## 3.2 Sprednings-Basert Strategi

```typescript
function generateStrategy(
  hole: HoleLayout,
  playerDispersion: ClubDispersion[],
  playerCategory: string
): Strategy {
  
  // 1. Beregn treff-sannsynlighet per klubb
  const options = playerDispersion.map(club => {
    const hitProb = calculateHitProbability(
      club,
      hole.fairwayWidth,
      hole.hazards
    );
    return { club, hitProb };
  });
  
  // 2. Velg klubb med høyest EV (Expected Value)
  const bestOption = options
    .filter(o => o.hitProb > 0.6)  // Minst 60% treff
    .sort((a, b) => b.hitProb - a.hitProb)[0];
  
  // 3. Lag "what-if" scenarier
  const scenarios = {
    aggressive: {
      club: 'Driver',
      expectedScore: 4.8,
      risk: 'high',
      whenToUse: 'Need birdie, wide fairway',
    },
    standard: {
      club: bestOption?.club || '3-wood',
      expectedScore: 4.2,
      risk: 'medium',
      whenToUse: 'Normal situation',
    },
    conservative: {
      club: '5-wood/Iron',
      expectedScore: 4.4,
      risk: 'low',
      whenToUse: 'Narrow fairway, OB in play',
    },
  };
  
  return {
    recommended: scenarios.standard,
    alternatives: [scenarios.conservative, scenarios.aggressive],
    reasoning: `Din ${bestOption?.club}-spredning gir 78% treff-sjanse`,
  };
}
```

---

# 📝 DEL 4: ØVELSESBANK-GENERATOR

## 4.1 Automatisk Øvelsesgenerering

Når coach identifiserer et gap:

```typescript
interface DrillGenerationRequest {
  // Fra gap-analyse
  targetCategory: SGCategory;
  currentLevel: number;      // Spillerens nåværende SG
  targetLevel: number;       // Mål-SG
  
  // Fra spillerprofil
  playerCategory: string;    // A-K
  availableTime: number;     // Minutter per økt
  facilities: string[];      // Hva har spilleren tilgang til?
  
  // Fra historikk
  previousDrills: string[];  // Hva har spilleren gjort før?
  successRate: number;       // Hva fungerte?
}

// AI genererer øvelse:
async function generateCustomDrill(request: DrillGenerationRequest): Promise<Drill> {
  
  // EKSEMPEL: Spiller er kategori F, dårlig approach fra 100m
  
  return {
    name: "100m Precision Challenge (F-nivå)",
    description: "10 slag mot 100m target. Fokus på konsistens, ikke power.",
    
    // Tilpasset nivå
    difficulty: {
      targetSize: '20ft circle',     // F-nivå: Stor target
      successCriteria: '6 av 10 innenfor target',  // Oppnåelig
      progression: 'Når 8/10: Reduser til 15ft',
    },
    
    // Tilpasset tid
    duration: request.availableTime < 60 ? 20 : 30,
    
    // DECADE-integrert
    decadeFocus: 'Choose conservative target, accept center of green',
    
    // Pyramiden
    pyramid: 'SLAG',  // Ikke TEK (for avansert), ikke SPILL (for tidlig)
    lPhase: 'L3',     // Variabel trening (ulike avstander)
    
    // Utstyr
    equipment: ['7-iron', '8-iron', '9-iron', 'Target (20ft)'],
    
    // Instruksjoner
    steps: [
      "1. Velg klubb som CARRIER 95m (ikke total 100m!)",
      "2. Sikt på SENTER av target (ikke flagg)",
      "3. Fokuser på RYTMISK sving, ikke hardt",
      "4. Noter resultat etter hvert slag",
      "5. Etter 5 slag: Juster hvis alle er korte/lange",
    ],
    
    // Mål
    goal: "8 av 10 slag innenfor 20ft = 80% Tour Score",
    
    // Kobling til test
    linkedTest: '100m-approach-challenge',
    
    // Adaptiv
    adaptation: {
      ifSuccess: 'Reduser target til 15ft',
      ifFailure: 'Øk til 125m (lettere), eller bruk større target',
    },
  };
}
```

## 4.2 Øvelsesbank-Struktur

```
Øvelsesbank/
├── FYS/
│   ├── Mobilitet/
│   │   ├── Hofte-rotasjon (K-J)
│   │   ├── Skulder-rotasjon (I-H)
│   │   └── Full-body warmup (G-A)
│   ├── Styrke/
│   │   ├── Core-stabilitet (alle)
│   │   └── Ben-kraft (D-A)
│   └── Power/
│       ├── Rotasjonssnapp (C-A)
│       └── Sprint-øvelser (B-A)
│
├── TEK/
│   ├── Setup/
│   │   ├── Grip-fundament (K-I)
│   │   ├── Stilling-check (H-F)
│   │   └── Pre-shot rutine (E-A)
│   ├── Sving-mekanikk/
│   │   ├── Takeaway (K-H)
│   │   ├── Backswing (G-E)
│   │   ├── Transition (D-B)
│   │   └── Impact (C-A)
│   └── Kontaktpunkt/
│       ├── Brush the tee (K-H)
│       ├── Sweet spot finder (G-A)
│       └── Compression drill (D-A)
│
├── SLAG/
│   ├── Driving/
│   │   ├── Fairway finder (K-G)
│   │   ├── Distance control (F-D)
│   │   └── Shot shaping (C-A)
│   ├── Approach/
│   │   ├── 50m touch (K-I)
│   │   ├── 100m precision (H-F)
│   │   ├── 150m control (E-C)
│   │   └── 200+ strategy (B-A)
│   ├── Short Game/
│   │   ├── Chipping basics (K-H)
│   │   ├── Pitching distance (G-E)
│   │   ├── Bunker technique (F-C)
│   │   └── Lob shot (D-A)
│   └── Putting/
│       ├── 3ft confidence (K-J)
│       ├── 6ft repetition (I-G)
│       ├── 10ft read (F-D)
│       └── Lag putting (C-A)
│
├── SPILL/
│   ├── Course Management/
│   │   ├── DECADE basics (G-E)
│   │   ├── Risk/reward (D-B)
│   │   └── Pressure shots (C-A)
│   ├── Pre-shot/
│   │   ├── Visualisering (F-D)
│   │   └── Commitment (C-A)
│   └── Recovery/
│       ├── Safe out (H-E)
│       ├── Creative shots (D-A)
│       └── Mental reset (alle)
│
└── TURN/
    ├── Pre-round/
    │   ├── Warmup rutine (E-A)
    │   └── Game plan (C-A)
    ├── Under runden/
    │   ├── Between shots (D-A)
    │   ├── After bad shot (C-A)
    │   └── Closing holes (B-A)
    └── Post-round/
        └── Evaluering (alle)
```

---

# 📱 DEL 5: COACH-INTERAKSJON

## 5.1 Daglig Coaching (Push-varslinger)

### Morgen:
```
"God morgen Mikael! 🌅

I dag er det ONSDAG = Range-dag (60 min)
Fokus: Approach 100m

Din plan:
• Oppvarming: 10 slag wedge
• Hovedøkt: 30 slag mot 100m target
• Test: 100m Challenge (registrer i appen)
• Nedtrapping: 10 putter

Husk: Sikt på SENTER av target, ikke flagg! 🎯

[Start økt] [Utsett] [Jeg har allerede trent]
```

### Etter økt:
```
Hvordan gikk treningen? ⭐

[😍 Perfekt] [🙂 Bra] [😐 Middels] [😞 Dårlig]

Hva fungerte best?
[Avstandskontroll] [Svingfølelse] [Kontakt] [Ingenting]

Hva skal vi jobbe med neste gang?
[Skriv notat...]
```

### Kveld (etter runde):
```
Runde-oppsummering klar! 📊

Oslo GK: 87 (+15)
Tour Score: 64%

Høydepunkt: Hull 12 - fulgte strategien, scoret par! ✅
Læring: Hull 7 - ignorerte coach, dobbel ❌

Konklusjon: Når du stoler på data, spiller du 2.3 slag bedre.

[Se full analyse] [Del resultat] [Planlegg neste runde]
```

## 5.2 Ukentlig Review (Søndag kveld)

```
UKE 12 - OPPSUMMERING
━━━━━━━━━━━━━━━━━━━━━━

TRENING:
✅ 4 av 4 planlagte økter gjennomført
⭐ Gj.sn. kvalitet: 8.2/10
⏱️  Totalt: 4.5 timer

TESTER:
📈 100m Challenge: 68% → 71% Tour Score (+3%)
📉 Putt Ladder: 55% → 52% (Litt tilbake)

RUNDER:
🏌️ 1 runde: Oslo GK, 87 (+15)
🎯 SG Approach: -0.8 → -0.7 (litt bedre!)

COACHENS VURDERING:
"God uke! Approach-treningen gir resultater.
Putting-treningen ble prioritert ned - 
husk at 15% av tid skal være putting.

Nest uke: 
• Fortsett approach (mål: 73%)
• Øk putting til 20% av tiden
• Spill 9 hull med fokus på DECADE"

[Se neste ukes plan] [Juster plan] [Gi tilbakemelding]
```

---

# 🎯 DEL 6: PERSONLIGGJØRING

## 6.1 Coach "Personlighet"

Spilleren velger coach-stil:

### 🎖️ "Sergeant" (Hard)
```
"Mikael! Du har hoppet over 2 økter denne uken.
Unnskyldninger hjelper ikke - RESULTATER hjelper.

Din kategori F-kamerat Anders trente 5 timer.
Resultat? Han gikk fra 17 til 15 HCP.

Hva velger DU? 🎯"
```

### 🧘 "Zen Master" (Balansert)
```
"Mikael, jeg ser at livet har vært hektisk denne uken.
Det er OK - golf skal være gøy, ikke stress.

La oss justere planen:
I stedet for 4 økter, gjør vi 2 korte, intense økter.

Kvalitet > Kvantitet. 🧘‍♂️"
```

### 🎉 "Cheerleader" (Støttende)
```
"Mikael!!! 🎉

Gjett hva? Din 100m-test viser 71% Tour Score!
DET er fantastisk! For 4 uker siden var du på 68%!

Du er på VEIEN mot kategori E!
Fortsett med den samme fantastiske innsatsen! 🌟"
```

## 6.2 Læringsadapsjon

```typescript
// Coach lærer hva som motiverer spilleren
interface LearningModel {
  // Hva fungerer?
  successfulInterventions: Array<{
    type: string;
    context: string;
    result: 'positive' | 'neutral' | 'negative';
  }>;
  
  // Hva motiverer?
  motivationTriggers: {
    competition: boolean;    // Lederboards, sammenligning
    social: boolean;         // Deling, venner
    achievement: boolean;    // Badges, milestones
    data: boolean;          // Grafer, statistikk
  };
  
  // Hva er best timing?
  optimalTiming: {
    morning: number;         // 0-1 respons-rate
    afternoon: number;
    evening: number;
  };
}

// Justér coaching basert på læring
function adaptCoachingStyle(
  player: PlayerData,
  learning: LearningModel
): CoachingStyle {
  
  if (learning.motivationTriggers.competition) {
    return {
      tone: 'competitive',
      useLeaderboards: true,
      emphasizeRankings: true,
      challenges: 'Beat your rival Anders!',
    };
  }
  
  if (learning.motivationTriggers.achievement) {
    return {
      tone: 'celebratory',
      useBadges: true,
      emphasizeMilestones: true,
      challenges: 'Unlock the "100m Master" badge!',
    };
  }
  
  // Default
  return {
    tone: 'supportive',
    useData: true,
    emphasizeProgress: true,
    challenges: 'Your approach SG improved 0.1!',
  };
}
```

---

# 📊 DEL 7: SUKSESSMETRIKKER

## 7.1 Coach-effektivitet

Måles på:

| Metrikk | Mål | Måling |
|---------|-----|--------|
| **Adherence** | 80% | % av planlagte økter gjennomført |
| **Improvement** | +0.3 SG/3mnd | Faktisk SG-forbedring |
| **Satisfaction** | 4.5/5 | Spiller-tilbakemelding |
| **Retention** | 90% | % som fortsetter etter 6 mnd |
| **Goal Achievement** | 70% | % som når mål innen 12 mnd |

## 7.2 AI-læring

```typescript
// Coach forbedrer seg basert på data
function improveCoachAI(
  allPlayers: PlayerData[],
  outcomes: TrainingOutcome[]
): ModelUpdate {
  
  // Identifiser mønstre i vellykket trening
  const successPatterns = analyzeSuccess(outcomes);
  
  // Oppdater:
  return {
    // Bedre time-allocation
    timeAllocationWeights: optimizeWeights(successPatterns),
    
    // Bedre drill-anbefalinger
    drillEffectiveness: rankDrillsByOutcome(outcomes),
    
    // Bedre DECADE-strategier
    strategySuccess: analyzeStrategyAdherence(outcomes),
    
    // Personliggjøring
    motivationModels: trainMotivationPredictor(allPlayers),
  };
}
```

---

# 🚀 IMPLEMENTASJON

## MVP 1: Coach-grunnlag (Uke 1-4)
- [ ] Spillerprofil-skjema
- [ ] Gap-analyse algoritme
- [ ] Time-allocation engine
- [ ] Enkel tekst-basert coach (push-varsler)

## MVP 2: Interaktiv coach (Uke 5-8)
- [ ] Chat-grensesnitt
- [ ] Øvelsesbank (50 øvelser)
- [ ] DECADE-integrasjon
- [ ] Daglig/ukentlig review

## MVP 3: AI Coach 2.0 (Uke 9-12)
- [ ] AI-genererte øvelser
- [ ] Adaptiv læring
- [ ] Personlig coach-stil
- [ ] Prediktiv coaching ("jeg ser du kommer til å...")

---

**Denne coachen blir verdens beste fordi:**
1. Den **kjenner spilleren** bedre enn menneskelige coacher (har ALL data)
2. Den er **tilgjengelig 24/7** (ikke bare på treningstid)
3. Den er **100% objektiv** (ingen bias, ren data)
4. Den **tilpasser seg** (lærer hva som fungerer)
5. Den **integrerer ALT** (treningsplan + DECADE + tester + runder)

**Resultat:** Spillere forbedrer seg 2-3x raskere enn uten coach.
