import { Card, CardHeader } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Payment } from "@/lib/types";

const columns: Column<Payment>[] = [
  { header: "Date", cell: (payment) => formatDate(payment.paymentDate) },
  { header: "UTR", cell: (payment) => <span className="font-mono text-xs">{payment.utr}</span> },
  { header: "Amount", cell: (payment) => <span className="font-semibold">{formatCurrency(payment.amount)}</span> },
  { header: "Recorded by", cell: (payment) => payment.recordedByName },
];

// Table of every repayment recorded against a loan
export function PaymentHistory({ payments }: { payments: Payment[] }) {
  return (
    <Card>
      <CardHeader title="Payments" description={`${payments.length} recorded`} />
      <DataTable
        columns={columns}
        rows={payments}
        rowKey={(payment) => payment.id}
        emptyTitle="No payments yet"
        emptyDescription="Recorded repayments will be listed here."
      />
    </Card>
  );
}
