import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const CONTROL =
  "w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:ring-4 disabled:bg-canvas";

// Shared look for every input, select and textarea; turns red when invalid
const controlClass = (invalid?: boolean) =>
  cn(CONTROL, invalid ? "border-danger focus:ring-danger-50" : "border-line focus:border-brand-500 focus:ring-brand-100");

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

// Label, control and error/hint text laid out the same way for every form field
function FieldShell({ id, label, error, hint, children }: FieldProps & { children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink-soft">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs font-medium text-danger">{error}</p> : hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextField({ label, error, hint, id, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell {...{ id, label, error, hint }}>
      <input id={id} aria-invalid={!!error} className={controlClass(!!error)} {...rest} />
    </FieldShell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  id,
  children,
  ...rest
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell {...{ id, label, error, hint }}>
      <select id={id} aria-invalid={!!error} className={controlClass(!!error)} {...rest}>
        {children}
      </select>
    </FieldShell>
  );
}

export function TextareaField({ label, error, hint, id, ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell {...{ id, label, error, hint }}>
      <textarea id={id} rows={3} aria-invalid={!!error} className={controlClass(!!error)} {...rest} />
    </FieldShell>
  );
}
