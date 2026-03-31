export default function DagbokLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-[var(--color-grey-200)] rounded" />
        <div className="h-4 w-32 bg-[var(--color-grey-100)] rounded mt-2" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-4 text-center"
          >
            <div className="h-8 w-12 bg-[var(--color-grey-200)] rounded mx-auto mb-2" />
            <div className="h-3 w-20 bg-[var(--color-grey-100)] rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Log entries */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="h-4 w-32 bg-[var(--color-grey-200)] rounded" />
              <div className="h-3 w-20 bg-[var(--color-grey-100)] rounded" />
            </div>
            <div className="h-3 w-3/4 bg-[var(--color-grey-100)] rounded mb-2" />
            <div className="h-3 w-1/2 bg-[var(--color-grey-100)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
