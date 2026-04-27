/**
 * RRULE-ekspansjon for gruppe-sesjoner (Fase F).
 *
 * Bruker rrule-biblioteket (RFC 5545) for å ekspandere en GroupSession
 * sin recurrenceRule til konkrete forekomster i et datovindu.
 *
 * Returnerer overstyrte instanser fra GroupSessionOccurrence-tabellen
 * (kanselleringer, flyttinger) i samme respons.
 */

import { RRule, type Options as RRuleOptions } from "rrule";
import { prisma } from "@/lib/portal/prisma";

export interface GroupSessionOccurrenceItem {
  /** Den opprinnelige planlagte starten (fra RRULE eller singleton) */
  scheduledStart: Date;
  /** Faktisk start (kan avvike hvis override) */
  start: Date;
  /** Faktisk slutt */
  end: Date;
  isCancelled: boolean;
  locationId: string | null;
  /** True hvis denne forekomsten har en override-record (kansellert eller flyttet) */
  hasOverride: boolean;
  note: string | null;
}

export interface ExpandedGroupSession {
  sessionId: string;
  groupId: string;
  title: string;
  description: string | null;
  locationId: string | null;
  occurrences: GroupSessionOccurrenceItem[];
}

/**
 * Ekspander en GroupSession's recurrenceRule til konkrete forekomster mellom
 * `from` og `to` (inklusive). Hvis sesjonen er en singleton (recurrenceRule = null),
 * returnerer kun startTime hvis den faller innenfor vinduet.
 *
 * Anvender overrides fra GroupSessionOccurrence-tabellen for å avlyse eller flytte
 * enkeltforekomster.
 */
export async function expandGroupSession(
  sessionId: string,
  from: Date,
  to: Date,
): Promise<ExpandedGroupSession | null> {
  const session = await prisma.groupSession.findUnique({
    where: { id: sessionId },
    include: { occurrences: true },
  });
  if (!session) return null;

  const occurrenceMap = new Map<string, (typeof session.occurrences)[number]>();
  for (const o of session.occurrences) {
    const key = isoDate(o.originalDate);
    occurrenceMap.set(key, o);
  }

  const dates = expandDates(session, from, to);
  const durationMs = session.endTime.getTime() - session.startTime.getTime();

  const occurrences: GroupSessionOccurrenceItem[] = dates.map((scheduledStart) => {
    const key = isoDate(scheduledStart);
    const override = occurrenceMap.get(key);

    if (override?.isCancelled) {
      return {
        scheduledStart,
        start: scheduledStart,
        end: new Date(scheduledStart.getTime() + durationMs),
        isCancelled: true,
        locationId: session.locationId,
        hasOverride: true,
        note: override.note,
      };
    }

    const start = override?.overrideStartTime ?? scheduledStart;
    const end =
      override?.overrideEndTime ??
      new Date(start.getTime() + durationMs);
    return {
      scheduledStart,
      start,
      end,
      isCancelled: false,
      locationId: override?.overrideLocationId ?? session.locationId,
      hasOverride: !!override,
      note: override?.note ?? null,
    };
  });

  return {
    sessionId: session.id,
    groupId: session.groupId,
    title: session.title,
    description: session.description,
    locationId: session.locationId,
    occurrences,
  };
}

/**
 * Ren beregningsfunksjon (testbar uten DB) som ekspanderer en RRULE-streng
 * eller en singleton-startTime til konkrete datoer mellom `from` og `to`.
 */
function expandDates(
  session: {
    startTime: Date;
    recurrenceRule: string | null;
    recurrenceUntil: Date | null;
  },
  from: Date,
  to: Date,
): Date[] {
  if (!session.recurrenceRule) {
    // Singleton — bare returner startTime hvis den er i vinduet
    return session.startTime >= from && session.startTime <= to
      ? [session.startTime]
      : [];
  }

  const ruleOptions: Partial<RRuleOptions> = RRule.parseString(
    session.recurrenceRule,
  );
  ruleOptions.dtstart = session.startTime;
  if (session.recurrenceUntil) {
    ruleOptions.until = session.recurrenceUntil;
  }
  const rule = new RRule(ruleOptions as RRuleOptions);
  return rule.between(from, to, true);
}

function isoDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
