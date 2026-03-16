"use client";

import type { HoleStrategy } from "../types";

function defaultHoles(): HoleStrategy[] {
  return Array.from({ length: 18 }, (_, i) => ({
    hole: i + 1,
    par: 4,
    targetScore: 4,
    keyShot: "",
    notes: "",
  }));
}

interface CourseStrategyGridProps {
  strategy: HoleStrategy[] | null;
  onChange: (strategy: HoleStrategy[]) => void;
}

export function CourseStrategyGrid({ strategy, onChange }: CourseStrategyGridProps) {
  const holes = strategy ?? defaultHoles();

  function updateHole(index: number, field: keyof HoleStrategy, value: string | number) {
    const updated = [...holes];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  const totalPar = holes.reduce((s, h) => s + h.par, 0);
  const totalTarget = holes.reduce((s, h) => s + h.targetScore, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--color-gold-muted)] uppercase tracking-wider">
          Banestrategi
        </span>
        <span className="text-xs text-[var(--color-gold-muted)]">
          Par {totalPar} · Mål {totalTarget}{" "}
          <span className={totalTarget - totalPar < 0 ? "text-green-400" : totalTarget - totalPar > 0 ? "text-red-400" : ""}>
            ({totalTarget - totalPar > 0 ? "+" : ""}{totalTarget - totalPar})
          </span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-[var(--color-gold-dim)] uppercase tracking-wider">
              <th className="text-left py-1 px-1 w-10">Hull</th>
              <th className="text-center py-1 px-1 w-12">Par</th>
              <th className="text-center py-1 px-1 w-12">Mål</th>
              <th className="text-left py-1 px-1">Nøkkelslag</th>
              <th className="text-left py-1 px-1">Notater</th>
            </tr>
          </thead>
          <tbody>
            {holes.map((hole, i) => (
              <tr key={hole.hole} className="border-t border-[var(--color-border)]">
                <td className="py-1.5 px-1 font-semibold text-[var(--color-snow)]">{hole.hole}</td>
                <td className="py-1.5 px-1">
                  <select
                    value={hole.par}
                    onChange={(e) => updateHole(i, "par", parseInt(e.target.value))}
                    className="w-full bg-transparent text-[var(--color-snow)] text-center outline-none"
                  >
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </td>
                <td className="py-1.5 px-1">
                  <input
                    type="number"
                    value={hole.targetScore}
                    onChange={(e) => updateHole(i, "targetScore", parseInt(e.target.value) || hole.par)}
                    className="w-full bg-transparent text-[var(--color-snow)] text-center outline-none"
                  />
                </td>
                <td className="py-1.5 px-1">
                  <input
                    type="text"
                    value={hole.keyShot}
                    onChange={(e) => updateHole(i, "keyShot", e.target.value)}
                    placeholder="Driver midt, 7j green..."
                    className="w-full bg-transparent text-[var(--color-snow)] outline-none placeholder:text-[var(--color-gold-muted)]/30"
                  />
                </td>
                <td className="py-1.5 px-1">
                  <input
                    type="text"
                    value={hole.notes}
                    onChange={(e) => updateHole(i, "notes", e.target.value)}
                    placeholder="Vann høyre..."
                    className="w-full bg-transparent text-[var(--color-snow)] outline-none placeholder:text-[var(--color-gold-muted)]/30"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
