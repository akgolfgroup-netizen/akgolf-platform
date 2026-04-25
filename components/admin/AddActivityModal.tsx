"use client";

import { FormEvent, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  ACTIVITY_TYPES,
  FACILITIES,
  createFacilityBooking,
  type ActivityType,
  type FacilityName,
} from "@/app/admin/(authed)/fasiliteter/actions";

interface AddActivityModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  defaultFacility?: FacilityName;
  defaultDate?: string;
}

const DURATIONS = [30, 45, 60, 90, 120, 180] as const;

export function AddActivityModal({
  open,
  onClose,
  onCreated,
  defaultFacility,
  defaultDate,
}: AddActivityModalProps) {
  const [facility, setFacility] = useState<FacilityName>(defaultFacility ?? FACILITIES[0]);
  const [person, setPerson] = useState("");
  const [type, setType] = useState<ActivityType>(ACTIVITY_TYPES[0]);
  const [date, setDate] = useState(defaultDate ?? todayISO());
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState<number>(60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFacility(defaultFacility ?? FACILITIES[0]);
    setDate(defaultDate ?? todayISO());
    setPerson("");
    setType(ACTIVITY_TYPES[0]);
    setStartTime("09:00");
    setDuration(60);
    setError(null);
  }, [open, defaultFacility, defaultDate]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createFacilityBooking({
        facility,
        person,
        type,
        date,
        startTime,
        durationMinutes: duration,
      });
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke lagre booking");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Legg til aktivitet"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-on-surface/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-surface-container-lowest p-6 shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/80">
              CoachHQ · Fasiliteter
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-on-surface">
              Legg til aktivitet
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            aria-label="Lukk"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Fasilitet" htmlFor="ab-facility">
            <select
              id="ab-facility"
              value={facility}
              onChange={(e) => setFacility(e.target.value as FacilityName)}
              className={selectClass}
            >
              {FACILITIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Person eller gruppe" htmlFor="ab-person">
            <input
              id="ab-person"
              type="text"
              required
              minLength={2}
              maxLength={120}
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className={inputClass}
              placeholder="F.eks. Junior 13–15 eller Markus Pedersen"
            />
          </Field>

          <Field label="Type" htmlFor="ab-type">
            <select
              id="ab-type"
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
              className={selectClass}
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Dato" htmlFor="ab-date">
              <input
                id="ab-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Starttid" htmlFor="ab-start">
              <input
                id="ab-start"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
                min="06:00"
                max="22:00"
                step={900}
              />
            </Field>
          </div>

          <Field label="Varighet" htmlFor="ab-duration">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Varighet">
              {DURATIONS.map((d) => {
                const active = duration === d;
                return (
                  <button
                    key={d}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setDuration(d)}
                    className={
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
                      (active
                        ? "border-primary bg-primary text-surface"
                        : "border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:border-outline-variant")
                    }
                  >
                    {d} min
                  </button>
                );
              })}
            </div>
          </Field>

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-error-container px-3 py-2 text-sm text-on-surface"
            >
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-full border border-outline-variant/40 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-secondary-fixed px-4 py-2.5 text-sm font-semibold text-secondary-fixed-text hover:brightness-95 disabled:opacity-50"
            >
              {submitting && <Icon name="progress_activity" size={16} className="animate-spin" />}
              Lagre booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/80"
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClass =
  "block w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const selectClass =
  "block w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
