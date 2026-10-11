import { formatCurrency } from "@/lib/format";
import type { PaymentSummary } from "@/lib/types";

// Repayment progress bar with paid, outstanding and total amounts
export function PaymentProgress({ payment }: { payment: PaymentSummary }) {
  const percent = payment.totalRepayment > 0 ? Math.min(100, (payment.amountPaid / payment.totalRepayment) * 100) : 0;
  return (
    <div>
      <div className="h-3 overflow-hidden rounded-full bg-canvas" role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-linear-to-r from-brand-400 to-brand-500" style={{ width: `${percent}%` }} />
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-muted">Paid</dt>
          <dd className="font-bold text-success">{formatCurrency(payment.amountPaid)}</dd>
        </div>
        <div>
          <dt className="text-muted">Outstanding</dt>
          <dd className="font-bold text-ink">{formatCurrency(payment.outstanding)}</dd>
        </div>
        <div className="text-right">
          <dt className="text-muted">Total</dt>
          <dd className="font-bold text-ink">{formatCurrency(payment.totalRepayment)}</dd>
        </div>
      </dl>
    </div>
  );
}
