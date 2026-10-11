"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { ApiError, getFieldErrors } from "../api-error";

interface Options {
  success?: string;
}

// Runs an async action and tracks loading and error state. Field validation errors stay inline (read them from
// `error`); every other failure pops up as a bottom-right toast, and an optional success toast is shown on completion.
export const useAsyncAction = <TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
  options: Options = {}
) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { success } = options;

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const result = await action(...args);
        if (success) toast.success(success);
        return result;
      } catch (err) {
        const apiError = err instanceof ApiError ? err : new ApiError("Something went wrong", 0, "UNKNOWN");
        setError(apiError);
        if (Object.keys(getFieldErrors(apiError)).length === 0) toast.error(apiError.message);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [action, success, toast]
  );

  const reset = useCallback(() => setError(null), []);
  return { run, loading, error, reset };
};
