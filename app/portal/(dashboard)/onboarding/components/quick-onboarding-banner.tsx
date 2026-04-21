"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/portal/utils/cn";
import { quickOnboardAndGeneratePlan } from "../actions";

const GOALS = [
  { id: "handicap", label: "Ned i handicap", icon: "trending_down" },
  { id: "compete", label: "Konkurrere", icon: "emoji_events" },
  { id: "fun", label: "Ha det gøy", icon: "sports_golf" },
] as const;

export function QuickOnboardingBanner() {
  const router = useRouter();
  const [hcp, setHcp] = useState("");
  const [goal, setGoal] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = hcp !== "" && goal !== "";

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    const hcpNum = parseFloat(hcp);
    if (isNaN(hcpNum) || hcpNum < 0 || hcpNum > 54) {
      setError("Oppgi et gyldig handicap mellom 0 og 54");
      setLoading(false);
      return;
    }

    try {
      const result = await quickOnboardAndGeneratePlan({
        handicap: hcpNum,
        goalCategory: goal as "handicap" | "compete" | "fun",
      });

      if (result.success) {
        router.push("/portal/treningsplan");
        router.refresh();
      } else {
        setError(result.error ?? "Noe gikk galt");
      }
    } catch (err) {
      setError("Kunne ikke generere plan. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-primary-container to-primary p-6 sm:p-8 text-on-primary-container shadow-lg">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-fixed">
          <Icon name="rocket_launch" size={24} className="text-on-secondary-fixed" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-on-primary-container">
            Velkommen! La oss komme i gang
          </h2>
          <p className="text-sm text-on-primary-container/70 mt-1">
            Fullfør din profil på 30 sekunder — så genererer vi din første treningsplan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* HCP */}
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-on-primary-container/60 mb-2">
            Ditt handicap (HCP)
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={54}
              step={0.1}
              value={hcp}
              onChange={(e) => setHcp(e.target.value)}
              placeholder="f.eks. 18.5"
              className="w-full rounded-xl bg-surface/10 border border-on-primary-container/20 px-4 py-3 text-sm font-bold text-on-primary-container placeholder:text-on-primary-container/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed/50"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-on-primary-container/40">
              HCP
            </span>
          </div>
        </div>

        {/* Mål */}
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-on-primary-container/60 mb-2">
            Hva er ditt mål?
          </label>
          <div className="flex gap-2">
            {GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 rounded-xl border px-3 py-2.5 text-[11px] font-bold transition-all",
                  goal === g.id
                    ? "bg-secondary-fixed border-secondary-fixed text-on-secondary-fixed"
                    : "bg-surface/10 border-on-primary-container/20 text-on-primary-container/70 hover:bg-surface/20"
                )}
              >
                <Icon name={g.icon} size={18} />
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-error-container mb-4 flex items-center gap-2">
          <Icon name="error" size={16} />
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className={cn(
          "w-full sm:w-auto rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all",
          canSubmit && !loading
            ? "bg-secondary-fixed text-on-secondary-fixed hover:opacity-90 active:scale-95"
            : "bg-surface/20 text-on-primary-container/40 cursor-not-allowed"
        )}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Genererer plan...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Icon name="auto_fix_high" size={18} />
            Generer min første plan
          </span>
        )}
      </button>
    </div>
  );
}
