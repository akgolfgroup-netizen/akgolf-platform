"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Check, X, User, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { AdminCard, AdminBadge, AdminPageHeader } from "@/components/portal/mission-control/ui";
import { toggleFacilityActive, deleteInstructorDefault } from "../actions";

// ── Types ──────────────────────────────────────────────────

interface FacilityRow {
  id: string;
  name: string;
  locationName: string;
  capacity: number | null;
  isActive: boolean;
}

interface DefaultRow {
  id: string;
  instructorName: string;
  facilityName: string;
  serviceType: string | null;
  priority: number;
}

interface Props {
  facilities: FacilityRow[];
  defaults: DefaultRow[];
}

// ── Component ──────────────────────────────────────────────

export function InnstillingerClient({ facilities, defaults }: Props) {
  const { toggle } = useMCSidebar();
  const [isPending, startTransition] = useTransition();

  function handleToggle(facilityId: string) {
    startTransition(async () => {
      await toggleFacilityActive(facilityId);
    });
  }

  function handleDeleteDefault(defaultId: string) {
    if (!window.confirm("Slett denne default-koblingen?")) return;
    startTransition(async () => {
      await deleteInstructorDefault(defaultId);
    });
  }

  return (
    <>
      <MCTopbar title="Fasilitetinnstillinger" subtitle="Administrer fasiliteter og standard innstillinger" onMenuClick={toggle} />
      <div className={cn("p-6 max-w-4xl mx-auto space-y-6", isPending && "opacity-60 pointer-events-none")}>
        <Link href="/admin/fasiliteter" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
          <ArrowLeft className="w-4 h-4" />Tilbake til fasiliteter
        </Link>

        <AdminPageHeader title="Innstillinger" subtitle="Administrer fasiliteter og instruktør-defaults"
          breadcrumbs={[{ label: "Fasiliteter", href: "/admin/fasiliteter" }, { label: "Innstillinger" }]} />

        {/* Facilities List */}
        <AdminCard className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-grey-200)]">
            <h3 className="admin-section-title">Fasiliteter</h3>
          </div>
          <div className="divide-y divide-[var(--color-grey-200)]">
            {facilities.map((f) => (
              <div key={f.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--color-muted)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text)] truncate">{f.name}</p>
                    <p className="text-sm text-[var(--color-muted)]">{f.locationName} · Kapasitet: {f.capacity}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(f.id)}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                    f.isActive
                      ? "text-[var(--color-success)] bg-[var(--color-success)]/10 hover:bg-[var(--color-success)]/15"
                      : "text-[var(--color-muted)] bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)]",
                  )}
                >
                  {f.isActive ? <><Check className="w-3 h-3" />Aktiv</> : <><X className="w-3 h-3" />Inaktiv</>}
                </button>
              </div>
            ))}
            {facilities.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-[var(--color-muted)]">Ingen fasiliteter registrert</div>
            )}
          </div>
        </AdminCard>

        {/* Instructor Defaults */}
        <AdminCard className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-grey-200)]">
            <h3 className="admin-section-title">Instruktør-fasilitet defaults</h3>
            <p className="text-sm text-[var(--color-muted)] mt-1">Standard fasilitet for hver instruktør ved booking-opprettelse</p>
          </div>
          {defaults.length > 0 ? (
            <div className="divide-y divide-[var(--color-grey-200)]">
              {defaults.map((d) => (
                <div key={d.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[var(--color-muted)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--color-text)] truncate">{d.instructorName}</p>
                      <p className="text-sm text-[var(--color-muted)] truncate">{d.facilityName}{d.serviceType ? ` (${d.serviceType})` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <AdminBadge variant="info">Prioritet: {d.priority}</AdminBadge>
                    <button type="button" onClick={() => handleDeleteDefault(d.id)}
                      className="p-2 rounded-lg hover:bg-[var(--color-error)]/10 text-[var(--color-error)] transition-colors" aria-label={`Slett default for ${d.instructorName}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-sm text-[var(--color-muted)]">Ingen defaults konfigurert</div>
          )}
        </AdminCard>

        <div className="p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-[var(--color-primary)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--color-text)]">
              <strong>Tips:</strong> Fasilitet-defaults brukes til automatisk å tildele riktig fasilitet når en booking opprettes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
