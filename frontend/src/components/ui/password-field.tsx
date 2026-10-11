"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { controlClass, FieldShell, type FieldProps } from "./field";

// Password input with an eye button that shows or hides what is typed
export function PasswordField({ label, error, hint, id, ...rest }: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <FieldShell {...{ id, label, error, hint }}>
      <div className="relative">
        <input id={id} type={visible ? "text" : "password"} aria-invalid={!!error} className={cn(controlClass(!!error), "pr-12")} {...rest} />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-muted transition hover:text-brand-600 focus-visible:text-brand-600 focus-visible:outline-none"
        >
          <Icon className="size-5" />
        </button>
      </div>
    </FieldShell>
  );
}
