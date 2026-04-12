export default function CoachingHistorikkLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-portal-hover rounded" />
        <div className="h-4 w-32 bg-portal-hover rounded mt-2" />
      </div>

      {/* Session cards */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-portal-border p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2">
                <div className="h-5 w-44 bg-portal-hover rounded" />
                <div className="h-3 w-28 bg-portal-hover rounded" />
              </div>
              <div className="h-6 w-16 bg-portal-hover rounded-full" />
            </div>
            <div className="h-3 w-full bg-portal-hover rounded mb-2" />
            <div className="h-3 w-2/3 bg-portal-hover rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
