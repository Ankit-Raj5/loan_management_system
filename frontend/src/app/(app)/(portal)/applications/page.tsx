import type { Metadata } from "next";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { formatCurrency, formatDate } from "@/lib/format";
import { getMyApplications } from "@/lib/server/queries";
import type { Application } from "@/lib/types";

export const metadata: Metadata = { title: "My applications" };

const columns: Column<Application>[] = [
  { header: "Started", cell: (application) => formatDate(application.createdAt) },
  { header: "Amount", cell: (application) => (application.loan ? formatCurrency(application.loan.amount) : "—") },
  { header: "Tenure", cell: (application) => (application.loan ? `${application.loan.tenureDays} days` : "—") },
  { header: "Repayment", cell: (application) => (application.loan ? formatCurrency(application.loan.totalRepayment) : "—") },
  { header: "Status", cell: (application) => <StatusBadge status={application.status} /> },
];

export default async function ApplicationsPage() {
  const applications = await getMyApplications();

  if (applications.length === 0) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <EmptyState
          title="You have no applications yet"
          description="Apply for your first loan. It only takes a few minutes."
          action={
            <ButtonLink href="/apply" size="lg">
              Apply for a loan
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My applications"
        description="Every application you have made and where it stands"
        actions={<ButtonLink href="/apply">New application</ButtonLink>}
      />
      <Card>
        <DataTable
          columns={columns}
          rows={applications}
          rowKey={(application) => application.id}
          rowHref={(application) => `/applications/${application.id}`}
          emptyTitle="No applications yet"
        />
      </Card>
    </div>
  );
}
