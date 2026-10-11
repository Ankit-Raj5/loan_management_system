import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import type { OpsModule } from "@/lib/modules";
import { getModuleList } from "@/lib/server/queries";
import { firstParam } from "@/lib/url";

interface ModuleListPageProps<T> {
  module: OpsModule;
  searchParams: Record<string, string | string[] | undefined>;
  columns: Column<T>[];
  rowKey: (row: T) => string;
  rowHref?: (row: T) => string;
}

// List page used by every operations module: title, filter tabs, table/cards and pagination
export async function ModuleListPage<T>({ module, searchParams, columns, rowKey, rowHref }: ModuleListPageProps<T>) {
  const filter = firstParam(searchParams[module.filterParam]) ?? "";
  const page = Math.max(1, Number(firstParam(searchParams.page)) || 1);
  const { items, pagination } = await getModuleList<T>(module, page, filter || undefined);
  const active = module.filters.find((option) => option.value === filter) ?? module.filters[0];

  return (
    <div>
      <PageHeader title={module.label} description={module.description} />
      <FilterTabs options={module.filters} current={active.value} param={module.filterParam} basePath={module.path} />
      <Card>
        <DataTable
          columns={columns}
          rows={items}
          rowKey={rowKey}
          rowHref={rowHref}
          emptyTitle={`Nothing in "${active.label}"`}
          emptyDescription="New items will appear here as they move through the lifecycle."
        />
        <Pagination pagination={pagination} basePath={module.path} params={{ [module.filterParam]: filter }} />
      </Card>
    </div>
  );
}
