"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Search, User, Mail, Phone, Trophy, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  handicap: number | null;
  tier: string;
  sessionsCompleted: number;
  memberSince: Date;
}

interface PlayersClientProps {
  players: Player[];
}

const tierColors: Record<string, string> = {
  VISITOR: "bg-[var(--color-ink-80)] text-[var(--color-ink-40)]",
  ACADEMY: "bg-[var(--color-gold)]/20 text-[var(--color-gold)]",
  STARTER: "bg-blue-500/20 text-blue-400",
  PRO: "bg-purple-500/20 text-purple-400",
  ELITE: "bg-green-500/20 text-green-400",
};

const tierLabels: Record<string, string> = {
  VISITOR: "Besokende",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Elite",
};

export function PlayersClient({ players }: PlayersClientProps) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string | null>(null);

  const filtered = players.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchesTier = !tierFilter || p.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const tiers = ["VISITOR", "ACADEMY", "STARTER", "PRO", "ELITE"];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-ink-50)]" />
          <input
            type="text"
            placeholder="Sok etter navn eller e-post..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-ink-90)] border border-[var(--color-ink-80)] rounded-lg text-white placeholder:text-[var(--color-ink-50)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTierFilter(null)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              !tierFilter
                ? "bg-[var(--color-gold)] text-[var(--color-ink-100)]"
                : "bg-[var(--color-ink-90)] text-[var(--color-ink-40)] hover:text-white"
            )}
          >
            Alle
          </button>
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                tierFilter === tier
                  ? "bg-[var(--color-gold)] text-[var(--color-ink-100)]"
                  : "bg-[var(--color-ink-90)] text-[var(--color-ink-40)] hover:text-white"
              )}
            >
              {tierLabels[tier]}
            </button>
          ))}
        </div>
      </div>

      {/* Player list */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-ink-50)]">
            Ingen spillere funnet
          </div>
        ) : (
          filtered.map((player) => (
            <Link
              key={player.id}
              href={`/portal/admin/elever/${player.id}`}
              className="block bg-[var(--color-ink-90)] rounded-xl p-4 hover:bg-[var(--color-ink-80)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-ink-80)] flex items-center justify-center">
                    <User className="h-6 w-6 text-[var(--color-ink-50)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{player.name}</h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          tierColors[player.tier]
                        )}
                      >
                        {tierLabels[player.tier]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-ink-50)]">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {player.email}
                      </span>
                      {player.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {player.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="flex items-center gap-1 text-[var(--color-ink-40)]">
                    <Trophy className="h-4 w-4" />
                    <span>
                      HCP: {player.handicap !== null ? player.handicap : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--color-ink-50)] mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{player.sessionsCompleted} okter</span>
                  </div>
                  <p className="text-xs text-[var(--color-ink-50)] mt-1">
                    Medlem{" "}
                    {formatDistanceToNow(new Date(player.memberSince), {
                      addSuffix: false,
                      locale: nb,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
