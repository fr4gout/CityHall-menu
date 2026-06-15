import { usePlayerStore } from "@/store/usePlayerStore";
import { useUIStore } from "@/store/useUIStore";
import type { NUIMessage } from "@/types";
import { fetchNui, isFiveM } from "./bridge";

let mounted = false;

export function mountNuiListener() {
  if (mounted || typeof window === "undefined") return;
  mounted = true;

  window.addEventListener("message", (event: MessageEvent<NUIMessage>) => {
    const msg = event.data;
    if (!msg || typeof msg !== "object" || !("action" in msg)) return;
    switch (msg.action) {
      case "openMenu":
        useUIStore.getState().setOpen(true);
        break;
      case "closeMenu":
        useUIStore.getState().setOpen(false);
        break;
      case "setPlayerData":
        usePlayerStore.getState().hydrate(msg.data as never);
        break;
      case "setLicenses":
        usePlayerStore.getState().setLicenses(msg.data as never);
        break;
      case "setApplications":
        usePlayerStore.getState().setApplications(msg.data as never);
        break;
      case "setWarrants":
        usePlayerStore.getState().setWarrants(msg.data as never);
        break;
      case "notify":
        useUIStore.getState().pushNotification(msg.data as never);
        break;
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const ui = useUIStore.getState();
      if (ui.modal) ui.closeModal();
      else void closeMenu();
    }
  });

  // Initial hydration: ask the resource for player data. In browser mode this resolves with mocks.
  void (async () => {
    try {
      const res = await fetchNui<
        unknown,
        { player: unknown; licenses: unknown; applications: unknown; warrants?: unknown }
      >("fetchPlayerData");
      if (res?.player) {
        usePlayerStore.getState().hydrate({
          player: res.player as never,
          licenses: res.licenses as never,
          applications: res.applications as never,
          warrants: res.warrants as never,
        });
      }
      if (!isFiveM()) {
        useUIStore.getState().setOpen(true);
      }
    } catch (err) {
      console.error("[NUI] fetchPlayerData failed", err);
    }
  })();
}

export async function closeMenu() {
  useUIStore.getState().setOpen(false);
  try {
    await fetchNui("closeMenu");
  } catch (err) {
    console.error("[NUI] closeMenu failed", err);
  }
}
