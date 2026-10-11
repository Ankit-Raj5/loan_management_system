import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/lib/types";

// Pill showing how far a lead got before stopping
export function StageBadge({ stage }: { stage: Lead["stage"] }) {
  return stage === "DRAFT_IN_PROGRESS" ? <Badge tone="info">Draft in progress</Badge> : <Badge tone="danger">Eligibility rejected</Badge>;
}
