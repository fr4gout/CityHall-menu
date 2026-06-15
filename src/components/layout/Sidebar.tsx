import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  IdCard,
  FileBadge,
  Briefcase,
  ClipboardList,
  Landmark,
  ShieldAlert,
  Car,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { closeMenu } from "@/nui/events";

type NavItem = {
  to: "/" | "/id-card" | "/licenses" | "/jobs" | "/applications" | "/government-info" | "/warrants" | "/dmv";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const items: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/id-card", label: "ID Card", icon: IdCard },
  { to: "/licenses", label: "Licenses", icon: FileBadge },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: ClipboardList },
  { to: "/government-info", label: "Government Info", icon: Landmark },
  { to: "/warrants", label: "Warrants", icon: ShieldAlert },
  { to: "/dmv", label: "DMV Terminal", icon: Car },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="relative z-10 flex h-full min-h-0 flex-col border-r border-[var(--bd)]">
      <div className="border-b border-[var(--bd)] px-4 py-4">
        <div className="flex items-center gap-2.5">
          <img
            src="/branding/los-santos-seal.png"
            alt=""
            className="size-9 shrink-0 object-contain mix-blend-screen opacity-90"
          />
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-[0.22em] text-[var(--tx)]">
              CITY HALL
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--tx-2)]">
              Civic Terminal
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "relative flex items-center gap-3 control-radius border px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border-[var(--bd-primary)] bg-[var(--primary-08)] text-[var(--tx)]"
                  : "border-transparent text-[var(--tx-2)] hover:border-[var(--bd)] hover:bg-[var(--bg-row)] hover:text-[var(--tx)]",
              )}
            >
              <Icon className={cn("size-4 shrink-0", active && "text-[var(--primary)]")} />
              <span className="font-medium">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--bd)] p-2">
        <button
          type="button"
          onClick={() => void closeMenu()}
          className="flex w-full items-center gap-3 control-radius border border-transparent px-3 py-2.5 text-sm text-[var(--tx-2)] transition-colors hover:border-[var(--c-red)]/30 hover:bg-[var(--c-red)]/10 hover:text-[var(--c-red)]"
        >
          <LogOut className="size-4" />
          Exit
        </button>
      </div>
    </aside>
  );
}
