import { Check } from "lucide-react";
import { PERMISSION_HEADERS, PERMISSION_ROWS } from "./mock-data";

export function PermissionsTable() {
  return (
    <section className="rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] px-[26px] py-[22px]">
      <h3 className="mb-4 text-[15px] font-bold text-white">
        Roller &amp; rettigheter
      </h3>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className="border-b border-[#1a4a3a] p-2.5 text-left font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/50">
              Funksjon
            </th>
            {PERMISSION_HEADERS.map((h) => (
              <th
                key={h}
                className="border-b border-[#1a4a3a] p-2.5 text-center font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/50"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERMISSION_ROWS.map((row) => (
            <tr key={row.feature}>
              <td className="border-b border-white/[0.04] py-2.5 text-left font-semibold text-white">
                {row.feature}
                <small className="mt-px block font-mono text-[9.5px] font-medium tracking-[0.04em] text-white/50">
                  {row.meta}
                </small>
              </td>
              {row.cells.map((checked, i) => (
                <td
                  key={i}
                  className="border-b border-white/[0.04] p-2.5 text-center"
                >
                  {checked ? (
                    <span className="inline-grid h-[18px] w-[18px] place-items-center rounded-full bg-[#2A7D5A]/30 text-[#6FCBA1]">
                      <Check className="h-[11px] w-[11px]" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="text-[14px] text-white/25">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
