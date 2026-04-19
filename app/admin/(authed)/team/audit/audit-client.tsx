"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { CapabilityChangeAction } from "@prisma/client";
import {
  AdminPageHeader,
  AdminInput,
} from "@/components/portal/mission-control/ui";
import { Badge } from "@/components/ui";
import type { AuditLogRow } from "../actions";

interface AuditClientProps {
  initialRows: AuditLogRow[];
}

const ACTION_LABEL: Record<CapabilityChangeAction, string> = {
  [CapabilityChangeAction.GRANT]: "Tildelt",
  [CapabilityChangeAction.REVOKE]: "Trukket",
  [CapabilityChangeAction.EXPIRE]: "Utløpt",
};

const ACTION_VARIANT: Record<
  CapabilityChangeAction,
  "success" | "muted" | "warning"
> = {
  [CapabilityChangeAction.GRANT]: "success",
  [CapabilityChangeAction.REVOKE]: "warning",
  [CapabilityChangeAction.EXPIRE]: "muted",
};

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AuditClient({ initialRows }: AuditClientProps) {
  const [rows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<
    CapabilityChangeAction | "all"
  >("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (actionFilter !== "all" && r.action !== actionFilter) return false;
      if (!q) return true;
      return (
        r.userName?.toLowerCase().includes(q) ||
        r.userEmail?.toLowerCase().includes(q) ||
        r.capability.toLowerCase().includes(q) ||
        r.performedByName?.toLowerCase().includes(q) ||
        r.reason?.toLowerCase().includes(q)
      );
    });
  }, [rows, query, actionFilter]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit-logg for kapabiliteter"
        subtitle="Viser siste 300 tildelinger, tilbaketrekninger og utløp. Sporbarhet etter GDPR art. 5(2)."
        breadcrumbs={[
          { label: "Team", href: "/admin/team" },
          { label: "Audit-logg" },
        ]}
        actions={
          <Link
            href="/admin/team"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Tilbake til team
          </Link>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[240px]">
          <AdminInput
            label="Søk"
            placeholder="Bruker, kapabilitet, utfører, begrunnelse"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-[var(--hg-surface-raised)] p-[3px]">
          {(
            [
              { id: "all", label: "Alle" },
              { id: CapabilityChangeAction.GRANT, label: "Tildelt" },
              { id: CapabilityChangeAction.REVOKE, label: "Trukket" },
              { id: CapabilityChangeAction.EXPIRE, label: "Utløpt" },
            ] as const
          ).map((o) => (
            <button
              key={o.id}
              onClick={() => setActionFilter(o.id)}
              className={`rounded-[7px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
                actionFilter === o.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--hg-text-muted)] hover:text-[var(--hg-text-secondary)]"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--hg-border-subtle)] bg-[var(--hg-surface)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--hg-border-subtle)]">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Tidspunkt
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Bruker
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Handling
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Kapabilitet
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Utført av
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Begrunnelse
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-[var(--hg-text-muted)]"
                >
                  Ingen rader matcher filteret.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-[var(--hg-border-subtle)] last:border-0 hover:bg-[var(--hg-surface-raised)]"
              >
                <td className="px-6 py-3 text-sm tabular-nums text-[var(--hg-text-secondary)] whitespace-nowrap">
                  {formatDateTime(r.performedAt)}
                </td>
                <td className="px-6 py-3 text-sm text-[var(--hg-text)]">
                  <div className="font-medium">{r.userName ?? "—"}</div>
                  <div className="text-[11px] text-[var(--hg-text-muted)]">
                    {r.userEmail ?? r.userId}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <Badge variant={ACTION_VARIANT[r.action]}>
                    {ACTION_LABEL[r.action]}
                  </Badge>
                </td>
                <td className="px-6 py-3 text-xs font-mono text-[var(--hg-text-secondary)]">
                  {r.capability}
                </td>
                <td className="px-6 py-3 text-sm text-[var(--hg-text-secondary)]">
                  {r.performedByName ?? r.performedBy}
                </td>
                <td className="px-6 py-3 text-sm text-[var(--hg-text-muted)]">
                  {r.reason ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
