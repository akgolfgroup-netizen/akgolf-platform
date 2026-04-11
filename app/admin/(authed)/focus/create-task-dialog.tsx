"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  AdminDialog, AdminButton, AdminInput,
} from "@/components/portal/mission-control/ui";
import { createTask } from "./actions";
import type { AdminDivision, AdminPriority } from "@prisma/client";

const DIVISION_LABELS: Record<AdminDivision, string> = {
  COACHING: "Coaching",
  JUNIOR: "Junior",
  GFGK: "GFGK",
};

interface Props {
  open: boolean;
  division: AdminDivision;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateTaskDialog({ open, division, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<AdminPriority>("NORMAL");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        division,
        priority,
        dueDate: dueDate || undefined,
      });
      setTitle("");
      setPriority("NORMAL");
      setDueDate("");
      onCreated();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title="Ny oppgave"
      description={DIVISION_LABELS[division]}
      footer={
        <>
          <AdminButton variant="ghost" onClick={onClose}>Avbryt</AdminButton>
          <AdminButton variant="primary" loading={loading} onClick={handleSubmit} icon={<Plus className="w-4 h-4" />}>
            Opprett
          </AdminButton>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Oppgave</label>
          <AdminInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Hva skal gjores?" autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Prioritet</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as AdminPriority)} className="admin-input w-full">
              <option value="NORMAL">Normal</option>
              <option value="IMPORTANT">Viktig</option>
              <option value="URGENT">Haster</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Frist</label>
            <AdminInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
      </div>
    </AdminDialog>
  );
}
