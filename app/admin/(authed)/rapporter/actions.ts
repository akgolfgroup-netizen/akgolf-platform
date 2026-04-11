"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { format } from "date-fns";

interface CsvResult {
  csv: string;
  filename: string;
}

async function requireStaff() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/");
  return user;
}

// ── Bookinger CSV ──────────────────────────────────────

export async function exportBookingsCSV(
  from: string,
  to: string
): Promise<CsvResult> {
  await requireStaff();

  const bookings = await prisma.booking.findMany({
    where: {
      startTime: { gte: new Date(from), lte: new Date(to) },
    },
    include: {
      User: { select: { name: true, email: true } },
      ServiceType: { select: { name: true, category: true, duration: true } },
      Instructor: { select: { User: { select: { name: true } } } },
      Location: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
    take: 5000,
  });

  const headers = [
    "Dato",
    "Tid",
    "Slutt",
    "Elev",
    "E-post",
    "Tjeneste",
    "Kategori",
    "Varighet (min)",
    "Instruktor",
    "Sted",
    "Status",
    "Betalingsstatus",
    "Betalingsmetode",
    "Belop (kr)",
  ];

  const rows = bookings.map((b) => [
    format(b.startTime, "yyyy-MM-dd"),
    format(b.startTime, "HH:mm"),
    format(b.endTime, "HH:mm"),
    b.User.name ?? "",
    b.User.email ?? "",
    b.ServiceType.name,
    b.ServiceType.category,
    String(b.ServiceType.duration),
    b.Instructor.User.name ?? "",
    b.Location?.name ?? "",
    b.status,
    b.paymentStatus,
    b.paymentMethod,
    String(b.amount),
  ]);

  const csv = toCsv(headers, rows);
  const fromStr = format(new Date(from), "yyyy-MM-dd");
  const toStr = format(new Date(to), "yyyy-MM-dd");

  return { csv, filename: `bookinger_${fromStr}_${toStr}.csv` };
}

// ── Okonomi CSV ────────────────────────────────────────

export async function exportRevenueCSV(
  from: string,
  to: string
): Promise<CsvResult> {
  await requireStaff();

  const transactions = await prisma.paymentTransaction.findMany({
    where: {
      createdAt: { gte: new Date(from), lte: new Date(to) },
    },
    include: {
      Booking: {
        select: {
          startTime: true,
          User: { select: { name: true, email: true } },
          ServiceType: { select: { name: true, category: true } },
          Instructor: { select: { User: { select: { name: true } } } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: 5000,
  });

  const headers = [
    "Transaksjonsdato",
    "Bookingdato",
    "Elev",
    "E-post",
    "Tjeneste",
    "Kategori",
    "Instruktor",
    "Betalingsmetode",
    "Brutto (kr)",
    "MVA (kr)",
    "MVA-sats (%)",
    "Gebyr (kr)",
    "Netto (kr)",
    "Status",
    "Referanse",
  ];

  const rows = transactions.map((t) => [
    format(t.createdAt, "yyyy-MM-dd"),
    format(t.Booking.startTime, "yyyy-MM-dd"),
    t.Booking.User.name ?? "",
    t.Booking.User.email ?? "",
    t.Booking.ServiceType.name,
    t.Booking.ServiceType.category,
    t.Booking.Instructor.User.name ?? "",
    t.paymentMethod,
    String(t.grossAmount),
    String(t.vatAmount),
    String(t.vatRate),
    String(t.feeAmount),
    String(t.netAmount),
    t.status,
    t.providerRef ?? "",
  ]);

  const csv = toCsv(headers, rows);
  const fromStr = format(new Date(from), "yyyy-MM-dd");
  const toStr = format(new Date(to), "yyyy-MM-dd");

  return { csv, filename: `okonomi_${fromStr}_${toStr}.csv` };
}

// ── Elever CSV ─────────────────────────────────────────

export async function exportStudentsCSV(): Promise<CsvResult> {
  await requireStaff();

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subscriptionTier: true,
      createdAt: true,
      lastActiveAt: true,
      isActive: true,
      activeCoachingCustomer: true,
      HandicapEntry: {
        orderBy: { date: "desc" },
        take: 1,
        select: { handicapIndex: true, date: true },
      },
      UserGolfId: {
        select: { clubName: true, handicap: true },
      },
      Booking: {
        orderBy: { startTime: "desc" },
        take: 1,
        select: {
          startTime: true,
          ServiceType: { select: { name: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const headers = [
    "Navn",
    "E-post",
    "Telefon",
    "Klubb",
    "HCP (siste)",
    "HCP-dato",
    "Kategori",
    "Aktiv kunde",
    "Registrert",
    "Sist aktiv",
    "Siste booking",
    "Siste tjeneste",
  ];

  const rows = students.map((s) => {
    const hcp = s.HandicapEntry[0];
    const golfId = s.UserGolfId;
    const lastBooking = s.Booking[0];
    // Bruk HandicapEntry (nyeste), ellers UserGolfId.handicap
    const hcpValue = hcp?.handicapIndex ?? golfId?.handicap;

    return [
      s.name ?? "",
      s.email ?? "",
      s.phone ?? "",
      golfId?.clubName ?? "",
      hcpValue != null ? String(hcpValue) : "",
      hcp ? format(hcp.date, "yyyy-MM-dd") : "",
      s.subscriptionTier,
      s.activeCoachingCustomer ? "Ja" : "Nei",
      format(s.createdAt, "yyyy-MM-dd"),
      s.lastActiveAt ? format(s.lastActiveAt, "yyyy-MM-dd") : "",
      lastBooking ? format(lastBooking.startTime, "yyyy-MM-dd") : "",
      lastBooking?.ServiceType.name ?? "",
    ];
  });

  const csv = toCsv(headers, rows);
  const dateStr = format(new Date(), "yyyy-MM-dd");

  return { csv, filename: `elever_${dateStr}.csv` };
}

// ── CSV-hjelper ────────────────────────────────────────

function toCsv(headers: string[], rows: string[][]): string {
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel-kompatibilitet
  const escape = (val: string) => {
    if (val.includes(";") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };
  const lines = [
    headers.map(escape).join(";"),
    ...rows.map((row) => row.map(escape).join(";")),
  ];
  return BOM + lines.join("\n");
}
