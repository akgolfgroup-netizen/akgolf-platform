export default function CoachDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-[var(--color-grey-200)] rounded" />
        <div className="h-4 w-32 bg-[var(--color-grey-100)] rounded mt-2" />
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5"
          >
            <div className="h-3 w-20 bg-[var(--color-grey-100)] rounded mb-3" />
            <div className="h-8 w-16 bg-[var(--color-grey-200)] rounded mb-1" />
            <div className="h-3 w-12 bg-[var(--color-grey-100)] rounded" />
          </div>
        ))}
      </div>

      {/* Recent list */}
      <div className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5">
        <div className="h-4 w-32 bg-[var(--color-grey-200)] rounded mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[var(--color-grey-200)] rounded-full shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-36 bg-[var(--color-grey-200)] rounded mb-1" />
                <div className="h-3 w-24 bg-[var(--color-grey-100)] rounded" />
              </div>
              <div className="h-3 w-16 bg-[var(--color-grey-100)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
