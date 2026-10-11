"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { NavSection } from "@/lib/navigation";
import { ROLE_LABEL, type Role } from "@/lib/roles";
import { BrandLogo } from "./brand-logo";
import { LogoutButton } from "./logout-button";

interface AppShellProps {
  user: { name: string; email: string; role: Role };
  nav: NavSection[];
  children: ReactNode;
}

// Page frame: fixed sidebar on desktop, slide-in drawer on phones, plus a top bar with the user and logout
export function AppShell({ user, nav, children }: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <div className="min-h-screen lg:pl-64">
      {open && <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-surface p-5 shadow-card transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <BrandLogo />
          <button type="button" aria-label="Close menu" className="rounded-lg p-1 text-muted lg:hidden" onClick={() => setOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        {nav.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold tracking-widest text-muted uppercase">{section.title}</p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                      isActive(item.href) ? "bg-linear-to-r from-brand-400 to-brand-500 text-white shadow-brand" : "text-ink-soft hover:bg-canvas"
                    )}
                  >
                    <Icon name={item.icon} className="size-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-canvas/80 px-4 py-3 backdrop-blur sm:px-8">
        <button type="button" aria-label="Open menu" className="rounded-xl bg-surface p-2.5 shadow-card lg:hidden" onClick={() => setOpen(true)}>
          <Menu className="size-5" />
        </button>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-bold text-ink">{user.name}</p>
            <p className="text-xs text-muted">{ROLE_LABEL[user.role]}</p>
          </div>
          <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 text-sm font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className="px-4 pt-2 pb-10 sm:px-8">{children}</main>
    </div>
  );
}
