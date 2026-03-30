# Portal Redesign Phase 2-6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all remaining mock pages operative with real data, complete Coach Hub, and add global UX polish (loading/error states).

**Architecture:** Most pages already have working `actions.ts` with Prisma queries. The work is: (1) replace hardcoded data in page components with action calls, (2) add loading/error states, (3) fix Coach Hub inbox with real UnifiedMessage queries.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Prisma, Framer Motion, TypeScript

**Design tokens:** Use ONLY official Brand Guide 2026 tokens (`--color-black`, `--color-grey-*`, `--color-white`). NO gold, bronze, or dark theme tokens.

---

## Phase 2: Treningssuite

### Task 1: Statistikk — Replace mock data with real queries

**Files:**
- Rewrite: `app/portal/(dashboard)/statistikk/page.tsx` (310 lines, "use client")

**Existing actions** (`statistikk/actions.ts`): `getRoundStats()`, `addRoundStats()`, `getStatsAggregates()`, `getTrainingAreaBreakdown()`

- [ ] **Step 1: Convert to server+client architecture**

Split into server component that calls existing actions, and a client component for interactivity.

Create `app/portal/(dashboard)/statistikk/statistikk-client.tsx` with the UI.

The server component (`page.tsx`) should:
```typescript
import { requirePortalUser } from "@/lib/portal/auth";
import { getRoundStats, getStatsAggregates, getTrainingAreaBreakdown } from "./actions";
import { StatistikkClient } from "./statistikk-client";

export default async function StatistikkPage() {
  const user = await requirePortalUser();
  const [rounds, aggregates, breakdown] = await Promise.all([
    getRoundStats(),
    getStatsAggregates(),
    getTrainingAreaBreakdown(),
  ]);
  return <StatistikkClient rounds={rounds} aggregates={aggregates} breakdown={breakdown} />;
}
```

- [ ] **Step 2: Move UI to client component**

The client component receives real data as props. Remove ALL hardcoded values (currentHandicap=12.4, sgData, focusAreas, recentRounds). Use the data from props. Show progressive empty states when data arrays are empty.

Use monochrome tokens only (`--color-grey-*`, `--color-black`).

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/portal/\(dashboard\)/statistikk/
git commit -m "feat(statistikk): replace mock data with real Prisma queries"
```

---

### Task 2: Treningsplan — Wire up real data

**Files:**
- Modify: `app/portal/(dashboard)/treningsplan/page.tsx` (491 lines)

**Existing actions** (`treningsplan/actions.ts`): `getActivePlan()`, `getCurrentWeekSessions()`

- [ ] **Step 1: Remove DEMO_SESSIONS constant**

The page already calls `getActivePlan()` and `getCurrentWeekSessions()` from actions.ts. Find where DEMO_SESSIONS is used as fallback and remove it. The page should show empty state when no plan exists instead of demo data.

- [ ] **Step 2: Add empty state**

When `getActivePlan()` returns null:
```tsx
<div className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-8 text-center">
  <p className="text-lg font-semibold text-[var(--color-grey-900)] mb-2">Ingen treningsplan ennå</p>
  <p className="text-[var(--color-grey-500)] mb-4">Generer en AI-treningsplan basert på dine mål</p>
  {/* Keep existing AI generate button */}
</div>
```

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/portal/\(dashboard\)/treningsplan/
git commit -m "feat(treningsplan): remove demo data, use real queries with empty states"
```

---

### Task 3: Treningsplan session detail — Wire up real data

**Files:**
- Modify: `app/portal/(dashboard)/treningsplan/[sessionId]/page.tsx` (395 lines)

- [ ] **Step 1: Remove DEMO_SESSIONS lookup**

Replace the DEMO_SESSIONS map with a Prisma query. The session ID from params should fetch from TrainingPlanSession:

```typescript
const session = await prisma.trainingPlanSession.findUnique({
  where: { id: params.sessionId },
  include: {
    TrainingPlanWeek: {
      include: { TrainingPlan: true }
    }
  }
});
if (!session) notFound();
```

- [ ] **Step 2: Ensure exercises render from DB data**

Map the TrainingPlanSession data to the format the client component expects. Remove TODO comments about saving to database — the actions should handle persistence.

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/portal/\(dashboard\)/treningsplan/
git commit -m "feat(treningsplan-session): replace demo sessions with real DB queries"
```

---

### Task 4: Dagbok — Replace mock data with real queries

**Files:**
- Rewrite: `app/portal/(dashboard)/dagbok/page.tsx` (532 lines, "use client")

**Existing actions** (`dagbok/actions.ts`): `getTrainingLogs()`, `logSession()`, `updateTrainingLog()`, `deleteTrainingLog()`, `getLoggedSessionIds()`

- [ ] **Step 1: Convert to server+client architecture**

Split into server component + client component. Server fetches initial data:

```typescript
import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs, getLoggedSessionIds } from "./actions";
import { DagbokClient } from "./dagbok-client";

export default async function DagbokPage() {
  const user = await requirePortalUser();
  const [logs, loggedIds] = await Promise.all([
    getTrainingLogs(),
    getLoggedSessionIds(),
  ]);
  return <DagbokClient initialLogs={logs} loggedSessionIds={loggedIds} />;
}
```

- [ ] **Step 2: Move UI to client component**

Create `dagbok-client.tsx`. Remove ALL hardcoded demoLogs, categories, streakDays, calendarDays. Use the data from props. Generate calendar days dynamically from the current month. Calculate streak from actual log dates.

Show empty state when no logs exist:
```tsx
<div className="text-center py-12">
  <p className="text-lg font-semibold text-[var(--color-grey-900)] mb-2">Din treningsdagbok er tom</p>
  <p className="text-[var(--color-grey-500)] mb-4">Logg din første treningsøkt</p>
  {/* Log session button */}
</div>
```

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/portal/\(dashboard\)/dagbok/
git commit -m "feat(dagbok): replace demo data with real training logs"
```

---

### Task 5: Kalender — Replace mock data with real queries

**Files:**
- Modify: `app/portal/(dashboard)/kalender/page.tsx` (243 lines)

**Existing actions** (`kalender/actions.ts`): `getCalendarEvents()`, `getPeriodizationBands()`

- [ ] **Step 1: Remove hardcoded calendarDays array**

Replace the 42-item hardcoded array with actual query results. The `getCalendarEvents()` action already exists. Call it with the current month range:

```typescript
const user = await requirePortalUser();
const startDate = startOfMonth(currentDate);
const endDate = endOfMonth(currentDate);
const [events, bands] = await Promise.all([
  getCalendarEvents(startDate, endDate),
  getPeriodizationBands(currentDate.getFullYear()),
]);
```

- [ ] **Step 2: Generate calendar grid from real events**

Map events to calendar day objects dynamically. Each day should show bookings, training logs, and tournaments from the DB. Empty days show nothing.

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/portal/\(dashboard\)/kalender/
git commit -m "feat(kalender): replace mock calendar with real event data"
```

---

## Phase 3: Coach Hub Completion

### Task 6: Coach Dashboard — Replace placeholder stats

**Files:**
- Modify: `app/coach/(dashboard)/page.tsx` (65 lines)

- [ ] **Step 1: Add real queries for pending messages and today's stats**

Replace placeholder values with Prisma queries:

```typescript
const [playerCount, pendingCount, todayBookings] = await Promise.all([
  prisma.user.count({ where: { role: "STUDENT" } }),
  prisma.booking.count({
    where: { instructorId: user.id, status: "PENDING" }
  }),
  prisma.booking.count({
    where: {
      instructorId: user.id,
      startTime: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
      status: { in: ["CONFIRMED", "COMPLETED"] },
    }
  }),
]);
```

- [ ] **Step 2: Show recent coaching sessions instead of empty messages**

Replace the empty `recentMessages` array with recent coaching sessions:

```typescript
const recentSessions = await prisma.coachingSession.findMany({
  where: { instructorId: user.id },
  orderBy: { sessionDate: "desc" },
  take: 5,
  include: { User: { select: { name: true } } },
});
```

Update the UI to show these sessions instead of messages.

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/coach/\(dashboard\)/page.tsx
git commit -m "feat(coach-dashboard): replace placeholders with real Prisma queries"
```

---

### Task 7: Coach Inbox — Connect to UnifiedMessage

**Files:**
- Modify: `app/coach/(dashboard)/inbox/page.tsx` (170 lines)
- Modify: `app/coach/(dashboard)/inbox/actions.ts`

**Note:** `UnifiedMessage` and `AIResponse` models ARE in the Prisma schema.

- [ ] **Step 1: Uncomment and activate Prisma queries in page.tsx**

Replace mock data with real queries. Uncomment the existing `getMessages()` and `getChannelCounts()` functions. Remove mockMessages and mockChannelCounts arrays.

```typescript
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";

async function getMessages(userId: string) {
  return prisma.unifiedMessage.findMany({
    where: {
      OR: [{ assignedToId: userId }, { assignedToId: null }],
    },
    orderBy: { receivedAt: "desc" },
    take: 50,
    include: { aiResponse: true },
  });
}
```

- [ ] **Step 2: Activate actions.ts**

Uncomment Prisma calls in `approveMessage()`, `rejectMessage()`, and `regenerateAIResponse()`. Remove console.log mock stubs. Add `requirePortalUser()` auth checks.

- [ ] **Step 3: Add empty state for inbox**

When no messages exist:
```tsx
<div className="flex items-center justify-center h-full text-[var(--color-grey-500)]">
  <div className="text-center">
    <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
    <p className="text-lg font-medium mb-1">Ingen meldinger ennå</p>
    <p className="text-sm">Nye meldinger fra spillere dukker opp her</p>
  </div>
</div>
```

- [ ] **Step 4: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/coach/\(dashboard\)/inbox/
git commit -m "feat(coach-inbox): connect to UnifiedMessage with real Prisma queries"
```

---

## Phase 4: Admin Polish

### Task 8: Verify all admin pages use correct tokens

**Files:** All files under `app/portal/(dashboard)/admin/`

- [ ] **Step 1: Scan for remaining old tokens**

```bash
grep -rn "apple-gold\|color-ink-\|color-gold\|shadow-glow" app/portal/\(dashboard\)/admin/ components/portal/admin/ --include="*.tsx"
```

- [ ] **Step 2: Fix any remaining references**

Apply same monochrome token mapping used in Phase 0.

- [ ] **Step 3: Verify admin pages have consistent card styling**

All admin cards should use: `bg-white rounded-[20px] border border-[var(--color-grey-200)]`

- [ ] **Step 4: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/portal/\(dashboard\)/admin/ components/portal/admin/
git commit -m "refactor(admin): verify and fix token consistency"
```

---

## Phase 5: Global UX Polish

### Task 9: Add loading.tsx per route group

**Files to create:**
- `app/portal/(dashboard)/statistikk/loading.tsx`
- `app/portal/(dashboard)/treningsplan/loading.tsx`
- `app/portal/(dashboard)/dagbok/loading.tsx`
- `app/portal/(dashboard)/kalender/loading.tsx`
- `app/portal/(dashboard)/profil/loading.tsx`
- `app/portal/(dashboard)/bookinger/loading.tsx`
- `app/portal/(dashboard)/analyse/loading.tsx`
- `app/portal/(dashboard)/coaching-historikk/loading.tsx`
- `app/coach/(dashboard)/loading.tsx`

- [ ] **Step 1: Create a reusable skeleton pattern**

Each loading.tsx should match the layout of its page. Use this pattern:

```typescript
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[var(--color-grey-200)] rounded" />
      <div className="h-4 w-32 bg-[var(--color-grey-100)] rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5 h-32" />
        ))}
      </div>
    </div>
  );
}
```

Adapt the skeleton shape for each page (more cards for statistikk, calendar grid for kalender, etc).

- [ ] **Step 2: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/portal/ app/coach/
git commit -m "feat(ux): add loading skeletons for all major routes"
```

---

### Task 10: Add error.tsx per route group

**Files to create:**
- `app/portal/(dashboard)/statistikk/error.tsx`
- `app/portal/(dashboard)/treningsplan/error.tsx`
- `app/portal/(dashboard)/dagbok/error.tsx`
- `app/portal/(dashboard)/kalender/error.tsx`
- `app/coach/(dashboard)/error.tsx`

- [ ] **Step 1: Create consistent error boundary**

All error files use same pattern:

```typescript
"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FF3B3010] mb-4">
          <AlertCircle className="w-6 h-6 text-[var(--color-error)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-2">
          Noe gikk galt
        </h2>
        <p className="text-sm text-[var(--color-grey-500)] mb-4">
          {error.message || "En uventet feil oppstod"}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-black)] text-white rounded-[980px] text-sm font-semibold hover:bg-[var(--color-grey-800)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Prøv igjen
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/portal/ app/coach/
git commit -m "feat(ux): add error boundaries for all major routes"
```

---

### Task 11: Final verification and cleanup

- [ ] **Step 1: Scan for ALL remaining broken tokens**

```bash
grep -rn "apple-gold\|shadow-glow-gold\|color-ink-" app/ components/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v globals.css | grep -v ".superpowers"
```

- [ ] **Step 2: Full production build**

```bash
npm run build 2>&1 | tail -30
```

- [ ] **Step 3: Verify route count**

Ensure all portal and coach routes appear in build output.

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "chore: portal redesign phases 2-6 complete"
```
