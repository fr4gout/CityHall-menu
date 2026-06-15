import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/AppTabs";
import { usePlayerStore } from "@/store/usePlayerStore";
import { fmtRelative } from "@/utils/format";
import type { ApplicationKind } from "@/types";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/applications")({
  head: () => ({ meta: [{ title: "Applications — City Hall" }] }),
  component: ApplicationsPage,
});

type Filter = "all" | ApplicationKind;

function ApplicationsPage() {
  const apps = usePlayerStore((s) => s.applications);
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? apps : apps.filter((a) => a.kind === filter)),
    [apps, filter],
  );

  return (
    <div className="space-y-5">
      <Tabs<Filter>
        value={filter}
        onChange={setFilter}
        items={[
          { value: "all", label: "All", count: apps.length },
          { value: "id", label: "ID", count: apps.filter((a) => a.kind === "id").length },
          { value: "license", label: "Licenses", count: apps.filter((a) => a.kind === "license").length },
          { value: "job", label: "Jobs", count: apps.filter((a) => a.kind === "job").length },
        ]}
      />

      <GlassCard className="p-0">
        <ol className="relative">
          {visible.map((a, i) => {
            const isOpen = open === a.id;
            const rail =
              a.status === "approved"
                ? "bg-success"
                : a.status === "rejected"
                ? "bg-destructive"
                : "bg-warning";
            return (
              <li key={a.id} className={i === visible.length - 1 ? "" : "border-b border-border/60"}>
                <button
                  onClick={() => setOpen(isOpen ? null : a.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/40"
                >
                  <span className={`size-2 shrink-0 rounded-full ${rail} shadow-[0_0_10px_currentColor]`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{a.label}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {a.kind}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Submitted {fmtRelative(a.createdAt)}
                    </div>
                  </div>
                  <StatusBadge status={a.status} className="shrink-0" />
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-12 pb-5 text-sm text-muted-foreground">
                        {a.notes ?? "No additional notes from the reviewing department."}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              No applications in this category.
            </li>
          )}
        </ol>
      </GlassCard>
    </div>
  );
}
