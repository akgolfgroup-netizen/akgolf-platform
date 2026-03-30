"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { RoundInputSheet } from "@/components/portal/statistikk/round-input-sheet";

export function StatistikkClient() {
  const [showInput, setShowInput] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowInput(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-grey-900)] text-[var(--color-grey-900)] text-sm font-semibold hover:bg-[var(--color-grey-500)] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Legg til runde
      </button>
      <AnimatePresence>
        {showInput && <RoundInputSheet onClose={() => setShowInput(false)} />}
      </AnimatePresence>
    </>
  );
}
