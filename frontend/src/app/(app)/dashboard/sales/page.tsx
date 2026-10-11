import type { Metadata } from "next";
import { ModuleListPage } from "@/components/ops/module-list-page";
import { leadColumns } from "@/components/ops/loan-columns";
import { getModule } from "@/lib/modules";
import type { Lead } from "@/lib/types";

export const metadata: Metadata = { title: "Sales" };

export default async function SalesPage({ searchParams }: PageProps<"/dashboard/sales">) {
  return (
    <ModuleListPage<Lead>
      module={getModule("sales")}
      searchParams={await searchParams}
      columns={leadColumns}
      rowKey={(lead) => lead.borrowerId}
    />
  );
}
