"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { ManualPlanModal } from "./manual-plan-modal";

interface Props {
  studentId?: string;
}

export function ManualPlanButton({ studentId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors"
      >
        <ClipboardList className="w-4 h-4" />
        Lag manuell plan
      </button>
      <ManualPlanModal open={open} onClose={() => setOpen(false)} studentId={studentId} />
    </>
  );
}
