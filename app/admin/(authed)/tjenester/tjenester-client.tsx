"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { Button, Card, Badge } from "@/components/ui";
import { useToast } from "@/components/portal/mission-control/ui";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { MonoLabel, BentoGrid, BentoCard } from "@/components/portal/patterns";
import { NyTjenesteDialog } from "@/components/admin/tjenester/ny-tjeneste-dialog";
import { updateServiceType, type ServiceTypeRow } from "./actions";

interface TjenesterClientProps {
  initialServices: ServiceTypeRow[];
}

const CATEGORY_LABEL: Record<string, string> = {
  INDIVIDUAL: "1:1",
  GROUP: "Gruppe",
  VTG_COURSE: "VTG-kurs",
  SIMULATOR: "Simulator",
  PLAYING_LESSON: "Banecoaching",
  DIGITAL: "Digital",
};

export function TjenesterClient({ initialServices }: TjenesterClientProps) {
  const { toggle } = useMCSidebar();
  const { toast } = useToast();
  const [services, setServices] = useState(initialServices);
  const [isPending, startTransition] = useTransition();
  const [showNew, setShowNew] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");

  const filtered = services.filter((s) =>
    filter === "all"
      ? true
      : filter === "active"
        ? s.isActive
        : !s.isActive,
  );

  const stats = {
    total: services.length,
    recurring: services.filter((s) => s.isRecurring).length,
    missingStripe: services.filter((s) => !s.stripePriceId).length,
  };

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => {
      try {
        await updateServiceType({ id, isActive: !current });
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: !current } : s)),
        );
        toast({
          variant: "success",
          title: !current ? "Aktivert" : "Deaktivert",
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

  return (
    <>
      <MCTopbar
        title="Tjenester"
        subtitle="Coaching-katalog og Stripe-priser"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <MonoLabel size="xs" uppercase className="block text-outline">
            CoachHQ
          </MonoLabel>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Tjenester<span className="text-outline">.</span>
          </h1>
          <p className="text-on-surface-variant">
            Lag og rediger coaching-tjenester. Pris og betalingsplan synkroniseres
            automatisk til Stripe.
          </p>
        </div>

        <BentoGrid cols={3} gap="md">
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">
              Tjenester
            </MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {stats.total}
            </p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">
              Recurring
            </MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {stats.recurring}
            </p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">
              Mangler Stripe
            </MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {stats.missingStripe}
            </p>
          </BentoCard>
        </BentoGrid>

        <Card padding="sm">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1">
              {(["active", "all", "inactive"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filter === f
                      ? "bg-on-surface text-surface"
                      : "hover:bg-surface-container text-on-surface"
                  }`}
                >
                  {f === "all" ? "Alle" : f === "active" ? "Aktive" : "Inaktive"}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <Button variant="accent" onClick={() => setShowNew(true)}>
                <Icon name="add" className="w-4 h-4" />
                Ny tjeneste
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {filtered.map((s) => (
            <Card key={s.id} padding="md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-on-surface">
                      {s.name}
                    </h3>
                    <Badge variant={s.isActive ? "success" : "info"}>
                      {s.isActive ? "Aktiv" : "Inaktiv"}
                    </Badge>
                    {s.isRecurring ? (
                      <Badge variant="info">
                        Abonnement / {s.recurringInterval}
                      </Badge>
                    ) : null}
                    {!s.isPublic ? (
                      <Badge variant="warning">Skjult</Badge>
                    ) : null}
                    {!s.stripePriceId ? (
                      <Badge variant="error">Ikke i Stripe</Badge>
                    ) : null}
                  </div>
                  {s.description ? (
                    <p className="text-sm text-on-surface-variant mb-2">
                      {s.description}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                    <span>
                      <strong className="text-on-surface">{s.duration}</strong> min
                    </span>
                    <span>
                      <strong className="text-on-surface">
                        {s.price.toLocaleString("nb-NO")} kr
                      </strong>
                      {s.isRecurring ? "/mnd" : ""}
                    </span>
                    <span>
                      {CATEGORY_LABEL[s.category] ?? s.category}
                    </span>
                    {s.stripePriceId ? (
                      <span className="font-mono text-xs">
                        {s.stripePriceId.slice(0, 14)}…
                      </span>
                    ) : null}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleToggleActive(s.id, s.isActive)}
                  disabled={isPending}
                >
                  {s.isActive ? "Deaktiver" : "Aktiver"}
                </Button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 ? (
            <Card padding="md">
              <p className="text-on-surface-variant">
                Ingen tjenester i dette filteret. Klikk &quot;Ny tjeneste&quot; for
                å legge til.
              </p>
            </Card>
          ) : null}
        </div>
      </div>

      <NyTjenesteDialog
        open={showNew}
        onOpenChange={setShowNew}
        onCreated={(created) => {
          // Re-load via simpel state-append (siden vi har returnert id)
          setServices((prev) => [...prev, created]);
        }}
      />
    </>
  );
}
