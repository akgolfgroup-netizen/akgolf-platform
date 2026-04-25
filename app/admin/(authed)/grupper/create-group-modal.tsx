"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";

const PERIOD_LABELS: Record<string, string> = {
  grunnperiode: "Grunnperiode",
  spesialiseringsperiode: "Spesialisering",
  turneringsperiode: "Turnering",
};

interface CreateGroupModalProps {
  name: string;
  setName: (s: string) => void;
  desc: string;
  setDesc: (s: string) => void;
  period: string;
  setPeriod: (s: string) => void;
  isPending: boolean;
  onCreate: () => void;
  onClose: () => void;
}

export function CreateGroupModal({
  name,
  setName,
  desc,
  setDesc,
  period,
  setPeriod,
  isPending,
  onCreate,
  onClose,
}: CreateGroupModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-on-surface/50" onClick={onClose} />
      <motion.div
        className="relative bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md p-6 shadow-card-hover"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        <h2 className="font-headline text-lg font-semibold text-on-surface mb-4">
          Ny treningsgruppe
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-on-surface-variant block mb-1">
              Navn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="F.eks. Junior Elite 2026"
            />
          </div>
          <div>
            <label className="text-sm text-on-surface-variant block mb-1">
              Beskrivelse
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Valgfri beskrivelse"
            />
          </div>
          <div>
            <label className="text-sm text-on-surface-variant block mb-1">
              Periode
            </label>
            <div className="flex gap-2">
              {[
                "grunnperiode",
                "spesialiseringsperiode",
                "turneringsperiode",
              ].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors border flex-1",
                    period === p
                      ? "bg-on-surface text-surface border-on-surface"
                      : "bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container",
                  )}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button className="flex-1" onClick={onCreate} isLoading={isPending}>
            Opprett
          </Button>
          <Button className="flex-1" variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
