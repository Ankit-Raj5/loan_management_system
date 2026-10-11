const wholeCurrency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const preciseCurrency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const date = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
const dateTime = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

// Today's date as YYYY-MM-DD in Indian time (used as a default for date inputs)
export const todayIsoDate = (): string => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

// Formats rupees in Indian style: ₹1,00,000 for whole amounts and ₹1,03,287.67 when there are paise
export const formatCurrency = (value: number): string =>
  Number.isInteger(value) ? wholeCurrency.format(value) : preciseCurrency.format(value);

// Formats an ISO date as 15 Jun 1995 (Indian time)
export const formatDate = (iso: string | null | undefined): string => (iso ? date.format(new Date(iso)) : "—");

// Formats an ISO date with time (Indian time)
export const formatDateTime = (iso: string | null | undefined): string => (iso ? dateTime.format(new Date(iso)) : "—");

// Converts SELF_EMPLOYED style values to "Self employed"
export const humanize = (value: string): string => {
  const text = value.toLowerCase().replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Formats a byte count as KB or MB
export const formatFileSize = (bytes: number): string =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
