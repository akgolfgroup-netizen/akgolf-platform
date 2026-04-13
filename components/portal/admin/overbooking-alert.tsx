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
        className="flex items-start gap-3 p-4 bg-[#1A4D36]/10 rounded-xl border border-[#1A4D36]/20"
      >
        <CheckCircle className="w-5 h-5 text-[#1A4D36] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#0A1F18]">
            God kapasitet
          </p>
          <p className="text-xs text-[#5A6E66] mt-0.5">
            {expectedSessions} forventede okter ({hoursNeeded.toFixed(1)}t) -{" "}
            {availableHours.toFixed(1)}t tilgjengelig.{" "}
            <span className="font-medium text-[#1A4D36]">
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
        className="flex items-start gap-3 p-4 bg-[#C48A32]/10 rounded-xl border border-[#C48A32]/20"
      >
        <TrendingUp className="w-5 h-5 text-[#C48A32] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#0A1F18]">
            Nesten fullt
          </p>
          <p className="text-xs text-[#5A6E66] mt-0.5">
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
      className="flex items-start gap-3 p-4 bg-[#EF4444]/10 rounded-xl border border-[#EF4444]/20"
    >
      <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-[#0A1F18]">
          Overbooking-varsel
        </p>
        <p className="text-xs text-[#5A6E66] mt-0.5">
          {expectedSessions} forventede okter krever{" "}
          <span className="font-medium">{hoursNeeded.toFixed(1)}t</span>, men
          kun{" "}
          <span className="font-medium">{availableHours.toFixed(1)}t</span>{" "}
          tilgjengelig.{" "}
          <span className="font-medium text-[#EF4444]">
            Mangler {Math.abs(surplus).toFixed(1)}t
          </span>
        </p>
      </div>
    </motion.div>
  );
}
