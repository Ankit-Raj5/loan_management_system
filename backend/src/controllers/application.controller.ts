import { Request, Response } from "express";
import * as applicationService from "../services/application.service";
import { getActor } from "../utils/actor";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";
import { sendCreated, sendSuccess } from "../utils/response";
import {
  assertValid,
  isValidObjectId,
  parseDateOnly,
  validateLoanConfig,
  validatePersonalDetails,
} from "../utils/validators";

// Returns the logged-in user's id or throws 401 if the request is unauthenticated
const getUserId = (req: Request): string => {
  if (!req.user) throw new UnauthorizedError(MESSAGES.AUTH.TOKEN_MISSING);
  return req.user.id;
};

// Reads and validates the :id route param as a MongoDB ObjectId
const getApplicationId = (req: Request): string => {
  const id = req.params.id;
  if (!isValidObjectId(id)) throw new BadRequestError(MESSAGES.APPLICATION.INVALID_ID);
  return id;
};

// Step 2: validates personal details, runs the BRE and saves the draft application
export const submitPersonalDetails = async (req: Request, res: Response) => {
  const actor = getActor(req);
  const body = req.body ?? {};
  assertValid(validatePersonalDetails(body));

  const application = await applicationService.submitPersonalDetails(actor, {
    fullName: body.fullName.trim(),
    pan: body.pan.trim().toUpperCase(),
    dob: parseDateOnly(body.dob) as Date,
    monthlySalary: body.monthlySalary,
    employmentMode: body.employmentMode,
  });
  return sendCreated(res, { application }, MESSAGES.APPLICATION.PERSONAL_DETAILS_SAVED);
};

// Step 3: stores the uploaded salary slip against the application
export const uploadSalarySlip = async (req: Request, res: Response) => {
  const application = await applicationService.uploadSalarySlip(getUserId(req), getApplicationId(req), req.file);
  return sendSuccess(res, { application }, MESSAGES.APPLICATION.SALARY_SLIP_UPLOADED);
};

// Step 4 preview: returns the live interest and repayment calculation without saving
export const calculateLoan = async (req: Request, res: Response) => {
  const input = { amount: Number(req.query.amount), tenureDays: Number(req.query.tenureDays) };
  assertValid(validateLoanConfig(input));
  const calculation = applicationService.previewLoan(input.amount, input.tenureDays);
  return sendSuccess(res, { calculation }, MESSAGES.APPLICATION.CALCULATED);
};

// Step 4: submits the loan application with the chosen amount and tenure
export const applyForLoan = async (req: Request, res: Response) => {
  const actor = getActor(req);
  const applicationId = getApplicationId(req);
  const body = req.body ?? {};
  assertValid(validateLoanConfig(body));

  const application = await applicationService.applyForLoan(actor, applicationId, body.amount, body.tenureDays);
  return sendSuccess(res, { application }, MESSAGES.APPLICATION.APPLIED);
};

// Lists every application belonging to the logged-in borrower
export const listMyApplications = async (req: Request, res: Response) => {
  const applications = await applicationService.listMyApplications(getUserId(req));
  return sendSuccess(res, { applications }, MESSAGES.APPLICATION.LIST_FETCHED);
};

// Returns one application belonging to the logged-in borrower
export const getMyApplication = async (req: Request, res: Response) => {
  const application = await applicationService.getMyApplication(getUserId(req), getApplicationId(req));
  return sendSuccess(res, { application }, MESSAGES.APPLICATION.FETCHED);
};
