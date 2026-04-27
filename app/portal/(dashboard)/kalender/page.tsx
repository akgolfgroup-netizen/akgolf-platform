import { requirePortalUser } from "@/lib/portal/auth";
import { startOfMonth, endOfMonth } from "date-fns";
import { KalenderClientV2 } from "@/components/portal/kalender/v2/kalender-client-v2";
import { getCalendarEvents } from "./actions";

export default async function KalenderPage() {
  await requirePortalUser();

  const now = new Date();
  // Hent hele måneden + en uke buffer rundt så grid får alle event-treff
  const from = startOfMonth(now);
  const to = endOfMonth(now);
  from.setDate(from.getDate() - 7);
  to.setDate(to.getDate() + 7);

  const events = await getCalendarEvents(from, to);

  return <KalenderClientV2 events={events} initialMonth={now} />;
}
