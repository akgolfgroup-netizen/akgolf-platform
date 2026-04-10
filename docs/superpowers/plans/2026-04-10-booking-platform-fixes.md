# Booking Platform Fixes — 8 oppgaver

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fiks 8 identifiserte problemer i booking-plattformen — fra kritisk race condition til moderat tidssone-inkonsistens.

**Architecture:** Endringene er isolerte per oppgave. Oppgave 1 (race condition) er den viktigste og krever en Supabase RPC-funksjon. Oppgave 2 (farger) er den mest omfattende — 7 filer med feil brand-farger. De resterende er kirurgiske 1-2-fil-endringer.

**Tech Stack:** Next.js App Router, Supabase (RPC + SQL), Tailwind CSS v4 med CSS-variabler, TypeScript strict

---

## Filstruktur

| Oppgave | Filer som endres |
|---------|------------------|
| 1. Race condition | `supabase/migrations/XXXXXX_atomic_booking.sql` (ny), `app/api/booking/create/route.ts` |
| 2. Brand-farger | 7 filer under `app/booking/` |
| 3. Dobbel konfliktsjekk | `app/api/booking/create/route.ts` |
| 4. Feil feilkode | `lib/portal/booking/validation.ts` |
| 5. FREE → VISITOR | `app/api/booking/create/route.ts`, `lib/portal/auth.ts` |
| 6. Rate limiting | `app/api/booking/create/route.ts` |
| 7. Server-side filtrering | `app/api/portal/public/service-types/route.ts`, `app/booking/select-service/page.tsx` |
| 8. Tidssone-konsistens | `lib/portal/booking/conflict-check.ts`, `lib/portal/booking/validation.ts` |

---

### Task 1: Atomisk booking-opprettelse (race condition fix)

**Problemet:** `validateBooking()` og den etterfølgende INSERT er to separate operasjoner uten transaksjon. Mellom sjekk og insert kan en annen request ta samme slot.

**Løsning:** Supabase RPC-funksjon som gjør SELECT FOR UPDATE + INSERT i én transaksjon.

**Files:**
- Create: `supabase/migrations/20260410_atomic_booking_create.sql`
- Modify: `app/api/booking/create/route.ts`

- [ ] **Step 1: Opprett Supabase RPC-migrasjon**

Opprett `supabase/migrations/20260410_atomic_booking_create.sql`:

```sql
-- Atomisk booking-opprettelse med konfliktsjekk
-- Forhindrer race conditions ved å bruke row-level locking

CREATE OR REPLACE FUNCTION create_booking_atomic(
  p_id TEXT,
  p_student_id TEXT,
  p_instructor_id TEXT,
  p_service_type_id TEXT,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_payment_method TEXT DEFAULT 'STRIPE',
  p_payment_status TEXT DEFAULT 'PENDING',
  p_amount INT DEFAULT 0,
  p_vat_amount INT DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_conflict_id TEXT;
  v_blocked_id TEXT;
  v_result JSON;
BEGIN
  -- Lock existing bookings for this instructor in the time range
  -- FOR UPDATE prevents concurrent inserts from passing this check
  SELECT id INTO v_conflict_id
  FROM "Booking"
  WHERE "instructorId" = p_instructor_id
    AND status IN ('PENDING', 'CONFIRMED')
    AND "startTime" < p_end_time
    AND "endTime" > p_start_time
  FOR UPDATE
  LIMIT 1;

  IF v_conflict_id IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'TIME_SLOT_CONFLICT',
      'message', 'Tidspunktet er allerede booket',
      'conflictId', v_conflict_id
    );
  END IF;

  -- Check blocked times
  SELECT id INTO v_blocked_id
  FROM "BlockedTime"
  WHERE ("instructorId" = p_instructor_id OR "instructorId" IS NULL)
    AND "startTime" < p_end_time
    AND "endTime" > p_start_time
  LIMIT 1;

  IF v_blocked_id IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'BLOCKED_TIME_CONFLICT',
      'message', 'Tidspunktet er ikke tilgjengelig'
    );
  END IF;

  -- No conflict — insert booking
  INSERT INTO "Booking" (
    id, "studentId", "instructorId", "serviceTypeId",
    "startTime", "endTime", status,
    "paymentMethod", "paymentStatus",
    amount, "vatAmount", "updatedAt"
  ) VALUES (
    p_id, p_student_id, p_instructor_id, p_service_type_id,
    p_start_time, p_end_time, 'PENDING',
    p_payment_method::\"PaymentMethod\", p_payment_status::\"PaymentStatus\",
    p_amount, p_vat_amount, NOW()
  );

  RETURN json_build_object(
    'success', true,
    'bookingId', p_id
  );
END;
$$;
```

- [ ] **Step 2: Appliser migrasjonen**

```bash
cd /Users/anderskristiansen/Developer/akgolf/akgolf-platform
# Bruk Supabase MCP eller CLI for å applisere migrasjonen
```

- [ ] **Step 3: Oppdater create/route.ts — erstatt manuell sjekk+insert med RPC-kall**

I `app/api/booking/create/route.ts`, erstatt linjene 176-247 (den manuelle konfliktsjekken + insert) med:

```typescript
    // Atomic booking creation — sjekk + insert i én transaksjon
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      "create_booking_atomic",
      {
        p_id: bookingId,
        p_student_id: user.id,
        p_instructor_id: instructorId,
        p_service_type_id: serviceTypeId,
        p_start_time: start.toISOString(),
        p_end_time: end.toISOString(),
        p_payment_method: paymentMethod,
        p_payment_status: paymentMethod === "STRIPE" ? "PENDING" : "PAID",
        p_amount: serviceType?.price || 0,
        p_vat_amount: 0,
      }
    );

    if (rpcError) {
      throw rpcError;
    }

    const atomicResult = rpcResult as { success: boolean; error?: string; message?: string; bookingId?: string };

    if (!atomicResult.success) {
      throw new ConflictError(atomicResult.message || "Tidspunktet er ikke tilgjengelig");
    }

    // Hent den opprettede bookingen med relasjoner
    const { data: booking, error: fetchError } = await supabase
      .from("Booking")
      .select(`
        *,
        ServiceType:serviceTypeId(*),
        Instructor:instructorId(
          userId,
          User:userId(name)
        )
      `)
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      throw new Error("Booking opprettet, men kunne ikke hentes");
    }
```

- [ ] **Step 4: Verifiser at build kompilerer**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260410_atomic_booking_create.sql app/api/booking/create/route.ts
git commit -m "fix: atomisk booking-opprettelse via RPC for å forhindre race conditions"
```

---

### Task 2: Brand Guide V2.0-farger i booking-flyt

**Problemet:** 7 filer bruker hardkodede farger (`#154212`, `#d2f000`, `#fdf9f0`, `#f7f3ea`) som ikke matcher Brand Guide V2.0 (`#005840`, `#D1F843`, `#ECF0EF`).

**Filer som må endres:**
1. `app/booking/select-service/page.tsx`
2. `app/booking/date-time/page.tsx`
3. `app/booking/review-confirm/page.tsx`
4. `app/booking/components/BookingNavSidebar.tsx`
5. `app/booking/components/BookingProgress.tsx`
6. `app/booking/confirmation/page.tsx`
7. `app/booking/confirmed/page.tsx`

**Strategi:** Erstatt inline `style={{}}` med Tailwind-klasser som bruker CSS-variablene fra `globals.css`. Mapping:

| Gammel farge | Ny CSS-variabel / Tailwind-klasse |
|-------------|-----------------------------------|
| `#154212` | `var(--color-primary)` → `text-primary`, `bg-primary` |
| `#d2f000` | `var(--color-accent-cta)` → `text-accent-cta`, `bg-accent-cta` |
| `#fdf9f0` / `#f7f3ea` | `var(--color-surface)` → `bg-surface` |
| `#1a1a1a` | `var(--color-text)` → `text-text` |
| `#666666` | `var(--color-muted)` → `text-muted` |

**Files:**
- Modify: `app/booking/select-service/page.tsx`
- Modify: `app/booking/date-time/page.tsx`
- Modify: `app/booking/review-confirm/page.tsx`
- Modify: `app/booking/components/BookingNavSidebar.tsx`
- Modify: `app/booking/components/BookingProgress.tsx`
- Modify: `app/booking/confirmation/page.tsx`
- Modify: `app/booking/confirmed/page.tsx`

- [ ] **Step 1: Fiks `select-service/page.tsx`**

Fjern hele `BRAND`-objektet (linje 32-39) og erstatt alle `style={{ color: BRAND.x }}` og `style={{ backgroundColor: BRAND.x }}` med Tailwind-klasser:

```typescript
// FJERN dette objektet helt:
// const BRAND = { green: "#154212", lime: "#d2f000", ... };

// Erstatt style-props med Tailwind-klasser. Eksempler:
// style={{ color: BRAND.green }}         → className="text-primary"
// style={{ backgroundColor: BRAND.cream }} → className="bg-surface"
// style={{ color: BRAND.textMuted }}     → className="text-muted"
// style={{ backgroundColor: BRAND.green }} → className="bg-primary"
// style={{ backgroundColor: BRAND.lime }} → className="bg-accent-cta"
// style={{ color: BRAND.lime }}          → className="text-accent-cta"
// style={{ color: BRAND.text }}          → className="text-text"
// border med brand-farger: → className="border-primary/10"
// Spinner: border-[#154212] → border-primary
```

Spesifikke endringer å gjøre:
- Linje 110: `border-[#154212]` → `border-primary`
- Alle `style={{ backgroundColor: BRAND.cream }}` → `className="bg-surface"`
- Alle `style={{ backgroundColor: BRAND.creamDark }}` → `className="bg-surface-secondary"`
- Alle `style={{ backgroundColor: BRAND.green }}` → `className="bg-primary"`
- Alle `style={{ color: BRAND.green }}` → `className="text-primary"`
- Alle `style={{ color: BRAND.lime }}` → `className="text-accent-cta"`
- Alle `style={{ backgroundColor: BRAND.lime }}` → `className="bg-accent-cta"`
- Alle `style={{ color: BRAND.text }}` → `className="text-text"`
- Alle `style={{ color: BRAND.textMuted }}` → `className="text-muted"`
- Alle `style={{ color: BRAND.white }}` → `className="text-white"`
- Alle `style={{ backgroundColor: BRAND.white }}` → `className="bg-white"`
- `boxShadow: isPro ? \`0 0 0 2px ${BRAND.lime}\` : "none"` → `className={isPro ? "ring-2 ring-accent-cta" : ""}`

- [ ] **Step 2: Fiks `date-time/page.tsx`**

Samme mønster — finn og erstatt alle hardkodede farger med Tailwind-klasser. Filen bruker samme `BRAND`-objekt.

- [ ] **Step 3: Fiks `review-confirm/page.tsx`**

Samme mønster.

- [ ] **Step 4: Fiks `components/BookingNavSidebar.tsx`**

Samme mønster.

- [ ] **Step 5: Fiks `components/BookingProgress.tsx`**

Samme mønster.

- [ ] **Step 6: Fiks `confirmation/page.tsx`**

Erstatt alle `bg-[#154212]`, `text-[#154212]`, `bg-[#d2f000]`, `bg-[#f7f3ea]`, `border-[#154212]` med:
- `bg-[#154212]` → `bg-primary`
- `text-[#154212]` → `text-primary`
- `bg-[#d2f000]` → `bg-accent-cta`
- `text-[#d2f000]` → `text-accent-cta`
- `bg-[#f7f3ea]` → `bg-surface`
- `border-[#154212]/10` → `border-primary/10`

- [ ] **Step 7: Fiks `confirmed/page.tsx`**

Samme mønster som Step 6.

- [ ] **Step 8: Verifiser visuelt**

```bash
npm run dev
```

Åpne `/booking/select-service` og verifiser at fargene matcher Brand Guide V2.0. Primary skal være mørk grønn (#005840), ikke nesten-svart (#154212). Accent skal være lime (#D1F843), ikke gul-grønn (#d2f000).

- [ ] **Step 9: Commit**

```bash
git add app/booking/
git commit -m "fix: oppdater booking-flyt til Brand Guide V2.0 farger — fjern hardkodede hex-verdier"
```

---

### Task 3: Fjern dobbel konfliktsjekk i create/route.ts

**Problemet:** `validateBooking()` (linje 162-170) sjekker allerede for konflikter og blokkert tid. Linje 178-208 gjør nøyaktig det samme etterpå. Etter Task 1 er den atomiske RPC-en den ekte beskyttelsen, så valideringen er for bruker-feedback.

**Merk:** Denne oppgaven avhenger av at Task 1 er ferdig. Etter Task 1 er den manuelle sjekken allerede fjernet og erstattet med RPC. Denne oppgaven bekrefter bare at det er ryddig.

**Files:**
- Modify: `app/api/booking/create/route.ts`

- [ ] **Step 1: Verifiser at den doble sjekken er fjernet**

Etter Task 1 skal `create/route.ts` ikke lenger ha separate Supabase-queries for `Booking`-konflikter (linje 178-194 i originalen) eller `BlockedTime`-sjekk (linje 196-208 i originalen). Verifiser at filen nå kun har:
1. `validateBooking()` for bruker-feedback
2. `create_booking_atomic` RPC for atomisk opprettelse

Hvis noe er igjen, fjern det.

- [ ] **Step 2: Commit (hvis endringer)**

```bash
git add app/api/booking/create/route.ts
git commit -m "refactor: fjern duplikat konfliktsjekk — RPC håndterer atomisk"
```

---

### Task 4: Fiks feil feilkode i validation.ts catch-all

**Problemet:** Linje 210-214 bruker `RATE_LIMIT_EXCEEDED` som feilkode for uventede feil. Misvisende.

**Files:**
- Modify: `lib/portal/booking/validation.ts`

- [ ] **Step 1: Legg til INTERNAL_ERROR i ValidationErrorCode**

I `lib/portal/booking/validation.ts`, legg til `"INTERNAL_ERROR"` i `ValidationErrorCode` type-union (linje 49-69):

```typescript
export type ValidationErrorCode =
  | "BOOKING_IN_PAST"
  | "START_TIME_REQUIRED"
  | "INVALID_START_TIME"
  | "MAX_ADVANCE_EXCEEDED"
  | "MIN_NOTICE_VIOLATION"
  | "INSTRUCTOR_UNAVAILABLE"
  | "INSTRUCTOR_NOT_FOUND"
  | "SERVICE_NOT_FOUND"
  | "SERVICE_INACTIVE"
  | "TIME_SLOT_CONFLICT"
  | "BLOCKED_TIME_CONFLICT"
  | "GOOGLE_CALENDAR_CONFLICT"
  | "QUOTA_EXCEEDED"
  | "BOOKING_WINDOW_EXCEEDED"
  | "DUPLICATE_BOOKING"
  | "PAYMENT_METHOD_INVALID"
  | "INVALID_EMAIL"
  | "INVALID_NAME"
  | "RATE_LIMIT_EXCEEDED"
  | "LOCK_ACQUISITION_FAILED"
  | "INTERNAL_ERROR";
```

- [ ] **Step 2: Erstatt feilkoden i catch-blokken**

Endre linje 210-214 fra:

```typescript
    errors.push({
      code: "RATE_LIMIT_EXCEEDED",
      message: "En uventet feil oppstod under validering. Prøv igjen.",
    });
```

til:

```typescript
    errors.push({
      code: "INTERNAL_ERROR",
      message: "En uventet feil oppstod under validering. Prøv igjen.",
    });
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add lib/portal/booking/validation.ts
git commit -m "fix: bruk INTERNAL_ERROR i stedet for RATE_LIMIT_EXCEEDED i catch-all"
```

---

### Task 5: Fiks FREE → VISITOR for gjestebrukere

**Problemet:** Prisma-schema definerer `SubscriptionTier` med `VISITOR` som default, men `create/route.ts` (linje 84) og `auth.ts` (linje 50, 66, 91, 130) bruker `"FREE"` som ikke finnes i enum.

**Files:**
- Modify: `app/api/booking/create/route.ts`
- Modify: `lib/portal/auth.ts`

- [ ] **Step 1: Fiks create/route.ts**

I `app/api/booking/create/route.ts` linje 84, endre:

```typescript
      subscriptionTier: "FREE",
```

til:

```typescript
      subscriptionTier: "VISITOR",
```

- [ ] **Step 2: Fiks auth.ts**

I `lib/portal/auth.ts`, erstatt alle forekomster av `"FREE"` med `"VISITOR"`:

Linje 50:
```typescript
        subscriptionTier: "VISITOR",
```

Linje 66:
```typescript
      subscriptionTier: newUser.subscriptionTier || "VISITOR",
```

Linje 91:
```typescript
    subscriptionTier: user.subscriptionTier || "VISITOR",
```

Linje 130:
```typescript
  return user?.subscriptionTier || "VISITOR";
```

- [ ] **Step 3: Sjekk om andre filer bruker FREE**

Søk etter andre steder som bruker `"FREE"` som subscriptionTier og fiks de:

```bash
grep -rn '"FREE"' --include="*.ts" --include="*.tsx" | grep -i "subscription\|tier"
```

Fiks eventuelle treff (f.eks. `components/portal/profil/profile-hero.tsx` linje 27: `tierConfig.FREE` → `tierConfig.VISITOR`).

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add app/api/booking/create/route.ts lib/portal/auth.ts components/portal/profil/profile-hero.tsx
git commit -m "fix: bruk VISITOR i stedet for FREE — matcher Prisma SubscriptionTier enum"
```

---

### Task 6: Legg til rate limiting på booking create

**Problemet:** `POST /api/booking/create` mangler `checkRateLimit()`, i motsetning til andre endepunkter.

**Files:**
- Modify: `app/api/booking/create/route.ts`

- [ ] **Step 1: Legg til rate limiting øverst i POST-handler**

I `app/api/booking/create/route.ts`, legg til import (hvis ikke allerede):

```typescript
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
```

Legg til som første sjekk i `POST`-funksjonen, rett etter `try {`:

```typescript
    // Rate limiting
    const rateLimit = checkRateLimit(
      `booking-create:${getClientIp(req)}`,
      RATE_LIMITS.BOOKING_CREATE
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "For mange forespørsler. Vent litt og prøv igjen." },
        { status: 429 }
      );
    }
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/api/booking/create/route.ts
git commit -m "fix: legg til rate limiting på POST /api/booking/create"
```

---

### Task 7: Server-side filtrering av tjenester

**Problemet:** `select-service/page.tsx` filtrerer ut Foundation Test, Start og Banecoaching i klienten (linje 72-77). Bør gjøres server-side.

**Files:**
- Modify: `app/api/portal/public/service-types/route.ts`
- Modify: `app/booking/select-service/page.tsx`

- [ ] **Step 1: Legg til `exclude` query-parameter i API-et**

I `app/api/portal/public/service-types/route.ts`, etter linje 11 (`export async function GET(request: NextRequest) {`), les `exclude`-parameter:

```typescript
  const { searchParams } = new URL(request.url);
  const excludeParam = searchParams.get("exclude"); // Komma-separerte navn-mønstre
  const excludePatterns = excludeParam ? excludeParam.split(",").map(s => s.trim().toLowerCase()) : [];
```

Etter at `types` er hentet fra Supabase (linje 46), filtrer server-side:

```typescript
    let filteredTypes = types || [];
    if (excludePatterns.length > 0) {
      filteredTypes = filteredTypes.filter(
        (t: { name: string }) => !excludePatterns.some(pattern => t.name.toLowerCase().includes(pattern))
      );
    }

    return NextResponse.json(filteredTypes, {
```

- [ ] **Step 2: Oppdater frontend til å bruke exclude-parameteret**

I `app/booking/select-service/page.tsx`, endre fetch-URL (linje 68) fra:

```typescript
    fetch("/api/portal/public/service-types")
```

til:

```typescript
    fetch("/api/portal/public/service-types?exclude=Foundation,Start,Banecoaching")
```

Fjern klient-side filtreringen (linje 72-77):

```typescript
          // FJERN disse linjene:
          // const filtered = data.filter(s => 
          //   !s.name.includes("Foundation") && 
          //   !s.name.includes("Start") &&
          //   !s.name.includes("Banecoaching")
          // );
          
          // Bruk data direkte (allerede filtrert server-side):
          const sorted = data.sort((a, b) => {
```

Oppdater `sorted` til å bruke `data` i stedet for `filtered`.

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/api/portal/public/service-types/route.ts app/booking/select-service/page.tsx
git commit -m "refactor: flytt tjeneste-filtrering fra klient til server via exclude-parameter"
```

---

### Task 8: Standardiser tidssone-håndtering til UTC

**Problemet:** `conflict-check.ts` bruker `getUTCDay()` / `setUTCHours()` mens `validation.ts` bruker `getDay()` / lokal tid. Inkonsistens som kan gi feil i UTC+1/+2.

**Strategi:** Standardiser til UTC gjennomgående, da databasen lagrer UTC og Supabase returnerer UTC.

**Files:**
- Modify: `lib/portal/booking/conflict-check.ts`
- Modify: `lib/portal/booking/validation.ts`

- [ ] **Step 1: Verifiser conflict-check.ts allerede bruker UTC**

`conflict-check.ts` linje 141-142 bruker allerede `getUTCDay()` og `setUTCHours()`. Korrekt. Ingen endring.

- [ ] **Step 2: Fiks validation.ts — dayOfWeek**

I `lib/portal/booking/validation.ts` linje 354, endre:

```typescript
  const dayOfWeek = startTime.getDay();
```

til:

```typescript
  const dayOfWeek = startTime.getUTCDay();
```

- [ ] **Step 3: Fiks validation.ts — helgesjekk**

I `validateTimeConstraints`-funksjonen (ca. linje 306), endre:

```typescript
  const dayOfWeek = startTime.getDay();
```

til:

```typescript
  const dayOfWeek = startTime.getUTCDay();
```

- [ ] **Step 4: Verifiser format-kall bruker riktig tidssone**

`format(startTime, "HH:mm")` på linje 355 bruker lokal tid. Sjekk om Supabase-queries bruker samme format. Hvis `InstructorAvailability.startTime` er lagret som `"09:00"` i UTC, er dette korrekt. Hvis det er lagret i norsk tid, legg til `{ locale: nb }` og hold den som er.

For konsistens, legg til en kommentar som dokumenterer konvensjonen:

```typescript
  // NB: Tilgjengelighetstider i databasen er lagret i UTC
  const timeString = format(startTime, "HH:mm"); // UTC-tid matcher databasen
```

- [ ] **Step 5: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add lib/portal/booking/validation.ts
git commit -m "fix: standardiser til getUTCDay() i validation.ts — matcher conflict-check.ts og database"
```

---

## Rekkefølge

Oppgavene kan gjøres i denne rekkefølgen (noen har avhengigheter):

1. **Task 4** (feilkode) — uavhengig, liten endring
2. **Task 5** (FREE→VISITOR) — uavhengig, enkel
3. **Task 8** (tidssone) — uavhengig, enkel
4. **Task 6** (rate limiting) — uavhengig, enkel
5. **Task 1** (race condition) — krever SQL-migrasjon
6. **Task 3** (dobbel sjekk) — avhenger av Task 1
7. **Task 7** (server-filtrering) — uavhengig
8. **Task 2** (brand-farger) — mest omfattende, gjør sist

Parallelliserbare grupper:
- **Gruppe A** (kan kjøres samtidig): Task 4, Task 5, Task 8
- **Gruppe B** (kan kjøres samtidig): Task 6, Task 7
- **Gruppe C** (sekvensielt): Task 1 → Task 3
- **Gruppe D** (uavhengig): Task 2
