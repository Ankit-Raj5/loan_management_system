export enum EmploymentMode {
  SALARIED = "SALARIED",
  SELF_EMPLOYED = "SELF_EMPLOYED",
  UNEMPLOYED = "UNEMPLOYED",
}

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  APPLIED = "APPLIED",
  SANCTIONED = "SANCTIONED",
  REJECTED = "REJECTED",
  DISBURSED = "DISBURSED",
  CLOSED = "CLOSED",
}

export enum ApplicationStep {
  PERSONAL_DETAILS = "PERSONAL_DETAILS",
  SALARY_SLIP = "SALARY_SLIP",
  LOAN_CONFIG = "LOAN_CONFIG",
  SUBMITTED = "SUBMITTED",
  REJECTED = "REJECTED",
}

export enum RejectionSource {
  BRE = "BRE",
  SANCTION = "SANCTION",
}

export const ALL_EMPLOYMENT_MODES = Object.values(EmploymentMode);
export const ALL_APPLICATION_STATUSES = Object.values(ApplicationStatus);

export const ACTIVE_STATUSES = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.SANCTIONED,
  ApplicationStatus.DISBURSED,
];
