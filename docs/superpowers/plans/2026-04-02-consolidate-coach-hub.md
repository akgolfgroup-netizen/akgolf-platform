# Konsolidere Coach Hub inn i Portal Admin

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flytte alle unike Coach Hub-funksjoner til Portal Admin og fjerne Coach Hub helt.

**Architecture:** Coach Hub har 4 unike funksjoner (inbox, chat, sessions, approvals) som flyttes til `/portal/admin/`. Design konverteres fra mørk til lys (Brand Guide 2026). Coach Hub-mappen og komponenter slettes.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, Prisma, Supabase Auth

---

## Oversikt

**Flyttes fra Coach Hub:**
| Coach Hub | → Portal Admin | Beskrivelse |
|-----------|----------------|-------------|
| `/coach/inbox/` | `/admin/meldinger/` | Unified inbox (e-post, SMS, chat) |
| `/coach/chat/` | `/admin/ai-assistent/` | AI Coach-assistent |
| `/coach/sessions/` | `/admin/okter/` | Coaching-økter oversikt |
| `/coach/approvals/` | `/admin/godkjenninger/` | Booking-godkjenninger |

**Slettes (duplikat):**
- `/coach/players/` — dekkes av `/admin/elever/`
- `/coach/settings/` — dekkes av `/portal/profil/`

**Komponenter å flytte:**
- `components/coach/inbox/*` → `components/portal/admin/meldinger/*`
- `components/coach/dashboard/RecentSessions.tsx` → `components/portal/admin/okter/`

---

## Task 1: Opprett admin/meldinger (Inbox)

**Files:**
- Create: `app/portal/(dashboard)/admin/meldinger/page.tsx`
- Create: `app/portal/(dashboard)/admin/meldinger/meldinger-client.tsx`
- Move: `components/coach/inbox/*` → `components/portal/admin/meldinger/*`

- [ ] **Step 1: Kopier inbox-side med lys design**

```tsx
// app/portal/(dashboard)/admin/meldinger/page.tsx
import { Suspense } from "react";
import { MeldingerClient } from "./meldinger-client";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";

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

async function getChannelCounts() {
  const counts = await prisma.unifiedMessage.groupBy({
    by: ["channel"],
    where: { status: "PENDING" },
    _count: true,
  });
  const result: Record<string, number> = { ALL: 0 };
  counts.forEach((c) => {
    result[c.channel] = c._count;
    result.ALL += c._count;
  });
  return result;
}

export default async function MeldingerPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  const [messages, counts] = await Promise.all([
    getMessages(user.id),
    getChannelCounts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em]">
          Meldinger
        </h1>
        <p className="text-[15px] text-[var(--color-grey-500)] mt-1">
          Samlet innboks for e-post, SMS og chat
        </p>
      </div>
      <Suspense fallback={<div className="text-[var(--color-grey-500)]">Laster...</div>}>
        <MeldingerClient messages={messages} channelCounts={counts} />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Kopier og konverter inbox-client til lys design**

Kopier `app/coach/(dashboard)/inbox/inbox-client.tsx` til `app/portal/(dashboard)/admin/meldinger/meldinger-client.tsx`.

Erstatt alle mørke farger:
- `text-white` → `text-[var(--color-grey-900)]`
- `--color-ink-*` → `--color-grey-*`
- `bg-[#1a1a2e]` → `bg-white`
- `border-white/10` → `border-[var(--color-grey-200)]`

- [ ] **Step 3: Flytt inbox-komponenter**

```bash
mkdir -p components/portal/admin/meldinger
cp components/coach/inbox/ChannelFilter.tsx components/portal/admin/meldinger/
cp components/coach/inbox/MessageList.tsx components/portal/admin/meldinger/
cp components/coach/inbox/MessageDetail.tsx components/portal/admin/meldinger/
```

Oppdater imports og konverter til lys design i hver fil.

- [ ] **Step 4: Verifiser at siden kompilerer**

```bash
npm run build -- --filter=portal
```

---

## Task 2: Opprett admin/ai-assistent (Chat)

**Files:**
- Create: `app/portal/(dashboard)/admin/ai-assistent/page.tsx`
- Create: `app/portal/(dashboard)/admin/ai-assistent/chat-client.tsx`

- [ ] **Step 1: Kopier chat-side med lys design**

```tsx
// app/portal/(dashboard)/admin/ai-assistent/page.tsx
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { ChatClient } from "./chat-client";

export default async function AIAssistentPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em]">
          AI-assistent
        </h1>
        <p className="text-[15px] text-[var(--color-grey-500)] mt-1">
          Spør om spillere, statistikk eller coaching-tips
        </p>
      </div>
      <ChatClient userId={user.id} />
    </div>
  );
}
```

- [ ] **Step 2: Kopier og konverter chat-client til lys design**

Kopier `app/coach/(dashboard)/chat/chat-client.tsx` → `app/portal/(dashboard)/admin/ai-assistent/chat-client.tsx`

Konverter farger som i Task 1.

---

## Task 3: Opprett admin/okter (Sessions)

**Files:**
- Create: `app/portal/(dashboard)/admin/okter/page.tsx`
- Create: `app/portal/(dashboard)/admin/okter/okter-client.tsx`
- Move: `components/coach/dashboard/RecentSessions.tsx` → `components/portal/admin/okter/`

- [ ] **Step 1: Kopier sessions-side med lys design**

```tsx
// app/portal/(dashboard)/admin/okter/page.tsx
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { OkterClient } from "./okter-client";

export default async function OkterPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  const instructor = await prisma.instructor.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  const sessions = instructor
    ? await prisma.coachingSession.findMany({
        where: { instructorId: instructor.id },
        orderBy: { sessionDate: "desc" },
        take: 50,
        include: {
          User: { select: { name: true, email: true } },
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em]">
          Coaching-økter
        </h1>
        <p className="text-[15px] text-[var(--color-grey-500)] mt-1">
          Oversikt over alle coaching-økter
        </p>
      </div>
      <OkterClient sessions={sessions} />
    </div>
  );
}
```

- [ ] **Step 2: Kopier og konverter sessions-client**

Kopier `app/coach/(dashboard)/sessions/sessions-client.tsx` → `app/portal/(dashboard)/admin/okter/okter-client.tsx`

---

## Task 4: Opprett admin/godkjenninger (Approvals)

**Files:**
- Create: `app/portal/(dashboard)/admin/godkjenninger/page.tsx`
- Create: `app/portal/(dashboard)/admin/godkjenninger/godkjenninger-client.tsx`

- [ ] **Step 1: Kopier approvals-side med lys design**

```tsx
// app/portal/(dashboard)/admin/godkjenninger/page.tsx
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { GodkjenningerClient } from "./godkjenninger-client";

export default async function GodkjenningerPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  const instructor = await prisma.instructor.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  const pendingBookings = instructor
    ? await prisma.booking.findMany({
        where: { instructorId: instructor.id, status: "PENDING" },
        orderBy: { startTime: "asc" },
        include: {
          User: { select: { name: true, email: true, phone: true } },
          ServiceType: { select: { name: true, durationMinutes: true } },
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em]">
          Godkjenninger
        </h1>
        <p className="text-[15px] text-[var(--color-grey-500)] mt-1">
          {pendingBookings.length} ventende booking{pendingBookings.length !== 1 ? "er" : ""}
        </p>
      </div>
      <GodkjenningerClient bookings={pendingBookings} />
    </div>
  );
}
```

- [ ] **Step 2: Kopier og konverter approvals-client**

Kopier `app/coach/(dashboard)/approvals/approvals-client.tsx` → `app/portal/(dashboard)/admin/godkjenninger/godkjenninger-client.tsx`

---

## Task 5: Oppdater Sidebar med nye menypunkter

**Files:**
- Modify: `components/portal/layout/Sidebar.tsx:50-58`

- [ ] **Step 1: Legg til nye staffItems**

```tsx
// I Sidebar.tsx, oppdater staffItems array (linje ~50-58)
const staffItems = [
  { href: "/portal/admin/kalender", label: "Kalender", icon: CalendarDays },
  { href: "/portal/admin/bookinger", label: "Bookinger", icon: CalendarPlus },
  { href: "/portal/admin/godkjenninger", label: "Godkjenninger", icon: CheckCircle },
  { href: "/portal/admin/elever", label: "Elever", icon: UsersIcon },
  { href: "/portal/admin/okter", label: "Økter", icon: BookOpen },
  { href: "/portal/admin/meldinger", label: "Meldinger", icon: MessageSquare },
  { href: "/portal/admin/ai-assistent", label: "AI-assistent", icon: Bot },
  { href: "/portal/admin/tilgjengelighet", label: "Tilgjengelighet", icon: Clock },
  { href: "/portal/admin/kapasitet", label: "Kapasitet", icon: BarChart3 },
  { href: "/portal/admin/denne-uken", label: "Denne uken", icon: CalendarCheck },
  { href: "/portal/admin/turneringer", label: "Turneringer", icon: ShieldCheck },
];
```

- [ ] **Step 2: Legg til nye icon imports**

```tsx
import {
  // ... eksisterende imports
  CheckCircle,
  MessageSquare,
  Bot,
} from "lucide-react";
```

---

## Task 6: Fjern Coach Hub og oppdater proxy.ts

**Files:**
- Delete: `app/coach/` (hele mappen)
- Delete: `components/coach/` (hele mappen)
- Modify: `proxy.ts`

- [ ] **Step 1: Fjern Coach Hub-ruter fra proxy.ts**

Fjern denne blokken fra `proxy.ts`:
```typescript
// Coach Hub requires authentication
if (request.nextUrl.pathname.startsWith("/coach")) {
  if (!user) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }
}
```

- [ ] **Step 2: Slett Coach Hub-mapper**

```bash
rm -rf app/coach
rm -rf components/coach
```

- [ ] **Step 3: Verifiser at build fungerer**

```bash
npm run build
```

---

## Task 7: Oppdater dokumentasjon

**Files:**
- Modify: `CLAUDE.md`
- Modify: `.claude/rules/gotchas.md`

- [ ] **Step 1: Fjern Coach Hub fra CLAUDE.md**

Fjern alle referanser til `/coach/` og Coach Hub fra CLAUDE.md arkitektur-seksjonen.

- [ ] **Step 2: Legg til gotcha om konsolidering**

Legg til i `.claude/rules/gotchas.md`:
```markdown
## 22. Coach Hub er fjernet (2026-04-02)

**Status:** Coach Hub (`/coach/`) er konsolidert inn i Portal Admin (`/portal/admin/`).

**Nye admin-sider:**
- `/admin/meldinger` — Unified inbox
- `/admin/ai-assistent` — AI Coach
- `/admin/okter` — Coaching-økter
- `/admin/godkjenninger` — Booking-godkjenninger

**Regel:** All instruktør-funksjonalitet ligger i Portal Admin. Ikke opprett separate dashboards.
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "refactor: konsolidere Coach Hub inn i Portal Admin"
```

---

## Oppsummering

| # | Task | Estimat |
|---|------|---------|
| 1 | admin/meldinger (Inbox) | 10 min |
| 2 | admin/ai-assistent (Chat) | 5 min |
| 3 | admin/okter (Sessions) | 5 min |
| 4 | admin/godkjenninger (Approvals) | 5 min |
| 5 | Oppdater Sidebar | 3 min |
| 6 | Fjern Coach Hub + proxy.ts | 3 min |
| 7 | Oppdater dokumentasjon | 5 min |
| **Total** | | **~35 min** |
