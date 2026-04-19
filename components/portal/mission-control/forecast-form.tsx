"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { motion } from "framer-motion";

import { AdminInput } from "@/components/portal/mission-control/ui";

export interface ForecastFormData {
  targetScoreAvg: number;
  deadline: string;
  avgCourseRating: number;
  avgSlopeRating: number;
  hoursPerWeek: number;
  age: number;
  faceAngleStdDevDegOtt: number;
  faceAngleStdDevDegApp: number;
  faceAngleStdDevDegArg: number;
  faceAngleStdDevDegPutt: number;
  ballSpeedScore: number;
  pressureGapSgOtt: number;
  pressureGapSgApp: number;
  pressureGapSgArg: number;
  pressureGapSgPutt: number;
}

interface ForecastFormProps {
  initialAge: number;
  onSubmit: (data: ForecastFormData) => void;
  isLoading: boolean;
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function ForecastForm({ initialAge, onSubmit, isLoading }: ForecastFormProps) {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [form, setForm] = useState<ForecastFormData>({
    targetScoreAvg: 72,
    deadline: getDefaultDeadline(),
    avgCourseRating: 71,
    avgSlopeRating: 125,
    hoursPerWeek: 12,
    age: initialAge,
    faceAngleStdDevDegOtt: 0,
    faceAngleStdDevDegApp: 0,
    faceAngleStdDevDegArg: 0,
    faceAngleStdDevDegPutt: 0,
    ballSpeedScore: 50,
    pressureGapSgOtt: 0,
    pressureGapSgApp: 0,
    pressureGapSgArg: 0,
    pressureGapSgPutt: 0,
  });

  function getDefaultDeadline(): string {
    const d = new Date();
    d.setDate(d.getDate() + 52 * 7);
    return d.toISOString().slice(0, 10);
  }

  function handleChange(key: keyof ForecastFormData, value: string) {
    const numKeys: (keyof ForecastFormData)[] = [
      "targetScoreAvg",
      "avgCourseRating",
      "avgSlopeRating",
      "hoursPerWeek",
      "age",
      "faceAngleStdDevDegOtt",
      "faceAngleStdDevDegApp",
      "faceAngleStdDevDegArg",
      "faceAngleStdDevDegPutt",
      "ballSpeedScore",
      "pressureGapSgOtt",
      "pressureGapSgApp",
      "pressureGapSgArg",
      "pressureGapSgPutt",
    ];
    if (numKeys.includes(key)) {
      setForm((f) => ({ ...f, [key]: value === "" ? 0 : Number(value) }));
    } else {
      setForm((f) => ({ ...f, [key]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <motion.form
      variants={item}
      initial="hidden"
      animate="show"
      onSubmit={handleSubmit}
      className="bg-white border border-grey-200 rounded-xl p-6 space-y-5"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-black">
        <Icon name="my_location" className="w-4 h-4 text-primary" />
        Ny forecast
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-grey-400 mb-1.5">
            Mål-score (snitt)
          </label>
          <AdminInput
            type="number"
            min={50}
            max={120}
            value={form.targetScoreAvg}
            onChange={(e) => handleChange("targetScoreAvg", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-grey-400 mb-1.5">
            Deadline
          </label>
          <AdminInput
            type="date"
            value={form.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-grey-400 mb-1.5">
            Timer/uke
          </label>
          <AdminInput
            type="number"
            min={0}
            max={50}
            value={form.hoursPerWeek}
            onChange={(e) => handleChange("hoursPerWeek", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-grey-400 mb-1.5">
            Course Rating
          </label>
          <AdminInput
            type="number"
            min={50}
            max={85}
            step={0.1}
            value={form.avgCourseRating}
            onChange={(e) => handleChange("avgCourseRating", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-grey-400 mb-1.5">
            Slope Rating
          </label>
          <AdminInput
            type="number"
            min={55}
            max={155}
            value={form.avgSlopeRating}
            onChange={(e) => handleChange("avgSlopeRating", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-grey-400 mb-1.5">
            Alder
          </label>
          <AdminInput
            type="number"
            min={8}
            max={80}
            value={form.age}
            onChange={(e) => handleChange("age", e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowDiagnostic((s) => !s)}
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-alt transition-colors"
      >
        {showDiagnostic ? <Icon name="expand_less" className="w-3.5 h-3.5" /> : <Icon name="expand_more" className="w-3.5 h-3.5" />}
        Diagnostisk data (valgfritt)
      </button>

      {showDiagnostic && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4 border-t border-grey-100 pt-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-grey-400 mb-1.5">
                Face angle std dev — OTT (°)
              </label>
              <AdminInput
                type="number"
                min={0}
                step={0.1}
                value={form.faceAngleStdDevDegOtt}
                onChange={(e) => handleChange("faceAngleStdDevDegOtt", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-grey-400 mb-1.5">
                Face angle std dev — APP (°)
              </label>
              <AdminInput
                type="number"
                min={0}
                step={0.1}
                value={form.faceAngleStdDevDegApp}
                onChange={(e) => handleChange("faceAngleStdDevDegApp", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-grey-400 mb-1.5">
                Ball speed score (0–100)
              </label>
              <AdminInput
                type="number"
                min={0}
                max={100}
                value={form.ballSpeedScore}
                onChange={(e) => handleChange("ballSpeedScore", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-grey-400 mb-1.5">
                Press-gap SG — APP
              </label>
              <AdminInput
                type="number"
                step={0.1}
                value={form.pressureGapSgApp}
                onChange={(e) => handleChange("pressureGapSgApp", e.target.value)}
              />
            </div>
          </div>
        </motion.div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[20px] text-sm font-semibold bg-primary text-white hover:bg-primary-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Genererer..." : "Generer forecast"}
        </button>
      </div>
    </motion.form>
  );
}
