"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client/api";
import { useAsyncAction } from "@/lib/client/use-async-action";

// Fetches a short-lived signed link for the private salary slip and opens it in a new tab
export function SalarySlipButton({ loanId, fileName }: { loanId: string; fileName: string }) {
  const { run, loading } = useAsyncAction(async () => {
    const { salarySlip } = await api.get<{ salarySlip: { url: string } }>(`/sanction/applications/${loanId}/salary-slip`);
    window.open(salarySlip.url, "_blank", "noopener,noreferrer");
  });

  return (
    <Button variant="secondary" size="sm" loading={loading} onClick={() => run()}>
      <FileText className="size-4" />
      View {fileName}
    </Button>
  );
}
