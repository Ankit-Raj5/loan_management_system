import type { Metadata } from "next";
import { LoanActions } from "@/components/ops/loan-actions";
import { LoanDetail } from "@/components/ops/loan-detail";
import { PaymentHistory } from "@/components/ops/payment-history";
import { getModule } from "@/lib/modules";
import { getOpsLoan } from "@/lib/server/queries";
import type { CollectionLoan } from "@/lib/types";

export const metadata: Metadata = { title: "Collect repayment" };

export default async function CollectionDetailPage({ params }: PageProps<"/dashboard/collection/[id]">) {
  const { id } = await params;
  const opsModule = getModule("collection");
  const loan = await getOpsLoan<CollectionLoan>(opsModule, id);

  return (
    <LoanDetail module={opsModule} loan={loan} actions={<LoanActions module="collection" loan={loan} />}>
      <PaymentHistory payments={loan.payments} />
    </LoanDetail>
  );
}
