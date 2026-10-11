import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { firstParam } from "@/lib/url";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  return <AuthForm mode="login" next={firstParam(next)} />;
}
