export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-[var(--color-grey-200)] rounded" />
        <div className="h-4 w-32 bg-[var(--color-grey-100)] rounded mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5"
          >
            <div className="h-3 w-20 bg-[var(--color-grey-100)] rounded mb-3" />
            <div className="h-8 w-16 bg-[var(--color-grey-200)] rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5">
        <div className="h-4 w-32 bg-[var(--color-grey-200)] rounded mb-4" />
        <div className="h-40 bg-[var(--color-grey-100)] rounded-lg" />
      </div>
    </div>
  );
}
