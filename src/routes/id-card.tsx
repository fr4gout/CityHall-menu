import { createFileRoute } from "@tanstack/react-router";
import { IDCardPreview } from "@/components/cards/IDCardPreview";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { ApplyDialog } from "@/components/modals/ApplyDialog";
import { useState } from "react";
import { Banknote, RefreshCw, ScanLine } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";

export const Route = createFileRoute("/id-card")({
  head: () => ({ meta: [{ title: "ID Card — City Hall" }] }),
  component: IDCardPage,
});

function IDCardPage() {
  const player = usePlayerStore((s) => s.player);
  const [dialog, setDialog] = useState<null | { fee: number; label: string }>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div className="flex justify-center lg:justify-start">
        <IDCardPreview />
      </div>

      <div className="space-y-4">
        <GlassCard>
          <h3 className="font-display text-base font-semibold">Manage your ID</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your Citizen ID is required for licenses, employment, and banking. Keep it current.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <NeonButton
              icon={<ScanLine className="size-4" />}
              onClick={() => setDialog({ fee: 150, label: "Apply for New ID" })}
            >
              Apply for New ID
            </NeonButton>
            <NeonButton
              variant="secondary"
              icon={<RefreshCw className="size-4" />}
              onClick={() => setDialog({ fee: 75, label: "Replace Lost ID" })}
            >
              Replace Lost ID
            </NeonButton>
            <NeonButton
              variant="success"
              icon={<Banknote className="size-4" />}
              onClick={() => setDialog({ fee: 50, label: "Pay ID Processing Fee" })}
            >
              Pay Fee
            </NeonButton>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Why this matters
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Required when applying for any government license.</li>
            <li>· Banks will not open accounts without a valid ID on file.</li>
            <li>· Employers verify ID before hiring.</li>
            <li>· Replace immediately if lost — fines apply when stopped without ID.</li>
          </ul>
          {player?.idCard.status === "expired" && (
            <div className="mt-3 border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              Your ID is expired. Renew now to avoid civic penalties.
            </div>
          )}
        </GlassCard>
      </div>

      <ApplyDialog
        open={!!dialog}
        onClose={() => setDialog(null)}
        target={dialog ? { kind: "id", fee: dialog.fee, label: dialog.label } : null}
      />
    </div>
  );
}
