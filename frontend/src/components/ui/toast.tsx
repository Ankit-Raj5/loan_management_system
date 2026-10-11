"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "success" | "error";

interface ToastItem {
  id: number;
  tone: Tone;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
}

const DISMISS_AFTER_MS = 5000;
const ToastContext = createContext<ToastApi | null>(null);

// Provides toast notifications that pop up in the bottom-right corner and disappear on their own
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const push = useCallback(
    (tone: Tone, message: string) => {
      const id = nextId.current++;
      setItems((current) => [...current, { id, tone, message }]);
      setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
    },
    [dismiss]
  );
  const api = useMemo<ToastApi>(() => ({ success: (m) => push("success", m), error: (m) => push("error", m) }), [push]);

  return (
    <ToastContext value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 left-4 z-[60] flex flex-col items-end gap-2 sm:left-auto">
        {items.map((item) => (
          <div
            key={item.id}
            role={item.tone === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm animate-[toast-in_0.2s_ease-out] items-start gap-3 rounded-xl border-l-4 bg-surface p-4 shadow-pop",
              item.tone === "error" ? "border-danger" : "border-success"
            )}
          >
            {item.tone === "error" ? <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" /> : <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />}
            <p className="flex-1 text-sm font-medium text-ink">{item.message}</p>
            <button type="button" aria-label="Dismiss" onClick={() => dismiss(item.id)} className="text-muted hover:text-ink">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export const useToast = (): ToastApi => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};
