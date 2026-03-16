"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronDown, ChevronUp, Zap, Loader2 } from "lucide-react";
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
    <div className="bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-[var(--color-gold)]">
              {format(new Date(session.sessionDate), "d. MMMM yyyy", { locale: nb })}
            </span>
            {hasAI && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20">
                <Zap className="w-2.5 h-2.5" /> Oppsummert
              </span>
            )}
          </div>
          <h3 className="font-medium text-[var(--color-snow)] text-sm">
            {session.primaryFocus ?? "Coachingsesjon"}
          </h3>
          <p className="text-xs text-[var(--color-gold-muted)] mt-0.5">
            {session.student.name} · Coach: {session.instructor.user.name}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {canGenerateAI && !hasAI && (
            <button
              onClick={handleGenerateAI}
              disabled={generating}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg-deep)] font-medium hover:bg-[var(--color-gold-muted)] transition-colors disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Zap className="w-3 h-3" />
              )}
              Generer oppsummering
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-[var(--color-border)] transition-colors text-[var(--color-gold-muted)]"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[var(--color-border)] pt-3">
          {session.studentNotes && (
            <div>
              <p className="text-xs font-semibold text-[var(--color-gold-muted)] uppercase tracking-wider mb-1">
                Notater
              </p>
              <p className="text-sm text-[var(--color-snow)]/80 whitespace-pre-wrap">
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
    </div>
  );
}
