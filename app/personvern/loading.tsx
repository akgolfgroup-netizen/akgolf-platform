export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-outline-variant border-t-on-surface rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm">Laster...</p>
      </div>
    </div>
  );
}
