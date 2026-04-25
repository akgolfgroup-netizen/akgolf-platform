"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { MonoLabel, BentoGrid, BentoCard } from "@/components/portal/patterns";
import {
  FacilityMap,
  FacilityCalendar,
  FacilityList,
  AddActivityModal,
} from "@/components/portal/admin/facility";

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

type ViewMode = "map" | "calendar" | "list";

const VIEW_OPTIONS: { id: ViewMode; label: string; icon: string }[] = [
  { id: "map", label: "Kart", icon: "map" },
  { id: "calendar", label: "Kalender", icon: "calendar_view_week" },
  { id: "list", label: "Liste", icon: "view_list" },
];

export default function FasiliteterClient({
  facilities,
  todaySchedule,
  bookingCounts,
}: FasiliteterClientProps) {
  const { toggle } = useMCSidebar();
  const [view, setView] = useState<ViewMode>("map");
  const [date, setDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFacilityId, setModalFacilityId] = useState<string | undefined>(undefined);

  const totalBookings = Object.values(bookingCounts).reduce((sum, c) => sum + c, 0);
  const pendingCount = todaySchedule.filter((s) => s.status === "PENDING").length;

  const handleAddActivity = (facilityId?: string) => {
    setModalFacilityId(facilityId || undefined);
    setModalOpen(true);
  };

  return (
    <>
      <MCTopbar
        title="Fasiliteter"
        subtitle="Booking, belegg og kart over GFGK"
        onMenuClick={toggle}
      />

      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <MonoLabel size="xs" uppercase className="block text-outline">
            Mission Control
          </MonoLabel>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Fasiliteter<span className="text-outline">.</span>
          </h1>
          <p className="text-on-surface-variant">
            Klikk på en sone i kartet, naviger ukens kalender, eller se alle bookinger i listen.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-full border border-outline-variant/30 bg-surface-container-lowest p-1">
            {VIEW_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setView(opt.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  view === opt.id
                    ? "bg-on-surface text-surface"
                    : "text-on-surface-variant hover:bg-surface-variant",
                )}
              >
                <Icon name={opt.icon} size={16} />
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/fasiliteter/innstillinger">
              <button className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface">
                <Icon name="settings" size={16} />
                Innstillinger
              </button>
            </Link>
            <button
              onClick={() => handleAddActivity()}
              className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-2 text-sm font-semibold text-on-secondary-fixed hover:brightness-95"
            >
              <Icon name="add" size={16} />
              Legg til aktivitet
            </button>
          </div>
        </div>

        <BentoGrid cols={4} gap="md">
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="block text-outline">
              Anlegg
            </MonoLabel>
            <p className="mt-1 text-2xl font-bold text-on-surface">{facilities.length}</p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="block text-outline">
              Bookinger i dag
            </MonoLabel>
            <p className="mt-1 text-2xl font-bold text-on-surface">{totalBookings}</p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="block text-outline">
              Aktiviteter i dag
            </MonoLabel>
            <p className="mt-1 text-2xl font-bold text-on-surface">{todaySchedule.length}</p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="block text-outline">
              Ventende godkjenning
            </MonoLabel>
            <p className="mt-1 text-2xl font-bold text-on-surface">{pendingCount}</p>
          </BentoCard>
        </BentoGrid>

        {view === "map" && (
          <FacilityMap
            date={date}
            onAddActivity={(facilityId) => handleAddActivity(facilityId)}
          />
        )}
        {view === "calendar" && (
          <FacilityCalendar
            date={date}
            onChangeDate={setDate}
            onAddActivity={() => handleAddActivity()}
          />
        )}
        {view === "list" && (
          <FacilityList date={date} onAddActivity={() => handleAddActivity()} />
        )}
      </div>

      <AddActivityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        facilities={facilities.map((f) => ({ id: f.id, name: f.name }))}
        defaultDate={date}
        defaultFacilityId={modalFacilityId}
      />
    </>
  );
}
