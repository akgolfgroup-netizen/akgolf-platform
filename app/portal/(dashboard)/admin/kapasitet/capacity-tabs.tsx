"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BarChart3, CalendarCog } from "lucide-react";
import { CapacityOverview } from "./capacity-overview";
import { WeekAdjustmentView } from "./week-adjustment-view";
import type { CapacityData } from "./actions";

interface CapacityTabsProps {
  activeTab: string;
  data: CapacityData;
}

const TABS = [
  { id: "oversikt", label: "Oversikt", icon: BarChart3 },
  { id: "ukejustering", label: "Ukejustering", icon: CalendarCog },
] as const;

export function CapacityTabs({ activeTab, data }: CapacityTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-[var(--color-grey-100)] rounded-xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                  : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "oversikt" && <CapacityOverview data={data} />}
      {activeTab === "ukejustering" && <WeekAdjustmentView />}
    </div>
  );
}
