"use client";

import { CoachHQDarkShell, PageHead, Card, CardHeader, Button, Pill } from "@/components/admin/coachhq-dark";
import { SignalCard } from "@/components/admin/coachhq-dark/d1/SignalCard";
import { Timeline, type TimelineRow } from "@/components/admin/coachhq-dark/d1/Timeline";
import {
  Filter,
  Download,
  Plus,
  MessageCircle,
  Layers,
  Trophy,
  UserPlus,
  CalendarPlus,
  Receipt,
  MessageSquarePlus,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface Session {
  id: string;
  name: string;
  time: string;
  isActive?: boolean;
  subtitle?: string;
}

interface ActionItem {
  text: string;
  variant: "error" | "warning" | "info";
}

interface DagensFokusData {
  kpis: {
    sessionsToday: number;
    activeStudents: number;
    pendingBookings: number;
    mtdRevenue: number;
    weeklySessions: number;
  };
  divisions: {
    coaching: { studentCount: number; sessions: Session[]; actionItems: ActionItem[] };
    junior: { studentCount: number; sessions: Session[]; actionItems: ActionItem[] };
    gfgk: { studentCount: number; sessions: Session[] };
  };
}

interface DagensFokusClientProps {
  data: DagensFokusData;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
}

function formatRevenueShort(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1000) return `${Math.round(amount / 1000)}k`;
  return `${amount}`;
}

function formatDateMeta(): { eyebrow: string; topbarMeta: string } {
  const now = new Date();
  const dayName = now.toLocaleDateString("nb-NO", { weekday: "long" });
  const dayNum = now.getDate();
  const monthShort = now.toLocaleDateString("nb-NO", { month: "short" });
  const monthLong = now.toLocaleDateString("nb-NO", { month: "long" });
  const time = now.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    eyebrow: `Dagens fokus · ${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum} ${monthLong}`,
    topbarMeta: `${dayName.slice(0, 3)} ${dayNum} ${monthShort} · ${time} CET`,
  };
}

const QUICK_ACTIONS: { label: string; sub: string; icon: LucideIcon }[] = [
  { label: "Ny spiller", sub: "Onboard", icon: UserPlus },
  { label: "Ny økt", sub: "Book inn", icon: CalendarPlus },
  { label: "Ny plan", sub: "Mal-bibliotek", icon: Layers },
  { label: "Ny faktura", sub: "Stripe", icon: Receipt },
  { label: "Send melding", sub: "Til spiller", icon: MessageSquarePlus },
  { label: "AI-sammendrag", sub: "Dagens runder", icon: Sparkles },
];

export function DagensFokusClient({ data, user }: DagensFokusClientProps) {
  const { eyebrow, topbarMeta } = formatDateMeta();
  const coachName = user.name?.split(" ")[0] ?? "Coach";

  // Timeline-data fra reelle bookinger; fall tilbake til demo hvis tomt
  const allSessions = [
    ...data.divisions.coaching.sessions,
    ...data.divisions.junior.sessions,
    ...data.divisions.gfgk.sessions,
  ].sort((a, b) => a.time.localeCompare(b.time));

  const timelineRows: TimelineRow[] =
    allSessions.length > 0
      ? allSessions.map((s) => ({
          time: s.time,
          duration: "60 min",
          title: `${s.name}`,
          metaIcon: "map-pin",
          meta: s.subtitle ?? "Studio",
          pill: s.isActive
            ? { tone: "accent", label: "Pågår nå" }
            : { tone: "default", label: "Planlagt" },
          variant: s.isActive ? "live" : "default",
          pulse: s.isActive,
        }))
      : DEMO_TIMELINE;

  const tasksDone = 3;
  const tasksTotal = 6;

  return (
    <CoachHQDarkShell
      user={user}
      title={`CoachHQ — ${coachName}`}
      meta={topbarMeta}
    >
      <PageHead
        eyebrow={eyebrow}
        title="Tre signaler trenger din oppmerksomhet"
        description={`Du har ${data.kpis.sessionsToday} økter i dag · Markus jobber med 8`}
        actions={
          <>
            <Button variant="ghost" icon={<Filter className="w-3.5 h-3.5" />}>
              Filter
            </Button>
            <Button icon={<Download className="w-3.5 h-3.5" />}>
              Dagsrapport
            </Button>
            <Button variant="primary" icon={<Plus className="w-3.5 h-3.5" />}>
              Ny økt
            </Button>
          </>
        }
      />

      {/* Signals */}
      <div className="grid grid-cols-3 gap-3.5 mb-[18px]">
        <SignalCard
          tone="urgent"
          corner="Krever handling"
          iconName="alert-triangle"
          num="2"
          numSuffix="spillere"
          description={
            <>
              <strong style={{ color: "#fff" }}>Emma Lien</strong> og{" "}
              <strong style={{ color: "#fff" }}>Henrik Vold</strong> har ikke
              logget runder på 14+ dager. Vurder retention-touch.
            </>
          }
          actions={
            <>
              <Button size="sm" icon={<MessageCircle className="w-3 h-3" />}>
                Send melding
              </Button>
              <Button size="sm" variant="ghost">
                Se profiler →
              </Button>
            </>
          }
        />

        <SignalCard
          tone="attention"
          corner="Trender ned"
          iconName="trending-down"
          num="3"
          numSuffix="spillere"
          description="SG Putting har falt >0.4 siste 4 uker. Anbefaler short-game-fokus i neste plan."
          actions={
            <>
              <Button size="sm" icon={<Layers className="w-3 h-3" />}>
                Bygg plan
              </Button>
              <Button size="sm" variant="ghost">
                Se data →
              </Button>
            </>
          }
        />

        <SignalCard
          tone="opportunity"
          corner="Mulighet"
          iconName="award"
          num="1"
          numSuffix="spiller"
          description={
            <>
              <strong style={{ color: "#fff" }}>Sofie Holm</strong> har slått PR
              3 ganger denne måneden. Foreslå turneringsmål.
            </>
          }
          actions={
            <>
              <Button size="sm" variant="primary" icon={<Trophy className="w-3 h-3" />}>
                Sett mål
              </Button>
              <Button size="sm" variant="ghost">
                Profil →
              </Button>
            </>
          }
        />
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-5 gap-3 mb-[18px]">
        <KPI label="Aktive spillere" value={data.kpis.activeStudents} delta="+3" />
        <KPI label="Denne uken" value={data.kpis.weeklySessions} small="økter" />
        <KPI label="Snitt SG" value="+0.42" delta="+0.08" />
        <KPI label="MRR" value={`${formatRevenueShort(data.kpis.mtdRevenue)}`} delta="+5%" />
        <KPI label="Forfalte fakturaer" value="2" deltaTone="down" alert />
      </div>

      {/* Main grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "1.5fr 1fr" }}
      >
        <Card>
          <CardHeader title="Dagens timeline" sub="06:00 — 20:00" />
          <Timeline rows={timelineRows} />
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Dagens oppgaver" sub={`${tasksDone}/${tasksTotal}`} />
            <div className="flex flex-col gap-2">
              {DEMO_TASKS.map((task, idx) => (
                <Task key={idx} {...task} />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Hurtigvalg" />
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    className="flex items-center gap-2.5 px-3.5 py-3.5 rounded-[10px] border text-left transition-all"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      borderColor: "#1a4a3a",
                    }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg grid place-items-center shrink-0"
                      style={{
                        background: "rgba(209,248,67,0.10)",
                        color: "#D1F843",
                      }}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.8} />
                    </span>
                    <span>
                      <span
                        className="block text-[12px] font-semibold"
                        style={{ color: "#FFFFFF" }}
                      >
                        {q.label}
                      </span>
                      <span
                        className="block text-[10px] mt-px"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {q.sub}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </CoachHQDarkShell>
  );
}

/* ============================================================
 * Lokale subkomponenter
 * ========================================================== */

function KPI({
  label,
  value,
  small,
  delta,
  deltaTone = "up",
  alert,
}: {
  label: string;
  value: string | number;
  small?: string;
  delta?: string;
  deltaTone?: "up" | "down";
  alert?: boolean;
}) {
  return (
    <div
      className="px-4 py-3.5 rounded-xl"
      style={{
        background: alert ? "rgba(184,66,51,0.10)" : "#0D2E23",
        border: `1px solid ${alert ? "rgba(184,66,51,0.45)" : "#1a4a3a"}`,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-[26px] font-bold tabular-nums"
        style={{
          color: alert ? "#F49283" : "#FFFFFF",
          letterSpacing: "-0.025em",
        }}
      >
        {value}
        {small && (
          <small
            className="ml-1.5 font-medium"
            style={{ fontSize: 11, color: "#6FCBA1" }}
          >
            {small}
          </small>
        )}
        {delta && (
          <small
            className="ml-1.5 font-medium"
            style={{
              fontSize: 11,
              color: deltaTone === "down" ? "#F49283" : "#6FCBA1",
            }}
          >
            {delta}
          </small>
        )}
      </div>
    </div>
  );
}

function Task({
  done,
  label,
  who,
  pill,
  pillTone,
}: {
  done?: boolean;
  label: string;
  who: string;
  pill: string;
  pillTone: "default" | "success" | "warn";
}) {
  return (
    <div
      className="grid items-start gap-2.5 px-3 py-2.5 rounded-lg"
      style={{
        gridTemplateColumns: "18px 1fr auto",
        background: "rgba(255,255,255,0.025)",
      }}
    >
      <div
        className="mt-0.5"
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: done
            ? "1.5px solid #D1F843"
            : "1.5px solid rgba(255,255,255,0.25)",
          background: done ? "#D1F843" : "rgba(255,255,255,0.04)",
          display: "grid",
          placeItems: "center",
        }}
      >
        {done && (
          <span
            style={{
              display: "block",
              width: 6,
              height: 3,
              borderLeft: "1.5px solid #0A1F18",
              borderBottom: "1.5px solid #0A1F18",
              transform: "rotate(-45deg) translateY(-1px)",
            }}
          />
        )}
      </div>
      <div className="min-w-0">
        <div
          className="text-[13px]"
          style={{
            color: done ? "rgba(255,255,255,0.5)" : "#FFFFFF",
            textDecoration: done ? "line-through" : undefined,
          }}
        >
          {label}
        </div>
        <div
          className="mt-0.5"
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em",
          }}
        >
          {who}
        </div>
      </div>
      <Pill tone={pillTone}>{pill}</Pill>
    </div>
  );
}

/* ============================================================
 * Demo-data (vises kun når server ikke har levert reelle bookinger)
 * ========================================================== */

const DEMO_TIMELINE: TimelineRow[] = [
  {
    time: "07:00",
    duration: "45 min",
    title: "Sofie Holm — Driving Range",
    metaIcon: "map-pin",
    meta: "Bay 4 · Driver-fokus · TrackMan logget",
    pill: { tone: "success", label: "Fullført" },
  },
  {
    time: "09:30",
    duration: "60 min",
    title: "Erik Lund — Performance Studio",
    metaIcon: "map-pin",
    meta: "Studio 1 · Iron consistency · 3 nye datapoints",
    pill: { tone: "success", label: "Fullført" },
  },
  {
    time: "14:00",
    duration: "60 min",
    title: "Markus Eide — Putting Green",
    metaIcon: "zap",
    meta: "Lag-styring · Started 14:00 · 32 min igjen",
    pill: { tone: "accent", label: "Pågår nå" },
    variant: "live",
    pulse: true,
  },
  {
    time: "15:30",
    duration: "45 min",
    title: "Henrik Vold — Banecoaching 9 hull",
    metaIcon: "map-pin",
    meta: "Hull 1–9 · Course management · Forberedt ✓",
    pill: { tone: "default", label: "Neste opp" },
    variant: "next",
  },
  {
    time: "17:00",
    duration: "60 min",
    title: "Emma Lien — Performance Studio",
    metaIcon: "alert-circle",
    meta: "Studio 2 · Fullswing-eval · Ingen plan satt",
    pill: { tone: "warn", label: "Ikke forberedt" },
  },
  {
    time: "18:30",
    duration: "90 min",
    title: "Junior Group A — Kveldstrening",
    metaIcon: "users",
    meta: "Driving Range · Aldersgruppe 10–13 · Markus assist",
    pill: { tone: "default", label: "8 påmeldte" },
  },
];

const DEMO_TASKS = [
  {
    done: true,
    label: "Send treningsplan til Sofie",
    who: "CRM · 08:14",
    pill: "Done",
    pillTone: "success" as const,
  },
  {
    done: true,
    label: "Bekreft junior-gruppe påmelding",
    who: "Booking",
    pill: "Done",
    pillTone: "success" as const,
  },
  {
    done: true,
    label: "Faktura-utsendelse mai (8 stk)",
    who: "Stripe",
    pill: "Done",
    pillTone: "success" as const,
  },
  {
    label: "Forberede Emma kl 17 — fullswing-eval",
    who: "Forfaller 16:30",
    pill: "2t",
    pillTone: "warn" as const,
  },
  {
    label: "Skriv opp-summering Erik (kveldsplan)",
    who: "Coaching",
    pill: "I dag",
    pillTone: "default" as const,
  },
  {
    label: "Godkjenne Markus' nye plan-mal",
    who: "Team · venter",
    pill: "3 d",
    pillTone: "warn" as const,
  },
];
