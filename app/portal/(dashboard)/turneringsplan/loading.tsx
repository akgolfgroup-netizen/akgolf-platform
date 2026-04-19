export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-12 pt-8">
      <div className="mb-8 animate-pulse">
        <div className="h-3 w-16 rounded bg-[var(--color-surface-container)]" />
        <div className="mt-2 h-8 w-48 rounded bg-[var(--color-surface-container)]" />
      </div>
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-[var(--color-surface-container-lowest)] p-5"
          >
            <div className="flex flex-col items-center py-2">
              <div className="h-2 w-12 rounded bg-[var(--color-surface-container)]" />
              <div className="mt-3 h-8 w-10 rounded bg-[var(--color-surface-container)]" />
              <div className="mt-3 h-4 w-4 rounded bg-[var(--color-surface-container)]" />
            </div>
          </div>
        ))}
      </div>
      <div className="mb-5 h-9 w-64 animate-pulse rounded-[10px] bg-[var(--color-surface-container)]" />
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-[var(--color-surface-container-lowest)] p-5"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-[var(--color-surface-container)]" />
              <div className="flex-1">
                <div className="h-4 w-40 rounded bg-[var(--color-surface-container)]" />
                <div className="mt-2 h-3 w-64 rounded bg-[var(--color-surface-container)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
