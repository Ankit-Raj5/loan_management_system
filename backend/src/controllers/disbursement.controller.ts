import { Request, Response } from "express";
import * as disbursementService from "../services/disbursement.service";
import { ApplicationStatus } from "../types/loan";
import { getActor } from "../utils/actor";
import { MESSAGES } from "../utils/messages";
import { getIdParam } from "../utils/params";
import { sendSuccess } from "../utils/response";
import { assertValid, parseListQuery, validateOptionalNote } from "../utils/validators";

// Lists loans in the disbursement queue (default SANCTIONED; ?status=DISBURSED shows released loans)
export const listLoans = async (req: Request, res: Response) => {
  const { page, limit, filter } = parseListQuery(req.query, "status", disbursementService.DISBURSEMENT_STATUSES);
  const result = await disbursementService.listLoans(filter ?? ApplicationStatus.SANCTIONED, page, limit);
  return sendSuccess(res, { loans: result.items, pagination: result.pagination }, MESSAGES.OPERATIONS.LIST_FETCHED);
};

// Returns one loan with borrower details, loan terms and audit trail
export const getLoan = async (req: Request, res: Response) => {
  const loan = await disbursementService.getLoan(getIdParam(req));
  return sendSuccess(res, { loan }, MESSAGES.OPERATIONS.LOAN_FETCHED);
};

// Marks a sanctioned loan as disbursed (optional note)
export const disburse = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const body = req.body ?? {};
  assertValid(validateOptionalNote(body));
  const loan = await disbursementService.disburse(getActor(req), id, body.note?.trim() || undefined);
  return sendSuccess(res, { loan }, MESSAGES.OPERATIONS.DISBURSED);
};
