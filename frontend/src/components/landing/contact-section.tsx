import { Mail } from "lucide-react";
import type { ReactNode } from "react";
import { SocialIcon } from "@/components/ui/social-icon";
import { CONTACT } from "@/lib/config";
import { LandingSection } from "./landing-section";

interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
  external: boolean;
}

const LINKS: ContactLink[] = [
  {
    label: "LinkedIn",
    value: CONTACT.linkedin.replace("https://www.", "").replace(/\/$/, ""),
    href: CONTACT.linkedin,
    icon: <SocialIcon name="linkedin" className="size-6" />,
    external: true,
  },
  { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, icon: <Mail className="size-6" />, external: false },
  {
    label: "GitHub",
    value: CONTACT.github.replace("https://", ""),
    href: CONTACT.github,
    icon: <SocialIcon name="github" className="size-6" />,
    external: true,
  },
];

// Contact cards linking to LinkedIn, email and GitHub
export function ContactSection() {
  return (
    <LandingSection id="contact" title="Contact us" subtitle="Questions, feedback or want to talk? Reach out through any of these." tinted>
      <div className="grid gap-5 sm:grid-cols-3">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
            className="group flex flex-col items-center gap-3 rounded-2xl bg-canvas p-6 text-center transition hover:-translate-y-1 hover:shadow-pop"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-brand-400 to-brand-500 text-white shadow-brand">
              {link.icon}
            </span>
            <span className="font-bold text-ink">{link.label}</span>
            <span className="text-sm break-all text-muted transition group-hover:text-brand-600">{link.value}</span>
          </a>
        ))}
      </div>
    </LandingSection>
  );
}
