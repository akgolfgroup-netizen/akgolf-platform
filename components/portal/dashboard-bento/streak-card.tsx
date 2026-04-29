// Server Component — streak-visualisering, kun markup.
interface StreakCardProps {
  currentDays: number;
  personalBest?: number | null;
  /** Last 14 days, true = trained that day */
  last14Days?: boolean[];
}

export function StreakCard({
  currentDays,
  personalBest,
  last14Days,
}: StreakCardProps) {
  const dots = last14Days ?? Array.from({ length: 14 }, () => false);
  const daysToBeat =
    personalBest && personalBest > currentDays
      ? personalBest - currentDays
      : null;

  return (
    <div
      className="col-span-12 sm:col-span-6 lg:col-span-4 relative flex flex-col overflow-hidden rounded-[22px] p-5 text-white"
      style={{
        background: "linear-gradient(160deg, #0A1F18, #0F2E22)",
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-40px",
          right: "-40px",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(209, 248, 67, 0.18), transparent 70%)",
        }}
      />
      <div className="relative z-10">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Konsistens-streak
        </div>
        <div
          className="mt-1.5 text-[56px] font-bold leading-none tracking-[-0.04em] tabular-nums"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {currentDays}
          <span
            className="ml-1.5 text-sm font-medium tracking-normal"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            dager
          </span>
        </div>
        <div
          className="mt-2.5 text-[13px]"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          {daysToBeat !== null ? (
            <>
              Personlig rekord på <b style={{ color: "#D1F843" }}>{personalBest} dager</b>{" "}
              venter. {daysToBeat} dager igjen.
            </>
          ) : currentDays > 0 ? (
            <>Hold streaken levende — logg i dag.</>
          ) : (
            <>Logg en økt eller en runde for å starte streaken.</>
          )}
        </div>
        <div
          className="mt-4 flex gap-1"
          role="img"
          aria-label={`Aktivitet siste 14 dager: ${dots.filter(Boolean).length} av 14 dager logget`}
        >
          {dots.map((on, i) => (
            <div
              key={i}
              className="h-6 flex-1 rounded-[3px]"
              style={{
                background: on ? "#D1F843" : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
        <div
          className="mt-2 text-[10px] uppercase tracking-[0.1em]"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          — Siste 14 dager —
        </div>
      </div>
    </div>
  );
}
