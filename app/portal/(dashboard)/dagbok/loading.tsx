export default function DagbokLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-[var(--color-surface-container)] rounded" />
        <div className="h-4 w-32 bg-[var(--color-surface-container)] rounded mt-2" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[20px] border border-[var(--color-surface-container)] p-4 text-center"
          >
            <div className="h-8 w-12 bg-[var(--color-surface-container)] rounded mx-auto mb-2" />
            <div className="h-3 w-20 bg-[var(--color-surface-container)] rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Log entries */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[20px] border border-[var(--color-surface-container)] p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="h-4 w-32 bg-[var(--color-surface-container)] rounded" />
              <div className="h-3 w-20 bg-[var(--color-surface-container)] rounded" />
            </div>
            <div className="h-3 w-3/4 bg-[var(--color-surface-container)] rounded mb-2" />
            <div className="h-3 w-1/2 bg-[var(--color-surface-container)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
