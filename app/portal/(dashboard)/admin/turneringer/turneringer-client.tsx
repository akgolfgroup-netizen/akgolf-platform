"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Users,
  MapPin,
  Plus,
  ExternalLink,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar, HGStatCard } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type { TournamentItem, TournamentStats } from "./actions";
import { deleteTournament } from "./actions";

type StatusFilter = "all" | "upcoming" | "ongoing" | "completed";

interface NyTurneringModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

function NyTurneringModal({ open, onClose, onCreated }: NyTurneringModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    level: "club",
    location: "",
    externalUrl: "",
  });

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/portal/tournament-planner/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Noe gikk galt");
          return;
        }

        setForm({ name: "", startDate: "", level: "club", location: "", externalUrl: "" });
        onCreated();
        onClose();
      } catch {
        setError("Kunne ikke opprette turnering");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="hg-card w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--hg-text)] mb-4">Ny turnering</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--hg-text-muted)] mb-1">
              Navn *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 text-sm text-[var(--hg-text)]"
              placeholder="f.eks. NM Junior 2026"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--hg-text-muted)] mb-1">
                Startdato *
              </label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 text-sm text-[var(--hg-text)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--hg-text-muted)] mb-1">
                Nivaa
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                className="w-full rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 text-sm text-[var(--hg-text)]"
              >
                <option value="club">Klubb</option>
                <option value="regional">Regional</option>
                <option value="national">Nasjonal</option>
                <option value="international">Internasjonal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hg-text-muted)] mb-1">
              Sted
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="w-full rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 text-sm text-[var(--hg-text)]"
              placeholder="f.eks. Oslo GK"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hg-text-muted)] mb-1">
              Ekstern lenke
            </label>
            <input
              type="url"
              value={form.externalUrl}
              onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value }))}
              className="w-full rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 text-sm text-[var(--hg-text)]"
              placeholder="https://..."
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="hg-btn hg-btn-secondary text-sm"
              disabled={isPending}
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="hg-btn hg-btn-primary text-sm"
              disabled={isPending}
            >
              {isPending ? "Oppretter..." : "Opprett turnering"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TurneringerClientProps {
  initialTournaments: TournamentItem[];
  stats: TournamentStats;
}

export function TurneringerClient({ initialTournaments, stats }: TurneringerClientProps) {
  const { toggle } = useMCSidebar();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [tournaments, setTournaments] = useState(initialTournaments);

  const filteredTournaments =
    filter === "all" ? tournaments : tournaments.filter((t) => t.status === filter);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Er du sikker pa at du vil slette "${name}"?`)) return;

    startTransition(async () => {
      const result = await deleteTournament(id);
      if (result.success) {
        setTournaments((prev) => prev.filter((t) => t.id !== id));
      }
    });
  }

  function handleCreated() {
    // Reloader siden for a hente oppdatert data
    window.location.reload();
  }

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
            {(
              [
                { id: "all", label: "Alle" },
                { id: "upcoming", label: "Kommende" },
                { id: "ongoing", label: "Pagaende" },
                { id: "completed", label: "Fullfort" },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn("hg-tab", filter === f.id && "active")}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            className="hg-btn hg-btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4" />
            Ny turnering
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard label="Kommende" value={stats.upcoming} icon={Calendar} />
          <HGStatCard label="Pagaende" value={stats.ongoing} icon={Clock} />
          <HGStatCard label="Fullfort" value={stats.completed} icon={CheckCircle} />
          <HGStatCard label="Totale spillere" value={stats.totalPlayers} icon={Users} />
        </div>

        {/* Tournaments List */}
        <div className="space-y-4">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="hg-card p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      tournament.status === "ongoing" && "bg-[var(--hg-primary)]/10",
                      tournament.status === "upcoming" && "bg-[var(--hg-success)]/10",
                      tournament.status === "completed" && "bg-[var(--hg-surface-raised)]"
                    )}
                  >
                    <Trophy
                      className={cn(
                        "w-6 h-6",
                        tournament.status === "ongoing" && "text-[var(--hg-primary)]",
                        tournament.status === "upcoming" && "text-[var(--hg-success)]",
                        tournament.status === "completed" && "text-[var(--hg-text-muted)]"
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[var(--hg-text)]">{tournament.name}</h3>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          tournament.status === "ongoing" &&
                            "text-[var(--hg-primary)] bg-[var(--hg-primary)]/10",
                          tournament.status === "upcoming" &&
                            "text-[var(--hg-success)] bg-[var(--hg-success)]/10",
                          tournament.status === "completed" &&
                            "text-[var(--hg-text-muted)] bg-[var(--hg-surface-raised)]"
                        )}
                      >
                        {tournament.status === "ongoing" && "Pagaende"}
                        {tournament.status === "upcoming" && "Kommende"}
                        {tournament.status === "completed" && "Fullfort"}
                      </span>
                      {tournament.source && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                          {tournament.source}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--hg-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(tournament.startDate), "d. MMM", { locale: nb })}
                        {tournament.endDate &&
                          ` - ${format(new Date(tournament.endDate), "d. MMM yyyy", { locale: nb })}`}
                        {!tournament.endDate &&
                          ` ${format(new Date(tournament.startDate), "yyyy", { locale: nb })}`}
                      </span>
                      {tournament.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {tournament.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {tournament.playerCount} spillere
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/portal/admin/turneringer/${tournament.id}`}
                    className="hg-btn hg-btn-secondary text-sm"
                  >
                    Se plan
                  </Link>
                  {tournament.externalUrl && (
                    <a
                      href={tournament.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[var(--hg-surface-raised)] hover:bg-[var(--hg-border)] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-[var(--hg-text-muted)]" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(tournament.id, tournament.name)}
                    disabled={isPending}
                    className="p-2 rounded-lg bg-[var(--hg-surface-raised)] hover:bg-[var(--color-error)]/10 transition-colors group"
                  >
                    <Trash2 className="w-4 h-4 text-[var(--hg-text-muted)] group-hover:text-[var(--color-error)]" />
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

      <NyTurneringModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
