import { create } from "zustand";
import { initialDmvRecord, recalcPoints, standingFromPoints } from "@/lib/dmv";
import { mockJobs } from "@/nui/mockData";
import type { Application, DMVRecord, JobInfo, License, Player, Violation, Warrant } from "@/types";

interface PlayerState {
  player: Player | null;
  licenses: License[];
  jobs: JobInfo[];
  applications: Application[];
  warrants: Warrant[];
  dmvRecord: DMVRecord;
  hydrate: (p: {
    player: Player;
    licenses: License[];
    applications: Application[];
    warrants?: Warrant[];
  }) => void;
  setLicenses: (l: License[]) => void;
  setApplications: (a: Application[]) => void;
  setWarrants: (w: Warrant[]) => void;
  addApplication: (a: Application) => void;
  addWarrant: (w: Warrant) => void;
  updateWarrant: (id: string, patch: Partial<Warrant>) => void;
  addViolation: (v: Omit<Violation, "id">) => void;
  expungeViolation: (id: string) => void;
  clearRecord: () => void;
  renewLicense: () => void;
  setDrivingLicenseActive: () => void;
}

function withStanding(record: DMVRecord, violations: Violation[]): DMVRecord {
  const points = recalcPoints(violations);
  return { ...record, violations, points, standing: standingFromPoints(points) };
}

export const usePlayerStore = create<PlayerState>((set) => ({
  player: null,
  licenses: [],
  jobs: mockJobs,
  applications: [],
  warrants: [],
  dmvRecord: initialDmvRecord(),
  hydrate: ({ player, licenses, applications, warrants }) =>
    set({ player, licenses, applications, warrants: warrants ?? [] }),
  setLicenses: (licenses) => set({ licenses }),
  setApplications: (applications) => set({ applications }),
  setWarrants: (warrants) => set({ warrants }),
  addApplication: (a) => set((s) => ({ applications: [a, ...s.applications] })),
  addWarrant: (w) => set((s) => ({ warrants: [w, ...s.warrants] })),
  updateWarrant: (id, patch) =>
    set((s) => ({
      warrants: s.warrants.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    })),
  addViolation: (v) =>
    set((s) => {
      const violation: Violation = { ...v, id: `v-${Date.now()}` };
      return { dmvRecord: withStanding(s.dmvRecord, [violation, ...s.dmvRecord.violations]) };
    }),
  expungeViolation: (id) =>
    set((s) => ({
      dmvRecord: withStanding(
        s.dmvRecord,
        s.dmvRecord.violations.filter((v) => v.id !== id),
      ),
    })),
  clearRecord: () =>
    set((s) => ({
      dmvRecord: { ...s.dmvRecord, points: 0, standing: "clean", violations: [] },
    })),
  renewLicense: () => {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 5);
    set((s) => ({
      dmvRecord: {
        ...s.dmvRecord,
        expiryDays: 1161,
        expiryDate: expiry.toISOString().slice(0, 10),
      },
    }));
  },
  setDrivingLicenseActive: () =>
    set((s) => ({
      licenses: s.licenses.map((l) =>
        l.type === "driving" ? { ...l, status: "active" as const } : l,
      ),
    })),
}));
