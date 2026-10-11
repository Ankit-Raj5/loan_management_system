import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "error" | "success" | "info";

const TONES: Record<Tone, string> = {
  error: "border-danger/30 bg-danger-50 text-danger",
  success: "border-success/30 bg-success-50 text-success",
  info: "border-info/30 bg-info-50 text-info",
};

export function Alert({ tone = "info", title, children }: { tone?: Tone; title?: string; children?: ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-xl border px-4 py-3 text-sm", TONES[tone])}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={cn(title && "mt-1", "text-ink-soft")}>{children}</div>}
    </div>
  );
}
