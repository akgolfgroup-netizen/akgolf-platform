"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { logSession } from "@/app/portal/(dashboard)/dagbok/actions";

interface QuickCompleteButtonProps {
  sessionId: string;
  sessionDate: string; // ISO date string
  focusArea?: string | null;
  durationMinutes?: number | null;
  isLogged: boolean;
}

export function QuickCompleteButton({
  sessionId,
  sessionDate,
  focusArea,
  durationMinutes,
  isLogged,
}: QuickCompleteButtonProps) {
  const [done, setDone] = useState(isLogged);
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (done || loading) return;
    setLoading(true);
    try {
      await logSession({
        planSessionId: sessionId,
        date: sessionDate,
        focusArea: focusArea ?? undefined,
        durationMinutes: durationMinutes ?? undefined,
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleComplete}
      disabled={done || loading}
      title={done ? "Fullført" : "Marker som fullført"}
      className="mt-1 flex items-center gap-0.5 text-[10px] transition-opacity"
      style={{ opacity: loading ? 0.5 : 1 }}
    >
      {done ? (
        <CheckCircle2 className="w-3 h-3 text-green-400" />
      ) : (
        <Circle className="w-3 h-3 text-[var(--color-gold-dim)]/40 hover:text-green-400" />
      )}
      <span className={done ? "text-green-400" : "text-[var(--color-gold-dim)]/40"}>
        {done ? "Fullført" : "Fullfør"}
      </span>
    </button>
  );
}
