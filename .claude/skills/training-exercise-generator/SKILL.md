---
name: training-exercise-generator
description: |
  Genererer personlige treningsøvelser basert på spillerens svakheter, coaching-notater og AK-formelen.
  Returnerer strukturerte øvelser med L-M-PR parametere (Læringsfase, Miljø, Press).
argument-hint: |
  Bruk når spilleren trenger nye øvelser basert på svakheter fra statistikk eller coaching.
  Funksjonell Trening - Teknikk - Slagtrening - Spill - Mental Trening (Pyramiden)
allowed-tools: [ReadFile, WriteFile, SearchWeb]
user-invocable: true
---

# Training Exercise Generator

Genererer personlige treningsøvelser basert på spillerens svakheter, coaching-notater og AK-formelen.

## Når å bruke

- Spilleren har identifisert svakheter (f.eks. "putting 3-6 fot", "slice driver")
- Etter coaching-sesjon med nye fokusområder
- Ved generering av ukentlig treningsplan
- Når spilleren vil ha variasjon i øvelsene

## Input

```typescript
{
  playerId: string;              // Spillerens ID
  weaknesses: string[];          // Identifiserte svakheter
  coachingNotes?: string[];      // Notater fra coaching
  availableTime: number;         // Tilgjengelig tid (minutter)
  focusArea?: 'FYS' | 'TEK' | 'SLAG' | 'SPILL' | 'TURN';  // Hovedfokus
  environment?: string;          // M0-M5 (hvor skal øvelsen gjøres)
}
```

## Output

```typescript
{
  exercises: [{
    id: string;
    name: string;                // Øvelsesnavn
    description: string;         // Beskrivelse av gjennomføring
    pyramid: 'FYS' | 'TEK' | 'SLAG' | 'SPILL' | 'TURN';
    area: string;                // f.eks. "putting", "driver", "chipping"
    duration: number;            // Minutter
    lPhase: string;              // L-KROPP, L-ARM, L-KOLLE, L-BALL, L-AUTO
    environment: string;         // M0-M5
    pressLevel: string;          // PR1-PR5
    equipment?: string[];        // Nødvendig utstyr
    successCriteria?: string;    // Hva er suksess?
  }];
  rationale: string;             // Forklaring på valgene
}
```

## Eksempler

### Eksempel 1: Putting 3-6 fot

**Input:**
```json
{
  "playerId": "user_123",
  "weaknesses": ["putting 3-6 fot", "misser høyre"],
  "availableTime": 30,
  "focusArea": "TEK"
}
```

**Output:**
```json
{
  "exercises": [{
    "name": "Gate Putting Drill",
    "description": "Sett opp to tees i vinkel som porter, 3-6 fot fra hull. Putt 10 baller gjennom porten og i hullet.",
    "pyramid": "TEK",
    "area": "putting",
    "duration": 15,
    "lPhase": "L-BALL",
    "environment": "M2",
    "pressLevel": "PR2",
    "equipment": ["10 baller", "2 tees", "putter"],
    "successCriteria": "7/10 baller i hullet"
  }, {
    "name": "Clock Drill",
    "description": "Plasser baller rundt hullet som på en klokke (3, 6, 9, 12 fot). Putt hver ball 3 ganger.",
    "pyramid": "SLAG",
    "area": "putting",
    "duration": 15,
    "lPhase": "L-AUTO",
    "environment": "M3",
    "pressLevel": "PR3",
    "successCriteria": "80% treffrate"
  }]
}
```

## L-M-PR Rammeverk

### Læringsfaser (L)
- **L-KROPP**: Kun kroppsbevegelse, ingen klubbe/ball
- **L-ARM**: Kropp + armer, ingen klubbe/ball
- **L-KOLLE**: Med klubbe, ingen ball, sakte bevegelse
- **L-BALL**: Med ball, lav hastighet, fokus på følelse
- **L-AUTO**: Full hastighet, automatisert bevegelse

### Miljø (M)
- **M0**: Off-course (gym, hjemme)
- **M1**: Innendørs (simulator, TrackMan)
- **M2**: Range (utendørs driving range)
- **M3**: Øvingsfelt (kortbane, putting green)
- **M4**: Bane trening (treningsrunde)
- **M5**: Bane turnering (turneringsrunde)

### Press-nivåer (PR)
- **PR1**: Ingen press (utforskende)
- **PR2**: Selvmonitorering (tracking)
- **PR3**: Sosial (med andre, observert)
- **PR4**: Konkurranse (mot andre)
- **PR5**: Turnering (resultat teller)

## Feilhåndtering

| Feil | Årsak | Løsning |
|------|-------|---------|
| Ingen øvelser funnet | For spesifikke kriterier | Bredere fokusområde eller mer tid |
| Ugyldig focusArea | Feil staving | Bruk kun FYS/TEK/SLAG/SPILL/TURN |
| For kort tid | < 10 minutter | Øk availableTime til minimum 15 min |

## Kvalitetssjekk

- [ ] Øvelsen matcher spillerens svakhet
- [ ] L-fase er passende for øvelsen
- [ ] Miljø er realistisk for spilleren
- [ ] Press-nivå gradert riktig
- [ ] Varighet passer i availableTime
- [ ] Suksesskriterier er målbare
