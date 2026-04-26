import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { MonoLabel } from "@/components/portal/patterns";
import { WaitlistCard, type WaitlistEntryView } from "./waitlist-card";
import { WaitlistStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Venteliste | PlayersHQ",
  description: "Dine aktive ventelister hos AK Golf Academy.",
};

export default async function VentelistePage() {
  const user = await requirePortalUser();

  const entries = await prisma.waitlistEntry.findMany({
    where: {
      studentId: user.id,
      status: { in: [WaitlistStatus.WAITING, WaitlistStatus.NOTIFIED] },
    },
    include: {
      Booking: {
        include: {
          ServiceType: { select: { name: true } },
          Instructor: {
            include: { User: { select: { name: true } } },
          },
        },
      },
    },
    orderBy: [{ status: "asc" }, { position: "asc" }],
  });

  const view: WaitlistEntryView[] = entries.map((entry) => ({
    id: entry.id,
    position: entry.position,
    status: entry.status === WaitlistStatus.NOTIFIED ? "NOTIFIED" : "WAITING",
    expiresAt: entry.expiresAt?.toISOString() ?? null,
    notifiedAt: entry.notifiedAt?.toISOString() ?? null,
    serviceName: entry.Booking.ServiceType?.name ?? "Coaching",
    instructorName: entry.Booking.Instructor.User.name ?? "Coach",
    bookingStartTime: entry.Booking.startTime.toISOString(),
  }));

  const notifiedCount = view.filter((e) => e.status === "NOTIFIED").length;
  const waitingCount = view.filter((e) => e.status === "WAITING").length;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <MonoLabel
          as="p"
          size="xs"
          uppercase
          className="text-on-surface-variant block"
        >
          Mine ventelister
        </MonoLabel>
        <h1 className="text-2xl font-bold text-on-surface">
          Din{" "}
          <span className="font-serif italic font-normal">venteliste</span>
          <span className="text-secondary-fixed">.</span>
        </h1>
        {view.length > 0 ? (
          <p className="max-w-xl text-[13px] text-on-surface-variant">
            <span className="font-semibold tabular-nums text-on-surface">
              {notifiedCount}
            </span>{" "}
            plass tilgjengelig og{" "}
            <span className="font-semibold tabular-nums text-on-surface">
              {waitingCount}
            </span>{" "}
            i kø.
          </p>
        ) : (
          <p className="max-w-xl text-[13px] text-on-surface-variant">
            Du står ikke på noen ventelister akkurat nå.
          </p>
        )}
      </div>

      {view.length > 0 ? (
        <section className="space-y-4">
          {view.map((entry) => (
            <WaitlistCard key={entry.id} entry={entry} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-10 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-variant">
            <Icon name="hourglass_empty" className="text-on-surface-variant" />
          </div>
          <h2 className="mb-2 text-base font-semibold text-on-surface">
            Ingen ventelister
          </h2>
          <p className="mx-auto mb-5 max-w-sm text-[13px] text-on-surface-variant">
            Hvis ønsket time er fullbooket kan du melde deg på venteliste fra
            booking-flyten — vi varsler deg med en gang en plass blir ledig.
          </p>
          <Link
            href="/portal/bookinger/ny"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-secondary-fixed px-5 text-[12px] font-bold text-on-surface shadow-[0_8px_24px_rgba(10,31,24,0.12)] transition-shadow hover:shadow-[0_12px_32px_rgba(10,31,24,0.16)]"
          >
            <Icon name="add" size={14} />
            Ny booking
          </Link>
        </section>
      )}

      <div>
        <Link
          href="/portal/bookinger"
          className="inline-flex items-center gap-2 text-[12px] font-medium text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <Icon name="arrow_back" size={14} />
          Tilbake til bookinger
        </Link>
      </div>
    </div>
  );
}
