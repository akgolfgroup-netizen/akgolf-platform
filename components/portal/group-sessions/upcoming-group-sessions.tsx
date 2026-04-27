"use client";

import { useEffect, useState, useTransition } from "react";
import {
  listMyUpcomingGroupSessions,
  respondToGroupSession,
  type SerializedGroupSessionItem,
} from "@/app/portal/(dashboard)/treningsplan/group-rsvp-actions";

interface UpcomingGroupSessionsProps {
  /** Vis kun valgt status, eller alle */
  filter?: "all" | "going" | "declined";
  /** Maks antall som vises */
  limit?: number;
}

const DOWS = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];
const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "mai",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "des",
];

function formatWhen(startISO: string, endISO: string): string {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const dow = DOWS[s.getDay()];
  const month = MONTHS[s.getMonth()];
  const hh = (n: number) => String(n).padStart(2, "0");
  return `${dow} ${s.getDate()}. ${month} · ${hh(s.getHours())}:${hh(s.getMinutes())}–${hh(e.getHours())}:${hh(e.getMinutes())}`;
}

export function UpcomingGroupSessions({
  filter = "all",
  limit,
}: UpcomingGroupSessionsProps) {
  const [items, setItems] = useState<SerializedGroupSessionItem[] | null>(null);
  const [isPending, startTransition] = useTransition();

  async function reload() {
    try {
      const data = await listMyUpcomingGroupSessions();
      setItems(data);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    let active = true;
    listMyUpcomingGroupSessions()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  function handleRespond(
    item: SerializedGroupSessionItem,
    status: "GOING" | "DECLINED",
  ) {
    startTransition(async () => {
      try {
        await respondToGroupSession({
          sessionId: item.sessionId,
          occurrenceDate: item.occurrenceDate,
          status,
        });
        // Optimistic update
        setItems((prev) =>
          prev
            ? prev.map((i) =>
                i.sessionId === item.sessionId &&
                i.occurrenceDate === item.occurrenceDate
                  ? { ...i, rsvpStatus: status }
                  : i,
              )
            : prev,
        );
      } catch {
        // Re-load på feil
        reload();
      }
    });
  }

  if (items === null) {
    return <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>Laster…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
        Ingen kommende gruppe-økter.
      </p>
    );
  }

  let visible = items;
  if (filter === "going") visible = items.filter((i) => i.rsvpStatus === "GOING");
  else if (filter === "declined")
    visible = items.filter((i) => i.rsvpStatus === "DECLINED");
  if (limit) visible = visible.slice(0, limit);

  return (
    <div className="space-y-2">
      {visible.map((item) => {
        const declined = item.rsvpStatus === "DECLINED";
        return (
          <div
            key={`${item.sessionId}::${item.occurrenceDate}`}
            className="rounded-lg border p-3 flex items-start justify-between gap-3"
            style={{
              borderColor: "var(--color-line)",
              background: declined ? "var(--color-surface-soft)" : "white",
              opacity: item.isCancelled ? 0.5 : 1,
            }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <strong style={{ color: "var(--color-ink)" }}>{item.title}</strong>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--color-primary-soft)",
                    color: "var(--color-primary)",
                  }}
                >
                  {item.groupName}
                </span>
                {item.isCancelled ? (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--color-danger-soft)",
                      color: "var(--color-danger)",
                    }}
                  >
                    Avlyst
                  </span>
                ) : null}
              </div>
              <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
                {formatWhen(item.startISO, item.endISO)}
                {item.locationName ? ` · ${item.locationName}` : ""}
              </p>
              {item.description ? (
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--color-ink-subtle)" }}
                >
                  {item.description}
                </p>
              ) : null}
            </div>
            {!item.isCancelled ? (
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleRespond(item, "GOING")}
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background:
                      item.rsvpStatus === "GOING"
                        ? "var(--color-primary)"
                        : "var(--color-surface-soft)",
                    color:
                      item.rsvpStatus === "GOING"
                        ? "white"
                        : "var(--color-ink)",
                  }}
                >
                  Ja takk
                </button>
                <button
                  type="button"
                  onClick={() => handleRespond(item, "DECLINED")}
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background:
                      item.rsvpStatus === "DECLINED"
                        ? "var(--color-danger)"
                        : "var(--color-surface-soft)",
                    color:
                      item.rsvpStatus === "DECLINED"
                        ? "white"
                        : "var(--color-ink)",
                  }}
                >
                  Nei
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
