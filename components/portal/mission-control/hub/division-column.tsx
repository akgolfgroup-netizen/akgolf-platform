import { cn } from "@/lib/portal/utils/cn";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DivisionDot } from "../ui/division-dot";
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
    <Card className={className}>
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between border-b border-grey-200">
        <div className="flex items-center gap-2">
          <DivisionDot division={division} />
          <span className="text-sm font-bold text-black">{label}</span>
        </div>
        <Badge variant="secondary">{studentCount} elever</Badge>
      </CardHeader>

      <CardContent className="p-4">
        {/* Today's Sessions */}
        <div className="text-[10px] font-semibold uppercase tracking-wider text-grey-400 mb-2">
          I dag
        </div>
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
            <div className="text-xs text-grey-400 py-4 text-center">
              Ingen økter i dag
            </div>
          )}
        </div>

        {/* Action Items */}
        {actionItems && actionItems.length > 0 && (
          <div className="mt-3 pt-3 border-t border-grey-200">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-grey-400 mb-1.5">
              Krever handling
            </div>
            {actionItems.map((item, index) => (
              <div
                key={index}
                className={cn("text-xs mt-0.5", actionColors[item.variant])}
              >
                • {item.text}
              </div>
            ))}
          </div>
        )}

        {/* Next Week */}
        {nextWeekItems && nextWeekItems.length > 0 && (
          <div className="mt-3 pt-3 border-t border-grey-200">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-grey-400 mb-1.5">
              Neste uke
            </div>
            {nextWeekItems.map((item, index) => (
              <div key={index} className="text-xs text-grey-500 mt-0.5">
                • {item}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
