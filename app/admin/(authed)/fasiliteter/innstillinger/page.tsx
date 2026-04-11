"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Check,
  X,
  User,
  Settings,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminPageHeader,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";

interface MockFacility {
  id: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
}

interface InstructorDefault {
  id: string;
  instructorName: string;
  facilityName: string;
  serviceType: string;
  priority: number;
}

const initialFacilities: MockFacility[] = [
  {
    id: "1",
    name: "TrackMan Simulator 1",
    location: "Hovedlokale",
    capacity: 4,
    isActive: true,
  },
  {
    id: "2",
    name: "TrackMan Simulator 2",
    location: "Hovedlokale",
    capacity: 4,
    isActive: true,
  },
  {
    id: "3",
    name: "Putting Green",
    location: "Hovedlokale",
    capacity: 8,
    isActive: true,
  },
  {
    id: "4",
    name: "Møterom",
    location: "Hovedlokale",
    capacity: 10,
    isActive: false,
  },
];

const initialDefaults: InstructorDefault[] = [
  {
    id: "d1",
    instructorName: "Anders Kristiansen",
    facilityName: "TrackMan Simulator 1",
    serviceType: "Privat Coaching",
    priority: 1,
  },
  {
    id: "d2",
    instructorName: "Maria Hansen",
    facilityName: "TrackMan Simulator 2",
    serviceType: "Videoanalyse",
    priority: 1,
  },
];

export default function FasilitetInnstillingerPage() {
  const { toggle } = useMCSidebar();
  const [facilities, setFacilities] =
    useState<MockFacility[]>(initialFacilities);
  const [defaults] = useState<InstructorDefault[]>(initialDefaults);

  const toggleFacilityStatus = (id: string) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)),
    );
  };

  return (
    <>
      <MCTopbar
        title="Fasilitetinnstillinger"
        subtitle="Administrer fasiliteter og standard innstillinger"
        onMenuClick={toggle}
      />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/admin/fasiliteter"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til fasiliteter
        </Link>

        <AdminPageHeader
          title="Innstillinger"
          subtitle="Administrer fasiliteter og instruktør-defaults"
          breadcrumbs={[
            { label: "Fasiliteter", href: "/admin/fasiliteter" },
            { label: "Innstillinger" },
          ]}
        />

        {/* Facilities List */}
        <AdminCard className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Fasiliteter
            </h3>
            <AdminButton
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
            >
              Ny fasilitet
            </AdminButton>
          </div>
          <div className="divide-y divide-[var(--color-grey-200)]">
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--color-muted)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text)] truncate">
                      {facility.name}
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {facility.location} · Kapasitet: {facility.capacity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleFacilityStatus(facility.id)}
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                      facility.isActive
                        ? "text-[var(--color-success)] bg-[var(--color-success)]/10 hover:bg-[var(--color-success)]/15"
                        : "text-[var(--color-muted)] bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)]",
                    )}
                  >
                    {facility.isActive ? (
                      <>
                        <Check className="w-3 h-3" />
                        Aktiv
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" />
                        Inaktiv
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-[var(--color-error)]/10 text-[var(--color-error)] transition-colors"
                    aria-label={`Slett ${facility.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Instructor Defaults */}
        <AdminCard className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-grey-200)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Instruktør-fasilitet defaults
            </h3>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Standard fasilitet for hver instruktør ved booking-opprettelse
            </p>
          </div>
          {defaults.length > 0 ? (
            <div className="divide-y divide-[var(--color-grey-200)]">
              {defaults.map((d) => (
                <div
                  key={d.id}
                  className="px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[var(--color-muted)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--color-text)] truncate">
                        {d.instructorName}
                      </p>
                      <p className="text-sm text-[var(--color-muted)] truncate">
                        {d.facilityName}
                        {d.serviceType && ` (${d.serviceType})`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <AdminBadge variant="info">
                      Prioritet: {d.priority}
                    </AdminBadge>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-[var(--color-error)]/10 text-[var(--color-error)] transition-colors"
                      aria-label={`Slett default for ${d.instructorName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-sm text-[var(--color-muted)]">
              Ingen defaults konfigurert
            </div>
          )}
          <div className="px-5 py-4 border-t border-[var(--color-grey-200)]">
            <AdminButton
              variant="secondary"
              icon={<Plus className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Legg til default
            </AdminButton>
          </div>
        </AdminCard>

        {/* Info — kun for å unngå unused import av AdminEmptyState ved tomt state */}
        {facilities.length === 0 && (
          <AdminEmptyState
            icon={<MapPin className="w-6 h-6" />}
            title="Ingen fasiliteter"
            description="Legg til en ny fasilitet for å komme i gang."
          />
        )}

        {/* Tips */}
        <div className="p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-[var(--color-primary)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--color-text)]">
              <strong>Tips:</strong> Fasilitet-defaults brukes til automatisk å
              tildele riktig fasilitet når en booking opprettes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
