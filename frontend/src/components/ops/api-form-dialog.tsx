"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextareaField, TextField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { getFieldErrors } from "@/lib/api-error";
import { api } from "@/lib/client/api";
import { useAsyncAction } from "@/lib/client/use-async-action";

export interface DialogField {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  defaultValue?: string;
}

interface ApiFormDialogProps {
  triggerLabel: string;
  triggerVariant?: "primary" | "secondary" | "danger" | "success";
  title: string;
  description?: string;
  endpoint: string;
  submitLabel: string;
  successMessage: string;
  fields: DialogField[];
}

// Button that opens a form dialog, posts the values to the API, then refreshes the page data.
// One component powers approve, reject, disburse and record-payment so none of them repeat modal code.
export function ApiFormDialog({
  triggerLabel,
  triggerVariant = "primary",
  title,
  description,
  endpoint,
  submitLabel,
  successMessage,
  fields,
}: ApiFormDialogProps) {
  const router = useRouter();
  const initial = Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? ""]));
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(initial);

  const { run, loading, error, reset } = useAsyncAction(
    async () => {
      const body: Record<string, string | number> = {};
      fields.forEach((field) => {
        const value = values[field.name].trim();
        if (value === "") return;
        body[field.name] = field.type === "number" ? Number(value) : value;
      });
      await api.post(endpoint, body);
      setOpen(false);
      setValues(initial);
      router.refresh();
    },
    { success: successMessage }
  );

  const close = () => {
    setOpen(false);
    reset();
  };
  const fieldErrors = getFieldErrors(error);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    run();
  };

  return (
    <>
      <Button variant={triggerVariant} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Modal open={open} title={title} description={description} onClose={close}>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {fields.map((field) => {
            const common = {
              id: `${endpoint}-${field.name}`,
              label: field.label,
              placeholder: field.placeholder,
              hint: field.hint,
              required: field.required,
              value: values[field.name],
              error: fieldErrors[field.name],
            };
            const onChange = (event: { target: { value: string } }) =>
              setValues((current) => ({ ...current, [field.name]: event.target.value }));
            return field.type === "textarea" ? (
              <TextareaField key={field.name} {...common} onChange={onChange} />
            ) : (
              <TextField key={field.name} type={field.type ?? "text"} step={field.type === "number" ? "0.01" : undefined} {...common} onChange={onChange} />
            );
          })}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" variant={triggerVariant} loading={loading}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
