"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { canAccessPath, homePathForRole } from "@/lib/access";
import { getFieldErrors } from "@/lib/api-error";
import { api } from "@/lib/client/api";
import { useAsyncAction } from "@/lib/client/use-async-action";
import { canSelfSignUp, LOGIN_ROLES, ROLE_LABEL, SIGNUP_ROLES, type Role } from "@/lib/roles";
import type { User } from "@/lib/types";

interface AuthFormProps {
  mode: "login" | "register";
  next?: string;
}

const COPY = {
  login: {
    title: "Welcome back",
    subtitle: "Choose your role and sign in to continue",
    submit: "Sign in",
    switchText: "New here?",
    switchLink: { href: "/register", label: "Create an account" },
  },
  register: {
    title: "Create your account",
    subtitle: "Choose the role you are signing up for",
    submit: "Sign up",
    switchText: "Already have an account?",
    switchLink: { href: "/login", label: "Sign in" },
  },
} as const;

const STAFF_SIGNUP_NOTICE =
  "Sales, Sanction, Disbursement and Collection accounts are created by an administrator. Contact your administrator to get access. Borrowers can sign up here.";

// Only follow ?next= when it is a local path the signed-in role may open
const resolveDestination = (role: Role, next?: string): string =>
  next && next.startsWith("/") && !next.startsWith("//") && canAccessPath(role, next) ? next : homePathForRole(role);

// Shared login/sign-up form with the role toggle; stores the session in an httpOnly cookie via the Next.js API
export function AuthForm({ mode, next }: AuthFormProps) {
  const router = useRouter();
  const copy = COPY[mode];
  const [role, setRole] = useState<Role>("BORROWER");
  const [values, setValues] = useState({ name: "", email: "", password: "" });

  const { run, loading, error } = useAsyncAction(async () => {
    const body = mode === "register" ? { ...values, role } : { email: values.email, password: values.password, role };
    const { user } = await api.post<{ user: User }>(`/auth/${mode}`, body, { redirectOn401: false });
    router.replace(resolveDestination(user.role, next));
    router.refresh();
  });

  const fieldErrors = getFieldErrors(error);
  const update = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    run();
  };

  return (
    <div className="animate-fade-up">
      <h1 className="text-3xl font-extrabold text-ink">{copy.title}</h1>
      <p className="mt-1 mb-6 text-sm text-muted">{copy.subtitle}</p>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <SegmentedControl
          label="Role"
          value={role}
          onChange={setRole}
          options={(mode === "login" ? LOGIN_ROLES : SIGNUP_ROLES).map((value) => ({
            value,
            label: ROLE_LABEL[value],
            disabled: mode === "register" && !canSelfSignUp(value),
            hint: STAFF_SIGNUP_NOTICE,
          }))}
        />
        {mode === "register" && <Alert tone="info">{STAFF_SIGNUP_NOTICE}</Alert>}
        {fieldErrors.role && <p className="text-xs font-medium text-danger">{fieldErrors.role}</p>}

        {mode === "register" && (
          <TextField id="name" label="Full name" autoComplete="name" value={values.name} onChange={update("name")} error={fieldErrors.name} />
        )}
        <TextField id="email" type="email" label="Email" autoComplete="email" value={values.email} onChange={update("email")} error={fieldErrors.email} />
        <TextField
          id="password"
          type="password"
          label="Password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          hint={mode === "register" ? "At least 8 characters" : undefined}
          value={values.password}
          onChange={update("password")}
          error={fieldErrors.password}
        />

        <Button type="submit" size="lg" fullWidth loading={loading}>
          {copy.submit} as {ROLE_LABEL[role]}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {copy.switchText}{" "}
        <Link href={copy.switchLink.href} className="font-semibold text-brand-600 hover:text-brand-700">
          {copy.switchLink.label}
        </Link>
      </p>
    </div>
  );
}
