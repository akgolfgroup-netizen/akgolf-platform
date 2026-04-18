import { differenceInMinutes, format } from "date-fns";
import type { CalendarBooking } from "./actions";

export const formatTime = (date: Date | string) =>
  format(new Date(date), "HH:mm");

export const formatDuration = (b: CalendarBooking) =>
  `${differenceInMinutes(new Date(b.endTime), new Date(b.startTime))} min`;

export const statusLabels: Record<string, string> = {
  PENDING: "Venter",
  CONFIRMED: "Bekreftet",
  COMPLETED: "Fullført",
  NO_SHOW: "Ikke møtt",
};

export type StatusKey = "PENDING" | "CONFIRMED" | "COMPLETED" | "NO_SHOW";

export function isStatusKey(s: string): s is StatusKey {
  return (
    s === "PENDING" || s === "CONFIRMED" || s === "COMPLETED" || s === "NO_SHOW"
  );
}

export const statusBadgeVariant: Record<
  StatusKey,
  "warning" | "info" | "success" | "error"
> = {
  PENDING: "warning",
  CONFIRMED: "info",
  COMPLETED: "success",
  NO_SHOW: "error",
};

export const statusCellStyles: Record<string, string> = {
  PENDING: "bg-grey-50 border-grey-200 text-text",
  CONFIRMED: "bg-grey-50 border-grey-200 text-text",
  COMPLETED: "bg-grey-50 border-grey-200 text-text",
  NO_SHOW: "bg-grey-50 border-grey-200 text-text",
};
