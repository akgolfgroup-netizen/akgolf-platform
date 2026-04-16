---
name: coaching-summary
description: |
  Genererer AI-oppsummering av coaching-sesjoner for spilleren og treneren.
  Analyserer notater, video, driller og fremgang for å lage strukturert tilbakemelding.
argument-hint: |
  Bruk etter coaching-sesjoner for å generere oppsummering til spiller og trener.
  Analyserer notater, identifiserer hovedpunkter og gir anbefalinger.
allowed-tools: [ReadFile, WriteFile, SearchWeb]
user-invocable: true
---

# Coaching Summary

Genererer AI-oppsummering av coaching-sesjoner for spilleren og treneren med strukturerte anbefalinger.

## Når å bruke

- Etter fullført coaching-sesjon
- For å dokumentere fremgang over tid
- For å gi spilleren handlingsplan etter trening
- For trenerens interne notater og observasjoner

## Input

```typescript
{
  sessionId: string;
  playerId: string;
  coachId: string;
  sessionDate: Date;
  duration: number;           // minutter
  notes: string;              // Rå notater fra coach
  videoUrls?: string[];       // Opptak
  drillsPracticed: string[];
  playerQuestions?: string[];
  playerLevel: 'beginner' | 'intermediate' | 'advanced' | 'pro';
}
```

## Output

```typescript
{
  summary: {
    overview: string;         // 2-3 setninger
    keyPoints: string[];      // Hovedpunkter (3-5)
    techniquesWorkedOn: string[];
    playerProgress: 'improving' | 'stable' | 'struggling';
  };
  recommendations: {
    practiceFocus: string[];  // Hva fokusere på fremover
    drillsToContinue: string[];
    suggestedExercises: string[];  // Referanse til exercise-generator
  };
  nextSession: {
    suggestedFocus: string;
    estimatedTimeToMastery: string;
  };
  coachNotes: {
    technicalObservations: string;
    mentalGameNotes: string;
    physicalNotes: string;
  };
}
```

## Analyse-prosess

### 1. Notat-analyse
- Identifiser hovedtema fra coach-notater
- Ekstraher tekniske justeringer som ble gjort
- Gjenkjenn mønstre i spillerens respons

### 2. Progresjons-vurdering
**Improving**: Spilleren viser målbar forbedring i løpet av sesjonen
**Stable**: Spilleren opprettholder nivå, konsistente resultater
**Struggling**: Spilleren har utfordringer med konseptene, lite fremgang

### 3. Teknisk analyse
- Setup-endringer
- Sving-justeringer
- Følelse/feedback fra spilleren
- Resultater (ball flight, kontakt)

### 4. Mental game-vurdering
- Hvordan spilleren håndterte press
- Fokus og konsentrasjon
- Selvtillit under øvelser

## Eksempel

**Input:**
```json
{
  "sessionId": "sess_123",
  "playerId": "user_456",
  "coachId": "coach_789",
  "sessionDate": "2026-04-15",
  "duration": 60,
  "notes": "Jobbet med driver slice. Setup for bred førte til utside-in svingbane. Justerte til neutral stance og sterkere grip. Etter 15 baller markant bedre ball flight. Avsluttet med 10 drives hvor 7 landet i fairway. Spilleren rapporterte bedre følelse og mer kontroll.",
  "drillsPracticed": ["gate drill", "alignment stick", "half swings"],
  "playerQuestions": ["Hvorfor slicer jeg alltid under press?"],
  "playerLevel": "intermediate"
}
```

**Output:**
```json
{
  "summary": {
    "overview": "Fokus på å eliminere driver-slice gjennom setup- og grip-justeringer. Markant forbedring mot slutten av sesjonen med 70% fairway-treff.",
    "keyPoints": [
      "Setup for bred førte til utside-in svingbane",
      "Grip-justering (sterkere) hjalp med clubface-kontroll",
      "Neutral stance ga bedre rotasjon",
      "7/10 drives i fairway etter justering"
    ],
    "techniquesWorkedOn": [
      "Setup-posisjonering",
      "Grip-styrke",
      "Svingbane-kontroll (gate drill)",
      "Alignment (alignment stick)"
    ],
    "playerProgress": "improving"
  },
  "recommendations": {
    "practiceFocus": [
      "Driver konsistens",
      "Setup-rutine før hver drive",
      "Svingbane-følelse"
    ],
    "drillsToContinue": [
      "gate drill",
      "alignment stick routine"
    ],
    "suggestedExercises": [
      "driving-accuracy-progression",
      "fairway-finder-drill"
    ]
  },
  "nextSession": {
    "suggestedFocus": "Implementere justeringer under press - simulert turnerings-situasjon",
    "estimatedTimeToMastery": "2-3 uker med regelmessig praksis"
  },
  "coachNotes": {
    "technicalObservations": "Spilleren responderer godt på grip-justeringer. Trenger mer arbeid med svingbane-feeling. Consider å introdusere videoanalyse neste gang for å vise differanse.",
    "mentalGameNotes": "Positiv innstilling til endringer. Spørsmål om press indikerer bevissthet om mental game - god anledning til å jobbe med dette neste gang.",
    "physicalNotes": "Ingen fysiske begrensninger observert. Good rotation etter stance-justering."
  }
}
```

## Nivå-spesifikke tilpasninger

### Beginner
- Fokus på grunnleggende mekanikk
- Enkle justeringer med tydelige instruksjoner
- Positiv forsterking
- Korte økter (30-45 min)

### Intermediate
- Tekniske detaljer og følelse
- Introduksjon til driller
- Sammenheng mellom årsak og virkning
- Mellomøkter (45-60 min)

### Advanced
- Fine-tuning av mekanikk
- Video-analyse og data
- Pre-shot rutiner
- Lengre økter (60-90 min)

### Pro
- Konsept-basert coaching
- Minimale justeringer
- Turnerings-forberedelse
- Mentale strategier
- Fler-timers økter

## Integrasjon med andre skills

1. Bruk **drill-generator** for å finne passende driller
2. Bruk **training-exercise-generator** for øvelser mellom sesjoner
3. Bruk **training-plan-generator** for å integrere i større plan

## Kvalitetssjekk

- [ ] Oppsummering reflekterer faktisk innhold i notater
- [ ] Key points er spesifikke og målbare
- [ ] Anbefalinger er handlingsbare
- [ ] Coach notes gir verdi for fremtidige sesjoner
- [ ] Progress-vurdering er begrunnet
- [ ] Språk tilpasset playerLevel
