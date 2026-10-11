import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
  hint?: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

// Toggle-style selector (e.g. choosing a role); wraps onto several rows on narrow screens.
// Disabled options stay visible with a lock icon and cannot be selected.
export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-2 rounded-2xl bg-canvas p-1.5 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          disabled={option.disabled}
          title={option.disabled ? option.hint : undefined}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition active:scale-[0.97]",
            option.value === value && "bg-linear-to-r from-brand-400 to-brand-500 text-white shadow-brand",
            option.value !== value && !option.disabled && "text-ink-soft hover:bg-surface",
            option.disabled && "cursor-not-allowed text-muted/70 active:scale-100"
          )}
        >
          {option.disabled && <Lock className="size-3.5" aria-hidden />}
          {option.label}
        </button>
      ))}
    </div>
  );
}
