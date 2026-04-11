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
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminStatCard,
  AdminPageHeader,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import { format } from "date-fns";

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

type FacilityStatus = "active" | "maintenance" | "inactive";

const statusConfig: Record<
  FacilityStatus,
  {
    label: string;
    variant: "success" | "warning" | "error";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  active: { label: "Aktiv", variant: "success", icon: CheckCircle },
  maintenance: { label: "Vedlikehold", variant: "warning", icon: Wrench },
  inactive: { label: "Inaktiv", variant: "error", icon: AlertCircle },
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
        <AdminPageHeader
          title="Fasiliteter"
          subtitle="Administrer anlegg, aktiviteter og bookinger"
          actions={
            <>
              <Link href="/admin/fasiliteter/innstillinger">
                <AdminButton
                  variant="secondary"
                  icon={<Settings className="w-4 h-4" />}
                >
                  Innstillinger
                </AdminButton>
              </Link>
              <Link href="/admin/fasiliteter/ny-aktivitet">
                <AdminButton
                  variant="primary"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Ny aktivitet
                </AdminButton>
              </Link>
            </>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Anlegg"
            value={facilities.length}
            icon={<Building2 className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Bookinger i dag"
            value={totalBookings}
            icon={<Clock className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Aktiviteter i dag"
            value={todaySchedule.length}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Ventende"
            value={pendingCount}
            icon={<AlertCircle className="w-5 h-5" />}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Facilities List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Anlegg
              </h3>
            </div>

            {facilities.length === 0 ? (
              <AdminEmptyState
                icon={<Building2 className="w-6 h-6" />}
                title="Ingen aktive anlegg"
                description="Legg til et nytt anlegg for å komme i gang."
              />
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
                  <AdminCard
                    key={facility.id}
                    hover
                    onClick={() => setSelectedFacility(facility.id)}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected &&
                        "ring-2 ring-[var(--color-primary)] border-[var(--color-primary)]",
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 shrink-0">
                          <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-[var(--color-text)] truncate">
                            {facility.name}
                          </h4>
                          <span className="text-xs text-[var(--color-muted)] truncate block">
                            {facility.Location.name}
                          </span>
                        </div>
                      </div>
                      <AdminBadge
                        variant={status.variant}
                        icon={<StatusIcon className="w-3 h-3" />}
                      >
                        {status.label}
                      </AdminBadge>
                    </div>

                    {facility.Location.address && (
                      <div className="flex items-center gap-1 text-xs text-[var(--color-muted)] mb-3">
                        <MapPin className="w-3 h-3" />
                        {facility.Location.address}
                      </div>
                    )}

                    {capacity > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-1">
                          <span>Kapasitet</span>
                          <span className="tabular-nums">
                            {bookingCount} / {capacity}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                            style={{ width: `${capacityPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </AdminCard>
                );
              })
            )}
          </div>

          {/* Facility Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedFacilityData ? (
              <>
                {/* Today's Schedule */}
                <AdminCard className="p-0 overflow-hidden">
                  <div className="px-5 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--color-text)]">
                      Dagens timeplan
                    </h3>
                    <span className="text-xs text-[var(--color-muted)]">
                      {selectedFacilityData.name}
                    </span>
                  </div>
                  <div className="divide-y divide-[var(--color-grey-200)]">
                    {facilitySchedule.length > 0 ? (
                      facilitySchedule.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-4 flex items-center gap-3"
                        >
                          <span className="text-sm font-medium text-[var(--color-text)] w-14 tabular-nums">
                            {format(new Date(slot.startTime), "HH:mm")}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-[var(--color-text)]">
                              {slot.title}
                            </span>
                            {slot.CreatedBy.name && (
                              <span className="text-xs text-[var(--color-muted)] ml-2">
                                {slot.CreatedBy.name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--color-muted)] tabular-nums">
                              {format(new Date(slot.startTime), "HH:mm")}
                              {" - "}
                              {format(new Date(slot.endTime), "HH:mm")}
                            </span>
                            <AdminBadge
                              variant={
                                slot.status === "CONFIRMED"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {slot.status === "CONFIRMED"
                                ? "Bekreftet"
                                : "Venter"}
                            </AdminBadge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center">
                        <Clock className="w-8 h-8 text-[var(--color-muted)] mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-[var(--color-muted)]">
                          Ingen aktiviteter i dag
                        </p>
                      </div>
                    )}
                  </div>
                </AdminCard>

                {/* Info */}
                <AdminCard>
                  <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                    Detaljer
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">
                        Lokasjon
                      </span>
                      <span className="text-[var(--color-text)]">
                        {selectedFacilityData.Location.name}
                      </span>
                    </div>
                    {selectedFacilityData.Location.address && (
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted)]">
                          Adresse
                        </span>
                        <span className="text-[var(--color-text)] text-right">
                          {selectedFacilityData.Location.address}
                        </span>
                      </div>
                    )}
                    {selectedFacilityData.capacity != null && (
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted)]">
                          Kapasitet
                        </span>
                        <span className="text-[var(--color-text)]">
                          {selectedFacilityData.capacity} plasser
                        </span>
                      </div>
                    )}
                    {selectedFacilityData.description && (
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--color-muted)]">
                          Beskrivelse
                        </span>
                        <span className="text-[var(--color-text)] text-right">
                          {selectedFacilityData.description}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">
                        Bookinger i dag
                      </span>
                      <span className="text-[var(--color-text)] font-medium tabular-nums">
                        {bookingCounts[selectedFacilityData.id] ?? 0}
                      </span>
                    </div>
                  </div>
                </AdminCard>
              </>
            ) : (
              <AdminEmptyState
                icon={<Building2 className="w-6 h-6" />}
                title="Velg et anlegg"
                description="Velg et anlegg fra listen for å se detaljer og dagens timeplan."
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
