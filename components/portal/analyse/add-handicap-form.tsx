"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addHandicapEntry } from "@/app/portal/(dashboard)/analyse/actions";

export function AddHandicapForm() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [index, setIndex] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!index) return;
    startTransition(async () => {
      await addHandicapEntry({
        date,
        handicapIndex: parseFloat(index),
      });
      setOpen(false);
      setIndex("");
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-[10px] text-[var(--color-gold-dim)]/60 hover:text-[var(--color-gold)] transition-colors"
      >
        <Plus className="w-3 h-3" />
        Legg til handicap
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-2 py-1 rounded-lg text-xs bg-transparent border outline-none text-[var(--color-snow)]"
        style={{ borderColor: "rgba(30,53,85,0.8)" }}
      />
      <input
        type="number"
        step="0.1"
        min="0"
        max="54"
        value={index}
        onChange={(e) => setIndex(e.target.value)}
        placeholder="Handicap"
        className="w-24 px-2 py-1 rounded-lg text-xs bg-transparent border outline-none text-[var(--color-snow)] placeholder:text-[var(--color-gold-dim)]/30"
        style={{ borderColor: "rgba(30,53,85,0.8)" }}
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-3 py-1 rounded-lg text-xs font-semibold"
        style={{
          background: "linear-gradient(135deg, #c9a96e 0%, #B8975C 100%)",
          color: "#0a1929",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? "..." : "Lagre"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs text-[var(--color-gold-dim)]/40 hover:text-[var(--color-gold-dim)] transition-colors"
      >
        Avbryt
      </button>
    </form>
  );
}
