import type { Metadata } from "next";
import { ModuleListPage } from "@/components/ops/module-list-page";
import { loanColumns } from "@/components/ops/loan-columns";
import { getModule } from "@/lib/modules";
import type { OpsLoan } from "@/lib/types";

export const metadata: Metadata = { title: "Sanction" };

export default async function SanctionPage({ searchParams }: PageProps<"/dashboard/sanction">) {
  const opsModule = getModule("sanction");
  return (
    <ModuleListPage<OpsLoan>
      module={opsModule}
      searchParams={await searchParams}
      columns={loanColumns}
      rowKey={(loan) => loan.id}
      rowHref={(loan) => `${opsModule.path}/${loan.id}`}
    />
  );
}
