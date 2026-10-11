import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { homePathForRole } from "@/lib/access";
import { BRAND } from "@/lib/config";
import { getCurrentUser } from "@/lib/server/session";

export const metadata: Metadata = { title: { absolute: `${BRAND.name} | ${BRAND.tagline}` } };

// Public landing page; signed-in users go straight to their own home instead
export default async function RootPage() {
  const user = await getCurrentUser();
  if (user) redirect(homePathForRole(user.role));
  return <LandingPage />;
}
