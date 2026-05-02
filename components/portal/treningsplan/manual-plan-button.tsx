"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";

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
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors"
      >
        <Icon name="assignment" className="w-4 h-4" />
        Lag manuell plan
      </button>
      <ManualPlanModal open={open} onClose={() => setOpen(false)} studentId={studentId} />
    </>
  );
}
