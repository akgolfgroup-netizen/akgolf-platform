"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FACILITY_OPTIONS, SEASON_OPTIONS, getCategory, getCategoryInfo, getPyramid } from "@/lib/ai/category-engine";
import type { Facility, Season } from "@/lib/ai/category-engine";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  handicap: number;
  sessionsPerWeek: number;
  facilities: Facility[];
  season: Season | null;
  goals: string;
  email: string;
}

export function PlanConfigurator() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    handicap: 22,
    sessionsPerWeek: 3,
    facilities: [],
    season: null,
    goals: "",
    email: "",
  });

  const category = getCategory(form.handicap);
  const categoryInfo = getCategoryInfo(category);
  const pyramid = getPyramid(category);

  const canProceed = () => {
    switch (step) {
      case 1: return true; // handicap always valid
      case 2: return form.sessionsPerWeek >= 2 && form.sessionsPerWeek <= 7;
      case 3: return form.facilities.length > 0 && form.season !== null;
      case 4: return form.email.includes("@");
      default: return false;
    }
  };

  const toggleFacility = (f: Facility) => {
    setForm(prev => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter(x => x !== f)
        : [...prev.facilities, f],
    }));
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/treningsplan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handicap: form.handicap,
          sessionsPerWeek: form.sessionsPerWeek,
          facilities: form.facilities,
          season: form.season,
          goals: form.goals || undefined,
          email: form.email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Noe gikk galt");
      }

      const data = await res.json();
      window.location.href = `/treningsplan/preview/${data.planId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
      setLoading(false);
    }
  };

  return (
    <div className="w-card max-w-2xl mx-auto !p-0 overflow-hidden">
      {/* Progress bar */}
      <div className="flex">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 transition-colors duration-300 ${
              s <= step ? "bg-black" : "bg-grey-200"
            }`}
          />
        ))}
      </div>

      {/* Step indicator */}
      <div className="px-8 pt-6 pb-2 flex items-center justify-between">
        <span className="font-mono text-xs text-grey-500 tracking-wider uppercase">
          Steg {step} av 4
        </span>
        {step > 1 && (
          <button
            onClick={() => setStep((step - 1) as Step)}
            className="text-sm text-grey-500 hover:text-black transition-colors"
          >
            Tilbake
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-8 pb-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepWrapper key="step1">
              <h3 className="w-heading-md mb-2">Hva er ditt handicap?</h3>
              <p className="text-sm text-grey-500 mb-8">
                Vi plasserer deg automatisk i riktig treningskategori basert på handicapet ditt.
              </p>

              <div className="space-y-6">
                <div>
                  <input
                    type="range"
                    min={-5}
                    max={54}
                    step={0.1}
                    value={form.handicap}
                    onChange={(e) => setForm(prev => ({ ...prev, handicap: parseFloat(e.target.value) }))}
                    className="w-full accent-black h-2 rounded-full"
                    aria-label={`Handicap: ${form.handicap.toFixed(1)}`}
                    aria-valuemin={-5}
                    aria-valuemax={54}
                    aria-valuenow={form.handicap}
                  />
                  <div className="flex justify-between text-xs text-grey-500 mt-1">
                    <span>+5</span>
                    <span>54</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="font-mono text-4xl font-bold text-black">
                      {form.handicap.toFixed(1)}
                    </div>
                    <div className="text-xs text-grey-500 mt-1">Handicap</div>
                  </div>

                  <div className="w-px h-12 bg-grey-200" />

                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-grey-100 text-black px-4 py-2 rounded-lg">
                      <span className="font-mono text-2xl font-bold">{category}</span>
                    </div>
                    <div className="text-xs text-grey-500 mt-1">{categoryInfo.name}</div>
                  </div>
                </div>

                {/* Mini pyramid preview */}
                <div className="bg-grey-100 rounded-[20px] p-4">
                  <div className="text-xs font-mono text-grey-500 mb-3 uppercase tracking-wider">Pyramidefordeling</div>
                  <div className="space-y-2">
                    {(["FYS", "TEK", "SLAG", "SPILL", "TURN"] as const).map((level) => (
                      <div key={level} className="flex items-center gap-3">
                        <span className="font-mono text-xs text-grey-500 w-10">{level}</span>
                        <div className="flex-1 h-2 bg-grey-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-black rounded-full transition-[width] duration-500"
                            style={{ width: `${pyramid[level]}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-grey-500 w-8 text-right">{pyramid[level]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper key="step2">
              <h3 className="w-heading-md mb-2">Hvor mange økter per uke?</h3>
              <p className="text-sm text-grey-500 mb-8">
                Vi tilpasser planen til din tilgjengelige tid. Hver økt er 90 minutter.
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                {[2, 3, 4, 5, 6, 7].map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm(prev => ({ ...prev, sessionsPerWeek: n }))}
                    className={`rounded-[20px] p-4 text-center transition-[border-color,background-color,color] duration-200 border ${
                      form.sessionsPerWeek === n
                        ? "bg-black border-black text-white"
                        : "bg-white border-grey-200 text-grey-500 hover:border-grey-300"
                    }`}
                  >
                    <div className="font-mono text-2xl font-bold">{n}</div>
                    <div className="text-[10px] mt-1">økter</div>
                  </button>
                ))}
              </div>

              <div className="bg-grey-100 rounded-[20px] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Total treningstid per uke</span>
                  <span className="font-mono font-semibold text-black">
                    {form.sessionsPerWeek * 90} min ({(form.sessionsPerWeek * 1.5).toFixed(1)} timer)
                  </span>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper key="step3">
              <h3 className="w-heading-md mb-2">Fasiliteter og sesong</h3>
              <p className="text-sm text-grey-500 mb-6">
                Velg fasilitetene du har tilgang til, og sesongen du vil trene i.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="w-label mb-3">Tilgjengelige fasiliteter</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FACILITY_OPTIONS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => toggleFacility(f.value)}
                        className={`flex items-start gap-3 rounded-[20px] p-3 text-left transition-[border-color,background-color,color] duration-200 border ${
                          form.facilities.includes(f.value)
                            ? "bg-grey-100 border-black"
                            : "bg-white border-grey-200 hover:border-grey-300"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          form.facilities.includes(f.value)
                            ? "bg-black border-black"
                            : "border-grey-300"
                        }`}>
                          {form.facilities.includes(f.value) && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-black">{f.label}</div>
                          <div className="text-xs text-grey-500">{f.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="w-label mb-3">Sesong</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SEASON_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setForm(prev => ({ ...prev, season: s.value }))}
                        className={`rounded-[20px] p-3 text-center transition-[border-color,background-color,color] duration-200 border ${
                          form.season === s.value
                            ? "bg-black border-black text-white"
                            : "bg-white border-grey-200 text-grey-500 hover:border-grey-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className={`text-[10px] mt-0.5 ${form.season === s.value ? "text-grey-300" : "text-grey-500"}`}>{s.months}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper key="step4">
              <h3 className="w-heading-md mb-2">Siste steg</h3>
              <p className="text-sm text-grey-500 mb-6">
                Legg til valgfrie mål og e-postadressen din for å motta planen.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="goals" className="w-label">Personlige mål (valgfritt)</label>
                  <textarea
                    id="goals"
                    value={form.goals}
                    onChange={(e) => setForm(prev => ({ ...prev, goals: e.target.value }))}
                    placeholder="F.eks. vil komme under 20 i handicap, bli bedre på putting, forberede meg til klubbmesterskap..."
                    className="w-input min-h-[80px] resize-y"
                    rows={3}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="w-label">E-postadresse</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="din@epost.no…"
                    className="w-input"
                    required
                    autoComplete="email"
                    spellCheck={false}
                  />
                  <p className="text-xs text-grey-500 mt-1">Brukes for å sende planen din. Vi deler aldri e-posten din.</p>
                </div>

                {/* Summary */}
                <div className="bg-grey-100 rounded-[20px] p-4 space-y-2">
                  <div className="text-xs font-mono text-grey-500 mb-2 uppercase tracking-wider">Oppsummering</div>
                  <SummaryRow label="Handicap" value={`${form.handicap.toFixed(1)} (Kategori ${category})`} />
                  <SummaryRow label="Økter/uke" value={`${form.sessionsPerWeek} (${form.sessionsPerWeek * 90} min)`} />
                  <SummaryRow label="Fasiliteter" value={`${form.facilities.length} valgt`} />
                  <SummaryRow label="Sesong" value={SEASON_OPTIONS.find(s => s.value === form.season)?.label || "—"} />
                </div>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-[20px]">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8">
          {step < 4 ? (
            <button
              onClick={() => setStep((step + 1) as Step)}
              disabled={!canProceed()}
              className="w-btn w-btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Neste
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="w-btn w-btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  Genererer din plan...
                </span>
              ) : (
                "Generer treningsplan"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-grey-500">{label}</span>
      <span className="font-mono text-black">{value}</span>
    </div>
  );
}
