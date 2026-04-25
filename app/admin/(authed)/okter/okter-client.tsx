"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { MonoLabel, BentoGrid, BentoCard, NightSurface, GlassPanel } from "@/components/portal/patterns";
import type { SessionItem, SessionStats } from "./actions";
import { saveSessionNotes } from "./actions";
import { BookingStatus } from "@prisma/client";

type StatusVariant = "success"| "error"| "muted";

const statusConfig: Record<
 string,
 {
 label: string;
 icon: typeof CheckCircle;
 variant: StatusVariant;
 iconClass: string;
 }
> = {
 COMPLETED: {
 label: "Fullført",
 icon: CheckCircle,
 variant: "success",
 iconClass: "bg-surface text-on-surface-variant",
 },
 CANCELLED: {
 label: "Avlyst",
 icon: XCircle,
 variant: "error",
 iconClass: "bg-surface text-on-surface-variant",
 },
 NO_SHOW: {
 label: "No-show",
 icon: AlertCircle,
 variant: "muted",
 iconClass: "bg-surface text-on-surface-variant",
 },
};

type FilterItem = {
 label: string;
 value: string;
 count: number;
};

interface OkterClientProps {
 initialSessions: SessionItem[];
 stats: SessionStats;
}

export function OkterClient({ initialSessions, stats }: OkterClientProps) {
 const { toggle } = useMCSidebar();
 const [activeFilter, setActiveFilter] = useState("all");
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedSession, setSelectedSession] = useState<string | null>(null);
 const [notesValue, setNotesValue] = useState("");
 const [isPending, startTransition] = useTransition();

 const filters: FilterItem[] = [
 { label: "Alle", value: "all", count: stats.total },
 { label: "Fullført", value: "completed", count: stats.completed },
 { label: "Avlyst", value: "cancelled", count: stats.cancelled },
 { label: "No-show", value: "no-show", count: stats.noShow },
 ];

 const statusFilterMap: Record<string, BookingStatus> = {
 completed: BookingStatus.COMPLETED,
 cancelled: BookingStatus.CANCELLED,
 "no-show": BookingStatus.NO_SHOW,
 };

 const filteredSessions = initialSessions.filter((s) => {
 const matchesFilter =
 activeFilter === "all"|| s.status === statusFilterMap[activeFilter];
 const q = searchQuery.toLowerCase();
 const matchesSearch =
 !searchQuery ||
 s.student?.name?.toLowerCase().includes(q) ||
 s.student?.email?.toLowerCase().includes(q) ||
 s.service?.name?.toLowerCase().includes(q);
 return matchesFilter && matchesSearch;
 });

 const selectedSessionData = initialSessions.find(
 (s) => s.id === selectedSession,
 );

 function handleSelectSession(session: SessionItem) {
 setSelectedSession(session.id);
 setNotesValue(session.adminNotes ??"");
 }

 function handleSaveNotes() {
 if (!selectedSession) return;
 startTransition(async () => {
 const result = await saveSessionNotes(selectedSession, notesValue);
 if (result.success) {
 setSelectedSession(null);
 }
 });
 }

 return (
 <>
 <MCTopbar
 title="Økter"
 subtitle="Registrer resultater og notater fra økter"
 onMenuClick={toggle}
 />

 <div className="p-6 space-y-6">
 {/* Heritage Grid Header */}
 <div className="space-y-2">
 <MonoLabel size="xs" uppercase className="block text-outline">Mission Control</MonoLabel>
 <h1 className="text-2xl font-bold tracking-tight text-on-surface">Økter<span className="text-outline">.</span></h1>
 <p className="text-on-surface-variant">Gjennomgå fullførte økter, avlysninger og no-shows</p>
 </div>

 {/* Stats */}
 <BentoGrid cols={4} gap="md">
 <BentoCard variant="light" padding="md">
 <MonoLabel size="xs" uppercase className="text-outline block">Fullført totalt</MonoLabel>
 <p className="text-2xl font-bold text-on-surface mt-1">{stats.completed}</p>
 </BentoCard>
 <BentoCard variant="light" padding="md">
 <MonoLabel size="xs" uppercase className="text-outline block">Avlyst</MonoLabel>
 <p className="text-2xl font-bold text-on-surface mt-1">{stats.cancelled}</p>
 </BentoCard>
 <BentoCard variant="light" padding="md">
 <MonoLabel size="xs" uppercase className="text-outline block">No-show</MonoLabel>
 <p className="text-2xl font-bold text-on-surface mt-1">{stats.noShow}</p>
 </BentoCard>
 <BentoCard variant="light" padding="md">
 <MonoLabel size="xs" uppercase className="text-outline block">Oppmøterate</MonoLabel>
 <p className="text-2xl font-bold text-on-surface mt-1">{stats.attendanceRate}%</p>
 </BentoCard>
 </BentoGrid>

 <div className="hidden">
 <StatCard label="Fullført totalt" value={stats.completed} icon={<Icon name="check_circle" className="w-5 h-5" />} />
 <StatCard label="Avlyst" value={stats.cancelled} icon={<Icon name="cancel" className="w-5 h-5" />} />
 <StatCard label="No-show" value={stats.noShow} icon={<Icon name="error" className="w-5 h-5" />} />
 <StatCard label="Oppmøterate" value={`${stats.attendanceRate}%`} />
 </div>

 <NightSurface variant="ambient" className="rounded-2xl p-6">
 <MonoLabel size="xs" uppercase className="text-surface/60 block mb-4">Øktoversikt</MonoLabel>

 {/* Filters & Search */}
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 rounded-xl p-4">
 <div className="flex flex-col lg:flex-row gap-3">
 <div className="flex-1 relative">
 <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Søk etter elev..."
 className="w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-grey-200 focus:border-outline-variant/50 transition-colors"
 />
 </div>
 <div className="flex gap-2 flex-wrap">
 {filters.map((filter) => (
 <button
 key={filter.value}
 onClick={() => setActiveFilter(filter.value)}
 className={cn(
 "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border",
 activeFilter === filter.value
 ? "bg-on-surface text-surface border-black"
 : "bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface",
 )}
 >
 {filter.label}
 <span className="ml-1.5 opacity-70">({filter.count})</span>
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Sessions List */}
 {filteredSessions.length === 0 ? (
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 rounded-xl p-12 text-center">
 <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
 <Icon name="assignment" className="w-6 h-6 text-on-surface-variant" />
 </div>
 <h3 className="text-base font-medium text-on-surface mb-1">
 Ingen økter funnet
 </h3>
 <p className="text-sm text-on-surface-variant">
 Prøv å justere filter eller søk for å finne det du leter etter.
 </p>
 </div>
 ) : (
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 rounded-xl overflow-hidden">
 <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between">
 <h3 className="text-sm font-semibold text-on-surface">Økter</h3>
 <span className="text-xs text-on-surface-variant">
 {filteredSessions.length} resultater
 </span>
 </div>
 <div className="divide-y divide-surface-container">
 {filteredSessions.map((session) => {
 const config =
 statusConfig[session.status] ?? statusConfig.COMPLETED;
 const StatusIcon = config.icon;
 return (
 <div
 key={session.id}
 onClick={() => handleSelectSession(session)}
 className={cn(
 "p-4 flex items-start gap-4 hover:bg-surface transition-colors cursor-pointer",
 selectedSession === session.id && "bg-surface",
 )}
 >
 <div
 className={cn(
 "p-2 rounded-lg shrink-0",
 config.iconClass,
 )}
 >
 <StatusIcon className="w-4 h-4"/>
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <span className="text-sm font-semibold text-on-surface">
 {format(new Date(session.startTime), "d. MMM HH:mm", {
 locale: nb,
 })}
 </span>
 <StatusBadge variant={config.variant}>
 {config.label}
 </StatusBadge>
 </div>
 <h4 className="text-sm text-on-surface">
 {session.student?.name ??
 session.student?.email ??
 "Ukjent"}
 </h4>
 <p className="text-xs text-on-surface-variant">
 {session.service?.name ?? "Ukjent tjeneste"}
 {session.instructor?.name
 ? ` \u2022 ${session.instructor.name}`
 :""}
 </p>
 {session.adminNotes && (
 <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">
 {session.adminNotes}
 </p>
 )}
 </div>
 <button
 type="button"
 className="p-1.5 rounded-md hover:bg-surface text-on-surface-variant transition-colors"
 aria-label="Rediger notater"
 >
 <Icon name="edit" className="w-4 h-4" />
 </button>
 </div>
 );
 })}
 </div>
 </div>
 )}

 </NightSurface>

 {/* Notes Panel */}
 {selectedSessionData && (
 <GlassPanel variant="light" padding="md">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-semibold text-on-surface">Notater</h3>
 <button
 type="button"
 onClick={() => setSelectedSession(null)}
 className="p-1.5 rounded-md hover:bg-surface transition-colors"
 aria-label="Lukk"
 >
 <Icon name="cancel" className="w-4 h-4 text-on-surface-variant" />
 </button>
 </div>
 <div className="flex items-center gap-3 mb-4">
 <div className="w-9 h-9 rounded-full bg-surface text-on-surface-variant flex items-center justify-center text-xs font-semibold">
 {(selectedSessionData.student?.name ?? "?")
 .split("")
 .map((n) => n[0])
 .join("")
 .slice(0, 2)}
 </div>
 <div>
 <h4 className="text-sm font-medium text-on-surface">
 {selectedSessionData.student?.name ?? "Ukjent"}
 </h4>
 <p className="text-xs text-on-surface-variant">
 {selectedSessionData.service?.name ?? "Ukjent tjeneste"}
 </p>
 </div>
 </div>
 <textarea
 placeholder="Legg til notater fra økten..."
 value={notesValue}
 onChange={(e) => setNotesValue(e.target.value)}
 rows={4}
 className="w-full px-3 py-2 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-grey-200 focus:border-outline-variant/50 transition-colors resize-none"
 />
 <div className="flex justify-end gap-2 mt-3">
 <button
 type="button"
 onClick={() => setSelectedSession(null)}
 className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface hover:bg-surface rounded-lg transition-colors"
 >
 Avbryt
 </button>
 <button
 type="button"
 onClick={handleSaveNotes}
 disabled={isPending}
 className="px-4 py-2 text-sm font-medium text-surface bg-on-surface hover:bg-inverse-surface disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
 >
 {isPending ? "Lagrer...": "Lagre notater"}
 </button>
 </div>
 </GlassPanel>
 )}
 </div>
 </>
 );
}

// Stat Card Component
function StatCard({
 label,
 value,
 icon,
}: {
 label: string;
 value: string | number;
 icon?: React.ReactNode;
}) {
 return (
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 rounded-xl p-4">
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-medium text-on-surface-variant">{label}</span>
 {icon && <div className="text-on-surface-variant">{icon}</div>}
 </div>
 <div className="text-2xl font-semibold text-on-surface">{value}</div>
 </div>
 );
}

// Status Badge Component
function StatusBadge({
 variant,
 children,
}: {
 variant: StatusVariant;
 children: React.ReactNode;
}) {
 const variantClasses = {
 success: "bg-surface text-on-surface-variant",
 error: "bg-surface text-on-surface-variant",
 muted: "bg-surface text-on-surface-variant",
 };

 return (
 <span
 className={cn(
 "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
 variantClasses[variant],
 )}
 >
 {children}
 </span>
 );
}
