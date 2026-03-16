import { format } from "date-fns";

function icalDate(d: Date): string {
  return format(d, "yyyyMMdd'T'HHmmss'Z'");
}

function icalDateOnly(d: Date): string {
  return format(d, "yyyyMMdd");
}

function fold(line: string): string {
  // RFC 5545: lines > 75 chars should be folded
  const chunks: string[] = [];
  while (line.length > 75) {
    chunks.push(line.substring(0, 75));
    line = " " + line.substring(75);
  }
  chunks.push(line);
  return chunks.join("\r\n");
}

function escape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export interface CalEvent {
  uid: string;
  summary: string;
  description?: string;
  dtstart: Date;
  dtend: Date;
  url?: string;
  location?: string;
  allDay?: boolean;
}

export function generateIcal(
  events: CalEvent[],
  calName = "AK Golf Trening"
): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AK Golf Academy//Portal//NO",
    fold(`X-WR-CALNAME:${escape(calName)}`),
    "X-WR-TIMEZONE:Europe/Oslo",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const ev of events) {
    lines.push("BEGIN:VEVENT");
    lines.push(fold(`UID:${ev.uid}`));
    lines.push(fold(`SUMMARY:${escape(ev.summary)}`));
    if (ev.description) {
      lines.push(fold(`DESCRIPTION:${escape(ev.description)}`));
    }
    if (ev.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${icalDateOnly(ev.dtstart)}`);
      lines.push(`DTEND;VALUE=DATE:${icalDateOnly(ev.dtend)}`);
    } else {
      lines.push(`DTSTART:${icalDate(ev.dtstart)}`);
      lines.push(`DTEND:${icalDate(ev.dtend)}`);
    }
    if (ev.url) {
      lines.push(fold(`URL:${ev.url}`));
    }
    if (ev.location) {
      lines.push(fold(`LOCATION:${escape(ev.location)}`));
    }
    lines.push(`DTSTAMP:${icalDate(new Date())}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
