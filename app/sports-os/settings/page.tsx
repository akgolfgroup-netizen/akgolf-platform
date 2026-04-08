"use client";

import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const settingsGroups = [
  { icon: User, title: "Profile", description: "Manage your account details" },
  { icon: Bell, title: "Notifications", description: "Configure alert preferences" },
  { icon: Shield, title: "Privacy", description: "Control your data and visibility" },
];

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#333333]">Settings</h1>
        <p className="text-[#666666]">Manage your account and preferences</p>
      </div>

      <div className="grid gap-4">
        {settingsGroups.map((group) => (
          <Card key={group.title} className="p-5 bg-white border-[#e5e1d8] hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F5F1E8] rounded-xl flex items-center justify-center">
                <group.icon className="w-6 h-6 text-[#2D5A27]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#333333]">{group.title}</h3>
                <p className="text-sm text-[#666666]">{group.description}</p>
              </div>
            </div>
          </Card>
        ))}

        <Card className="p-5 bg-[#FEF2F2] border-[#FECACA]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FEE2E2] rounded-xl flex items-center justify-center">
              <LogOut className="w-6 h-6 text-[#DC2626]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#DC2626]">Sign Out</h3>
              <p className="text-sm text-[#666666]">Log out of your account</p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
