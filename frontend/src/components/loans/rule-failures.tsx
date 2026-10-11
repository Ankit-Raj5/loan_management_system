import { Alert } from "@/components/ui/alert";
import type { BreFailure } from "@/lib/types";

// Lists every eligibility rule an application failed
export function RuleFailures({ title, failures }: { title: string; failures: BreFailure[] }) {
  return (
    <Alert tone="error" title={title}>
      <ul className="list-disc space-y-1 pl-5">
        {failures.map((failure) => (
          <li key={failure.rule}>{failure.message}</li>
        ))}
      </ul>
    </Alert>
  );
}
