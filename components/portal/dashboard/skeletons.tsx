export function KpiSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
      <div className="mb-3 h-2.5 w-14 rounded bg-surface-container" />
      <div className="mb-4 h-8 w-20 rounded bg-surface-container" />
      <div className="h-6 w-full rounded bg-surface" />
    </div>
  );
}

export function BookingSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-4 h-3 w-20 rounded bg-surface-container" />
      <div className="mb-2 h-8 w-32 rounded bg-surface-container" />
      <div className="mb-6 h-4 w-40 rounded bg-surface" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-surface" />
        <div className="h-3 w-3/4 rounded bg-surface" />
      </div>
    </div>
  );
}

export function CoachInsightSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
      <div className="mb-3 h-2.5 w-24 rounded bg-surface-container" />
      <div className="mb-4 h-6 w-48 rounded bg-surface-container" />
      <div className="h-16 w-full rounded bg-surface" />
    </div>
  );
}

export function WeekRingsSkeleton() {
  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm sm:justify-center sm:gap-6 sm:p-6">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className="h-12 w-12 animate-pulse rounded-full bg-surface-container" />
          <div className="h-2 w-6 rounded bg-surface-container" />
        </div>
      ))}
    </div>
  );
}
