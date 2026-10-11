import { HydratedDocument, Model, Schema, Types, model } from "mongoose";
import {
  ALL_APPLICATION_STATUSES,
  ALL_EMPLOYMENT_MODES,
  ApplicationStatus,
  EmploymentMode,
  RejectionSource,
} from "../types/loan";

export interface IPersonalDetails {
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface ISalarySlip {
  originalName: string;
  publicId: string;
  url: string;
  resourceType: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export interface ILoanTerms {
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}

export interface IBreFailure {
  rule: string;
  message: string;
}

export interface ILoanApplication {
  borrower: Types.ObjectId;
  status: ApplicationStatus;
  personalDetails: IPersonalDetails;
  salarySlip?: ISalarySlip;
  loan?: ILoanTerms;
  appliedAt?: Date;
  rejectionReason?: string;
  rejectionSource?: RejectionSource;
  breFailures: IBreFailure[];
  createdAt: Date;
  updatedAt: Date;
}

export type LoanApplicationDocument = HydratedDocument<ILoanApplication>;

const personalDetailsSchema = new Schema<IPersonalDetails>(
  {
    fullName: { type: String, required: true, trim: true },
    pan: { type: String, required: true, uppercase: true, trim: true },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 0 },
    employmentMode: { type: String, enum: ALL_EMPLOYMENT_MODES, required: true },
  },
  { _id: false }
);

const salarySlipSchema = new Schema<ISalarySlip>(
  {
    originalName: { type: String, required: true },
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    resourceType: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, required: true },
  },
  { _id: false }
);

const loanTermsSchema = new Schema<ILoanTerms>(
  {
    amount: { type: Number, required: true },
    tenureDays: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    simpleInterest: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
  },
  { _id: false }
);

const breFailureSchema = new Schema<IBreFailure>(
  {
    rule: { type: String, required: true },
    message: { type: String, required: true },
  },
  { _id: false }
);

const loanApplicationSchema = new Schema<ILoanApplication>(
  {
    borrower: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: {
      type: String,
      enum: ALL_APPLICATION_STATUSES,
      default: ApplicationStatus.DRAFT,
      index: true,
    },
    personalDetails: { type: personalDetailsSchema, required: true },
    salarySlip: { type: salarySlipSchema },
    loan: { type: loanTermsSchema },
    appliedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
    rejectionSource: { type: String, enum: Object.values(RejectionSource) },
    breFailures: { type: [breFailureSchema], default: [] },
  },
  { timestamps: true }
);

export const LoanApplication: Model<ILoanApplication> = model<ILoanApplication>(
  "LoanApplication",
  loanApplicationSchema
);
