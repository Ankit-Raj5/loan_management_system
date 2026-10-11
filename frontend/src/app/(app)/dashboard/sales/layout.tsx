import { requireAccess } from "@/lib/server/session";

export default async function SalesLayout({ children }: LayoutProps<"/dashboard/sales">) {
  await requireAccess("/dashboard/sales");
  return children;
}
