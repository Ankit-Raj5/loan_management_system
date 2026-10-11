import { Types } from "mongoose";
import { IStatusHistory, LoanApplication } from "../models/loanApplication.model";
import { AuditActor } from "../types/audit";
import { ApplicationStatus } from "../types/loan";
import { ConflictError, NotFoundError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";

export interface HistoryView {
  from: ApplicationStatus | null;
  to: ApplicationStatus;
  byName: string;
  byRole: string;
  at: Date;
  note: string | null;
}

export interface TransitionOptions {
  applicationId: string;
  from: ApplicationStatus;
  to: ApplicationStatus;
  actor: AuditActor;
  set?: Record<string, unknown>;
  note?: string;
}

// Builds one audit-trail entry describing a status change and who made it
export const buildHistoryEntry = (
  from: ApplicationStatus | null,
  to: ApplicationStatus,
  actor: AuditActor,
  note?: string
): IStatusHistory => ({
  from,
  to,
  by: actor.userId ? new Types.ObjectId(actor.userId) : undefined,
  byName: actor.name,
  byRole: actor.role,
  at: new Date(),
  note,
});

// Converts stored audit entries into the response shape (hides user ids)
export const toHistoryViews = (history: IStatusHistory[] | undefined): HistoryView[] =>
  (history ?? []).map((h) => ({
    from: h.from ?? null,
    to: h.to,
    byName: h.byName,
    byRole: h.byRole,
    at: h.at,
    note: h.note ?? null,
  }));

// Atomically moves a loan from one status to another and appends the audit entry (409 if the loan is in a different status)
export const transitionLoan = async (options: TransitionOptions): Promise<void> => {
  const { applicationId, from, to, actor, set = {}, note } = options;

  const updated = await LoanApplication.findOneAndUpdate(
    { _id: applicationId, status: from },
    { $set: { ...set, status: to }, $push: { statusHistory: buildHistoryEntry(from, to, actor, note) } },
    { new: true }
  );
  if (updated) return;

  const current = await LoanApplication.findById(applicationId).select("status");
  if (!current) throw new NotFoundError(MESSAGES.OPERATIONS.NOT_FOUND);
  throw new ConflictError(`${MESSAGES.OPERATIONS.WRONG_STATE} (current: ${current.status}, required: ${from})`);
};
