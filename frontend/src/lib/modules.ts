import type { Role } from "./roles";

export type IconName =
  | "users"
  | "file-check"
  | "banknote"
  | "wallet"
  | "layout-dashboard"
  | "file-plus"
  | "files"
  | "user";

export interface FilterOption {
  value: string;
  label: string;
}

export interface OpsModule {
  key: "sales" | "sanction" | "disbursement" | "collection";
  label: string;
  description: string;
  path: string;
  apiPath: string;
  itemsKey: "loans" | "leads";
  roles: Role[];
  icon: IconName;
  filterParam: "status" | "stage";
  filters: FilterOption[];
  summary: { label: string; filter?: string };
}

export const MODULES: OpsModule[] = [
  {
    key: "sales",
    label: "Sales",
    description: "Borrowers who started but have not submitted an application",
    path: "/dashboard/sales",
    apiPath: "/sales/leads",
    itemsKey: "leads",
    roles: ["SALES"],
    icon: "users",
    filterParam: "stage",
    filters: [
      { value: "", label: "All leads" },
      { value: "DRAFT_IN_PROGRESS", label: "Draft in progress" },
      { value: "BRE_REJECTED", label: "Rejected by eligibility check" },
    ],
    summary: { label: "Open leads" },
  },
  {
    key: "sanction",
    label: "Sanction",
    description: "Review applied loans and approve or reject them",
    path: "/dashboard/sanction",
    apiPath: "/sanction/applications",
    itemsKey: "loans",
    roles: ["SANCTION"],
    icon: "file-check",
    filterParam: "status",
    filters: [
      { value: "", label: "Waiting for sanction" },
      { value: "SANCTIONED", label: "Sanctioned" },
      { value: "REJECTED", label: "Rejected" },
    ],
    summary: { label: "Waiting for sanction", filter: "APPLIED" },
  },
  {
    key: "disbursement",
    label: "Disbursement",
    description: "Release funds for sanctioned loans",
    path: "/dashboard/disbursement",
    apiPath: "/disbursement/loans",
    itemsKey: "loans",
    roles: ["DISBURSEMENT"],
    icon: "banknote",
    filterParam: "status",
    filters: [
      { value: "", label: "Waiting for disbursement" },
      { value: "DISBURSED", label: "Disbursed" },
    ],
    summary: { label: "Waiting for disbursement", filter: "SANCTIONED" },
  },
  {
    key: "collection",
    label: "Collection",
    description: "Record repayments on disbursed loans",
    path: "/dashboard/collection",
    apiPath: "/collection/loans",
    itemsKey: "loans",
    roles: ["COLLECTION"],
    icon: "wallet",
    filterParam: "status",
    filters: [
      { value: "", label: "Active loans" },
      { value: "CLOSED", label: "Closed" },
    ],
    summary: { label: "Active loans to collect", filter: "DISBURSED" },
  },
];

// Finds an operations module by its key
export const getModule = (key: OpsModule["key"]): OpsModule => MODULES.find((m) => m.key === key) as OpsModule;
