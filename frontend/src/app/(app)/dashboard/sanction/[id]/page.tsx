import type { Metadata } from "next";
import { LoanActions } from "@/components/ops/loan-actions";
import { LoanDetail } from "@/components/ops/loan-detail";
import { SalarySlipButton } from "@/components/ops/salary-slip-button";
import { getModule } from "@/lib/modules";
import { getOpsLoan } from "@/lib/server/queries";

export const metadata: Metadata = { title: "Review loan" };

export default async function SanctionDetailPage({ params }: PageProps<"/dashboard/sanction/[id]">) {
  const { id } = await params;
  const opsModule = getModule("sanction");
  const loan = await getOpsLoan(opsModule, id);

  return (
    <LoanDetail
      module={opsModule}
      loan={loan}
      actions={<LoanActions module="sanction" loan={loan} />}
      salarySlipAction={loan.salarySlip && <SalarySlipButton loanId={loan.id} fileName={loan.salarySlip.originalName} />}
    />
  );
}
