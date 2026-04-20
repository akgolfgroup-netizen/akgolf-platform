"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { DashboardV3Props } from "../dashboard-types";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

const TIER_LABEL: Record<string, string> = {
  VISITOR: "Gratis",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Elite",
};

function formatTrend(value: number | null, suffix = ""): string {
  if (value === null) return "–";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}${suffix}`;
}

export function AthleticGridView({
  userName,
  tier,
  memberSince,
  stats,
  handicap,
  nextBooking,
  weekRings,
  coachInsight,
  aiInsight,
  socialData,
  achievements,
}: DashboardV3Props) {
  const firstName = userName?.split(" ")[0] ?? "Spiller";
  const tierLabel = TIER_LABEL[tier] ?? tier;
  const trainedDays = weekRings.days.filter((d) => d.trained).length;
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt).length;
  const goal = aiInsight?.goalProgress;
  const goalPercent = goal
    ? Math.max(
        0,
        Math.min(
          100,
          ((goal.current - goal.target_value) /
            Math.max(goal.current - goal.target_value, 0.01)) *
            100
        )
      )
    : 0;
  const todaysFocus =
    coachInsight?.primaryFocus ??
    aiInsight?.recommendations?.[0] ??
    "Logg dagens økt for å få neste anbefaling";
  const hcpGoalLabel = goal
    ? `Mål: ${goal.target_value.toFixed(1)} ${goal.unit}`
    : "Registrer handicap for å se mål";

  // SG-placeholder verdier — kobles til ekte SG-data senere
  const sgValues = {
    driving: "+0.8",
    approach: "+0.4",
    short: "-0.3",
    putting: "+0.2",
  };

  return (
    <section className="space-y-6">
      {/* Velkomst-header */}
      <header className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/50">
            {format(new Date(), "EEEE d. MMMM", { locale: nb })}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Hei, {firstName}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            {tierLabel}
          </span>
          <Link
            href="/portal/bookinger/ny"
            className="rounded-lg bg-secondary-fixed px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary transition-all hover:opacity-90 active:scale-95"
          >
            Book time
          </Link>
        </div>
      </header>

      {/* Rad 1: SG Radar (col-8) + AI-fokus (col-4) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-tight text-primary/60">
                Fremdriftsanalyse
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-primary">
                Strokes Gained Radar
              </h3>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white">
                TOTALT +1.1
              </span>
              <span className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold text-primary/60">
                BENCHMARK
              </span>
            </div>
          </div>
          <div className="relative flex h-[320px] items-center justify-center overflow-hidden">
            <svg className="h-full w-full max-w-md" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#2d5a27" strokeDasharray="2 2" strokeWidth="0.1" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#2d5a27" strokeDasharray="2 2" strokeWidth="0.1" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#2d5a27" strokeDasharray="2 2" strokeWidth="0.1" />
              <path
                d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18"
                opacity="0.3"
                stroke="#2d5a27"
                strokeWidth="0.05"
              />
              <path
                d="M50 20 L75 45 L70 70 L50 80 L30 70 L25 45 Z"
                fill="rgba(210, 240, 0, 0.4)"
                stroke="#d2f000"
                strokeWidth="1.5"
              />
              <text x="50" y="8" fill="#154212" fontSize="3" fontWeight="bold" textAnchor="middle">
                DRIVE
              </text>
              <text x="92" y="52" fill="#154212" fontSize="3" fontWeight="bold" textAnchor="end">
                INNSPILL
              </text>
              <text x="50" y="98" fill="#154212" fontSize="3" fontWeight="bold" textAnchor="middle">
                PUTTING
              </text>
              <text x="8" y="52" fill="#154212" fontSize="3" fontWeight="bold" textAnchor="start">
                KORT SPILL
              </text>
            </svg>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-4">
            {[
              { label: "Drive", value: sgValues.driving },
              { label: "Innspill", value: sgValues.approach },
              { label: "Kort spill", value: sgValues.short },
              { label: "Putting", value: sgValues.putting },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border-l-4 border-secondary-fixed bg-surface p-4"
              >
                <p className="font-mono text-[9px] uppercase text-primary/50">
                  {item.label}
                </p>
                <p className="text-lg font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI-fokus card (mørk primary) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bento-card relative h-full overflow-hidden rounded-3xl bg-primary p-8 text-[#fdf9f0]">
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-2">
                <Icon name="bolt" filled className="text-secondary-fixed" size={20} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-secondary-fixed">
                  AI-analyse
                </span>
              </div>
              <h3 className="mb-2 text-3xl font-bold leading-tight">
                {goal?.target ?? "Ditt utviklingsmål"}
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-[#fdf9f0]/70">
                {aiInsight?.summary ??
                  "Loggfør minst én runde og én økt, så gir AI-en deg en personlig analyse."}
              </p>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="font-mono text-[11px] uppercase">
                    {hcpGoalLabel}
                  </span>
                  <span className="font-mono text-[11px] uppercase">
                    {Math.round(goalPercent)}%
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[#fdf9f0]/10">
                  <div
                    className="h-full bg-secondary-fixed transition-all duration-500"
                    style={{ width: `${goalPercent}%` }}
                  />
                </div>
              </div>
              <div className="mt-8 border-t border-[#fdf9f0]/10 pt-6">
                <p className="mb-3 font-mono text-[10px] uppercase text-secondary-fixed">
                  Dagens fokus
                </p>
                <div className="flex items-center gap-4 rounded-xl bg-[#fdf9f0]/5 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed">
                    <Icon name="target" className="text-primary" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">{todaysFocus}</p>
                    {coachInsight?.date ? (
                      <p className="text-[10px] text-[#fdf9f0]/40">
                        Fra sist coaching
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Icon name="monitoring" size={260} filled />
            </div>
          </div>
        </div>
      </div>

      {/* Rad 2: 3 stat-kort */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Handicap"
          value={
            handicap.current !== null ? handicap.current.toFixed(1) : "–"
          }
          trend={
            handicap.trend !== null ? formatTrend(handicap.trend) : null
          }
          trendPositive={(handicap.trend ?? 0) < 0}
          barHeights={[40, 55, 45, 70, 60, 85]}
        />
        <StatCard
          label="Runder 30d"
          value={String(stats.roundsCount)}
          trend={stats.roundsCount > 0 ? `${trainedDays} trente denne uken` : null}
          trendPositive
          barHeights={[60, 50, 65, 55, 40, 50]}
        />
        <StatCard
          label="Treningsøkter 30d"
          value={String(stats.sessionsCount)}
          trend={
            socialData?.streak
              ? `${socialData.streak} dagers streak`
              : null
          }
          trendPositive
          barHeights={[70, 65, 60, 55, 50, 45]}
        />
      </div>

      {/* Rad 3: Upcoming Sessions + Anbefaling + Membership */}
      <div className="grid grid-cols-12 gap-6">
        <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-7">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-primary">
              Kommende økter
            </h3>
            <Link
              href="/portal/bookinger"
              className="text-xs font-bold uppercase tracking-widest text-primary/40 transition-colors hover:text-primary"
            >
              Se kalender
            </Link>
          </div>
          <div className="space-y-4">
            {nextBooking ? (
              <UpcomingSessionRow
                title={nextBooking.serviceName}
                instructor={nextBooking.instructorName}
                date={new Date(nextBooking.startTime)}
                href={`/portal/bookinger/${nextBooking.id}`}
              />
            ) : (
              <EmptySessions />
            )}
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
          {/* Anbefaling CTA */}
          <Link
            href="/portal/treningsplan"
            className="bento-card group relative flex-1 overflow-hidden rounded-3xl bg-[#d2f000] p-8"
          >
            <div className="relative z-10">
              <span className="mb-4 inline-block rounded bg-primary px-2 py-1 text-[9px] font-bold text-white">
                ANBEFALT
              </span>
              <h3 className="mb-4 text-2xl font-black leading-tight text-primary">
                {aiInsight?.recommendations?.[0] ?? "Åpne treningsplan"}
              </h3>
              <p className="mb-6 max-w-[240px] text-sm text-primary/70">
                {aiInsight?.patternAnalysis ??
                  "Bruk dagens anbefaling fra coach og AI for å holde progresjonen."}
              </p>
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all group-hover:opacity-90">
                Åpne
                <Icon name="arrow_forward" size={14} />
              </span>
            </div>
            <div className="absolute right-[-40px] bottom-[-20px] opacity-20 transition-transform duration-700 group-hover:rotate-12">
              <Icon name="sports_golf" size={260} filled className="text-primary" />
            </div>
          </Link>

          {/* Membership card */}
          <div className="bento-card rounded-3xl border border-outline-variant/10 bg-surface-container-high p-8">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-2xl bg-primary/5 p-3">
                <Icon name="workspace_premium" className="text-primary" size={22} />
              </div>
              <div>
                <h4 className="font-bold text-primary">{tierLabel}-medlemskap</h4>
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary/40">
                  {memberSince ? `Medlem siden ${memberSince}` : "Aktivt"}
                </p>
              </div>
            </div>
            <p className="mb-4 text-xs italic text-primary/60">
              {socialData?.rank
                ? `Du er på rank ${socialData.rank} av ${socialData.totalPlayers} spillere.`
                : "Fortsett å logge runder og økter for å klatre på rankingen."}
            </p>
            <div className="flex gap-2">
              <div className="flex-1 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-3 text-center">
                <p className="mb-1 font-mono text-[9px] uppercase text-primary/40">
                  Utmerkelser
                </p>
                <p className="text-sm font-bold text-primary">
                  {unlockedAchievements} av {achievements.length}
                </p>
              </div>
              <div className="flex-1 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-3 text-center">
                <p className="mb-1 font-mono text-[9px] uppercase text-primary/40">
                  Uken
                </p>
                <p className="text-sm font-bold text-primary">
                  {trainedDays} av 7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status-stripe */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-primary/10 pt-6">
        <div className="flex gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase text-primary/40">
              Status
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <p className="text-xs font-bold text-primary">Alle data synkronisert</p>
            </div>
          </div>
          <div className="border-l border-primary/10 pl-8">
            <p className="font-mono text-[10px] uppercase text-primary/40">
              Siste oppdatering
            </p>
            <p className="text-xs font-bold text-primary">
              {format(new Date(), "HH:mm")}
            </p>
          </div>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/30">
          AK Golf · Portal
        </p>
      </div>
    </section>
  );
}

/* ── Delkomponenter ── */

function StatCard({
  label,
  value,
  trend,
  trendPositive,
  barHeights,
}: {
  label: string;
  value: string;
  trend: string | null;
  trendPositive?: boolean;
  barHeights: number[];
}) {
  return (
    <div className="bento-card rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase text-primary/50">
            {label}
          </p>
          <h4 className="text-3xl font-bold text-primary">{value}</h4>
        </div>
        {trend ? (
          <span
            className={`rounded px-2 py-1 text-[10px] font-bold ${
              trendPositive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {trend}
          </span>
        ) : null}
      </div>
      <div className="flex h-12 items-end gap-1">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm ${
              i === barHeights.length - 1
                ? "bg-secondary-fixed"
                : "bg-primary/10"
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function UpcomingSessionRow({
  title,
  instructor,
  date,
  href,
}: {
  title: string;
  instructor: string;
  date: Date;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-outline-variant/10 bg-surface p-4 transition-colors hover:bg-surface-container"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container">
          <Icon name="sports" className="text-secondary-fixed" size={22} filled />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">{title}</p>
          <p className="font-mono text-[11px] text-primary/40">
            m/ {instructor}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-primary">
          {format(date, "EEEE d. MMM · HH:mm", { locale: nb })}
        </p>
      </div>
    </Link>
  );
}

function EmptySessions() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-outline-variant/40 bg-surface p-8 text-center">
      <Icon name="event_busy" className="text-primary/30" size={36} />
      <div>
        <p className="text-sm font-bold text-primary">Ingen kommende økter</p>
        <p className="mt-1 text-xs text-primary/60">
          Book en coachingtime for å komme i gang
        </p>
      </div>
      <Link
        href="/portal/bookinger/ny"
        className="rounded-lg bg-secondary-fixed px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary transition-all hover:opacity-90"
      >
        Book time
      </Link>
    </div>
  );
}
