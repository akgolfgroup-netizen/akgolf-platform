---
name: post-round-analysis
description: |
  Analyserer runde-data og gir anbefalinger for trening.
  Identifiserer mønstre, svakheter og styrker basert på statistikk.
argument-hint: |
  Bruk etter fullført runde for å analysere prestasjon og gi treningsanbefalinger.
  Sammenligner med tidligere runder for å identifisere trender.
allowed-tools: [ReadFile, WriteFile, SearchWeb]
user-invocable: true
---

# Post-Round Analysis

Analyserer runde-data og gir anbefalinger for trening basert på statistisk analyse og trend-identifikasjon.

## Når å bruke

- Umiddelbart etter fullført runde
- For å identifisere mønstre over tid
- For å prioritere treningsfokus
- For å målrette mot HCP-forbedring

## Input

```typescript
{
  roundId: string;
  playerId: string;
  date: Date;
  course: string;
  score: number;
  par: number;
  stats: {
    fairwaysHit: number;
    fairwaysTotal: number;
    gir: number;                 // Greens in regulation
    girTotal: number;
    putts: number;
    threePutts: number;
    upAndDowns: number;
    sandSaves: number;
    penalties: number;
  };
  holeByHole: Array<{
    hole: number;
    score: number;
    par: number;
    fairway: boolean | null;     // null for par 3
    gir: boolean;
    putts: number;
  }>;
  previousRounds?: RoundData[];  // For trend analysis
}
```

## Output

```typescript
{
  analysis: {
    scoreVsHandicap: 'better' | 'expected' | 'worse';
    highlights: string[];
    lowlights: string[];
    patterns: string[];       // F.eks. "struggles on par 3s"
  };
  statsBreakdown: {
    driving: { rating: 'strong' | 'average' | 'weak', comment: string };
    approach: { rating: 'strong' | 'average' | 'weak', comment: string };
    shortGame: { rating: 'strong' | 'average' | 'weak', comment: string };
    putting: { rating: 'strong' | 'average' | 'weak', comment: string };
  };
  recommendations: {
    immediate: string[];      // Til neste runde
    practiceFocus: string[];  // Treningsprioriteringer
    suggestedDrills: string[];
  };
  goalProgress: {
    currentHandicap: number;
    trend: 'improving' | 'stable' | 'declining';
    projectedHandicap: number;
  };
}
```

## Beregningslogikk

### Kategori-rating

**Driving Rating:**
- Strong: Fairway-hit > 50% OG ingen OB/penalties
- Average: Fairway-hit 35-50% ELLER 1-2 penalties
- Weak: Fairway-hit < 35% ELLER 3+ penalties

**Approach Rating:**
- Strong: GIR > 40% (hcp < 10) eller > 25% (hcp 10-20)
- Average: GIR innenfor ±10% av hcp-snitt
- Weak: GIR betydelig under hcp-snitt

**Short Game Rating:**
- Strong: Up-and-down > 50% ELLER sand saves > 40%
- Average: Up-and-down 30-50%
- Weak: Up-and-down < 30%

**Putting Rating:**
- Strong: < 30 putts OG 0-1 three-putts
- Average: 30-34 putts ELLER 1-2 three-putts
- Weak: > 34 putts ELLER 3+ three-putts

### Mønster-gjenkjenning

**Hull-type mønstre:**
- "Struggles on par 3s": Score par 3 > +0.5 vs par
- "Strong par 5s": Score par 5 < -0.3 vs par
- "Back nine fade": Score hul 10-18 > hul 1-9

**Feil-mønstre:**
- "Early mistakes": 3+ dobbel-bogeys på første 6 hull
- "Finish strong": Score siste 3 hull bedre enn snitt
- "Pressure issues": Dobbelt-bogeys etter birdies

## Eksempel

**Input:**
```json
{
  "roundId": "rnd_789",
  "playerId": "user_456",
  "date": "2026-04-15",
  "course": "Losby GK",
  "score": 82,
  "par": 72,
  "stats": {
    "fairwaysHit": 6,
    "fairwaysTotal": 14,
    "gir": 7,
    "girTotal": 18,
    "putts": 33,
    "threePutts": 2,
    "upAndDowns": 3,
    "sandSaves": 0,
    "penalties": 2
  },
  "holeByHole": [
    { "hole": 1, "score": 5, "par": 4, "fairway": false, "gir": false, "putts": 2 },
    { "hole": 2, "score": 4, "par": 4, "fairway": true, "gir": true, "putts": 2 },
    { "hole": 3, "score": 5, "par": 3, "fairway": null, "gir": false, "putts": 2 }
  ]
}
```

**Output:**
```json
{
  "analysis": {
    "scoreVsHandicap": "expected",
    "highlights": [
      "Ingen tre-putts på back nine",
      "2 birdie-muligheter (GIR + 2 putts)",
      "Bra recovery på hull 12 etter missed fairway"
    ],
    "lowlights": [
      "2 straffer (OB på hull 4 og 15)",
      "3 three-putts totalt",
      "0/2 sand saves"
    ],
    "patterns": [
      "Struggles early: +4 på første 3 hull",
      "Driver accuracy under 50%"
    ]
  },
  "statsBreakdown": {
    "driving": {
      "rating": "weak",
      "comment": "43% fairway-hit med 2 straffer. Driver er tydeligvis utfordrende i dag."
    },
    "approach": {
      "rating": "average",
      "comment": "39% GIR er akseptabelt for ditt nivå, men kan forbedres."
    },
    "shortGame": {
      "rating": "average",
      "comment": "Up-and-down rate på 38% er middels. Sand-spill trenger oppmerksomhet."
    },
    "putting": {
      "rating": "weak",
      "comment": "33 putts med 3 three-putts tyder på avstandskontroll-problemer."
    }
  },
  "recommendations": {
    "immediate": [
      "Fokus på putting-warmup før neste runde",
      "Legg ekstra tid på driving range",
      "Øv på 30-50 meter chipper før runde"
    ],
    "practiceFocus": [
      "Driver accuracy - gate drill",
      "Putting distance control - ladder drill",
      "Bunkerspill - basic technique"
    ],
    "suggestedDrills": [
      "fairway-finder-challenge",
      "ladder-putting-drill",
      "bunker-save-progression"
    ]
  },
  "goalProgress": {
    "currentHandicap": 12.5,
    "trend": "stable",
    "projectedHandicap": 12.2
  }
}
```

## Trend-analyse (med previousRounds)

Når previousRounds er inkludert:

1. **Sammenlign over 5 siste runder:**
   - Score-trend: stigende/synkende/stabil
   - Kategori-trender: hvilke områder forbedres/ikke

2. **Konsistens-score:**
   - Varians i score
   - Varians i kategori-statistikk

3. **Sesong-tilpasning:**
   - Tid på året vs ytelse
   - Bane-typer vs ytelse

## HCP-projeksjon

Basert på:
- Siste 5 runders snitt vs HCP
- Trend-retning
- Kategori-balansering

Formel:
```
projectedHCP = currentHCP + (trendFactor * consistencyBonus)

trendFactor = (avgLast5 - currentHCP) * 0.3
consistencyBonus = 1 - (scoreVariance / 10)
```

## Integrasjon med andre skills

1. Bruk **drill-generator** for spesifikke driller
2. Bruk **training-plan-generator** for å justere plan
3. Bruk **coaching-summary** hvis runde var med coach

## Kvalitetssjekk

- [ ] Alle ratings er begrunnet med data
- [ ] Patterns er identifisert fra holeByHole-data
- [ ] Recommendations er spesifikke og handlingsbare
- [ ] Immediate tips kan implementeres før neste runde
- [ ] HCP-projeksjon er realistisk
- [ ] Språk er støttende, ikke kritisk
