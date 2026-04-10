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

// Mock data
const mockFacilities = [
  { id: "1", name: "TrackMan Simulator 1", location: "Hovedlokale", capacity: 4, isActive: true },
  { id: "2", name: "TrackMan Simulator 2", location: "Hovedlokale", capacity: 4, isActive: true },
  { id: "3", name: "Putting Green", location: "Hovedlokale", capacity: 8, isActive: true },
  { id: "4", name: "Møterom", location: "Hovedlokale", capacity: 10, isActive: false },
];

const mockDefaults = [
  { id: "d1", instructorName: "Anders Kristiansen", facilityName: "TrackMan Simulator 1", serviceType: "Privat Coaching", priority: 1 },
  { id: "d2", instructorName: "Maria Hansen", facilityName: "TrackMan Simulator 2", serviceType: "Videoanalyse", priority: 1 },
];

export default function FasilitetInnstillingerPage() {
  const { toggle } = useMCSidebar();
  const [facilities, setFacilities] = useState(mockFacilities);
  const [defaults, setDefaults] = useState(mockDefaults);

  const toggleFacilityStatus = (id: string) => {
    setFacilities(prev => prev.map(f => 
      f.id === id ? { ...f, isActive: !f.isActive } : f
    ));
  };

  return (
    <>
      <MCTopbar
        title="Fasilitetinnstillinger"
        subtitle="Administrer fasiliteter og standard innstillinger"
        onMenuClick={toggle}
      />

      <div className="p-5 max-w-4xl mx-auto space-y-5">
        {/* Back Link */}
        <Link
          href="/admin/fasiliteter"
          className="inline-flex items-center gap-2 text-sm text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til fasiliteter
        </Link>

        {/* Facilities List */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
            <h3 className="hg-section-title">Fasiliteter</h3>
            <button className="hg-btn hg-btn-primary text-sm">
              <Plus className="w-4 h-4" />
              Ny fasilitet
            </button>
          </div>
          <div className="divide-y divide-[var(--hg-border-subtle)]">
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--hg-surface-raised)] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[var(--hg-text-muted)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--hg-text)]">
                      {facility.name}
                    </p>
                    <p className="text-sm text-[var(--hg-text-muted)]">
                      {facility.location} · Kapasitet: {facility.capacity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFacilityStatus(facility.id)}
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                      facility.isActive
                        ? "text-[var(--hg-success)] bg-[var(--hg-success)]/10"
                        : "text-[var(--hg-text-muted)] bg-[var(--hg-surface-raised)]"
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
                  <button className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-error)]">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor Defaults */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--hg-border)]">
            <h3 className="hg-section-title">Instruktør-fasilitet defaults</h3>
            <p className="text-sm text-[var(--hg-text-muted)] mt-1">
              Standard fasilitet for hver instruktør ved booking-opprettelse
            </p>
          </div>
          {defaults.length > 0 ? (
            <div className="divide-y divide-[var(--hg-border-subtle)]">
              {defaults.map((d) => (
                <div
                  key={d.id}
                  className="px-4 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--hg-surface-raised)] flex items-center justify-center">
                      <User className="w-5 h-5 text-[var(--hg-text-muted)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--hg-text)]">
                        {d.instructorName}
                      </p>
                      <p className="text-sm text-[var(--hg-text-muted)]">
                        {d.facilityName}
                        {d.serviceType && ` (${d.serviceType})`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--hg-text-muted)]">
                      Prioritet: {d.priority}
                    </span>
                    <button className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-error)]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-[var(--hg-text-muted)]">
              Ingen defaults konfigurert
            </div>
          )}
          <div className="px-4 py-3 border-t border-[var(--hg-border)]">
            <button className="hg-btn hg-btn-secondary text-sm w-full">
              <Plus className="w-4 h-4" />
              Legg til default
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 rounded-xl bg-[var(--hg-primary)]/10 border border-[var(--hg-primary)]/20">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-[var(--hg-primary)] mt-0.5" />
            <div>
              <p className="text-sm text-[var(--hg-text)]">
                <strong>Tips:</strong> Fasilitet-defaults brukes til automatisk å tildele riktig fasilitet
                når en booking opprettes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
