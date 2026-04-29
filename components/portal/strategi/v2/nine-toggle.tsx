"use client";

interface NineToggleProps {
  value: "front" | "back";
  onChange: (v: "front" | "back") => void;
  hasBackNine: boolean;
}

export function NineToggle({ value, onChange, hasBackNine }: NineToggleProps) {
  return (
    <div
      className="inline-flex p-1 rounded-[10px]"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("front")}
        className="px-4 py-1.5 rounded-lg text-xs font-semibold transition"
        style={{
          background:
            value === "front" ? "rgba(209,248,67,0.18)" : "transparent",
          color: value === "front" ? "#D1F843" : "rgba(255,255,255,0.6)",
          border: "none",
          cursor: "pointer",
        }}
      >
        Front 9
      </button>
      <button
        type="button"
        onClick={() => onChange("back")}
        disabled={!hasBackNine}
        className="px-4 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40"
        style={{
          background:
            value === "back" ? "rgba(209,248,67,0.18)" : "transparent",
          color: value === "back" ? "#D1F843" : "rgba(255,255,255,0.6)",
          border: "none",
          cursor: hasBackNine ? "pointer" : "not-allowed",
        }}
      >
        Back 9
      </button>
    </div>
  );
}
