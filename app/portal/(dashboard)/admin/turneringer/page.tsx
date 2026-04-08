"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Users,
  MapPin,
  Plus,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar, HGStatCard } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

// Mock data
const mockTournaments = [
  {
    id: "t1",
    name: "NM Junior 2025",
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-06-17"),
    location: "Oslo GK",
    playerCount: 5,
    status: "upcoming",
  },
  {
    id: "t2",
    name: "Vestlandsmesterskapet",
    startDate: new Date("2025-05-20"),
    endDate: new Date("2025-05-22"),
    location: "Fana GK",
    playerCount: 3,
    status: "upcoming",
  },
  {
    id: "t3",
    name: "Lag-NM",
    startDate: new Date("2025-04-10"),
    endDate: new Date("2025-04-12"),
    location: "Losby GK",
    playerCount: 8,
    status: "ongoing",
  },
  {
    id: "t4",
    name: "Nordisk Junior",
    startDate: new Date("2025-03-15"),
    endDate: new Date("2025-03-17"),
    location: "Halmstad GK",
    playerCount: 2,
    status: "completed",
  },
];

export default function TurneringerPage() {
  const { toggle } = useMCSidebar();
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");

  const filteredTournaments = mockTournaments.filter(
    t => filter === "all" || t.status === filter
  );

  const upcomingCount = mockTournaments.filter(t => t.status === "upcoming").length;
  const ongoingCount = mockTournaments.filter(t => t.status === "ongoing").length;
  const completedCount = mockTournaments.filter(t => t.status === "completed").length;
  const totalPlayers = mockTournaments.reduce((sum, t) => sum + t.playerCount, 0);

  return (
    <>
      <MCTopbar
        title="Turneringer"
        subtitle="Administrer turneringer og spillerplaner"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="hg-tabs">
            {[
              { id: "all", label: "Alle" },
              { id: "upcoming", label: "Kommende" },
              { id: "ongoing", label: "Pågående" },
              { id: "completed", label: "Fullført" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className={cn("hg-tab", filter === f.id && "active")}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button className="hg-btn hg-btn-primary">
            <Plus className="w-4 h-4" />
            Ny turnering
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard
            label="Kommende"
            value={upcomingCount}
            icon={Calendar}
          />
          <HGStatCard
            label="Pågående"
            value={ongoingCount}
            icon={Clock}
          />
          <HGStatCard
            label="Fullført"
            value={completedCount}
            icon={CheckCircle}
          />
          <HGStatCard
            label="Totale spillere"
            value={totalPlayers}
            icon={Users}
          />
        </div>

        {/* Tournaments List */}
        <div className="space-y-4">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="hg-card p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    tournament.status === "ongoing" && "bg-[var(--hg-primary)]/10",
                    tournament.status === "upcoming" && "bg-[var(--hg-success)]/10",
                    tournament.status === "completed" && "bg-[var(--hg-surface-raised)]"
                  )}>
                    <Trophy className={cn(
                      "w-6 h-6",
                      tournament.status === "ongoing" && "text-[var(--hg-primary)]",
                      tournament.status === "upcoming" && "text-[var(--hg-success)]",
                      tournament.status === "completed" && "text-[var(--hg-text-muted)]"
                    )} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[var(--hg-text)]">{tournament.name}</h3>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        tournament.status === "ongoing" && "text-[var(--hg-primary)] bg-[var(--hg-primary)]/10",
                        tournament.status === "upcoming" && "text-[var(--hg-success)] bg-[var(--hg-success)]/10",
                        tournament.status === "completed" && "text-[var(--hg-text-muted)] bg-[var(--hg-surface-raised)]"
                      )}>
                        {tournament.status === "ongoing" && "Pågående"}
                        {tournament.status === "upcoming" && "Kommende"}
                        {tournament.status === "completed" && "Fullført"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--hg-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(tournament.startDate, "d. MMM", { locale: nb })} - {format(tournament.endDate, "d. MMM yyyy", { locale: nb })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {tournament.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {tournament.playerCount} spillere
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/portal/admin/denne-uken`}
                    className="hg-btn hg-btn-secondary text-sm"
                  >
                    Se plan
                  </Link>
                  <button className="p-2 rounded-lg bg-[var(--hg-surface-raised)] hover:bg-[var(--hg-border)] transition-colors">
                    <ExternalLink className="w-4 h-4 text-[var(--hg-text-muted)]" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredTournaments.length === 0 && (
            <div className="hg-card py-16 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-[var(--hg-text-muted)] opacity-50" />
              <p className="text-[var(--hg-text-muted)]">Ingen turneringer funnet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
