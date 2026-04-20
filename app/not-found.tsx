"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Icon } from "@/components/ui/icon";
import { GlassPanel } from "@/components/portal/patterns/glass-panel";
import { MonoLabel } from "@/components/portal/patterns/mono-label";
import { NightSurface } from "@/components/portal/patterns/night-surface";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <NightSurface variant="ambient" className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassPanel variant="dark" padding="lg" className="text-center">
          <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="search_off" size={32} className="text-error-container" />
          </div>

          <MonoLabel size="xs" uppercase className="text-[#F2F5F1]/40 block mb-2">
            404 — Not Found
          </MonoLabel>

          <h1 className="text-2xl font-bold text-[#F2F5F1] mb-2">
            Siden finnes ikke
          </h1>
          <p className="text-[#F2F5F1]/60 mb-8">
            Beklager, vi fant ikke siden du leter etter. Den kan ha blitt flyttet eller slettet.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-secondary-fixed hover:bg-secondary-fixed/90 text-on-secondary-fixed font-bold py-3 rounded-xl transition-all"
          >
            <Icon name="home" size={18} />
            Tilbake til forsiden
          </Link>
        </GlassPanel>
      </motion.div>
    </NightSurface>
  );
}
