"use client";

import { GodkjenningerClient } from "./godkjenninger-client";

// Mock data
const mockPendingItems = [
  {
    id: "1",
    type: "booking" as const,
    studentName: "Olav Hansen",
    studentEmail: "olav@example.com",
    serviceName: "Privat Coaching",
    price: 1200,
    requestedTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  {
    id: "2",
    type: "activity" as const,
    studentName: "Maria Hansen",
    studentEmail: "maria@example.com",
    serviceName: "Junior Academy",
    price: 0,
    requestedTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    facilityName: "TrackMan Simulator 1",
    conflictNote: "Overlapp med eksisterende booking",
  },
];

export default function GodkjenningerPage() {
  return <GodkjenningerClient pendingItems={mockPendingItems} />;
}
