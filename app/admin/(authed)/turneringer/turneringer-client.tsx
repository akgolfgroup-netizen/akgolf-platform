"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
 AdminInput,
 AdminSelect,
 AdminStatCard,
 AdminPageHeader,
 AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type { TournamentItem, TournamentStats } from "./actions";
import { deleteTournament } from "./actions";

type StatusFilter = "all"| "upcoming"| "ongoing"| "completed";

interface NyTurneringModalProps {
 open: boolean;
 onClose: () => void;
 onCreated: () => void;
}

function NyTurneringModal({ open, onClose, onCreated }: NyTurneringModalProps) {
 const [isPending, startTransition] = useTransition();
 const [error, setError] = useState<string | null>(null);
 const [form, setForm] = useState({
 name:"",
 startDate:"",
 level: "club",
 location:"",
 externalUrl:"",
 });

 if (!open) return null;

 function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
 setError(null);

 startTransition(async () => {
 try {
 const res = await fetch("/api/portal/tournament-planner/create", {
 method: "POST",
 headers: { "Content-Type": "application/json"},
 body: JSON.stringify(form),
 });

 if (!res.ok) {
 const data = await res.json();
 setError(data.error || "Noe gikk galt");
 return;
 }

 setForm({
 name:"",
 startDate:"",
 level: "club",
 location:"",
 externalUrl:"",
 });
 onCreated();
 onClose();
 } catch {
 setError("Kunne ikke opprette turnering");
 }
 });
 }

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 p-4">
 <Card className="w-full max-w-lg">
 <h2 className="text-lg font-semibold text-on-surface mb-4">
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
 <p className="text-sm text-error">{error}</p>
 )}

 <div className="flex justify-end gap-2 pt-2">
 <Button
 type="button"
 variant="secondary"
 onClick={onClose}
 disabled={isPending}
 >
 Avbryt
 </Button>
 <Button type="submit" variant="accent" isLoading={isPending}>
 {isPending ? "Oppretter...": "Opprett turnering"}
 </Button>
 </div>
 </form>
 </Card>
 </div>
 );
}

const STATUS_CONFIG: Record<
 "upcoming"| "ongoing"| "completed",
 {
 label: string;
 variant: "success"| "info"| "muted";
 iconWrapClass: string;
 iconClass: string;
 }
> = {
 ongoing: {
 label: "Pågående",
 variant: "info",
 iconWrapClass: "bg-surface-container",
 iconClass: "text-text",
 },
 upcoming: {
 label: "Kommende",
 variant: "success",
 iconWrapClass: "bg-surface-container",
 iconClass: "text-on-surface-variant/80",
 },
 completed: {
 label: "Fullført",
 variant: "muted",
 iconWrapClass: "bg-surface-container",
 iconClass: "text-on-surface-variant",
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
 { id: "all", label: "Alle"},
 { id: "upcoming", label: "Kommende"},
 { id: "ongoing", label: "Pågående"},
 { id: "completed", label: "Fullført"},
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
 <Button
 variant="accent"
 onClick={() => setShowModal(true)}
 >
 <Icon name="add" className="w-4 h-4 mr-2" />
 Ny turnering
 </Button>
 }
 />

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 <AdminStatCard
 label="Kommende"
 value={stats.upcoming}
 icon={<Icon name="calendar_today" className="w-5 h-5" />}
 />
 <AdminStatCard
 label="Pågående"
 value={stats.ongoing}
 icon={<Icon name="schedule" className="w-5 h-5" />}
 />
 <AdminStatCard
 label="Fullført"
 value={stats.completed}
 icon={<Icon name="check"Circle className="w-5 h-5" />}
 />
 <AdminStatCard
 label="Totale spillere"
 value={stats.totalPlayers}
 icon={<Icon name="person"s className="w-5 h-5" />}
 />
 </div>

 {/* Filter tabs */}
 <Card>
 <div className="flex gap-2 flex-wrap">
 {filterTabs.map((f) => (
 <button
 key={f.id}
 type="button"
 onClick={() => setFilter(f.id)}
 className={cn(
 "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border",
 filter === f.id
 ? "bg-on-surface text-surface border-black"
 : "bg-surface-container-lowest border-outline-variant/30 text-text hover:bg-surface-container",
 )}
 >
 {f.label}
 </button>
 ))}
 </div>
 </Card>

 {/* Tournaments List */}
 {filteredTournaments.length === 0 ? (
 <AdminEmptyState
 icon={<Icon name="emoji_events" className="w-6 h-6" />}
 title="Ingen turneringer funnet"
 description="Opprett en ny turnering for å komme i gang."
 action={
 <Button
 variant="accent"
 onClick={() => setShowModal(true)}
 >
 <Icon name="add" className="w-4 h-4 mr-2" />
 Ny turnering
 </Button>
 }
 />
 ) : (
 <div className="space-y-4">
 {filteredTournaments.map((tournament) => {
 const config =
 STATUS_CONFIG[tournament.status] ?? STATUS_CONFIG.upcoming;
 return (
 <Card key={tournament.id}>
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-start gap-4">
 <div
 className={cn(
 "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
 config.iconWrapClass,
 )}
 >
 <Icon name="emoji_events" className={cn("w-6 h-6", config.iconClass)} />
 </div>
 <div className="min-w-0">
 <div className="flex items-center gap-2 mb-1 flex-wrap">
 <h3 className="font-semibold text-on-surface">
 {tournament.name}
 </h3>
 <Badge variant={config.variant}>
 {config.label}
 </Badge>
 {tournament.source && (
 <Badge variant="muted">
 {tournament.source}
 </Badge>
 )}
 </div>
 <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant/80">
 <span className="flex items-center gap-1">
 <Icon name="calendar_today" className="w-3.5 h-3.5" />
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
 <Icon name="location_on" className="w-3.5 h-3.5" />
 {tournament.location}
 </span>
 )}
 <span className="flex items-center gap-1">
 <Icon name="person"s className="w-3.5 h-3.5" />
 {tournament.playerCount} spillere
 </span>
 </div>
 </div>
 </div>
 <div className="flex gap-2 shrink-0">
 <Link href={`/admin/turneringer/${tournament.id}`}>
 <Button variant="secondary">Se plan</Button>
 </Link>
 {tournament.externalUrl && (
 <a
 href={tournament.externalUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="admin-btn admin-btn-ghost"
 aria-label="Åpne ekstern lenke"
 >
 <Icon name="open_in_new" className="w-4 h-4" />
 </a>
 )}
 <Button
 variant="destructive"
 onClick={() =>
 handleDelete(tournament.id, tournament.name)
 }
 disabled={isPending}
 aria-label="Slett turnering"
 >
 <Icon name="delete" className="w-4 h-4" />
 </Button>
 </div>
 </div>
 </Card>
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
