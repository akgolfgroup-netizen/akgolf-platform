"use client";

import { useState, useEffect } from "react";
import { Calendar, Copy, Check, RefreshCw, Lock } from "lucide-react";

export function CalendarSyncSettings() {
  const [feedUrl, setFeedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/calendar/token")
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
      const r = await fetch("/api/calendar/token", { method: "POST" });
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

  if (loading) {
    return (
      <div className="rounded-xl p-4 border animate-pulse" style={{ borderColor: "var(--color-grey-200)", background: "rgba(255,255,255,0.02)" }}>
        <div className="h-4 bg-[var(--color-grey-200)] rounded w-1/3 mb-2" />
        <div className="h-3 bg-[var(--color-grey-200)] rounded w-2/3" />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "var(--color-grey-200)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-[var(--color-grey-900)]" />
        <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">Kalendersynk</h3>
      </div>

      <p className="text-xs text-[var(--color-grey-500)] mb-4">
        Abonner på treningsplanen din direkte i Apple Kalender eller Google Kalender.
        Kalenderen oppdateres automatisk.
      </p>

      {feedUrl ? (
        <div className="space-y-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "var(--color-grey-200)", border: "1px solid var(--color-grey-200)" }}
          >
            <Lock className="w-3 h-3 text-[var(--color-grey-400)]/60 flex-shrink-0" />
            <p className="text-[10px] text-[var(--color-grey-500)] truncate flex-1 font-mono">
              {feedUrl}
            </p>
            <button
              onClick={copyUrl}
              className="flex-shrink-0 p-1 rounded text-[var(--color-grey-400)]/60 hover:text-[var(--color-grey-900)] transition-colors"
              title="Kopier URL"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-[var(--color-grey-400)] uppercase tracking-wider">
              Slik abonnerer du:
            </p>
            <p className="text-[10px] text-[var(--color-grey-500)]">
              <strong className="text-[var(--color-grey-900)]">Apple Kalender:</strong>{" "}
              Fil → Ny kalenderabonnement → lim inn URL
            </p>
            <p className="text-[10px] text-[var(--color-grey-500)]">
              <strong className="text-[var(--color-grey-900)]">Google Kalender:</strong>{" "}
              + → Andre kalendere → Fra URL → lim inn URL
            </p>
          </div>

          <button
            onClick={generateToken}
            disabled={generating}
            className="flex items-center gap-1.5 text-[10px] text-[var(--color-grey-400)]/50 hover:text-[var(--color-grey-400)] transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${generating ? "animate-spin" : ""}`} />
            Generer ny URL (invaliderer gammel)
          </button>
        </div>
      ) : (
        <button
          onClick={generateToken}
          disabled={generating}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
          style={{
            background: "var(--color-black)",
            color: "var(--color-grey-900)",
            opacity: generating ? 0.7 : 1,
          }}
        >
          <Calendar className="w-3.5 h-3.5" />
          {generating ? "Genererer..." : "Aktiver kalendersynk"}
        </button>
      )}
    </div>
  );
}
