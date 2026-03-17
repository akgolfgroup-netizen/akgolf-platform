"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SectionProps {
  variant?: "light" | "dark" | "warm" | "cream";
  isAnimated?: boolean;
  containerSize?: "default" | "small" | "large";
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

const variants = {
  light: "bg-surface-warm",
  dark: "bg-deep-ink text-white",
  warm: "bg-warm-neutral",
  cream: "bg-surface-cream",
};

const containerSizes = {
  default: "max-w-6xl",
  small: "max-w-4xl",
  large: "max-w-7xl",
};

export function Section({
  children,
  variant = "light",
  isAnimated = false,
  containerSize = "default",
  className,
  id,
}: SectionProps) {
  const baseClasses = cn(
    "py-20 md:py-28 lg:py-32",
    variants[variant],
    className
  );

  const content = (
    <div className={cn("w-container mx-auto", containerSizes[containerSize])}>
      {children}
    </div>
  );

  if (isAnimated) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={baseClasses}
        id={id}
      >
        {content}
      </motion.section>
    );
  }

  return <section className={baseClasses} id={id}>{content}</section>;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={cn("mb-12 md:mb-16", alignClasses[align], className)}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gold mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-ink-50 max-w-2xl mx-auto">{description}</p>
      )}
      <div className={cn("mt-6", align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : "")}>
        <div className="w-12 h-1 bg-gold rounded-full" />
      </div>
    </div>
  );
}
