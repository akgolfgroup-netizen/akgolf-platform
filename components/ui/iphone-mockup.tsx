"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface IPhoneMockupProps {
  children?: React.ReactNode;
  imageSrc?: string;
  className?: string;
  width?: number;
}

export function IPhoneMockup({
  children,
  imageSrc,
  className = "",
  width = 375,
}: IPhoneMockupProps) {
  const height = width * 2.16;
  const borderRadius = width * 0.15;
  const bezelWidth = width * 0.032;
  const dynamicIslandWidth = width * 0.32;
  const dynamicIslandHeight = width * 0.095;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("relative", className)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div
        className="relative bg-iphone-frame shadow-2xl"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: `${borderRadius}px`,
          padding: `${bezelWidth}px`,
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{
            width: `${dynamicIslandWidth}px`,
            height: `${dynamicIslandHeight}px`,
            marginTop: `${bezelWidth * 1.5}px`,
            borderRadius: `${dynamicIslandHeight / 2}px`,
            background: "var(--color-black)",
          }}
        />

        {/* Right side buttons */}
        <div
          className="absolute top-0 right-0 w-[3px] bg-iphone-button rounded-r-sm"
          style={{
            height: `${width * 0.16}px`,
            marginTop: `${width * 0.24}px`,
            marginRight: "-3px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[3px] bg-iphone-button rounded-r-sm"
          style={{
            height: `${width * 0.13}px`,
            marginTop: `${width * 0.44}px`,
            marginRight: "-3px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[3px] bg-iphone-button rounded-r-sm"
          style={{
            height: `${width * 0.13}px`,
            marginTop: `${width * 0.59}px`,
            marginRight: "-3px",
          }}
        />

        {/* Left side buttons */}
        <div
          className="absolute top-0 left-0 w-[3px] bg-iphone-button rounded-l-sm"
          style={{
            height: `${width * 0.08}px`,
            marginTop: `${width * 0.18}px`,
            marginLeft: "-3px",
          }}
        />
        <div
          className="absolute top-0 left-0 w-[3px] bg-iphone-button rounded-l-sm"
          style={{
            height: `${width * 0.16}px`,
            marginTop: `${width * 0.32}px`,
            marginLeft: "-3px",
          }}
        />
        <div
          className="absolute top-0 left-0 w-[3px] bg-iphone-button rounded-l-sm"
          style={{
            height: `${width * 0.16}px`,
            marginTop: `${width * 0.5}px`,
            marginLeft: "-3px",
          }}
        />

        {/* Screen */}
        <div
          className="relative w-full h-full bg-black overflow-hidden"
          style={{
            borderRadius: `${borderRadius - bezelWidth}px`,
          }}
        >
          {imageSrc && !children && (
            <Image
              src={imageSrc}
              alt="iPhone screen content"
              fill
              sizes="300px"
              className="object-cover object-top"
            />
          )}
          {children && (
            <div className="w-full h-full overflow-auto">{children}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
