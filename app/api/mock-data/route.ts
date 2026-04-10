/**
 * Mock Data API for UI Development
 * Returns realistic mock data for Mission Board and Player Portal
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock Mission Board Dashboard Data
const missionBoardData = {
  dashboard: {
    today: {
      totalBookings: 8,
      activeSessions: 3,
      revenue: 6400,
      cancellations: 1,
    },
    week: {
      totalBookings: 42,
      revenue: 38500,
      newStudents: 5,
      retention: 94,
    },
    alerts: [
      { type: "warning", message: "2 avbestillinger i dag", time: "10:30" },
      { type: "info", message: "Ny elev registrert: Markus Hansen", time: "09:15" },
      { type: "success", message: "Betaling mottatt: 2 000 kr", time: "08:45" },
    ],
    quickActions: [
      { label: "Ny Booking", icon: "calendar", href: "/portal/admin/bookinger/ny" },
      { label: "Send Melding", icon: "message", href: "/portal/admin/meldinger" },
      { label: "Legg til Elev", icon: "user-plus", href: "/portal/admin/elever/ny" },
      { label: "Se Rapport", icon: "chart", href: "/portal/admin/rapporter" },
    ],
  },
  // Mock Students
  students: [
    {
      id: "stu_001",
      name: "Olav Nordmann",
      email: "olav@example.com",
      phone: "+47 123 45 678",
      handicap: 12.4,
      membership: "Performance Pro",
      status: "active",
      nextBooking: "2026-04-09T10:00:00Z",
      totalSessions: 24,
      lastSession: "2026-04-02",
      avatar: null,
    },
    {
      id: "stu_002",
      name: "Kari Hansen",
      email: "kari@example.com",
      phone: "+47 987 65 432",
      handicap: 18.2,
      membership: "Performance",
      status: "active",
      nextBooking: "2026-04-10T13:00:00Z",
      totalSessions: 12,
      lastSession: "2026-04-05",
      avatar: null,
    },
    {
      id: "stu_003",
      name: "Per Johansen",
      email: "per@example.com",
      phone: "+47 456 78 901",
      handicap: 28.5,
      membership: "Start",
      status: "trial",
      nextBooking: null,
      totalSessions: 2,
      lastSession: "2026-04-01",
      avatar: null,
    },
  ],
  // Mock Bookings
  bookings: [
    {
      id: "book_001",
      studentName: "Olav Nordmann",
      service: "TrackMan Analyse",
      date: "2026-04-09",
      time: "10:00",
      duration: 60,
      instructor: "Anders Kristiansen",
      status: "confirmed",
      price: 1200,
      location: "Gamle Fredrikstad GK",
    },
    {
      id: "book_002",
      studentName: "Kari Hansen",
      service: "Coaching Session",
      date: "2026-04-09",
      time: "13:00",
      duration: 90,
      instructor: "Anders Kristiansen",
      status: "confirmed",
      price: 1500,
      location: "Gamle Fredrikstad GK",
    },
    {
      id: "book_003",
      studentName: "Erik Olsen",
      service: "20-Min Quick Fix",
      date: "2026-04-09",
      time: "15:00",
      duration: 20,
      instructor: "Markus",
      status: "pending",
      price: 450,
      location: "Gamle Fredrikstad GK",
    },
  ],
  // Mock Player Portal Data
  playerPortal: {
    profile: {
      id: "player_001",
      name: "Olav Nordmann",
      email: "olav@example.com",
      phone: "+47 123 45 678",
      membership: "Performance Pro",
      memberSince: "2025-08-15",
      nextPayment: "2026-05-15",
      subscriptionStatus: "active",
      avatar: null,
    },
    stats: {
      handicap: 12.4,
      handicapHistory: [
        { date: "2026-01", value: 15.2 },
        { date: "2026-02", value: 14.1 },
        { date: "2026-03", value: 13.0 },
        { date: "2026-04", value: 12.4 },
      ],
      totalSessions: 24,
      sessionsThisMonth: 3,
      practiceHours: 45,
      goalsAchieved: 8,
    },
    upcomingBookings: [
      {
        id: "book_001",
        service: "TrackMan Analyse",
        date: "2026-04-09",
        time: "10:00",
        instructor: "Anders Kristiansen",
        location: "Gamle Fredrikstad GK",
      },
    ],
    trainingPlan: {
      title: "12-ukers Swing Forbedring",
      week: 4,
      progress: 35,
      focus: "Backswing og rotasjon",
      nextSession: "Teknikk: Hip clearance",
      exercises: [
        { name: "Mirror Drill", duration: "15 min", completed: true },
        { name: "Hip Rotation", duration: "20 min", completed: false },
        { name: "Slow Motion Swings", duration: "15 min", completed: false },
      ],
    },
    recentNotes: [
      {
        id: "note_001",
        date: "2026-04-02",
        title: "Sesjon #23 - Grip Endring",
        summary: "Jobbet med å styrke grepet. God progresjon på backswing.",
        coach: "Anders Kristiansen",
        videoCount: 2,
      },
    ],
  },
  // Mock Instructors
  instructors: [
    {
      id: "instr_anders",
      name: "Anders Kristiansen",
      title: "Head Coach",
      email: "anders@akgolf.no",
      phone: "+47 900 12 345",
      bio: "PGA Tour erfaring, spesialist på teknisk coaching",
      avatar: null,
      todayBookings: 5,
      weeklyHours: 28,
    },
    {
      id: "instr_markus",
      name: "Markus",
      title: "Assistentcoach",
      email: "markus@akgolf.no",
      phone: "+47 900 54 321",
      bio: "College-golf fra USA, fokus på gruppetrening",
      avatar: null,
      todayBookings: 3,
      weeklyHours: 20,
    },
  ],
  // Mock Financial Data
  finance: {
    today: { income: 6400, expenses: 0 },
    week: { income: 38500, expenses: 12000 },
    month: { income: 156000, expenses: 48000 },
    outstandingInvoices: [
      { id: "inv_001", customer: "Olav Nordmann", amount: 2000, dueDate: "2026-04-15", status: "pending" },
      { id: "inv_002", customer: "Kari Hansen", amount: 1600, dueDate: "2026-04-10", status: "overdue" },
    ],
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";
  
  switch (type) {
    case "dashboard":
      return NextResponse.json(missionBoardData.dashboard);
    case "students":
      return NextResponse.json(missionBoardData.students);
    case "bookings":
      return NextResponse.json(missionBoardData.bookings);
    case "player":
      return NextResponse.json(missionBoardData.playerPortal);
    case "instructors":
      return NextResponse.json(missionBoardData.instructors);
    case "finance":
      return NextResponse.json(missionBoardData.finance);
    default:
      return NextResponse.json(missionBoardData);
  }
}
