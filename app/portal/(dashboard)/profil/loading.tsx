export default function ProfilLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-[var(--color-grey-200)] rounded" />
        <div className="h-4 w-32 bg-[var(--color-grey-100)] rounded mt-2" />
      </div>

      {/* Avatar + info */}
      <div className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 bg-[var(--color-grey-200)] rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-40 bg-[var(--color-grey-200)] rounded" />
            <div className="h-4 w-56 bg-[var(--color-grey-100)] rounded" />
            <div className="h-3 w-24 bg-[var(--color-grey-100)] rounded" />
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-4 text-center"
          >
            <div className="h-8 w-14 bg-[var(--color-grey-200)] rounded mx-auto mb-2" />
            <div className="h-3 w-16 bg-[var(--color-grey-100)] rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Goals */}
      <div className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5">
        <div className="h-4 w-20 bg-[var(--color-grey-200)] rounded mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 bg-[var(--color-grey-100)] rounded-full shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-[var(--color-grey-100)] rounded mb-1" />
                <div className="h-2 w-full bg-[var(--color-grey-100)] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
