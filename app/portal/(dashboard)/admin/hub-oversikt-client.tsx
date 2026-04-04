"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MCTopbar,
  MCModeToggle,
  MCStatCard,
  useMCSidebar,
} from "@/components/portal/mission-control";
import { TodaySchedule } from "@/components/portal/mission-control/hub/today-schedule";
import { ActivityFeed } from "@/components/portal/mission-control/hub/activity-feed";
import { StudentAlerts } from "@/components/portal/mission-control/hub/student-alerts";

interface Session {
  id: string;
  name: string;
  time: string;
  isActive?: boolean;
  subtitle?: string;
}

interface ActionItem {
  text: string;
  variant: "error" | "warning" | "info";
}

interface HubData {
  kpis: {
    sessionsToday: number;
    activeStudents: number;
    pendingBookings: number;
    mtdRevenue: number;
  };
  divisions: {
    coaching: {
      studentCount: number;
      sessions: Session[];
      actionItems: ActionItem[];
    };
    junior: {
      studentCount: number;
      sessions: Session[];
      actionItems: ActionItem[];
    };
    gfgk: {
      studentCount: number;
      sessions: Session[];
      nextWeekItems?: string[];
    };
  };
  alerts: { label: string; variant: "success" | "warning" | "error" | "info" }[];
}

interface HubOversiktClientProps {
  data: HubData;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function HubOversiktClient({ data, user }: HubOversiktClientProps) {
  const router = useRouter();
  const { toggle } = useMCSidebar();

  const today = new Date();
  const dateString = today.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format revenue
  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${Math.round(amount / 1000)}k`;
    }
    return amount.toString();
  };

  // Build schedule items from divisions
  const scheduleItems = [
    ...data.divisions.coaching.sessions.map((s) => ({
      time: s.time,
      name: s.name,
      type: "individual" as const,
    })),
    ...data.divisions.junior.sessions.map((s) => ({
      time: s.time,
      name: s.name,
      type: "junior" as const,
    })),
    ...data.divisions.gfgk.sessions.map((s) => ({
      time: s.time,
      name: s.name,
      type: "gruppe" as const,
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  // Build activity feed from action items
  const activityItems = [
    ...data.divisions.coaching.actionItems.map((a) => ({
      type: (a.variant === "error" ? "cancel" : a.variant === "warning" ? "note" : "booking") as "cancel" | "note" | "booking",
      text: a.text,
      time: "I dag",
    })),
    ...data.divisions.junior.actionItems.map((a) => ({
      type: (a.variant === "error" ? "cancel" : "signup") as "cancel" | "signup",
      text: a.text,
      time: "I dag",
    })),
  ];

  // Build student alerts
  const studentAlerts = data.alerts.map((a) => ({
    name: a.label,
    initials: a.label.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    info: a.variant === "warning" ? "Ikke logget okt pa 7+ dager" : a.variant === "error" ? "Booking kansellert" : "Alt OK",
    status: (a.variant === "error" ? "risk" : a.variant === "warning" ? "warn" : "ok") as "risk" | "warn" | "ok",
  }));

  return (
    <>
      <MCTopbar
        title="Hub -- Oversikt"
        subtitle={dateString.charAt(0).toUpperCase() + dateString.slice(1)}
        onMenuClick={toggle}
        user={user}
        notificationCount={data.alerts.length}
      >
        <Link href="/portal/admin/focus">
          <MCModeToggle
            activeMode="oversikt"
            onModeChange={(mode) => {
              if (mode === "focus") {
                router.push("/portal/admin/focus");
              }
            }}
          />
        </Link>
      </MCTopbar>

      <div className="p-5 space-y-4">
        {/* 4 stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MCStatCard
            label="Okter i dag"
            value={data.kpis.sessionsToday}
          />
          <MCStatCard
            label="Aktive elever"
            value={data.kpis.activeStudents}
          />
          <MCStatCard
            label="Kapasitet"
            value={`${Math.round((data.kpis.activeStudents / 150) * 100)}%`}
            variant="success"
          />
          <MCStatCard
            label="Omsetning MTD"
            value={formatRevenue(data.kpis.mtdRevenue)}
            trend={{ value: 12, direction: "up" }}
          />
        </div>

        {/* Timeplan + aktivitetsfeed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TodaySchedule items={scheduleItems} />
          <ActivityFeed items={activityItems} />
        </div>

        {/* Elev-varsler */}
        <StudentAlerts alerts={studentAlerts} />
      </div>
    </>
  );
}
