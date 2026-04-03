"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MCTopbar,
  MCModeToggle,
  MCKPIStrip,
  DivisionColumn,
  useMCSidebar,
} from "@/components/portal/mission-control";

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

  return (
    <>
      <MCTopbar
        title="Hub — Oversikt"
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

      {/* KPI Strip */}
      <MCKPIStrip
        items={[
          {
            value: data.kpis.sessionsToday,
            label: "OKTER",
            sublabel: "I DAG",
          },
          {
            value: data.kpis.activeStudents,
            label: "AKTIVE",
            sublabel: "ELEVER",
          },
          {
            value: `${Math.round((data.kpis.activeStudents / 150) * 100)}%`,
            label: "KAPASITET",
            sublabel: "DENNE UKE",
            variant: "success",
          },
          {
            value: formatRevenue(data.kpis.mtdRevenue),
            label: "OMSETNING",
            sublabel: "MTD",
            trend: { value: 12, direction: "up" },
          },
        ]}
        alerts={data.alerts}
      />

      {/* Division Columns */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DivisionColumn
            division="coaching"
            label="Coaching"
            studentCount={data.divisions.coaching.studentCount}
            sessions={data.divisions.coaching.sessions}
            actionItems={data.divisions.coaching.actionItems}
          />
          <DivisionColumn
            division="junior"
            label="Junior Academy"
            studentCount={data.divisions.junior.studentCount}
            sessions={data.divisions.junior.sessions}
            actionItems={data.divisions.junior.actionItems}
          />
          <DivisionColumn
            division="gfgk"
            label="GFGK Junior"
            studentCount={data.divisions.gfgk.studentCount}
            sessions={data.divisions.gfgk.sessions}
            nextWeekItems={data.divisions.gfgk.nextWeekItems}
          />
        </div>
      </div>
    </>
  );
}
