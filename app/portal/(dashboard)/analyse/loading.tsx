export default function AnalyseLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-portal-hover rounded" />
        <div className="h-4 w-32 bg-portal-hover rounded mt-2" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-portal-border p-5"
          >
            <div className="h-3 w-20 bg-portal-hover rounded mb-3" />
            <div className="h-8 w-16 bg-portal-hover rounded" />
          </div>
        ))}
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-portal-border p-5">
          <div className="h-4 w-32 bg-portal-hover rounded mb-4" />
          <div className="h-56 bg-portal-hover rounded-lg" />
        </div>
        <div className="bg-white rounded-xl border border-portal-border p-5">
          <div className="h-4 w-28 bg-portal-hover rounded mb-4" />
          <div className="h-56 bg-portal-hover rounded-lg" />
        </div>
      </div>

      {/* AI insight card */}
      <div className="bg-portal-hover rounded-xl p-5">
        <div className="h-4 w-28 bg-portal-bg rounded mb-3" />
        <div className="h-3 w-3/4 bg-portal-bg rounded mb-2" />
        <div className="h-3 w-1/2 bg-portal-bg rounded" />
      </div>
    </div>
  );
}
