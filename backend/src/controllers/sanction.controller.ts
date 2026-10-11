import { Request, Response } from "express";
import * as sanctionService from "../services/sanction.service";
import { ApplicationStatus } from "../types/loan";
import { getActor } from "../utils/actor";
import { MESSAGES } from "../utils/messages";
import { getIdParam } from "../utils/params";
import { sendSuccess } from "../utils/response";
import { assertValid, parseListQuery, validateOptionalNote, validateRejectBody } from "../utils/validators";

// Lists loans in the sanction queue (default APPLIED; ?status=SANCTIONED|REJECTED shows past decisions)
export const listApplications = async (req: Request, res: Response) => {
  const { page, limit, filter } = parseListQuery(req.query, "status", sanctionService.SANCTION_STATUSES);
  const result = await sanctionService.listApplications(filter ?? ApplicationStatus.APPLIED, page, limit);
  return sendSuccess(res, { loans: result.items, pagination: result.pagination }, MESSAGES.OPERATIONS.LIST_FETCHED);
};

// Returns one loan with borrower details, loan terms and audit trail
export const getApplication = async (req: Request, res: Response) => {
  const loan = await sanctionService.getApplication(getIdParam(req));
  return sendSuccess(res, { loan }, MESSAGES.OPERATIONS.LOAN_FETCHED);
};

// Returns a short-lived link to view the borrower's private salary slip
export const getSalarySlipLink = async (req: Request, res: Response) => {
  const link = await sanctionService.getSalarySlipLink(getIdParam(req));
  return sendSuccess(res, { salarySlip: link }, MESSAGES.OPERATIONS.SLIP_LINK_FETCHED);
};

// Approves an applied loan (optional note)
export const approve = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const body = req.body ?? {};
  assertValid(validateOptionalNote(body));
  const loan = await sanctionService.approve(getActor(req), id, body.note?.trim() || undefined);
  return sendSuccess(res, { loan }, MESSAGES.OPERATIONS.APPROVED);
};

// Rejects an applied loan with a mandatory reason
export const reject = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const body = req.body ?? {};
  assertValid(validateRejectBody(body));
  const loan = await sanctionService.reject(getActor(req), id, body.reason.trim());
  return sendSuccess(res, { loan }, MESSAGES.OPERATIONS.REJECTED);
};
