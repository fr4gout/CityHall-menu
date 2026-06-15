import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LicenseCard } from "@/components/cards/LicenseCard";
import { ApplyDialog } from "@/components/modals/ApplyDialog";
import { Tabs } from "@/components/ui/AppTabs";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { License } from "@/types";

export const Route = createFileRoute("/licenses")({
  head: () => ({ meta: [{ title: "Licenses — City Hall" }] }),
  component: LicensesPage,
});

type Filter = "all" | "active" | "pending" | "expired" | "none";

function LicensesPage() {
  const licenses = usePlayerStore((s) => s.licenses);
  const [filter, setFilter] = useState<Filter>("all");
  const [target, setTarget] = useState<License | null>(null);

  const counts = useMemo(() => ({
    all: licenses.length,
    active: licenses.filter((l) => l.status === "active").length,
    pending: licenses.filter((l) => l.status === "pending").length,
    expired: licenses.filter((l) => l.status === "expired").length,
    none: licenses.filter((l) => l.status === "none").length,
  }), [licenses]);

  const visible = useMemo(
    () => (filter === "all" ? licenses : licenses.filter((l) => l.status === filter)),
    [licenses, filter],
  );

  return (
    <div className="space-y-5">
      <Tabs<Filter>
        value={filter}
        onChange={setFilter}
        items={[
          { value: "all", label: "All", count: counts.all },
          { value: "active", label: "Active", count: counts.active },
          { value: "pending", label: "Pending", count: counts.pending },
          { value: "expired", label: "Expired", count: counts.expired },
          { value: "none", label: "Available", count: counts.none },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((l) => (
          <LicenseCard key={l.id} license={l} onApply={setTarget} />
        ))}
        {visible.length === 0 && (
          <div className="col-span-full border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nothing in this category.
          </div>
        )}
      </div>

      <ApplyDialog
        open={!!target}
        onClose={() => setTarget(null)}
        target={target ? { kind: "license", license: target } : null}
      />
    </div>
  );
}
