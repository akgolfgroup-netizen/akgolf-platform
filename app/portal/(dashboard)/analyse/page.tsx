import type { Metadata } from "next";
import Link from "next/link";
import { requirePortalUser } from "@/lib/portal/auth";
import {
  getHandicapEntries,
  getAnalyseStats,
  getStrokesGainedData,
  getTrackManStats,
} from "./actions";

import { Target, Upload, Lightbulb } from "lucide-react";
import { SubscriptionTier } from "@prisma/client";
import { hasTierAccess } from "@/lib/portal/rbac";
import {
  SGRing,
  NightSurface,
  MonoLabel,
  BentoCard,
  BentoGrid,
} from "@/components/portal/patterns";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Analyse | PlayersHQ",
  description:
    "AI-drevet innsikt i ditt spill. Dyp analyse av handicap, Strokes Gained og TrackMan-data.",
  openGraph: {
    title: "Analyse | PlayersHQ",
    description:
      "AI-drevet innsikt i ditt spill. Dyp analyse av handicap, Strokes Gained og TrackMan-data.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analyse | PlayersHQ",
    description:
      "AI-drevet innsikt i ditt spill. Dyp analyse av handicap, Strokes Gained og TrackMan-data.",
  },
};

export default async function AnalysePage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  const isPro = hasTierAccess(userTier, SubscriptionTier.PRO);

  let chartData: { date: string; value: number }[] = [];
  let loadError = false;

  // Hent alle data parallelt
  const [handicapResult, stats, sgData, trackManStats] = await Promise.all([
    getHandicapEntries(12).catch(() => null),
    getAnalyseStats().catch(() => null),
    getStrokesGainedData().catch(() => null),
    isPro ? getTrackManStats().catch(() => []) : Promise.resolve([]),
  ]);

  if (handicapResult) {
    chartData = handicapResult.map((entry) => ({
      date: typeof entry.date === "string" ? entry.date : String(entry.date),
      value: entry.handicapIndex,
    }));
  } else {
    loadError = true;
  }

  const hasRoundData = stats && stats.roundCount > 0;
  const hasSGData =
    sgData &&
    (sgData.sgOffTheTee != null ||
      sgData.sgApproach != null ||
      sgData.sgAroundTheGreen != null ||
      sgData.sgPutting != null);

  return (
    <section className="space-y-6">
      {/* Header */}
      <header>
        <MonoLabel size="xs" uppercase className="text-on-surface-variant block mb-2">
          Analyse
        </MonoLabel>
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Din analyse
        </h1>
        <p className="text-on-surface-variant mt-1 max-w-xl">
          AI-drevet innsikt i ditt spill. Dyp analyse av handicap, Strokes Gained og TrackMan-data.
        </p>
      </header>

      {/* Data load error */}
      {loadError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-3xl border border-error/30 bg-error/5 p-4"
        >
          <Icon name="info" className="h-5 w-5 flex-shrink-0 text-error" />
          <p className="text-[13px] font-medium text-error">
            Kunne ikke laste handicap-data. Prøv å laste siden på nytt.
          </p>
        </div>
      )}

      {/* Tier Gate for Pro Features */}
      {!isPro && (
        <BentoCard variant="light" padding="lg">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Icon name="lightbulb" className="h-6 w-6 text-warning" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <MonoLabel size="xs" uppercase className="text-on-surface-variant block mb-1">
                Pro-funksjon
              </MonoLabel>
              <h3 className="mb-2 text-[14px] font-semibold text-on-surface">
                Oppgrader for full analyse
              </h3>
              <p className="mb-4 text-[13px] leading-relaxed text-on-surface-variant">
                Få tilgang til avansert statistikk, TrackMan-data, og AI-drevne
                anbefalinger med Pro-abonnement.
              </p>
              <Link
                href="/portal/abonnement"
                className="inline-flex h-10 items-center rounded-full bg-warning px-5 text-[12px] font-bold text-surface shadow-sm transition-opacity hover:opacity-90"
              >
                Oppgrader til Pro
              </Link>
            </div>
          </div>
        </BentoCard>
      )}

      {/* STATS GRID */}
      {hasRoundData ? (
        <BentoGrid cols={4} gap="md">
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-on-surface-variant block">GIR</MonoLabel>
            <p className="mt-2 text-[28px] font-bold leading-none tabular-nums tracking-[-0.02em] text-on-surface">
              {stats.girPercent != null ? Math.round(stats.girPercent) : 0}
              <span className="ml-1 text-[13px] font-normal text-on-surface-variant">%</span>
            </p>
            {stats.girTrend != null && (
              <p className={`mt-2 text-[11px] tabular-nums ${stats.girTrend >= 0 ? "text-success" : "text-error"}`}>
                {stats.girTrend >= 0 ? "+" : ""}{(Math.round(stats.girTrend * 10) / 10).toFixed(1)} vs. forrige
              </p>
            )}
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-on-surface-variant block">Fairways</MonoLabel>
            <p className="mt-2 text-[28px] font-bold leading-none tabular-nums tracking-[-0.02em] text-on-surface">
              {stats.fairwayPercent != null ? Math.round(stats.fairwayPercent) : 0}
              <span className="ml-1 text-[13px] font-normal text-on-surface-variant">%</span>
            </p>
            {stats.fairwayTrend != null && (
              <p className={`mt-2 text-[11px] tabular-nums ${stats.fairwayTrend >= 0 ? "text-success" : "text-error"}`}>
                {stats.fairwayTrend >= 0 ? "+" : ""}{(Math.round(stats.fairwayTrend * 10) / 10).toFixed(1)} vs. forrige
              </p>
            )}
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-on-surface-variant block">Putts/runde</MonoLabel>
            <p className="mt-2 text-[28px] font-bold leading-none tabular-nums tracking-[-0.02em] text-on-surface">
              {stats.puttsPerRound != null ? (Math.round(stats.puttsPerRound * 10) / 10).toFixed(1) : "0"}
            </p>
            {stats.puttsTrend != null && (
              <p className={`mt-2 text-[11px] tabular-nums ${stats.puttsTrend <= 0 ? "text-success" : "text-error"}`}>
                {stats.puttsTrend >= 0 ? "+" : ""}{(Math.round(stats.puttsTrend * 10) / 10).toFixed(1)} vs. forrige
              </p>
            )}
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-on-surface-variant block">Scrambling</MonoLabel>
            <p className="mt-2 text-[28px] font-bold leading-none tabular-nums tracking-[-0.02em] text-on-surface">
              {stats.scramblingPercent != null ? Math.round(stats.scramblingPercent) : 0}
              <span className="ml-1 text-[13px] font-normal text-on-surface-variant">%</span>
            </p>
            {stats.scramblingTrend != null && (
              <p className={`mt-2 text-[11px] tabular-nums ${stats.scramblingTrend >= 0 ? "text-success" : "text-error"}`}>
                {stats.scramblingTrend >= 0 ? "+" : ""}{(Math.round(stats.scramblingTrend * 10) / 10).toFixed(1)} vs. forrige
              </p>
            )}
          </BentoCard>
        </BentoGrid>
      ) : (
        <BentoCard variant="light" padding="lg">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container">
              <Icon name="bar_chart" className="h-6 w-6 text-on-surface-variant" strokeWidth={1.75} />
            </div>
            <h3 className="mb-2 text-[14px] font-semibold text-on-surface">
              Ingen rundestatistikk ennå
            </h3>
            <p className="mb-4 max-w-sm text-[13px] leading-relaxed text-on-surface-variant">
              Registrer din første runde for å se GIR, Fairways, Putts og Scrambling her.
            </p>
            <Link
              href="/portal/statistikk/ny-runde"
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-[12px] font-bold text-surface shadow-sm transition-opacity hover:opacity-90"
            >
              Registrer runde
            </Link>
          </div>
        </BentoCard>
      )}

      {/* SECTION: Utvikling */}
      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant font-mono">
          <span className="h-px w-6 bg-outline-variant" />
          Utvikling
        </p>

        {/* Main Charts — Heritage Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Handicap-trend */}
          <section className="col-span-12 overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 lg:col-span-6">
            <h3 className="mb-5 text-[14px] font-semibold text-on-surface">
              Handicap-trend
            </h3>
            {chartData.length > 0 ? (
              <div className="h-[220px] flex items-center justify-center rounded-xl bg-surface-container">
                <p className="text-[13px] text-on-surface-variant">Handicap-graf kommer snart.</p>
              </div>
            ) : (
              <p className="py-12 text-center text-[13px] text-on-surface-variant">
                Ingen handicap-data registrert ennå.
              </p>
            )}
          </section>

          {/* Strokes Gained Breakdown — SG Ring hero (v3.1) */}
          <section className="col-span-12 overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 lg:col-span-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-on-surface">
                Strokes Gained
              </h3>
              {hasSGData && (
                <MonoLabel size="xs" uppercase className="text-on-surface-variant">
                  4-ring · Snitt
                </MonoLabel>
              )}
            </div>
            {hasSGData && sgData ? (
              <>
                <NightSurface
                  variant="ambient"
                  className="rounded-2xl mb-5 p-6 flex justify-center"
                >
                  <SGRing
                    offTee={sgData.sgOffTheTee ?? 0}
                    approach={sgData.sgApproach ?? 0}
                    short={sgData.sgAroundTheGreen ?? 0}
                    putt={sgData.sgPutting ?? 0}
                    size="md"
                  />
                </NightSurface>
                <StrokesGainedBars sgData={sgData} />
              </>
            ) : (
              <p className="py-12 text-center text-[13px] text-on-surface-variant">
                Ingen Strokes Gained-data ennå. Registrer runder med SG for å se analysen.
              </p>
            )}
          </section>
        </div>
      </div>

      {/* TrackMan Data */}
      {isPro && (
        <div>
          <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant font-mono">
            <span className="h-px w-6 bg-outline-variant" />
            TrackMan
          </p>
          <div className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-on-surface">
                TrackMan-data
              </h3>
              <Link
                href="/portal/trackman"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Se alle sesjoner
              </Link>
            </div>
            {trackManStats.length > 0 ? (
              <BentoGrid cols={4} gap="md">
                {trackManStats.map((stat) => (
                  <BentoCard key={stat.label} variant="light" padding="md">
                    <MonoLabel size="xs" uppercase className="text-on-surface-variant block">{stat.label}</MonoLabel>
                    <p className="mt-2 text-[28px] font-[300] leading-none tabular-nums tracking-[-0.02em] text-on-surface">
                      {stat.value}
                      <span className="ml-1 text-[13px] font-normal text-on-surface-variant">
                        {stat.unit}
                      </span>
                    </p>
                    <p className="mt-2 text-[11px] text-on-surface-variant">{stat.club}</p>
                  </BentoCard>
                ))}
              </BentoGrid>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-[13px] text-on-surface-variant">
                  Ingen TrackMan-sesjoner registrert ennå.
                </p>
                <Link
                  href="/portal/trackman"
                  className="mt-3 inline-flex h-9 items-center rounded-full bg-primary px-4 text-[12px] font-bold text-surface transition-opacity hover:opacity-90"
                >
                  Last opp data
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant font-mono">
          <span className="h-px w-6 bg-outline-variant" />
          Handlinger
        </p>
        <BentoGrid cols={3} gap="md">
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
        </BentoGrid>
      </div>

      {/* Info */}
      <details className="group overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-lowest">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-5 transition-colors hover:bg-surface">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon name="info" className="h-5 w-5 text-primary" strokeWidth={1.75} />
          </div>
          <span className="text-[14px] font-semibold text-on-surface">
            Om Strokes Gained
          </span>
          <Icon name="chevron_right" className="ml-auto h-5 w-5 text-on-surface-variant transition-transform group-open:rotate-90" />
        </summary>
        <div className="border-t border-outline-variant/10 p-5 pt-0">
          <p className="mt-4 text-[13px] leading-relaxed text-on-surface-variant">
            Strokes Gained er en statistisk metode som måler hvor mange slag du
            sparer eller taper sammenlignet med referansenivået (typisk PGA
            Tour-gjennomsnitt eller ditt handicap-nivå). Positive tall betyr at
            du er bedre enn gjennomsnittet, negative tall betyr at du har
            forbedringspotensial.
          </p>
        </div>
      </details>
    </section>
  );
}

// ── Sub-components ──

function StrokesGainedBars({
  sgData,
}: {
  sgData: {
    sgOffTheTee: number | null;
    sgApproach: number | null;
    sgAroundTheGreen: number | null;
    sgPutting: number | null;
  };
}) {
  const items = [
    { label: "Off the Tee", value: sgData.sgOffTheTee },
    { label: "Approach", value: sgData.sgApproach },
    { label: "Around Green", value: sgData.sgAroundTheGreen },
    { label: "Putting", value: sgData.sgPutting },
  ].filter((item) => item.value != null) as {
    label: string;
    value: number;
  }[];

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-medium text-on-surface">
              {item.label}
            </span>
            <span
              className={`text-[12px] font-semibold tabular-nums ${
                item.value >= 0 ? "text-success" : "text-error"
              }`}
            >
              {item.value > 0 ? "+" : ""}
              {item.value.toFixed(1)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-container">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.value >= 0 ? "bg-success" : "bg-error"
              }`}
              style={{
                width: `${Math.min(Math.abs(item.value) * 50, 100)}%`,
                marginLeft: item.value < 0 ? "auto" : 0,
                marginRight: item.value < 0 ? 0 : "auto",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyseQuickAction({
  href,
  icon: IconLucide,
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
      className="group relative flex items-center gap-3 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-4 transition-all duration-300 will-change-transform hover:-translate-y-px hover:shadow-card-hover"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
        <IconLucide className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-on-surface">
          {label}
        </p>
        <p className="truncate text-[11px] text-on-surface-variant">{description}</p>
      </div>
      <Icon name="chevron_right" className="h-3.5 w-3.5 -translate-x-1 text-on-surface-variant opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}
