"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ViewSwitcher } from "@/components/portal/view-switcher";
import { getDefaultView } from "@/lib/portal/preferences/actions";
import type { ViewId } from "@/lib/portal/views/registry";
import { AthleticGridView } from "./dashboard-views/athletic-grid-view";
import { FocusTodayView } from "./dashboard-views/focus-today-view";
import { DataRichView } from "./dashboard-views/data-rich-view";
import { ProgressStoryView } from "./dashboard-views/progress-story-view";
import { CommandCenterView } from "./dashboard-views/command-center-view";
import type { DashboardV3Props } from "./dashboard-types";

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
};

export function DashboardClientV3(props: DashboardV3Props) {
  const [activeView, setActiveView] = useState<ViewId>("opt1");
  const [isLoading, setIsLoading] = useState(true);

  // Hent lagret view-preferanse ved mount
  useEffect(() => {
    getDefaultView("portal-dashboard")
      .then((view) => {
        setActiveView(view);
      })
      .catch(() => {
        // Fallback: behold opt1
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const renderView = () => {
    switch (activeView) {
      case "opt1":
        return <AthleticGridView {...props} />;
      case "opt2":
        return <FocusTodayView {...props} />;
      case "opt3":
        return <DataRichView {...props} />;
      case "opt4":
        return <ProgressStoryView {...props} />;
      case "opt5":
        return <CommandCenterView {...props} />;
      default:
        return <AthleticGridView {...props} />;
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1400px] pt-8 pb-12">
        <div className="h-8 w-48 bg-grey-100 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <div className="h-32 bg-grey-100 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-2 gap-5">
              <div className="h-40 bg-grey-100 rounded-2xl animate-pulse" />
              <div className="h-40 bg-grey-100 rounded-2xl animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-64 bg-grey-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* View-switcher topbar */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="sticky top-0 z-30 pt-2 pb-3 bg-grey-50/80 backdrop-blur-sm"
      >
        <ViewSwitcher
          screenId="portal-dashboard"
          currentView={activeView}
          onViewChange={setActiveView}
        />
      </motion.div>

      {/* Aktivt view */}
      <div key={activeView} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderView()}
      </div>
    </div>
  );
}
