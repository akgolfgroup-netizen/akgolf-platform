"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { Button, Card } from "@/components/ui";
import { useToast } from "@/components/portal/mission-control/ui";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { MonoLabel, BentoGrid, BentoCard } from "@/components/portal/patterns";
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
  const { toggle } = useMCSidebar();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Velg første instruktør som default
  const [selectedInstructor, setSelectedInstructor] = useState<string>(
    instructors[0]?.id ?? "",
  );

  // Lokal state speiler initialConfig — oppdateres etter hver server-action
  const [config, setConfig] = useState<Map<string, InstructorLocationConfig>>(
    () => {
      const m = new Map<string, InstructorLocationConfig>();
      for (const c of initialConfig) {
        m.set(configKey(c.instructorId, c.locationId), c);
      }
      return m;
    },
  );

  function getConfig(
    instructorId: string,
    locationId: string,
  ): InstructorLocationConfig | undefined {
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
          if (newActive) {
            next.set(key, {
              instructorId: selectedInstructor,
              locationId,
              isActive: true,
              serviceTypeIds: current?.serviceTypeIds ?? [],
            });
          } else {
            // Inaktiv: fjern også serviceTypeIds (server action gjør det samme)
            next.set(key, {
              instructorId: selectedInstructor,
              locationId,
              isActive: false,
              serviceTypeIds: [],
            });
          }
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
      toast({
        variant: "error",
        title: "Aktiver lokasjonen først",
      });
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
    <>
      <MCTopbar
        title="Lokasjoner"
        subtitle="Hvor coacher tilbyr hvilke tjenester"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <MonoLabel size="xs" uppercase className="block text-outline">
            CoachHQ
          </MonoLabel>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Lokasjoner<span className="text-outline">.</span>
          </h1>
          <p className="text-on-surface-variant">
            Velg hvilke lokasjoner du jobber på, og hvilke tjenester du tilbyr på hver
            lokasjon. Kunder kan kun booke tjenester du har aktivert her.
          </p>
        </div>

        <BentoGrid cols={3} gap="md">
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">
              Lokasjoner
            </MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {locations.length}
            </p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">
              Aktive for meg
            </MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {activeLocations.length}
            </p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">
              Tjenester totalt
            </MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {totalServices}
            </p>
          </BentoCard>
        </BentoGrid>

        {/* Instructor Selector — kun hvis admin (flere instruktører) */}
        {instructors.length > 1 && (
          <Card padding="sm">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm text-on-surface-variant/80">
                Velg coach:
              </span>
              <div className="flex gap-2 flex-wrap">
                {instructors.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => setSelectedInstructor(i.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      selectedInstructor === i.id
                        ? "bg-surface-container ring-2 ring-black"
                        : "hover:bg-surface"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-on-surface" />
                    <span className="text-sm text-on-surface">{i.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {selectedInstructor ? (
          <div className="space-y-4">
            {locations.map((location) => {
              const active = isLocationActive(location.id);
              const serviceIds = getServiceIds(location.id);

              return (
                <Card key={location.id} padding="md">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-on-surface">
                        {location.name}
                      </h3>
                      {location.address ? (
                        <p className="text-sm text-on-surface-variant">
                          {location.address}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      variant={active ? "accent" : "secondary"}
                      onClick={() => handleToggleLocation(location.id)}
                      disabled={isPending}
                    >
                      <Icon
                        name={active ? "check_circle" : "add"}
                        className="w-4 h-4"
                      />
                      {active ? "Aktiv" : "Aktiver"}
                    </Button>
                  </div>

                  {active ? (
                    <div className="space-y-2">
                      <MonoLabel
                        size="xs"
                        uppercase
                        className="text-on-surface-variant block mb-2"
                      >
                        Tjenester på denne lokasjonen ({serviceIds.length})
                      </MonoLabel>
                      <div className="flex flex-wrap gap-2">
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
                                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                  checked
                                    ? "bg-on-surface text-surface"
                                    : "bg-surface-container text-on-surface hover:bg-surface-variant"
                                }`}
                              >
                                {service.name}
                                {!service.isPublic ? (
                                  <span className="ml-1 text-xs opacity-60">
                                    (skjult)
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant/80">
                      Aktiver lokasjonen for å koble til tjenester.
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card padding="md">
            <p className="text-on-surface-variant">
              Ingen instruktør funnet for kontoen din.
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
