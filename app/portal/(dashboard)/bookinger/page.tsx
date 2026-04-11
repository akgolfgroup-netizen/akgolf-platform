import { requirePortalUser } from "@/lib/portal/auth";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { getUpcomingBookings, getPastBookings } from "./actions";
import { BookingerClient } from "./bookinger-client";

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
