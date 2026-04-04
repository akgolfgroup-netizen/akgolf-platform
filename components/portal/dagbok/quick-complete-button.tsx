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
        <CheckCircle2 className="w-3 h-3 text-[#2D6A4F]" />
      ) : (
        <Circle className="w-3 h-3 text-[var(--color-grey-400)]/40 hover:text-[#2D6A4F]" />
      )}
      <span className={done ? "text-[#2D6A4F]" : "text-[var(--color-grey-400)]/40"}>
        {done ? "Fullført" : "Fullfør"}
      </span>
    </button>
  );
}
