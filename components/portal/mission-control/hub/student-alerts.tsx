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
  warn: { bg: "bg-warning-light", text: "text-warning-text", label: "Advarsel" },
  ok: { bg: "bg-[var(--mc-success-bg)]", text: "text-[var(--mc-success-text)]", label: "OK" },
};

export function StudentAlerts({ alerts = [] }: StudentAlertsProps) {
  return (
    <div className="bg-white border border-grey-200 rounded-xl p-4">
      <h3 className="text-xs font-bold text-[var(--color-black)] mb-3">Elev-varsler</h3>
      {alerts.length === 0 ? (
        <p className="text-[10px] text-[var(--color-grey-400)]">Ingen varsler</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const style = statusStyles[alert.status];
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-black)] flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                  {alert.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[var(--color-black)] truncate">{alert.name}</p>
                  <p className="text-[9px] text-[var(--color-grey-400)]">{alert.info}</p>
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
