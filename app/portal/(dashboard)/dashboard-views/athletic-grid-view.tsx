"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type {
  DashboardV3Props,
  SgSummary,
  TrainingIndexData,
  TestProgress,
} from "../dashboard-types";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { QuickOnboardingBanner } from "../onboarding/components/quick-onboarding-banner";

const TIER_LABEL: Record<string, string> = {
  VISITOR: "Gratis",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Elite",
};

function formatSG(value: number | null): string {
  if (value === null) return "–";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

function sgToRadarPoint(
  sg: number | null,
  angleDeg: number,
  maxAbs = 2.5
): { x: number; y: number } {
  const cx = 50;
  const cy = 50;
  const maxRadius = 35;
  const v = sg ?? 0;
  const norm = Math.max(0.2, Math.min(1.0, 0.6 + v / (maxAbs * 2)));
  const r = maxRadius * norm;
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function AthleticGridView({
  userName,
  tier,
  memberSince,
  stats,
  nextBooking,
  weekRings,
  coachInsight,
  aiInsight,
  socialData,
  achievements,
  sgSummary,
  trainingIndex,
  testProgress,
  needsOnboarding,
}: DashboardV3Props) {
  const firstName = userName?.split(" ")[0] ?? "Spiller";
  const tierLabel = TIER_LABEL[tier] ?? tier;
  const trainedDays = weekRings.days.filter((d) => d.trained).length;
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt).length;
  const goal = aiInsight?.goalProgress;
  // For snittscore: lavere er bedre. Progress = 100% når current ≤ target,
  // 0% når current er ≥5 slag over target.
  const goalPercent = goal
    ? (() => {
        const diff = Math.max(0, goal.current - goal.target_value);
        return Math.max(0, Math.min(100, 100 - (diff / 5) * 100));
      })()
    : 0;
  const todaysFocus =
    coachInsight?.primaryFocus ??
    aiInsight?.recommendations?.[0] ??
    "Logg dagens økt for å få neste anbefaling";
  const scoreGoalLabel = goal
    ? `Mål: ${goal.target_value} ${goal.unit} · nå ${goal.current}`
    : "Registrer runder for å se mål";

  return (
    <section className="space-y-6">
      {/* Rask onboarding for nye spillere */}
      {needsOnboarding && <QuickOnboardingBanner />}

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
        <SgRadarHero summary={sgSummary} />
        <div className="col-span-12 lg:col-span-4">
          <div className="bento-card relative h-full overflow-hidden rounded-3xl bg-primary p-8 text-surface">
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-2">
                <Icon name="bolt" filled className="text-secondary-fixed" size={20} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-secondary-fixed">
                  Anbefalt
                </span>
              </div>
              <h3 className="mb-2 text-3xl font-bold leading-tight text-surface">
                {goal?.target ?? "Ditt utviklingsmål"}
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-surface/70">
                {aiInsight?.summary ??
                  "Loggfør minst én runde og én økt, så gir AI-en deg en personlig analyse."}
              </p>
              <div className="space-y-4">
                <div className="flex items-end justify-between text-surface/80">
                  <span className="font-mono text-[11px] uppercase">{scoreGoalLabel}</span>
                  <span className="font-mono text-[11px] uppercase">
                    {Math.round(goalPercent)}%
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-surface-container-lowest/10">
                  <div
                    className="h-full bg-secondary-fixed transition-all duration-500"
                    style={{ width: `${goalPercent}%` }}
                  />
                </div>
              </div>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="mb-3 font-mono text-[10px] uppercase text-secondary-fixed">
                  Dagens fokus
                </p>
                <div className="flex items-center gap-4 rounded-xl bg-surface-container-lowest/5 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed">
                    <Icon name="target" className="text-primary" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-surface">{todaysFocus}</p>
                    {coachInsight?.date ? (
                      <p className="text-[10px] text-surface/50">Fra sist coaching</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 text-surface/10">
              <Icon name="monitoring" size={260} filled />
            </div>
          </div>
        </div>
      </div>

      {/* Rad 2: Fremdrift — Trening (col-6) + Test (col-6) */}
      <div className="grid grid-cols-12 gap-6">
        <TrainingPyramidCard index={trainingIndex} />
        <TestProgressCard progress={testProgress} />
      </div>

      {/* Rad 3: Upcoming + Anbefaling + Medlemskap */}
      <div className="grid grid-cols-12 gap-6">
        <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-7">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-primary">Kommende økter</h3>
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
          <Link
            href="/portal/treningsplan"
            className="bento-card group relative flex-1 overflow-hidden rounded-3xl bg-secondary-fixed p-8"
          >
            <div className="relative z-10">
              <span className="mb-4 inline-block rounded bg-primary px-2 py-1 text-[9px] font-bold text-surface">
                ANBEFALT
              </span>
              <h3 className="mb-4 text-2xl font-black leading-tight text-primary">
                {aiInsight?.recommendations?.[0] ?? "Åpne treningsplan"}
              </h3>
              <p className="mb-6 max-w-[240px] text-sm text-primary/70">
                {aiInsight?.patternAnalysis ??
                  "Bruk dagens anbefaling fra coach og AI for å holde progresjonen."}
              </p>
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-surface transition-all group-hover:opacity-90">
                Åpne
                <Icon name="arrow_forward" size={14} />
              </span>
            </div>
            <div className="absolute right-[-40px] bottom-[-20px] opacity-20 transition-transform duration-700 group-hover:rotate-12">
              <Icon name="sports_golf" size={260} filled className="text-primary" />
            </div>
          </Link>

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
                <p className="mb-1 font-mono text-[9px] uppercase text-primary/40">Uken</p>
                <p className="text-sm font-bold text-primary">{trainedDays} av 7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status-stripe */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-primary/10 pt-6">
        <div className="flex gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase text-primary/40">Status</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-container" />
              <p className="text-xs font-bold text-primary">
                {sgSummary.roundCount} runder · {stats.sessionsCount} økter siste 30d
              </p>
            </div>
          </div>
          <div className="border-l border-primary/10 pl-8">
            <p className="font-mono text-[10px] uppercase text-primary/40">Siste oppdatering</p>
            <p className="text-xs font-bold text-primary">{format(new Date(), "HH:mm")}</p>
          </div>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/30">
          Portal
        </p>
      </div>
    </section>
  );
}

/* ── SG Radar Hero (col-8) ── */

function SgRadarHero({ summary }: { summary: SgSummary }) {
  const hasData = summary.roundCount > 0 && summary.total !== null;
  const trendLabel =
    summary.trend === "up" ? "Oppadgående" : summary.trend === "down" ? "Nedadgående" : "Stabil";
  const trendIcon =
    summary.trend === "up" ? "trending_up" : summary.trend === "down" ? "trending_down" : "trending_flat";
  const trendColor =
    summary.trend === "up" ? "text-primary-container" : summary.trend === "down" ? "text-error" : "text-on-surface-variant";

  const points = [
    sgToRadarPoint(summary.offTheTee, 0),
    sgToRadarPoint(summary.approach, 90),
    sgToRadarPoint(summary.aroundTheGreen, 180),
    sgToRadarPoint(summary.putting, 270),
  ];
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link
            href="/portal/statistikk"
            className="font-mono text-[10px] uppercase tracking-tight text-primary/60 hover:text-primary"
          >
            Fremdriftsanalyse →
          </Link>
          <h3 className="text-2xl font-bold tracking-tight text-primary">Strokes Gained</h3>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-surface">
            TOTALT {formatSG(summary.total)}
          </span>
          <span className={`flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold ${trendColor}`}>
            <Icon name={trendIcon} size={12} />
            {trendLabel}
          </span>
        </div>
      </div>

      {hasData ? (
        <>
          <div className="relative flex h-[260px] items-center justify-center">
            <svg className="h-full w-full max-w-md" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="none" stroke="outline-variant" strokeDasharray="2 2" strokeOpacity="0.4" strokeWidth="0.3" />
              <circle cx="50" cy="50" r="23" fill="none" stroke="outline-variant" strokeDasharray="2 2" strokeOpacity="0.4" strokeWidth="0.3" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="outline-variant" strokeDasharray="2 2" strokeOpacity="0.4" strokeWidth="0.3" />
              <line x1="50" y1="15" x2="50" y2="85" stroke="outline-variant" strokeOpacity="0.3" strokeWidth="0.3" />
              <line x1="15" y1="50" x2="85" y2="50" stroke="outline-variant" strokeOpacity="0.3" strokeWidth="0.3" />
              <polygon points={polygonPoints} fill="rgba(210,240,0,0.4)" stroke="secondary-fixed" strokeWidth="1.5" />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="1" fill="primary" />
              ))}
              <text x="50" y="10" fill="primary" fontSize="3" fontWeight="bold" textAnchor="middle">DRIVE</text>
              <text x="90" y="52" fill="primary" fontSize="3" fontWeight="bold" textAnchor="end">INNSPILL</text>
              <text x="50" y="95" fill="primary" fontSize="3" fontWeight="bold" textAnchor="middle">KORT SPILL</text>
              <text x="10" y="52" fill="primary" fontSize="3" fontWeight="bold" textAnchor="start">PUTTING</text>
            </svg>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Drive", value: summary.offTheTee },
              { label: "Innspill", value: summary.approach },
              { label: "Kort spill", value: summary.aroundTheGreen },
              { label: "Putting", value: summary.putting },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border-l-4 border-secondary-fixed bg-surface p-4">
                <p className="font-mono text-[9px] uppercase text-primary/50">{item.label}</p>
                <p className="text-lg font-bold text-primary">{formatSG(item.value)}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon="flag"
          title="Ingen SG-data siste 30d"
          description="Registrer en runde med skuddetaljer for å se Strokes Gained-profil"
          ctaLabel="Registrer runde"
          ctaHref="/portal/runde/ny"
        />
      )}
    </div>
  );
}

/* ── Trening-pyramide (col-6) ── */

function TrainingPyramidCard({ index }: { index: TrainingIndexData | null }) {
  if (!index || index.weeklyHours === 0) {
    return (
      <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-6">
        <TrainingHeader />
        <EmptyState
          icon="fitness_center"
          title="Ingen treningslogg"
          description="Logg din første økt for å se trenings-pyramide og volum"
          ctaLabel="Logg økt"
          ctaHref="/portal/dagbok"
        />
      </div>
    );
  }

  const minHours = index.recommendedSummer[0];
  const maxHours = index.recommendedSummer[1];
  const belowTarget = index.weeklyHours < minHours;
  const aboveTarget = index.weeklyHours > maxHours;
  const onTarget = !belowTarget && !aboveTarget;
  const volumeLabel = belowTarget ? "Under anbefalt" : aboveTarget ? "Over anbefalt" : "På mål";
  const volumeColor = onTarget ? "text-primary-container" : "text-error";

  const layers = [
    { key: "onCourse", label: "Bane", pct: index.distribution.onCourse, barClass: "bg-secondary-fixed" },
    { key: "skillTechnical", label: "Teknikk", pct: index.distribution.skillTechnical, barClass: "bg-primary-container/70" },
    { key: "shortGame", label: "Kort spill", pct: index.distribution.shortGame, barClass: "bg-primary-container/50" },
    { key: "putting", label: "Putting", pct: index.distribution.putting, barClass: "bg-primary-container" },
    { key: "physicalMental", label: "Fys / Mental", pct: index.distribution.physicalMental, barClass: "bg-primary" },
  ];

  return (
    <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-6">
      <TrainingHeader />
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase text-primary/50">Timer / uke (30d)</p>
          <p className="text-4xl font-bold text-primary">{index.weeklyHours}</p>
        </div>
        <div className="text-right">
          <p className={`font-mono text-[10px] font-bold uppercase ${volumeColor}`}>{volumeLabel}</p>
          <p className="font-mono text-[10px] text-primary/40">
            Mål: {minHours}–{maxHours}t
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {layers.map((layer) => {
          const pct = Math.round(layer.pct * 100);
          return (
            <div key={layer.key} className="flex items-center gap-3">
              <span className="w-20 font-mono text-[10px] uppercase text-primary/60">{layer.label}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${layer.barClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-[10px] font-bold text-primary">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-outline-variant/10 pt-4">
        <div>
          <p className="font-mono text-[9px] uppercase text-primary/40">Plan-gjennomføring</p>
          <p className="text-sm font-bold text-primary">{index.planAdherencePct}%</p>
        </div>
        <Link
          href="/portal/treningsplan"
          className="text-[11px] font-bold uppercase tracking-widest text-primary hover:opacity-70"
        >
          Se plan →
        </Link>
      </div>
    </div>
  );
}

function TrainingHeader() {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <Link
          href="/portal/dagbok"
          className="font-mono text-[10px] uppercase tracking-tight text-primary/60 hover:text-primary"
        >
          Treningsdata →
        </Link>
        <h3 className="text-xl font-bold tracking-tight text-primary">Treningsfordeling</h3>
      </div>
      <Icon name="fitness_center" size={20} className="text-primary/40" />
    </div>
  );
}

/* ── Test-progresjon (col-6) ── */

function TestProgressCard({ progress }: { progress: TestProgress }) {
  if (progress.completedTests === 0) {
    return (
      <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-6">
        <TestHeader />
        <EmptyState
          icon="checklist"
          title="Ingen tester gjennomført"
          description="Ta din første test for å få baseline og kategori-vurdering"
          ctaLabel="Se tester"
          ctaHref="/portal/kartlegging"
        />
      </div>
    );
  }

  const completedPct = (progress.completedTests / progress.totalTests) * 100;
  const passedPct =
    progress.completedTests > 0
      ? (progress.passedTests / progress.completedTests) * 100
      : 0;

  return (
    <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-6">
      <TestHeader />
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase text-primary/50">Gjennomført</p>
          <p className="text-4xl font-bold text-primary">
            {progress.completedTests}
            <span className="text-xl text-primary/40"> / {progress.totalTests}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] font-bold uppercase text-primary-container">
            {Math.round(passedPct)}% bestått
          </p>
          <p className="font-mono text-[10px] text-primary/40">
            {progress.passedTests} av {progress.completedTests}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-20 font-mono text-[10px] uppercase text-primary/60">Dekning</span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-secondary-fixed transition-all duration-500"
              style={{ width: `${completedPct}%` }}
            />
          </div>
          <span className="w-10 text-right font-mono text-[10px] font-bold text-primary">
            {Math.round(completedPct)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-20 font-mono text-[10px] uppercase text-primary/60">Bestått</span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-primary-container transition-all duration-500"
              style={{
                width: `${(progress.passedTests / progress.totalTests) * 100}%`,
              }}
            />
          </div>
          <span className="w-10 text-right font-mono text-[10px] font-bold text-primary">
            {progress.passedTests}
          </span>
        </div>
      </div>

      {progress.latestTest ? (
        <div className="mt-6 rounded-2xl bg-surface p-4">
          <p className="font-mono text-[9px] uppercase text-primary/40">Siste test</p>
          <div className="mt-1 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-primary">
                {progress.latestTest.name}
              </p>
              <p className="font-mono text-[11px] text-on-surface-variant">
                {progress.latestTest.value} {progress.latestTest.unit} ·{" "}
                {format(new Date(progress.latestTest.conductedAt), "d. MMM", { locale: nb })}
              </p>
            </div>
            <span
              className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${
                progress.latestTest.passed
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {progress.latestTest.passed ? "Bestått" : "Ikke bestått"}
            </span>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between border-t border-outline-variant/10 pt-4">
        <div>
          <p className="font-mono text-[9px] uppercase text-primary/40">Manglende</p>
          <p className="text-sm font-bold text-primary">{progress.missingCount} tester</p>
        </div>
        <Link
          href="/portal/kartlegging"
          className="text-[11px] font-bold uppercase tracking-widest text-primary hover:opacity-70"
        >
          Se alle →
        </Link>
      </div>
    </div>
  );
}

function TestHeader() {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <Link
          href="/portal/kartlegging"
          className="font-mono text-[10px] uppercase tracking-tight text-primary/60 hover:text-primary"
        >
          Testdata →
        </Link>
        <h3 className="text-xl font-bold tracking-tight text-primary">Ferdighetstester</h3>
      </div>
      <Icon name="checklist" size={20} className="text-primary/40" />
    </div>
  );
}

/* ── Empty state ── */

function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-outline-variant/40 bg-surface p-8 text-center">
      <Icon name={icon} size={36} className="text-primary/30" />
      <div>
        <p className="text-sm font-bold text-primary">{title}</p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-primary/60">{description}</p>
      </div>
      <Link
        href={ctaHref}
        className="rounded-lg bg-secondary-fixed px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:opacity-90"
      >
        {ctaLabel}
      </Link>
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
          <p className="font-mono text-[11px] text-primary/40">m/ {instructor}</p>
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
        <p className="mt-1 text-xs text-primary/60">Book en coachingtime for å komme i gang</p>
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
