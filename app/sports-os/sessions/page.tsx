"use client";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, User, Video, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const sessions = [
  { id: 1, time: "09:00", duration: 20, player: "Ola Nordmann", type: "Swing Analysis", location: "Simulator 1", status: "confirmed" },
  { id: 2, time: "10:30", duration: 20, player: "Kari Hansen", type: "Trackman Session", location: "Simulator 2", status: "confirmed" },
  { id: 3, time: "14:00", duration: 60, player: "Per Olsen", type: "Full Coaching", location: "Range", status: "pending" },
  { id: 4, time: "16:00", duration: 20, player: "Mari Johansen", type: "Putting Tune-Up", location: "Putting Green", status: "confirmed" },
];

export default function SessionsPage() {
  const [selectedDate, setSelectedDate] = useState(15);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Sessions</h1>
          <p className="text-[#666666]">Manage your coaching schedule</p>
        </div>
        <Button className="bg-[#DFFF00] hover:bg-[#c8e600] text-[#2D5A27] font-bold">
          <Plus className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <Card className="p-6 bg-white border-[#e5e1d8]">
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-[#F5F1E8] rounded-lg">
                <ChevronLeft className="w-5 h-5 text-[#666666]" />
              </button>
              <h2 className="font-bold text-[#333333]">April 2026</h2>
              <button className="p-2 hover:bg-[#F5F1E8] rounded-lg">
                <ChevronRight className="w-5 h-5 text-[#666666]" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day) => (
                <div key={day} className="text-center text-xs text-[#666666] font-medium py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium ${
                    date === selectedDate ? "bg-[#2D5A27] text-[#F5F1E8]" : "hover:bg-[#F5F1E8] text-[#333333]"
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Card className="p-6 bg-white border-[#e5e1d8]">
            <h2 className="text-xl font-bold text-[#333333] mb-4">Tuesday, April {selectedDate}</h2>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 rounded-xl border border-[#e5e1d8] hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="font-bold text-[#333333]">{session.time}</p>
                        <p className="text-xs text-[#666666]">{session.duration} min</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#333333]">{session.player}</p>
                        <p className="text-sm text-[#666666]">{session.type}</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-[#2D5A27] text-[#F5F1E8]">Start</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
