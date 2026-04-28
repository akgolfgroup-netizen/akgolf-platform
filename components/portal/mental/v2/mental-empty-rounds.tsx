import Link from "next/link";
import { Brain, Plus } from "lucide-react";

export function MentalEmptyRounds() {
  return (
    <div
      className="rounded-2xl p-10 text-center"
      style={{
        background: "#0F2E23",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="mx-auto mb-4 grid place-items-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "rgba(175,82,222,0.15)",
          color: "#D4AAF7",
        }}
      >
        <Brain className="w-7 h-7" />
      </div>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#fff",
          marginBottom: 4,
        }}
      >
        Ingen runder registrert enda
      </p>
      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.6)",
          maxWidth: 360,
          margin: "0 auto 16px",
          lineHeight: 1.55,
        }}
      >
        Start din første mental scorecard-runde for å se trender og fokusområder
        utvikle seg.
      </p>
      <Link
        href="/portal/mental/ny"
        className="inline-flex items-center gap-2"
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 700,
          background: "#D1F843",
          color: "#0A1F18",
          border: "1px solid #D1F843",
        }}
      >
        <Plus className="w-4 h-4" /> Logg første runde
      </Link>
    </div>
  );
}
