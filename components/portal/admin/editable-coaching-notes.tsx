"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Pencil, X, Save, Loader2 } from "lucide-react";
import { updateCoachingNotes } from "@/app/portal/(dashboard)/admin/elever/[id]/actions";

interface CoachingSession {
  id: string;
  sessionDate: Date | string;
  primaryFocus: string | null;
  instructorNotes: string | null;
  aiKeyPoints: string[];
  progressRating: number | null;
}

interface Props {
  session: CoachingSession;
}

export function EditableCoachingNotes({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(session.instructorNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateCoachingNotes(session.id, notes);
      if (!result.success) {
        setError(result.error ?? "Kunne ikke lagre notater");
        return;
      }
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      setError("Noe gikk galt");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setNotes(session.instructorNotes ?? "");
    setError(null);
    setIsOpen(false);
  };

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-800">
            {format(new Date(session.sessionDate), "d. MMMM yyyy", {
              locale: nb,
            })}
          </p>
          <div className="flex items-center gap-2">
            {session.progressRating && (
              <span className="text-xs text-gray-500">
                Progresjon: {session.progressRating}/10
              </span>
            )}
            <button
              onClick={() => setIsOpen(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#B8975C]"
              title="Rediger notater"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
        {session.primaryFocus && (
          <p className="text-xs text-gray-500 mb-1">
            Fokus: {session.primaryFocus}
          </p>
        )}
        {session.instructorNotes && (
          <p className="text-xs text-gray-600 mb-2 whitespace-pre-wrap">
            {session.instructorNotes}
          </p>
        )}
        {session.aiKeyPoints.length > 0 && (
          <ul className="mt-2 space-y-1">
            {session.aiKeyPoints.map((point, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                <span className="text-[#B8975C]">•</span>
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sheet/Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />

          {/* Sheet */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--color-deep-ink)] shadow-xl z-50 flex flex-col border-l border-[rgba(15,41,80,0.4)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(15,41,80,0.4)]">
              <h2 className="text-lg font-semibold text-[var(--color-snow)]">
                Rediger coaching-notater
              </h2>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-[rgba(15,41,80,0.3)] transition-colors text-[var(--color-snow)]/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Session info */}
              <div className="space-y-2">
                <p className="text-sm text-[var(--color-snow)]">
                  <span className="text-[var(--color-snow)]/50">Dato: </span>
                  {format(new Date(session.sessionDate), "EEEE d. MMMM yyyy", {
                    locale: nb,
                  })}
                </p>
                {session.primaryFocus && (
                  <p className="text-sm text-[var(--color-snow)]">
                    <span className="text-[var(--color-snow)]/50">Fokus: </span>
                    {session.primaryFocus}
                  </p>
                )}
              </div>

              {/* Notes textarea */}
              <div>
                <label className="text-xs font-medium text-[var(--color-snow)]/50 mb-2 block">
                  Instruktor-notater
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={10}
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none text-[var(--color-snow)] placeholder:text-[var(--color-snow)]/40 bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
                  placeholder="Skriv notater fra coaching-okten..."
                />
              </div>

              {/* AI Key Points (read-only) */}
              {session.aiKeyPoints.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-[var(--color-snow)]/50 mb-2 block">
                    AI-genererte hovedpunkter
                  </label>
                  <ul className="space-y-1">
                    {session.aiKeyPoints.map((point, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--color-snow)]/70 flex gap-2"
                      >
                        <span className="text-[var(--color-gold)]">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-sm text-[#FCA5A5] bg-[rgba(239,68,68,0.15)] rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-[rgba(15,41,80,0.4)] p-6 flex gap-3">
              <button
                onClick={handleClose}
                disabled={saving}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-[var(--color-snow)]/70 bg-[rgba(15,41,80,0.3)] rounded-xl hover:bg-[rgba(15,41,80,0.4)] disabled:opacity-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-gold)] rounded-xl hover:bg-[var(--color-gold)]/90 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Lagrer...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lagre
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
