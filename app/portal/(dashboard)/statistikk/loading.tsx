export default function StatistikkLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-[var(--color-portal-hover)] rounded" />
        <div className="h-4 w-32 bg-[var(--color-portal-card)] rounded mt-2" />
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] border border-[var(--color-portal-hover)] p-5"
          >
            <div className="h-3 w-20 bg-[var(--color-portal-card)] rounded mb-3" />
            <div className="h-8 w-16 bg-[var(--color-portal-hover)] rounded mb-1" />
            <div className="h-3 w-12 bg-[var(--color-portal-card)] rounded" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="bg-white rounded-[20px] border border-[var(--color-portal-hover)] p-5">
        <div className="h-4 w-36 bg-[var(--color-portal-hover)] rounded mb-4" />
        <div className="h-64 bg-[var(--color-portal-card)] rounded-lg" />
      </div>

      {/* Secondary chart */}
      <div className="bg-white rounded-[20px] border border-[var(--color-portal-hover)] p-5">
        <div className="h-4 w-28 bg-[var(--color-portal-hover)] rounded mb-4" />
        <div className="h-48 bg-[var(--color-portal-card)] rounded-lg" />
      </div>
    </div>
  );
}
