import { Loader2, MapPin, Flag } from "lucide-react";

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-16 gap-2">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#D1F843" }} />
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{label}</span>
    </div>
  );
}

export function EmptyCourses() {
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
          background: "rgba(209,248,67,0.15)",
          color: "#D1F843",
        }}
      >
        <MapPin className="w-7 h-7" />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
        Ingen baner enda
      </h3>
      <p
        className="mt-2"
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.6)",
          maxWidth: 360,
          margin: "8px auto 0",
        }}
      >
        Det finnes ingen baner i databasen. Kontakt administrator for å legge til.
      </p>
    </div>
  );
}

export function EmptyHoles() {
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
          background: "rgba(209,248,67,0.15)",
          color: "#D1F843",
        }}
      >
        <Flag className="w-7 h-7" />
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
        Ingen hull registrert
      </p>
    </div>
  );
}

export function NineTotal({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {label}
      <b
        style={{
          display: "block",
          marginTop: 2,
          fontSize: 16,
          color: "#fff",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </b>
    </div>
  );
}
