import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { Timeline } from "@/components/ui/timeline";
import { formatDate, formatDateTime, formatFileSize } from "@/lib/format";
import type { OpsModule } from "@/lib/modules";
import type { OpsLoan } from "@/lib/types";
import { loanTermsItems, personalDetailsItems } from "@/components/loans/loan-items";
import { PaymentProgress } from "@/components/loans/payment-progress";

interface LoanDetailProps {
  module: OpsModule;
  loan: OpsLoan;
  actions?: ReactNode;
  salarySlipAction?: ReactNode;
  children?: ReactNode;
}

// Detail page shared by Sanction, Disbursement and Collection: borrower, terms, balance, extras and the audit trail
export function LoanDetail({ module, loan, actions, salarySlipAction, children }: LoanDetailProps) {
  return (
    <div>
      <Link href={module.path} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-brand-600">
        <ArrowLeft className="size-4" /> Back to {module.label}
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{loan.personalDetails.fullName}</h1>
          <StatusBadge status={loan.status} />
        </div>
        {actions}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {loan.rejectionReason && loan.status === "REJECTED" && (
            <Alert tone="error" title="Rejected">
              {loan.rejectionReason}
            </Alert>
          )}

          <Card>
            <CardHeader title="Borrower" description={`${loan.borrower.name} · ${loan.borrower.email}`} />
            <DescriptionList items={personalDetailsItems(loan.personalDetails)} />
            {loan.salarySlip && (
              <div className="mt-5 border-t border-line pt-4">
                <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Salary slip</p>
                <p className="mb-2 text-sm text-ink-soft">
                  {loan.salarySlip.originalName} · {formatFileSize(loan.salarySlip.size)} · uploaded {formatDate(loan.salarySlip.uploadedAt)}
                </p>
                {salarySlipAction}
              </div>
            )}
          </Card>

          {loan.loan && (
            <Card>
              <CardHeader title="Loan terms" description={`Applied on ${formatDateTime(loan.appliedAt)}`} />
              <DescriptionList items={loanTermsItems(loan.loan)} />
            </Card>
          )}

          {loan.payment && ["DISBURSED", "CLOSED"].includes(loan.status) && (
            <Card>
              <CardHeader title="Repayment" description={loan.closedAt ? `Closed on ${formatDateTime(loan.closedAt)}` : undefined} />
              <PaymentProgress payment={loan.payment} />
            </Card>
          )}

          {children}
        </div>

        <Card className="h-fit">
          <CardHeader title="Audit trail" description="Every status change and who made it" />
          <Timeline entries={loan.history ?? []} />
        </Card>
      </div>
    </div>
  );
}
