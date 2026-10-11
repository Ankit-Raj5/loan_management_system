import { Card, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { EXAMPLE_LOAN, LOAN_LIMITS } from "@/lib/loan-limits";

const ROWS = [
  { label: "Loan amount", value: formatCurrency(EXAMPLE_LOAN.amount) },
  { label: "Tenure", value: `${EXAMPLE_LOAN.tenureDays} days` },
  { label: "Interest rate", value: `${LOAN_LIMITS.interestRate}% a year` },
  { label: "Interest", value: formatCurrency(EXAMPLE_LOAN.interest) },
];

// A worked example of the repayment maths (illustration only; the real figures are shown live while applying)
export function LoanExample() {
  return (
    <Card className="bg-canvas shadow-none">
      <CardHeader title="A worked example" description="See what you would repay" />
      <dl className="space-y-3">
        {ROWS.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 border-b border-line pb-3 text-sm">
            <dt className="text-muted">{row.label}</dt>
            <dd className="font-semibold text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-linear-to-r from-brand-400 to-brand-500 px-5 py-4 text-white shadow-brand">
        <span className="font-semibold">Total repayment</span>
        <span className="text-xl font-extrabold">{formatCurrency(EXAMPLE_LOAN.total)}</span>
      </div>
      <p className="mt-3 text-xs text-muted">Simple interest = amount × {LOAN_LIMITS.interestRate}% × days ÷ 365.</p>
    </Card>
  );
}
