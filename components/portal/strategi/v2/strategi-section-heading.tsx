interface StrategiSectionHeadingProps {
  title: string;
  right?: React.ReactNode;
}

export function StrategiSectionHeading({
  title,
  right,
}: StrategiSectionHeadingProps) {
  return (
    <div
      className="flex justify-between items-center mb-4"
      style={{ marginTop: 28 }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 18,
          color: "#fff",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}

export function StrategiLegend() {
  return (
    <div
      className="flex gap-3 items-center"
      style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}
    >
      <span className="flex items-center gap-1.5">
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: "#F49283",
            display: "inline-block",
          }}
        />
        Aggressiv
      </span>
      <span className="flex items-center gap-1.5">
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: "#6FCBA1",
            display: "inline-block",
          }}
        />
        Trygg
      </span>
      <span className="flex items-center gap-1.5">
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: "#E8B967",
            display: "inline-block",
          }}
        />
        Layup
      </span>
    </div>
  );
}
