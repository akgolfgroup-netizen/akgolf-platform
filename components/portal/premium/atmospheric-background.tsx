"use client";

import { motion } from "framer-motion";

/**
 * AtmosphericBackground — aurora glow + grain noise som bakgrunn for
 * alle premium-portalsider. Fixed position slik at den scroller ikke.
 */
export function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Primary aurora glow (topp-hoyre) */}
      <motion.div
        className="absolute top-[-20%] right-[-10%] w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,88,64,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Accent aurora glow (bunn-venstre) */}
      <motion.div
        className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(209,248,67,0.12) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grain noise */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
