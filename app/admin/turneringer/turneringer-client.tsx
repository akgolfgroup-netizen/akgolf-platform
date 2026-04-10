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
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminBadge,
  AdminStatCard,
  AdminPageHeader,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
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

        setForm({
          name: "",
          startDate: "",
          level: "club",
          location: "",
          externalUrl: "",
        });
        onCreated();
        onClose();
      } catch {
        setError("Kunne ikke opprette turnering");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <AdminCard className="w-full max-w-lg">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
          Ny turnering
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput
            label="Navn"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="f.eks. NM Junior 2026"
          />
          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label="Startdato"
              type="date"
              required
              value={form.startDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, startDate: e.target.value }))
              }
            />
            <AdminSelect
              label="Nivå"
              value={form.level}
              onChange={(e) =>
                setForm((f) => ({ ...f, level: e.target.value }))
              }
            >
              <option value="club">Klubb</option>
              <option value="regional">Regional</option>
              <option value="national">Nasjonal</option>
              <option value="international">Internasjonal</option>
            </AdminSelect>
          </div>
          <AdminInput
            label="Sted"
            type="text"
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
            placeholder="f.eks. Oslo GK"
          />
          <AdminInput
            label="Ekstern lenke"
            type="url"
            value={form.externalUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, externalUrl: e.target.value }))
            }
            placeholder="https://..."
          />

          {error && (
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isPending}
            >
              Avbryt
            </AdminButton>
            <AdminButton type="submit" variant="primary" loading={isPending}>
              {isPending ? "Oppretter..." : "Opprett turnering"}
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}

const STATUS_CONFIG: Record<
  "upcoming" | "ongoing" | "completed",
  {
    label: string;
    variant: "success" | "info" | "muted";
    iconWrapClass: string;
    iconClass: string;
  }
> = {
  ongoing: {
    label: "Pågående",
    variant: "info",
    iconWrapClass: "bg-[var(--color-primary)]/10",
    iconClass: "text-[var(--color-primary)]",
  },
  upcoming: {
    label: "Kommende",
    variant: "success",
    iconWrapClass: "bg-[var(--color-success)]/10",
    iconClass: "text-[var(--color-success)]",
  },
  completed: {
    label: "Fullført",
    variant: "muted",
    iconWrapClass: "bg-[var(--color-grey-100)]",
    iconClass: "text-[var(--color-muted)]",
  },
};

interface TurneringerClientProps {
  initialTournaments: TournamentItem[];
  stats: TournamentStats;
}

export function TurneringerClient({
  initialTournaments,
  stats,
}: TurneringerClientProps) {
  const { toggle } = useMCSidebar();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [tournaments, setTournaments] = useState(initialTournaments);

  const filteredTournaments =
    filter === "all"
      ? tournaments
      : tournaments.filter((t) => t.status === filter);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Er du sikker på at du vil slette "${name}"?`)) return;

    startTransition(async () => {
      const result = await deleteTournament(id);
      if (result.success) {
        setTournaments((prev) => prev.filter((t) => t.id !== id));
      }
    });
  }

  function handleCreated() {
    window.location.reload();
  }

  const filterTabs: Array<{ id: StatusFilter; label: string }> = [
    { id: "all", label: "Alle" },
    { id: "upcoming", label: "Kommende" },
    { id: "ongoing", label: "Pågående" },
    { id: "completed", label: "Fullført" },
  ];

  return (
    <>
      <MCTopbar
        title="Turneringer"
        subtitle="Administrer turneringer og spillerplaner"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Turneringer"
          subtitle="Administrer turneringer og spillerplaner"
          actions={
            <AdminButton
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowModal(true)}
            >
              Ny turnering
            </AdminButton>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Kommende"
            value={stats.upcoming}
            icon={<Calendar className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Pågående"
            value={stats.ongoing}
            icon={<Clock className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Fullført"
            value={stats.completed}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Totale spillere"
            value={stats.totalPlayers}
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        {/* Filter tabs */}
        <AdminCard>
          <div className="flex gap-2 flex-wrap">
            {filterTabs.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border",
                  filter === f.id
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "bg-white border-[var(--color-grey-200)] text-[var(--color-text)] hover:bg-[var(--color-grey-100)]",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </AdminCard>

        {/* Tournaments List */}
        {filteredTournaments.length === 0 ? (
          <AdminEmptyState
            icon={<Trophy className="w-6 h-6" />}
            title="Ingen turneringer funnet"
            description="Opprett en ny turnering for å komme i gang."
            action={
              <AdminButton
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowModal(true)}
              >
                Ny turnering
              </AdminButton>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredTournaments.map((tournament) => {
              const config =
                STATUS_CONFIG[tournament.status] ?? STATUS_CONFIG.upcoming;
              return (
                <AdminCard key={tournament.id}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          config.iconWrapClass,
                        )}
                      >
                        <Trophy className={cn("w-6 h-6", config.iconClass)} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-[var(--color-text)]">
                            {tournament.name}
                          </h3>
                          <AdminBadge variant={config.variant}>
                            {config.label}
                          </AdminBadge>
                          {tournament.source && (
                            <AdminBadge variant="muted">
                              {tournament.source}
                            </AdminBadge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(tournament.startDate), "d. MMM", {
                              locale: nb,
                            })}
                            {tournament.endDate
                              ? ` - ${format(
                                  new Date(tournament.endDate),
                                  "d. MMM yyyy",
                                  { locale: nb },
                                )}`
                              : ` ${format(
                                  new Date(tournament.startDate),
                                  "yyyy",
                                  { locale: nb },
                                )}`}
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
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/admin/turneringer/${tournament.id}`}>
                        <AdminButton variant="secondary">Se plan</AdminButton>
                      </Link>
                      {tournament.externalUrl && (
                        <a
                          href={tournament.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn-ghost"
                          aria-label="Åpne ekstern lenke"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <AdminButton
                        variant="danger"
                        onClick={() =>
                          handleDelete(tournament.id, tournament.name)
                        }
                        disabled={isPending}
                        aria-label="Slett turnering"
                      >
                        <Trash2 className="w-4 h-4" />
                      </AdminButton>
                    </div>
                  </div>
                </AdminCard>
              );
            })}
          </div>
        )}
      </div>

      <NyTurneringModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
