"use client";

interface MentalTabsProps {
  value: "runder" | "trends";
  onChange: (v: "runder" | "trends") => void;
}

const TABS = [
  { id: "runder" as const, label: "Runder" },
  { id: "trends" as const, label: "Trender" },
];

export function MentalTabs({ value, onChange }: MentalTabsProps) {
  return (
    <div
      className="inline-flex p-1 rounded-[10px] mb-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {TABS.map((t) => {
        const isActive = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="px-5 py-1.5 rounded-md text-xs font-semibold transition"
            style={{
              background: isActive ? "rgba(209,248,67,0.18)" : "transparent",
              color: isActive ? "#D1F843" : "rgba(255,255,255,0.6)",
              border: "none",
              letterSpacing: "0.04em",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
