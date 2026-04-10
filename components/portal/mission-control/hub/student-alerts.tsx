"use client";

interface StudentAlert {
  name: string;
  initials: string;
  info: string;
  status: "risk" | "warn" | "ok";
}

interface StudentAlertsProps {
  alerts?: StudentAlert[];
}

const statusStyles = {
  risk: { bg: "bg-[var(--color-error)]/10", text: "text-[var(--color-error)]", label: "Risiko" },
  warn: { bg: "bg-[#E89C30]/10", text: "text-[#E89C30]", label: "Advarsel" },
  ok: { bg: "bg-[var(--mc-success-bg)]", text: "text-[var(--mc-success-text)]", label: "OK" },
};

export function StudentAlerts({ alerts = [] }: StudentAlertsProps) {
  return (
    <div className="bg-white border border-[#D5DFDB] rounded-xl p-4">
      <h3 className="text-xs font-bold text-[#0A1F18] mb-3">Elev-varsler</h3>
      {alerts.length === 0 ? (
        <p className="text-[10px] text-[#7A8C85]">Ingen varsler</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const style = statusStyles[alert.status];
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0A1F18] flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                  {alert.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#0A1F18] truncate">{alert.name}</p>
                  <p className="text-[9px] text-[#7A8C85]">{alert.info}</p>
                </div>
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
