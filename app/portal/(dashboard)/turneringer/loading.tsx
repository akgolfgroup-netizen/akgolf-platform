export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-portal-hover rounded" />
        <div className="h-4 w-32 bg-portal-hover rounded mt-2" />
      </div>
      <div className="flex gap-1 p-1 rounded-xl bg-portal-hover w-fit">
        <div className="h-9 w-36 bg-portal-bg rounded-lg" />
        <div className="h-9 w-36 bg-transparent rounded-lg" />
        <div className="h-9 w-24 bg-transparent rounded-lg" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-portal-border p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex gap-2">
                  <div className="h-4 w-16 bg-portal-hover rounded-full" />
                  <div className="h-4 w-20 bg-portal-hover rounded-full" />
                </div>
                <div className="h-4 w-48 bg-portal-hover rounded" />
                <div className="h-3 w-32 bg-portal-hover rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
