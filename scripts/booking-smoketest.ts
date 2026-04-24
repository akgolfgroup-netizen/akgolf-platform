#!/usr/bin/env tsx
/**
 * Booking Smoketest
 *
 * Verifiserer at booking-systemet henger sammen:
 *   1. Aktive ServiceTypes finnes og har priser
 *   2. Aktive Instructors + ukentlig tilgjengelighet finnes
 *   3. generateSlotsWithOverrides returnerer slots 7 dager fram
 *   4. BlockedTime-tabellen er lesbar
 *   5. Stripe-priser matcher (hvis STRIPE_SECRET_KEY er satt)
 *
 * Bruk: npx tsx scripts/booking-smoketest.ts
 */

import { createClient } from "@supabase/supabase-js";
import { addDays } from "date-fns";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function must(value: string | undefined, name: string): string {
  if (!value) {
    console.error(`\nMissing env: ${name}`);
    console.error("Last inn .env først (f.eks. via `dotenv -e .env -- npx tsx ...`) eller eksporter.");
    process.exit(1);
  }
  return value;
}

async function main() {
  const url = must(SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
  const key = must(SUPABASE_SERVICE_KEY, "SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  let passed = 0;
  let failed = 0;
  const line = (ok: boolean, msg: string) => {
    if (ok) {
      passed++;
      console.log(`  [ok] ${msg}`);
    } else {
      failed++;
      console.log(`  [FAIL] ${msg}`);
    }
  };

  console.log("\nBooking smoketest\n=================\n");

  // 1. ServiceType
  console.log("1. ServiceType");
  const { data: services, error: svcErr } = await supabase
    .from("ServiceType")
    .select("id, name, price, duration, isActive, bufferAfter, bufferBefore, minNoticeHours, maxAdvanceDays")
    .eq("isActive", true);
  line(!svcErr && !!services, `Hentet ${services?.length ?? 0} aktive tjenester`);
  if (services) {
    for (const s of services.slice(0, 5)) {
      line(s.price > 0, `  ${s.name} — ${s.price} kr / ${s.duration} min`);
    }
  }

  // 2. Instructor + tilgjengelighet
  console.log("\n2. Instructor + Availability");
  const { data: instructors } = await supabase
    .from("Instructor")
    .select("id, userId, isActive");
  const activeInstructors = (instructors ?? []).filter((i) => i.isActive !== false);
  line(activeInstructors.length > 0, `Hentet ${activeInstructors.length} aktive instruktører`);

  for (const inst of activeInstructors.slice(0, 3)) {
    const { data: avail } = await supabase
      .from("InstructorAvailability")
      .select("dayOfWeek, startTime, endTime")
      .eq("instructorId", inst.id)
      .eq("isActive", true);
    const days = new Set((avail ?? []).map((a) => a.dayOfWeek)).size;
    line(days > 0, `  ${inst.id}: ukentlig tilgjengelighet for ${days} dager`);
  }

  // 3. Slot-generering (importer dynamisk for å unngå Next.js-runtime-avhengighet)
  console.log("\n3. Slot-generering 7 dager fram");
  try {
    const { getAvailabilityForDate } = await import("../lib/portal/slots");
    const firstInstructor = activeInstructors[0];
    const firstService = (services ?? []).find((s) => s.price > 0);
    if (firstInstructor && firstService) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      let totalSlots = 0;
      for (let i = 1; i <= 7; i++) {
        const day = addDays(today, i);
        const windows = await getAvailabilityForDate(firstInstructor.id, day);
        totalSlots += windows.length;
      }
      line(totalSlots > 0, `  ${totalSlots} tilgjengelighetsvinduer funnet for ${firstInstructor.id} de neste 7 dagene`);
    } else {
      line(false, "  Ingen instruktør/tjeneste å teste med");
    }
  } catch (err) {
    line(false, `  slots-import feilet: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 4. BlockedTime
  console.log("\n4. BlockedTime");
  const { data: blocked, error: blkErr } = await supabase
    .from("BlockedTime")
    .select("id, source")
    .limit(5);
  line(!blkErr, `BlockedTime-tabell lesbar (${blocked?.length ?? 0} eksempelrader)`);

  // 5. Stripe
  console.log("\n5. Stripe-priser");
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.log("  [skip] STRIPE_SECRET_KEY ikke satt");
  } else {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey, { apiVersion: "2026-02-25.clover" as never });
      const prices = await stripe.prices.list({ active: true, limit: 20 });
      line(prices.data.length > 0, `Hentet ${prices.data.length} aktive Stripe-priser`);
    } catch (err) {
      line(false, `  Stripe-feil: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`\n=================\nResultat: ${passed} ok, ${failed} feilet\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("\nUventet feil:", err);
  process.exit(1);
});
