"use client";

import { DashboardClient } from "@/app/portal/(dashboard)/dashboard-client";
import { addDays, subDays } from "date-fns";

const mockWeekDays = [
  { dayLabel: "Man", dateNumber: 14, trained: true, hasCoaching: false, isToday: false, isRest: false, completionPercent: 85 },
  { dayLabel: "Tir", dateNumber: 15, trained: true, hasCoaching: true, isToday: false, isRest: false, completionPercent: 100 },
  { dayLabel: "Ons", dateNumber: 16, trained: false, hasCoaching: false, isToday: false, isRest: true, completionPercent: 0 },
  { dayLabel: "Tor", dateNumber: 17, trained: true, hasCoaching: false, isToday: false, isRest: false, completionPercent: 60 },
  { dayLabel: "Fre", dateNumber: 18, trained: false, hasCoaching: false, isToday: false, isRest: false, completionPercent: 0 },
  { dayLabel: "Lør", dateNumber: 19, trained: false, hasCoaching: true, isToday: true, isRest: false, completionPercent: 0 },
  { dayLabel: "Søn", dateNumber: 20, trained: false, hasCoaching: false, isToday: false, isRest: false, completionPercent: 0 },
];

export default function PortalPreviewPage() {
  return (
    <div className="min-h-screen bg-grey-100 px-4 py-6 sm:px-6 lg:px-8">
      <DashboardClient
        userName="Anders"
        tier="PRO"
        memberSince="2023"
        stats={{ sessionsCount: 24, roundsCount: 12 }}
        handicap={{ current: 14.2, trend: -1.3 }}
        handicapHistory={[16.5, 16.2, 15.8, 15.5, 15.1, 14.8, 14.5, 14.3, 14.2, 14.2]}
        nextBooking={{
          id: "1",
          instructorName: "Kim Kristiansen",
          serviceName: "Swing-analyse",
          duration: 60,
          startTime: addDays(new Date(), 2),
        }}
        weekRings={{ days: mockWeekDays, weekStart: subDays(new Date(), 4).toISOString() }}
        coachInsight={{
          focusAreas: ["Putting", "Approach", "Mental game"],
          primaryFocus: "Putting",
          summary: "Anders har vist god fremgang i approach denne måneden. Neste fokusområde bør være putting innen 3 meter for å redusere antall putts per runde.",
          date: new Date(),
        }}
        aiInsight={{
          summary: "Din trening har vært jevn denne måneden. Du er på vei mot et solid hcp-kutt.",
          strengths: ["Jevn treningsfrekvens", "God progressjon i range-trening"],
          improvements: ["Øk putting-volumet", "Fokuser på wedge-distansekontroll"],
          focusTip: "Prøv '9-ball putting drill' før hver runde denne uken.",
          generatedAt: subDays(new Date(), 1),
        }}
      />
    </div>
  );
}
