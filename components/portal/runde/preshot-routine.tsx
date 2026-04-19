"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Brain, 
  Wind, 
  Zap,
  Play,
  Pause,
  RotateCcw,
  Target,
  Focus
} from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { cn } from "@/lib/utils";

interface PreShotRoutineProps {
  onComplete: (data: {
    visualized: boolean;
    breathed: boolean;
    triggered: boolean;
    timeSeconds: number;
    focusLevel: number;
    commitmentLevel: number;
  }) => void;
  onClose: () => void;
  className?: string;
}

const STEPS = [
  { 
    id: "visualize", 
    label: "Visualisering", 
    description: "Se ballbanen tydelig for deg",
    icon: Brain 
  },
  { 
    id: "breathe", 
    label: "Pust", 
    description: "Dyp inn og langsomt ut",
    icon: Wind 
  },
  { 
    id: "trigger", 
    label: "Trigger", 
    description: "Din faste rutine før slaget",
    icon: Zap 
  },
];

export function PreShotRoutine({ onComplete, onClose, className }: PreShotRoutineProps) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isTiming, setIsTiming] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [focusLevel, setFocusLevel] = useState(5);
  const [commitmentLevel, setCommitmentLevel] = useState(5);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTiming) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTiming]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleStep = (stepId: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompleted(newCompleted);
  };

  const handleComplete = () => {
    onComplete({
      visualized: completed.has("visualize"),
      breathed: completed.has("breathe"),
      triggered: completed.has("trigger"),
      timeSeconds: elapsedTime,
      focusLevel,
      commitmentLevel,
    });
  };

  const allStepsCompleted = completed.size === STEPS.length;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        <PremiumCard padding="lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-black">Pre-shot rutine</h3>
                <p className="text-xs text-grey-400">Mental forberedelse</p>
              </div>
            </div>
            
            {/* Timer */}
            <button
              onClick={() => setIsTiming(!isTiming)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                isTiming 
                  ? "bg-green-100 text-green-700" 
                  : "bg-grey-100 text-grey-600 hover:bg-grey-200"
              )}
            >
              {isTiming ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {formatTime(elapsedTime)}
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 bg-grey-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completed.size / STEPS.length) * 100}%` }}
                className="h-full bg-purple-500 rounded-full"
              />
            </div>
            <p className="text-xs text-grey-400 mt-2 text-center">
              {completed.size} av {STEPS.length} steg fullført
            </p>
          </div>

          {/* Steps checklist */}
          <div className="space-y-3 mb-6">
            {STEPS.map((s, idx) => {
              const isCompleted = completed.has(s.id);
              const Icon = s.icon;

              return (
                <motion.button
                  key={s.id}
                  onClick={() => toggleStep(s.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                    isCompleted
                      ? "border-purple-200 bg-purple-50"
                      : "border-grey-200 hover:border-purple-200"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isCompleted ? "bg-purple-500" : "bg-grey-100"
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className="w-5 h-5 text-grey-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-semibold transition-colors",
                      isCompleted ? "text-purple-900" : "text-black"
                    )}>
                      {idx + 1}. {s.label}
                    </p>
                    <p className="text-xs text-grey-400">{s.description}</p>
                  </div>
                  <Circle className={cn(
                    "w-5 h-5 transition-colors",
                    isCompleted ? "text-purple-500 fill-purple-500" : "text-grey-300"
                  )} />
                </motion.button>
              );
            })}
          </div>

          {/* Focus & Commitment sliders */}
          <div className="space-y-4 mb-6 p-4 bg-grey-50 rounded-xl">
            {/* Focus level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-grey-700 flex items-center gap-2">
                  <Focus className="w-4 h-4" />
                  Fokus-nivå
                </label>
                <span className="text-sm font-bold text-black">{focusLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={focusLevel}
                onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Commitment level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-grey-700 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Commitment
                </label>
                <span className="text-sm font-bold text-black">{commitmentLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={commitmentLevel}
                onChange={(e) => setCommitmentLevel(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setElapsedTime(0);
                setCompleted(new Set());
                setIsTiming(false);
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-grey-600 hover:bg-grey-100 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Nullstill
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-grey-600 bg-grey-100 hover:bg-grey-200 transition-colors"
            >
              Avbryt
            </button>
            
            <button
              onClick={handleComplete}
              disabled={!allStepsCompleted}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors",
                allStepsCompleted
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-grey-200 text-grey-400 cursor-not-allowed"
              )}
            >
              Fullfør
            </button>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
}
