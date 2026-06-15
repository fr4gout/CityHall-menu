import type { DMVRecord, DMVStanding } from "@/types";

export function standingFromPoints(points: number): DMVStanding {
  if (points >= 12) return "suspended";
  if (points >= 7) return "risk";
  if (points >= 4) return "warning";
  return "clean";
}

export function standingColor(standing: DMVStanding): string {
  switch (standing) {
    case "clean":
      return "var(--c-green)";
    case "warning":
      return "var(--c-orange)";
    case "risk":
      return "var(--c-purple)";
    case "suspended":
      return "var(--c-red)";
    default: {
      const _exhaustive: never = standing;
      return _exhaustive;
    }
  }
}

export function standingLabel(standing: DMVStanding): string {
  switch (standing) {
    case "clean":
      return "Clean Driver";
    case "warning":
      return "Warning";
    case "risk":
      return "At Risk";
    case "suspended":
      return "Suspended";
    default: {
      const _exhaustive: never = standing;
      return _exhaustive;
    }
  }
}

export function initialDmvRecord(): DMVRecord {
  return {
    points: 3,
    standing: "clean",
    expiryDays: 1161,
    expiryDate: "2029-08-19",
    violations: [
      {
        id: "v-1",
        name: "Speeding",
        points: 2,
        date: "2026-04-12",
        location: "MIRROR PARK BLVD",
      },
      {
        id: "v-2",
        name: "Harsh Braking",
        points: 1,
        date: "2026-05-02",
        location: "VINEWOOD HILLS",
      },
    ],
  };
}

export function recalcPoints(violations: DMVRecord["violations"]): number {
  return violations.reduce((sum, v) => sum + v.points, 0);
}

export const SEGMENT_THRESHOLDS = [
  { label: "CLEAN", max: 3, color: "var(--c-green)" },
  { label: "WARNING", max: 6, color: "var(--c-orange)" },
  { label: "RISK", max: 11, color: "var(--c-purple)" },
  { label: "SUSPENDED", max: 12, color: "var(--c-red)" },
] as const;
