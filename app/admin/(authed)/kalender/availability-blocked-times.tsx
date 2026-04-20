"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { AdminInput, AdminDialog, useToast } from "@/components/portal/mission-control/ui";
import type { CalendarBlockedTime } from "./actions";
import { createBlockedTimePrisma, deleteBlockedTimePrisma } from "./actions";

interface AvailabilityBlockedTimesProps {
  instructorId: string;
  blockedTimes: CalendarBlockedTime[];
  onChange: () => void;
}

export default function AvailabilityBlockedTimes({
  instructorId,
  blockedTimes,
  onChange,
}: AvailabilityBlockedTimesProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "17:00",
    reason: "",
  });

  const handleBlock = () => {
    if (!instructorId || !form.date) return;
    startTransition(async () => {
      await createBlockedTimePrisma({
        instructorId,
        startTime: new Date(`${form.date}T${form.startTime}`).toISOString(),
        endTime: new Date(`${form.date}T${form.endTime}`).toISOString(),
        reason: form.reason || "Blokkert tid",
      });
      toast({ variant: "success", title: "Tid blokkert" });
      setShowDialog(false);
      setForm({
        date: format(new Date(), "yyyy-MM-dd"),
        startTime: "09:00",
        endTime: "17:00",
        reason: "",
      });
      onChange();
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteBlockedTimePrisma(id);
      toast({ variant: "success", title: "Blokkering slettet" });
      onChange();
    });
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="block" className="w-4 h-4 text-on-surface-variant/80" />
          <h3 className="text-base font-semibold text-on-surface">Blokkerte tider</h3>
        </div>
        <Button variant="accent" onClick={() => setShowDialog(true)}>
          <Icon name="add" className="w-4 h-4" />
          Blokker tid
        </Button>
      </div>
      <div className="divide-y divide-grey-200">
        {blockedTimes.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-on-surface-variant/80">
            Ingen blokkerte tider de neste to månedene.
          </div>
        ) : (
          blockedTimes.map((bt) => {
            const s = new Date(bt.startTime);
            const e = new Date(bt.endTime);
            return (
              <div key={bt.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-on-surface">
                    {bt.reason || "Blokkert tid"}
                  </div>
                  <div className="text-xs text-on-surface-variant/80">
                    {format(s, "EEEE d. MMMM", { locale: nb })} — {format(s, "HH:mm")}–
                    {format(e, "HH:mm")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(bt.id)}
                  className="p-1.5 rounded-md hover:bg-error-light text-on-surface-variant hover:text-error transition-colors"
                  aria-label="Slett"
                >
                  <Icon name="delete" className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <AdminDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title="Blokker tid"
        description="Blokker en spesifikk tidsperiode"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Avbryt
            </Button>
            <Button variant="accent" onClick={handleBlock} disabled={!form.date || isPending}>
              Lagre
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <AdminInput
            label="Dato"
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Fra kl"
              type="time"
              value={form.startTime}
              onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
            />
            <AdminInput
              label="Til kl"
              type="time"
              value={form.endTime}
              onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
            />
          </div>
          <AdminInput
            label="Årsak"
            type="text"
            value={form.reason}
            onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
            placeholder="F.eks. Ferie, Sykdom..."
          />
        </div>
      </AdminDialog>
    </div>
  );
}
