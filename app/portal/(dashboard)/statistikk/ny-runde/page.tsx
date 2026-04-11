"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { HeroHeading, GlassCard, Shimmer } from "@/components/portal/premium";
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
      setError("Dato og score er pakrevd");
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
      setError("Kunne ikke lagre runden. Prov igjen.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-white/80 bg-white/60 px-4 py-2.5 text-[13px] text-[var(--color-grey-900)] outline-none backdrop-blur-xl transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]/40 focus:bg-white";

  const labelClass =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]";

  return (
    <div className="space-y-10">
      <HeroHeading
        label="Statistikk"
        title={
          <>
            Ny{" "}
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              runde
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description="Logg din golfrunde med score, statistikk og notater. Alle tall kan redigeres senere."
        actions={
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/portal/statistikk"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/70 px-5 text-[12px] font-semibold text-[var(--color-text)] shadow-sm backdrop-blur-xl transition-colors hover:bg-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Tilbake
            </Link>
          </motion.div>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {/* Grunnleggende info */}
        <GlassCard variant="light" padding="lg" delay={0.05}>
          <h2 className="mb-5 flex items-center gap-2.5 text-[13px] font-semibold text-[var(--color-grey-900)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-white">
              1
            </span>
            Grunnleggende info
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Dato *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Bane</label>
              <input
                type="text"
                value={form.courseName}
                onChange={(e) => update("courseName", e.target.value)}
                placeholder="f.eks. Fredrikstad GK"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Score *</label>
              <input
                type="number"
                value={form.totalScore}
                onChange={(e) => update("totalScore", e.target.value)}
                placeholder="78"
                min="50"
                max="150"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Par</label>
              <input
                type="number"
                value={form.par}
                onChange={(e) => update("par", e.target.value)}
                placeholder="72"
                min="60"
                max="80"
                className={inputClass}
              />
            </div>
          </div>
        </GlassCard>

        {/* Statistikk */}
        <GlassCard variant="light" padding="lg" delay={0.1}>
          <h2 className="mb-5 flex items-center gap-2.5 text-[13px] font-semibold text-[var(--color-grey-900)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-white">
              2
            </span>
            Statistikk
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Fairways</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.fairwaysHit}
                  onChange={(e) => update("fairwaysHit", e.target.value)}
                  placeholder="10"
                  min="0"
                  max="14"
                  className={inputClass}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[var(--color-muted)] tabular-nums">
                  / 14
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass}>GIR</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.gir}
                  onChange={(e) => update("gir", e.target.value)}
                  placeholder="12"
                  min="0"
                  max="18"
                  className={inputClass}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[var(--color-muted)] tabular-nums">
                  / 18
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Putter</label>
              <input
                type="number"
                value={form.totalPutts}
                onChange={(e) => update("totalPutts", e.target.value)}
                placeholder="32"
                min="15"
                max="50"
                className={inputClass}
              />
            </div>
          </div>
        </GlassCard>

        {/* Notater */}
        <GlassCard variant="light" padding="lg" delay={0.15}>
          <h2 className="mb-5 flex items-center gap-2.5 text-[13px] font-semibold text-[var(--color-grey-900)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-white">
              3
            </span>
            Notater
          </h2>
          <label className={labelClass}>Hvordan foltes runden?</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Hva gikk bra, hva gikk darlig, hvilke hull husker du best?"
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </GlassCard>

        {/* Feilmelding */}
        {error && (
          <div className="rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-4 backdrop-blur-xl">
            <p className="text-[13px] font-medium text-[var(--color-error)]">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/portal/statistikk"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/80 bg-white/70 py-3 text-[12px] font-semibold text-[var(--color-muted)] backdrop-blur-xl transition-colors hover:bg-white hover:text-[var(--color-grey-900)]"
          >
            Avbryt
          </Link>
          <motion.button
            type="submit"
            disabled={saving || !form.date || !form.totalScore}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--color-accent-cta)] py-3 text-[12px] font-bold text-[var(--color-grey-900)] shadow-[0_8px_24px_rgba(209,248,67,0.4)] transition-shadow hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Shimmer />
            {saving ? (
              <Loader2 className="relative z-10 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="relative z-10 h-3.5 w-3.5" strokeWidth={2.5} />
            )}
            <span className="relative z-10">Lagre runde</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
