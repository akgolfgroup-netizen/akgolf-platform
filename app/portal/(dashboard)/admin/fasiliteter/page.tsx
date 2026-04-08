"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Calendar,
  Clock,
  Users,
  Wrench,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  MapPin,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar, HGCapacityBar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

// Mock data
const facilities = [
  {
    id: "1",
    name: "Mulligan Indoor Golf",
    type: "Hovedanlegg",
    address: "Storgata 123, Oslo",
    status: "active" as const,
    bays: 4,
    equipment: ["TrackMan 4", "Foresight GCQuad", "Putting Green"],
    nextMaintenance: new Date(Date.now() + 86400000 * 14),
    todayBookings: 12,
    capacity: 16,
  },
  {
    id: "2",
    name: "Losby Golfklubb",
    type: "Samarbeidspartner",
    address: "Losbyveien 1, Lørenskog",
    status: "active" as const,
    bays: null,
    equipment: ["Utendørs range", "Putting green", "Bane"],
    nextMaintenance: null,
    todayBookings: 4,
    capacity: 8,
  },
];

const todaySchedule = [
  { time: "09:00", facility: "Mulligan Indoor Golf", bay: "Bay 1", booking: "Olav Hansen", status: "confirmed" },
  { time: "10:00", facility: "Mulligan Indoor Golf", bay: "Bay 2", booking: "Mari Kristiansen", status: "confirmed" },
  { time: "11:00", facility: "Mulligan Indoor Golf", bay: "Bay 1", booking: "Erik Johansen", status: "confirmed" },
  { time: "14:00", facility: "Losby Golfklubb", bay: "Range", booking: "Junior Trening", status: "confirmed" },
];

const maintenanceTasks = [
  { id: "1", facility: "Mulligan Indoor Golf", task: "Kalibrer TrackMan", dueDate: new Date(Date.now() + 86400000 * 7), priority: "medium" as const },
  { id: "2", facility: "Mulligan Indoor Golf", task: "Bytt putting-matte", dueDate: new Date(Date.now() + 86400000 * 14), priority: "low" as const },
];

const statusConfig = {
  active: { label: "Aktiv", className: "text-[var(--hg-success)] bg-[var(--hg-success-bg)]", icon: CheckCircle },
  maintenance: { label: "Vedlikehold", className: "text-[var(--hg-warning)] bg-[var(--hg-warning-bg)]", icon: Wrench },
  inactive: { label: "Inaktiv", className: "text-[var(--hg-error)] bg-[var(--hg-error-bg)]", icon: AlertCircle },
};

const priorityConfig = {
  high: { label: "Høy", className: "bg-[var(--hg-error-bg)] text-[var(--hg-error)]" },
  medium: { label: "Medium", className: "bg-[var(--hg-warning-bg)] text-[var(--hg-warning)]" },
  low: { label: "Lav", className: "bg-[var(--hg-info-bg)] text-[var(--hg-info)]" },
};

export default function FasiliteterPage() {
  const { toggle } = useMCSidebar();
  const [selectedFacility, setSelectedFacility] = useState<string | null>("1");

  const selectedFacilityData = facilities.find((f) => f.id === selectedFacility);

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
            <span className="text-2xl font-bold text-[var(--hg-text)] tabular-nums block mt-1">{facilities.length}</span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Bookinger i dag</span>
            <span className="text-2xl font-bold text-[var(--hg-primary)] tabular-nums block mt-1">
              {facilities.reduce((sum, f) => sum + f.todayBookings, 0)}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Utstyr status</span>
            <span className="text-2xl font-bold text-[var(--hg-success)] tabular-nums block mt-1">OK</span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Vedlikehold</span>
            <span className="text-2xl font-bold text-[var(--hg-warning)] tabular-nums block mt-1">{maintenanceTasks.length}</span>
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
              const status = statusConfig[facility.status];
              const StatusIcon = status.icon;
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
                        <h4 className="text-sm font-semibold text-[var(--hg-text)]">{facility.name}</h4>
                        <span className="text-xs text-[var(--hg-text-muted)]">{facility.type}</span>
                      </div>
                    </div>
                    <div className={cn("px-1.5 py-0.5 rounded-full text-[10px] flex items-center gap-1", status.className)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--hg-text-muted)] mb-3">
                    <MapPin className="w-3 h-3" />
                    {facility.address}
                  </div>
                  {facility.bays && (
                    <HGCapacityBar
                      current={facility.todayBookings}
                      max={facility.capacity}
                      showPercentage={false}
                      size="sm"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Facility Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedFacilityData ? (
              <>
                {/* Today's Schedule */}
                <div className="hg-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
                    <h3 className="hg-section-title">Dagens timeplan</h3>
                    <span className="text-xs text-[var(--hg-text-muted)]">{selectedFacilityData.name}</span>
                  </div>
                  <div className="divide-y divide-[var(--hg-border-subtle)]">
                    {todaySchedule
                      .filter((s) => s.facility === selectedFacilityData.name)
                      .map((slot, i) => (
                        <div key={i} className="p-3 flex items-center gap-3">
                          <span className="text-sm font-medium text-[var(--hg-text)] w-14">{slot.time}</span>
                          <div className="flex-1">
                            <span className="text-sm text-[var(--hg-text)]">{slot.booking}</span>
                            <span className="text-xs text-[var(--hg-text-muted)] ml-2">{slot.bay}</span>
                          </div>
                          <div className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--hg-success-bg)] text-[var(--hg-success)]">
                            {slot.status}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Equipment */}
                <div className="hg-card p-4">
                  <h3 className="hg-section-title mb-3">Utstyr</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFacilityData.equipment.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 text-xs bg-[var(--hg-surface-raised)] text-[var(--hg-text)] rounded-lg border border-[var(--hg-border)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Maintenance */}
                <div className="hg-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
                    <h3 className="hg-section-title">Vedlikeholdsplan</h3>
                    <button className="hg-btn hg-btn-secondary text-xs">
                      <Plus className="w-3.5 h-3.5" />
                      Ny oppgave
                    </button>
                  </div>
                  <div className="divide-y divide-[var(--hg-border-subtle)]">
                    {maintenanceTasks.map((task) => {
                      const priority = priorityConfig[task.priority];
                      return (
                        <div key={task.id} className="p-4 flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[var(--hg-warning-bg)]">
                            <Wrench className="w-4 h-4 text-[var(--hg-warning)]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-[var(--hg-text)]">{task.task}</h4>
                            <p className="text-xs text-[var(--hg-text-muted)]">{task.facility}</p>
                          </div>
                          <div className="text-right">
                            <span className={cn("px-2 py-0.5 text-[10px] rounded-full", priority.className)}>
                              {priority.label}
                            </span>
                            <p className="text-xs text-[var(--hg-text-muted)] mt-1">
                              {format(task.dueDate, "d. MMM", { locale: nb })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="hg-card h-full flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-12 h-12 text-[var(--hg-text-muted)] mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-[var(--hg-text-muted)]">Velg et anlegg for å se detaljer</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
