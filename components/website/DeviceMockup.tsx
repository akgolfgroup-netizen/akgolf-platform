"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface DeviceMockupProps {
  imageSrc: string;
  alt?: string;
  className?: string;
}

export function DeviceMockup({ imageSrc, alt = "App preview", className = "" }: DeviceMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow effect behind device */}
      <div
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, rgba(184,151,92,0.4) 0%, transparent 70%)",
          transform: "translateY(10%)",
        }}
      />

      {/* 3D Device container with animation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Floating animation wrapper */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotateX: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* iPhone frame */}
          <div
            className="relative mx-auto"
            style={{
              width: "280px",
              transform: "rotateY(-5deg) rotateX(5deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Device body */}
            <div
              className="relative rounded-[40px] p-2 overflow-hidden"
              style={{
                background: "#1a1a1a",
                boxShadow: `
                  0 50px 100px -20px rgba(0,0,0,0.5),
                  0 30px 60px -30px rgba(0,0,0,0.6),
                  inset 0 1px 0 rgba(255,255,255,0.1),
                  inset 0 -1px 0 rgba(0,0,0,0.3)
                `,
              }}
            >
              {/* Dynamic Island / Notch */}
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
                style={{
                  width: "90px",
                  height: "28px",
                  background: "#000",
                  borderRadius: "14px",
                }}
              />

              {/* Screen */}
              <div
                className="relative rounded-[32px] overflow-hidden"
                style={{
                  aspectRatio: "9/19.5",
                  background: "#000",
                }}
              >
                {/* Screen content */}
                <Image
                  src={imageSrc}
                  alt={alt}
                  fill
                  className="object-cover object-top"
                  sizes="280px"
                />

                {/* Screen reflection overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
                  }}
                />
              </div>
            </div>

            {/* Side button (power) */}
            <div
              className="absolute right-[-2px] top-28"
              style={{
                width: "3px",
                height: "60px",
                background: "#2a2a2a",
                borderRadius: "0 2px 2px 0",
              }}
            />

            {/* Side buttons (volume) */}
            <div
              className="absolute left-[-2px] top-24"
              style={{
                width: "3px",
                height: "28px",
                background: "#2a2a2a",
                borderRadius: "2px 0 0 2px",
              }}
            />
            <div
              className="absolute left-[-2px] top-56"
              style={{
                width: "3px",
                height: "45px",
                background: "#2a2a2a",
                borderRadius: "2px 0 0 2px",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
