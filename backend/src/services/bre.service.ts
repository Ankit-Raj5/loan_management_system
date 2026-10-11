import { LOAN_CONFIG, PAN_REGEX } from "../config/loan.config";
import { EmploymentMode } from "../types/loan";

export interface BreInput {
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface BreFailure {
  rule: "AGE" | "SALARY" | "PAN" | "EMPLOYMENT";
  message: string;
}

// Calculates completed years of age on the given date (UTC)
export const calculateAge = (dob: Date, today: Date = new Date()): number => {
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const beforeBirthday =
    today.getUTCMonth() < dob.getUTCMonth() ||
    (today.getUTCMonth() === dob.getUTCMonth() && today.getUTCDate() < dob.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
};

// Runs every eligibility rule and returns all failures (empty list means eligible)
export const evaluate = (input: BreInput, today: Date = new Date()): BreFailure[] => {
  const failures: BreFailure[] = [];

  const age = calculateAge(input.dob, today);
  if (age < LOAN_CONFIG.MIN_AGE || age > LOAN_CONFIG.MAX_AGE) {
    failures.push({
      rule: "AGE",
      message: `Age must be between ${LOAN_CONFIG.MIN_AGE} and ${LOAN_CONFIG.MAX_AGE} years (your age: ${age})`,
    });
  }

  if (input.monthlySalary < LOAN_CONFIG.MIN_SALARY) {
    failures.push({
      rule: "SALARY",
      message: `Monthly salary must be at least ₹${LOAN_CONFIG.MIN_SALARY.toLocaleString("en-IN")}`,
    });
  }

  if (!PAN_REGEX.test(input.pan)) {
    failures.push({
      rule: "PAN",
      message: "PAN must be in the format ABCDE1234F (5 letters, 4 digits, 1 letter)",
    });
  }

  if (input.employmentMode === EmploymentMode.UNEMPLOYED) {
    failures.push({ rule: "EMPLOYMENT", message: "Unemployed applicants are not eligible for a loan" });
  }

  return failures;
};
