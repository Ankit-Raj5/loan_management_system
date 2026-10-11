import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { modulesForRole } from "@/lib/access";
import { getModuleCount } from "@/lib/server/queries";
import { requireUser } from "@/lib/server/session";

export const metadata: Metadata = { title: "Overview" };

// Overview: how many items are waiting in each module the user may open
export default async function DashboardPage() {
  const user = await requireUser();
  const modules = modulesForRole(user.role);
  const counts = await Promise.all(modules.map(getModuleCount));

  return (
    <div>
      <PageHeader title={`Welcome, ${user.name}`} description="Here is what is waiting for you today" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module, index) => (
          <StatCard key={module.key} label={module.summary.label} value={counts[index]} icon={module.icon} href={module.path} />
        ))}
      </div>
    </div>
  );
}
