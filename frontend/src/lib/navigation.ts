import { modulesForRole } from "./access";
import type { IconName } from "./modules";
import type { Role } from "./roles";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const PROFILE: NavSection = { title: "Account", items: [{ href: "/profile", label: "Profile", icon: "user" }] };

const BORROWER_ITEMS: NavItem[] = [
  { href: "/applications", label: "My applications", icon: "files" },
  { href: "/apply", label: "Apply for a loan", icon: "file-plus" },
];

// Builds the sidebar for a role: borrowers get the portal, executives their modules, Admin everything
export const navForRole = (role: Role): NavSection[] => {
  const main: NavItem[] =
    role === "BORROWER"
      ? BORROWER_ITEMS
      : [
          ...(role === "ADMIN" ? [{ href: "/dashboard", label: "Overview", icon: "layout-dashboard" as const }] : []),
          ...modulesForRole(role).map((module) => ({ href: module.path, label: module.label, icon: module.icon })),
        ];
  return [{ title: "Menu", items: main }, PROFILE];
};
