"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { PortalHeader, PortalCard } from "@/components/portal/premium";
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
      setError("Dato og score er påkrevd");
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
      setError("Kunne ikke lagre runden. Prøv igjen.");
      setSaving(false);
    }
  }

  const backButton = (
    <Link
      href="/portal/statistikk"
      className="flex items-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
    >
      <ArrowLeft className="h-4 w-4" />
      Tilbake
    </Link>
  );

  return (
    <div className="space-y-6">
      <PortalHeader
        label="Statistikk"
        title="Registrer runde"
        description="Logg din golfrunde med statistikk"
        actions={backButton}
      />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {/* Grunnleggende info */}
        <PortalCard className="space-y-4" padding="md">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--color-primary)] text-xs text-white">
              1
            </span>
            Grunnleggende info
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Dato */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                Dato *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                required
                className="w-full rounded-xl border border-black/5 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Bane */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                Bane
              </label>
              <input
                type="text"
                value={form.courseName}
                onChange={(e) => update("courseName", e.target.value)}
                placeholder="f.eks. Fredrikstad GK"
                className="w-full rounded-xl border border-black/5 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Score */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
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
                className="w-full rounded-xl border border-black/5 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Par */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                Par
              </label>
              <input
                type="number"
                value={form.par}
                onChange={(e) => update("par", e.target.value)}
                placeholder="72"
                min="60"
                max="80"
                className="w-full rounded-xl border border-black/5 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </PortalCard>

        {/* Statistikk */}
        <PortalCard className="space-y-4" padding="md">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--color-primary)] text-xs text-white">
              2
            </span>
            Statistikk
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Fairways */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
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
                  className="w-full rounded-xl border border-black/5 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-muted)]">
                  / 14
                </span>
              </div>
            </div>

            {/* GIR */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
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
                  className="w-full rounded-xl border border-black/5 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-muted)]">
                  / 18
                </span>
              </div>
            </div>

            {/* Putter */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                Antall putter
              </label>
              <input
                type="number"
                value={form.totalPutts}
                onChange={(e) => update("totalPutts", e.target.value)}
                placeholder="32"
                min="15"
                max="50"
                className="w-full rounded-xl border border-black/5 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </PortalCard>

        {/* Notater */}
        <PortalCard padding="md">
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
            Notater (valgfritt)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Hvordan foltes runden? Hva gikk bra/darlig?"
            rows={3}
            className="w-full resize-none rounded-xl border border-black/5 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
          />
        </PortalCard>

        {/* Feilmelding */}
        {error && (
          <div className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-3">
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <Link
            href="/portal/statistikk"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/5 py-3 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)]"
          >
            Avbryt
          </Link>
          <button
            type="submit"
            disabled={saving || !form.date || !form.totalScore}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lagre runde
          </button>
        </div>
      </form>
    </div>
  );
}
