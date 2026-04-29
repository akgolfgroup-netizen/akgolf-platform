/**
 * Globalt root loading-fallback (Suspense-boundary).
 * Vises mens RSC-payload laster for forsiden.
 *
 * Brand Guide V2.0 — surface-bg + lime accent puls.
 */
export default function RootLoading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--color-surface, #F4F6F4)" }}
      role="status"
      aria-label="Laster siden"
    >
      <div className="flex items-center gap-2.5">
        <span
          className="grid h-9 w-9 place-items-center rounded-lg font-bold text-[14px] tracking-tight"
          style={{
            background: "var(--color-accent, #D1F843)",
            color: "var(--color-ink, #0A1F18)",
          }}
        >
          AK
        </span>
        <span
          className="font-bold tracking-tight"
          style={{
            color: "var(--color-ink, #0A1F18)",
            fontFamily: "var(--font-inter-tight), Inter, sans-serif",
            fontSize: "16px",
          }}
        >
          AK Golf
        </span>
      </div>
      <div className="flex gap-1.5">
        <span
          className="block h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ background: "var(--color-accent, #D1F843)", animationDelay: "0ms" }}
        />
        <span
          className="block h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ background: "var(--color-accent, #D1F843)", animationDelay: "150ms" }}
        />
        <span
          className="block h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ background: "var(--color-accent, #D1F843)", animationDelay: "300ms" }}
        />
      </div>
      <span className="sr-only">Laster...</span>
    </div>
  );
}
