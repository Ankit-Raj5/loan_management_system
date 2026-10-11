import { requireAccess } from "@/lib/server/session";

// Borrower portal: only borrowers may open these pages
export default async function PortalLayout({ children }: LayoutProps<"/">) {
  await requireAccess("/apply");
  return children;
}
