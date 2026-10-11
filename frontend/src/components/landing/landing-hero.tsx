import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { LANDING } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { LOAN_LIMITS } from "@/lib/loan-limits";

const HIGHLIGHTS = [
  { value: `${formatCurrency(LOAN_LIMITS.minAmount)} – ${formatCurrency(LOAN_LIMITS.maxAmount)}`, label: "Loan amount" },
  { value: `${LOAN_LIMITS.minTenure} – ${LOAN_LIMITS.maxTenure} days`, label: "Flexible tenure" },
  { value: `${LOAN_LIMITS.interestRate}% a year`, label: "Simple interest" },
];

// Headline, call-to-action buttons, key numbers and the hero illustration (served from Cloudinary)
export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-brand-50 to-canvas">
      <span className="absolute -top-32 -right-24 size-96 rounded-full bg-brand-200/40 blur-3xl" />
      <span className="absolute -bottom-32 -left-24 size-96 rounded-full bg-brand-100/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
        <div className="animate-fade-up">
          <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700">
            Quick, transparent personal loans
          </span>
          <h1 className="mt-5 text-4xl leading-tight font-extrabold text-ink sm:text-5xl">
            Get the loan you need, <span className="text-brand-500">without the paperwork maze</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Check your eligibility in seconds, upload one document, choose your amount and tenure, and see exactly what you will repay before you apply.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/register" size="lg">
              Apply for a loan <ArrowRight className="size-5" />
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" size="lg">
              Sign in
            </ButtonLink>
          </div>
          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="mt-0.5 font-bold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Image
          src={LANDING.hero.url}
          alt={LANDING.hero.alt}
          width={LANDING.hero.width}
          height={LANDING.hero.height}
          unoptimized
          priority
          className="mx-auto h-auto w-full max-w-lg animate-float"
        />
      </div>
    </section>
  );
}
