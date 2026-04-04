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
  risk: { bg: "bg-[#D14343]/10", text: "text-[#D14343]", label: "Risiko" },
  warn: { bg: "bg-[#E89C30]/10", text: "text-[#E89C30]", label: "Advarsel" },
  ok: { bg: "bg-[#EDF5F0]", text: "text-[#2D6A4F]", label: "OK" },
};

export function StudentAlerts({ alerts = [] }: StudentAlertsProps) {
  return (
    <div className="bg-white border border-[#E8E8ED] rounded-xl p-4">
      <h3 className="text-xs font-bold text-[#1D1D1F] mb-3">Elev-varsler</h3>
      {alerts.length === 0 ? (
        <p className="text-[10px] text-[#86868B]">Ingen varsler</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const style = statusStyles[alert.status];
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1D1D1F] flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                  {alert.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#1D1D1F] truncate">{alert.name}</p>
                  <p className="text-[9px] text-[#86868B]">{alert.info}</p>
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
