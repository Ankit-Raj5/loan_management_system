import { StatusBadge } from "@/components/ui/badge";
import type { Column } from "@/components/ui/data-table";
import { StageBadge } from "@/components/ops/stage-badge";
import { formatCurrency, formatDate, humanize } from "@/lib/format";
import type { Lead, OpsLoan } from "@/lib/types";

const borrowerCell = (name: string, email: string) => (
  <div>
    <p className="font-semibold text-ink">{name}</p>
    <p className="text-xs text-muted">{email}</p>
  </div>
);

// Columns shared by the Sanction, Disbursement and Collection lists
export const loanColumns: Column<OpsLoan>[] = [
  { header: "Borrower", cell: (loan) => borrowerCell(loan.personalDetails.fullName, loan.borrower.email) },
  { header: "Amount", cell: (loan) => (loan.loan ? formatCurrency(loan.loan.amount) : "—") },
  { header: "Repayment", cell: (loan) => (loan.loan ? formatCurrency(loan.loan.totalRepayment) : "—") },
  { header: "Applied", cell: (loan) => formatDate(loan.appliedAt) },
  { header: "Status", cell: (loan) => <StatusBadge status={loan.status} /> },
];

// Collection also needs to see what is still owed
export const collectionColumns: Column<OpsLoan>[] = [
  ...loanColumns.slice(0, 3),
  { header: "Outstanding", cell: (loan) => (loan.payment ? formatCurrency(loan.payment.outstanding) : "—") },
  loanColumns[4],
];

// Columns for the Sales leads list
export const leadColumns: Column<Lead>[] = [
  { header: "Borrower", cell: (lead) => borrowerCell(lead.name, lead.email) },
  { header: "Stage", cell: (lead) => <StageBadge stage={lead.stage} /> },
  { header: "Salary", cell: (lead) => formatCurrency(lead.latestDetails.monthlySalary) },
  { header: "Employment", cell: (lead) => humanize(lead.latestDetails.employmentMode) },
  { header: "Attempts", cell: (lead) => lead.attempts },
  { header: "Last activity", cell: (lead) => formatDate(lead.lastActivityAt) },
  { header: "Last login", cell: (lead) => formatDate(lead.lastLoginAt) },
];
