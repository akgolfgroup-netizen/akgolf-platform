"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import { PostSessionUpload } from "./post-session-upload";
import { SummaryEditor, type SummaryDraft } from "./summary-editor";

interface StudentSummaryTabProps {
  studentId: string;
  studentName: string;
}

interface SessionListItem {
  id: string;
  sessionDate: string;
  hasSummary: boolean;
  publishedToStudent: boolean;
  primaryFocus: string | null;
}

export function StudentSummaryTab({ studentId, studentName }: StudentSummaryTabProps) {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<SummaryDraft | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(
        `/api/portal/admin/coaching-session?studentId=${studentId}`
      );
      if (resp.ok) {
        const data = await resp.json();
        setSessions(data.sessions ?? []);
        if (data.sessions?.length > 0 && !selectedId) {
          setSelectedId(data.sessions[0].id);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [studentId, selectedId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const loadDraft = useCallback(async (sessionId: string) => {
    const resp = await fetch(`/api/portal/admin/coaching-session/${sessionId}`);
    if (resp.ok) {
      const data = await resp.json();
      setDraft(data.draft);
    }
  }, []);

  useEffect(() => {
    if (selectedId) loadDraft(selectedId);
  }, [selectedId, loadDraft]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      {/* Session list + upload */}
      <div className="space-y-4">
        <PostSessionUpload
          studentName={studentName}
          sessionId={selectedId ?? undefined}
          onComplete={({ sessionId }) => {
            loadSessions();
            setSelectedId(sessionId);
          }}
        />

        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-4">
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-3">
            Tidligere økter
          </div>
          {loading ? (
            <div className="text-sm text-on-surface-variant">Laster...</div>
          ) : sessions.length === 0 ? (
            <div className="text-sm text-on-surface-variant">Ingen økter enda.</div>
          ) : (
            <div className="space-y-1">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full text-left rounded-lg px-3 py-2 transition-colors ${
                    selectedId === s.id
                      ? "bg-primary/10 text-on-surface"
                      : "hover:bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold">
                      {new Date(s.sessionDate).toLocaleDateString("no-NO")}
                    </div>
                    <div className="flex items-center gap-1">
                      {s.hasSummary && (
                        <Icon
                          name={s.publishedToStudent ? "check_circle" : "drafts"}
                          size={14}
                          className={
                            s.publishedToStudent ? "text-primary" : "text-on-surface-variant"
                          }
                          filled
                        />
                      )}
                    </div>
                  </div>
                  {s.primaryFocus && (
                    <div className="text-xs text-on-surface-variant truncate">
                      {s.primaryFocus}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div>
        {draft ? (
          <SummaryEditor draft={draft} studentName={studentName} />
        ) : selectedId ? (
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-8 text-center">
            <div className="text-sm text-on-surface-variant">Laster utkast...</div>
          </div>
        ) : (
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-8 text-center">
            <Icon
              name="auto_awesome"
              size={32}
              className="text-on-surface-variant mx-auto mb-2"
            />
            <div className="text-sm font-semibold text-on-surface">Ingen økt valgt</div>
            <div className="text-xs text-on-surface-variant mt-1">
              Last opp et lydopptak for å generere sammendrag.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
