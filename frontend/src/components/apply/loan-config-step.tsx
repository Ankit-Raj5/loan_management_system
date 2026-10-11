"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RuleFailures } from "@/components/loans/rule-failures";
import { Button } from "@/components/ui/button";
import { DescriptionList } from "@/components/ui/description-list";
import { RangeField } from "@/components/ui/range-field";
import { getRuleFailures } from "@/lib/api-error";
import { api } from "@/lib/client/api";
import { useAsyncAction } from "@/lib/client/use-async-action";
import { useDebouncedValue } from "@/lib/client/use-debounced-value";
import { formatCurrency } from "@/lib/format";
import { LOAN_LIMITS } from "@/lib/loan-limits";
import type { Application, LoanTerms } from "@/lib/types";
import { loanTermsItems } from "@/components/loans/loan-items";

// Step 3: pick amount and tenure with sliders, see the live calculation, then apply
export function LoanConfigStep({ application, onBack }: { application: Application; onBack: () => void }) {
  const router = useRouter();
  const [amount, setAmount] = useState(100000);
  const [tenureDays, setTenureDays] = useState(90);
  const key = useDebouncedValue(`${amount}:${tenureDays}`);
  const [result, setResult] = useState<{ key: string; terms: LoanTerms } | null>(null);

  // The backend does the maths so the preview always matches what will be saved
  useEffect(() => {
    const controller = new AbortController();
    const [a, t] = key.split(":");
    api
      .get<{ calculation: LoanTerms }>(`/applications/calculate?amount=${a}&tenureDays=${t}`, { signal: controller.signal })
      .then(({ calculation }) => setResult({ key, terms: calculation }))
      .catch(() => undefined);
    return () => controller.abort();
  }, [key]);

  const { run, loading, error } = useAsyncAction(
    async () => {
      await api.post(`/applications/${application.id}/apply`, { amount, tenureDays });
      router.push(`/applications/${application.id}`);
      router.refresh();
    },
    { success: "Loan application submitted" }
  );

  const failures = getRuleFailures(error);
  const stale = result?.key !== `${amount}:${tenureDays}`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-8">
        <RangeField
          id="amount"
          label="Loan amount"
          value={amount}
          min={LOAN_LIMITS.minAmount}
          max={LOAN_LIMITS.maxAmount}
          step={LOAN_LIMITS.amountStep}
          display={formatCurrency(amount)}
          minLabel={formatCurrency(LOAN_LIMITS.minAmount)}
          maxLabel={formatCurrency(LOAN_LIMITS.maxAmount)}
          onChange={setAmount}
        />
        <RangeField
          id="tenure"
          label="Tenure"
          value={tenureDays}
          min={LOAN_LIMITS.minTenure}
          max={LOAN_LIMITS.maxTenure}
          step={1}
          display={`${tenureDays} days`}
          minLabel={`${LOAN_LIMITS.minTenure} days`}
          maxLabel={`${LOAN_LIMITS.maxTenure} days`}
          onChange={setTenureDays}
        />
      </div>

      <div className="rounded-2xl bg-canvas p-5">
        <h3 className="mb-4 font-bold text-ink">Your loan summary</h3>
        <div className={stale ? "opacity-50 transition" : "transition"}>
          {result ? <DescriptionList items={loanTermsItems(result.terms)} /> : <p className="text-sm text-muted">Calculating…</p>}
        </div>
      </div>

      {failures.length > 0 && (
        <div className="lg:col-span-2">
          <RuleFailures title="Your application was rejected" failures={failures} />
        </div>
      )}

      <div className="flex justify-between gap-3 lg:col-span-2">
        <Button variant="secondary" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" loading={loading} disabled={stale} onClick={() => run()}>
          Apply for {formatCurrency(amount)}
        </Button>
      </div>
    </div>
  );
}
