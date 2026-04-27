type Props = {
  label: string;
  barPct: number;
  /** Hva som vises til høyre (kan være "40%" eller "36%") */
  value: string;
  /** Custom labelfarge (NPS-kategorier) */
  labelColor?: string;
  /** Custom bar-farge (NPS) */
  barColor?: string;
};

export function BarRow({ label, barPct, value, labelColor, barColor }: Props) {
  const fill = barColor
    ? barColor
    : "linear-gradient(90deg, rgba(209,248,67,0.50), #D1F843)";
  return (
    <div
      className="grid items-center gap-2.5 py-1.5"
      style={{ gridTemplateColumns: "80px 1fr 50px" }}
    >
      <div
        className="font-mono text-[10px] tracking-[0.04em]"
        style={{ color: labelColor ?? "rgba(255,255,255,0.65)" }}
      >
        {label}
      </div>
      <div
        className="relative h-3.5 overflow-hidden rounded-[3px]"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <span
          className="block h-full"
          style={{
            width: `${barPct}%`,
            background: fill,
          }}
        />
      </div>
      <div className="text-right font-mono text-[11px] font-bold text-white tabular-nums">
        {value}
      </div>
    </div>
  );
}
