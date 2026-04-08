"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Calendar, Clock, MapPin, Users, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";

// Mock facilities
const mockFacilities = [
  { id: "1", name: "TrackMan Simulator 1", slug: "simulator-1" },
  { id: "2", name: "TrackMan Simulator 2", slug: "simulator-2" },
  { id: "3", name: "Putting Green", slug: "putting" },
  { id: "4", name: "Møterom", slug: "meeting" },
];

export default function NyAktivitetPage() {
  const { toggle } = useMCSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    facilityId: "",
    date: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    description: "",
    activityType: "training",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push("/portal/admin/fasiliteter");
    }, 1500);
  };

  if (success) {
    return (
      <>
        <MCTopbar title="Ny aktivitet" subtitle="" onMenuClick={toggle} />
        <div className="p-5">
          <div className="hg-card py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--hg-success)]/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[var(--hg-success)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--hg-text)]">
              Aktivitet opprettet!
            </h2>
            <p className="text-[var(--hg-text-muted)] mt-2">
              Aktiviteten er lagt til i kalenderen.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MCTopbar
        title="Ny aktivitet"
        subtitle="Opprett en ny turnering, kurs eller aktivitet"
        onMenuClick={toggle}
      />

      <div className="p-5 max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/portal/admin/fasiliteter"
          className="inline-flex items-center gap-2 text-sm text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til fasiliteter
        </Link>

        {/* Form */}
        <form onSubmit={handleSubmit} className="hg-card p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
              Tittel
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="F.eks. Junior Academy"
              className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-4 py-2.5 text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] focus:border-[var(--hg-primary)] outline-none transition-colors"
              required
            />
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
              Aktivitetstype
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "training", label: "Trening", icon: Users },
                { id: "tournament", label: "Turnering", icon: Calendar },
                { id: "course", label: "Kurs", icon: FileText },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, activityType: type.id })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                    formData.activityType === type.id
                      ? "border-[var(--hg-primary)] bg-[var(--hg-primary)]/10"
                      : "border-[var(--hg-border)] hover:border-[var(--hg-border-hover)]"
                  )}
                >
                  <type.icon className={cn(
                    "w-5 h-5",
                    formData.activityType === type.id ? "text-[var(--hg-primary)]" : "text-[var(--hg-text-muted)]"
                  )} />
                  <span className={cn(
                    "text-sm",
                    formData.activityType === type.id ? "text-[var(--hg-text)]" : "text-[var(--hg-text-muted)]"
                  )}>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Facility */}
          <div>
            <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
              Fasilitet
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--hg-text-muted)]" />
              <select
                value={formData.facilityId}
                onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--hg-text)] focus:border-[var(--hg-primary)] outline-none appearance-none"
                required
              >
                <option value="">Velg fasilitet</option>
                {mockFacilities.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
                Dato
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--hg-text-muted)]" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--hg-text)] focus:border-[var(--hg-primary)] outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
                Start
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--hg-text-muted)]" />
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--hg-text)] focus:border-[var(--hg-primary)] outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
                Slutt
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--hg-text-muted)]" />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--hg-text)] focus:border-[var(--hg-primary)] outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
              Maks deltakere
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--hg-text-muted)]" />
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                placeholder="F.eks. 8"
                min="1"
                className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] focus:border-[var(--hg-primary)] outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
              Beskrivelse
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beskriv aktiviteten..."
              rows={4}
              className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-4 py-2.5 text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] focus:border-[var(--hg-primary)] outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/portal/admin/fasiliteter"
              className="hg-btn hg-btn-secondary flex-1"
            >
              Avbryt
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="hg-btn hg-btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? "Oppretter..." : "Opprett aktivitet"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
