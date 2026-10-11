"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import type { Application } from "@/lib/types";
import { LoanConfigStep } from "./loan-config-step";
import { PersonalDetailsStep } from "./personal-details-step";
import { SalarySlipStep } from "./salary-slip-step";

const STEPS = ["Personal details", "Salary slip", "Loan & apply"];

// Resumes an unfinished draft at the right step: no draft → details, draft without slip → slip, otherwise → loan
const initialStep = (draft: Application | null): number => (!draft ? 0 : draft.salarySlip ? 2 : 1);

// Three-step borrower application: details + eligibility, salary slip upload, then loan configuration and apply
export function ApplyWizard({ draft }: { draft: Application | null }) {
  const [application, setApplication] = useState<Application | null>(draft);
  const [step, setStep] = useState(() => initialStep(draft));

  const goTo = (next: number) => (updated?: Application) => {
    if (updated) setApplication(updated);
    setStep(next);
  };

  return (
    <div className="space-y-6">
      <Card>
        <Stepper steps={STEPS} current={step} />
      </Card>
      <Card>
        {step === 0 && <PersonalDetailsStep application={application} onSaved={goTo(1)} />}
        {step === 1 && application && <SalarySlipStep application={application} onUploaded={goTo(2)} onBack={() => setStep(0)} />}
        {step === 2 && application && <LoanConfigStep application={application} onBack={() => setStep(1)} />}
      </Card>
    </div>
  );
}
