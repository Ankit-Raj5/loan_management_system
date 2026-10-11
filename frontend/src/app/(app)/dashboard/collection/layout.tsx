import { requireAccess } from "@/lib/server/session";

export default async function CollectionLayout({ children }: LayoutProps<"/dashboard/collection">) {
  await requireAccess("/dashboard/collection");
  return children;
}
