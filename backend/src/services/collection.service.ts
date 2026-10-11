import { Types } from "mongoose";
import { LoanApplication } from "../models/loanApplication.model";
import { Payment } from "../models/payment.model";
import { AuditActor } from "../types/audit";
import { ApplicationStatus } from "../types/loan";
import { toBusinessDate } from "../utils/dates";
import { ConflictError, NotFoundError, ValidationError } from "../utils/errors";
import { fromPaise, toPaise } from "../utils/money";
import { MESSAGES } from "../utils/messages";
import { getLoanView, listLoanViews, OperationsLoanView, Pagination } from "./loanView.service";
import { buildHistoryEntry } from "./loanWorkflow.service";

export const COLLECTION_STATUSES = [ApplicationStatus.DISBURSED, ApplicationStatus.CLOSED] as const;

export interface PaymentInput {
  utr: string;
  amount: number;
  paymentDate: Date;
}

export interface PaymentView {
  id: string;
  utr: string;
  amount: number;
  paymentDate: Date;
  recordedByName: string;
  createdAt: Date;
}

export interface CollectionLoanDetail extends OperationsLoanView {
  payments: PaymentView[];
}

export interface RecordPaymentResult {
  payment: PaymentView;
  loan: OperationsLoanView;
  closed: boolean;
}

const scopeFilter = (): Record<string, unknown> => ({ status: { $in: [...COLLECTION_STATUSES] } });

// Lists loans for a status, defaulting to the active DISBURSED collection queue
export const listLoans = async (
  status: ApplicationStatus,
  page: number,
  limit: number
): Promise<{ items: OperationsLoanView[]; pagination: Pagination }> => listLoanViews({ status }, page, limit);

// Returns one loan with its summary, audit trail and full payment history
export const getLoan = async (id: string): Promise<CollectionLoanDetail> => {
  const loan = await getLoanView({ _id: id, ...scopeFilter() });
  const payments = await Payment.find({ loan: id }).sort({ paymentDate: -1, createdAt: -1 }).lean();
  return {
    ...loan,
    payments: payments.map((p) => ({
      id: String(p._id),
      utr: p.utr,
      amount: p.amount,
      paymentDate: p.paymentDate,
      recordedByName: p.recordedByName,
      createdAt: p.createdAt,
    })),
  };
};

// Records a payment against a DISBURSED loan and auto-closes the loan when the balance reaches zero
export const recordPayment = async (
  actor: AuditActor,
  id: string,
  input: PaymentInput
): Promise<RecordPaymentResult> => {
  const loan = await LoanApplication.findOne({ _id: id, ...scopeFilter() });
  if (!loan || !loan.loan) throw new NotFoundError(MESSAGES.OPERATIONS.NOT_FOUND);
  if (loan.status !== ApplicationStatus.DISBURSED) throw new ConflictError(MESSAGES.OPERATIONS.LOAN_NOT_ACTIVE);

  const totalPaise = toPaise(loan.loan.totalRepayment);
  const paidPaise = toPaise(loan.amountPaid ?? 0);
  const amountPaise = toPaise(input.amount);
  const outstandingPaise = totalPaise - paidPaise;

  if (amountPaise > outstandingPaise) {
    throw new ValidationError(MESSAGES.COMMON.VALIDATION_FAILED, {
      amount: `Amount exceeds the outstanding balance of ₹${fromPaise(outstandingPaise).toFixed(2)}`,
    });
  }
  if (loan.disbursedAt && toBusinessDate(input.paymentDate) < toBusinessDate(loan.disbursedAt)) {
    throw new ValidationError(MESSAGES.COMMON.VALIDATION_FAILED, {
      date: MESSAGES.OPERATIONS.DATE_BEFORE_DISBURSAL,
    });
  }

  let paymentDoc;
  try {
    paymentDoc = await Payment.create({
      loan: loan._id,
      utr: input.utr,
      amount: input.amount,
      paymentDate: input.paymentDate,
      recordedBy: new Types.ObjectId(actor.userId),
      recordedByName: actor.name,
    });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) throw new ConflictError(MESSAGES.OPERATIONS.UTR_EXISTS);
    throw err;
  }

  const newPaidPaise = paidPaise + amountPaise;
  const closes = newPaidPaise === totalPaise;
  const now = new Date();

  const updated = await LoanApplication.findOneAndUpdate(
    { _id: id, status: ApplicationStatus.DISBURSED, amountPaid: loan.amountPaid },
    {
      $set: {
        amountPaid: fromPaise(newPaidPaise),
        ...(closes && { status: ApplicationStatus.CLOSED, closedAt: now }),
      },
      ...(closes && {
        $push: {
          statusHistory: buildHistoryEntry(
            ApplicationStatus.DISBURSED,
            ApplicationStatus.CLOSED,
            actor,
            `Auto-closed: fully repaid (final payment UTR ${input.utr})`
          ),
        },
      }),
    },
    { new: true }
  );

  if (!updated) {
    await Payment.deleteOne({ _id: paymentDoc._id });
    throw new ConflictError(MESSAGES.OPERATIONS.PAYMENT_CONFLICT);
  }

  return {
    payment: {
      id: paymentDoc.id,
      utr: paymentDoc.utr,
      amount: paymentDoc.amount,
      paymentDate: paymentDoc.paymentDate,
      recordedByName: paymentDoc.recordedByName,
      createdAt: paymentDoc.createdAt,
    },
    loan: await getLoanView({ _id: id }),
    closed: closes,
  };
};
