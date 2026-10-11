import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState } from "./empty-state";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  rowHref?: (row: T) => string;
  emptyTitle: string;
  emptyDescription?: string;
}

const VIEW = "text-sm font-semibold text-brand-600 hover:text-brand-700";

// One column definition renders as a table on desktop and as stacked cards on phones
export function DataTable<T>({ columns, rows, rowKey, rowHref, emptyTitle, emptyDescription }: DataTableProps<T>) {
  if (rows.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs tracking-wide text-muted uppercase">
              {columns.map((column) => (
                <th key={column.header} className="px-3 py-3 font-semibold">
                  {column.header}
                </th>
              ))}
              {rowHref && <th className="px-3 py-3" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-line/60 last:border-0 hover:bg-canvas/60">
                {columns.map((column) => (
                  <td key={column.header} className={`px-3 py-3.5 ${column.className ?? ""}`}>
                    {column.cell(row)}
                  </td>
                ))}
                {rowHref && (
                  <td className="px-3 py-3.5 text-right">
                    <Link href={rowHref(row)} className={VIEW}>
                      View
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="rounded-xl border border-line p-4">
            <dl className="space-y-2">
              {columns.map((column) => (
                <div key={column.header} className="flex items-start justify-between gap-4 text-sm">
                  <dt className="text-muted">{column.header}</dt>
                  <dd className="text-right font-medium text-ink">{column.cell(row)}</dd>
                </div>
              ))}
            </dl>
            {rowHref && (
              <Link href={rowHref(row)} className={`${VIEW} mt-3 inline-block`}>
                View details →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
