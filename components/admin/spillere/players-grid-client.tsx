"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { FilterToolbar, type FilterChipDef } from "./filter-toolbar";
import { SpillerePageHead } from "./page-head";
import { PlayerGroup } from "./player-group";
import { StatStrip } from "./stat-strip";
import type { PlayerGroup as PlayerGroupData } from "./types";

const CHIPS: FilterChipDef[] = [
  { id: "alle", label: "Alle", count: 42 },
  { id: "performance", label: "Performance", count: 14 },
  { id: "pro", label: "Pro plan", count: 22 },
  { id: "junior", label: "Junior", count: 6 },
  {
    id: "trenger-handling",
    label: "Trenger handling",
    count: 7,
    icon: AlertTriangle,
  },
];

export function PlayersGridClient({ groups }: { groups: PlayerGroupData[] }) {
  const [activeChip, setActiveChip] = useState("alle");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <SpillerePageHead
        eyebrow="Personer · Visuell oversikt"
        title="Hvem trenger oppmerksomhet?"
        subtitle="Kort per spiller gruppert på risiko og framgang. Røde markører = trenger handling. Grønne = stiger."
        actions={
          <>
            <div className="inline-flex rounded-lg border border-[#1a4a3a] bg-[#0D2E23] p-0.5">
              <Link
                href="/portal/admin/spillere"
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-mono text-[11px] tracking-[0.06em] text-white/55 hover:text-white"
              >
                <List className="h-3 w-3" strokeWidth={1.8} /> LISTE
              </Link>
              <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(209,248,67,0.14)] px-2.5 py-1.5 font-mono text-[11px] tracking-[0.06em] text-[#D1F843]">
                <LayoutGrid className="h-3 w-3" strokeWidth={1.8} /> KORT
              </span>
            </div>
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
          { label: "Stiger", value: "14", tone: "success" },
          { label: "Stabile", value: "21" },
          { label: "Synker", value: "4", tone: "warning" },
          { label: "Inaktive 14d+", value: "3", tone: "danger" },
          { label: "Nye 30d", value: "+5", tone: "accent" },
        ]}
      />

      <FilterToolbar
        searchPlaceholder="Filtrer på navn, klubb, eller tag…"
        chips={CHIPS}
        activeChip={activeChip}
        onChipChange={setActiveChip}
        searchValue={search}
        onSearchChange={setSearch}
        rightSlot={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1a4a3a] bg-[#0D2E23] px-3 py-1.5 text-[12px] text-white"
            >
              <ArrowUpDown className="h-3 w-3 text-white/50" strokeWidth={1.8} />
              Sortér: Risiko først
              <ChevronDown className="h-3 w-3 text-white/50" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3 py-1.5 text-[11px] font-medium text-white/80 transition hover:bg-white/5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} />
              Filter
            </button>
          </>
        }
      />

      {groups.map((group) => (
        <PlayerGroup key={group.id} group={group} />
      ))}

      <div className="mt-7 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:border-white/20 hover:bg-white/10"
        >
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          Vis 18 stabile spillere til
        </button>
      </div>
    </div>
  );
}
