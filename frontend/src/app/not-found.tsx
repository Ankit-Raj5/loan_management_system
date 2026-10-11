import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-6xl font-extrabold text-brand-500">404</p>
      <h1 className="text-xl font-bold text-ink">We could not find that page</h1>
      <p className="text-sm text-muted">It may have been moved, or the link is incorrect.</p>
      <ButtonLink href="/">Go home</ButtonLink>
    </div>
  );
}
