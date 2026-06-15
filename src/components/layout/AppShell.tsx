import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useUIStore } from "@/store/useUIStore";
import { mountNuiListener } from "@/nui/events";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { RightInfoPanel } from "./RightInfoPanel";

export function AppShell({ children }: { children: ReactNode }) {
  const isOpen = useUIStore((s) => s.isOpen);
  const rightPanelOpen = useUIStore((s) => s.rightPanelOpen);
  const uiScale = useUIStore((s) => s.settings.uiScale);
  const accent = useUIStore((s) => s.settings.accentIntensity);

  useEffect(() => {
    mountNuiListener();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-intensity", String(accent));
  }, [accent]);

  const gridStyle = {
    "--right-col": rightPanelOpen ? "300px" : "0px",
    transform: `scale(${uiScale})`,
  } as CSSProperties;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="shell-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 grid place-items-center p-4"
          style={{ background: "rgba(6, 8, 16, 0.4)" }}
        >
          <div className="relative">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-16 size-72 rounded-full opacity-60 blur-[80px]"
              style={{ background: "radial-gradient(circle, rgba(107,191,255,0.35) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -right-16 size-64 rounded-full opacity-50 blur-[80px]"
              style={{ background: "radial-gradient(circle, rgba(192,132,252,0.3) 0%, transparent 70%)" }}
              animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.4, 0.65, 0.4] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              style={gridStyle}
              className="panel relative grid h-[min(820px,92vh)] w-[min(1400px,96vw)] grid-cols-[240px_1fr_var(--right-col,300px)] overflow-hidden control-radius shadow-2xl glow-primary transition-[grid-template-columns] duration-300"
            >
              <img
                src="/branding/los-santos-seal.png"
                alt=""
                aria-hidden
                className="seal-watermark pointer-events-none absolute z-0 select-none object-contain"
              />
              <Sidebar />
              <main className="relative z-10 flex min-h-0 min-w-0 flex-col border-x border-[var(--bd)]">
                <TopHeader />
                <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
              </main>
              <RightInfoPanel />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
