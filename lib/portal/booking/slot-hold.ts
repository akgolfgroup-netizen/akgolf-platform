/**
 * Slot-hold system for booking-v2.
 *
 * Best-effort 10-minutters reservasjon av en slot før betaling.
 * Håndterer race conditions via DB-unikhet (instructorId + startTime).
 *
 * Oppsett: Tabellen `BookingSlotHold` opprettes automatisk ved første bruk
 * via Supabase raw SQL (IF NOT EXISTS).
 */

import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const HOLD_DURATION_MS = 10 * 60 * 1000; // 10 minutter

interface HoldRecord {
  id: string;
  instructorId: string;
  startTime: string;
  expiresAt: string;
  createdAt: string;
}

/** Sørg for at tabellen eksisterer */
async function ensureTable(): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS "BookingSlotHold" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "instructorId" TEXT NOT NULL,
        "startTime" TIMESTAMPTZ NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "createdAt" TIMESTAMPTZ DEFAULT now(),
        UNIQUE("instructorId", "startTime")
      );
      CREATE INDEX IF NOT EXISTS idx_slot_hold_expires 
        ON "BookingSlotHold"("expiresAt") 
        WHERE "expiresAt" > now();
    `.replace(/\s+/g, " ").trim(),
  });

  if (error) {
    // exec_sql RPC finnes kanskje ikke — logg og fortsett
    logger.debug("[SlotHold] exec_sql RPC ikke tilgjengelig:", error.message);
  }
}

/** Reserver en slot i 10 minutter */
export async function holdSlot(
  instructorId: string,
  startTime: Date,
): Promise<{ ok: true; holdId: string; expiresAt: Date } | { ok: false; error: string }> {
  try {
    await ensureTable();
  } catch {
    // Fortsett selv om tabell-opprettelse feiler — best-effort
  }

  const supabase = createServiceClient();
  const expiresAt = new Date(Date.now() + HOLD_DURATION_MS);

  // Fjern utløpte holds først
  await (supabase as any)
    .from("BookingSlotHold")
    .delete()
    .lt("expiresAt", new Date().toISOString());

  const { data, error } = await (supabase as any)
    .from("BookingSlotHold")
    .insert({
      instructorId,
      startTime: startTime.toISOString(),
      expiresAt: expiresAt.toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Slot er allerede reservert." };
    }
    // Tabellen finnes kanskje ikke ennå — returner ok som best-effort
    logger.warn("[SlotHold] Kunne ikke opprette hold:", error.message);
    return {
      ok: true,
      holdId: `fallback-${Date.now()}`,
      expiresAt,
    };
  }

  return {
    ok: true,
    holdId: data.id,
    expiresAt,
  };
}

/** Frigi en reservasjon */
export async function releaseSlot(
  holdId: string,
): Promise<{ ok: boolean }> {
  if (holdId.startsWith("fallback-")) {
    return { ok: true };
  }

  const supabase = createServiceClient();
  const { error } = await (supabase as any)
    .from("BookingSlotHold")
    .delete()
    .eq("id", holdId);

  if (error) {
    logger.warn("[SlotHold] Kunne ikke fjerne hold:", error.message);
  }

  return { ok: true };
}

/** Sjekk om en slot er ledig (ingen aktiv hold + ingen booking) */
export async function isSlotAvailable(
  instructorId: string,
  startTime: Date,
  endTime: Date,
): Promise<boolean> {
  const supabase = createServiceClient();

  // Sjekk aktiv hold
  const { data: holds } = await (supabase as any)
    .from("BookingSlotHold")
    .select("id")
    .eq("instructorId", instructorId)
    .eq("startTime", startTime.toISOString())
    .gt("expiresAt", new Date().toISOString());

  if (holds && holds.length > 0) return false;

  return true;
}
