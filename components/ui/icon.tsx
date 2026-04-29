/**
 * Icon — Lucide-wrapper med Material Symbols-kompatibelt navne-API.
 *
 * Bakoverkompatibel med eksisterende `<Icon name="..." />`-bruksmønster fra
 * Heritage-perioden (Material Symbols Outlined). Internt mappes Material
 * Symbols-navn til tilsvarende Lucide React-komponenter, slik at vi unngår
 * 1305+ file-edits ved Brand Guide V2.0-migreringen.
 *
 * Eksempel:
 *   <Icon name="search" />
 *   <Icon name="check_circle" size={18} className="text-primary" />
 *   <Icon name="progress_activity" className="animate-spin" />
 *
 * Ukjente navn renderes som `HelpCircle` med en console.warn (kun i dev).
 */

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  BadgeCheck,
  Ban,
  BarChart3,
  Bell,
  Bot,
  BookOpen,
  Bookmark,
  Brain,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  Camera,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Circle,
  Clock,
  Cloud,
  Copy,
  CreditCard,
  Crosshair,
  Crown,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Flag,
  Flame,
  Folder,
  GripVertical,
  Hammer,
  Heart,
  HelpCircle,
  History,
  Home,
  Hourglass,
  Image as ImageIcon,
  Inbox,
  Info,
  Key,
  Layout,
  LayoutDashboard,
  LayoutGrid,
  Lightbulb,
  Link2,
  Link2Off,
  ListChecks,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MapPinOff,
  Menu,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Mic,
  Minus,
  MoreHorizontal,
  MoreVertical,
  MoveUpRight,
  Navigation,
  Notebook,
  PanelLeftOpen,
  Pause,
  Pencil,
  Phone,
  Play,
  Plus,
  Power,
  PowerOff,
  Quote,
  RefreshCw,
  Repeat,
  RotateCcw,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Square,
  Star,
  Tag,
  Target,
  Trash2,
  TreePine,
  TrendingDown,
  TrendingUp,
  Trophy,
  Unlock,
  Upload,
  User,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  Volleyball,
  Wallet,
  Wand2,
  Wind,
  X,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { SVGAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Material Symbols-navn -> Lucide-komponent.
 *
 * Generert fra `grep -rohE '<Icon[^>]*name="[a-z_]+"' components/ app/`
 * (Sprint 2.2 — 2026-04-28). Hold sortert alfabetisk for vedlikeholdsvennlighet.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  // A
  account_balance_wallet: Wallet,
  add: Plus,
  add_comment: MessageSquare,
  air: Wind,
  analytics: BarChart3,
  arrow_back: ArrowLeft,
  arrow_downward: ArrowDown,
  arrow_forward: ArrowRight,
  arrow_outward: MoveUpRight,
  arrow_upward: ArrowUp,
  assignment: ListChecks,
  auto_awesome: Sparkles,
  auto_fix_high: Wand2,

  // B
  bar_chart: BarChart3,
  block: Ban,
  bolt: Zap,
  build: Hammer,

  // C
  calendar_add_on: CalendarPlus,
  calendar_today: Calendar,
  calendar_month: Calendar,
  cancel: XCircle,
  center_focus_strong: Crosshair,
  chat: MessageCircle,
  chat_bubble: MessageSquare,
  check: Check,
  check_box: CheckSquare,
  check_circle: CheckCircle2,
  checklist: ListChecks,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  chevron_down: ChevronDown,
  chevron_up: ChevronUp,
  circle: Circle,
  close: X,
  content_copy: Copy,
  credit_card: CreditCard,

  // D
  dashboard: LayoutDashboard,
  dashboard_customize: LayoutGrid,
  delete: Trash2,
  description: FileText,
  download: Download,
  drafts: Mail,
  drag_indicator: GripVertical,

  // E
  edit: Pencil,
  edit_note: Pencil,
  email: Mail,
  emoji_events: Trophy,
  error: AlertCircle,
  event: Calendar,
  event_available: CalendarCheck,
  event_busy: CalendarX,
  event_repeat: CalendarClock,
  expand_less: ChevronUp,
  expand_more: ChevronDown,

  // F
  filter_list: Filter,
  fitness_center: Activity,
  flag: Flag,
  flash_on: Zap,
  folder: Folder,
  format_quote: Quote,
  forum: MessagesSquare,

  // G
  gpp_maybe: ShieldAlert,
  gps_fixed: Crosshair,
  grid_view: LayoutGrid,
  group: Users,
  groups: Users,

  // H
  help_outline: HelpCircle,
  history: History,
  home: Home,
  hourglass_empty: Hourglass,

  // I
  image: ImageIcon,
  inbox: Inbox,
  info: Info,

  // K
  key: Key,
  keyboard_arrow_down: ChevronDown,
  keyboard_arrow_up: ChevronUp,

  // L
  left_panel_open: PanelLeftOpen,
  library_books: BookOpen,
  lightbulb: Lightbulb,
  link: Link2,
  link_off: Link2Off,
  list: ListChecks,
  local_fire_department: Flame,
  location_off: MapPinOff,
  location_on: MapPin,
  lock: Lock,
  lock_open: Unlock,
  login: LogIn,
  logout: LogOut,

  // M
  mail: Mail,
  menu: Menu,
  menu_book: BookOpen,
  message: MessageSquare,
  mic: Mic,
  monitoring: Activity,
  more_horiz: MoreHorizontal,
  more_vert: MoreVertical,
  my_location: Crosshair,

  // N
  navigation: Navigation,
  north_east: TrendingUp,
  notebook: Notebook,
  note: FileText,
  notifications: Bell,

  // O
  open_in_new: ExternalLink,

  // P
  park: TreePine,
  password: Key,
  pause: Pause,
  payment: CreditCard,
  pending_actions: Hourglass,
  person: User,
  person_add: UserPlus,
  person_check: UserCheck,
  person_remove: UserX,
  phone: Phone,
  photo_camera: Camera,
  picture_as_pdf: FileText,
  play_arrow: Play,
  power: Power,
  power_off: PowerOff,
  priority_high: AlertTriangle,
  progress_activity: Loader2,
  psychology: Brain,

  // R
  radio_button_unchecked: Circle,
  refresh: RefreshCw,
  remove: Minus,
  repeat: Repeat,
  restart_alt: RotateCcw,
  rocket_launch: Sparkles,
  rule: ListChecks,

  // S
  save: Save,
  schedule: Clock,
  search: Search,
  sell: Tag,
  send: Send,
  settings: Settings,
  share: Share2,
  shield: Shield,
  smart_toy: Bot,
  smartphone: Smartphone,
  sort: ArrowUpDown,
  south_east: TrendingDown,
  sparkles: Sparkles,
  speed: Activity,
  sports: Volleyball,
  sports_golf: Volleyball,
  star: Star,
  stop: Square,
  straighten: ArrowDownUp,
  swap_vert: ArrowDownUp,
  sync: RefreshCw,

  // T
  target: Target,
  template: Layout,
  time: Clock,
  access_time: Clock,
  timer: Clock,
  trending_down: TrendingDown,
  trending_up: TrendingUp,

  // U
  unfold_more: ChevronsUpDown,
  upload: Upload,

  // V
  verified: BadgeCheck,
  visibility: Eye,
  visibility_off: EyeOff,

  // W
  warning: AlertTriangle,
  workspace_premium: Crown,
  favorite: Heart,
  bookmark: Bookmark,
  cloud: Cloud,
  trash: Trash2,
};

/**
 * Material Symbols-navn som vi har sett brukt i kodebasen og bevisst
 * mapper til en generisk fallback. Disse er ikke ekte ikoner — de stammer
 * fra prop-vars som tilfeldigvis matcher `name="..."`-regex-en i grep,
 * men er i praksis aldri rendret som Icon. Suppress no-op warning.
 */
const SUPPRESSED_NAMES = new Set<string>([
  "consent",
  "current",
  "date",
  "handicap",
  "name",
  "service",
  "trainer",
]);

/** Set for runtime-warnings — én warn per ukjent navn per session. */
const warnedNames = new Set<string>();

// IconProps spread'es til en Lucide SVG-komponent — bruker SVG-typer, ikke HTML-span.
export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "name"> {
  /** Material Symbol-navn, f.eks. "dashboard", "search", "check_circle" */
  name: string;
  /** Fylt variant — beholdes for API-kompat, ignoreres av Lucide. */
  filled?: boolean;
  /** Font weight — beholdes for API-kompat, ignoreres av Lucide. */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Ikon-størrelse i piksler. Default: 24 */
  size?: number;
  /** Grade — beholdes for API-kompat, ignoreres av Lucide. */
  grade?: number;
}

export function Icon({
  name,
  filled: _filled = false,
  weight: _weight = 400,
  size = 24,
  grade: _grade = 0,
  className,
  style,
  "aria-hidden": ariaHidden = true,
  ...rest
}: IconProps) {
  const LucideComponent = ICON_MAP[name];

  if (!LucideComponent) {
    if (
      process.env.NODE_ENV !== "production" &&
      !warnedNames.has(name) &&
      !SUPPRESSED_NAMES.has(name)
    ) {
      warnedNames.add(name);
      console.warn(
        `[Icon] Ukjent ikon-navn "${name}" — render fallback (HelpCircle). Legg til mapping i components/ui/icon.tsx.`,
      );
    }

    return (
      <HelpCircle
        className={cn(className)}
        width={size}
        height={size}
        style={style}
        aria-hidden={ariaHidden}
        {...rest}
      />
    );
  }

  return (
    <LucideComponent
      className={cn(className)}
      width={size}
      height={size}
      style={style}
      aria-hidden={ariaHidden}
      {...rest}
    />
  );
}

/** Ekspandert prop-type, eksportert for andre wrappers som vil bruke samme map. */
export { ICON_MAP };
