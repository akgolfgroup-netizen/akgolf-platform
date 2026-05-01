# AK Golf — Adaptiv Treningsmotor (Masterplan)

**Dato:** 2026-05-01
**Status:** Klar for autonom utfoering (Kimi Code YOLO)
**Forfatter:** Anders + Claude (brainstorming-skill, 3-timers samtale 2026-05-01)
**Scope:** Onboarding-utvidelse, allokerings-motor, plan-generator, kalender-integrasjon, coach-agent, GDPR, sidebar-konsolidering

> **For den autonome utvikleren (Kimi):**
> 1. Les hele dette dokumentet for du starter.
> 2. Folg fasene 1-10 i rekkefolge. Hver fase har explisitte filer som skal endres.
> 3. Etter hver fase: kjor `npx tsc --noEmit` og `npx eslint <endrede filer>`. Fiks feil for du gar videre.
> 4. Commit etter hver fase med format `feat(allokering): Fase X — <kort beskrivelse>`.
> 5. Hvis du moter et "TBD" eller "PLACEHOLDER" — bruk default-verdiene i spec-en. Anders justerer senere.
> 6. Aldri rør Mapbox-relaterte filer (pre-existing TS-feil, urelaterte).

---

## DEL 1 — Kontekst

AK Golf har i dag en treningsplattform med treningsplan-maler, ovelse-bibliotek og delvis SG-tagging.
Det som mangler er **motoren** som binder spillerdata til personlig plan-generering.

Denne masterplanen bygger den motoren + tilhorende UI/UX, basert pa beslutninger tatt i brainstorming-samtale 2026-05-01.

### Sentrale konsepter (oppsummering)

1. **Hybrid allokerings-motor** — regelbasert TypeScript-funksjon som baseline + AI for nyanser (margin-justeringer)
2. **Cold-start hybrid** — HCP-baseline + ett svakhets-sporsmal + valgfri data-import (GolfBox CSV / scorecard-foto / Arccos)
3. **Periodisering med turneringsoverride** — sesong-default + turneringer skaper taper-fase
4. **Hjemmebane-justert distance-vekting** — kort hjemmebane => mer wedger
5. **ClubSpeed-profil** — baseline-test gir % av CS automatisk i ovelser (cold-start: HCP-snitt)
6. **Progressive onboarding (B+C)** — minimumspakke (~60 sek) for selvbetjent + coach-onboarding for AK-elever
7. **Privacy-modell** — `CoachAssignment` styrer synlighet i CoachHQ (default: usynlig)
8. **GDPR 4-tier samtykke** — Tier 1 nodvendig, Tier 2 default-pa anonymisert, Tier 3+4 opt-in
9. **Replanlegging** — sondag kveld scheduled + event-drevet (nye tester, runder, mal-endring)
10. **Coach-agent** — coach beskriver spillersituasjon i fri tekst, AI genererer plan-forslag
11. **Kalender-aggregator** — viser individuell plan + gruppeplaner + turneringer
12. **Sidebar-konsolidering** — felles grunnstruktur for PlayerHQ og CoachHQ

---

## DEL 2 — Datamodell-endringer (Prisma)

Disse legges til `prisma/schema.prisma`. Migrasjonen kjores via `DIRECT_URL` (port 5432), ikke pooler.

### 2.1 HomeCourse (ny)

```prisma
model HomeCourse {
  id                          String   @id @default(cuid())
  userId                      String   @unique
  user                        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseName                  String
  golfboxId                   String?  // for fremtidig GolfBox-integrasjon
  totalLengthMeters           Int
  par                         Int
  holes                       Json     // [{ hole: 1, par: 4, lengthMeters: 380 }, ...]
  dominantApproachBuckets     Json     // beregnet, cached: { "50-100": 0.25, "100-150": 0.40, ... }
  createdAt                   DateTime @default(now())
  updatedAt                   DateTime @updatedAt
  @@index([userId])
}
```

### 2.2 ClubSpeedProfile (ny)

```prisma
model ClubSpeedProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  source          ClubSpeedSource
  measuredAt      DateTime @default(now())
  testResultId    String?  // FK til TestResult (baseline-test)
  clubs           Json     // { driver: { fullCS: 153, carry: 245 }, "7iron": { fullCS: 113, carry: 160 }, ... }
  validUntil      DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  @@index([userId])
}

enum ClubSpeedSource {
  BASELINE_TEST
  MANUAL
  HCP_AVERAGE
}
```

### 2.3 CoachAssignment (ny)

```prisma
model CoachAssignment {
  id          String                  @id @default(cuid())
  userId      String                  // eleven
  user        User                    @relation("CoachAssignmentUser", fields: [userId], references: [id], onDelete: Cascade)
  coachId     String                  // coach
  coach       User                    @relation("CoachAssignmentCoach", fields: [coachId], references: [id], onDelete: Cascade)
  status      CoachAssignmentStatus   @default(ACTIVE)
  scope       CoachAssignmentScope    @default(FULL)
  createdBy   CoachAssignmentSource
  startedAt   DateTime                @default(now())
  endedAt     DateTime?
  notes       String?
  @@index([userId, status])
  @@index([coachId, status])
}

enum CoachAssignmentStatus { ACTIVE PAUSED ENDED }
enum CoachAssignmentScope  { FULL READ_ONLY PLAN_ONLY }
enum CoachAssignmentSource { BOOKING SUBSCRIPTION MANUAL_GRANT }
```

### 2.4 ConsentGrant + DataAccessLog (ny)

```prisma
model ConsentGrant {
  id            String        @id @default(cuid())
  userId        String
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  tier          ConsentTier
  granted       Boolean
  grantedAt     DateTime      @default(now())
  revokedAt     DateTime?
  policyVersion String        @default("1.0")
  source        ConsentSource
  ipAddress     String?
  @@index([userId, tier])
}

model DataAccessLog {
  id            String       @id @default(cuid())
  userId        String
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessedBy    AccessorType
  accessedById  String?
  purpose       String
  fields        String[]
  occurredAt    DateTime     @default(now())
  @@index([userId, occurredAt])
}

enum ConsentTier   { TIER_1_SERVICE TIER_2_IMPROVEMENT TIER_3_AI_RESEARCH TIER_4_COMMERCIAL }
enum ConsentSource { ONBOARDING PROFILE_PAGE PARENTAL_CONSENT API }
enum AccessorType  { COACH ADMIN AI_PIPELINE SYSTEM USER }
```

### 2.5 PlayerAllocation (ny — output cache)

```prisma
model PlayerAllocation {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  generatedAt       DateTime @default(now())
  validFrom         DateTime
  validTo           DateTime
  weeklyHours       Float
  weeks             Json     // WeeklyAllocation[]
  rationale         String[] // bullet-liste
  source            AllocationSource
  inputSnapshot     Json     // hele input-objektet for sporbarhet
  rationaleAi       String?  // AI-justeringskommentar (Tier 3 hybrid)
  @@index([userId, generatedAt])
}

enum AllocationSource { SELF_RATED HCP_BASELINE IMPORTED }
```

### 2.6 CalendarEvent (ny — samlet)

```prisma
model CalendarEvent {
  id          String              @id @default(cuid())
  userId      String
  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  source      CalendarEventSource
  sourceId    String              // FK-id til original entity
  title       String
  startsAt    DateTime
  endsAt      DateTime
  location    String?
  notes       String?
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
  @@index([userId, startsAt])
  @@unique([userId, source, sourceId])
}

enum CalendarEventSource {
  TRAINING_SESSION_INDIVIDUAL
  TRAINING_SESSION_GROUP
  TOURNAMENT
  BOOKING
}
```

### 2.7 TrainingGroup + TrainingGroupMembership (ny)

```prisma
model TrainingGroup {
  id          String                    @id @default(cuid())
  name        String
  description String?
  coachId     String?
  coach       User?                     @relation(fields: [coachId], references: [id])
  createdAt   DateTime                  @default(now())
  members     TrainingGroupMembership[]
}

model TrainingGroupMembership {
  id        String        @id @default(cuid())
  userId    String
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  groupId   String
  group     TrainingGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  joinedAt  DateTime      @default(now())
  active    Boolean       @default(true)
  @@unique([userId, groupId])
  @@index([groupId])
}
```

### 2.8 TournamentRegistration (utvid eksisterende eller opprett)

```prisma
model TournamentRegistration {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  startsAt    DateTime
  endsAt      DateTime?
  course      String?
  importance  Int      // 1-5 (NM=5, klubbmesterskap=3, vanlig=2)
  notes       String?
  createdAt   DateTime @default(now())
  @@index([userId, startsAt])
}
```

### 2.9 CoachAgentSession (ny)

```prisma
model CoachAgentSession {
  id          String   @id @default(cuid())
  coachId     String
  coach       User     @relation("CoachAgentSessionCoach", fields: [coachId], references: [id])
  studentId   String
  student     User     @relation("CoachAgentSessionStudent", fields: [studentId], references: [id])
  prompt      String
  response    String
  appliedPlanId String? // FK til generated plan (TrainingPlan)
  createdAt   DateTime @default(now())
  @@index([coachId, createdAt])
  @@index([studentId])
}
```

### 2.10 ExerciseDefinition (utvid eksisterende)

Legg til kolonner:

```prisma
csTargetMin       Int?     // 60 = 60% av spillerens ClubSpeed
csTargetMax       Int?     // 70 = 70%
clubKey           String?  // "driver", "7iron", "pw", etc.
distanceBucket    String?  // "50-100", "100-150", "150-200", "200+", "tee", "putting"
```

### 2.11 User (utvid)

Legg til (om ikke allerede tilstede):

```prisma
averageScore      Float?
ageYears          Int?
weeklyTrainingHours Float?
homeCourseId      String?  // 1:1-rel via HomeCourse.userId, men cache her for raske queries
playerType        PlayerType @default(HOBBY)

// nye relasjoner
homeCourse              HomeCourse?
clubSpeedProfile        ClubSpeedProfile?
allocations             PlayerAllocation[]
consentGrants           ConsentGrant[]
dataAccessLogs          DataAccessLog[]
calendarEvents          CalendarEvent[]
groupMemberships        TrainingGroupMembership[]
tournamentRegistrations TournamentRegistration[]
coachAssignmentsAsStudent CoachAssignment[] @relation("CoachAssignmentUser")
coachAssignmentsAsCoach   CoachAssignment[] @relation("CoachAssignmentCoach")
agentSessionsAsCoach     CoachAgentSession[] @relation("CoachAgentSessionCoach")
agentSessionsAsStudent   CoachAgentSession[] @relation("CoachAgentSessionStudent")
```

```prisma
enum PlayerType { HOBBY SCORE_REDUCTION TOURNAMENT FITNESS }
```

---

## DEL 3 — AK-formler (placeholders)

> Disse er rimelige defaults. Anders justerer i en egen "tuning"-pass.
> Filer hvor formlene bor: `lib/portal/allocation/formulas.ts`

### 3.1 HCP-baseline allokering

```ts
// fra HCP -> base %fordeling per pyramid-omrade
const HCP_BASELINE_ALLOCATION = {
  hcp_0_5:   { fysisk: 15, teknikk: 20, slag: 30, spill: 25, mental: 10 },
  hcp_6_12:  { fysisk: 15, teknikk: 25, slag: 30, spill: 22, mental: 8 },
  hcp_13_20: { fysisk: 15, teknikk: 25, slag: 28, spill: 25, mental: 7 },
  hcp_21_30: { fysisk: 18, teknikk: 30, slag: 22, spill: 25, mental: 5 },
  hcp_31_54: { fysisk: 20, teknikk: 35, slag: 18, spill: 22, mental: 5 },
};
```

### 3.2 Svakhets-skew

Ett svakhetssvar gir +15 prosentpoeng til det omradet, jevnt fratrukket fra de andre:

```ts
const WEAKNESS_SKEW = 15;
// "approach" -> +15 til SLAG (innspill 100-200), -3.75 til hver av de fire andre
```

### 3.3 Periodisering (4 + taper)

```ts
const PHASE_MULTIPLIERS = {
  off_season:   { fysisk: 1.5, teknikk: 1.3, slag: 0.6, spill: 0.5, mental: 1.0 },
  forberedelse: { fysisk: 1.0, teknikk: 1.4, slag: 1.0, spill: 0.8, mental: 1.0 },
  sesong:       { fysisk: 0.7, teknikk: 0.7, slag: 1.2, spill: 1.4, mental: 1.1 },
  avslutning:   { fysisk: 1.0, teknikk: 0.8, slag: 0.9, spill: 1.0, mental: 1.3 },
  taper:        { fysisk: 0.5, teknikk: 0.4, slag: 1.3, spill: 1.5, mental: 1.5 },
};
```

Etter multiplikasjon, normaliseres summen tilbake til 100%.

### 3.4 Hjemmebane distance-vekting

Algoritme i `lib/portal/golf/distance-buckets.ts`:

```ts
function computeDominantBuckets(homeCourse: HomeCourse, csProfile: ClubSpeedProfile): DistanceVector {
  const buckets: Record<string, number> = { tee: 0, "200+": 0, "150-200": 0, "100-150": 0, "50-100": 0, "<50": 0 };
  const driverCarry = csProfile.clubs.driver?.carry ?? 200;

  for (const hole of homeCourse.holes) {
    if (hole.par === 3) {
      placeBucket(buckets, hole.lengthMeters, 1);
      continue;
    }
    if (hole.par === 4) {
      const approachDist = Math.max(50, hole.lengthMeters - driverCarry);
      placeBucket(buckets, approachDist, 1);
      buckets.tee += 1;
      continue;
    }
    if (hole.par === 5) {
      const second = Math.max(50, hole.lengthMeters - driverCarry);
      const third = Math.max(50, second - 200);  // antar 5-jern paa 2nd
      placeBucket(buckets, third, 1);
      buckets.tee += 1;
      continue;
    }
  }
  return normalizeToPercent(buckets);
}
```

### 3.5 Sesong-default (norsk klima)

```ts
const SEASON_BY_MONTH: Record<number, Phase> = {
  1: "off_season", 2: "off_season", 3: "off_season",
  4: "forberedelse", 5: "forberedelse",
  6: "sesong", 7: "sesong", 8: "sesong", 9: "sesong",
  10: "avslutning",
  11: "off_season", 12: "off_season",
};
```

### 3.6 Turnering-taper

For hver `TournamentRegistration`:
- Hvis `startsAt - now >= 28 dager`: marker uke `[startsAt - 28d, startsAt]` som `taper`
- Hvis `<28 dager`: marker resterende uker som `taper-short`, ingen full re-allokering
- Ved overlapp: prioriter taperen for hoyest `importance`

---

## DEL 4 — Tjenester (services)

### 4.1 `lib/portal/allocation/engine.ts`

```ts
export interface AllocationInput {
  userId: string;
  hcp: number;
  weeklyHours: number;
  age: number;
  goal: PlayerType;
  homeCourse: HomeCourseData;
  selfRated?: { tee: 1|2|3|4|5; approach: 1|2|3|4|5; arg: 1|2|3|4|5; putting: 1|2|3|4|5 };
  weakestArea?: "tee" | "approach" | "arg" | "putting";
  importedSG?: { tee: number; approach: number; arg: number; putting: number; samples: number };
  clubSpeedProfile: ClubSpeedProfileData;
  upcomingTournaments: TournamentData[];
  planHorizonWeeks: number;  // 1, 4, 12, 26, 52
}

export interface WeeklyAllocation {
  weekStart: Date;
  phase: Phase;
  triggers: string[];
  allocation: {
    fysisk: number;
    teknikk: number;
    slag: { tee: number; "200+": number; "150-200": number; "100-150": number; "50-100": number };
    spill: { putting: number; chipping: number; bunker: number; banetrening: number };
    mental: number;
  };
  csContext: { source: ClubSpeedSource; lastUpdated: Date };
}

export interface AllocationOutput {
  weeks: WeeklyAllocation[];
  rationale: string[];
  source: AllocationSource;
}

export async function computeAllocation(input: AllocationInput): Promise<AllocationOutput>;
```

Algoritme:
1. Bestem source (importedSG > selfRated > weakestArea > pure HCP-baseline)
2. Hent baseline fra `HCP_BASELINE_ALLOCATION`
3. Apply skew (svakhet eller importert SG)
4. Beregn dominante distance-buckets for SLAG-omradet (gjenbrukes pa alle uker, oppdateres bare ved hjemmebane-endring)
5. For hver uke i horisonten: bestem fase -> apply `PHASE_MULTIPLIERS` -> normaliser -> bygg `WeeklyAllocation`
6. Apply turnering-taper-overrides
7. Returner `AllocationOutput`

Persistering: kaller skriver `PlayerAllocation` til DB.

### 4.2 `lib/portal/golf/clubspeed-resolver.ts`

```ts
export function resolveCSTarget(
  exercise: ExerciseDefinition,
  profile: ClubSpeedProfile,
): { mphMin: number; mphMax: number; carryMin: number; carryMax: number } | null;

export function getOrFallbackProfile(
  user: User,
): Promise<ClubSpeedProfile>;  // returnerer ekte profil eller HCP-snitt-fallback
```

Cold-start lookup: `lib/portal/golf/clubspeed-benchmarks.ts` med snittall per HCP-bucket.

### 4.3 `lib/portal/training/plan-generator.ts` (utvid eksisterende)

Tar `PlayerAllocation` + `ExerciseDefinition[]` -> genererer `TrainingPlan` med `TrainingSession`s og `SessionExercise`s.

API:
```ts
export async function generatePlan(opts: {
  userId: string;
  horizon: "session" | "week" | "month" | "period" | "year";
  startDate: Date;
  forceRecompute?: boolean;
}): Promise<TrainingPlan>;
```

Algoritme:
1. Hent (eller beregn) `PlayerAllocation` for horisonten
2. For hver uke: konverter %-fordeling til konkrete okt-typer (timer/uke / ant okter)
3. For hver okt: velg ovelser fra `ExerciseDefinition` matchende omrade + distance-bucket + L-fase
4. Resolve CS-targets med `clubspeed-resolver`
5. Persister til DB
6. Trigger `calendar-sync` (se 4.4)

### 4.4 `lib/portal/calendar/aggregator.ts` (ny)

```ts
export async function syncUserCalendar(userId: string, opts?: { fromDate?: Date; toDate?: Date }): Promise<void>;
export async function getCalendarEvents(userId: string, opts: { fromDate: Date; toDate: Date }): Promise<CalendarEvent[]>;
```

Holder `CalendarEvent`-tabellen synkronisert med:
- `TrainingSession` (individuelle, source=`TRAINING_SESSION_INDIVIDUAL`)
- `TrainingSession` med `groupId` (source=`TRAINING_SESSION_GROUP`)
- `TournamentRegistration` (source=`TOURNAMENT`)
- `Booking` (source=`BOOKING`)

Idempotent: `@@unique([userId, source, sourceId])` sikrer at re-sync ikke duplerer.

### 4.5 `lib/portal/agents/coach-plan-agent.ts` (ny)

```ts
export interface CoachAgentRequest {
  coachId: string;
  studentId: string;
  prompt: string;  // f.eks. "Erik har vondt i ryggen, kutt fysisk denne uken og ha 2x bana i stedet"
}

export interface CoachAgentResponse {
  reasoning: string;          // hva agent forstod
  proposedChanges: PlanDiff;  // konkrete endringer
  suggestedAllocation: WeeklyAllocation; // ny weekly-allocation om relevant
}

export async function runCoachAgent(req: CoachAgentRequest): Promise<CoachAgentResponse>;
export async function applyCoachAgentResponse(sessionId: string, accept: boolean): Promise<void>;
```

Implementasjon:
- Bruker Anthropic Claude Sonnet 4.6 (`claude-sonnet-4-6`)
- System prompt inneholder: AK-taxonomy, spillerprofil, naavarende plan, allokering, AK-metodikk-utdrag
- Tools: `update_weekly_allocation`, `swap_session_focus`, `add_recovery_day`, `cancel_session`
- Coach godkjenner/avviser i UI for endringer skrives til DB
- Lagrer `CoachAgentSession` for historikk

### 4.6 `lib/portal/consent.ts` (ny)

```ts
export async function hasConsent(userId: string, tier: ConsentTier): Promise<boolean>;
export async function grantConsent(userId: string, tier: ConsentTier, source: ConsentSource): Promise<void>;
export async function revokeConsent(userId: string, tier: ConsentTier): Promise<void>;
export async function logDataAccess(opts: { userId: string; accessor: AccessorType; accessorId?: string; purpose: string; fields: string[] }): Promise<void>;

// Pipeline-hjelper:
export async function filterByConsent<T extends { userId: string }>(items: T[], tier: ConsentTier): Promise<T[]>;
```

Alle Tier 2/3/4-pipelines (analytics-CRON, AI-trening, eksport) MA gå gjennom denne.

---

## DEL 5 — API / Server actions

### 5.1 Onboarding-utvidelse

Filer: `app/portal/(dashboard)/onboarding/`

Steg (5 totalt, opp fra 4):
1. **Mal** (eksisterende) - hovedmal + 1-3 sub-mal
2. **Treningsfrekvens + tilgjengelig tid** (eksisterende) - timer/uke
3. **Spillerprofil** (NY) - HCP, snittscore, alder, spillertype
4. **Hjemmebane** (NY) - velg fra GolfBox-API eller legg inn manuelt (lengde + par per hull, eller importer GolfBox-profilen)
5. **Cold-start data** (NY) - velg en av:
   - "Ranger styrkene mine" (selvrapport)
   - "Min storste svakhet er ___" (1 sporsmal)
   - "Last opp historikk" (CSV/foto/Arccos)
6. **Samtykker** (NY, men inline med steg 5) - 2 toggle (Tier 2 default-pa, Tier 3 default-av)

Etter steg 5: kall `computeAllocation()` automatisk og generer forste-uke-plan.

### 5.2 Coach-agent UI

Rute: `/admin/elever/[id]/coach-agent`

Komponent: `components/admin/coach-agent/CoachAgentChat.tsx`
- Chat-grensesnitt (likt eksisterende `/admin/ai-assistent`)
- Hver melding fra agent viser foreslatt plan-diff i sidepanel
- "Godta" / "Avvis"-knapp per forslag
- Lagrer alle sesjoner i `CoachAgentSession`

### 5.3 Kalender (PlayerHQ)

Rute: `/portal/kalender` (eksisterende, oppgrader)

Komponent: `components/portal/calendar/PlayerCalendar.tsx`
- Maned-/uke-/dag-visning
- Filter-toggles: Individuell / Gruppe / Turnering / Booking
- Klikk pa event aapner detaljpanel
- Drag-to-reschedule (kun individuelle okter, ikke gruppe/turnering)
- Re-bestilling kaller `replanFutureWeeks()` for berorte uker

### 5.4 Kalender (CoachHQ)

Rute: `/admin/kalender` (eksisterende, oppgrader)

Komponent: `components/admin/calendar/CoachCalendar.tsx`
- Coach ser KUN egne tildelte elever (gjennom `CoachAssignment`)
- Multi-elev-overlay: velg flere elever, se alle bookinger samtidig
- Klikk pa elev-okt apner spillerdetalj-modal med plan-info

### 5.5 Privacy-ruter

- `/portal/profil/personvern` (NY) - per-tier-toggler, last ned alle data, slett konto
- `/personvern` (oppdater) - full policy med tier-beskrivelse
- `/vilkar` (oppdater) - eksplisitt avsnitt om data-bruk

### 5.6 Replanlegging-CRON

Ny: `app/api/portal/cron/weekly-replan/route.ts`
- Schedule: sondag 22:00 UTC (Vercel cron)
- For hver aktiv bruker: sammenlign cached `PlayerAllocation` mot ny beregning. Hvis forskjell ≥10% pa noen omrade, regenerer + varsel til spiller.
- Logger til `AgentLog`.

Event-drevne triggere (eksisterende mekanikk i `lib/portal/training/`):
- Ny `TestResult` lagret -> `recomputeAllocation(userId)` hvis testen er SG-relatert eller baseline
- Ny `Round` logget -> samme
- `User.homeCourseId` endret -> samme
- `User.playerType` eller `weeklyTrainingHours` endret -> samme
- Ny `TournamentRegistration` -> `replanFutureWeeks()` for berorte uker

---

## DEL 6 — Sidebar-konsolidering

Mal: redusere kognitiv belastning ved a la PlayerHQ og CoachHQ dele samme grunnstruktur.

### 6.1 Felles topp-nivaer

Begge sidebars har disse 5 hovedseksjonene i samme rekkefolge:

| # | Ikon | PlayerHQ-tittel | CoachHQ-tittel | Mal |
|---|---|---|---|---|
| 1 | Home | Dashboard | Dagens fokus | Personlig oversikt |
| 2 | Calendar | Kalender | Kalender | Tid og planer |
| 3 | TrendingUp | Min plan | Coaching Board | Plan-arbeid |
| 4 | BarChart3 | Statistikk | Analyse | Data og innsikt |
| 5 | Settings | Innstillinger | Innstillinger | Konfigurasjon |

### 6.2 Sub-meny per side

**PlayerHQ Dashboard:**
- Forsiden, Profil, AI Coach

**PlayerHQ Kalender:**
- Min kalender, Bookinger, Turneringsplan, Grupper

**PlayerHQ Min plan:**
- Aktiv okt, Ukeplan, Periode, Aarsplan, Tester, Tekstisk plan

**PlayerHQ Statistikk:**
- Sammendrag, Runder, TrackMan, Mental, Coaching-historikk

**PlayerHQ Innstillinger:**
- Konto, Personvern, Abonnement, Foreldre, Sosialt, Meldinger

---

**CoachHQ Dagens fokus:**
- Hub, Mission Board, Denne uken, Godkjenninger

**CoachHQ Kalender:**
- Egen kalender, Bookinger, Tilgjengelighet, Kapasitet, Fasiliteter

**CoachHQ Coaching Board:**
- Aktive okter, Spillere, Treningsplaner, Planmaler, Coach-agent

**CoachHQ Analyse:**
- Analytics, Rapporter, Talent, Innholdsbibliotek

**CoachHQ Innstillinger:**
- Team, Audit, Tjenester, Lokasjoner, Baner, Agenter, E-postmaler

### 6.3 Implementasjon

- Ny: `components/shared/AppSidebar.tsx` - delt komponent, tar `mode: "player" | "coach"` og en `nav: NavItem[]`
- Eksisterende sidebars (`components/portal/layout/sidebar.tsx`, `components/admin/CoachHQSidebar.tsx`) refactor til wrappere som kaller AppSidebar med riktig nav-config
- Begge bruker samme struktur: collapsed (56px) / expanded (240px), expandable seksjon med 5 hovedpunkter
- Felles design-tokens (Brand Guide V2.0) - `bg-sidebar`, `text-sidebar`, etc.

---

## DEL 7 — Implementasjons-faser

> **For Kimi YOLO:** Folg disse i rekkefolge. Commit etter hver fase.

### Fase 1 - Datamodell + migrasjon (1-2 timer)

1. Oppdater `prisma/schema.prisma` med alle modeller fra DEL 2
2. Lag migration: `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script > supabase/migrations/<timestamp>_adaptiv_treningsmotor.sql`
3. Kjør migration: `DATABASE_URL="$(grep '^DIRECT_URL=' .env | cut -d= -f2- | tr -d '"')" npx prisma migrate deploy`
4. `npx prisma generate`
5. Commit: `feat(allokering): Fase 1 — datamodell for adaptiv treningsmotor`

### Fase 2 - Privacy/Consent (2-3 timer)

1. `lib/portal/consent.ts` - service-API
2. `app/portal/profil/personvern/page.tsx` - UI
3. `app/personvern/page.tsx` - oppdater public policy
4. `app/vilkar/page.tsx` - oppdater terms
5. Onboarding consent-toggles (steg 6)
6. Commit: `feat(consent): Fase 2 — GDPR 4-tier samtykke`

### Fase 3 - Onboarding-utvidelse (3-4 timer)

1. Utvid `app/portal/(dashboard)/onboarding/` med 3 nye steg
2. `lib/portal/golf/golfbox-importer.ts` - GolfBox CSV-import (placeholder hvis API mangler)
3. `lib/portal/golf/scorecard-photo-parser.ts` - GPT-4 Vision OCR
4. `app/portal/(dashboard)/onboarding/actions.ts` - oppdater for nye steg
5. Commit: `feat(onboarding): Fase 3 — utvidet 6-stegs onboarding med cold-start-data`

### Fase 4 - Allokerings-motor (3-4 timer)

1. `lib/portal/allocation/formulas.ts` - alle konstanter fra DEL 3
2. `lib/portal/golf/distance-buckets.ts` - hjemmebane-beregning
3. `lib/portal/golf/clubspeed-benchmarks.ts` - HCP-snitt-tabell
4. `lib/portal/golf/clubspeed-resolver.ts` - CS-oppslag
5. `lib/portal/allocation/engine.ts` - hovedmotor (`computeAllocation`)
6. Unit-tester i `__tests__/allocation/`:
   - HCP-baseline gir korrekt sum til 100%
   - Svakhets-skew gir +15pp til riktig omrade
   - Periodisering normaliserer korrekt
   - Distance-buckets summerer til 100% gitt par-3/4/5-mix
   - Turnering-taper triggrer pa rett dato
7. Commit: `feat(allokering): Fase 4 — regelmotor for SG-basert tidsallokering`

### Fase 5 - Plan-generator (3-4 timer)

1. Utvid `lib/portal/training/plan-generator.ts` med `generatePlan()`
2. Logikk for okt-distribusjon basert paa allokering
3. Logikk for ovelses-utvalg basert paa omrade + distance-bucket + L-fase
4. CS-target-resolution per ovelse
5. Persister TrainingPlan + Sessions + SessionExercises
6. Trigger calendar-sync etter generering
7. Commit: `feat(plan): Fase 5 — plan-generator basert paa allokerings-output`

### Fase 6 - Kalender-aggregator + UI (4-5 timer)

1. `lib/portal/calendar/aggregator.ts` - syncer alle 4 kilder til CalendarEvent
2. `app/api/portal/calendar/route.ts` - GET endpoint for events i datoområde
3. `components/portal/calendar/PlayerCalendar.tsx` - PlayerHQ-kalender
4. `components/admin/calendar/CoachCalendar.tsx` - CoachHQ-kalender
5. Drag-to-reschedule for individuelle okter
6. Filter-toggles (Individuell/Gruppe/Turnering/Booking)
7. Commit: `feat(kalender): Fase 6 — samlet kalender med 4-kilders-aggregering`

### Fase 7 - Coach-agent (3-4 timer)

1. `lib/portal/agents/coach-plan-agent.ts` - Anthropic-integrasjon med tools
2. `app/admin/elever/[id]/coach-agent/page.tsx` + `actions.ts`
3. `components/admin/coach-agent/CoachAgentChat.tsx` - chat-UI
4. `components/admin/coach-agent/PlanDiffPanel.tsx` - sidepanel som viser foreslatt diff
5. Persistering til CoachAgentSession + apply-handling
6. Commit: `feat(coach): Fase 7 — coach-agent for naturlig-spraak plan-oppdatering`

### Fase 8 - Replanlegging-CRON + event-triggers (2-3 timer)

1. `app/api/portal/cron/weekly-replan/route.ts` - sondagskjoring
2. Hooks i `lib/portal/training/` som trigger pa testresultat/runde/profil-endring
3. `lib/portal/allocation/recompute.ts` - sjekker om diff ≥10% for regenerering
4. Spiller-varsler ved regenerering (in-app notification)
5. Vercel cron-registrering i `vercel.json`
6. Commit: `feat(allokering): Fase 8 — automatisk replanlegging (schedule + event)`

### Fase 9 - Sidebar-konsolidering (2-3 timer)

1. `components/shared/AppSidebar.tsx` - delt komponent
2. Refactor `components/portal/layout/sidebar.tsx` -> bruker AppSidebar
3. Refactor `components/admin/CoachHQSidebar.tsx` -> bruker AppSidebar
4. Mappe alle nav-items per DEL 6
5. Verifiser at eksisterende ruter ikke gar tapt
6. Commit: `feat(ui): Fase 9 — konsolidert sidebar for PlayerHQ + CoachHQ`

### Fase 10 - AI-laget (hybrid-margin-justering) (2-3 timer)

1. `lib/portal/allocation/ai-adjust.ts` - kaller Claude med rules-output + fri-tekst-mal
2. AI kan justere ±10% pa hver omrade-vekt, ma forklare hvorfor
3. Kun aktiveres hvis spilleren har Tier 2-samtykke ELLER coach manuelt trigger
4. Persister AI-rasjonale i `PlayerAllocation.rationaleAi`
5. Commit: `feat(allokering): Fase 10 — AI-justering av regelmotor-output`

---

## DEL 8 — Testing

### 8.1 Unit-tester (Vitest)

Lag i `__tests__/`:
- `allocation/engine.test.ts` - 15+ scenarioer (HCP, mal, periodisering, turnering)
- `golf/distance-buckets.test.ts` - 10 forskjellige hjemmebaner
- `golf/clubspeed-resolver.test.ts` - baseline + fallback
- `consent/filterByConsent.test.ts` - alle 4 tier
- `calendar/aggregator.test.ts` - duplisering, sletting, oppdatering

### 8.2 E2E-tester (Playwright)

I `e2e/`:
- `onboarding-full-flow.spec.ts` - 6 steg fra signup til forste plan
- `calendar-add-tournament.spec.ts` - tournering trigger taper-fase
- `coach-agent-update-plan.spec.ts` - coach beskriver -> plan endres -> spiller ser ny plan

### 8.3 Manuell QA-checklist (i WORKLOG.md etter implementasjon)

- [ ] Ny bruker uten data far en plan
- [ ] Bruker med GolfBox-import far skarpere plan
- [ ] Hjemmebane-endring trigger replanlegging
- [ ] Tournering 5 uker fram trigger taper
- [ ] Coach-agent beskriver "kutter fysisk" -> plan oppdateres
- [ ] Remote bruker er usynlig i CoachHQ
- [ ] AK-elev (booket) blir synlig automatisk
- [ ] GDPR Tier 3 default-AV
- [ ] Kalender viser alle 4 kilder
- [ ] Drag-reschedule trigger replanlegging

---

## DEL 9 — Out of scope (egne specs senere)

- **Ovelse-pipeline (scrape + generate)** med Manus/Claude/Kimi/OpenAI-orkestrering. Egen spec.
- **TrackMan API-integrasjon**. Manuell upload nok for v1.
- **Multi-AI orchestration framework** (Notion + Firecrawl + agents). Egen spec.
- **Remote-bruker betalingsmodell** (Pro-tier selvbetjent abonnement). Egen spec.
- **Mobil app (native)**. Forst etter web-MVP.
- **Sosial/leaderboard utvidelse**. Eksisterer enkelt i dag.

---

## DEL 10 — Risiko + bivirkninger

| Risiko | Sannsynlighet | Mitigering |
|---|---|---|
| AK-formler er for grove | Hoy | Anders justerer placeholders i tuning-pass; spec marker dem |
| GolfBox CSV-format ukjent | Middels | Manuell hjemmebane-input som fallback |
| AI-coach gir feil rad | Middels | Coach mma godkjenne for endring; alle handlinger lagret |
| GDPR-bruk av Manus/Kimi blokkerer | Hoy | Begge kun pa AK-metodikk-dokumenter v1, ikke spillerdata |
| Migrasjon mot prod feiler | Lav | DIRECT_URL kreves; SQL gjenbrukes hvis migrasjonen er skrevet manuelt |
| Sidebar-refactor breaker eksisterende ruter | Middels | Verifiser alle nav-items mot eksisterende ruter; manuell QA |

---

## DEL 11 — Verifisering for spec er ferdig

- [x] Alle datamodeller har eksplisitte felt
- [x] AK-formler har defaults eller placeholders
- [x] Alle nye filer har relativ sti
- [x] Implementasjons-faser er rekkefolge-uavhengige der mulig
- [x] Test-kriterier er konkrete
- [x] Out-of-scope er eksplisitt
- [x] GDPR-handterer er beskrevet pr tjeneste
- [x] Sidebar-mapping er fullstendig

---

## DEL 12 — Etter Kimi-kjoring

Forventet sluttilstand etter natt-YOLO-kjoring:

- 10 nye/utvidede services
- ~25 nye Prisma-modeller/felt
- ~15 nye komponenter (kalender, coach-agent, onboarding-steg, sidebar)
- ~8 nye API-ruter
- 30+ unit-tester
- 3 nye E2E-tester
- Ny migrasjon mot Supabase prod
- 10 commits (en per fase)

Hvis Kimi treffer pa noe uavklart: legg til `// VERIFY:`-kommentar i koden, fortsett, og rapporter alle slike ved avslutning slik at Anders kan ta oppfolging.

---

**Slutt pa masterplan. Lykke til, Kimi.**
