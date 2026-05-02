"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useCallback } from "react";

import type { TrainingSession, Exercise } from "./types";

interface SessionDetailModalProps {
  session: TrainingSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: TrainingSession) => Promise<void>;
  onDelete?: (sessionId: string) => Promise<void>;
}

// Fargekoding for fokusområder
const FOCUS_COLORS: Record<TrainingSession["focus"], { bg: string; border: string; text: string; dot: string }> = {
  FYS: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", dot: "bg-blue-500" },
  TEK: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-500" },
  SLAG: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", dot: "bg-amber-500" },
  SPILL: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", dot: "bg-orange-500" },
  TURN: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", dot: "bg-red-500" },
};

const FOCUS_LABELS: Record<TrainingSession["focus"], string> = {
  FYS: "Fysisk",
  TEK: "Teknikk",
  SLAG: "Slag",
  SPILL: "Spill",
  TURN: "Turnering",
};

const FOCUS_OPTIONS: TrainingSession["focus"][] = ["FYS", "TEK", "SLAG", "SPILL", "TURN"];

// Læringsfase alternativer
const L_PHASE_OPTIONS = [
  { value: "L-KROPP", label: "L-KROPP (Kropp)" },
  { value: "L-ARM", label: "L-ARM (Armer)" },
  { value: "L-KOLLE", label: "L-KOLLE (Kølle)" },
  { value: "L-BALL", label: "L-BALL (Ball)" },
  { value: "L-AUTO", label: "L-AUTO (Autonom)" },
];

// Miljø alternativer
const M_OPTIONS = [
  { value: "M0", label: "M0 - Ingen ball" },
  { value: "M1", label: "M1 - Puttematte" },
  { value: "M2", label: "M2 - Range matte" },
  { value: "M3", label: "M3 - Range gress" },
  { value: "M4", label: "M4 - Baneøvelse" },
  { value: "M5", label: "M5 - Turneringsbane" },
];

// Press alternativer
const PR_OPTIONS = [
  { value: "PR1", label: "PR1 - Teknisk fokus" },
  { value: "PR2", label: "PR2 - Low pressure" },
  { value: "PR3", label: "PR3 - Medium pressure" },
  { value: "PR4", label: "PR4 - High pressure" },
  { value: "PR5", label: "PR5 - Konkurranse" },
];

export function SessionDetailModal({ session, isOpen, onClose, onSave, onDelete }: SessionDetailModalProps) {
  const [editedSession, setEditedSession] = useState<TrainingSession | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize edited session when modal opens
  if (isOpen && session && !editedSession) {
    setEditedSession({ ...session });
  }

  const handleClose = useCallback(() => {
    setEditedSession(null);
    setIsSaving(false);
    setIsDeleting(false);
    onClose();
  }, [onClose]);

  const handleSave = useCallback(async () => {
    if (!editedSession) return;
    
    setIsSaving(true);
    try {
      await onSave(editedSession);
      handleClose();
    } catch (error) {
      console.error("Failed to save session:", error);
    } finally {
      setIsSaving(false);
    }
  }, [editedSession, onSave, handleClose]);

  const handleDelete = useCallback(async () => {
    if (!editedSession || !onDelete) return;
    
    if (!confirm("Er du sikker på at du vil slette denne økten?")) return;
    
    setIsDeleting(true);
    try {
      await onDelete(editedSession.id);
      handleClose();
    } catch (error) {
      console.error("Failed to delete session:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [editedSession, onDelete, handleClose]);

  const updateField = useCallback(<K extends keyof TrainingSession>(field: K, value: TrainingSession[K]) => {
    setEditedSession(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const updateExercise = useCallback((index: number, field: keyof Exercise, value: string | null) => {
    setEditedSession(prev => {
      if (!prev) return null;
      const newExercises = [...prev.exercises];
      newExercises[index] = { ...newExercises[index], [field]: value };
      return { ...prev, exercises: newExercises };
    });
  }, []);

  if (!isOpen || !editedSession) return null;

  const colors = FOCUS_COLORS[editedSession.focus];
  const startTime = `${editedSession.startH.toString().padStart(2, "0")}:${editedSession.startM.toString().padStart(2, "0")}`;
  const endH = Math.floor((editedSession.startH * 60 + editedSession.startM + editedSession.duration) / 60);
  const endM = (editedSession.startH * 60 + editedSession.startM + editedSession.duration) % 60;
  const endTime = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0F172A] rounded-xl border border-inverse-on-surface/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inverse-on-surface/20">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
            <h2 className="text-xl font-semibold text-inverse-on-surface">
              Øktdetaljer
            </h2>
            {editedSession.completed && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                <Icon name="check_circle" className="w-3 h-3" />
                Fullført
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-inverse-surface rounded-lg text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Title & Time Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-inverse-on-surface/60 mb-2">
                Tittel
              </label>
              <input
                type="text"
                value={editedSession.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full px-3 py-2 bg-inverse-surface border border-inverse-on-surface/20 rounded-lg text-inverse-on-surface placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-inverse-on-surface/60 mb-2">
                Fokusområde
              </label>
              <select
                value={editedSession.focus}
                onChange={(e) => updateField("focus", e.target.value as TrainingSession["focus"])}
                className="w-full px-3 py-2 bg-inverse-surface border border-inverse-on-surface/20 rounded-lg text-inverse-on-surface focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              >
                {FOCUS_OPTIONS.map((focus) => (
                  <option key={focus} value={focus}>
                    {FOCUS_LABELS[focus]} ({focus})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration & Time */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-inverse-on-surface/60 mb-2">
                <span className="flex items-center gap-1">
                  <Icon name="schedule" className="w-4 h-4" />
                  Varighet (min)
                </span>
              </label>
              <input
                type="number"
                min={5}
                max={480}
                step={5}
                value={editedSession.duration}
                onChange={(e) => updateField("duration", parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 bg-inverse-surface border border-inverse-on-surface/20 rounded-lg text-inverse-on-surface focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-inverse-on-surface/60 mb-2">
                Starttid
              </label>
              <div className="px-3 py-2 bg-inverse-surface/50 border border-inverse-on-surface/20 rounded-lg text-inverse-on-surface/50">
                {startTime}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-inverse-on-surface/60 mb-2">
                Sluttid
              </label>
              <div className="px-3 py-2 bg-inverse-surface/50 border border-inverse-on-surface/20 rounded-lg text-inverse-on-surface/50">
                {endTime}
              </div>
            </div>
          </div>

          {/* Exercise Count Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Icon name="fitness_center" className="w-4 h-4 text-inverse-on-surface/60" />
            <span className="text-sm text-inverse-on-surface/50">
              {editedSession.exercises.length} øvelse{editedSession.exercises.length !== 1 ? "r" : ""}
            </span>
          </div>

          {/* Exercises List */}
          {editedSession.exercises.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-inverse-on-surface/60 uppercase tracking-wider">
                Øvelser
              </h3>
              
              {editedSession.exercises.map((exercise, index) => (
                <div 
                  key={exercise.id}
                  className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-medium ${colors.text}`}>
                      {index + 1}. {exercise.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-inverse-surface text-inverse-on-surface/60">
                      {exercise.pyramid}
                    </span>
                  </div>
                  
                  {/* L-M-PR Parameters */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-inverse-on-surface/70 mb-1">
                        Læringsfase
                      </label>
                      <select
                        value={exercise.lPhase || ""}
                        onChange={(e) => updateExercise(index, "lPhase", e.target.value || null)}
                        className="w-full px-2 py-1.5 bg-inverse-surface border border-inverse-on-surface/20 rounded text-xs text-inverse-on-surface/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      >
                        <option value="">Velg...</option>
                        {L_PHASE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-inverse-on-surface/70 mb-1">
                        Miljø
                      </label>
                      <select
                        value={exercise.m || ""}
                        onChange={(e) => updateExercise(index, "m", e.target.value || null)}
                        className="w-full px-2 py-1.5 bg-inverse-surface border border-inverse-on-surface/20 rounded text-xs text-inverse-on-surface/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      >
                        <option value="">Velg...</option>
                        {M_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-inverse-on-surface/70 mb-1">
                        Press
                      </label>
                      <select
                        value={exercise.pr || ""}
                        onChange={(e) => updateExercise(index, "pr", e.target.value || null)}
                        className="w-full px-2 py-1.5 bg-inverse-surface border border-inverse-on-surface/20 rounded text-xs text-inverse-on-surface/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      >
                        <option value="">Velg...</option>
                        {PR_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Area */}
                  <div className="mt-2">
                    <span className="text-xs text-inverse-on-surface/70">
                      Område: <span className="text-inverse-on-surface/60">{exercise.area || "-"}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editedSession.exercises.length === 0 && (
            <div className="text-center py-8 bg-inverse-surface/30 rounded-lg border border-inverse-on-surface/20/50 border-dashed">
              <Icon name="my_location" className="w-8 h-8 text-inverse-on-surface/60 mx-auto mb-2" />
              <p className="text-inverse-on-surface/70 text-sm">Ingen øvelser i denne økten</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-inverse-on-surface/20 bg-inverse-surface/50">
          {onDelete ? (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <Icon name="delete" className="w-4 h-4" />
              {isDeleting ? "Sletter..." : "Slett"}
            </button>
          ) : (
            <div />
          )}
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-inverse-on-surface/60 hover:text-inverse-on-surface hover:bg-inverse-surface rounded-lg transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-surface rounded-lg transition-colors disabled:opacity-50"
            >
              <Icon name="save" className="w-4 h-4" />
              {isSaving ? "Lagrer..." : "Lagre"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
