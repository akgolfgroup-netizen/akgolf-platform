import type { MissionSummary } from "./types";

type SummaryItem = {
  label: string;
  value: string;
  highlight?: boolean;
};

export function MissionSummaryRow({ summary }: { summary: MissionSummary }) {
  const items: SummaryItem[] = [
    { label: "Aktive oppdrag", value: String(summary.active) },
    {
      label: "Snitt fremdrift",
      value: summary.averageProgress,
      highlight: true,
    },
    { label: "Innen frist (30d)", value: String(summary.withinDeadline) },
    { label: "Lukket Q1 2026", value: String(summary.closedQ1) },
  ];

  return (
    <div className="mb-[22px] grid grid-cols-2 gap-3.5 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] p-4"
        >
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
            {item.label}
          </div>
          <div
            className={`mt-1 font-mono text-[28px] font-bold leading-none tracking-[-0.025em] tabular-nums ${
              item.highlight ? "text-accent" : "text-white"
            }`}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
