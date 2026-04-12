"use client";

import { motion } from "framer-motion";
import { Clock, User, ChevronRight, ArrowLeft } from "lucide-react";
import { type ServiceType, type InstructorOption, formatPrice } from "./booking-types";

interface ServiceSelectorProps {
  services: ServiceType[];
  onSelect: (svc: ServiceType) => void;
  instructorMode?: boolean;
  selectedService?: ServiceType;
  onSelectInstructor?: (inst: InstructorOption) => void;
  onBack?: () => void;
}

export function ServiceSelector({
  services,
  onSelect,
  instructorMode,
  selectedService,
  onSelectInstructor,
  onBack,
}: ServiceSelectorProps) {
  if (instructorMode && selectedService && onSelectInstructor) {
    return (
      <InstructorList
        service={selectedService}
        onSelect={onSelectInstructor}
        onBack={onBack}
      />
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-3 text-[var(--color-grey-900)]">
          Velg din treningsform
        </h2>
        <p className="text-[var(--color-muted)]">
          Alle coaching-timer inkluderer TrackMan-analyse og personlig tilpasning
        </p>
      </div>

      <div className="space-y-4">
        {services.map((svc, i) => (
          <motion.button
            key={svc.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(svc)}
            className="
              w-full text-left group rounded-2xl p-6
              bg-white border border-[var(--color-grey-200)]
              shadow-sm hover:shadow-md hover:border-[var(--color-grey-900)]
              transition-all duration-200
            "
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: svc.color ?? "var(--color-primary)" }}
                  />
                  <h3 className="text-lg font-semibold text-[var(--color-grey-900)] truncate">
                    {svc.name}
                  </h3>
                </div>
                {svc.description && (
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-3 line-clamp-2">
                    {svc.description}
                  </p>
                )}
                <div className="flex items-center gap-5 text-sm text-[var(--color-grey-400)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                    {svc.duration} min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[var(--color-primary)]" />
                    {svc.maxStudents === 1 ? "Individuell" : `Gruppe (maks ${svc.maxStudents})`}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-semibold text-[var(--color-grey-900)]">
                  {formatPrice(svc.price)}
                </span>
                <ChevronRight className="w-5 h-5 mt-2 ml-auto text-[var(--color-grey-900)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── Instructor sub-view ─── */

function InstructorList({
  service,
  onSelect,
  onBack,
}: {
  service: ServiceType;
  onSelect: (inst: InstructorOption) => void;
  onBack?: () => void;
}) {
  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm mb-6 text-[var(--color-muted)] hover:text-[var(--color-grey-900)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake
        </button>
      )}

      <h2 className="text-3xl font-semibold mb-2 text-[var(--color-grey-900)]">
        Velg instruktoer
      </h2>
      <p className="text-[var(--color-muted)] mb-8">{service.name}</p>

      <div className="space-y-4">
        {service.instructors.map((inst, i) => (
          <motion.button
            key={inst.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(inst)}
            className="
              w-full text-left group rounded-2xl p-5
              flex items-center gap-5
              bg-white border border-[var(--color-grey-200)]
              shadow-sm hover:shadow-md hover:border-[var(--color-grey-900)]
              transition-all duration-200
            "
          >
            {inst.user.image ? (
              <img
                src={inst.user.image}
                alt=""
                className="w-14 h-14 rounded-xl object-cover border-2 border-[var(--color-grey-200)]"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold bg-[var(--color-grey-900)] text-white">
                {inst.user.name?.charAt(0) ?? "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-[var(--color-grey-900)]">
                {inst.user.name}
              </h3>
              {inst.title && (
                <p className="text-sm text-[var(--color-muted)]">{inst.title}</p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-grey-900)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
