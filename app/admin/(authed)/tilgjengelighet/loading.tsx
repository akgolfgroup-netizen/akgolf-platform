export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-outline-variant rounded" />
        <div className="h-4 w-32 bg-surface-container rounded mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[20px] border border-outline-variant p-5"
          >
            <div className="h-3 w-20 bg-surface-container rounded mb-3" />
            <div className="h-8 w-16 bg-outline-variant rounded" />
          </div>
        ))}
      </div>
      <div className="bg-surface-container-lowest rounded-[20px] border border-outline-variant p-5">
        <div className="h-4 w-32 bg-outline-variant rounded mb-4" />
        <div className="h-40 bg-surface-container rounded-lg" />
      </div>
    </div>
  );
}
