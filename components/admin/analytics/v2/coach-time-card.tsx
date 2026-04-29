import { COACH_TIME } from "./analytics-data";
import { BarRow } from "./bar-row";

export function CoachTimeCard() {
  return (
    <section
      className="rounded-[14px] px-6 py-[22px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-4 text-[15px] font-bold text-white">
        Coach-tid · fordeling
      </h3>
      {COACH_TIME.map((row) => (
        <BarRow
          key={row.label}
          label={row.label}
          barPct={row.barPct}
          value={`${row.valuePct}%`}
        />
      ))}
    </section>
  );
}
