"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { LogSessionSheet } from "./log-session-sheet";

export function DagbokActions() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setSheetOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-90"
        style={{
          background: "var(--color-black)",
          color: "var(--color-grey-900)",
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        Logg økt
      </button>

      <LogSessionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        prefill={{ date: new Date().toISOString() }}
      />
    </>
  );
}
