import { requireAccess } from "@/lib/server/session";

export default async function DisbursementLayout({ children }: LayoutProps<"/dashboard/disbursement">) {
  await requireAccess("/dashboard/disbursement");
  return children;
}
