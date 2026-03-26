"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
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
}: ApperClientProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSuccess = searchParams.get("success") === "true";

  async function handleCheckout(moduleSlug?: string, bundleSlug?: string) {
    const key = moduleSlug ?? bundleSlug ?? "";
    setLoading(key);

    try {
      const res = await fetch("/api/portal/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, bundleSlug, interval: "month" }),
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } catch {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/portal/subscriptions/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } catch {
      setLoading(null);
    }
  }

  async function handleActivateFree(moduleSlug: string) {
    setLoading(moduleSlug);
    try {
      const res = await fetch("/api/portal/subscriptions/activate-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
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
    <div className="space-y-8">
      {/* Success message */}
      {isSuccess && (
        <div
          className="rounded-2xl p-4 border flex items-center gap-3"
          style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)" }}
        >
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-400 font-medium">
            Abonnementet ditt er aktivert! Din 7-dagers prøveperiode har startet.
          </p>
        </div>
      )}

      {/* Bundles */}
      <div className="space-y-4">
        <p className="text-[11px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-widest">
          Pakker
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bundles.map((bundle) => {
            const active = isBundleActive(bundle.slug);
            const isPremium = bundle.slug === "premium-bundle";

            return (
              <div
                key={bundle.id}
                className="rounded-2xl p-6 border relative overflow-hidden"
                style={{
                  background: isPremium
                    ? "linear-gradient(135deg, rgba(184,151,92,0.15) 0%, rgba(10,25,41,0.9) 100%)"
                    : "rgba(10,25,41,0.7)",
                  borderColor: isPremium
                    ? "rgba(184,151,92,0.4)"
                    : "rgba(15,41,80,0.8)",
                }}
              >
                {isPremium && (
                  <div className="absolute top-3 right-3">
                    <Crown className="w-5 h-5 text-[var(--color-gold)]" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[var(--color-snow)] mb-1">
                  {bundle.name}
                </h3>
                <p className="text-xs text-[var(--color-gold-muted)] mb-3">
                  {bundle.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {bundle.items.map((item) => (
                    <span
                      key={item.module.slug}
                      className="text-[10px] px-2 py-0.5 rounded-full border"
                      style={{
                        borderColor: "rgba(184,151,92,0.3)",
                        color: "var(--color-gold-muted)",
                      }}
                    >
                      {item.module.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-snow)]">
                      {bundle.monthlyPriceNok / 100}
                    </span>
                    <span className="text-sm text-[var(--color-gold-muted)] ml-1">
                      kr/mnd
                    </span>
                  </div>
                  {active ? (
                    <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Aktiv
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCheckout(undefined, bundle.slug)}
                      disabled={loading !== null}
                      className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{
                        background: isPremium
                          ? "linear-gradient(135deg, #c9a96e, #B07D4F)"
                          : "rgba(184,151,92,0.2)",
                        color: isPremium ? "#0a1929" : "var(--color-gold)",
                      }}
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
        <p className="text-[11px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-widest">
          Enkeltapper
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const active = isModuleActive(mod.slug);
            const Icon = ICON_MAP[mod.icon ?? ""] ?? BarChart3;

            return (
              <div
                key={mod.id}
                className="rounded-2xl p-5 border transition-colors"
                style={{
                  background: "rgba(10,25,41,0.7)",
                  borderColor: active
                    ? "rgba(34,197,94,0.4)"
                    : "rgba(15,41,80,0.8)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(184,151,92,0.15)" }}
                  >
                    <Icon className="w-4.5 h-4.5 text-[var(--color-gold)]" />
                  </div>
                  {active && (
                    <span className="text-[10px] font-medium text-green-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Aktiv
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-[var(--color-snow)] mb-1">
                  {mod.name}
                </h4>
                <p className="text-xs text-[var(--color-gold-muted)] mb-4 line-clamp-2">
                  {mod.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--color-snow)]">
                    {mod.monthlyPriceNok === 0 ? (
                      "Gratis"
                    ) : (
                      <>
                        {mod.monthlyPriceNok / 100}
                        <span className="text-xs font-normal text-[var(--color-gold-muted)] ml-0.5">
                          kr/mnd
                        </span>
                      </>
                    )}
                  </span>
                  {!active && mod.monthlyPriceNok === 0 ? (
                    <button
                      onClick={() => handleActivateFree(mod.slug)}
                      disabled={loading !== null}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                      style={{
                        background: "rgba(34,197,94,0.2)",
                        color: "#10B981",
                      }}
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
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                      style={{
                        background: "rgba(184,151,92,0.2)",
                        color: "var(--color-gold)",
                      }}
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
            className="flex items-center gap-2 text-sm text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"
          >
            <Settings className="w-4 h-4" />
            {loading === "portal" ? "Åpner..." : "Administrer abonnementer"}
          </button>
        </div>
      )}
    </div>
  );
}
