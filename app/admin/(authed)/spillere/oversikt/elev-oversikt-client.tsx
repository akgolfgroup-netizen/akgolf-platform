"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/portal/coach-hq/ui";
import { CoachHQTopbar, useCoachHQSidebar } from "@/components/portal/coach-hq";
import {
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableHeaderCell,
  AdminTableCell,
} from "@/components/portal/coach-hq/ui";
import { cn } from "@/lib/portal/utils/cn";
import type { ElevOversiktRow } from "./actions";

interface ElevOversiktClientProps {
  rows: ElevOversiktRow[];
}

function AdherenceBadge({ pct }: { pct: number }) {
  const colorClass =
    pct >= 80
      ? "bg-success/10 text-success"
      : pct >= 50
        ? "bg-warning/10 text-warning"
        : "bg-error/10 text-error";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
        colorClass
      )}
    >
      {pct}%
    </span>
  );
}

function HcpDisplay({
  current,
  trend,
}: {
  current: number | null;
  trend: "down" | "up" | "same" | null;
}) {
  if (current === null) return <span className="text-on-surface-variant text-sm">—</span>;

  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-on-surface">
      {current.toFixed(1)}
      {trend === "down" && (
        <Icon name="trending_down" className="w-4 h-4 text-success" title="HCP går ned (bedre)" />
      )}
      {trend === "up" && (
        <Icon name="trending_up" className="w-4 h-4 text-error" title="HCP går opp" />
      )}
      {trend === "same" && (
        <Icon name="trending_flat" className="w-4 h-4 text-on-surface-variant" title="Uendret" />
      )}
    </span>
  );
}

export function ElevOversiktClient({ rows }: ElevOversiktClientProps) {
  const { toggle } = useCoachHQSidebar();
  const [sortBy, setSortBy] = useState<"adherence" | "lastActivity" | "weeklyHours">("adherence");

  const sorted = [...rows].sort((a, b) => {
    if (sortBy === "adherence") return a.adherencePct - b.adherencePct;
    if (sortBy === "lastActivity") {
      const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
      const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
      return aTime - bTime;
    }
    if (sortBy === "weeklyHours") return a.weeklyHours - b.weeklyHours;
    return 0;
  });

  const lowAdherence = rows.filter((r) => r.adherencePct < 50).length;
  const avgAdherence = rows.length > 0
    ? Math.round(rows.reduce((s, r) => s + r.adherencePct, 0) / rows.length)
    : 0;
  const totalWeeklyHours = rows.reduce((s, r) => s + r.weeklyHours, 0);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CoachHQTopbar
        title="Elev-oversikt"
        subtitle="Adherence, aktivitet og HCP-trend per elev"
        onMenuClick={toggle}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <AdminPageHeader
          title="Elev-oversikt"
          subtitle="Oversikt over alle dine elever med plan-adherence og progresjon"
          breadcrumbs={[{ label: "Elever", href: "/admin/spillere" }, { label: "Oversikt" }]}
        />

        {/* Stat-kort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="admin-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
              Totalt elever
            </p>
            <p className="mt-2 text-3xl font-bold text-on-surface">{rows.length}</p>
          </div>
          <div className="admin-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
              Gjennomsnittlig adherence
            </p>
            <p className="mt-2 text-3xl font-bold text-on-surface">{avgAdherence}%</p>
          </div>
          <div className="admin-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
              Lav adherence (&lt;50%)
            </p>
            <p className="mt-2 text-3xl font-bold text-error">{lowAdherence}</p>
          </div>
          <div className="admin-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
              Timer denne uken
            </p>
            <p className="mt-2 text-3xl font-bold text-on-surface">{totalWeeklyHours.toFixed(1)}t</p>
          </div>
        </div>

        {/* Sortering */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-on-surface-variant">Sorter etter:</span>
          {[
            { key: "adherence" as const, label: "Adherence (lav → høy)" },
            { key: "lastActivity" as const, label: "Siste aktivitet" },
            { key: "weeklyHours" as const, label: "Timer denne uken" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                sortBy === opt.key
                  ? "bg-on-surface text-surface border-black"
                  : "bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Tabell */}
        <AdminTable>
          <AdminTableHead>
            <AdminTableRow>
              <AdminTableHeaderCell className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Elev
              </AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Adherence
              </AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Siste aktivitet
              </AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                HCP
              </AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Timer / planlagt
              </AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Handlinger
              </AdminTableHeaderCell>
            </AdminTableRow>
          </AdminTableHead>
          <AdminTableBody>
            {sorted.map((row) => (
              <AdminTableRow
                key={row.id}
                className="hover:bg-surface-container/40 transition-colors"
              >
                <AdminTableCell>
                  <div className="flex items-center gap-3">
                    {row.image ? (
                      <img
                        src={row.image}
                        alt={row.name ?? ""}
                        className="w-9 h-9 rounded-full object-cover bg-surface-container"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {row.name?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{row.name ?? "Ukjent"}</p>
                      <p className="text-xs text-on-surface-variant">{row.email}</p>
                    </div>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <AdherenceBadge pct={row.adherencePct} />
                  {row.plannedSessionsThisWeek > 0 && (
                    <p className="text-[10px] text-on-surface-variant mt-1">
                      {row.completedSessionsThisWeek} / {row.plannedSessionsThisWeek} økter
                    </p>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-sm text-on-surface">{row.lastActivityText}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <HcpDisplay current={row.currentHcp} trend={row.hcpTrend} />
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-sm text-on-surface font-medium">
                    {row.weeklyHours}t
                  </span>
                  {row.plannedSessionsThisWeek > 0 && (
                    <span className="text-xs text-on-surface-variant ml-1">
                      / {Math.round((row.plannedSessionsThisWeek * 60) / 60)}t planlagt
                    </span>
                  )}
                </AdminTableCell>
                <AdminTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/spillere/${row.id}`}>
                      <Button size="sm" variant="ghost">
                        <Icon name="visibility" className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/treningsplan?studentId=${row.id}`}>
                      <Button size="sm" variant="ghost">
                        <Icon name="notebook" className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>

        {sorted.length === 0 && (
          <div className="mt-12 text-center">
            <Icon
              name="people"
              className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3"
            />
            <p className="text-on-surface-variant">Ingen elever funnet.</p>
            <p className="text-sm text-on-surface-variant/70 mt-1">
              Du har ingen aktive coach-relasjoner ennå.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
