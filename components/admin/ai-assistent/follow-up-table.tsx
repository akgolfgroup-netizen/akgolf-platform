import { MOCK_FOLLOWUP_ROWS } from "./mock-data";

export function FollowUpTable() {
  return (
    <div className="mt-3 rounded-[10px] border border-white/[0.06] bg-black/20 p-3.5">
      <div className="mb-2 text-[13px] font-bold text-white">
        Prioritert oppfølging · 5 spillere
      </div>
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="border-b border-white/[0.06] py-1.5 text-left font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/50">
              Spiller
            </th>
            <th className="border-b border-white/[0.06] py-1.5 text-left font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/50">
              Grunn
            </th>
            <th className="border-b border-white/[0.06] py-1.5 text-right font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/50">
              Sist økt
            </th>
            <th className="border-b border-white/[0.06] py-1.5 text-right font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/50">
              HCP-trend
            </th>
          </tr>
        </thead>
        <tbody>
          {MOCK_FOLLOWUP_ROWS.map((r) => (
            <tr key={r.player}>
              <td className="border-b border-white/[0.04] py-1.5 text-white/85">
                <strong className="font-bold text-white">{r.player}</strong>
              </td>
              <td className="border-b border-white/[0.04] py-1.5 text-white/85">
                {r.reason}
              </td>
              <td className="border-b border-white/[0.04] py-1.5 text-right font-mono font-bold text-white">
                {r.lastSession}
              </td>
              <td
                className={
                  "border-b border-white/[0.04] py-1.5 text-right font-mono font-bold " +
                  (r.trendClass === "down"
                    ? "text-[#F49283]"
                    : r.trendClass === "up"
                      ? "text-[#6FCBA1]"
                      : "text-white")
                }
              >
                {r.hcpTrend}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
