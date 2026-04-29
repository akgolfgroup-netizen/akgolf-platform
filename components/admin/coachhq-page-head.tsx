import type { LucideIcon } from "lucide-react";

export type CoachHQAction = {
  label: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "accent";
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: CoachHQAction[];
};

const ACTION_CLASS: Record<NonNullable<CoachHQAction["variant"]>, string> = {
  default: "bg-white/[0.05] border-white/[0.08] text-white/90 hover:bg-white/[0.09]",
  primary: "bg-[#005840] border-[#005840] text-white font-semibold hover:bg-[#00422F]",
  accent: "bg-[#D1F843] border-[#D1F843] text-[#0A1F18] font-semibold hover:bg-[#C7EE3F]",
};

export function CoachHQPageHead({ eyebrow, title, description, actions }: Props) {
  return (
    <div
      className="mb-[22px] flex items-end justify-between gap-6 border-b pb-[18px]"
      style={{ borderColor: "#1a4a3a" }}
    >
      <div className="min-w-0">
        <div
          className="mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "#D1F843" }}
        >
          {eyebrow}
        </div>
        <h1 className="font-inter-tight text-[28px] font-bold leading-tight tracking-[-0.025em] text-white">
          {title}
        </h1>
        <p className="mt-1.5 max-w-[64ch] text-[13px] text-white/60">{description}</p>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex shrink-0 items-center gap-2.5">
          {actions.map((action) => {
            const Icon = action.icon;
            const variantClass = ACTION_CLASS[action.variant ?? "default"];
            return (
              <button
                key={action.label}
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] transition ${variantClass}`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
