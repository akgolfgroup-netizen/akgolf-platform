"use client";

/**
 * VolumePyramid — viser volum-fordeling per AK-pyramide-nivå.
 *
 * Read-only bruk av AKPyramide (pattern P-04) for dagbok.
 * Aggregerer sessionsData per focusArea og vises som horisontale barer.
 *
 * Kilde: /tmp/ak-golf-design/screens/dagbok.html (pyramid-vol seksjon)
 */

import { useMemo } from "react";
import { AKPyramide, type PyramideLevel } from "@/components/portal/patterns";

interface Session {
  durationMinutes: number | null;
  focusArea: string | null;
}

interface VolumePyramidProps {
  sessions: Session[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const LEVEL_ORDER: PyramideLevel[] = ["FYS", "TEK", "SLAG", "SPILL", "TURN"];

// Mapping fra tekst-focusArea til pyramide-nivå
function focusAreaToLevel(focus: string | null): PyramideLevel | null {
  if (!focus) return null;
  const normalized = focus.toUpperCase().trim();
  if (normalized.includes("FYS") || normalized.includes("MOBIL") || normalized.includes("STYRKE")) return "FYS";
  if (normalized.includes("TEK") || normalized.includes("SVING") || normalized.includes("IMPACT")) return "TEK";
  if (normalized.includes("SLAG") || normalized.includes("RANGE") || normalized.includes("PUTT")) return "SLAG";
  if (normalized.includes("SPILL") || normalized.includes("BANE") || normalized.includes("SCRAMBLE")) return "SPILL";
  if (normalized.includes("TURN")) return "TURN";
  return null;
}

function formatHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = minutes / 60;
  return hours >= 10 ? `${Math.round(hours)}t` : `${hours.toFixed(1)}t`;
}

export function VolumePyramid({
  sessions,
  title = "Volum-fordeling · 90 dager",
  subtitle,
  className,
}: VolumePyramidProps) {
  const data = useMemo(() => {
    const minutesByLevel = new Map<PyramideLevel, number>();
    LEVEL_ORDER.forEach((l) => minutesByLevel.set(l, 0));

    for (const s of sessions) {
      const level = focusAreaToLevel(s.focusArea);
      if (!level) continue;
      const mins = s.durationMinutes ?? 0;
      minutesByLevel.set(level, (minutesByLevel.get(level) ?? 0) + mins);
    }

    const maxMinutes = Math.max(...Array.from(minutesByLevel.values()), 1);

    return LEVEL_ORDER.map((level) => {
      const minutes = minutesByLevel.get(level) ?? 0;
      return {
        level,
        percent: Math.round((minutes / maxMinutes) * 100),
        value: formatHours(minutes),
      };
    });
  }, [sessions]);

  return (
    <AKPyramide
      data={data}
      readOnly
      title={title}
      subtitle={subtitle}
      className={className}
    />
  );
}
