# Database Schema Extensions
## For Shot-by-Shot & Test System

---

## Nye Modeller

```prisma
// ═══════════════════════════════════════════════════════════════
// 1. DETALJERT RUNDE-TRACKING (Shot-by-shot)
// ═══════════════════════════════════════════════════════════════

model Shot {
  id              String    @id @default(dbgenerated("(gen_random_uuid())::text"))
  holeResultId    String
  shotNumber      Int       // 1, 2, 3, etc.
  
  // Start-posisjon
  fromLie         String    // TEE, FAIRWAY, ROUGH, SAND, GREEN, RECOVERY, HAZARD
  fromDistance    Float     // Meter til pin
  fromElevation   String?   // UPHILL, DOWNHILL, FLAT
  
  // Klubb og intensjon
  club            String
  intendedShape   String?   // DRAW, FADE, STRAIGHT
  intendedDistance Float?   // Meter
  
  // Resultat
  toLie           String    // FAIRWAY, GREEN, ROUGH, SAND, HAZARD, OOB
  toDistance      Float     // Meter til pin etter slag
  proximity       Float?    // Hvis på green (meter fra hull)
  
  // Strokes Gained (beregnet)
  strokesGained   Float?    // +0.4, -0.2, etc.
  sgCategory      String?   // OTT, APP, ARG, PUTT
  
  // TrackMan-data (hvis tilgjengelig)
  trackmanData    Json?     // { ballSpeed, launchAngle, spin, etc. }
  
  createdAt       DateTime  @default(now())
  
  HoleResult      HoleResult @relation(fields: [holeResultId], references: [id], onDelete: Cascade)
  
  @@index([holeResultId])
  @@index([sgCategory])
}

// ═══════════════════════════════════════════════════════════════
// 2. TEST SYSTEM (Utbygd)
// ═══════════════════════════════════════════════════════════════

model TestDefinition {
  id              String       @id @default(dbgenerated("(gen_random_uuid())::text"))
  testNumber      Int          @unique
  slug            String       @unique
  name            String
  description     String
  category        String       // DRIVING, APPROACH, SHORT_GAME, PUTTING, BANE
  
  // Format
  format          String       // TRACKMAN, MANUAL_RANGE, MANUAL_COURSE, HYBRID
  unit            String       // meters, feet, percentage, strokes, score
  
  // DataGolf-sammenligning
  dgEndpoint      String?      // Hvilken DataGolf-metric å sammenligne med
  dgField         String?      // Feltet i responsen
  
  // Tour benchmarks (per kategori)
  benchmarks      Json         // { A: { tourMedian: 14.2, tourP90: 11.5 }, B: {...} }
  
  // Test-protokoll
  protocol        Json         // { shots: 10, distance: 100, conditions: "..." }
  
  // Krav for nivåer
  requirements    Json         // { Bronze: 50, Silver: 65, Gold: 80, Tour: 95 }
  
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  
  TestResult      TestResult[]
  TestSession     TestSession[]
}

model TestSession {
  id              String       @id @default(dbgenerated("(gen_random_uuid())::text"))
  userId          String
  testId          String
  
  // Når og hvor
  completedAt     DateTime     @default(now())
  location        String?      // "Mulligan Sarpsborg", "Oslo GK", etc.
  weather         String?      // SUNNY, CLOUDY, WINDY, RAIN
  
  // Utstyr
  usedTrackMan    Boolean      @default(false)
  trackmanId      String?      // Referanse til TrackMan-session
  
  // Resultat
  rawScore        Float        // Rå score (f.eks. 18.4 ft proximity)
  tourScore       Float?       // % av Tour (beregnet)
  roryScore       Float?       // % av Rory McIlroy's best
  categoryLevel   String?      // BRONZE, SILVER, GOLD, TOUR
  
  // Detaljer
  details         Json?        // { shots: [{distance: 16.2}, {...}] }
  
  // Metadata
  notes           String?
  videoUrls       String[]
  
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  test            TestDefinition @relation(fields: [testId], references: [id])
  
  @@index([userId])
  @@index([testId])
  @@index([completedAt])
}

// ═══════════════════════════════════════════════════════════════
// 3. BANE-KART
// ═══════════════════════════════════════════════════════════════

model CourseMap {
  id              String        @id @default(dbgenerated("(gen_random_uuid())::text"))
  courseId        String        @unique
  
  // Kilde
  source          String        // GOOGLE_MAPS, CLUB_PROVIDED, CROWDSOURCED
  accuracy        String?       // HIGH, MEDIUM, LOW
  
  // Hull-data
  holes           Json          // Se struktur under
  
  // Features
  features        Json?         // Bunkers, vann, trær som GeoJSON
  
  // Metadata
  lastVerifiedAt  DateTime?
  verifiedBy      String?
  
  updatedAt       DateTime      @updatedAt
  
  Course          Course        @relation(fields: [courseId], references: [id])
}

// Hull-struktur (JSON):
/*
{
  "holeNumber": 1,
  "par": 4,
  "tees": [
    { "color": "yellow", "lat": 59.9139, "lng": 10.7522, "elevation": 120 }
  ],
  "green": {
    "center": { "lat": 59.9145, "lng": 10.7530 },
    "polygon": [[...]],
    "diameter": 25
  },
  "features": [
    { "type": "bunker", "polygon": [...] },
    { "type": "water", "polygon": [...] }
  ],
  "pinPositions": [
    { "date": "2026-04-10", "lat": 59.9145, "lng": 10.7530 }
  ]
}
*/

// ═══════════════════════════════════════════════════════════════
// 4. KRAVPROFILER (Category Requirements)
// ═══════════════════════════════════════════════════════════════

model CategoryRequirement {
  id              String    @id @default(dbgenerated("(gen_random_uuid())::text"))
  
  category        String    // A, B, C, D, E, F, G, H, I, J, K
  handicapRange   Json      // [0, 5]
  
  // Driver
  driverCarry     Float?    // yards
  driverFairway   Float?    // %
  
  // Approach (proximity i feet)
  approach100     Float?    // 100 yards
  approach150     Float?    // 150 yards
  approach200     Float?    // 200 yards
  
  // Short game
  scrambling      Float?    // %
  sandSave        Float?    // %
  upAndDown       Float?    // %
  
  // Putting
  make3ft         Float?    // %
  make6ft         Float?    // %
  make10ft        Float?    // %
  puttsPerRound   Float?    // antall
  
  // Bane
  avgScore        Float?    // 72-hull
  sgTotal         Float?    // Strokes gained
  
  // Tester som må bestås
  requiredTests   Json      // [{ testId: "100m", minScore: 70 }]
  
  @@unique([category])
}

// ═══════════════════════════════════════════════════════════════
// 5. TRENINGSPROGRAM (Training Prescriptions)
// ═══════════════════════════════════════════════════════════════

model TrainingPrescription {
  id              String    @id @default(dbgenerated("(gen_random_uuid())::text"))
  userId          String
  
  // Gyldighetsperiode
  validFrom       DateTime
  validTo         DateTime
  
  // Basert på
  basedOnRounds   Int       // Antall runder analysert
  basedOnTests    Int       // Antall tester
  
  // Nåværende nivå
  currentCategory String
  targetCategory  String?
  
  // Fokusområder
  focusAreas      Json      // Se struktur under
  
  // Ukentlig plan
  weeklyPlan      Json      // Se struktur under
  
  // Mål
  goals           Json      // { sgTarget: -1.5, testImprovements: [...] }
  
  // Status
  status          String    @default("ACTIVE") // ACTIVE, COMPLETED, CANCELLED
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([status])
}

// focusAreas struktur:
/*
[
  {
    "area": "APPROACH",
    "priority": 9,
    "timeAllocation": 40, // %
    "reason": "Størst gap til neste nivå",
    "specificTests": ["100m", "150m"],
    "drills": [...]
  }
]
*/

// weeklyPlan struktur:
/*
{
  "weekNumber": 1,
  "totalHours": 4.5,
  "sessions": [
    {
      "day": "mon",
      "duration": 45,
      "type": "TRACKMAN",
      "focus": "APPROACH",
      "exercises": [...],
      "targetMetrics": [...]
    }
  ]
}
*/

// ═══════════════════════════════════════════════════════════════
// 6. SPILLER-PROGRESJON (Player Journey)
// ═══════════════════════════════════════════════════════════════

model PlayerMilestone {
  id              String    @id @default(dbgenerated("(gen_random_uuid())::text"))
  userId          String
  
  // Milepæl
  type            String    // CATEGORY_ADVANCEMENT, TEST_PASSED, TOUR_SCORE, HANDICAP_DROP
  category        String?   // Hvis kategori-endring
  
  // Verdi
  value           String    // "F→E", "70%", "15→12", etc.
  
  // Kontekst
  achievedAt      DateTime  @default(now())
  evidence        Json?     // { roundId: "...", testId: "..." }
  
  // Deling
  sharedOn        String[]  // INSTAGRAM, FACEBOOK, etc.
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([achievedAt])
}

// ═══════════════════════════════════════════════════════════════
// RELASJONS-OPPDATERINGER
// ═══════════════════════════════════════════════════════════════

// Legg til i eksisterende HoleResult:
model HoleResult {
  // ... eksisterende felter ...
  
  // Relasjon til shots
  Shot            Shot[]
  
  // Hurtig-SG (hvis ikke shot-by-shot)
  sgTotal         Float?
  sgOffTheTee     Float?
  sgApproach      Float?
  sgShortGame     Float?
  sgPutting       Float?
}

// Legg til i User-modellen:
model User {
  // ... eksisterende felter ...
  
  // Relasjoner til nye modeller
  TestSession         TestSession[]
  TrainingPrescription TrainingPrescription[]
  PlayerMilestone     PlayerMilestone[]
  
  // Nåværende nivå (denormalisert for rask tilgang)
  currentCategory     String    @default("K")
  currentTourScore    Float?    // % av Tour
  roryScore           Float?    // % av Rory
}
```

---

## Indekser for Performance

```sql
-- For rask SG-beregning
CREATE INDEX idx_shot_sg ON "Shot"(sgCategory, strokesGained);

-- For test-leaderboards
CREATE INDEX idx_test_session_score ON "TestSession"(testId, tourScore DESC);

-- For treningsplanlegging
CREATE INDEX idx_training_active ON "TrainingPrescription"(userId, status, validFrom, validTo);

-- For bane-kart
CREATE INDEX idx_course_map ON "CourseMap"(courseId) WHERE accuracy = 'HIGH';
```

---

## Migration Script

```typescript
// scripts/migrate-shot-tracking.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  // 1. Opprett CategoryRequirement for alle kategorier A-K
  await prisma.categoryRequirement.createMany({
    data: [
      {
        category: 'A',
        handicapRange: [0, 3],
        driverCarry: 290,
        driverFairway: 60,
        approach100: 15,
        approach150: 22,
        approach200: 35,
        scrambling: 65,
        sandSave: 50,
        make6ft: 75,
        make10ft: 40,
        puttsPerRound: 29,
        avgScore: 72,
        sgTotal: 0,
      },
      // ... Fyll inn for B-K
    ],
    skipDuplicates: true,
  });

  // 2. Opprett TestDefinitions
  await prisma.testDefinition.createMany({
    data: [
      {
        testNumber: 1,
        slug: 'driver-efficiency',
        name: 'Driver Efficiency',
        category: 'DRIVING',
        format: 'TRACKMAN',
        unit: 'score',
        dgEndpoint: '/preds/player-decompositions',
        dgField: 'sg_ott',
        benchmarks: {
          A: { tourMedian: 1.48, tourP90: 1.50 },
          B: { tourMedian: 1.46, tourP90: 1.48 },
          // ...
        },
        protocol: { shots: 10, club: 'Driver' },
        requirements: { Bronze: 50, Silver: 65, Gold: 80, Tour: 95 },
      },
      {
        testNumber: 2,
        slug: '100m-approach',
        name: '100m Approach Challenge',
        category: 'APPROACH',
        format: 'MANUAL_RANGE',
        unit: 'feet',
        dgEndpoint: '/preds/approach-skill',
        dgField: '100-125',
        benchmarks: {
          A: { tourMedian: 14.2, tourP90: 11.0 },
          B: { tourMedian: 17.0, tourP90: 13.5 },
          C: { tourMedian: 21.0, tourP90: 17.0 },
          D: { tourMedian: 26.0, tourP90: 21.0 },
          E: { tourMedian: 32.0, tourP90: 26.0 },
          F: { tourMedian: 40.0, tourP90: 32.0 },
        },
        protocol: { shots: 10, distance: 100, target: 'circle-20ft' },
        requirements: { Bronze: 40, Silver: 55, Gold: 70, Tour: 90 },
      },
      // ... Flere tester
    ],
    skipDuplicates: true,
  });

  console.log('Migration complete!');
}

migrate().catch(console.error);
```

---

## Neste steg

1. Kjør `npx prisma migrate dev --name shot_tracking_tests`
2. Kjør migration script
3. Implementer API-endepunkter
4. Bygg UI-komponenter
