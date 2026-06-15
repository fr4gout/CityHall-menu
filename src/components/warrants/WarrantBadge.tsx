import { cn } from "@/lib/utils";
import {
  warrantStatusLabel,
  warrantStatusTone,
  warrantTypeLabel,
  warrantTypeTone,
} from "@/lib/warrants";
import type { WarrantStatus, WarrantType } from "@/types";

export function WarrantTypeBadge({
  type,
  className,
}: {
  type: WarrantType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] leading-none whitespace-nowrap",
        warrantTypeTone(type),
        className,
      )}
    >
      {warrantTypeLabel(type)}
    </span>
  );
}

export function WarrantStatusBadge({
  status,
  className,
}: {
  status: WarrantStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] leading-none whitespace-nowrap",
        warrantStatusTone(status),
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current opacity-80" />
      {warrantStatusLabel(status)}
    </span>
  );
}
