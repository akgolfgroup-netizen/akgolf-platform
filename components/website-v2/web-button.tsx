import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "dark" | "ghost" | "line";
type Size = "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

interface LinkProps extends BaseProps {
  href: string;
  onClick?: never;
  type?: never;
}

interface ButtonProps
  extends BaseProps,
    Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> {
  href?: never;
}

type WebButtonProps = LinkProps | ButtonProps;

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-[var(--akgolf-accent,#D1F843)] text-[#0A1F18] hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(209,248,67,0.35)]",
  dark: "bg-[var(--akgolf-ink,#0A1F18)] text-white hover:-translate-y-px hover:bg-[#112e22]",
  ghost:
    "bg-white/20 text-white border-white/55 backdrop-blur-md hover:bg-white/30 md:bg-white/10 md:border-white/30 md:hover:bg-white/20",
  line: "bg-transparent text-[var(--akgolf-ink,#0A1F18)] border-[rgba(10,31,24,0.20)] hover:bg-[var(--akgolf-ink,#0A1F18)] hover:text-white",
};

const SIZE_CLASS: Record<Size, string> = {
  md: "py-3.5 px-[26px] text-sm",
  lg: "py-[18px] px-8 text-[15px]",
};

export function WebButton(props: WebButtonProps) {
  const {
    variant = "primary",
    size = "md",
    children,
    className = "",
  } = props;

  const cls = `inline-flex items-center gap-2.5 rounded-full font-bold tracking-[-0.005em] border border-transparent transition-all duration-200 cursor-pointer ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }

  const { href: _h, ...buttonRest } = props as ButtonProps & { href?: undefined };
  return (
    <button {...buttonRest} className={cls}>
      {children}
    </button>
  );
}
