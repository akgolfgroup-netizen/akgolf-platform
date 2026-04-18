import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { getUpcomingBookings, getPastBookings } from "./actions";
import { BookingerClient } from "./bookinger-client";

export const metadata: Metadata = {
  title: "Bookinger | AK Golf Portal",
  description:
    "Dine coaching-bookinger. Se kommende og tidligere økter.",
  openGraph: {
    title: "Bookinger | AK Golf Portal",
    description:
      "Dine coaching-bookinger. Se kommende og tidligere økter.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookinger | AK Golf Portal",
    description:
      "Dine coaching-bookinger. Se kommende og tidligere økter.",
  },
};

export default async function BookingerPage() {
  await requirePortalUser();
  const [upcoming, past] = await Promise.all([
    getUpcomingBookings(),
    getPastBookings(),
  ]);

  return (
    <BookingerClient
      upcoming={upcoming}
      past={past}
      cancellationRules={PORTAL_CONTENT.bookings.cancellationRules}
      emptyMessage={PORTAL_CONTENT.bookings.emptyState}
    />
  );
}
