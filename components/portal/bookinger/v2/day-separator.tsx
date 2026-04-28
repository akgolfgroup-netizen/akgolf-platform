"use client";

interface DaySeparatorProps {
  label: string;
  count?: number;
  suffix?: string;
}

export function DaySeparator({ label, count, suffix }: DaySeparatorProps) {
  let text = label;
  if (typeof count === "number") {
    text += ` · ${count} booking${count === 1 ? "" : "er"}`;
  }
  if (suffix) {
    text += ` · ${suffix}`;
  }
  return (
    <div
      className="flex items-center gap-3.5"
      style={{
        margin: "22px 0 12px",
        color: "rgba(255,255,255,0.5)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ flex: 1, height: 1, background: "#1a4a3a" }} />
      <span>{text}</span>
      <span style={{ flex: 1, height: 1, background: "#1a4a3a" }} />
    </div>
  );
}
