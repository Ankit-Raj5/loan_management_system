import { ApiError, parseEnvelope } from "../api-error";

type Method = "GET" | "POST" | "PATCH";

interface RequestOptions {
  signal?: AbortSignal;
  redirectOn401?: boolean;
}

// Sends a same-origin request to the Next.js proxy (which adds the cookie's token) and returns the data
const request = async <T>(method: Method, path: string, body?: unknown, options: RequestOptions = {}): Promise<T> => {
  const isForm = body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    method,
    signal: options.signal,
    headers: body !== undefined && !isForm ? { "Content-Type": "application/json" } : undefined,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  try {
    return await parseEnvelope<T>(res);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && options.redirectOn401 !== false) {
      // A full page load is needed so the server can clear the stale session cookie
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/api/auth/logout";
    }
    throw error;
  }
};

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("POST", path, body ?? {}, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("PATCH", path, body ?? {}, options),
  upload: <T>(path: string, form: FormData) => request<T>("POST", path, form),
};
