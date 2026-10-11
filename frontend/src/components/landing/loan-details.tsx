import { CircleCheck } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { LOAN_LIMITS } from "@/lib/loan-limits";
import { LandingSection } from "./landing-section";
import { LoanExample } from "./loan-example";

const TERMS = [
  `Borrow between ${formatCurrency(LOAN_LIMITS.minAmount)} and ${formatCurrency(LOAN_LIMITS.maxAmount)}`,
  `Repay over ${LOAN_LIMITS.minTenure} to ${LOAN_LIMITS.maxTenure} days`,
  `Fixed ${LOAN_LIMITS.interestRate}% a year, calculated as simple interest`,
  "Total repayment = amount + interest, shown before you apply",
  "Pay in parts; the loan closes automatically when fully repaid",
];

const ELIGIBILITY = [
  `Age between ${LOAN_LIMITS.minAge} and ${LOAN_LIMITS.maxAge} years`,
  `Monthly salary of at least ${formatCurrency(LOAN_LIMITS.minSalary)}`,
  "A valid PAN (for example ABCDE1234F)",
  "Salaried or self-employed (unemployed applicants are not eligible)",
  "One salary slip as proof of income",
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-ink-soft">
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />
          {item}
        </li>
      ))}
    </ul>
  );
}

// Loan terms and eligibility rules, taken from the same limits the application uses
export function LoanDetails() {
  return (
    <LandingSection id="loan-details" title="Loan details" subtitle="Simple terms and clear rules, nothing hidden." tinted>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-canvas shadow-none">
          <CardHeader title="Loan terms" />
          <Checklist items={TERMS} />
        </Card>
        <Card className="bg-canvas shadow-none">
          <CardHeader title="Who can apply" description="Every check must pass. You will see exactly which one did not." />
          <Checklist items={ELIGIBILITY} />
        </Card>
        <LoanExample />
      </div>
    </LandingSection>
  );
}
