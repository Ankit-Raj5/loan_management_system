import { Types } from "mongoose";
import { AuditActor } from "../types/audit";
import { ApplicationStatus } from "../types/loan";
import { getLoanView, listLoanViews, OperationsLoanView, Pagination } from "./loanView.service";
import { transitionLoan } from "./loanWorkflow.service";

export const DISBURSEMENT_STATUSES = [ApplicationStatus.SANCTIONED, ApplicationStatus.DISBURSED] as const;

const scopeFilter = (): Record<string, unknown> => ({ status: { $in: [...DISBURSEMENT_STATUSES] } });

// Lists loans for a status, defaulting to the SANCTIONED disbursement queue
export const listLoans = async (
  status: ApplicationStatus,
  page: number,
  limit: number
): Promise<{ items: OperationsLoanView[]; pagination: Pagination }> => listLoanViews({ status }, page, limit);

// Returns one loan with full details and audit trail
export const getLoan = (id: string): Promise<OperationsLoanView> => getLoanView({ _id: id, ...scopeFilter() });

// Marks a SANCTIONED loan as disbursed (SANCTIONED -> DISBURSED) and starts the repayment balance at zero paid
export const disburse = async (actor: AuditActor, id: string, note?: string): Promise<OperationsLoanView> => {
  await transitionLoan({
    applicationId: id,
    from: ApplicationStatus.SANCTIONED,
    to: ApplicationStatus.DISBURSED,
    actor,
    set: { disbursedAt: new Date(), disbursedBy: new Types.ObjectId(actor.userId), amountPaid: 0 },
    note,
  });
  return getLoan(id);
};
