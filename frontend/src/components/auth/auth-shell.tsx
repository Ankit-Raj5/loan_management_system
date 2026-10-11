import Image from "next/image";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { BRAND } from "@/lib/config";

// Two-panel layout for login and register: the full logo on an orange panel for large screens, form always visible
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col items-center justify-center gap-8 overflow-hidden bg-linear-to-br from-brand-400 via-brand-500 to-brand-700 p-12 text-center text-white lg:flex">
        <div className="relative z-10 rounded-3xl bg-white p-8 shadow-pop">
          <Image
            src={BRAND.logo.url}
            alt={`${BRAND.name} – ${BRAND.tagline}`}
            width={BRAND.logo.width}
            height={BRAND.logo.height}
            unoptimized
            priority
            className="h-auto w-64 xl:w-72"
          />
        </div>
        <p className="relative z-10 max-w-md text-lg text-white/90">
          Apply for loans, review applications, release funds and collect repayments, all in one place.
        </p>
        <p className="absolute bottom-8 text-sm text-white/70">
          © {new Date().getFullYear()} {BRAND.name}
        </p>
        <span className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10" />
        <span className="absolute -bottom-32 -left-16 size-96 rounded-full bg-white/10" />
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
