"use client";

// Farger for aktivitetstyper (Brand Guide 2026 - Apple Light)
export const ACTIVITY_TYPE_COLORS: Record<string, { color: string; label: string }> = {
  TOURNAMENT_CLUB: { color: "var(--color-error)", label: "Klubbturnering" },
  TOURNAMENT_REGION: { color: "var(--color-error)", label: "Regionturnering" },
  TOURNAMENT_JUNIOR: { color: "var(--color-error)", label: "Juniorturnering" },
  VTG_COURSE: { color: "var(--color-warning)", label: "VTG-kurs" },
  GFGK_JUNIOR: { color: "var(--color-primary)", label: "GFGK Junior" },
  AK_GOLF: { color: "var(--color-info)", label: "AK Golf" },
  AK_GOLF_JUNIOR_ACADEMY: { color: "var(--color-info)", label: "AK Golf Junior Academy" },
  SPONSOR_EVENT: { color: "var(--color-ai)", label: "Sponsorevent" },
  INTERNAL: { color: "var(--color-grey-400)", label: "Internt" },
  CLOSURE: { color: "var(--color-black)", label: "Stengt" },
  OTHER: { color: "var(--color-grey-400)", label: "Annet" },
  BOOKING: { color: "var(--color-grey-400)", label: "Booking" },
};

export function FacilityLegend() {
  const items = Object.entries(ACTIVITY_TYPE_COLORS).filter(
    ([key]) => key !== "BOOKING"
  );

  return (
    <div className="flex flex-wrap gap-3">
      {items.map(([key, { color, label }]) => (
        <div key={key} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-[var(--color-grey-600)]">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function FacilityLegendCompact() {
  const items = [
    { color: "var(--color-error)", label: "Turnering" },
    { color: "var(--color-warning)", label: "VTG" },
    { color: "var(--color-primary)", label: "GFGK Junior" },
    { color: "var(--color-info)", label: "AK Golf" },
    { color: "var(--color-grey-400)", label: "Booking" },
    { color: "var(--color-black)", label: "Stengt" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[10px] text-[var(--color-grey-500)]">{label}</span>
        </div>
      ))}
    </div>
  );
}
