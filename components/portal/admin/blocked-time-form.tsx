"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, MessageSquare } from "lucide-react";
import { createBlockedTime } from "@/app/portal/(dashboard)/admin/tilgjengelighet/actions";
import { AppleButton } from "@/components/portal/apple/apple-button";
import { motion } from "framer-motion";

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
    } catch {
      // Error handled silently - form will show failed state
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/80 backdrop-blur-xl border border-[var(--color-grey-200)] shadow-[var(--shadow-card)] p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#D14343]/5 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-[#D14343]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
            Legg til fraver
          </h3>
          <p className="text-xs text-[var(--color-grey-500)]">
            Blokker en periode hvor instruktoren ikke er tilgjengelig
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Start Time */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-grey-600)] mb-2">
            <Clock className="w-3.5 h-3.5" />
            Fra
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm text-[var(--color-grey-900)] bg-white border border-[var(--color-grey-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20 focus:border-[var(--color-grey-900)] transition-[border-color,box-shadow]"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-grey-600)] mb-2">
            <Clock className="w-3.5 h-3.5" />
            Til
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm text-[var(--color-grey-900)] bg-white border border-[var(--color-grey-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20 focus:border-[var(--color-grey-900)] transition-[border-color,box-shadow]"
            required
          />
        </div>

        {/* Reason */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-grey-600)] mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            Arsak (valgfritt)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] bg-white border border-[var(--color-grey-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20 focus:border-[var(--color-grey-900)] transition-[border-color,box-shadow]"
            placeholder="F.eks. ferie, sykdom..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <AppleButton
          type="submit"
          disabled={saving || !startTime || !endTime}
          loading={saving}
          icon={Plus}
          variant="primary"
          size="md"
        >
          {saving ? "Legger til..." : "Legg til fraver"}
        </AppleButton>
      </div>
    </motion.form>
  );
}
