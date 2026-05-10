export type CalendarView = "day" | "week" | "month" | "year";

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  color?: string;
  category?: "booking" | "training" | "session" | "tournament" | "rest";
  metadata?: Record<string, unknown>;
}

export interface CalendarProps {
  events: CalendarEvent[];
  defaultView?: CalendarView;
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  onAddEvent?: (date: Date) => void;
  className?: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  booking: "#005840",
  training: "#D1F843",
  session: "#1A7D56",
  tournament: "#B8852A",
  rest: "#9C9990",
};

export const WEEKDAYS_NO = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];
export const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 08-20
