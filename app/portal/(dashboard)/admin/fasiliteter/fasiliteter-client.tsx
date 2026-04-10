"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Clock,
  Wrench,
  AlertCircle,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar, HGCapacityBar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

// ─── Typer basert på Prisma-modeller ───

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
  startTime: string; // serialisert DateTime
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

const statusConfig = {
  active: { label: "Aktiv", className: "text-[var(--color-success)] bg-[var(--color-success)]/10", icon: CheckCircle },
  maintenance: { label: "Vedlikehold", className: "text-[var(--color-warning)] bg-[var(--color-warning)]/10", icon: Wrench },
  inactive: { label: "Inaktiv", className: "text-[var(--color-error)] bg-[var(--color-error)]/10", icon: AlertCircle },
};

function getFacilityStatus(facility: FacilityData): "active" | "maintenance" | "inactive" {
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
    facilities[0]?.id ?? null
  );

  const selectedFacilityData = facilities.find((f) => f.id === selectedFacility);

  const totalBookings = Object.values(bookingCounts).reduce((sum, c) => sum + c, 0);

  const facilitySchedule = todaySchedule.filter(
    (s) => s.facilityId === selectedFacility
  );

  return (
    <>
      <MCTopbar
        title="Fasiliteter"
        subtitle="Oversikt over anlegg og vedlikehold"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="hg-card p-4">
            <span className="hg-label">Anlegg</span>
            <span className="text-2xl font-bold text-[var(--hg-text)] tabular-nums block mt-1">
              {facilities.length}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Bookinger i dag</span>
            <span className="text-2xl font-bold text-[var(--hg-primary)] tabular-nums block mt-1">
              {totalBookings}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Aktiviteter i dag</span>
            <span className="text-2xl font-bold text-[var(--hg-success)] tabular-nums block mt-1">
              {todaySchedule.length}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Ventende</span>
            <span className="text-2xl font-bold text-[var(--hg-warning)] tabular-nums block mt-1">
              {todaySchedule.filter((s) => s.status === "PENDING").length}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Facilities List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="hg-section-title">Anlegg</h3>
              <button className="hg-btn hg-btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Legg til
              </button>
            </div>

            {facilities.map((facility) => {
              const facilityStatus = getFacilityStatus(facility);
              const status = statusConfig[facilityStatus];
              const StatusIcon = status.icon;
              const bookingCount = bookingCounts[facility.id] ?? 0;
              return (
                <div
                  key={facility.id}
                  onClick={() => setSelectedFacility(facility.id)}
                  className={cn(
                    "hg-card p-4 cursor-pointer transition-all",
                    selectedFacility === facility.id && "ring-2 ring-[var(--hg-primary)]"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[var(--hg-surface-raised)]">
                        <Building2 className="w-5 h-5 text-[var(--hg-primary)]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--hg-text)]">
                          {facility.name}
                        </h4>
                        <span className="text-xs text-[var(--hg-text-muted)]">
                          {facility.Location.name}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] flex items-center gap-1",
                        status.className
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </div>
                  </div>
                  {facility.Location.address && (
                    <div className="flex items-center gap-1 text-xs text-[var(--hg-text-muted)] mb-3">
                      <MapPin className="w-3 h-3" />
                      {facility.Location.address}
                    </div>
                  )}
                  {facility.capacity && facility.capacity > 0 && (
                    <HGCapacityBar
                      current={bookingCount}
                      max={facility.capacity}
                      showPercentage={false}
                      size="sm"
                    />
                  )}
                </div>
              );
            })}

            {facilities.length === 0 && (
              <div className="hg-card p-8 text-center">
                <Building2 className="w-10 h-10 text-[var(--hg-text-muted)] mx-auto mb-2 opacity-50" />
                <p className="text-sm text-[var(--hg-text-muted)]">Ingen aktive anlegg</p>
              </div>
            )}
          </div>

          {/* Facility Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedFacilityData ? (
              <>
                {/* Today's Schedule */}
                <div className="hg-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
                    <h3 className="hg-section-title">Dagens timeplan</h3>
                    <span className="text-xs text-[var(--hg-text-muted)]">
                      {selectedFacilityData.name}
                    </span>
                  </div>
                  <div className="divide-y divide-[var(--hg-border-subtle)]">
                    {facilitySchedule.length > 0 ? (
                      facilitySchedule.map((slot) => (
                        <div key={slot.id} className="p-3 flex items-center gap-3">
                          <span className="text-sm font-medium text-[var(--hg-text)] w-14">
                            {format(new Date(slot.startTime), "HH:mm")}
                          </span>
                          <div className="flex-1">
                            <span className="text-sm text-[var(--hg-text)]">
                              {slot.title}
                            </span>
                            {slot.CreatedBy.name && (
                              <span className="text-xs text-[var(--hg-text-muted)] ml-2">
                                {slot.CreatedBy.name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--hg-text-muted)]">
                              {format(new Date(slot.startTime), "HH:mm")}
                              {" - "}
                              {format(new Date(slot.endTime), "HH:mm")}
                            </span>
                            <div
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px]",
                                slot.status === "CONFIRMED"
                                  ? "bg-[var(--hg-success-bg)] text-[var(--hg-success)]"
                                  : "bg-[var(--hg-warning-bg)] text-[var(--hg-warning)]"
                              )}
                            >
                              {slot.status === "CONFIRMED" ? "Bekreftet" : "Venter"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <Clock className="w-8 h-8 text-[var(--hg-text-muted)] mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-[var(--hg-text-muted)]">
                          Ingen aktiviteter i dag
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="hg-card p-4">
                  <h3 className="hg-section-title mb-3">Detaljer</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--hg-text-muted)]">Lokasjon</span>
                      <span className="text-[var(--hg-text)]">
                        {selectedFacilityData.Location.name}
                      </span>
                    </div>
                    {selectedFacilityData.Location.address && (
                      <div className="flex justify-between">
                        <span className="text-[var(--hg-text-muted)]">Adresse</span>
                        <span className="text-[var(--hg-text)]">
                          {selectedFacilityData.Location.address}
                        </span>
                      </div>
                    )}
                    {selectedFacilityData.capacity && (
                      <div className="flex justify-between">
                        <span className="text-[var(--hg-text-muted)]">Kapasitet</span>
                        <span className="text-[var(--hg-text)]">
                          {selectedFacilityData.capacity} plasser
                        </span>
                      </div>
                    )}
                    {selectedFacilityData.description && (
                      <div className="flex justify-between">
                        <span className="text-[var(--hg-text-muted)]">Beskrivelse</span>
                        <span className="text-[var(--hg-text)]">
                          {selectedFacilityData.description}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[var(--hg-text-muted)]">Bookinger i dag</span>
                      <span className="text-[var(--hg-text)] font-medium">
                        {bookingCounts[selectedFacilityData.id] ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="hg-card h-full flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-12 h-12 text-[var(--hg-text-muted)] mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-[var(--hg-text-muted)]">
                    Velg et anlegg for a se detaljer
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
