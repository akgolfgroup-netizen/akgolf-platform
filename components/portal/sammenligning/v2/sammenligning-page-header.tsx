interface SammenligningPageHeaderProps {
  eyebrow?: string;
  title?: string;
  lede?: string;
}

export function SammenligningPageHeader({
  eyebrow = "/ STATISTIKK · BENCHMARK",
  title = "Hvordan ligger du an?",
  lede = "Sammenlignet mot peer-gruppe og AK-pyramiden. Tallene oppdateres etter hver runde og økt.",
}: SammenligningPageHeaderProps) {
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
        {eyebrow}
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
        {title}
      </h1>
      <p
        className="mt-3 max-w-2xl"
        style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}
      >
        {lede}
      </p>
    </div>
  );
}
