"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { AISummaryBlock } from "./ai-summary-block";

interface SessionCardProps {
  session: {
    id: string;
    sessionDate: Date;
    primaryFocus?: string | null;
    instructorNotes?: string | null;
    studentNotes?: string | null;
    aiKeyPoints: string[];
    aiFocusAreas: string[];
    aiActionItems: string[];
    aiGeneratedAt?: Date | null;
    student: { name?: string | null; image?: string | null };
    instructor: { user: { name?: string | null }; title?: string | null };
  };
  canGenerateAI?: boolean;
}

export function SessionCard({ session, canGenerateAI }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiData, setAiData] = useState({
    keyPoints: session.aiKeyPoints,
    focusAreas: session.aiFocusAreas,
    actionItems: session.aiActionItems,
    generatedAt: session.aiGeneratedAt,
  });

  const hasAI = aiData.keyPoints.length > 0;

  async function handleGenerateAI() {
    setGenerating(true);
    const res = await fetch("/api/ai/coaching-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setAiData({ ...data, generatedAt: new Date() });
      setExpanded(true);
    }
    setGenerating(false);
  }

  return (
    <article className="group overflow-hidden rounded-[24px] border border-black/5 bg-white transition-all duration-300 hover:border-[var(--color-primary)]/20 hover:shadow-[0_12px_40px_-12px_rgba(0,88,64,0.15)]">
      {/* Header */}
      <div className="flex items-start gap-3 p-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-transform group-hover:scale-110">
          <MessageSquare className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              {format(new Date(session.sessionDate), "d. MMMM yyyy", {
                locale: nb,
              })}
            </span>
            {hasAI && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ai)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-ai)]">
                <Zap className="h-2.5 w-2.5" /> AI-oppsummert
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold leading-tight tracking-tight text-[var(--color-text)]">
            {session.primaryFocus ?? "Coachingsesjon"}
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {session.student.name} · Coach: {session.instructor.user.name}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {canGenerateAI && !hasAI && (
            <button
              onClick={handleGenerateAI}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-ai)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-ai)] transition-colors hover:bg-[var(--color-ai)]/15 disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Zap className="h-3 w-3" />
              )}
              Generer oppsummering
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)]"
            aria-label={expanded ? "Skjul detaljer" : "Vis detaljer"}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="space-y-3 border-t border-black/5 bg-[var(--color-surface)]/30 px-5 py-4">
          {session.studentNotes && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Notater
              </p>
              <p className="whitespace-pre-wrap text-sm text-[var(--color-text)]">
                {session.studentNotes}
              </p>
            </div>
          )}

          {hasAI && (
            <AISummaryBlock
              keyPoints={aiData.keyPoints}
              focusAreas={aiData.focusAreas}
              actionItems={aiData.actionItems}
              generatedAt={aiData.generatedAt}
            />
          )}
        </div>
      )}
    </article>
  );
}
