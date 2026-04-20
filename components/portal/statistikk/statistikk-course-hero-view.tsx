"use client";


import { Icon } from "@/components/ui/icon";
/**
 * StatistikkCourseHeroView — opt2 Course Hero-variant av /portal/statistikk.
 *
 * Kilde: /tmp/ak-golf-design/screens/stats-v2.html
 * Tiltet bane-hero + glass drawer + SG-ring sentrert.
 */

import Link from "next/link";

import {
  CourseHero,
  GlassPanel,
  GlassPanelRow,
  GlassButton,
  HeroLabel,
  HeroLabelSeparator,
  SGRing,
  MonoLabel,
} from "@/components/portal/patterns";

interface Props {
  handicap: number | null;
  avgSgTotal: number | null;
  avgSgOffTheTee: number | null;
  avgSgApproach: number | null;
  avgSgAroundTheGreen: number | null;
  avgSgPutting: number | null;
  roundCount: number | null;
  avgScore: number | null;
  periodLabel: string;
}

export function StatistikkCourseHeroView({
  handicap,
  avgSgTotal,
  avgSgOffTheTee,
  avgSgApproach,
  avgSgAroundTheGreen,
  avgSgPutting,
  roundCount,
  avgScore,
  periodLabel,
}: Props) {
  const hasSG =
    avgSgOffTheTee != null ||
    avgSgApproach != null ||
    avgSgAroundTheGreen != null ||
    avgSgPutting != null;

  return (
    <div className="-mx-6 lg:-mx-8 -mt-8 lg:-mt-10 -mb-10">
      <CourseHero
        bgImage="/images/course-hero/hero-golf-divot.jpg"
        bgAlt="Course view"
        overlay="subtle"
        className="min-h-[720px] rounded-none"
      >
        {/* Hero label top */}
        <div className="absolute top-6 left-8 z-10 flex items-center gap-3 flex-wrap">
          <HeroLabel>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed shadow-[0_0_12px_#D1F843]" />
            <strong className="text-surface font-semibold">Statistikk</strong>
            <HeroLabelSeparator />
            <span>{periodLabel}</span>
          </HeroLabel>
          {handicap != null && (
            <HeroLabel variant="lime">
              <strong>HCP {handicap.toFixed(1)}</strong>
            </HeroLabel>
          )}
        </div>

        {/* SG Ring hero midt */}
        {hasSG && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10">
            <SGRing
              offTee={avgSgOffTheTee ?? 0}
              approach={avgSgApproach ?? 0}
              short={avgSgAroundTheGreen ?? 0}
              putt={avgSgPutting ?? 0}
              size="lg"
            />
          </div>
        )}

        {/* Glass drawer bottom */}
        <div className="absolute inset-x-8 bottom-8 z-10 grid grid-cols-[1.3fr_1fr_1fr] gap-4">
          {/* Summary */}
          <GlassPanel padding="md">
            <MonoLabel size="xs" uppercase className="text-surface/45 block mb-3">
              ◆ Performance · {periodLabel}
            </MonoLabel>
            <div className="flex items-baseline gap-3">
              <span className="text-[48px] font-bold tracking-tight tabular-nums leading-none">
                {avgSgTotal != null
                  ? `${avgSgTotal > 0 ? "+" : ""}${avgSgTotal.toFixed(2)}`
                  : "—"}
              </span>
              <MonoLabel size="sm" className="text-surface/55">
                SG/runde
              </MonoLabel>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed/18 text-secondary-fixed text-[12px] font-semibold">
                <Icon name="trending_up" className="w-3 h-3" />
                Snittscore {avgScore != null ? avgScore.toFixed(1) : "—"}
              </span>
              <MonoLabel size="xs" className="text-surface/45">
                {roundCount ?? 0} runder
              </MonoLabel>
            </div>
          </GlassPanel>

          {/* SG per kategori — panel rows */}
          <GlassPanel padding="none">
            <div className="px-5 pt-4 pb-2">
              <MonoLabel size="xs" uppercase className="text-surface/45">
                SG per område
              </MonoLabel>
            </div>
            <GlassPanelRow
              label="Off-tee"
              value={
                avgSgOffTheTee != null
                  ? `${avgSgOffTheTee > 0 ? "+" : ""}${avgSgOffTheTee.toFixed(2)}`
                  : "—"
              }
            />
            <GlassPanelRow
              label="Approach"
              value={
                avgSgApproach != null
                  ? `${avgSgApproach > 0 ? "+" : ""}${avgSgApproach.toFixed(2)}`
                  : "—"
              }
            />
            <GlassPanelRow
              label="Short"
              value={
                avgSgAroundTheGreen != null
                  ? `${avgSgAroundTheGreen > 0 ? "+" : ""}${avgSgAroundTheGreen.toFixed(2)}`
                  : "—"
              }
            />
            <GlassPanelRow
              label="Putting"
              value={
                avgSgPutting != null
                  ? `${avgSgPutting > 0 ? "+" : ""}${avgSgPutting.toFixed(2)}`
                  : "—"
              }
              last
            />
          </GlassPanel>

          {/* Actions */}
          <GlassPanel padding="md">
            <MonoLabel size="xs" uppercase className="text-surface/45 block mb-4">
              ◆ Handlinger
            </MonoLabel>
            <div className="flex flex-col gap-2">
              <Link href="/portal/statistikk/ny-runde">
                <GlassButton
                  variant="lime"
                  className="w-full"
                  icon={<Icon name="add" className="w-3.5 h-3.5" />}
                >
                  Logg ny runde
                </GlassButton>
              </Link>
              <Link href="/portal/trackman">
                <GlassButton variant="glass" className="w-full">
                  TrackMan-data
                </GlassButton>
              </Link>
              <Link href="/portal/analyse">
                <GlassButton variant="glass" className="w-full">
                  Dyp analyse
                </GlassButton>
              </Link>
            </div>
          </GlassPanel>
        </div>
      </CourseHero>
    </div>
  );
}
