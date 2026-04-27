"use client";

interface EmptyStateProps {
  userName: string | null;
}

export function MinPlanEmptyState({ userName }: EmptyStateProps) {
  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6 pb-12">
      <div>
        <div
          className="font-mono text-[11px] font-semibold uppercase"
          style={{ color: "#D1F843", letterSpacing: "0.16em" }}
        >
          Spill · Min plan
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface">
          Min plan
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Hei{userName ? `, ${userName}` : ""} — coachen din har ikke laget en
          prognose ennå.
        </p>
      </div>
      <div
        className="rounded-2xl p-10 text-center"
        style={{
          background: "#0D2E23",
          border: "1px solid #1A4A3A",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        <p className="mx-auto max-w-md text-sm">
          Når coachen din lager en prognose, ser du målet ditt, anslått
          tidsbruk og sannsynligheten for å nå det her.
        </p>
      </div>
    </div>
  );
}
