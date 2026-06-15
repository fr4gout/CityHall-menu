import { createFileRoute } from "@tanstack/react-router";
import { IssueWarrantDialog } from "@/components/modals/IssueWarrantDialog";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Tabs } from "@/components/ui/AppTabs";
import { WarrantRow } from "@/components/warrants/WarrantRow";
import {
  activeWarrantsForCitizen,
  canManageWarrants,
} from "@/lib/warrants";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Search, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/warrants")({
  head: () => ({ meta: [{ title: "Warrants — City Hall" }] }),
  component: WarrantsPage,
});

type OfficerFilter = "active" | "all";

function WarrantsPage() {
  const player = usePlayerStore((s) => s.player);
  const warrants = usePlayerStore((s) => s.warrants);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OfficerFilter>("active");
  const [issueOpen, setIssueOpen] = useState(false);

  const isOfficer = player ? canManageWarrants(player.job.id) : false;

  const citizenActive = useMemo(
    () => (player ? activeWarrantsForCitizen(warrants, player.citizenId) : []),
    [warrants, player],
  );

  const officerVisible = useMemo(() => {
    let list = filter === "active" ? warrants.filter((w) => w.status === "active") : warrants;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (w) =>
          w.citizenId.toLowerCase().includes(q) ||
          w.citizenName.toLowerCase().includes(q) ||
          w.charges.toLowerCase().includes(q),
      );
    }
    return list;
  }, [warrants, filter, search]);

  if (!player) {
    return <div className="text-muted-foreground">Loading…</div>;
  }

  if (!isOfficer) {
    return (
      <div className="space-y-5">
        <GlassCard className="flex items-start gap-3">
          <ShieldAlert className="size-5 shrink-0 text-primary" />
          <div>
            <h3 className="font-display text-base font-semibold">Your Judicial Record</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Active warrants issued against your citizen ID are listed below. Contact City Hall if you believe this is an error.
            </p>
          </div>
        </GlassCard>

        {citizenActive.length === 0 ? (
          <GlassCard className="py-10 text-center">
            <div className="font-display text-lg font-semibold text-success">No active warrants</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your record is clear at this time.
            </p>
          </GlassCard>
        ) : (
          <GlassCard className="p-0">
            <div className="border-b border-border/60 px-5 py-3 text-[10px] uppercase tracking-wider text-destructive">
              {citizenActive.length} active warrant{citizenActive.length !== 1 ? "s" : ""} on file
            </div>
            <ol>
              {citizenActive.map((w) => (
                <WarrantRow key={w.id} warrant={w} showCitizen={false} />
              ))}
            </ol>
          </GlassCard>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs<OfficerFilter>
          value={filter}
          onChange={setFilter}
          items={[
            {
              value: "active",
              label: "Active",
              count: warrants.filter((w) => w.status === "active").length,
            },
            { value: "all", label: "All", count: warrants.length },
          ]}
        />
        <NeonButton icon={<ShieldAlert className="size-4" />} onClick={() => setIssueOpen(true)}>
          Issue Warrant
        </NeonButton>
      </div>

      <div className="flex w-full max-w-md items-center gap-2 border border-border bg-background/40 px-3 py-2 text-sm control-radius">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search citizen ID, name, or charges…"
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <GlassCard className="p-0">
        <ol>
          {officerVisible.map((w) => (
            <WarrantRow key={w.id} warrant={w} canServe />
          ))}
          {officerVisible.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              No warrants match your search.
            </li>
          )}
        </ol>
      </GlassCard>

      <IssueWarrantDialog open={issueOpen} onClose={() => setIssueOpen(false)} />
    </div>
  );
}
