"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

interface ManualPlanModalProps {
  open: boolean;
  onClose: () => void;
  studentId?: string;
}

export function ManualPlanModal({ open, onClose, studentId }: ManualPlanModalProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: implement manual plan creation
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-on-surface">Lag manuell plan</h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface transition-colors">
                <Icon name="close" className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Tittel</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="F.eks. Forberedelse til sesongstart"
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              {studentId && (
                <p className="text-xs text-on-surface-variant">Student-ID: {studentId}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:text-on-surface"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-full bg-on-surface text-surface text-sm font-medium hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Lagrer..." : "Opprett plan"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
