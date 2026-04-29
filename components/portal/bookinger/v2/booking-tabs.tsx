"use client";

export type BookingTab = "upcoming" | "completed" | "cancelled";

interface TabConfig {
  id: BookingTab;
  label: string;
  count: number;
}

interface BookingTabsProps {
  active: BookingTab;
  tabs: TabConfig[];
  onChange: (tab: BookingTab) => void;
}

export function BookingTabs({ active, tabs, onChange }: BookingTabsProps) {
  return (
    <div
      className="flex"
      style={{
        gap: 4,
        borderBottom: "1px solid #1a4a3a",
        marginBottom: 22,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="inline-flex items-center gap-2"
            style={{
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              color: isActive ? "#D1F843" : "rgba(255,255,255,0.6)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              borderBottom: isActive
                ? "2px solid #D1F843"
                : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab.label}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                background: isActive ? "#D1F843" : "rgba(255,255,255,0.08)",
                color: isActive ? "#0A1F18" : "rgba(255,255,255,0.7)",
                padding: "1px 6px",
                borderRadius: 9,
                fontWeight: 700,
              }}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
