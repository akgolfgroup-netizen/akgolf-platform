# Coach Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bygge Coach Hub — unified inbox med AI-assistent for AK Golf trenere

**Architecture:** PWA bygget som ny route-gruppe i akgolf-website. Supabase for data/auth, Mac Mini for lokal AI og iMessage bridge.

**Tech Stack:** Next.js 16, Prisma, Supabase, Web Push API, Ollama, Claude API

---

## Fase 1: Database & Foundation

### Task 1: Prisma Schema — Nye modeller

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Legg til Channel enum**

```prisma
enum Channel {
  EMAIL
  INSTAGRAM
  MESSENGER
  WHATSAPP
  IMESSAGE
}
```

- [ ] **Step 2: Legg til MessageStatus enum**

```prisma
enum MessageStatus {
  PENDING
  AI_PROCESSING
  AI_READY
  APPROVED
  SENT
  FAILED
}
```

- [ ] **Step 3: Legg til Direction enum**

```prisma
enum Direction {
  INBOUND
  OUTBOUND
}
```

- [ ] **Step 4: Legg til UnifiedMessage model**

```prisma
model UnifiedMessage {
  id            String        @id @default(cuid())
  channel       Channel
  direction     Direction
  externalId    String
  senderName    String
  senderHandle  String
  subject       String?
  content       String        @db.Text
  receivedAt    DateTime
  status        MessageStatus @default(PENDING)
  assignedToId  String?
  assignedTo    User?         @relation("AssignedMessages", fields: [assignedToId], references: [id])
  threadId      String?
  aiResponse    AIResponse?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([channel])
  @@index([status])
  @@index([assignedToId])
  @@index([receivedAt])
}
```

- [ ] **Step 5: Legg til AIResponse model**

```prisma
model AIResponse {
  id            String          @id @default(cuid())
  messageId     String          @unique
  message       UnifiedMessage  @relation(fields: [messageId], references: [id], onDelete: Cascade)
  draftContent  String          @db.Text
  finalContent  String?         @db.Text
  confidence    Float
  category      String
  modelUsed     String
  autoSent      Boolean         @default(false)
  wasEdited     Boolean         @default(false)
  editDiff      String?         @db.Text
  approvedById  String?
  approvedBy    User?           @relation("ApprovedResponses", fields: [approvedById], references: [id])
  approvedAt    DateTime?
  createdAt     DateTime        @default(now())
}
```

- [ ] **Step 6: Legg til AILearning model**

```prisma
model AILearning {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation("UserLearnings", fields: [userId], references: [id])
  category    String
  pattern     String   @db.Text
  response    String   @db.Text
  confidence  Float    @default(0.5)
  usageCount  Int      @default(0)
  lastUsed    DateTime?
  corrections Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId, category])
}
```

- [ ] **Step 7: Legg til PushSubscription model**

```prisma
model PushSubscription {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation("PushSubscriptions", fields: [userId], references: [id])
  endpoint   String   @unique
  p256dh     String
  auth       String
  deviceType String
  createdAt  DateTime @default(now())

  @@index([userId])
}
```

- [ ] **Step 8: Oppdater User model med relasjoner**

Legg til i User model:
```prisma
  assignedMessages   UnifiedMessage[] @relation("AssignedMessages")
  approvedResponses  AIResponse[]     @relation("ApprovedResponses")
  learnings          AILearning[]     @relation("UserLearnings")
  pushSubscriptions  PushSubscription[] @relation("PushSubscriptions")
```

- [ ] **Step 9: Kjør prisma generate**

```bash
npx prisma generate
```

- [ ] **Step 10: Kjør prisma db push**

```bash
npx prisma db push
```

- [ ] **Step 11: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(coach-hub): add unified inbox database models"
```

---

### Task 2: Coach Hub Layout

**Files:**
- Create: `app/coach/layout.tsx`
- Create: `app/coach/(dashboard)/layout.tsx`
- Create: `components/coach/layout/CoachSidebar.tsx`
- Create: `components/coach/layout/CoachTopbar.tsx`

- [ ] **Step 1: Opprett coach layout**

```tsx
// app/coach/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coach Hub | AK Golf",
  description: "Intern dashboard for AK Golf trenere",
};

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Opprett CoachSidebar**

```tsx
// components/coach/layout/CoachSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Inbox,
  MessageSquare,
  Users,
  ClipboardList,
  CheckCircle,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Inbox", href: "/coach/inbox", icon: Inbox },
  { name: "AI Chat", href: "/coach/chat", icon: MessageSquare },
  { name: "Spillere", href: "/coach/players", icon: Users },
  { name: "Coaching", href: "/coach/sessions", icon: ClipboardList },
  { name: "Godkjenninger", href: "/coach/approvals", icon: CheckCircle },
];

export function CoachSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-ink-95 border-r border-ink-90">
      <div className="flex h-16 items-center px-6 border-b border-ink-90">
        <Link href="/coach" className="text-xl font-bold text-white">
          Coach Hub
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-bronze text-white"
                  : "text-ink-40 hover:bg-ink-90 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <Link
          href="/coach/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-40 hover:bg-ink-90 hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
          Innstillinger
        </Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Opprett CoachTopbar**

```tsx
// components/coach/layout/CoachTopbar.tsx
"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoachTopbarProps {
  userName: string;
}

export function CoachTopbar({ userName }: CoachTopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink-90 bg-ink-100 px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-50" />
          <input
            type="text"
            placeholder="Søk meldinger, spillere..."
            className="h-10 w-80 rounded-lg bg-ink-95 pl-10 pr-4 text-sm text-white placeholder:text-ink-50 focus:outline-none focus:ring-2 focus:ring-bronze"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-ink-40" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            3
          </span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-bronze flex items-center justify-center text-white font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-white">{userName}</span>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Opprett dashboard layout**

```tsx
// app/coach/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { requirePortalUser } from "@/lib/portal/auth";
import { CoachSidebar } from "@/components/coach/layout/CoachSidebar";
import { CoachTopbar } from "@/components/coach/layout/CoachTopbar";

export default async function CoachDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalUser();

  // Kun INSTRUCTOR og ADMIN har tilgang
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className="min-h-screen bg-ink-100">
      <CoachSidebar />
      <div className="pl-64">
        <CoachTopbar userName={user.name || user.email} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/coach/ components/coach/
git commit -m "feat(coach-hub): add layout with sidebar and topbar"
```

---

### Task 3: Coach Hub Dashboard Page

**Files:**
- Create: `app/coach/(dashboard)/page.tsx`
- Create: `components/coach/dashboard/StatsCard.tsx`
- Create: `components/coach/dashboard/RecentMessages.tsx`

- [ ] **Step 1: Opprett StatsCard**

```tsx
// components/coach/dashboard/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-ink-95 p-6 border border-ink-90">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-ink-90 p-3">{icon}</div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-ink-40">{title}</p>
        {subtitle && <p className="text-xs text-ink-50 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Opprett RecentMessages**

```tsx
// components/coach/dashboard/RecentMessages.tsx
import { Channel } from "@prisma/client";
import { Mail, Instagram, MessageCircle, Phone, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

const channelIcons: Record<Channel, React.ReactNode> = {
  EMAIL: <Mail className="h-4 w-4" />,
  INSTAGRAM: <Instagram className="h-4 w-4" />,
  MESSENGER: <MessageCircle className="h-4 w-4" />,
  WHATSAPP: <Phone className="h-4 w-4" />,
  IMESSAGE: <MessageSquare className="h-4 w-4" />,
};

const channelColors: Record<Channel, string> = {
  EMAIL: "bg-red-500",
  INSTAGRAM: "bg-pink-500",
  MESSENGER: "bg-blue-500",
  WHATSAPP: "bg-green-500",
  IMESSAGE: "bg-emerald-500",
};

interface Message {
  id: string;
  channel: Channel;
  senderName: string;
  content: string;
  receivedAt: Date;
  status: string;
}

interface RecentMessagesProps {
  messages: Message[];
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <div className="rounded-xl bg-ink-95 border border-ink-90">
      <div className="p-4 border-b border-ink-90">
        <h3 className="font-semibold text-white">Nylige meldinger</h3>
      </div>
      <div className="divide-y divide-ink-90">
        {messages.map((message) => (
          <div key={message.id} className="p-4 hover:bg-ink-90 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className={`rounded-lg p-2 ${channelColors[message.channel]}`}>
                {channelIcons[message.channel]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white truncate">{message.senderName}</p>
                  <span className="text-xs text-ink-50">
                    {formatDistanceToNow(message.receivedAt, { addSuffix: true, locale: nb })}
                  </span>
                </div>
                <p className="text-sm text-ink-40 truncate mt-1">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Opprett dashboard page**

```tsx
// app/coach/(dashboard)/page.tsx
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { StatsCard } from "@/components/coach/dashboard/StatsCard";
import { RecentMessages } from "@/components/coach/dashboard/RecentMessages";
import { Inbox, CheckCircle, Clock, Users } from "lucide-react";

export default async function CoachDashboardPage() {
  const user = await requirePortalUser();

  // Hent statistikk
  const [pendingCount, todayCount, avgResponseTime, playerCount] = await Promise.all([
    prisma.unifiedMessage.count({
      where: { status: "PENDING" },
    }),
    prisma.unifiedMessage.count({
      where: {
        receivedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    // Placeholder for avg response time
    Promise.resolve(12),
    prisma.user.count({
      where: { role: "STUDENT" },
    }),
  ]);

  // Hent nylige meldinger
  const recentMessages = await prisma.unifiedMessage.findMany({
    take: 5,
    orderBy: { receivedAt: "desc" },
    select: {
      id: true,
      channel: true,
      senderName: true,
      content: true,
      receivedAt: true,
      status: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          God morgen, {user.name?.split(" ")[0] || "Coach"}
        </h1>
        <p className="text-ink-40 mt-1">Her er oversikten din for i dag</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ventende meldinger"
          value={pendingCount}
          icon={<Inbox className="h-5 w-5 text-bronze" />}
        />
        <StatsCard
          title="Meldinger i dag"
          value={todayCount}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        />
        <StatsCard
          title="Avg. responstid"
          value={`${avgResponseTime} min`}
          subtitle="Mål: < 60 min"
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="Aktive spillere"
          value={playerCount}
          icon={<Users className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages messages={recentMessages} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/coach/ components/coach/
git commit -m "feat(coach-hub): add dashboard page with stats"
```

---

### Task 4: Inbox Page — UI

**Files:**
- Create: `app/coach/(dashboard)/inbox/page.tsx`
- Create: `components/coach/inbox/MessageList.tsx`
- Create: `components/coach/inbox/MessageDetail.tsx`
- Create: `components/coach/inbox/ChannelFilter.tsx`

- [ ] **Step 1: Opprett ChannelFilter**

```tsx
// components/coach/inbox/ChannelFilter.tsx
"use client";

import { Channel } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Mail, Instagram, MessageCircle, Phone, MessageSquare } from "lucide-react";

const channels: { value: Channel | "ALL"; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "ALL", label: "Alle", icon: <Inbox className="h-4 w-4" />, color: "bg-ink-80" },
  { value: "EMAIL", label: "E-post", icon: <Mail className="h-4 w-4" />, color: "bg-red-500" },
  { value: "INSTAGRAM", label: "Instagram", icon: <Instagram className="h-4 w-4" />, color: "bg-pink-500" },
  { value: "MESSENGER", label: "Messenger", icon: <MessageCircle className="h-4 w-4" />, color: "bg-blue-500" },
  { value: "WHATSAPP", label: "WhatsApp", icon: <Phone className="h-4 w-4" />, color: "bg-green-500" },
  { value: "IMESSAGE", label: "iMessage", icon: <MessageSquare className="h-4 w-4" />, color: "bg-emerald-500" },
];

import { Inbox } from "lucide-react";

interface ChannelFilterProps {
  selected: Channel | "ALL";
  onChange: (channel: Channel | "ALL") => void;
  counts: Record<Channel | "ALL", number>;
}

export function ChannelFilter({ selected, onChange, counts }: ChannelFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {channels.map((channel) => (
        <button
          key={channel.value}
          onClick={() => onChange(channel.value)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            selected === channel.value
              ? "bg-bronze text-white"
              : "bg-ink-90 text-ink-40 hover:bg-ink-80 hover:text-white"
          )}
        >
          <span className={cn("rounded p-1", channel.color)}>{channel.icon}</span>
          {channel.label}
          {counts[channel.value] > 0 && (
            <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {counts[channel.value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Opprett MessageList**

```tsx
// components/coach/inbox/MessageList.tsx
"use client";

import { Channel, MessageStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Mail, Instagram, MessageCircle, Phone, MessageSquare, Bot, Clock, Check } from "lucide-react";

const channelIcons: Record<Channel, React.ReactNode> = {
  EMAIL: <Mail className="h-4 w-4" />,
  INSTAGRAM: <Instagram className="h-4 w-4" />,
  MESSENGER: <MessageCircle className="h-4 w-4" />,
  WHATSAPP: <Phone className="h-4 w-4" />,
  IMESSAGE: <MessageSquare className="h-4 w-4" />,
};

const channelColors: Record<Channel, string> = {
  EMAIL: "border-l-red-500",
  INSTAGRAM: "border-l-pink-500",
  MESSENGER: "border-l-blue-500",
  WHATSAPP: "border-l-green-500",
  IMESSAGE: "border-l-emerald-500",
};

const statusBadges: Record<MessageStatus, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING: { label: "Venter", className: "bg-yellow-500/20 text-yellow-500", icon: <Clock className="h-3 w-3" /> },
  AI_PROCESSING: { label: "AI jobber", className: "bg-blue-500/20 text-blue-500", icon: <Bot className="h-3 w-3" /> },
  AI_READY: { label: "AI klar", className: "bg-green-500/20 text-green-500", icon: <Bot className="h-3 w-3" /> },
  APPROVED: { label: "Godkjent", className: "bg-purple-500/20 text-purple-500", icon: <Check className="h-3 w-3" /> },
  SENT: { label: "Sendt", className: "bg-ink-80 text-ink-40", icon: <Check className="h-3 w-3" /> },
  FAILED: { label: "Feilet", className: "bg-red-500/20 text-red-500", icon: <Clock className="h-3 w-3" /> },
};

interface Message {
  id: string;
  channel: Channel;
  senderName: string;
  senderHandle: string;
  subject: string | null;
  content: string;
  receivedAt: Date;
  status: MessageStatus;
}

interface MessageListProps {
  messages: Message[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MessageList({ messages, selectedId, onSelect }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-50">
        Ingen meldinger
      </div>
    );
  }

  return (
    <div className="divide-y divide-ink-90">
      {messages.map((message) => {
        const status = statusBadges[message.status];
        return (
          <div
            key={message.id}
            onClick={() => onSelect(message.id)}
            className={cn(
              "p-4 cursor-pointer transition-colors border-l-4",
              channelColors[message.channel],
              selectedId === message.id ? "bg-ink-90" : "hover:bg-ink-95"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white truncate">
                    {message.senderName}
                  </span>
                  <span className="text-ink-50 text-sm truncate">
                    {message.senderHandle}
                  </span>
                </div>
                {message.subject && (
                  <p className="text-sm text-ink-30 truncate mt-0.5">
                    {message.subject}
                  </p>
                )}
                <p className="text-sm text-ink-50 truncate mt-1">
                  {message.content}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-ink-50 whitespace-nowrap">
                  {formatDistanceToNow(message.receivedAt, { addSuffix: true, locale: nb })}
                </span>
                <span className={cn("flex items-center gap-1 text-xs px-2 py-0.5 rounded-full", status.className)}>
                  {status.icon}
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Opprett MessageDetail**

```tsx
// components/coach/inbox/MessageDetail.tsx
"use client";

import { Channel, MessageStatus } from "@prisma/client";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Send, Edit, X, Bot } from "lucide-react";
import { useState } from "react";

interface AIResponse {
  draftContent: string;
  confidence: number;
  category: string;
  modelUsed: string;
}

interface MessageDetailProps {
  message: {
    id: string;
    channel: Channel;
    senderName: string;
    senderHandle: string;
    subject: string | null;
    content: string;
    receivedAt: Date;
    status: MessageStatus;
    aiResponse: AIResponse | null;
  };
  onApprove: (messageId: string, content: string) => Promise<void>;
  onReject: (messageId: string) => Promise<void>;
}

export function MessageDetail({ message, onApprove, onReject }: MessageDetailProps) {
  const [editedContent, setEditedContent] = useState(message.aiResponse?.draftContent || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleApprove = async () => {
    setIsSending(true);
    try {
      await onApprove(message.id, editedContent);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-ink-90">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{message.senderName}</h2>
            <p className="text-sm text-ink-50">{message.senderHandle}</p>
          </div>
          <span className="text-sm text-ink-50">
            {format(message.receivedAt, "d. MMMM yyyy 'kl.' HH:mm", { locale: nb })}
          </span>
        </div>
        {message.subject && (
          <p className="mt-2 text-ink-30 font-medium">{message.subject}</p>
        )}
      </div>

      {/* Original message */}
      <div className="p-4 border-b border-ink-90">
        <p className="text-sm text-ink-40 mb-2">Melding:</p>
        <p className="text-white whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* AI Response */}
      {message.aiResponse && (
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-5 w-5 text-bronze" />
            <span className="text-sm font-medium text-white">AI-forslag</span>
            <span className="text-xs text-ink-50">
              {Math.round(message.aiResponse.confidence * 100)}% konfidensert
            </span>
            <span className="text-xs bg-ink-90 px-2 py-0.5 rounded text-ink-40">
              {message.aiResponse.category}
            </span>
          </div>

          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-48 bg-ink-90 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-bronze"
            />
          ) : (
            <div className="bg-ink-90 rounded-lg p-4">
              <p className="text-white whitespace-pre-wrap">{editedContent}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {message.status === "AI_READY" && (
        <div className="p-4 border-t border-ink-90 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="text-ink-40"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Ferdig redigering" : "Rediger"}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onReject(message.id)}
              className="text-red-500"
            >
              <X className="h-4 w-4 mr-2" />
              Forkast
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSending}
              className="bg-bronze hover:bg-bronze/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSending ? "Sender..." : "Godkjenn & Send"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Opprett inbox page**

```tsx
// app/coach/(dashboard)/inbox/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { InboxClient } from "./inbox-client";

async function getMessages(userId: string) {
  return prisma.unifiedMessage.findMany({
    where: {
      OR: [
        { assignedToId: userId },
        { assignedToId: null },
      ],
    },
    orderBy: { receivedAt: "desc" },
    take: 50,
    include: {
      aiResponse: true,
    },
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

export default async function InboxPage() {
  const user = await requirePortalUser();
  const [messages, counts] = await Promise.all([
    getMessages(user.id),
    getChannelCounts(),
  ]);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Suspense fallback={<div>Laster...</div>}>
        <InboxClient initialMessages={messages} channelCounts={counts} />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 5: Opprett inbox-client**

```tsx
// app/coach/(dashboard)/inbox/inbox-client.tsx
"use client";

import { useState } from "react";
import { Channel, MessageStatus } from "@prisma/client";
import { ChannelFilter } from "@/components/coach/inbox/ChannelFilter";
import { MessageList } from "@/components/coach/inbox/MessageList";
import { MessageDetail } from "@/components/coach/inbox/MessageDetail";
import { approveMessage, rejectMessage } from "./actions";

interface Message {
  id: string;
  channel: Channel;
  senderName: string;
  senderHandle: string;
  subject: string | null;
  content: string;
  receivedAt: Date;
  status: MessageStatus;
  aiResponse: {
    draftContent: string;
    confidence: number;
    category: string;
    modelUsed: string;
  } | null;
}

interface InboxClientProps {
  initialMessages: Message[];
  channelCounts: Record<string, number>;
}

export function InboxClient({ initialMessages, channelCounts }: InboxClientProps) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | "ALL">("ALL");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState(initialMessages);

  const filteredMessages = selectedChannel === "ALL"
    ? messages
    : messages.filter((m) => m.channel === selectedChannel);

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  const handleApprove = async (messageId: string, content: string) => {
    await approveMessage(messageId, content);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, status: "SENT" as MessageStatus } : m
      )
    );
    setSelectedMessageId(null);
  };

  const handleReject = async (messageId: string) => {
    await rejectMessage(messageId);
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    setSelectedMessageId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-ink-90">
        <ChannelFilter
          selected={selectedChannel}
          onChange={setSelectedChannel}
          counts={channelCounts as Record<Channel | "ALL", number>}
        />
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="w-96 border-r border-ink-90 overflow-auto">
          <MessageList
            messages={filteredMessages}
            selectedId={selectedMessageId}
            onSelect={setSelectedMessageId}
          />
        </div>

        <div className="flex-1 bg-ink-95">
          {selectedMessage ? (
            <MessageDetail
              message={selectedMessage}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-ink-50">
              Velg en melding for å se detaljer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Opprett actions**

```tsx
// app/coach/(dashboard)/inbox/actions.ts
"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { revalidatePath } from "next/cache";

export async function approveMessage(messageId: string, finalContent: string) {
  const user = await requirePortalUser();

  await prisma.$transaction([
    prisma.aIResponse.update({
      where: { messageId },
      data: {
        finalContent,
        wasEdited: true,
        approvedById: user.id,
        approvedAt: new Date(),
      },
    }),
    prisma.unifiedMessage.update({
      where: { id: messageId },
      data: { status: "APPROVED" },
    }),
  ]);

  // TODO: Send melding via riktig kanal

  await prisma.unifiedMessage.update({
    where: { id: messageId },
    data: { status: "SENT" },
  });

  revalidatePath("/coach/inbox");
}

export async function rejectMessage(messageId: string) {
  await requirePortalUser();

  await prisma.unifiedMessage.update({
    where: { id: messageId },
    data: { status: "FAILED" },
  });

  revalidatePath("/coach/inbox");
}
```

- [ ] **Step 7: Commit**

```bash
git add app/coach/ components/coach/
git commit -m "feat(coach-hub): add inbox page with message list and detail view"
```

---

### Task 5: AI Response Generator

**Files:**
- Create: `lib/coach/ai/model-router.ts`
- Create: `lib/coach/ai/generate-response.ts`
- Create: `lib/coach/ai/learning.ts`

- [ ] **Step 1: Opprett model-router**

```tsx
// lib/coach/ai/model-router.ts
export type AIModel = "ollama" | "claude-haiku" | "claude-sonnet" | "claude-opus" | "kimi";

interface RoutingContext {
  category: string;
  contentLength: number;
  hasCoachingKeywords: boolean;
  isCreativeTask: boolean;
}

const COACHING_KEYWORDS = [
  "trening", "treningsplan", "øvelse", "teknikk", "swing", "putting",
  "handicap", "coaching", "analyse", "forbedring", "mål", "progresjon"
];

export function routeToModel(content: string): AIModel {
  const context = analyzeContent(content);

  // Kreativt innhold → Kimi
  if (context.isCreativeTask) {
    return "kimi";
  }

  // Coaching-relatert → Claude Sonnet
  if (context.hasCoachingKeywords) {
    return "claude-sonnet";
  }

  // Kort, enkel melding → Ollama
  if (context.contentLength < 100 && !context.hasCoachingKeywords) {
    return "ollama";
  }

  // Standard → Claude Haiku
  return "claude-haiku";
}

function analyzeContent(content: string): RoutingContext {
  const lowerContent = content.toLowerCase();

  return {
    category: categorizeMessage(content),
    contentLength: content.length,
    hasCoachingKeywords: COACHING_KEYWORDS.some((kw) => lowerContent.includes(kw)),
    isCreativeTask: lowerContent.includes("skriv") || lowerContent.includes("lag") || lowerContent.includes("kreativ"),
  };
}

export function categorizeMessage(content: string): string {
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes("pris") || lowerContent.includes("kost") || lowerContent.includes("betaling")) {
    return "pricing";
  }
  if (lowerContent.includes("book") || lowerContent.includes("time") || lowerContent.includes("avtale")) {
    return "booking";
  }
  if (lowerContent.includes("trening") || lowerContent.includes("coaching") || lowerContent.includes("øvelse")) {
    return "coaching";
  }
  if (lowerContent.includes("avlys") || lowerContent.includes("endre") || lowerContent.includes("flytt")) {
    return "reschedule";
  }

  return "general";
}
```

- [ ] **Step 2: Opprett generate-response**

```tsx
// lib/coach/ai/generate-response.ts
import Anthropic from "@anthropic-ai/sdk";
import { routeToModel, categorizeMessage, AIModel } from "./model-router";
import { findSimilarResponses } from "./learning";
import { prisma } from "@/lib/portal/prisma";

const anthropic = new Anthropic();

interface GenerateResponseResult {
  content: string;
  confidence: number;
  category: string;
  modelUsed: AIModel;
}

export async function generateAIResponse(
  messageContent: string,
  senderName: string,
  channel: string,
  userId: string
): Promise<GenerateResponseResult> {
  const category = categorizeMessage(messageContent);
  const model = routeToModel(messageContent);

  // Sjekk om vi har lignende svar fra før
  const similarResponses = await findSimilarResponses(userId, category, messageContent);

  let confidence = 0.5;
  let responseContent: string;

  if (similarResponses.length > 0 && similarResponses[0].confidence >= 0.9) {
    // Høy konfidensert match — bruk eksisterende svar
    responseContent = similarResponses[0].response;
    confidence = similarResponses[0].confidence;
  } else {
    // Generer nytt svar
    responseContent = await callAIModel(model, messageContent, senderName, channel, similarResponses);
    confidence = similarResponses.length > 0 ? 0.7 : 0.5;
  }

  return {
    content: responseContent,
    confidence,
    category,
    modelUsed: model,
  };
}

async function callAIModel(
  model: AIModel,
  messageContent: string,
  senderName: string,
  channel: string,
  previousResponses: { pattern: string; response: string }[]
): Promise<string> {
  const systemPrompt = buildSystemPrompt(channel, previousResponses);

  if (model === "ollama") {
    return callOllama(systemPrompt, messageContent, senderName);
  }

  // Claude models
  const claudeModel = model === "claude-haiku"
    ? "claude-haiku-4-5-20251001"
    : model === "claude-sonnet"
    ? "claude-sonnet-4-6"
    : "claude-opus-4-6";

  const response = await anthropic.messages.create({
    model: claudeModel,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Melding fra ${senderName}:\n\n${messageContent}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function callOllama(
  systemPrompt: string,
  messageContent: string,
  senderName: string
): Promise<string> {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "qwen2.5:7b",
      prompt: `${systemPrompt}\n\nMelding fra ${senderName}:\n${messageContent}\n\nSvar:`,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response;
}

function buildSystemPrompt(
  channel: string,
  previousResponses: { pattern: string; response: string }[]
): string {
  let prompt = `Du er en assistent for AK Golf Academy. Du svarer på vegne av trenerne på en profesjonell, vennlig og hjelpsom måte.

Kanal: ${channel}

Retningslinjer:
- Vær høflig og profesjonell
- Bruk norsk bokmål
- Hold svarene korte og konkrete
- Hvis du ikke vet svaret, si det ærlig
- Ikke lov noe du ikke kan holde`;

  if (previousResponses.length > 0) {
    prompt += "\n\nTidligere godkjente svar på lignende henvendelser:";
    previousResponses.slice(0, 3).forEach((r, i) => {
      prompt += `\n\nEksempel ${i + 1}:\nHenvendelse: ${r.pattern}\nSvar: ${r.response}`;
    });
  }

  return prompt;
}
```

- [ ] **Step 3: Opprett learning**

```tsx
// lib/coach/ai/learning.ts
import { prisma } from "@/lib/portal/prisma";

interface LearnedResponse {
  pattern: string;
  response: string;
  confidence: number;
}

export async function findSimilarResponses(
  userId: string,
  category: string,
  messageContent: string
): Promise<LearnedResponse[]> {
  // Hent alle læringer for denne kategorien
  const learnings = await prisma.aILearning.findMany({
    where: {
      userId,
      category,
    },
    orderBy: {
      confidence: "desc",
    },
    take: 10,
  });

  // Enkel keyword-matching (kan utvides til embeddings senere)
  const messageWords = new Set(messageContent.toLowerCase().split(/\s+/));

  const scored = learnings.map((learning) => {
    const patternWords = new Set(learning.pattern.toLowerCase().split(/\s+/));
    const intersection = [...messageWords].filter((w) => patternWords.has(w));
    const similarity = intersection.length / Math.max(messageWords.size, patternWords.size);

    return {
      ...learning,
      similarity,
    };
  });

  return scored
    .filter((s) => s.similarity > 0.3)
    .sort((a, b) => b.similarity * b.confidence - a.similarity * a.confidence)
    .map((s) => ({
      pattern: s.pattern,
      response: s.response,
      confidence: s.confidence * s.similarity,
    }));
}

export async function learnFromApproval(
  userId: string,
  category: string,
  originalMessage: string,
  approvedResponse: string,
  wasEdited: boolean
): Promise<void> {
  // Finn eksisterende læring for denne kategorien
  const existing = await prisma.aILearning.findFirst({
    where: {
      userId,
      category,
      pattern: originalMessage,
    },
  });

  if (existing) {
    // Oppdater eksisterende
    const newConfidence = wasEdited
      ? Math.max(0.3, existing.confidence - 0.1) // Reduser hvis redigert
      : Math.min(0.99, existing.confidence + 0.05); // Øk hvis godkjent uten endring

    await prisma.aILearning.update({
      where: { id: existing.id },
      data: {
        response: approvedResponse,
        confidence: newConfidence,
        usageCount: existing.usageCount + 1,
        lastUsed: new Date(),
      },
    });
  } else {
    // Opprett ny læring
    await prisma.aILearning.create({
      data: {
        userId,
        category,
        pattern: originalMessage,
        response: approvedResponse,
        confidence: wasEdited ? 0.5 : 0.7,
        usageCount: 1,
        lastUsed: new Date(),
      },
    });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/coach/
git commit -m "feat(coach-hub): add AI model router and learning system"
```

---

### Task 6: Push Notifications

**Files:**
- Create: `lib/coach/push/vapid.ts`
- Create: `lib/coach/push/send-notification.ts`
- Create: `app/api/coach/push/subscribe/route.ts`
- Create: `public/sw.js`

- [ ] **Step 1: Opprett VAPID setup**

```tsx
// lib/coach/push/vapid.ts
import webpush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  "mailto:post@akgolf.no",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export { webpush, VAPID_PUBLIC_KEY };
```

- [ ] **Step 2: Opprett send-notification**

```tsx
// lib/coach/push/send-notification.ts
import { prisma } from "@/lib/portal/prisma";
import { webpush } from "./vapid";

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    url?: string;
    messageId?: string;
    type?: string;
  };
}

export async function sendPushNotification(
  userId: string,
  payload: NotificationPayload
): Promise<void> {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const notifications = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload)
      );
    } catch (error: any) {
      if (error.statusCode === 410) {
        // Subscription expired, delete it
        await prisma.pushSubscription.delete({
          where: { id: sub.id },
        });
      }
      console.error("Push notification failed:", error);
    }
  });

  await Promise.all(notifications);
}

export async function notifyNewMessage(
  userId: string,
  senderName: string,
  preview: string,
  messageId: string
): Promise<void> {
  await sendPushNotification(userId, {
    title: `Ny melding fra ${senderName}`,
    body: preview.substring(0, 100),
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    data: {
      url: `/coach/inbox?message=${messageId}`,
      messageId,
      type: "new_message",
    },
  });
}

export async function notifyAIReady(
  userId: string,
  count: number
): Promise<void> {
  await sendPushNotification(userId, {
    title: "AI-svar klare",
    body: `${count} melding${count > 1 ? "er" : ""} venter på godkjenning`,
    icon: "/icons/icon-192.png",
    data: {
      url: "/coach/inbox?filter=ai_ready",
      type: "ai_ready",
    },
  });
}
```

- [ ] **Step 3: Opprett subscribe API**

```tsx
// app/api/coach/push/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requirePortalUser();
    const { subscription, deviceType } = await request.json();

    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        deviceType,
      },
      create: {
        userId: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        deviceType,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requirePortalUser();
    const { endpoint } = await request.json();

    await prisma.pushSubscription.deleteMany({
      where: {
        userId: user.id,
        endpoint,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Opprett service worker**

```javascript
// public/sw.js
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};

  const options = {
    body: data.body,
    icon: data.icon || "/icons/icon-192.png",
    badge: data.badge || "/icons/badge-72.png",
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      { action: "open", title: "Åpne" },
      { action: "dismiss", title: "Lukk" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/coach/inbox";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/coach") && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
```

- [ ] **Step 5: Commit**

```bash
git add lib/coach/push/ app/api/coach/push/ public/sw.js
git commit -m "feat(coach-hub): add web push notifications"
```

---

### Task 7: Gmail Integration API

**Files:**
- Create: `app/api/coach/integrations/gmail/sync/route.ts`
- Create: `lib/coach/integrations/gmail.ts`

- [ ] **Step 1: Opprett gmail integration**

```tsx
// lib/coach/integrations/gmail.ts
import { prisma } from "@/lib/portal/prisma";
import { generateAIResponse } from "../ai/generate-response";
import { notifyNewMessage } from "../push/send-notification";

interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  fromEmail: string;
  subject: string;
  body: string;
  date: Date;
}

export async function processIncomingEmail(
  message: GmailMessage,
  targetUserId: string | null
): Promise<void> {
  // Sjekk om meldingen allerede er prosessert
  const existing = await prisma.unifiedMessage.findFirst({
    where: {
      channel: "EMAIL",
      externalId: message.id,
    },
  });

  if (existing) return;

  // Opprett melding
  const unifiedMessage = await prisma.unifiedMessage.create({
    data: {
      channel: "EMAIL",
      direction: "INBOUND",
      externalId: message.id,
      senderName: message.from,
      senderHandle: message.fromEmail,
      subject: message.subject,
      content: message.body,
      receivedAt: message.date,
      threadId: message.threadId,
      assignedToId: targetUserId,
      status: "AI_PROCESSING",
    },
  });

  // Generer AI-svar
  const aiResponse = await generateAIResponse(
    message.body,
    message.from,
    "EMAIL",
    targetUserId || "system"
  );

  await prisma.aIResponse.create({
    data: {
      messageId: unifiedMessage.id,
      draftContent: aiResponse.content,
      confidence: aiResponse.confidence,
      category: aiResponse.category,
      modelUsed: aiResponse.modelUsed,
      autoSent: aiResponse.confidence >= 0.95,
    },
  });

  // Oppdater status
  await prisma.unifiedMessage.update({
    where: { id: unifiedMessage.id },
    data: {
      status: aiResponse.confidence >= 0.95 ? "SENT" : "AI_READY",
    },
  });

  // Send push notification
  if (targetUserId && aiResponse.confidence < 0.95) {
    await notifyNewMessage(
      targetUserId,
      message.from,
      message.body,
      unifiedMessage.id
    );
  }
}

export function routeEmailToUser(toEmail: string): string | null {
  const emailRouting: Record<string, string> = {
    "anders@akgolf.no": "anders-user-id", // TODO: Hent faktisk user ID
    "markus@akgolf.no": "markus-user-id",
    "post@akgolf.no": null, // Null = alle trenere
  };

  return emailRouting[toEmail.toLowerCase()] ?? null;
}
```

- [ ] **Step 2: Opprett sync API**

```tsx
// app/api/coach/integrations/gmail/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { processIncomingEmail, routeEmailToUser } from "@/lib/coach/integrations/gmail";

// Dette kalles av Gmail MCP eller webhook
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.INTEGRATION_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await request.json();

    for (const message of messages) {
      const targetUserId = routeEmailToUser(message.to);
      await processIncomingEmail(
        {
          id: message.id,
          threadId: message.threadId,
          from: message.fromName,
          fromEmail: message.from,
          subject: message.subject,
          body: message.body,
          date: new Date(message.date),
        },
        targetUserId
      );
    }

    return NextResponse.json({ success: true, processed: messages.length });
  } catch (error) {
    console.error("Gmail sync error:", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/coach/integrations/ app/api/coach/integrations/
git commit -m "feat(coach-hub): add Gmail integration"
```

---

## Fase 2: Manuell konfigurasjon (krever brukerinput)

### Task 8: Environment Variables (MANUELL)

**Krever manuell handling:**

- [ ] **Step 1: Generer VAPID keys**

```bash
npx web-push generate-vapid-keys
```

- [ ] **Step 2: Legg til i .env.local**

```env
# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<public_key_fra_step_1>
VAPID_PRIVATE_KEY=<private_key_fra_step_1>

# Integration secret
INTEGRATION_SECRET=<generer_tilfeldig_string>

# WhatsApp (må opprettes)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=

# Meta (Instagram/Messenger)
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
```

---

### Task 9: WhatsApp Business Setup (MANUELL)

**Krever manuell handling:**

- [ ] Kjøp SIM-kort for WhatsApp Business
- [ ] Opprett WhatsApp Business-konto
- [ ] Koble til Meta Business Suite
- [ ] Hent Phone Number ID og Access Token
- [ ] Legg inn i .env.local

---

### Task 10: Meta App Setup (MANUELL)

**Krever manuell handling:**

- [ ] Gå til developers.facebook.com
- [ ] Opprett ny app (Business type)
- [ ] Aktiver Instagram Graph API
- [ ] Aktiver Messenger Platform
- [ ] Sett opp webhooks for begge
- [ ] Hent App ID, App Secret, Access Token
- [ ] Legg inn i .env.local

---

### Task 11: iMessage Bridge på Mac Mini (MANUELL)

**Krever handling på Mac Mini:**

- [ ] SSH til Mac Mini
- [ ] Opprett scripts-mappe
- [ ] Implementer AppleScript bridge
- [ ] Sett opp LaunchAgent
- [ ] Test manuelt

---

## Oppsummering

**Automatiske tasks (1-7):** Database, UI, AI, Push, Gmail
**Manuelle tasks (8-11):** Environment setup, WhatsApp, Meta, iMessage

