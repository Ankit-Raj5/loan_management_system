import { formatDateTime, humanize } from "@/lib/format";
import type { HistoryEntry } from "@/lib/types";
import { StatusBadge } from "./badge";

// Audit trail: every status change with who made it, when, and any note
export function Timeline({ entries }: { entries: HistoryEntry[] }) {
  return (
    <ol className="relative space-y-5 border-l-2 border-line pl-6">
      {entries.map((entry, index) => (
        <li key={`${entry.at}-${index}`} className="relative">
          <span className="absolute top-1.5 -left-[31px] size-3 rounded-full border-2 border-surface bg-brand-500 ring-2 ring-brand-100" />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={entry.to} />
            <span className="text-xs text-muted">{formatDateTime(entry.at)}</span>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            by <span className="font-semibold text-ink">{entry.byName}</span> ({humanize(entry.byRole)})
          </p>
          {entry.note && <p className="mt-1 text-sm text-muted">“{entry.note}”</p>}
        </li>
      ))}
    </ol>
  );
}
