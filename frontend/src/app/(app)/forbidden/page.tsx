import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { homePathForRole } from "@/lib/access";
import { requireUser } from "@/lib/server/session";

export const metadata: Metadata = { title: "No access" };

export default async function ForbiddenPage() {
  const user = await requireUser();
  return (
    <Card className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-danger-50 text-danger">
        <ShieldAlert className="size-7" />
      </span>
      <h1 className="text-xl font-bold text-ink">You do not have access to this page</h1>
      <p className="text-sm text-muted">Your role is not allowed to open it. Use the menu to go to the pages that are available to you.</p>
      <ButtonLink href={homePathForRole(user.role)}>Go to my home</ButtonLink>
    </Card>
  );
}
