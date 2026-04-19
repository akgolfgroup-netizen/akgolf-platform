"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { AISummaryBlock } from "./ai-summary-block";
import { MonoLabel } from "@/components/portal/patterns";
import { cn } from "@/lib/utils";

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
  const hasPrimaryFocus = Boolean(session.primaryFocus);
  const dotColor = hasAI ? "bg-ai" : hasPrimaryFocus ? "bg-primary" : "bg-grey-300";

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
    <article className="relative flex items-start gap-4 rounded-xl border border-black/6 bg-white p-5 shadow-card transition-all duration-300 hover:border-black/10 hover:shadow-card-hover">
      {/* Timeline dot + mono date */}
      <div className="flex w-[72px] shrink-0 flex-col items-start gap-2 pt-0.5">
        <MonoLabel size="xs" uppercase className="text-grey-500">
          {format(new Date(session.sessionDate), "d MMM", { locale: nb })}
        </MonoLabel>
        <MonoLabel size="xs" className="text-grey-400">
          {format(new Date(session.sessionDate), "HH:mm")}
        </MonoLabel>
      </div>

      <div className={cn("mt-1 h-2 w-2 shrink-0 rounded-full ring-2 ring-white", dotColor)} />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-semibold leading-tight tracking-tight text-grey-900">
            {session.primaryFocus ?? "Coachingsesjon"}
          </h3>
          {hasAI && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ai-light px-2 py-0.5 text-[10px] font-semibold text-ai-text">
              <Icon name="bolt" className="h-2.5 w-2.5" /> AI-oppsummert
            </span>
          )}
        </div>
        <p className="text-[12px] text-grey-500">
          {session.student.name} · Coach: {session.instructor.user.name}
          {session.instructor.title ? ` · ${session.instructor.title}` : ""}
        </p>

        {/* Expanded */}
        {expanded && (
          <div className="mt-4 space-y-3 border-t border-black/6 pt-4">
            {session.studentNotes && (
              <div>
                <MonoLabel size="xs" uppercase className="mb-1 block text-grey-500">
                  Notater
                </MonoLabel>
                <p className="whitespace-pre-wrap text-sm text-text">
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

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {canGenerateAI && !hasAI && (
          <button
            onClick={handleGenerateAI}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ai-light px-3 py-1.5 text-xs font-semibold text-ai-text transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {generating ? (
              <Icon name="progress_activity" className="h-3 w-3 animate-spin" />
            ) : (
              <Icon name="bolt" className="h-3 w-3" />
            )}
            Generer oppsummering
          </button>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-lg p-1.5 text-grey-400 transition-colors hover:bg-grey-50 hover:text-grey-700"
          aria-label={expanded ? "Skjul detaljer" : "Vis detaljer"}
        >
          {expanded ? (
            <Icon name="expand_less" className="h-4 w-4" />
          ) : (
            <Icon name="expand_more" className="h-4 w-4" />
          )}
        </button>
      </div>
    </article>
  );
}
