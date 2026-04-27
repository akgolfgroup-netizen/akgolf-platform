"use client";

import * as React from "react";
import type {
  BookingViewModel,
  CancellationRule,
} from "@/components/portal/booking/booking-types";
import { BookingShell } from "@/components/portal/bookinger/v2/booking-shell";
import { PageHeader } from "@/components/portal/bookinger/v2/page-header";
import { NextBookingHero } from "@/components/portal/bookinger/v2/next-booking-hero";
import {
  BookingTabs,
  type BookingTab,
} from "@/components/portal/bookinger/v2/booking-tabs";
import { DaySeparator } from "@/components/portal/bookinger/v2/day-separator";
import { BookingRow } from "@/components/portal/bookinger/v2/booking-row";
import { CancellationRules } from "@/components/portal/bookinger/v2/cancellation-rules";
import { EmptyState } from "@/components/portal/bookinger/v2/empty-state";
import { groupByDay } from "@/components/portal/bookinger/v2/booking-utils";
import { cancelBooking } from "./actions";

// Re-eksporter typer som page.tsx eventuelt importerer
export type { BookingViewModel, CancellationRule };

interface BookingerClientProps {
  upcoming: BookingViewModel[];
  past: BookingViewModel[];
  cancellationRules: readonly CancellationRule[];
  emptyMessage: string;
}

export function BookingerClient({
  upcoming,
  past,
  cancellationRules,
  emptyMessage,
}: BookingerClientProps) {
  const upcomingCount = upcoming.length;
  const completed = React.useMemo(
    () => past.filter((b) => b.status === "completed"),
    [past],
  );
  const cancelled = React.useMemo(
    () => past.filter((b) => b.status === "cancelled"),
    [past],
  );

  const [activeTab, setActiveTab] = React.useState<BookingTab>("upcoming");
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  const nextBooking = upcoming[0] ?? null;
  const restUpcoming = upcoming.slice(1);
  const upcomingGroups = React.useMemo(
    () => groupByDay(restUpcoming),
    [restUpcoming],
  );
  const completedGroups = React.useMemo(
    () => groupByDay(completed),
    [completed],
  );
  const cancelledGroups = React.useMemo(
    () => groupByDay(cancelled),
    [cancelled],
  );

  async function handleCancel(id: string) {
    if (pendingId) return;
    const ok = window.confirm(
      "Er du sikker på at du vil avbestille denne bookingen?",
    );
    if (!ok) return;
    setPendingId(id);
    try {
      const result = await cancelBooking(id);
      if (!result.success) {
        window.alert(result.error ?? "Avbestilling feilet");
      }
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Avbestilling feilet",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <BookingShell>
      <PageHeader upcomingCount={upcomingCount} pastCount={past.length} />

      {nextBooking && (
        <NextBookingHero booking={nextBooking} onCancel={handleCancel} />
      )}

      <BookingTabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "upcoming", label: "Kommende", count: upcomingCount },
          { id: "completed", label: "Gjennomførte", count: completed.length },
          { id: "cancelled", label: "Avlyste", count: cancelled.length },
        ]}
      />

      {activeTab === "upcoming" && (
        <>
          {upcomingCount === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <>
              <CancellationRules rules={cancellationRules} />
              {nextBooking && upcomingGroups.length === 0 ? (
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    textAlign: "center",
                    padding: "24px 0",
                  }}
                >
                  Ingen flere kommende bookinger etter den neste.
                </p>
              ) : (
                upcomingGroups.map((group) => (
                  <div key={group.key}>
                    <DaySeparator
                      label={group.label}
                      count={group.bookings.length}
                    />
                    {group.bookings.map((b) => (
                      <BookingRow
                        key={b.id}
                        booking={b}
                        variant="upcoming"
                        onCancel={handleCancel}
                      />
                    ))}
                  </div>
                ))
              )}
            </>
          )}
        </>
      )}

      {activeTab === "completed" && (
        <>
          {completed.length === 0 ? (
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              Ingen gjennomførte økter ennå.
            </p>
          ) : (
            completedGroups.map((group) => (
              <div key={group.key}>
                <DaySeparator
                  label={group.label}
                  count={group.bookings.length}
                />
                {group.bookings.map((b) => (
                  <BookingRow key={b.id} booking={b} variant="past" />
                ))}
              </div>
            ))
          )}
        </>
      )}

      {activeTab === "cancelled" && (
        <>
          {cancelled.length === 0 ? (
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              Ingen avlyste bookinger.
            </p>
          ) : (
            cancelledGroups.map((group) => (
              <div key={group.key}>
                <DaySeparator
                  label={group.label}
                  count={group.bookings.length}
                />
                {group.bookings.map((b) => (
                  <BookingRow key={b.id} booking={b} variant="cancelled" />
                ))}
              </div>
            ))
          )}
        </>
      )}
    </BookingShell>
  );
}
