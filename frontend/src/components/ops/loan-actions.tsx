import { todayIsoDate } from "@/lib/format";
import type { OpsModule } from "@/lib/modules";
import type { OpsLoan } from "@/lib/types";
import { ApiFormDialog } from "./api-form-dialog";

// Shows only the actions that make sense for this module and the loan's current status
export function LoanActions({ module, loan }: { module: OpsModule["key"]; loan: OpsLoan }) {
  const base = `/${module}/${module === "sanction" ? "applications" : "loans"}/${loan.id}`;

  if (module === "sanction" && loan.status === "APPLIED") {
    return (
      <div className="flex flex-wrap gap-2">
        <ApiFormDialog
          triggerLabel="Approve"
          triggerVariant="success"
          title="Approve this loan?"
          description="The loan moves to Sanctioned and becomes ready for disbursement."
          endpoint={`${base}/approve`}
          submitLabel="Approve loan"
          successMessage="Loan sanctioned successfully"
          fields={[{ name: "note", label: "Note (optional)", type: "textarea", placeholder: "e.g. Salary slip verified" }]}
        />
        <ApiFormDialog
          triggerLabel="Reject"
          triggerVariant="danger"
          title="Reject this loan"
          description="The borrower will see the reason you give."
          endpoint={`${base}/reject`}
          submitLabel="Reject loan"
          successMessage="Loan rejected"
          fields={[{ name: "reason", label: "Reason", type: "textarea", required: true, hint: "5 to 500 characters" }]}
        />
      </div>
    );
  }

  if (module === "disbursement" && loan.status === "SANCTIONED") {
    return (
      <ApiFormDialog
        triggerLabel="Mark as disbursed"
        title="Release funds?"
        description="Confirm the money has been sent. The loan moves to Disbursed and repayment starts."
        endpoint={`${base}/disburse`}
        submitLabel="Confirm disbursement"
        successMessage="Loan disbursed successfully"
        fields={[{ name: "note", label: "Note (optional)", type: "textarea", placeholder: "e.g. Bank transfer reference" }]}
      />
    );
  }

  if (module === "collection" && loan.status === "DISBURSED") {
    return (
      <ApiFormDialog
        triggerLabel="Record payment"
        title="Record a payment"
        description="The loan closes automatically once the full amount is paid."
        endpoint={`${base}/payments`}
        submitLabel="Save payment"
        successMessage="Payment recorded"
        fields={[
          { name: "utr", label: "UTR number", required: true, placeholder: "e.g. UTR123456789", hint: "Must be unique across all payments" },
          { name: "amount", label: "Amount (₹)", type: "number", required: true },
          { name: "date", label: "Payment date", type: "date", required: true, defaultValue: todayIsoDate() },
        ]}
      />
    );
  }

  return null;
}
