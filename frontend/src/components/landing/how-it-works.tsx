import { BadgeCheck, Banknote, FileText, Upload, UserCheck, type LucideIcon } from "lucide-react";
import { LandingSection } from "./landing-section";

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: UserCheck, title: "Create your account", text: "Sign up as a borrower and sign in securely in under a minute." },
  { icon: FileText, title: "Share your details", text: "Enter your name, PAN, date of birth, salary and employment. Eligibility is checked instantly." },
  { icon: Upload, title: "Upload a salary slip", text: "Attach one PDF, JPG or PNG up to 5 MB. It is stored privately and only reviewers can open it." },
  { icon: BadgeCheck, title: "Choose and apply", text: "Slide to your amount and tenure, see the live repayment summary, then apply." },
  { icon: Banknote, title: "Review, funds, repayment", text: "Our team reviews your application, releases the funds, and records each repayment until the loan closes." },
];

// The borrower journey in five numbered steps
export function HowItWorks() {
  return (
    <LandingSection id="how-it-works" title="How it works" subtitle="From sign-up to a closed loan, every step is clear and tracked.">
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative rounded-2xl bg-surface p-6 shadow-card">
            <span className="absolute top-4 right-5 text-4xl font-extrabold text-brand-100">{index + 1}</span>
            <span className="grid size-12 place-items-center rounded-xl bg-linear-to-br from-brand-400 to-brand-500 text-white shadow-brand">
              <step.icon className="size-6" />
            </span>
            <h3 className="mt-4 font-bold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}
