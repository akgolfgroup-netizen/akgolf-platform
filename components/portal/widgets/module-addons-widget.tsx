"use client";




import { Icon } from "@/components/ui/icon";
/**
 * ModuleAddonsWidget — viser tilgjengelige moduler og aktive abonnement.
 *
 * Data-kilde: AppModule + AppSubscription
 * Brukes på: PB03 (Apper), PB04 (Abonnement), N20
 */
export function ModuleAddonsWidget() {
  // TODO: Koble til reelle data via server action
  const modules = [
    {
      id: "trackman",
      name: "TrackMan",
      description: "Avansert slaganalyse",
      price: 299,
      active: true,
    },
    {
      id: "decade",
      name: "DECADE",
      description: "Kurs- og test-system",
      price: 199,
      active: true,
    },
    {
      id: "ai-coach",
      name: "AI-coach Pro",
      description: "Ubegrenset AI-sparring",
      price: 149,
      active: false,
    },
  ];

  const activeCount = modules.filter((m) => m.active).length;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted">
          {activeCount} av {modules.length} aktive
        </span>
        <span className="text-[10px] text-muted">per måned</span>
      </div>

      {modules.map((mod) => (
        <div
          key={mod.id}
          className="flex items-center justify-between py-2 px-3 rounded-xl border border-outline-variant/20 bg-surface"
        >
          <div className="flex items-center gap-3">
            {mod.active ? (
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                <Icon name="check" className="w-3.5 h-3.5 text-success" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center">
                <Icon name="open_in_new" className="w-3 h-3 text-on-surface-variant" />
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-text">{mod.name}</p>
              <p className="text-[10px] text-muted">{mod.description}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold text-text">{mod.price},-</p>
            <p className="text-[10px] text-muted">NOK/mnd</p>
          </div>
        </div>
      ))}

      <button className="w-full py-2 rounded-lg text-xs font-medium text-primary bg-primary-soft hover:bg-primary/10 transition-colors">
        Administrer moduler
      </button>
    </div>
  );
}
