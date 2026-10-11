import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { BRAND } from "@/lib/config";

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <BrandLogo />
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}.
        </p>
        <div className="flex gap-5 text-sm font-semibold text-ink-soft">
          <Link href="/login" className="hover:text-brand-600">
            Sign in
          </Link>
          <Link href="/register" className="hover:text-brand-600">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
