import type { Metadata } from "next";
import { LoanActions } from "@/components/ops/loan-actions";
import { LoanDetail } from "@/components/ops/loan-detail";
import { getModule } from "@/lib/modules";
import { getOpsLoan } from "@/lib/server/queries";

export const metadata: Metadata = { title: "Disburse loan" };

export default async function DisbursementDetailPage({ params }: PageProps<"/dashboard/disbursement/[id]">) {
  const { id } = await params;
  const opsModule = getModule("disbursement");
  const loan = await getOpsLoan(opsModule, id);

  return <LoanDetail module={opsModule} loan={loan} actions={<LoanActions module="disbursement" loan={loan} />} />;
}
