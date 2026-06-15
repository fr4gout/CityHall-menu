import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { JobCard } from "@/components/cards/JobCard";
import { ApplyDialog } from "@/components/modals/ApplyDialog";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { JobInfo } from "@/types";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Jobs — City Hall" }] }),
  component: JobsPage,
});

function JobsPage() {
  const jobs = usePlayerStore((s) => s.jobs);
  const [target, setTarget] = useState<JobInfo | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Open Positions</h2>
          <p className="text-xs text-muted-foreground">
            City-approved employers currently hiring citizens of Los Santos.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((j) => (
          <JobCard key={j.id} job={j} onApply={setTarget} />
        ))}
      </div>

      <ApplyDialog
        open={!!target}
        onClose={() => setTarget(null)}
        target={target ? { kind: "job", job: target } : null}
      />
    </div>
  );
}
