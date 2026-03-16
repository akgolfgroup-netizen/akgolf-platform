import type { PeriodBand } from "@/app/portal/(dashboard)/kalender/actions";

const THEME = {
  gold: "#B8975C",
  textSecondary: "#64748B",
  textTertiary: "#9CA3AF",
  bg: "#FAFBFC",
  border: "#EBE5DA",
};

const PERIOD_LABELS: Record<string, string> = {
  grunnperiode: "Grunnperiode",
  spesialiseringsperiode: "Spesialisering",
  turneringsperiode: "Turnering",
};

interface PeriodizationBandProps {
  bands: PeriodBand[];
  year: number;
}

export function PeriodizationBand({ bands, year }: PeriodizationBandProps) {
  if (bands.length === 0) return null;

  const yearStart = new Date(year, 0, 1).getTime();
  const yearEnd = new Date(year, 11, 31, 23, 59, 59).getTime();
  const yearDuration = yearEnd - yearStart;

  function toPercent(date: Date) {
    return ((date.getTime() - yearStart) / yearDuration) * 100;
  }

  return (
    <div className="mb-6">
      <p 
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: THEME.gold }}
      >
        Periodisering {year}
      </p>
      <div 
        className="relative h-8 rounded-xl overflow-hidden border"
        style={{ 
          background: THEME.bg,
          borderColor: THEME.border,
        }}
      >
        {bands.map((band, i) => {
          const left = Math.max(0, toPercent(new Date(band.startDate)));
          const right = Math.min(100, toPercent(new Date(band.endDate)));
          const width = right - left;
          if (width <= 0) return null;

          return (
            <div
              key={i}
              className="absolute top-0 bottom-0 flex items-center justify-center"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: `${band.color}20`,
                borderLeft: `3px solid ${band.color}`,
              }}
            >
              {width > 12 && (
                <span
                  className="text-[10px] font-semibold px-1 truncate"
                  style={{ color: band.color }}
                >
                  {PERIOD_LABELS[band.periodType] ?? band.periodType}
                </span>
              )}
            </div>
          );
        })}

        {/* Month markers */}
        {Array.from({ length: 11 }, (_, i) => {
          const monthDate = new Date(year, i + 1, 1);
          const pct = toPercent(monthDate);
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l"
              style={{ 
                left: `${pct}%`,
                borderColor: `${THEME.border}`,
                opacity: 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Month labels */}
      <div className="relative h-5 mt-1">
        {["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"].map((m, i) => {
          const pct = toPercent(new Date(year, i, 1));
          return (
            <span
              key={m}
              className="absolute text-[10px] transform -translate-x-1/2"
              style={{ 
                left: `${pct}%`,
                color: THEME.textTertiary,
              }}
            >
              {m}
            </span>
          );
        })}
      </div>
    </div>
  );
}
