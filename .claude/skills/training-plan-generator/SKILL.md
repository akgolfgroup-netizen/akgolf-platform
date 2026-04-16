---
name: training-plan-generator
description: |
  Genererer komplette 12-ukers treningsplaner basert på AK-formelen.
  Tilpasser etter HCP, sesong, tilgjengelig tid og svakheter.
argument-hint: |
  Bruk for å lage strukturerte treningsplaner med korrekt fordeling (FYS 40%, TEK 30%, SLAG 20%, SPILL 10%).
  Sesong-tilpasset (vinter/season-prep/main/off).
allowed-tools: [ReadFile, WriteFile, SearchWeb]
user-invocable: true
---

# Training Plan Generator

Genererer komplette 12-ukers treningsplaner basert på AK-formelen og spillerens profil.

## Når å bruke

- Ved sesongstart
- Etter HCP-endring
- Ved nye målsettinger
- For strukturert progresjon

## Input

```typescript
{
  playerId: string;
  currentHcp: number;
  targetHcp?: number;
  weeks: number;                 // Default 12
  timePerWeek: number;           // Minutter per uke
  season: 'winter' | 'pre-season' | 'main-season' | 'off-season';
  weaknesses?: string[];
  strengths?: string[];
  availableFacilities?: string[]; // "range", "course", "simulator", "gym"
}
```

## AK-Formelen

Standardfordeling for golf-utvikling:

| Nivå | Fysisk | Teknikk | Slag | Spill | Mental |
|------|--------|---------|------|-------|--------|
| **%** | 40% | 30% | 20% | 10% | (integrert) |
| **Fokus** | Mobilitet, styrke | Mekanikk, følelse | Nøyaktighet | Bane-strategi | Press-håndtering |

Sesong-justeringer:
- **Winter**: FYS 60%, TEK 30%, SLAG 10%
- **Pre-season**: FYS 30%, TEK 40%, SLAG 30%
- **Main-season**: FYS 20%, TEK 20%, SLAG 30%, SPILL 30%
- **Off-season**: FYS 50%, TEK 20%, SLAG 20%, MEN 10%

## Output

```typescript
{
  plan: {
    id: string;
    name: string;
    duration: number;            // Uker
    weeklyHours: number;
    phases: [{
      name: string;              // f.eks. "Foundation", "Build", "Peak"
      weeks: number;
      focus: string;
      distribution: {
        FYS: number;
        TEK: number;
        SLAG: number;
        SPILL: number;
      };
    }];
    weeks: [{
      weekNumber: number;
      focus: string;
      sessions: [{
        day: number;             // 1-7 (man-søn)
        title: string;
        duration: number;
        focus: 'FYS' | 'TEK' | 'SLAG' | 'SPILL';
        exercises: string[];     // Referanser til øvelser
        intensity: 'low' | 'medium' | 'high';
      }];
      weeklyGoal: string;
    }];
  };
  rationale: string;             // Forklaring på oppbygging
  progressionNotes: string[];    // Viktige milepæler
}
```

## Fase-oppbygging (12 uker)

### Fase 1: Foundation (Uke 1-4)
- Fokus: Teknisk basis + fysisk forberedelse
- Intensitet: Medium
- Mål: Etablere rutiner, identifisere svakheter

### Fase 2: Build (Uke 5-8)
- Fokus: Spesifikk trening av svakheter
- Intensitet: Høy
- Mål: Målbar forbedring på tester

### Fase 3: Performance (Uke 9-11)
- Fokus: Spill-simulering og press-trening
- Intensitet: Høy
- Mål: Overføre trening til bane

### Fase 4: Recovery/Test (Uke 12)
- Fokus: Teste fremgang + restitusjon
- Intensitet: Lav
- Mål: Etablere ny baseline

## Eksempel

**Input:**
```json
{
  "playerId": "user_123",
  "currentHcp": 15,
  "targetHcp": 10,
  "weeks": 12,
  "timePerWeek": 300,
  "season": "pre-season",
  "weaknesses": ["driving accuracy", "short putts"],
  "availableFacilities": ["range", "course", "gym"]
}
```

**Output (utdrag):**
```json
{
  "plan": {
    "name": "12-ukers Pre-Season Plan: 15→10",
    "duration": 12,
    "weeklyHours": 5,
    "phases": [
      {
        "name": "Foundation",
        "weeks": 4,
        "focus": "Teknisk basis + mobilitet",
        "distribution": { "FYS": 30, "TEK": 40, "SLAG": 30, "SPILL": 0 }
      }
    ],
    "weeks": [
      {
        "weekNumber": 1,
        "focus": "Driver teknikk + putting",
        "sessions": [
          {
            "day": 1,
            "title": "Driver teknikk",
            "duration": 60,
            "focus": "TEK",
            "intensity": "medium"
          },
          {
            "day": 3,
            "title": "Putting drill",
            "duration": 45,
            "focus": "TEK",
            "intensity": "medium"
          }
        ],
        "weeklyGoal": "Etablere pre-shot rutine"
      }
    ]
  },
  "rationale": "Planen fokuserer på identifiserte svakheter (driver putting) mens den bygger fysisk base for kommende sesong."
}
```

## Integrasjon med andre skills

1. Bruk **training-exercise-generator** for å fylle øvelser
2. Bruk **drill-generator** for spesifikke tekniske driller
3. Bruk **test-generator** for uke 1, 6 og 12 assessments

## Kvalitetssjekk

- [ ] Sum av distribution = 100%
- [ ] Total tid matcher timePerWeek
- [ ] Progressiv økning i intensitet
- [ ] Restitusjonsdager inkludert
- [ ] Tester planlagt i uke 1, 6, 12
- [ ] Sesong-tilpasset fordeling
