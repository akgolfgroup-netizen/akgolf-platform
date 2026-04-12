export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] border border-[var(--color-portal-hover)] p-4 text-center"
          >
            <div className="h-8 w-16 bg-[var(--color-portal-hover)] rounded mx-auto mb-2" />
            <div className="h-3 w-12 bg-[var(--color-portal-card)] rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Next session + actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[20px] border border-[var(--color-portal-hover)] p-5">
          <div className="h-3 w-24 bg-[var(--color-portal-hover)] rounded mb-4" />
          <div className="h-6 w-48 bg-[var(--color-portal-hover)] rounded mb-2" />
          <div className="h-4 w-32 bg-[var(--color-portal-card)] rounded" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-14 bg-[var(--color-portal-hover)] rounded-[20px]" />
          <div className="h-14 bg-[var(--color-portal-card)] rounded-[20px]" />
        </div>
      </div>

      {/* Coach insight */}
      <div className="bg-[var(--color-portal-card)] rounded-[20px] p-5">
        <div className="h-4 w-28 bg-[var(--color-portal-hover)] rounded mb-3" />
        <div className="h-3 w-3/4 bg-[var(--color-portal-hover)] rounded" />
      </div>
    </div>
  );
}
