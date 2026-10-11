"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Shown when a page fails to load (for example the API is down); lets the user retry
export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-danger-50 text-danger">
        <TriangleAlert className="size-7" />
      </span>
      <h1 className="text-xl font-bold text-ink">Something went wrong</h1>
      <p className="text-sm text-muted">{error.message || "We could not load this page. Please try again."}</p>
      <Button onClick={reset}>Try again</Button>
    </Card>
  );
}
