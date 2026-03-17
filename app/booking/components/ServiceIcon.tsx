"use client";

import { 
  User, 
  Users, 
  GraduationCap, 
  Monitor, 
  MapPin,
  type LucideIcon 
} from "lucide-react";

export type ServiceCategory = 
  | "INDIVIDUAL" 
  | "GROUP" 
  | "VTG_COURSE" 
  | "SIMULATOR" 
  | "PLAYING_LESSON";

interface ServiceIconProps {
  category: string;
  size?: number;
  className?: string;
}

const ICON_CONFIG: Record<ServiceCategory, { icon: LucideIcon; label: string }> = {
  INDIVIDUAL: { icon: User, label: "Individuell" },
  GROUP: { icon: Users, label: "Gruppe" },
  VTG_COURSE: { icon: GraduationCap, label: "Kurs" },
  SIMULATOR: { icon: Monitor, label: "Simulator" },
  PLAYING_LESSON: { icon: MapPin, label: "Banecoaching" },
};

export function ServiceIcon({ category, size = 24, className = "" }: ServiceIconProps) {
  const config = ICON_CONFIG[category as ServiceCategory] || ICON_CONFIG.INDIVIDUAL;
  const Icon = config.icon;

  return (
    <div 
      className={`flex items-center justify-center rounded-xl bg-gold/10 ${className}`}
      style={{ width: size * 1.5, height: size * 1.5 }}
    >
      <Icon size={size} className="text-gold" />
    </div>
  );
}

export function getServiceCategoryLabel(category: string): string {
  return ICON_CONFIG[category as ServiceCategory]?.label || category;
}
