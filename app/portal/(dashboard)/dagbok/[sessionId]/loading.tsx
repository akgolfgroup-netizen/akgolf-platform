export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-surface-variant rounded" />
        <div className="h-4 w-32 bg-surface-container rounded mt-2" />
      </div>
      <div className="bg-surface-container-lowest rounded-[20px] border border-outline-variant/30 p-5">
        <div className="h-4 w-32 bg-surface-variant rounded mb-4" />
        <div className="h-40 bg-surface-container rounded-lg" />
      </div>
    </div>
  );
}
