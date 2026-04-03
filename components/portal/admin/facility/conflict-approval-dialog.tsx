"use client";

import { useState } from "react";
import { AlertTriangle, X, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface ConflictingItem {
  type: "booking" | "activity";
  id: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string;
}

interface Props {
  isOpen: boolean;
  activityTitle: string;
  conflicts: ConflictingItem[];
  onConfirm: (note?: string) => void;
  onCancel: () => void;
}

export function ConflictApprovalDialog({
  isOpen,
  activityTitle,
  conflicts,
  onConfirm,
  onCancel,
}: Props) {
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-grey-200)] bg-[#FF9500]/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF9500]/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#FF9500]" />
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-grey-900)]">
                  Konflikt oppdaget
                </h2>
              </div>
              <button
                onClick={onCancel}
                className="p-2 rounded-lg text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-[var(--color-grey-600)]">
                Aktiviteten <strong className="text-[var(--color-grey-900)]">&quot;{activityTitle}&quot;</strong>{" "}
                overlapper med {conflicts.length}{" "}
                {conflicts.length === 1 ? "eksisterende oppføring" : "eksisterende oppføringer"}:
              </p>

              {/* Conflict list */}
              <div className="max-h-48 overflow-y-auto space-y-2">
                {conflicts.map((conflict) => {
                  const start = new Date(conflict.startTime);
                  const end = new Date(conflict.endTime);
                  return (
                    <div
                      key={conflict.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          conflict.type === "booking" ? "bg-[#86868B]" : "bg-[#007AFF]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--color-grey-900)] truncate">
                          {conflict.title}
                        </p>
                        <p className="text-xs text-[var(--color-grey-500)]">
                          {format(start, "d. MMM", { locale: nb })}{" "}
                          {format(start, "HH:mm")} - {format(end, "HH:mm")}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-grey-200)] text-[var(--color-grey-600)]">
                        {conflict.type === "booking" ? "Booking" : "Aktivitet"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-2">
                  Notat (valgfritt)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Legg til en forklaring på hvorfor konflikten godkjennes..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 py-4 border-t border-[var(--color-grey-200)] bg-[var(--color-grey-50)]">
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-grey-200)] text-[var(--color-grey-700)] font-medium hover:bg-white transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Avbryt
              </button>
              <button
                onClick={() => onConfirm(note || undefined)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FF9500] text-white font-medium hover:bg-[#E88800] transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Godkjenn likevel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
