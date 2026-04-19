"use client";

/**
 * Shared icons — Heritage Grid Migrasjon (2026-04-19).
 *
 * Alle ikoner rendres nå som Material Symbols Outlined via <Icon>-wrapperen.
 * Beholder samme API som før (e.g. `<Check className="..." />`) for
 * bakoverkompatibilitet — indre implementasjon bruker Material Symbols.
 */

import { Icon as MaterialIcon } from "@/components/ui/icon";
import type { CSSProperties, MouseEventHandler, SVGProps } from "react";

// Permissive props-type — aksepterer alt som Lucide tok
export interface IconComponentProps {
  className?: string;
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
  fill?: string;
  stroke?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
}

function makeIcon(materialName: string, defaultSize = 24) {
  const Component = ({
    className,
    size,
    style,
    onClick,
    "aria-hidden": ariaHidden,
    "aria-label": ariaLabel,
  }: IconComponentProps) => {
    const numSize =
      typeof size === "number"
        ? size
        : typeof size === "string"
          ? parseInt(size, 10) || defaultSize
          : defaultSize;
    return (
      <MaterialIcon
        name={materialName}
        size={numSize}
        className={className}
        style={style}
        onClick={onClick}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
      />
    );
  };
  Component.displayName = `Icon(${materialName})`;
  return Component;
}

// Navigation
export const ArrowRight = makeIcon("arrow_forward");
export const ArrowLeft = makeIcon("arrow_back");
export const ChevronLeft = makeIcon("chevron_left");
export const ChevronRight = makeIcon("chevron_right");
export const ChevronDown = makeIcon("expand_more");
export const Menu = makeIcon("menu");
export const X = makeIcon("close");

// UI
export const Check = makeIcon("check");
export const CheckCircle = makeIcon("check_circle");
export const Info = makeIcon("info");
export const AlertCircle = makeIcon("error");
export const MoreVertical = makeIcon("more_vert");
export const Filter = makeIcon("filter_list");
export const Search = makeIcon("search");
export const SearchIcon = makeIcon("search");
export const Bell = makeIcon("notifications");
export const Settings = makeIcon("settings");
export const LogOut = makeIcon("logout");
export const Plus = makeIcon("add");
export const Minus = makeIcon("remove");
export const Trash2 = makeIcon("delete");
export const Edit = makeIcon("edit");
export const Download = makeIcon("download");
export const Play = makeIcon("play_arrow");

// Content
export const Mail = makeIcon("mail");
export const Globe = makeIcon("language");
export const Send = makeIcon("send");
export const Star = makeIcon("star");
export const Sparkles = makeIcon("auto_awesome");
export const Rocket = makeIcon("rocket_launch");
export const BookOpen = makeIcon("menu_book");

// User
export const User = makeIcon("person");
export const UserCircle = makeIcon("account_circle");
export const PersonStanding = makeIcon("directions_walk");

// Golf/Sports
export const Flag = makeIcon("flag");
export const Target = makeIcon("my_location");
export const Dumbbell = makeIcon("fitness_center");
export const Trophy = makeIcon("emoji_events");
export const TrendingUp = makeIcon("trending_up");
export const BarChart3 = makeIcon("bar_chart");

// Time/Calendar
export const Calendar = makeIcon("calendar_today");
export const CalendarDays = makeIcon("calendar_month");
export const CalendarCheck = makeIcon("event_available");
export const CalendarX = makeIcon("event_busy");
export const Clock = makeIcon("schedule");
export const Timer = makeIcon("timer");

// Location
export const MapPin = makeIcon("location_on");

// Payment/Security
export const CreditCard = makeIcon("credit_card");
export const Smartphone = makeIcon("smartphone");
export const Shield = makeIcon("shield");
export const BadgeCheck = makeIcon("verified");
export const Receipt = makeIcon("receipt_long");

// Dashboard
export const LayoutDashboard = makeIcon("dashboard");
export const Home = makeIcon("home");

export const iconMap = {
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  menu: Menu,
  close: X,
  check: Check,
  checkCircle: CheckCircle,
  info: Info,
  alertCircle: AlertCircle,
  moreVertical: MoreVertical,
  filter: Filter,
  search: Search,
  bell: Bell,
  settings: Settings,
  logOut: LogOut,
  plus: Plus,
  minus: Minus,
  trash: Trash2,
  edit: Edit,
  download: Download,
  play: Play,
  mail: Mail,
  globe: Globe,
  send: Send,
  star: Star,
  sparkles: Sparkles,
  rocket: Rocket,
  bookOpen: BookOpen,
  user: User,
  userCircle: UserCircle,
  personStanding: PersonStanding,
  sportsGolf: Flag,
  golfClub: Flag,
  golfCourse: Flag,
  target: Target,
  fitnessCenter: Dumbbell,
  trophy: Trophy,
  insights: TrendingUp,
  trendingUp: TrendingUp,
  barChart: BarChart3,
  calendar: Calendar,
  calendarToday: Calendar,
  calendarDays: CalendarDays,
  calendarCheck: CalendarCheck,
  schedule: Clock,
  clock: Clock,
  timer: Timer,
  locationOn: MapPin,
  mapPin: MapPin,
  creditCard: CreditCard,
  smartphone: Smartphone,
  shield: Shield,
  security: Shield,
  badgeCheck: BadgeCheck,
  verified: BadgeCheck,
  receipt: Receipt,
  dashboard: LayoutDashboard,
  home: Home,
  searchIcon: Search,
  personSearch: Search,
} as const;

export function GolfIcon({
  className = "w-6 h-6",
  ...props
}: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="18" r="3" />
      <path d="M12 15V3l6 3-6 3" />
    </svg>
  );
}

interface IconByNameProps {
  name: keyof typeof iconMap;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className = "" }: IconByNameProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }
  return <IconComponent size={size} className={className} />;
}
