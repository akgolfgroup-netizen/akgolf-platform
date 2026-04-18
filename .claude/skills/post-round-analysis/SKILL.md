---
name: post-round-analysis
description: |
  Analyserer runde-data med Strokes Gained og gir treningsanbefalinger via AK-metodikken.
  Sammenligner SG per kategori mot A–K-benchmarks, identifiserer svakheter,
  og genererer spesifikke anbefalinger med Tek/Tak/Mental/Fys-fordeling.
argument-hint: |
  Bruk etter fullført runde med SG-data for å analysere prestasjon og gi målrettede treningsanbefalinger.
  Sammenligner med spillerens kategori-benchmark og foreslår rotårsak-basert trening.
allowed-tools: [ReadFile, WriteFile, SearchWeb]
user-invocable: true
---

# Post-Round Analysis

Analyserer runde-data med Strokes Gained (SG) og genererer treningsanbefalinger
basert på AK Golf Academys A–K-benchmarks og Tek/Tak/Mental/Fys-rammeverk.

## Når å bruke

- Umiddelbart etter fullført runde med SG-data
- For å identifisere kategorispesifikke svakheter (OTT/APP/ARG/PUTT)
- For å prioritere treningsfokus basert på benchmark-sammenligning
- For å generere rotårsak-baserte anbefalinger (Tek/Tak/Mental/Fys)
- For å estimere tidsinvestering per forbedringsområde

## Input

```typescript
{
  roundId: string;
  playerId: string;
  playerName: string;
  date: Date;
  course: string;
  score: number;
  par: number;
  handicap?: number;            // Spillerens nåværende HCP
  category?: string;            // A–K (utledes fra HCP eller SG hvis ikke oppgitt)
  stats: {
    totalScore: number;
    sgTotal: number;            // Strokes Gained total
    sgOffTheTee: number;        // SG fra tee (driver/wood)
    sgApproach: number;         // SG approach (jern)
    sgAroundTheGreen: number;   // SG rundt green (chip/pitch/bunker)
    sgPutting: number;          // SG putting
    fairwaysHit: number;
    fairwaysTotal: number;
    gir: number;                // Greens in regulation
    girTotal: number;
    putts: number;
    threePutts?: number;
    upAndDowns?: number;
    penalties?: number;
  };
  previousRounds?: Array<{      // For trend-baseline
    date: Date;
    sgTotal: number;
    sgOffTheTee: number;
    sgApproach: number;
    sgAroundTheGreen: number;
    sgPutting: number;
    score: number;
  }>;
}
```

## Output

```typescript
{
  analysis: {
    overview: string;           // 2–3 setninger med hovedinntrykk
    scoreVsBenchmark: 'better' | 'expected' | 'worse';
    category: string;           // A–K-kategori utledet
    strongestCategory: { name: string; sg: number; vsBenchmark: number };
    weakestCategory: { name: string; sg: number; vsBenchmark: number };
    patterns: string[];         // Identifiserte mønstre
  };
  sgBreakdown: {
    offTheTee: { sg: number; benchmark: number; delta: number; rating: 'strong' | 'average' | 'weak' };
    approach: { sg: number; benchmark: number; delta: number; rating: 'strong' | 'average' | 'weak' };
    aroundTheGreen: { sg: number; benchmark: number; delta: number; rating: 'strong' | 'average' | 'weak' };
    putting: { sg: number; benchmark: number; delta: number; rating: 'strong' | 'average' | 'weak' };
    total: { sg: number; benchmark: number; delta: number };
  };
  recommendations: {
    primaryFocus: string;       // Hvilken kategori først
    practicePlan: Array<{
      category: 'OTT' | 'APP' | 'ARG' | 'PUTT';
      type: 'TEK' | 'TAK' | 'MENTAL' | 'FYS';
      description: string;      // Hva som skal gjøres
      drills: string[];         // Konkrete drill-forslag
      durationMinutes: number;  // Per økt
      sessionsPerWeek: number;
      rationale: string;        // Hvorfor dette fokuset
    }>;
    estimatedTimeToImprove: string;  // F.eks. "4–6 uker med 2 økter/uke"
  };
  trend?: {
    direction: 'improving' | 'stable' | 'declining';
    biggestChange: { category: string; delta: number };
    consistencyScore: number;   // 0–100
  };
}
```

## Analyse-prosess

### 1. Kategori-utledning

Hvis `category` ikke er oppgitt:
1. Bruk `handicap` → `handicapToCategory()` fra `lib/portal/golf/sg-to-handicap.ts`
2. Alternativt: `sgTotal` → `sgToCategory()` fra samme modul

Hent benchmark-verdier fra `SG_BENCHMARKS` i `lib/portal/golf/sg-benchmarks.ts`.

### 2. SG-sammenligning per kategori

For hver kategori `c ∈ {offTheTee, approach, aroundTheGreen, putting}`:

```
benchmark_c = SG_BENCHMARKS[category].sg[c]
delta_c     = stats.sg_c − benchmark_c   // Negativ = under benchmark, positiv = over
```

**Rating-logikk:**
| Delta | Rating | Betydning |
|-------|--------|-----------|
| ≥ +0.2 | strong | Over kategori-snitt |
| −0.2 til +0.2 | average | Omtrentlig kategori-snitt |
| < −0.2 | weak | Under kategori-snitt |

### 3. Sterkest / Svakest kategori

Sorter kategorier etter `delta_c` (synkende). Sterkest = høyest delta, svakest = lavest delta.

Hvis spilleren har `previousRounds`, beregn også trend: `delta_now − delta_baseline`.

### 4. Rotårsak-analyse (Tek/Tak/Mental/Fys)

For den svakeste kategorien, kjør diagnostisk vurdering:

```
Kategori c har delta_c < −0.2 (svak)

Hent tilgjengelig data:
  ├─ Høy varians mellom runder (> 0.5 SG std dev)? → MENTAL (konsistens)
  ├─ SG_c(konkurranse) − SG_c(trening) < −0.5? → MENTAL (press)
  ├─ Normal teknikk, men dårlige scorer? → TAKTISK (strategi/valg)
  ├─ Lav ballfart / dårlig kontakt? → FYSISK eller TEKNISK
  └─ Ingen tydelig mønster → BLANDET
```

**Fordelingsmatrise for anbefalinger:**

| Primær rot-årsak | Tek | Tak | Mental | Fys |
|------------------|-----|-----|--------|-----|
| Teknisk | 65% | 10% | 10% | 15% |
| Fysisk | 30% | 5% | 10% | 55% |
| Mental (press) | 25% | 20% | 50% | 5% |
| Taktisk (valg) | 15% | 60% | 15% | 10% |
| Blandet | 40% | 20% | 25% | 15% |

### 5. Treningsanbefaling — struktur

For hver anbefaling, angi:
- **Kategori**: OTT / APP / ARG / PUTT
- **Type**: TEK / TAK / MENTAL / FYS
- **Beskrivelse**: Konkret hva spilleren skal fokusere på
- **Driller**: 1–3 konkrete drill-forslag (referer `drill-generator`)
- **Varighet**: Minutter per økt
- **Frekvens**: Økter per uke
- **Begrunnelse**: Kort forklaring på hvorfor dette fokuset

### 6. Tids-estimat

Bruk `hours-per-SG`-tabellen fra Coaching Forecast-metodikken:

| Kategori | Nivå K–G | Nivå F–D | Nivå C–B | Nivå A |
|----------|----------|----------|----------|--------|
| OTT | 50 t | 70 t | 100 t | 150 t |
| APP | 70 t | 100 t | 140 t | 200 t |
| ARG | 40 t | 60 t | 90 t | 140 t |
| PUTT | 25 t | 40 t | 65 t | 110 t |

**Timer per +0.1 SG-forbedring** (deliberate practice). Juster med overlap-factor 0.55 for blandet trening.

## Eksempel

**Input:**
```json
{
  "roundId": "rnd_789",
  "playerId": "user_456",
  "playerName": "Emil",
  "date": "2026-04-15",
  "course": "Losby GK",
  "score": 82,
  "par": 72,
  "handicap": 12.5,
  "category": "E",
  "stats": {
    "totalScore": 82,
    "sgTotal": -2.4,
    "sgOffTheTee": -0.4,
    "sgApproach": -1.2,
    "sgAroundTheGreen": -0.5,
    "sgPutting": -0.3,
    "fairwaysHit": 6,
    "fairwaysTotal": 14,
    "gir": 7,
    "girTotal": 18,
    "putts": 33,
    "threePutts": 2,
    "upAndDowns": 3,
    "penalties": 2
  },
  "previousRounds": [
    { "date": "2026-04-08", "sgTotal": -2.1, "sgOffTheTee": -0.3, "sgApproach": -1.0, "sgAroundTheGreen": -0.4, "sgPutting": -0.4, "score": 81 },
    { "date": "2026-04-01", "sgTotal": -2.5, "sgOffTheTee": -0.5, "sgApproach": -1.1, "sgAroundTheGreen": -0.6, "sgPutting": -0.3, "score": 83 }
  ]
}
```

**Output:**
```json
{
  "analysis": {
    "overview": "Emil spilte en 82-runde med SG total på −2.4, noe som er 0.4 under kategori E-benchmark. Approach er tydelig svakest punkt med −1.2 SG (0.3 under benchmark).",
    "scoreVsBenchmark": "worse",
    "category": "E",
    "strongestCategory": { "name": "putting", "sg": -0.3, "vsBenchmark": 0.2 },
    "weakestCategory": { "name": "approach", "sg": -1.2, "vsBenchmark": -0.3 },
    "patterns": [
      "Approach-forverring fra −1.0 til −1.2 over siste 3 runder",
      "Konsistent svak off-the-tee (−0.4 til −0.5)",
      "Putting er relativt stabil og sterk"
    ]
  },
  "sgBreakdown": {
    "offTheTee": { "sg": -0.4, "benchmark": -0.6, "delta": 0.2, "rating": "average" },
    "approach": { "sg": -1.2, "benchmark": -0.9, "delta": -0.3, "rating": "weak" },
    "aroundTheGreen": { "sg": -0.5, "benchmark": -0.4, "delta": -0.1, "rating": "average" },
    "putting": { "sg": -0.3, "benchmark": -0.1, "delta": 0.2, "rating": "strong" },
    "total": { "sg": -2.4, "benchmark": -2.0, "delta": -0.4 }
  },
  "recommendations": {
    "primaryFocus": "approach",
    "practicePlan": [
      {
        "category": "APP",
        "type": "TEK",
        "description": "Forbedre kontakt-konsistens på approach-slag. Fokus på face angle-stabilitet og sentertreff.",
        "drills": ["50-100-150 Challenge", "Landing Zone Drill"],
        "durationMinutes": 45,
        "sessionsPerWeek": 2,
        "rationale": "Approach er 0.3 SG under benchmark. Med HCP 12 er dette det største forbedringspotensialet. Teknisk fokus gir raskest avkastning."
      },
      {
        "category": "APP",
        "type": "TAK",
        "description": "Avstandsestimering og klubbvalg. Øv på å treffe spesifikke avstander under press.",
        "drills": [ "Target Practice med 3 klubber", "Course Management Simulation" ],
        "durationMinutes": 30,
        "sessionsPerWeek": 1,
        "rationale": "Dårlig avstandskontroll fører til lange putter og missed GIR. 20% av approach-tiden bør være taktisk."
      },
      {
        "category": "OTT",
        "type": "TEK",
        "description": "Driver-konsistens. Fokus på fairway-treff og eliminere straffer.",
        "drills": ["Fairway Finder", "Gate Drill Driver"],
        "durationMinutes": 30,
        "sessionsPerWeek": 1,
        "rationale": "To straffer i runden tyder på at driver-stabilitet bør vedlikeholdes. Nivået er OK men ikke sterk."
      }
    ],
    "estimatedTimeToImprove": "Med 3 økter/uke (2x approach, 1x driver) er +0.3 SG i approach realistisk på 8–12 uker."
  },
  "trend": {
    "direction": "declining",
    "biggestChange": { "category": "approach", "delta": -0.2 },
    "consistencyScore": 62
  }
}
```

## Kategori-spesifikke anbefalinger

### Off-the-Tee (OTT)
**Typiske svakheter:**
- Fairway-hit < 35% → Tek (svingbane, face control)
- Høy strafferate → Tak (klubbvalg, strategi) eller Tek (konsistens)
- Lav carry-distance → Fys (speed-training) eller Tek (smash factor)

**Standard drill-referanser:**
- Fairway Finder (driving)
- Dispersion Circle (driving)

### Approach (APP)
**Typiske svakheter:**
- GIR < 25% (hcp 10–20) → Tek (kontakt, avstand)
- Høy varians i avstand → Tak (klubbvalg) eller Tek (konsistens)
- Bra trening, dårlig bane → Mental (press)

**Standard drill-referanser:**
- 50-100-150 (jern)
- Landing Zone (chipping)

### Around-the-Green (ARG)
**Typiske svakheter:**
- Up-and-down < 30% → Tek (teknikk chip/pitch/bunker)
- Bra teknikk, dårlig resultat → Tak (klubbvalg rundt green) eller Mental (konsentrasjon)

**Standard drill-referanser:**
- Up-and-Down Challenge (chipping)
- Bunker Save Progression (bunker)

### Putting (PUTT)
**Typiske svakheter:**
- > 34 putts → Tek (avstandskontroll) eller Tek (startlinje)
- 3+ three-putts → Tak (lag putting / avstand) eller Tek (speed control)
- Bra på trening, dårlig i runde → Mental (rutine, press)

**Standard drill-referanser:**
- Gate Drill (putting)
- Clock Drill (putting)
- Ladder Drill (putting)

## Integrasjon med plattformen

### Datakilder
- `lib/portal/golf/sg-benchmarks.ts` — A–K-benchmarks for SG per kategori
- `lib/portal/golf/sg-to-handicap.ts` — Konvertering mellom SG, HCP og A–K-kategori
- `lib/portal/golf/expected-strokes.ts` — Broadie-benchmark for shot-level SG (ved behov)

### Andre skills
1. **drill-generator** — for konkrete driller med scoring og target-nivåer
2. **training-exercise-generator** — for øvelser med L-M-PR-parametere
3. **training-plan-generator** — for å integrere anbefalinger i større 12-ukers plan
4. **coaching-summary** — hvis runden var del av en coaching-sesjon

## Kvalitetssjekk

- [ ] SG-verdier er sammenlignet mot riktig A–K-benchmark
- [ ] Sterkest/svakest kategori er korrekt identifisert fra data
- [ ] Rotårsak-analysen er begrunnet (ikke gjettet)
- [ ] Tek/Tak/Mental/Fys-fordelingen reflekterer faktisk svakhet
- [ ] Driller er relevante for identifisert kategori og type
- [ ] Tids-estimat er realistisk basert på HCP/nivå
- [ ] Språk er støttende og konstruktivt (ikke kritisk)
- [ ] Anbefalinger er spesifikke nok til at spilleren kan handle på dem
