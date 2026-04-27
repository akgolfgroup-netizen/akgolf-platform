/**
 * Booking V2 — server-side henting av tjenester og trenere fra DB.
 *
 * Erstatter den hardkodede SERVICES/TRAINERS-listen i components/booking-v2/copy.ts
 * med ekte data. URL-parametre i wizard-flyten bruker DB-id-er direkte (cuid) — ingen
 * slug→cuid-mapping nødvendig.
 */

import { prisma } from "@/lib/portal/prisma";
import type { ServiceCategory as PrismaServiceCategory } from "@prisma/client";

export type BookingV2Category = "abonnement" | "flex" | "bane" | "kurs";

export interface BookingV2Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  priceKr: number;
  priceLabel: string;
  category: BookingV2Category;
  prismaCategory: PrismaServiceCategory;
  maxAdvanceDays: number;
  minNoticeHours: number;
  allowStripe: boolean;
  allowVipps: boolean;
  trainerIds: string[];
}

export interface BookingV2Instructor {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  image: string | null;
  serviceIds: string[];
}

/**
 * Mapper en ServiceType til en av wizard-kategoriene basert på navn + Prisma-kategori.
 * Abonnementer = Performance, Performance Pro
 * Kurs = First Tee og andre VTG_COURSE
 * Bane = PLAYING_LESSON (On-Course)
 * Flex = alt annet (Flex 20/50/90, Foundation Test, Start)
 */
function mapToWizardCategory(
  name: string,
  prismaCategory: PrismaServiceCategory,
): BookingV2Category {
  const lower = name.toLowerCase();
  if (lower.startsWith("performance")) return "abonnement";
  if (prismaCategory === "VTG_COURSE") return "kurs";
  if (prismaCategory === "PLAYING_LESSON") return "bane";
  return "flex";
}

function formatPrice(priceKr: number): string {
  if (priceKr === 0) return "Avhenger av plan";
  return `${priceKr.toLocaleString("nb-NO")} kr`;
}

/**
 * Henter alle aktive, offentlige tjenester fra DB med kobling til instruktører.
 * Caches per request (Next.js dedupliserer like prisma-kall innenfor samme render).
 */
export async function getBookingV2Services(): Promise<BookingV2Service[]> {
  const services = await prisma.serviceType.findMany({
    where: { isActive: true, isPublic: true },
    orderBy: { sortOrder: "asc" },
    include: {
      Instructor: { select: { id: true } },
    },
  });

  return services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description ?? "",
    duration: s.duration,
    priceKr: s.price,
    priceLabel: formatPrice(s.price),
    category: mapToWizardCategory(s.name, s.category),
    prismaCategory: s.category,
    maxAdvanceDays: s.maxAdvanceDays,
    minNoticeHours: s.minNoticeHours,
    allowStripe: s.allowStripe,
    allowVipps: s.allowVipps,
    trainerIds: s.Instructor.map((i) => i.id),
  }));
}

/**
 * Henter en enkelt tjeneste — null hvis ikke funnet eller ikke offentlig.
 */
export async function getBookingV2Service(
  id: string,
): Promise<BookingV2Service | null> {
  const all = await getBookingV2Services();
  return all.find((s) => s.id === id) ?? null;
}

/**
 * Henter alle aktive instruktører med liste over tjenester de tilbyr.
 */
export async function getBookingV2Instructors(): Promise<BookingV2Instructor[]> {
  const instructors = await prisma.instructor.findMany({
    include: {
      User: { select: { name: true, image: true } },
      ServiceType: { select: { id: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return instructors.map((i) => ({
    id: i.id,
    name: i.User?.name ?? "Ukjent trener",
    title: i.title,
    bio: i.bio,
    image: i.User?.image ?? null,
    serviceIds: i.ServiceType.map((s) => s.id),
  }));
}

/**
 * Henter en enkelt instruktør — null hvis ikke funnet eller inaktiv.
 */
export async function getBookingV2Instructor(
  id: string,
): Promise<BookingV2Instructor | null> {
  const all = await getBookingV2Instructors();
  return all.find((i) => i.id === id) ?? null;
}

/**
 * Henter instruktører som tilbyr en spesifikk tjeneste.
 */
export async function getBookingV2InstructorsForService(
  serviceId: string,
): Promise<BookingV2Instructor[]> {
  const all = await getBookingV2Instructors();
  return all.filter((i) => i.serviceIds.includes(serviceId));
}
