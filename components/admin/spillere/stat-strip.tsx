interface StatStripItem {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "danger" | "accent";
}

const TONE_COLOR: Record<NonNullable<StatStripItem["tone"]>, string> = {
  default: "#FFFFFF",
  success: "#6FCBA1",
  warning: "#E8B967",
  danger: "#F49283",
  accent: "#D1F843",
};

export function StatStrip({ items }: { items: StatStripItem[] }) {
  return (
    <div className="mb-[18px] grid grid-cols-5 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[10px] border border-[#1a4a3a] bg-[#0D2E23] px-[14px] py-3"
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            {item.label}
          </div>
          <div
            className="mt-1 text-[22px] font-bold leading-none tracking-[-0.02em] tabular-nums"
            style={{ color: TONE_COLOR[item.tone ?? "default"] }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
