import { Types } from "mongoose";
import { LoanApplication } from "../models/loanApplication.model";
import { AuditActor } from "../types/audit";
import { ApplicationStatus, RejectionSource } from "../types/loan";
import { NotFoundError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";
import { getLoanView, listLoanViews, OperationsLoanView, Pagination } from "./loanView.service";
import { getSalarySlipDownloadUrl } from "./storage.service";
import { transitionLoan } from "./loanWorkflow.service";

export const SANCTION_STATUSES = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.SANCTIONED,
  ApplicationStatus.REJECTED,
] as const;

const SLIP_LINK_TTL_SECONDS = 300;

// Restricts queries to loans the Sanction module may see (submitted loans; BRE rejections are excluded)
const scopeFilter = (): Record<string, unknown> => ({
  $or: [
    { status: { $in: [ApplicationStatus.APPLIED, ApplicationStatus.SANCTIONED] } },
    { status: ApplicationStatus.REJECTED, rejectionSource: RejectionSource.SANCTION },
  ],
});

// Lists loans for a status, defaulting to the APPLIED review queue
export const listApplications = async (
  status: ApplicationStatus,
  page: number,
  limit: number
): Promise<{ items: OperationsLoanView[]; pagination: Pagination }> => {
  const filter =
    status === ApplicationStatus.REJECTED ? { status, rejectionSource: RejectionSource.SANCTION } : { status };
  return listLoanViews(filter, page, limit);
};

// Returns one loan with full details and audit trail
export const getApplication = (id: string): Promise<OperationsLoanView> =>
  getLoanView({ _id: id, ...scopeFilter() });

// Approves an APPLIED loan (APPLIED -> SANCTIONED)
export const approve = async (actor: AuditActor, id: string, note?: string): Promise<OperationsLoanView> => {
  await transitionLoan({
    applicationId: id,
    from: ApplicationStatus.APPLIED,
    to: ApplicationStatus.SANCTIONED,
    actor,
    set: { sanctionedAt: new Date(), sanctionedBy: new Types.ObjectId(actor.userId) },
    note,
  });
  return getApplication(id);
};

// Rejects an APPLIED loan with a mandatory reason (APPLIED -> REJECTED)
export const reject = async (actor: AuditActor, id: string, reason: string): Promise<OperationsLoanView> => {
  await transitionLoan({
    applicationId: id,
    from: ApplicationStatus.APPLIED,
    to: ApplicationStatus.REJECTED,
    actor,
    set: {
      rejectionReason: reason,
      rejectionSource: RejectionSource.SANCTION,
      rejectedAt: new Date(),
      rejectedBy: new Types.ObjectId(actor.userId),
    },
    note: reason,
  });
  return getApplication(id);
};

// Generates a short-lived link so the executive can view the borrower's private salary slip
export const getSalarySlipLink = async (
  id: string
): Promise<{ url: string; expiresAt: Date; fileName: string; mimeType: string }> => {
  const app = await LoanApplication.findOne({ _id: id, ...scopeFilter() }).select("salarySlip");
  if (!app) throw new NotFoundError(MESSAGES.OPERATIONS.NOT_FOUND);
  if (!app.salarySlip) throw new NotFoundError(MESSAGES.OPERATIONS.NO_SALARY_SLIP);

  const { url, expiresAt } = getSalarySlipDownloadUrl(
    app.salarySlip.publicId,
    app.salarySlip.resourceType,
    app.salarySlip.mimeType,
    SLIP_LINK_TTL_SECONDS
  );
  return { url, expiresAt, fileName: app.salarySlip.originalName, mimeType: app.salarySlip.mimeType };
};
