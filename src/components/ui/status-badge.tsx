import { cn } from "@/lib/utils";
import type { Status, ApplicationStatus } from "@/types";

const map: Record<string, { label: string; cls: string; dot: string }> = {
  active: { label: "Active", cls: "bg-success/10 text-success border-success/30", dot: "bg-success" },
  approved: { label: "Approved", cls: "bg-success/10 text-success border-success/30", dot: "bg-success" },
  pending: { label: "Pending", cls: "bg-warning/10 text-warning border-warning/30", dot: "bg-warning" },
  expired: { label: "Expired", cls: "bg-destructive/10 text-destructive border-destructive/30", dot: "bg-destructive" },
  rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive border-destructive/30", dot: "bg-destructive" },
  none: { label: "Not issued", cls: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: Status | ApplicationStatus;
  className?: string;
}) {
  const m = map[status] ?? map.none;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] leading-none whitespace-nowrap",
        m.cls,
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}
