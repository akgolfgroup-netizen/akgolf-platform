/**
 * Icon Map for Server → Client Component Boundary
 *
 * HVORFOR DENNE FILEN EKSISTERER:
 * Lucide icons er funksjoner med forwardRef. React Server Components kan IKKE
 * sende funksjoner som props til Client Components. Denne filen løser problemet
 * ved å la Server Components sende string-baserte icon-navn i stedet.
 *
 * BRUK:
 * - Server Component: <BentoCard iconName="info" />
 * - Client Component: <BentoCard icon={Info} />
 *
 * LEGGE TIL NYE IKONER:
 * 1. Importer ikonet fra lucide-react
 * 2. Legg til i ICON_MAP objektet
 * 3. TypeScript vil automatisk oppdatere IconName-typen
 */

import {
  // Navigation & Actions
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  RotateCcw,
  X,
  Check,

  // Content & Media
  Info,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Mail,
  Bell,

  // Users & People
  User,
  UserPlus,
  Users,

  // Calendar & Time
  Calendar,
  CalendarCheck,
  CalendarDays,
  Clock,

  // Data & Analytics
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Flame,

  // Files & Documents
  FileText,
  FolderOpen,
  NotebookPen,
  BookOpen,
  List,

  // Sports & Training
  Play,
  Pause,
  Star,
  Award,
  Trophy,

  // UI Elements
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  MoreVertical,
  Loader2,

  // Misc
  Sparkles,
  Lightbulb,
  Bed,
  Home,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Mapping fra string-navn til Lucide icon-komponenter.
 * Brukes av BentoCard, AppleButton, StatCard, AppleBadge for å støtte
 * Server Component → Client Component grensen.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  // Navigation & Actions
  plus: Plus,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  externalLink: ExternalLink,
  download: Download,
  upload: Upload,
  refreshCw: RefreshCw,
  rotateCcw: RotateCcw,
  x: X,
  check: Check,

  // Content & Media
  info: Info,
  alertTriangle: AlertTriangle,
  alertCircle: AlertCircle,
  helpCircle: HelpCircle,
  messageSquare: MessageSquare,
  mail: Mail,
  bell: Bell,

  // Users & People
  user: User,
  userPlus: UserPlus,
  users: Users,

  // Calendar & Time
  calendar: Calendar,
  calendarCheck: CalendarCheck,
  calendarDays: CalendarDays,
  clock: Clock,

  // Data & Analytics
  barChart3: BarChart3,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  activity: Activity,
  target: Target,
  zap: Zap,
  flame: Flame,

  // Files & Documents
  fileText: FileText,
  folderOpen: FolderOpen,
  notebookPen: NotebookPen,
  bookOpen: BookOpen,
  list: List,

  // Sports & Training
  play: Play,
  pause: Pause,
  star: Star,
  award: Award,
  trophy: Trophy,

  // UI Elements
  settings: Settings,
  search: Search,
  filter: Filter,
  moreHorizontal: MoreHorizontal,
  moreVertical: MoreVertical,
  loader2: Loader2,

  // Misc
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  bed: Bed,
  home: Home,
  mapPin: MapPin,
} as const;

/**
 * Type for alle gyldige icon-navn.
 * Bruk denne i props-interfaces for type-sikkerhet.
 */
export type IconName = keyof typeof ICON_MAP;

/**
 * Helper-funksjon for å hente icon fra navn.
 * Returnerer undefined hvis navnet ikke finnes (for graceful degradation).
 */
export function getIcon(name: IconName | undefined): LucideIcon | undefined {
  if (!name) return undefined;
  return ICON_MAP[name];
}
