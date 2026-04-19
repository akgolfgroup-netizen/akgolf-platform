export default function ProfilLoading() {
  return (
    <div className="mx-auto w-full max-w-[680px] space-y-6 pb-12 animate-pulse">
      {/* Profil-header */}
      <div
        className="rounded-2xl bg-[var(--color-surface-container-lowest)] p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center gap-5">
          <div className="h-24 w-24 rounded-2xl bg-[var(--color-surface-container)] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 bg-[var(--color-surface-container)] rounded-lg" />
            <div className="h-4 w-56 bg-[var(--color-surface-container)] rounded-lg" />
            <div className="flex gap-2 mt-1">
              <div className="h-6 w-16 bg-[var(--color-surface-container)] rounded-full" />
              <div className="h-6 w-14 bg-[var(--color-surface-container)] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Nøkkeltall */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[var(--color-surface-container-lowest)] p-5 text-center"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="h-3 w-14 bg-[var(--color-surface-container)] rounded mx-auto mb-2" />
            <div className="h-8 w-12 bg-[var(--color-surface-container)] rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Abonnement */}
      <div
        className="rounded-2xl bg-[var(--color-surface-container-lowest)] p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="h-3 w-20 bg-[var(--color-surface-container)] rounded mb-3" />
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[var(--color-surface-container)] rounded-xl" />
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-[var(--color-surface-container)] rounded" />
            <div className="h-3 w-16 bg-[var(--color-surface-container)] rounded" />
          </div>
        </div>
      </div>

      {/* Innstillinger */}
      <div
        className="rounded-2xl bg-[var(--color-surface-container-lowest)] p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="h-3 w-24 bg-[var(--color-surface-container)] rounded mb-3" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 bg-[var(--color-surface-container)] rounded-lg shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-20 bg-[var(--color-surface-container)] rounded" />
                <div className="h-3 w-36 bg-[var(--color-surface-container)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
