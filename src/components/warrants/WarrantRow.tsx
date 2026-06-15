import { NeonButton } from "@/components/ui/neon-button";
import { fetchNui } from "@/nui/bridge";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useUIStore } from "@/store/useUIStore";
import type { Warrant } from "@/types";
import { fmtDate, fmtRelative } from "@/utils/format";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { WarrantStatusBadge, WarrantTypeBadge } from "./WarrantBadge";

export function WarrantRow({
  warrant,
  showCitizen = true,
  canServe = false,
}: {
  warrant: Warrant;
  showCitizen?: boolean;
  canServe?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [serving, setServing] = useState(false);
  const updateWarrant = usePlayerStore((s) => s.updateWarrant);
  const notify = useUIStore((s) => s.pushNotification);

  const rail =
    warrant.status === "active"
      ? "bg-warning"
      : warrant.status === "served"
        ? "bg-success"
        : warrant.status === "revoked"
          ? "bg-destructive"
          : "bg-muted-foreground";

  async function handleServe() {
    setServing(true);
    try {
      await fetchNui("serveWarrant", { id: warrant.id });
      updateWarrant(warrant.id, { status: "served" });
      notify({
        title: "Warrant served",
        body: `${warrant.citizenName} — ${warrant.charges}`,
        kind: "success",
      });
    } catch (err) {
      console.error("[NUI] serveWarrant failed", err);
      notify({ title: "Failed to update warrant", kind: "error" });
    } finally {
      setServing(false);
    }
  }

  return (
    <li className="border-b border-border/60 last:border-b-0">
      <div className="flex w-full items-center gap-4 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-4 text-left transition-colors hover:opacity-90"
        >
          <span className={`size-2 shrink-0 rounded-full ${rail} shadow-[0_0_10px_currentColor]`} />
          <div className="min-w-0 flex-1">
            {showCitizen && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{warrant.citizenName}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {warrant.citizenId}
                </span>
              </div>
            )}
            {!showCitizen && <div className="font-medium">{warrant.charges}</div>}
            {showCitizen && (
              <div className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{warrant.charges}</div>
            )}
            <div className="mt-1 text-[11px] text-muted-foreground">
              Issued {fmtRelative(warrant.issuedAt)} · {warrant.issuedBy}
            </div>
          </div>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <WarrantTypeBadge type={warrant.type} />
          <WarrantStatusBadge status={warrant.status} />
          {canServe && warrant.status === "active" && (
            <NeonButton size="sm" variant="success" loading={serving} onClick={() => void handleServe()}>
              Mark Served
            </NeonButton>
          )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 px-12 pb-5 text-sm text-muted-foreground">
              {warrant.expiresAt && (
                <p>
                  <span className="text-foreground/80">Expires:</span> {fmtDate(warrant.expiresAt)}
                </p>
              )}
              {warrant.notes && <p>{warrant.notes}</p>}
              {!warrant.notes && !warrant.expiresAt && <p>No additional notes on file.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
