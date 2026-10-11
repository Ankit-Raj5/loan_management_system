import type { EmploymentMode } from "./types";

// Mirrors the backend limits so sliders, file checks and the landing page give instant feedback (the backend still enforces them)
export const LOAN_LIMITS = {
  minAmount: 50000,
  maxAmount: 500000,
  amountStep: 1000,
  minTenure: 30,
  maxTenure: 365,
  interestRate: 12,
  minAge: 23,
  maxAge: 50,
  minSalary: 25000,
} as const;

export const SALARY_SLIP_LIMITS = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["application/pdf", "image/jpeg", "image/png"],
  accept: ".pdf,.jpg,.jpeg,.png",
} as const;

export const EMPLOYMENT_OPTIONS: { value: EmploymentMode; label: string }[] = [
  { value: "SALARIED", label: "Salaried" },
  { value: "SELF_EMPLOYED", label: "Self-employed" },
  { value: "UNEMPLOYED", label: "Unemployed" },
];

// Illustration for the landing page only; real figures always come from the server
export const EXAMPLE_LOAN = (() => {
  const amount = 100000;
  const tenureDays = 90;
  const interest = Math.round(((amount * LOAN_LIMITS.interestRate * tenureDays) / 36500) * 100) / 100;
  return { amount, tenureDays, interest, total: amount + interest };
})();
