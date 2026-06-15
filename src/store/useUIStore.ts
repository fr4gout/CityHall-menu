import { create } from "zustand";
import type { NotificationItem } from "@/types";

export interface ModalState {
  id: string;
  payload?: unknown;
}

export interface SettingsState {
  uiScale: number; // 0.85 - 1.15
  soundEnabled: boolean;
  accentIntensity: number; // 0 - 1.5
}

interface UIState {
  isOpen: boolean;
  rightPanelOpen: boolean;
  modal: ModalState | null;
  notifications: NotificationItem[];
  settings: SettingsState;
  setOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  pushNotification: (n: Omit<NotificationItem, "id" | "createdAt"> & Partial<Pick<NotificationItem, "id" | "createdAt">>) => void;
  dismissNotification: (id: string) => void;
  updateSettings: (s: Partial<SettingsState>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isOpen: false,
  rightPanelOpen: false,
  modal: null,
  notifications: [
    {
      id: "n1",
      title: "Welcome to City Hall",
      body: "Your digital civic terminal is online.",
      kind: "info",
      createdAt: new Date().toISOString(),
    },
  ],
  settings: { uiScale: 1, soundEnabled: true, accentIntensity: 0.55 },
  setOpen: (isOpen) => set({ isOpen }),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  pushNotification: (n) =>
    set((s) => ({
      notifications: [
        {
          id: n.id ?? `n-${Date.now()}`,
          createdAt: n.createdAt ?? new Date().toISOString(),
          title: n.title,
          body: n.body,
          kind: n.kind,
        },
        ...s.notifications,
      ].slice(0, 20),
    })),
  dismissNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  updateSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
}));
