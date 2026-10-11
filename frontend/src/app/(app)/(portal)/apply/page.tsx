import type { Metadata } from "next";
import { ApplyWizard } from "@/components/apply/apply-wizard";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { getMyApplications } from "@/lib/server/queries";

export const metadata: Metadata = { title: "Apply for a loan" };

const IN_PROGRESS = ["APPLIED", "SANCTIONED", "DISBURSED"];

export default async function ApplyPage() {
  const applications = await getMyApplications();
  const active = applications.find((application) => IN_PROGRESS.includes(application.status));
  const draft = applications.find((application) => application.status === "DRAFT") ?? null;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Apply for a loan" description="Three quick steps: your details, a salary slip, then pick your loan" />
      {active ? (
        <Alert tone="info" title="You already have an active loan application">
          <p className="mb-3">You can apply again once your current loan is closed or rejected.</p>
          <ButtonLink href={`/applications/${active.id}`} size="sm">
            View my application
          </ButtonLink>
        </Alert>
      ) : (
        <ApplyWizard draft={draft} />
      )}
    </div>
  );
}
