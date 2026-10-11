import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { Card, CardHeader } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { PageHeader } from "@/components/ui/page-header";
import { formatDateTime } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/roles";
import { requireUser } from "@/lib/server/session";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profile" description="Your account details and password" />
      <div className="space-y-6">
        <Card>
          <CardHeader title="Account" />
          <DescriptionList
            items={[
              { label: "Name", value: user.name },
              { label: "Email", value: user.email },
              { label: "Role", value: ROLE_LABEL[user.role] },
              { label: "Last login", value: formatDateTime(user.lastLoginAt) },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Change password" />
          <ChangePasswordForm />
        </Card>
      </div>
    </div>
  );
}
