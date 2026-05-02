"use client";

import Link from "next/link";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * PortalButton — eneste knappe-komponent for PlayerHQ og CoachHQ.
 *
 * Brand Guide V2.0:
 * - primary  : Mork gronn (#005840) bg, hvit tekst — hovedhandling
 * - accent   : Lime (#D1F843) bg, mork tekst — primaer CTA "next step"
 * - outline  : Transparent bg, line border, ink tekst — sekundaer
 * - ghost    : Transparent, ingen border, ink-muted tekst — tertier
 * - dark     : Sidebar-mork (#0F1F18) bg, hvit tekst — for lyse flater
 * - danger   : Rod (#B84233) bg, hvit tekst — destruktiv
 *
 * Storrelser:
 * - sm:  32px hoyde, 12px tekst — for tabeller / kompakt
 * - md:  40px hoyde, 14px tekst — default
 * - lg:  48px hoyde, 15px tekst — hero-CTA
 *
 * Touch-target: alle stoerrelser >= 32px (sm) til 48px (lg). Mobile UX OK.
 */

type Variant =
  | "primary"
  | "accent"
  | "outline"
  | "ghost"
  | "dark"
  | "danger";

type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary,#005840)] text-white hover:bg-[var(--color-primary-hover,#00472f)] active:scale-[0.98]",
  accent:
    "bg-[var(--color-accent,#D1F843)] text-[var(--color-ink,#0A1F18)] hover:bg-[var(--color-accent-deep,#A6C734)] active:scale-[0.98]",
  outline:
    "bg-transparent text-[var(--color-ink,#0A1F18)] border border-[var(--color-line,#E4EAE6)] hover:border-[var(--color-primary,#005840)] hover:text-[var(--color-primary,#005840)] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--color-ink-muted,#5C6B62)] hover:bg-[var(--color-surface-soft,#EDF1EE)] hover:text-[var(--color-ink,#0A1F18)] active:scale-[0.98]",
  dark:
    "bg-[var(--color-sidebar,#0F1F18)] text-white hover:bg-[var(--color-sidebar-hover,#172B22)] active:scale-[0.98]",
  danger:
    "bg-[var(--color-danger,#B84233)] text-white hover:opacity-90 active:scale-[0.98]",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-5 text-[15px] gap-2 rounded-xl",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center font-bold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary,#005840)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

interface ButtonProps
  extends BaseProps,
    Omit<ComponentPropsWithoutRef<"button">, "children"> {
  href?: undefined;
  children: ReactNode;
}

interface LinkProps extends BaseProps {
  href: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

type Props = ButtonProps | LinkProps;

function buildClassName(
  variant: Variant,
  size: Size,
  fullWidth: boolean,
  extra?: string,
): string {
  return [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? "w-full" : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin -ml-0.5 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export const PortalButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  Props
>(function PortalButton(props, ref) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    children,
  } = props;

  const cls = buildClassName(variant, size, fullWidth, props.className);

  const content = (
    <>
      {loading ? <LoadingSpinner /> : leadingIcon}
      <span>{children}</span>
      {!loading && trailingIcon}
    </>
  );

  if ("href" in props && props.href) {
    const { href, external, onClick } = props;
    if (external) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          onClick={onClick}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cls}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  const { className: _className, ...buttonProps } = props as ButtonProps;
  void _className;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cls}
      disabled={loading || buttonProps.disabled}
      {...buttonProps}
    >
      {content}
    </button>
  );
});
