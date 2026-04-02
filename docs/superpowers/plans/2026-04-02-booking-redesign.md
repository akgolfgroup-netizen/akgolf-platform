# Booking Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat service grid with category-first navigation, recommended service highlighting, and quiz wizard.

**Architecture:** Category cards on landing page → drill-down to services → instructor tabs on calendar. Quiz wizard as alternative entry point. Config-based recommended service marking.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Prisma (existing ServiceType model)

**Spec:** `docs/superpowers/specs/2026-04-02-booking-redesign.md`

---

## File Structure

```
lib/
└── booking-config.ts                    # NEW: Category definitions, recommended services

app/booking/
├── page.tsx                             # MODIFY: Category cards (replace service grid)
├── [category]/
│   └── page.tsx                         # NEW: Services in category with recommended highlight
├── veileder/
│   └── page.tsx                         # NEW: Quiz wizard
└── components/
    ├── CategoryCard.tsx                 # NEW: Category card component
    ├── ServiceCard.tsx                  # NEW: Service card (recommended vs standard)
    ├── InstructorTabs.tsx               # NEW: Instructor filter tabs
    ├── QuizWizard.tsx                   # NEW: Quiz wizard component
    └── DateTimePicker.tsx               # MODIFY: Add instructor tabs
```

---

## Task 1: Create Booking Config

**Files:**
- Create: `lib/booking-config.ts`

- [ ] **Step 1: Create booking config file**

```typescript
// lib/booking-config.ts
import { User, Users, Calendar, MapPin } from "lucide-react";

export type BookingCategory = "individuell" | "gruppe" | "abonnement" | "bane";

export interface CategoryConfig {
  slug: BookingCategory;
  name: string;
  description: string;
  priceRange: string;
  icon: typeof User;
  serviceCategories: string[]; // Maps to Prisma ServiceCategory enum
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "abonnement",
    name: "Abonnement",
    description: "Faste økter hver måned",
    priceRange: "Fra 1 600 kr/mnd",
    icon: Calendar,
    serviceCategories: ["SUBSCRIPTION"], // We'll filter by name pattern
  },
  {
    slug: "individuell",
    name: "Individuell",
    description: "En-til-en coaching",
    priceRange: "995 - 2 500 kr",
    icon: User,
    serviceCategories: ["INDIVIDUAL"],
  },
  {
    slug: "gruppe",
    name: "Gruppe",
    description: "Tren sammen med andre",
    priceRange: "250 - 1 700 kr",
    icon: Users,
    serviceCategories: ["GROUP"],
  },
  {
    slug: "bane",
    name: "Banecoaching",
    description: "Coaching på banen",
    priceRange: "500 - 3 000 kr",
    icon: MapPin,
    serviceCategories: ["PLAYING_LESSON"],
  },
];

// Service IDs that are recommended per category
export const RECOMMENDED_SERVICES: Record<BookingCategory, string | null> = {
  individuell: null, // Will match by name "Foundation Test"
  gruppe: null,      // Will match by name "Flex 50 Duo"
  abonnement: null,  // Will match by name "Performance"
  bane: null,        // Will match by name "On-Course Par 3"
};

// Service name patterns to identify recommended
export const RECOMMENDED_PATTERNS: Record<BookingCategory, string> = {
  individuell: "Foundation Test",
  gruppe: "Flex 50 Duo",
  abonnement: "Performance",
  bane: "On-Course Par 3",
};

export function isRecommended(serviceName: string, category: BookingCategory): boolean {
  const pattern = RECOMMENDED_PATTERNS[category];
  return serviceName.toLowerCase().includes(pattern.toLowerCase());
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
```

- [ ] **Step 2: Verify file created**

Run: `cat lib/booking-config.ts | head -20`
Expected: File contents shown

- [ ] **Step 3: Commit**

```bash
git add lib/booking-config.ts
git commit -m "feat(booking): add booking config with categories and recommended patterns"
```

---

## Task 2: Create CategoryCard Component

**Files:**
- Create: `app/booking/components/CategoryCard.tsx`

- [ ] **Step 1: Create CategoryCard component**

```typescript
// app/booking/components/CategoryCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CategoryConfig } from "@/lib/booking-config";

interface Props {
  category: CategoryConfig;
  index: number;
}

export function CategoryCard({ category, index }: Props) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/booking/${category.slug}`}
        className="group flex flex-col h-full bg-white rounded-[20px] p-6 border border-grey-200 hover:border-grey-300 hover:shadow-lg transition-all duration-300"
      >
        <div className="w-12 h-12 rounded-xl bg-grey-100 flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
          <Icon
            size={24}
            className="text-grey-500 group-hover:text-white transition-colors"
          />
        </div>

        <h3 className="text-lg font-semibold text-black mb-1">
          {category.name}
        </h3>

        <p className="text-sm text-grey-500 mb-4 flex-1">
          {category.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-grey-400">
            {category.priceRange}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-black group-hover:gap-2 transition-all">
            Velg
            <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `cat app/booking/components/CategoryCard.tsx | head -10`
Expected: File contents shown

- [ ] **Step 3: Commit**

```bash
git add app/booking/components/CategoryCard.tsx
git commit -m "feat(booking): add CategoryCard component"
```

---

## Task 3: Create ServiceCard Component

**Files:**
- Create: `app/booking/components/ServiceCard.tsx`

- [ ] **Step 1: Create ServiceCard component**

```typescript
// app/booking/components/ServiceCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Star } from "lucide-react";

interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface Props {
  service: ServiceType;
  isRecommended: boolean;
  index: number;
}

export function ServiceCard({ service, isRecommended, index }: Props) {
  if (isRecommended) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
      >
        <Link
          href={`/booking/new?serviceTypeId=${service.id}`}
          className="group block bg-black text-white rounded-[20px] p-6 hover:bg-black/90 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-white/70" />
            <span className="text-xs font-medium uppercase tracking-wider text-white/70">
              Anbefalt
            </span>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-white/70 line-clamp-2">
                  {service.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3 text-sm text-white/60">
                <Clock size={14} />
                <span>{service.duration} min</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold">
                {service.price.toLocaleString("nb-NO")} kr
              </div>
              <div className="inline-flex items-center gap-1 mt-2 text-sm text-white/70 group-hover:gap-2 transition-all">
                Velg
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link
        href={`/booking/new?serviceTypeId=${service.id}`}
        className="group flex items-center justify-between bg-grey-100 rounded-[16px] p-4 hover:bg-grey-200 transition-colors"
      >
        <div>
          <h4 className="font-semibold text-black">{service.name}</h4>
          <div className="flex items-center gap-2 text-sm text-grey-500">
            <Clock size={14} />
            <span>{service.duration} min</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-bold text-black">
            {service.price.toLocaleString("nb-NO")} kr
          </span>
          <ArrowRight size={16} className="text-grey-400 group-hover:text-black transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `cat app/booking/components/ServiceCard.tsx | head -10`
Expected: File contents shown

- [ ] **Step 3: Commit**

```bash
git add app/booking/components/ServiceCard.tsx
git commit -m "feat(booking): add ServiceCard component with recommended variant"
```

---

## Task 4: Refactor Booking Landing Page

**Files:**
- Modify: `app/booking/page.tsx`

- [ ] **Step 1: Replace booking page with category cards**

```typescript
// app/booking/page.tsx
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { CATEGORIES } from "@/lib/booking-config";
import { CategoryCard } from "./components/CategoryCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book coaching | AK Golf",
  description: "Velg type coaching og book tid med en av våre erfarne golfcoacher.",
};

export default function BookingPage() {
  return (
    <>
      <WebsiteNav />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="w-container relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-black" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-grey-400 font-medium">
                Booking
              </span>
            </div>

            <h1 className="w-heading-xl max-w-3xl mb-6">Book coaching.</h1>

            <p className="text-lg text-grey-500 max-w-2xl leading-relaxed">
              Velg type coaching og book tid med en av våre trenere.
            </p>

            <div className="mt-12 w-16 h-px bg-gradient-to-r from-black/50 to-transparent" />
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-24 bg-grey-100">
          <div className="w-container">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Hva passer for deg?
            </h2>
            <p className="text-grey-500 mb-10">Velg en kategori for å se tilgjengelige tjenester</p>

            <div className="grid gap-5 sm:grid-cols-2">
              {CATEGORIES.map((category, index) => (
                <CategoryCard key={category.slug} category={category} index={index} />
              ))}
            </div>

            {/* Help button */}
            <div className="mt-10 text-center">
              <Link
                href="/booking/veileder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-grey-300 text-grey-600 hover:border-black hover:text-black transition-colors"
              >
                <HelpCircle size={18} />
                <span>Usikker? Hjelp meg velge</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <WebsiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit 2>&1 | grep -E "booking/page|error" | head -10`
Expected: No errors related to booking/page.tsx

- [ ] **Step 3: Commit**

```bash
git add app/booking/page.tsx
git commit -m "feat(booking): replace service grid with category cards"
```

---

## Task 5: Create Category Detail Page

**Files:**
- Create: `app/booking/[category]/page.tsx`

- [ ] **Step 1: Create category detail page**

```typescript
// app/booking/[category]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/portal/prisma";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { ServiceCard } from "../components/ServiceCard";
import { getCategoryBySlug, isRecommended, type BookingCategory } from "@/lib/booking-config";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Ikke funnet | AK Golf" };
  }

  return {
    title: `${category.name} | Book coaching | AK Golf`,
    description: `Book ${category.name.toLowerCase()} coaching hos AK Golf.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Fetch services for this category
  const services = await prisma.serviceType.findMany({
    where: {
      isActive: true,
      isPublic: true,
      category: { in: category.serviceCategories as any },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Sort: recommended first
  const sortedServices = [...services].sort((a, b) => {
    const aRec = isRecommended(a.name, slug as BookingCategory);
    const bRec = isRecommended(b.name, slug as BookingCategory);
    if (aRec && !bRec) return -1;
    if (!aRec && bRec) return 1;
    return 0;
  });

  const recommendedService = sortedServices.find((s) =>
    isRecommended(s.name, slug as BookingCategory)
  );
  const otherServices = sortedServices.filter((s) =>
    !isRecommended(s.name, slug as BookingCategory)
  );

  return (
    <>
      <WebsiteNav />

      <main className="min-h-screen bg-white">
        {/* Header */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="w-container">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 text-sm text-grey-500 hover:text-black transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Tilbake til kategorier
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              {category.name}
            </h1>
            <p className="text-lg text-grey-500">{category.description}</p>
          </div>
        </section>

        {/* Services */}
        <section className="pb-16 md:pb-24">
          <div className="w-container">
            {/* Recommended */}
            {recommendedService && (
              <div className="mb-8">
                <ServiceCard
                  service={recommendedService}
                  isRecommended={true}
                  index={0}
                />
              </div>
            )}

            {/* Other services */}
            {otherServices.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-grey-500 uppercase tracking-wider mb-4">
                  Andre alternativer
                </h3>
                <div className="space-y-3">
                  {otherServices.map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isRecommended={false}
                      index={index + 1}
                    />
                  ))}
                </div>
              </>
            )}

            {services.length === 0 && (
              <div className="text-center py-16 bg-grey-100 rounded-[20px]">
                <p className="text-grey-500">
                  Ingen tjenester tilgjengelig i denne kategorien.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <WebsiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit 2>&1 | grep -E "category.*page|error" | head -10`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/booking/\[category\]/page.tsx
git commit -m "feat(booking): add category detail page with recommended highlighting"
```

---

## Task 6: Create InstructorTabs Component

**Files:**
- Create: `app/booking/components/InstructorTabs.tsx`

- [ ] **Step 1: Create InstructorTabs component**

```typescript
// app/booking/components/InstructorTabs.tsx
"use client";

import { cn } from "@/lib/portal/utils/cn";

interface Instructor {
  id: string;
  name: string;
}

interface Props {
  instructors: Instructor[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function InstructorTabs({ instructors, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* "Alle" first for better UX */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all",
          selectedId === null
            ? "bg-black text-white"
            : "bg-grey-100 text-grey-600 hover:bg-grey-200"
        )}
      >
        Alle
      </button>
      {instructors.map((instructor) => (
        <button
          key={instructor.id}
          onClick={() => onSelect(instructor.id)}
          className={cn(
            "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all",
            selectedId === instructor.id
              ? "bg-black text-white"
              : "bg-grey-100 text-grey-600 hover:bg-grey-200"
          )}
        >
          {instructor.name}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `cat app/booking/components/InstructorTabs.tsx | head -10`
Expected: File contents shown

- [ ] **Step 3: Commit**

```bash
git add app/booking/components/InstructorTabs.tsx
git commit -m "feat(booking): add InstructorTabs component"
```

---

## Task 7: Update DateTimePicker with Instructor Tabs

**Files:**
- Modify: `app/booking/components/DateTimePicker.tsx`

- [ ] **Step 1: Replace DateTimePicker with instructor tabs support**

Replace the entire file with this updated version:

```typescript
// app/booking/components/DateTimePicker.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, CalendarDays, ArrowRight } from "lucide-react";
import { StepHeader } from "./StepHeader";
import { InstructorTabs } from "./InstructorTabs";
import { cn } from "@/lib/portal/utils/cn";

interface Props {
  serviceTypeId: string;
  instructorId: string;
  instructors?: Array<{ id: string; name: string }>;
  onSelect: (startTime: string) => void;
}

const DAY_NAMES = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

function getWeekDates(date: Date): Date[] {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekNumber = getWeekNumber(weekStart);
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const startMonth = weekStart.toLocaleDateString("nb-NO", { month: "short" });
  const endMonth = weekEnd.toLocaleDateString("nb-NO", { month: "short" });
  const year = weekStart.getFullYear();

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `Uke ${weekNumber} - ${startDay}. - ${endDay}. ${startMonth} ${year}`;
  }
  return `Uke ${weekNumber} - ${startDay}. ${startMonth} - ${endDay}. ${endMonth} ${year}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

type TimeFilter = "all" | "morning" | "afternoon" | "evening";

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "morning", label: "Morgen" },
  { value: "afternoon", label: "Ettermiddag" },
  { value: "evening", label: "Kveld" },
];

function filterSlotsByTime(slots: string[], filter: TimeFilter): string[] {
  if (filter === "all") return slots;

  return slots.filter((slot) => {
    const hour = new Date(slot).getHours();
    switch (filter) {
      case "morning":
        return hour >= 6 && hour < 12;
      case "afternoon":
        return hour >= 12 && hour < 17;
      case "evening":
        return hour >= 17 && hour < 22;
      default:
        return true;
    }
  });
}

export function DateTimePicker({ serviceTypeId, instructorId, instructors, onSelect }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const week = getWeekDates(today);
    return week[0];
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsPerDay, setSlotsPerDay] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  // Instructor filter: null means "Alle" (all instructors)
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(instructorId);

  // Use selected instructor or fall back to prop
  const activeInstructorId = selectedInstructorId ?? instructorId;

  const weekDates = getWeekDates(currentWeekStart);

  // Fetch slots count for each day in the week
  const fetchWeekSlots = useCallback(async () => {
    setLoadingWeek(true);
    const counts: Record<string, number> = {};

    try {
      await Promise.all(
        weekDates.map(async (date) => {
          const dateKey = formatDateKey(date);
          if (date < today) {
            counts[dateKey] = 0;
            return;
          }

          try {
            const params = new URLSearchParams({
              serviceTypeId,
              instructorId: activeInstructorId,
              date: dateKey,
            });
            const res = await fetch(`/api/portal/public/slots?${params}`);
            if (res.ok) {
              const data = await res.json();
              counts[dateKey] = Array.isArray(data) ? data.length : 0;
            } else {
              counts[dateKey] = 0;
            }
          } catch {
            counts[dateKey] = 0;
          }
        })
      );
      setSlotsPerDay(counts);
    } finally {
      setLoadingWeek(false);
    }
  }, [serviceTypeId, activeInstructorId, weekDates, today]);

  useEffect(() => {
    fetchWeekSlots();
  }, [currentWeekStart, serviceTypeId, activeInstructorId]);

  // Reset selection when instructor changes
  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSlots([]);
  }, [selectedInstructorId]);

  // Fetch slots for selected day
  const fetchDaySlots = useCallback(async (dateKey: string) => {
    setLoading(true);
    setSlots([]);
    try {
      const params = new URLSearchParams({
        serviceTypeId,
        instructorId: activeInstructorId,
        date: dateKey,
      });
      const res = await fetch(`/api/portal/public/slots?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(Array.isArray(data) ? data : []);
      }
    } catch {
      console.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  }, [serviceTypeId, activeInstructorId]);

  useEffect(() => {
    if (selectedDate) {
      fetchDaySlots(selectedDate);
      setSelectedTime(null);
      setTimeFilter("all");
    }
  }, [selectedDate, fetchDaySlots]);

  function navigateWeek(direction: -1 | 1) {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + direction * 7);
      return newDate;
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setSlots([]);
  }

  const canGoPrev = currentWeekStart > today;

  function handleDaySelect(date: Date) {
    if (date < today) return;
    const dateKey = formatDateKey(date);
    if (slotsPerDay[dateKey] === 0) return;
    setSelectedDate(dateKey);
  }

  function handleTimeSelect(slot: string) {
    setSelectedTime(slot);
  }

  function handleContinue() {
    if (selectedTime) {
      onSelect(selectedTime);
    }
  }

  const filteredSlots = filterSlotsByTime(slots, timeFilter);

  return (
    <div>
      <StepHeader
        eyebrow="Steg 3"
        heading="Velg dato og tid"
        description="Velg når du ønsker å trene"
      />

      {/* Instructor Tabs - only show if multiple instructors */}
      {instructors && instructors.length > 1 && (
        <InstructorTabs
          instructors={instructors}
          selectedId={selectedInstructorId}
          onSelect={setSelectedInstructorId}
        />
      )}

      {/* Week Navigator */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigateWeek(-1)}
          disabled={!canGoPrev}
          className="w-9 h-9 border border-grey-200 rounded-lg bg-white flex items-center justify-center hover:bg-grey-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} className="text-grey-500" />
        </button>
        <span className="font-semibold text-black">
          {formatWeekRange(currentWeekStart)}
        </span>
        <button
          onClick={() => navigateWeek(1)}
          className="w-9 h-9 border border-grey-200 rounded-lg bg-white flex items-center justify-center hover:bg-grey-100 transition-colors"
        >
          <ChevronRight size={18} className="text-grey-500" />
        </button>
      </div>

      {/* Day Selector - horizontal scroll on mobile */}
      <div className="flex sm:grid sm:grid-cols-7 gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
        {weekDates.map((date, i) => {
          const dateKey = formatDateKey(date);
          const isPast = date < today;
          const isSelected = selectedDate === dateKey;
          const slotCount = slotsPerDay[dateKey] ?? 0;
          const isFull = !isPast && slotCount === 0;

          return (
            <button
              key={dateKey}
              onClick={() => handleDaySelect(date)}
              disabled={isPast || isFull}
              className={cn(
                "border-2 rounded-[20px] p-3 text-center transition-all min-w-[70px] flex-shrink-0 sm:min-w-0 sm:flex-shrink",
                isPast && "opacity-40 cursor-not-allowed border-grey-200",
                isFull && !isPast && "opacity-40 cursor-not-allowed border-grey-200",
                !isPast && !isFull && !isSelected && "border-grey-200 hover:border-grey-300 cursor-pointer",
                isSelected && "border-black bg-black text-white"
              )}
            >
              <div className={cn(
                "text-[11px] uppercase tracking-wide mb-1",
                isSelected ? "text-white/70" : "text-grey-500"
              )}>
                {DAY_NAMES[i]}
              </div>
              <div className={cn(
                "text-lg font-semibold",
                isSelected ? "text-white" : "text-black"
              )}>
                {date.getDate()}
              </div>
              <div className={cn(
                "text-[11px] mt-1",
                isSelected ? "text-white/70" : "text-grey-500"
              )}>
                {isPast ? "" : isFull ? "Fullt" : `${slotCount} ledige`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      <AnimatePresence mode="wait">
        {!selectedDate ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-grey-100 rounded-[20px] p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-grey-200 flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={28} className="text-black" />
            </div>
            <h4 className="font-medium text-black mb-2">Velg en dato</h4>
            <p className="text-sm text-grey-500">
              Klikk på en dato ovenfor for å se ledige tider
            </p>
          </motion.div>
        ) : loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-grey-100 rounded-[20px] p-8 flex items-center justify-center"
          >
            <Loader2 size={32} className="animate-spin text-black" />
          </motion.div>
        ) : slots.length === 0 ? (
          <motion.div
            key="no-slots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-grey-100 rounded-[20px] p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-grey-200 flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={28} className="text-grey-500" />
            </div>
            <h4 className="font-medium text-black mb-2">Ingen ledige tider</h4>
            <p className="text-sm text-grey-500">
              Prøv en annen dato eller kontakt oss for assistanse
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="slots"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Time slots header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="text-sm font-semibold text-black">
                Tilgjengelige tider -{" "}
                {new Date(selectedDate).toLocaleDateString("nb-NO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <div className="flex gap-1">
                {TIME_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTimeFilter(filter.value)}
                    className={cn(
                      "px-3 py-1.5 rounded text-xs font-medium transition-colors",
                      timeFilter === filter.value
                        ? "bg-black text-white"
                        : "bg-grey-100 text-grey-500 hover:bg-grey-200"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time grid - responsive columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filteredSlots.map((slot) => {
                const time = new Date(slot);
                const timeStr = time.toLocaleTimeString("nb-NO", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const isSelected = selectedTime === slot;

                return (
                  <button
                    key={slot}
                    onClick={() => handleTimeSelect(slot)}
                    className={cn(
                      "py-3 px-2 border-2 rounded-lg text-sm font-semibold text-center transition-all",
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-grey-200 text-black hover:border-grey-300"
                    )}
                  >
                    {timeStr}
                  </button>
                );
              })}
            </div>

            {filteredSlots.length === 0 && (
              <p className="text-center text-sm text-grey-500 py-4">
                Ingen tider i valgt tidsrom. Prøv et annet filter.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-end mt-8 pt-6 border-t border-grey-200">
        <button
          onClick={handleContinue}
          disabled={!selectedTime}
          className="w-btn w-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Fortsett
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit 2>&1 | grep -E "DateTimePicker|error" | head -10`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/booking/components/DateTimePicker.tsx
git commit -m "feat(booking): add instructor tabs to DateTimePicker"
```

---

## Task 7B: Update Booking New Page for Multi-Step Flow

**Files:**
- Modify: `app/booking/new/page.tsx`
- Create: `app/booking/new/BookingStepManager.tsx`

- [ ] **Step 1: Create BookingStepManager component**

This component handles the multi-step flow when only serviceTypeId is provided:

```typescript
// app/booking/new/BookingStepManager.tsx
"use client";

import { useState } from "react";
import { DateTimePicker } from "../components/DateTimePicker";
import { BookingPaymentForm } from "./BookingPaymentForm";

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  allowStripe: boolean;
  allowVipps: boolean;
}

interface Instructor {
  id: string;
  user: { name: string; image: string | null };
}

interface Props {
  serviceType: ServiceType;
  instructors: Instructor[];
  studentId: string;
}

export function BookingStepManager({ serviceType, instructors, studentId }: Props) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(
    instructors.length === 1 ? instructors[0] : null
  );

  // If time is selected, show payment form
  if (selectedTime && selectedInstructor) {
    return (
      <BookingPaymentForm
        serviceType={serviceType}
        instructor={{
          id: selectedInstructor.id,
          user: selectedInstructor.user,
        }}
        startTime={selectedTime}
        studentId={studentId}
      />
    );
  }

  // Show date/time picker with instructor tabs
  return (
    <div className="rounded-3xl p-8 max-w-2xl w-full border bg-white border-[#E8E8ED]">
      <DateTimePicker
        serviceTypeId={serviceType.id}
        instructorId={instructors[0]?.id ?? ""}
        instructors={instructors.map((i) => ({ id: i.id, name: i.user.name }))}
        onSelect={(startTime) => {
          // Find which instructor was selected (from DateTimePicker state)
          // For now, use first instructor or the one from the slot
          setSelectedTime(startTime);
          if (!selectedInstructor && instructors.length === 1) {
            setSelectedInstructor(instructors[0]);
          }
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Update booking/new/page.tsx to handle partial params**

```typescript
// app/booking/new/page.tsx
import { getPortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { BookingPaymentForm } from "./BookingPaymentForm";
import { BookingStepManager } from "./BookingStepManager";
import { Calendar, CreditCard } from "lucide-react";

interface Props {
  searchParams: Promise<{
    serviceTypeId?: string;
    instructorId?: string;
    startTime?: string;
  }>;
}

export default async function BookingNewPage({ searchParams }: Props) {
  const params = await searchParams;
  const { serviceTypeId, instructorId, startTime } = params;

  const user = await getPortalUser();
  if (!user?.id) {
    const callbackUrl = encodeURIComponent(
      `/booking/new?serviceTypeId=${serviceTypeId ?? ""}&instructorId=${instructorId ?? ""}&startTime=${startTime ?? ""}`
    );
    redirect(`/portal/login?callbackUrl=${callbackUrl}`);
  }

  // Need at least serviceTypeId
  if (!serviceTypeId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F7]">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border bg-white border-[#E8E8ED]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[#F5F5F7]">
            <Calendar className="w-8 h-8 text-[#1D1D1F]" />
          </div>
          <p className="text-[#86868B]">
            Mangler bookingdetaljer. Vennligst start på nytt fra booking-systemet.
          </p>
        </div>
      </div>
    );
  }

  // Fetch service type and instructors
  const serviceType = await prisma.serviceType.findFirst({
    where: { id: serviceTypeId, isPublic: true, isActive: true },
    select: {
      id: true,
      name: true,
      duration: true,
      price: true,
      description: true,
      allowStripe: true,
      allowVipps: true,
    },
  });

  if (!serviceType) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F7]">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border bg-white border-[#E8E8ED]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[#F5F5F7]">
            <CreditCard className="w-8 h-8 text-[#1D1D1F]" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-[#1D1D1F]">
            Kunne ikke finne tjenesten
          </h2>
          <p className="text-[#86868B]">
            Tjenesten ble ikke funnet. Vennligst prøv igjen.
          </p>
        </div>
      </div>
    );
  }

  // Fetch instructors for this service
  const instructors = await prisma.instructor.findMany({
    where: {
      ServiceType: { some: { id: serviceTypeId } },
    },
    include: { User: { select: { name: true, image: true } } },
  });

  // If all params provided, show payment form directly
  if (instructorId && startTime) {
    const instructor = instructors.find((i) => i.id === instructorId);
    if (instructor) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F5F5F7]">
          <BookingPaymentForm
            serviceType={serviceType}
            instructor={{
              id: instructor.id,
              user: { name: instructor.User.name, image: instructor.User.image },
            }}
            startTime={startTime}
            studentId={user.id}
          />
        </div>
      );
    }
  }

  // Show step manager for instructor/time selection
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F5F5F7]">
      <BookingStepManager
        serviceType={serviceType}
        instructors={instructors.map((i) => ({
          id: i.id,
          user: { name: i.User.name, image: i.User.image },
        }))}
        studentId={user.id}
      />
    </div>
  );
}
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit 2>&1 | grep -E "booking/new|error" | head -10`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/booking/new/page.tsx app/booking/new/BookingStepManager.tsx
git commit -m "feat(booking): support multi-step flow with instructor selection"
```

---

## Task 8: Create QuizWizard Component

**Files:**
- Create: `app/booking/components/QuizWizard.tsx`

- [ ] **Step 1: Create QuizWizard component**

```typescript
// app/booking/components/QuizWizard.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Target, TrendingUp, Sprout, Building2, Calendar, RefreshCw, CircleDot, User, Users, UsersRound, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type Answer1 = "kort-sikt" | "langsiktig" | "nybegynner" | "bedrift";
type Answer2 = "ukentlig" | "sporadisk" | "engang";
type Answer3 = "alene" | "duo" | "gruppe";

interface QuizState {
  step: 1 | 2 | 3 | "result";
  answer1: Answer1 | null;
  answer2: Answer2 | null;
  answer3: Answer3 | null;
}

interface QuestionOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

const QUESTIONS: Record<1 | 2 | 3, { title: string; options: QuestionOption[] }> = {
  1: {
    title: "Hva er målet ditt?",
    options: [
      { value: "kort-sikt", label: "Bli bedre på kort sikt", icon: Target },
      { value: "langsiktig", label: "Systematisk utvikling over tid", icon: TrendingUp },
      { value: "nybegynner", label: "Jeg er helt ny til golf", icon: Sprout },
      { value: "bedrift", label: "Bedriftsevent / sosialt", icon: Building2 },
    ],
  },
  2: {
    title: "Hvor ofte vil du trene?",
    options: [
      { value: "ukentlig", label: "Ukentlig", icon: Calendar },
      { value: "sporadisk", label: "Av og til", icon: RefreshCw },
      { value: "engang", label: "Én gang", icon: CircleDot },
    ],
  },
  3: {
    title: "Alene eller med andre?",
    options: [
      { value: "alene", label: "Alene", icon: User },
      { value: "duo", label: "Med en venn", icon: Users },
      { value: "gruppe", label: "Gruppe", icon: UsersRound },
    ],
  },
};

function getResult(state: QuizState): { service: string; url: string } {
  const { answer1, answer2, answer3 } = state;

  // Early exits
  if (answer1 === "nybegynner") {
    return { service: "Foundation Test", url: "/booking/individuell" };
  }
  if (answer1 === "bedrift") {
    return { service: "Gruppetjenester", url: "/booking/gruppe" };
  }

  // Langsiktig path
  if (answer1 === "langsiktig") {
    if (answer2 === "ukentlig") return { service: "Performance Pro", url: "/booking/abonnement" };
    if (answer2 === "sporadisk") return { service: "Performance", url: "/booking/abonnement" };
    return { service: "Foundation Test", url: "/booking/individuell" };
  }

  // Kort-sikt path
  if (answer1 === "kort-sikt") {
    if (answer2 === "ukentlig") return { service: "Performance", url: "/booking/abonnement" };

    // Sporadisk/engang
    if (answer3 === "alene") return { service: "Flex 50 Solo", url: "/booking/individuell" };
    if (answer3 === "duo") return { service: "Flex 50 Duo", url: "/booking/gruppe" };
    if (answer3 === "gruppe") {
      return answer2 === "sporadisk"
        ? { service: "9 Hull Social", url: "/booking/gruppe" }
        : { service: "On-Course Par 3", url: "/booking/bane" };
    }
  }

  return { service: "Foundation Test", url: "/booking/individuell" };
}

export function QuizWizard() {
  const router = useRouter();
  const [state, setState] = useState<QuizState>({
    step: 1,
    answer1: null,
    answer2: null,
    answer3: null,
  });

  function handleAnswer(value: string) {
    if (state.step === 1) {
      const answer = value as Answer1;
      // Early exits
      if (answer === "nybegynner" || answer === "bedrift") {
        setState({ ...state, answer1: answer, step: "result" });
      } else {
        setState({ ...state, answer1: answer, step: 2 });
      }
    } else if (state.step === 2) {
      const answer = value as Answer2;
      // Skip step 3 for ukentlig (subscription path)
      if (state.answer1 === "langsiktig" || answer === "ukentlig") {
        setState({ ...state, answer2: answer, step: "result" });
      } else {
        setState({ ...state, answer2: answer, step: 3 });
      }
    } else if (state.step === 3) {
      setState({ ...state, answer3: value as Answer3, step: "result" });
    }
  }

  function handleBack() {
    if (state.step === 2) setState({ ...state, step: 1, answer1: null });
    else if (state.step === 3) setState({ ...state, step: 2, answer2: null });
    else if (state.step === "result") {
      if (state.answer3) setState({ ...state, step: 3, answer3: null });
      else if (state.answer2) setState({ ...state, step: 2, answer2: null });
      else setState({ ...state, step: 1, answer1: null });
    }
  }

  const currentStep = state.step === "result" ? 3 : state.step;
  const totalSteps = 3;
  const result = state.step === "result" ? getResult(state) : null;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex gap-2 justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 w-8 rounded-full transition-colors ${
              s <= currentStep ? "bg-black" : "bg-grey-200"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {state.step !== "result" ? (
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              {QUESTIONS[state.step].title}
            </h2>

            <div className="space-y-3">
              {QUESTIONS[state.step].options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full flex items-center gap-4 p-4 bg-grey-100 rounded-[16px] hover:bg-grey-200 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-grey-200 flex items-center justify-center">
                      <Icon size={20} className="text-black" />
                    </div>
                    <span className="font-medium text-black">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-6">
              <Check size={32} strokeWidth={3} />
            </div>

            <h2 className="text-2xl font-bold mb-2">Vi anbefaler</h2>
            <p className="text-3xl font-bold text-black mb-6">{result?.service}</p>

            <button
              onClick={() => router.push(result?.url || "/booking")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors"
            >
              Se tjenester
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      {state.step !== 1 && (
        <button
          onClick={handleBack}
          className="mt-8 flex items-center gap-2 text-grey-500 hover:text-black transition-colors mx-auto"
        >
          <ArrowLeft size={16} />
          Tilbake
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `wc -l app/booking/components/QuizWizard.tsx`
Expected: ~180 lines

- [ ] **Step 3: Commit**

```bash
git add app/booking/components/QuizWizard.tsx
git commit -m "feat(booking): add QuizWizard component with result matrix"
```

---

## Task 9: Create Veileder Page

**Files:**
- Create: `app/booking/veileder/page.tsx`

- [ ] **Step 1: Create veileder page**

```typescript
// app/booking/veileder/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { QuizWizard } from "../components/QuizWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finn riktig coaching | AK Golf",
  description: "Svar på noen enkle spørsmål og finn coaching som passer for deg.",
};

export default function VeilederPage() {
  return (
    <>
      <WebsiteNav />

      <main className="min-h-screen bg-white">
        <section className="pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="w-container">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 text-sm text-grey-500 hover:text-black transition-colors mb-12"
            >
              <ArrowLeft size={16} />
              Tilbake til booking
            </Link>

            <QuizWizard />
          </div>
        </section>
      </main>

      <WebsiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit 2>&1 | grep -E "veileder|error" | head -10`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/booking/veileder/page.tsx
git commit -m "feat(booking): add veileder (quiz wizard) page"
```

---

## Task 10: Final Integration and Testing

**Files:**
- All booking files

- [ ] **Step 1: Run full TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `npm run build 2>&1 | tail -30`
Expected: Build succeeds

- [ ] **Step 3: Manual test checklist**

Start dev server and verify:
- [ ] `/booking` shows 4 category cards
- [ ] "Usikker? Hjelp meg velge" button visible
- [ ] `/booking/individuell` shows services with Foundation Test recommended
- [ ] `/booking/veileder` quiz works through all paths
- [ ] Mobile layout works (use DevTools)

- [ ] **Step 4: Final commit and push**

```bash
git add -A
git commit -m "feat(booking): complete category-first redesign

- 4 categories: Abonnement, Individuell, Gruppe, Bane
- Recommended service highlighting per category
- Quiz wizard with 3 questions and result matrix
- Instructor tabs ready for calendar integration

Closes booking-redesign spec"
git push origin main
```

---

## Summary

| Task | Component | Files |
|------|-----------|-------|
| 1 | Booking Config | `lib/booking-config.ts` |
| 2 | CategoryCard | `app/booking/components/CategoryCard.tsx` |
| 3 | ServiceCard | `app/booking/components/ServiceCard.tsx` |
| 4 | Landing Page | `app/booking/page.tsx` |
| 5 | Category Page | `app/booking/[category]/page.tsx` |
| 6 | InstructorTabs | `app/booking/components/InstructorTabs.tsx` |
| 7 | DateTimePicker Update | `app/booking/components/DateTimePicker.tsx` |
| 7B | Booking New Multi-Step | `app/booking/new/page.tsx`, `app/booking/new/BookingStepManager.tsx` |
| 8 | QuizWizard | `app/booking/components/QuizWizard.tsx` |
| 9 | Veileder Page | `app/booking/veileder/page.tsx` |
| 10 | Integration | All files |
