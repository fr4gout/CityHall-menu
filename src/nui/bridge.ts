import type { Warrant } from "@/types";
import { mockApplications, mockLicenses, mockPlayer, mockWarrants } from "./mockData";

declare global {
  // eslint-disable-next-line no-var
  var GetParentResourceName: (() => string) | undefined;
}

export const isFiveM = (): boolean =>
  typeof window !== "undefined" && typeof window.GetParentResourceName === "function";

const resourceName = (): string => {
  if (isFiveM()) return window.GetParentResourceName!();
  return "city-hall";
};

const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms));

export async function fetchNui<TReq = unknown, TRes = unknown>(
  action: string,
  data?: TReq,
): Promise<TRes> {
  if (!isFiveM()) {
    await delay();
    return mockResponse<TRes>(action, data);
  }
  const res = await fetch(`https://${resourceName()}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data ?? {}),
  });
  return (await res.json()) as TRes;
}

function mockResponse<TRes>(action: string, data?: unknown): TRes {
  switch (action) {
    case "fetchPlayerData":
      return {
        player: mockPlayer,
        licenses: mockLicenses,
        applications: mockApplications,
        warrants: mockWarrants,
      } as TRes;
    case "issueWarrant": {
      const payload = data as Omit<Warrant, "id" | "issuedAt" | "status">;
      const warrant: Warrant = {
        ...payload,
        id: `w-${Date.now()}`,
        status: "active",
        issuedAt: new Date().toISOString(),
      };
      return { ok: true, warrant } as TRes;
    }
    case "serveWarrant":
      return { ok: true } as TRes;
    case "applyID":
    case "applyLicense":
    case "applyJob":
    case "payFee":
      return { ok: true, data } as TRes;
    case "closeMenu":
      return { ok: true } as TRes;
    default:
      return { ok: true } as TRes;
  }
}
