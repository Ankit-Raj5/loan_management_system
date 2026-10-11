import { AppShell } from "@/components/layout/app-shell";
import { navForRole } from "@/lib/navigation";
import { requireUser } from "@/lib/server/session";

// Allow up to 60s so pages still load when a sleeping free-tier backend is waking up
export const maxDuration = 60;

// Frame for every signed-in page; the sidebar is built from the user's role
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  return (
    <AppShell user={{ name: user.name, email: user.email, role: user.role }} nav={navForRole(user.role)}>
      {children}
    </AppShell>
  );
}
