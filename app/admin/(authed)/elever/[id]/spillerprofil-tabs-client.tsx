"use client";

import { useState } from "react";
import {
  MapPin,
  User,
  Calendar,
  Phone,
  MessageCircle,
  CalendarPlus,
  Target,
  LayoutDashboard,
  Flag,
  Dumbbell,
  Brain,
  Activity,
  Wallet,
  BellRing,
  Trophy,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  DarkButton,
  DarkPill,
  DARK_TOKENS,
  avatarColor,
  getInitials,
} from "@/components/admin/coachhq/dark-cockpit";
import type { getStudentProfile } from "./actions";

type Profile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function ProfileHero({ profile }: { profile: Profile }) {
  const memberYear = profile.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : "—";
  const hcp = profile.handicap;

  return (
    <section
      className="relative rounded-[18px] overflow-hidden mb-0"
      style={{
        background: "linear-gradient(135deg, #0D2E23 0%, #143A2D 100%)",
        border: `1px solid ${DARK_TOKENS.line}`,
        height: 240,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1600")',
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.32,
          filter: "saturate(0.9)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,46,35,0.5) 0%, rgba(13,46,35,0.95) 100%)",
        }}
      />
      <div className="relative z-10 h-full px-8 py-7 flex items-end justify-between gap-6">
        <div className="flex items-end gap-[18px] min-w-0">
          <div
            className="w-[92px] h-[92px] rounded-full grid place-items-center text-[32px] font-extrabold shrink-0 tracking-[-0.02em]"
            style={{
              background: avatarColor(profile.name),
              color: "#0A1F18",
              border: "3px solid #102B1E",
            }}
          >
            {getInitials(profile.name)}
          </div>
          <div className="pb-1 min-w-0">
            <div
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 mb-1.5"
              style={{ color: DARK_TOKENS.accent }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: DARK_TOKENS.accent,
                  boxShadow: `0 0 8px ${DARK_TOKENS.accent}`,
                }}
              />
              {profile.subscriptionTier ?? "Spiller"} ·{" "}
              {profile.isActive ? "Aktiv" : "Inaktiv"}
            </div>
            <h1
              className="m-0 font-extrabold text-[38px] text-white tracking-[-0.025em] leading-none truncate"
            >
              {profile.name ?? "Uten navn"}
            </h1>
            <div className="mt-2 flex gap-3.5 text-[13px] flex-wrap" style={{ color: "rgba(255,255,255,0.7)" }}>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                AK Golf Academy
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3 h-3" />
                {profile.subscriptionTier ?? "—"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Medlem siden {memberYear}
              </span>
              {profile.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  {profile.email.split("@")[0]}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 items-end pb-1.5">
          <div
            className="rounded-xl px-4 py-3 text-center"
            style={{
              background: "rgba(209,248,67,0.16)",
              border: "1px solid rgba(209,248,67,0.30)",
            }}
          >
            <div
              className="font-mono text-[9px] uppercase tracking-[0.14em]"
              style={{ color: DARK_TOKENS.accent }}
            >
              HCP
            </div>
            <div className="text-[26px] font-bold text-white mt-0.5 tabular-nums tracking-[-0.02em]">
              {hcp !== null ? hcp.toFixed(1) : "—"}
            </div>
          </div>
          <div className="flex gap-2 pb-1.5">
            <DarkButton>
              <MessageCircle className="w-3.5 h-3.5" />
              Melding
            </DarkButton>
            <DarkButton>
              <CalendarPlus className="w-3.5 h-3.5" />
              Bok økt
            </DarkButton>
            <DarkButton variant="accent">
              <Target className="w-3.5 h-3.5" />
              Sett mål
            </DarkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

type TabId = "oversikt" | "golf" | "coaching" | "mental" | "trening" | "okonomi" | "signaler";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; alert?: boolean }[] = [
  { id: "oversikt", label: "Oversikt", icon: LayoutDashboard },
  { id: "golf", label: "Golf", icon: Flag, badge: "86" },
  { id: "coaching", label: "Coaching", icon: Dumbbell, badge: "23" },
  { id: "mental", label: "Mental", icon: Brain },
  { id: "trening", label: "Trening", icon: Activity },
  { id: "okonomi", label: "Økonomi", icon: Wallet },
  { id: "signaler", label: "Signaler", icon: BellRing, badge: "2", alert: true },
];

function ProfileTabs({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <nav
      className="sticky z-[5] -mx-7 px-7 flex gap-0"
      style={{
        top: 58,
        background: DARK_TOKENS.bg,
        borderBottom: `1px solid ${DARK_TOKENS.line}`,
        marginTop: -1,
      }}
    >
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="px-[18px] py-3.5 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
            style={{
              color: isActive ? DARK_TOKENS.accent : "rgba(255,255,255,0.55)",
              borderBottom: `2px solid ${isActive ? DARK_TOKENS.accent : "transparent"}`,
              fontWeight: isActive ? 600 : 500,
              marginBottom: -1,
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {t.label}
            {t.badge && (
              <span
                className="font-mono text-[10px] px-1.5 py-px rounded-full"
                style={{
                  background: t.alert
                    ? "rgba(184,66,51,0.30)"
                    : isActive
                      ? "rgba(209,248,67,0.20)"
                      : "rgba(255,255,255,0.10)",
                  color: t.alert
                    ? DARK_TOKENS.danger
                    : isActive
                      ? DARK_TOKENS.accent
                      : "rgba(255,255,255,0.75)",
                }}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------

function Panel({
  children,
  title,
  sub,
  action,
}: {
  children: React.ReactNode;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[14px] p-[18px]"
      style={{
        background: DARK_TOKENS.card,
        border: `1px solid ${DARK_TOKENS.line}`,
      }}
    >
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="m-0 text-[14px] font-semibold text-white tracking-[-0.01em]">
            {title}
          </h3>
          {sub && (
            <div
              className="font-mono text-[9px] uppercase tracking-[0.14em] mt-1"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {sub}
            </div>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function StatBlock({
  label,
  value,
  sub,
  subTone,
  valueColor,
}: {
  label: string;
  value: string;
  sub?: string;
  subTone?: "up" | "down" | "muted";
  valueColor?: string;
}) {
  return (
    <div
      className="rounded-[10px] px-3.5 py-3"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${DARK_TOKENS.line}`,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {label}
      </div>
      <div
        className="text-[22px] font-bold mt-1 tracking-[-0.02em] tabular-nums"
        style={{ color: valueColor ?? "#fff" }}
      >
        {value}
        {sub && (
          <span
            className="text-[11px] font-medium ml-1"
            style={{
              color:
                subTone === "up"
                  ? DARK_TOKENS.success
                  : subTone === "down"
                    ? DARK_TOKENS.danger
                    : "rgba(255,255,255,0.5)",
            }}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

function SignalCard({
  variant,
  icon,
  title,
  body,
}: {
  variant: "up" | "warn" | "danger";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  const styleMap = {
    up: {
      background: "rgba(209,248,67,0.10)",
      border: "1px solid rgba(209,248,67,0.25)",
      borderLeft: `3px solid ${DARK_TOKENS.accent}`,
      iconColor: DARK_TOKENS.accent,
    },
    warn: {
      background: "rgba(196,138,50,0.10)",
      border: "1px solid rgba(196,138,50,0.30)",
      borderLeft: `3px solid ${DARK_TOKENS.warn}`,
      iconColor: DARK_TOKENS.warn,
    },
    danger: {
      background: "rgba(184,66,51,0.10)",
      border: "1px solid rgba(184,66,51,0.30)",
      borderLeft: `3px solid ${DARK_TOKENS.danger}`,
      iconColor: DARK_TOKENS.danger,
    },
  } as const;
  const s = styleMap[variant];
  return (
    <div className="rounded-[10px] p-3.5" style={{ ...s }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span style={{ color: s.iconColor }}>{icon}</span>
        <h4 className="m-0 text-[13px] font-semibold text-white">{title}</h4>
      </div>
      <p className="m-0 text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
        {body}
      </p>
    </div>
  );
}

function SgRow({ cat, value }: { cat: string; value: number }) {
  const pos = value >= 0;
  const widthPct = Math.min(48, Math.max(2, Math.abs(value) * 60));
  return (
    <div
      className="grid items-center py-2"
      style={{ gridTemplateColumns: "96px 1fr 60px", gap: 12 }}
    >
      <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
        {cat}
      </span>
      <div className="relative h-2 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="absolute top-[-2px] bottom-[-2px] left-1/2 w-px" style={{ background: "rgba(255,255,255,0.25)" }} />
        <div
          className="absolute top-0 bottom-0 rounded"
          style={{
            background: pos ? DARK_TOKENS.success : DARK_TOKENS.danger,
            left: pos ? "50%" : undefined,
            right: pos ? undefined : "50%",
            width: `${widthPct}%`,
          }}
        />
      </div>
      <span
        className="font-mono text-[12px] font-semibold text-right tabular-nums"
        style={{ color: pos ? DARK_TOKENS.success : DARK_TOKENS.danger }}
      >
        {pos ? "+" : "−"}
        {Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab body — Oversikt
// ---------------------------------------------------------------------------

function OversiktTab({ profile }: { profile: Profile }) {
  // KPI-strip
  const sgPerRound = 0.42; // mock — vi har ikke beregnet ennå
  const streak = 14;

  // Goals
  const activeGoals = profile.Goal.filter((g) => g.status === "ACTIVE").slice(0, 3);

  // Activity
  const activities = [
    ...profile.Booking.slice(0, 4).map((b) => ({
      id: `b-${b.id}`,
      date: format(new Date(b.startTime), "d MMM · HH:mm", { locale: nb }),
      icon: <Dumbbell className="w-3.5 h-3.5" />,
      iconClass: "session" as const,
      title: (b.ServiceType as { name?: string })?.name ?? "Coaching-økt",
      meta: extractInstructorName(b.Instructor) ?? "—",
      tag: "Fullført",
      tagTone: "success" as const,
    })),
    ...profile.CoachingSession.slice(0, 2).map((cs) => ({
      id: `cs-${cs.id}`,
      date: format(new Date(cs.sessionDate), "d MMM · HH:mm", { locale: nb }),
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      iconClass: "note" as const,
      title: cs.primaryFocus ? `Notat: ${cs.primaryFocus}` : "Coach-notat",
      meta: cs.instructorNotes?.slice(0, 80) ?? "—",
      tag: "Anders K.",
      tagTone: undefined,
    })),
  ].slice(0, 6);

  return (
    <div className="pt-7">
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatBlock
          label="HCP"
          value={profile.handicap !== null ? profile.handicap.toFixed(1) : "—"}
          sub="↘ −0.6"
          subTone="up"
        />
        <StatBlock
          label="SG / runde"
          value={`+${sgPerRound.toFixed(2)}`}
          sub="↗"
          subTone="up"
          valueColor={DARK_TOKENS.success}
        />
        <StatBlock
          label="Aktivitet 30d"
          value={`${profile.sessionsThisMonth}`}
          sub="økter"
          subTone="muted"
        />
        <StatBlock
          label="Streak"
          value={`${streak}d`}
          valueColor={DARK_TOKENS.accent}
        />
      </div>

      {/* HCP timeline + Aktive mål */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-[18px] mb-5">
        <Panel
          title="HCP-utvikling · 12 måneder"
          sub={`${profile.HandicapEntry.length} oppdateringer`}
          action={
            <div className="flex gap-1.5">
              <DarkPill variant="accent">PR siste 30d</DarkPill>
              <DarkPill variant="success">På mål</DarkPill>
            </div>
          }
        >
          <HcpChart entries={profile.HandicapEntry} />
        </Panel>
        <Panel
          title="Aktive mål"
          sub={`${activeGoals.length} av ${profile.Goal.length} på sporet`}
          action={<DarkPill variant="accent">Mission Board →</DarkPill>}
        >
          {activeGoals.length === 0 ? (
            <p className="m-0 text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Ingen aktive mål.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {activeGoals.map((g) => {
                const target = g.targetValue ?? 0;
                const current = g.currentValue ?? 0;
                const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
                return (
                  <div
                    key={g.id}
                    className="rounded-[10px] p-3.5"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: `1px solid ${DARK_TOKENS.line}`,
                    }}
                  >
                    <div className="flex justify-between text-[12px] mb-2">
                      <span className="font-medium text-white">{g.title}</span>
                      <span
                        className="font-mono font-semibold"
                        style={{ color: DARK_TOKENS.accent }}
                      >
                        {progress}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded"
                        style={{ width: `${progress}%`, background: DARK_TOKENS.accent }}
                      />
                    </div>
                    {g.targetDate && (
                      <div
                        className="font-mono text-[10px] tracking-[0.06em] mt-2"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Deadline {format(new Date(g.targetDate), "d. MMM", { locale: nb })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      {/* Aktivitet + Sidebar */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-[18px]">
        <Panel
          title="Siste aktivitet"
          sub="14 dager"
          action={<DarkPill>Se alt →</DarkPill>}
        >
          {activities.length === 0 ? (
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Ingen aktivitet enda.
            </p>
          ) : (
            <div className="flex flex-col gap-0">
              {activities.map((a, i) => (
                <div
                  key={a.id}
                  className="grid items-center gap-3.5 py-3"
                  style={{
                    gridTemplateColumns: "100px 32px 1fr auto",
                    borderBottom:
                      i === activities.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span
                    className="font-mono text-[11px] tracking-[0.06em]"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {a.date}
                  </span>
                  <span
                    className="w-7 h-7 rounded-md grid place-items-center"
                    style={{
                      background:
                        a.iconClass === "session"
                          ? "rgba(209,248,67,0.16)"
                          : "rgba(175,82,222,0.18)",
                      color:
                        a.iconClass === "session" ? DARK_TOKENS.accent : DARK_TOKENS.violet,
                    }}
                  >
                    {a.icon}
                  </span>
                  <div>
                    <div className="text-[13px] font-medium text-white">{a.title}</div>
                    <div
                      className="font-mono text-[11px] mt-0.5 tracking-[0.04em] truncate"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {a.meta}
                    </div>
                  </div>
                  {a.tagTone === "success" ? (
                    <DarkPill variant="success">{a.tag}</DarkPill>
                  ) : (
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {a.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>
        <div className="flex flex-col gap-[18px]">
          <Panel title="Strokes Gained · 30d" sub="vs. HCP-snitt">
            <SgRow cat="Off the tee" value={0.18} />
            <SgRow cat="Approach" value={0.08} />
            <SgRow cat="Around green" value={-0.1} />
            <SgRow cat="Putting" value={0.26} />
            <div
              className="mt-3 pt-3 flex justify-between text-[12px]"
              style={{ borderTop: `1px dashed ${DARK_TOKENS.line}` }}
            >
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Total SG</span>
              <span
                className="font-mono font-semibold"
                style={{ color: DARK_TOKENS.success }}
              >
                +0.42 / runde
              </span>
            </div>
          </Panel>
          <Panel title="Signaler" sub="2 åpne">
            <div className="flex flex-col gap-2.5">
              <SignalCard
                variant="up"
                icon={<Trophy className="w-3.5 h-3.5" />}
                title="3 PR siste 30d"
                body="Foreslå turneringsmål — spilleren er klar for å konkurrere."
              />
              <SignalCard
                variant="warn"
                icon={<AlertTriangle className="w-3.5 h-3.5" />}
                title="Around-green svakest"
                body="Chip- og pitch-volum kan økes. Anbefal short-game-blokk neste 2 uker."
              />
            </div>
          </Panel>
          {profile.UpcomingBooking.length > 0 && (
            <Panel title="Neste opp" sub="planlagt">
              <div className="flex flex-col gap-2.5">
                {profile.UpcomingBooking.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className="flex gap-2.5 items-center py-2.5 px-3 rounded-md"
                    style={{
                      background: "rgba(209,248,67,0.10)",
                      borderLeft: `3px solid ${DARK_TOKENS.accent}`,
                    }}
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: DARK_TOKENS.accent }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-white">
                        {format(new Date(b.startTime), "EEEE d. MMM · HH:mm", { locale: nb })}
                      </div>
                      <div
                        className="font-mono text-[11px] truncate"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {(b.ServiceType as { name?: string })?.name ?? "Økt"} ·{" "}
                        {extractInstructorName(b.Instructor) ?? "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab body — andre tabs (kompakte stubs som matcher mockup-stil)
// ---------------------------------------------------------------------------

function PlaceholderTab({ title, body }: { title: string; body: string }) {
  return (
    <div className="pt-7">
      <Panel title={title} sub="kommer snart">
        <p className="m-0 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          {body}
        </p>
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HCP chart
// ---------------------------------------------------------------------------

function HcpChart({
  entries,
}: {
  entries: { date: Date | string; handicapIndex: number }[];
}) {
  if (entries.length < 2) {
    return (
      <div
        className="text-[12px] py-10 text-center"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        Ikke nok HCP-historikk enda.
      </div>
    );
  }
  const W = 720;
  const H = 180;
  const values = entries.map((e) => e.handicapIndex);
  const min = Math.min(...values) - 0.5;
  const max = Math.max(...values) + 0.5;
  const range = Math.max(0.1, max - min);
  const points = entries
    .map((e, i) => {
      const x = (i / Math.max(1, entries.length - 1)) * W;
      const y = ((max - e.handicapIndex) / range) * (H - 40) + 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPoints = `${points} ${W},${H} 0,${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 180 }}>
      <line x1="0" y1="40" x2={W} y2="40" stroke="rgba(255,255,255,0.05)" />
      <line x1="0" y1="80" x2={W} y2="80" stroke="rgba(255,255,255,0.05)" />
      <line x1="0" y1="120" x2={W} y2="120" stroke="rgba(255,255,255,0.05)" />
      <polygon points={areaPoints} fill="rgba(209,248,67,0.10)" />
      <polyline points={points} fill="none" stroke={DARK_TOKENS.accent} strokeWidth="2" />
      <text x="4" y="44" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
        {max.toFixed(1)}
      </text>
      <text x="4" y="124" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
        {min.toFixed(1)}
      </text>
      <text x="0" y="170" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
        {format(new Date(entries[0].date), "MMM yy", { locale: nb }).toUpperCase()}
      </text>
      <text
        x={W}
        y="170"
        fill="rgba(255,255,255,0.4)"
        fontSize="9"
        fontFamily="JetBrains Mono"
        textAnchor="end"
      >
        {format(new Date(entries[entries.length - 1].date), "MMM yy", { locale: nb }).toUpperCase()}
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractInstructorName(instructor: unknown): string | null {
  if (!instructor || typeof instructor !== "object") return null;
  const inst = instructor as { User?: { name?: string | null } | null };
  return inst.User?.name ?? null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  profile: Profile;
}

export function SpillerprofilTabsClient({ profile }: Props) {
  const [active, setActive] = useState<TabId>("oversikt");

  return (
    <>
      <ProfileHero profile={profile} />
      <ProfileTabs active={active} onChange={setActive} />
      {active === "oversikt" && <OversiktTab profile={profile} />}
      {active === "golf" && (
        <PlaceholderTab
          title="Golf-ferdigheter"
          body="Strokes Gained, ferdighetsnivå, scores. Kobles til DataGolf og runde-data."
        />
      )}
      {active === "coaching" && (
        <PlaceholderTab
          title="Coaching-historikk"
          body="Alle coaching-økter, primærcoach, plan-progresjon og siste notater."
        />
      )}
      {active === "mental" && (
        <PlaceholderTab
          title="Mental"
          body="Selvrapportering, stemnings-grid og pre-runde-rutine."
        />
      )}
      {active === "trening" && (
        <PlaceholderTab
          title="Trening"
          body="Fysisk aktivitet, søvn, hvilepuls og skadestatus."
        />
      )}
      {active === "okonomi" && (
        <PlaceholderTab
          title="Økonomi"
          body="Abonnement, betalinger, pakker og YTD inntekt."
        />
      )}
      {active === "signaler" && (
        <div className="pt-7 grid gap-2.5 max-w-2xl">
          <SignalCard
            variant="up"
            icon={<Trophy className="w-3.5 h-3.5" />}
            title="3 PR siste 30 dager"
            body="Spilleren har slått PR på score, putts/runde og SG-putting siste 4 uker."
          />
          <SignalCard
            variant="warn"
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            title="Around-green nå svakeste ledd"
            body="Snitt SG around-green har droppet til −0.10. Anbefal short-game-blokk i 2 uker."
          />
        </div>
      )}
    </>
  );
}
