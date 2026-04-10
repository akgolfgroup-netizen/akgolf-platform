"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AlertCircle,
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
  Package,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { PricingTable } from "@/components/portal/pricing/pricing-table";
import {
  PortalCard,
  PremiumBentoCard,
  PremiumBentoGrid,
  staggerContainer,
  fadeInUp,
} from "@/components/portal/premium";
import { cn } from "@/lib/portal/utils/cn";

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
          <div className="flex items-center gap-3 rounded-[24px] p-4 bg-[var(--color-success)]/10 border border-[var(--color-success)]/25">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-success)]/15">
              <Check className="h-5 w-5 text-[var(--color-success)]" />
            </div>
            <p className="text-sm font-medium text-[var(--color-success)]">
              Abonnementet ditt er aktivert. Din 14-dagers prøveperiode har startet.
            </p>
          </div>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div variants={fadeInUp} role="alert">
          <div className="flex items-center gap-3 rounded-[24px] p-4 bg-[var(--color-error)]/10 border border-[var(--color-error)]/25">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-error)]/15">
              <AlertCircle className="h-5 w-5 text-[var(--color-error)]" />
            </div>
            <p className="text-sm font-medium text-[var(--color-error)]">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Pricing Table */}
      <motion.div variants={fadeInUp} className="space-y-5">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Velg plan
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-text)] lg:text-3xl">
            Velg ditt abonnement
          </h2>
          <p className="mt-2 text-[var(--color-muted)]">
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
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Aktive abonnement
            </p>
            {hasStripeCustomer && (
              <button
                onClick={handlePortal}
                disabled={loading === "portal"}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                {loading === "portal" ? "Åpner…" : "Administrer"}
              </button>
            )}
          </div>
          <PortalCard padding="md">
            <ul className="divide-y divide-black/5">
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
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-success)]/10">
                        {isBundle ? (
                          <Package className="h-[18px] w-[18px] text-[var(--color-success)]" />
                        ) : (
                          <Sparkles className="h-[18px] w-[18px] text-[var(--color-success)]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text)] capitalize">
                          {name.replace(/-/g, " ")}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {sub.status === "TRIALING" ? "Prøveperiode" : "Aktiv"}
                          {sub.cancelAtPeriodEnd && " · Avsluttes ved periodeslutt"}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-success)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-success)]">
                      <Check className="h-3 w-3" />
                      Aktiv
                    </span>
                  </li>
                );
              })}
            </ul>
          </PortalCard>
        </motion.section>
      )}

      {/* Bundles */}
      <motion.section variants={fadeInUp} className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Pakker
        </p>
        <PremiumBentoGrid columns={2}>
          {bundles.map((bundle) => {
            const active = isBundleActive(bundle.slug);
            const isPremium = bundle.slug === "premium-bundle";
            const variant: "default" | "soft" | "bold" = isPremium
              ? "bold"
              : "soft";

            return (
              <PremiumBentoCard
                key={bundle.id}
                title={bundle.name}
                description={bundle.description ?? undefined}
                icon={isPremium ? Trophy : Package}
                variant={variant}
                featured={isPremium}
                badge={active ? "Aktiv" : undefined}
                badgeVariant="success"
              >
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {bundle.items.map((item) => (
                    <span
                      key={item.module.slug}
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
                        variant === "bold"
                          ? "bg-white/15 text-white"
                          : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
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
                        "text-3xl font-bold tracking-tight",
                        variant === "bold" ? "text-white" : "text-[var(--color-text)]"
                      )}
                    >
                      {bundle.monthlyPriceNok / 100}
                    </span>
                    <span
                      className={cn(
                        "ml-1 text-sm",
                        variant === "bold"
                          ? "text-white/70"
                          : "text-[var(--color-muted)]"
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
                        "inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold transition-all duration-200",
                        variant === "bold"
                          ? "bg-[var(--color-accent-cta)] text-[var(--color-primary)] hover:brightness-105"
                          : "bg-[var(--color-primary)] text-white hover:brightness-110"
                      )}
                    >
                      {loading === bundle.slug ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Prøv 7 dager gratis"
                      )}
                    </button>
                  )}
                </div>
              </PremiumBentoCard>
            );
          })}
        </PremiumBentoGrid>
      </motion.section>

      {/* Individual modules */}
      <motion.section variants={fadeInUp} className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Enkeltapper
        </p>
        <PremiumBentoGrid columns={3}>
          {modules.map((mod) => {
            const active = isModuleActive(mod.slug);
            const Icon = ICON_MAP[mod.icon ?? ""] ?? BarChart3;
            const isFree = mod.monthlyPriceNok === 0;

            return (
              <PremiumBentoCard
                key={mod.id}
                title={mod.name}
                description={mod.description ?? undefined}
                icon={Icon}
                variant="default"
                badge={active ? "Aktiv" : isFree ? "Gratis" : undefined}
                badgeVariant={active ? "success" : "primary"}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold tracking-tight text-[var(--color-text)]">
                    {isFree ? (
                      "Gratis"
                    ) : (
                      <>
                        {mod.monthlyPriceNok / 100}
                        <span className="ml-1 text-xs font-normal text-[var(--color-muted)]">
                          kr/mnd
                        </span>
                      </>
                    )}
                  </span>
                  {!active && isFree ? (
                    <button
                      onClick={() => handleActivateFree(mod.slug)}
                      disabled={loading !== null}
                      className="inline-flex h-8 items-center justify-center rounded-full bg-[var(--color-success)]/10 px-3 text-[11px] font-semibold text-[var(--color-success)] hover:bg-[var(--color-success)]/15 transition-colors"
                    >
                      {loading === mod.slug ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Aktiver"
                      )}
                    </button>
                  ) : !active ? (
                    <button
                      onClick={() => handleCheckout(mod.slug)}
                      disabled={loading !== null}
                      className="inline-flex h-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 px-3 text-[11px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15 transition-colors"
                    >
                      {loading === mod.slug ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Prøv gratis"
                      )}
                    </button>
                  ) : null}
                </div>
              </PremiumBentoCard>
            );
          })}
        </PremiumBentoGrid>
      </motion.section>

      {/* Manage subscriptions fallback */}
      {hasStripeCustomer && activeSubscriptions.length === 0 && (
        <motion.div variants={fadeInUp} className="pt-2">
          <button
            onClick={handlePortal}
            disabled={loading === "portal"}
            className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Settings className="h-4 w-4" />
            {loading === "portal" ? "Åpner…" : "Administrer abonnementer"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
