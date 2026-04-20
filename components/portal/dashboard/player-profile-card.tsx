"use client";

import Image from "next/image";
import { colors } from "@/lib/design-tokens";

interface PlayerProfileCardProps {
  userName: string | null;
  tier: string;
  memberSince: string | null;
  handicap: number | null;
  roundsCount: number;
  bestScore?: string;
}

const tierLabel: Record<string, string> = {
  VISITOR: "Gratis",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Elite",
};

export function PlayerProfileCard({
  userName,
  tier,
  memberSince,
  handicap,
  roundsCount,
  bestScore = "78 (+6)",
}: PlayerProfileCardProps) {
  const firstName = userName?.split(" ")[0] ?? "Spiller";
  const lastName = userName?.split(" ").slice(1).join(" ") ?? "";

  return (
    <div
      className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl shadow-sm"
      style={{ backgroundColor: colors.primary.dark }}
    >
      {/* Top image area */}
      <div className="relative h-[45%]">
        <Image
          src="/images/team/anders-kristiansen.jpg"
          alt={userName ?? "Spiller"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F18] to-transparent" />
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight text-surface"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
        >
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.primary.accent }} />
          {tierLabel[tier] ?? tier}
        </div>
      </div>

      {/* Bottom content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="text-xl font-bold text-surface">
            {firstName} {lastName}
          </h3>
          <p className="text-xs text-surface/50">
            Medlem siden {memberSince ?? "2023"}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <p className="mb-1 text-[9px] font-bold uppercase text-surface/40">HCP</p>
            <p className="text-xl font-bold" style={{ color: colors.primary.accent }}>
              {handicap ?? 0}
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <p className="mb-1 text-[9px] font-bold uppercase text-surface/40">Runder</p>
            <p className="text-xl font-bold" style={{ color: colors.data.coral }}>
              {roundsCount}
            </p>
          </div>
          <div
            className="col-span-2 rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <p className="mb-1 text-[9px] font-bold uppercase text-surface/40">Beste score</p>
            <p className="text-xl font-bold text-surface">{bestScore}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
