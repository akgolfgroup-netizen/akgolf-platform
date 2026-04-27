/**
 * Booking V2 — wizard-state via signert cookie.
 *
 * Brukeren navigerer fra dine-detaljer → betal → bekreftelse uten URL-params.
 * Etter at form i dine-detaljer er sendt inn, lagrer vi draft i en HttpOnly-cookie
 * signert med HMAC-SHA256. betal/page.tsx leser cookien og verifiserer signaturen
 * før den brukes.
 *
 * Secret: process.env.BOOKING_DRAFT_SECRET (kreves i prod). Dev faller tilbake til
 * en deterministisk verdi men logger en advarsel — Vercel-env må settes før cutover.
 */

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const BOOKING_DRAFT_COOKIE = "__bv2_draft";
const DRAFT_TTL_SECONDS = 30 * 60; // 30 min

export interface BookingDraftCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  handicap?: string;
  note?: string;
  consent: boolean;
}

export interface BookingDraft {
  /** ServiceType.id (cuid) — kilden til service-data ved opprettelse av booking */
  serviceTypeId: string;
  /** Instructor.id (cuid) — valgfri når brukeren ikke har preferanse */
  instructorId?: string;
  /** Slug fra wizard-copy.ts — beholdt for visning til vi flytter trener-/tjenestevalg til DB-data fullt ut */
  serviceSlug: string;
  trainerSlug: string;
  /** YYYY-MM-DD i Europe/Oslo */
  date: string;
  /** HH:mm i Europe/Oslo */
  time: string;
  customer: BookingDraftCustomer;
}

function getSecret(): string {
  const secret = process.env.BOOKING_DRAFT_SECRET;
  if (secret && secret.length >= 16) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "BOOKING_DRAFT_SECRET må settes (≥16 tegn) i produksjon — booking-draft-cookien kan ikke signeres trygt uten."
    );
  }

  if (!getSecret.warned) {
    console.warn(
      "[booking-v2/draft] BOOKING_DRAFT_SECRET ikke satt — bruker dev-fallback. Sett env-var før prod-cutover."
    );
    getSecret.warned = true;
  }
  return "dev-only-fallback-not-for-prod-1234567890";
}
getSecret.warned = false as boolean;

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + "=".repeat(padLen), "base64");
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function verifySignature(payload: string, sig: string): boolean {
  const expected = Buffer.from(sign(payload), "hex");
  let actual: Buffer;
  try {
    actual = Buffer.from(sig, "hex");
  } catch {
    return false;
  }
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

function isValidDraft(value: unknown): value is BookingDraft {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.serviceTypeId !== "string" || !v.serviceTypeId) return false;
  if (v.instructorId !== undefined && typeof v.instructorId !== "string") return false;
  if (typeof v.serviceSlug !== "string" || typeof v.trainerSlug !== "string") return false;
  if (typeof v.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) return false;
  if (typeof v.time !== "string" || !/^\d{2}:\d{2}$/.test(v.time)) return false;

  const c = v.customer as Record<string, unknown> | undefined;
  if (!c || typeof c !== "object") return false;
  if (typeof c.firstName !== "string" || typeof c.lastName !== "string") return false;
  if (typeof c.email !== "string" || typeof c.phone !== "string") return false;
  if (typeof c.consent !== "boolean") return false;
  if (c.handicap !== undefined && typeof c.handicap !== "string") return false;
  if (c.note !== undefined && typeof c.note !== "string") return false;
  return true;
}

export async function getDraft(): Promise<BookingDraft | null> {
  const store = await cookies();
  const raw = store.get(BOOKING_DRAFT_COOKIE)?.value;
  if (!raw) return null;

  const dot = raw.lastIndexOf(".");
  if (dot < 0) return null;
  const encoded = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!verifySignature(encoded, sig)) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(fromBase64url(encoded).toString("utf8"));
  } catch {
    return null;
  }
  if (!isValidDraft(parsed)) return null;
  return parsed;
}

export async function setDraft(draft: BookingDraft): Promise<void> {
  if (!isValidDraft(draft)) {
    throw new Error("setDraft: ugyldig BookingDraft");
  }
  const encoded = base64url(JSON.stringify(draft));
  const sig = sign(encoded);
  const value = `${encoded}.${sig}`;

  const store = await cookies();
  store.set({
    name: BOOKING_DRAFT_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/booking-v2",
    maxAge: DRAFT_TTL_SECONDS,
  });
}

export async function clearDraft(): Promise<void> {
  const store = await cookies();
  store.delete(BOOKING_DRAFT_COOKIE);
}
