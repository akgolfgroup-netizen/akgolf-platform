"use client";

interface ReadinessMeterProps {
  score: number | null;
  onChange: (score: number) => void;
}

export function ReadinessMeter({ score, onChange }: ReadinessMeterProps) {
  const value = score ?? 5;
  const pct = (value / 10) * 100;

  const color =
    value >= 8 ? "#22C55E" : value >= 5 ? "#F59E0B" : "#EF4444";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[var(--color-gold-muted)] uppercase tracking-wider">
          Beredskap
        </span>
        <span className="text-2xl font-black" style={{ color }}>
          {value}
          <span className="text-xs font-normal text-[var(--color-gold-muted)]">/10</span>
        </span>
      </div>

      <div className="relative h-3 rounded-full bg-[var(--color-border)] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>

      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full mt-2 accent-[var(--color-gold)]"
      />
    </div>
  );
}
