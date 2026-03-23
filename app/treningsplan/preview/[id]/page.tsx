"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { BackToTop } from "@/components/website/BackToTop";
import type { PlanPreview } from "@/lib/ai/plan-schema";

export default function PreviewPage() {
  const params = useParams();
  const planId = params.id as string;
  const [preview, setPreview] = useState<PlanPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function fetchPreview() {
      try {
        const res = await fetch(`/api/treningsplan/preview/${planId}`);
        if (!res.ok) throw new Error("Kunne ikke hente plan");
        const data = await res.json();
        setPreview(data.preview);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ukjent feil");
      } finally {
        setLoading(false);
      }
    }
    fetchPreview();
  }, [planId]);

  const handleCheckout = async (tier: string) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/treningsplan/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, tier }),
      });
      if (!res.ok) throw new Error("Checkout feilet");
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <WebsiteNav />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink-50">Laster forhåndsvisning...</p>
          </div>
        </main>
        <WebsiteFooter />
      </>
    );
  }

  if (error || !preview) {
    return (
      <>
        <WebsiteNav />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="w-heading-md mb-4">Noe gikk galt</h1>
            <p className="text-ink-50 mb-6">{error || "Kunne ikke laste planen."}</p>
            <Link href="/treningsplan" className="w-btn w-btn-primary">
              Tilbake til treningsplan
            </Link>
          </div>
        </main>
        <WebsiteFooter />
      </>
    );
  }

  const { summary, monthlyPhases, sampleWeeks, testPlan, progressionCriteria } = preview;

  return (
    <>
      <WebsiteNav />

      <main id="main-content" className="pt-24 pb-16">
        <div className="w-container">
          {/* ─── Header ─── */}
          <div className="mb-12">
            <SectionLabel>Forhåndsvisning</SectionLabel>
            <h1 className="w-heading-xl mt-4 mb-4">Din personlige treningsplan</h1>
            <p className="text-lg text-ink-50 max-w-2xl">
              {summary.mainFocus}
            </p>
          </div>

          {/* ─── Summary Card ─── */}
          <div className="w-card mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <SummaryItem label="Kategori" value={`${summary.playerCategory} — ${summary.categoryName}`} />
              <SummaryItem label="Handicap" value={summary.handicapRange} />
              <SummaryItem label="Varighet" value={`${summary.totalWeeks} uker`} />
              <SummaryItem label="Økter/uke" value={`${summary.sessionsPerWeek} × ${summary.minutesPerSession} min`} />
            </div>

            {/* Pyramid */}
            <div className="mt-6 pt-6 border-t border-ink-10">
              <div className="text-xs font-mono text-ink-50 mb-3 uppercase tracking-wider">Pyramidefordeling</div>
              <div className="flex gap-4 flex-wrap">
                {(["FYS", "TEK", "SLAG", "SPILL", "TURN"] as const).map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-gold-text">
                        {summary.pyramidDistribution[level]}%
                      </span>
                    </div>
                    <span className="text-xs text-ink-50">{level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Monthly Phases ─── */}
          <div className="mb-8">
            <h2 className="w-heading-md mb-4">3-måneders plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monthlyPhases.map((phase) => (
                <div key={phase.month} className="w-card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-sm font-bold text-gold">Måned {phase.month}</span>
                    <span className="text-xs bg-gold/10 text-gold-text px-2 py-0.5 rounded-full">{phase.phase}</span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-ink-90 mb-2">{phase.name}</h3>
                  <div className="space-y-1 mb-3">
                    {phase.focus.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-ink-50">
                        <span className="text-gold mt-1">-</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-ink-50">
                    <span className="font-medium">Mål: </span>
                    {phase.goals.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Sample Weeks (first 2) ─── */}
          <div className="mb-8">
            <h2 className="w-heading-md mb-2">Eksempel-uker</h2>
            <p className="text-sm text-ink-50 mb-4">De to første ukene av planen. Full plan tilgjengelig etter kjøp.</p>

            {sampleWeeks.map((week) => (
              <div key={week.weekNumber} className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-sm font-bold text-ink-90">Uke {week.weekNumber}</span>
                  <span className="text-sm text-ink-50">{week.theme}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {week.days.filter(d => !d.isRestDay).map((day) => (
                    <div key={day.dayNumber} className="bg-surface-cream rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-ink-80">{day.dayName}</span>
                        <span className="text-xs text-ink-50">{day.duration} min</span>
                      </div>
                      <div className="text-xs text-ink-50">{day.sessionType}</div>
                      {day.mainA && (
                        <div className="mt-2 text-xs">
                          <span className="font-mono text-gold-text">{day.mainA.area}</span>
                          <span className="text-ink-50"> — {day.mainA.focus}</span>
                        </div>
                      )}
                      {day.mainB && (
                        <div className="text-xs">
                          <span className="font-mono text-gold-text">{day.mainB.area}</span>
                          <span className="text-ink-50"> — {day.mainB.focus}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ─── Test Plan ─── */}
          <div className="mb-8">
            <h2 className="w-heading-md mb-4">Testplan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {testPlan.schedule.map((test, i) => (
                <div key={i} className="bg-surface-cream rounded-lg p-4">
                  <div className="font-mono text-sm font-bold text-ink-80 mb-1">{test.label}</div>
                  <div className="text-xs text-ink-50">Uke {test.weekNumber}</div>
                  <div className="text-xs text-ink-50 mt-1">{test.purpose}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Progression ─── */}
          <div className="mb-12">
            <h2 className="w-heading-md mb-4">Progresjon</h2>
            <div className="w-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <div className="font-mono text-2xl font-bold text-ink-90">{progressionCriteria.currentCategory}</div>
                  <div className="text-xs text-ink-50">Nå</div>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <div className="text-center">
                  <div className="font-mono text-2xl font-bold text-gold">{progressionCriteria.nextCategory}</div>
                  <div className="text-xs text-ink-50">Neste mål</div>
                </div>
              </div>
              <p className="text-sm text-ink-50 mb-3">{summary.estimatedImprovement}</p>
              <div className="text-xs text-ink-50">
                Estimert tidslinje: {progressionCriteria.estimatedTimeline}
              </div>
            </div>
          </div>

          {/* ─── Paywall CTA ─── */}
          <div className="bg-ink-100 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="w-heading-md text-white mb-4">Lås opp full treningsplan</h2>
            <p className="text-ink-50 max-w-lg mx-auto mb-8">
              Du har sett oversikten og de to første ukene. Kjøp full tilgang til alle 12 uker med detaljerte økter, øvelser og progresjon.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleCheckout("basis")}
                disabled={checkoutLoading}
                className="w-btn w-btn-ghost !border-ink-60 !text-ink-20 hover:!bg-ink-80"
              >
                Basis — 199 kr (PDF)
              </button>
              <button
                onClick={() => handleCheckout("standard")}
                disabled={checkoutLoading}
                className="w-btn w-btn-gold"
              >
                Standard — 699 kr/sesong
              </button>
              <button
                onClick={() => handleCheckout("premium")}
                disabled={checkoutLoading}
                className="w-btn w-btn-ghost !border-ink-60 !text-ink-20 hover:!bg-ink-80"
              >
                Premium — 1 999 kr/år
              </button>
            </div>
          </div>
        </div>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-mono text-ink-50 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-medium text-ink-90">{value}</div>
    </div>
  );
}
