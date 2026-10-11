export enum Role {
  ADMIN = "ADMIN",
  SALES = "SALES",
  SANCTION = "SANCTION",
  DISBURSEMENT = "DISBURSEMENT",
  COLLECTION = "COLLECTION",
  BORROWER = "BORROWER",
}

export const ALL_ROLES = Object.values(Role);

export const SELF_REGISTER_ROLES: Role[] = [Role.BORROWER];
