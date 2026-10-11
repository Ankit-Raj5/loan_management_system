import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

// Numbered progress indicator; only the active step's label shows on phones
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                  done && "bg-success text-white",
                  active && "bg-brand-500 text-white shadow-brand",
                  !done && !active && "bg-canvas text-muted"
                )}
              >
                {done ? <Check className="size-4" /> : index + 1}
              </span>
              <span className={cn("text-sm font-semibold", active ? "text-ink" : "hidden text-muted sm:inline")}>{label}</span>
            </span>
            {index < steps.length - 1 && <span className={cn("mx-3 h-0.5 flex-1 rounded", done ? "bg-success" : "bg-line")} />}
          </li>
        );
      })}
    </ol>
  );
}
