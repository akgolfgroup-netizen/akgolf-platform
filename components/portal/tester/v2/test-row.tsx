import type { TestOverviewData } from "@/app/portal/(dashboard)/tester/actions";

interface TestRowProps {
  test: TestOverviewData;
  onClick: () => void;
}

export function TestRow({ test, onClick }: TestRowProps) {
  const hasResult = test.userBest !== null;
  const passed = test.userBest?.passed;
  // Bar fill: if passed -> 80%, if not -> 40%, none -> 0
  const fill = !hasResult ? 0 : passed ? 84 : 40;
  const fillColor = !hasResult ? "rgba(255,255,255,0.15)" : passed ? "#D1F843" : "#E8B967";
  const status = !hasResult ? "Ikke tatt" : passed ? "Bestått" : "Ikke bestått";
  const statusColor = !hasResult
    ? "rgba(255,255,255,0.45)"
    : passed
    ? "#6FCBA1"
    : "#E8B967";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left grid items-center gap-3.5 rounded-[10px] transition"
      style={{
        gridTemplateColumns: "1fr auto 80px 80px",
        padding: "12px 14px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        fontSize: 12.5,
      }}
    >
      <div>
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {test.name}
        </div>
        {test.description ? (
          <small
            style={{
              display: "block",
              fontSize: 10.5,
              color: "rgba(255,255,255,0.45)",
              marginTop: 2,
              fontWeight: 400,
            }}
          >
            {test.description}
          </small>
        ) : null}
      </div>
      <div
        style={{
          width: 80,
          height: 6,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${fill}%`,
            background: fillColor,
            borderRadius: "inherit",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: "#fff",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          textAlign: "right",
          fontSize: 12.5,
        }}
      >
        {test.userBest
          ? `${test.userBest.value} ${test.unit}`
          : "—"}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          textAlign: "right",
          fontWeight: 700,
          color: statusColor,
        }}
      >
        {status}
      </div>
    </button>
  );
}
