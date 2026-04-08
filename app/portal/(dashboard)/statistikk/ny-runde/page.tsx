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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/portal/statistikk"
          className="p-2 rounded-lg hover:bg-[#f7f3ea] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#6b7366]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Registrer runde</h1>
          <p className="text-sm text-[#6b7366] mt-1">Logg din golfrunde med statistikk</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {/* Grunnleggende info */}
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50 space-y-4">
          <h2 className="text-sm font-semibold text-[#1c1c16] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#154212] text-white flex items-center justify-center text-xs">1</span>
            Grunnleggende info
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Dato */}
            <div>
              <label className="block text-xs font-medium text-[#6b7366] mb-1.5">
                Dato *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#f7f3ea] border border-[#c2c9bb]/50 text-[#1c1c16] text-sm outline-none focus:border-[#154212] transition-colors"
              />
            </div>

            {/* Bane */}
            <div>
              <label className="block text-xs font-medium text-[#6b7366] mb-1.5">
                Bane
              </label>
              <input
                type="text"
                value={form.courseName}
                onChange={(e) => update("courseName", e.target.value)}
                placeholder="f.eks. Fredrikstad GK"
                className="w-full px-3 py-2 rounded-xl bg-[#f7f3ea] border border-[#c2c9bb]/50 text-[#1c1c16] text-sm outline-none focus:border-[#154212] placeholder:text-[#8a9385] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Score */}
            <div>
              <label className="block text-xs font-medium text-[#6b7366] mb-1.5">
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
                className="w-full px-3 py-2 rounded-xl bg-[#f7f3ea] border border-[#c2c9bb]/50 text-[#1c1c16] text-sm outline-none focus:border-[#154212] placeholder:text-[#8a9385] transition-colors"
              />
            </div>

            {/* Par */}
            <div>
              <label className="block text-xs font-medium text-[#6b7366] mb-1.5">
                Par
              </label>
              <input
                type="number"
                value={form.par}
                onChange={(e) => update("par", e.target.value)}
                placeholder="72"
                min="60"
                max="80"
                className="w-full px-3 py-2 rounded-xl bg-[#f7f3ea] border border-[#c2c9bb]/50 text-[#1c1c16] text-sm outline-none focus:border-[#154212] placeholder:text-[#8a9385] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Statistikk */}
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50 space-y-4">
          <h2 className="text-sm font-semibold text-[#1c1c16] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#154212] text-white flex items-center justify-center text-xs">2</span>
            Statistikk
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Fairways */}
            <div>
              <label className="block text-xs font-medium text-[#6b7366] mb-1.5">
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
                  className="w-full px-3 py-2 rounded-xl bg-[#f7f3ea] border border-[#c2c9bb]/50 text-[#1c1c16] text-sm outline-none focus:border-[#154212] placeholder:text-[#8a9385] transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a9385]">
                  / 14
                </span>
              </div>
            </div>

            {/* GIR */}
            <div>
              <label className="block text-xs font-medium text-[#6b7366] mb-1.5">
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
                  className="w-full px-3 py-2 rounded-xl bg-[#f7f3ea] border border-[#c2c9bb]/50 text-[#1c1c16] text-sm outline-none focus:border-[#154212] placeholder:text-[#8a9385] transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a9385]">
                  / 18
                </span>
              </div>
            </div>

            {/* Putter */}
            <div>
              <label className="block text-xs font-medium text-[#6b7366] mb-1.5">
                Antall putter
              </label>
              <input
                type="number"
                value={form.totalPutts}
                onChange={(e) => update("totalPutts", e.target.value)}
                placeholder="32"
                min="15"
                max="50"
                className="w-full px-3 py-2 rounded-xl bg-[#f7f3ea] border border-[#c2c9bb]/50 text-[#1c1c16] text-sm outline-none focus:border-[#154212] placeholder:text-[#8a9385] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Notater */}
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <label className="block text-xs font-medium text-[#6b7366] mb-1.5">
            Notater (valgfritt)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Hvordan føltes runden? Hva gikk bra/dårlig?"
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-[#f7f3ea] border border-[#c2c9bb]/50 text-[#1c1c16] text-sm outline-none focus:border-[#154212] placeholder:text-[#8a9385] resize-none transition-colors"
          />
        </div>

        {/* Feilmelding */}
        {error && (
          <div className="p-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30">
            <p className="text-sm text-[#ef4444]">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <Link
            href="/portal/statistikk"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-[#c2c9bb]/50 text-[#6b7366] hover:bg-[#f7f3ea] transition-colors"
          >
            Avbryt
          </Link>
          <button
            type="submit"
            disabled={saving || !form.date || !form.totalScore}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#154212] text-white hover:bg-[#0d2e0c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
