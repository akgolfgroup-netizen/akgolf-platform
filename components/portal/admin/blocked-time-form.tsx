"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createBlockedTime } from "@/app/portal/(dashboard)/admin/tilgjengelighet/actions";

interface Props {
  instructorId: string;
  onCreated: () => void;
}

export function BlockedTimeForm({ instructorId, onCreated }: Props) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) return;

    setSaving(true);
    try {
      await createBlockedTime({
        instructorId,
        startTime,
        endTime,
        reason: reason || undefined,
      });
      setStartTime("");
      setEndTime("");
      setReason("");
      onCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[rgba(15,41,80,0.4)] bg-[rgba(10,25,41,0.7)] backdrop-blur-md p-4"
    >
      <h3 className="text-sm font-semibold text-[var(--color-snow)] mb-3">
        Legg til blokkert tid
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[var(--color-snow)]/50 mb-1 block">Fra</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm text-[var(--color-snow)] bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
            required
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-snow)]/50 mb-1 block">Til</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm text-[var(--color-snow)] bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
            required
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-snow)]/50 mb-1 block">
            Årsak (valgfritt)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm text-[var(--color-snow)] placeholder:text-[var(--color-snow)]/40 bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
            placeholder="F.eks. ferie, sykdom..."
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving || !startTime || !endTime}
        className="mt-3 flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[var(--color-gold)] text-white rounded-xl hover:bg-[var(--color-gold)]/90 disabled:opacity-50 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {saving ? "Legger til..." : "Legg til"}
      </button>
    </form>
  );
}
