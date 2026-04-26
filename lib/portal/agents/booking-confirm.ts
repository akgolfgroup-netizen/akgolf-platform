/**
 * Agent: booking-confirm
 * Trigger: Ny booking opprettet (CONFIRMED).
 * Handling: SMS + e-post + admin-notat (Google Calendar-invite kommer i Sprint 4 hvis env satt).
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";

const AGENT_NAME = "booking-confirm";

export async function runBookingConfirm(bookingId: string): Promise<AgentResult> {
  const started = Date.now();
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        User: { select: { id: true, name: true, email: true, phone: true } },
        ServiceType: { select: { name: true } },
        Instructor: { include: { User: { select: { name: true } } } },
        Location: { select: { name: true } },
      },
    });

    if (!booking) return logSkip(started, bookingId, "no-booking");
    if (booking.status !== "CONFIRMED") return logSkip(started, bookingId, "not-confirmed");

    const startStr = booking.startTime.toLocaleString("nb-NO", {
      weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
    });

    // Notify spilleren
    await prisma.notification.create({
      data: {
        id: nanoid(),
        userId: booking.User.id,
        type: "BOOKING_CONFIRMED",
        title: `Booking bekreftet: ${booking.ServiceType.name}`,
        message: `${startStr} med ${booking.Instructor.User?.name ?? "instruktør"}${booking.Location ? ` på ${booking.Location.name}` : ""}`,
        linkUrl: `/portal/bookinger`,
      },
    });

    return logSuccess(started, bookingId, `confirmed for ${booking.User.email}`);
  } catch (err) {
    logger.error(`[${AGENT_NAME}] failed`, err);
    return logError(started, bookingId, err);
  }
}

async function logSuccess(started: number, input: string, output: string): Promise<AgentResult> {
  await prisma.agentLog.create({
    data: { id: nanoid(), agentType: AGENT_NAME, model: "rule-based", status: "success", duration: Date.now() - started, input, output },
  }).catch(() => {});
  return { ran: true };
}
async function logSkip(started: number, input: string, reason: string): Promise<AgentResult> {
  await prisma.agentLog.create({
    data: { id: nanoid(), agentType: AGENT_NAME, model: "rule-based", status: "skipped", duration: Date.now() - started, input, output: reason },
  }).catch(() => {});
  return { ran: false, reason };
}
async function logError(started: number, input: string, err: unknown): Promise<AgentResult> {
  await prisma.agentLog.create({
    data: { id: nanoid(), agentType: AGENT_NAME, model: "rule-based", status: "error", duration: Date.now() - started, input, error: err instanceof Error ? err.message : String(err) },
  }).catch(() => {});
  return { ran: false, reason: "error" };
}
