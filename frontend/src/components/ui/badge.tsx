import { cn } from "@/lib/cn";
import type { ApplicationStatus } from "@/lib/types";

type Tone = "neutral" | "info" | "brand" | "success" | "danger";

const TONES: Record<Tone, string> = {
  neutral: "bg-canvas text-ink-soft",
  info: "bg-info-50 text-info",
  brand: "bg-brand-50 text-brand-700",
  success: "bg-success-50 text-success",
  danger: "bg-danger-50 text-danger",
};

const STATUS: Record<ApplicationStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  APPLIED: { label: "Applied", tone: "info" },
  SANCTIONED: { label: "Sanctioned", tone: "brand" },
  REJECTED: { label: "Rejected", tone: "danger" },
  DISBURSED: { label: "Disbursed", tone: "info" },
  CLOSED: { label: "Closed", tone: "success" },
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", TONES[tone])}>
      {children}
    </span>
  );
}

// Coloured pill for a loan/application status
export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { label, tone } = STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}
