"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Confirmation() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="p-8 bg-white border-primary/10 text-center max-w-md">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-accent-cta" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Booking bekreftet!</h1>
        <Button className="mt-6 w-full bg-primary text-white">Gå til dashboard</Button>
      </Card>
    </div>
  );
}
