"use client";

import { Badge } from "@/components/ui/badge";
import type { DataQualityLevel } from "@/lib/portal/training-research/constants";

const qualityConfig: Record<
  DataQualityLevel,
  { label: string; variant: "success" | "muted" | "warning" | "error" | "info" }
> = {
  TRACKMAN_VERIFIED: { label: "TrackMan", variant: "success" },
  GPS_CALCULATED: { label: "GPS", variant: "info" },
  HYBRID_ESTIMATED: { label: "Hybrid", variant: "warning" },
  SELF_REPORTED: { label: "Selvrapportert", variant: "muted" },
};

interface QualityBadgeProps {
  quality: DataQualityLevel;
  score?: number;
  className?: string;
}

export function QualityBadge({ quality, score, className }: QualityBadgeProps) {
  const config = qualityConfig[quality];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
      {score !== undefined && ` · ${score}%`}
    </Badge>
  );
}
