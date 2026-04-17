"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ForecastForm, type ForecastFormData } from "./forecast-form";
import { ForecastDisplay, type ForecastDisplayData } from "./forecast-display";
import { ForecastHistory } from "./forecast-history";
import { AdminEmptyState } from "@/components/portal/mission-control/ui";

interface StudentForecastTabProps {
  userId: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

function buildDiagnostic(form: ForecastFormData) {
  const diag: {
    faceAngleStdDevDeg?: Record<string, number>;
    ballSpeedScore?: number;
    pressureGapSg?: Record<string, number>;
  } = {};

  const face: Record<string, number> = {};
  if (form.faceAngleStdDevDegOtt > 0) face.OTT = form.faceAngleStdDevDegOtt;
  if (form.faceAngleStdDevDegApp > 0) face.APP = form.faceAngleStdDevDegApp;
  if (form.faceAngleStdDevDegArg > 0) face.ARG = form.faceAngleStdDevDegArg;
  if (form.faceAngleStdDevDegPutt > 0) face.PUTT = form.faceAngleStdDevDegPutt;
  if (Object.keys(face).length > 0) diag.faceAngleStdDevDeg = face;

  if (form.ballSpeedScore > 0) diag.ballSpeedScore = form.ballSpeedScore;

  const pressure: Record<string, number> = {};
  if (form.pressureGapSgOtt !== 0) pressure.OTT = form.pressureGapSgOtt;
  if (form.pressureGapSgApp !== 0) pressure.APP = form.pressureGapSgApp;
  if (form.pressureGapSgArg !== 0) pressure.ARG = form.pressureGapSgArg;
  if (form.pressureGapSgPutt !== 0) pressure.PUTT = form.pressureGapSgPutt;
  if (Object.keys(pressure).length > 0) diag.pressureGapSg = pressure;

  return Object.keys(diag).length > 0 ? diag : undefined;
}

export function StudentForecastTab({ userId }: StudentForecastTabProps) {
  const [latest, setLatest] = useState<ForecastDisplayData | null>(null);
  const [history, setHistory] = useState<ForecastDisplayData[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/admin/coaching-forecast?userId=${userId}&limit=5`);
      if (!res.ok) throw new Error("Kunne ikke hente forecasts");
      const data = await res.json();
      const forecasts: ForecastDisplayData[] = (data.forecasts ?? []).map((f: Record<string, unknown>) => ({
        ...f,
        deltaAllocationJson: (f.deltaAllocationJson as Record<string, number>) ?? {},
        hoursPerCategoryJson: (f.hoursPerCategoryJson as Record<string, { hours: number; ci95Low: number; ci95High: number }>) ?? {},
        techTactMentalPhysJson: (f.techTactMentalPhysJson as Record<string, { tek: number; tak: number; mental: number; fys: number }>) ?? {},
        rootCauseJson: (f.rootCauseJson as Record<string, string>) ?? {},
        recommendationsJson: (f.recommendationsJson as string[]) ?? [],
        assumptionsJson: (f.assumptionsJson as string[]) ?? [],
        confidenceInterval95: (f.confidenceInterval95 as [number, number]) ?? [0, 0],
      }));
      setHistory(forecasts);
      if (forecasts.length > 0) setLatest(forecasts[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  async function handleGenerate(form: ForecastFormData) {
    setGenerating(true);
    setError(null);
    try {
      const deadline = new Date(form.deadline);
      const body = {
        userId,
        targetScoreAvg: form.targetScoreAvg,
        deadline: deadline.toISOString(),
        avgCourseRating: form.avgCourseRating,
        avgSlopeRating: form.avgSlopeRating,
        hoursPerWeek: form.hoursPerWeek,
        age: form.age,
        diagnostic: buildDiagnostic(form),
      };

      const res = await fetch("/api/portal/admin/coaching-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Kunne ikke generere forecast");
      }

      const data = await res.json();
      const fc = data.forecast as ForecastDisplayData;
      setLatest(fc);
      await fetchHistory();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
    } finally {
      setGenerating(false);
    }
  }

  if (loading && history.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <ForecastForm initialAge={16} onSubmit={handleGenerate} isLoading={generating} />

      {error && (
        <div className="bg-error-light border border-error rounded-xl p-4 text-sm text-error-text">
          {error}
        </div>
      )}

      {latest ? (
        <ForecastDisplay forecast={latest} />
      ) : (
        <AdminEmptyState
          title="Ingen forecast ennå"
          description="Fyll ut skjemaet over for å generere første forecast for eleven."
        />
      )}

      <ForecastHistory forecasts={history} />
    </motion.div>
  );
}
