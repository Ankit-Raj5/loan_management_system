import { LOAN_CONFIG } from "../config/loan.config";

export interface LoanBreakdown {
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}

// Rounds a rupee value to 2 decimal places
const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

// Calculates simple interest and total repayment: SI = (P x R x T) / (365 x 100)
export const calculateLoan = (amount: number, tenureDays: number): LoanBreakdown => {
  const rate = LOAN_CONFIG.INTEREST_RATE;
  const simpleInterest = round2((amount * rate * tenureDays) / (LOAN_CONFIG.DAYS_IN_YEAR * 100));
  return {
    amount,
    tenureDays,
    interestRate: rate,
    simpleInterest,
    totalRepayment: round2(amount + simpleInterest),
  };
};
