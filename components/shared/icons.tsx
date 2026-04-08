"use client";

import {
  ArrowRight,
  TrendingUp,
  Calendar,
  MapPin,
  CheckCircle,
  Mail,
  Smartphone,
  CreditCard,
  Check,
  User,
  Clock,
  Timer,
  Flag,
  Info,
  Shield,
  CalendarCheck,
  BadgeCheck,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Menu,
  X,
  Globe,
  Target,
  Dumbbell,
  PersonStanding,

  Search,
  Receipt,
  CalendarDays,
  ChevronDown,
  Star,
  Rocket,
  Sparkles,
  AlertCircle,
  Download,
  ArrowLeft,
  Play,
  Settings,
  LogOut,
  Plus,
  Minus,
  Trash2,
  Edit,
  MoreVertical,
  Filter,
  SearchIcon,
  Bell,
  Home,
  BarChart3,
  Trophy,
  BookOpen,
  LayoutDashboard,
  CalendarX,
  type LucideIcon,
} from "lucide-react";

// Map of icon names to Lucide components
export const iconMap: Record<string, LucideIcon> = {
  // Navigation
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  menu: Menu,
  close: X,
  
  // UI
  check: Check,
  checkCircle: CheckCircle,
  info: Info,
  alertCircle: AlertCircle,
  moreVertical: MoreVertical,
  filter: Filter,
  search: SearchIcon,
  bell: Bell,
  settings: Settings,
  logOut: LogOut,
  plus: Plus,
  minus: Minus,
  trash: Trash2,
  edit: Edit,
  download: Download,
  play: Play,
  
  // Content
  mail: Mail,
  globe: Globe,
  send: Send,
  star: Star,
  sparkles: Sparkles,
  rocket: Rocket,
  bookOpen: BookOpen,
  
  // User
  user: User,
  userCircle: UserCircle,
  personStanding: PersonStanding,
  
  // Golf/Sports
  sportsGolf: Flag,
  golfClub: Flag,
  golfCourse: Flag,
  target: Target,
  fitnessCenter: Dumbbell,
  trophy: Trophy,
  insights: TrendingUp,
  trendingUp: TrendingUp,
  barChart: BarChart3,
  
  // Time/Calendar
  calendar: Calendar,
  calendarToday: Calendar,
  calendarDays: CalendarDays,
  calendarCheck: CalendarCheck,
  schedule: Clock,
  clock: Clock,
  timer: Timer,
  
  // Location
  locationOn: MapPin,
  mapPin: MapPin,
  
  // Payment/Security
  creditCard: CreditCard,
  smartphone: Smartphone,
  shield: Shield,
  security: Shield,
  badgeCheck: BadgeCheck,
  verified: BadgeCheck,
  receipt: Receipt,
  
  // Dashboard
  dashboard: LayoutDashboard,
  home: Home,
  searchIcon: SearchIcon,
  personSearch: SearchIcon,
};

// Re-export all Lucide icons for direct use
export {
  ArrowRight,
  TrendingUp,
  Calendar,
  MapPin,
  CheckCircle,
  Mail,
  Smartphone,
  CreditCard,
  Check,
  User,
  Clock,
  Timer,
  Flag,
  Info,
  Shield,
  CalendarCheck,
  BadgeCheck,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Menu,
  X,
  Globe,
  Target,
  Dumbbell,
  PersonStanding,
  Rocket,
  Star,
  Sparkles,
  AlertCircle,
  Download,
  ArrowLeft,
  Play,
  Settings,
  LogOut,
  Plus,
  Minus,
  Trash2,
  Edit,
  MoreVertical,
  Filter,
  Bell,
  Home,
  BarChart3,
  Trophy,
  BookOpen,
  LayoutDashboard,
  ChevronDown,
  CalendarDays,
  Receipt,
  Search,
  CalendarX,
};

// Custom Golf Icon since Lucide doesn't have one
export function GolfIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="18" r="3" />
      <path d="M12 15V3l6 3-6 3" />
    </svg>
  );
}

// Icon component that takes a name prop
interface IconProps {
  name: keyof typeof iconMap;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className = "" }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }
  return <IconComponent size={size} className={className} />;
}
