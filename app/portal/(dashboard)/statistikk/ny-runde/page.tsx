"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { saveRound } from "./actions";

export default function NyRundePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    courseName: "",
    totalScore: "",
    par: "72",
    fairwaysHit: "",
    gir: "",
    totalPutts: "",
    notes: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.totalScore) {
      setError("Dato og score er paakrevd");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const par = parseInt(form.par) || 72;
      const totalScore = parseInt(form.totalScore);
      const scoreToPar = totalScore - par;

      await saveRound({
        date: form.date,
        courseName: form.courseName || undefined,
        totalScore,
        scoreToPar,
        fairwaysHit: form.fairwaysHit ? parseInt(form.fairwaysHit) : undefined,
        fairwaysTotal: 14,
        gir: form.gir ? parseInt(form.gir) : undefined,
        girTotal: 18,
        totalPutts: form.totalPutts ? parseInt(form.totalPutts) : undefined,
        notes: form.notes || undefined,
      });

      router.push("/portal/statistikk");
    } catch (_err) {
      setError("Kunne ikke lagre runden. Proov igjen.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/portal/statistikk"
          className="p-2 rounded-lg hover:bg-[var(--portal-surface-raised)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--portal-text-muted)]" />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--portal-text-primary)]">
          Registrer runde
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {/* Grunnleggende info */}
        <div className="portal-card rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--portal-text-primary)] mb-4">
            Grunnleggende info
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Dato */}
            <div>
              <label className="block text-xs font-medium text-[var(--portal-text-muted)] mb-1.5">
                Dato *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-[var(--portal-surface-sunken)] border border-[var(--portal-card-border)] text-[var(--portal-text-primary)] text-sm outline-none focus:border-[var(--portal-accent)] transition-colors"
              />
            </div>

            {/* Bane */}
            <div>
              <label className="block text-xs font-medium text-[var(--portal-text-muted)] mb-1.5">
                Bane
              </label>
              <input
                type="text"
                value={form.courseName}
                onChange={(e) => update("courseName", e.target.value)}
                placeholder="f.eks. Fredrikstad GK"
                className="w-full px-3 py-2 rounded-lg bg-[var(--portal-surface-sunken)] border border-[var(--portal-card-border)] text-[var(--portal-text-primary)] text-sm outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-muted)] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Score */}
            <div>
              <label className="block text-xs font-medium text-[var(--portal-text-muted)] mb-1.5">
                Score *
              </label>
              <input
                type="number"
                value={form.totalScore}
                onChange={(e) => update("totalScore", e.target.value)}
                placeholder="78"
                min="50"
                max="150"
                required
                className="w-full px-3 py-2 rounded-lg bg-[var(--portal-surface-sunken)] border border-[var(--portal-card-border)] text-[var(--portal-text-primary)] text-sm outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-muted)] transition-colors"
              />
            </div>

            {/* Par */}
            <div>
              <label className="block text-xs font-medium text-[var(--portal-text-muted)] mb-1.5">
                Par
              </label>
              <input
                type="number"
                value={form.par}
                onChange={(e) => update("par", e.target.value)}
                placeholder="72"
                min="60"
                max="80"
                className="w-full px-3 py-2 rounded-lg bg-[var(--portal-surface-sunken)] border border-[var(--portal-card-border)] text-[var(--portal-text-primary)] text-sm outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-muted)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Statistikk */}
        <div className="portal-card rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--portal-text-primary)] mb-4">
            Statistikk
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Fairways */}
            <div>
              <label className="block text-xs font-medium text-[var(--portal-text-muted)] mb-1.5">
                Fairways truffet
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.fairwaysHit}
                  onChange={(e) => update("fairwaysHit", e.target.value)}
                  placeholder="10"
                  min="0"
                  max="14"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--portal-surface-sunken)] border border-[var(--portal-card-border)] text-[var(--portal-text-primary)] text-sm outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-muted)] transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--portal-text-muted)]">
                  / 14
                </span>
              </div>
            </div>

            {/* GIR */}
            <div>
              <label className="block text-xs font-medium text-[var(--portal-text-muted)] mb-1.5">
                Greener i reg.
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.gir}
                  onChange={(e) => update("gir", e.target.value)}
                  placeholder="12"
                  min="0"
                  max="18"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--portal-surface-sunken)] border border-[var(--portal-card-border)] text-[var(--portal-text-primary)] text-sm outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-muted)] transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--portal-text-muted)]">
                  / 18
                </span>
              </div>
            </div>

            {/* Putter */}
            <div>
              <label className="block text-xs font-medium text-[var(--portal-text-muted)] mb-1.5">
                Antall putter
              </label>
              <input
                type="number"
                value={form.totalPutts}
                onChange={(e) => update("totalPutts", e.target.value)}
                placeholder="32"
                min="15"
                max="50"
                className="w-full px-3 py-2 rounded-lg bg-[var(--portal-surface-sunken)] border border-[var(--portal-card-border)] text-[var(--portal-text-primary)] text-sm outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-muted)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Notater */}
        <div className="portal-card rounded-lg p-5">
          <label className="block text-xs font-medium text-[var(--portal-text-muted)] mb-1.5">
            Notater (valgfritt)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Hvordan foltes runden? Hva gikk bra/daarlig?"
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-[var(--portal-surface-sunken)] border border-[var(--portal-card-border)] text-[var(--portal-text-primary)] text-sm outline-none focus:border-[var(--portal-accent)] placeholder:text-[var(--portal-text-muted)] resize-none transition-colors"
          />
        </div>

        {/* Feilmelding */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <Link
            href="/portal/statistikk"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border border-[var(--portal-card-border)] text-[var(--portal-text-secondary)] hover:bg-[var(--portal-surface-raised)] transition-colors"
          >
            Avbryt
          </Link>
          <button
            type="submit"
            disabled={saving || !form.date || !form.totalScore}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold bg-[var(--portal-accent)] text-[var(--portal-bg-deep)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lagre runde
          </button>
        </div>
      </form>
    </div>
  );
}
