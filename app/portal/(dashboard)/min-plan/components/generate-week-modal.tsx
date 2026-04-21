"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { motion, AnimatePresence } from "framer-motion";
import { createSessionForWeek } from "../../treningsplan/actions";
import type { ForecastPlanSession } from "@/lib/ai/forecast-plan-allocator";

const DAY_NAMES: Record<number, string> = {
  1: "Mandag",
  2: "Tirsdag",
  3: "Onsdag",
  4: "Torsdag",
  5: "Fredag",
  6: "Lørdag",
  7: "Søndag",
};

interface GenerateWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ForecastPlanSession[];
  onSuccess: (count: number) => void;
}

export function GenerateWeekModal({
  isOpen,
  onClose,
  sessions,
  onSuccess,
}: GenerateWeekModalProps) {
  const [loading, setLoading] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [localSessions, setLocalSessions] = useState<ForecastPlanSession[]>(sessions);

  // Sync local sessions when prop changes
  if (sessions !== localSessions && sessions.length !== localSessions.length) {
    setLocalSessions(sessions);
  }

  async function handleApproveAll() {
    setLoading(true);
    let created = 0;
    try {
      for (const s of localSessions) {
        await createSessionForWeek({
          weekOffset: 0,
          dayOfWeek: s.dayOfWeek,
          title: s.title,
          description: s.description,
          durationMinutes: s.durationMinutes,
          focusArea: s.focusArea,
          startH: s.startH,
          startM: s.startM,
        });
        created++;
      }
      onSuccess(created);
      onClose();
    } catch (err) {
      console.error("Feil ved oppretting av økter:", err);
      alert("Kunne ikke opprette alle økter. Sjekk at du har en aktiv treningsplan.");
    } finally {
      setLoading(false);
    }
  }

  function updateSession(idx: number, patch: Partial<ForecastPlanSession>) {
    setLocalSessions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...patch } : s))
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-on-surface">
                    Foreslått ukeplan
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    Basert på din coaching forecast
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-surface-container transition-colors"
                >
                  <Icon name="close" className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>

              {/* Sessions */}
              <div className="space-y-3">
                {localSessions.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-4 space-y-2"
                  >
                    {editingIdx === idx ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-on-surface-variant block mb-1">
                            Tittel
                          </label>
                          <input
                            type="text"
                            value={s.title}
                            onChange={(e) =>
                              updateSession(idx, { title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-on-surface-variant block mb-1">
                              Dag
                            </label>
                            <select
                              value={s.dayOfWeek}
                              onChange={(e) =>
                                updateSession(idx, {
                                  dayOfWeek: parseInt(e.target.value),
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              {Object.entries(DAY_NAMES).map(([num, name]) => (
                                <option key={num} value={num}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-on-surface-variant block mb-1">
                              Varighet (min)
                            </label>
                            <input
                              type="number"
                              value={s.durationMinutes}
                              onChange={(e) =>
                                updateSession(idx, {
                                  durationMinutes: parseInt(e.target.value),
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-on-surface-variant block mb-1">
                            Beskrivelse
                          </label>
                          <textarea
                            value={s.description}
                            onChange={(e) =>
                              updateSession(idx, { description: e.target.value })
                            }
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingIdx(null)}
                          >
                            Ferdig
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {DAY_NAMES[s.dayOfWeek]}
                              </span>
                              <span className="text-xs text-on-surface-variant">
                                {s.durationMinutes} min
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-on-surface mt-1.5">
                              {s.title}
                            </h3>
                            <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-2">
                              {s.description}
                            </p>
                          </div>
                          <button
                            onClick={() => setEditingIdx(idx)}
                            className="p-1.5 rounded-lg hover:bg-surface-container transition-colors shrink-0"
                            title="Endre denne økten"
                          >
                            <Icon
                              name="edit"
                              className="w-4 h-4 text-on-surface-variant"
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex-1"
                  onClick={handleApproveAll}
                  isLoading={loading}
                  disabled={loading || localSessions.length === 0}
                >
                  <Icon
                    name="check_circle"
                    className="w-4 h-4 mr-2"
                  />
                  Godkjenn alle
                </Button>
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Avbryt
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
