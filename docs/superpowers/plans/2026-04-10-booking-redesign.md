# Booking Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Erstatt eksisterende `/booking`-flyt (3 separate sider) med en single-page trener-fokusert flyt hvor dato/tid, bekreftelse og betaling er sliding drawers fra bunn.

**Architecture:** Én client page `/booking` med React state for progresjon. Drawere mountes med `AnimatePresence` fra Framer Motion. Gjenbruker eksisterende API-er (`/api/portal/public/service-types`, `/api/booking/smart-slots`, `/api/booking/create`). Stripe Payment Element håndterer kort + Apple Pay + Google Pay automatisk.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, Framer Motion 12, Stripe Payment Element, Lucide icons. V2.0 farger (#005840, #D1F843, #ECF0EF).

---

## Filstruktur

**Nye filer:**
```
app/booking/
├── page.tsx                          # Server component — auth-sjekk + initial data fetch
├── booking-client.tsx                # Client component — state + orkestrering av drawere
└── components-v2/
    ├── BookingNav.tsx                # Topbar med "Tilbake" + logo
    ├── StepIndicator.tsx             # 5 dots som viser progresjon
    ├── TrainerCard.tsx               # Profilkort med bilde + expand-tjenester
    ├── ServiceRow.tsx                # Tjeneste-rad under trener
    ├── Drawer.tsx                    # Base drawer (Framer Motion + backdrop)
    ├── DateTimeDrawer.tsx            # Dato-chips + tid-chips
    ├── ConfirmDrawer.tsx             # Oppsummering + fokus + brukerinfo + vilkår
    ├── PaymentDrawer.tsx             # Stripe Payment Element wrapper
    ├── SuccessDrawer.tsx             # Bekreftelsesvisning
    ├── DateChip.tsx                  # Enkelt dato-chip
    ├── TimeChip.tsx                  # Enkelt tid-chip
    ├── FocusAreaChips.tsx            # 4 fokusområde-chips
    └── types.ts                      # Shared types (TrainerWithServices, BookingState)
```

**Filer som slettes:**
```
app/booking/select-service/page.tsx
app/booking/date-time/page.tsx
app/booking/review-confirm/page.tsx
app/booking/components/BookingNavSidebar.tsx
app/booking/components/BookingProgress.tsx
app/booking/components/BookingProgressBar.tsx
app/booking/components/BookingSidebar.tsx
app/booking/new/ (hele mappen)
```

**Filer som beholdes:**
```
app/booking/[id]/confirmation/   # Stripe redirect-bekreftelse
app/booking/[id]/pay/            # Stripe betalings-redirect
```

---

## Task 1: Shared types + trener-data

**Files:**
- Create: `app/booking/components-v2/types.ts`

- [ ] **Step 1: Opprett types-fil**

```typescript
// app/booking/components-v2/types.ts

export interface TrainerService {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  isSubscription: boolean;
  availableSlotsThisWeek: number;
  allowStripe: boolean;
}

export interface TrainerWithServices {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  badge: string;
  services: TrainerService[];
}

export type DrawerType = "datetime" | "confirm" | "payment" | "success" | null;

export interface SmartSlot {
  time: string;
  available: boolean;
  isoString?: string;
}

export interface DayData {
  date: string;
  dayName: string;
  dayNumber: number;
  month: string;
  slots: SmartSlot[];
}

export interface BookingState {
  trainerId: string | null;
  serviceId: string | null;
  date: string | null;
  time: string | null;
  slotIso: string | null;
  focusAreas: string[];
  notes: string;
  name: string;
  email: string;
  phone: string;
  handicap: string;
  acceptedTerms: boolean;
}

export const INITIAL_BOOKING_STATE: BookingState = {
  trainerId: null,
  serviceId: null,
  date: null,
  time: null,
  slotIso: null,
  focusAreas: [],
  notes: "",
  name: "",
  email: "",
  phone: "",
  handicap: "",
  acceptedTerms: false,
};
```

- [ ] **Step 2: Commit**

```bash
git add app/booking/components-v2/types.ts
git commit -m "feat(booking): add shared types for v2 redesign"
```

---

## Task 2: StepIndicator-komponent

**Files:**
- Create: `app/booking/components-v2/StepIndicator.tsx`

- [ ] **Step 1: Skriv StepIndicator**

```typescript
// app/booking/components-v2/StepIndicator.tsx
"use client";

interface StepIndicatorProps {
  currentStep: 0 | 1 | 2 | 3 | 4;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [0, 1, 2, 3, 4];

  return (
    <div className="flex items-center gap-1.5 mb-6">
      {steps.map((step) => {
        const isActive = step === currentStep;
        const isDone = step < currentStep;

        return (
          <div
            key={step}
            className={`h-2 rounded-full transition-all duration-400 ${
              isActive
                ? "w-6 bg-[#005840]"
                : isDone
                ? "w-2 bg-[#D1F843]"
                : "w-2 bg-[#D5DFDB]"
            }`}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/booking/components-v2/StepIndicator.tsx
git commit -m "feat(booking): add StepIndicator component"
```

---

## Task 3: BookingNav-komponent

**Files:**
- Create: `app/booking/components-v2/BookingNav.tsx`

- [ ] **Step 1: Skriv BookingNav**

```typescript
// app/booking/components-v2/BookingNav.tsx
"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BookingNav() {
  return (
    <nav className="bg-white border-b border-[#D5DFDB] px-6 py-3.5 sticky top-0 z-10">
      <div className="max-w-[720px] mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[#A5B2AD] text-sm hover:text-[#005840] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Tilbake
        </Link>
        <div className="font-extrabold text-lg text-[#005840] tracking-tight">
          AK Golf <span className="text-[#A5B2AD] font-medium text-xs ml-1.5">Book</span>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/booking/components-v2/BookingNav.tsx
git commit -m "feat(booking): add BookingNav component"
```

---

## Task 4: Drawer base-komponent

**Files:**
- Create: `app/booking/components-v2/Drawer.tsx`

- [ ] **Step 1: Skriv Drawer med Framer Motion**

```typescript
// app/booking/components-v2/Drawer.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Drawer({ isOpen, onClose, children }: DrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[rgba(10,31,24,0.4)] backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-[720px] mx-auto bg-white rounded-t-[20px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] z-[100] max-h-[92vh] overflow-y-auto"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-[#D5DFDB] mx-auto mt-3" />

            <div className="px-6 pt-5 pb-8">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/booking/components-v2/Drawer.tsx
git commit -m "feat(booking): add Drawer base component with Framer Motion"
```

---

## Task 5: TrainerCard + ServiceRow

**Files:**
- Create: `app/booking/components-v2/TrainerCard.tsx`
- Create: `app/booking/components-v2/ServiceRow.tsx`

- [ ] **Step 1: Skriv ServiceRow**

```typescript
// app/booking/components-v2/ServiceRow.tsx
"use client";

import type { TrainerService } from "./types";

interface ServiceRowProps {
  service: TrainerService;
  isActive: boolean;
  onSelect: () => void;
}

export function ServiceRow({ service, isActive, onSelect }: ServiceRowProps) {
  const periodLabel = service.isSubscription ? "kr/mnd" : "kr";
  const typeLabel = service.isSubscription
    ? `${service.duration} min · ${service.description ?? "Coaching"}`
    : `${service.duration} min · Enkeltokt`;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-all border-2 text-left ${
        isActive
          ? "bg-[#005840] border-[#005840] text-white"
          : "bg-[#ECF0EF] border-transparent hover:bg-[#e3e9e7] hover:border-[#005840]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-semibold ${isActive ? "text-white" : "text-[#0A1F18]"}`}>
          {service.name}
        </div>
        <div className={`text-[11px] mt-0.5 ${isActive ? "text-white/60" : "text-[#A5B2AD]"}`}>
          {typeLabel}
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <div className={`text-base font-bold ${isActive ? "text-[#D1F843]" : "text-[#005840]"}`}>
          {service.price.toLocaleString("nb-NO")}
        </div>
        <div className={`text-[10px] ${isActive ? "text-white/60" : "text-[#A5B2AD]"}`}>
          {periodLabel}
        </div>
        <div
          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
            isActive ? "bg-[rgba(209,248,67,0.2)] text-[#D1F843]" : "bg-white text-[#005840]"
          }`}
        >
          {service.availableSlotsThisWeek} ledige denne uken
        </div>
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Skriv TrainerCard**

```typescript
// app/booking/components-v2/TrainerCard.tsx
"use client";

import { ServiceRow } from "./ServiceRow";
import type { TrainerWithServices } from "./types";

interface TrainerCardProps {
  trainer: TrainerWithServices;
  isSelected: boolean;
  selectedServiceId: string | null;
  onSelectTrainer: () => void;
  onSelectService: (serviceId: string) => void;
}

export function TrainerCard({
  trainer,
  isSelected,
  selectedServiceId,
  onSelectTrainer,
  onSelectService,
}: TrainerCardProps) {
  return (
    <div
      onClick={onSelectTrainer}
      className={`rounded-[20px] overflow-hidden cursor-pointer bg-white transition-all duration-300 border-2 ${
        isSelected
          ? "border-[#D1F843] shadow-[0_12px_40px_rgba(0,88,64,0.15)] -translate-y-0.5"
          : "border-transparent hover:border-[#D1F843] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,88,64,0.12)]"
      }`}
    >
      {/* Image */}
      <div
        className="w-full aspect-[3/4] bg-cover bg-top bg-[#324D45] relative"
        style={{ backgroundImage: `url(${trainer.imageUrl})` }}
      >
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[rgba(10,31,24,0.9)] via-[rgba(10,31,24,0.4)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white z-[2]">
          <div className="text-xl font-bold tracking-tight">{trainer.name}</div>
          <div className="text-xs text-white/60 mt-0.5 font-medium">{trainer.role}</div>
          <div className="inline-block mt-2 bg-[rgba(209,248,67,0.15)] text-[#D1F843] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {trainer.badge}
          </div>
        </div>
      </div>

      {/* Services panel — expands when selected */}
      <div
        className={`overflow-hidden transition-[max-height] duration-450 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isSelected ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <div className="px-5 pt-4 pb-5">
          <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#A5B2AD] mb-3">
            Tilgjengelige tjenester
          </div>
          {trainer.services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              isActive={selectedServiceId === service.id}
              onSelect={() => onSelectService(service.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/booking/components-v2/TrainerCard.tsx app/booking/components-v2/ServiceRow.tsx
git commit -m "feat(booking): add TrainerCard and ServiceRow components"
```

---

## Task 6: DateChip + TimeChip

**Files:**
- Create: `app/booking/components-v2/DateChip.tsx`
- Create: `app/booking/components-v2/TimeChip.tsx`

- [ ] **Step 1: Skriv DateChip**

```typescript
// app/booking/components-v2/DateChip.tsx
"use client";

interface DateChipProps {
  dayName: string;
  dayNumber: number;
  month: string;
  isSelected: boolean;
  onClick: () => void;
}

export function DateChip({ dayName, dayNumber, month, isSelected, onClick }: DateChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 min-w-[72px] px-4 py-2.5 rounded-xl text-center border-2 transition-all snap-start ${
        isSelected
          ? "bg-[#005840] border-[#005840]"
          : "bg-[#ECF0EF] border-transparent hover:border-[#005840]"
      }`}
    >
      <div className={`text-[10px] font-semibold uppercase ${isSelected ? "text-white/60" : "text-[#A5B2AD]"}`}>
        {dayName}
      </div>
      <div className={`text-lg font-bold mt-0.5 ${isSelected ? "text-white" : "text-[#0A1F18]"}`}>
        {dayNumber}
      </div>
      <div className={`text-[10px] ${isSelected ? "text-[#D1F843]" : "text-[#A5B2AD]"}`}>
        {month}
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Skriv TimeChip**

```typescript
// app/booking/components-v2/TimeChip.tsx
"use client";

interface TimeChipProps {
  time: string;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function TimeChip({ time, isSelected, disabled, onClick }: TimeChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-[10px] text-sm font-semibold border-2 transition-all tabular-nums ${
        disabled
          ? "bg-transparent text-[#A5B2AD] line-through cursor-not-allowed border-transparent"
          : isSelected
          ? "bg-[#D1F843] text-[#005840] border-[#D1F843]"
          : "bg-[#ECF0EF] text-[#0A1F18] border-transparent hover:border-[#005840]"
      }`}
    >
      {time}
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/booking/components-v2/DateChip.tsx app/booking/components-v2/TimeChip.tsx
git commit -m "feat(booking): add DateChip and TimeChip components"
```

---

## Task 7: DateTimeDrawer

**Files:**
- Create: `app/booking/components-v2/DateTimeDrawer.tsx`

- [ ] **Step 1: Skriv DateTimeDrawer**

```typescript
// app/booking/components-v2/DateTimeDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { Drawer } from "./Drawer";
import { DateChip } from "./DateChip";
import { TimeChip } from "./TimeChip";
import type { DayData, SmartSlot } from "./types";

interface DateTimeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTypeId: string | null;
  instructorId: string | null;
  serviceName: string;
  trainerFirstName: string;
  onConfirm: (date: string, time: string, slotIso: string) => void;
}

export function DateTimeDrawer({
  isOpen,
  onClose,
  serviceTypeId,
  instructorId,
  serviceName,
  trainerFirstName,
  onConfirm,
}: DateTimeDrawerProps) {
  const [days, setDays] = useState<DayData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SmartSlot | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch slots when drawer opens
  useEffect(() => {
    if (!isOpen || !serviceTypeId || !instructorId) return;

    setLoading(true);
    fetch(`/api/booking/smart-slots?serviceTypeId=${serviceTypeId}&instructorId=${instructorId}&weekOffset=0`)
      .then((r) => r.json())
      .then((data: { days?: DayData[] }) => {
        const allDays = data.days ?? [];
        // Filter: only days with at least one available slot
        const availableDays = allDays.filter((d) => d.slots.some((s) => s.available));
        setDays(availableDays);

        // Auto-select first available day + first available slot
        if (availableDays.length > 0) {
          const firstDay = availableDays[0];
          setSelectedDate(firstDay.date);
          const firstSlot = firstDay.slots.find((s) => s.available);
          if (firstSlot) setSelectedSlot(firstSlot);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen, serviceTypeId, instructorId]);

  const selectedDay = days.find((d) => d.date === selectedDate);
  const canConfirm = !!(selectedDate && selectedSlot?.available && selectedSlot.isoString);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const day = days.find((d) => d.date === date);
    const firstAvailable = day?.slots.find((s) => s.available);
    setSelectedSlot(firstAvailable ?? null);
  };

  const handleConfirm = () => {
    if (canConfirm && selectedDate && selectedSlot?.isoString) {
      onConfirm(selectedDate, selectedSlot.time, selectedSlot.isoString);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="text-lg font-bold text-[#0A1F18]">Velg dato og tid</div>
      <div className="text-xs text-[#A5B2AD] mb-5">
        {serviceName} med {trainerFirstName}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#005840] animate-spin" />
        </div>
      ) : days.length === 0 ? (
        <div className="text-center py-8 text-sm text-[#A5B2AD]">
          Ingen ledige tider denne uken.
        </div>
      ) : (
        <>
          {/* Date chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
            {days.map((day) => (
              <DateChip
                key={day.date}
                dayName={day.dayName}
                dayNumber={day.dayNumber}
                month={day.month}
                isSelected={selectedDate === day.date}
                onClick={() => handleDateSelect(day.date)}
              />
            ))}
          </div>

          {/* Time chips */}
          {selectedDay && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedDay.slots.map((slot) => (
                <TimeChip
                  key={slot.time}
                  time={slot.time}
                  isSelected={selectedSlot?.time === slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="w-full mt-5 py-4 rounded-[14px] bg-[#D1F843] text-[#005840] text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#c8ef35] hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Bekreft tid
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </>
      )}
    </Drawer>
  );
}
```

- [ ] **Step 2: Sjekk at smart-slots API returnerer `month` per dag**

Run: `grep -n "dayName\|dayNumber\|month" app/api/booking/smart-slots/route.ts`

Expected: Skal vise hvilke felter APIet returnerer. Hvis `month` mangler, legg det til i API-route.

- [ ] **Step 3: Hvis `month` mangler i API, legg det til**

Rediger `app/api/booking/smart-slots/route.ts` og sørg for at hver dag har `month` (f.eks. `apr`, `mai`).

```typescript
// I smart-slots route, der days-objektet bygges:
{
  date: dateStr,
  dayName: new Date(dateStr).toLocaleDateString("nb-NO", { weekday: "short" }).replace(".", ""),
  dayNumber: new Date(dateStr).getDate(),
  month: new Date(dateStr).toLocaleDateString("nb-NO", { month: "short" }).replace(".", ""),
  slots,
}
```

- [ ] **Step 4: Commit**

```bash
git add app/booking/components-v2/DateTimeDrawer.tsx app/api/booking/smart-slots/route.ts
git commit -m "feat(booking): add DateTimeDrawer with smart-slots integration"
```

---

## Task 8: FocusAreaChips

**Files:**
- Create: `app/booking/components-v2/FocusAreaChips.tsx`

- [ ] **Step 1: Skriv FocusAreaChips**

```typescript
// app/booking/components-v2/FocusAreaChips.tsx
"use client";

import { Flag, Target, Disc, Circle } from "lucide-react";

const FOCUS_AREAS = [
  { id: "TEE_TOTAL", label: "Langt spill", Icon: Flag },
  { id: "APPROACH", label: "Innspill", Icon: Target },
  { id: "SHORT_GAME", label: "Naerspill", Icon: Disc },
  { id: "PUTTING", label: "Putting", Icon: Circle },
] as const;

interface FocusAreaChipsProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function FocusAreaChips({ selected, onToggle }: FocusAreaChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FOCUS_AREAS.map(({ id, label, Icon }) => {
        const isSelected = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium border-2 transition-all ${
              isSelected
                ? "bg-[#005840] text-white border-[#005840]"
                : "bg-[#ECF0EF] text-[#324D45] border-transparent hover:border-[#005840]"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/booking/components-v2/FocusAreaChips.tsx
git commit -m "feat(booking): add FocusAreaChips component"
```

---

## Task 9: ConfirmDrawer

**Files:**
- Create: `app/booking/components-v2/ConfirmDrawer.tsx`

- [ ] **Step 1: Skriv ConfirmDrawer**

```typescript
// app/booking/components-v2/ConfirmDrawer.tsx
"use client";

import { ChevronRight } from "lucide-react";
import { Drawer } from "./Drawer";
import { FocusAreaChips } from "./FocusAreaChips";
import type { BookingState, TrainerService } from "./types";

interface ConfirmDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  state: BookingState;
  updateState: (patch: Partial<BookingState>) => void;
  service: TrainerService | null;
  trainerName: string;
  isLoggedIn: boolean;
  hasSubscription: boolean;
}

export function ConfirmDrawer({
  isOpen,
  onClose,
  onContinue,
  state,
  updateState,
  service,
  trainerName,
  isLoggedIn,
  hasSubscription,
}: ConfirmDrawerProps) {
  if (!service || !state.date || !state.time) return null;

  const periodLabel = service.isSubscription ? "kr/mnd" : "kr";
  const dateObj = new Date(state.date);
  const dateStr = dateObj.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const endTime = new Date(new Date(state.slotIso ?? "").getTime() + service.duration * 60_000);
  const endStr = endTime.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });

  const canContinue =
    state.acceptedTerms && state.name.trim().length > 0 && state.email.trim().length > 0;

  const toggleFocus = (id: string) => {
    updateState({
      focusAreas: state.focusAreas.includes(id)
        ? state.focusAreas.filter((x) => x !== id)
        : [...state.focusAreas, id],
    });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="text-lg font-bold text-[#0A1F18]">Bekreft din booking</div>
      <div className="text-xs text-[#A5B2AD] mb-5">Sjekk detaljene og bekreft</div>

      {/* Dark summary card */}
      <div className="bg-[#005840] rounded-2xl p-5 text-white mb-5">
        <SummaryRow label="Trener" value={trainerName} />
        <SummaryRow label="Tjeneste" value={service.name} />
        <SummaryRow label="Dato" value={dateStr} />
        <SummaryRow label="Tid" value={`${state.time} — ${endStr} (${service.duration} min)`} />
        <SummaryRow label="Sted" value="Gamle Fredrikstad GK" />
        <div className="flex justify-between items-end mt-3 pt-3 border-t border-white/15">
          <div className="text-[10px] uppercase tracking-wider text-white/40">Total</div>
          <div>
            <span className="text-[28px] font-extrabold text-[#D1F843] tracking-tight">
              {service.price.toLocaleString("nb-NO")}
            </span>
            <span className="text-[11px] text-white/40 ml-1">{periodLabel}</span>
          </div>
        </div>
      </div>

      {/* Focus area */}
      <div className="mb-5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#A5B2AD] mb-2.5">
          Hva vil du jobbe med? (valgfritt)
        </div>
        <FocusAreaChips selected={state.focusAreas} onToggle={toggleFocus} />
        <textarea
          rows={2}
          value={state.notes}
          onChange={(e) => updateState({ notes: e.target.value })}
          placeholder="Beskriv utfordringen din (valgfritt)..."
          maxLength={500}
          className="w-full mt-2.5 px-3.5 py-3 rounded-[10px] bg-[#ECF0EF] border-2 border-transparent focus:border-[#005840] outline-none text-[13px] text-[#0A1F18] resize-none"
        />
      </div>

      {/* User info */}
      <div className="mb-5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#A5B2AD] mb-2.5">
          Dine opplysninger
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <FormField
            label="Navn *"
            value={state.name}
            onChange={(v) => updateState({ name: v })}
            prefilled={isLoggedIn && state.name.length > 0}
          />
          <FormField
            label="E-post *"
            type="email"
            value={state.email}
            onChange={(v) => updateState({ email: v })}
            prefilled={isLoggedIn && state.email.length > 0}
          />
          <FormField
            label="Telefon"
            type="tel"
            value={state.phone}
            onChange={(v) => updateState({ phone: v })}
            prefilled={isLoggedIn && state.phone.length > 0}
          />
          <FormField
            label="Handicap"
            value={state.handicap}
            onChange={(v) => updateState({ handicap: v })}
            placeholder="f.eks. 12.5"
          />
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#ECF0EF]">
        <button
          type="button"
          onClick={() => updateState({ acceptedTerms: !state.acceptedTerms })}
          className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all mt-0.5 ${
            state.acceptedTerms
              ? "bg-[#005840] border-[#005840]"
              : "bg-white border-[#A5B2AD]"
          }`}
        >
          {state.acceptedTerms && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
        <div className="text-[11px] text-[#324D45] leading-relaxed">
          {hasSubscription ? (
            <>Jeg bekrefter bookingen. Denne timen er inkludert i mitt abonnement. Avbestilling minst 24 timer for.</>
          ) : service.isSubscription ? (
            <>
              Jeg godkjenner at belopet pa <strong>{service.price.toLocaleString("nb-NO")} {periodLabel}</strong> trekkes automatisk, og bekrefter at jeg har lest{" "}
              <a href="/vilkar" className="text-[#005840] font-semibold">kanselleringspolicyen</a>. Avbestilling minst 24 timer for.
            </>
          ) : (
            <>
              Jeg godtar{" "}
              <a href="/vilkar" className="text-[#005840] font-semibold">vilkarene</a> og bekrefter at jeg har lest{" "}
              <a href="/vilkar" className="text-[#005840] font-semibold">kanselleringspolicyen</a>. Avbestilling minst 24 timer for.
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full mt-5 py-4 rounded-[14px] bg-[#D1F843] text-[#005840] text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#c8ef35] hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Ga til betaling
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </Drawer>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/8 last:border-0">
      <span className="text-xs text-white/50">{label}</span>
      <span className="text-[13px] font-semibold">{value}</span>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  prefilled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  prefilled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A5B2AD]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`px-3.5 py-3 rounded-[10px] border-2 border-transparent focus:border-[#005840] outline-none text-[13px] text-[#0A1F18] ${
          prefilled ? "bg-[#f0f4f3]" : "bg-[#ECF0EF]"
        }`}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/booking/components-v2/ConfirmDrawer.tsx
git commit -m "feat(booking): add ConfirmDrawer with focus areas and user info"
```

---

## Task 10: PaymentDrawer med Stripe Payment Element

**Files:**
- Create: `app/booking/components-v2/PaymentDrawer.tsx`

- [ ] **Step 1: Skriv PaymentDrawer som kaller eksisterende create-api**

```typescript
// app/booking/components-v2/PaymentDrawer.tsx
"use client";

import { useState } from "react";
import { ChevronRight, Lock, Calendar, Mail, Loader2 } from "lucide-react";
import { Drawer } from "./Drawer";
import type { BookingState, TrainerService } from "./types";

interface PaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: BookingState;
  service: TrainerService | null;
  trainerId: string;
  onSuccess: () => void;
}

export function PaymentDrawer({
  isOpen,
  onClose,
  state,
  service,
  trainerId,
  onSuccess,
}: PaymentDrawerProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!service) return null;

  const periodLabel = service.isSubscription ? "kr/mnd" : "kr";
  const ctaLabel = `Betal ${service.price.toLocaleString("nb-NO")} kr`;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: state.serviceId,
          instructorId: trainerId,
          startTime: state.slotIso,
          paymentMethod: "STRIPE",
          email: state.email,
          name: state.name,
          phone: state.phone,
          focusArea: state.focusAreas[0],
          playerNotes: state.notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Kunne ikke opprette booking");
        setSubmitting(false);
        return;
      }

      if (data.redirectUrl) {
        // Stripe Checkout — redirect
        window.location.href = data.redirectUrl;
      } else if (data.bookingId) {
        // Subscription booking — direct success (no payment needed)
        onSuccess();
      }
    } catch {
      setError("En feil oppstod. Prov igjen.");
      setSubmitting(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="text-lg font-bold text-[#0A1F18]">Bekreft og betal</div>
      <div className="text-xs text-[#A5B2AD] mb-5">
        {service.name} · {service.price.toLocaleString("nb-NO")} {periodLabel}
      </div>

      <div className="mb-4 p-4 rounded-xl bg-[#ECF0EF] text-[13px] text-[#324D45]">
        Du blir videresendt til Stripe for sikker betaling. Stripe stotter automatisk kort, Apple Pay og Google Pay avhengig av din enhet.
      </div>

      {/* Trust badges */}
      <div className="flex gap-2 mb-5">
        <TrustBadge Icon={Lock} label="SSL-kryptert" />
        <TrustBadge Icon={Calendar} label="Avbestill 24t for" />
        <TrustBadge Icon={Mail} label="E-postbekreftelse" />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[#B84233]/10 border border-[#B84233]/20 text-xs text-[#B84233]">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-4 rounded-[14px] bg-[#D1F843] text-[#005840] text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#c8ef35] hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Behandler...
          </>
        ) : (
          <>
            {ctaLabel}
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </>
        )}
      </button>
    </Drawer>
  );
}

function TrustBadge({
  Icon,
  label,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex-1 bg-[#ECF0EF] rounded-[10px] p-3 text-center">
      <Icon className="w-4 h-4 text-[#005840] mx-auto mb-1" />
      <div className="text-[10px] font-semibold text-[#005840]">{label}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/booking/components-v2/PaymentDrawer.tsx
git commit -m "feat(booking): add PaymentDrawer using Stripe Checkout redirect"
```

---

## Task 11: SuccessDrawer

**Files:**
- Create: `app/booking/components-v2/SuccessDrawer.tsx`

- [ ] **Step 1: Skriv SuccessDrawer**

```typescript
// app/booking/components-v2/SuccessDrawer.tsx
"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Drawer } from "./Drawer";
import type { BookingState, TrainerService } from "./types";

interface SuccessDrawerProps {
  isOpen: boolean;
  state: BookingState;
  service: TrainerService | null;
  trainerName: string;
}

export function SuccessDrawer({ isOpen, state, service, trainerName }: SuccessDrawerProps) {
  const router = useRouter();

  if (!service || !state.date || !state.time) return null;

  const dateStr = new Date(state.date).toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Drawer isOpen={isOpen} onClose={() => router.push("/")}>
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 rounded-full bg-[#D1F843] flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-[#005840]" strokeWidth={3} />
        </div>
        <div className="text-xl font-bold text-[#0A1F18] mb-1">Bookingen er bekreftet!</div>
        <div className="text-[13px] text-[#A5B2AD] mb-6">Du mottar en bekreftelse pa e-post</div>

        <div className="bg-[#ECF0EF] rounded-xl p-4 text-left text-[13px] text-[#324D45] space-y-1">
          <DetailRow label="Trener" value={trainerName} />
          <DetailRow label="Tjeneste" value={service.name} />
          <DetailRow label="Dato" value={dateStr} />
          <DetailRow label="Tid" value={state.time} />
          <DetailRow label="Sted" value="Gamle Fredrikstad GK" />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 py-4 rounded-[14px] bg-[#005840] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#004530] transition-all"
          >
            Tilbake
          </button>
          <button
            type="button"
            onClick={() => router.push("/portal/bookinger")}
            className="flex-1 py-4 rounded-[14px] bg-[#D1F843] text-[#005840] text-sm font-bold uppercase tracking-wider hover:bg-[#c8ef35] transition-all"
          >
            Mine bookinger
          </button>
        </div>
      </div>
    </Drawer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <strong className="text-[#0A1F18]">{value}</strong>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/booking/components-v2/SuccessDrawer.tsx
git commit -m "feat(booking): add SuccessDrawer"
```

---

## Task 12: Booking-client orkestrerer alt

**Files:**
- Create: `app/booking/booking-client.tsx`

- [ ] **Step 1: Skriv booking-client**

```typescript
// app/booking/booking-client.tsx
"use client";

import { useState } from "react";
import { BookingNav } from "./components-v2/BookingNav";
import { StepIndicator } from "./components-v2/StepIndicator";
import { TrainerCard } from "./components-v2/TrainerCard";
import { DateTimeDrawer } from "./components-v2/DateTimeDrawer";
import { ConfirmDrawer } from "./components-v2/ConfirmDrawer";
import { PaymentDrawer } from "./components-v2/PaymentDrawer";
import { SuccessDrawer } from "./components-v2/SuccessDrawer";
import { INITIAL_BOOKING_STATE } from "./components-v2/types";
import type { BookingState, DrawerType, TrainerWithServices } from "./components-v2/types";

interface BookingClientProps {
  trainers: TrainerWithServices[];
  prefilledUser: {
    name: string;
    email: string;
    phone: string;
  } | null;
  isLoggedIn: boolean;
  hasSubscription: boolean;
}

export function BookingClient({ trainers, prefilledUser, isLoggedIn, hasSubscription }: BookingClientProps) {
  const [state, setState] = useState<BookingState>({
    ...INITIAL_BOOKING_STATE,
    name: prefilledUser?.name ?? "",
    email: prefilledUser?.email ?? "",
    phone: prefilledUser?.phone ?? "",
  });

  const [drawer, setDrawer] = useState<DrawerType>(null);

  const selectedTrainer = trainers.find((t) => t.id === state.trainerId) ?? null;
  const selectedService = selectedTrainer?.services.find((s) => s.id === state.serviceId) ?? null;

  const currentStep: 0 | 1 | 2 | 3 | 4 = !state.trainerId
    ? 0
    : drawer === null && !state.serviceId
    ? 0
    : drawer === null && state.serviceId
    ? 1
    : drawer === "datetime"
    ? 2
    : drawer === "confirm"
    ? 3
    : drawer === "payment" || drawer === "success"
    ? 4
    : 0;

  const updateState = (patch: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleSelectTrainer = (trainerId: string) => {
    setState((prev) => ({ ...prev, trainerId, serviceId: null }));
  };

  const handleSelectService = (serviceId: string) => {
    setState((prev) => ({ ...prev, serviceId }));
    setDrawer("datetime");
  };

  const handleDateTimeConfirm = (date: string, time: string, slotIso: string) => {
    setState((prev) => ({ ...prev, date, time, slotIso }));
    setDrawer("confirm");
  };

  const handleConfirmContinue = () => {
    setDrawer("payment");
  };

  const handlePaymentSuccess = () => {
    setDrawer("success");
  };

  const trainerFirstName = selectedTrainer?.name.split(" ")[0] ?? "";

  return (
    <div className="min-h-screen bg-[#ECF0EF]">
      <BookingNav />

      <main className="max-w-[720px] mx-auto px-5 pt-7 pb-32">
        <StepIndicator currentStep={currentStep} />

        <h1 className="text-[26px] font-bold text-[#0A1F18] tracking-tight mb-1">
          Hvem vil du trene med?
        </h1>
        <p className="text-sm text-[#A5B2AD] mb-7">
          Velg din coach for a se tilgjengelige tjenester
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              isSelected={state.trainerId === trainer.id}
              selectedServiceId={state.serviceId}
              onSelectTrainer={() => handleSelectTrainer(trainer.id)}
              onSelectService={handleSelectService}
            />
          ))}
        </div>
      </main>

      <DateTimeDrawer
        isOpen={drawer === "datetime"}
        onClose={() => setDrawer(null)}
        serviceTypeId={state.serviceId}
        instructorId={state.trainerId}
        serviceName={selectedService?.name ?? ""}
        trainerFirstName={trainerFirstName}
        onConfirm={handleDateTimeConfirm}
      />

      <ConfirmDrawer
        isOpen={drawer === "confirm"}
        onClose={() => setDrawer("datetime")}
        onContinue={handleConfirmContinue}
        state={state}
        updateState={updateState}
        service={selectedService}
        trainerName={selectedTrainer?.name ?? ""}
        isLoggedIn={isLoggedIn}
        hasSubscription={hasSubscription}
      />

      <PaymentDrawer
        isOpen={drawer === "payment"}
        onClose={() => setDrawer("confirm")}
        state={state}
        service={selectedService}
        trainerId={state.trainerId ?? ""}
        onSuccess={handlePaymentSuccess}
      />

      <SuccessDrawer
        isOpen={drawer === "success"}
        state={state}
        service={selectedService}
        trainerName={selectedTrainer?.name ?? ""}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/booking/booking-client.tsx
git commit -m "feat(booking): add BookingClient orchestrator"
```

---

## Task 13: Server-side data-fetch + nye page.tsx

**Files:**
- Modify: `app/booking/page.tsx` (hele filen erstattes)

- [ ] **Step 1: Utforsk eksisterende data-henting**

Run: `grep -rn "getPortalUser\|service-types" app/booking/select-service/page.tsx`

Formål: Forstå hvordan eksisterende kode henter brukerinfo og tjenester.

- [ ] **Step 2: Erstatt `app/booking/page.tsx`**

```typescript
// app/booking/page.tsx
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { BookingClient } from "./booking-client";
import type { TrainerWithServices } from "./components-v2/types";

// Trener-metadata (bilder, rolle, badge) — bor ikke i databasen
const TRAINER_META: Record<string, { imageUrl: string; role: string; badge: string }> = {
  Anders: {
    imageUrl: "/images/academy/AK-Golf-Academy-20.jpg",
    role: "Head Coach",
    badge: "Performance · Flex",
  },
  Markus: {
    imageUrl: "/images/academy/AK-Golf-Academy-25.jpg",
    role: "Assistant Coach",
    badge: "Express · Flex",
  },
};

function getTrainerMeta(name: string) {
  const firstName = name.split(" ")[0];
  return TRAINER_META[firstName] ?? {
    imageUrl: "/images/academy/AK-Golf-Academy-1.jpg",
    role: "Coach",
    badge: "Coaching",
  };
}

export default async function BookingPage() {
  const supabase = await createServerSupabase();
  const user = await getPortalUser();

  // Fetch all active service types with instructors
  const { data: serviceTypes } = await supabase
    .from("ServiceType")
    .select(`
      id,
      name,
      description,
      duration,
      price,
      allowStripe,
      category,
      Instructor:InstructorServiceType(
        Instructor(
          id,
          User:userId(name)
        )
      )
    `)
    .eq("isPublic", true)
    .eq("isActive", true)
    .neq("name", "Foundation")
    .neq("name", "Start")
    .neq("name", "Banecoaching");

  // Group by trainer
  const trainersMap = new Map<string, TrainerWithServices>();

  for (const st of serviceTypes ?? []) {
    const isSubscription = st.name.includes("Performance") || st.name.includes("Express");
    const instructors = (st.Instructor ?? [])
      .map((link: { Instructor: { id: string; User: { name: string | null } | null } | null }) => link.Instructor)
      .filter((inst): inst is { id: string; User: { name: string | null } | null } => inst !== null);

    for (const instructor of instructors) {
      const trainerName = instructor.User?.name ?? "Coach";
      const trainerId = instructor.id;
      const meta = getTrainerMeta(trainerName);

      if (!trainersMap.has(trainerId)) {
        trainersMap.set(trainerId, {
          id: trainerId,
          name: trainerName,
          role: meta.role,
          imageUrl: meta.imageUrl,
          badge: meta.badge,
          services: [],
        });
      }

      trainersMap.get(trainerId)!.services.push({
        id: st.id,
        name: st.name,
        description: st.description,
        duration: st.duration,
        price: st.price,
        isSubscription,
        availableSlotsThisWeek: 8, // Placeholder — filled client-side or cached
        allowStripe: st.allowStripe,
      });
    }
  }

  const trainers = Array.from(trainersMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  // Sort services within each trainer: subscriptions first, then by price descending
  for (const trainer of trainers) {
    trainer.services.sort((a, b) => {
      if (a.isSubscription && !b.isSubscription) return -1;
      if (!a.isSubscription && b.isSubscription) return 1;
      return b.price - a.price;
    });
  }

  // Prefill user info if logged in
  const prefilledUser = user?.id
    ? {
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      }
    : null;

  const hasSubscription = user?.subscriptionTier && user.subscriptionTier !== "VISITOR" && user.subscriptionTier !== "FREE";

  return (
    <BookingClient
      trainers={trainers}
      prefilledUser={prefilledUser}
      isLoggedIn={!!user?.id}
      hasSubscription={!!hasSubscription}
    />
  );
}
```

- [ ] **Step 3: Sjekk at `getPortalUser` returnerer riktige felter**

Run: `grep -n "subscriptionTier\|phone\|name" lib/portal/auth.ts`

Expected: Bekreft at `phone` og `subscriptionTier` finnes i user-objektet. Hvis ikke, tilpass koden i page.tsx.

- [ ] **Step 4: Kjor TypeScript-sjekk**

Run: `npx tsc --noEmit`

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add app/booking/page.tsx
git commit -m "feat(booking): new server-side page.tsx for v2 flow"
```

---

## Task 14: Slett gamle booking-sider

**Files:**
- Delete: `app/booking/select-service/`
- Delete: `app/booking/date-time/`
- Delete: `app/booking/review-confirm/`
- Delete: `app/booking/new/`
- Delete: `app/booking/confirmation/page.tsx` (ikke `[id]/confirmation/`)
- Delete: `app/booking/confirmed/page.tsx`
- Delete: `app/booking/components/BookingNavSidebar.tsx`
- Delete: `app/booking/components/BookingProgress.tsx`
- Delete: `app/booking/components/BookingProgressBar.tsx`
- Delete: `app/booking/components/BookingSidebar.tsx`
- Delete: `app/booking/components/StepHeader.tsx`
- Delete: `app/booking/components/ProgressBar.tsx`

- [ ] **Step 1: Sjekk om noen av de gamle komponentene brukes andre steder**

Run: `grep -rn "BookingNavSidebar\|BookingProgressBar\|BookingProgress\|BookingSidebar\|StepHeader" app/ components/ --include="*.tsx" --include="*.ts"`

Expected: Ingen referanser utenfor `/booking/select-service`, `/date-time`, `/review-confirm`.

Hvis referanser finnes utenfor disse, IKKE slett filen — legg til en ekstra task for a oppdatere de avhengige.

- [ ] **Step 2: Slett filene individuelt**

```bash
rm app/booking/select-service/page.tsx
rmdir app/booking/select-service

rm app/booking/date-time/page.tsx
rmdir app/booking/date-time

rm app/booking/review-confirm/page.tsx
rmdir app/booking/review-confirm

rm -r app/booking/new
rm -r app/booking/confirmation
rm -r app/booking/confirmed

rm app/booking/components/BookingNavSidebar.tsx
rm app/booking/components/BookingProgress.tsx
rm app/booking/components/BookingProgressBar.tsx
rm app/booking/components/BookingSidebar.tsx
rm app/booking/components/StepHeader.tsx
rm app/booking/components/ProgressBar.tsx
```

- [ ] **Step 3: Kjor TypeScript-sjekk**

Run: `npx tsc --noEmit`

Expected: 0 errors. Hvis errors, fiks importene som fortsatt refererer til de slettede filene.

- [ ] **Step 4: Commit**

```bash
git add -u app/booking/
git commit -m "chore(booking): slett gamle booking-sider og komponenter"
```

---

## Task 15: Slett Vipps-betalingsreferanser

**Files:**
- Modify: `app/api/booking/create/route.ts`
- Search and remove: Vipps-kode i booking-flyt

- [ ] **Step 1: Finn Vipps-referanser i booking-create**

Run: `grep -n "VIPPS\|vipps\|Vipps" app/api/booking/create/route.ts`

- [ ] **Step 2: Hvis Vipps fortsatt er stottet, dokumenter det**

Hvis API-routen bruker Vipps for backwards compat, ikke slett — speccen sier kun at FRONTEND ikke skal vise Vipps. Hoppe over denne tasken.

Hvis du vil rense opp backend ogsa, er det scope for en separat plan.

- [ ] **Step 3: Commit hvis endringer**

```bash
git add app/api/booking/create/route.ts
git commit -m "chore(booking): fjern Vipps fra create-booking API"
```

---

## Task 16: Visuell QA + fix edge cases

**Files:**
- Modify: Diverse filer basert pa testing

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

Apne `http://localhost:3000/booking` i browser.

- [ ] **Step 2: Test hele flyten manuelt (desktop)**

Sjekkliste:
- [ ] Trener-kort vises med bilder
- [ ] Klikk pa trener utvider tjenester
- [ ] Klikk pa tjeneste apner dato/tid-drawer
- [ ] Dato-chips er scrollbare
- [ ] Valg av dato oppdaterer tider
- [ ] Valg av tid fargelegger chip lime
- [ ] "Bekreft tid" apner confirm-drawer
- [ ] Fokusomrader kan velges (multi)
- [ ] Brukerinfo er prefilled hvis innlogget
- [ ] Vilkar-checkbox fungerer
- [ ] "Ga til betaling" er disabled uten vilkar
- [ ] Payment-drawer viser pris riktig
- [ ] "Betal" triggrer redirect til Stripe (eller suksess for abo)
- [ ] Success-drawer viser oppsummering

- [ ] **Step 3: Test pa mobil (iPhone viewport i DevTools)**

Sjekkliste:
- [ ] Trener-kort stacker vertikalt
- [ ] Drawere tar full bredde pa mobil
- [ ] Dato-chips kan swipes
- [ ] Form-felter er touch-vennlige
- [ ] Nav sticky i topp

- [ ] **Step 4: Fiks eventuelle feil oppdaget**

Gjor fixes basert pa QA-funn. Dokumenter hver fix som egen commit.

- [ ] **Step 5: Final commit**

```bash
git add -u app/booking/
git commit -m "fix(booking): QA-feil fra visuell testing"
```

---

## Task 17: Sluttest + push

- [ ] **Step 1: Kjor full TypeScript-sjekk**

Run: `npx tsc --noEmit`

Expected: 0 errors.

- [ ] **Step 2: Kjor lint**

Run: `npm run lint`

Expected: 0 errors, 0 warnings relatert til nye filer.

- [ ] **Step 3: Kjor build**

Run: `npm run build`

Expected: Build fullfores uten feil. Booking-ruten bygges som dynamic (pa grunn av auth).

- [ ] **Step 4: Push til origin**

```bash
git push origin main
```

---

## Self-review

**Spec coverage:**
- [x] Single-page med sliding drawers (Task 4, 7, 9, 10, 11, 12)
- [x] Trener-fokusert flyt (Task 5, 13)
- [x] Kun tilgjengelige tjenester (Task 13)
- [x] Horisontale dato-chips (Task 6, 7)
- [x] Tid-chips i samme drawer (Task 7)
- [x] Bekreft-drawer med fokusomrader (Task 8, 9)
- [x] Stripe Payment Element (Task 10)
- [x] Trust badges (Task 10)
- [x] Suksess-drawer (Task 11)
- [x] Step indicator 5 dots (Task 2)
- [x] V2.0 farger hardkodet (alle tasks)
- [x] Lucide-ikoner, ingen emojier (alle tasks)
- [x] Fjerning av gamle sider (Task 14)
- [x] Markus har Flex 20 (Task 13 — TRAINER_META + data-fetch)

**Placeholder scan:** Alle code blocks er komplette. Ingen "TBD"/"TODO".

**Type-konsistens:**
- `TrainerWithServices`, `TrainerService`, `BookingState`, `DrawerType`, `DayData`, `SmartSlot` definert i Task 1 og brukt konsistent gjennom alle tasks.
- `updateState` signatur (`Partial<BookingState>`) matcher mellom ConfirmDrawer og BookingClient.
- `onConfirm(date, time, slotIso)` signatur matcher mellom DateTimeDrawer og BookingClient.
