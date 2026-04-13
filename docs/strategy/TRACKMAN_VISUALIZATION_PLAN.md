# TrackMan Data Visualisering & AI Coach Plan
## En komplett strategi for å overgå Tracy AI

---

## 📋 EXECUTIVE SUMMARY

**Mål:** Skape verdens beste TrackMan-dataopplevelse som overgår Trackmans egen Tracy AI ved å kombinere:
- Avansert datavisualisering
- Kontekstuell analyse (TrackMan + spilldata + treningslogg)
- Personlig AI-coach med diagnose-evne
- Nivå-basert tilgang (ikke alle funksjoner til alle)

---

## 🎯 KJERNEKONSEPT: "The TrackMan Oracle"

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TRACKMAN ORACLE ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  LAG 1: DATA INNSAMLING                    LAG 2: DATA FUSION           │
│  ┌────────────────────────────────┐       ┌──────────────────────────┐  │
│  │ • CSV-upload fra TPS          │       │ • Normaliser parametere  │  │
│  │ • Skjermbilde (OCR)           │──────▶│ • Kombiner kilder        │  │
│  │ • API-integrasjon (fremtid)   │       │ • Detekter mønstre       │  │
│  │ • Manuell input               │       │ • Beregn avvik           │  │
│  └────────────────────────────────┘       └──────────┬─────────────────┘  │
│                                                      │                    │
│  LAG 3: KONTEKSTUELL ANALYSE                         ▼                    │
│  ┌────────────────────────────────┐       ┌──────────────────────────┐  │
│  │ • TrackMan vs Spill-data      │◀──────│ • Sammenlign banen/range│  │
│  │ • Spredningsanalyse           │       │ • Identifiser gap       │  │
│  │ • Teknisk diagnose            │       │ • Korrelasjonsanalyse   │  │
│  │ • Trenings-kobling            │       └──────────┬─────────────────┘  │
│  └────────────────────────────────┘                │                    │
│                                                   ▼                    │
│  LAG 4: VISUALISERING                 LAG 5: AI COACH                  │
│  ┌────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │ • Interaktive grafer          │  │ • Parameter-forklaring       │  │
│  │ • 3D ballflight-simulering    │  │ • Teknisk diagnose           │  │
│  │ • Spredningskart              │  │ • Treningsanbefalinger       │  │
│  │ • Dashboard-widget            │  │ • Pro-sammenligning          │  │
│  └────────────────────────────────┘  └──────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTASJONS-OMRÅDER

### 1. VISUALISERINGSKOMPONENTER

#### A. Ball Flight Visualizer
```typescript
// components/trackman/ball-flight-3d.tsx
interface BallFlightVisualizerProps {
  shots: TrackManShot[];
  highlightPattern?: 'draw' | 'fade' | 'straight' | 'miss-left' | 'miss-right';
  comparisonMode?: 'single' | 'cluster' | 'trend';
}
```

**Komponenter å bruke:**
- `framer-motion` for animerte ballflighter
- `recharts` for 2D-spredningskart
- `@radix-ui/react-slider` for tidsfilter

**Features:**
- [ ] Scatter plot: Carry vs Offline (fargekodet etter klubb)
- [ ] Trend-linje over tid
- [ ] Sprednings-ellipse (standardavvik)
- [ ] Heatmap av landingssoner
- [ ] Animasjon av ballflight

#### B. Parameter Dashboard Cards
**12 Kort (én per nøkkelparameter):**
1. **Club Speed** - Kraftpotensial
2. **Ball Speed** - Effektivitet
3. **Smash Factor** - Kontakt-kvalitet
4. **Launch Angle** - Optimalitet
5. **Spin Rate** - Kontroll
6. **Spin Axis** - Kurve-karakteristikk
7. **Carry Distance** - Konsistens
8. **Attack Angle** - Optimal kontakt
9. **Club Path** - Swing-retning
10. **Face Angle** - Retning ved impact
11. **Face to Path** - Ballflight-determinant
12. **Apex Height** - Flyhøyde

#### C. Spredningsanalyse-komponent
**Visualisering:**
- Golfbane-overlay med landingssoner
- Venstre/høyre spredning histogram
- Konsistens-score (radar-chart)
- Mønster-gjenkjenning (AI)

---

### 2. KONTEKSTUELL INTEGRASJON

#### A. "Range vs Course" Analyse
```typescript
// lib/trackman/range-vs-course.ts
interface RangeVsCourseAnalysis {
  rangeStats: {
    avgDispersion: number;
    consistency: number;
    pattern: string;
  };
  courseStats: {
    fairwayHit: number;
    gir: number;
    scrambling: number;
  };
  discrepancies: {
    type: 'range-better' | 'course-better' | 'alignment';
    description: string;
    recommendation: string;
  }[];
}
```

#### B. DITT SCENARIO (5m draw vs 15-20m venstre-miss)
```
SPREDNINGSANALYSE
━━━━━━━━━━━━━━━━━━

Mønster: Konsistent draw med sporadiske hooks
Konsistens: 65% (moderat)

TEKNISK ANALYSE:
━━━━━━━━━━━━━━━━
✅ Bra:
• Club Path: +2.5° (in-to-out) - perfekt for draw
• Face to Path: -2° (face lukket i forhold til path)
→ Dette SKAPER din 5m draw

⚠️  Problem ved miss:
• Face Angle: -4° til -6° ved hooks (for lukket)
• Club Path blir mer +4° (for mye in-to-out)
→ Dette SKAPER dine 15-20m venstre-miss

DIAGNOSE:
Du har en god draw-teknikk, men mister kontroll på 
face-åpenhet ved kraftige slag. Dette tyder på:
1. Grip-pressure endres under swing
2. Håndledd roterer for mye gjennom impact
3. Timing av kropp vs armmer er av

ANBEFALTE ØVELSER:
1. "Half-swing draws" - fokus på face-kontroll
2. "Towel drill" - for bedre sequencing
3. "9-3 drill" - kortere swing med samme mekanikk
```

---

### 3. AI COACH: "The TrackMan Master"

#### A. Parameter Kunnskapsbase
```typescript
// lib/trackman/ai/knowledge-base.ts
export const TRACKMAN_PARAMETERS = {
  attackAngle: {
    name: 'Attack Angle',
    unit: 'degrees',
    description: 'Hvor mye klubben går opp eller ned ved impact',
    optimalRanges: {
      driver: { min: -2, max: 5, ideal: 2 },
      irons: { min: -6, max: -2, ideal: -4 },
      wedges: { min: -8, max: -4, ideal: -6 },
    },
    relationships: ['clubPath', 'dynamicLoft', 'spinRate'],
  },
  // ... alle parametere
};
```

#### B. System Prompt for AI Coach
```
Du er en verdensklasse TrackMan Master Coach med dyp kunnskap om:
- Ball Flight Laws (D-plane, launch conditions)
- TrackMan parametere og deres relasjoner
- Teknisk diagnose basert på data
- Treningsmetodikk for ulike feil

DIAGNOSE-PROSESS:
1. Se på spredningsmønster først
2. Identifiser 1-2 hovedårsaker
3. Sjekk relasjoner mellom parametere
4. Koble til spillerens miss-mønster
5. Gi drill-baserte løsninger

VIKTIGE REGLER:
- Face Angle + Club Path = Ball Flight
- Attack Angle påvirker spin og launch
- Smash Factor indikerer kontakt-kvalitet
- Spin Axis viser kurve-intensitet
```

---

### 4. NIVÅ-BASERT TILGANG

```typescript
export const TRACKMAN_ACCESS_LEVELS = {
  // Nivå 1: Basic (alle spillere)
  basic: {
    features: ['upload-csv', 'view-basic-stats', 'club-averages'],
    parameters: ['carry', 'totalDistance', 'clubSpeed', 'ballSpeed'],
    aiCoach: false,
  },
  
  // Nivå 2: Standard (HCP < 30 eller premium)
  standard: {
    features: ['spredningskart', 'parameter-cards', 'tour-benchmarks'],
    parameters: ['launchAngle', 'spinRate', 'smashFactor', 'attackAngle'],
    aiCoach: 'basic',
  },
  
  // Nivå 3: Advanced (HCP < 15 eller coaching)
  advanced: {
    features: ['technical-radar', 'range-vs-course', 'advanced-ai-coach'],
    parameters: 'all',
    aiCoach: 'full',
    diagnosis: 'full',
  },
  
  // Nivå 4: Pro (Coaches, proffer)
  pro: {
    features: ['compare-to-pro', 'client-management', 'export-reports'],
    parameters: 'all',
    aiCoach: 'master',
  },
};
```

---

### 5. HVORFOR VI OVERGÅR TRACY

| Feature | Tracy (TrackMan) | Vår Løsning |
|---------|------------------|-------------|
| **Datakilder** | Kun TrackMan | TrackMan + Spill + Trening |
| **Kontekst** | Isolerte data | Integrert analyse |
| **Spredning vs Bane** | ❌ | ✅ Range vs Course |
| **Teknisk diagnose** | Basic | Avansert med årsakssammenheng |
| **Personlig treningsplan** | Generisk | Basert på din data + mål |
| **Trener-verktøy** | ❌ | ✅ Full klient-håndtering |
| **Sammenligning** | Tour gjennomsnitt | Per HCP-nivå, alder, kjønn |
| **Språk** | Engelsk | Norsk (lokalisert) |
| **Tilgjengelighet** | Kun i TPS | Overalt, alltid |

---

### 6. IMPLEMENTASJONSPLAN

#### Fase 1: Foundation (Uke 1-2)
- [ ] Utvid database-schema med nye felter
- [ ] Forbedre CSV-parser med alle parametere
- [ ] Lag API-endepunkter for analyse
- [ ] Sett opp parameter-knowledge-base

#### Fase 2: Visualisering (Uke 3-4)
- [ ] Spredningskart-komponent (scatter plot)
- [ ] Parameter-kort (12 stk)
- [ ] Ballflight-visualisering
- [ ] Radar-chart for teknisk profil

#### Fase 3: Kontekst (Uke 5-6)
- [ ] Koble TrackMan-data med spill-data
- [ ] Lag "Range vs Course" analyse
- [ ] Spredningsmønster-gjenkjenning
- [ ] Implementer nivå-basert tilgang

#### Fase 4: AI Coach (Uke 7-8)
- [ ] Bygg AI Coach engine
- [ ] Lag system prompts
- [ ] Implementer analyse-funksjoner
- [ ] Lag "Coach Chat"-grensesnitt

#### Fase 5: Polish (Uke 9-10)
- [ ] Forbedre UI/UX
- [ ] Mobil-optimalisering
- [ ] Brukertesting
- [ ] Dokumentasjon

---

### 7. NESTE STEG

1. **Godkjenn** den overordnede arkitekturen
2. **Velg** hvilken komponent vi skal bygge først:
   - A. Spredningskart-visualisering
   - B. Parameter-dashboard-kort
   - C. AI Coach samtale-grensesnitt
   - D. Range vs Course analyse
3. **Prioriter** nivå-basert tilgang
4. **Start** implementasjon
