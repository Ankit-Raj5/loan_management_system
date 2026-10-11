import type { BreFailure } from "./types";

// Error thrown for any non-success API response, carrying the backend's code and details
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: { code: string; details?: unknown };
}

// Reads the backend's standard envelope, returning data on success or throwing ApiError
export const parseEnvelope = async <T>(res: Response): Promise<T> => {
  let body: Envelope<T> | null = null;
  try {
    body = (await res.json()) as Envelope<T>;
  } catch {
    body = null;
  }
  if (!res.ok || !body?.success) {
    throw new ApiError(body?.message ?? "Something went wrong", res.status, body?.error?.code ?? "UNKNOWN", body?.error?.details);
  }
  return body.data as T;
};

// Extracts per-field validation messages (422 VALIDATION_ERROR) from an error
export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!(error instanceof ApiError) || error.code !== "VALIDATION_ERROR") return {};
  const details = error.details;
  return details && typeof details === "object" ? (details as Record<string, string>) : {};
};

// Extracts the failed eligibility rules (422 BRE_REJECTED) from an error
export const getRuleFailures = (error: unknown): BreFailure[] => {
  if (!(error instanceof ApiError) || error.code !== "BRE_REJECTED") return [];
  const failures = (error.details as { failures?: BreFailure[] } | undefined)?.failures;
  return failures ?? [];
};
