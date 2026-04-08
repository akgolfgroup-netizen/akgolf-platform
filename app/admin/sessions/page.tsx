"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sessions = [
  { time: "09:00", player: "Ola Nordmann", coach: "Anders", type: "Coaching" },
  { time: "10:00", player: "Kari Hansen", coach: "Anders", type: "Trackman" },
  { time: "14:00", player: "Per Olsen", coach: "Anders", type: "Coaching" },
];

export default function AdminSessions() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#333333]">Sessions</h1>
        <Button className="bg-[#DFFF00] text-[#2D5A27] font-bold">+ Ny booking</Button>
      </div>
      <div className="space-y-4">
        {sessions.map((s) => (
          <Card key={s.time} className="p-4 bg-white border-[#e5e1d8] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[#2D5A27]">{s.time}</span>
              <div>
                <p className="font-bold text-[#333333]">{s.player}</p>
                <p className="text-sm text-[#666666]">{s.coach} • {s.type}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
