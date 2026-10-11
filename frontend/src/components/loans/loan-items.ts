import type { DescriptionItem } from "@/components/ui/description-list";
import { formatCurrency, formatDate, humanize } from "@/lib/format";
import type { LoanTerms, PersonalDetails } from "@/lib/types";

// Label/value rows describing the applicant
export const personalDetailsItems = (details: PersonalDetails): DescriptionItem[] => [
  { label: "Full name", value: details.fullName },
  { label: "PAN", value: details.pan },
  { label: "Date of birth", value: formatDate(details.dob) },
  { label: "Monthly salary", value: formatCurrency(details.monthlySalary) },
  { label: "Employment", value: humanize(details.employmentMode) },
];

// Label/value rows describing the loan amount, interest and repayment
export const loanTermsItems = (loan: LoanTerms): DescriptionItem[] => [
  { label: "Loan amount", value: formatCurrency(loan.amount) },
  { label: "Tenure", value: `${loan.tenureDays} days` },
  { label: "Interest rate", value: `${loan.interestRate}% per year (simple)` },
  { label: "Interest", value: formatCurrency(loan.simpleInterest) },
  { label: "Total repayment", value: formatCurrency(loan.totalRepayment) },
];
