import Link from "next/link";
import { Plus } from "lucide-react";
import { requirePortalUser } from "@/lib/portal/auth";
import { PortalHeader } from "@/components/portal/premium";
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
    <div className="space-y-8">
      <PortalHeader
        title="Mine bookinger"
        description="Administrer dine coaching-timer og treninger"
        actions={
          <Link
            href="/portal/bookinger/ny"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-alt)]"
          >
            <Plus className="h-4 w-4" />
            Book ny time
          </Link>
        }
      />

      <BookingerClient
        upcoming={upcoming}
        past={past}
        cancellationRules={PORTAL_CONTENT.bookings.cancellationRules}
        emptyMessage={PORTAL_CONTENT.bookings.emptyState}
      />
    </div>
  );
}
