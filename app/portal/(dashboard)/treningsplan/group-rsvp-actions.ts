"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import {
  getUpcomingGroupSessionsForUser,
  setGroupSessionRSVP,
  type RSVPStatus,
  type UpcomingGroupSessionItem,
} from "@/lib/booking-v2/group-rsvp";

export interface SerializedGroupSessionItem {
  sessionId: string;
  occurrenceDate: string;
  groupId: string;
  groupName: string;
  title: string;
  description: string | null;
  startISO: string;
  endISO: string;
  locationName: string | null;
  isCancelled: boolean;
  rsvpStatus: RSVPStatus;
  rsvpNote: string | null;
}

/**
 * Hent kommende gruppe-økter for innlogget spiller (4 uker fram).
 */
export async function listMyUpcomingGroupSessions(): Promise<
  SerializedGroupSessionItem[]
> {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 28);

  const items = await getUpcomingGroupSessionsForUser(user.id, from, to);
  return items.map(serialize);
}

function serialize(item: UpcomingGroupSessionItem): SerializedGroupSessionItem {
  return {
    sessionId: item.sessionId,
    occurrenceDate: item.occurrenceDate,
    groupId: item.groupId,
    groupName: item.groupName,
    title: item.title,
    description: item.description,
    startISO: item.start.toISOString(),
    endISO: item.end.toISOString(),
    locationName: item.locationName,
    isCancelled: item.isCancelled,
    rsvpStatus: item.rsvpStatus,
    rsvpNote: item.rsvpNote,
  };
}

/**
 * Spilleren sier "ja" eller "nei" til en gruppe-økt-forekomst.
 */
export async function respondToGroupSession(input: {
  sessionId: string;
  occurrenceDate: string;
  status: RSVPStatus;
  note?: string;
}): Promise<void> {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  await setGroupSessionRSVP({
    userId: user.id,
    sessionId: input.sessionId,
    occurrenceDate: input.occurrenceDate,
    status: input.status,
    note: input.note,
  });
}
