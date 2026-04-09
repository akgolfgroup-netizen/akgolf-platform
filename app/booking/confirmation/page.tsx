"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Confirmation() {
  return (
    <div className="min-h-screen bg-[#f7f3ea] flex items-center justify-center p-4">
      <Card className="p-8 bg-white border-[#154212]/10 text-center max-w-md">
        <div className="w-20 h-20 bg-[#154212] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#d2f000]" />
        </div>
        <h1 className="text-2xl font-bold text-[#154212] mb-2">Booking bekreftet!</h1>
        <Button className="mt-6 w-full bg-[#154212] text-white">Gå til dashboard</Button>
      </Card>
    </div>
  );
}
