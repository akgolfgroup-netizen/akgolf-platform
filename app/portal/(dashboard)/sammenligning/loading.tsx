export default function SammenligningLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-surface-container rounded" />
        <div className="h-4 w-32 bg-surface-container rounded mt-2" />
      </div>

      {/* Main card */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 p-5">
        <div className="h-4 w-32 bg-surface-container rounded mb-4" />
        <div className="h-40 bg-surface-container rounded-lg" />
      </div>
    </div>
  );
}
