"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";
import type {
  CsvPreviewResult,
  CsvPreviewError,
} from "@/lib/portal/trackman/upload-actions";

interface CsvPreviewProps {
  preview: CsvPreviewResult | CsvPreviewError | null;
}

/**
 * Viser oppsummering av CSV for spilleren godkjenner import.
 * Viser totalt antall slag, klubb-fordeling og forste 5 slag som tabell.
 * Viser feil med hint hvis parsing mislykkes.
 */
export function CsvPreview({ preview }: CsvPreviewProps) {
  if (!preview) return null;

  if (!preview.ok) {
    return (
      <div className="rounded-xl border border-[var(--color-danger,#B84233)]/30 bg-[var(--color-danger-soft,#F4DAD5)] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--color-danger,#B84233)] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-medium text-[var(--color-ink,#0A1F18)]">
              Klarte ikke a lese filen
            </p>
            <p className="text-[var(--color-ink-muted,#5C6B62)]">
              {preview.error}
            </p>
            {preview.hint ? (
              <p className="text-xs text-[var(--color-ink-subtle,#8A958E)] mt-2">
                Tips: {preview.hint}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-line,#E4EAE6)] bg-card p-4 space-y-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-[var(--color-success,#2A7D5A)] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-ink">
            Klar for import: {preview.totalShots} slag
          </p>
          <p className="text-xs text-ink-muted">
            Vi fant {preview.clubs.length} {preview.clubs.length === 1 ? "klubb" : "klubber"}
            {preview.totalShots > 5
              ? ". Forste 5 slag vises under for kontroll."
              : "."}
          </p>
        </div>
      </div>

      {/* Klubb-fordeling */}
      <div className="flex flex-wrap gap-1.5">
        {preview.clubs.map((c) => (
          <span
            key={c.club}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-soft,#E8F0EC)] px-2.5 py-1 text-xs font-medium text-[var(--color-primary-deep,#003B2A)]"
          >
            {c.club}
            <span className="font-mono text-[10px] text-[var(--color-ink-muted,#5C6B62)]">
              {c.count}
            </span>
          </span>
        ))}
      </div>

      {/* Forste 5 slag */}
      {preview.firstShots.length > 0 && (
        <div className="overflow-x-auto -mx-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--color-line-soft,#EDF1EE)] text-left text-[var(--color-ink-subtle,#8A958E)]">
                <th className="px-4 py-2 font-medium">#</th>
                <th className="px-4 py-2 font-medium">Klubb</th>
                <th className="px-4 py-2 font-medium font-mono">Ballfart</th>
                <th className="px-4 py-2 font-medium font-mono">Carry</th>
                <th className="px-4 py-2 font-medium font-mono">Total</th>
                <th className="px-4 py-2 font-medium font-mono">Smash</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {preview.firstShots.map((s) => (
                <tr
                  key={s.shotNumber}
                  className="border-b border-[var(--color-line-soft,#EDF1EE)] last:border-0"
                >
                  <td className="px-4 py-2 text-[var(--color-ink-muted,#5C6B62)] font-mono">
                    {s.shotNumber}
                  </td>
                  <td className="px-4 py-2">{s.club}</td>
                  <td className="px-4 py-2 font-mono">
                    {s.ballSpeed != null ? `${s.ballSpeed.toFixed(1)} mph` : "—"}
                  </td>
                  <td className="px-4 py-2 font-mono">
                    {s.carry != null ? `${s.carry.toFixed(1)} m` : "—"}
                  </td>
                  <td className="px-4 py-2 font-mono">
                    {s.totalDistance != null
                      ? `${s.totalDistance.toFixed(1)} m`
                      : "—"}
                  </td>
                  <td className="px-4 py-2 font-mono">
                    {s.smashFactor != null ? s.smashFactor.toFixed(2) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
