"use client";

import { useState, useTransition } from "react";
import {
 Search,
 CheckCircle,
 XCircle,
 AlertCircle,
 Edit3,
 ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
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
 iconClass: "bg-grey-50 text-grey-400",
 },
 CANCELLED: {
 label: "Avlyst",
 icon: XCircle,
 variant: "error",
 iconClass: "bg-grey-50 text-grey-400",
 },
 NO_SHOW: {
 label: "No-show",
 icon: AlertCircle,
 variant: "muted",
 iconClass: "bg-grey-50 text-grey-400",
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
 {/* Page Header */}
 <div>
 <h1 className="text-2xl font-semibold text-black">Økter</h1>
 <p className="text-sm text-grey-400 mt-1">
 Gjennomgå fullførte økter, avlysninger og no-shows
 </p>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 <StatCard
 label="Fullført totalt"
 value={stats.completed}
 icon={<CheckCircle className="w-5 h-5"/>}
 />
 <StatCard
 label="Avlyst"
 value={stats.cancelled}
 icon={<XCircle className="w-5 h-5"/>}
 />
 <StatCard
 label="No-show"
 value={stats.noShow}
 icon={<AlertCircle className="w-5 h-5"/>}
 />
 <StatCard
 label="Oppmøterate"
 value={`${stats.attendanceRate}%`}
 />
 </div>

 {/* Filters & Search */}
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-4">
 <div className="flex flex-col lg:flex-row gap-3">
 <div className="flex-1 relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none"/>
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Søk etter elev..."
 className="w-full pl-9 pr-3 py-2 bg-grey-50 border border-grey-200 rounded-lg text-sm text-black placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-200 focus:border-grey-300 transition-colors"
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
 ? "bg-black text-white border-black"
 : "bg-white border-grey-200 text-grey-400 hover:bg-grey-50",
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
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-12 text-center">
 <div className="w-12 h-12 rounded-full bg-grey-50 flex items-center justify-center mx-auto mb-3">
 <ClipboardList className="w-6 h-6 text-grey-400"/>
 </div>
 <h3 className="text-base font-medium text-black mb-1">
 Ingen økter funnet
 </h3>
 <p className="text-sm text-grey-400">
 Prøv å justere filter eller søk for å finne det du leter etter.
 </p>
 </div>
 ) : (
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl overflow-hidden">
 <div className="px-4 py-3 border-b border-grey-200 flex items-center justify-between">
 <h3 className="text-sm font-semibold text-black">Økter</h3>
 <span className="text-xs text-grey-400">
 {filteredSessions.length} resultater
 </span>
 </div>
 <div className="divide-y divide-grey-50">
 {filteredSessions.map((session) => {
 const config =
 statusConfig[session.status] ?? statusConfig.COMPLETED;
 const StatusIcon = config.icon;
 return (
 <div
 key={session.id}
 onClick={() => handleSelectSession(session)}
 className={cn(
 "p-4 flex items-start gap-4 hover:bg-grey-50 transition-colors cursor-pointer",
 selectedSession === session.id && "bg-grey-50",
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
 <span className="text-sm font-semibold text-black">
 {format(new Date(session.startTime), "d. MMM HH:mm", {
 locale: nb,
 })}
 </span>
 <StatusBadge variant={config.variant}>
 {config.label}
 </StatusBadge>
 </div>
 <h4 className="text-sm text-black">
 {session.student?.name ??
 session.student?.email ??
 "Ukjent"}
 </h4>
 <p className="text-xs text-grey-400">
 {session.service?.name ?? "Ukjent tjeneste"}
 {session.instructor?.name
 ? ` \u2022 ${session.instructor.name}`
 :""}
 </p>
 {session.adminNotes && (
 <p className="text-xs text-grey-400 mt-2 line-clamp-2">
 {session.adminNotes}
 </p>
 )}
 </div>
 <button
 type="button"
 className="p-1.5 rounded-md hover:bg-grey-50 text-grey-400 transition-colors"
 aria-label="Rediger notater"
 >
 <Edit3 className="w-4 h-4"/>
 </button>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* Notes Panel */}
 {selectedSessionData && (
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-4">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-semibold text-black">Notater</h3>
 <button
 type="button"
 onClick={() => setSelectedSession(null)}
 className="p-1.5 rounded-md hover:bg-grey-50 transition-colors"
 aria-label="Lukk"
 >
 <XCircle className="w-4 h-4 text-grey-400"/>
 </button>
 </div>
 <div className="flex items-center gap-3 mb-4">
 <div className="w-9 h-9 rounded-full bg-grey-50 text-grey-400 flex items-center justify-center text-xs font-semibold">
 {(selectedSessionData.student?.name ?? "?")
 .split("")
 .map((n) => n[0])
 .join("")
 .slice(0, 2)}
 </div>
 <div>
 <h4 className="text-sm font-medium text-black">
 {selectedSessionData.student?.name ?? "Ukjent"}
 </h4>
 <p className="text-xs text-grey-400">
 {selectedSessionData.service?.name ?? "Ukjent tjeneste"}
 </p>
 </div>
 </div>
 <textarea
 placeholder="Legg til notater fra økten..."
 value={notesValue}
 onChange={(e) => setNotesValue(e.target.value)}
 rows={4}
 className="w-full px-3 py-2 bg-grey-50 border border-grey-200 rounded-lg text-sm text-black placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-200 focus:border-grey-300 transition-colors resize-none"
 />
 <div className="flex justify-end gap-2 mt-3">
 <button
 type="button"
 onClick={() => setSelectedSession(null)}
 className="px-4 py-2 text-sm font-medium text-grey-400 bg-grey-50 hover:bg-grey-50 rounded-lg transition-colors"
 >
 Avbryt
 </button>
 <button
 type="button"
 onClick={handleSaveNotes}
 disabled={isPending}
 className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-grey-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
 >
 {isPending ? "Lagrer...": "Lagre notater"}
 </button>
 </div>
 </div>
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
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-4">
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-medium text-grey-400">{label}</span>
 {icon && <div className="text-grey-400">{icon}</div>}
 </div>
 <div className="text-2xl font-semibold text-black">{value}</div>
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
 success: "bg-grey-50 text-grey-400",
 error: "bg-grey-50 text-grey-400",
 muted: "bg-grey-50 text-grey-400",
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
