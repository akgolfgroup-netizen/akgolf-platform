"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  Crown,
  Check,
  Loader2,
  Settings,
  NotebookPen,
  Dumbbell,
  BarChart3,
  Users,
  Target,
  ScanSearch,
  Trophy,
} from "lucide-react";
import { PricingTable } from "@/components/portal/pricing/pricing-table";

interface AppModule {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  monthlyPriceNok: number;
}

interface AppBundle {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  monthlyPriceNok: number;
  items: { module: { slug: string; name: string } }[];
}

interface Subscription {
  id: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  module: { slug: string } | null;
  bundle: { slug: string } | null;
}

interface ApperClientProps {
  modules: AppModule[];
  bundles: AppBundle[];
  userModules: string[];
  subscriptions: Subscription[];
  hasStripeCustomer: boolean;
  currentTier: "VISITOR" | "PRO" | "ELITE";
}

const ICON_MAP: Record<string, React.ElementType> = {
  "notebook-pen": NotebookPen,
  "dumbbell": Dumbbell,
  "bar-chart-3": BarChart3,
  "users": Users,
  "target": Target,
  "scan-search": ScanSearch,
  "trophy": Trophy,
};

export function ApperClient({
  modules,
  bundles,
  userModules,
  subscriptions,
  hasStripeCustomer,
  currentTier,
}: ApperClientProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSuccess = searchParams.get("success") === "true";

  async function handlePlanSelect(
    plan: "PRO" | "ELITE",
    interval: "month" | "year"
  ) {
    setLoading(plan);
    setError(null);
    try {
      const bundleSlug =
        plan === "PRO" ? "pro-bundle" : "premium-bundle";
      const res = await fetch("/api/portal/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleSlug, interval }),
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      } else {
        setError(data.error || "Kunne ikke starte betalingsprosessen. Prøv igjen.");
        setLoading(null);
      }
    } catch {
      setError("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
      setLoading(null);
    }
  }

  async function handleCheckout(moduleSlug?: string, bundleSlug?: string) {
    const key = moduleSlug ?? bundleSlug ?? "";
    setLoading(key);
    setError(null);

    try {
      const res = await fetch("/api/portal/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, bundleSlug, interval: "month" }),
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      } else {
        setError(data.error || "Kunne ikke starte betalingsprosessen. Prøv igjen.");
        setLoading(null);
      }
    } catch {
      setError("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    setError(null);
    try {
      const res = await fetch("/api/portal/subscriptions/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      } else {
        setError(data.error || "Kunne ikke åpne abonnementportalen. Prøv igjen.");
        setLoading(null);
      }
    } catch {
      setError("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
      setLoading(null);
    }
  }

  async function handleActivateFree(moduleSlug: string) {
    setLoading(moduleSlug);
    setError(null);
    try {
      const res = await fetch("/api/portal/subscriptions/activate-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "Kunne ikke aktivere modulen. Prøv igjen.");
        setLoading(null);
      }
    } catch {
      setError("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
      setLoading(null);
    }
  }

  function isModuleActive(slug: string) {
    return userModules.includes(slug);
  }

  function isBundleActive(slug: string) {
    return subscriptions.some(
      (s) => s.bundle?.slug === slug && (s.status === "ACTIVE" || s.status === "TRIALING")
    );
  }

  return (
    <div className="space-y-10">
      {/* Success message */}
      {isSuccess && (
        <div role="alert" className="rounded-2xl p-4 border flex items-center gap-3 bg-[#22c55e]/10 border-[#22c55e]/30">
          <Check className="w-5 h-5 text-[#22c55e] flex-shrink-0" />
          <p className="text-sm text-[#22c55e] font-medium">
            Abonnementet ditt er aktivert! Din 14-dagers prøveperiode har startet.
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div role="alert" className="rounded-2xl p-4 border flex items-center gap-3 bg-[var(--color-error)]/10 border-[var(--color-error)]/30">
          <AlertCircle className="w-5 h-5 text-[var(--color-error)] flex-shrink-0" />
          <p className="text-sm text-[var(--color-error)] font-medium">{error}</p>
        </div>
      )}

      {/* Pricing Table */}
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#1c1c16] mb-2">
            Velg ditt abonnement
          </h2>
          <p className="text-[#6b7366]">
            Få tilgang til avanserte verktøy for å forbedre golfen din
          </p>
        </div>
        <PricingTable
          currentTier={currentTier}
          onSelectPlan={handlePlanSelect}
          loading={loading}
        />
      </div>

      {/* Bundles */}
      <div className="space-y-4">
        <p className="text-[11px] font-semibold text-[#8a9385] uppercase tracking-widest">
          Pakker
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bundles.map((bundle) => {
            const active = isBundleActive(bundle.slug);
            const isPremium = bundle.slug === "premium-bundle";

            return (
              <div
                key={bundle.id}
                className="rounded-2xl p-6 border relative overflow-hidden bg-white border-[#c2c9bb]/50"
              >
                {isPremium && (
                  <div className="absolute top-3 right-3">
                    <Crown className="w-5 h-5 text-[#d2f000]" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1c1c16] mb-1">
                  {bundle.name}
                </h3>
                <p className="text-xs text-[#6b7366] mb-3">
                  {bundle.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {bundle.items.map((item) => (
                    <span
                      key={item.module.slug}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-[#c2c9bb]/50 text-[#6b7366]"
                    >
                      {item.module.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[#1c1c16]">
                      {bundle.monthlyPriceNok / 100}
                    </span>
                    <span className="text-sm text-[#6b7366] ml-1">
                      kr/mnd
                    </span>
                  </div>
                  {active ? (
                    <span className="text-xs font-medium text-[#22c55e] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Aktiv
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCheckout(undefined, bundle.slug)}
                      disabled={loading !== null}
                      className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors bg-[#154212] text-white hover:bg-[#0d2e0c]"
                    >
                      {loading === bundle.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Prøv 7 dager gratis"
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual modules */}
      <div className="space-y-4">
        <p className="text-[11px] font-semibold text-[#8a9385] uppercase tracking-widest">
          Enkeltapper
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const active = isModuleActive(mod.slug);
            const Icon = ICON_MAP[mod.icon ?? ""] ?? BarChart3;

            return (
              <div
                key={mod.id}
                className="rounded-2xl p-5 border transition-colors bg-white border-[#c2c9bb]/50"
                style={{
                  borderColor: active ? "rgba(34,197,94,0.4)" : undefined,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#f7f3ea]">
                    <Icon className="w-4.5 h-4.5 text-[#154212]" />
                  </div>
                  {active && (
                    <span className="text-[10px] font-medium text-[#22c55e] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Aktiv
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-[#1c1c16] mb-1">
                  {mod.name}
                </h4>
                <p className="text-xs text-[#6b7366] mb-4 line-clamp-2">
                  {mod.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1c1c16]">
                    {mod.monthlyPriceNok === 0 ? (
                      "Gratis"
                    ) : (
                      <>
                        {mod.monthlyPriceNok / 100}
                        <span className="text-xs font-normal text-[#6b7366] ml-0.5">
                          kr/mnd
                        </span>
                      </>
                    )}
                  </span>
                  {!active && mod.monthlyPriceNok === 0 ? (
                    <button
                      onClick={() => handleActivateFree(mod.slug)}
                      disabled={loading !== null}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20"
                    >
                      {loading === mod.slug ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Aktiver"
                      )}
                    </button>
                  ) : !active ? (
                    <button
                      onClick={() => handleCheckout(mod.slug)}
                      disabled={loading !== null}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors bg-[#f7f3ea] text-[#1c1c16] hover:bg-[#e8e4db]"
                    >
                      {loading === mod.slug ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Prøv gratis"
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manage subscriptions */}
      {hasStripeCustomer && (
        <div className="pt-4">
          <button
            onClick={handlePortal}
            disabled={loading === "portal"}
            className="flex items-center gap-2 text-sm text-[#6b7366] hover:text-[#1c1c16] transition-colors"
          >
            <Settings className="w-4 h-4" />
            {loading === "portal" ? "Åpner..." : "Administrer abonnementer"}
          </button>
        </div>
      )}
    </div>
  );
}
