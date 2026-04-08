"use client";

import { motion } from "framer-motion";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  { icon: Users, label: "Total Players", value: "156", trend: "+12" },
  { icon: Calendar, label: "Sessions Today", value: "24", trend: "+3" },
  { icon: DollarSign, label: "Revenue", value: "kr 45,200", trend: "+8%" },
  { icon: TrendingUp, label: "Utilization", value: "89%", trend: "+5%" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Admin Dashboard</h1>
          <p className="text-[#666666]">Overview of your academy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-5 bg-white border-[#e5e1d8]">
              <stat.icon className="w-5 h-5 text-[#2D5A27] mb-2" />
              <p className="text-2xl font-bold text-[#333333]">{stat.value}</p>
              <p className="text-xs text-[#2D5A27]">+{stat.trend}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
