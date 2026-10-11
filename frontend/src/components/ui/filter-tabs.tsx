import Link from "next/link";
import { cn } from "@/lib/cn";
import type { FilterOption } from "@/lib/modules";
import { buildHref } from "@/lib/url";

interface FilterTabsProps {
  options: FilterOption[];
  current: string;
  param: string;
  basePath: string;
}

// Pill-style tabs that filter a list through the URL (scrolls sideways on small screens)
export function FilterTabs({ options, current, param, basePath }: FilterTabsProps) {
  return (
    <nav aria-label="Filter" className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
      {options.map((option) => (
        <Link
          key={option.value}
          href={buildHref(basePath, { [param]: option.value })}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition",
            option.value === current ? "bg-brand-500 text-white shadow-brand" : "bg-surface text-ink-soft hover:bg-brand-50"
          )}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
