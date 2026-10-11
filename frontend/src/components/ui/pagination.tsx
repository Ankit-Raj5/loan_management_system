import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Pagination as PaginationData } from "@/lib/types";
import { buildHref } from "@/lib/url";

interface PaginationProps {
  pagination: PaginationData;
  basePath: string;
  params?: Record<string, string | undefined>;
}

const NAV = "inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold";

// Previous/next links that keep the active filter in the URL
export function Pagination({ pagination, basePath, params = {} }: PaginationProps) {
  const { page, totalPages, total } = pagination;
  if (totalPages <= 1) return <p className="mt-4 text-sm text-muted">{total} total</p>;

  const link = (target: number) => buildHref(basePath, { ...params, page: target });
  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm text-muted">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={link(page - 1)} className={cn(NAV, "text-ink hover:bg-canvas")}>
            <ChevronLeft className="size-4" /> Prev
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link href={link(page + 1)} className={cn(NAV, "text-ink hover:bg-canvas")}>
            Next <ChevronRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
