import { Types } from "mongoose";
import { SALARY_SLIP_UPLOAD } from "../config/upload.config";
import {
  IBreFailure,
  ILoanTerms,
  LoanApplication,
  LoanApplicationDocument,
} from "../models/loanApplication.model";
import {
  ACTIVE_STATUSES,
  ApplicationStatus,
  ApplicationStep,
  EmploymentMode,
  RejectionSource,
} from "../types/loan";
import { BusinessRuleError, ConflictError, NotFoundError, ValidationError } from "../utils/errors";
import { calculateLoan, LoanBreakdown } from "../utils/loanCalculator";
import { MESSAGES } from "../utils/messages";
import { evaluate } from "./bre.service";
import { deleteSalarySlipFile, uploadSalarySlipFile } from "./storage.service";

export interface PersonalDetailsInput {
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface ApplicationResponse {
  id: string;
  status: ApplicationStatus;
  currentStep: ApplicationStep;
  personalDetails: {
    fullName: string;
    pan: string;
    dob: Date;
    monthlySalary: number;
    employmentMode: EmploymentMode;
  };
  salarySlip: { originalName: string; mimeType: string; size: number; uploadedAt: Date } | null;
  loan: ILoanTerms | null;
  appliedAt: Date | null;
  rejectionReason: string | null;
  rejectionSource: RejectionSource | null;
  breFailures: IBreFailure[];
  createdAt: Date;
  updatedAt: Date;
}

const FILE_SIGNATURES: Record<string, number[][]> = {
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
};

// Works out which step of the borrower journey the application is currently on
const resolveStep = (app: LoanApplicationDocument): ApplicationStep => {
  if (app.status === ApplicationStatus.REJECTED) return ApplicationStep.REJECTED;
  if (app.status !== ApplicationStatus.DRAFT) return ApplicationStep.SUBMITTED;
  if (!app.salarySlip) return ApplicationStep.SALARY_SLIP;
  return ApplicationStep.LOAN_CONFIG;
};

// Converts an application document into the safe response shape (hides storage ids and urls)
const toApplicationResponse = (app: LoanApplicationDocument): ApplicationResponse => ({
  id: app.id,
  status: app.status,
  currentStep: resolveStep(app),
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
  appliedAt: app.appliedAt ?? null,
  rejectionReason: app.rejectionReason ?? null,
  rejectionSource: app.rejectionSource ?? null,
  breFailures: (app.breFailures ?? []).map((f) => ({ rule: f.rule, message: f.message })),
  createdAt: app.createdAt,
  updatedAt: app.updatedAt,
});

// Checks the first bytes of the file so a renamed file cannot pass as PDF, JPG or PNG
const hasValidSignature = (buffer: Buffer, mimeType: string): boolean => {
  const signatures = FILE_SIGNATURES[mimeType];
  if (!signatures) return false;
  return signatures.some((sig) => sig.every((byte, i) => buffer[i] === byte));
};

// Finds an application owned by the borrower or throws 404 (also covers other users' ids)
const findOwnedApplication = async (userId: string, applicationId: string): Promise<LoanApplicationDocument> => {
  const app = await LoanApplication.findOne({ _id: applicationId, borrower: userId });
  if (!app) throw new NotFoundError(MESSAGES.APPLICATION.NOT_FOUND);
  return app;
};

// Throws 409 if the borrower already has a loan in progress
const assertNoActiveApplication = async (userId: string): Promise<void> => {
  const active = await LoanApplication.exists({ borrower: userId, status: { $in: ACTIVE_STATUSES } });
  if (active) throw new ConflictError(MESSAGES.APPLICATION.ACTIVE_EXISTS);
};

// Throws 409 unless the application is still a draft the borrower can edit
const assertDraft = (app: LoanApplicationDocument): void => {
  if (app.status !== ApplicationStatus.DRAFT) throw new ConflictError(MESSAGES.APPLICATION.NOT_EDITABLE);
};

// Marks an application as REJECTED by the BRE, saves the reasons and throws the BRE_REJECTED error
const rejectByBre = async (app: LoanApplicationDocument, failures: IBreFailure[]): Promise<never> => {
  app.status = ApplicationStatus.REJECTED;
  app.rejectionSource = RejectionSource.BRE;
  app.breFailures = failures;
  app.rejectionReason = `${MESSAGES.APPLICATION.BRE_REJECTION_PREFIX}: ${failures.map((f) => f.message).join("; ")}`;
  await app.save();
  throw new BusinessRuleError(MESSAGES.APPLICATION.BRE_REJECTED, { applicationId: app.id, failures });
};

// Previews the loan maths for the live calculation panel without saving anything
export const previewLoan = (amount: number, tenureDays: number): LoanBreakdown =>
  calculateLoan(amount, tenureDays);

// Runs the BRE on the borrower's working DRAFT (creating one only if none exists): stays DRAFT if eligible, becomes REJECTED if not
export const submitPersonalDetails = async (
  userId: string,
  input: PersonalDetailsInput
): Promise<ApplicationResponse> => {
  await assertNoActiveApplication(userId);

  const app =
    (await LoanApplication.findOne({ borrower: userId, status: ApplicationStatus.DRAFT })) ??
    new LoanApplication({ borrower: new Types.ObjectId(userId), status: ApplicationStatus.DRAFT });
  app.personalDetails = input;

  const failures = evaluate(input);
  if (failures.length > 0) return rejectByBre(app, failures);

  await app.save();
  return toApplicationResponse(app);
};

// Validates the salary slip, uploads it to Cloudinary and links it to a draft application
export const uploadSalarySlip = async (
  userId: string,
  applicationId: string,
  file: Express.Multer.File | undefined
): Promise<ApplicationResponse> => {
  if (!file) {
    throw new ValidationError(MESSAGES.COMMON.VALIDATION_FAILED, {
      [SALARY_SLIP_UPLOAD.FIELD_NAME]: MESSAGES.APPLICATION.SLIP_FILE_REQUIRED,
    });
  }

  const app = await findOwnedApplication(userId, applicationId);
  assertDraft(app);

  if (!hasValidSignature(file.buffer, file.mimetype)) {
    throw new ValidationError(MESSAGES.COMMON.VALIDATION_FAILED, {
      [SALARY_SLIP_UPLOAD.FIELD_NAME]: MESSAGES.APPLICATION.SLIP_CONTENT_MISMATCH,
    });
  }

  const stored = await uploadSalarySlipFile(file.buffer);
  const previous = app.salarySlip;

  try {
    app.salarySlip = {
      originalName: file.originalname,
      publicId: stored.publicId,
      url: stored.url,
      resourceType: stored.resourceType,
      mimeType: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
    };
    await app.save();
  } catch (err) {
    await deleteSalarySlipFile(stored.publicId, stored.resourceType);
    throw err;
  }

  if (previous) await deleteSalarySlipFile(previous.publicId, previous.resourceType);
  return toApplicationResponse(app);
};

// Re-checks eligibility, calculates the loan and submits the application as APPLIED
export const applyForLoan = async (
  userId: string,
  applicationId: string,
  amount: number,
  tenureDays: number
): Promise<ApplicationResponse> => {
  const app = await findOwnedApplication(userId, applicationId);
  assertDraft(app);

  if (!app.salarySlip) {
    throw new ValidationError(MESSAGES.COMMON.VALIDATION_FAILED, {
      [SALARY_SLIP_UPLOAD.FIELD_NAME]: MESSAGES.APPLICATION.SLIP_REQUIRED_BEFORE_APPLY,
    });
  }

  await assertNoActiveApplication(userId);

  const failures = evaluate(app.personalDetails);
  if (failures.length > 0) return rejectByBre(app, failures);

  app.loan = calculateLoan(amount, tenureDays);
  app.status = ApplicationStatus.APPLIED;
  app.appliedAt = new Date();
  await app.save();

  return toApplicationResponse(app);
};

// Lists all of the borrower's applications, newest first
export const listMyApplications = async (userId: string): Promise<ApplicationResponse[]> => {
  const apps = await LoanApplication.find({ borrower: userId }).sort({ createdAt: -1 });
  return apps.map(toApplicationResponse);
};

// Returns a single application that belongs to the borrower
export const getMyApplication = async (userId: string, applicationId: string): Promise<ApplicationResponse> =>
  toApplicationResponse(await findOwnedApplication(userId, applicationId));
