"use client";

import { MyelinAlert } from "./myelin-alert";
import { VolumeDashboard } from "./volume-dashboard";

interface PlanHealthCardProps {
  planId: string;
}

/**
 * Kombinert plan-health-visning:
 * - Myelin-varsler (treningsovervåking)
 * - Volum-dashboard (ukentlig progress)
 *
 * Brukes på spiller-dashboard og teknisk plan-side.
 */
export function PlanHealthCard({ planId }: PlanHealthCardProps) {
  return (
    <div className="space-y-4">
      <MyelinAlert planId={planId} />
      <VolumeDashboard planId={planId} />
    </div>
  );
}
