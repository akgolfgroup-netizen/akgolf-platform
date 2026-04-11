export default function Loading() {
  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--color-background-beige)]">
      {/* Venstre — hero skeleton */}
      <aside
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-alt) 100%)",
        }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 h-1"
          style={{ background: "var(--color-accent-cta)" }}
        />
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-14 w-14 rounded-lg bg-white/10" />
            <div className="h-7 w-32 rounded-full bg-white/10" />
          </div>
          <div className="space-y-5">
            <div className="h-3 w-40 rounded bg-white/20" />
            <div className="h-14 w-72 rounded bg-white/15" />
            <div className="h-14 w-56 rounded bg-white/15" />
            <div className="h-4 w-full max-w-md rounded bg-white/10 mt-6" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
          </div>
          <div className="h-3 w-32 rounded bg-white/10" />
        </div>
      </aside>

      {/* Hoyre — form skeleton */}
      <section className="flex-1 flex items-center justify-center px-5 py-12 lg:px-12 lg:py-16">
        <div className="w-full max-w-[440px] animate-pulse">
          <div className="flex lg:hidden justify-center mb-8">
            <div className="h-11 w-11 rounded-lg bg-[var(--color-primary-soft)]" />
          </div>
          <div className="mb-8 space-y-3">
            <div className="h-8 w-64 rounded bg-[var(--color-primary-soft)]" />
            <div className="h-4 w-48 rounded bg-[var(--color-primary-soft)]" />
          </div>
          <div className="bg-white rounded-[24px] border border-black/5 p-6 lg:p-8 space-y-5">
            <div className="h-11 rounded-xl bg-[var(--color-primary-soft)]" />
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-[var(--color-primary-soft)]" />
              <div className="h-11 rounded-xl bg-[var(--color-primary-soft)]" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-[var(--color-primary-soft)]" />
              <div className="h-11 rounded-xl bg-[var(--color-primary-soft)]" />
            </div>
            <div className="h-12 rounded-xl bg-[var(--color-primary)]/20" />
          </div>
          <div className="mt-8 flex justify-center">
            <div className="h-4 w-48 rounded bg-[var(--color-primary-soft)]" />
          </div>
        </div>
      </section>
    </main>
  );
}
