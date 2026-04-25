"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { createActivity } from "@/app/admin/(authed)/fasiliteter/actions";

interface FacilityOption {
  id: string;
  name: string;
}

interface AddActivityModalProps {
  open: boolean;
  onClose: () => void;
  facilities: FacilityOption[];
  defaultDate?: Date;
  defaultFacilityId?: string;
}

const ACTIVITY_TYPES = [
  { value: "LESSON", label: "Coaching" },
  { value: "PRACTICE", label: "Trening" },
  { value: "EVENT", label: "Gruppetime" },
  { value: "OTHER", label: "Junior" },
  { value: "TOURNAMENT", label: "Runde / turnering" },
] as const;

const DURATIONS = [30, 45, 60, 90, 120] as const;

export function AddActivityModal(props: AddActivityModalProps) {
  if (!props.open) return null;
  return <AddActivityModalInner {...props} />;
}

function AddActivityModalInner({
  onClose,
  facilities,
  defaultDate,
  defaultFacilityId,
}: AddActivityModalProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    facilityId: defaultFacilityId ?? facilities[0]?.id ?? "",
    person: "",
    activityType: "LESSON" as (typeof ACTIVITY_TYPES)[number]["value"],
    date: format(defaultDate ?? new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    duration: 60 as (typeof DURATIONS)[number],
  });

  const endTime = computeEndTime(form.startTime, form.duration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.facilityId) {
      setError("Velg en fasilitet");
      return;
    }
    if (!form.person.trim()) {
      setError("Skriv inn person eller gruppe");
      return;
    }

    startTransition(async () => {
      try {
        await createActivity({
          facilityId: form.facilityId,
          title: form.person.trim(),
          activityType: form.activityType,
          startDate: form.date,
          startTime: form.startTime,
          endTime,
        });
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kunne ikke lagre");
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-t-3xl border border-outline-variant/30 bg-surface shadow-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/30 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-on-surface">Ny aktivitet</h3>
            <p className="text-xs text-on-surface-variant">Legg til en booking på en fasilitet</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-variant"
            aria-label="Lukk"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <Field label="Fasilitet">
            <select
              value={form.facilityId}
              onChange={(e) => setForm({ ...form, facilityId: e.target.value })}
              className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-on-surface focus:outline-none"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Person eller gruppe">
            <input
              type="text"
              value={form.person}
              onChange={(e) => setForm({ ...form, person: e.target.value })}
              placeholder="F.eks. Jonas Hansen, Junior elite, U16"
              className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-on-surface focus:outline-none"
            />
          </Field>

          <Field label="Type">
            <div className="flex flex-wrap gap-1.5">
              {ACTIVITY_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, activityType: t.value })}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    form.activityType === t.value
                      ? "border-on-surface bg-on-surface text-surface"
                      : "border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-variant",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Dato">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-on-surface focus:outline-none"
              />
            </Field>
            <Field label="Starttid">
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-on-surface focus:outline-none"
              />
            </Field>
          </div>

          <Field label={`Varighet — slutter ${endTime}`}>
            <div className="flex flex-wrap gap-1.5">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm({ ...form, duration: d })}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium tabular-nums transition-colors",
                    form.duration === d
                      ? "border-on-surface bg-on-surface text-surface"
                      : "border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-variant",
                  )}
                >
                  {d} min
                </button>
              ))}
            </div>
          </Field>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-error-container px-3 py-2 text-sm text-error">
              <Icon name="error" size={16} />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-secondary-fixed px-3 py-2 text-sm text-on-secondary-fixed">
              <Icon name="check_circle" size={16} />
              Lagret
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-on-surface px-4 py-2 text-sm font-semibold text-surface hover:bg-inverse-surface disabled:opacity-50"
            >
              {pending && <Icon name="progress_activity" size={14} className="animate-spin" />}
              Lagre booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}

function computeEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const total = h * 60 + m + durationMinutes;
  const eh = Math.floor(total / 60) % 24;
  const em = total % 60;
  return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
}
