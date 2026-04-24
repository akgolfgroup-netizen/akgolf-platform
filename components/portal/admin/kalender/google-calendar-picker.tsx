"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { MonoLabel } from "@/components/portal/patterns";

interface GoogleCalendar {
  id: string;
  summary: string;
  primary?: boolean;
  backgroundColor?: string;
}

interface Subscription {
  id: string;
  googleCalendarId: string;
  displayName: string | null;
  backgroundColor: string | null;
  enabled: boolean;
}

export default function GoogleCalendarPicker() {
  const [calendars, setCalendars] = useState<GoogleCalendar[] | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [calRes, subsRes] = await Promise.all([
        fetch("/api/portal/calendar/google/calendars"),
        fetch("/api/portal/calendar/google/subscriptions"),
      ]);
      if (calRes.status === 400) {
        setConnected(false);
        setCalendars(null);
      } else if (calRes.ok) {
        const { calendars } = (await calRes.json()) as { calendars: GoogleCalendar[] };
        setCalendars(calendars);
        setConnected(true);
      }
      if (subsRes.ok) {
        const { subscriptions } = (await subsRes.json()) as { subscriptions: Subscription[] };
        setSubscriptions(subscriptions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente kalendere");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isEnabled = (calendarId: string) =>
    subscriptions.find((s) => s.googleCalendarId === calendarId)?.enabled ?? false;

  const toggle = async (cal: GoogleCalendar, enabled: boolean) => {
    setSaving(true);
    try {
      const res = await fetch("/api/portal/calendar/google/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendars: [
            {
              googleCalendarId: cal.id,
              displayName: cal.summary,
              backgroundColor: cal.backgroundColor ?? null,
              enabled,
            },
          ],
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Ukjent feil" }));
        setError(error ?? "Kunne ikke lagre");
      } else {
        await refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const syncNow = async () => {
    setSyncing(true);
    setStatus(null);
    try {
      const res = await fetch("/api/portal/calendar/google/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.message ?? "Synkronisert");
      } else {
        setError("Synk feilet");
      }
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl bg-surface-container p-4">
        <div className="mb-2 h-4 w-1/3 rounded bg-surface-container-high" />
        <div className="h-3 w-2/3 rounded bg-surface-container-high" />
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="event_repeat" className="h-4 w-4 text-on-surface" />
          <MonoLabel size="sm" uppercase className="text-on-surface">
            Google Calendar-synk
          </MonoLabel>
        </div>
        {connected && (
          <button
            onClick={syncNow}
            disabled={syncing}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg bg-on-surface text-surface hover:opacity-90 disabled:opacity-50"
          >
            <Icon name={syncing ? "progress_activity" : "sync"} className={syncing ? "w-3 h-3 animate-spin" : "w-3 h-3"} />
            {syncing ? "Synker…" : "Synk nå"}
          </button>
        )}
      </div>

      {!connected ? (
        <div className="space-y-3">
          <p className="text-xs text-on-surface-variant">
            Koble til Google Calendar for å blokkere booking-tider når du har møter.
          </p>
          <a
            href="/api/portal/calendar/google/auth"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-surface hover:opacity-90"
          >
            <Icon name="login" className="w-4 h-4" />
            Koble til Google
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-on-surface-variant mb-2">
            Velg hvilke kalendere som skal blokkere booking-tider.
          </p>
          {calendars?.map((cal) => (
            <label
              key={cal.id}
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-variant/50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isEnabled(cal.id)}
                onChange={(e) => toggle(cal, e.target.checked)}
                disabled={saving}
                className="w-4 h-4 accent-success-text"
              />
              {cal.backgroundColor && (
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cal.backgroundColor }}
                />
              )}
              <span className="text-sm text-on-surface flex-1">
                {cal.summary}
                {cal.primary && (
                  <span className="ml-2 text-[10px] font-medium text-on-surface-variant uppercase">
                    primær
                  </span>
                )}
              </span>
            </label>
          ))}
          {error && <p className="text-xs text-error mt-2">{error}</p>}
          {status && <p className="text-xs text-success-text mt-2">{status}</p>}
        </div>
      )}
    </div>
  );
}
