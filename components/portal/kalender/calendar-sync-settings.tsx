"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useEffect } from "react";

import { MonoLabel } from "@/components/portal/patterns";

function toWebcalUrl(httpUrl: string): string {
  return httpUrl.replace(/^https?:\/\//, "webcal://");
}

export function CalendarSyncSettings() {
  const [feedUrl, setFeedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/portal/calendar/token")
      .then((r) => r.json())
      .then((d) => {
        setFeedUrl(d.feedUrl ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function generateToken() {
    setGenerating(true);
    try {
      const r = await fetch("/api/portal/calendar/token", { method: "POST" });
      const d = await r.json();
      if (d.feedUrl) setFeedUrl(d.feedUrl);
    } finally {
      setGenerating(false);
    }
  }

  async function copyUrl() {
    if (!feedUrl) return;
    await navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openInAppleCalendar() {
    if (!feedUrl) return;
    window.open(toWebcalUrl(feedUrl), "_self");
  }

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl bg-surface-container p-4">
        <div className="mb-2 h-4 w-1/3 rounded bg-surface-container-high" />
        <div className="h-3 w-2/3 rounded bg-surface-container-high" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon name="calendar_today" className="h-4 w-4 text-on-surface" />
        <MonoLabel size="sm" uppercase className="text-on-surface">
          Kalendersynk
        </MonoLabel>
      </div>

      <p className="mb-4 text-xs text-on-surface-variant/80">
        Abonner på treningsplanen din direkte i Apple Kalender, Outlook eller Google Kalender.
        Kalenderen oppdateres automatisk.
      </p>

      {feedUrl ? (
        <div className="space-y-4">
          <button
            onClick={openInAppleCalendar}
            className="flex w-full items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-surface transition-opacity hover:opacity-90"
          >
            <Icon name="calendar_today" className="h-3.5 w-3.5" />
            Abonner i Apple Kalender / Outlook
            <Icon name="open_in_new" className="ml-auto h-3 w-3" />
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-black/6 bg-surface px-3 py-2">
            <Icon name="lock" className="h-3 w-3 shrink-0 text-on-surface-variant" />
            <p className="flex-1 truncate font-mono text-[10px] text-on-surface-variant/80">
              {feedUrl}
            </p>
            <button
              onClick={copyUrl}
              className="shrink-0 rounded p-1 text-on-surface-variant transition-colors hover:text-on-surface"
              title="Kopier URL"
            >
              {copied ? (
                <Icon name="check" className="h-3.5 w-3.5 text-success" />
              ) : (
                <Icon name="content_copy" className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <MonoLabel size="xs" uppercase className="block text-on-surface-variant">
              Eller legg til manuelt:
            </MonoLabel>
            <p className="text-[10px] text-on-surface-variant/80">
              <strong className="text-on-surface">Apple Kalender:</strong>{" "}
              Fil &rarr; Ny kalenderabonnement &rarr; lim inn URL
            </p>
            <p className="text-[10px] text-on-surface-variant/80">
              <strong className="text-on-surface">Outlook:</strong>{" "}
              Legg til kalender &rarr; Abonner fra nett &rarr; lim inn URL
            </p>
            <p className="text-[10px] text-on-surface-variant/80">
              <strong className="text-on-surface">Google Kalender:</strong>{" "}
              + &rarr; Andre kalendere &rarr; Fra URL &rarr; lim inn URL
            </p>
          </div>

          <button
            onClick={generateToken}
            disabled={generating}
            className="flex items-center gap-1.5 text-[10px] text-on-surface-variant transition-colors hover:text-on-surface-variant/90"
          >
            <Icon name="refresh" className={`h-3 w-3 ${generating ? "animate-spin" : ""}`} />
            Generer ny URL (invaliderer gammel)
          </button>
        </div>
      ) : (
        <button
          onClick={generateToken}
          disabled={generating}
          className="flex items-center gap-1.5 rounded-lg bg-on-surface px-4 py-2 text-xs font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          <Icon name="calendar_today" className="h-3.5 w-3.5" />
          {generating ? "Genererer..." : "Aktiver kalendersynk"}
        </button>
      )}
    </div>
  );
}
