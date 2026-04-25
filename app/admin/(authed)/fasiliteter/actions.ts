"use server";

import { revalidatePath } from "next/cache";
import { requirePortalUser } from "@/lib/portal/auth";
import { canAccessMissionControl } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";

export const FACILITIES = [
  "Driving Range",
  "Performance Studio",
  "Putting Green",
  "Short Game Area",
  "Korthullsbane",
] as const;

export type FacilityName = (typeof FACILITIES)[number];

/** Soner synlige som klikkbare polygoner på flyfoto-kartet. Korthullsbane vises off-map. */
export const ON_MAP_FACILITIES: FacilityName[] = [
  "Driving Range",
  "Performance Studio",
  "Putting Green",
  "Short Game Area",
];

export const ACTIVITY_TYPES = [
  "Trening",
  "Coaching",
  "Turnering",
  "Event",
  "Vedlikehold",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const FACILITY_CAPACITY: Record<FacilityName, number> = {
  "Driving Range": 14,
  "Performance Studio": 4,
  "Putting Green": 8,
  "Short Game Area": 6,
  Korthullsbane: 12,
};

export interface FacilityBookingDTO {
  id: string;
  facility: string;
  person: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  userId: string | null;
  createdAt: string;
}

export interface CreateFacilityBookingInput {
  facility: FacilityName;
  person: string;
  type: ActivityType;
  date: string;
  startTime: string;
  durationMinutes: number;
}

function assertAdmin(role?: string) {
  if (!canAccessMissionControl(role)) {
    throw new Error("Ikke tilgang");
  }
}

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export interface LiveStatus {
  facility: FacilityName;
  activeNow: number;
  nextStart: string | null;
  nextPerson: string | null;
}

export async function getLiveStatus(): Promise<LiveStatus[]> {
  const user = await requirePortalUser();
  assertAdmin(user.role);

  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todays = await prisma.facilityBooking.findMany({
    where: { date: { gte: today, lt: tomorrow } },
    orderBy: { startTime: "asc" },
  });

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return FACILITIES.map((facility) => {
    const items = todays.filter((b) => b.facility === facility);
    const activeNow = items.filter((b) => {
      const s = parseTimeMinutes(b.startTime);
      const e = parseTimeMinutes(b.endTime);
      return s <= nowMinutes && nowMinutes < e;
    }).length;
    const next = items.find((b) => parseTimeMinutes(b.startTime) > nowMinutes);
    return {
      facility,
      activeNow,
      nextStart: next ? next.startTime : null,
      nextPerson: next ? next.person : null,
    };
  });
}

function parseTimeMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export async function getWeekBookings(): Promise<FacilityBookingDTO[]> {
  const user = await requirePortalUser();
  assertAdmin(user.role);

  const today = startOfDay(new Date());
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const bookings = await prisma.facilityBooking.findMany({
    where: { date: { gte: today, lt: weekEnd } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return bookings.map((b) => ({
    id: b.id,
    facility: b.facility,
    person: b.person,
    type: b.type,
    date: b.date.toISOString(),
    startTime: b.startTime,
    endTime: b.endTime,
    userId: b.userId,
    createdAt: b.createdAt.toISOString(),
  }));
}

export async function createFacilityBooking(input: CreateFacilityBookingInput) {
  const user = await requirePortalUser();
  assertAdmin(user.role);

  if (!FACILITIES.includes(input.facility)) {
    throw new Error("Ukjent fasilitet");
  }
  if (!ACTIVITY_TYPES.includes(input.type)) {
    throw new Error("Ukjent aktivitetstype");
  }
  if (!input.person.trim()) {
    throw new Error("Person eller gruppe må fylles ut");
  }
  if (input.durationMinutes < 15 || input.durationMinutes > 600) {
    throw new Error("Varighet må være mellom 15 og 600 minutter");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    throw new Error("Ugyldig dato");
  }
  if (!/^\d{2}:\d{2}$/.test(input.startTime)) {
    throw new Error("Ugyldig starttid");
  }

  const date = new Date(`${input.date}T00:00:00.000Z`);
  const endTime = addMinutes(input.startTime, input.durationMinutes);

  await prisma.facilityBooking.create({
    data: {
      facility: input.facility,
      person: input.person.trim(),
      type: input.type,
      date,
      startTime: input.startTime,
      endTime,
      userId: user.id,
    },
  });

  revalidatePath("/admin/fasiliteter");
  return { success: true };
}

export async function deleteFacilityBooking(id: string) {
  const user = await requirePortalUser();
  assertAdmin(user.role);

  await prisma.facilityBooking.delete({ where: { id } });
  revalidatePath("/admin/fasiliteter");
  return { success: true };
}
