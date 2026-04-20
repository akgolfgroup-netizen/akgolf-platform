export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-surface-variant rounded" />
        <div className="h-4 w-32 bg-surface rounded mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5"
          >
            <div className="h-3 w-20 bg-surface rounded mb-3" />
            <div className="h-8 w-16 bg-surface-variant rounded" />
          </div>
        ))}
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
        <div className="h-4 w-32 bg-surface-variant rounded mb-4" />
        <div className="h-40 bg-surface rounded-lg" />
      </div>
    </div>
  );
}
