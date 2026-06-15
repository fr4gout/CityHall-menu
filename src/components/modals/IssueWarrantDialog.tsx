import { Modal } from "@/components/ui/app-modal";
import { NeonButton } from "@/components/ui/neon-button";
import { fetchNui } from "@/nui/bridge";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useUIStore } from "@/store/useUIStore";
import type { Warrant, WarrantType } from "@/types";
import { useState } from "react";

const TYPES: WarrantType[] = ["arrest", "search", "bench"];

export function IssueWarrantDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const player = usePlayerStore((s) => s.player);
  const addWarrant = usePlayerStore((s) => s.addWarrant);
  const notify = useUIStore((s) => s.pushNotification);
  const [loading, setLoading] = useState(false);
  const [citizenId, setCitizenId] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [type, setType] = useState<WarrantType>("arrest");
  const [charges, setCharges] = useState("");
  const [notes, setNotes] = useState("");

  const issuer = player
    ? `${player.firstName} ${player.lastName}, ${player.job.name}`
    : "City Hall Registry";

  async function handleSubmit() {
    if (!citizenId.trim() || !citizenName.trim() || !charges.trim()) return;
    setLoading(true);
    try {
      const payload = {
        citizenId: citizenId.trim(),
        citizenName: citizenName.trim(),
        type,
        charges: charges.trim(),
        issuedBy: issuer,
        notes: notes.trim() || undefined,
      };
      const res = await fetchNui<
        typeof payload,
        { ok: boolean; warrant: Warrant }
      >("issueWarrant", payload);
      if (res?.warrant) {
        addWarrant(res.warrant);
        notify({
          title: "Warrant issued",
          body: `${res.warrant.citizenName} — ${res.warrant.charges}`,
          kind: "success",
        });
        setCitizenId("");
        setCitizenName("");
        setCharges("");
        setNotes("");
        setType("arrest");
        onClose();
      }
    } catch (err) {
      console.error("[NUI] issueWarrant failed", err);
      notify({ title: "Failed to issue warrant", kind: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Issue Warrant"
      description="Enter citizen details and charges. This will be logged in the judicial registry."
      footer={
        <div className="flex justify-end gap-2">
          <NeonButton variant="ghost" onClick={onClose}>
            Cancel
          </NeonButton>
          <NeonButton
            loading={loading}
            disabled={!citizenId.trim() || !citizenName.trim() || !charges.trim()}
            onClick={() => void handleSubmit()}
          >
            Issue Warrant
          </NeonButton>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Citizen ID">
          <input
            value={citizenId}
            onChange={(e) => setCitizenId(e.target.value)}
            placeholder="LSPD-09F4A2"
            className="w-full border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
        </Field>
        <Field label="Citizen Name">
          <input
            value={citizenName}
            onChange={(e) => setCitizenName(e.target.value)}
            placeholder="First Last"
            className="w-full border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
        </Field>
        <Field label="Warrant Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as WarrantType)}
            className="w-full border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Charges">
          <input
            value={charges}
            onChange={(e) => setCharges(e.target.value)}
            placeholder="Description of charges"
            className="w-full border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
        </Field>
        <Field label="Notes (optional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Additional context for officers..."
            className="w-full resize-none border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
