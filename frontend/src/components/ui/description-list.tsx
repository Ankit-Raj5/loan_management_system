import type { ReactNode } from "react";

export interface DescriptionItem {
  label: string;
  value: ReactNode;
}

// Label/value pairs in a responsive grid (one column on phones, two from sm)
export function DescriptionList({ items }: { items: DescriptionItem[] }) {
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{item.label}</dt>
          <dd className="mt-1 text-sm font-medium break-words text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
