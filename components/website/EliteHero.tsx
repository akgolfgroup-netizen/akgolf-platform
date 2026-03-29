"use client";

import { ArrowRight, Play, Users, Smartphone, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface EliteHeroProps {
  onWatchVideo?: () => void;
}

export function EliteHero({ onWatchVideo }: EliteHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-grey-100 to-white" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-grey-200 opacity-50 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-grey-100 opacity-50 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-grey-100 border border-grey-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-sm font-medium text-black">
                Alt-i-ett golfplattform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-[1.1] mb-6">
              Coaching.{" "}
              <span className="text-grey-500">Teknologi.</span>{" "}
              Resultater.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-grey-500 mb-8 max-w-xl leading-relaxed">
              Fra personlig coaching til enterprise-løsninger for klubber.
              Vi leverer verktøyene som gjør norske golfere bedre.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/portal/login"
                className="w-btn w-btn-primary"
              >
                Start din treningsreise
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={onWatchVideo}
                className="w-btn w-btn-secondary"
              >
                <Play className="w-4 h-4" />
                Se hvordan det fungerer
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-6 text-sm text-grey-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-black" />
                <span>500+ aktive spillere</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-black" />
                <span>12 klubber</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Bento preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-4 gap-4">
              {/* Coaching card */}
              <div className="col-span-2 w-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-grey-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Personlig Coaching</h3>
                    <p className="text-xs text-grey-500">1-til-1 og gruppetrening</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-xs rounded-md bg-grey-100 text-black">Academy</span>
                  <span className="px-2 py-1 text-xs rounded-md bg-grey-100 text-black">Junior</span>
                </div>
              </div>

              {/* Apps card */}
              <div className="col-span-2 w-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-grey-100 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Spillerportal</h3>
                    <p className="text-xs text-grey-500">Treningsdagbok & analyse</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-xs rounded-md bg-grey-100 text-black">Gratis</span>
                  <span className="px-2 py-1 text-xs rounded-md bg-grey-100 text-black">Pro</span>
                </div>
              </div>

              {/* B2B card - full width */}
              <div className="col-span-4 w-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-grey-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">For Klubber</h3>
                      <p className="text-xs text-grey-500">Sportsplaner, treningssystemer, booking</p>
                    </div>
                  </div>
                  <Link
                    href="/b2b"
                    className="px-4 py-2 text-sm font-medium text-grey-500 hover:text-black transition-colors"
                  >
                    Les mer
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
