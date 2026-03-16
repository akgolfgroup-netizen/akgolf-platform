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
      className="bg-white rounded-xl border border-gray-200 p-4"
    >
      <h3 className="text-sm font-semibold text-[#0F2950] mb-3">
        Legg til blokkert tid
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Fra</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Til</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Arsak (valgfritt)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="F.eks. ferie, sykdom..."
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving || !startTime || !endTime}
        className="mt-3 flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#0F2950] text-white rounded-lg hover:bg-[#0F2950]/90 disabled:opacity-50 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {saving ? "Legger til..." : "Legg til"}
      </button>
    </form>
  );
}
