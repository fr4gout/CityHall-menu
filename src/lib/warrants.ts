import type { Warrant, WarrantStatus, WarrantType } from "@/types";

export const WARRANT_OFFICER_JOBS = ["police", "gov"] as const;

export function canManageWarrants(jobId: string): boolean {
  return (WARRANT_OFFICER_JOBS as readonly string[]).includes(jobId);
}

export function activeWarrantsForCitizen(warrants: Warrant[], citizenId: string): Warrant[] {
  return warrants.filter((w) => w.citizenId === citizenId && w.status === "active");
}

export function warrantTypeLabel(type: WarrantType): string {
  switch (type) {
    case "arrest":
      return "Arrest";
    case "search":
      return "Search";
    case "bench":
      return "Bench";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function warrantStatusLabel(status: WarrantStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "served":
      return "Served";
    case "expired":
      return "Expired";
    case "revoked":
      return "Revoked";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function warrantTypeTone(type: WarrantType): string {
  switch (type) {
    case "arrest":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "search":
      return "bg-warning/10 text-warning border-warning/30";
    case "bench":
      return "bg-primary/10 text-primary border-primary/30";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function warrantStatusTone(status: WarrantStatus): string {
  switch (status) {
    case "active":
      return "bg-warning/10 text-warning border-warning/30";
    case "served":
      return "bg-success/10 text-success border-success/30";
    case "expired":
      return "bg-muted text-muted-foreground border-border";
    case "revoked":
      return "bg-destructive/10 text-destructive border-destructive/30";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
