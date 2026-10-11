import type { Metadata } from "next";
import { ModuleListPage } from "@/components/ops/module-list-page";
import { collectionColumns } from "@/components/ops/loan-columns";
import { getModule } from "@/lib/modules";
import type { OpsLoan } from "@/lib/types";

export const metadata: Metadata = { title: "Collection" };

export default async function CollectionPage({ searchParams }: PageProps<"/dashboard/collection">) {
  const opsModule = getModule("collection");
  return (
    <ModuleListPage<OpsLoan>
      module={opsModule}
      searchParams={await searchParams}
      columns={collectionColumns}
      rowKey={(loan) => loan.id}
      rowHref={(loan) => `${opsModule.path}/${loan.id}`}
    />
  );
}
