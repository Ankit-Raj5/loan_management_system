import { ContactSection } from "./contact-section";
import { HowItWorks } from "./how-it-works";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { LoanDetails } from "./loan-details";
import { TeamSection } from "./team-section";

// Public home page shown to signed-out visitors
export function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <LandingHero />
        <HowItWorks />
        <LoanDetails />
        <TeamSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </>
  );
}
