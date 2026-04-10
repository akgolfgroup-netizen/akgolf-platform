"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar, Check, Menu, X, ArrowLeft } from "lucide-react";

interface BookingNavSidebarProps {
  currentStep: 1 | 2 | 3;
  serviceTypeId?: string;
  instructorId?: string;
  startTime?: string;
  serviceName?: string;
  servicePrice?: number;
  isPriceMonthly?: boolean;
}

const steps = [
  { num: 1, label: "Coaching", href: "/booking/select-service" },
  { num: 2, label: "Tid", href: "/booking/date-time" },
  { num: 3, label: "Betal", href: "/booking/review-confirm" },
];

export function BookingNavSidebar({
  currentStep,
  serviceTypeId,
  instructorId,
  startTime,
  serviceName,
  servicePrice,
  isPriceMonthly,
}: BookingNavSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getHref = (step: typeof steps[0]) => {
    if (step.num === 1) return step.href;
    if (step.num === 2 && serviceTypeId) return `${step.href}?serviceTypeId=${serviceTypeId}`;
    if (step.num === 3 && serviceTypeId && instructorId && startTime) {
      return `${step.href}?serviceTypeId=${serviceTypeId}&instructorId=${instructorId}&startTime=${encodeURIComponent(startTime)}`;
    }
    return undefined;
  };

  const formatPrice = () => {
    if (servicePrice === undefined) return null;
    if (servicePrice === 0) return "Gratis";
    return `${servicePrice.toLocaleString("nb-NO")} kr${isPriceMonthly ? "/mnd" : ""}`;
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-white font-bold text-lg tracking-tight">
            AK Golf
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="bg-primary border-t border-white/10 px-4 py-4">
            <nav className="space-y-1">
              {steps.map((step) => {
                const isActive = step.num === currentStep;
                const isCompleted = step.num < currentStep;
                const href = getHref(step);

                return (
                  <div key={step.num}>
                    {href && !isActive ? (
                      <Link
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium uppercase text-xs transition-all ${
                          isCompleted
                            ? "text-accent-cta bg-white/10"
                            : "text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            isCompleted
                              ? "bg-accent-cta text-primary"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {isCompleted ? <Check size={14} /> : step.num}
                        </div>
                        {step.label}
                      </Link>
                    ) : (
                      <div
                        className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium uppercase text-xs ${
                          isActive
                            ? "bg-accent-cta text-primary"
                            : "text-white/40"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            isActive
                              ? "bg-primary text-accent-cta"
                              : "bg-white/10 text-white/40"
                          }`}
                        >
                          {step.num}
                        </div>
                        {step.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Mobile Service Info */}
            {serviceName && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/40 text-[10px] font-mono uppercase mb-1">Valgt pakke</p>
                <p className="text-white font-semibold text-sm">{serviceName}</p>
                {servicePrice !== undefined && (
                  <p className="text-accent-cta text-xs">{formatPrice()}</p>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 bg-primary flex-col py-8 z-40">
        {/* Logo */}
        <div className="px-6 mb-10">
          <Link href="/" className="block group">
            <span className="text-white font-black text-xl tracking-tight group-hover:text-accent-cta transition-colors">
              AK Golf
            </span>
            <span className="block text-white/50 font-medium uppercase text-[10px] tracking-widest mt-1">
              Academy
            </span>
          </Link>
        </div>

        {/* Back to main site link */}
        <div className="px-6 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-medium uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            Tilbake til forsiden
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4">
          {steps.map((step) => {
            const isActive = step.num === currentStep;
            const isCompleted = step.num < currentStep;
            const href = getHref(step);

            return (
              <div key={step.num}>
                {href && !isActive ? (
                  <Link
                    href={href}
                    className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium uppercase text-xs transition-all ${
                      isCompleted
                        ? "text-accent-cta hover:bg-white/10"
                        : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                        isCompleted
                          ? "bg-accent-cta text-primary"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {isCompleted ? <Check size={16} /> : step.num}
                    </div>
                    {step.label}
                  </Link>
                ) : (
                  <div
                    className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium uppercase text-xs ${
                      isActive
                        ? "bg-accent-cta text-primary"
                        : "text-white/40"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                        isActive
                          ? "bg-primary text-accent-cta ring-2 ring-primary"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {step.num}
                    </div>
                    {step.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Selected Service Info */}
        <div className="px-6 mt-auto">
          {serviceName ? (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/40 text-[10px] font-mono uppercase mb-2">Valgt pakke</p>
              <p className="text-white font-semibold text-sm leading-tight">{serviceName}</p>
              {servicePrice !== undefined && (
                <p className="text-accent-cta text-xs mt-1">{formatPrice()}</p>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/40 text-[10px] font-mono uppercase mb-1">Steg {currentStep} av 3</p>
              <p className="text-white/70 text-xs">Velg coaching for å fortsette</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Spacer */}
      <div className="lg:hidden h-14" />
    </>
  );
}
