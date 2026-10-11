import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./spinner";

type Variant = "primary" | "secondary" | "danger" | "success" | "ghost";
type Size = "sm" | "md" | "lg";

interface StyleProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-linear-to-r from-brand-400 to-brand-500 text-white shadow-brand hover:from-brand-500 hover:to-brand-600",
  secondary: "border border-line bg-surface text-ink hover:bg-canvas",
  danger: "bg-danger text-white hover:opacity-90",
  success: "bg-success text-white hover:opacity-90",
  ghost: "text-ink-soft hover:bg-canvas",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

// Builds the class list shared by Button and ButtonLink
export const buttonClasses = ({ variant = "primary", size = "md", fullWidth }: StyleProps = {}) =>
  cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full");

export function Button({
  variant,
  size,
  fullWidth,
  loading,
  disabled,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleProps & { loading?: boolean }) {
  return (
    <button
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, fullWidth, className, ...rest }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={cn(buttonClasses({ variant, size, fullWidth }), className)} {...rest} />;
}
