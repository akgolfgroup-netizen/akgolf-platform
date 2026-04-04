"use client";

interface SGCategory {
  label: string;
  value: number | null;
}

interface SGOverviewCardProps {
  categories?: SGCategory[];
}

const defaultCategories: SGCategory[] = [
  { label: "OTT", value: null },
  { label: "APP", value: null },
  { label: "ATG", value: null },
  { label: "PUT", value: null },
];

export function SGOverviewCard({ categories = defaultCategories }: SGOverviewCardProps) {
  return (
    <div className="bg-white border border-[#E8E8ED] rounded-[14px] p-5">
      <h3 className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium mb-4">
        Strokes Gained
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.label}>
            <span className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">
              {cat.label}
            </span>
            <div className="mt-1">
              {cat.value !== null ? (
                <span className={`text-lg font-bold tabular-nums ${cat.value >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}>
                  {cat.value > 0 ? "+" : ""}{cat.value.toFixed(1)}
                </span>
              ) : (
                <span className="text-lg font-bold text-[#D2D2D7]">&mdash;</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
