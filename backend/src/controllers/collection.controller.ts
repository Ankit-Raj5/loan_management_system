import { Request, Response } from "express";
import * as collectionService from "../services/collection.service";
import { ApplicationStatus } from "../types/loan";
import { getActor } from "../utils/actor";
import { MESSAGES } from "../utils/messages";
import { getIdParam } from "../utils/params";
import { sendCreated, sendSuccess } from "../utils/response";
import { assertValid, parseDateOnly, parseListQuery, validatePaymentBody } from "../utils/validators";

// Lists loans in the collection queue (default DISBURSED; ?status=CLOSED shows fully repaid loans)
export const listLoans = async (req: Request, res: Response) => {
  const { page, limit, filter } = parseListQuery(req.query, "status", collectionService.COLLECTION_STATUSES);
  const result = await collectionService.listLoans(filter ?? ApplicationStatus.DISBURSED, page, limit);
  return sendSuccess(res, { loans: result.items, pagination: result.pagination }, MESSAGES.OPERATIONS.LIST_FETCHED);
};

// Returns one loan with its balance, audit trail and payment history
export const getLoan = async (req: Request, res: Response) => {
  const loan = await collectionService.getLoan(getIdParam(req));
  return sendSuccess(res, { loan }, MESSAGES.OPERATIONS.LOAN_FETCHED);
};

// Records a payment (UTR, amount, date) and closes the loan when fully repaid
export const recordPayment = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const body = req.body ?? {};
  assertValid(validatePaymentBody(body));

  const result = await collectionService.recordPayment(getActor(req), id, {
    utr: body.utr.trim().toUpperCase(),
    amount: body.amount,
    paymentDate: parseDateOnly(body.date) as Date,
  });
  const message = result.closed ? MESSAGES.OPERATIONS.PAYMENT_RECORDED_CLOSED : MESSAGES.OPERATIONS.PAYMENT_RECORDED;
  return sendCreated(res, result, message);
};
