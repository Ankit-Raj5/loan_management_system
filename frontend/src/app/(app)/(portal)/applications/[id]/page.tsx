import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { loanTermsItems, personalDetailsItems } from "@/components/loans/loan-items";
import { RuleFailures } from "@/components/loans/rule-failures";
import { Alert } from "@/components/ui/alert";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { Timeline } from "@/components/ui/timeline";
import { formatDate, formatFileSize } from "@/lib/format";
import { getMyApplication } from "@/lib/server/queries";

export const metadata: Metadata = { title: "Application" };

export default async function ApplicationDetailPage({ params }: PageProps<"/applications/[id]">) {
  const { id } = await params;
  const application = await getMyApplication(id);
  const { salarySlip } = application;

  return (
    <div>
      <Link href="/applications" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-brand-600">
        <ArrowLeft className="size-4" /> Back to my applications
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Application</h1>
          <StatusBadge status={application.status} />
        </div>
        {application.status === "DRAFT" && <ButtonLink href="/apply">Continue application</ButtonLink>}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {application.status === "REJECTED" && application.breFailures.length > 0 && (
            <RuleFailures title="Rejected by the eligibility check" failures={application.breFailures} />
          )}
          {application.status === "REJECTED" && application.rejectionSource === "SANCTION" && (
            <Alert tone="error" title="Your application was rejected">
              {application.rejectionReason}
            </Alert>
          )}

          <Card>
            <CardHeader title="Your details" />
            <DescriptionList items={personalDetailsItems(application.personalDetails)} />
            {salarySlip && (
              <p className="mt-5 border-t border-line pt-4 text-sm text-ink-soft">
                Salary slip: <span className="font-semibold">{salarySlip.originalName}</span> ({formatFileSize(salarySlip.size)}), uploaded{" "}
                {formatDate(salarySlip.uploadedAt)}
              </p>
            )}
          </Card>

          {application.loan && (
            <Card>
              <CardHeader title="Loan terms" />
              <DescriptionList items={loanTermsItems(application.loan)} />
            </Card>
          )}
        </div>

        <Card className="h-fit">
          <CardHeader title="Progress" description="Every step of your application" />
          <Timeline entries={application.history} />
        </Card>
      </div>
    </div>
  );
}
