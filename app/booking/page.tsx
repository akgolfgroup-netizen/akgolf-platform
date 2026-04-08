"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, Check, Calendar, Clock, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  { id: 1, label: "Service", icon: User },
  { id: 2, label: "Time", icon: Calendar },
  { id: 3, label: "Details", icon: User },
  { id: 4, label: "Payment", icon: CreditCard },
];

const services = [
  { id: 1, name: "20-Min Quick Fix", duration: 20, price: 450, description: "Rask analyse av ett spesifikt problem" },
  { id: 2, name: "Trackman Analysis", duration: 60, price: 1200, description: "Full svinganalyse med Trackman 4" },
  { id: 3, name: "Coaching Session", duration: 90, price: 1500, description: "Komplett coaching session med video" },
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? "bg-[#2D5A27] text-[#F5F1E8]" : "bg-[#e5e1d8] text-[#666666]"
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${currentStep > step.id ? "bg-[#2D5A27]" : "bg-[#e5e1d8]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 bg-white border-[#e5e1d8]">
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-bold text-[#333333] mb-2">Velg tjeneste</h1>
              <p className="text-[#666666] mb-6">Hva ønsker du å booke?</p>
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedService === service.id
                        ? "border-[#2D5A27] bg-[#F5F1E8]"
                        : "border-[#e5e1d8] hover:border-[#2D5A27]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#333333]">{service.name}</h3>
                        <p className="text-sm text-[#666666]">{service.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-[#666666]">
                          <Clock className="w-4 h-4" />
                          {service.duration} min
                        </div>
                      </div>
                      <span className="text-xl font-bold text-[#2D5A27]">kr {service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={() => setCurrentStep(1)} className="flex items-center text-[#666666] mb-4">
                <ChevronLeft className="w-4 h-4" /> Tilbake
              </button>
              <h1 className="text-2xl font-bold text-[#333333] mb-2">Velg tid</h1>
              <p className="text-[#666666] mb-6">Når passer det?</p>
              <div className="grid grid-cols-4 gap-2">
                {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((time) => (
                  <button
                    key={time}
                    className="p-3 rounded-xl border border-[#e5e1d8] hover:border-[#2D5A27] hover:bg-[#F5F1E8] text-[#333333] font-medium transition-all"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 1 && !selectedService}
              className="bg-[#2D5A27] hover:bg-[#1a3d16] text-[#F5F1E8] font-bold"
            >
              Neste
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
