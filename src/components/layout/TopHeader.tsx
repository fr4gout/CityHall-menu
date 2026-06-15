import { useRouterState } from "@tanstack/react-router";
import { Bell, ChevronsLeft, Search, X } from "lucide-react";
import { closeMenu } from "@/nui/events";
import { useUIStore } from "@/store/useUIStore";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Welcome to the civic terminal" },
  "/id-card": { title: "Identification", subtitle: "Manage your government-issued ID" },
  "/licenses": { title: "Licenses", subtitle: "Apply for and renew licenses" },
  "/jobs": { title: "Job Center", subtitle: "Find work across Los Santos" },
  "/applications": { title: "My Applications", subtitle: "Track all your civic requests" },
  "/government-info": { title: "Government Info", subtitle: "Rules, fees, and announcements" },
  "/warrants": { title: "Warrants", subtitle: "Judicial registry & citizen record" },
  "/dmv": { title: "DMV Terminal", subtitle: "Driver certification & license record" },
};

export function TopHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const meta = titles[pathname] ?? { title: "City Hall", subtitle: "" };
  const notifCount = useUIStore((s) => s.notifications.length);
  const rightPanelOpen = useUIStore((s) => s.rightPanelOpen);
  const toggleRightPanel = useUIStore((s) => s.toggleRightPanel);
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border/60 px-6">
      <div className="min-w-0">
        <h1 className="truncate font-display text-xl font-semibold tracking-tight text-glow">
          {meta.title}
        </h1>
        <p className="truncate text-xs text-muted-foreground">{meta.subtitle}</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex w-64 items-center gap-2 border border-border bg-background/40 px-3 py-2 text-sm control-radius">
          <Search className="size-4 text-muted-foreground" />
          <input
            className="bg-transparent outline-none placeholder:text-muted-foreground/60 flex-1"
            placeholder="Search services…"
          />
        </div>
        {!rightPanelOpen && (
          <button
            type="button"
            onClick={toggleRightPanel}
            aria-label="Expand info panel"
            className="grid size-9 place-items-center border border-border bg-background/40 text-muted-foreground control-radius hover:text-primary transition-colors"
          >
            <ChevronsLeft className="size-4" />
          </button>
        )}
        <button
          type="button"
          className="relative grid size-9 place-items-center border border-border bg-background/40 text-muted-foreground control-radius hover:text-foreground transition-colors"
        >
          <Bell className="size-4" />
          {notifCount > 0 && (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          )}
        </button>
        <button
          type="button"
          onClick={() => void closeMenu()}
          aria-label="Close menu"
          className="grid size-9 place-items-center border border-destructive/30 bg-destructive/5 text-destructive control-radius hover:bg-destructive/15 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
    </header>
  );
}
