"use client";

// Farger for aktivitetstyper (Brand Guide 2026 - Apple Light)
export const ACTIVITY_TYPE_COLORS: Record<string, { color: string; label: string }> = {
  TOURNAMENT_CLUB: { color: "#FF3B30", label: "Klubbturnering" },
  TOURNAMENT_REGION: { color: "#FF3B30", label: "Regionturnering" },
  TOURNAMENT_JUNIOR: { color: "#FF3B30", label: "Juniorturnering" },
  VTG_COURSE: { color: "#FF9500", label: "VTG-kurs" },
  GFGK_JUNIOR: { color: "#2D6A4F", label: "GFGK Junior" },
  AK_GOLF: { color: "#007AFF", label: "AK Golf" },
  AK_GOLF_JUNIOR_ACADEMY: { color: "#007AFF", label: "AK Golf Junior Academy" },
  SPONSOR_EVENT: { color: "#5856D6", label: "Sponsorevent" },
  INTERNAL: { color: "#86868B", label: "Internt" },
  CLOSURE: { color: "#1D1D1F", label: "Stengt" },
  OTHER: { color: "#86868B", label: "Annet" },
  BOOKING: { color: "#86868B", label: "Booking" },
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
    { color: "#FF3B30", label: "Turnering" },
    { color: "#FF9500", label: "VTG" },
    { color: "#2D6A4F", label: "GFGK Junior" },
    { color: "#007AFF", label: "AK Golf" },
    { color: "#86868B", label: "Booking" },
    { color: "#1D1D1F", label: "Stengt" },
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
