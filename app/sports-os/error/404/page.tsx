"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error404Page() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-[#2D5A27] rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Zap className="w-12 h-12 text-[#DFFF00]" />
        </div>
        <h1 className="text-6xl font-bold text-[#2D5A27] mb-4">404</h1>
        <p className="text-xl text-[#666666] mb-2">Page not found</p>
        <Button className="bg-[#2D5A27] text-[#F5F1E8] font-bold">Go Back Home</Button>
      </div>
    </div>
  );
}
