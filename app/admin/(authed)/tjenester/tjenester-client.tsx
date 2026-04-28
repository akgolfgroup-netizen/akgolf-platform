"use client";

import { useState, useTransition } from "react";
import { Plus, Filter } from "lucide-react";
import { useToast } from "@/components/portal/mission-control/ui";
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
  const { toast } = useToast();
  const [services, setServices] = useState(initialServices);
  const [isPending, startTransition] = useTransition();
  const [showNew, setShowNew] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");

  const filtered = services.filter((s) =>
    filter === "all" ? true : filter === "active" ? s.isActive : !s.isActive,
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
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between border-b border-[#1a4a3a] pb-5">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
            / DRIFT · TJENESTER
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
            Coaching-katalog.
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">
            {stats.total} tjenester totalt. Pris og betalingsplan synkroniseres
            automatisk til Stripe.
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
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#00422F]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} /> Ny tjeneste
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <KpiTile label="Tjenester" value={String(stats.total)} />
        <KpiTile label="Abonnement" value={String(stats.recurring)} />
        <KpiTile
          label="Mangler Stripe"
          value={String(stats.missingStripe)}
          tone={stats.missingStripe > 0 ? "alert" : undefined}
        />
      </div>

      {/* Filter pills */}
      <div className="mb-5 flex items-center gap-2">
        {(["active", "all", "inactive"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              "rounded-full px-3 py-1.5 text-[12px] font-medium transition " +
              (filter === f
                ? "bg-accent text-[#0A1F18]"
                : "bg-white/5 text-white/70 hover:bg-white/10")
            }
          >
            {f === "all" ? "Alle" : f === "active" ? "Aktive" : "Inaktive"}
          </button>
        ))}
      </div>

      {/* Service rows */}
      <div className="space-y-2">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="rounded-[14px] border border-white/[0.06] bg-[#0D2E23] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h3 className="text-[15px] font-bold tracking-tight text-white">
                    {s.name}
                  </h3>
                  <Pill
                    tone={s.isActive ? "success" : "muted"}
                    label={s.isActive ? "Aktiv" : "Inaktiv"}
                  />
                  {s.isRecurring && (
                    <Pill
                      tone="accent"
                      label={`Abonnement · ${s.recurringInterval ?? ""}`}
                    />
                  )}
                  {!s.isPublic && <Pill tone="warning" label="Skjult" />}
                  {!s.stripePriceId && (
                    <Pill tone="danger" label="Ikke i Stripe" />
                  )}
                </div>
                {s.description && (
                  <p className="mb-2 text-[12.5px] text-white/65 leading-[1.55]">
                    {s.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-white/55">
                  <span>
                    <strong className="text-white">{s.duration}</strong> MIN
                  </span>
                  <span>
                    <strong className="text-white">
                      {s.price.toLocaleString("nb-NO")} KR
                    </strong>
                    {s.isRecurring ? "/MND" : ""}
                  </span>
                  <span className="uppercase tracking-[0.10em]">
                    {CATEGORY_LABEL[s.category] ?? s.category}
                  </span>
                  {s.stripePriceId && (
                    <span className="text-white/40">
                      {s.stripePriceId.slice(0, 14)}…
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleActive(s.id, s.isActive)}
                disabled={isPending}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-semibold text-white/90 hover:bg-white/10 disabled:opacity-50"
              >
                {s.isActive ? "Deaktiver" : "Aktiver"}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/[0.06] bg-[#0D2E23] p-6 text-[13px] text-white/65">
            Ingen tjenester i dette filteret. Klikk &quot;Ny tjeneste&quot; for
            å legge til.
          </div>
        )}
      </div>

      <NyTjenesteDialog
        open={showNew}
        onOpenChange={setShowNew}
        onCreated={(created) => {
          setServices((prev) => [...prev, created]);
        }}
      />
    </div>
  );
}

function KpiTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "alert";
}) {
  return (
    <div
      className={
        "rounded-xl border bg-[#0D2E23] px-4 py-3.5 " +
        (tone === "alert"
          ? "border-[rgba(184,66,51,0.30)]"
          : "border-white/[0.06]")
      }
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.10em] text-white/50">
        {label}
      </div>
      <div
        className={
          "mt-1.5 font-mono text-[22px] font-bold leading-none " +
          (tone === "alert" ? "text-[#F49283]" : "text-white")
        }
      >
        {value}
      </div>
    </div>
  );
}

function Pill({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warning" | "danger" | "accent" | "muted";
}) {
  const styles: Record<typeof tone, string> = {
    success: "bg-[rgba(42,125,90,0.25)] text-[#6FCBA1]",
    warning: "bg-[rgba(196,138,50,0.22)] text-[#E8B967]",
    danger: "bg-[rgba(184,66,51,0.20)] text-[#F49283]",
    accent: "bg-[rgba(209,248,67,0.18)] text-accent",
    muted: "bg-white/5 text-white/65",
  };
  return (
    <span
      className={
        "rounded-[5px] px-[7px] py-[2px] font-mono text-[9px] font-bold uppercase tracking-[0.14em] " +
        styles[tone]
      }
    >
      {label}
    </span>
  );
}
