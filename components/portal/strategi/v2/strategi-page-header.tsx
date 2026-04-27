interface StrategiPageHeaderProps {
  courseName?: string;
}

export function StrategiPageHeader({ courseName }: StrategiPageHeaderProps) {
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
        / STRATEGI · HULL-FOR-HULL
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
        Plan for {courseName ?? "neste runde"}{" "}
        <span style={{ color: "#D1F843" }}>·</span> hull for hull
      </h1>
      <p
        className="mt-3 max-w-2xl"
        style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}
      >
        Klubb-anbefaling, miss-side og målsone per hull. Forslag basert på din
        spillertype og banens trekk. Endre hva du vil — vi lagrer som mal til
        neste runde.
      </p>
    </div>
  );
}
