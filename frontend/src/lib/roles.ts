export const ROLES = ["BORROWER", "SALES", "SANCTION", "DISBURSEMENT", "COLLECTION", "ADMIN"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  BORROWER: "Borrower",
  SALES: "Sales",
  SANCTION: "Sanction",
  DISBURSEMENT: "Disbursement",
  COLLECTION: "Collection",
  ADMIN: "Admin",
};

// Roles shown on the login toggle (everyone)
export const LOGIN_ROLES: readonly Role[] = ROLES;

// Roles listed on the sign-up toggle (Admin is never listed)
export const SIGNUP_ROLES: readonly Role[] = ROLES.filter((role) => role !== "ADMIN");

// Only borrowers can sign themselves up; every staff account is created by an administrator
export const canSelfSignUp = (role: Role): boolean => role === "BORROWER";

// Checks that an unknown value is a valid role
export const isRole = (value: unknown): value is Role => ROLES.includes(value as Role);
