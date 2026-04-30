# Komplett Admin & Portal — Implementasjonsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Koble alle mock-sider til ekte data, og bygg manglende funksjoner for et komplett trener-dashboard og spillerportal.

**Architecture:** Hver admin page.tsx konverteres fra "use client" med hardkodede mock-arrays til Server Component som kaller eksisterende actions.ts, og sender data som props til en Client Component. For sider uten actions.ts opprettes nye server actions med Prisma/Supabase-spørringer.

**Tech Stack:** Next.js 16 App Router, Prisma + Supabase, TypeScript strict, Tailwind CSS v4

---

## Fase 1: Admin — Koble eksisterende actions (6 sider, kan parallelliseres)

Disse sidene har ferdig actions.ts men page.tsx bruker mock-data. Mønsteret er likt for alle:
1. Fjern "use client" og mock-variabler fra page.tsx
2. Gjør page.tsx til async Server Component
3. Kall actions, send data som props til en ny Client Component
4. Flytt all interaktiv UI (useState, filtre, søk) til Client Component

### Task 1: Admin Bookinger → ekte data

**Files:**
- Modify: `app/portal/(dashboard)/admin/bookinger/page.tsx`
- Create: `app/portal/(dashboard)/admin/bookinger/bookinger-client.tsx`
- Existing: `app/portal/(dashboard)/admin/bookinger/actions.ts` (searchBookings, adminCancelBooking, adminCreateBooking)

- [ ] **Step 1: Opprett bookinger-client.tsx**

Flytt all "use client" UI fra page.tsx til bookinger-client.tsx. Komponenten tar inn `initialBookings` og `total` som props. Behold søk, filter, visningsmodus — men bytt mock-data med props. Legg til `searchBookings` action-kall i søk-handler via `useTransition`.

- [ ] **Step 2: Konverter page.tsx til Server Component**

```tsx
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { searchBookings } from "./actions";
import { BookingerClient } from "./bookinger-client";

export default async function BookingerPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) redirect("/");
  
  const { bookings, total } = await searchBookings("", undefined, 1);
  return <BookingerClient initialBookings={bookings} total={total} />;
}
```

- [ ] **Step 3: Verifiser at siden rendrer med ekte data**

Run: `npm run build` — sjekk at admin/bookinger kompilerer uten feil.

- [ ] **Step 4: Commit**

---

### Task 2: Admin Kalender → ekte data

**Files:**
- Modify: `app/portal/(dashboard)/admin/kalender/page.tsx`
- Create: `app/portal/(dashboard)/admin/kalender/kalender-client.tsx`
- Existing: `app/portal/(dashboard)/admin/kalender/actions.ts` (getBookingsForPeriod, getBookingsForDay, getBookingsForWeek, getInstructors, markNoShow, addAdminNote)

- [ ] **Step 1: Opprett kalender-client.tsx**

Flytt UI til Client Component. Ta inn `initialEvents: CalendarBooking[]` og `instructors` som props. Map `CalendarBooking` (startTime/endTime) til kalender-format. Bruk `getBookingsForPeriod` via useTransition ved navigering mellom måneder.

- [ ] **Step 2: Konverter page.tsx til Server Component**

```tsx
import { getBookingsForPeriod, getInstructors } from "./actions";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function KalenderPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) redirect("/");
  
  const now = new Date();
  const [events, instructors] = await Promise.all([
    getBookingsForPeriod(startOfMonth(now).toISOString(), endOfMonth(now).toISOString()),
    getInstructors(),
  ]);
  return <KalenderClient initialEvents={events} instructors={instructors} />;
}
```

- [ ] **Step 3: Verifiser + commit**

---

### Task 3: Admin Kapasitet → ekte data

**Files:**
- Modify: `app/portal/(dashboard)/admin/kapasitet/page.tsx`
- Create: `app/portal/(dashboard)/admin/kapasitet/kapasitet-client.tsx`
- Existing: `app/portal/(dashboard)/admin/kapasitet/actions.ts` (getCapacityData → CapacityData)

- [ ] **Step 1: Opprett kapasitet-client.tsx**

Flytt UI. Ta inn `data: CapacityData` som prop. Fjern mock-variabler (`capacityData`, `coachCapacity`, `recommendations`, `emptySlots`). Map ekte CapacityData-struktur til UI-komponentene.

- [ ] **Step 2: Konverter page.tsx**

```tsx
const data = await getCapacityData();
return <KapasitetClient data={data} />;
```

- [ ] **Step 3: Verifiser + commit**

---

### Task 4: Admin E-postmaler → ekte data

**Files:**
- Modify: `app/portal/(dashboard)/admin/e-postmaler/page.tsx`
- Create: `app/portal/(dashboard)/admin/e-postmaler/e-postmaler-client.tsx`
- Existing: `app/portal/(dashboard)/admin/e-postmaler/actions.ts` (getTemplates, createTemplate, updateTemplate, deleteTemplate)

- [ ] **Step 1: Opprett e-postmaler-client.tsx**

Flytt UI. Ta inn `initialTemplates` som prop. Koble Lagre-knapp til `updateTemplate()`, Ny mal til `createTemplate()`, Slett til `deleteTemplate()`. Bruk `useTransition` for alle mutasjoner + `revalidatePath`.

- [ ] **Step 2: Konverter page.tsx**

```tsx
const templates = await getTemplates();
return <EPostmalerClient initialTemplates={templates} />;
```

- [ ] **Step 3: Verifiser + commit**

---

### Task 5: Admin Fasiliteter → ekte data

**Files:**
- Modify: `app/portal/(dashboard)/admin/fasiliteter/page.tsx`
- Modify: `app/portal/(dashboard)/admin/fasiliteter/actions.ts` — legg til `getFacilities()` og `getTodaySchedule()`
- Create: `app/portal/(dashboard)/admin/fasiliteter/fasiliteter-client.tsx`

- [ ] **Step 1: Legg til fetch-actions**

```tsx
// I actions.ts — legg til:
export async function getFacilities() {
  return prisma.facility.findMany({
    where: { isActive: true },
    include: { Location: true },
    orderBy: { name: "asc" },
  });
}

export async function getTodaySchedule() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return prisma.facilityActivity.findMany({
    where: {
      startTime: { gte: today, lt: tomorrow },
      status: { not: "CANCELLED" },
    },
    include: { Facility: true, CreatedBy: true },
    orderBy: { startTime: "asc" },
  });
}
```

- [ ] **Step 2: Opprett fasiliteter-client.tsx og konverter page.tsx**

- [ ] **Step 3: Verifiser + commit**

---

### Task 6: Admin Godkjenninger → ekte data + ny fetch-action

**Files:**
- Modify: `app/portal/(dashboard)/admin/godkjenninger/page.tsx`
- Modify: `app/portal/(dashboard)/admin/godkjenninger/actions.ts` — legg til `getPendingItems()`
- Existing: godkjenninger/actions.ts har approve/reject-mutasjoner

- [ ] **Step 1: Legg til getPendingItems action**

```tsx
export async function getPendingItems() {
  const [pendingBookings, pendingActivities] = await Promise.all([
    prisma.booking.findMany({
      where: { status: "PENDING" },
      include: { User: true, ServiceType: true, Instructor: { include: { User: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.facilityActivity.findMany({
      where: { status: "PENDING" },
      include: { Facility: true, CreatedBy: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { pendingBookings, pendingActivities };
}
```

- [ ] **Step 2: Konverter page.tsx — send ekte pending items til GodkjenningerClient**

- [ ] **Step 3: Verifiser + commit**

---

## Fase 2: Admin — Bygg nye actions + koble (4 sider, kan parallelliseres)

Disse sidene har INGEN actions.ts — backend må bygges fra scratch.

### Task 7: Admin Meldinger → ny fetch + koble

**Files:**
- Modify: `app/portal/(dashboard)/admin/meldinger/page.tsx`
- Modify: `app/portal/(dashboard)/admin/meldinger/actions.ts` — legg til fetch-funksjoner
- Create: `app/portal/(dashboard)/admin/meldinger/meldinger-client.tsx`

- [ ] **Step 1: Legg til fetch-actions i actions.ts**

```tsx
export async function getConversations() {
  // Grupper UnifiedMessage etter threadId, returner siste melding per tråd
  const messages = await prisma.unifiedMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { AIResponses: true },
    distinct: ["threadId"],
    take: 50,
  });
  return messages;
}

export async function getMessagesForThread(threadId: string) {
  return prisma.unifiedMessage.findMany({
    where: { threadId },
    include: { AIResponses: { include: { ApprovedBy: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function sendMessage(threadId: string, content: string, channel: string) {
  // Opprett UnifiedMessage med direction: "outgoing"
  // Send via Resend (email) eller Twilio (sms) basert på channel
}
```

- [ ] **Step 2: Opprett meldinger-client.tsx med ekte data fra props**

- [ ] **Step 3: Konverter page.tsx + verifiser + commit**

---

### Task 8: Admin Økter → ny actions.ts + koble

**Files:**
- Create: `app/portal/(dashboard)/admin/okter/actions.ts`
- Modify: `app/portal/(dashboard)/admin/okter/page.tsx`
- Create: `app/portal/(dashboard)/admin/okter/okter-client.tsx`

- [ ] **Step 1: Opprett actions.ts**

```tsx
"use server";
import { prisma } from "@/lib/portal/prisma";

export async function getSessionOverview(dateRange?: { from: Date; to: Date }) {
  const where: any = {};
  if (dateRange) {
    where.startTime = { gte: dateRange.from, lte: dateRange.to };
  }
  
  const [sessions, stats] = await Promise.all([
    prisma.booking.findMany({
      where: { ...where, status: { in: ["COMPLETED", "CANCELLED", "NO_SHOW"] } },
      include: {
        User: { select: { name: true, email: true } },
        Instructor: { include: { User: { select: { name: true } } } },
        ServiceType: { select: { name: true } },
      },
      orderBy: { startTime: "desc" },
      take: 50,
    }),
    prisma.booking.groupBy({
      by: ["status"],
      where,
      _count: true,
    }),
  ]);
  return { sessions, stats };
}
```

- [ ] **Step 2: Opprett okter-client.tsx, konverter page.tsx**

- [ ] **Step 3: Verifiser + commit**

---

### Task 9: Admin Økonomi → ny actions.ts + koble

**Files:**
- Create: `app/portal/(dashboard)/admin/okonomi/actions.ts`
- Modify: `app/portal/(dashboard)/admin/okonomi/page.tsx`
- Create: `app/portal/(dashboard)/admin/okonomi/okonomi-client.tsx`

- [ ] **Step 1: Opprett actions.ts**

```tsx
"use server";
import { prisma } from "@/lib/portal/prisma";

export async function getRevenueOverview() {
  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0,0,0,0);
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [dayRevenue, weekRevenue, monthRevenue, yearRevenue] = await Promise.all([
    prisma.paymentTransaction.aggregate({ where: { status: "PAID", paidAt: { gte: startOfDay } }, _sum: { grossAmount: true } }),
    prisma.paymentTransaction.aggregate({ where: { status: "PAID", paidAt: { gte: startOfWeek } }, _sum: { grossAmount: true } }),
    prisma.paymentTransaction.aggregate({ where: { status: "PAID", paidAt: { gte: startOfMonth } }, _sum: { grossAmount: true } }),
    prisma.paymentTransaction.aggregate({ where: { status: "PAID", paidAt: { gte: startOfYear } }, _sum: { grossAmount: true } }),
  ]);

  return {
    day: dayRevenue._sum.grossAmount ?? 0,
    week: weekRevenue._sum.grossAmount ?? 0,
    month: monthRevenue._sum.grossAmount ?? 0,
    year: yearRevenue._sum.grossAmount ?? 0,
  };
}

export async function getRevenueByService() {
  // PaymentTransaction grouped by ServiceType
}

export async function getRecentRefunds() {
  return prisma.paymentTransaction.findMany({
    where: { status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] } },
    include: { Booking: { include: { User: true, ServiceType: true } } },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });
}
```

- [ ] **Step 2: Opprett okonomi-client.tsx, konverter page.tsx**

- [ ] **Step 3: Verifiser + commit**

---

### Task 10: Admin Analytics → oppdater actions + koble

**Files:**
- Modify: `app/portal/(dashboard)/admin/analytics/actions.ts` — utvid med ekte queries
- Modify: `app/portal/(dashboard)/admin/analytics/page.tsx`
- Create: `app/portal/(dashboard)/admin/analytics/analytics-client.tsx`

- [ ] **Step 1: Utvid actions.ts med ekte analytikk**

```tsx
export async function getStudentHealth() {
  // Hent studenter med siste sesjon, neste booking, sesjoner denne måneden
  // Klassifiser som "good"/"warning"/"critical" basert på aktivitet
}

export async function getRevenueTrend(weeks: number = 4) {
  // PaymentTransaction aggregert per uke
}

export async function getChurnMetrics() {
  // Brukere med RetentionStatus = AT_RISK eller CHURNED
}
```

- [ ] **Step 2: Opprett analytics-client.tsx, konverter page.tsx**

- [ ] **Step 3: Verifiser + commit**

---

## Fase 3: Admin — Mindre kritiske sider (6 sider, lavere prioritet)

### Task 11: Admin Ny Booking → koble til ekte data

**Files:**
- Modify: `app/portal/(dashboard)/admin/bookinger/ny/page.tsx`

- [ ] **Step 1: Erstatt mock-elever/tjenester/coacher med ekte queries**

Bruk `searchStudents` fra `../actions`, hent ServiceTypes og Instructors fra Supabase. Koble submit til `adminCreateBooking`.

- [ ] **Step 2: Verifiser + commit**

---

### Task 12: Admin Mission Board → koble til admin dashboard API

**Files:**
- Modify: `app/portal/(dashboard)/admin/mission-board/page.tsx`

- [ ] **Step 1: Bytt `/api/mock-data` med `/api/portal/admin/dashboard`**

Admin dashboard API-ruten returnerer allerede ekte data (dagens bookinger, inntekt, nye studenter). Erstatt fetch-URL og map responsen til eksisterende UI-komponenter.

- [ ] **Step 2: Fjern hardkodede schedule-items, bruk ekte bookinger fra API**

- [ ] **Step 3: Verifiser + commit**

---

### Task 13: Admin Turneringer → ny actions + koble

**Files:**
- Create: `app/portal/(dashboard)/admin/turneringer/actions.ts`
- Modify: `app/portal/(dashboard)/admin/turneringer/page.tsx`

- [ ] **Step 1: Opprett actions med Tournament CRUD**

- [ ] **Step 2: Konverter page.tsx + commit**

---

### Task 14: Admin Rapporter → grunnleggende implementasjon

**Files:**
- Create: `app/portal/(dashboard)/admin/rapporter/actions.ts`
- Modify: `app/portal/(dashboard)/admin/rapporter/page.tsx`

- [ ] **Step 1: Bygg rapport-generering (CSV-eksport av bookinger, inntekt, elevoversikt)**

- [ ] **Step 2: Konverter page.tsx + commit**

---

### Task 15: Admin Focus, Denne uken, Agenter → fjern eller koble

- [ ] **Step 1: Vurder om disse sidene gir verdi. Foreslått:**
  - `focus/` → Kan fjernes (duplikat av hub)
  - `denne-uken/` → Koble til ekte ukesdata fra kalender-actions
  - `agenter/` → Koble til Agent-tabell i Prisma (toggle isActive)

- [ ] **Step 2: Implementer eller fjern + commit**

---

## Fase 4: Spillerportal — Gjenværende mock-sider (4 sider)

### Task 16: Portal Bag → koble til ekte data

**Files:**
- Modify: `app/portal/(dashboard)/bag/page.tsx`
- Existing: `app/portal/(dashboard)/bag/actions.ts` (har PlayerBag/PlayerClub queries)

- [ ] **Step 1: Konverter page.tsx til Server Component, kall actions**

- [ ] **Step 2: Commit**

---

### Task 17: Portal TrackMan → ny actions + koble

**Files:**
- Create: `app/portal/(dashboard)/trackman/actions.ts`
- Modify: `app/portal/(dashboard)/trackman/page.tsx`

- [ ] **Step 1: Opprett actions.ts**

```tsx
export async function getTrackManSessions(userId: string) {
  return prisma.trackmanSession.findMany({
    where: { userId },
    orderBy: { sessionDate: "desc" },
    take: 20,
  });
}

export async function getClubStats(userId: string) {
  // Aggreger TrackmanSession per club
}
```

- [ ] **Step 2: Konverter page.tsx + commit**

---

### Task 18: Portal Sosialt → koble til ekte data

**Files:**
- Modify: `app/portal/(dashboard)/sosialt/page.tsx`
- Existing: `app/portal/(dashboard)/sosialt/actions.ts` (Friendship, Challenge, leaderboard)

- [ ] **Step 1: Konverter page.tsx, kall actions for venner/feed/leaderboard**

- [ ] **Step 2: Commit**

---

### Task 19: Portal Spill → koble til GameSession API

**Files:**
- Modify: `app/portal/(dashboard)/spill/page.tsx`

- [ ] **Step 1: Hent ekte data fra `/api/portal/game-session` og `/api/portal/courses`**

- [ ] **Step 2: Commit**

---

## Fase 5: Manglende features (nye funksjoner)

### Task 20: Direkte meldinger trener → spiller

**Files:**
- Create: `app/api/portal/messages/route.ts` — CRUD for Conversation + Message
- Create: `app/portal/(dashboard)/meldinger/page.tsx` — Spiller-side meldingsinnboks
- Modify: `app/portal/(dashboard)/admin/meldinger/` — Koble til same Conversation-modell

- [ ] **Step 1: Bygg API med Conversation + Message CRUD**
- [ ] **Step 2: Bygg spiller-side meldingsvisning**
- [ ] **Step 3: Koble admin meldinger til same system**
- [ ] **Step 4: Push-notifikasjon ved ny melding**
- [ ] **Step 5: Commit**

---

### Task 21: Redigere treningsplan (trener)

**Files:**
- Create: `app/portal/(dashboard)/admin/treningsplan/page.tsx` — Trener-side for planredigering
- Create: `app/portal/(dashboard)/admin/treningsplan/actions.ts`

- [ ] **Step 1: Opprett actions for CRUD på TrainingPlanSession**

```tsx
export async function updateSession(sessionId: string, data: Partial<TrainingPlanSession>) { }
export async function deleteSession(sessionId: string) { }
export async function addSession(weekId: string, data: CreateSessionInput) { }
export async function reorderSessions(weekId: string, sessionIds: string[]) { }
```

- [ ] **Step 2: Bygg UI med drag-and-drop ukevisning**
- [ ] **Step 3: Commit**

---

### Task 22: Manuell treningsplan (uten AI)

**Files:**
- Modify: `app/portal/(dashboard)/admin/treningsplan/actions.ts`

- [ ] **Step 1: Legg til `createManualPlan` action**

```tsx
export async function createManualPlan(studentId: string, data: {
  title: string;
  periodType: string;
  startDate: Date;
  weeks: { focus: string; sessions: CreateSessionInput[] }[];
}) { }
```

- [ ] **Step 2: Bygg wizard-UI for manuell planopprettelse**
- [ ] **Step 3: Commit**

---

### Task 23: AI-assistent for admin (ekte chat)

**Files:**
- Modify: `app/portal/(dashboard)/admin/ai-assistent/page.tsx`

- [ ] **Step 1: Koble til `/api/portal/ai/chat` med staff-kontekst**

Gjenbruk streaming-chat fra AI Coach, men med admin-systemmelding som gir tilgang til booking-data, elevstatus og inntektsoversikt.

- [ ] **Step 2: Commit**

---

### Task 24: TrackMan upload-UI i portal

**Files:**
- Modify: `app/portal/(dashboard)/trackman/page.tsx`

- [ ] **Step 1: Legg til CSV-opplasting som kaller `/api/portal/trackman/upload-csv`**
- [ ] **Step 2: Legg til bilde-OCR som kaller `/api/portal/trackman/upload-image`**
- [ ] **Step 3: Commit**

---

### Task 25: Flerspiller-spillsesjon UI

**Files:**
- Modify: `app/portal/(dashboard)/spill/page.tsx`

- [ ] **Step 1: Bygg "Opprett spill" med join-kode**
- [ ] **Step 2: Bygg "Bli med" med kode-input**
- [ ] **Step 3: Koble til live leaderboard via `/api/portal/game-session/[id]/leaderboard`**
- [ ] **Step 4: Commit**

---

## Parallellisering

| Batch | Tasks | Kan kjøres samtidig |
|-------|-------|---------------------|
| **A** | 1, 2, 3, 4, 5, 6 | Ja — alle uavhengige admin-koblingssider |
| **B** | 7, 8, 9, 10 | Ja — alle trenger nye actions |
| **C** | 11, 12, 13, 14, 15 | Ja — mindre kritiske admin-sider |
| **D** | 16, 17, 18, 19 | Ja — portal mock-sider |
| **E** | 20, 21, 22, 23, 24, 25 | Delvis — 20 og 21-22 avhenger av hverandre |
