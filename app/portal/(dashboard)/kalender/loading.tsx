export default function KalenderLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-surface-container rounded" />
          <div className="h-4 w-32 bg-surface-container rounded mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-surface-container rounded-full" />
          <div className="h-10 w-10 bg-surface-container rounded-full" />
        </div>
      </div>

      {/* Month header */}
      <div className="h-6 w-36 bg-surface-container rounded mx-auto" />

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="h-4 w-8 bg-surface-container rounded mx-auto"
          />
        ))}
      </div>

      {/* 6x7 calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(42)].map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant p-3 aspect-square"
          >
            <div className="h-4 w-6 bg-surface-container rounded mb-2" />
            {i % 5 === 0 && (
              <div className="h-2 w-full bg-surface-container rounded" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
