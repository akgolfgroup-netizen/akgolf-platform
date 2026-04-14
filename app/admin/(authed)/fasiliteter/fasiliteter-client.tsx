"use client";

import { useState } from "react";
import Link from "next/link";
import {
 Building2,
 Plus,
 Clock,
 Wrench,
 AlertCircle,
 CheckCircle,
 MapPin,
 Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format } from "date-fns";

// Types

interface FacilityLocation {
 id: string;
 name: string;
 address: string | null;
}

export interface FacilityData {
 id: string;
 name: string;
 slug: string;
 description: string | null;
 capacity: number | null;
 sortOrder: number;
 isActive: boolean;
 locationId: string;
 Location: FacilityLocation;
}

export interface ScheduleItem {
 id: string;
 facilityId: string;
 title: string;
 description: string | null;
 activityType: string;
 startTime: string;
 endTime: string;
 status: string;
 color: string | null;
 Facility: { id: string; name: string };
 CreatedBy: { id: string; name: string | null; email: string | null };
}

export interface FasiliteterClientProps {
 facilities: FacilityData[];
 todaySchedule: ScheduleItem[];
 bookingCounts: Record<string, number>;
}

type FacilityStatus = "active"| "maintenance"| "inactive";

const statusConfig: Record<
 FacilityStatus,
 {
 label: string;
 variant: "success"| "warning"| "error";
 icon: React.ComponentType<{ className?: string }>;
 colors: string;
 }
> = {
 active: {
 label: "Aktiv",
 variant: "success",
 icon: CheckCircle,
 colors: "bg-black text-white",
 },
 maintenance: {
 label: "Vedlikehold",
 variant: "warning",
 icon: Wrench,
 colors: "bg-grey-400 text-white",
 },
 inactive: {
 label: "Inaktiv",
 variant: "error",
 icon: AlertCircle,
 colors: "bg-grey-200 text-grey-400",
 },
};

function getFacilityStatus(facility: FacilityData): FacilityStatus {
 if (!facility.isActive) return "inactive";
 return "active";
}

export default function FasiliteterClient({
 facilities,
 todaySchedule,
 bookingCounts,
}: FasiliteterClientProps) {
 const { toggle } = useMCSidebar();
 const [selectedFacility, setSelectedFacility] = useState<string | null>(
 facilities[0]?.id ?? null,
 );

 const selectedFacilityData = facilities.find(
 (f) => f.id === selectedFacility,
 );

 const totalBookings = Object.values(bookingCounts).reduce(
 (sum, c) => sum + c,
 0,
 );

 const pendingCount = todaySchedule.filter(
 (s) => s.status === "PENDING",
 ).length;

 const facilitySchedule = todaySchedule.filter(
 (s) => s.facilityId === selectedFacility,
 );

 return (
 <>
 <MCTopbar
 title="Fasiliteter"
 subtitle="Oversikt over anlegg og vedlikehold"
 onMenuClick={toggle}
 />

 <div className="p-6 space-y-6">
 {/* Page Header */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 className="text-2xl font-semibold text-black">
 Fasiliteter
 </h1>
 <p className="text-sm text-grey-400">
 Administrer anlegg, aktiviteter og bookinger
 </p>
 </div>
 <div className="flex items-center gap-3">
 <Link href="/admin/fasiliteter/innstillinger">
 <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-grey-400 bg-white border border-grey-200 rounded-lg hover:bg-grey-50 transition-colors">
 <Settings className="w-4 h-4"/>
 Innstillinger
 </button>
 </Link>
 <Link href="/admin/fasiliteter/ny-aktivitet">
 <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-grey-800 transition-colors">
 <Plus className="w-4 h-4"/>
 Ny aktivitet
 </button>
 </Link>
 </div>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-grey-50 rounded-lg">
 <Building2 className="w-5 h-5 text-grey-400"/>
 </div>
 <div>
 <p className="text-2xl font-semibold text-black">
 {facilities.length}
 </p>
 <p className="text-xs text-grey-400">Anlegg</p>
 </div>
 </div>
 </div>
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-grey-50 rounded-lg">
 <Clock className="w-5 h-5 text-grey-400"/>
 </div>
 <div>
 <p className="text-2xl font-semibold text-black">
 {totalBookings}
 </p>
 <p className="text-xs text-grey-400">Bookinger i dag</p>
 </div>
 </div>
 </div>
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-grey-50 rounded-lg">
 <CheckCircle className="w-5 h-5 text-grey-400"/>
 </div>
 <div>
 <p className="text-2xl font-semibold text-black">
 {todaySchedule.length}
 </p>
 <p className="text-xs text-grey-400">Aktiviteter i dag</p>
 </div>
 </div>
 </div>
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-grey-50 rounded-lg">
 <AlertCircle className="w-5 h-5 text-grey-400"/>
 </div>
 <div>
 <p className="text-2xl font-semibold text-black">
 {pendingCount}
 </p>
 <p className="text-xs text-grey-400">Ventende</p>
 </div>
 </div>
 </div>
 </div>

 {/* Main Content */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Facilities List */}
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-semibold text-black">Anlegg</h3>
 </div>

 {facilities.length === 0 ? (
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-8 text-center">
 <Building2 className="w-8 h-8 text-grey-400 mx-auto mb-3"/>
 <p className="text-sm font-medium text-black">Ingen aktive anlegg</p>
 <p className="text-xs text-grey-400">Legg til et nytt anlegg for å komme i gang.</p>
 </div>
 ) : (
 facilities.map((facility) => {
 const facilityStatus = getFacilityStatus(facility);
 const status = statusConfig[facilityStatus];
 const StatusIcon = status.icon;
 const bookingCount = bookingCounts[facility.id] ?? 0;
 const capacity = facility.capacity ?? 0;
 const capacityPct =
 capacity > 0
 ? Math.min(100, Math.round((bookingCount / capacity) * 100))
 : 0;
 const isSelected = selectedFacility === facility.id;

 return (
 <div
 key={facility.id}
 onClick={() => setSelectedFacility(facility.id)}
 className={cn(
 "bg-white rounded-xl border border-grey-200 rounded-xl p-4 cursor-pointer transition-all hover:",
 isSelected && "ring-2 ring-black border-black",
 )}
 >
 <div className="flex items-start justify-between mb-3">
 <div className="flex items-center gap-2 min-w-0">
 <div className="p-2 rounded-lg bg-grey-50 shrink-0">
 <Building2 className="w-5 h-5 text-grey-400"/>
 </div>
 <div className="min-w-0">
 <h4 className="text-sm font-semibold text-black truncate">
 {facility.name}
 </h4>
 <span className="text-xs text-grey-400 truncate block">
 {facility.Location.name}
 </span>
 </div>
 </div>
 <span
 className={cn(
 "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
 status.colors,
 )}
 >
 <StatusIcon className="w-3 h-3"/>
 {status.label}
 </span>
 </div>

 {facility.Location.address &&(
 <div className="flex items-center gap-1 text-xs text-grey-400 mb-3">
 <MapPin className="w-3 h-3"/>
 {facility.Location.address}
 </div>
 )}

 {capacity > 0 &&(
 <div>
 <div className="flex items-center justify-between text-xs text-grey-400 mb-1">
 <span>Kapasitet</span>
 <span className="tabular-nums">
 {bookingCount} / {capacity}
 </span>
 </div>
 <div className="h-1.5 bg-grey-50 rounded-full overflow-hidden">
 <div className="h-full bg-black rounded-full transition-all"
 style={{ width: `${capacityPct}%` }}
 />
 </div>
 </div>
 )}
 </div>
 );
 })
 )}
 </div>

 {/* Facility Details */}
 <div className="lg-col-span-2 space-y-4">
 {selectedFacilityData ? (
 <>
 {/* Today's Schedule */}
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl overflow-hidden">
 <div className="px-5 py-4 border-b border-grey-200 flex items-center justify-between">
 <h3 className="text-sm font-semibold text-black">
 Dagens timeplan
 </h3>
 <span className="text-xs text-grey-400">
 {selectedFacilityData.name}
 </span>
 </div>
 <div className="divide-y divide-grey-200">
 {facilitySchedule.length > 0 ? (
 facilitySchedule.map((slot) => (
 <div
 key={slot.id}
 className="p-4 flex items-center gap-3"
 >
 <span className="text-sm font-medium text-black w-14 tabular-nums">
 {format(new Date(slot.startTime), "HH:mm")}
 </span>
 <div className="flex-1 min-w-0">
 <span className="text-sm text-black">
 {slot.title}
 </span>
 {slot.CreatedBy.name &&(
 <span className="text-xs text-grey-400 ml-2">
 {slot.CreatedBy.name}
 </span>
 )}
 </div>
 <div className="flex items-center gap-3">
 <span className="text-xs text-grey-400 tabular-nums">
 {format(new Date(slot.startTime), "HH:mm")}
 {"- "}
 {format(new Date(slot.endTime), "HH:mm")}
 </span>
 <span className={cn(
 "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
 slot.status === "CONFIRMED"
 ? "bg-black text-white"
 : "bg-grey-200 text-grey-400"
 )}
 >
 {slot.status === "CONFIRMED"
 ? "Bekreftet"
 : "Venter"}
 </span>
 </div>
 </div>
 ))
 ) : (
 <div className="py-10 text-center">
 <Clock className="w-8 h-8 text-grey-400 mx-auto mb-2 opacity-50"/>
 <p className="text-sm text-grey-400">
 Ingen aktiviteter i dag
 </p>
 </div>
 )}
 </div>
 </div>

 {/* Info */}
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-4">
 <h3 className="text-sm font-semibold text-black">
 Detaljer
 </h3>
 <div className="space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-grey-400">Lokasjon</span>
 <span className="text-black">
 {selectedFacilityData.Location.name}
 </span>
 </div>
 {selectedFacilityData.Location.address &&(
 <div className="flex justify-between">
 <span className="text-grey-400">Adresse</span>
 <span className="text-black text-right">
 {selectedFacilityData.Location.address}
 </span>
 </div>
 )}
 {selectedFacilityData.capacity != null &&(
 <div className="flex justify-between">
 <span className="text-grey-400">Kapasitet</span>
 <span className="text-black">
 {selectedFacilityData.capacity} plasser
 </span>
 </div>
 )}
 {selectedFacilityData.description &&(
 <div className="flex justify-between gap-4">
 <span className="text-grey-400">Beskrivelse</span>
 <span className="text-black text-right">
 {selectedFacilityData.description}
 </span>
 </div>
 )}
 <div className="flex justify-between">
 <span className="text-grey-400">Bookinger i dag</span>
 <span className="text-black font-medium tabular-nums">
 {bookingCounts[selectedFacilityData.id] ?? 0}
 </span>
 </div>
 </div>
 </div>
 </>
 ) : (
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-8 text-center">
 <Building2 className="w-8 h-8 text-grey-400 mx-auto mb-3"/>
 <p className="text-sm font-medium text-black">Velg et anlegg</p>
 <p className="text-xs text-grey-400">
 Velg et anlegg fra listen for å se detaljer og dagens timeplan.
 </p>
 </div>
 )}
 </div>
 </div>
 </div>
 </>
 );
}
