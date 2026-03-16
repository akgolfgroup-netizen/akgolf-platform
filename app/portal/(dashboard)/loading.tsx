export default function DashboardLoading() {
  return (
    <div className="p-6 max-w-4xl animate-pulse">
      <div className="h-8 w-48 bg-[var(--color-muted)] rounded-lg mb-2" />
      <div className="h-4 w-64 bg-[var(--color-muted)] rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[var(--color-muted)] border border-[var(--color-border)] rounded-2xl p-5 h-28"
          />
        ))}
      </div>
    </div>
  );
}
