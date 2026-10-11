import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { IconName } from "@/lib/modules";
import { Icon } from "./icon";

// Summary tile such as "12 Waiting for sanction", linking to the relevant list
export function StatCard({ label, value, icon, href }: { label: string; value: number; icon: IconName; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand-400 to-brand-500 text-white shadow-brand">
        <Icon name={icon} className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-3xl font-bold text-ink">{value}</p>
        <p className="truncate text-sm text-muted">{label}</p>
      </div>
      <ArrowRight className="size-5 text-muted transition group-hover:translate-x-1 group-hover:text-brand-500" />
    </Link>
  );
}
