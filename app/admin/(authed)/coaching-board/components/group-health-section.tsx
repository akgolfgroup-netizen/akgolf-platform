"use client";

/**
 * GroupHealthSection — følger mc-kpi-strip-mønster fra Mission Board wireframe.
 * 4 PremiumStatCard + AKPyramide for gruppens treningsfordeling.
 */

import { Users, TrendingUp, AlertTriangle, ClipboardCheck } from "lucide-react";
import { PremiumStatCard } from "@/components/portal/premium";
import { AKPyramide } from "@/components/portal/patterns";
import type { PyramideLevel } from "@/components/portal/patterns";
import type { CoachingBoardGroupHealth } from "../actions";

interface GroupHealthSectionProps {
  health: CoachingBoardGroupHealth;
}

export function GroupHealthSection({ health }: GroupHealthSectionProps) {
  const dist = health.distributionAvg;

  const pyramideData: { level: PyramideLevel; percent: number; value: string }[] = [
    {
      level: "FYS",
      percent: Math.round(dist.physicalMental * 100),
      value: `${Math.round(dist.physicalMental * 100)}%`,
    },
    {
      level: "TEK",
      percent: Math.round(dist.skillTechnical * 100),
      value: `${Math.round(dist.skillTechnical * 100)}%`,
    },
    {
      level: "SLAG",
      percent: Math.round(dist.shortGame * 100),
      value: `${Math.round(dist.shortGame * 100)}%`,
    },
    {
      level: "SPILL",
      percent: Math.round(dist.putting * 100),
      value: `${Math.round(dist.putting * 100)}%`,
    },
    {
      level: "TURN",
      percent: Math.round(dist.onCourse * 100),
      value: `${Math.round(dist.onCourse * 100)}%`,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PremiumStatCard
          label="Spillere"
          value={health.totalPlayers}
          unit="aktive"
          icon={Users}
          disableSpotlight={health.totalPlayers > 30}
        />
        <PremiumStatCard
          label="USI-trend 30d"
          value={health.avgUsiChange30d}
          decimals={2}
          trend={health.avgUsiChange30d}
          trendLabel="gruppesnitt"
          icon={TrendingUp}
        />
        <PremiumStatCard
          label="Banegolf-overvekt"
          value={health.courseHeavyCount}
          unit="spillere"
          icon={AlertTriangle}
          disableSpotlight
        />
        <PremiumStatCard
          label="Tester mangler"
          value={health.missingTestsCount}
          unit="spillere"
          icon={ClipboardCheck}
          disableSpotlight
        />
      </div>

      <AKPyramide
        data={pyramideData}
        readOnly
        title="Treningsfordeling · gruppesnitt"
        subtitle="Gjennomsnittlig tidsbruk siste 30 dager på tvers av mine spillere."
      />
    </section>
  );
}
