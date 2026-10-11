import { Types } from "mongoose";
import { LOAN_CONFIG } from "../config/loan.config";
import { ALL_EMPLOYMENT_MODES, EmploymentMode } from "../types/loan";
import { ValidationError } from "./errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = Record<string, string>;

// Throws a 422 ValidationError when any field errors were collected
export const assertValid = (errors: FieldErrors): void => {
  if (Object.keys(errors).length > 0) throw new ValidationError("Validation failed", errors);
};

// Type guard checking that a value is a string
export const isString = (v: unknown): v is string => typeof v === "string";

// Validates the register request body (name, email, password)
export const validateRegister = (body: Record<string, unknown>): FieldErrors => {
  const errors: FieldErrors = {};
  if (!isString(body.name) || body.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters";
  if (!isString(body.email) || !EMAIL_REGEX.test(body.email)) errors.email = "A valid email is required";
  if (!isString(body.password) || body.password.length < 8)
    errors.password = "Password must be at least 8 characters";
  return errors;
};

// Validates the login request body (email, password)
export const validateLogin = (body: Record<string, unknown>): FieldErrors => {
  const errors: FieldErrors = {};
  if (!isString(body.email) || !EMAIL_REGEX.test(body.email)) errors.email = "A valid email is required";
  if (!isString(body.password) || body.password.length === 0) errors.password = "Password is required";
  return errors;
};

// Parses a YYYY-MM-DD string into a UTC date, returning null if it is not a real calendar date
export const parseDateOnly = (value: unknown): Date | null => {
  if (!isString(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return date;
};

// Checks that a value is a valid MongoDB ObjectId string
export const isValidObjectId = (value: unknown): value is string =>
  isString(value) && Types.ObjectId.isValid(value) && String(new Types.ObjectId(value)) === value;

// Validates the personal details body: every field is required and must be well-formed
export const validatePersonalDetails = (body: Record<string, unknown>): FieldErrors => {
  const errors: FieldErrors = {};

  if (!isString(body.fullName) || body.fullName.trim().length < 2 || body.fullName.trim().length > 100)
    errors.fullName = "Full name must be between 2 and 100 characters";

  if (!isString(body.pan) || body.pan.trim().length === 0) errors.pan = "PAN is required";

  const dob = parseDateOnly(body.dob);
  if (!dob) errors.dob = "Date of birth is required in YYYY-MM-DD format";
  else if (dob.getTime() > Date.now()) errors.dob = "Date of birth cannot be in the future";
  else if (dob.getUTCFullYear() < 1900) errors.dob = "Date of birth is not valid";

  if (typeof body.monthlySalary !== "number" || !Number.isFinite(body.monthlySalary) || body.monthlySalary <= 0)
    errors.monthlySalary = "Monthly salary must be a number greater than 0";

  if (!ALL_EMPLOYMENT_MODES.includes(body.employmentMode as EmploymentMode))
    errors.employmentMode = `Employment mode must be one of: ${ALL_EMPLOYMENT_MODES.join(", ")}`;

  return errors;
};

// Validates loan amount (whole rupees) and tenure (whole days) against the allowed ranges
export const validateLoanConfig = (body: Record<string, unknown>): FieldErrors => {
  const errors: FieldErrors = {};
  const { amount, tenureDays } = body;

  if (
    typeof amount !== "number" ||
    !Number.isInteger(amount) ||
    amount < LOAN_CONFIG.MIN_AMOUNT ||
    amount > LOAN_CONFIG.MAX_AMOUNT
  )
    errors.amount = `Amount must be a whole number between ${LOAN_CONFIG.MIN_AMOUNT} and ${LOAN_CONFIG.MAX_AMOUNT}`;

  if (
    typeof tenureDays !== "number" ||
    !Number.isInteger(tenureDays) ||
    tenureDays < LOAN_CONFIG.MIN_TENURE_DAYS ||
    tenureDays > LOAN_CONFIG.MAX_TENURE_DAYS
  )
    errors.tenureDays = `Tenure must be a whole number of days between ${LOAN_CONFIG.MIN_TENURE_DAYS} and ${LOAN_CONFIG.MAX_TENURE_DAYS}`;

  return errors;
};

// Validates the change-password request body (currentPassword, newPassword)
export const validateChangePassword = (body: Record<string, unknown>): FieldErrors => {
  const errors: FieldErrors = {};
  if (!isString(body.currentPassword) || body.currentPassword.length === 0)
    errors.currentPassword = "Current password is required";
  if (!isString(body.newPassword) || body.newPassword.length < 8)
    errors.newPassword = "New password must be at least 8 characters";
  return errors;
};
