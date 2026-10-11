import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface LandingSectionProps {
  id: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  tinted?: boolean;
}

// Shared frame for every landing section: anchor id, centred heading and subtitle, and a width-limited body
export function LandingSection({ id, title, subtitle, children, tinted }: LandingSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-16 py-16 sm:py-20", tinted && "bg-surface")}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">{title}</h2>
          <p className="mt-3 text-muted">{subtitle}</p>
        </div>
        <div className="reveal">{children}</div>
      </div>
    </section>
  );
}
