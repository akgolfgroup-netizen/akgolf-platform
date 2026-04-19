#!/usr/bin/env node
/**
 * Migrer Lucide React-ikoner til Material Symbols Outlined via <Icon>.
 *
 * Trygg strategi:
 * 1. Transform JSX-bruk: <LucideName ... /> → <Icon name="material_symbol" ... />
 * 2. Transform JSX-wrapping: <LucideName>...</LucideName> → <Icon name="..." ...>...</Icon>
 * 3. Analyser import-statement: behold bare navn som fortsatt brukes (ref/prop/type)
 * 4. Fjern tom lucide-import helt
 * 5. Legg til Icon-import hvis vi introduserte <Icon>
 *
 * Link/LucideIcon mappes IKKE — kan konflikte med Next.js Link / TypeScript.
 */
const fs = require("fs");
const path = require("path");

const MAP = {
  Activity: "monitoring",
  AlertCircle: "error",
  AlertTriangle: "warning",
  AlignJustify: "format_align_justify",
  ArrowDown: "arrow_downward",
  ArrowDownRight: "south_east",
  ArrowLeft: "arrow_back",
  ArrowRight: "arrow_forward",
  ArrowRightLeft: "swap_horiz",
  ArrowUp: "arrow_upward",
  ArrowUpDown: "swap_vert",
  ArrowUpRight: "north_east",
  Award: "workspace_premium",
  BadgeCheck: "verified",
  Ban: "block",
  BarChart3: "bar_chart",
  Bell: "notifications",
  BookOpen: "menu_book",
  Bot: "smart_toy",
  Brain: "psychology",
  Calendar: "calendar_today",
  CalendarClock: "event_available",
  CalendarCog: "event_available",
  CalendarDays: "calendar_month",
  CalendarPlus: "event",
  CalendarX: "event_busy",
  Camera: "photo_camera",
  Check: "check",
  CheckCircle: "check_circle",
  CheckCircle2: "check_circle",
  CheckSquare: "check_box",
  ChevronDown: "expand_more",
  ChevronLeft: "chevron_left",
  ChevronRight: "chevron_right",
  ChevronUp: "expand_less",
  ChevronsUpDown: "unfold_more",
  Circle: "circle",
  CircleDashed: "radio_button_unchecked",
  ClipboardCheck: "task_alt",
  ClipboardList: "assignment",
  Clock: "schedule",
  Cloud: "cloud",
  Club: "sports_golf",
  Columns3: "view_column",
  Command: "keyboard_command_key",
  Copy: "content_copy",
  CreditCard: "credit_card",
  Crosshair: "gps_fixed",
  Crown: "workspace_premium",
  Disc: "album",
  Download: "download",
  Dumbbell: "fitness_center",
  Edit: "edit",
  Edit2: "edit",
  ExternalLink: "open_in_new",
  Eye: "visibility",
  EyeOff: "visibility_off",
  FileText: "description",
  Filter: "filter_list",
  Flag: "flag",
  Flame: "local_fire_department",
  Focus: "center_focus_strong",
  Gauge: "speed",
  GaugeCircle: "speed",
  GripVertical: "drag_indicator",
  HeartPulse: "monitor_heart",
  History: "history",
  Home: "home",
  Inbox: "inbox",
  Info: "info",
  KeyRound: "key",
  LayoutDashboard: "dashboard",
  LayoutGrid: "grid_view",
  Lightbulb: "lightbulb",
  List: "list",
  Loader2: "progress_activity",
  Lock: "lock",
  LogIn: "login",
  LogOut: "logout",
  Mail: "mail",
  MapPin: "location_on",
  MapPinOff: "location_off",
  Medal: "military_tech",
  Menu: "menu",
  MessageCircle: "chat_bubble",
  MessageSquare: "chat",
  Minus: "remove",
  Moon: "dark_mode",
  MoreHorizontal: "more_horiz",
  Navigation: "navigation",
  PanelLeft: "left_panel_open",
  PanelLeftClose: "left_panel_close",
  PenLine: "edit",
  Pencil: "edit",
  PersonStanding: "directions_walk",
  Phone: "phone",
  Play: "play_arrow",
  Plus: "add",
  Power: "power",
  PowerOff: "power_off",
  Puzzle: "extension",
  Quote: "format_quote",
  Receipt: "receipt_long",
  RefreshCw: "refresh",
  Repeat: "repeat",
  Rocket: "rocket_launch",
  RotateCcw: "restart_alt",
  Ruler: "straighten",
  Save: "save",
  Search: "search",
  SearchIcon: "search",
  Send: "send",
  Settings: "settings",
  Settings2: "tune",
  Shield: "shield",
  ShieldAlert: "gpp_maybe",
  ShieldCheck: "verified_user",
  Smartphone: "smartphone",
  Snowflake: "ac_unit",
  Sparkles: "auto_awesome",
  Square: "stop",
  Star: "star",
  StickyNote: "sticky_note_2",
  Table2: "table",
  Tag: "sell",
  Target: "my_location",
  Timer: "timer",
  Trash2: "delete",
  TrendingDown: "trending_down",
  TrendingUp: "trending_up",
  Trophy: "emoji_events",
  User: "person",
  UserCircle: "account_circle",
  UserMinus: "person_remove",
  UserPlus: "person_add",
  Users: "group",
  Wallet: "account_balance_wallet",
  Wind: "air",
  Wrench: "build",
  X: "close",
  XCircle: "cancel",
  Zap: "bolt",
  // Link, LucideIcon: IKKE MAPPET — beholdes som Lucide-referanser
};

const EXTS = new Set([".tsx", ".ts"]);
const ROOTS = ["app", "components", "lib"];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTS.has(path.extname(entry.name))) yield full;
  }
}

/**
 * Sjekker om et identifier fortsatt brukes i src etter at vi har transformert JSX.
 * Søker etter bruk utenfor import-statement: props, refs, types osv.
 */
function isStillUsed(src, name) {
  // Fjern alle import-statements først så vi ikke teller dem
  const withoutImports = src.replace(/^import[^;]+;?\s*$/gm, "");
  const wordPattern = new RegExp(`\\b${name}\\b`);
  return wordPattern.test(withoutImports);
}

function transform(src, filePath) {
  let changed = false;
  let introducedIcon = false;

  // 1. Transform JSX self-closing: <LucideName ... />
  // Tillater / i className-verdier (w-1/2, top-1/2) ved å ikke stoppe på /
  // Stopper kun på />
  for (const [lucide, material] of Object.entries(MAP)) {
    const regex = new RegExp(
      `<${lucide}((?:[^>]|>(?!\\s))*?)\\s*/>`,
      "g"
    );
    src = src.replace(regex, (_match, attrs) => {
      // Ekskluder hvis match er <Lucide>/ (skjer ikke normalt, men sikre)
      changed = true;
      introducedIcon = true;
      return `<Icon name="${material}"${attrs ?? ""} />`;
    });
  }

  // 2. Transform JSX with children: <LucideName ...>...</LucideName>
  for (const [lucide, material] of Object.entries(MAP)) {
    const regex = new RegExp(
      `<${lucide}([^>]*)>([\\s\\S]*?)</${lucide}>`,
      "g"
    );
    src = src.replace(regex, (_match, attrs, inner) => {
      changed = true;
      introducedIcon = true;
      return `<Icon name="${material}"${attrs ?? ""}>${inner}</Icon>`;
    });
  }

  // 3. Oppdater lucide-react-imports — behold bare navn som fortsatt brukes
  src = src.replace(
    /import\s*(?:type\s+)?\{([^}]+)\}\s*from\s*["']lucide-react["'];?/g,
    (match, names) => {
      const isType = match.startsWith("import type");
      const items = names
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const kept = [];
      for (const it of items) {
        const isItemType = it.startsWith("type ");
        const clean = it.replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();

        // Hvis den er i MAP og IKKE brukes videre, fjern
        if (MAP[clean] && !isStillUsed(src, clean)) {
          changed = true;
          continue;
        }
        // Hvis den ikke er i MAP (f.eks. Link, LucideIcon) — behold
        // Hvis den er i MAP men fortsatt brukes (som ref/prop/type) — behold
        kept.push(it);
      }

      if (kept.length === 0) {
        return "";
      }
      return `import ${isType ? "type " : ""}{ ${kept.join(", ")} } from "lucide-react";`;
    }
  );

  // 4. Hvis vi introduserte <Icon>, legg til import rett etter "use client" eller på topp
  if (introducedIcon && !/from\s*["']@\/components\/ui\/icon["']/.test(src)) {
    const useClientMatch = src.match(/^"use client";?\s*\n/);
    if (useClientMatch) {
      const insertAt = useClientMatch[0].length;
      src =
        src.slice(0, insertAt) +
        `\nimport { Icon } from "@/components/ui/icon";\n` +
        src.slice(insertAt);
    } else {
      src = `import { Icon } from "@/components/ui/icon";\n` + src;
    }
    changed = true;
  }

  return { src, changed };
}

let filesChanged = 0;
let filesSkipped = 0;

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const src = fs.readFileSync(file, "utf8");
    if (!/from\s*["']lucide-react["']/.test(src)) {
      filesSkipped++;
      continue;
    }
    const result = transform(src, file);
    if (result.changed) {
      fs.writeFileSync(file, result.src);
      filesChanged++;
    }
  }
}

console.log(`Endret ${filesChanged} filer (skipped ${filesSkipped}).`);
