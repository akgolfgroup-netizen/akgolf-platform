"use client";

import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface OverbookingAlertProps {
  expectedSessions: number;
  availableHours: number;
  sessionDurationMinutes?: number;
}

export function OverbookingAlert({
  expectedSessions,
  availableHours,
  sessionDurationMinutes = 50,
}: OverbookingAlertProps) {
  // Beregn hvor mange timer som trengs
  const hoursNeeded = (expectedSessions * sessionDurationMinutes) / 60;
  const surplus = availableHours - hoursNeeded;
  const isOverbooked = surplus < 0;
  const isAtCapacity = surplus >= 0 && surplus < 2;

  if (expectedSessions === 0) {
    return null;
  }

  if (!isOverbooked && !isAtCapacity) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 p-4 bg-[var(--color-success)]/10 rounded-xl border border-[var(--color-success)]/20"
      >
        <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[var(--color-grey-900)]">
            God kapasitet
          </p>
          <p className="text-xs text-[var(--color-grey-600)] mt-0.5">
            {expectedSessions} forventede okter ({hoursNeeded.toFixed(1)}t) -{" "}
            {availableHours.toFixed(1)}t tilgjengelig.{" "}
            <span className="font-medium text-[var(--color-success)]">
              +{surplus.toFixed(1)}t buffer
            </span>
          </p>
        </div>
      </motion.div>
    );
  }

  if (isAtCapacity) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 p-4 bg-[var(--color-warning)]/10 rounded-xl border border-[var(--color-warning)]/20"
      >
        <TrendingUp className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[var(--color-grey-900)]">
            Nesten fullt
          </p>
          <p className="text-xs text-[var(--color-grey-600)] mt-0.5">
            {expectedSessions} forventede okter ({hoursNeeded.toFixed(1)}t) mot{" "}
            {availableHours.toFixed(1)}t tilgjengelig. Lite margin.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-4 bg-[var(--color-error)]/10 rounded-xl border border-[var(--color-error)]/20"
    >
      <AlertTriangle className="w-5 h-5 text-[var(--color-error)] flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-[var(--color-grey-900)]">
          Overbooking-varsel
        </p>
        <p className="text-xs text-[var(--color-grey-600)] mt-0.5">
          {expectedSessions} forventede okter krever{" "}
          <span className="font-medium">{hoursNeeded.toFixed(1)}t</span>, men
          kun{" "}
          <span className="font-medium">{availableHours.toFixed(1)}t</span>{" "}
          tilgjengelig.{" "}
          <span className="font-medium text-[var(--color-error)]">
            Mangler {Math.abs(surplus).toFixed(1)}t
          </span>
        </p>
      </div>
    </motion.div>
  );
}
