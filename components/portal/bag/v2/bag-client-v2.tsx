"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addClub,
  deleteClub,
  type PlayerClubData,
  type GapAnalysisItem,
} from "@/app/portal/(dashboard)/bag/actions";
import { BagHero } from "./bag-hero";
import { GappingChart } from "./gapping-chart";
import { EquipmentGrid } from "./equipment-grid";
import { RecommendationCard } from "./recommendation-card";
import { AddClubForm } from "./add-club-form";
import { accent, monoFont } from "./styles";

interface Props {
  clubs: PlayerClubData[];
  gapAnalysis: GapAnalysisItem[];
}

export function BagClientV2({ clubs: initialClubs, gapAnalysis }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [clubs, setClubs] = useState(initialClubs);
  const [showAdd, setShowAdd] = useState(false);

  const flagCount = gapAnalysis.filter((g) => g.gap > 18).length;

  function handleAdd(data: { name: string; brand?: string; avgCarry?: number }) {
    startTransition(async () => {
      const club = await addClub(data);
      if (club) {
        setClubs((prev) => [
          ...prev,
          {
            ...club,
            model: club.model ?? null,
            loft: club.loft ?? null,
            avgTotal: club.avgTotal ?? null,
            avgOffline: club.avgOffline ?? null,
            shotCount: club.shotCount ?? 0,
            sortOrder: club.sortOrder ?? prev.length,
          } as PlayerClubData,
        ]);
      }
      setShowAdd(false);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteClub(id);
      setClubs((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    });
  }

  return (
    <div
      className="rounded-[24px] p-7 lg:p-9"
      style={{ background: "#0A1F18", minHeight: "calc(100vh - 120px)" }}
    >
      <header className="mb-6">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: accent, fontFamily: monoFont }}
        >
          / Utstyr · bag
        </div>
        <h1 className="mt-2 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[48px]">
          {clubs.length === 14
            ? "14 klubber. Klar for sesongen."
            : `${clubs.length} klubber registrert.`}
        </h1>
        <p className="mt-3 max-w-[60ch] text-[14px] leading-[1.6] text-white/65">
          Carry-distansene oppdateres fra Trackman-okter og runder. Sjekk gap-rekken under for
          manglende dekning, og bruk anbefalingene til a optimalisere bagen.
        </p>
      </header>

      <BagHero clubs={clubs} flagCount={flagCount} onAdd={() => setShowAdd(true)} />

      {showAdd ? (
        <AddClubForm
          takenNames={clubs.map((c) => c.name)}
          pending={pending}
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      ) : null}

      {clubs.length > 0 ? <GappingChart clubs={clubs} /> : null}

      <EquipmentGrid clubs={clubs} onDelete={handleDelete} pending={pending} />

      <RecommendationCard gaps={gapAnalysis} />
    </div>
  );
}
