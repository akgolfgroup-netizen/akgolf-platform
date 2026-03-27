# Booking System Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 5 identified gaps in the booking system: SMS notifications, rate limiting, timezone handling, VAT on coaching packages, and duplicate booking prevention.

**Architecture:** Add SMS notifications after payment confirmation, implement token-bucket rate limiting on booking APIs, add timezone constant for Norway, extend CoachingPackage schema with vatRate, and add explicit duplicate check before booking creation.

**Tech Stack:** Twilio (SMS), Prisma (schema), Next.js API routes, in-memory rate limiting

---

## File Structure

| File | Responsibility |
|------|----------------|
| `lib/portal/sms/send-booking-sms.ts` | SMS notification functions |
| `lib/portal/rate-limit.ts` | Rate limiting utility |
| `lib/portal/timezone.ts` | Timezone constants and helpers |
| `prisma/schema.prisma` | Add vatRate to CoachingPackage |
| `app/api/booking/create/route.ts` | Add rate limiting + duplicate check |
| `app/api/booking/slots/route.ts` | Add rate limiting |
| `app/api/booking/confirm-payment/route.ts` | Add SMS notification |

---

### Task 1: SMS Notification Function

**Files:**
- Create: `lib/portal/sms/send-booking-sms.ts`

- [ ] **Step 1: Create SMS notification function**

```typescript
// lib/portal/sms/send-booking-sms.ts
import { getTwilioClient } from "./twilio";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface BookingSmsParams {
  instructorPhone: string;
  instructorName: string;
  studentName: string;
  serviceName: string;
  startTime: Date;
  duration: number;
}

/**
 * Send SMS to instructor when a booking is confirmed.
 * Fails silently if Twilio is not configured or phone is missing.
 */
export async function sendBookingConfirmationSms(
  params: BookingSmsParams
): Promise<{ sent: boolean; error?: string }> {
  const { instructorPhone, instructorName, studentName, serviceName, startTime, duration } = params;

  if (!instructorPhone) {
    return { sent: false, error: "Instruktør mangler telefonnummer" };
  }

  const client = getTwilioClient();
  if (!client) {
    console.warn("[SMS] Twilio not configured, skipping SMS");
    return { sent: false, error: "Twilio ikke konfigurert" };
  }

  // Format Norwegian phone number
  const formattedPhone = instructorPhone.startsWith("+")
    ? instructorPhone
    : `+47${instructorPhone.replace(/\s/g, "")}`;

  const dateStr = format(startTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb });

  const message = `Ny booking! ${studentName} har booket ${serviceName} (${duration} min) ${dateStr}. Hilsen AK Golf`;

  try {
    const result = await client.sendSms(formattedPhone, message);
    if (result.success) {
      console.log(`[SMS] Sent to ${instructorName}: ${result.sid}`);
      return { sent: true };
    } else {
      return { sent: false, error: "SMS sending failed" };
    }
  } catch (error) {
    console.error("[SMS] Error:", error);
    return { sent: false, error: String(error) };
  }
}

/**
 * Send SMS to instructor when a booking is cancelled.
 */
export async function sendBookingCancellationSms(params: {
  instructorPhone: string;
  studentName: string;
  startTime: Date;
}): Promise<{ sent: boolean }> {
  const { instructorPhone, studentName, startTime } = params;

  if (!instructorPhone) return { sent: false };

  const client = getTwilioClient();
  if (!client) return { sent: false };

  const formattedPhone = instructorPhone.startsWith("+")
    ? instructorPhone
    : `+47${instructorPhone.replace(/\s/g, "")}`;

  const dateStr = format(startTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb });
  const message = `Avbestilling: ${studentName} har avbestilt timen ${dateStr}. Hilsen AK Golf`;

  try {
    const result = await client.sendSms(formattedPhone, message);
    return { sent: result.success };
  } catch {
    return { sent: false };
  }
}
```

- [ ] **Step 2: Verify file created**

Run: `cat lib/portal/sms/send-booking-sms.ts | head -20`
Expected: File exists with sendBookingConfirmationSms function

- [ ] **Step 3: Commit**

```bash
git add lib/portal/sms/send-booking-sms.ts
git commit -m "feat(sms): add booking SMS notification functions"
```

---

### Task 2: Add SMS to Payment Confirmation

**Files:**
- Modify: `app/api/booking/confirm-payment/route.ts`

- [ ] **Step 1: Import SMS function and add phone to Instructor include**

Add import at top of file:
```typescript
import { sendBookingConfirmationSms } from "@/lib/portal/sms/send-booking-sms";
```

Update the Instructor select to include User.phone:
```typescript
        Instructor: {
          select: { User: { select: { name: true, email: true, phone: true } } },
        },
```

- [ ] **Step 2: Add SMS sending after email (around line 95)**

Add after the email sending block:
```typescript
    // Send SMS til instruktør (non-blocking)
    if (booking.Instructor.User.phone) {
      sendBookingConfirmationSms({
        instructorPhone: booking.Instructor.User.phone,
        instructorName: booking.Instructor.User.name ?? "Instruktør",
        studentName: booking.User.name ?? "Kunde",
        serviceName: booking.ServiceType.name,
        startTime: booking.startTime,
        duration: booking.ServiceType.duration,
      }).catch((err: unknown) =>
        console.error("[confirm-payment] SMS failed:", err)
      );
    }
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/api/booking/confirm-payment/route.ts
git commit -m "feat(sms): send SMS to instructor on booking confirmation"
```

---

### Task 3: Rate Limiting Utility

**Files:**
- Create: `lib/portal/rate-limit.ts`

- [ ] **Step 1: Create rate limiter**

```typescript
// lib/portal/rate-limit.ts

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given key (e.g., IP address or user ID).
 * Uses in-memory token bucket algorithm.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  let entry = rateLimitStore.get(key);

  // Reset if window has expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  const allowed = entry.count <= config.limit;
  const remaining = Math.max(0, config.limit - entry.count);

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Get client IP from request headers.
 * Handles Vercel/Cloudflare proxy headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback for local development
  return "127.0.0.1";
}

// Pre-configured rate limits
export const RATE_LIMITS = {
  /** Booking creation: 10 per minute per IP */
  BOOKING_CREATE: { limit: 10, windowSeconds: 60 },
  /** Slot queries: 30 per minute per IP */
  BOOKING_SLOTS: { limit: 30, windowSeconds: 60 },
  /** General API: 100 per minute per IP */
  API_GENERAL: { limit: 100, windowSeconds: 60 },
} as const;
```

- [ ] **Step 2: Verify file created**

Run: `cat lib/portal/rate-limit.ts | head -20`
Expected: File exists with checkRateLimit function

- [ ] **Step 3: Commit**

```bash
git add lib/portal/rate-limit.ts
git commit -m "feat: add in-memory rate limiting utility"
```

---

### Task 4: Apply Rate Limiting to Booking APIs

**Files:**
- Modify: `app/api/booking/create/route.ts`
- Modify: `app/api/booking/slots/route.ts`

- [ ] **Step 1: Add rate limiting to booking/create**

Add imports at top:
```typescript
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
```

Add at start of POST function (after function declaration, before body parsing):
```typescript
  // Rate limiting
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`booking:create:${clientIp}`, RATE_LIMITS.BOOKING_CREATE);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Vent litt før du prøver igjen." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(RATE_LIMITS.BOOKING_CREATE.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  }
```

- [ ] **Step 2: Add rate limiting to booking/slots**

Read `app/api/booking/slots/route.ts` and add at start of GET function:
```typescript
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

// Inside GET function, at the start:
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`booking:slots:${clientIp}`, RATE_LIMITS.BOOKING_SLOTS);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/api/booking/create/route.ts app/api/booking/slots/route.ts
git commit -m "feat: add rate limiting to booking APIs"
```

---

### Task 5: Timezone Constant

**Files:**
- Create: `lib/portal/timezone.ts`

- [ ] **Step 1: Create timezone helper**

```typescript
// lib/portal/timezone.ts

/**
 * App-wide timezone for Norway.
 * All InstructorAvailability times are interpreted in this timezone.
 */
export const APP_TIMEZONE = "Europe/Oslo";

/**
 * Convert a HH:MM string to a Date object for a given date in APP_TIMEZONE.
 * Uses Intl API for timezone-aware conversion.
 */
export function parseTimeInTimezone(
  timeStr: string,
  date: Date
): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Create a date string in ISO format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const isoStr = `${year}-${month}-${day}T${timeStr}:00`;

  // Parse in local timezone (server should be set to Europe/Oslo)
  // For production, consider using date-fns-tz or luxon
  return new Date(isoStr);
}

/**
 * Format a Date to HH:MM in APP_TIMEZONE.
 */
export function formatTimeInTimezone(date: Date): string {
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Get current date in APP_TIMEZONE.
 */
export function nowInTimezone(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: APP_TIMEZONE })
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/portal/timezone.ts
git commit -m "feat: add timezone constants and helpers for Norway"
```

---

### Task 6: Add vatRate to CoachingPackage

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add vatRate field to CoachingPackage model**

Find the CoachingPackage model and add after priceNok:
```prisma
  vatRate            Int                @default(25)
```

The model should look like:
```prisma
model CoachingPackage {
  id                 String             @id @default(cuid())
  name               String
  slug               String             @unique
  priceNok           Int
  vatRate            Int                @default(25)
  billingType        BillingType
  ...
}
```

- [ ] **Step 2: Generate Prisma client**

Run: `npx prisma generate`
Expected: "Generated Prisma Client"

- [ ] **Step 3: Push schema to database**

Run: `npx prisma db push`
Expected: "Your database is now in sync"

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(schema): add vatRate to CoachingPackage"
```

---

### Task 7: Duplicate Booking Prevention

**Files:**
- Modify: `app/api/booking/create/route.ts`

- [ ] **Step 1: Add duplicate check before transaction**

Add after validation (around line 180, before the transaction):
```typescript
    // Sjekk for duplikat-booking (samme bruker, samme tid)
    const existingUserBooking = await prisma.booking.findFirst({
      where: {
        studentId,
        instructorId,
        startTime: start,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
    });

    if (existingUserBooking) {
      return NextResponse.json(
        { error: "Du har allerede en booking på dette tidspunktet" },
        { status: 409 }
      );
    }
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/api/booking/create/route.ts
git commit -m "fix: add explicit duplicate booking check"
```

---

### Task 8: Final Verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Verify all changes**

Run: `git log --oneline -7`
Expected: 7 commits for each task

- [ ] **Step 3: Create summary commit (optional)**

If needed, squash or tag:
```bash
git tag v1.1.0-booking-fixes
```

---

## Summary of Changes

| Fix | File(s) | Description |
|-----|---------|-------------|
| SMS | `lib/portal/sms/send-booking-sms.ts`, `confirm-payment/route.ts` | SMS to instructor on booking |
| Rate Limit | `lib/portal/rate-limit.ts`, `create/route.ts`, `slots/route.ts` | 10/min create, 30/min slots |
| Timezone | `lib/portal/timezone.ts` | Europe/Oslo constant |
| VAT | `prisma/schema.prisma` | vatRate on CoachingPackage |
| Duplicate | `create/route.ts` | Explicit duplicate check |
