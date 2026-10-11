import { Types } from "mongoose";
import { ILoanApplication, ILoanTerms, LoanApplication } from "../models/loanApplication.model";
import { ApplicationStatus, EmploymentMode, RejectionSource } from "../types/loan";
import { NotFoundError } from "../utils/errors";
import { fromPaise, toPaise } from "../utils/money";
import { MESSAGES } from "../utils/messages";
import { HistoryView, toHistoryViews } from "./loanWorkflow.service";

export interface BorrowerInfo {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface LoanLean extends Omit<ILoanApplication, "borrower"> {
  _id: Types.ObjectId;
  borrower: BorrowerInfo;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentSummary {
  totalRepayment: number;
  amountPaid: number;
  outstanding: number;
}

export interface OperationsLoanView {
  id: string;
  status: ApplicationStatus;
  borrower: { id: string; name: string; email: string };
  personalDetails: {
    fullName: string;
    pan: string;
    dob: Date;
    monthlySalary: number;
    employmentMode: EmploymentMode;
  };
  salarySlip: { originalName: string; mimeType: string; size: number; uploadedAt: Date } | null;
  loan: ILoanTerms | null;
  payment: PaymentSummary | null;
  appliedAt: Date | null;
  sanctionedAt: Date | null;
  disbursedAt: Date | null;
  closedAt: Date | null;
  rejectionReason: string | null;
  rejectionSource: RejectionSource | null;
  rejectedAt: Date | null;
  history?: HistoryView[];
  createdAt: Date;
  updatedAt: Date;
}

// Calculates total, paid and outstanding amounts for a loan (null until the loan terms exist)
export const toPaymentSummary = (loan: ILoanTerms | undefined, amountPaid: number): PaymentSummary | null => {
  if (!loan) return null;
  const paid = amountPaid ?? 0;
  return {
    totalRepayment: loan.totalRepayment,
    amountPaid: paid,
    outstanding: fromPaise(toPaise(loan.totalRepayment) - toPaise(paid)),
  };
};

// Converts a populated loan into the response shape used by every operations module
export const toOperationsView = (app: LoanLean, includeHistory: boolean): OperationsLoanView => ({
  id: String(app._id),
  status: app.status,
  borrower: { id: String(app.borrower._id), name: app.borrower.name, email: app.borrower.email },
  personalDetails: {
    fullName: app.personalDetails.fullName,
    pan: app.personalDetails.pan,
    dob: app.personalDetails.dob,
    monthlySalary: app.personalDetails.monthlySalary,
    employmentMode: app.personalDetails.employmentMode,
  },
  salarySlip: app.salarySlip
    ? {
        originalName: app.salarySlip.originalName,
        mimeType: app.salarySlip.mimeType,
        size: app.salarySlip.size,
        uploadedAt: app.salarySlip.uploadedAt,
      }
    : null,
  loan: app.loan ?? null,
  payment: toPaymentSummary(app.loan, app.amountPaid),
  appliedAt: app.appliedAt ?? null,
  sanctionedAt: app.sanctionedAt ?? null,
  disbursedAt: app.disbursedAt ?? null,
  closedAt: app.closedAt ?? null,
  rejectionReason: app.rejectionReason ?? null,
  rejectionSource: app.rejectionSource ?? null,
  rejectedAt: app.rejectedAt ?? null,
  ...(includeHistory && { history: toHistoryViews(app.statusHistory) }),
  createdAt: app.createdAt,
  updatedAt: app.updatedAt,
});

// Lists loans matching a filter (newest activity first) with pagination metadata
export const listLoanViews = async (
  filter: Record<string, unknown>,
  page: number,
  limit: number
): Promise<{ items: OperationsLoanView[]; pagination: Pagination }> => {
  const [loans, total] = await Promise.all([
    LoanApplication.find(filter)
      .populate("borrower", "name email")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<LoanLean[]>(),
    LoanApplication.countDocuments(filter),
  ]);

  return {
    items: loans.map((loan) => toOperationsView(loan, false)),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// Fetches one loan (with audit trail) matching a filter or throws 404
export const getLoanView = async (filter: Record<string, unknown>): Promise<OperationsLoanView> => {
  const loan = await LoanApplication.findOne(filter).populate("borrower", "name email").lean<LoanLean>();
  if (!loan) throw new NotFoundError(MESSAGES.OPERATIONS.NOT_FOUND);
  return toOperationsView(loan, true);
};
