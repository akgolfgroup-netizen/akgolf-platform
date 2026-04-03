export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[var(--color-grey-200)] border-t-[var(--color-grey-900)] rounded-full animate-spin" />
        <p className="text-[var(--color-grey-500)] text-sm">Laster...</p>
      </div>
    </div>
  );
}
