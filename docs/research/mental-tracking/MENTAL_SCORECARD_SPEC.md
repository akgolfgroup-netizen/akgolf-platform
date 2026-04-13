# Mental Scorecard & Tracking
## Psykologisk Sporings-System for Golf

**Mappe:** `/docs/research/mental-tracking/`  
**Basert på:** Akademiets M0-M5 skala + DECADE 8-second rule  
**Status:** Spesifikasjon

---

## INNHOLDSFORTEGNELSE

1. [Mental Scorecard Design](#1-mental-scorecard-design)
2. [Pre-Shot Rutiner](#2-pre-shot-rutiner)
3. [Post-Shot Evaluering](#3-post-shot-evaluering)
4. [Press-Nivå Tracking](#4-press-nivå-tracking)
5. [Mental Trender](#5-mental-trender)
6. [Data-Modell](#6-data-modell)
7. [UI Implementasjon](#7-ui-implementasjon)

---

## 1. MENTAL SCORECARD DESIGN

### 1.1 Når er Mental Scorecard Påkrevd?

```typescript
const MENTAL_SCORECARD_RULES = {
  // Trening: Valgfritt
  training: {
    required: false,
    default: false,
    canEnable: true,
  },
  
  // Innspill-runde: Valgfritt, men anbefalt
  prepRound: {
    required: false,
    default: true,
    canDisable: true,
  },
  
  // Konkurranse: Påkrevd
  competition: {
    required: true,
    cannotSkip: true,
    detailLevel: 'FULL',
  },
  
  // Turnering: Påkrevd + ekstra felt
  tournament: {
    required: true,
    detailLevel: 'FULL',
    extraFields: ['TOURNAMENT_PRESSURE', 'CROWD_IMPACT'],
  },
};
```

### 1.2 Per-Slag Mental Tracking

```typescript
interface MentalScorecardEntry {
  // Identifikasjon
  roundId: string;
  hole: number;
  shotNumber: number;
  timestamp: Date;
  
  // FØR SLAGET (Pre-shot)
  preShot: {
    // 1. Forberedelse
    plannedShot: string;           // Hva skal du gjøre?
    targetDescription: string;     // Beskriv målet
    
    // 2. Fokus (1-10)
    focusLevel: 1-10;
    focusQuality: 'SHARP' | 'MODERATE' | 'WANDERING';
    
    // 3. Selvtillit (1-10)
    confidence: 1-10;
    
    // 4. Press (PR1-PR5)
    pressureLevel: 1-5;
    pressureSource: PressureSource[];
    
    // 5. 8-Second Rule
    routineCompleted: boolean;
    routineDuration: number;       // Sekunder
    
    // 6. Visualisering
    visualizationQuality: 1-10;
    sawShotClearly: boolean;
  };
  
  // ETTER SLAGET (Post-shot)
  postShot: {
    // 1. Resultat
    outcome: 'INTENDED' | 'ACCEPTABLE' | 'POOR';
    
    // 2. Prosessevaluering
    processScore: 1-10;            // Fulgte du rutinen?
    
    // 3. Emosjonell respons
    emotion: EmotionType;
    emotionIntensity: 1-10;
    
    // 4. Commitment
    committedToShot: boolean;
    lastMinuteDoubt: boolean;
    
    // 5. Accept
    acceptedResult: boolean;
    dwelling: boolean;             // Grubler du fortsatt?
  };
  
  // Kontekst
  context: {
    situation: ShotSituation;
    scoreAtMoment: number;
    position: 'TIED' | 'LEADING' | 'TRAILING' | 'NA';
  };
}

type PressureSource = 
  | 'SCORE_IMPORTANT'
  | 'OPPONENT_PRESSURE'
  | 'PERSONAL_GOAL'
  | 'CROWD_WATCHING'
  | 'DIFFICULT_SHOT'
  | 'RECOVERY_NEEDED';

type EmotionType = 
  | 'SATISFIED'
  | 'FRUSTRATED'
  | 'ANGRY'
  | 'DISAPPOINTED'
  | 'NEUTRAL'
  | 'RELIVED'
  | 'EXCITED';
```

---

## 2. PRE-SHOT RUTINER

### 2.1 8-Second Rule (DECADE)

```
SCOTT FAWCETT'S 8-SECOND RULE:

"Hvis du ikke kan visualisere skuddet klart innen 8 sekunder,
så har du ikke en klar plan. Gå tilbake og start på nytt."

IMPLEMENTASJON I APP:
┌─────────────────────────────────────────────────────────────────┐
│  PRE-SHOT RUTINE - HULL 7, SLÅG 2                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⏱️ [ 00:08 ] [START TIMER]                                     │
│                                                                  │
│  STEG 1: Vurder situasjonen                                      │
│  [✓] Avstand: 145m                                              │
│  [✓] Forhold: Lett vind fra venstre                             │
│  [✓] Liggende: Good lie                                         │
│                                                                  │
│  STEG 2: Velg kølle og siktepunkt                               │
│  Kølle: [ 8-jern ▼ ]                                            │
│  Sikte: [ Midt green (ikke flagg) ▼ ]                          │
│                                                                  │
│  STEG 3: Visualiser skuddet                                      │
│  [START 8-SEK TIMER]                                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  👁️ VISUALISERING (8 sek)                              │   │
│  │                                                         │   │
│  │  "Jeg ser ballen...                                     │   │
│  │   ...treffe midt green...                               │   │
│  │   ...rulle ut mot høyre...                              │   │
│  │   ...stoppe 5m fra hullet."                             │   │
│  │                                                         │   │
│  │  [⏹️ STOPP - Jeg så det klart!]                        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  STEG 4: Commit og utfør                                        │
│  [✓] Jeg er committed til dette skuddet                        │
│  [✓] Ingen siste-sekund tvil                                    │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  SELVEVALUERING:                                                 │
│  Fokus:      [████████░░] 8/10                                  │
│  Selvtillit: [██████████] 9/10                                  │
│  Press:      [PR3 - Moderat]                                    │
│                                                                  │
│  [FORTSETT TIL SLÅG]                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Rutine-Sjekkliste per Spiller-Kategori

```typescript
const PRE_SHOT_ROUTINES = {
  // Kategori A (Elite)
  categoryA: {
    steps: [
      'Beregne avstand og forhold',
      'Velge kølle basert på DECADE-strategi',
      'Velge siktepunkt (buffer-regel)',
      'Visualisere ball-flight (8 sek)',
      'En trigger/practice swing',
      'Commit og slå'
    ],
    maxTime: 45,  // sekunder
    mentalFocus: 'Høy - full tilstedeværelse',
  },
  
  // Kategori C (Middels)
  categoryC: {
    steps: [
      'Beregne avstand',
      'Velge kølle',
      'Velge siktepunkt',
      'En trigger/practice swing',
      'Slå'
    ],
    maxTime: 30,
    mentalFocus: 'Moderat - unngå distraksjoner',
  },
  
  // Kategori K (Ny)
  categoryK: {
    steps: [
      'Beregne avstand (bruke app)',
      'Velge kølle (app-anbefaling)',
      'Slå'
    ],
    maxTime: 20,
    mentalFocus: 'Grunnleggende - konsistens',
  },
};
```

---

## 3. POST-SHOT EVALUERING

### 3.1 Spørsmål etter hvert slag

```typescript
interface PostShotQuestions {
  // 1. Resultat
  result: {
    question: "Hvordan var resultatet?";
    options: [
      { value: 'EXCELLENT', label: 'Perfekt - akkurat som planlagt', score: 10 },
      { value: 'GOOD', label: 'Bra - innenfor akseptabelt område', score: 8 },
      { value: 'ACCEPTABLE', label: 'OK - ikke ideelt men spillbart', score: 6 },
      { value: 'POOR', label: 'Dårlig - unngåelig feil', score: 3 },
      { value: 'DISASTER', label: 'Katastrofe - dobbel-bogey fare', score: 1 },
    ];
  };
  
  // 2. Prosessevaluering
  process: {
    question: "Fulgte du rutinen?";
    subQuestions: [
      "Hadde du klar plan før slaget?",
      "Fullførte du pre-shot rutinen?",
      "Var du committed da du slo?",
      "Hadde du siste-sekund tvil?",
    ];
    score: 1-10;
  };
  
  // 3. Emosjonell respons
  emotion: {
    question: "Hvordan føler du deg nå?";
    options: [
      { value: 'SATISFIED', label: 'Fornøyd', positive: true },
      { value: 'NEUTRAL', label: 'Nøytral', positive: true },
      { value: 'SLIGHTLY_DISAPPOINTED', label: 'Litt skuffet', positive: false },
      { value: 'FRUSTRATED', label: 'Frustrert', positive: false },
      { value: 'ANGRY', label: 'Sinna', positive: false },
    ];
    intensity: 1-10;
  };
  
  // 4. Accept
  acceptance: {
    question: "Har du akseptert resultatet?";
    followUp: "Hvis nei, hva grubler du fortsatt på?";
    score: 1-10;
  };
}
```

### 3.2 Quick-Entry Modus (Konkurranse)

```
HURTIG MENTAL SCORECARD - HULL 7, SLÅG 2

Resultat: [🟢] [🟡] [🔴] 
           Perfekt  OK  Dårlig

Prosess:  [✓✓✓✓✓✓✓✓░░] 8/10

Følelse:  [😊] [😐] [😤] [😡]
          Bra   OK   Irr  Sinna

Akseptert? [✓ Ja] [✗ Nei]

[NESTE HULL]
```

---

## 4. PRESS-NIVÅ TRACKING

### 4.1 PR1-PR5 Skala (Integrert med AK-Formula)

```typescript
const PRESSURE_LEVELS = {
  PR1: {
    level: 1,
    name: "Ingen press",
    description: "Fri trening, ingen konsekvenser",
    indicators: [
      "Ingen eksterne forventninger",
      "Kan eksperimentere fritt",
      "Fokus på teknikk, ikke resultat"
    ],
    strategy: "Bruk til å trene nye ting",
  },
  
  PR2: {
    level: 2,
    name: "Lavt press",
    description: "Personlige mål, selv-evaluering",
    indicators: [
      "Du vil prestere bra for deg selv",
      "Litt nervøsitet er OK",
      "Fokus på progresjon"
    ],
    strategy: "Sett prosess-mål, ikke resultat-mål",
  },
  
  PR3: {
    level: 3,
    name: "Moderat press",
    description: "Konkurranse mot seg selv, tidsbegrensning",
    indicators: [
      "Du vil slå personlig rekord",
      "Tidsfrister (f.eks. runde på 4 timer)",
      "Økt fokus på rutiner"
    ],
    strategy: "Stol på rutinene dine",
  },
  
  PR4: {
    level: 4,
    name: "Høyt press",
    description: "Konkurranse mot andre, tilskuere",
    indicators: [
      "Ønske om å vinne",
      "Andre ser på",
      "Resultat påvirker rangering"
    ],
    strategy: "Pust, fokus på én sakte inn-og-ut-pust",
  },
  
  PR5: {
    level: 5,
    name: "Maks press",
    description: "Turneringssituasjon, viktig resultat",
    indicators: [
      "Viktig turnering",
      "Siste runder teller ekstra",
      "Kroppen er anspent",
      "Tanker vandrer"
    ],
    strategy: "Bruk pusteteknikk, senk skuldrene, 
               fokus på prosess ikke resultat",
  },
};
```

### 4.2 Press-Tracking Dashboard

```
╔══════════════════════════════════════════════════════════════════╗
║  PRESS-ANALYSE - SISTE 10 RUNDER                                ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  DIN PRESS-PROFIL:                                               ║
║                                                                  ║
║  PR1 (Ingen)   [████░░░░░░] 20%  → Fokus: Teknikk              ║
║  PR2 (Lavt)    [██████░░░░] 30%  → Fokus: Selv-evaluering      ║
║  PR3 (Mod)     [████████░░] 40%  → Fokus: Rutiner              ║
║  PR4 (Høyt)    [██░░░░░░░░] 10%  → ⚠️ Lite trening her         ║
║  PR5 (Maks)    [░░░░░░░░░░]  0%  → ⚠️ INGEN DATA!              ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  PRESTASJON UNDER PRESS:                                         ║
║                                                                  ║
║  PR1-PR2 (Lavt):                                                 ║
║  • GIR:       65%  [████████████████████░░░░]                   ║
║  • Fairway:   58%  [████████████████░░░░░░░░]                   ║
║  • Putts:     32   [████████████████████████]                   ║
║                                                                  ║
║  PR4-PR5 (Høyt):                                                 ║
║  • GIR:       42%  [████████████░░░░░░░░░░░░] ⚠️ -23%           ║
║  • Fairway:   38%  [██████████░░░░░░░░░░░░░░] ⚠️ -20%           ║
║  • Putts:     36   [██████████████████████░░] ⚠️ +4             ║
║                                                                  ║
║  🔍 INNSIKT:                                                     ║
║  "Du presterer 23% dårligere på approach under høyt press.     ║
║   Anbefalt trening: Hindertrening med M4/M5 press-nivå."        ║
║                                                                  ║
║  [SE TRENINGSPROGRAM]                                            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 5. MENTAL TRENDER

### 5.1 Mental Trend-Analyse

```typescript
interface MentalTrends {
  // Over tid
  timeRange: 'LAST_10_ROUNDS' | 'LAST_MONTH' | 'LAST_SEASON' | 'ALL_TIME';
  
  // Nøkkel-metrikker
  metrics: {
    // Focus consistency
    averageFocus: number;          // 1-10
    focusTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    
    // Commitment
    commitmentRate: number;        // % av slag med full commitment
    lastMinuteDoubtRate: number;   // % med tvil
    
    // Emotional control
    positiveEmotionRate: number;   // % positive følelser
    frustrationRecovery: number;   // Hvor raskt kommer du tilbake etter dårlig slag?
    
    // Acceptance
    acceptanceRate: number;        // % slag akseptert umiddelbart
    dwellingRate: number;          // % hvor du grubla >2 hull
  };
  
  // Korrelasjoner
  correlations: {
    focusVsScore: number;          // Korrelasjon fokus -> score
    confidenceVsGIR: number;       // Korrelasjon selvtillit -> GIR
    pressureVsPerformance: Map<PressureLevel, PerformanceImpact>;
  };
  
  // Treningseffekt
  trainingImpact: {
    mentalTrainingSessions: number;
    improvementSinceStart: number;  // % forbedring
  };
}
```

### 5.2 Trend-Visualisering

```
╔══════════════════════════════════════════════════════════════════╗
║  MENTALE TRENDER - SISTE 3 MÅNEDER                              ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  FOKUS-KONSISTENS (Gjennomsnitt per runde):                     ║
║                                                                  ║
║  10 │                                        ●──●               ║
║   9 │                              ●──●                         ║
║   8 │                    ●──●                                   ║
║   7 │          ●──●                                             ║
║   6 │    ●──●                                                   ║
║   5 │──●                                                        ║
║     └────┬────┬────┬────┬────┬────┬────┬────┬                  ║
║         Jan  Uke2  Uke3  Uke4  Feb  Uke2  Uke3  Mar             ║
║                                                                  ║
║  Trend: ⬆️ +40% forbedring!                                      ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  EMOSJONELL KONTROLL:                                            ║
║                                                                  ║
║  Positiv respons etter dårlig slag:                              ║
║  Jan: [████████░░░░░░░░] 40%                                    ║
║  Feb: [████████████░░░░] 60%                                    ║
║  Mar: [████████████████] 80%  ✅                                ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  ACCEPT-RATE (Hvor raskt aksepterer du resultater?):            ║
║                                                                  ║
║  Øyeblikkelig:    [████████████████████░░] 80%                  ║
║  Etter 1 hull:    [██████░░░░░░░░░░░░░░░░] 15%                  ║
║  Etter 2+ hull:   [██░░░░░░░░░░░░░░░░░░░░]  5%  ⚠️              ║
║                                                                  ║
║  Mål: Redusere "Etter 2+ hull" til 0%                           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 6. DATA-MODELL

### 6.1 Prisma Schema

```prisma
// schema.prisma - Mental Tracking

model MentalScorecard {
  id        String   @id @default(cuid())
  roundId   String
  round     Round    @relation(fields: [roundId], references: [id])
  
  hole      Int
  shotNumber Int
  
  // Pre-shot data
  preShotFocus        Int       // 1-10
  preShotConfidence   Int       // 1-10
  pressureLevel       Int       // 1-5 (PR1-PR5)
  routineCompleted    Boolean
  routineDuration     Float?    // Sekunder
  visualizationQuality Int      // 1-10
  
  // Post-shot data
  outcome             String    // EXCELLENT, GOOD, ACCEPTABLE, POOR, DISASTER
  processScore        Int       // 1-10
  emotion             String    // SATISFIED, FRUSTRATED, etc
  emotionIntensity    Int       // 1-10
  committedToShot     Boolean
  lastMinuteDoubt     Boolean
  acceptedResult      Boolean
  dwelling            Boolean
  
  // Metadata
  timestamp           DateTime
  createdAt           DateTime  @default(now())
  
  @@index([roundId])
  @@index([playerId])
}

model MentalProfile {
  id        String   @id @default(cuid())
  playerId  String   @unique
  player    Player   @relation(fields: [playerId], references: [id])
  
  // Baseline karakteristikk
  baselineConfidence  Int       // Gjennomsnittlig 1-10
  pressureTolerance   Int       // 1-5
  focusBaseline       Int       // 1-10
  
  // Trender (oppdateres etter hver runde)
  focusTrend          Float     // Gjennomsnitt siste 10 runder
  commitmentRate      Float     // % siste 10 runder
  acceptanceRate      Float     // % siste 10 runder
  
  // Press-påvirkning
  pr1Performance      Float     // Score-diff vs baseline
  pr2Performance      Float
  pr3Performance      Float
  pr4Performance      Float
  pr5Performance      Float
  
  updatedAt           DateTime  @updatedAt
}
```

---

## 7. UI IMPLEMENTASJON

### 7.1 Mental Scorecard Komponent

```typescript
// app/(portal)/spill/[roundId]/mental-scorecard.tsx

export function MentalScorecard({ 
  roundId, 
  hole, 
  shot,
  mode // 'QUICK' | 'DETAILED'
}: MentalScorecardProps) {
  
  const { data: entry, mutate } = useMentalEntry(roundId, hole, shot);
  const [step, setStep] = useState<'PRE' | 'POST'>('PRE');
  
  if (mode === 'QUICK') {
    return <QuickMentalEntry entry={entry} onSave={mutate} />;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>🧠 Mental Scorecard</CardTitle>
        <CardDescription>
          Hull {hole}, Slag {shot}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === 'PRE' ? (
          <PreShotForm 
            entry={entry}
            onComplete={() => setStep('POST')}
            onSave={mutate}
          />
        ) : (
          <PostShotForm 
            entry={entry}
            onComplete={() => onComplete()}
            onSave={mutate}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Pre-shot komponent
function PreShotForm({ entry, onSave }) {
  return (
    <div className="space-y-6">
      {/* 8-Second Timer */}
      <EightSecondTimer 
        onComplete={(duration) => onSave({ routineDuration: duration })}
      />
      
      {/* Fokus-slider */}
      <div>
        <Label>Fokus-nivå (1-10)</Label>
        <Slider 
          min={1} 
          max={10} 
          value={entry?.preShotFocus || 5}
          onChange={(v) => onSave({ preShotFocus: v })}
        />
      </div>
      
      {/* Selvtillit */}
      <div>
        <Label>Selvtillit (1-10)</Label>
        <Slider 
          min={1} 
          max={10} 
          value={entry?.preShotConfidence || 5}
          onChange={(v) => onSave({ preShotConfidence: v })}
        />
      </div>
      
      {/* Press-nivå */}
      <div>
        <Label>Press-nivå</Label>
        <PressureSelector 
          value={entry?.pressureLevel || 3}
          onChange={(v) => onSave({ pressureLevel: v })}
        />
      </div>
    </div>
  );
}
```

---

## OPPSUMMERING

### Viktigste Komponenter

1. **Mental Scorecard**: Påkrevd for Konkurranse/Turnering
2. **8-Second Rule**: Visualiseringstimer
3. **PR1-PR5**: Press-tracking integrert med AK-Formula
4. **Pre/Post Shot**: Komplett evaluering
5. **Trend-Analyse**: Korrelasjoner og innsikt

### Datapunkter per Slag

- Fokus (1-10)
- Selvtillit (1-10)
- Press-nivå (1-5)
- Rutine fullført (ja/nei)
- Visualisering (1-10)
- Resultat (5 kategorier)
- Prosess (1-10)
- Følelse (5 kategorier)
- Commitment (ja/nei)
- Accept (ja/nei)
