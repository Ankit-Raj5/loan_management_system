import { requireAccess } from "@/lib/server/session";

// Operations dashboard: borrowers are turned away, each module checks its own role below
export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  await requireAccess("/dashboard");
  return children;
}
