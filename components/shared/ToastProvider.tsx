"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: "13px",
          borderRadius: "12px",
          border: "1px solid #E5E3DD",
          boxShadow:
            "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
          color: "#0A1F18",
          background: "#FFFFFF",
        },
        classNames: {
          success: "!border-[#1A7D56]/20 !bg-[#E5F1EA]",
          error: "!border-[#A32D2D]/20 !bg-[#FAE3E3]",
          warning: "!border-[#B8852A]/20 !bg-[#FFF0D6]",
        },
      }}
    />
  );
}
