# TrackMan Import Strategi
## Import av Sprednings-Data fra TrackMan

**Mappe:** `/docs/research/trackman-import/`  
**Status:** Teknisk Spesifikasjon

---

## INNHOLDSFORTEGNELSE

1. [Overblikk](#1-overblikk)
2. [Data-Kilder](#2-data-kilder)
3. [Import-Metoder](#3-import-metoder)
4. [Data-Transformasjon](#4-data-transformasjon)
5. [Sprednings-Kalkulasjon](#5-sprednings-kalkulasjon)
6. [Kontekst-Separering](#6-kontekst-separering)
7. [Backend Implementasjon](#7-backend-implementasjon)
8. [UI for Import](#8-ui-for-import)

---

## 1. OVERBLIKK

### Mål
Importere TrackMan-data for å bygge personlig sprednings-profil per kølle, per kontekst (trening/spill/konkurranse).

### Data som Trengs
```typescript
interface TrackManDataNeeds {
  // Per kølle
  club: string;                    // "8I", "6I", "DR", etc
  
  // Distanse
  carryDistance: number;           // Carry i meter
  totalDistance: number;           // Carry + rull
  
  // Nøyaktighet
  lateralDeviation: number;        // Meter fra mål (venstre/høyre)
  distanceDeviation: number;       // Meter kort/lang
  
  // Kontekst
  context: 'TRAINING' | 'SIMULATION' | 'COURSE';
  pressureLevel: 1-5;              // PR1-PR5
  
  // Metadata
  date: Date;
  location: string;                // "Range", "Turnering X", etc
}
```

---

## 2. DATA-KILDER

### 2.1 TrackMan Export Formater

```typescript
const TRACKMAN_EXPORT_FORMATS = {
  // 1. TrackMan Performance Studio (CSV)
  performanceStudio: {
    extension: '.csv',
    columns: [
      'Club', 'BallSpeed', 'ClubSpeed', 'SmashFactor',
      'SpinRate', 'SpinAxis', 'LaunchAngle', 'LaunchDirection',
      'Carry', 'Total', 'Lateral', 'MaxHeight',
      'LandAngle', 'HangTime', 'Curve', 'Date'
    ],
    availability: 'All TrackMan units',
    automation: 'Manual export only',
  },
  
  // 2. TrackMan Golf App (JSON/API)
  golfApp: {
    format: 'JSON',
    endpoint: 'https://api.trackmangolf.com/v1/sessions',
    requires: 'OAuth authentication',
    availability: 'TrackMan Golf subscribers',
    automation: 'API polling possible',
  },
  
  // 3. TrackMan GO (Simulator)
  goSimulator: {
    format: 'CSV/JSON',
    location: 'Local export from simulator',
    availability: 'TrackMan GO installations',
    automation: 'Manual export',
  },
  
  // 4. Mulligan Indoor Golf (Hos oss!)
  mulliganIndoor: {
    system: 'TrackMan 4',
    export: 'CSV fra Performance Studio',
    specialAccess: 'Kan integreres direkte',
    automation: 'Mulig med egen løsning',
  },
};
```

### 2.2 Hvilke Data Får Vi fra TrackMan?

```
TRACKMAN STANDARD EXPORT (Performance Studio):

Club        BallSpeed  ClubSpeed  Smash   SpinRate  SpinAxis  LaunchAngle  LaunchDirection  Carry    Total    Lateral  MaxHeight  LandAngle  HangTime  Curve    Date
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
8 Iron      108.5      86.2       1.26    7800      3.2       18.5         2.1              124.3    132.7    4.2      26.5       48.2       5.8       3.1      2026-04-10
8 Iron      107.8      85.9       1.25    7950      -1.5      18.2         -1.8             123.1    131.4    -3.5     25.8       47.9       5.7       -1.2     2026-04-10
8 Iron      109.2      86.7       1.26    7650      5.8       19.1         3.5              126.2    135.1    6.8      27.2       49.1       5.9       5.5      2026-04-10
...

VI TRENGER:
- Club → Map til våre køller
- Carry → carryDistance
- Total → totalDistance  
- Lateral → lateralDeviation
- LaunchDirection → retning (draw/fade)
- Date → for kontekst
- BallSpeed/SpinRate → kvalitetsindikator
```

---

## 3. IMPORT-METODER

### 3.1 Metode 1: CSV Upload (Manuell)

```typescript
// app/(portal)/spill/import/trackman-upload.tsx

export function TrackManCSVUpload() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<TrackManShot[]>();
  
  const handleFileUpload = async (file: File) => {
    // 1. Parse CSV
    const shots = await parseTrackManCSV(file);
    
    // 2. Vis preview
    setPreview(shots.slice(0, 10));  // Første 10 slag
    
    // 3. La bruker verifisere
    // 4. Importér
  };
  
  return (
    <div>
      <FileUpload 
        accept=".csv"
        onUpload={handleFileUpload}
      />
      
      {preview && (
        <PreviewTable shots={preview} />
      )}
      
      <Button onClick={confirmImport}>
        Importer {preview?.length} slag
      </Button>
    </div>
  );
}

// Parser
function parseTrackManCSV(file: File): Promise<TrackManShot[]> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const shots = results.data.map(row => ({
          club: normalizeClubName(row['Club']),
          ballSpeed: parseFloat(row['BallSpeed']),
          clubSpeed: parseFloat(row['ClubSpeed']),
          carry: parseFloat(row['Carry']),
          total: parseFloat(row['Total']),
          lateral: parseFloat(row['Lateral']),
          launchDirection: parseFloat(row['LaunchDirection']),
          date: new Date(row['Date']),
        }));
        resolve(shots);
      }
    });
  });
}
```

### 3.2 Metode 2: TrackMan Golf API (Auto)

```typescript
// lib/portal/trackman/api-client.ts

export class TrackManAPIClient {
  private baseUrl = 'https://api.trackmangolf.com/v1';
  
  constructor(private accessToken: string) {}
  
  async authenticate(credentials: TrackManCredentials): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const { access_token } = await response.json();
    return access_token;
  }
  
  async getSessions(startDate: Date, endDate: Date): Promise<TrackManSession[]> {
    const response = await fetch(
      `${this.baseUrl}/sessions?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      {
        headers: { 
          'Authorization': `Bearer ${this.accessToken}` 
        },
      }
    );
    
    return response.json();
  }
  
  async getShots(sessionId: string): Promise<TrackManShot[]> {
    const response = await fetch(
      `${this.baseUrl}/sessions/${sessionId}/shots`,
      {
        headers: { 
          'Authorization': `Bearer ${this.accessToken}` 
        },
      }
    );
    
    return response.json();
  }
  
  // Hovedfunksjon for auto-sync
  async syncAllData(since: Date): Promise<SyncResult> {
    const sessions = await this.getSessions(since, new Date());
    
    const allShots: TrackManShot[] = [];
    for (const session of sessions) {
      const shots = await this.getShots(session.id);
      
      // Annoter med kontekst fra session
      const annotatedShots = shots.map(s => ({
        ...s,
        context: this.inferContext(session),
        pressureLevel: this.inferPressure(session),
      }));
      
      allShots.push(...annotatedShots);
    }
    
    return {
      sessionsProcessed: sessions.length,
      shotsImported: allShots.length,
      shots: allShots,
    };
  }
  
  private inferContext(session: TrackManSession): ShotContext {
    // Analyser session metadata
    if (session.location?.includes('Range')) return 'TRAINING';
    if (session.mode === 'Simulator') return 'SIMULATION';
    if (session.tags?.includes('competition')) return 'COMPETITION';
    return 'TRAINING';
  }
  
  private inferPressure(session: TrackManSession): PressureLevel {
    // Sjekk tags eller notes
    if (session.tags?.includes('tournament')) return 5;
    if (session.tags?.includes('competition')) return 4;
    if (session.tags?.includes('pressure')) return 3;
    return 2; // Standard treningspress
  }
}
```

### 3.3 Metode 3: Direkte Integrasjon (Mulligan)

```typescript
// Mulighet for direkte integrasjon med vårt eget TrackMan

interface MulliganTrackManIntegration {
  // Siden vi eier/kontrollerer TrackMan-enheten på Mulligan,
  // kan vi ha direkte tilgang til data
  
  // Real-time data stream
  subscribeToLiveData(callback: (shot: TrackManShot) => void): void;
  
  // Historisk data
  getSessionHistory(playerId: string): Promise<TrackManSession[]>;
  
  // Automatisk tagging
  autoTagSessions(): void;
    // - "Practice" hvis range
    // - "Simulation" hvis bane-simulering
    // - "Pressure" hvis vi har M4/M5 miljø aktivert
}
```

---

## 4. DATA-TRANSFORMASJON

### 4.1 Normalisering av Kølle-Navn

```typescript
const CLUB_NAME_MAPPING = {
  // Driver varianter
  'DR': 'driver',
  'D': 'driver',
  'Driver': 'driver',
  '1W': 'driver',
  
  // Tre-woods
  '3W': '3-wood',
  '3 Wood': '3-wood',
  'FW3': '3-wood',
  
  // Hybrids
  '3H': '3-hybrid',
  '3 Rescue': '3-hybrid',
  '3 Utility': '3-hybrid',
  
  // Jerns
  '3I': '3-iron',
  '3 Iron': '3-iron',
  '3': '3-iron',
  
  '4I': '4-iron',
  '5I': '5-iron',
  '6I': '6-iron',
  '7I': '7-iron',
  '8I': '8-iron',
  '9I': '9-iron',
  
  // Wedges
  'PW': 'pitching-wedge',
  'P': 'pitching-wedge',
  'Pitching': 'pitching-wedge',
  
  'GW': 'gap-wedge',
  'G': 'gap-wedge',
  '52': 'gap-wedge',
  '52°': 'gap-wedge',
  
  'SW': 'sand-wedge',
  'S': 'sand-wedge',
  '56': 'sand-wedge',
  '56°': 'sand-wedge',
  
  'LW': 'lob-wedge',
  'L': 'lob-wedge',
  '60': 'lob-wedge',
  '60°': 'lob-wedge',
};

function normalizeClubName(trackManName: string): string {
  const normalized = trackManName.trim();
  return CLUB_NAME_MAPPING[normalized] || normalized.toLowerCase();
}
```

### 4.2 Data-Cleaning

```typescript
interface DataCleaningRules {
  // Fjern outliers
  removeOutliers: {
    enabled: true;
    method: 'IQR' | 'Z_SCORE' | 'MANUAL';
    threshold: 3;  // Z-score > 3 = outlier
  };
  
  // Kvalitetsfilter
  qualityFilter: {
    // Fjern dårlige slag
    minBallSpeed: {
      'driver': 140,    // km/h
      '7-iron': 95,
      'pitching-wedge': 65,
    };
    
    // Maks avvik fra gjennomsnitt
    maxDeviationFromMean: 0.3;  // 30%
  };
  
  // Minimum antall slag for pålitelig statistikk
  minShotsForAnalysis: 10;
}

function cleanTrackManData(
  shots: TrackManShot[],
  rules: DataCleaningRules
): TrackManShot[] {
  // 1. Grupper per kølle
  const byClub = groupBy(shots, 'club');
  
  const cleaned: TrackManShot[] = [];
  
  for (const [club, clubShots] of Object.entries(byClub)) {
    // 2. Beregn statistikk
    const stats = calculateStats(clubShots);
    
    // 3. Filtrer outliers
    const filtered = clubShots.filter(shot => {
      // Sjekk ball speed
      const minSpeed = rules.qualityFilter.minBallSpeed[club];
      if (shot.ballSpeed < minSpeed) return false;
      
      // Sjekk avvik
      const speedDeviation = Math.abs(shot.ballSpeed - stats.meanBallSpeed) / stats.meanBallSpeed;
      if (speedDeviation > rules.qualityFilter.maxDeviationFromMean) return false;
      
      return true;
    });
    
    // 4. Sjekk minimum antall
    if (filtered.length >= rules.minShotsForAnalysis) {
      cleaned.push(...filtered);
    }
  }
  
  return cleaned;
}
```

---

## 5. SPREDNINGS-KALKULASJON

### 5.1 Statistisk Beregning

```typescript
interface DispersionCalculation {
  club: string;
  context: ShotContext;
  
  // Rå data
  shots: TrackManShot[];
  
  // Beregnede verdier
  statistics: {
    // Distanse
    carryMean: number;
    carryStdDev: number;
    totalMean: number;
    totalStdDev: number;
    
    // Lateral (viktigst!)
    lateralMean: number;      // Systematisk bias (draw/fade)
    lateralStdDev: number;    // Spredning
    
    // Konfidensintervall (95%)
    lateral95: number;        // = lateralStdDev * 2
    distance95: number;       // = carryStdDev * 2
    
    // Shot shape
    typicalShape: 'DRAW' | 'FADE' | 'STRAIGHT';
    shapeBias: number;        // Gjennomsnittlig avvik
  };
}

function calculateDispersion(
  shots: TrackManShot[]
): ClubDispersion {
  // 1. Distanse-statistikk
  const carryValues = shots.map(s => s.carry);
  const carryMean = mean(carryValues);
  const carryStdDev = standardDeviation(carryValues);
  
  // 2. Lateral-statistikk
  const lateralValues = shots.map(s => s.lateral);
  const lateralMean = mean(lateralValues);  // Systematisk bias
  const lateralStdDev = standardDeviation(lateralValues);
  
  // 3. 95% konfidensintervall (2 sigma)
  const lateral95 = lateralStdDev * 2;
  const distance95 = carryStdDev * 2;
  
  // 4. Shot shape
  const shapeBias = lateralMean;
  let typicalShape: 'DRAW' | 'FADE' | 'STRAIGHT';
  
  if (shapeBias > 5) typicalShape = 'DRAW';
  else if (shapeBias < -5) typicalShape = 'FADE';
  else typicalShape = 'STRAIGHT';
  
  return {
    club: shots[0].club,
    carryDistance: carryMean,
    totalDistance: mean(shots.map(s => s.total)),
    dispersion: {
      lateral: lateralStdDev,
      distance: carryStdDev,
    },
    confidence95: {
      lateral: lateral95,
      distance: distance95,
    },
    typicalShape,
    shapeBias,
  };
}
```

### 5.2 Kontekst-Basert Spredning

```typescript
// Spredning varierer basert på kontekst!

async function calculateContextualDispersion(
  playerId: string
): Promise<ContextualDispersion> {
  // Hent all data
  const allShots = await getTrackManShots(playerId);
  
  // Separer på kontekst
  const byContext = {
    training: allShots.filter(s => s.context === 'TRAINING'),
    casual: allShots.filter(s => s.context === 'CASUAL'),
    competition: allShots.filter(s => s.context === 'COMPETITION'),
  };
  
  // Beregn per kontekst, per kølle
  const dispersion: ContextualDispersion = {};
  
  for (const [context, shots] of Object.entries(byContext)) {
    const byClub = groupBy(shots, 'club');
    
    dispersion[context] = {};
    
    for (const [club, clubShots] of Object.entries(byClub)) {
      if (clubShots.length >= 10) {  // Minimum for pålitelighet
        dispersion[context][club] = calculateDispersion(clubShots);
      }
    }
  }
  
  return dispersion;
}

// EKSEMPEL RESULTAT:
const exampleResult = {
  training: {
    '8-iron': {
      lateralStdDev: 6,      // 6m spredning på range
      confidence95: { lateral: 12 },
    },
    'driver': {
      lateralStdDev: 12,
      confidence95: { lateral: 24 },
    },
  },
  competition: {
    '8-iron': {
      lateralStdDev: 14,     // 14m spredning i turnering! (2.3x)
      confidence95: { lateral: 28 },
    },
    'driver': {
      lateralStdDev: 22,     // Nesten dobbel spredning!
      confidence95: { lateral: 44 },
    },
  },
};
```

---

## 6. KONTEXT-SEPARERING

### 6.1 Hvordan Separere Kontekst?

```typescript
// Problem: TrackMan vet ikke om det er "trening" eller "konkurranse"
// Løsning: Kombiner datakilder

interface ContextInference {
  // 1. Fra TrackMan metadata
  fromTrackMan: {
    location: string;           // "Range", "Simulator", "Course"
    sessionName: string;        // Spiller kan navngi
    tags: string[];             // "Practice", "Warmup", "Competition"
    notes: string;
  };
  
  // 2. Fra vår app
  fromOurApp: {
    roundType?: 'COMPETITION' | 'TRAINING';
    pressureLevel?: 1-5;
    mentalScorecard?: boolean;  // Hvis mental scorecard = høyere press
  };
  
  // 3. Fra spiller-input
  fromPlayer: {
    selfReportedContext: ShotContext;
    notes: string;
  };
  
  // Kombinert resultat
  inferredContext: ShotContext;
  confidence: number;           // 0-1
}

function inferContext(data: ContextInference): ShotContext {
  // Prioritet:
  // 1. Spillerens selv-rapportering
  if (data.fromPlayer.selfReportedContext) {
    return data.fromPlayer.selfReportedContext;
  }
  
  // 2. Vår app-data
  if (data.fromOurApp.roundType) {
    return data.fromOurApp.roundType;
  }
  
  // 3. TrackMan metadata
  if (data.fromTrackMan.tags?.includes('competition')) {
    return 'COMPETITION';
  }
  if (data.fromTrackMan.location === 'Range') {
    return 'TRAINING';
  }
  
  // 4. Default
  return 'TRAINING';
}
```

### 6.2 Tagging-System

```
SPILLER-TAGGING I APP:

Før TrackMan-session:
┌────────────────────────────────────────────────────────────────┐
│  🏷️ TAG DENNE SESSIONEN                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Type:                                                         │
│  (•) Trening på range                                          │
│  ( ) Simulator-runde                                           │
│  ( ) Forberedelse til turnering                                │
│  ( ) Konkurranse-simulering                                    │
│                                                                │
│  Press-nivå:                                                   │
│  [PR1] [PR2] [PR3] [PR4] [PR5]                                 │
│                                                                │
│  Notat: ________________________________________________       │
│                                                                │
│  [START TRACKMAN SESSION]                                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘

Dette vil bli lagret sammen med TrackMan-data for riktig kontekst.
```

---

## 7. BACKEND IMPLEMENTASJON

### 7.1 Database Schema

```prisma
// schema.prisma - TrackMan data

model TrackManImport {
  id          String   @id @default(cuid())
  playerId    String
  player      Player   @relation(fields: [playerId], references: [id])
  
  // Import metadata
  importDate  DateTime @default(now())
  source      String   // 'CSV_UPLOAD', 'API_SYNC', 'MULLIGAN_DIRECT'
  fileName    String?  // Hvis CSV
  
  // Rå data
  rawData     Json     // Alle slag fra import
  
  // Prosessert
  processed   Boolean  @default(false)
  processedAt DateTime?
  
  @@index([playerId])
}

model ClubDispersion {
  id          String   @id @default(cuid())
  playerId    String
  player      Player   @relation(fields: [playerId], references: [id])
  
  club        String
  context     String   // 'TRAINING', 'CASUAL', 'COMPETITION'
  
  // Distanse
  carryDistance   Float
  totalDistance   Float
  
  // Spredning (standardavvik)
  lateralStdDev   Float
  distanceStdDev  Float
  
  // 95% konfidens
  lateral95       Float
  distance95      Float
  
  // Shot shape
  typicalShape    String   // 'DRAW', 'FADE', 'STRAIGHT'
  shapeBias       Float    // Grader
  
  // Metadata
  sampleSize      Int      // Antall slag brukt
  lastCalculated  DateTime @default(now())
  
  @@unique([playerId, club, context])
  @@index([playerId])
}
```

### 7.2 Import-Service

```typescript
// lib/portal/trackman/import-service.ts

export class TrackManImportService {
  constructor(
    private prisma: PrismaClient,
    private calculationService: DispersionCalculationService
  ) {}
  
  async importCSV(
    playerId: string,
    file: File,
    metadata: ImportMetadata
  ): Promise<ImportResult> {
    // 1. Parse CSV
    const rawShots = await this.parseCSV(file);
    
    // 2. Lagre rå data
    const importRecord = await this.prisma.trackManImport.create({
      data: {
        playerId,
        source: 'CSV_UPLOAD',
        fileName: file.name,
        rawData: rawShots,
      },
    });
    
    // 3. Clean data
    const cleanedShots = this.cleanData(rawShots);
    
    // 4. Annoter med kontekst
    const annotatedShots = cleanedShots.map(s => ({
      ...s,
      context: metadata.context,
      pressureLevel: metadata.pressureLevel,
    }));
    
    // 5. Beregn spredning
    await this.calculationService.calculateAndStore(
      playerId,
      annotatedShots
    );
    
    // 6. Marker som prosessert
    await this.prisma.trackManImport.update({
      where: { id: importRecord.id },
      data: { processed: true, processedAt: new Date() },
    });
    
    return {
      importId: importRecord.id,
      shotsImported: annotatedShots.length,
      clubsUpdated: this.getUniqueClubs(annotatedShots),
    };
  }
  
  async syncFromAPI(
    playerId: string,
    credentials: TrackManCredentials
  ): Promise<SyncResult> {
    const client = new TrackManAPIClient();
    await client.authenticate(credentials);
    
    // Siste 30 dager
    const since = subDays(new Date(), 30);
    const syncData = await client.syncAllData(since);
    
    // Lagre og beregn
    await this.calculationService.calculateAndStore(
      playerId,
      syncData.shots
    );
    
    return syncData;
  }
  
  async getDispersionForContext(
    playerId: string,
    club: string,
    context: ShotContext
  ): Promise<ClubDispersion | null> {
    return this.prisma.clubDispersion.findUnique({
      where: {
        playerId_club_context: {
          playerId,
          club,
          context,
        },
      },
    });
  }
}
```

---

## 8. UI FOR IMPORT

### 8.1 Import-Skjerm

```
╔══════════════════════════════════════════════════════════════════╗
║  📊 TRACKMAN IMPORT                                             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─ METODE 1: LAST OPP CSV ───────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  [Dra CSV-fil hit]                                          │ ║
║  │  eller [Velg fil]                                           │ ║
║  │                                                             │ ║
║  │  Hvor kommer dataen fra?                                    │ ║
║  │  (•) TrackMan Performance Studio                            │ ║
║  │  ( ) TrackMan GO (Simulator)                                │ ║
║  │  ( ) Mulligan Indoor Golf                                   │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ METODE 2: KOBLE TIL TRACKMAN GOLF ────────────────────────┐ ║
║  │                                                             │ ║
║  │  Status: [🔴 Ikke koblet]                                  │ ║
║  │                                                             │ ║
║  │  [Koble til TrackMan Golf-konto]                           │ ║
║  │                                                             │ ║
║  │  Når koblet til:                                            │ ║
║  │  ✓ Automatisk sync hver natt                               │ ║
║  │  ✓ Henter siste 30 dager                                   │ ║
║  │  ✓ Du kan tagge sessions med kontekst                      │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ DIN SPREDNINGS-PROFIL ────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Sist oppdatert: 12. april 2026                            │ ║
║  │                                                             │ ║
║  │  Køller med data:                                           │ ║
║  │  • Driver:     245 slag (trening)  |  45 slag (konkurranse)│ ║
║  │  • 7-jern:     189 slag (trening)  |  32 slag (konkurranse)│ ║
║  │  • 56°:         98 slag (trening)  |  12 slag (konkurranse)│ ║
║  │                                                             │ 👮
║  │  ⚠️ Mål: Samle minst 30 slag per kølle per kontekst        │ ║
║  │                                                             │ ║
║  │  [SE FULL PROFIL]  [OPPDATER NÅ]                           │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ IMPORT-HISTORIKK ─────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  12.04  │ CSV │ 45 slag  │ Trening │ [Detaljer]           │ ║
║  │  08.04  │ API │ 123 slag │ Begge   │ [Detaljer]           │ ║
║  │  01.04  │ CSV │ 67 slag  │ Trening │ [Detaljer]           │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### 8.2 Preview etter Upload

```
╔══════════════════════════════════════════════════════════════════╗
║  🔍 FORHÅNDSVISNING - TRACKMAN IMPORT                           ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Fil: trackman_session_2026-04-12.csv                           ║
║  Totalt: 45 slag funnet                                         ║
║                                                                  ║
║  ┌─ IDENTIFISERTE KØLLER ─────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Kølle      │ Antall │ Avg Carry │ Spredning │ Status      │ ║
║  │  ───────────┼────────┼───────────┼───────────┼─────────────│ ║
║  │  Driver     │   15   │   235m    │   ±18m    │ ✅ OK       │ ║
║  │  7-jern     │   18   │   145m    │   ±8m     │ ✅ OK       │ ║
║  │  56° wedge  │   12   │    78m    │   ±5m     │ ✅ OK       │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ KONTekst FOR DENNE SESSION ───────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Hva slags økt var dette?                                   │ ║
║  │                                                             │ ║
║  │  (•) Trening på range (PR1-PR2)                            │ ║
║  │  ( ) Simulator med litt press (PR3)                        │ ║
║  │  ( ) Konkurranse-simulering (PR4-PR5)                      │ ║
║  │                                                             │ ║
║  │  Dette vil påvirke hvilken sprednings-profil dataen        │ ║
║  │  blir lagret under.                                        │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ RÅ DATA (første 5 slag) ──────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Club  │ Carry │ Lateral │ LaunchDir │ BallSpeed │ Spin    │ ║
║  │  ──────┼───────┼─────────┼───────────┼───────────┼─────────│ ║
║  │  7I    │ 143.2 │  -2.1   │   -1.8    │   102.5   │  6850   │ ║
║  │  7I    │ 146.8 │   3.5   │    2.9    │   104.2   │  6720   │ ║
║  │  7I    │ 141.5 │  -4.2   │   -3.5    │   101.8   │  6980   │ ║
║  │  ...   │  ...  │   ...   │    ...    │    ...    │   ...   │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  [✓ DATA SER KORREKT UT] [⚠️ NOEN AVVIK FUNNET]                ║
║                                                                  ║
║  [IMPORTER 45 SLAG] [AVBRYT]                                    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## OPPSUMMERING

### Tre Import-Metoder

1. **CSV Upload**: Manuell, fra TrackMan Performance Studio
2. **API Sync**: Automatisk, krever TrackMan Golf konto
3. **Mulligan Direct**: Potensiell fremtidig integrasjon

### Viktige Steg

1. Parse og normaliser kølle-navn
2. Clean data (fjern outliers)
3. Separer på kontekst (trening vs konkurranse)
4. Beregn spredning per kølle
5. Lagre 95% konfidensintervall
6. Gjør tilgjengelig for DECADE-caddy

### Mål

- Minimum 30 slag per kølle per kontekst
- Oppdateres regelmessig
- Brukes for personlig sprednings-beregning i DECADE
