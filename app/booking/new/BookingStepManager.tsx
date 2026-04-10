"use client";

import { useState } from "react";
import { DateTimePicker } from "../components/DateTimePicker";
import { BookingPaymentForm } from "./BookingPaymentForm";

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  allowStripe: boolean;
  allowVipps: boolean;
}

interface Instructor {
  id: string;
  user: { name: string | null; image: string | null };
}

interface Props {
  serviceType: ServiceType;
  instructors: Instructor[];
  studentId: string;
}

export function BookingStepManager({ serviceType, instructors, studentId }: Props) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(
    instructors.length === 1 ? instructors[0] : null
  );

  // If time is selected, show payment form
  if (selectedTime && selectedInstructor) {
    return (
      <BookingPaymentForm
        serviceType={serviceType}
        instructor={{
          id: selectedInstructor.id,
          user: selectedInstructor.user,
        }}
        startTime={selectedTime}
        studentId={studentId}
      />
    );
  }

  // Show date/time picker with instructor tabs
  return (
    <div className="rounded-3xl p-8 max-w-2xl w-full border bg-white border-[#D5DFDB]">
      <DateTimePicker
        serviceTypeId={serviceType.id}
        instructorId={instructors[0]?.id ?? ""}
        instructors={instructors.map((i) => ({ id: i.id, name: i.user.name ?? "" }))}
        onSelect={(startTime) => {
          setSelectedTime(startTime);
          if (!selectedInstructor && instructors.length === 1) {
            setSelectedInstructor(instructors[0]);
          }
        }}
      />
    </div>
  );
}
