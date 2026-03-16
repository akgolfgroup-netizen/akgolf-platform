"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

const LEVELS = ["nasjonal", "regional", "lokal", "internasjonal"] as const;

interface EditTournamentSheetProps {
  open: boolean;
  onClose: () => void;
  tournament: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date | null;
    level: string;
    course: string | null;
    location: string | null;
    registrationDeadline: Date | null;
    externalUrl: string | null;
  };
  onSaved: () => void;
}

function toDateInput(d: Date | null): string {
  if (!d) return "";
  const date = new Date(d);
  return date.toISOString().split("T")[0];
}

export function EditTournamentSheet({
  open,
  onClose,
  tournament,
  onSaved,
}: EditTournamentSheetProps) {
  const [name, setName] = useState(tournament.name);
  const [startDate, setStartDate] = useState(toDateInput(tournament.startDate));
  const [endDate, setEndDate] = useState(toDateInput(tournament.endDate));
  const [level, setLevel] = useState(tournament.level);
  const [location, setLocation] = useState(tournament.location ?? "");
  const [course, setCourse] = useState(tournament.course ?? "");
  const [externalUrl, setExternalUrl] = useState(tournament.externalUrl ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !startDate) return;
    setSaving(true);
    await fetch(`/api/tournament-planner/${tournament.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        startDate,
        endDate: endDate || undefined,
        level,
        location: location || undefined,
        course: course || undefined,
        externalUrl: externalUrl || undefined,
      }),
    });
    setSaving(false);
    onSaved();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[var(--color-border)]">
          <h2 className="font-bold text-[var(--color-snow)] text-sm">Rediger turnering</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-muted)] rounded-lg">
            <X className="w-4 h-4 text-[var(--color-gold-muted)]" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1">Navn *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1">Startdato *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1">Sluttdato</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1">Nivå</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1">Bane</label>
              <input
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1">Sted</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1">Ekstern URL</label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg-deep)] font-semibold text-sm hover:bg-[var(--color-gold-muted)] transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lagre endringer"}
          </button>
        </form>
      </div>
    </div>
  );
}
