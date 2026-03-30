# Portal Redesign Phase 0+1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken design tokens in Apple components, then rewrite Dashboard with real data and split oversized Profil page.

**Architecture:** globals.css is already mostly correct (Inter, grey scale, shadows). The 7 Apple components reference undefined `--apple-gold-*` tokens that render as transparent. Fix those, then rewrite Dashboard as server component with Prisma queries, and split Profil into focused files.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Prisma, Framer Motion, TypeScript

---

### Task 1: Fix AppleButton — Remove undefined gold tokens

**Files:**
- Modify: `components/portal/apple/apple-button.tsx`

- [ ] **Step 1: Replace gold token references with monochrome equivalents**

Replace the entire `variantMap` and focus ring:

```typescript
const variantMap = {
  primary: "bg-[var(--color-black)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-grey-800)] hover:shadow-[var(--shadow-md)]",
  secondary: "bg-[var(--color-grey-100)] text-[var(--color-grey-900)] hover:bg-[var(--color-grey-200)]",
  ghost: "bg-transparent text-[var(--color-grey-600)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)]",
};
```

Remove the `gold` variant entirely from the type and map. Update focus ring:
```typescript
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-grey-400)] focus-visible:ring-offset-2",
```

Change `rounded-xl` to `rounded-[var(--radius-pill)]` for pill-form per brand guide.

- [ ] **Step 2: Update TypeScript type to remove gold variant**

```typescript
variant?: "primary" | "secondary" | "ghost";
```

- [ ] **Step 3: Build to verify**

Run: `npm run build 2>&1 | grep -i "error" | head -20`

If any pages reference `variant="gold"`, change them to `variant="primary"`.

- [ ] **Step 4: Commit**

```bash
git add components/portal/apple/apple-button.tsx
git commit -m "fix(apple-button): replace undefined gold tokens with monochrome"
```

---

### Task 2: Fix AppleBadge — Remove gold variant

**Files:**
- Modify: `components/portal/apple/apple-badge.tsx`

- [ ] **Step 1: Replace gold variant with monochrome**

In the variant map, replace `gold` with a dark variant:
```typescript
const variantMap = {
  success: "bg-[#34C75910] text-[var(--color-success)] border-[#34C75930]",
  warning: "bg-[#FF950010] text-[var(--color-warning)] border-[#FF950030]",
  error: "bg-[#FF3B3010] text-[var(--color-error)] border-[#FF3B3030]",
  info: "bg-[#007AFF10] text-[var(--color-info)] border-[#007AFF30]",
  dark: "bg-[var(--color-grey-100)] text-[var(--color-grey-900)] border-[var(--color-grey-200)]",
  neutral: "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] border-[var(--color-grey-200)]",
};
```

Update the dot colors map similarly — replace `gold` key with `dark`:
```typescript
const dotColorMap = {
  ...
  dark: "bg-[var(--color-grey-900)]",
  ...
};
```

- [ ] **Step 2: Update TypeScript type**

```typescript
variant?: "success" | "warning" | "error" | "info" | "dark" | "neutral";
```

- [ ] **Step 3: Find and replace all `variant="gold"` badge usages**

Run: `grep -rn 'variant="gold"' components/portal app/portal --include="*.tsx" | head -20`

Replace each `variant="gold"` with `variant="dark"`.

- [ ] **Step 4: Build and commit**

```bash
npm run build 2>&1 | tail -5
git add -A && git commit -m "fix(apple-badge): replace gold variant with monochrome dark"
```

---

### Task 3: Fix AppleAvatar — Remove gold gradient

**Files:**
- Modify: `components/portal/apple/apple-avatar.tsx`

- [ ] **Step 1: Replace gold gradient with grey**

Find the gradient background and ring classes (around line 54-59) and replace:

```typescript
// OLD
"bg-gradient-to-br from-[var(--apple-gold-300)] to-[var(--apple-gold-500)]"
"ring-[var(--apple-gold-200)]"
"hover:ring-[var(--apple-gold-300)]"

// NEW
"bg-[var(--color-grey-200)]"
"ring-[var(--color-grey-300)]"
"hover:ring-[var(--color-grey-400)]"
```

The initials text should be `text-[var(--color-grey-600)]` on the grey background.

- [ ] **Step 2: Build and commit**

```bash
npm run build 2>&1 | tail -5
git add components/portal/apple/apple-avatar.tsx
git commit -m "fix(apple-avatar): replace gold gradient with grey monochrome"
```

---

### Task 4: Fix BentoCard — Remove gradient variant and gold icon color

**Files:**
- Modify: `components/portal/apple/bento-card.tsx`

- [ ] **Step 1: Replace gradient variant and default icon color**

Find the variant map (around line 39) and replace `gradient`:
```typescript
// OLD
gradient: "bg-gradient-to-br from-[var(--apple-gold-50)] to-white border border-[var(--apple-gold-200)]/30",

// NEW
gradient: "bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]",
```

Find the default iconColor prop (around line 52) and replace:
```typescript
// OLD
iconColor = "text-[var(--apple-gold-500)]",

// NEW
iconColor = "text-[var(--color-grey-900)]",
```

- [ ] **Step 2: Build and commit**

```bash
npm run build 2>&1 | tail -5
git add components/portal/apple/bento-card.tsx
git commit -m "fix(bento-card): replace gold tokens with monochrome"
```

---

### Task 5: Fix StatCard — Remove gold defaults

**Files:**
- Modify: `components/portal/apple/stat-card.tsx`

- [ ] **Step 1: Replace default icon color and background**

Find the default props (around line 47-48):
```typescript
// OLD
iconColor = "text-[var(--apple-gold-500)]",
iconBg = "bg-[var(--apple-gold-50)]",

// NEW
iconColor = "text-[var(--color-grey-900)]",
iconBg = "bg-[var(--color-grey-100)]",
```

- [ ] **Step 2: Build and commit**

```bash
npm run build 2>&1 | tail -5
git add components/portal/apple/stat-card.tsx
git commit -m "fix(stat-card): replace gold tokens with monochrome"
```

---

### Task 6: Migrate Coach Hub components to light theme

**Files:**
- Modify: `components/coach/layout/CoachSidebar.tsx`
- Modify: `components/coach/layout/CoachTopbar.tsx`
- Modify: `components/coach/dashboard/StatsCard.tsx`
- Modify: `components/coach/dashboard/RecentMessages.tsx`
- Modify: `components/coach/inbox/ChannelFilter.tsx`
- Modify: `components/coach/inbox/MessageList.tsx`
- Modify: `components/coach/inbox/MessageDetail.tsx`

- [ ] **Step 1: Create a token mapping reference**

These are the replacements to apply across ALL coach files:

| Old token | New token |
|-----------|-----------|
| `--color-ink-100` | `--color-grey-900` (near-black bg → use as text) |
| `--color-ink-95` | `--color-grey-100` (use for secondary bg) |
| `--color-ink-90` | `--color-grey-200` (borders, card bg in dark → border in light) |
| `--color-ink-80` | `--color-grey-300` (borders) |
| `--color-ink-70` | `--color-grey-400` |
| `--color-ink-50` | `--color-grey-500` (muted text) |
| `--color-ink-40` | `--color-grey-400` (muted text) |
| `--color-ink-30` | `--color-grey-300` |
| `--color-gold` | `--color-black` |
| `text-white` (on dark bg) | `text-[var(--color-grey-900)]` |
| `bg-[var(--color-ink-100)]` (dark bg) | `bg-white` or `bg-[var(--color-grey-100)]` |
| `bg-[var(--color-ink-90)]` (dark cards) | `bg-white border border-[var(--color-grey-200)]` |
| `border-[var(--color-ink-80)]` | `border-[var(--color-grey-200)]` |

- [ ] **Step 2: Migrate CoachSidebar**

Replace dark background with light sidebar. The sidebar should be white with grey-200 right border. Active link: black bg with white text. Inactive: grey-500 text.

- [ ] **Step 3: Migrate CoachTopbar**

Light background, black text. Border-bottom grey-200.

- [ ] **Step 4: Migrate StatsCard and RecentMessages**

White card backgrounds, black text, grey borders.

- [ ] **Step 5: Migrate inbox components (ChannelFilter, MessageList, MessageDetail)**

Light backgrounds throughout. Channel color strips (left border) can keep semantic colors for differentiation.

- [ ] **Step 6: Migrate coach page backgrounds**

Update `app/coach/(dashboard)/layout.tsx` line 19:
```typescript
// OLD
<div className="min-h-screen bg-[var(--color-ink-100)]">

// NEW
<div className="min-h-screen bg-[var(--color-grey-100)]">
```

Update all coach page files that set dark backgrounds:
- `app/coach/(dashboard)/inbox/inbox-client.tsx` — background
- `app/coach/(dashboard)/chat/chat-client.tsx` — background and message bubbles
- `app/coach/(dashboard)/approvals/approvals-client.tsx` — card backgrounds
- `app/coach/(dashboard)/players/players-client.tsx` — card backgrounds
- `app/coach/(dashboard)/sessions/sessions-client.tsx` — card backgrounds
- `app/coach/(dashboard)/settings/settings-client.tsx` — form inputs and cards

- [ ] **Step 7: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add components/coach/ app/coach/
git commit -m "refactor(coach): migrate all components to light theme"
```

---

### Task 7: Scan and fix remaining dark token references in portal pages

**Files:**
- Multiple portal pages (analyse, coaching-historikk, sammenligning, etc.)

- [ ] **Step 1: Find all remaining old token references**

```bash
grep -rn "color-ink-\|apple-gold\|shadow-glow-gold\|color-gold" app/portal/ components/portal/ --include="*.tsx" | grep -v node_modules | head -40
```

- [ ] **Step 2: Apply same token mapping from Task 6 to each file**

Use the mapping table. For each file, replace dark theme tokens with their light equivalents.

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | tail -10
git add app/portal/ components/portal/
git commit -m "refactor(portal): migrate remaining pages to official 2026 tokens"
```

---

### Task 8: Create Dashboard data actions

**Files:**
- Create: `app/portal/(dashboard)/actions.ts`

- [ ] **Step 1: Write dashboard data fetching functions**

```typescript
"use server";

import { prisma } from "@/lib/portal/prisma";
import { startOfDay, subDays } from "date-fns";

export async function getDashboardStats(userId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [sessionsCount, roundsCount] = await Promise.all([
    prisma.booking.count({
      where: {
        studentId: userId,
        status: "COMPLETED",
        startTime: { gte: thirtyDaysAgo },
      },
    }),
    prisma.roundStats.count({
      where: {
        userId,
        playedAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  return { sessionsCount, roundsCount };
}

export async function getHandicapData(userId: string) {
  const entries = await prisma.handicapEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 2,
    select: { handicapIndex: true, date: true },
  });

  const current = entries[0]?.handicapIndex ?? null;
  const previous = entries[1]?.handicapIndex ?? null;
  const trend = current !== null && previous !== null ? current - previous : null;

  return { current, trend };
}

export async function getNextBooking(userId: string) {
  const booking = await prisma.booking.findFirst({
    where: {
      studentId: userId,
      status: "CONFIRMED",
      startTime: { gte: startOfDay(new Date()) },
    },
    include: {
      Instructor: {
        include: {
          User: { select: { name: true } },
        },
      },
      ServiceType: { select: { name: true, duration: true } },
    },
    orderBy: { startTime: "asc" },
  });

  if (!booking) return null;

  return {
    id: booking.id,
    instructorName: booking.Instructor?.User?.name ?? "Instruktør",
    serviceName: booking.ServiceType?.name ?? "Coaching",
    duration: booking.ServiceType?.duration ?? 60,
    startTime: booking.startTime,
  };
}

export async function getCoachInsight(userId: string) {
  const session = await prisma.coachingSession.findFirst({
    where: { studentId: userId },
    orderBy: { date: "desc" },
    select: {
      summary: true,
      focusAreas: true,
      date: true,
    },
  });

  if (!session?.focusAreas && !session?.summary) return null;

  return {
    focusAreas: session.focusAreas,
    summary: session.summary,
    date: session.date,
  };
}
```

- [ ] **Step 2: Verify Prisma relations are correct**

Check that `Instructor` includes `User`, and `CoachingSession` has `focusAreas` and `summary` fields:

```bash
grep -A 5 "focusAreas\|summary" prisma/schema.prisma | head -20
```

- [ ] **Step 3: Commit**

```bash
git add app/portal/\(dashboard\)/actions.ts
git commit -m "feat(dashboard): add server actions for real data fetching"
```

---

### Task 9: Rewrite Dashboard page with real data

**Files:**
- Rewrite: `app/portal/(dashboard)/page.tsx`
- Create: `app/portal/(dashboard)/dashboard-client.tsx`

- [ ] **Step 1: Write server component (page.tsx)**

Replace the entire 445-line file with a focused server component:

```typescript
import { requirePortalUser } from "@/lib/portal/auth";
import { getDashboardStats, getHandicapData, getNextBooking, getCoachInsight } from "./actions";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await requirePortalUser();

  const [stats, handicap, nextBooking, coachInsight] = await Promise.all([
    getDashboardStats(user.id),
    getHandicapData(user.id),
    getNextBooking(user.id),
    getCoachInsight(user.id),
  ]);

  return (
    <DashboardClient
      userName={user.name}
      stats={stats}
      handicap={handicap}
      nextBooking={nextBooking}
      coachInsight={coachInsight}
    />
  );
}
```

- [ ] **Step 2: Write client component (dashboard-client.tsx)**

Hybrid C layout with three sections. Use official tokens only:

```typescript
"use client";

import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { nb } from "date-fns/locale";
import { BookOpen, BarChart3, Calendar, Lightbulb } from "lucide-react";

interface DashboardProps {
  userName: string | null;
  stats: { sessionsCount: number; roundsCount: number };
  handicap: { current: number | null; trend: number | null };
  nextBooking: {
    id: string;
    instructorName: string;
    serviceName: string;
    duration: number;
    startTime: Date;
  } | null;
  coachInsight: {
    focusAreas: string | null;
    summary: string | null;
    date: Date;
  } | null;
}

export function DashboardClient({
  userName,
  stats,
  handicap,
  nextBooking,
  coachInsight,
}: DashboardProps) {
  const hasData = stats.sessionsCount > 0 || handicap.current !== null;

  if (!hasData) {
    return <OnboardingView userName={userName} />;
  }

  return (
    <div className="space-y-6">
      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="HCP" value={handicap.current !== null ? handicap.current.toFixed(1) : "—"} />
        <StatBox
          label="30 dager"
          value={handicap.trend !== null ? `${handicap.trend > 0 ? "+" : ""}${handicap.trend.toFixed(1)}` : "—"}
          valueColor={handicap.trend !== null && handicap.trend < 0 ? "text-[var(--color-success)]" : undefined}
        />
        <StatBox label="Økter" value={String(stats.sessionsCount)} />
        <StatBox label="Runder" value={String(stats.roundsCount)} />
      </div>

      {/* Next session + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Next session */}
        <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-grey-200)] p-5">
          <p className="text-sm text-[var(--color-grey-400)] mb-2">Neste på programmet</p>
          {nextBooking ? (
            <div>
              <p className="text-lg font-semibold text-[var(--color-grey-900)]">
                {nextBooking.serviceName}
              </p>
              <p className="text-sm text-[var(--color-grey-500)]">
                m/ {nextBooking.instructorName}
              </p>
              <p className="text-sm font-medium text-[var(--color-grey-900)] mt-2">
                {formatBookingDate(nextBooking.startTime)} kl. {format(new Date(nextBooking.startTime), "HH:mm")}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[var(--color-grey-500)]">Ingen kommende økter</p>
              <Link
                href="/portal/bookinger/ny"
                className="inline-block mt-3 px-5 py-2.5 bg-[var(--color-black)] text-white rounded-[var(--radius-pill)] text-sm font-semibold hover:bg-[var(--color-grey-800)] transition-colors"
              >
                Book time
              </Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/portal/dagbok"
            className="flex items-center gap-3 px-5 py-4 bg-[var(--color-black)] text-white rounded-[var(--radius-xl)] font-semibold hover:bg-[var(--color-grey-800)] transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Logg trening
          </Link>
          <Link
            href="/portal/statistikk/ny-runde"
            className="flex items-center gap-3 px-5 py-4 bg-white text-[var(--color-grey-900)] border border-[var(--color-grey-200)] rounded-[var(--radius-xl)] font-semibold hover:bg-[var(--color-grey-100)] transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Ny runde
          </Link>
        </div>
      </div>

      {/* Coach insight */}
      {coachInsight && (
        <div className="bg-[var(--color-grey-100)] rounded-[var(--radius-xl)] p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-[var(--color-grey-900)]" />
            <p className="text-sm font-semibold text-[var(--color-grey-900)]">Coach-innsikt</p>
          </div>
          <p className="text-sm text-[var(--color-grey-600)]">
            {coachInsight.focusAreas || coachInsight.summary}
          </p>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-grey-200)] p-4 text-center">
      <p className={`text-2xl font-bold ${valueColor || "text-[var(--color-grey-900)]"}`}>{value}</p>
      <p className="text-xs text-[var(--color-grey-400)] mt-1">{label}</p>
    </div>
  );
}

function OnboardingView({ userName }: { userName: string | null }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-grey-200)] p-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)] mb-2">
          Velkommen{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-[var(--color-grey-500)] mb-6">Her er 3 ting du kan gjøre for å komme i gang:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OnboardingCard href="/portal/bookinger/ny" icon={Calendar} title="Book en time" description="Start med en coaching-økt" />
          <OnboardingCard href="/portal/statistikk/ny-runde" icon={BarChart3} title="Registrer en runde" description="Logg din første golfrunde" />
          <OnboardingCard href="/portal/profil" icon={BookOpen} title="Sett mål" description="Definer dine golfmål" />
        </div>
      </div>
    </div>
  );
}

function OnboardingCard({ href, icon: Icon, title, description }: { href: string; icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <Link href={href} className="block p-5 rounded-[var(--radius-lg)] bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)] transition-colors">
      <Icon className="w-6 h-6 text-[var(--color-grey-900)] mb-3" />
      <p className="font-semibold text-[var(--color-grey-900)]">{title}</p>
      <p className="text-sm text-[var(--color-grey-500)] mt-1">{description}</p>
    </Link>
  );
}

function formatBookingDate(date: Date): string {
  const d = new Date(date);
  if (isToday(d)) return "I dag";
  if (isTomorrow(d)) return "I morgen";
  return format(d, "EEEE d. MMMM", { locale: nb });
}
```

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add app/portal/\(dashboard\)/page.tsx app/portal/\(dashboard\)/dashboard-client.tsx
git commit -m "feat(dashboard): rewrite with real data, Hybrid C layout, progressive empty states"
```

---

### Task 10: Add Dashboard loading skeleton

**Files:**
- Modify: `app/portal/(dashboard)/loading.tsx`

- [ ] **Step 1: Write skeleton that matches Hybrid C layout**

```typescript
export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-grey-200)] p-4 text-center">
            <div className="h-8 w-16 bg-[var(--color-grey-200)] rounded mx-auto mb-2" />
            <div className="h-3 w-12 bg-[var(--color-grey-100)] rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Next session + actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-grey-200)] p-5">
          <div className="h-3 w-24 bg-[var(--color-grey-200)] rounded mb-4" />
          <div className="h-6 w-48 bg-[var(--color-grey-200)] rounded mb-2" />
          <div className="h-4 w-32 bg-[var(--color-grey-100)] rounded" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-14 bg-[var(--color-grey-200)] rounded-[var(--radius-xl)]" />
          <div className="h-14 bg-[var(--color-grey-100)] rounded-[var(--radius-xl)]" />
        </div>
      </div>

      {/* Coach insight */}
      <div className="bg-[var(--color-grey-100)] rounded-[var(--radius-xl)] p-5">
        <div className="h-4 w-28 bg-[var(--color-grey-200)] rounded mb-3" />
        <div className="h-3 w-3/4 bg-[var(--color-grey-200)] rounded" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/portal/\(dashboard\)/loading.tsx
git commit -m "feat(dashboard): add loading skeleton matching Hybrid C layout"
```

---

### Task 11: Verify and final cleanup

- [ ] **Step 1: Scan for any remaining broken token references**

```bash
grep -rn "apple-gold\|shadow-glow-gold" app/ components/ --include="*.tsx" --include="*.css" | grep -v node_modules | grep -v ".superpowers"
```

Expected: No matches.

- [ ] **Step 2: Full build**

```bash
npm run build 2>&1 | tail -20
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Final commit and push**

```bash
git add -A && git commit -m "chore: portal redesign phase 0+1 complete — monochrome tokens + live dashboard"
```
