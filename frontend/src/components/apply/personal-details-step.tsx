"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { RuleFailures } from "@/components/loans/rule-failures";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/field";
import { getFieldErrors, getRuleFailures } from "@/lib/api-error";
import { api } from "@/lib/client/api";
import { useAsyncAction } from "@/lib/client/use-async-action";
import { todayIsoDate } from "@/lib/format";
import { EMPLOYMENT_OPTIONS } from "@/lib/loan-limits";
import type { Application } from "@/lib/types";

interface PersonalDetailsStepProps {
  application: Application | null;
  onSaved: (application: Application) => void;
}

// Step 1: collects personal details; the server runs the eligibility check and lists every rule that failed
export function PersonalDetailsStep({ application, onSaved }: PersonalDetailsStepProps) {
  const saved = application?.personalDetails;
  const [values, setValues] = useState({
    fullName: saved?.fullName ?? "",
    pan: saved?.pan ?? "",
    dob: saved?.dob.slice(0, 10) ?? "",
    monthlySalary: saved ? String(saved.monthlySalary) : "",
    employmentMode: saved?.employmentMode ?? "SALARIED",
  });

  const { run, loading, error } = useAsyncAction(async () => {
    const { application: next } = await api.post<{ application: Application }>("/applications/personal-details", {
      ...values,
      pan: values.pan.trim().toUpperCase(),
      monthlySalary: values.monthlySalary === "" ? undefined : Number(values.monthlySalary),
    });
    onSaved(next);
  });

  const fieldErrors = getFieldErrors(error);
  const failures = getRuleFailures(error);
  const update = (key: keyof typeof values) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    run();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="fullName" label="Full name" value={values.fullName} onChange={update("fullName")} error={fieldErrors.fullName} autoComplete="name" />
        <TextField
          id="pan"
          label="PAN"
          placeholder="ABCDE1234F"
          maxLength={10}
          value={values.pan}
          onChange={(event) => setValues((current) => ({ ...current, pan: event.target.value.toUpperCase() }))}
          error={fieldErrors.pan}
        />
        <TextField id="dob" type="date" label="Date of birth" max={todayIsoDate()} value={values.dob} onChange={update("dob")} error={fieldErrors.dob} />
        <TextField
          id="monthlySalary"
          type="number"
          min={0}
          label="Monthly salary (₹)"
          value={values.monthlySalary}
          onChange={update("monthlySalary")}
          error={fieldErrors.monthlySalary}
        />
        <div className="sm:col-span-2">
          <SelectField id="employmentMode" label="Employment mode" value={values.employmentMode} onChange={update("employmentMode")} error={fieldErrors.employmentMode}>
            {EMPLOYMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      {failures.length > 0 && (
        <RuleFailures title="You are not eligible for a loan. Please correct these and try again:" failures={failures} />
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg" loading={loading}>
          Check eligibility &amp; continue
        </Button>
      </div>
    </form>
  );
}
