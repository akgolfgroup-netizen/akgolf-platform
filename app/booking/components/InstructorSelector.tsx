"use client";

import { StepHeader } from "./StepHeader";
import { InstructorCard } from "./InstructorCard";
import type { Instructor, ServiceType } from "../types";

interface Props {
  service: ServiceType;
  instructors: Instructor[];
  onSelect: (instructor: Instructor) => void;
}

export function InstructorSelector({ service, instructors, onSelect }: Props) {
  return (
    <div>
      <StepHeader
        eyebrow="Steg 2"
        heading="Velg trener"
        description={`Hvem vil du ha som instruktør for ${service.name.toLowerCase()}?`}
      />

      <div className="grid gap-4 max-w-2xl">
        {instructors.map((instructor, index) => (
          <InstructorCard
            key={instructor.id}
            instructor={instructor}
            isSelected={false}
            onClick={() => onSelect(instructor)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
