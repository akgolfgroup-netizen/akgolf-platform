"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Confirmation() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4">
      <Card className="p-8 bg-white border-[#e5e1d8] text-center max-w-md">
        <div className="w-20 h-20 bg-[#2D5A27] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#DFFF00]" />
        </div>
        <h1 className="text-2xl font-bold text-[#333333] mb-2">Booking bekreftet!</h1>
        <Button className="mt-6 w-full bg-[#2D5A27] text-[#F5F1E8]">Gå til dashboard</Button>
      </Card>
    </div>
  );
}
