import Link from "next/link";
import { requirePortalUser } from "@/lib/portal/auth";
import { getHandicapEntries } from "./actions";
import { ProgressChart } from "@/components/portal/heritage/progress-chart";
import { HeroHeading, GlassCard, DarkStatCard } from "@/components/portal/premium";
import {
  TrendingDown,
  Target,
  Activity,
  BarChart3,
  Upload,
  Lightbulb,
  Info,
  ChevronRight,
} from "lucide-react";
import { SubscriptionTier } from "@prisma/client";
import { hasTierAccess } from "@/lib/portal/rbac";

export default async function AnalysePage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  const isPro = hasTierAccess(userTier, SubscriptionTier.PRO);

  let chartData: { date: string; value: number }[] = [];
  let loadError = false;

  try {
    const handicapEntries = await getHandicapEntries(12);
    chartData = handicapEntries.map((entry) => ({
      date: entry.date.toISOString(),
      value: entry.handicapIndex,
    }));
  } catch {
    loadError = true;
  }

  return (
    <div className="space-y-10">
      {/* HERO */}
      <HeroHeading
        label="Analyse"
        title={
          <>
            Din{" "}
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              analyse
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description="AI-drevet innsikt i ditt spill. Dyp analyse av handicap, Strokes Gained og TrackMan-data."
      />

      {/* Data load error */}
      {loadError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-4 backdrop-blur-xl"
        >
          <Info className="h-5 w-5 flex-shrink-0 text-[var(--color-error)]" />
          <p className="text-[13px] font-medium text-[var(--color-error)]">
            Kunne ikke laste handicap-data. Prov a laste siden pa nytt.
          </p>
        </div>
      )}

      {/* Tier Gate for Pro Features */}
      {!isPro && (
        <GlassCard variant="light" padding="lg">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-warning)]/10">
              <Lightbulb className="h-6 w-6 text-[var(--color-warning)]" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
                Pro-funksjon
              </p>
              <h3 className="mb-2 text-[14px] font-semibold text-[var(--color-grey-900)]">
                Oppgrader for full analyse
              </h3>
              <p className="mb-4 text-[13px] leading-relaxed text-[var(--color-muted)]">
                Fa tilgang til avansert statistikk, TrackMan-data, og AI-drevne anbefalinger med
                Pro-abonnement.
              </p>
              <Link
                href="/portal/abonnement"
                className="inline-flex h-10 items-center rounded-full bg-[var(--color-warning)] px-5 text-[12px] font-bold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Oppgrader til Pro
              </Link>
            </div>
          </div>
        </GlassCard>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 lg:col-span-3">
          <DarkStatCard
            label="GIR"
            value={42}
            unit="%"
            icon={Target}
            trend={5}
            trendLabel="siste mnd"
            variant="primary"
            delay={0}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <DarkStatCard
            label="Fairways"
            value={58}
            unit="%"
            icon={Activity}
            trend={-2}
            trendLabel="siste mnd"
            variant="default"
            delay={0.08}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <DarkStatCard
            label="Putts/runde"
            value={32.5}
            decimals={1}
            icon={TrendingDown}
            lowerIsBetter
            trend={-1.2}
            trendLabel="siste mnd"
            variant="accent"
            delay={0.16}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <DarkStatCard
            label="Scrambling"
            value={38}
            unit="%"
            icon={BarChart3}
            trend={3}
            trendLabel="siste mnd"
            variant="default"
            delay={0.24}
          />
        </div>
      </div>

      {/* SECTION LABEL */}
      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          <span className="h-px w-6 bg-[var(--color-muted)]" />
          Utvikling
        </p>

        {/* Main Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GlassCard variant="light" padding="lg" delay={0.1}>
            <h3 className="mb-5 text-[14px] font-semibold text-[var(--color-grey-900)]">
              Handicap-trend
            </h3>
            <ProgressChart
              data={chartData}
              title=""
              color="var(--color-primary)"
              height={220}
            />
          </GlassCard>

          {/* Strokes Gained Breakdown */}
          <GlassCard variant="light" padding="lg" delay={0.2}>
            <h3 className="mb-5 text-[14px] font-semibold text-[var(--color-grey-900)]">
              Strokes Gained
            </h3>
            <div className="space-y-5">
              {[
                { label: "Off the Tee", value: 0.3, color: "var(--color-primary)" },
                { label: "Approach", value: -0.5, color: "var(--color-primary)" },
                { label: "Around Green", value: 0.1, color: "var(--color-warning)" },
                { label: "Putting", value: -0.8, color: "var(--color-ai)" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[var(--color-text)]">
                      {item.label}
                    </span>
                    <span
                      className="text-[12px] font-semibold tabular-nums"
                      style={{
                        color:
                          item.value >= 0
                            ? "var(--color-success)"
                            : "var(--color-error)",
                      }}
                    >
                      {item.value > 0 ? "+" : ""}
                      {item.value.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(Math.abs(item.value) * 50, 100)}%`,
                        backgroundColor: item.color,
                        marginLeft: item.value < 0 ? "auto" : 0,
                        marginRight: item.value < 0 ? 0 : "auto",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* TrackMan Data */}
      {isPro && (
        <div>
          <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            <span className="h-px w-6 bg-[var(--color-muted)]" />
            TrackMan
          </p>
          <GlassCard variant="light" padding="lg" delay={0.3}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--color-grey-900)]">
                TrackMan-data
              </h3>
              <button className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline">
                Se alle sesjoner
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { label: "Klubbhastighet", value: "98.5", unit: "mph", club: "Driver" },
                { label: "Ballhastighet", value: "145.2", unit: "mph", club: "Driver" },
                { label: "Spin rate", value: "2450", unit: "rpm", club: "7-jern" },
                { label: "Launch angle", value: "12.5", unit: "grader", club: "Driver" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/60 bg-white/60 p-4 backdrop-blur-xl"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-[28px] font-[300] leading-none tabular-nums tracking-[-0.02em] text-[var(--color-grey-900)]">
                    {stat.value}
                    <span className="ml-1 text-[13px] font-normal text-[var(--color-muted)]">
                      {stat.unit}
                    </span>
                  </p>
                  <p className="mt-2 text-[11px] text-[var(--color-muted)]">{stat.club}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          <span className="h-px w-6 bg-[var(--color-muted)]" />
          Handlinger
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AnalyseQuickAction
            href="/portal/trackman"
            icon={Upload}
            label="Last opp TrackMan"
            description="Importer nye data"
          />
          <AnalyseQuickAction
            href="/portal/statistikk/ny-runde"
            icon={Target}
            label="Registrer runde"
            description="Logg ny score"
          />
          <AnalyseQuickAction
            href="/portal/ai-coach"
            icon={Lightbulb}
            label="Be om analyse"
            description="AI-vurdering"
          />
        </div>
      </div>

      {/* Info */}
      <details className="group overflow-hidden rounded-[24px] border border-white/80 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(10,31,24,0.12)]">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-5 transition-colors hover:bg-white/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
            <Info className="h-5 w-5 text-[var(--color-primary)]" strokeWidth={1.75} />
          </div>
          <span className="text-[14px] font-semibold text-[var(--color-grey-900)]">
            Om Strokes Gained
          </span>
          <ChevronRight className="ml-auto h-5 w-5 text-[var(--color-muted)] transition-transform group-open:rotate-90" />
        </summary>
        <div className="border-t border-white/60 p-5 pt-0">
          <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-muted)]">
            Strokes Gained er en statistisk metode som maler hvor mange slag du sparer eller taper
            sammenlignet med referansenivaet (typisk PGA Tour-gjennomsnitt eller ditt
            handicap-niva). Positive tall betyr at du er bedre enn gjennomsnittet, negative tall
            betyr at du har forbedringspotensial.
          </p>
        </div>
      </details>
    </div>
  );
}

function AnalyseQuickAction({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/70 p-4 backdrop-blur-xl transition-all duration-300 will-change-transform hover:-translate-y-0.5 hover:border-[var(--color-primary)]/20 hover:shadow-[0_12px_32px_-12px_rgba(0,88,64,0.2)]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 transition-transform group-hover:scale-110">
        <Icon className="h-[18px] w-[18px] text-[var(--color-primary)]" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[var(--color-grey-900)]">{label}</p>
        <p className="truncate text-[11px] text-[var(--color-muted)]">{description}</p>
      </div>
      <ChevronRight className="h-3.5 w-3.5 -translate-x-1 text-[var(--color-muted)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}
