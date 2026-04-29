"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Download,
  LayoutGrid,
  SlidersHorizontal,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { FilterToolbar, type FilterChipDef } from "./filter-toolbar";
import { SpillerePageHead } from "./page-head";
import { PlayersTable } from "./players-table";
import { StatStrip } from "./stat-strip";
import type { PlayerListRow } from "./types";

const CHIPS: FilterChipDef[] = [
  { id: "alle", label: "Alle", count: 42 },
  { id: "performance", label: "Performance", count: 14 },
  { id: "pro", label: "Pro plan", count: 22 },
  { id: "junior", label: "Junior", count: 6 },
  { id: "inaktive", label: "Inaktive", icon: AlertCircle },
  { id: "stiger", label: "Stiger", icon: TrendingUp },
];

export function PlayersListClient({ rows }: { rows: PlayerListRow[] }) {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("alle");

  const filtered = useMemo(() => {
    let result = rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.username.toLowerCase().includes(q),
      );
    }
    if (activeChip === "performance") {
      result = result.filter((r) => r.plan === "Performance");
    } else if (activeChip === "pro") {
      result = result.filter((r) => r.plan === "Pro");
    } else if (activeChip === "junior") {
      // TODO: ekte junior-flagg fra Player-modellen
      result = result.filter((r) => r.hcp >= 14 && r.hcp < 20);
    } else if (activeChip === "inaktive") {
      result = result.filter((r) => r.status === "inactive");
    } else if (activeChip === "stiger") {
      result = result.filter((r) => r.sgRecent > 0.1);
    }
    return result;
  }, [rows, search, activeChip]);

  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <SpillerePageHead
        eyebrow="Personer"
        title="Alle spillere"
        subtitle="Sortér på HCP, SG-trend, eller siste runde. Klikk en rad for full profil."
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-[13px] font-medium text-white/80 transition hover:bg-white/5"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.8} /> Eksport CSV
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:border-white/20 hover:bg-white/10"
            >
              <Users className="h-3.5 w-3.5" strokeWidth={1.8} /> Inviter mange
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#005840] bg-[#005840] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#00422F]"
            >
              <UserPlus className="h-3.5 w-3.5" strokeWidth={1.8} /> Ny spiller
            </button>
          </>
        }
      />

      <StatStrip
        items={[
          { label: "Aktive", value: "42" },
          { label: "Nye 30 d", value: "+5" },
          { label: "Inaktive 14 d+", value: "3", tone: "danger" },
          { label: "Snitt HCP", value: "12.4" },
          { label: "Snitt SG-trend", value: "+0.18", tone: "success" },
        ]}
      />

      <FilterToolbar
        searchPlaceholder="Søk navn, e-post, klubb…"
        chips={CHIPS}
        activeChip={activeChip}
        onChipChange={setActiveChip}
        searchValue={search}
        onSearchChange={setSearch}
        rightSlot={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-[13px] font-medium text-white/80 transition hover:bg-white/5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} />
              Filter
            </button>
            <Link
              href="/portal/admin/spillere/grid"
              className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-[13px] font-medium text-white/80 transition hover:bg-white/5"
            >
              <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.8} /> Kort
            </Link>
          </>
        }
      />

      <PlayersTable rows={filtered} />
    </div>
  );
}
