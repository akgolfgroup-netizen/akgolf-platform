"use client";

import { ThisWeekClient } from "./this-week-client";

// Mock data
const mockPlans = [
  {
    id: "p1",
    tournamentId: "t1",
    tournament: {
      id: "t1",
      name: "NM Junior 2025",
      startDate: new Date("2025-06-15"),
    },
    student: {
      id: "s1",
      name: "Olav Hansen",
      image: null,
    },
    isRegistered: true,
    planLevel: "A",
    goalType: "TOP3",
    notes: "Fokus på putting",
  },
  {
    id: "p2",
    tournamentId: "t1",
    tournament: {
      id: "t1",
      name: "NM Junior 2025",
      startDate: new Date("2025-06-15"),
    },
    student: {
      id: "s2",
      name: "Mari Kristiansen",
      image: null,
    },
    isRegistered: false,
    planLevel: "B",
    goalType: "CUT",
    notes: null,
  },
];

const mockWeekStats = {
  totalPlayers: 2,
  tournaments: 1,
  registered: 1,
  weekLabel: "15. - 21. juni",
};

export default function DenneUkenPage() {
  return <ThisWeekClient plans={mockPlans} weekStats={mockWeekStats} />;
}
