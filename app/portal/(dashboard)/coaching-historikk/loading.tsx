export default function CoachingHistorikkLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-[var(--color-grey-200)] rounded" />
        <div className="h-4 w-32 bg-[var(--color-grey-100)] rounded mt-2" />
      </div>

      {/* Session cards */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2">
                <div className="h-5 w-44 bg-[var(--color-grey-200)] rounded" />
                <div className="h-3 w-28 bg-[var(--color-grey-100)] rounded" />
              </div>
              <div className="h-6 w-16 bg-[var(--color-grey-100)] rounded-full" />
            </div>
            <div className="h-3 w-full bg-[var(--color-grey-100)] rounded mb-2" />
            <div className="h-3 w-2/3 bg-[var(--color-grey-100)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
