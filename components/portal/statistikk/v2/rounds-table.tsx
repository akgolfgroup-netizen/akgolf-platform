"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { RoundStats } from "@prisma/client";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface RoundsTableProps {
  rounds: RoundStats[];
}

function formatPct(value: number | null, decimals = 0): string {
  if (value === null) return "—";
  return `${value.toFixed(decimals)} %`;
}

function formatSG(value: number | null): string {
  if (value === null) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}

/**
 * Runde-for-runde-tabell. Brand Guide V2.0 hvitt kort.
 */
export function RoundsTable({ rounds }: RoundsTableProps) {
  if (rounds.length === 0) {
    return (
      <section
        className="col-span-12 rounded-2xl border bg-card p-10 text-center"
        style={{
          borderColor: "var(--color-line, #E4EAE6)",
          boxShadow:
            "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
        }}
      >
        <div
          className="mx-auto inline-block rounded-full p-4"
          style={{ background: "var(--color-primary-soft, #E8F0EC)" }}
        >
          <Plus
            className="h-6 w-6"
            style={{ color: "var(--color-primary, #005840)" }}
          />
        </div>
        <h3
          className="mt-4 text-base font-bold"
          style={{ color: "var(--color-ink, #0A1F18)" }}
        >
          Ingen runder i valgt periode
        </h3>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-ink-muted, #5C6B62)" }}
        >
          Registrer din første runde for å se statistikk.
        </p>
        <Link
          href="/portal/runde/ny"
          className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          style={{
            background: "var(--color-primary, #005840)",
            color: "#FFFFFF",
          }}
        >
          <Plus className="h-4 w-4" />
          Ny runde
        </Link>
      </section>
    );
  }

  return (
    <section
      className="col-span-12 overflow-hidden rounded-2xl border bg-card"
      style={{
        borderColor: "var(--color-line, #E4EAE6)",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <div
        className="flex items-center justify-between border-b px-6 py-5"
        style={{ borderColor: "var(--color-line-soft, #EDF1EE)" }}
      >
        <h3
          className="font-inter-tight text-lg font-bold tracking-[-0.025em]"
          style={{ color: "var(--color-ink, #0A1F18)" }}
        >
          Runde for runde
        </h3>
        <Link
          href="/portal/runde/ny"
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{
            background: "var(--color-primary-soft, #E8F0EC)",
            color: "var(--color-primary, #005840)",
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Ny runde
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ background: "rgba(10, 31, 24, 0.02)" }}>
              {[
                "Dato / bane",
                "Score",
                "Fairway",
                "GIR",
                "Putts",
                "SG total",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rounds.slice(0, 10).map((r, i) => {
              const firPct =
                r.fairwaysHit !== null && r.fairwaysTotal
                  ? (r.fairwaysHit / r.fairwaysTotal) * 100
                  : null;
              const girPct =
                r.gir !== null && r.girTotal
                  ? (r.gir / r.girTotal) * 100
                  : null;
              const sgIsGood = r.sgTotal !== null && r.sgTotal >= 0;
              return (
                <tr
                  key={r.id}
                  className="transition-colors"
                  style={{
                    borderTop:
                      i === 0
                        ? "none"
                        : "1px solid var(--color-line-soft, #EDF1EE)",
                  }}
                >
                  <td className="px-6 py-4 font-mono text-xs font-bold tabular-nums">
                    <div style={{ color: "var(--color-ink, #0A1F18)" }}>
                      {format(new Date(r.date), "d. MMM yyyy", { locale: nb })}
                    </div>
                    <div
                      className="mt-0.5 text-[10.5px] font-normal normal-case"
                      style={{
                        color: "var(--color-ink-subtle, #6F7A74)",
                        fontFamily: "var(--font-sans, Inter, sans-serif)",
                        letterSpacing: 0,
                      }}
                    >
                      {r.courseName ?? "Ukjent bane"}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-bold tabular-nums"
                    style={{ color: "var(--color-ink, #0A1F18)" }}
                  >
                    {r.totalScore ?? "—"}
                  </td>
                  <td
                    className="px-6 py-4 text-sm tabular-nums"
                    style={{ color: "var(--color-ink-muted, #5C6B62)" }}
                  >
                    {formatPct(firPct)}
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-bold tabular-nums"
                    style={{ color: "var(--color-ink, #0A1F18)" }}
                  >
                    {formatPct(girPct)}
                  </td>
                  <td
                    className="px-6 py-4 text-sm tabular-nums"
                    style={{ color: "var(--color-ink-muted, #5C6B62)" }}
                  >
                    {r.totalPutts ?? "—"}
                  </td>
                  <td
                    className="px-6 py-4 font-mono text-sm font-bold tabular-nums"
                    style={{
                      color: sgIsGood
                        ? "var(--color-success, #2A7D5A)"
                        : "var(--color-danger, #B84233)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatSG(r.sgTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
