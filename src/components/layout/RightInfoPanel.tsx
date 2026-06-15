import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useUIStore } from "@/store/useUIStore";
import { activeWarrantsForCitizen } from "@/lib/warrants";
import { fmtMoney, fmtRelative, initials } from "@/utils/format";
import { Banknote, Briefcase, ChevronsLeft, ChevronsRight, ShieldAlert, ShieldCheck, Wallet } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

function Widget({
  icon,
  label,
  children,
  className,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "control-radius border border-[var(--bd)] bg-[var(--bg-surface)] p-3",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--tx-2)]">
        {icon}
        {label}
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function RightInfoPanel() {
  const player = usePlayerStore((s) => s.player);
  const licenses = usePlayerStore((s) => s.licenses);
  const warrants = usePlayerStore((s) => s.warrants);
  const notifications = useUIStore((s) => s.notifications);
  const open = useUIStore((s) => s.rightPanelOpen);
  const toggle = useUIStore((s) => s.toggleRightPanel);

  const activeWarrants = player ? activeWarrantsForCitizen(warrants, player.citizenId) : [];

  return (
    <aside
      className={cn(
        "relative z-10 flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-l border-[var(--bd)]",
        !open && "border-l-transparent",
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Collapse panel" : "Expand panel"}
        className="absolute -left-3 top-1/2 z-20 grid size-6 -translate-y-1/2 place-items-center control-radius border border-[var(--bd)] bg-[var(--bg-surface)] text-[var(--tx-2)] shadow-lg transition-colors hover:text-[var(--primary)]"
      >
        {open ? <ChevronsRight className="size-3.5" /> : <ChevronsLeft className="size-3.5" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="right-panel-content"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="scrollbar-thin flex min-h-0 w-[300px] flex-col gap-3 overflow-y-auto p-4"
          >
            {!player ? (
              <>
                <div className="h-24 animate-pulse control-radius bg-row" />
                <div className="h-32 animate-pulse control-radius bg-row-alt" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 control-radius border border-[var(--bd)] bg-[var(--bg-surface)] p-3">
                  <div className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-[var(--primary-30)] to-[var(--primary-08)] ring-1 ring-[var(--bd-primary)] font-display text-base text-[var(--tx)]">
                    {initials(player.firstName, player.lastName)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-[var(--tx)]">
                      {player.firstName} {player.lastName}
                    </div>
                    <div className="truncate text-[11px] uppercase tracking-wider text-[var(--tx-2)]">
                      {player.citizenId}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Widget icon={<Wallet className="size-3" />} label="Cash">
                    <div className="font-display text-sm font-semibold text-[var(--tx)]">
                      {fmtMoney(player.cash)}
                    </div>
                  </Widget>
                  <Widget icon={<Banknote className="size-3" />} label="Bank">
                    <div className="font-display text-sm font-semibold text-[var(--tx)]">
                      {fmtMoney(player.bank)}
                    </div>
                  </Widget>
                </div>

                <Widget icon={<Briefcase className="size-3" />} label="Active Job">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--tx)]">{player.job.name}</span>
                    <span className="text-[11px] text-[var(--tx-2)]">{player.job.grade}</span>
                  </div>
                </Widget>

                <Widget icon={<ShieldCheck className="size-3" />} label="Licenses">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between control-radius bg-row px-2 py-1 text-xs">
                      <span className="text-[var(--tx-2)]">Active</span>
                      <span className="font-semibold text-[var(--c-green)]">
                        {licenses.filter((l) => l.status === "active").length}
                      </span>
                    </div>
                    {licenses.slice(0, 3).map((l, i) => (
                      <div
                        key={l.id}
                        className={cn(
                          "flex items-center justify-between control-radius px-2 py-1 text-xs",
                          i % 2 === 0 ? "bg-row" : "bg-row-alt",
                        )}
                      >
                        <span className="text-[var(--tx-2)]">{l.name}</span>
                        <StatusBadge status={l.status} />
                      </div>
                    ))}
                  </div>
                </Widget>

                {activeWarrants.length > 0 && (
                  <Widget icon={<ShieldAlert className="size-3" />} label="Active Warrants">
                    <div className="text-xs font-medium text-[var(--c-red)]">
                      {activeWarrants.length} active warrant{activeWarrants.length !== 1 ? "s" : ""}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] text-[var(--tx-2)]">
                      {activeWarrants[0]?.charges}
                    </p>
                    <Link to="/warrants" className="mt-2 block text-xs text-[var(--primary)] hover:underline">
                      View details
                    </Link>
                  </Widget>
                )}

                <Widget label="Notifications">
                  <ul className="space-y-2">
                    {notifications.slice(0, 3).map((n, i) => (
                      <li
                        key={n.id}
                        className={cn(
                          "control-radius border border-[var(--bd)] p-2.5",
                          i % 2 === 0 ? "bg-row" : "bg-row-alt",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-[var(--tx)]">{n.title}</span>
                          <span className="text-[10px] text-[var(--tx-3)]">
                            {fmtRelative(n.createdAt)}
                          </span>
                        </div>
                        {n.body && (
                          <p className="mt-0.5 text-[11px] text-[var(--tx-2)]">{n.body}</p>
                        )}
                      </li>
                    ))}
                    {notifications.length === 0 && (
                      <li className="text-xs text-[var(--tx-2)]">No notifications.</li>
                    )}
                  </ul>
                </Widget>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
