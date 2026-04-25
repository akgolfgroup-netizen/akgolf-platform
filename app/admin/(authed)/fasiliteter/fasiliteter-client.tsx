"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { FacilityMap } from "@/components/admin/FacilityMap";
import { FacilityCalendar } from "@/components/admin/FacilityCalendar";
import { FacilityList } from "@/components/admin/FacilityList";
import { AddActivityModal } from "@/components/admin/AddActivityModal";
import {
  deleteFacilityBooking,
  type FacilityBookingDTO,
  type FacilityName,
} from "./actions";

type ViewKey = "map" | "calendar" | "list";

const VIEWS: { key: ViewKey; label: string; icon: string }[] = [
  { key: "map", label: "Kart", icon: "map" },
  { key: "calendar", label: "Kalender", icon: "calendar_month" },
  { key: "list", label: "Liste", icon: "view_list" },
];

interface Props {
  bookings: FacilityBookingDTO[];
}

export default function FasiliteterClient({ bookings }: Props) {
  const router = useRouter();
  const [view, setView] = useState<ViewKey>("map");
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultFacility, setDefaultFacility] = useState<FacilityName | undefined>();
  const [, startTransition] = useTransition();

  function openAdd(facility?: FacilityName) {
    setDefaultFacility(facility);
    setModalOpen(true);
  }

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Slett denne bookingen?")) return;
    await deleteFacilityBooking(id);
    refresh();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/80">
            CoachHQ · GFGK
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-on-surface">
            Fasilitets-booking
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Visuell oversikt over Driving Range, putting, short game, klubbhus og korthullsbane.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ViewSwitcher view={view} onChange={setView} />
          <button
            type="button"
            onClick={() => openAdd()}
            className="flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-2 text-sm font-semibold text-secondary-fixed-text hover:brightness-95"
          >
            <Icon name="add" size={18} />
            Legg til aktivitet
          </button>
        </div>
      </header>

      {view === "map" && (
        <FacilityMap
          bookings={bookings}
          selectedDate={selectedDate}
          onAddBooking={openAdd}
        />
      )}

      {view === "calendar" && (
        <FacilityCalendar
          bookings={bookings}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

      {view === "list" && <FacilityList bookings={bookings} onDelete={handleDelete} />}

      <AddActivityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
        defaultFacility={defaultFacility}
        defaultDate={selectedDate}
      />
    </div>
  );
}

function ViewSwitcher({
  view,
  onChange,
}: {
  view: ViewKey;
  onChange: (v: ViewKey) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Visning"
      className="inline-flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest p-1"
    >
      {VIEWS.map((v) => {
        const active = view === v.key;
        return (
          <button
            key={v.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v.key)}
            className={
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors " +
              (active
                ? "bg-primary text-surface"
                : "text-on-surface-variant hover:text-on-surface")
            }
          >
            <Icon name={v.icon} size={16} />
            {v.label}
          </button>
        );
      })}
    </div>
  );
}

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
