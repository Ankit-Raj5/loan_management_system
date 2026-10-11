"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client/api";
import { useAsyncAction } from "@/lib/client/use-async-action";
import { Button } from "@/components/ui/button";

// Clears the session cookie and returns to the login page
export function LogoutButton() {
  const router = useRouter();
  const { run, loading } = useAsyncAction(async () => {
    await api.post("/auth/logout", undefined, { redirectOn401: false });
    router.replace("/login");
    router.refresh();
  });

  return (
    <Button variant="ghost" size="sm" loading={loading} onClick={() => run()} aria-label="Log out">
      <LogOut className="size-4" />
      <span className="hidden sm:inline">Log out</span>
    </Button>
  );
}
