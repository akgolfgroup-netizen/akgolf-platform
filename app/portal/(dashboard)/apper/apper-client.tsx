"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { NotebookPen, Dumbbell, BarChart3, Users, Target, ScanSearch, Trophy, Package, type LucideIcon } from "lucide-react";
import { PricingTable } from "@/components/portal/pricing/pricing-table";
import {
  staggerContainer,
  fadeInUp,
} from "@/components/portal/premium";
import { cn } from "@/lib/portal/utils/cn";
import { MonoLabel, BentoCard } from "@/components/portal/patterns";

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

const ICON_MAP: Record<string, LucideIcon> = {
  "notebook-pen": NotebookPen,
  dumbbell: Dumbbell,
  "bar-chart-3": BarChart3,
  users: Users,
  target: Target,
  "scan-search": ScanSearch,
  trophy: Trophy,
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
      const bundleSlug = plan === "PRO" ? "pro-bundle" : "premium-bundle";
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
        setError(
          (data as { error?: string }).error || "Kunne ikke aktivere modulen. Prøv igjen."
        );
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

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "ACTIVE" || s.status === "TRIALING"
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-10"
    >
      {/* Success message */}
      {isSuccess && (
        <motion.div variants={fadeInUp} role="alert">
          <div className="flex items-center gap-3 rounded-xl p-4 bg-success-light border border-success/25">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-success/15">
              <Icon name="check" className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm font-medium text-success">
              Abonnementet ditt er aktivert. Din 14-dagers prøveperiode har startet.
            </p>
          </div>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div variants={fadeInUp} role="alert">
          <div className="flex items-center gap-3 rounded-xl p-4 bg-error-light border border-error/25">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-error/15">
              <Icon name="error" className="h-5 w-5 text-error" />
            </div>
            <p className="text-sm font-medium text-error">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Pricing Table */}
      <motion.div variants={fadeInUp} className="space-y-5">
        <div className="text-center">
          <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Velg plan</MonoLabel>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-on-surface lg:text-3xl">
            Velg ditt abonnement
          </h2>
          <p className="mt-2 text-on-surface-variant">
            Få tilgang til avanserte verktøy for å forbedre golfen din.
          </p>
        </div>
        <PricingTable
          currentTier={currentTier}
          onSelectPlan={handlePlanSelect}
          loading={loading}
        />
      </motion.div>

      {/* Active subscriptions */}
      {activeSubscriptions.length > 0 && (
        <motion.section variants={fadeInUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant flex items-center gap-2">
              <span className="w-6 h-px bg-surface-variant" />
              Aktive abonnement
            </p>
            {hasStripeCustomer && (
              <button
                onClick={handlePortal}
                disabled={loading === "portal"}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface hover:opacity-80 transition-opacity"
              >
                <Icon name="settings" className="h-3.5 w-3.5" />
                {loading === "portal" ? "Åpner…" : "Administrer"}
              </button>
            )}
          </div>
          <BentoCard variant="light" padding="sm">
            <ul className="divide-y divide-outline-variant/30">
              {activeSubscriptions.map((sub) => {
                const name =
                  sub.bundle?.slug ?? sub.module?.slug ?? "Abonnement";
                const isBundle = !!sub.bundle;
                return (
                  <li
                    key={sub.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-fixed/20 border border-secondary-fixed/30">
                        {isBundle ? (
                          <Package className="h-[18px] w-[18px] text-on-surface" />
                        ) : (
                          <Icon name="auto_awesome" className="h-[18px] w-[18px] text-on-surface" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface capitalize">
                          {name.replace(/-/g, " ")}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          {sub.status === "TRIALING" ? "Prøveperiode" : "Aktiv"}
                          {sub.cancelAtPeriodEnd && " · Avsluttes ved periodeslutt"}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-light border border-success/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                      <Icon name="check" className="h-3 w-3" />
                      Aktiv
                    </span>
                  </li>
                );
              })}
            </ul>
          </BentoCard>
        </motion.section>
      )}

      {/* Bundles */}
      <motion.section variants={fadeInUp} className="space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant flex items-center gap-2">
          <span className="w-6 h-px bg-surface-variant" />
          Pakker
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {bundles.map((bundle) => {
            const active = isBundleActive(bundle.slug);
            const isPremium = bundle.slug === "premium-bundle";
            const BundleIcon = isPremium ? Trophy : Package;

            return (
              <BentoCard
                key={bundle.id}
                variant={isPremium ? "accent" : "light"}
                padding="lg"
                interactive
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center",
                      isPremium
                        ? "bg-secondary-fixed/20 border border-secondary-fixed/30"
                        : "bg-surface"
                    )}
                  >
                    <BundleIcon
                      className={cn(
                        "h-5 w-5",
                        isPremium
                          ? "text-on-surface"
                          : "text-on-surface"
                      )}
                    />
                  </div>
                  {active && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                        isPremium
                          ? "bg-success-light border border-success/20 text-success"
                          : "bg-success-light text-success"
                      )}
                    >
                      <Icon name="check" className="h-3 w-3" />
                      Aktiv
                    </span>
                  )}
                </div>
                <h3
                  className={cn(
                    "text-[18px] font-semibold tracking-tight mb-1.5",
                    isPremium ? "text-on-surface" : "text-on-surface"
                  )}
                >
                  {bundle.name}
                </h3>
                {bundle.description && (
                  <p
                    className={cn(
                      "text-[13px] leading-relaxed mb-4",
                      isPremium ? "text-on-surface-variant" : "text-on-surface-variant"
                    )}
                  >
                    {bundle.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {bundle.items.map((item) => (
                    <span
                      key={item.module.slug}
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
                        isPremium
                          ? "bg-surface text-on-surface border border-outline-variant/30"
                          : "bg-secondary-fixed/15 text-on-surface"
                      )}
                    >
                      {item.module.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span
                      className={cn(
                        "text-[32px] font-[300] tabular-nums tracking-[-0.04em] leading-none",
                        isPremium ? "text-on-surface" : "text-on-surface"
                      )}
                    >
                      {bundle.monthlyPriceNok / 100}
                    </span>
                    <span
                      className={cn(
                        "ml-1 text-sm",
                        isPremium ? "text-on-surface-variant" : "text-on-surface-variant"
                      )}
                    >
                      kr/mnd
                    </span>
                  </div>
                  {!active && (
                    <button
                      onClick={() => handleCheckout(undefined, bundle.slug)}
                      disabled={loading !== null}
                      className={cn(
                        "relative h-10 px-5 rounded-full text-[11px] font-bold inline-flex items-center gap-2 transition-all",
                        isPremium
                          ? "bg-secondary-fixed text-on-surface hover:brightness-95"
                          : "bg-secondary-fixed text-on-surface hover:brightness-95"
                      )}
                    >
                      {loading === bundle.slug ? (
                        <Icon name="progress_activity" className="h-4 w-4 animate-spin" />
                      ) : (
                        "Prøv 7 dager gratis"
                      )}
                    </button>
                  )}
                </div>
              </BentoCard>
            );
          })}
        </div>
      </motion.section>

      {/* Individual modules */}
      <motion.section variants={fadeInUp} className="space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant flex items-center gap-2">
          <span className="w-6 h-px bg-surface-variant" />
          Enkeltapper
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const active = isModuleActive(mod.slug);
            const ModuleIcon = ICON_MAP[mod.icon ?? ""] ?? BarChart3;
            const isFree = mod.monthlyPriceNok === 0;

            return (
              <BentoCard
                key={mod.id}
                variant="light"
                padding="md"
                interactive
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                    <ModuleIcon
                      className="h-[18px] w-[18px] text-on-surface"
                     
                    />
                  </div>
                  {(active || isFree) && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                        active
                          ? "bg-success-light text-success"
                          : "bg-secondary-fixed/20 text-on-surface"
                      )}
                    >
                      {active ? (
                        <>
                          <Icon name="check" className="h-3 w-3" />
                          Aktiv
                        </>
                      ) : (
                        "Gratis"
                      )}
                    </span>
                  )}
                </div>
                <h3 className="text-[15px] font-semibold text-on-surface mb-1.5 tracking-tight">
                  {mod.name}
                </h3>
                {mod.description && (
                  <p className="text-[12px] text-on-surface-variant leading-relaxed mb-4 line-clamp-2">
                    {mod.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-semibold tracking-tight text-on-surface tabular-nums">
                    {isFree ? (
                      "Gratis"
                    ) : (
                      <>
                        {mod.monthlyPriceNok / 100}
                        <span className="ml-1 text-[11px] font-normal text-on-surface-variant">
                          kr/mnd
                        </span>
                      </>
                    )}
                  </span>
                  {!active && isFree ? (
                    <button
                      onClick={() => handleActivateFree(mod.slug)}
                      disabled={loading !== null}
                      className="inline-flex h-8 items-center justify-center rounded-full bg-success-light px-3 text-[11px] font-semibold text-success hover:bg-success/15 transition-colors"
                    >
                      {loading === mod.slug ? (
                        <Icon name="progress_activity" className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Aktiver"
                      )}
                    </button>
                  ) : !active ? (
                    <button
                      onClick={() => handleCheckout(mod.slug)}
                      disabled={loading !== null}
                      className="inline-flex h-8 items-center justify-center rounded-full bg-secondary-fixed px-3 text-[11px] font-semibold text-secondary-fixed-text hover:brightness-95 transition-all"
                    >
                      {loading === mod.slug ? (
                        <Icon name="progress_activity" className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Prøv gratis"
                      )}
                    </button>
                  ) : null}
                </div>
              </BentoCard>
            );
          })}
        </div>
      </motion.section>

      {/* Manage subscriptions fallback */}
      {hasStripeCustomer && activeSubscriptions.length === 0 && (
        <motion.div variants={fadeInUp} className="pt-2">
          <button
            onClick={handlePortal}
            disabled={loading === "portal"}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Icon name="settings" className="h-4 w-4" />
            {loading === "portal" ? "Åpner…" : "Administrer abonnementer"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
