import Link from "next/link";
import { STEPS } from "./copy";

interface StepperProps {
  current: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export function Stepper({ current }: StepperProps) {
  return (
    <nav className="stepper" id="stepper">
      {STEPS.map((s, i) => {
        const num = i + 1;
        const cls = ["step"];
        if (num === current) cls.push("active");
        if (num < current) cls.push("done");
        return (
          <Link key={s.path} href={s.path} className={cls.join(" ")} data-step={num}>
            <span className="step-num">{s.num}</span>
            <span className="step-label">{s.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
