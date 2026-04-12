"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Calendar, Clock, MapPin, Users, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { AdminCard, AdminButton, AdminInput, AdminSelect, AdminTextarea, AdminPageHeader } from "@/components/portal/mission-control/ui";
import { createActivity } from "../actions";

// ── Types ──────────────────────────────────────────────────

interface FacilityOption {
  id: string;
  name: string;
  locationName: string | null;
}

type ActivityType = "PRACTICE" | "LESSON" | "TOURNAMENT" | "EVENT" | "OTHER";

const ACTIVITY_OPTIONS: { id: ActivityType; label: string; icon: typeof Users }[] = [
  { id: "PRACTICE", label: "Trening", icon: Users },
  { id: "TOURNAMENT", label: "Turnering", icon: Calendar },
  { id: "LESSON", label: "Kurs", icon: FileText },
  { id: "EVENT", label: "Event", icon: Calendar },
];

interface FormData {
  title: string;
  facilityId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: string;
  description: string;
  activityType: ActivityType;
}

// ── Component ──────────────────────────────────────────────

export function NyAktivitetClient({ facilities }: { facilities: FacilityOption[] }) {
  const { toggle } = useMCSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "", facilityId: "", date: "", startTime: "", endTime: "",
    maxParticipants: "", description: "", activityType: "PRACTICE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createActivity({
        facilityId: formData.facilityId,
        title: formData.title,
        description: formData.description || undefined,
        activityType: formData.activityType,
        startDate: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      setSuccess(true);
      setTimeout(() => router.push("/admin/fasiliteter"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <MCTopbar title="Ny aktivitet" subtitle="" onMenuClick={toggle} />
        <div className="p-6">
          <AdminCard className="py-16 text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[var(--color-success)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Aktivitet opprettet!</h2>
            <p className="text-[var(--color-muted)] mt-2">Aktiviteten er lagt til i kalenderen.</p>
          </AdminCard>
        </div>
      </>
    );
  }

  return (
    <>
      <MCTopbar title="Ny aktivitet" subtitle="Opprett en ny turnering, kurs eller aktivitet" onMenuClick={toggle} />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Link href="/admin/fasiliteter" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
          <ArrowLeft className="w-4 h-4" />Tilbake til fasiliteter
        </Link>

        <AdminPageHeader title="Ny aktivitet" subtitle="Opprett en ny turnering, kurs eller aktivitet"
          breadcrumbs={[{ label: "Fasiliteter", href: "/admin/fasiliteter" }, { label: "Ny aktivitet" }]} />

        {error && (
          <div className="p-3 rounded-lg bg-[var(--color-error-light)] text-[var(--color-error-text)] text-sm">{error}</div>
        )}

        <AdminCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <AdminInput label="Tittel" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="F.eks. Junior Academy" required />

            <div>
              <label className="admin-label block mb-2">Aktivitetstype</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ACTIVITY_OPTIONS.map((type) => {
                  const Icon = type.icon;
                  const isActive = formData.activityType === type.id;
                  return (
                    <button key={type.id} type="button" onClick={() => setFormData({ ...formData, activityType: type.id })}
                      className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                        isActive ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-grey-200)] bg-white hover:bg-[var(--color-grey-100)]")}>
                      <Icon className={cn("w-5 h-5", isActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]")} />
                      <span className={cn("text-sm", isActive ? "text-[var(--color-text)] font-medium" : "text-[var(--color-muted)]")}>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="admin-label block mb-1.5">Fasilitet</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none z-10" />
                <AdminSelect value={formData.facilityId} onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })} required className="pl-10">
                  <option value="">Velg fasilitet</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}{f.locationName ? ` (${f.locationName})` : ""}</option>
                  ))}
                </AdminSelect>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="admin-label block mb-1.5">Dato</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none z-10" />
                  <AdminInput type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="pl-10" required />
                </div>
              </div>
              <div>
                <label className="admin-label block mb-1.5">Start</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none z-10" />
                  <AdminInput type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="pl-10" required />
                </div>
              </div>
              <div>
                <label className="admin-label block mb-1.5">Slutt</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none z-10" />
                  <AdminInput type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="pl-10" required />
                </div>
              </div>
            </div>

            <AdminTextarea label="Beskrivelse" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Beskriv aktiviteten..." rows={4} />

            <div className="flex gap-3 pt-2">
              <Link href="/admin/fasiliteter" className="flex-1"><AdminButton variant="secondary" className="w-full justify-center">Avbryt</AdminButton></Link>
              <AdminButton type="submit" variant="primary" loading={loading} className="flex-1 justify-center">{loading ? "Oppretter..." : "Opprett aktivitet"}</AdminButton>
            </div>
          </form>
        </AdminCard>
      </div>
    </>
  );
}
