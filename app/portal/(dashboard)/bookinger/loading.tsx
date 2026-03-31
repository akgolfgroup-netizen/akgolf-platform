export default function BookingerLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-[var(--color-grey-200)] rounded" />
          <div className="h-4 w-32 bg-[var(--color-grey-100)] rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-[var(--color-grey-200)] rounded-full" />
      </div>

      {/* Booking list cards */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 w-40 bg-[var(--color-grey-200)] rounded" />
                <div className="h-3 w-56 bg-[var(--color-grey-100)] rounded" />
                <div className="h-3 w-32 bg-[var(--color-grey-100)] rounded" />
              </div>
              <div className="h-6 w-20 bg-[var(--color-grey-100)] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
