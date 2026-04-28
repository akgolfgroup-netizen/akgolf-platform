"use client";

import { useState, useTransition } from "react";
import { Check, Plus, MapPin, Filter } from "lucide-react";
import { useToast } from "@/components/portal/mission-control/ui";
import {
  setInstructorLocation,
  setLocationServices,
  type LocationSummary,
  type ServiceTypeSummary,
  type InstructorSummary,
  type InstructorLocationConfig,
} from "./actions";

interface LokasjonerClientProps {
  locations: LocationSummary[];
  services: ServiceTypeSummary[];
  instructors: InstructorSummary[];
  initialConfig: InstructorLocationConfig[];
}

function configKey(instructorId: string, locationId: string) {
  return `${instructorId}::${locationId}`;
}

export function LokasjonerClient({
  locations,
  services,
  instructors,
  initialConfig,
}: LokasjonerClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [selectedInstructor, setSelectedInstructor] = useState<string>(
    instructors[0]?.id ?? "",
  );

  const [config, setConfig] = useState<Map<string, InstructorLocationConfig>>(
    () => {
      const m = new Map<string, InstructorLocationConfig>();
      for (const c of initialConfig) {
        m.set(configKey(c.instructorId, c.locationId), c);
      }
      return m;
    },
  );

  function getConfig(instructorId: string, locationId: string) {
    return config.get(configKey(instructorId, locationId));
  }

  function isLocationActive(locationId: string): boolean {
    if (!selectedInstructor) return false;
    return getConfig(selectedInstructor, locationId)?.isActive ?? false;
  }

  function getServiceIds(locationId: string): string[] {
    if (!selectedInstructor) return [];
    return getConfig(selectedInstructor, locationId)?.serviceTypeIds ?? [];
  }

  function handleToggleLocation(locationId: string) {
    if (!selectedInstructor) return;
    const current = getConfig(selectedInstructor, locationId);
    const newActive = !(current?.isActive ?? false);

    startTransition(async () => {
      try {
        await setInstructorLocation({
          instructorId: selectedInstructor,
          locationId,
          isActive: newActive,
        });
        setConfig((prev) => {
          const next = new Map(prev);
          const key = configKey(selectedInstructor, locationId);
          next.set(key, {
            instructorId: selectedInstructor,
            locationId,
            isActive: newActive,
            serviceTypeIds: newActive ? (current?.serviceTypeIds ?? []) : [],
          });
          return next;
        });
        toast({
          variant: "success",
          title: newActive ? "Lokasjon aktivert" : "Lokasjon deaktivert",
        });
      } catch (err) {
        toast({
          variant: "error",
          title: "Kunne ikke oppdatere",
          description: err instanceof Error ? err.message : "Ukjent feil",
        });
      }
    });
  }

  function handleToggleService(locationId: string, serviceId: string) {
    if (!selectedInstructor) return;
    if (!isLocationActive(locationId)) {
      toast({ variant: "error", title: "Aktiver lokasjonen først" });
      return;
    }
    const currentIds = getServiceIds(locationId);
    const newIds = currentIds.includes(serviceId)
      ? currentIds.filter((id) => id !== serviceId)
      : [...currentIds, serviceId];

    startTransition(async () => {
      try {
        await setLocationServices({
          instructorId: selectedInstructor,
          locationId,
          serviceTypeIds: newIds,
        });
        setConfig((prev) => {
          const next = new Map(prev);
          const key = configKey(selectedInstructor, locationId);
          const existing = next.get(key);
          if (existing) {
            next.set(key, { ...existing, serviceTypeIds: newIds });
          }
          return next;
        });
      } catch (err) {
        toast({
          variant: "error",
          title: "Kunne ikke oppdatere tjeneste",
          description: err instanceof Error ? err.message : "Ukjent feil",
        });
      }
    });
  }

  const activeLocations = selectedInstructor
    ? locations.filter((l) => isLocationActive(l.id))
    : [];
  const totalServices = activeLocations.reduce(
    (sum, l) => sum + getServiceIds(l.id).length,
    0,
  );

  return (
    <div className="-m-6 lg:-m-8 min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between border-b border-[#1a4a3a] pb-5">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
            / DRIFT · LOKASJONER
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
            Hvor du coacher.
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">
            {locations.length} lokasjoner totalt. Spillere ser bare aktive
            lokasjoner i bookingflow.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 hover:bg-white/10"
          >
            <Filter className="h-3.5 w-3.5" strokeWidth={1.8} /> Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#00422F]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} /> Ny lokasjon
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <KpiCard label="Lokasjoner" value={String(locations.length)} />
        <KpiCard label="Aktive for meg" value={String(activeLocations.length)} />
        <KpiCard label="Tjenester totalt" value={String(totalServices)} />
      </div>

      {/* Instructor selector */}
      {instructors.length > 1 && (
        <div className="mb-5 rounded-xl border border-white/[0.06] bg-[#0D2E23] p-4">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
            VELG COACH
          </div>
          <div className="flex flex-wrap gap-2">
            {instructors.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => setSelectedInstructor(i.id)}
                className={
                  "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition " +
                  (selectedInstructor === i.id
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-white/10 bg-white/5 text-white/80 hover:border-white/20")
                }
              >
                {i.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location grid */}
      {selectedInstructor ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {locations.map((location) => {
            const active = isLocationActive(location.id);
            const serviceIds = getServiceIds(location.id);
            return (
              <div
                key={location.id}
                className={
                  "rounded-[14px] border bg-[#0D2E23] p-5 transition " +
                  (active ? "border-accent/40" : "border-white/[0.06]")
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={
                        "mt-0.5 grid h-9 w-9 place-items-center rounded-full " +
                        (active
                          ? "bg-accent/20 text-accent"
                          : "bg-white/5 text-white/50")
                      }
                    >
                      <MapPin className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-white">
                        {location.name}
                      </div>
                      {location.address && (
                        <div className="mt-0.5 text-[12px] text-white/55">
                          {location.address}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleLocation(location.id)}
                    disabled={isPending}
                    className={
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition " +
                      (active
                        ? "bg-accent text-[#0A1F18] hover:bg-[#A6C734]"
                        : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10")
                    }
                  >
                    {active ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                    ) : (
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
                    )}
                    {active ? "Aktiv" : "Aktiver"}
                  </button>
                </div>

                {active ? (
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
                      Tjenester ({serviceIds.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {services
                        .filter((s) => s.isActive)
                        .map((service) => {
                          const checked = serviceIds.includes(service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() =>
                                handleToggleService(location.id, service.id)
                              }
                              disabled={isPending}
                              className={
                                "rounded-full px-3 py-1 text-[11px] font-medium transition " +
                                (checked
                                  ? "bg-accent text-[#0A1F18]"
                                  : "bg-white/5 text-white/70 hover:bg-white/10")
                              }
                            >
                              {service.name}
                              {!service.isPublic && (
                                <span className="ml-1 opacity-60">(skjult)</span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 border-t border-white/[0.06] pt-4 text-[12px] text-white/55">
                    Aktiver lokasjonen for å koble til tjenester.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-[#0D2E23] p-6 text-[13px] text-white/70">
          Ingen instruktør funnet for kontoen din.
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0D2E23] px-4 py-3.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.10em] text-white/50">
        {label}
      </div>
      <div className="mt-1.5 font-mono text-[22px] font-bold leading-none text-white">
        {value}
      </div>
    </div>
  );
}
