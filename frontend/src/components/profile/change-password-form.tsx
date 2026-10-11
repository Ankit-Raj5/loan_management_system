"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { getFieldErrors } from "@/lib/api-error";
import { api } from "@/lib/client/api";
import { useAsyncAction } from "@/lib/client/use-async-action";

const EMPTY = { currentPassword: "", newPassword: "" };

// Lets any signed-in user change their own password
export function ChangePasswordForm() {
  const [values, setValues] = useState(EMPTY);

  const { run, loading, error } = useAsyncAction(
    async () => {
      await api.patch("/auth/change-password", values);
      setValues(EMPTY);
    },
    { success: "Password changed successfully" }
  );

  const fieldErrors = getFieldErrors(error);
  const update = (key: keyof typeof EMPTY) => (event: ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    run();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <TextField
        id="currentPassword"
        type="password"
        label="Current password"
        autoComplete="current-password"
        value={values.currentPassword}
        onChange={update("currentPassword")}
        error={fieldErrors.currentPassword}
      />
      <TextField
        id="newPassword"
        type="password"
        label="New password"
        autoComplete="new-password"
        hint="At least 8 characters"
        value={values.newPassword}
        onChange={update("newPassword")}
        error={fieldErrors.newPassword}
      />
      <Button type="submit" loading={loading}>
        Update password
      </Button>
    </form>
  );
}
