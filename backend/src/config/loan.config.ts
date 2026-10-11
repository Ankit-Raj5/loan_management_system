export const LOAN_CONFIG = {
  MIN_AGE: 23,
  MAX_AGE: 50,
  MIN_SALARY: 25000,
  MIN_AMOUNT: 50000,
  MAX_AMOUNT: 500000,
  MIN_TENURE_DAYS: 30,
  MAX_TENURE_DAYS: 365,
  INTEREST_RATE: 12,
  DAYS_IN_YEAR: 365,
} as const;

export const BUSINESS_TIMEZONE = "Asia/Kolkata";

export const UTR_REGEX = /^[A-Z0-9]{6,30}$/;

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
