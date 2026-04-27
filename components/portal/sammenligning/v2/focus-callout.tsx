import { Zap } from "lucide-react";

interface FocusCalloutProps {
  title: string;
  tag?: string;
  description: string;
}

export function FocusCallout({ title, tag, description }: FocusCalloutProps) {
  return (
    <div
      className="rounded-2xl mb-7 grid items-center gap-5"
      style={{
        gridTemplateColumns: "56px 1fr",
        padding: "24px 28px",
        background:
          "linear-gradient(160deg, rgba(209,248,67,0.06), rgba(13,46,35,0)), #0F2E23",
        border: "1px solid rgba(209,248,67,0.20)",
      }}
    >
      <div
        className="grid place-items-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "#D1F843",
          color: "#0A1F18",
        }}
      >
        <Zap className="w-7 h-7" strokeWidth={2.2} />
      </div>
      <div>
        <h4
          style={{
            margin: 0,
            marginBottom: 4,
            fontSize: 16,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
          {tag ? (
            <span
              className="ml-2"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                background: "rgba(209,248,67,0.18)",
                color: "#D1F843",
                padding: "2px 7px",
                borderRadius: 5,
                fontWeight: 700,
              }}
            >
              {tag}
            </span>
          ) : null}
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.55,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
