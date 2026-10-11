"use client";

import { FileUp } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { getFieldErrors } from "@/lib/api-error";
import { api } from "@/lib/client/api";
import { useAsyncAction } from "@/lib/client/use-async-action";
import { formatFileSize } from "@/lib/format";
import { SALARY_SLIP_LIMITS } from "@/lib/loan-limits";
import type { Application } from "@/lib/types";

interface SalarySlipStepProps {
  application: Application;
  onUploaded: (application: Application) => void;
  onBack: () => void;
}

// Step 2: uploads the salary slip (PDF/JPG/PNG, max 5 MB); an already-uploaded slip can be kept or replaced
export function SalarySlipStep({ application, onUploaded, onBack }: SalarySlipStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { run, loading, error } = useAsyncAction(async () => {
    if (!file) return onUploaded(application);
    const form = new FormData();
    form.append("salarySlip", file);
    const { application: next } = await api.upload<{ application: Application }>(`/applications/${application.id}/salary-slip`, form);
    onUploaded(next);
  });

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    setFile(null);
    setFileError(null);
    if (!picked) return;
    if (!(SALARY_SLIP_LIMITS.mimeTypes as readonly string[]).includes(picked.type)) return setFileError("Salary slip must be a PDF, JPG or PNG file");
    if (picked.size > SALARY_SLIP_LIMITS.maxBytes) return setFileError("Salary slip must be 5 MB or smaller");
    setFile(picked);
  };

  const existing = application.salarySlip;
  const message = fileError ?? getFieldErrors(error).salarySlip;

  return (
    <div className="space-y-5">
      <label
        htmlFor="salarySlip"
        className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 px-4 py-10 text-center transition hover:bg-brand-50"
      >
        <FileUp className="size-8 text-brand-500" />
        <span className="font-semibold text-ink">{file ? file.name : "Choose your salary slip"}</span>
        <span className="text-sm text-muted">
          {file ? formatFileSize(file.size) : "PDF, JPG or PNG · up to 5 MB"}
        </span>
        <input id="salarySlip" type="file" accept={SALARY_SLIP_LIMITS.accept} onChange={onPick} className="sr-only" />
      </label>

      {existing && !file && (
        <p className="text-sm text-ink-soft">
          Already uploaded: <span className="font-semibold">{existing.originalName}</span>. Choose a new file to replace it, or continue.
        </p>
      )}
      {message && <p className="text-sm font-medium text-danger">{message}</p>}

      <div className="flex justify-between gap-3">
        <Button variant="secondary" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" loading={loading} disabled={!file && !existing} onClick={() => run()}>
          {file ? "Upload & continue" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
