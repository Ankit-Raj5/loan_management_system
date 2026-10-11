import { BUSINESS_TIMEZONE } from "../config/loan.config";

// Formats a date as YYYY-MM-DD in the business timezone (India)
export const toBusinessDate = (date: Date): string =>
  date.toLocaleDateString("en-CA", { timeZone: BUSINESS_TIMEZONE });

// Returns today's date as YYYY-MM-DD in the business timezone
export const todayBusinessDate = (): string => toBusinessDate(new Date());
