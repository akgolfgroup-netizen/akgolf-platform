"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { AdminDialog, AdminInput, useToast } from "@/components/portal/mission-control/ui";
import { createClosedPeriod } from "@/app/admin/(authed)/tilgjengelighet/actions";

interface ClosedPeriodDialogProps {
  instructorId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const PRESETS: Array<{ label: string; reason: string }> = [
  { label: "Ferie", reason: "Ferie" },
  { label: "Kurs", reason: "På kurs" },
  { label: "Sykdom", reason: "Sykdom" },
  { label: "Privat", reason: "Privat fravær" },
];

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ClosedPeriodDialog({
  instructorId,
  open,
  onOpenChange,
  onCreated,
}: ClosedPeriodDialogProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState(todayIso());
  const [reason, setReason] = useState(PRESETS[0].reason);
  const [saving, setSaving] = useState(false);

  function reset() {
    const t = todayIso();
    setStartDate(t);
    setEndDate(t);
    setReason(PRESETS[0].reason);
  }

  async function handleSubmit() {
    if (!instructorId) {
      toast({ variant: "error", title: "Velg en instruktør først" });
      return;
    }
    if (!startDate || !endDate) {
      toast({ variant: "error", title: "Start- og sluttdato kreves" });
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast({ variant: "error", title: "Sluttdato må være etter startdato" });
      return;
    }

    setSaving(true);
    try {
      const result = await createClosedPeriod({
        instructorId,
        startDate,
        endDate,
        reason: reason.trim() || "Stengt",
      });
      toast({
        variant: "success",
        title: "Periode stengt",
        description: `${result.daysCreated} dager blokkert`,
      });
      onOpenChange(false);
      reset();
      onCreated();
    } catch (err) {
      toast({
        variant: "error",
        title: "Kunne ikke stenge periode",
        description: err instanceof Error ? err.message : "Ukjent feil",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDialog
      open={open}
      onClose={() => onOpenChange(false)}
      title="Steng en periode"
      description="Blokkerer alle dager i intervallet — gjør det enkelt å registrere ferier eller lengre fravær uten å klikke hver dag."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="closed-start"
              className="text-xs text-on-surface-variant block mb-1"
            >
              Fra og med
            </label>
            <AdminInput
              id="closed-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="closed-end"
              className="text-xs text-on-surface-variant block mb-1"
            >
              Til og med
            </label>
            <AdminInput
              id="closed-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-on-surface-variant block mb-2">
            Årsak
          </label>
          <div className="flex gap-2 flex-wrap mb-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setReason(p.reason)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  reason === p.reason
                    ? "bg-on-surface text-surface"
                    : "bg-surface-container text-on-surface hover:bg-surface-variant"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <AdminInput
            placeholder="Eller skriv egen årsak"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Avbryt
          </Button>
          <Button
            variant="accent"
            onClick={handleSubmit}
            isLoading={saving}
            disabled={!instructorId || !startDate || !endDate}
          >
            Steng periode
          </Button>
        </div>
      </div>
    </AdminDialog>
  );
}
