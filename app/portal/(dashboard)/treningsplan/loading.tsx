export default function TreningsplanLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-[var(--color-surface-container)] rounded" />
        <div className="h-4 w-32 bg-[var(--color-surface-container-lowest)] rounded mt-2" />
      </div>

      {/* Week selector */}
      <div className="flex gap-2">
        <div className="h-10 w-24 bg-[var(--color-surface-container)] rounded-full" />
        <div className="h-10 w-24 bg-[var(--color-surface-container-lowest)] rounded-full" />
        <div className="h-10 w-24 bg-[var(--color-surface-container-lowest)] rounded-full" />
      </div>

      {/* 7 day cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[20px] border border-[var(--color-surface-container)] p-4"
          >
            <div className="h-3 w-10 bg-[var(--color-surface-container)] rounded mb-3" />
            <div className="h-4 w-full bg-[var(--color-surface-container-lowest)] rounded mb-2" />
            <div className="h-4 w-3/4 bg-[var(--color-surface-container-lowest)] rounded mb-2" />
            <div className="h-3 w-16 bg-[var(--color-surface-container)] rounded mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
