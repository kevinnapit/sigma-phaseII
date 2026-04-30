import type { DateValue } from "@internationalized/date";

// Removes time components, setting it to 00:00:00
export function toDateOnly(date: Date) {
   return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Gets today's date at midnight (00:00:00)
export function today() {
   return toDateOnly(new Date());
}

// Checks if the input date is in the past
export function isBeforeToday(date: Date) {
   return toDateOnly(date) < today();
}

// Checks if dateA occurs before dateB
export function isBefore(dateA: Date, dateB: Date) {
   return toDateOnly(dateA) < toDateOnly(dateB);
}

// Converts a DateValue object to an ISO string (YYYY-MM-DD)
export function dateValueToISO(date: DateValue | undefined): string {
   if (!date) return '';

   return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

// Helper convert YYYY-MM-DD to ISO datetime string
export function toISODateTime(date: string, endOfDay = false): string | undefined {
   if (!date) return undefined;
   return endOfDay ? `${date}T23:59:59Z` : `${date}T00:00:00Z`;
}