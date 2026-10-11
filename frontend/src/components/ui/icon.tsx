import {
  Banknote,
  FileCheck2,
  FilePlus2,
  Files,
  LayoutDashboard,
  User,
  Users,
  Wallet,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import type { IconName } from "@/lib/modules";

const ICONS: Record<IconName, ComponentType<LucideProps>> = {
  users: Users,
  "file-check": FileCheck2,
  banknote: Banknote,
  wallet: Wallet,
  "layout-dashboard": LayoutDashboard,
  "file-plus": FilePlus2,
  files: Files,
  user: User,
};

// Renders an icon by name so navigation config can stay plain data
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = ICONS[name];
  return <Component aria-hidden {...props} />;
}
