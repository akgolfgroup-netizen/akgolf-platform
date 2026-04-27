interface SectionHeadingProps {
  title: string;
  sub?: React.ReactNode;
}

export function SectionHeading({ title, sub }: SectionHeadingProps) {
  return (
    <div
      className="flex justify-between items-end mb-4"
      style={{ marginTop: 32 }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>
      {sub ? (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}
