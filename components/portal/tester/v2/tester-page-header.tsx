interface TesterPageHeaderProps {
  completedTests: number;
  totalTests: number;
}

export function TesterPageHeader({
  completedTests,
  totalTests,
}: TesterPageHeaderProps) {
  return (
    <div className="mb-6">
      <div
        className="font-mono uppercase mb-2"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: "#D1F843",
        }}
      >
        / TESTER · KARTLEGGING
      </div>
      <h1
        style={{
          fontFamily: "'Inter Tight', Inter, sans-serif",
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#fff",
          lineHeight: 1.05,
          margin: 0,
        }}
      >
        Hvor god er kroppen og swingen?
      </h1>
      <p
        className="mt-3 max-w-2xl"
        style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}
      >
        Standardiserte tester for å måle fremgang. Resultatene styrer
        treningsplanen — treneren din ser samme tall.{" "}
        <span style={{ color: "#fff", fontWeight: 700 }}>{completedTests}</span> av{" "}
        <span style={{ color: "#fff", fontWeight: 700 }}>{totalTests}</span> tester
        gjennomført.
      </p>
    </div>
  );
}
