import { BrandLogo } from "@/components/layout/brand-logo";
import { ButtonLink } from "@/components/ui/button";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#loan-details", label: "Loan details" },
  { href: "#team", label: "For our team" },
  { href: "#contact", label: "Contact" },
];

// Sticky top bar: logo, section links (large screens) and the sign in / sign up buttons
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLogo />
        <nav aria-label="Sections" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-semibold text-ink-soft transition hover:text-brand-600">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="secondary" size="sm">
            Sign in
          </ButtonLink>
          <ButtonLink href="/register" size="sm">
            Sign up
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
