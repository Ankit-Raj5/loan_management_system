import { ValidationError } from "./errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = Record<string, string>;

/** Throws a ValidationError (422) carrying per-field messages. */
export const assertValid = (errors: FieldErrors): void => {
  if (Object.keys(errors).length > 0) throw new ValidationError("Validation failed", errors);
};

export const isString = (v: unknown): v is string => typeof v === "string";

export const validateRegister = (body: Record<string, unknown>): FieldErrors => {
  const errors: FieldErrors = {};
  if (!isString(body.name) || body.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters";
  if (!isString(body.email) || !EMAIL_REGEX.test(body.email)) errors.email = "A valid email is required";
  if (!isString(body.password) || body.password.length < 8)
    errors.password = "Password must be at least 8 characters";
  return errors;
};

export const validateLogin = (body: Record<string, unknown>): FieldErrors => {
  const errors: FieldErrors = {};
  if (!isString(body.email) || !EMAIL_REGEX.test(body.email)) errors.email = "A valid email is required";
  if (!isString(body.password) || body.password.length === 0) errors.password = "Password is required";
  return errors;
};
