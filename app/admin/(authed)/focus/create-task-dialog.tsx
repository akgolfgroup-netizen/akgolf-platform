"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";

import {
  AdminDialog, AdminInput,
} from "@/components/portal/mission-control/ui";
import { Button } from "@/components/ui/button";
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
          <Button variant="ghost" onClick={onClose}>Avbryt</Button>
          <Button variant="accent" isLoading={loading} onClick={handleSubmit}>
            <Icon name="add" className="w-4 h-4 mr-2" />
            Opprett
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-on-surface mb-1.5">Oppgave</label>
          <AdminInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Hva skal gjores?" autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">Prioritet</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as AdminPriority)} className="admin-input w-full">
              <option value="NORMAL">Normal</option>
              <option value="IMPORTANT">Viktig</option>
              <option value="URGENT">Haster</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">Frist</label>
            <AdminInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
      </div>
    </AdminDialog>
  );
}
