"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  User,
  Calendar,
  Target,
  LayoutDashboard,
  Flag,
  Dumbbell,
  Brain,
  Activity,
  Hammer,
  Wallet,
  BellRing,
  History,
  ChevronDown,
  MessageCircle,
  CalendarPlus,
  Sparkles,
  Trophy,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Button,
  Pill,
  TOKENS,
  avatarColor,
  getInitials,
} from "@/components/admin/coachhq-dark";
import type { getStudentProfile } from "./actions";

type Profile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

// ---------------------------------------------------------------------------
// Section IDs
// ---------------------------------------------------------------------------

type SectionId =
  | "summary"
  | "golf"
  | "coaching"
  | "mental"
  | "trening"
  | "utstyr"
  | "okonomi"
  | "signaler"
  | "aktivitet";

const SECTIONS: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; alert?: boolean }[] = [
  { id: "summary", label: "Sammendrag", icon: LayoutDashboard },
  { id: "golf", label: "Golf-ferdigheter", icon: Flag, badge: "86" },
  { id: "coaching", label: "Coaching", icon: Dumbbell, badge: "23" },
  { id: "mental", label: "Mental", icon: Brain },
  { id: "trening", label: "Trening", icon: Activity },
  { id: "utstyr", label: "Utstyr", icon: Hammer },
  { id: "okonomi", label: "Økonomi", icon: Wallet },
  { id: "signaler", label: "Signaler", icon: BellRing, badge: "2", alert: true },
  { id: "aktivitet", label: "Aktivitet", icon: History },
];

// ---------------------------------------------------------------------------
// Compact hero
// ---------------------------------------------------------------------------

function CompactHero({ profile }: { profile: Profile }) {
  const memberYear = profile.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : "—";
  const activeGoals = profile.Goal.filter((g) => g.status === "ACTIVE").length;

  return (
    <section
      className="col-span-full relative flex items-center gap-[18px] px-5 py-4 rounded-[14px] mb-1.5 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(13,46,35,1) 0%, rgba(20,58,45,1) 100%)",
        border: `1px solid ${TOKENS.line}`,
      }}
    >
      <div
        className="absolute right-0 top-0 bottom-0"
        style={{
          width: 320,
          backgroundImage:
            'url("https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          maskImage: "linear-gradient(to right, transparent 0%, black 50%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%)",
        }}
      />
      <div
        className="relative z-10 w-16 h-16 rounded-full grid place-items-center text-[22px] font-extrabold shrink-0 tracking-[-0.02em]"
        style={{ background: avatarColor(profile.name), color: "#0A1F18" }}
      >
        {getInitials(profile.name)}
      </div>
      <div className="relative z-10 min-w-0 flex-1">
        <h1 className="m-0 font-extrabold text-[28px] text-white tracking-[-0.03em] leading-none truncate">
          {profile.name ?? "Uten navn"}
        </h1>
        <div className="text-[12px] mt-1 flex gap-3 flex-wrap" style={{ color: "rgba(255,255,255,0.6)" }}>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />
            AK Golf Academy
          </span>
          <span className="inline-flex items-center gap-1">
            <User className="w-2.5 h-2.5" />
            {profile.subscriptionTier ?? "—"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5" />
            Medlem siden {memberYear}
          </span>
          <span className="inline-flex items-center gap-1">
            <Target className="w-2.5 h-2.5" />
            {activeGoals} aktive mål
          </span>
        </div>
      </div>
      <div className="relative z-10 ml-auto flex gap-2">
        <HeroStatMini label="HCP" value={profile.handicap !== null ? profile.handicap.toFixed(1) : "—"} highlight />
        <HeroStatMini label="SG/Runde" value="+0.42" />
        <HeroStatMini label="30d økter" value={`${profile.sessionsThisMonth}`} />
        <HeroStatMini label="Streak" value="14d" />
      </div>
    </section>
  );
}

function HeroStatMini({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="px-3 py-2 rounded-[10px]"
      style={{
        background: highlight ? "rgba(209,248,67,0.10)" : "rgba(255,255,255,0.04)",
        border: highlight
          ? "1px solid rgba(209,248,67,0.30)"
          : "1px solid rgba(255,255,255,0.08)",
        minWidth: 70,
      }}
    >
      <div
        className="font-mono text-[8px] uppercase tracking-[0.14em]"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {label}
      </div>
      <div
        className="text-[16px] font-bold tabular-nums tracking-[-0.01em] mt-0.5"
        style={{ color: highlight ? TOKENS.accent : "#fff" }}
      >
        {value}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TOC sidebar
// ---------------------------------------------------------------------------

function TocSidebar({ active, profileId }: { active: SectionId; profileId: string }) {
  return (
    <aside
      className="sticky rounded-xl p-2"
      style={{
        top: 80,
        background: TOKENS.card,
        border: `1px solid ${TOKENS.line}`,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em] px-2.5 pt-1 pb-2"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        Innhold
      </div>
      {SECTIONS.map((s) => {
        const Icon = s.icon;
        const isActive = s.id === active;
        return (
          <a
            key={s.id}
            href={`#sec-${s.id}`}
            className="flex items-center gap-2 px-2.5 py-[7px] rounded-md text-[12px] mb-px"
            style={{
              color: isActive ? TOKENS.accent : "rgba(255,255,255,0.7)",
              background: isActive ? "rgba(209,248,67,0.10)" : "transparent",
              borderLeft: `2px solid ${isActive ? TOKENS.accent : "transparent"}`,
            }}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1">{s.label}</span>
            {s.badge && (
              <span
                className="font-mono text-[9px]"
                style={{
                  color: s.alert ? TOKENS.danger : "rgba(255,255,255,0.4)",
                }}
              >
                {s.badge}
              </span>
            )}
          </a>
        );
      })}
      <div
        className="mt-4 pt-3 flex flex-col gap-1.5"
        style={{ borderTop: `1px solid ${TOKENS.line}` }}
      >
        <Link href={`/admin/meldinger?to=${profileId}`}>
          <Button className="!justify-start !text-[11px] !px-2.5 !py-1.5 !w-full">
            <MessageCircle className="w-3 h-3" />
            Melding
          </Button>
        </Link>
        <Link href={`/admin/bookinger/ny?student=${profileId}`}>
          <Button className="!justify-start !text-[11px] !px-2.5 !py-1.5 !w-full">
            <CalendarPlus className="w-3 h-3" />
            Bok økt
          </Button>
        </Link>
        <Link href={`/admin/treningsplan?student=${profileId}`}>
          <Button
            variant="accent"
            className="!justify-start !text-[11px] !px-2.5 !py-1.5 !w-full"
          >
            <Target className="w-3 h-3" />
            Sett mål
          </Button>
        </Link>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Section primitives
// ---------------------------------------------------------------------------

type SectionTone = "default" | "lime" | "green" | "violet" | "blue" | "amber" | "coral";

function Section({
  id,
  tone = "default",
  icon,
  title,
  sub,
  pills,
  children,
}: {
  id: SectionId;
  tone?: SectionTone;
  icon: React.ReactNode;
  title: string;
  sub?: string;
  pills?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const iconColors: Record<SectionTone, { bg: string; color: string }> = {
    default: { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" },
    lime: { bg: "rgba(209,248,67,0.16)", color: TOKENS.accent },
    green: { bg: "rgba(42,125,90,0.22)", color: TOKENS.success },
    violet: { bg: "rgba(175,82,222,0.22)", color: TOKENS.violet },
    blue: { bg: "rgba(0,122,255,0.20)", color: TOKENS.blue },
    amber: { bg: "rgba(196,138,50,0.22)", color: TOKENS.warn },
    coral: { bg: "rgba(184,66,51,0.22)", color: TOKENS.danger },
  };
  const ic = iconColors[tone];
  return (
    <section
      id={`sec-${id}`}
      className="rounded-[14px] overflow-hidden"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.line}`,
        scrollMarginTop: 76,
      }}
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center gap-3 px-[22px] py-4 text-left"
      >
        <span
          className="w-8 h-8 rounded-lg grid place-items-center shrink-0"
          style={{ background: ic.bg, color: ic.color }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="m-0 text-[15px] font-semibold text-white tracking-[-0.01em]">{title}</h2>
          {sub && (
            <p
              className="m-0 mt-0.5 text-[11px] font-mono uppercase tracking-[0.06em]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {sub}
            </p>
          )}
        </div>
        <div className="ml-auto flex gap-1.5 items-center">{pills}</div>
        <span
          className="ml-2 transition-transform"
          style={{
            color: "rgba(255,255,255,0.4)",
            transform: collapsed ? "rotate(-90deg)" : "rotate(0)",
          }}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>
      {!collapsed && (
        <div
          className="px-[22px] pt-[18px] pb-[22px]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          {children}
        </div>
      )}
    </section>
  );
}

function SubH({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`font-mono text-[9px] uppercase tracking-[0.14em] mb-2 ${className}`}
      style={{ color: "rgba(255,255,255,0.45)" }}
    >
      {children}
    </div>
  );
}

function StatBlock({ label, value, sub, subTone }: { label: string; value: string; sub?: string; subTone?: "up" | "down" | "muted" }) {
  return (
    <div
      className="rounded-[10px] px-3.5 py-3"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${TOKENS.line}`,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {label}
      </div>
      <div className="text-[20px] font-bold mt-1 text-white tracking-[-0.02em] tabular-nums">
        {value}
        {sub && (
          <span
            className="text-[10px] font-medium ml-1"
            style={{
              color:
                subTone === "up"
                  ? TOKENS.success
                  : subTone === "down"
                    ? TOKENS.danger
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

function SgRow({ cat, value }: { cat: string; value: number }) {
  const pos = value >= 0;
  const widthPct = Math.min(48, Math.max(2, Math.abs(value) * 60));
  return (
    <div className="grid items-center py-1.5" style={{ gridTemplateColumns: "110px 1fr 50px", gap: 12 }}>
      <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
        {cat}
      </span>
      <div className="relative h-2 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="absolute top-[-2px] bottom-[-2px] left-1/2 w-px" style={{ background: "rgba(255,255,255,0.25)" }} />
        <div
          className="absolute top-0 bottom-0 rounded"
          style={{
            background: pos ? TOKENS.success : TOKENS.danger,
            left: pos ? "50%" : undefined,
            right: pos ? undefined : "50%",
            width: `${widthPct}%`,
          }}
        />
      </div>
      <span
        className="font-mono text-[12px] font-semibold text-right tabular-nums"
        style={{ color: pos ? TOKENS.success : TOKENS.danger }}
      >
        {pos ? "+" : "−"}
        {Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}

function GoalRow({
  name,
  meta,
  pct,
  color,
}: {
  name: string;
  meta: string;
  pct: number;
  color?: string;
}) {
  const c = color ?? TOKENS.accent;
  return (
    <div
      className="grid gap-3.5 px-3.5 py-3 rounded-[10px] mb-2"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${TOKENS.line}`,
        gridTemplateColumns: "1fr auto",
      }}
    >
      <div>
        <div className="text-[13px] text-white font-medium">{name}</div>
        <div
          className="font-mono text-[10px] mt-0.5 tracking-[0.04em]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {meta}
        </div>
        <div className="h-[5px] rounded mt-2 overflow-hidden" style={{ width: 220, background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded" style={{ width: `${pct}%`, background: c }} />
        </div>
      </div>
      <div
        className="font-mono text-[18px] font-bold text-right self-center min-w-[50px]"
        style={{ color: c }}
      >
        {pct}%
      </div>
    </div>
  );
}

function MoneyRow({ desc, sub, date, amt }: { desc: string; sub: string; date: string; amt: string }) {
  return (
    <div
      className="grid items-center gap-3.5 py-2.5"
      style={{
        gridTemplateColumns: "1fr auto auto",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div>
        <div className="text-[13px] text-white">{desc}</div>
        <div
          className="font-mono text-[11px] mt-0.5"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {sub}
        </div>
      </div>
      <span
        className="font-mono text-[11px]"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {date}
      </span>
      <span
        className="font-mono text-[13px] font-semibold tabular-nums"
        style={{ color: TOKENS.success }}
      >
        {amt}
      </span>
    </div>
  );
}

function SignalCard({
  variant,
  icon,
  title,
  body,
  when,
  actions,
}: {
  variant: "up" | "warn" | "danger";
  icon: React.ReactNode;
  title: string;
  body: string;
  when?: string;
  actions?: React.ReactNode;
}) {
  const styleMap = {
    up: {
      background: "rgba(209,248,67,0.10)",
      border: "1px solid rgba(209,248,67,0.25)",
      borderLeft: `3px solid ${TOKENS.accent}`,
      iconColor: TOKENS.accent,
    },
    warn: {
      background: "rgba(196,138,50,0.10)",
      border: "1px solid rgba(196,138,50,0.30)",
      borderLeft: `3px solid ${TOKENS.warn}`,
      iconColor: TOKENS.warn,
    },
    danger: {
      background: "rgba(184,66,51,0.10)",
      border: "1px solid rgba(184,66,51,0.30)",
      borderLeft: `3px solid ${TOKENS.danger}`,
      iconColor: TOKENS.danger,
    },
  } as const;
  const s = styleMap[variant];
  return (
    <div className="rounded-[10px] p-3.5 mb-2" style={{ ...s }}>
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color: s.iconColor }}>{icon}</span>
        <h4 className="m-0 text-[13px] font-semibold text-white">{title}</h4>
        {when && (
          <span
            className="ml-auto font-mono text-[10px]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {when}
          </span>
        )}
      </div>
      <p className="m-0 mb-2 text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
        {body}
      </p>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  profile: Profile;
}

export function SpillerprofilLongpageClient({ profile }: Props) {
  const [activeSection, setActiveSection] = useState<SectionId>("summary");

  // Highlight TOC ved scroll
  useEffect(() => {
    function onScroll() {
      let current: SectionId = "summary";
      for (const s of SECTIONS) {
        const el = document.getElementById(`sec-${s.id}`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top < 120) current = s.id;
      }
      setActiveSection(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeGoals = profile.Goal.filter((g) => g.status === "ACTIVE").slice(0, 3);

  return (
    <div className="grid gap-6 items-start" style={{ gridTemplateColumns: "200px 1fr" }}>
      <CompactHero profile={profile} />
      <TocSidebar active={activeSection} profileId={profile.id} />

      <div className="flex flex-col gap-3.5 min-w-0">
        {/* SAMMENDRAG */}
        <Section
          id="summary"
          tone="lime"
          icon={<LayoutDashboard className="w-4 h-4" />}
          title="Sammendrag"
          sub="Q2 2025 · 30d"
          pills={
            <>
              <Pill tone="accent">På sporet</Pill>
              <Pill tone="success">3 PR</Pill>
            </>
          }
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatBlock
              label="HCP"
              value={profile.handicap !== null ? profile.handicap.toFixed(1) : "—"}
              sub="↘ −0.6"
              subTone="up"
            />
            <StatBlock label="SG / runde" value="+0.42" sub="↗ +0.18" subTone="up" />
            <StatBlock label="Aktivitet 30d" value={`${profile.sessionsThisMonth}`} sub="økter" subTone="muted" />
            <StatBlock label="Score-snitt" value="73.8" sub="↘ −1.2" subTone="up" />
          </div>
          <SubH className="mt-4">AI-sammendrag</SubH>
          <div
            className="px-3.5 py-3.5 rounded-[10px] text-[13px] leading-relaxed"
            style={{
              background: "rgba(175,82,222,0.10)",
              border: "1px solid rgba(175,82,222,0.25)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 inline-block mr-1.5 -mb-0.5" style={{ color: TOKENS.violet }} />
            {profile.name ?? "Spilleren"} er i{" "}
            <strong style={{ color: TOKENS.accent }}>topp 5%</strong> av Performance-spillerne siste 30 dager.
            Putting har eksplodert (+0.26 SG) etter tempo-fokus i april.{" "}
            <strong style={{ color: TOKENS.warn }}>Around-green</strong> er nå svakeste ledd —
            anbefaler 2 ukers short-game-blokk før neste klubbmesterskap.
          </div>
        </Section>

        {/* GOLF */}
        <Section
          id="golf"
          tone="blue"
          icon={<Flag className="w-4 h-4" />}
          title="Golf-ferdigheter"
          sub={`Strokes Gained · ferdighetsnivå · ${profile.HandicapEntry.length} oppdateringer`}
          pills={<Pill tone="blue">SG +0.42</Pill>}
        >
          <div className="grid lg:grid-cols-2 gap-3.5">
            <div>
              <SubH>Strokes Gained · 30d (vs. HCP-snitt)</SubH>
              <SgRow cat="Off the tee" value={0.18} />
              <SgRow cat="Approach" value={0.08} />
              <SgRow cat="Around green" value={-0.1} />
              <SgRow cat="Putting" value={0.26} />
              <div
                className="mt-3 pt-3 flex justify-between text-[12px]"
                style={{ borderTop: `1px dashed ${TOKENS.line}` }}
              >
                <span style={{ color: "rgba(255,255,255,0.55)" }}>Total SG</span>
                <span className="font-mono font-semibold" style={{ color: TOKENS.success }}>
                  +0.42 / runde
                </span>
              </div>
            </div>
            <div>
              <SubH>Aktive mål</SubH>
              {activeGoals.length === 0 ? (
                <p className="m-0 text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Ingen aktive mål.
                </p>
              ) : (
                activeGoals.map((g) => {
                  const target = g.targetValue ?? 0;
                  const current = g.currentValue ?? 0;
                  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
                  return (
                    <GoalRow
                      key={g.id}
                      name={g.title}
                      meta={
                        g.targetDate
                          ? `Deadline ${format(new Date(g.targetDate), "d. MMM", { locale: nb })}`
                          : g.description ?? ""
                      }
                      pct={pct}
                    />
                  );
                })
              )}
            </div>
          </div>
        </Section>

        {/* COACHING */}
        <Section
          id="coaching"
          tone="green"
          icon={<Dumbbell className="w-4 h-4" />}
          title="Coaching"
          sub={`${profile.CoachingSession.length} økter siste 90d · primærcoach Anders K.`}
          pills={<Pill tone="success">På Performance-plan</Pill>}
        >
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatBlock label="Økter 90d" value={`${profile.CoachingSession.length}`} />
            <StatBlock label="Snitt-lengde" value="52" sub="min" subTone="muted" />
            <StatBlock label="Cancel-rate" value="4%" sub="lavt" subTone="up" />
          </div>
          <SubH>Aktiv plan</SubH>
          <div
            className="px-3.5 py-3.5 rounded-[10px]"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${TOKENS.line}`,
            }}
          >
            <div className="flex justify-between items-center mb-2.5">
              <strong className="text-white text-[13px]">
                {profile.ActivePlan?.title ?? "Ingen aktiv plan"}
              </strong>
              {profile.ActivePlan && <Pill tone="accent">Pågår</Pill>}
            </div>
            <div className="flex gap-1.5 mb-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded"
                  style={{
                    background: i < 4 ? TOKENS.accent : "rgba(255,255,255,0.10)",
                  }}
                />
              ))}
            </div>
            <div className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              {profile.ActivePlan
                ? "Tempo-fokus driver · putting-protokoll · short-game-blokk · turneringsforberedelse"
                : "Sett opp en treningsplan for å se progresjon her."}
            </div>
          </div>
          {profile.CoachingSession.length > 0 && (
            <>
              <SubH className="mt-4">Siste coach-notater</SubH>
              <div className="flex flex-col gap-2">
                {profile.CoachingSession.slice(0, 3).map((cs) => (
                  <div
                    key={cs.id}
                    className="px-3.5 py-3 rounded-md"
                    style={{
                      background: "rgba(175,82,222,0.10)",
                      borderLeft: `3px solid ${TOKENS.violet}`,
                    }}
                  >
                    <div
                      className="font-mono text-[11px] mb-1"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {format(new Date(cs.sessionDate), "d MMM", { locale: nb }).toUpperCase()} · ANDERS K.
                    </div>
                    <div className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
                      «{cs.instructorNotes ?? cs.primaryFocus ?? "Notat mangler"}»
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Section>

        {/* MENTAL */}
        <Section
          id="mental"
          tone="violet"
          icon={<Brain className="w-4 h-4" />}
          title="Mental"
          sub="Selvrapportering · stemning · pre-runde-rutine"
          pills={<Pill tone="violet">Stabil</Pill>}
        >
          <p className="m-0 text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>
            Stemnings-grid og selvrapportering kommer snart. Kobles til AI-Coach mood-prompts.
          </p>
        </Section>

        {/* TRENING */}
        <Section
          id="trening"
          tone="amber"
          icon={<Activity className="w-4 h-4" />}
          title="Trening"
          sub="Fysisk · søvn · kosthold"
          pills={<Pill tone="warn">2 risikofaktorer</Pill>}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatBlock label="Søvn snitt 30d" value="7.2t" sub="↗" subTone="up" />
            <StatBlock label="Hvilepuls" value="52" />
            <StatBlock label="Trening 30d" value="14" sub="økter" subTone="muted" />
            <StatBlock label="Skadestatus" value="Mild rygg" />
          </div>
        </Section>

        {/* UTSTYR */}
        <Section
          id="utstyr"
          icon={<Hammer className="w-4 h-4" />}
          title="Utstyr"
          sub="Bag-setup · siste fitting"
          pills={<Pill tone="blue">Fitted feb 2025</Pill>}
        >
          {[
            ["Driver", "TaylorMade Stealth 2 · 9°", "FUJIKURA VENTUS BLACK 6S"],
            ["Hybrid", "Titleist TSi3 · 21°", "PROJECT X HZRDUS BLACK"],
            ["Jern 4–PW", "Mizuno JPX 923 Tour", "DG TOUR ISSUE X100"],
            ["Wedges", "Vokey SM10 · 50°/54°/58°", "DG WEDGE"],
            ["Putter", "Scotty Cameron Phantom X 5.5", '34" · GOLF PRIDE PRO ONLY'],
          ].map(([cat, item, meta], i) => (
            <div
              key={cat}
              className="grid items-center gap-3.5 py-2.5 text-[12px]"
              style={{
                gridTemplateColumns: "100px 1fr auto",
                borderBottom:
                  i === 4 ? "none" : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                className="font-mono text-[9px] uppercase tracking-[0.14em]"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {cat}
              </span>
              <span className="text-white font-medium">{item}</span>
              <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                {meta}
              </span>
            </div>
          ))}
        </Section>

        {/* ØKONOMI */}
        <Section
          id="okonomi"
          tone="green"
          icon={<Wallet className="w-4 h-4" />}
          title="Økonomi"
          sub="Abonnement · betalinger · pakker"
          pills={
            <>
              <Pill tone="success">Aktiv</Pill>
              <Pill>Performance Plus</Pill>
            </>
          }
        >
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatBlock label="YTD inntekt" value="28 400" sub="kr" subTone="muted" />
            <StatBlock label="Plan-kost" value="2 490" sub="/ mnd" subTone="muted" />
            <StatBlock label="Neste faktura" value="01 mai" sub="2.490 kr" subTone="muted" />
          </div>
          <SubH>Siste betalinger</SubH>
          <MoneyRow desc="Performance Plus · april" sub="FAKTURA #2025-082" date="01 APR" amt="+2 490 kr" />
          <MoneyRow desc="Bunker-tillegg · 30 min" sub="SUPPLEMENT" date="22 APR" amt="+450 kr" />
          <MoneyRow desc="Performance Plus · mars" sub="FAKTURA #2025-068" date="01 MAR" amt="+2 490 kr" />
        </Section>

        {/* SIGNALER */}
        <Section
          id="signaler"
          tone="coral"
          icon={<BellRing className="w-4 h-4" />}
          title="Signaler"
          sub="Automatiske flagg · 2 åpne"
          pills={<Pill tone="danger">2 åpne</Pill>}
        >
          <SignalCard
            variant="up"
            icon={<Trophy className="w-3.5 h-3.5" />}
            title="3 PR siste 30 dager"
            body="Spilleren har slått PR på score, putts/runde og SG-putting siste 4 uker. Foreslå turneringsmål — hen er klar."
            when="26 APR"
            actions={
              <>
                <Link href={`/admin/turneringer?student=${profile.id}`}>
                  <Button variant="accent">
                    <Target className="w-3 h-3" />
                    Sett turneringsmål
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => alert("Signal avvist")}
                >
                  Avvis
                </Button>
              </>
            }
          />
          <SignalCard
            variant="warn"
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            title="Around-green nå svakeste ledd"
            body="Chip- og pitch-volum er lavt. Snitt SG around-green har droppet til −0.10. Anbefal short-game-blokk i 2 uker."
            when="25 APR"
            actions={
              <>
                <Link href={`/admin/treningsplan?student=${profile.id}&fokus=short-game`}>
                  <Button variant="accent">
                    <Zap className="w-3 h-3" />
                    Lag short-game-plan
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => alert("Snoozed 7 dager")}
                >
                  Snooze 7d
                </Button>
              </>
            }
          />
        </Section>

        {/* AKTIVITET */}
        <Section
          id="aktivitet"
          tone="blue"
          icon={<History className="w-4 h-4" />}
          title="Aktivitet"
          sub="Full historikk · siste 90 dager"
          pills={<Pill>{profile.Booking.length + profile.CoachingSession.length} hendelser</Pill>}
        >
          {[...profile.Booking].slice(0, 8).map((b) => (
            <div
              key={b.id}
              className="grid items-center gap-3.5 py-2.5"
              style={{
                gridTemplateColumns: "100px 32px 1fr auto",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span
                className="font-mono text-[11px] tracking-[0.06em]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {format(new Date(b.startTime), "d MMM · HH:mm", { locale: nb }).toUpperCase()}
              </span>
              <span
                className="w-7 h-7 rounded-md grid place-items-center"
                style={{
                  background: "rgba(209,248,67,0.16)",
                  color: TOKENS.accent,
                }}
              >
                <Dumbbell className="w-3.5 h-3.5" />
              </span>
              <div>
                <div className="text-[13px] font-medium text-white">
                  {(b.ServiceType as { name?: string })?.name ?? "Coaching-økt"}
                </div>
                <div
                  className="font-mono text-[11px] mt-0.5 tracking-[0.04em] truncate"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {(extractInstructorName(b.Instructor) ?? "—").toUpperCase()}
                </div>
              </div>
              <Pill tone="success">Fullført</Pill>
            </div>
          ))}
          {profile.Booking.length === 0 && (
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Ingen registrert aktivitet enda.
            </p>
          )}
        </Section>
      </div>
    </div>
  );
}

function extractInstructorName(instructor: unknown): string | null {
  if (!instructor || typeof instructor !== "object") return null;
  const inst = instructor as { User?: { name?: string | null } | null };
  return inst.User?.name ?? null;
}
