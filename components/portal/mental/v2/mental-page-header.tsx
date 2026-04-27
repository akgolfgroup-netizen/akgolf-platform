import Link from "next/link";
import { Plus } from "lucide-react";

export function MentalPageHeader() {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
      <div>
        <div
          className="font-mono uppercase mb-2"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: "#D4AAF7",
          }}
        >
          / MENTALT · IZOF + ROUTINE
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
          Spill med roen din.
        </h1>
        <p
          className="mt-3 max-w-2xl"
          style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}
        >
          IZOF (Individual Zone of Optimal Functioning), pre-shot routine og en
          privat journal. Treneren din ser kun det du eksplisitt deler.
        </p>
      </div>
      <Link
        href="/portal/mental/ny"
        className="inline-flex items-center gap-2 transition"
        style={{
          padding: "12px 20px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 700,
          background: "#D1F843",
          color: "#0A1F18",
          border: "1px solid #D1F843",
        }}
      >
        <Plus className="w-4 h-4" /> Ny runde
      </Link>
    </div>
  );
}
