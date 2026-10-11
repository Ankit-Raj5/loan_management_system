import { requireAccess } from "@/lib/server/session";

export default async function SanctionLayout({ children }: LayoutProps<"/dashboard/sanction">) {
  await requireAccess("/dashboard/sanction");
  return children;
}
