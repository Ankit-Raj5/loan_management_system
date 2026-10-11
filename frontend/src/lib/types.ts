import type { Role } from "./roles";

export type ApplicationStatus = "DRAFT" | "APPLIED" | "SANCTIONED" | "REJECTED" | "DISBURSED" | "CLOSED";
export type ApplicationStep = "PERSONAL_DETAILS" | "SALARY_SLIP" | "LOAN_CONFIG" | "SUBMITTED" | "REJECTED";
export type EmploymentMode = "SALARIED" | "SELF_EMPLOYED" | "UNEMPLOYED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface PersonalDetails {
  fullName: string;
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface SalarySlipMeta {
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface LoanTerms {
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}

export interface PaymentSummary {
  totalRepayment: number;
  amountPaid: number;
  outstanding: number;
}

export interface HistoryEntry {
  from: ApplicationStatus | null;
  to: ApplicationStatus;
  byName: string;
  byRole: string;
  at: string;
  note: string | null;
}

export interface BreFailure {
  rule: string;
  message: string;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  currentStep: ApplicationStep;
  personalDetails: PersonalDetails;
  salarySlip: SalarySlipMeta | null;
  loan: LoanTerms | null;
  appliedAt: string | null;
  rejectionReason: string | null;
  rejectionSource: "BRE" | "SANCTION" | null;
  breFailures: BreFailure[];
  history: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface OpsLoan {
  id: string;
  status: ApplicationStatus;
  borrower: { id: string; name: string; email: string };
  personalDetails: PersonalDetails;
  salarySlip: SalarySlipMeta | null;
  loan: LoanTerms | null;
  payment: PaymentSummary | null;
  appliedAt: string | null;
  sanctionedAt: string | null;
  disbursedAt: string | null;
  closedAt: string | null;
  rejectionReason: string | null;
  rejectionSource: "BRE" | "SANCTION" | null;
  rejectedAt: string | null;
  history?: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  utr: string;
  amount: number;
  paymentDate: string;
  recordedByName: string;
  createdAt: string;
}

export interface CollectionLoan extends OpsLoan {
  payments: Payment[];
}

export interface Lead {
  borrowerId: string;
  name: string;
  email: string;
  registeredAt: string;
  lastLoginAt: string | null;
  stage: "DRAFT_IN_PROGRESS" | "BRE_REJECTED";
  attempts: number;
  lastActivityAt: string;
  latestDetails: { fullName: string; pan: string; monthlySalary: number; employmentMode: EmploymentMode };
  breFailures: BreFailure[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListResult<T> {
  items: T[];
  pagination: Pagination;
}
