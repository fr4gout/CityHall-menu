import { Modal } from "@/components/ui/app-modal";
import { NeonButton } from "@/components/ui/neon-button";
import { fetchNui } from "@/nui/bridge";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useUIStore } from "@/store/useUIStore";
import type { Application, JobInfo, License } from "@/types";
import { fmtMoney } from "@/utils/format";
import { useState } from "react";

type Target =
  | { kind: "license"; license: License }
  | { kind: "job"; job: JobInfo }
  | { kind: "id"; fee: number; label: string };

export function ApplyDialog({
  open,
  onClose,
  target,
}: {
  open: boolean;
  onClose: () => void;
  target: Target | null;
}) {
  const [loading, setLoading] = useState(false);
  const addApp = usePlayerStore((s) => s.addApplication);
  const notify = useUIStore((s) => s.pushNotification);

  if (!target) return null;

  const title =
    target.kind === "license"
      ? `Apply for ${target.license.name}`
      : target.kind === "job"
      ? `Apply for ${target.job.name}`
      : target.label;

  const fee =
    target.kind === "license" ? target.license.fee : target.kind === "id" ? target.fee : 0;

  const requirements =
    target.kind === "license"
      ? target.license.requirements
      : target.kind === "job"
      ? target.job.requirements
      : ["Valid current ID or proof of identity", "Payment of processing fee"];

  const description =
    target.kind === "job"
      ? target.job.description
      : "Review the requirements and applicable fee before confirming your application.";

  const submit = async () => {
    setLoading(true);
    try {
      const action =
        target.kind === "license" ? "applyLicense" : target.kind === "job" ? "applyJob" : "applyID";
      await fetchNui(action, target);

      const app: Application = {
        id: `app-${Date.now()}`,
        kind: target.kind,
        target:
          target.kind === "license"
            ? target.license.type
            : target.kind === "job"
            ? target.job.id
            : "id-card",
        label:
          target.kind === "license"
            ? target.license.name
            : target.kind === "job"
            ? target.job.name
            : target.label,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      addApp(app);
      notify({
        title: "Application submitted",
        body: `${app.label} is now pending review.`,
        kind: "success",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <NeonButton variant="secondary" onClick={onClose}>Cancel</NeonButton>
          <NeonButton onClick={submit} loading={loading}>
            Confirm — {fmtMoney(fee)}
          </NeonButton>
        </>
      }
    >
      <div className="border border-border bg-background/40 p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Requirements
        </div>
        <ul className="mt-2 space-y-1.5">
          {requirements.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 size-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
              {r}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex items-center justify-between border border-primary/30 bg-primary/5 p-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Processing fee</span>
        <span className="font-display text-base font-semibold text-primary text-glow">
          {fmtMoney(fee)}
        </span>
      </div>
    </Modal>
  );
}
