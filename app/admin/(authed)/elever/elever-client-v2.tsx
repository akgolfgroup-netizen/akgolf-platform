"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, UserPlus, SlidersHorizontal, ChevronDown } from "lucide-react";
import { McPageHead, McButton, McPill, McTable, McKpiCard } from "@/components/admin/mc-v2";
import type { StudentListData, StudentRow } from "./actions";

interface Props {
  initialData: StudentListData;
}

type FilterKey = "all" | "active" | "new" | "atRisk";

export function EleverClientV2({ initialData }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [students] = useState(initialData.students);
  const [stats] = useState(initialData.stats);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        q === "" ||
        (s.name ?? "").toLowerCase().includes(q) ||
        (s.email ?? "").toLowerCase().includes(q);
      if (!matchSearch) return false;
      if (filter === "active") return s.isActive;
      if (filter === "new") {
        const created = new Date(s.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }
      if (filter === "atRisk") {
        const last = s.lastActiveAt ? new Date(s.lastActiveAt) : null;
        if (!last) return true;
        const days = (Date.now() - last.getTime()) / 86400000;
        return days > 14;
      }
      return true;
    });
  }, [students, search, filter]);

  const handleRowClick = useCallback(
    (row: StudentRow) => router.push(`/admin/elever/${row.id}`),
    [router]
  );

  return (
    <div className="space-y-5">
      <McPageHead
        eyebrow="Spillere · Oversikt"
        title="Alle spillere"
        description="Administrer spillere, se status og klikk for full profil."
        actions={
          <McButton variant="accent" icon={<UserPlus className="w-3.5 h-3.5" />}>
            Ny spiller
          </McButton>
        }
      />

      {/* KPI-rad */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <McKpiCard label="Totalt" value={stats.total} />
        <McKpiCard label="Aktive" value={stats.active} tone="success" />
        <McKpiCard label="Nye denne mnd" value={stats.newThisMonth} tone="accent" />
        <McKpiCard label="Risiko" value={stats.atRisk} tone="warning" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Search className="w-3.5 h-3.5 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk på navn eller e-post…"
            className="bg-transparent outline-none border-none text-[13px] text-white flex-1 placeholder:text-white/35"
          />
        </div>

        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          Alle
        </FilterChip>
        <FilterChip active={filter === "active"} onClick={() => setFilter("active")}>
          Aktive
        </FilterChip>
        <FilterChip active={filter === "new"} onClick={() => setFilter("new")}>
          Nye
        </FilterChip>
        <FilterChip active={filter === "atRisk"} onClick={() => setFilter("atRisk")}>
          Risiko
        </FilterChip>

        <McButton
          variant="ghost"
          icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          onClick={() => {
            setSearch("");
            setFilter("all");
          }}
          className="ml-auto"
        >
          Nullstill
        </McButton>
      </div>

      {/* Tabell */}
      <McTable
        columns={[
          {
            key: "name",
            label: "Navn",
            render: (s) => (
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full grid place-items-center text-[10px] font-bold shrink-0"
                  style={{ background: avatarColor(s.name), color: "#0A1F18" }}
                >
                  {initials(s.name)}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-white">{s.name ?? "Uten navn"}</div>
                  <div className="text-[11px] text-white/40">{s.email}</div>
                </div>
              </div>
            ),
          },
          {
            key: "hcp",
            label: "HCP",
            width: "80px",
            render: (s) => (
              <span className="font-mono text-[13px] text-white/80">
                {s.handicap !== null ? s.handicap.toFixed(1) : "—"}
              </span>
            ),
          },
          {
            key: "category",
            label: "Kat.",
            width: "60px",
            render: (s) => (
              <span className="font-mono text-[12px] text-white/60">{s.category ?? "—"}</span>
            ),
          },
          {
            key: "status",
            label: "Status",
            width: "100px",
            render: (s) =>
              s.isActive ? (
                <McPill tone="success">Aktiv</McPill>
              ) : (
                <McPill tone="default">Inaktiv</McPill>
              ),
          },
          {
            key: "plan",
            label: "Plan",
            width: "100px",
            render: (s) =>
              s.hasActivePlan ? (
                <McPill tone="accent">Aktiv plan</McPill>
              ) : (
                <McPill tone="default">Ingen</McPill>
              ),
          },
          {
            key: "next",
            label: "Neste økt",
            width: "120px",
            render: (s) => (
              <span className="text-[12px] text-white/55">
                {s.nextBookingDate
                  ? new Date(s.nextBookingDate).toLocaleDateString("nb-NO", {
                      day: "numeric",
                      month: "short",
                    })
                  : "—"}
              </span>
            ),
          },
          {
            key: "sessions",
            label: "Økter/mnd",
            width: "90px",
            render: (s) => (
              <span className="font-mono text-[12px] text-white/70">{s.sessionsThisMonth}</span>
            ),
          },
        ]}
        rows={filtered}
        keyExtractor={(s) => s.id}
        onRowClick={handleRowClick}
        emptyText="Ingen spillere matcher søket."
      />
    </div>
  );
}

/* ─── Helpers ─── */

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-colors"
      style={
        active
          ? {
              background: "rgba(209,248,67,0.12)",
              color: "#D1F843",
              border: "1px solid rgba(209,248,67,0.25)",
            }
          : {
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.06)",
            }
      }
    >
      {children}
    </button>
  );
}

function initials(name: string | null): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const PALETTE = ["#6FCBA1", "#6FB3FF", "#E8B967", "#C896E8", "#F49283", "#D1F843"];

function avatarColor(seed: string | null): string {
  if (!seed) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
