export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[20px] border border-[var(--color-surface-container)] p-4 text-center"
          >
            <div className="h-8 w-16 bg-[var(--color-surface-container)] rounded mx-auto mb-2" />
            <div className="h-3 w-12 bg-[var(--color-surface-container-lowest)] rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Next session + actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest rounded-[20px] border border-[var(--color-surface-container)] p-5">
          <div className="h-3 w-24 bg-[var(--color-surface-container)] rounded mb-4" />
          <div className="h-6 w-48 bg-[var(--color-surface-container)] rounded mb-2" />
          <div className="h-4 w-32 bg-[var(--color-surface-container-lowest)] rounded" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-14 bg-[var(--color-surface-container)] rounded-[20px]" />
          <div className="h-14 bg-[var(--color-surface-container-lowest)] rounded-[20px]" />
        </div>
      </div>

      {/* Coach insight */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-[20px] p-5">
        <div className="h-4 w-28 bg-[var(--color-surface-container)] rounded mb-3" />
        <div className="h-3 w-3/4 bg-[var(--color-surface-container)] rounded" />
      </div>
    </div>
  );
}
