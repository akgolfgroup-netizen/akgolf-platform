import { cn } from "@/lib/portal/utils/cn";

type DivisionColor = "coaching" | "junior" | "gfgk";

interface DivisionDotProps {
  division: DivisionColor;
  className?: string;
}

const divisionColors: Record<DivisionColor, string> = {
  coaching: "bg-on-surface",
  junior: "bg-warning",
  gfgk: "bg-success",
};

export function DivisionDot({ division, className }: DivisionDotProps) {
  return (
    <span
      className={cn("w-2 h-2 rounded-sm", divisionColors[division], className)}
    />
  );
}

export function getDivisionBorderClass(division: DivisionColor): string {
  const borders: Record<DivisionColor, string> = {
    coaching: "border-l-black",
    junior: "border-l-warning",
    gfgk: "border-l-success",
  };
  return borders[division];
}
