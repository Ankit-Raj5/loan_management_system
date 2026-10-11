import { Icon } from "@/components/ui/icon";
import { MODULES } from "@/lib/modules";
import { LandingSection } from "./landing-section";

// The internal teams behind each loan, taken from the same module list the dashboard uses
export function TeamSection() {
  return (
    <LandingSection
      id="team"
      title="Built for the whole lending team"
      subtitle="Every stage has its own workspace, and each person only sees what their role allows."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((module) => (
          <div key={module.key} className="rounded-2xl bg-surface p-6 shadow-card">
            <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={module.icon} className="size-6" />
            </span>
            <h3 className="mt-4 font-bold text-ink">{module.label}</h3>
            <p className="mt-2 text-sm text-muted">{module.description}</p>
          </div>
        ))}
      </div>
    </LandingSection>
  );
}
