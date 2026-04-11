import { cn } from "@/lib/portal/utils/cn";
import { MCCard, MCCardHeader, MCCardBody } from "../ui/mc-card";
import { MCBadge, DivisionDot } from "../ui/mc-badge";
import { SessionItem } from "./session-item";
import type { Division } from "../mc-nav-config";

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

interface DivisionColumnProps {
  division: Division;
  label: string;
  studentCount: number;
  sessions: Session[];
  actionItems?: ActionItem[];
  nextWeekItems?: string[];
  className?: string;
}

const actionColors = {
  error: "text-error-text",
  warning: "text-warning-text",
  info: "text-info-text",
};

export function DivisionColumn({
  division,
  label,
  studentCount,
  sessions,
  actionItems,
  nextWeekItems,
  className,
}: DivisionColumnProps) {
  return (
    <MCCard className={className}>
      <MCCardHeader>
        <div className="flex items-center gap-2">
          <DivisionDot division={division} />
          <span className="text-[13px] font-bold text-black">{label}</span>
        </div>
        <MCBadge variant="neutral">{studentCount} elever</MCBadge>
      </MCCardHeader>

      <MCCardBody>
        {/* Today's Sessions */}
        <div className="text-[9px] font-semibold text-grey-400 mb-2">I DAG</div>
        <div className="flex flex-col gap-2">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionItem
                key={session.id}
                name={session.name}
                time={session.time}
                isActive={session.isActive}
                subtitle={session.subtitle}
                division={division}
              />
            ))
          ) : (
            <div className="text-[10px] text-grey-400 py-4 text-center">
              Ingen okter i dag
            </div>
          )}
        </div>

        {/* Action Items */}
        {actionItems && actionItems.length > 0 && (
          <div className="mt-3 pt-3 border-t border-grey-200">
            <div className="text-[9px] font-semibold text-grey-400 mb-1.5">
              KREVER HANDLING
            </div>
            {actionItems.map((item, index) => (
              <div
                key={index}
                className={cn("text-[10px] mt-0.5", actionColors[item.variant])}
              >
                • {item.text}
              </div>
            ))}
          </div>
        )}

        {/* Next Week */}
        {nextWeekItems && nextWeekItems.length > 0 && (
          <div className="mt-3 pt-3 border-t border-grey-200">
            <div className="text-[9px] font-semibold text-grey-400 mb-1.5">
              NESTE UKE
            </div>
            {nextWeekItems.map((item, index) => (
              <div key={index} className="text-[10px] text-grey-500 mt-0.5">
                • {item}
              </div>
            ))}
          </div>
        )}
      </MCCardBody>
    </MCCard>
  );
}
